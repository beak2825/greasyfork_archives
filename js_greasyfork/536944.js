// ==UserScript==
// @name         UPhone Token Helper
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      5.0
// @description  实现UPhone账号管理，实现多账号切换
// @author       kkkkkba
// @match        https://uphone.wo-adv.cn/cloudphone/*
// @match        https://uphone.wo-adv.cn/cloudphone/#/cloud-phone-list
// @match        https://uphone.wo-adv.cn/cloudphone/#/home
// @grant        GM_xmlhttpRequest
// @connect      member.zlhz.wostore.cn
// @downloadURL https://update.greasyfork.org/scripts/536944/UPhone%20Token%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/536944/UPhone%20Token%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // —— 可配置常量 ——
  const STORAGE_ACCOUNTS = '__uphone_token_accounts__';
  const STORAGE_FLOATPOS = '__uphone_float_position__';

  const FLOAT_SIZE = 50;        // 浮球尺寸
  const PEEK_OFFSET = 25;       // 半隐藏露出像素
  const DRAG_THRESHOLD = 5;     // 判定拖动的最小移动距离（像素）

  const getAccounts = () => JSON.parse(localStorage.getItem(STORAGE_ACCOUNTS) || '{}');
  const saveAccounts = (obj) => localStorage.setItem(STORAGE_ACCOUNTS, JSON.stringify(obj));

  // 帮助：节流
  const raf = (fn) => requestAnimationFrame(fn);

  // —— 初始化 ——
  window.addEventListener('load', () => {
    // ===== 根容器（承载浮球与面板） =====
    const container = document.createElement('div');
    Object.assign(container.style, {
      position: 'fixed',
      top: '150px',
      right: '0',
      width: FLOAT_SIZE + 'px',
      height: FLOAT_SIZE + 'px',
      zIndex: '99999',
      userSelect: 'none',
      transition: 'transform .25s ease, right .25s ease, left .25s ease, top .25s ease',
      transform: 'translateX(' + PEEK_OFFSET + 'px)', // 初始半隐藏在右侧
    });

    // 恢复浮球停靠边与纵向位置
    const savedPos = (() => {
      try { return JSON.parse(localStorage.getItem(STORAGE_FLOATPOS) || '{}'); } catch (_) { return {}; }
    })();
    let dockEdge = savedPos.edge === 'left' ? 'left' : 'right'; // 默认右侧
    if (dockEdge === 'left') {
      container.style.left = '0px';
      container.style.right = 'auto';
      container.style.transform = 'translateX(-' + PEEK_OFFSET + 'px)';
    } else {
      container.style.right = '0px';
      container.style.left = 'auto';
      container.style.transform = 'translateX(' + PEEK_OFFSET + 'px)';
    }
    if (savedPos.top) container.style.top = savedPos.top;

    // ===== 浮动按钮（悬浮球） =====
    const floatBtn = document.createElement('div');
    Object.assign(floatBtn.style, {
      width: '100%',
      height: '100%',
      background: '#409EFF',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      boxShadow: '0 4px 12px rgba(64,158,255,.4)',
      border: '2px solid rgba(255,255,255,.35)',
      cursor: 'grab',
      transition: 'background .2s ease, opacity .2s ease, transform .2s ease',
      fontSize: '22px',
      lineHeight: 1,
      userSelect: 'none',
    });
    floatBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12" y2="18"></line></svg>';

    // ===== 全局toast管理 =====
    let toastQueue = [];
    let isShowingToast = false;

    // 改进的toast函数
    function showToast(message, duration = 2000) {
      toastQueue.push({ message, duration });
      
      if (!isShowingToast) {
        processToastQueue();
      }
    }

    // 处理toast队列
    function processToastQueue() {
      if (toastQueue.length === 0) {
        isShowingToast = false;
        return;
      }
      
      isShowingToast = true;
      const { message, duration } = toastQueue.shift();
      
      // 显示toast（假设您已有toast函数）
      toast(message);
      
      setTimeout(() => {
        processToastQueue();
      }, duration);
    }    
    // ===== 控制面板 =====
    const panel = document.createElement('div');
    Object.assign(panel.style, {
      position: 'absolute',
      top: '0',
      right: dockEdge === 'right' ? (FLOAT_SIZE + 10) + 'px' : 'auto',
      left: dockEdge === 'left' ? (FLOAT_SIZE + 10) + 'px' : 'auto',
      width: '200px',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,.15)',
      padding: '14px',
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, PingFang SC, Microsoft YaHei, sans-serif',
      opacity: '0',
      transform: 'translateX(12px)',
      pointerEvents: 'none',
      transition: 'opacity .2s ease, transform .2s ease',
    });

    const section = (titleText) => {
      const wrap = document.createElement('div');
      // wrap.style.marginBottom = '12px';
      const head = document.createElement('div');
      // Object.assign(head.style, {
      //   fontSize: '16px', fontWeight: '900', color: '#333', marginBottom: '8px',
      //   display: 'flex', alignItems: 'center', gap: '6px'
      // });
      // head.textContent = titleText;
      // wrap.appendChild(head);
      return { wrap, head };
    };


    // —— 账号管理 ——
    // —— 账号管理 —— 
    const divider = document.createElement('div');
    Object.assign(divider.style, { height: '1px', background: '#f1f5f9'});
    panel.appendChild(divider);

    const { wrap: accWrap } = section('账号管理');

    const list = document.createElement('div');
    Object.assign(list.style, { maxHeight: '260px', overflowY: 'auto', marginBottom: '10px' });

    const refreshAccountList = () => {
      list.innerHTML = '';
      const accounts = getAccounts();
      const names = Object.keys(accounts);
      if (!names.length) {
        const empty = document.createElement('div');
        empty.textContent = '暂无保存的账号';
        Object.assign(empty.style, { color: '#94a3b8', textAlign: 'center', padding: '12px', fontSize: '13px' });
        list.appendChild(empty);
        return;
      }

      names.forEach((name) => {
        const token = accounts[name];
        const item = document.createElement('div');
        Object.assign(item.style, {
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#EDF2FA', padding: '8px 10px', borderRadius: '10px', marginBottom: '8px'
        });

        const nm = document.createElement('div');
        nm.textContent = name;
        Object.assign(nm.style, {
          flex: '1', minWidth: 0,
          fontSize: '14px', fontWeight: '400',
          overflow: 'hidden', textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        });

        const actions = document.createElement('div');
        Object.assign(actions.style, { display: 'flex', gap: '6px' });

        // 通用按钮样式
        const btn = (html, bg) => {
          const b = document.createElement('button');
          b.innerHTML = html;
          Object.assign(b.style, {
            padding: '4px 8px', fontSize: '12px',
            borderRadius: '8px', cursor: 'pointer',
            background: bg, color: '#fff', border: 'none'
          });
          return b;
        };

        // // ====== 新增：复制Token ======
        // const bCopy = btn(
        //   '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
        //   '#6366F1'
        // );
        // bCopy.title = '复制Token';
        // bCopy.onclick = () => {
        //   navigator.clipboard.writeText(token);
        //   showToast('Token已复制', 1200);
        // };

        // ===== 修改按钮 =====
        const bEdit = btn('', '#4AC960', '#fff');
        bEdit.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
        bEdit.title = '修改Token';
        bEdit.onclick = () => {
          const newToken = prompt(`请输入账号「${name}」的新Token：`, token);
          if (newToken === null) return;
          if (!newToken.trim()) return alert('Token不能为空！');

          const a = getAccounts();
          a[name] = newToken.trim();
          saveAccounts(a);
          refreshAccountList();
          showToast('Token已更新', 1500);
        };

        // ===== 删除按钮 =====
        const bDel = btn('', '#FC886F', '#fff');
        bDel.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
        bDel.title = '删除账号';
        bDel.onclick = () => {
          if (!confirm(`确定删除账号「${name}」？`)) return;
          const a = getAccounts();
          delete a[name];
          saveAccounts(a);
          refreshAccountList();
        };

        // ===== 原逻辑：点击名称来切换账号 =====
        nm.onclick = async () => {
          if (!confirm(`确定切换到账号「${name}」吗？`)) return;

          const baseInfoStr = localStorage.getItem('baseInfo');
          if (!baseInfoStr) return alert('baseInfo不存在');

          try {
            const baseInfo = JSON.parse(baseInfoStr);
            baseInfo.data.token = token;
            baseInfo.data.userInfo = {};

            // 请求用户信息（原逻辑不动）
            try {
              showToast('获取用户信息中...', 1500);
              const response = await fetch('https://uphone.wo-adv.cn/bucp/servers/system/user/getAppUserInfo', {
                method: 'GET',
                headers: {
                  'Authorization': baseInfo.data.token,
                  'User-Agent': 'Mozilla',
                  'channel': 'bucp-master',
                  'channelCode': 'bucp-master',
                  'os': 'H5',
                  'source': '4'
                }
              });
              const result = await response.json();

              if (result.code === 200 && result.data) {
                baseInfo.data.userInfo = result.data;
                showToast('用户信息获取成功', 1000);
              } else {
                showToast('获取用户信息失败:' + (result.msg || '未知错误'), 1500);
                return;
              }
            } catch (e) {
              showToast('获取用户信息失败', 1500);
              return;
            }

            localStorage.setItem('baseInfo', JSON.stringify(baseInfo));
            showToast('切换中...', 800);
            setTimeout(() => location.reload(), 1800);

          } catch (e) {
            alert('baseInfo 解析失败');
          }
        };

        // actions.appendChild(bCopy);
        actions.appendChild(bEdit);
        actions.appendChild(bDel);

        item.appendChild(nm);
        item.appendChild(actions);
        list.appendChild(item);
      });
    };

    // ===== 下方按钮区 ===================================================================================================================================
    //===================================================================================================================================
    // ===================== 控制按钮区域 =====================
    const controls = document.createElement('div');
    Object.assign(controls.style, {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginTop: '10px'
    });

    // 工厂: 创建按钮
    function createBtn(text, bgColor, bdColor, txtColor, onClick) {
      const btn = document.createElement('button');
      btn.textContent = text;
      Object.assign(btn.style, {
        padding: '8px 12px',
        fontSize: '13px',
        background: bgColor,
        color: txtColor,
        border: '1px solid ' + bdColor,
        borderRadius: '10px',
        cursor: 'pointer',
        flex: '1',
        whiteSpace: 'nowrap'
      });
      btn.onclick = onClick;
      return btn;
    }

    // ===================== 第一行按钮（固定显示） =====================
    const row1 = document.createElement('div');
    Object.assign(row1.style, {
      display: 'flex',
      gap: '10px'
    });

    // 添加账号
    const btnAdd = createBtn(
      '添加',
      '#e6f0ff', '#bfdbfe', '#2563eb',
      () => {
        const name = prompt('请输入账号名称：');
        if (!name) return;
        const token = prompt('请输入 token：');
        if (!token) return;
        const a = getAccounts();
        a[name] = token.trim();
        saveAccounts(a);
        refreshAccountList();
        showToast('账号已添加', 1200);
      }
    );

    // 导入
    const btnImport = createBtn(
      '导入',
      '#fff7ed', '#fed7aa', '#ea580c',
      () => {
        const txt = prompt('粘贴导入 JSON：');
        if (!txt) return;
        try {
          saveAccounts(JSON.parse(txt));
          refreshAccountList();
          showToast('导入成功', 1200);
        } catch {
          showToast('JSON 格式有误', 1500);
        }
      }
    );

    // 导出
    const btnExport = createBtn(
      '导出',
      '#eefce8', '#bbf7d0', '#16a34a',
      () => {
        navigator.clipboard.writeText(JSON.stringify(getAccounts(), null, 2));
        showToast('账号已复制', 1200);
      }
    );

    // 加入第一行
    [row1.appendChild(btnAdd), row1.appendChild(btnImport), row1.appendChild(btnExport)];
    controls.appendChild(row1);


    // ===================== 更多内容区（默认隐藏） =====================
    let expanded = false;

    const morePanel = document.createElement('div');
    Object.assign(morePanel.style, {
      display: 'none',            // 默认隐藏
      flexWrap: 'wrap',
      gap: '10px',
      marginTop: '5px'
    });

    // 恢复 TK
    const btnRestore = createBtn(
      '复活所有TK',
      '#f0f9ff', '#bae6fd', '#0284c7',
      () => {
        const accounts = getAccounts();
        const names = Object.keys(accounts);
        if (!names.length) return showToast('无可恢复账号', 1200);

        showToast('正在恢复...', 1200);

        names.forEach(name => {
          GM_xmlhttpRequest({
            method: "GET",
            url:
              "https://member.zlhz.wostore.cn/wcy_member/yunPhone/activity/coupon/list"
              + "?activityId=FREE_EQUITY_202504&token=" + encodeURIComponent(accounts[name]),
            headers: {
              "User-Agent": navigator.userAgent,
              "channel": "bucp-master",
              "channelCode": "bucp-master",
              "os": "H5",
              "source": "4"
            },
            onload: res => showToast(`账号 ${name} → ${res.status === 200 ? '成功' : '失败'}`, 1200),
            onerror: () => showToast(`账号 ${name} 异常`, 1200)
          });
        });
      }
    );

    // 复制当前 TK
    const btnCopyTK = createBtn(
      '复制当前TK',
      '#fef2f2', '#fecaca', '#dc2626',
      () => {
        try {
          const baseInfo = JSON.parse(localStorage.getItem('baseInfo') || '{}');
          const tk = baseInfo?.data?.token;
          if (!tk) return showToast('未找到 Token', 1300);
          navigator.clipboard.writeText(tk);
          showToast('当前 Token 已复制', 1200);
        } catch {
          showToast('复制失败', 1300);
        }
      }
    );


    // 将这些按钮加入更多区
    morePanel.appendChild(btnRestore);
    morePanel.appendChild(btnCopyTK);

    // 未来新增按钮 → 在这里 appendChild 即可自动换行

    controls.appendChild(morePanel);


    // ===================== “更多” / “收起”按钮 =====================
    const btnMore = createBtn(
      '更多',
      '#f3f4f6', '#e5e7eb', '#374151',
      () => {
        expanded = !expanded;
        morePanel.style.display = expanded ? 'flex' : 'none';
        btnMore.textContent = expanded ? '收起' : '更多';
      }
    );

    Object.assign(btnMore.style, { width: '100%' });
    controls.appendChild(btnMore);

    // 添加到面板
    accWrap.appendChild(controls);



    // 添加进面板
    accWrap.appendChild(list);
    accWrap.appendChild(controls);
    panel.appendChild(accWrap);


    // —— 轻提示 ——
    function toast(text) {
      const el = document.createElement('div');
      el.textContent = text;
      Object.assign(el.style, {
        position: 'fixed', left: '50%', top: '12%', transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,.8)', color: '#fff', padding: '8px 12px', borderRadius: '999px',
        fontSize: '12px', zIndex: '100000', opacity: '0', transition: 'opacity .2s ease'
      });
      document.body.appendChild(el);
      requestAnimationFrame(() => el.style.opacity = '1');
      setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 200); }, 1600);
    }

    // ===== 交互：展开/收起 & 半隐藏 =====
    let isExpanded = false;   // 面板是否展开
    let isHovering = false;   // 鼠标是否悬停容器
    let isDragging = false;   // 是否拖动中
    let dragStartX = 0, dragStartY = 0, moved = false;

    function applyPeekHidden(hidden) {
      if (isExpanded) { container.style.transform = 'translateX(0)'; return; }
      const tx = hidden ? (dockEdge === 'right' ? PEEK_OFFSET : -PEEK_OFFSET) : 0;
      container.style.transform = `translateX(${tx}px)`;
    }

    function togglePanel(force) {
      const willExpand = typeof force === 'boolean' ? force : !isExpanded;
      isExpanded = willExpand;
      if (willExpand) {
        refreshAccountList();
        // 面板在当前停靠边的反方向展开
        panel.style.left  = dockEdge === 'left'  ? (FLOAT_SIZE + 10) + 'px' : 'auto';
        panel.style.right = dockEdge === 'right' ? (FLOAT_SIZE + 10) + 'px' : 'auto';
        panel.style.opacity = '1';
        panel.style.transform = 'translateX(0)';
        panel.style.pointerEvents = 'auto';
        applyPeekHidden(false);
      } else {
        panel.style.opacity = '0';
        panel.style.transform = 'translateX(12px)';
        panel.style.pointerEvents = 'none';
        applyPeekHidden(true);
      }
    }

    container.addEventListener('mouseenter', () => { isHovering = true; applyPeekHidden(false); });
    container.addEventListener('mouseleave', () => {
      isHovering = false;
      setTimeout(() => { if (!isHovering && !isExpanded && !isDragging) applyPeekHidden(true); }, 10);
    });

    // 点击与拖动判定
    const onMouseDown = (e) => {
      isDragging = true; moved = false;
      dragStartX = e.clientX; dragStartY = e.clientY;
      floatBtn.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX; const dy = e.clientY - dragStartY;
      if (!moved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) moved = true;
      // 临时跟随指针（解除停靠）
      container.style.left = (e.clientX - FLOAT_SIZE / 2) + 'px';
      container.style.top  = (e.clientY - FLOAT_SIZE / 2) + 'px';
      container.style.right = 'auto';
      applyPeekHidden(true); // 拖拽中保持完全显示
    };
    const onMouseUp = (e) => {
      if (!isDragging) return;
      isDragging = false; floatBtn.style.cursor = 'grab'; document.body.style.userSelect = '';

      // 是否当作点击？
      if (!moved) {
         togglePanel(); 
         return; 
      }

      // 结束时吸附到最近边 & 规范位置
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      dockEdge = centerX < window.innerWidth / 2 ? 'left' : 'right';

      const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
      const topPx = clamp(rect.top, 0, window.innerHeight - FLOAT_SIZE);
      container.style.top = topPx + 'px';

      if (dockEdge === 'left') {
        container.style.left = '0px';
        container.style.right = 'auto';
      } else {
        container.style.right = '0px';
        container.style.left = 'auto';
      }

      // 记忆停靠边与纵向位置
      localStorage.setItem(STORAGE_FLOATPOS, JSON.stringify({ edge: dockEdge, top: container.style.top }));

      // 根据停靠边应用半隐藏
      raf(() => applyPeekHidden(true));
    };

    // 绑定鼠标事件（容器与按钮都能拖）
    floatBtn.addEventListener('pointerdown', onMouseDown);
    window.addEventListener('pointermove', onMouseMove);
    window.addEventListener('pointerup', onMouseUp);

    // 触摸支持
    floatBtn.addEventListener('touchstart', (e) => onMouseDown(e.touches[0]), { passive: true });
    window.addEventListener('touchmove', (e) => onMouseMove(e.touches[0]), { passive: true });
    window.addEventListener('touchend', (e) => onMouseUp(e.changedTouches?.[0] || e));

    // ESC 关闭面板
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isExpanded) togglePanel(false); });

    // 窗口尺寸变化，确保不超出屏幕
    window.addEventListener('resize', () => {
      const rect = container.getBoundingClientRect();
      const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
      container.style.top = clamp(rect.top, 0, window.innerHeight - FLOAT_SIZE) + 'px';
      // 重新应用停靠位置与半隐藏
      if (dockEdge === 'left') { container.style.left = '0px'; container.style.right = 'auto'; }
      else { container.style.right = '0px'; container.style.left = 'auto'; }
      applyPeekHidden(!isExpanded && !isHovering);
    });

    // 将元素添加到页面
    container.appendChild(floatBtn);
    container.appendChild(panel);
    document.body.appendChild(container);

    // 初次渲染：列表 & 初始半隐藏
    refreshAccountList();
    setTimeout(() => { if (!isExpanded) applyPeekHidden(true); }, 10);
  });
})();