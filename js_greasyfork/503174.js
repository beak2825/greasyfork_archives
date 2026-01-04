// ==UserScript==
// @name         【SillyTavern / ST酒馆】html代码注入器
// @name:zh      【ST酒馆】html代码注入器
// @name:zh-CN   【ST酒馆】html代码注入器
// @name:en      【SillyTavern】 HTML Code Injector
// @namespace    https://greasyfork.org/users/Qianzhuo
// @version      1.1.2
// @description  可以让ST酒馆独立运行html代码 (Inject HTML code into SillyTavern pages.)
// @description:zh  可以让ST酒馆独立运行html代码
// @description:zh-CN  可以让ST酒馆独立运行html代码
// @description:en  Inject HTML code into SillyTavern pages.
// @author       Qianzhuo
// @match        *://localhost:8000/*
// @match        *://127.0.0.1:8000/*
// @match        *://*/*:8000/*
// @include      /^https?:\/\/.*:8000\//
// @grant        GM_setValue
// @grant        GM_getValue
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @license CC BY-NC 4.0
// @downloadURL https://update.greasyfork.org/scripts/503174/%E3%80%90SillyTavern%20%20ST%E9%85%92%E9%A6%86%E3%80%91html%E4%BB%A3%E7%A0%81%E6%B3%A8%E5%85%A5%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/503174/%E3%80%90SillyTavern%20%20ST%E9%85%92%E9%A6%86%E3%80%91html%E4%BB%A3%E7%A0%81%E6%B3%A8%E5%85%A5%E5%99%A8.meta.js
// ==/UserScript==

/*
【SillyTavern / ST酒馆】html代码注入器 © 2024 by Qianzhuo is licensed under CC BY-NC 4.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc/4.0/
 */

(function () {
  'use strict';

  let isInjectionEnabled = false;
  let displayMode = GM_getValue('displayMode', 1); // 从存储中获取，默认为1
  let lastMesTextContent = '';

  // 存储激活楼层的设置
  let activationMode = GM_getValue('activationMode', 'all'); // 默认激活所有楼层
  let customStartFloor = GM_getValue('customStartFloor', 1);
  let customEndFloor = GM_getValue('customEndFloor', -1); // -1 表示最后一层


  // 创建设置面板
  const settingsPanel = document.createElement('div');
  settingsPanel.innerHTML = `
    <div id="settings-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <span style="font-size: 16px; font-weight: bold;">HTML注入器设置</span>
        <button id="close-settings" class="close-button">×</button>
    </div>
    <div id="settings-content">
        <div class="settings-section">
            <h3 class="settings-subtitle">边缘控制面板位置</h3>
            <select id="edge-controls-position" class="settings-select">
                <option value="top-right">界面右上角</option>
                <option value="right-three-quarters">界面右侧3/4位置</option>
                <option value="right-middle">界面右侧中间</option>
            </select>
        </div>

        <div class="settings-section">
            <h3 class="settings-subtitle">显示模式</h3>
            <label class="settings-option"><input type="radio" name="display-mode" value="1"> 原代码和注入效果一起显示</label>
            <label class="settings-option"><input type="radio" name="display-mode" value="2"> 原代码以摘要形式显示</label>
            <label class="settings-option"><input type="radio" name="display-mode" value="3"> 隐藏原代码，只显示注入效果</label>
        </div>

        <div class="settings-section">
            <h3 class="settings-subtitle">激活楼层</h3>
            <select id="activation-mode" class="settings-select">
                <option value="all">全部楼层</option>
                <option value="first">第一层</option>
                <option value="last">最后一层</option>
                <option value="lastN">最后N层</option>
                <option value="custom">自定义楼层</option>
            </select>
            <div id="custom-floor-settings" class="settings-subsection" style="display: none;">
                <label class="settings-option">起始楼层: <input type="number" id="custom-start-floor" min="1" value="1"></label>
                <label class="settings-option">结束楼层: <input type="number" id="custom-end-floor" min="-1" value="-1"></label>
                <p class="settings-note">（-1 表示最后一层）</p>
            </div>
            <div id="last-n-settings" class="settings-subsection" style="display: none;">
                <label class="settings-option">最后 <input type="number" id="last-n-floors" min="1" value="1"> 层</label>
            </div>
        </div>
    </div>
    <div class="settings-footer">
        <p>安全提醒：请仅注入您信任的代码。不安全的代码可能会对您的系统造成潜在风险。</p>
        <p>注意：要注入的 HTML 代码应该用 \`\`\` 包裹，例如：</p>
        <pre class="code-example">
\`\`\`
&lt;h1&gt;Hello, World!&lt;/h1&gt;
&lt;p&gt;This is an example.&lt;/p&gt;
\`\`\`
        </pre>

        <p>以下是对应ST酒馆功能的特殊类名及简单的使用方法：</p>
        <pre class="code-example">
\`\`\`
&lt;button class="qr-button"&gt;(你的QR按钮名字)&lt;/button&gt;
&lt;textarea class="st-text"&gt;(对应酒馆的输入文本框，输入内容会同步到酒馆的文本框里)&lt;/textarea&gt;
&lt;button class="st-send-button"&gt;(对应酒馆的发送按钮)&lt;/button&gt;
&lt;audio class="st-audio" controls&gt;
    &lt;source src="你的音频文件地址" type="audio/类型"&gt;
&lt;/audio&gt;
(st-audio可以添加controls显示控制栏，loop循环播放，autoplay自动播放。同一时间只会播放一个音频)
<details>
  <summary>点击查看 st-audio 的详细用法讲解</summary>
【属性说明】
- class="st-audio" - 用于标识这个音频元素，使其受到我们刚才编写的音频管理系统控制
- loop - 使音频循环播放
- controls - 显示音频控制面板（播放/暂停/进度条等）
- autoplay - 尝试自动播放（注意：现代浏览器可能会阻止自动播放）
【type属性的作用】
- 告诉浏览器音频文件的格式，帮助浏览器更快地确定是否支持该格式
- 不同格式对应不同的type值：
  - .mp3 → type = "audio/mpeg"
  - .wav → type = "audio/wav"
  - .ogg → type = "audio/ogg"
  - .m4a → type = "audio/mp4"
【示例代码】
\`\`\`
&lt;audio class="st-audio" loop controls autoplay&gt;
    &lt;source src="https://tuchuang-93f.pages.dev/img/zeus_bgm3.wav" type="audio/wav"&gt;
&lt;/audio&gt;
\`\`\`
</details>
\`\`\`
        </pre>
        <p>【注意】通过JavaScript动态插入st-text框的内容同步到st酒馆的输入框需要处理时间，如果需要同步，请添加一个小延迟来确保文本有时间进行同步.</p>
        <a href="https://discord.com/channels/1134557553011998840/1271783456690409554" target="_blank"> →Discord教程帖指路← 有详细说明与gal界面等模版 </a>
    </div>
`;

  settingsPanel.id = 'html-injector-settings';
  settingsPanel.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #1e1e1e;
    border-bottom: 1px solid #454545;
    padding: 20px;
    z-index: 9999;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    display: none;
    color: #d4d4d4;
    overflow-y: auto;
    max-height: 50vh;
`;
  document.body.appendChild(settingsPanel);

  // 处理激活楼层的设置
  document.getElementById('activation-mode').addEventListener('change', function () {
    const customSettings = document.getElementById('custom-floor-settings');
    const lastNSettings = document.getElementById('last-n-settings');

    customSettings.style.display = this.value === 'custom' ? 'block' : 'none';
    lastNSettings.style.display = this.value === 'lastN' ? 'block' : 'none';

    activationMode = this.value;
    GM_setValue('activationMode', activationMode);

    if (isInjectionEnabled) {
      removeInjectedIframes();
      injectHtmlCode();
    }
  });

  document.getElementById('custom-start-floor').addEventListener('change', function () {
    customStartFloor = parseInt(this.value);
    GM_setValue('customStartFloor', customStartFloor);
    if (isInjectionEnabled) {
      removeInjectedIframes();
      injectHtmlCode();
    }
  });

  document.getElementById('custom-end-floor').addEventListener('change', function () {
    customEndFloor = parseInt(this.value);
    GM_setValue('customEndFloor', customEndFloor);
    if (isInjectionEnabled) {
      removeInjectedIframes();
      injectHtmlCode();
    }
  });

  document.getElementById('last-n-floors').addEventListener('change', function () {
    customEndFloor = parseInt(this.value);
    GM_setValue('customEndFloor', customEndFloor);
    if (isInjectionEnabled) {
      removeInjectedIframes();
      injectHtmlCode();
    }
  });



  // 创建开关
  function createToggleSwitch(id) {
    const toggleSwitch = document.createElement('label');
    toggleSwitch.className = 'switch';
    toggleSwitch.innerHTML = `
        <input type="checkbox" id="${id}">
        <span class="slider round"></span>
    `;
    toggleSwitch.style.cssText = `
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
    `;
    return toggleSwitch;
  }

  // 创建边缘控制面板
  const edgeControls = document.createElement('div');
  edgeControls.id = 'edge-controls';
  edgeControls.style.cssText = `
    position: fixed;
    right: 0;
    background-color: #2d2d2d;
    border: 1px solid #454545;
    border-right: none;
    border-radius: 5px 0 0 5px;
    padding: 10px;
    z-index: 9998;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 80px;  // 增加最小宽度
`;

  // 在边缘控制面板中添加开关
  const edgeSwitch = createToggleSwitch('edge-injection-toggle');
  edgeControls.appendChild(edgeSwitch);

  // 处理边缘控制面板的位置调整
  function updateEdgeControlsPosition(position) {
    const vh = window.innerHeight / 100;
    edgeControls.style.transform = 'none'; // 重置transform
    switch (position) {
      case 'top-right':
        edgeControls.style.top = '1vh';
        edgeControls.style.bottom = 'auto';
        break;
      case 'right-three-quarters':
        edgeControls.style.top = '25vh';
        edgeControls.style.bottom = 'auto';
        break;
      case 'right-middle':
        edgeControls.style.top = '50vh';
        edgeControls.style.transform = 'translateY(-50%)';
        edgeControls.style.bottom = 'auto';
        break;
    }
    GM_setValue('edgeControlsPosition', position);
    // 恢复收起/展开状态
    updateEdgeControlsDisplay();
  }

  // 位置调整事件监听器
  document.getElementById('edge-controls-position').addEventListener('change', function () {
    updateEdgeControlsPosition(this.value);
  });


  // 添加显示/隐藏面板的按钮
  const togglePanelButton = document.createElement('button');
  togglePanelButton.textContent = '显示面板';
  togglePanelButton.style.cssText = `
    margin-top: 10px;
    padding: 8px 12px;
    background-color: #0e639c;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    width: 100%;
    text-align: center;
    transition: background-color 0.3s;
`;
  togglePanelButton.addEventListener('mouseover', function () {
    this.style.backgroundColor = '#1177bb';
  });
  togglePanelButton.addEventListener('mouseout', function () {
    this.style.backgroundColor = '#0e639c';
  });
  edgeControls.appendChild(togglePanelButton);

  // 添加收起/展开按钮
  const toggleEdgeControlsButton = document.createElement('button');
  toggleEdgeControlsButton.textContent = '<<';
  toggleEdgeControlsButton.style.cssText = `
    position: absolute;
    left: -15px;
    top: 50%;
    transform: translateY(-50%);
    background-color: #2d2d2d;
    color: #ffffff;
    border: none;
    border-radius: 3px 0 0 3px;
    cursor: pointer;
    padding: 3px;
    user-select: none;
    font-size: 10px;
`;
  edgeControls.appendChild(toggleEdgeControlsButton);

  document.body.appendChild(edgeControls);



  // 添加收起/展开功能
  // let isEdgeControlsCollapsed = false;
  let isEdgeControlsCollapsed = GM_getValue('isEdgeControlsCollapsed', false);
  toggleEdgeControlsButton.addEventListener('click', toggleEdgeControls);

  function toggleEdgeControls() {
    isEdgeControlsCollapsed = !isEdgeControlsCollapsed;
    GM_setValue('isEdgeControlsCollapsed', isEdgeControlsCollapsed);
    updateEdgeControlsDisplay();
  }

  function updateEdgeControlsDisplay() {
    edgeControls.style.transform = isEdgeControlsCollapsed ? 'translateX(calc(100% - 20px))' : 'translateX(0)';
    toggleEdgeControlsButton.textContent = isEdgeControlsCollapsed ? '>>' : '<<';
  }


  // 添加窗口大小变化的监听，确保面板始终在视图内
  window.addEventListener('resize', () => {
    const savedPosition = GM_getValue('edgeControlsPosition', 'top-right');
    updateEdgeControlsPosition(savedPosition);
  });

  // 添加样式
  const style = document.createElement('style');
  style.textContent = `
    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #3a3a3a;
        transition: .4s;
        border-radius: 34px;
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: #d4d4d4;
        transition: .4s;
        border-radius: 50%;
    }
    input:checked + .slider {
        background-color: #0e639c;
    }
    input:checked + .slider:before {
        transform: translateX(26px);
    }
    #settings-content label {
        display: block;
        margin: 10px 0;
        color: #d4d4d4;
    }

    .close-button {
        width: 30px;
        height: 30px;
        background-color: #e81123;
        border: none;
        color: white;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.3s;
    }

    .close-button:hover {
        background-color: #f1707a;
    }

    #settings-header {
        padding-bottom: 10px;
        border-bottom: 1px solid #454545;
        margin-bottom: 15px;
    }

    #settings-content input[type="radio"] {
        margin-right: 5px;
    }

    #settings-content input[type="number"] {
        background-color: #2d2d2d;
        color: #d4d4d4;
        border: 1px solid #454545;
        padding: 5px;
        border-radius: 3px;
        width: 50px;
        margin: 0 5px;
    }

    #settings-content input[type="number"]:focus {
        outline: none;
        border-color: #0e639c;
    }

    #activation-mode {
        background-color: #2d2d2d;
        color: #d4d4d4;
        border: 1px solid #454545;
        padding: 5px;
        border-radius: 3px;
    }

    #activation-mode:focus {
        outline: none;
        border-color: #0e639c;
    }

    .settings-section {
        margin-bottom: 15px;
    }

    .settings-subtitle {
        font-size: 14px;
        margin: 0 0 5px 0;
        color: #d4d4d4;
    }

    .settings-option {
        display: block;
        margin: 5px 0;
        font-size: 13px;
    }

    .settings-select {
        width: 100%;
        margin-bottom: 5px;
    }

    .settings-subsection {
        margin-top: 5px;
        padding-left: 10px;
    }

    .settings-note {
        font-size: 12px;
        color: #858585;
        margin: 2px 0;
    }

    .settings-footer {
        font-size: 12px;
        color: #858585;
        margin-top: 15px;
    }

    .code-example {
        background-color: #2d2d2d;
        padding: 10px;
        border-radius: 3px;
        overflow-x: auto;
        font-size: 12px;
    }

    // 响应式样式
    @media (max-width: 768px) {
    #edge-controls {
        font-size: 10px;
        min-width: 100px;
    }
    #edge-controls button {
        font-size: 12px;
        padding: 6px 10px;
    }
    .switch {
        width: 50px;
        height: 28px;
    }
    .slider:before {
        height: 20px;
        width: 20px;
    }
    input:checked + .slider:before {
        transform: translateX(22px);
    }
}

`;
  document.head.appendChild(style);

  // 监听开关变化
  function handleToggleChange(e) {
    isInjectionEnabled = e.target.checked;
    document.getElementById('edge-injection-toggle').checked = isInjectionEnabled;
    if (isInjectionEnabled) {
      injectHtmlCode();
    } else {
      removeInjectedIframes();
    }
  }

  document.getElementById('edge-injection-toggle').addEventListener('change', handleToggleChange);

  // 监听显示模式变化
  document.getElementsByName('display-mode').forEach(radio => {
    radio.addEventListener('change', function () {
      displayMode = parseInt(this.value);
      GM_setValue('displayMode', displayMode); // 保存设置
      if (isInjectionEnabled) {
        removeInjectedIframes();
        injectHtmlCode();
      }
    });
  });

  // 显示/隐藏面板按钮
  togglePanelButton.addEventListener('click', function () {
    if (settingsPanel.style.display === 'none') {
      settingsPanel.style.display = 'block';
      this.textContent = '隐藏面板';
    } else {
      settingsPanel.style.display = 'none';
      this.textContent = '显示面板';
    }
  });

  // 关闭设置面板
  document.getElementById('close-settings').addEventListener('click', function () {
    settingsPanel.style.display = 'none';
  });

  // 全局消息监听器
  window.addEventListener('message', function (event) {
    if (event.data === 'loaded') {
      // 处理 iframe 加载完成的消息
      const iframes = document.querySelectorAll('.mes_text iframe');
      iframes.forEach(iframe => {
        if (iframe.contentWindow === event.source) {
          adjustIframeHeight(iframe);
        }
      });
    } else if (event.data.type === 'buttonClick') {
      // 处理按钮点击事件
      const buttonName = event.data.name;
      jQuery('.qr--button.menu_button').each(function () {
        if (jQuery(this).find('.qr--button-label').text().trim() === buttonName) {
          jQuery(this).click();
          return false; // 退出 each 循环
        }
      });
    } else if (event.data.type === 'textInput') {
      // 处理文本输入
      const sendTextarea = document.getElementById('send_textarea');
      if (sendTextarea) {
        sendTextarea.value = event.data.text;
        // 触发 input 事件以确保任何监听器都能捕捉到变化
        sendTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        // 如果需要，也可以触发 change 事件
        sendTextarea.dispatchEvent(new Event('change', { bubbles: true }));
      }
    } else if (event.data.type === 'sendClick') {
      // 处理发送按钮点击
      const sendButton = document.getElementById('send_but');
      if (sendButton) {
        sendButton.click();
      }
    }
  });

  // 添加一个自定义的 :contains 选择器
  jQuery.expr[':'].contains = function (a, i, m) {
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
  };

  // 调整 iframe 高度的函数
  function adjustIframeHeight(iframe) {
    if (iframe.contentWindow.document.body) {
      const height = iframe.contentWindow.document.documentElement.scrollHeight;
      iframe.style.height = (height + 5) + 'px'; // 添加一些额外的高度
    }
  }

  // 主要的注入函数
  function injectHtmlCode(specificMesText = null) {
    let mesTextElements = specificMesText ? [specificMesText] : Array.from(document.getElementsByClassName('mes_text'));

    // 根据激活楼层设置筛选要处理的元素
    let targetElements;
    switch (activationMode) {
      case 'first':
        targetElements = mesTextElements.slice(0, 1);
        break;
      case 'last':
        targetElements = mesTextElements.slice(-1);
        break;
      case 'lastN':
        targetElements = mesTextElements.slice(-customEndFloor);
        break;
      case 'custom': {
        const start = customStartFloor - 1;
        const end = customEndFloor === -1 ? undefined : customEndFloor;
        targetElements = mesTextElements.slice(start, end);
        break;
      };
      default: // 'all'
        targetElements = mesTextElements;
    }

    // 注入逻辑
    for (const mesText of targetElements) {
      const codeElements = mesText.getElementsByTagName('code');

      for (const codeElement of codeElements) {
        let htmlContent = codeElement.innerText.trim();

        if (htmlContent.startsWith('<') && htmlContent.endsWith('>')) {
          // 创建一个iframe来运行HTML代码
          const iframe = document.createElement('iframe');

          // 确保每个iframe都有唯一的ID
          iframe.id = 'audio-iframe-' + Math.random().toString(36).substr(2, 9);

          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.border = 'none';
          iframe.style.marginTop = '10px';

          // 设置 iframe 的内容
          iframe.srcdoc = `
        <html>
            <head>
                <style>
                    body { margin: 0; padding: 0; }
                    /* 您可以在这里添加默认样式 */
                </style>
            </head>
            <body>
                ${htmlContent}
                <script>

            // 音频管理系统
            class AudioManager {
                constructor() {
                    this.currentlyPlaying = null;
                }

                handlePlay(audio) {
                    // 如果有其他音频在播放，先通知父窗口停止它
                    if (this.currentlyPlaying && this.currentlyPlaying !== audio) {
                        this.currentlyPlaying.pause();
                    }

                    // 通知父窗口有新的音频开始播放
                    window.parent.postMessage({
                        type: 'audioPlay',
                        iframeId: window.frameElement.id
                    }, '*');

                    this.currentlyPlaying = audio;
                }

                stopAll() {
                    if (this.currentlyPlaying) {
                        this.currentlyPlaying.pause();
                        this.currentlyPlaying = null;
                    }
                }
            }

            const audioManager = new AudioManager();

                    window.addEventListener('load', function() {
                        window.parent.postMessage('loaded', '*');

                        document.querySelectorAll('.qr-button').forEach(button => {
                            button.addEventListener('click', function() {
                                const buttonName = this.textContent.trim();
                                window.parent.postMessage({type: 'buttonClick', name: buttonName}, '*');
                            });
                        });

                        document.querySelectorAll('.st-text').forEach(textarea => {
                            textarea.addEventListener('input', function() {
                                window.parent.postMessage({type: 'textInput', text: this.value}, '*');
                            });

                            // 添加 'change' 事件监听
                            textarea.addEventListener('change', function() {
                                window.parent.postMessage({type: 'textInput', text: this.value}, '*');
                            });

                            // 添加一个 MutationObserver 来监听值的变化
                            const observer = new MutationObserver((mutations) => {
                                mutations.forEach((mutation) => {
                                    if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                                        window.parent.postMessage({type: 'textInput', text: textarea.value}, '*');
                                    }
                                });
                            });

                            observer.observe(textarea, { attributes: true });
                        });

                        document.querySelectorAll('.st-send-button').forEach(button => {
                            button.addEventListener('click', function() {
                                window.parent.postMessage({type: 'sendClick'}, '*');
                            });
                        });

                        // 为所有st-audio类的音频元素添加事件监听
                        document.querySelectorAll('.st-audio').forEach(audio => {
                            audio.addEventListener('play', function() {
                                audioManager.handlePlay(this);
                            });
                        });

                        // 监听来自父窗口的停止音频指令
                        window.addEventListener('message', function(event) {
                            if (event.data.type === 'stopAudio' &&
                                event.data.iframeId !== window.frameElement.id) {
                                audioManager.stopAll();
                            }
                        });
                    });
                </script>
            </body>
        </html>
    `;

          // 根据显示模式处理原代码
          if (displayMode === 2) {
            const details = document.createElement('details');
            const summary = document.createElement('summary');
            summary.textContent = '[原代码]';
            details.appendChild(summary);
            codeElement.parentNode.insertBefore(details, codeElement);
            details.appendChild(codeElement);
          } else if (displayMode === 3) {
            codeElement.style.display = 'none';
          }

          // 将iframe插入到code元素后面
          codeElement.parentNode.insertBefore(iframe, codeElement.nextSibling);

          // 初始调整iframe高度
          iframe.onload = function () {
            adjustIframeHeight(iframe);
            // 再次调整高度，以防有延迟加载的内容
            setTimeout(() => adjustIframeHeight(iframe), 500);
          };

          // 监听 iframe 内容变化
          if (iframe.contentWindow) {
            const resizeObserver = new ResizeObserver(() => adjustIframeHeight(iframe));
            resizeObserver.observe(iframe.contentWindow.document.body);
          }
        }
      }
    }
  }

  // 楼层初始化设置
  document.querySelector(`input[name="display-mode"][value="${displayMode}"]`).checked = true;
  document.getElementById('activation-mode').value = activationMode;
  document.getElementById('custom-start-floor').value = customStartFloor;
  document.getElementById('custom-end-floor').value = customEndFloor;
  document.getElementById('last-n-floors').value = customEndFloor;

  if (activationMode === 'custom') {
    document.getElementById('custom-floor-settings').style.display = 'block';
  } else if (activationMode === 'lastN') {
    document.getElementById('last-n-settings').style.display = 'block';
  }


  function removeInjectedIframes() {
    const iframes = document.querySelectorAll('.mes_text iframe');
    iframes.forEach(iframe => iframe.remove());

    // 恢复原代码显示
    const codeElements = document.querySelectorAll('.mes_text code');
    codeElements.forEach(code => {
      code.style.display = '';
      const details = code.closest('details');
      if (details) {
        details.parentNode.insertBefore(code, details);
        details.remove();
      }
    });
  }

  function checkLastMesTextChange() {
    const mesTextElements = document.getElementsByClassName('mes_text');
    if (mesTextElements.length > 0) {
      const lastMesText = mesTextElements[mesTextElements.length - 1];
      const codeElement = lastMesText.querySelector('code');
      if (codeElement) {
        const currentContent = codeElement.innerText.trim();
        const injectedIframe = lastMesText.querySelector('iframe');

        // 检查是否有变化或者没有注入的iframe
        if (currentContent !== lastMesTextContent || (isInjectionEnabled && !injectedIframe)) {
          lastMesTextContent = currentContent;
          if (isInjectionEnabled) {
            // 如果已经有iframe，先移除
            if (injectedIframe) {
              injectedIframe.remove();
            }
            // 重新注入
            injectHtmlCode(lastMesText);
          }
        }
      } else {
        // 如果没有code标签，但之前有内容，清除lastMesTextContent
        if (lastMesTextContent !== '') {
          lastMesTextContent = '';
          // 如果有之前注入的iframe，移除它
          const injectedIframe = lastMesText.querySelector('iframe');
          if (injectedIframe) {
            injectedIframe.remove();
          }
        }
      }
    }
  }

  // 监听DOM变化，处理动态加载的内容
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE &&
            (node.classList.contains('mes_text') || node.querySelector('.mes_text'))) {
            if (isInjectionEnabled) {
              injectHtmlCode();
            }
            break;
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // 边缘控制面板位置
  const savedPosition = GM_getValue('edgeControlsPosition', 'top-right');
  document.getElementById('edge-controls-position').value = savedPosition;
  updateEdgeControlsPosition(savedPosition);

  // 每2秒检查一次最后一个 mes_text 的变化
  setInterval(checkLastMesTextChange, 2000);

  // 在主脚本中添加全局音频管理
  function createGlobalAudioManager() {
    let currentPlayingIframeId = null;

    window.addEventListener('message', function (event) {
      if (event.data.type === 'audioPlay') {
        const newIframeId = event.data.iframeId;

        // 如果有其他iframe在播放音频，发送停止指令
        if (currentPlayingIframeId && currentPlayingIframeId !== newIframeId) {
          document.querySelectorAll('iframe').forEach(iframe => {
            iframe.contentWindow.postMessage({
              type: 'stopAudio',
              iframeId: newIframeId
            }, '*');
          });
        }

        currentPlayingIframeId = newIframeId;
      }
    });
  }

  // 初始化设置
  document.querySelector(`input[name="display-mode"][value="${displayMode}"]`).checked = true;

  // 初始化边缘控制面板状态
  updateEdgeControlsDisplay();

  // 在脚本初始化时调用全局音频控制
  createGlobalAudioManager();
})();
