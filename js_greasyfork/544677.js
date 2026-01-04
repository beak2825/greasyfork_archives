// ==UserScript==
// @name         自动点击宝武oa首页消息
// @namespace    http://tampermonkey.net/
// @version      0.62
// @description  全状态机持久化，支持 UI 开始/暂停控制，抗页面刷新容错增强，优化闭合逻辑
// @author       ludyw21
// @match        https://oa.baowugroup.cn/wui/index.html*
// @match        https://*.baowugroup.cn/spa/workflow/static4form/index.html*
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_addStyle
// @grant        window.close
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544677/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%AE%9D%E6%AD%A6oa%E9%A6%96%E9%A1%B5%E6%B6%88%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/544677/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%AE%9D%E6%AD%A6oa%E9%A6%96%E9%A1%B5%E6%B6%88%E6%81%AF.meta.js
// ==/UserScript==

// --- 样式注入 ---
GM_addStyle(`
    #oa-control-btn {
        margin: 0 10px;
        padding: 5px 15px;
        border-radius: 20px;
        border: none;
        color: white;
        font-size: 13px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        display: inline-flex;
        align-items: center;
        gap: 6px;
        z-index: 9999;
        outline: none;
        user-select: none;
    }
    #oa-control-btn.running {
        background: linear-gradient(135deg, #10b981, #059669); /* 翠绿色渐变 */
        animation: oa-pulse 2s infinite;
    }
    #oa-control-btn.stopped {
        background: linear-gradient(135deg, #f43f5e, #e11d48); /* 亮红色渐变 */
    }
    #oa-control-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    }
    #oa-control-btn:active {
        transform: scale(0.95);
    }
    @keyframes oa-pulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5); }
        70% { transform: scale(1); box-shadow: 0 0 0 12px rgba(16, 185, 129, 0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
`);

(function () {
  'use strict';

  // --- 配置中心 ---
  const CONFIG = {
    HOME_DOMAIN: 'oa.baowugroup.cn',
    MAX_COUNT: 6, // 每批次处理数量
    HOME_WAIT: 5000, 
    TIMEOUT: 60000, // 延长至 60s 应对慢网/刷新
    SELF_DESTRUCT: 50000 
  };

  // --- 工具函数集 ---
  const State = {
    getOffset: () => GM_getValue('oa_abnormal_offset', 1),
    setOffset: (val) => GM_setValue('oa_abnormal_offset', val),
    getProgress: () => GM_getValue('oa_batch_progress', 0),
    setProgress: (val) => GM_setValue('oa_batch_progress', val),
    getLastClick: () => GM_getValue('oa_last_click_time', 0),
    setLastClick: (val) => GM_setValue('oa_last_click_time', val),
    isDone: () => GM_getValue('oa_task_done', false),
    setDone: (val) => GM_setValue('oa_task_done', val),
    isRunning: () => GM_getValue('oa_is_running', true),
    setRunning: (val) => GM_setValue('oa_is_running', val)
  };

  // --- UI 注入逻辑 ---
  function injectControlUI() {
    const header = document.querySelector('.bw-lc-heard');
    if (!header || document.getElementById('oa-control-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'oa-control-btn';
    
    const updateBtnStyle = () => {
      const running = State.isRunning();
      btn.innerHTML = running ? '<span>⏹</span> 停止助手' : '<span>▶</span> 开启助手';
      btn.className = running ? 'running' : 'stopped';
    };

    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const newState = !State.isRunning();
      State.setRunning(newState);
      
      if (newState) {
        // 手动开启时重置全部
        State.setOffset(1);
        State.setProgress(0);
        State.setLastClick(0);
        State.setDone(false);
        console.log('[OA助手] 手动启动：已重置状态');
      }
      
      updateBtnStyle();
      console.log(`[OA助手] 用户动作: ${newState ? '开启' : '停止'}`);
    };

    updateBtnStyle();
    
    const leftPart = header.querySelector('.bw-lc-heard-tabs');
    if (leftPart && leftPart.nextElementSibling) {
      header.insertBefore(btn, leftPart.nextElementSibling);
    } else {
      header.appendChild(btn);
    }
  }

  // --- 首页逻辑 ---
  function runHomePage() {
    console.log('[OA助手] 首页自愈逻辑就绪...');

    // 1. 刷新首页彻底归位
    if (GM_getValue('oa_start_index')) GM_deleteValue('oa_start_index');
    State.setOffset(1);
    State.setDone(false);
    State.setProgress(0);
    State.setLastClick(0);

    let localLock = false; 

    setTimeout(() => {
      setInterval(async () => {
        injectControlUI();

        if (!State.isRunning()) return;
        if (localLock) return;

        const offset = State.getOffset();
        const progress = State.getProgress();
        const lastClick = State.getLastClick();
        const done = State.isDone();
        const now = Date.now();

        // A. 优先处理反馈信号
        if (done === true) {
          console.log('[OA助手] 接收到完成反馈，同步进度，并等待 5s 列表刷新...');
          State.setLastClick(0); // 必须在 setDone 之前清除倒计时，防止时序误判
          State.setDone(false);
          State.setProgress(progress + 1);
          
          // 强制冷却 5 秒，防止列表未刷新导致重复点击
          localLock = true;
          setTimeout(() => { 
              localLock = false; 
              console.log('[OA助手] 5s 冷却结束，继续执行...');
          }, 5000);
          return;
        }

        // B. 批次完结跳转大循环
        const TOTAL_LIMIT = CONFIG.MAX_COUNT; 
        if (progress >= TOTAL_LIMIT) {
           if (lastClick !== -1) {
               console.log(`[OA助手] 本轮满 ${TOTAL_LIMIT} 条，2秒后开启新轮次大循环...`);
               State.setLastClick(-1);
               setTimeout(() => {
                   // 大循环：重置进度但不重置偏移量 (除非刷新或停止)
                   State.setProgress(0);
                   State.setLastClick(0);
                   console.log(`[OA助手] 大循环启动中 (当前偏移位: ${State.getOffset()})`);
               }, 2000);
           }
           return;
        }

        // C. 超时监控补救
        if (lastClick > 0 && (now - lastClick > CONFIG.TIMEOUT)) {
          console.warn(`[OA助手] 超时处理：第 ${offset} 位条目无响应，标记偏移跳过`);
          State.setLastClick(0); 
          State.setOffset(offset + 1);
          State.setProgress(progress + 1);
          return;
        }

        // D. 终止保护
        if (offset >= 7) {
          console.warn(`[OA助手] 严重：由于偏移量过大(${offset})，脚本挂起等待检查。`);
          State.setLastClick(-1);
          return;
        }

        // E. 自动化点击
        if (lastClick === 0) {
          const elements = document.getElementsByClassName('bw-lc-content-li-title');
          if (elements.length === 0) return;

          const target = elements[offset - 1];
          if (target) {
            console.log(`[OA助手] 执行操作 >>> 点击第 ${offset} 位条目 (进度 ${progress + 1}/${TOTAL_LIMIT})`);
            localLock = true;
            State.setLastClick(now);
            target.click();
            setTimeout(() => { localLock = false; }, 1000);
          } else {
            console.error(`[OA助手] 点击失败：坑位 ${offset} 为空，任务提前终止。`);
            State.setLastClick(-1); 
          }
        }
      }, 2000);
    }, CONFIG.HOME_WAIT);
  }

  // --- 详情页逻辑 ---
  async function runDetailPage() {
    console.log('[OA助手] 详情页流程加载中 (v0.62)...');
    let active = true;

    // 自毁计时
    setTimeout(() => {
      if (active) {
        console.error('[OA助手] 详情页 50s 超时，触发自检偏移并关闭');
        State.setOffset(State.getOffset() + 1);
        State.setDone(true);
        window.close();
      }
    }, CONFIG.SELF_DESTRUCT);

    function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
    
    // 智能轮询等待函数
    function waitFor(predicate, timeout = 15000) { // 默认延长至 15s
      return new Promise(resolve => {
        const start = Date.now();
        const timer = setInterval(() => {
          const result = predicate();
          if (result) {
            clearInterval(timer);
            resolve(result);
          } else if (Date.now() - start > timeout) {
            clearInterval(timer);
            resolve(null);
          }
        }, 500); 
      });
    }

    // 扩展选择器
    function query(text) {
      const selector = 'button, input[type="button"], a, span[role="button"], div[role="button"]';
      return Array.from(document.querySelectorAll(selector)).find(b => b.innerText.includes(text) || (b.title && b.title.includes(text)) || (b.value && b.value.includes(text)));
    }

    // 等待页面初始渲染 (2s)
    await wait(2000);

    // 运行状态拦截点
    if (!State.isRunning()) {
      console.log('[OA助手] 自动化已停止，详情页不执行操作');
      active = false;
      return;
    }

    // 1. 查找阅毕按钮 (改为非强制，10s 超时)
    console.log('[OA助手] 正在搜索“阅毕”按钮...');
    const btn1 = await waitFor(() => query('阅毕不流转'), 15000);
    
    if (btn1) {
      console.log('[OA助手] 触发：点击阅毕不流转');
      btn1.click();
      await wait(1000);
    } else {
      console.warn('[OA助手] 未找到“阅毕”按钮，可能已处理或无需处理，继续寻找确认按钮...');
    }

    // 等待弹窗动效
    await wait(2000);

    // 2. 查找确认按钮 (强制，15s 超时)
    console.log('[OA助手] 正在搜索“确定”按钮...');
    const btn2 = await waitFor(() => query('确 定'), 15000);

    if (btn2) {
        console.log('[OA助手] 找到确定按钮，执行闭合逻辑...');
        active = false; // 停止本地自毁监控
        State.setLastClick(0); // 立即通知首页切断超时监控
        State.setDone(true); 
        btn2.click(); 
        await wait(5000); // 延长等待至 5s，确保提交完成
        window.close();
        return;
    }

    // 3. 兜底逻辑
    console.error('[OA助手] 确定按钮寻找超时，任务失败');
    State.setOffset(State.getOffset() + 1);
    State.setDone(true);
    active = false;
    window.close();
  }

  // --- 路由系统 ---
  const curr = window.location.href;
  if (curr.includes(CONFIG.HOME_DOMAIN)) {
    runHomePage();
  } else if (curr.includes('/spa/workflow/static4form/index.html')) {
    runDetailPage();
  }
})();
