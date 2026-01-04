// ==UserScript==
// @name         阅图标记 (边框标记版)
// @namespace    RANRAN
// @version      1.0
// @description  可配合【阅图标记 (Visited Image Marker)】使用
// @author       Gemini
// @match        http://*/*
// @match        https://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/543800/%E9%98%85%E5%9B%BE%E6%A0%87%E8%AE%B0%20%28%E8%BE%B9%E6%A1%86%E6%A0%87%E8%AE%B0%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543800/%E9%98%85%E5%9B%BE%E6%A0%87%E8%AE%B0%20%28%E8%BE%B9%E6%A1%86%E6%A0%87%E8%AE%B0%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 默认设置与常量 ---
    const STORAGE_KEY_VISITED = 'visitedLinks';
    const STORAGE_KEY_SETTINGS = 'readimage_settings';
    const READ_STATE_CLASS = 'readimage-visited-link';

    const DEFAULTS = {
        unreadWidth: '5px',
        unreadColor: 'rgba(211, 211, 211, 0.7)',
        readWidth: '5px',
        readColor: 'tomato',
        matchingMode: 'blacklist',
        matchingList: [
            'google.com',
            'bing.com',
            'baidu.com'
        ]
    };

    // --- 加载设置 ---
    let settings = { ...DEFAULTS, ...JSON.parse(GM_getValue(STORAGE_KEY_SETTINGS, '{}')) };
    if (!Array.isArray(settings.matchingList)) {
        settings.matchingList = DEFAULTS.matchingList;
    }

    // --- 核心逻辑：检查黑白名单 ---
    function shouldScriptRun() {
        const currentUrl = window.location.href;
        const { matchingMode, matchingList } = settings;

        // v5.1 优化的匹配逻辑：不再使用严格的正则表达式，而是使用更宽容的字符串包含检查
        // 这样用户输入 "example.com" 就能匹配 "https://www.example.com/page"
        const isMatch = matchingList.some(pattern => {
            if (!pattern) return false; // 忽略空行
            // 将 ".*" 形式的简单通配符转为真正的通配符，其他则直接检查是否包含
            if (pattern.includes('*')) {
                 const regex = new RegExp(pattern.replace(/\./g, '\\.').replace(/\*/g, '.*'), 'i');
                 return regex.test(currentUrl);
            }
            return currentUrl.includes(pattern);
        });

        if (matchingMode === 'whitelist') {
            return isMatch;
        } else {
            return !isMatch;
        }
    }

    if (!shouldScriptRun()) {
        return; // 如果不应运行，则停止脚本
    }

    // --- 脚本主要功能 (与之前版本相同) ---
    let visitedLinks = JSON.parse(GM_getValue(STORAGE_KEY_VISITED, '{}'));

    function applyStyles() {
        const styleId = 'readimage-dynamic-styles';
        let styleElement = document.getElementById(styleId);
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = `
            a img {
                border: ${settings.unreadWidth} solid ${settings.unreadColor} !important;
                box-sizing: border-box;
            }
            a.${READ_STATE_CLASS} img {
                border-width: ${settings.readWidth} !important;
                border-color: ${settings.readColor} !important;
            }
        `;
    }

    function markVisitedLinks() {
        document.querySelectorAll('a:has(img)').forEach(link => {
            if (link.href && visitedLinks[link.href]) {
                link.classList.add(READ_STATE_CLASS);
            }
        });
    }

    document.body.addEventListener('click', (event) => {
        const link = event.target.closest('a');
        if (link && link.href && link.querySelector('img')) {
            if (!visitedLinks[link.href]) {
                visitedLinks[link.href] = true;
                link.classList.add(READ_STATE_CLASS);
                GM_setValue(STORAGE_KEY_VISITED, JSON.stringify(visitedLinks));
            }
        }
    }, true);

    // --- 可视化UI模块 (与之前版本相同) ---
    const UI = {
        init() {
            GM_addStyle(`
                #readimage-settings-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 99999; background: #f0f0f0; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); font-family: Arial, sans-serif; font-size: 14px; color: #333; width: 420px; }
                #readimage-settings-panel .ri-header { padding: 10px 15px; background: #e0e0e0; font-weight: bold; border-bottom: 1px solid #ccc; border-radius: 8px 8px 0 0; cursor: move; position: relative; }
                #readimage-settings-panel .ri-close-btn { position: absolute; top: 5px; right: 10px; font-size: 20px; font-weight: bold; cursor: pointer; color: #888; }
                #readimage-settings-panel .ri-close-btn:hover { color: #000; }
                #readimage-settings-panel .ri-body { padding: 15px; max-height: 70vh; overflow-y: auto; }
                #readimage-settings-panel fieldset { border: 1px solid #ccc; border-radius: 4px; padding: 10px; margin-bottom: 15px; }
                #readimage-settings-panel legend { font-weight: bold; padding: 0 5px; }
                #readimage-settings-panel .ri-row { display: flex; align-items: center; margin-bottom: 8px; }
                #readimage-settings-panel .ri-row label { width: 50px; }
                #readimage-settings-panel .ri-row input[type="text"] { flex-grow: 1; border: 1px solid #ccc; border-radius: 4px; padding: 5px; }
                #readimage-settings-panel .ri-row input[type="color"] { margin-left: 10px; border: 1px solid #ccc; padding: 2px; border-radius: 4px; width: 40px; height: 30px; cursor: pointer; }
                #readimage-settings-panel .ri-footer { padding: 10px 15px; background: #e0e0e0; text-align: right; border-top: 1px solid #ccc; border-radius: 0 0 8px 8px; }
                #readimage-settings-panel .ri-footer button { margin-left: 10px; padding: 5px 15px; border: 1px solid #999; border-radius: 4px; cursor: pointer; background: #fff; }
                #readimage-settings-panel .ri-footer button#ri-save-btn { background: #4CAF50; color: white; border-color: #4CAF50; font-weight: bold; }
                #readimage-settings-panel .ri-note { font-size: 12px; color: #666; margin: 5px 0 10px 0; }
                #readimage-settings-panel textarea { width: 95%; min-height: 80px; resize: vertical; padding: 5px; border: 1px solid #ccc; border-radius: 4px; font-family: monospace; }
            `);
        },
        create() {
            if (document.getElementById('readimage-settings-panel')) return;
            const panel = document.createElement('div');
            panel.id = 'readimage-settings-panel';
            panel.innerHTML = `
                <div class="ri-header">脚本设置</div>
                <div class="ri-body">
                    <fieldset>
                        <legend>生效网站设置</legend>
                        <div class="ri-row">
                            <input type="radio" name="ri-mode" id="ri-mode-blacklist" value="blacklist" style="margin-right: 5px;"> <label for="ri-mode-blacklist" style="width: auto;">黑名单模式 (在下列网站<strong style="color:red">不</strong>运行)</label>
                        </div>
                        <div class="ri-row">
                            <input type="radio" name="ri-mode" id="ri-mode-whitelist" value="whitelist" style="margin-right: 5px;"> <label for="ri-mode-whitelist" style="width: auto;">白名单模式 (<strong>只在</strong>下列网站运行)</label>
                        </div>
                        <p class="ri-note">每行一个域名/网址，* 为通配符。例如: example.com</p>
                        <textarea id="ri-matching-list"></textarea>
                    </fieldset>
                    <fieldset>
                        <legend>边框样式设置</legend>
                        <div class="ri-row"> <label for="ri-unread-width">粗细:</label> <input type="text" id="ri-unread-width"> </div>
                        <div class="ri-row"> <label for="ri-unread-color">颜色:</label> <input type="text" id="ri-unread-color"> <input type="color" id="ri-unread-color-picker"> </div>
                        <hr style="border: none; border-top: 1px dashed #ccc; margin: 10px 0;">
                        <div class="ri-row"> <label for="ri-read-width">粗细:</label> <input type="text" id="ri-read-width"> </div>
                        <div class="ri-row"> <label for="ri-read-color">颜色:</label> <input type="text" id="ri-read-color"> <input type="color" id="ri-read-color-picker"> </div>
                    </fieldset>
                </div>
                <div class="ri-footer">
                    <button id="ri-defaults-btn">恢复默认</button>
                    <button id="ri-cancel-btn">取消</button>
                    <button id="ri-save-btn">保存并刷新</button>
                </div>
                <span class="ri-close-btn">&times;</span>
            `;
            document.body.appendChild(panel);
            this.addListeners(panel);
        },
        show() {
            let panel = document.getElementById('readimage-settings-panel');
            if (!panel) { this.create(); panel = document.getElementById('readimage-settings-panel'); }
            panel.querySelector('#ri-unread-width').value = settings.unreadWidth;
            panel.querySelector('#ri-unread-color').value = settings.unreadColor;
            panel.querySelector('#ri-unread-color-picker').value = this.toHex(settings.unreadColor);
            panel.querySelector('#ri-read-width').value = settings.readWidth;
            panel.querySelector('#ri-read-color').value = settings.readColor;
            panel.querySelector('#ri-read-color-picker').value = this.toHex(settings.readColor);
            panel.querySelector(`#ri-mode-${settings.matchingMode}`).checked = true;
            panel.querySelector('#ri-matching-list').value = settings.matchingList.join('\n');
            panel.style.display = 'block';
        },
        hide() {
            const panel = document.getElementById('readimage-settings-panel');
            if (panel) panel.style.display = 'none';
        },
        addListeners(panel) {
            panel.querySelector('.ri-close-btn').addEventListener('click', () => this.hide());
            panel.querySelector('#ri-cancel-btn').addEventListener('click', () => this.hide());
            panel.querySelector('#ri-unread-color-picker').addEventListener('input', (e) => { panel.querySelector('#ri-unread-color').value = e.target.value; });
            panel.querySelector('#ri-read-color-picker').addEventListener('input', (e) => { panel.querySelector('#ri-read-color').value = e.target.value; });
            panel.querySelector('#ri-save-btn').addEventListener('click', () => {
                const newSettings = {
                    unreadWidth: panel.querySelector('#ri-unread-width').value,
                    unreadColor: panel.querySelector('#ri-unread-color').value,
                    readWidth: panel.querySelector('#ri-read-width').value,
                    readColor: panel.querySelector('#ri-read-color').value,
                    matchingMode: panel.querySelector('input[name="ri-mode"]:checked').value,
                    matchingList: panel.querySelector('#ri-matching-list').value.split('\n').map(line => line.trim()).filter(line => line)
                };
                GM_setValue(STORAGE_KEY_SETTINGS, JSON.stringify(newSettings));
                this.hide();
                alert('设置已保存！页面将刷新以应用新规则。');
                window.location.reload();
            });
            panel.querySelector('#ri-defaults-btn').addEventListener('click', () => {
                if (confirm('确定要恢复所有默认设置吗？')) {
                    panel.querySelector('#ri-unread-width').value = DEFAULTS.unreadWidth;
                    panel.querySelector('#ri-unread-color').value = DEFAULTS.unreadColor;
                    panel.querySelector('#ri-unread-color-picker').value = this.toHex(DEFAULTS.unreadColor);
                    panel.querySelector('#ri-read-width').value = DEFAULTS.readWidth;
                    panel.querySelector('#ri-read-color').value = DEFAULTS.readColor;
                    panel.querySelector('#ri-read-color-picker').value = this.toHex(DEFAULTS.readColor);
                    panel.querySelector(`#ri-mode-${DEFAULTS.matchingMode}`).checked = true;
                    panel.querySelector('#ri-matching-list').value = DEFAULTS.matchingList.join('\n');
                }
            });
            this.makeDraggable(panel.querySelector('.ri-header'), panel);
        },
        toHex(colorStr) {
            try { const ctx = document.createElement('canvas').getContext('2d'); ctx.fillStyle = colorStr; return ctx.fillStyle; } catch (e) { return '#000000'; }
        },
        makeDraggable(header, panel) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            header.onmousedown = (e) => {
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
                document.onmousemove = (e) => {
                    e.preventDefault();
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    panel.style.top = (panel.offsetTop - pos2) + "px";
                    panel.style.left = (panel.offsetLeft - pos1) + "px";
                };
            };
        }
    };

    // --- 脚本启动与菜单注册 ---
    function initialize() {
        applyStyles();
        markVisitedLinks();
        const observer = new MutationObserver(markVisitedLinks);
        observer.observe(document.body, { childList: true, subtree: true });
        UI.init();
        GM_registerMenuCommand('打开设置面板', () => UI.show());
        GM_registerMenuCommand('清除所有已读记录', () => {
            if (confirm('您确定要清除所有图片的已读记录吗？此操作不可撤销。')) {
                GM_deleteValue(STORAGE_KEY_VISITED);
                visitedLinks = {};
                alert('所有已读记录已被清除。请刷新页面。');
                window.location.reload();
            }
        });
    }

    initialize();

})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-07-27
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();