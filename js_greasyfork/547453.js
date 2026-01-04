// ==UserScript==
// @name         easy_wsmud2
// @namespace    https://github.com/0x-0cd
// @version      0.0.1
// @description  wsmud2 plugin for simplifying game operations.
// @author       QN
// @match        http://*.wsmud2.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_setClipboard
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @require      https://s4.zstatic.net/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://s4.zstatic.net/ajax/libs/json5/2.2.3/index.min.js
// @require      https://s4.zstatic.net/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/547453/easy_wsmud2.user.js
// @updateURL https://update.greasyfork.org/scripts/547453/easy_wsmud2.meta.js
// ==/UserScript==

(async function () {
    'use strict';


    /****************************************************
                    TODO 💡 WebSocketHook层
    ****************************************************/


    // 开启 DEVMODE 后，会保存所有 WebSocket 通信的数据到插件数据的
    // ws_messages_log 中，可以将其复制到 storage.json 里，然后用
    // scripts/datafilter.ts 脚本分析（需要 Bun 环境）
    const DEVMODE = false;
    // 可以设置过滤指定类型的消息，保持为空则保存全部消息
    const FILTER = [];
    const storageKey = 'ws_messages_log';

    class WebSocketHookManager {
        constructor() {
            this.hooks = [];
            this.hookIndex = 0;
            this.originalWebSocket = unsafeWindow.WebSocket;
            this.ws = null;
            this.originalWsOnMessage = null;
            this.hookWebSocket();
            unsafeWindow.sendCmd = this.sendCmd.bind(this);
        }


        hookWebSocket() {
            const self = this;
            const originalPrototype = self.originalWebSocket.prototype;

            unsafeWindow.WebSocket = function (uri) {
                self.ws = new self.originalWebSocket(uri);
            };

            unsafeWindow.WebSocket.prototype = {
                CONNECTING: originalPrototype.CONNECTING,
                OPEN: originalPrototype.OPEN,
                CLOSING: originalPrototype.CLOSING,
                CLOSED: originalPrototype.CLOSED,

                get url() { return self.ws.url; },
                get protocol() { return self.ws.protocol; },
                get readyState() { return self.ws.readyState; },
                get bufferedAmount() { return self.ws.bufferedAmount; },
                get extensions() { return self.ws.extensions; },
                get binaryType() { return self.ws.binaryType; },
                set binaryType(t) { self.ws.binaryType = t; },
                get onopen() { return self.ws.onopen; },
                set onopen(fn) { self.ws.onopen = fn; },
                get onclose() { return self.ws.onclose; },
                set onclose(fn) { self.ws.onclose = fn; },
                get onerror() { return self.ws.onerror; },
                set onerror(fn) { self.ws.onerror = fn; },
                get onmessage() { return self.originalWsOnMessage; },
                set onmessage(fn) {
                    self.originalWsOnMessage = fn;
                    self.ws.onmessage = self.receiveMessage.bind(self);
                },
                send: function (data) {
                    self.ws.send(data);
                },
                close: function () {
                    self.ws.close();
                }
            };
            console.log('Custom WebSocket has been hooked with prototype properly defined.');
        }


        receiveMessage(message) {
            if (!message || !message.data) return;
            let parsedData;
            try {
                if (message.data[0] === '{' || message.data[0] === '[') {
                    parsedData = JSON5.parse(message.data);
                } else {
                    parsedData = { type: 'text', msg: message.data };
                }
            } catch (e) {
                console.error('Failed to parse WebSocket message data:', e);
                parsedData = { type: 'text', msg: message.data };
            }
            this.runHooks(parsedData.type, parsedData);

            if (DEVMODE) {
                if (FILTER.length === 0 || FILTER.includes(parsedData.type)) {
                    let messages = GM_getValue(storageKey, []);
                    messages.push({
                        data: parsedData
                    });
                    GM_setValue(storageKey, messages);
                    console.log(JSON.stringify(parsedData));
                }
            }

            if (this.originalWsOnMessage) {
                this.originalWsOnMessage.call(this.ws, message);
            }
        }


        runHooks(type, data) {
            for (const hook of this.hooks) {
                if (hook.types.includes(type)) {
                    try {
                        hook.callback(data);
                    } catch (e) {
                        console.error(`Error in hook for type "${type}":`, e);
                    }
                }
            }
        }


        /**
         * 注册一个新的钩子函数，用于处理指定类型的消息。
         * @param {string|string[]} types 要监听的消息类型（例如 'text', ['dialog', 'items']）。
         * @param {Function} callback 当指定类型的消息到达时执行的函数。
         * @returns {number} 新钩子的索引，可用于移除它。
         */
        addHook(types, callback) {
            const hook = {
                index: this.hookIndex++,
                types: Array.isArray(types) ? types : [types],
                callback: callback
            };
            this.hooks.push(hook);
            return hook.index;
        }


        /**
         * 移除一个先前注册的钩子。
         * @param {number} hookIndex `addHook` 函数返回的索引。
         */
        removeHook(hookIndex) {
            this.hooks = this.hooks.filter(hook => hook.index !== hookIndex);
        }


        /**
         * 向服务器发送自定义命令。
         * @param {string} command 要发送的命令字符串。
         */
        sendCmd(command) {
            if (this.ws && this.ws.readyState === this.ws.OPEN) {
                this.ws.send(command);
            } else {
                console.warn('WebSocket connection is not open. Command not sent.');
            }
        }
    }
    const hookManager = new WebSocketHookManager();


    /****************************************************
                    TODO 💡 UI样式层
    ****************************************************/


    // 整体样式
    const overallCss = `
.bottom-icon-container {
    display: flex;
    justify-content: flex-start;
    padding: 2px 1em;
    flex-wrap: wrap;
    margin-bottom: 2px;
}

.unified-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: solid 1px gray;
    color: gray;
    border-radius: 0.4em;
    cursor: pointer;
    min-width: 6em;
    min-height: 2em;
    margin-right: 0.5em;
    position: relative;
    padding-left: 0.4em;
    padding-right: 0.4em;
    margin-bottom: 2px;
    box-sizing: border-box;
    transition: background-color 0.2s linear, border-color 0.2s linear;
    background-color: black;
}

@media (max-width: 640px) {
    .unified-button .icon {
        display: none;
    }

    .unified-button .shortcut {
        display: none;
    }
}

.unified-button-wrapper {
    position: relative;
}

.vertical-button-list {
    display: none;
    position: absolute;
    bottom: 100%;
    left: 0;
    z-index: 10;
    flex-direction: column;
}

.vertical-button-list .unified-button {
    margin-bottom: 2px;
    width: 100%;
}

.prompt-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.prompt-modal {
    background-color: #1a1a1a;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #444;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
    color: #eee;
}

.prompt-modal label {
    display: block;
    margin-bottom: 5px;
    color: #bbb;
    font-size: 0.9em;
}

.prompt-input,
.prompt-select {
    width: 100%;
    margin-bottom: 15px;
    background-color: #111;
    color: #ddd;
    border: 1px solid gray;
    padding: 8px;
    box-sizing: border-box;
    border-radius: 4px;
}

.prompt-button-container {
    margin-top: 20px;
    text-align: right;
}

.prompt-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: solid 1px gray;
    color: gray;
    border-radius: 0.4em;
    cursor: pointer;
    min-width: 5em;
    padding: 8px 12px;
    margin-left: 10px;
    transition: background-color 0.2s linear, border-color 0.2s linear, color 0.2s linear;
    background-color: #333;
}

.prompt-button:hover {
    background-color: #555;
    border-color: white;
    color: white;
}
    `;

    // 通用按钮
    const unifiedButton = `<span class="unified-button"></span>`;

    // 底部按钮栏
    const bottomIconList = `
<div class="bottom-icon-container">
    <div class="unified-button-wrapper">
      <span class="unified-button" id="short-cut-container-button">
        <span class="icon">🕹️</span>
        <span class="text">快捷</span></span>
      <div class="vertical-button-list">
        <span class="unified-button" id="kill-all">
          <span class="icon">🔪</span>
          <span class="text">击杀</span>
          <span class="shortcut">(E)</span></span>
        <span class="unified-button" id="get-all">
          <span class="icon">🫳</span>
          <span class="text">拾取</span>
          <span class="shortcut">(R)</span></span>
        <span class="unified-button" id="sell-all">
          <span class="icon">💰</span>
          <span class="text">清包</span>
          <span class="shortcut">(T)</span></span>
        <span class="unified-button" id="work">
          <span class="icon">⛏️</span>
          <span class="text">挖矿</span>
          <span class="shortcut">(Y)</span></span>
      </div>
    </div>
    <div class="unified-button-wrapper">
      <span class="unified-button" id="equipment-container-button">
        <span class="icon">🗡️</span>
        <span class="text">装备</span></span>
      <div class="vertical-button-list">
        <span class="unified-button" id="upgrade">
          <span class="icon">🔨</span>
          <span class="text">强化</span></span>
        <span class="unified-button" id="equipment-plan">
          <span class="icon">🗒️</span>
          <span class="text">方案</span></span>
        <span class="unified-button" id="equipment-set">
          <span class="icon">🧥</span>
          <span class="text">套装</span></span>
        <span class="unified-button" id="unequip-all">
          <span class="icon">❌</span>
          <span class="text">脱光</span></span>
      </div>
    </div>
    <div class="unified-button-wrapper">
      <span class="unified-button" id="skill-container-button">
        <span class="icon">🔮</span>
        <span class="text">技能</span></span>
      <div class="vertical-button-list">
        <span class="unified-button" id="skill-calculate">
          <span class="icon">🧮</span>
          <span class="text">计算</span></span>
        <span class="unified-button" id="skill-plan">
          <span class="icon">📝</span>
          <span class="text">方案</span></span>
        <span class="unified-button" id="unskill-all">
          <span class="icon">❌</span>
          <span class="text">脱光</span></span>
      </div>
    </div>
    <div class="unified-button-wrapper">
      <span class="unified-button" id="other-container-button">
        <span class="icon">⚙️</span>
        <span class="text">其他</span></span>
      <div class="vertical-button-list">
        <span class="unified-button" id="repo-link">
          <span class="icon">⭐️</span>
          <span class="text">代码</span></span>
        <span class="unified-button" id="inject-runtime">
          <span class="icon">⚠️</span>
          <span class="text">注入</span></span>
        <span class="unified-button" id="settings">
          <span class="icon">🛠️</span>
          <span class="text">设置</span></span>
      </div>
    </div>
  </div>
    `;

    // const modalHtml1 = `
    //             <div class="prompt-overlay">
    //                 <div class="prompt-modal">
    //                     <label for="upgrade-item-select">选择要强化的装备:</label>
    //                     <select id="upgrade-item-select" style="width: 100%; margin-bottom: 10px; background-color: #111; color: #ddd; border: 1px solid gray;">
    //                         ${optionsHtml}
    //                     </select>

    //                     <label for="upgrade-count">强化次数:</label>
    //                     <input type="number" id="upgrade-count" min="1" style="width: 100%; margin-bottom: 10px; background-color: #111; color: #ddd; border: 1px solid gray;">

    //                     <div style="margin-top: 15px; text-align: right;">
    //                         <span class="zdy-item" id="upgrade-ok">
    //                             <span class="text">确定</span>
    //                         </span>
    //                         <span class="zdy-item" id="upgrade-cancel">
    //                             <span class="text">取消</span>
    //                         </span>
    //                     </div>
    //                 </div>
    //             </div>
    //             `;

    // const modalHtml2 = `
    //             <div class="prompt-overlay">
    //                 <div class="prompt-modal">
    //                     <p>保存当前装备的强化方案，请输入方案名称：</p>
    //                     <input type="text" id="plan-name-input" style="width: 100%; margin-bottom: 10px; background-color: #111; color: #ddd; border: 1px solid gray; box-sizing: border-box; padding: 5px;">
    //                     <div style="text-align: right; margin-top: 15px;">
    //                         <span class="zdy-item" id="save-plan-ok">
    //                             <span class="text">确定</span>
    //                         </span>
    //                         <span class="zdy-item" id="save-plan-cancel">
    //                             <span class="text">取消</span>
    //                         </span>
    //                     </div>
    //                 </div>
    //             </div>
    //             `;

    // const modalHtml3 = `
    //             <div class="prompt-overlay">
    //                 <div class="prompt-modal">
    //                     <p>请输入要注入的代码：</p>
    //                     <textarea id="multiline-input"></textarea>
    //                     <p>⚠️ 注入代码有安全隐患，请确保你完全理解注入代码的功能，插件作者不对任何因代码注入造成的损失负责！</p>
    //                     <div style="text-align: right;">
    //                         <span class="zdy-item" id="prompt-ok">
    //                             <span class="text">确定</span>
    //                         </span>
    //                         <span class="zdy-item" id="prompt-cancel">
    //                             <span class="text">取消</span>
    //                         </span>
    //                     </div>
    //                 </div>
    //             </div>
    //             `;

    // 技能潜能计算面板
    const skillPotentialCal = `
<div class="prompt-overlay">
  <div class="prompt-modal">
    <label for="start-level">起始等级:</label>
    <input type="number" id="start-level" class="prompt-input" min="0">
    <label for="end-level">目标等级:</label>
    <input type="number" id="end-level" class="prompt-input" min="1">
    <label for="color-select">选择颜色:</label>
    <select id="color-select" class="prompt-select">
      <option value="1">白</option>
      <option value="2">绿</option>
      <option value="3">蓝</option>
      <option value="4">黄</option>
      <option value="5">紫</option>
      <option value="6">橙</option>
      <option value="7">红</option>
    </select>
    <div class="prompt-button-container">
      <span class="prompt-button" id="calc-ok">
        <span class="text">计算</span>
      </span>
      <span class="prompt-button" id="calc-cancel">
        <span class="text">取消</span>
      </span>
    </div>
  </div>
</div>
    `;


    /****************************************************
                    TODO 💡 UI实现层
    ****************************************************/


    class UIManager {
        constructor() {
            this.uiAdded = false;
            this.uiReadyPromise = new Promise(resolve => {
                this.uiResolve = resolve;
            });
            this.init();
        }

        init() {
            // 添加 CSS 样式
            GM_addStyle(overallCss);
            // 添加 login 钩子
            this.loginHook = hookManager.addHook('login', this.handleLogin.bind(this));
        }

        handleLogin() {
            if (!this.uiAdded) {
                this.addUI();
                this.uiAdded = true;
                hookManager.removeHook(this.loginHook);
                this.uiResolve();
            }
        }

        addUI() {
            if ($('.bottom-icon-container').length > 0) {
                return;
            }

            $(() => {
                const contentMessage = $('.content-message');
                if (contentMessage.length) {
                    contentMessage.after(bottomIconList);
                } else {
                    alert('页面元素加载失败，请刷新页面！');
                }
                this.addStyleEvent();
            });
        }

        // 添加样式事件（比如面板展开折叠）
        // 注意： 这里的事件只能改变 UI 外观，禁止在此处实现任何按钮的实际功能逻辑
        addStyleEvent() {
            // 更改原生的底部栏背景色
            $('.bottom-bar').css('background-color', 'rgb(34, 34, 34)');

            // 通用按钮动画效果
            $('.unified-button').mouseenter(function () {
                $(this).css("background-color", "rgba(128, 128, 128, 0.75)");
                $(this).css("border-color", "white");
            });
            $('.unified-button').mouseleave(function () {
                $(this).css("background-color", "black");
                $(this).css("border-color", "gray");
            });
            $('.unified-button').click(function () {
                $(this).css("background-color", "rgba(128, 128, 128, 0.3)");
                $(this).css("border-color", "white");
                setTimeout(() => {
                    $(this).css("background-color", "black");
                    $(this).css("border-color", "gray");
                }, 100);
            });

            // 底部按钮的列表悬浮
            $('.unified-button-wrapper').mouseenter(function () {
                if (!$(this).hasClass('pinned')) {
                    $(this).find('.vertical-button-list').stop(true, true).slideDown(200);
                }
            });
            $('.unified-button-wrapper').mouseleave(function () {
                if (!$(this).hasClass('pinned')) {
                    $(this).find('.vertical-button-list').stop(true, true).slideUp(200);
                }
            });

            // “快捷”列表的点击固定
            $('#short-cut-container-button').on('click', function () {
                const $wrapper = $(this).closest('.unified-button-wrapper');
                $wrapper.toggleClass('pinned');

                if ($wrapper.hasClass('pinned')) {
                    $wrapper.find('.vertical-button-list').stop(true, true).slideDown(200);
                } else {
                    $wrapper.find('.vertical-button-list').stop(true, true).slideUp(200);
                }
            });

            // “装备”列表的点击固定
            $('#equipment-container-button').on('click', function () {
                const $wrapper = $(this).closest('.unified-button-wrapper');
                $wrapper.toggleClass('pinned');

                if ($wrapper.hasClass('pinned')) {
                    $wrapper.find('.vertical-button-list').stop(true, true).slideDown(200);
                } else {
                    $wrapper.find('.vertical-button-list').stop(true, true).slideUp(200);
                }
            });

            // “技能”列表的点击固定
            $('#skill-container-button').on('click', function () {
                const $wrapper = $(this).closest('.unified-button-wrapper');
                $wrapper.toggleClass('pinned');

                if ($wrapper.hasClass('pinned')) {
                    $wrapper.find('.vertical-button-list').stop(true, true).slideDown(200);
                } else {
                    $wrapper.find('.vertical-button-list').stop(true, true).slideUp(200);
                }
            });

            // “其他”列表的点击固定
            $('#other-container-button').on('click', function () {
                const $wrapper = $(this).closest('.unified-button-wrapper');
                $wrapper.toggleClass('pinned');

                if ($wrapper.hasClass('pinned')) {
                    $wrapper.find('.vertical-button-list').stop(true, true).slideDown(200);
                } else {
                    $wrapper.find('.vertical-button-list').stop(true, true).slideUp(200);
                }
            });

            // 在空白处点击，关闭所有已固定的列表
            $(document).on('click', function (e) {
                if (!$(e.target).closest('.unified-button-wrapper').length) {
                    $('.unified-button-wrapper.pinned').each(function () {
                        $(this).removeClass('pinned');
                        $(this).find('.vertical-button-list').stop(true, true).slideUp(200);
                    });
                }
            });
        }

        generateButton(id, icon, text, shortcut) {
            const $btn = $(unifiedButton).attr("id", id);
            if ('' !== icon) {
                $btn.append(`<span class="icon">${icon}</span>`);
            }
            if ('' !== text) {
                $btn.append(`<span class="text">${text}</span>`);
            }
            if ('' !== shortcut) {
                $btn.append(`<span class="shortcut">${shortcut}</span>`);
            }
            return $btn;
        }
    }
    const uiManager = new UIManager();
    await uiManager.uiReadyPromise;


    /****************************************************
                    TODO 💡 事件绑定层
    ****************************************************/


    /*
//--------------------------------------------------
// 折叠的装备快捷操作
const $foldingEquipments = $('#folding_equipments_container');
$('#folding_equipments').on('click', function (e) {
    e.stopPropagation();
    $foldingEquipments.toggleClass('is-open');
});

$('#upgrade').on('click', () => {
    let upgradeableItems = [];
    packageItems.forEach(item => {
        if (item[6] === 1 && item[3] > 0) {
            upgradeableItems.push([item[0], item[1]]);
        }
    });

    if (upgradeableItems.length === 0) {
        alert('背包里没有可强化的装备！');
        return;
    }

    const optionsHtml = upgradeableItems.map(item =>
        `<option value="${item[1]}">${item[0]}</option>`
    ).join('');


    $('body').append(modalHtml1);

    $('#upgrade-count').on('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    $('#upgrade-ok').on('click', async () => {
        const itemId = $('#upgrade-item-select').val();
        const count = $('#upgrade-count').val();
        const command = `jinglian ${itemId} ok`;
        for (let i = 0; i < count; i++) {
            hookManager.sendCmd(command);
        }
        $('.prompt-overlay').remove();
    });

    $('#upgrade-cancel').on('click', () => {
        $('.prompt-overlay').remove();
    });
});

$('#equipment_plan').on('click', function (e) {
    e.stopPropagation();
    $foldingEquipments.addClass('is-open');
    $(this).parent().toggleClass('is-submenu-open');
});

$('#save_plan').on('click', () => {
    $('body').append(modalHtml2);

    $('#save-plan-ok').on('click', () => {
        const name = $('#plan-name-input').val();
        if (name) {
            // TODO 实现保存方案
            alert(`方案【${name}】已保存！`);
        }
        $('.prompt-overlay').remove();
    });

    $('#save-plan-cancel').on('click', () => {
        $('.prompt-overlay').remove();
    });
});

$('#delete_plan').on('click', () => {
    // TODO 实现删除方案
});

$('#eq_0').on('click', () => {
    for (const eq of equipments) {
        if (eq) {
            const command = `uneq ${eq[1]}`;
            hookManager.sendCmd(command);
        }
    }
});

$('#eq_1').on('click', async () => {
    try {
        await clickAndWait(() => this.doCommand('pack'), `[for="1"]`);
        await clickAndWait(`[for="1"]`, '.dialog-close');
        this.doCommand('pack');
    } catch (error) {
        console.log(error);
        this.doCommand('pack');
    }
});

$('#eq_2').on('click', async () => {
    try {
        await clickAndWait(() => this.doCommand('pack'), `[for="2"]`);
        await clickAndWait(`[for="2"]`, '.dialog-close');
        this.doCommand('pack');
    } catch (error) {
        console.log(error);
        this.doCommand('pack');
    }
});

$('#eq_3').on('click', async () => {
    try {
        await clickAndWait(() => this.doCommand('pack'), `[for="3"]`);
        await clickAndWait(`[for="3"]`, '.dialog-close');
        this.doCommand('pack');
    } catch (error) {
        console.log(error);
        this.doCommand('pack');
    }
});

//--------------------------------------------------
// 折叠的其他快捷操作
const $foldingOptions = $('#folding_options_container');
$('#folding_options').on('click', function (e) {
    e.stopPropagation();
    $foldingOptions.toggleClass('is-open');
});

$(document).on('click', function (e) {
    if ($foldingOptions.hasClass('is-open') && !$foldingOptions.is(e.target) && $foldingOptions.has(e.target).length === 0) {
        $foldingOptions.removeClass('is-open');
    }
    if ($foldingEquipments.hasClass('is-open') && !$foldingEquipments.is(e.target) && $foldingEquipments.has(e.target).length === 0) {
        $foldingEquipments.removeClass('is-open');
    }
});



// TODO 测试功能，后面应该移除掉
$('#inject_runtime').on('click', () => {
    $('body').append(modalHtml3);

    $('#prompt-ok').on('click', () => {
        const code = $('#multiline-input').val();
        if (code) {
            injectRuntime(code);
        }
        $('.prompt-overlay').remove();
    });

    $('#prompt-cancel').on('click', () => {
        $('.prompt-overlay').remove();
    });
});

// Add keyboard shortcuts

*/

    // 键盘按键监听
    $(document).on("keydown", (e) => {
        // 如果当前焦点在输入框或文本框中，则不执行任何操作
        if ($('input').is(':focus') || $('textarea').is(':focus')) {
            return;
        }

        // 绑定单按键按下事件
        const keyCode = e.keyCode;

        // 方向键和小键盘移动
        let direction = '';
        switch (keyCode) {
            case 104: // 小键盘8
            case 38: // 上方向键
                direction = fixDirection('north');
                break;
            case 98: // 小键盘2
            case 40: // 下方向键
                direction = fixDirection('south');
                break;
            case 100: // 小键盘4
            case 37: // 左方向键
                direction = fixDirection('west');
                break;
            case 102: // 小键盘6
            case 39: // 右方向键
                direction = fixDirection('east');
                break;
            case 105: // 小键盘9
                direction = fixDirection('northeast');
                break;
            case 99: // 小键盘3
                direction = fixDirection('southeast');
                break;
            case 103: // 小键盘7
                direction = fixDirection('northwest');
                break;
            case 97: // 小键盘1
                direction = fixDirection('southwest');
                break;
        }

        if ('' !== direction) {
            hookManager.sendCmd(`go ${direction}`);
            return;
        }

        // 其他按键绑定
        switch (keyCode) {
            case 27: // Esc 关闭菜单按钮
                $('.dialog-close').click();
                break;
            case 192: // ` 小地图
                $('.map-icon').click();
                break;
            case 32: // Space 底部确认窗口的确认按钮
                if ($('.dialog-confirm').is(':visible') && roomExits.allowMove) {
                    roomExits.allowMove = false;
                    $('.dialog-btn.btn-ok').click();
                    setTimeout(() => {
                        roomExits.allowMove = true;
                    }, 100);
                }
                break;
            case 13: // Enter 聊天框
                doCommand('showchat');
                break;
            case 65: // A 动作栏
                doCommand('showcombat');
                break;
            case 66: // B 背包
                doCommand('pack');
                break;
            case 67: // C 右侧快捷键列表
                doCommand('showtool');
                break;
            case 69: // E 击杀全部
                $('#kill_all').click();
                break;
            case 73: // I 排行
                doCommand('stats');
                break;
            case 74: // J 江湖
                doCommand('jh');
                break;
            case 75: // K 技能
                doCommand('skills');
                break;
            case 76: // L 任务
                doCommand('tasks');
                break;
            case 79: // O 属性
                doCommand('score');
                break;
            case 80: // P 商城
                doCommand('shop');
                break;
            case 82: // R 全部拾取
                $('#get_all').click();
                break;
            case 83: // S 停止当前活动
                doCommand('stopstate');
                break;
            case 84: // T 清包
                $('#sell_all').click();
                break;
            case 85: // U 社交
                doCommand('message');
                break;
            case 89: // Y 挖矿/修炼
                $('#work').click();
                break;
            case 188: // , 设置
                doCommand('setting');
                break;
        }
    });

    // 击杀按钮事件
    $(document).on('click', '#kill_all', function () {
        const killAllButton = $(`[cmd="#kill @npc"]`);
        if (killAllButton.length) {
            killAllButton.click();
        } else {
            hookManager.sendCmd("tm 请在【设置-扩展】中开启全部击杀和全部拾取！");
        }
    });

    // 拾取按钮事件
    $(document).on('click', '#get_all', function () {
        const getAllButton = $(`[cmd="#get all from @item(尸体)"]`);
        if (getAllButton.length) {
            getAllButton.click();
        } else {
            hookManager.sendCmd("tm 请在【设置-扩展】中开启全部击杀和全部拾取！");
        }
    });

    // 清包按钮事件
    $(document).on('click', '#sell-all', async function () {
        const clearBagSequence = [
            { action: () => doCommand('pack'), wait: '[for="cleanup"]' },
            { action: () => $('[for="cleanup"]').click(), wait: '[for="sell"]' },
            { action: () => $('[for="sell"]').click(), wait: '[for="cleanup"]' },
            { action: () => $('[for="cleanup"]').click(), wait: '[for="store"]' },
            { action: () => $('[for="store"]').click(), wait: '.dialog-close' }
        ];

        try {
            await executeSequence(clearBagSequence);
            doCommand('pack');
        } catch (error) {
            console.log(error);
        }
    });

    // 挖矿/修炼按钮事件
    $(document).on('click', '#work', function () {
        // TODO 根据角色境界刷新工作按钮并做出对应操作
        if (true) {
            hookManager.sendCmd('wakuang');
        } else {
            hookManager.sendCmd('xiulian');
        }
    });

    // 技能计算按钮事件
    $(document).on('click', '#skill-calculate', function () {
        $('body').append(skillPotentialCal);

        $('#start-level, #end-level').on('input', function () {
            this.value = this.value.replace(/[^0-9]/g, '');
        });

        $('#calc-ok').on('click', () => {
            const startLevel = $('#start-level').val();
            const endLevel = $('#end-level').val();
            const color = $('#color-select').val();
            const potential = calculatePotential(startLevel, endLevel, color);
            const formattedPotential = new Intl.NumberFormat('en-US').format(potential);
            const content = `<wht>==========⚔️⚔️⚔️==========</wht>
                                <wht>潜能消耗: </wht><hio>${formattedPotential}</hio>
                                <wht>==========⚔️⚔️⚔️==========</wht>
                                `;
            $('.content-message pre').append(content);
            $('.prompt-overlay').remove();
        });

        $('#calc-cancel').on('click', () => {
            $('.prompt-overlay').remove();
        });
    });

    // 代码按钮事件
    $(document).on('click', '#repo-link', function () {
        window.open('https://github.com/0x-0cd/easy_wsmud2', '_blank');
    });

    /****************************************************
                    TODO 💡 工具函数层
     ****************************************************/


    /// 工具函数和功能函数的区别：
    /// 工具函数是脚本的“系统级”代码逻辑的抽象和解耦，原则上不提供给流程触发使用
    /// 功能函数是游戏内部分实用功能的封装，可以被流程触发使用

    /**
     * 在脚本中注入一段 JavaScript 代码
     * @param {string} code 需要注入的 JavaScript 代码 
     */
    function injectRuntime(code) {
        try {
            eval(code);
        } catch (e) {
            console.error(`Error in runtime code: ${e}`);
        }
    }

    /**
     * 由于武神2对代码做了混淆，部分武神1命令可能无法被正确识别出来，但是页面对应
     * 元素的标签属性还包含了这些命令。这个函数可以执行那些被混淆的命令。
     * @param {string} cmd 命令
     */
    function doCommand(cmd) {
        const button = $(`[command="${cmd}"]`);
        if (button.length) {
            button.click();
        } else {
            hookManager.sendCmd(cmd);
        }
    }

    /**
     * 执行一个动作，然后等待一个元素出现。这是函数式序列的基础。
     * @param {function} actionFn - 要执行的动作函数。
     * @param {string} waitSelector - 等待出现的目标元素的选择器。
     * @param {number} [timeout=2000] - 超时时间（毫秒）。
     * @returns {Promise<jQuery>} - 一个 Promise，成功时会返回目标元素的 jQuery 对象。
     */
    function performActionAndWait(actionFn, waitSelector, timeout = 2000) {
        try {
            actionFn();
        } catch (error) {
            return Promise.reject(error);
        }
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                const $targetEl = $(waitSelector);
                if ($targetEl.length > 0 && $targetEl.is(':visible')) {
                    clearInterval(interval);
                    resolve($targetEl);
                }
            }, 10);
            setTimeout(() => {
                clearInterval(interval);
                reject(new Error(`Timeout waiting for element: ${waitSelector}`));
            }, timeout);
        });
    }

    /**
     * 按顺序执行一系列异步操作。
     * @param {Array<Object>} steps - 操作步骤数组，每个对象包含 action (函数) 和 wait (选择器)。
     */
    async function executeSequence(steps) {
        for (const step of steps) {
            await performActionAndWait(step.action, step.wait);
        }
    }

    /**
     * 从一个名字 html 标签中提取出人物的真实名字
     * @param {string} htmlName 原始的名字 html
     * @returns {string} 人物真实名字
     */
    function fixName(htmlName) {
        let nameStr = htmlName;
        if (nameStr.includes('<')) {
            // 大于普通百姓等级的人物都是以颜色标签开头的
            if (nameStr.startsWith('<')) {
                nameStr = nameStr.match(/<[a-z]{3}>(.*?)<\/[a-z]{3}>/)[1];
            } else {
                // 普通百姓在挖矿、断线的时候名字里也有颜色标签
                const end = nameStr.indexOf('<');
                nameStr = nameStr.substring(0, end);
            }
        }
        const l = nameStr.split(' ');
        nameStr = l[l.length - 1];
        return nameStr;
    }

    // 方向别名
    const aliasUp = ['up', 'northup', 'northdown']; // 上
    const aliasDown = ['southup', 'southdown', 'down']; // 下
    const aliasLeft = ['westup', 'westdown']; // 左
    const aliasRight = ['eastup', 'eastdown']; // 右
    const aliasUpLeft = []; // 左上
    const aliasUpRight = ['up', 'enter']; // 右上
    const aliasDownLeft = ['out']; // 左下
    const aliasDownRight = ['down']; // 右下
    /**
     * 基于当前房间的可移动方向，将目标方向修正为有效值
     * @param {string} direction 
     */
    function fixDirection(direction) {
        if (roomExits.exits.includes(direction)) {
            // 方向有效，直接返回
            return direction;
        }

        // 原始方向无效，检查是否存在方向别名
        switch (direction) {
            case 'north':
                const validUp = _.intersection(roomExits.exits, aliasUp);
                if (validUp.length > 0) {
                    return validUp[0];
                }
                break;
            case 'south':
                const validDown = _.intersection(roomExits.exits, aliasDown);
                if (validDown.length > 0) {
                    return validDown[0];
                }
                break;
            case 'east':
                const validRight = _.intersection(roomExits.exits, aliasRight);
                if (validRight.length > 0) {
                    return validRight[0];
                }
                break;
            case 'west':
                const validLeft = _.intersection(roomExits.exits, aliasLeft);
                if (validLeft.length > 0) {
                    return validLeft[0];
                }
                break;
            case 'northwest':
                const validUpLeft = _.intersection(roomExits.exits, aliasUpLeft);
                if (validUpLeft.length > 0) {
                    return validUpLeft[0];
                }
                break;
            case 'northeast':
                const validUpRight = _.intersection(roomExits.exits, aliasUpRight);
                if (validUpRight.length > 0) {
                    return validUpRight[0];
                }
                break;
            case 'southwest':
                const validDownLeft = _.intersection(roomExits.exits, aliasDownLeft);
                if (validDownLeft.length > 0) {
                    return validDownLeft[0];
                }
                break;
            case 'southeast':
                const validDownRight = _.intersection(roomExits.exits, aliasDownRight);
                if (validDownRight.length > 0) {
                    return validDownRight[0];
                }
                break;
        }

        // 没有匹配到别名，返回
        $('.content-message pre').append(`<him>当前房间没有方向 ${direction}， 可用的方向：${roomExits.exits}</him>
        `);
        return '';
    }


    /****************************************************
                    TODO 💡 功能函数层
    ****************************************************/


    /**
     * 等待指定时间
     * @param {number} duration 等待时间，单位毫秒
     * @returns {Promise<void>} 一个 Promise，在指定时间后 resolve
     */
    async function sleep(duration) {
        return new Promise(resolve => setTimeout(resolve, duration));
    }
    /**
     * 计算升级技能的潜能消耗
     * @param {number} start 起始等级
     * @param {number} end 目标等级
     * @param {number} level 技能颜色
     * @returns {number} 潜能消耗
     */
    function calculatePotential(start, end, level) {
        if (end < start) {
            return 0;
        }
        const base = 2.5 * (end * end - start * start);
        const result = base * level;
        return Math.floor(result);
    }


    /****************************************************
                    TODO 💡 初始化层
    ****************************************************/


    // 展开侧栏和动作栏
    doCommand('showtool');
    doCommand('showcombat');

    // TODO 下面这些模块的初步实现直接使用了原始的 JSON 数据，后续可以考虑对数据进行一些处理以提高性能

    /*
     * roomExits - <object> 房间出口信息
     * roomItems - <list> 房间里所有对象的信息
     * combating - <boolean> 人物是否在战斗
     * state - <stateEnum> 人物状态
     */

    //--------------------------------------------------
    // 房间出口监控
    let roomExits = {
        exits: [],
        allowMove: true,
    };
    hookManager.addHook('exits', (data) => {
        if (data.items) {
            roomExits.exits = Object.keys(data.items);
        }
    });

    //--------------------------------------------------
    // 房间人物监控
    let roomItems = [];
    hookManager.addHook('items', (data) => {
        roomItems = data.items;
    });
    hookManager.addHook('itemadd', (data) => {
        const fixedData = {
            id: data.id,
            name: data.name,
            mp: data.mp,
            hp: data.hp,
            max_mp: data.max_mp,
            max_hp: data.max_hp,
            status: data.status,
        };
        roomItems.push(fixedData);
    });
    hookManager.addHook('itemremove', (data) => {
        roomItems = roomItems.filter(item => item.id !== data.id);
    });

    //--------------------------------------------------
    // 战斗状态监控
    let combating = false;
    hookManager.addHook('combat', (data) => {
        if (data.start) {
            combating = true;
        } else {
            combating = false;
        }
    });

    //--------------------------------------------------
    // 人物状态监控
    const stateEnum = {
        FREE: 0, // 发呆
        LIAOSHANG: 1, // 疗伤
        DAZUO: 2, // 打坐
        XUEXI: 3, // 学习
        LIANXI: 4, // 练习
        WAKUANG: 5, // 挖矿
        XIULIAN: 6, // 修炼

        UNKNOWN: 99, // 未知
    };
    let state = stateEnum.FREE;
    hookManager.addHook('state', (data) => {
        if (!data.state) {
            state = stateEnum.FREE;
            return;
        }
        const stateStr = data.state;
        if (stateStr.includes('疗伤')) {
            state = stateEnum.LIAOSHANG;
        } else if (stateStr.includes('打坐')) {
            state = stateEnum.DAZUO;
        } else if (stateStr.includes('学习')) {
            state = stateEnum.XUEXI;
        } else if (stateStr.includes('练习')) {
            state = stateEnum.LIANXI;
        } else if (stateStr.includes('挖矿')) {
            state = stateEnum.WAKUANG;
        } else if (stateStr.includes('修炼')) {
            state = stateEnum.XIULIAN;
        } else {
            state = stateEnum.UNKNOWN;
        }
    });

    //--------------------------------------------------
    // TODO 人物背包和装备监控，目前只做了初始化，还要实时监控物品刷新和装备更换
    let packageItems = [];
    let equipments = [];
    let dialogHook = hookManager.addHook('dialog', (data) => {
        packageItems = data.items;
        equipments = data.eqs.forEach(() => { });
    });
    // await clickAndWait(() => doCommand('pack'), '.dialog-close');
    // doCommand('pack');
    hookManager.removeHook(dialogHook);

    //--------------------------------------------------
    // 人物 buff 监控
    // let buffMap = new Map();
    // hookManager.addHook('status', (data) => {
    //     const action = data.action;
    //     if ('add' === action) {
    //         const id = data.id;
    //         // 获取 id 人物当前已经存在的 buff（如果有的话）
    //         let current = [];
    //         if (buffMap.has(id)) {
    //             current = buffMap.get(id);
    //         }
    //         // 检查是否已经存在 buff
    //         let buff = current.find(b => b.sid === data.sid);
    //         if (buff) {
    //             // 如果已经存在对应 buff，则更新层数和时间
    //             buff.count = data.count || -1;
    //             buff.time = Date.now();
    //             buff.duration = data.duration;
    //         } else {
    //             // 否则创建新的 buff
    //             buff = {
    //                 sid: data.sid,
    //                 name: data.name,
    //                 time: Date.now(),
    //                 duration: data.duration,
    //                 count: data.count || -1,
    //             };
    //             current.push(data.name);
    //         }
    //         buffMap.set(id, current);
    //     } else {
    //         // 移除 buff
    //         if (!buffMap.has(data.id)) {
    //             return;
    //         }
    //         let current = buffMap.get(data.id);
    //         current = current.filter(buff => buff.sid !== data.sid);
    //         if (current.length === 0) {
    //             buffMap.delete(data.id);
    //         } else {
    //             buffMap.set(data.id, current);
    //         }
    //     }
    // });

    // setInterval(() => {
    //     console.log(buffMap);
    // }, 5000);


    /****************************************************
                    TODO 💡 流程触发层
    ****************************************************/


    // 在这里写代码


    /****************************************************
                    TODO 💡 占位层
    ****************************************************/

})();
