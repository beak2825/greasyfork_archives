// ==UserScript==
// @name         芒果TV网页版弹幕增强
// @namespace    http://tampermonkey.net/
// @version      2.1.3
// @description  芒果TV弹幕增强脚本：自动关闭弹幕、快捷键操作（D键切换弹幕/F键全屏）、高级屏蔽词设置（不限数量、支持正则表达式、导入导出功能、本地持久化存储）
// @author       mankaki
// @match        *://www.mgtv.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mgtv.com
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/515421/%E8%8A%92%E6%9E%9CTV%E7%BD%91%E9%A1%B5%E7%89%88%E5%BC%B9%E5%B9%95%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/515421/%E8%8A%92%E6%9E%9CTV%E7%BD%91%E9%A1%B5%E7%89%88%E5%BC%B9%E5%B9%95%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let autoCloseDanmu = JSON.parse(localStorage.getItem('autoCloseDanmu')) ?? true;
    let networkErrorFlag = false;
    let lastUrl = window.location.href;
    let isManualIntervention = false; // 标记用户本集是否手动干预过（手动开启或关闭）
    let lastManualTime = 0; // 上次手动操作的时间戳，用于冷却锁定
    let isScriptClicking = false; // 标记是否是脚本触发的点击，用于识别用户手动操作

    function createTooltip(text, direction = 'top') {
        const tooltip = document.createElement('div');
        tooltip.innerText = text;
        tooltip.style.position = 'fixed';
        tooltip.style.padding = '6px 10px';
        tooltip.style.fontSize = '13px';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        tooltip.style.color = '#fff';
        tooltip.style.borderRadius = '6px';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.zIndex = '10000';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.transition = 'opacity 0.2s ease';
        tooltip.style.opacity = '0';

        if (direction === 'left') {
            tooltip.style.transform = 'translate(-105%, -50%)';
        } else {
            tooltip.style.transform = 'translate(-50%, -120%)';
        }

        return tooltip;
    }

    function addTooltip(button, text, direction) {
        if (!button || button.dataset.tooltipAttached) return;
        button.dataset.tooltipAttached = 'true';

        const tooltip = createTooltip(text, direction);
        document.body.appendChild(tooltip);

        button.addEventListener('mouseenter', () => {
            // 全屏模式下，必须将 Tooltip 移动到全屏元素内部，否则会被遮挡
            const container = document.fullscreenElement || document.body;
            if (tooltip.parentNode !== container) {
                container.appendChild(tooltip);
            }
            tooltip.style.zIndex = '2147483647';

            const rect = button.getBoundingClientRect();
            if (direction === 'left') {
                tooltip.style.left = `${rect.left}px`;
                tooltip.style.top = `${rect.top + rect.height / 2}px`;
            } else {
                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                tooltip.style.top = `${rect.top}px`;
            }
            tooltip.style.opacity = '1';
        });

        button.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    }

    function createToggleIconButton() {
        const button = document.createElement('div');
        button.id = 'autoDanmuToggleBtn';
        button.style.position = 'fixed';
        button.style.bottom = '9px'; // 距离底部9px
        button.style.right = '0'; // 紧贴右边
        button.style.zIndex = '9999';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.width = '52px';
        button.style.height = '40px';
        button.style.borderTopLeftRadius = '20px';
        button.style.borderBottomLeftRadius = '20px';
        button.style.borderTopRightRadius = '0';
        button.style.borderBottomRightRadius = '0';
        button.style.backgroundColor = '#fff';
        button.style.boxShadow = '-2px 2px 8px rgba(0, 0, 0, 0.1)';
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.3s';

        // 图标 img
        const icon = document.createElement('img');
        icon.style.width = '24px';
        icon.style.height = '24px';
        icon.style.marginRight = '-4px'; // 让图标更靠右，减少内边距空隙
        icon.src = autoCloseDanmu
            ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik02IDE4aDEyYzMuMzExIDAgNi0yLjY4OSA2LTZzLTIuNjg5LTYtNi02aC0xMi4wMzljLTMuMjkzLjAyMS01Ljk2MSAyLjcwMS01Ljk2MSA2IDAgMy4zMTEgMi42ODggNiA2IDZ6bTEyLTEwYy0yLjIwOCAwLTQgMS43OTItNCA0czEuNzkyIDQgNCA0IDQtMS43OTIgNC00LTEuNzkyLTQtNC00eiIvPjwvc3ZnPg=='
            : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xOCAxOGgtMTJjLTMuMzExIDAtNi0yLjY4OS02LTZzMi42ODktNiA2LTZoMTIuMDM5YzMuMjkzLjAyMSA1Ljk2MSAyLjcwMSA1Ljk2MSA2IDAgMy4zMTEtMi42ODggNi02IDZ6bTAtMTBoLTEyYy0yLjIwOCAwLTQgMS43OTItNCA0czEuNzkyIDQgNCA0aDEyYzIuMjA4IDAgNC0xLjc5MiA0LTQgMC0yLjE5OS0xLjc3OC0zLjk4Ni0zLjk3NC00aC0uMDI2em0tMTIgMWMxLjY1NiAwIDMgMS4zNDQgMyAzcy0xLjM0NCAzLTMgMy0zLTEuMzQ0LTMtMyAxLjM0NC0zIDMtM3oiLz48L3N2Zz4=';

        button.appendChild(icon);

        button.addEventListener('click', () => {
            autoCloseDanmu = !autoCloseDanmu;
            localStorage.setItem('autoCloseDanmu', JSON.stringify(autoCloseDanmu));
            icon.src = autoCloseDanmu
                ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik02IDE4aDEyYzMuMzExIDAgNi0yLjY4OSA2LTZzLTIuNjg5LTYtNi02aC0xMi4wMzljLTMuMjkzLjAyMS01Ljk2MSAyLjcwMS01Ljk2MSA2IDAgMy4zMTEgMi42ODggNiA2IDZ6bTEyLTEwYy0yLjIwOCAwLTQgMS43OTItNCA0czEuNzkyIDQgNCA0IDQtMS43OTIgNC00LTEuNzkyLTQtNC00eiIvPjwvc3ZnPg=='
                : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xOCAxOGgtMTJjLTMuMzExIDAtNi0yLjY4OS02LTZzMi42ODktNiA2LTZoMTIuMDM5YzMuMjkzLjAyMSA1Ljk2MSAyLjcwMSA1Ljk2MSA2IDAgMy4zMTEtMi42ODggNi02IDZ6bTAtMTBoLTEyYy0yLjIwOCAwLTQgMS43OTItNCA0czEuNzkyIDQgNCA0aDEyYzIuMjA4IDAgNC0xLjc5MiA0LTQgMC0yLjE5OS0xLjc3OC0zLjk4Ni0zLjk3NC00aC0uMDI2em0tMTIgMWMxLjY1NiAwIDMgMS4zNDQgMyAzcy0xLjM0NCAzLTMgMy0zLTEuMzQ0LTMtMyAxLjM0NC0zIDMtM3oiLz48L3N2Zz4=';
        });

        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#ff5f00';
        });
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#fff';
        });

        document.body.appendChild(button);

        // 左侧显示 tooltip
        addTooltip(button, '💡 是否自动关闭弹幕', 'left');
    }

    function closeDanmu() {
        if (!autoCloseDanmu) return;
        // 如果用户本集手动操作过，脚本不再干预
        if (isManualIntervention) return;

        // v2.1.2：如果 5 秒内进行过手动操作，坚决不进行自动关闭（防止竞速冲突）
        if (Date.now() - lastManualTime < 5000) return;

        const danmuBtn = document.querySelector("._danmuSwitcher_1qow5_208") ||
            document.querySelector(".danmu-switch"); // 增加备选选择器

        if (danmuBtn) {
            const isOn = danmuBtn.classList.contains("_on_1qow5_238") ||
                danmuBtn.classList.contains("on") ||
                danmuBtn.getAttribute('aria-checked') === 'true';

            if (isOn) {
                // 如果是开启状态，执行关闭
                isScriptClicking = true;
                danmuBtn.click();
                isScriptClicking = false;
                // console.log("检测到弹幕开启，强制自动关闭 (v2.0.8)");
            }
        }
    }

    function toggleDanmu() {
        const btn = document.querySelector("._danmuSwitcher_1qow5_208") ||
            document.querySelector(".danmu-switch");
        if (btn) {
            isManualIntervention = true;
            lastManualTime = Date.now(); // 记录手动时间戳
            btn.click();
            console.log("快捷键切换弹幕，触发 5s 强制停火锁定");
        }
    }

    function isTyping() {
        const active = document.activeElement;
        const tagName = active.tagName;
        const isContentEditable = active.isContentEditable;
        const isTextbox = active.getAttribute('role') === 'textbox';
        // 增加对常见输入框 class 的检测（不区分大小写）
        const isInputClass = active.className && typeof active.className === 'string' && /input|textarea/i.test(active.className);
        return (tagName === 'INPUT' || tagName === 'TEXTAREA' || isContentEditable || isTextbox || isInputClass);
    }

    function toggleFullscreen() {
        // 尝试寻找全屏按钮点击（以同步UI状态）
        const fsBtn = document.querySelector('[title="全屏"]') ||
            document.querySelector('[title="退出全屏"]') ||
            document.querySelector('mango-icon[name="fullscreen"]'); // 猜测的选择器

        if (fsBtn) {
            fsBtn.click();
            console.log("切换全屏 (点击按钮)");
            return;
        }

        // 兜底：使用原生 API
        const player = document.querySelector('.mango-player') || document.body;
        if (!document.fullscreenElement) {
            if (player.requestFullscreen) {
                player.requestFullscreen();
            } else if (player.webkitRequestFullscreen) {
                player.webkitRequestFullscreen();
            }
            console.log("切换全屏 (原生API)");
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            console.log("退出全屏 (原生API)");
        }
    }

    window.addEventListener('keydown', (e) => {
        // 如果正在输入法输入中，直接返回，防止误触
        if (e.isComposing || e.keyCode === 229) return;
        if (isTyping()) return; // 如果正在输入，不触发快捷键

        if (e.key === 'd' || e.key === 'D') {
            toggleDanmu();
        } else if (e.key === 'f' || e.key === 'F') {
            toggleFullscreen();
        }
    });

    // 监听全局点击，识别用户对手动操作弹幕按钮的行为
    document.addEventListener('click', (e) => {
        if (isScriptClicking) return;

        // 检查点击目标是否是弹幕开关
        // v2.0.8 进一步收窄范围，仅监听特定的开关类名，避免误触
        const isDanmuBtn = e.target.closest("._danmuSwitcher_1qow5_208") ||
            e.target.closest(".danmu-switch");

        if (isDanmuBtn) {
            // 用户手动点击了开关，记录为手动干预及时间戳
            isManualIntervention = true;
            lastManualTime = Date.now();
            // console.log("检测到用户手动操作，触发 5s 强制停火锁定");
        }
    }, true);

    function addDanmuShortcutTooltip() {
        const danmuButtons = document.querySelectorAll("._danmuSwitcher_1qow5_208");
        danmuButtons.forEach(btn => {
            if (!btn || btn.dataset.tooltipAttached) return;
            // 使用默认上方 tooltip
            addTooltip(btn, "💡 按 D 键可开关弹幕", 'top');
        });
    }

    // 监听动态添加的 DOM 节点（用于捕获自定义 Tooltip）
    // 使用 mouseover + XPath 查找可见的 Tooltip 元素
    // 性能优化：使用 debounce 防抖，避免每次鼠标移动都触发昂贵的 XPath 查询
    function modifyFullscreenTooltip() {
        const xpath = "//*[text()='全屏']";
        // 尝试在全屏元素内查找（如果在全屏模式下），否则查找 body
        const contextNode = document.fullscreenElement || document.body;
        const result = document.evaluate(xpath, contextNode, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        for (let i = 0; i < result.snapshotLength; i++) {
            const node = result.snapshotItem(i);
            // 检查元素是否可见 (offsetParent 不为 null 代表可见)
            if (node.offsetParent !== null) {
                const text = node.innerText.trim();
                // 排除已处理过的
                if (text.endsWith('(F)')) continue;

                if (text === '全屏') {
                    node.innerText = '全屏 (F)';
                }
            }
        }
    }

    const debouncedModifyTooltip = debounce(modifyFullscreenTooltip, 100); // 100ms 延迟
    document.addEventListener('mouseover', debouncedModifyTooltip);

    function init() {
        closeDanmu();
        addDanmuShortcutTooltip();
        // 初始化屏蔽词管理器
        if (!window.blocklistManager) {
            window.blocklistManager = new BlocklistManager();
        }
    }

    // --- 高级屏蔽词功能 ---
    class BlocklistManager {
        constructor() {
            this.storageKey = 'mgtv_custom_blocklist';
            this.blocklist = this.load();
            this.compiledPatterns = this.compile(this.blocklist); // 预编译正则表达式
            this.initUI();
            this.startFilter();
        }

        compile(list) {
            return list.map(pattern => {
                const regexMatch = pattern.match(/^\/(.*?)\/([gimuy]*)$/);
                if (regexMatch) {
                    try {
                        return new RegExp(regexMatch[1], regexMatch[2]);
                    } catch (e) {
                        return pattern;
                    }
                }
                return pattern;
            });
        }

        load() {
            try {
                return JSON.parse(localStorage.getItem(this.storageKey)) || [];
            } catch (e) {
                return [];
            }
        }

        save(list) {
            this.blocklist = list;
            this.compiledPatterns = this.compile(list); // 保存时同步更新预编译列表
            localStorage.setItem(this.storageKey, JSON.stringify(list));
            // 立即刷新过滤（可选，这里暂不处理已存在的弹幕，仅对新弹幕生效）
        }

        initUI() {
            this.createSettingsBtn();
            this.createModal();
            this.createToast();
        }

        createToast() {
            if (document.getElementById('mgtv_custom_toast')) return;
            const toast = document.createElement('div');
            toast.id = 'mgtv_custom_toast';
            toast.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.7); color: #fff; padding: 10px 20px;
                border-radius: 4px; font-size: 14px; z-index: 2147483647;
                opacity: 0; pointer-events: none; transition: opacity 0.3s;
            `;
            document.body.appendChild(toast);
        }

        showToast(msg) {
            const toast = document.getElementById('mgtv_custom_toast');
            if (!toast) return;
            toast.innerText = msg;
            toast.style.opacity = '1';
            clearTimeout(this.toastTimer);
            this.toastTimer = setTimeout(() => {
                toast.style.opacity = '0';
            }, 2000);
        }

        createSettingsBtn() {
            const btnId = 'mgtv_blocklist_setting_btn';
            if (document.getElementById(btnId)) return;

            const btn = document.createElement('div');
            btn.id = btnId;
            btn.style.position = 'fixed';
            btn.style.bottom = '9px';
            btn.style.right = '58px';
            btn.style.zIndex = '9999';
            btn.style.width = '32px';
            btn.style.height = '32px';
            btn.style.backgroundColor = '#fff';
            btn.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
            btn.style.cursor = 'pointer';
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.style.borderRadius = '50%';
            btn.style.transition = 'transform 0.2s';

            // Shield Icon SVG
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path d="M15.273 19.469c-.662-.662-1.582-1.002-2.514-.931-1.767.137-3.58-.47-4.931-1.821-1.223-1.224-1.83-2.824-1.83-4.426 0-.604.086-1.208.258-1.792l3.771 3.771c1.912.417 4.652-2.353 4.242-4.242l-3.769-3.771c.583-.171 1.187-.257 1.790-.257 1.603 0 3.202.606 4.428 1.83 1.35 1.351 1.957 3.164 1.82 4.93-.072.933.268 1.853.93 2.514l2.843 2.843c1.066-1.793 1.689-3.88 1.689-6.117 0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.236 0 4.323-.623 6.115-1.688l-2.842-2.843z"/></svg>`;

            btn.onclick = () => this.openModal();
            btn.onmouseenter = () => btn.style.transform = 'scale(1.1)';
            btn.onmouseleave = () => btn.style.transform = 'scale(1)';

            document.body.appendChild(btn);

            // 使用与主按钮相同的 Tooltip 样式
            addTooltip(btn, '💡 屏蔽词设置', 'left');
        }

        createModal() {
            if (document.getElementById('mgtv_blocklist_modal')) return;

            const modal = document.createElement('div');
            modal.id = 'mgtv_blocklist_modal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.6); z-index: 2147483647;
                display: none; align-items: center; justify-content: center;
                backdrop-filter: blur(2px);
            `;

            const content = document.createElement('div');
            // 样式参考：简洁，圆角，阴影
            content.style.cssText = `
                background: #fff; width: 480px; max-width: 90%; 
                border-radius: 12px; padding: 24px; 
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                color: #333;
                position: relative;
            `;

            // 芒果TV风格按钮样式
            const btnStyle = `padding: 6px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; border: none; outline: none; transition: all 0.2s;`;
            const primaryBtnStyle = `${btnStyle} background: #FF5F00; color: #fff;`;
            const secondaryBtnStyle = `${btnStyle} background: transparent; color: #666; margin-right: 8px;`;
            const textBtnStyle = `${btnStyle} background: transparent; color: #222; text-decoration: underline; padding: 6px 4px;`;

            content.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <h3 style="margin:0; font-size:18px; font-weight:600;">屏蔽词设置</h3>
                    <div id="mgtv_modal_close" style="cursor:pointer; font-size:20px; color:#999;">×</div>
                </div>
                
                <p style="font-size:13px; color:#666; margin-bottom:12px; line-height:1.5;">
                    每行一个屏蔽词。支持文本及正则表达式（如 <code style="background:#f5f5f5;padding:2px 4px;border-radius:4px;">/^haha\\d+$/i</code>）。
                </p>
                
                <textarea id="mgtv_blocklist_input" style="width:100%; height:240px; margin-bottom:16px; padding:12px; border:1px solid #ddd; border-radius:8px; font-family:monospace; font-size:14px; resize:vertical; box-sizing:border-box; outline:none;"></textarea>
                
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center;">
                        <button id="mgtv_btn_import" style="${secondaryBtnStyle}">导入</button>
                        <button id="mgtv_btn_export" style="${secondaryBtnStyle}">导出</button>
                        <input type="file" id="mgtv_file_input" style="display:none" accept=".txt">
                    </div>
                    <div>
                        <button id="mgtv_btn_cancel" style="${secondaryBtnStyle}">取消</button>
                        <button id="mgtv_btn_save" style="${primaryBtnStyle}">保存</button>
                    </div>
                </div>
            `;

            modal.appendChild(content);
            document.body.appendChild(modal);

            // 绑定事件
            const close = () => modal.style.display = 'none';
            content.querySelector('#mgtv_modal_close').onclick = close;
            content.querySelector('#mgtv_btn_cancel').onclick = close;
            content.querySelector('#mgtv_btn_save').onclick = () => this.saveFromUI();
            content.querySelector('#mgtv_btn_export').onclick = () => this.exportToFile();

            const importBtn = content.querySelector('#mgtv_btn_import');
            importBtn.onclick = () => document.getElementById('mgtv_file_input').click();

            document.getElementById('mgtv_file_input').onchange = (e) => this.importFromFile(e);

            // 按钮 Hover 效果
            const addBtnHover = (btn, hoverBg, normalBg = 'transparent') => {
                btn.onmouseenter = () => btn.style.backgroundColor = hoverBg;
                btn.onmouseleave = () => btn.style.backgroundColor = normalBg;
            };

            addBtnHover(content.querySelector('#mgtv_btn_save'), '#E55500', '#FF5F00');
            addBtnHover(content.querySelector('#mgtv_btn_cancel'), '#f0f0f0');
            addBtnHover(importBtn, '#f0f0f0');
            addBtnHover(content.querySelector('#mgtv_btn_export'), '#f0f0f0');

            // 为导入按钮添加自定义 Tooltip
            addTooltip(importBtn, '💡 导入后新增合并当前已有的屏蔽词', 'top');

            // 简单的Textarea focus样式
            const ta = document.getElementById('mgtv_blocklist_input');
            ta.onfocus = () => ta.style.borderColor = '#FF5F00';
            ta.onblur = () => ta.style.borderColor = '#ddd';
        }

        openModal() {
            const modal = document.getElementById('mgtv_blocklist_modal');
            const textarea = document.getElementById('mgtv_blocklist_input');
            textarea.value = this.blocklist.join('\n');
            modal.style.display = 'flex';
        }

        saveFromUI() {
            const textarea = document.getElementById('mgtv_blocklist_input');
            const raw = textarea.value.split('\n').map(s => s.trim()).filter(s => s);
            const unique = [...new Set(raw)];
            this.save(unique);
            document.getElementById('mgtv_blocklist_modal').style.display = 'none';
            this.showToast('保存成功');
        }

        exportToFile() {
            const blob = new Blob([this.blocklist.join('\n')], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mgtv_blocklist.txt';
            a.click();
            URL.revokeObjectURL(url);
            this.showToast('导出成功');
        }

        importFromFile(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                const text = evt.target.result;
                const newItems = text.split('\n').map(s => s.trim()).filter(s => s);
                const current = document.getElementById('mgtv_blocklist_input').value.split('\n').map(s => s.trim()).filter(s => s);
                // 合并去重
                const combined = [...new Set([...current, ...newItems])];

                document.getElementById('mgtv_blocklist_input').value = combined.join('\n');
                this.showToast('导入成功，请点击保存生效');
            };
            reader.readAsText(file);
            e.target.value = '';
        }

        // --- 过滤核心逻辑 ---
        startFilter() {
            this.container = null;
            this.observer = new MutationObserver((mutations) => {
                for (let i = 0; i < mutations.length; i++) {
                    const addedNodes = mutations[i].addedNodes;
                    for (let j = 0; j < addedNodes.length; j++) {
                        const node = addedNodes[j];
                        if (node.nodeType === 1) {
                            this.checkAndBlock(node);
                        }
                    }
                }
            });

            this.reAnchorObserver();
        }

        // 性能核心：尝试寻找精准的弹幕容器进行监听，若找不到则回退到 body
        reAnchorObserver() {
            // 芒果TV 弹幕通常渲染在特定的容器内，通过探测找到它
            // 常见的可能容器类名（基于历史观察）
            const target = document.querySelector(".m-danmu-container") ||
                document.querySelector(".danmu-container") ||
                document.body;

            if (this.container !== target) {
                if (this.observer) this.observer.disconnect();
                this.container = target;
                this.observer.observe(target, { childList: true, subtree: true });
                // console.log(`[Performance] 过滤引擎观测点已切换至: ${target === document.body ? 'body (兜底)' : target.className}`);
            }
        }

        checkAndBlock(node) {
            // 快速检查：如果节点本身是 span
            if (node.classList && node.classList.contains('_danmuText_1qow5_77')) {
                this.performBlock(node);
                return;
            }
            // 否则尝试在子节点中寻找一次（不进行深度递归，仅一级 querySelector）
            const textSpan = node.querySelector ? node.querySelector('._danmuText_1qow5_77') : null;
            if (textSpan) {
                this.performBlock(textSpan);
            }
        }

        performBlock(textSpan) {
            const text = textSpan.innerText.trim();
            if (this.shouldBlock(text)) {
                // 尝试隐藏最外层容器（通常是 ._danmuItem...），如果找不到就隐藏 span 本身
                // 使用 closest 可以更精准地找到弹幕条目
                const container = textSpan.closest('div') || textSpan;
                container.style.display = 'none';
            }
        }

        shouldBlock(text) {
            if (!this.compiledPatterns || this.compiledPatterns.length === 0) return false;

            for (const pattern of this.compiledPatterns) {
                if (pattern instanceof RegExp) {
                    if (pattern.test(text)) return true;
                } else {
                    // 普通文本匹配
                    if (text.includes(pattern)) return true;
                }
            }
            return false;
        }
    }

    window.addEventListener('load', init);

    const originalConsoleError = console.error;
    console.error = function (...args) {
        originalConsoleError.apply(console, args);
        if (args.some(arg => typeof arg === 'string' && /^Ne/.test(arg))) {
            networkErrorFlag = true;
            closeDanmu();
        }
    };

    // 提取芒果TV视频ID，用于精准判断切集
    function getMgtvVideoId(url) {
        const match = url.match(/\/b\/\d+\/(\d+)\.html/);
        return match ? match[1] : url;
    }

    const playerElement = document.querySelector(".mango-player.p-MacIntel.player-s");
    if (playerElement) {
        playerElement.addEventListener('click', () => {
            if (autoCloseDanmu && networkErrorFlag) {
                setTimeout(() => {
                    closeDanmu();
                    networkErrorFlag = false;
                }, 3000);
            }
        });
    }

    // 优化：使用定时轮询代替点击事件监听，以更稳定地检测 URL 变化，避免频繁触发定时器
    setInterval(() => {
        const currentUrl = window.location.href;
        if (getMgtvVideoId(currentUrl) !== getMgtvVideoId(lastUrl)) {
            lastUrl = currentUrl;
            isManualIntervention = false;
            lastManualTime = 0; // 在切集时清除锁定
            init();
        }
        // v2.0.8：只要没被手动干预过，就始终尝试关闭（处理异步反复开启的情况）
        if (autoCloseDanmu && !isManualIntervention) {
            closeDanmu();
        }
        // v2.1.3：持续尝试优化过滤引擎的观测点
        if (window.blocklistManager) {
            window.blocklistManager.reAnchorObserver();
        }
        // 持续尝试添加弹幕快捷键提示
        addDanmuShortcutTooltip();
    }, 1000); // v2.1.3 调低至 1s 一次，极致省电

    // 防抖函数，避免频繁触发
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const debouncedInit = debounce(init, 1000);

    const titleObserver = new MutationObserver(debouncedInit);

    const titleElement = document.querySelector('title');
    if (titleElement) {
        titleObserver.observe(titleElement, { childList: true });
    }

    createToggleIconButton();

    // 监听视频关键事件，处理同页面重载视频（URL 不变但视频重启）的情况
    const resetAutoClose = (e) => {
        // v2.1.2：如果在手动操作锁定期内，忽略事件触发的重置
        if (Date.now() - lastManualTime < 5000) return;

        if (e.target.tagName === 'VIDEO') {
            isManualIntervention = false;
            init();
        }
    };

    // document.addEventListener('play', resetAutoClose, true); // v2.1.1 移除 play 监听，避免暂停恢复导致手动覆盖失效
    document.addEventListener('loadstart', resetAutoClose, true);
    document.addEventListener('emptied', resetAutoClose, true);

    // 针对同页面切集产生的视频地址变化进行监听
    const videoSrcObserver = new MutationObserver((mutations) => {
        // v2.1.2：如果在手动操作锁定期内，忽略 SRC 变化的重置
        if (Date.now() - lastManualTime < 5000) return;

        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                isManualIntervention = false;
                init();
            }
        });
    });

    let currentObservedVideo = null;
    function startObserveVideo() {
        const video = document.querySelector('video');
        if (video && video !== currentObservedVideo) {
            currentObservedVideo = video;
            videoSrcObserver.disconnect();
            videoSrcObserver.observe(video, { attributes: true, attributeFilter: ['src'] });
        }
    }

    // 每秒检查一下是否需要给新的 video 元素挂载监听
    setInterval(startObserveVideo, 2000);
})();
