// ==UserScript==
// @name         伪物弹幕
// @namespace    http://tampermonkey.net/
// @version      1.20
// @description  此乃伪物。
// @author       Yora
// @license      MIT
// @match        *://live.bilibili.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      generativelanguage.googleapis.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545571/%E4%BC%AA%E7%89%A9%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/545571/%E4%BC%AA%E7%89%A9%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
  'use strict';

  try {
  const DEFAULT = {
    n: 15,
    autoSend: false,
    apiKey: '',
    danmuInputSelector: 'textarea',
    danmuSendButtonSelector: 'button[data-send]',
    interval: 0,
    keywords: '',
    // 新增默认设置
    stealMode: false,
    focusMode: false,
    stealUids: '',
  };

  const DEFAULT_PROMPT = `背景：我正在一个直播间里，作为粉丝，请在生成弹幕时，完全融入弹幕氛围，保持简短且口语化的风格。避免使用正式、书面化或AI的表达，不要带感叹词，不要透露是AI。适度复读和互动，让回复像真实观众发出的弹幕。请根据以下弹幕列表，生成一句相关且自然的弹幕内容，不要带发言人或冒号，也不要多余解释。弹幕列表：
{danmu}`;

  GM_addStyle(`
    #llm-panel {
      position: fixed;
      right: 20px;
      bottom: 20px;
      width: 380px;
      background: #fff8f7;
      color: #3b1e1e;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 14px;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      box-shadow: 0 8px 20px rgba(255, 200, 160, 0.5);
      z-index: 9999999;
      user-select: none;
      cursor: default;
      transition: height 0.3s ease, width 0.3s ease, padding 0.3s ease;
      overflow: hidden;
    }
    #llm-panel header {
      font-weight: 700;
      font-size: 18px;
      margin-bottom: 8px;
      cursor: move;
      user-select: none;
      color: #a82f2f;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 6px;
    }
    #llm-toggle-minimize {
      background: transparent;
      border: none;
      color: #a82f2f;
      font-size: 20px;
      cursor: pointer;
      user-select: none;
      line-height: 1;
      padding: 0 6px;
      flex-shrink: 0;
    }
    #llm-toggle-options {
      background: transparent;
      border: none;
      color: #a85a32;
      font-size: 13px;
      text-decoration: underline;
      cursor: pointer;
      margin-bottom: 10px;
      user-select: none;
      padding: 0;
    }
    #llm-options {
      display: none;
      margin-bottom: 10px;
    }
    #llm-options label {
      display: block;
      margin-top: 10px;
      font-weight: 600;
      cursor: pointer;
      user-select: none;
      color: #5f3b3b;
    }
    #llm-options input[type="number"],
    #llm-options input[type="text"],
    #llm-options textarea {
      width: 100%;
      padding: 8px 12px;
      margin-top: 6px;
      border-radius: 6px;
      border: 1px solid #f1c8c8;
      background: #fff1f0;
      color: #5f3b3b;
      font-size: 13px;
      box-sizing: border-box;
      transition: border-color 0.3s;
      user-select: text;
      font-family: monospace;
      resize: vertical;
    }
    #llm-options input[type="number"]:focus,
    #llm-options input[type="text"]:focus,
    #llm-options textarea:focus {
      border-color: #a84747;
      outline: none;
      background: #ffe5e5;
    }
    #llm-options input[type="checkbox"] {
      margin-right: 6px;
      cursor: pointer;
      vertical-align: middle;
      width: 18px;
      height: 18px;
      user-select: none;
    }
    #llm-buttons {
      margin-top: 6px;
      user-select: none;
    }
    #llm-buttons button {
      margin: 6px 10px 0 0;
      padding: 10px 18px;
      border: none;
      border-radius: 8px;
      background: #f9c06b;
      color: #5f3b3b;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(249,192,107,0.6);
      transition: background 0.3s, color 0.3s;
      user-select: none;
    }
    #llm-buttons button:hover:not(:disabled) {
      background: #fbcf83;
      color: #4b2c2c;
    }
    #llm-buttons button:disabled {
      cursor: not-allowed;
      opacity: 0.6;
      background: #d8b25e;
      color: #3c2e22;
      box-shadow: none;
    }
    #llm-buttons button.running {
      background: #c94b4b !important;
      color: #fff !important;
      box-shadow: 0 0 12px #c94b4bcc !important;
    }
    #llm-status {
      max-height: 150px;
      overflow-y: auto;
      background: #fff2f0;
      border-radius: 10px;
      padding: 12px;
      font-family: "Consolas", "Courier New", monospace;
      font-size: 13px;
      line-height: 1.4;
      color: #4a2929;
      white-space: pre-wrap;
      box-shadow: inset 0 0 10px #f9c06baa;
      user-select: text;
      transition: max-height 0.3s ease, overflow 0.3s ease;
    }
    /* 滚动条美化 */
    #llm-status::-webkit-scrollbar {
      width: 8px;
    }
    #llm-status::-webkit-scrollbar-track {
      background: transparent;
    }
    #llm-status::-webkit-scrollbar-thumb {
      background: #f9c06b;
      border-radius: 4px;
    }
  `);

  // 创建面板HTML，新增“定时触发”开关，和自动发送同级
  const panel = document.createElement('div');
  panel.id = 'llm-panel';
  panel.innerHTML = `
    <header id="llm-header">
      伪物弹幕
      <button id="llm-toggle-minimize" title="缩小/展开">—</button>
    </header>
    <div id="llm-content">
      <button id="llm-toggle-options">展开更多选项 ▼</button>
      <div id="llm-options">
        <label for="llm-n">参考弹幕数量 (n):
          <input id="llm-n" type="number" min="1" max="100" />
        </label>
        <label for="llm-apikey">API Key:
          <input id="llm-apikey" type="text" placeholder="AIza..." autocomplete="off" />
        </label>
        <label><input id="llm-autosend" type="checkbox" /> 自动发送弹幕</label>

        <!-- 新增：偷子模式 & 专注模式 -->
        <label><input id="llm-stealmode" type="checkbox" /> 偷子模式</label>
        <div id="llm-focus-row" style="display:none; margin-left:18px;">
          <label><input id="llm-focusmode" type="checkbox" /> 专注模式</label>
        </div>
        <label id="llm-steal-uids-label" style="display:none;">优先偷取 UID 列表（逗号分隔）:
          <input id="llm-steal-uids" type="text" placeholder="14999357,114514" />
        </label>

        <label><input id="llm-timer" type="checkbox" /> 定时触发</label>
        <label for="llm-interval">定时间隔（秒）:
          <input id="llm-interval" type="number" min="1" max="3600" />
        </label>
        <label for="llm-keywords">关键词触发（逗号分隔）:
          <input id="llm-keywords" type="text" placeholder="关键字1,关键字2,关键字3" />
        </label>
        <label for="llm-customprompt">自定义提示词（支持使用{danmu}作为弹幕列表占位符）:
          <textarea id="llm-customprompt" rows="10" placeholder="请输入自定义提示词，{danmu} 将替换为弹幕列表"></textarea>
        </label>
      </div>
      <div id="llm-buttons">
        <button id="llm-run">仿写弹幕</button>
        <button id="llm-save" style="display:none;">保存配置</button>
        <button id="llm-showdanmu">弹幕列表</button>
      </div>
    </div>
    </br>
    <div id="llm-status">状态信息将在这里显示</div>
  `;
  document.body.appendChild(panel);

  // 折叠展开更多选项（不动）
  const toggleBtn = document.getElementById('llm-toggle-options');
  const optionsDiv = document.getElementById('llm-options');
  toggleBtn.addEventListener('click', () => {
    if (optionsDiv.style.display === 'none' || optionsDiv.style.display === '') {
      optionsDiv.style.display = 'block';
      toggleBtn.textContent = '收起更多选项 ▲';
    } else {
      optionsDiv.style.display = 'none';
      toggleBtn.textContent = '展开更多选项 ▼';
    }
  });
  optionsDiv.style.display = 'none';

  // 拖动逻辑（保持不变）
  const header = document.getElementById('llm-header');
  const panelElement = document.getElementById('llm-panel');
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let panelStartRight = 0;
  let panelStartBottom = 0;

  header.addEventListener('mousedown', e => {
    if (e.target.id === 'llm-toggle-minimize') return;
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    const rect = panelElement.getBoundingClientRect();
    panelStartRight = window.innerWidth - rect.right;
    panelStartBottom = window.innerHeight - rect.bottom;
    document.body.style.userSelect = 'none';
  });
  document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.userSelect = '';
  });
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    panelElement.style.right = (panelStartRight - dx) + 'px';
    panelElement.style.bottom = (panelStartBottom - dy) + 'px';
  });

  // 缩小展开按钮（保持你原来逻辑不变）
  const llmContent = document.getElementById('llm-content');
  const toggleMinBtn = document.getElementById('llm-toggle-minimize');
  const statusDiv = document.getElementById('llm-status');

  let minimized = false;
  function setMinimized(state) {
    minimized = state;
    if (minimized) {
      llmContent.style.display = 'none';
      statusDiv.style.maxHeight = '40px';
      statusDiv.style.overflow = 'hidden';
      toggleMinBtn.textContent = '+';
      panelElement.style.height = 'auto';
      panelElement.style.width = '280px';
      panelElement.style.padding = '8px 12px';
    } else {
      llmContent.style.display = 'block';
      statusDiv.style.maxHeight = '150px';
      statusDiv.style.overflowY = 'auto';
      toggleMinBtn.textContent = '—';
      panelElement.style.height = 'auto';
      panelElement.style.width = '380px';
      panelElement.style.padding = '12px 16px';
    }
  }
  toggleMinBtn.addEventListener('click', e => {
    e.stopPropagation();
    setMinimized(!minimized);
  });
  setMinimized(false);

  // 状态更新函数
  function updateStatus(text) {
    statusDiv.textContent = text;
  }

  // 定时相关变量
  let timerIsRunning = false;
  let intervalId = null;

  // 新增倒计时变量
  let countdownTimerId = null;
  let nextTriggerTime = 0;

  // 获取元素
  const timerCheckbox = document.getElementById('llm-timer');
  const runBtn = document.getElementById('llm-run');
  const intervalInput = document.getElementById('llm-interval');
  const autoSendCheckbox = document.getElementById('llm-autosend');

  // 新增元素引用
  const stealCheckbox = document.getElementById('llm-stealmode');
  const focusRow = document.getElementById('llm-focus-row');
  const focusCheckbox = document.getElementById('llm-focusmode');
  const stealUidsLabel = document.getElementById('llm-steal-uids-label');
  const stealUidsInput = document.getElementById('llm-steal-uids');

  // === 以下是你已有的调用接口函数，保持不变 ===
  async function collectRecentDanmu() {
    const n = Number(await GM_getValue('n', DEFAULT.n));
    const nodes = Array.from(document.querySelectorAll('.chat-item.danmaku-item'));
    return nodes.slice(-n).map(el => {
      const danmuSpan = el.querySelector('span.danmaku-item-right');
      return danmuSpan ? danmuSpan.textContent.trim() : '';
    }).filter(Boolean);
  }

  // 新增：按对象返回最近弹幕（包含 uid 与 text），不替换原有函数
  async function collectRecentDanmuObjs() {
    const n = Number(await GM_getValue('n', DEFAULT.n));
    const nodes = Array.from(document.querySelectorAll('.chat-item.danmaku-item'));
    const sliced = nodes.slice(-n);
    return sliced.map(el => {
      const danmuSpan = el.querySelector('span.danmaku-item-right');
      const text = danmuSpan ? danmuSpan.textContent.trim() : '';
      const uid = el.getAttribute('data-uid') || '';
      return { uid: uid, text: text, el: el };
    }).filter(o => o.text);
  }

  function callGemini(prompt) {
    return new Promise(async (resolve, reject) => {
      const apiKey = await GM_getValue('apiKey', DEFAULT.apiKey);
      if (!apiKey) return reject(new Error('未设置 API Key'));

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const bodyObj = {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 5000
        }
      };

      const body = JSON.stringify(bodyObj);

      GM_xmlhttpRequest({
        method: 'POST',
        url,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        },
        data: body,
        onload: res => {
          try {
            const data = JSON.parse(res.responseText);
            if (data?.error) {
              return reject(new Error(`API 错误: ${data.error.message}`));
            }
            let output = '';
            if (data?.candidates?.length) {
              const parts = data.candidates[0].content?.parts;
              if (parts && parts.length) {
                output = parts.map(p => p.text).join('');
              }
            }
            if (!output) {
              return resolve('[模型未返回内容，可能因安全策略或无法理解当前弹幕]');
            }
            resolve(output);
          } catch (e) {
            reject(new Error(`解析响应失败: ${e.message}`));
          }
        },
        onerror: err => reject(new Error(`网络请求失败: ${err.message}`))
      });
    });
  }

  async function fillAndMaybeSend(text) {
    if (!text || text.includes('[模型未返回内容')) return;

    const input = document.querySelector(DEFAULT.danmuInputSelector);
    if (!input) return;

    input.focus();
    input.value = text;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    if (await GM_getValue('autoSend', DEFAULT.autoSend)) {
      // 等 100 毫秒再点击发送按钮，确保输入事件完成
      await new Promise(r => setTimeout(r, 100));

      const btn = Array.from(document.querySelectorAll('button'))
        .find(b => b.textContent.trim() === '发送' && !b.disabled);

      if (btn) {
        btn.click();
      } else {
        updateStatus('未找到发送按钮');
      }
    }
  }

  // 新增：偷子模式的触发逻辑
  async function triggerStealMode() {
    // 获取最近弹幕对象
    const objs = await collectRecentDanmuObjs();
    if (!objs || objs.length === 0) {
      updateStatus('未找到弹幕（偷子模式）');
      return;
    }
    // 如果专注模式且有 UID 列表则按 UID 顺序优先取
    const focus = await GM_getValue('focusMode', DEFAULT.focusMode);
    const uidStr = (await GM_getValue('stealUids', DEFAULT.stealUids)) || stealUidsInput.value || '';
    const uidList = uidStr.split(',').map(s => s.trim()).filter(Boolean);

    let chosen = null;
    if (focus && uidList.length > 0) {
      // 按 uidList 的顺序，找该 uid 的最新弹幕（从后往前遍历）
      for (let uid of uidList) {
        for (let i = objs.length - 1; i >= 0; i--) {
          if (objs[i].uid === uid) {
            chosen = objs[i];
            break;
          }
        }
        if (chosen) break;
      }
    }
    if (!chosen) {
      // 随机取一个（从 objs 中随机选择）
      const idx = Math.floor(Math.random() * objs.length);
      chosen = objs[idx];
    }
    if (chosen && chosen.text) {
      await fillAndMaybeSend(chosen.text);
      updateStatus('偷子模式已发送（来源 uid:' + (chosen.uid || 'unknown') + '）:\n' + chosen.text);
    } else {
      updateStatus('未能选到合适弹幕（偷子模式）');
    }
  }

  async function triggerCallGemini() {
    updateStatus('调用接口中...');
    const danmuList = await collectRecentDanmu();
    if (danmuList.length === 0) {
      updateStatus('未找到弹幕');
      return;
    }

    // 如果开启偷子模式则走偷子逻辑（不请求 LLM）
    const steal = await GM_getValue('stealMode', DEFAULT.stealMode);
    if (steal) {
      await triggerStealMode();
      return;
    }

    let customPromptTemplate = await GM_getValue('customPrompt', '');
    if (!customPromptTemplate) customPromptTemplate = DEFAULT_PROMPT;

    const prompt = customPromptTemplate.replace(/\{danmu\}/g, danmuList.join('\n'));

    try {
      const respText = await callGemini(prompt);
      await fillAndMaybeSend(respText);
      updateStatus('完成，模型回复：\n' + respText);
    } catch (e) {
      updateStatus('请求失败：' + e.message);
    }
  }
  // === 调用接口函数结束 ===

  // 倒计时更新函数
  function updateCountdown() {
    if (!timerIsRunning) return;
    const now = Date.now();
    let remain = Math.floor((nextTriggerTime - now) / 1000);
    if (remain < 0) remain = 0;
    updateStatus(`距离下次定时触发还有 ${remain} 秒`);
    if (remain <= 0) {
      clearInterval(countdownTimerId);
      countdownTimerId = null;
    }
  }

  function updateRunButton() {
    if (!timerCheckbox.checked) {
      runBtn.textContent = '仿写弹幕';
      runBtn.classList.remove('running');
      timerIsRunning = false;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      if (countdownTimerId) {
        clearInterval(countdownTimerId);
        countdownTimerId = null;
      }
      updateStatus('定时触发已关闭');
    } else {
      runBtn.textContent = '开始定时触发';
      runBtn.classList.remove('running');
      timerIsRunning = false;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      if (countdownTimerId) {
        clearInterval(countdownTimerId);
        countdownTimerId = null;
      }
      updateStatus('定时触发未运行');
    }
  }

  // 点击“仿写弹幕”或“开始/停止定时触发”按钮
  runBtn.addEventListener('click', async () => {
    if (timerCheckbox.checked) {
      // 定时模式开关开启，点击为启动/停止定时触发
      if (timerIsRunning) {
        // 停止
        timerIsRunning = false;
        runBtn.textContent = '开始定时触发';
        runBtn.classList.remove('running');
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        if (countdownTimerId) {
          clearInterval(countdownTimerId);
          countdownTimerId = null;
        }
        updateStatus('已停止定时触发');
      } else {
        // 开始定时触发
        const intervalSeconds = parseInt(intervalInput.value, 10);
        if (isNaN(intervalSeconds) || intervalSeconds <= 0) {
          alert('请填写有效的定时间隔（秒）');
          return;
        }
        timerIsRunning = true;
        runBtn.textContent = '停止定时触发';
        runBtn.classList.add('running');
        nextTriggerTime = Date.now() + intervalSeconds * 1000;

        // 先立即触发一次
        try {
          await triggerCallGemini();
        } catch (e) {
          updateStatus('触发失败：' + e.message);
        }
        // 设置定时器周期触发
        intervalId = setInterval(async () => {
          nextTriggerTime = Date.now() + intervalSeconds * 1000;
          try {
            // 先检查关键词触发（如果有设置）
            const keywordsStr = document.getElementById('llm-keywords').value.trim();
            if (keywordsStr) {
              const keywords = keywordsStr.split(',').map(s => s.trim()).filter(Boolean);
              const danmus = await collectRecentDanmu();
              const danmuText = danmus.join(' ');
              // 任意关键词存在则触发
              const matched = keywords.some(k => danmuText.includes(k));
              if (!matched) {
                updateStatus(`定时触发跳过（无匹配关键词）`);
                return; // 跳过本次触发
              }
            }
            // 如果偷子模式开启，triggerCallGemini 内部会处理
            await triggerCallGemini();
          } catch (e) {
            updateStatus('定时触发失败：' + e.message);
          }
        }, intervalSeconds * 1000);

        // 启动倒计时显示
        if (countdownTimerId) clearInterval(countdownTimerId);
        countdownTimerId = setInterval(updateCountdown, 1000);
      }
    } else {
      // 非定时模式，直接单次触发
      runBtn.disabled = true;
      updateStatus('调用中...');
      try {
        await triggerCallGemini();
      } catch (e) {
        updateStatus('调用失败：' + e.message);
      }
      runBtn.disabled = false;
    }
  });

  // 读取配置初始化控件值
  (async () => {
    document.getElementById('llm-n').value = await GM_getValue('n', DEFAULT.n);
    document.getElementById('llm-apikey').value = await GM_getValue('apiKey', DEFAULT.apiKey);
    document.getElementById('llm-autosend').checked = await GM_getValue('autoSend', DEFAULT.autoSend);
    document.getElementById('llm-interval').value = await GM_getValue('interval', 0);
    document.getElementById('llm-keywords').value = await GM_getValue('keywords', '');
    document.getElementById('llm-customprompt').value = await GM_getValue('customPrompt', DEFAULT_PROMPT);

    // 读取新增设置
    const stealVal = await GM_getValue('stealMode', DEFAULT.stealMode);
    stealCheckbox.checked = !!stealVal;
    const focusVal = await GM_getValue('focusMode', DEFAULT.focusMode);
    focusCheckbox.checked = !!focusVal;
    document.getElementById('llm-steal-uids').value = await GM_getValue('stealUids', DEFAULT.stealUids);

    // 根据偷子模式显示专注行
    if (stealCheckbox.checked) {
      focusRow.style.display = 'block';
      stealUidsLabel.style.display = 'block';
    } else {
      focusRow.style.display = 'none';
      stealUidsLabel.style.display = 'none';
    }

    timerCheckbox.checked = false;
    updateRunButton();
  })();

  // 监听输入框变化并保存到GM存储
  document.getElementById('llm-n').addEventListener('change', e => {
    const val = parseInt(e.target.value, 10);
    if (val > 0 && val <= 100) GM_setValue('n', val);
  });
  document.getElementById('llm-apikey').addEventListener('change', e => {
    GM_setValue('apiKey', e.target.value.trim());
  });
  document.getElementById('llm-autosend').addEventListener('change', e => {
    GM_setValue('autoSend', e.target.checked);
  });
  intervalInput.addEventListener('change', e => {
    const val = parseInt(e.target.value, 10);
    if (val > 0 && val <= 3600) GM_setValue('interval', val);
  });
  document.getElementById('llm-keywords').addEventListener('change', e => {
    GM_setValue('keywords', e.target.value.trim());
  });
  document.getElementById('llm-customprompt').addEventListener('change', e => {
    GM_setValue('customPrompt', e.target.value);
  });

  // 新增：偷子与专注设置保存与展示联动
  stealCheckbox.addEventListener('change', async (e) => {
    const checked = e.target.checked;
    await GM_setValue('stealMode', checked);
    if (checked) {
      focusRow.style.display = 'block';
      stealUidsLabel.style.display = 'block';
    } else {
      focusRow.style.display = 'none';
      stealUidsLabel.style.display = 'none';
    }
  });
  focusCheckbox.addEventListener('change', async (e) => {
    const checked = e.target.checked;
    await GM_setValue('focusMode', checked);
  });
  stealUidsInput.addEventListener('change', async (e) => {
    await GM_setValue('stealUids', e.target.value.trim());
  });

  timerCheckbox.addEventListener('change', e => {
    updateRunButton();
  });

  // “弹幕列表”按钮，显示最近弹幕
  document.getElementById('llm-showdanmu').addEventListener('click', async () => {
    const list = await collectRecentDanmu();
    if (list.length === 0) {
      alert('未找到弹幕');
    } else {
      alert('最近弹幕（最新在最后）：\n\n' + list.join('\n'));
    }
  });

  // “保存配置”按钮隐藏，保持界面简洁，不再显示
  document.getElementById('llm-save').style.display = 'none';

  } catch (outerErr) {
    // 全局保护，防止脚本因错误中断
    console.error('伪物弹幕脚本发生未捕获错误：', outerErr);
    try { // 尝试简单展示到面板（若面板已创建）
      const s = document.getElementById('llm-status');
      if (s) s.textContent = '脚本错误：' + outerErr.message;
    } catch (e) {}
  }

})();
