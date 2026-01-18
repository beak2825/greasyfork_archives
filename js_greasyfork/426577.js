// ==UserScript==
// @name          Show Password by double-click
// @name:zh-CN    双击查看密码
// @version       2.1
// @author        Finn
// @namespace    https://github.com/Germxu
// @homepage     https://github.com/Germxu/Scripts-for-TamperMonkey
// @supportURL   https://github.com/Germxu/Scripts-for-TamperMonkey/issues/new
// @description   😎 Double-click to show password, with an adaptive overlay copy button, auto-hide in 5s
// @description:zh-CN  😎双击显示密码，输入框尾部覆盖自适应复制按钮，5秒自动隐藏
// @include       *
// @grant         GM_setClipboard
// @require       https://cdn.jsdelivr.net/npm/qmsg@1.2.1
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/426577/Show%20Password%20by%20double-click.user.js
// @updateURL https://update.greasyfork.org/scripts/426577/Show%20Password%20by%20double-click.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 1. 多语言文案配置
    const i18n = {
        'zh-CN': {
            msg: "密码已显示，5秒后自动隐藏",
            copy: "复制",
            copied: "已复制"
        },
        'en': {
            msg: "Password shown, auto-hide in 5s",
            copy: "Copy",
            copied: "Done"
        }
    };

    const lang = navigator.language.startsWith('zh') ? 'zh-CN' : 'en';
    const t = i18n[ lang ];
    const timers = new Map();

    document.addEventListener("dblclick", e => {
        const el = e.target;

        // 仅针对密码类型的 input 触发
        if (el.nodeName === "INPUT" && el.type === "password") {
            // 防止重复生成按钮
            if (el.dataset.hasCopyBtn === "true") return;

            // 切换为明文
            el.type = "text";

            // 弹出轻量级消息提示 (Element UI 风格)
            if (typeof Qmsg !== 'undefined') {
                Qmsg.info(t.msg, { timeout: 2000 });
            }

            // --- 动态尺寸计算 ---
            const rect = el.getBoundingClientRect();
            const btnHeight = rect.height * 0.9; // 高度占 input 的 90%
            const btnWidth = Math.max(btnHeight * 1.8, 42); // 宽度根据比例计算，最小 42px
            const fontSize = Math.max(btnHeight * 0.4, 11); // 字体大小随高度自适应

            // --- 创建复制按钮 ---
            const btn = document.createElement('button');
            btn.innerText = t.copy;
            el.dataset.hasCopyBtn = "true";

            // 样式设置：绝对定位覆盖在 input 尾部
            Object.assign(btn.style, {
                position: 'fixed',
                top: `${rect.top + (rect.height - btnHeight) / 2}px`,
                left: `${rect.left + rect.width - btnWidth - 5}px`, // 靠右偏移 5px
                width: `${btnWidth}px`,
                height: `${btnHeight}px`,
                lineHeight: `${btnHeight}px`,
                fontSize: `${fontSize}px`,
                cursor: 'pointer',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#409eff', // Element 蓝色
                color: '#fff',
                padding: '0',
                margin: '0',
                zIndex: '2147483647',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transition: 'all 0.2s ease',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                pointerEvents: 'auto'
            });

            document.body.appendChild(btn);

            // --- 复制功能 ---
            btn.onclick = (event) => {
                event.preventDefault();
                event.stopPropagation();

                try {
                    // 使用油猴提供的 GM API，几乎不会被网页 CSP 拦截
                    GM_setClipboard(el.value, "text");

                    btn.innerText = t.copied;
                    btn.style.backgroundColor = '#67c23a';
                    setTimeout(() => {
                        if (btn.parentNode) {
                            btn.innerText = t.copy;
                            btn.style.backgroundColor = '#409eff';
                        }
                    }, 1000);
                } catch (err) {
                    console.error('Copy failed:', err);
                    if (typeof Qmsg !== 'undefined') Qmsg.error("Copy failed");
                }

            };

            // --- 统一清理逻辑 ---
            const cleanup = () => {
                if (el.type === "text") el.type = "password";
                if (btn && btn.parentNode) btn.remove();
                delete el.dataset.hasCopyBtn;
                window.removeEventListener('scroll', cleanup); // 移除滚动监听
                timers.delete(el);
            };

            // 处理多次双击的计时器冲突
            if (timers.has(el)) clearTimeout(timers.get(el));
            const timerId = setTimeout(cleanup, 5000);
            timers.set(el, timerId);

            // 监听滚动自动关闭（防止按钮在页面滚动时脱离位置）
            window.addEventListener('scroll', cleanup, { once: true, passive: true });

            // 失去焦点逻辑
            el.onblur = () => {
                setTimeout(() => {
                    // 如果用户没在点复制按钮，就收起
                    if (document.activeElement !== btn) cleanup();
                }, 150);
            };
        }
    });
})();