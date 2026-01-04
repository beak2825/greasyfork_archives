// ==UserScript==
// @name         B站|bilibili 小窗调整|优化
// @license      MIT
// @namespace    https://sumver.cn
// @version      0.0.2
// @description  bilibili网页版划到评论区时出现的小窗，该脚本可以自由调整小窗的尺寸，并且可以以真实的视频比例展示（而不会出现大黑边，尤其是竖屏视频）
// @match        https://www.bilibili.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAyZJREFUaEPtWlFy2jAQ3XXof5pewJkpmekpAidJ+IQeAnKIwifkJDin6EzoTNwDlOYA4O2sVIEsFFuSkQdm8CfI0r6VdvftkxHO/MEQ+7/8eH3cJtvsffgtD3nf9s71bNV7H3Yz3/m8AdzMVmMgmPBCBW5um4K4nv1MkTpzBOgBwmQ97D75gPAHMH19A8BULdIEBBufUOdtbzDl69HdbVQActGrZVMQh8bzjkLf9xh57wB7xwYCiQZ/vt8tXLx3LON5rSAATUBwsCYESx1oiOfV+8EAQkAcGk95gTjwPTY6+AMAYhHAByJKEWgXrNVHYx/Uchx9kF7NcXIsAdamY0TICtg8m1mvBODzdLUU6eyEHzPWdgDOwfidX7V6IQDoxemEnV827T8ItKW0cwHBRRQ/8j6fNeY7pwGmkyZEc714ihpANMCb2a85ED2WDfUv6bGB2uoHIC7QGrwBpCo2ABGr0xXp6xBAdgHQhufVGpcdqPK2T5fGqRugkwJscp+G6Gg7wMYKFpMk90BFT6U3V0qtp24ORJESBdeBlypQwQBEsYNPY91Y624gLtbDr4O6uKiv/JLgEW4G+g41A1Bq/ewmsjf/jrr9OgCuvGs96pbIZjAAmYPLvXDJSMQF02Is6LdLVyYpO9wTQU9SdjvNNvvjZgBExS56gEmGRfGyTZjD+wVh1c4cgBLHsaxQNAJQdyza+P8CoA0vV61x2YGQHeCi55KZXOaOvgMmnVAFS5cfFY0IkVKiAmDjCXEu6gHBk6QZWqOEMOE6IceECcNRAezFATZaFSbKuW6YFMSVM5nHKjoAXlAVJPa2ukNQvwnPW8Qpl/N/6chcvRRzXCtHqE0AImFYZRVHXh/TWHNuqwDHmW2f/kqCRV7gtu/T7sUGY22CGEAV1xe6C9ZL37GNl1K/qZpL8e38xV3lPbvEGNu3YfPrrWu557TqpGGLxHrL7LutV0xIMG73poavpA77YiW5sDM4FgugZ5MEOl3yWZVhOJ6Cbc2EjgKzEwBbpmpyNWo7Xqbq4foFgDMARdSuCkqP/aGHnJvFs86DTgJd4sgLgMuEbY/5B0Ybna/xpe4TAAAAAElFTkSuQmCC
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/494837/B%E7%AB%99%7Cbilibili%20%E5%B0%8F%E7%AA%97%E8%B0%83%E6%95%B4%7C%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/494837/B%E7%AB%99%7Cbilibili%20%E5%B0%8F%E7%AA%97%E8%B0%83%E6%95%B4%7C%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==============================
    // 第一部分：小窗尺寸调整（原逻辑保留）
    // ==============================

    const setStyle = function (css) {
        let css_list = css.split("}");
        css_list.forEach((item, index, array) => {
            GM_addStyle(item + "}");
        });
    };

    const miniwin_status = GM_registerMenuCommand("小窗尺寸设置", function () {
        let num = window.prompt("小窗缩放倍率，在1.1~3之间是最合理的，\n推荐倍率1.6~2.0尺寸最佳\n如设置后出现问题，请输入0即可恢复预设尺寸");
        if (typeof (Number(num)) === 'number') {
            if (num.toString().split('.').pop().length <= 2) {
                let ori_area = document.querySelector("#bilibili-player-placeholder");
                let o_height = 203;
                let o_width = 360;
                let sc_height = Math.round(o_height * num, 2);
                let sc_width = Math.round(o_width * num, 2);
                if (num != 0) {
                    if (window.video_obj && video_obj[0] > video_obj[1]) {
                        let css = `
@media screen and (min-width: 1681px){
.bpx-player-container[data-revision="1"][data-screen=mini], .bpx-player-container[data-revision="2"][data-screen=mini]{height:unset !important;width:${sc_width}px !important;}
.bpx-player-video-perch, .bpx-player-video-area, .bpx-player-video-wrap{height:inherit !important;width:inherit !important;}
}
.bpx-player-container[data-revision="1"][data-screen=mini], .bpx-player-container[data-revision="2"][data-screen=mini]{height:unset !important;width:${sc_width}px !important;}
.bpx-player-video-perch, .bpx-player-video-area, .bpx-player-video-wrap{height:inherit !important;width:inherit !important;}
                        `;
                        setStyle(css);
                    } else {
                        let css = `
@media screen and (min-width: 1681px){
.bpx-player-container[data-revision="1"][data-screen=mini], .bpx-player-container[data-revision="2"][data-screen=mini]{height:unset !important;width:${sc_height}px !important;}
.bpx-player-video-perch, .bpx-player-video-area, .bpx-player-video-wrap{height:inherit !important;width:inherit !important;}
}
.bpx-player-container[data-revision="1"][data-screen=mini], .bpx-player-container[data-revision="2"][data-screen=mini]{height:unset !important;width:${sc_height}px !important;}
.bpx-player-video-perch, .bpx-player-video-area, .bpx-player-video-wrap{height:inherit !important;width:inherit !important;}
                        `;
                        setStyle(css);
                    }
                    GM_setValue("mini_height", sc_height);
                    GM_setValue("mini_width", sc_width);
                } else {
                    GM_setValue("mini_height", 324);
                    GM_setValue("mini_width", 576);
                    if (window.video_obj && video_obj[0] > video_obj[1]) {
                        let css = `
@media screen and (min-width: 1681px){
.bpx-player-container[data-revision="1"][data-screen=mini], .bpx-player-container[data-revision="2"][data-screen=mini]{height:unset !important;width:${GM_getValue("mini_width")}px !important;}
.bpx-player-video-perch, .bpx-player-video-area, .bpx-player-video-wrap{height:inherit !important;width:inherit !important;}
}
.bpx-player-container[data-revision="1"][data-screen=mini], .bpx-player-container[data-revision="2"][data-screen=mini]{height:unset !important;width:${GM_getValue("mini_width")}px !important;}
.bpx-player-video-perch, .bpx-player-video-area, .bpx-player-video-wrap{height:inherit !important;width:inherit !important;}
                        `;
                        setStyle(css);
                    } else {
                        let css = `
@media screen and (min-width: 1681px){
.bpx-player-container[data-revision="1"][data-screen=mini], .bpx-player-container[data-revision="2"][data-screen=mini]{height:unset !important;width:${GM_getValue("mini_height")}px !important;}
.bpx-player-video-perch, .bpx-player-video-area, .bpx-player-video-wrap{height:inherit !important;width:inherit !important;}
}
.bpx-player-container[data-revision="1"][data-screen=mini], .bpx-player-container[data-revision="2"][data-screen=mini]{height:unset !important;width:${GM_getValue("mini_height")}px !important;}
.bpx-player-video-perch, .bpx-player-video-area, .bpx-player-video-wrap{height:inherit !important;width:inherit !important;}
                        `;
                        setStyle(css);
                    }
                }
            }
        }
    });

    if (!GM_getValue("mini_height")) {
        GM_setValue("mini_height", 324);
        GM_setValue("mini_width", 576);
    }

    let wait_fn = function () {
        function waitForElement(selector, timeout = 8000) {
            return new Promise((resolve, reject) => {
                const startTime = Date.now();
                const checkInterval = setInterval(() => {
                    const element = document.querySelector(selector);
                    if (element) {
                        clearInterval(checkInterval);
                        resolve(element);
                    } else if (Date.now() - startTime > timeout) {
                        clearInterval(checkInterval);
                        reject(new Error('没找到video标签'));
                    }
                }, 100);
            });
        }
        waitForElement('video', 8000)
            .then(element => {
                mini_win_fn();
            })
            .catch(error => {
                mini_win_fn_fallback();
            });
    };

    const mini_win_fn = function () {
        let video = document.querySelector('video');
        if (!video) {
            mini_win_fn_fallback();
            return;
        }
        video.addEventListener('canplay', function (e) {
            window.video_obj = [e.target.videoWidth, e.target.videoHeight];
            if (GM_getValue("mini_height") != 0) {
                if (video_obj[0] > video_obj[1]) {
                    let css = `
@media screen and (min-width: 1681px){
.bpx-player-container[data-revision="1"][data-screen=mini], .bpx-player-container[data-revision="2"][data-screen=mini]{height:unset !important;width:${GM_getValue("mini_width")}px !important;}
.bpx-player-video-perch, .bpx-player-video-area, .bpx-player-video-wrap{height:inherit !important;width:inherit !important;}
}
.bpx-player-container[data-revision="1"][data-screen=mini], .bpx-player-container[data-revision="2"][data-screen=mini]{height:unset !important;width:${GM_getValue("mini_width")}px !important;}
                    `;
                    setStyle(css);
                } else {
                    let css = `
@media screen and (min-width: 1681px){
.bpx-player-container[data-revision="1"][data-screen=mini], .bpx-player-container[data-revision="2"][data-screen=mini]{height:unset !important;width:${GM_getValue("mini_height")}px !important;}
.bpx-player-video-perch, .bpx-player-video-area, .bpx-player-video-wrap{height:inherit !important;width:inherit !important;}
}
.bpx-player-container[data-revision="1"][data-screen=mini], .bpx-player-container[data-revision="2"][data-screen=mini]{height:unset !important;width:${GM_getValue("mini_height")}px !important;}
                    `;
                    setStyle(css);
                }
            } else if (typeof (GM_getValue("mini_height")) == 'undefined' || GM_getValue("mini_height") == 0) {
                let o_height = 203;
                let o_width = 360;
                let css = `
@media screen and (min-width: 1681px){
.bpx-player-container[data-revision="1"][data-screen=mini], .bpx-player-container[data-revision="2"][data-screen=mini]{height:${o_height}px !important;width:${o_width}px !important;}
.bpx-player-video-perch, .bpx-player-video-area, .bpx-player-video-wrap{height:inherit !important;width:inherit !important;}
}
.bpx-player-container[data-revision="1"][data-screen=mini], .bpx-player-container[data-revision="2"][data-screen=mini]{height:${o_height}px !important;width:${o_width}px !important;}
                `;
                setStyle(css);
            }
        }, { once: true });

        if (video.readyState >= 2) {
            window.video_obj = [video.videoWidth, video.videoHeight];
            if (GM_getValue("mini_height") != 0) {
                if (video_obj[0] > video_obj[1]) {
                    let css = `
@media screen and (min-width: 1681px){
.bpx-player-container[data-revision="1"][data-screen=mini], .bpx-player-container[data-revision="2"][data-screen=mini]{height:unset !important;width:${GM_getValue("mini_width")}px !important;}
.bpx-player-video-perch, .bpx-player-video-area, .bpx-player-video-wrap{height:inherit !important;width:inherit !important;}
}
.bpx-player-container[data-revision="1"][data-screen=mini], .bpx-player-container[data-revision="2"][data-screen=mini]{height:unset !important;width:${GM_getValue("mini_width")}px !important;}
                    `;
                    setStyle(css);
                } else {
                    let css = `
@media screen and (min-width: 1681px){
.bpx-player-container[data-revision="1"][data-screen=mini], .bpx-player-container[data-revision="2"][data-screen=mini]{height:unset !important;width:${GM_getValue("mini_height")}px !important;}
.bpx-player-video-perch, .bpx-player-video-area, .bpx-player-video-wrap{height:inherit !important;width:inherit !important;}
}
.bpx-player-container[data-revision="1"][data-screen=mini], .bpx-player-container[data-revision="2"][data-screen=mini]{height:unset !important;width:${GM_getValue("mini_height")}px !important;}
                    `;
                    setStyle(css);
                }
            }
        }
    };

    const mini_win_fn_fallback = function () {
        let o_height = 203;
        let o_width = 360;
        let css = `
@media screen and (min-width: 1681px){
.bpx-player-container[data-revision="1"][data-screen=mini], .bpx-player-container[data-revision="2"][data-screen=mini]{height:${o_height}px !important;width:${o_width}px !important;}
.bpx-player-video-perch, .bpx-player-video-area, .bpx-player-video-wrap{height:inherit !important;width:inherit !important;}
}
.bpx-player-container[data-revision="1"][data-screen=mini], .bpx-player-container[data-revision="2"][data-screen=mini]{height:${o_height}px !important;width:${o_width}px !important;}
        `;
        setStyle(css);
    };

    // ==============================
    // 第二部分：小窗位置记忆、拖动修复、修复向右溢出
    // ==============================

    const PLAYER_SELECTOR = '.bpx-player-container';
    const STORAGE_KEY = 'bilibiliMiniPlayerCustomPosition_v2_8_1';
    const APPLIED_FLAG = 'data-bpx-tm-fixed-position-applied-v281';

    let tempUserPosition = null; // 页面内临时位置（用户拖动后记录）

    function notify(message, type = "info") {
        if (typeof GM_notification === 'function') {
            GM_notification({
                text: message,
                title: "Bilibili 小窗调整",
                image: "https://www.bilibili.com/favicon.ico",
                timeout: type === "error" ? 6000 : 4000,
                silent: true
            });
        } else {
            const prefix = type === "error" ? "❌ " : type === "success" ? "✅ " : "ℹ️ ";
            alert(prefix + message);
        }
    }

    function saveMiniPlayerPosition() {
        const playerContainer = document.querySelector(PLAYER_SELECTOR);
        if (!playerContainer || playerContainer.dataset.screen !== 'mini') {
            notify("当前没检测到小窗，请在出现小窗时再进行保存位置操作", "info");
            return;
        }
        const rect = playerContainer.getBoundingClientRect();
        const centerX = Math.round(rect.left + rect.width / 2);
        const centerY = Math.round(rect.top + rect.height / 2);
        try {
            GM_setValue(STORAGE_KEY, JSON.stringify({ centerX, centerY }));
            notify(`✅ 位置已保存!\n中心点: (${centerX}, ${centerY})`, "success");
        } catch (e) {
            notify("保存失败，请查看控制台。", "error");
        }
    }

    function resetMiniPlayerPosition() {
        GM_setValue(STORAGE_KEY, null);
        tempUserPosition = null;

        const player = document.querySelector(PLAYER_SELECTOR);
        if (player && player.dataset.screen === 'mini') {
            player.style.transform = '';
            player.removeAttribute(APPLIED_FLAG);
            notify("✅ 小窗位置已重置为默认", "success");
        } else {
            notify("ℹ️ 位置已清除，下次打开小窗将使用默认位置", "info");
        }
    }

    GM_registerMenuCommand("保存当前小窗位置", saveMiniPlayerPosition);
    GM_registerMenuCommand("重置小窗位置", resetMiniPlayerPosition);

    // 监听用户拖动（仅用于更新 tempUserPosition）
    function startDragListener(playerElement) {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const transform = playerElement.style.transform;
                    const match = transform.match(/translate$$([^,]+),\s*([^$$]+)$$/);
                    if (match) {
                        const dx = parseFloat(match[1].replace('px', '')) || 0;
                        const dy = parseFloat(match[2].replace('px', '')) || 0;

                        const rect = playerElement.getBoundingClientRect();
                        // 注意：getBoundingClientRect 是相对于视口的，不包含 transform
                        // 所以实际中心 = rect.left + dx + width/2
                        const currentCenterX = rect.left + dx + rect.width / 2;
                        const currentCenterY = rect.top + dy + rect.height / 2;

                        tempUserPosition = {
                            centerX: Math.round(currentCenterX),
                            centerY: Math.round(currentCenterY)
                        };
                    }
                }
            }
        });
        observer.observe(playerElement, { attributes: true, attributeFilter: ['style'] });
        return () => observer.disconnect();
    }

    // 只在首次进入小窗且无用户拖动时应用位置
    function applyPositionOnMiniAppear(playerElement) {
        if (playerElement.hasAttribute(APPLIED_FLAG)) return;

        requestAnimationFrame(() => {
            if (!playerElement || playerElement.dataset.screen !== 'mini') return;

            const currentTransform = playerElement.style.transform || '';
            // 如果已经有 translate，说明用户已拖动或 B站已初始化，我们不再干预
            if (currentTransform.includes('translate')) {
                // 但同步一下 tempUserPosition，避免后续逻辑混乱
                const rect = playerElement.getBoundingClientRect();
                const match = currentTransform.match(/translate$$([^,]+),\s*([^$$]+)$$/);
                const dx = match ? parseFloat(match[1]) || 0 : 0;
                const dy = match ? parseFloat(match[2]) || 0 : 0;
                tempUserPosition = {
                    centerX: Math.round(rect.left + dx + rect.width / 2),
                    centerY: Math.round(rect.top + dy + rect.height / 2)
                };
                playerElement.setAttribute(APPLIED_FLAG, 'true');
                return;
            }

            let targetPos = tempUserPosition || null;
            if (!targetPos) {
                const savedPosStr = GM_getValue(STORAGE_KEY, null);
                if (savedPosStr) {
                    try {
                        const saved = JSON.parse(savedPosStr);
                        if (typeof saved.centerX === 'number' && typeof saved.centerY === 'number') {
                            targetPos = saved;
                        }
                    } catch (e) { /* ignore */ }
                }
            }

            if (!targetPos) {
                playerElement.setAttribute(APPLIED_FLAG, 'true');
                return;
            }

            const rect = playerElement.getBoundingClientRect();
            const winWidth = window.innerWidth;
            const winHeight = window.innerHeight;

            const targetLeft = targetPos.centerX - rect.width / 2;
            const targetTop = targetPos.centerY - rect.height / 2;

            const margin = 10;
            const safeLeft = Math.max(margin, Math.min(targetLeft, winWidth - rect.width - margin));
            const safeTop = Math.max(margin, Math.min(targetTop, winHeight - rect.height - margin));

            const deltaX = safeLeft - rect.left;
            const deltaY = safeTop - rect.top;

            if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
                playerElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                // 更新 tempUserPosition，使其与当前视觉位置一致
                tempUserPosition = {
                    centerX: Math.round(safeLeft + rect.width / 2),
                    centerY: Math.round(safeTop + rect.height / 2)
                };
            }

            playerElement.setAttribute(APPLIED_FLAG, 'true');
        });
    }

    // 切回主播放器时清理样式和标记
    function fixMainPlayerStyleOnReturn() {
        const player = document.querySelector(PLAYER_SELECTOR);
        if (!player || player.dataset.screen === 'mini') return;

        player.style.transform = '';
        player.removeAttribute(APPLIED_FLAG);

        ['width', 'height', 'maxWidth', 'maxHeight'].forEach(prop => {
            player.style[prop] = '';
        });

        const selectors = ['.bpx-player-video-perch', '.bpx-player-video-area', '.bpx-player-video-wrap'];
        selectors.forEach(sel => {
            const el = player.querySelector(sel);
            if (el) {
                el.style.width = '';
                el.style.height = '';
            }
        });

        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 50);
    }

    // 启动观察者
    function startObserver() {
        const handleMutations = (mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-screen') {
                    const el = mutation.target;
                    if (el.matches?.(PLAYER_SELECTOR)) {
                        const oldScreen = mutation.oldValue;
                        const newScreen = el.dataset.screen;
                        if (oldScreen === 'mini' && newScreen !== 'mini') {
                            fixMainPlayerStyleOnReturn();
                        }
                        if (newScreen === 'mini') {
                            applyPositionOnMiniAppear(el);
                            if (!el.__dragListenerAttached) {
                                const cleanup = startDragListener(el);
                                el.__dragListenerCleanup = cleanup;
                                el.__dragListenerAttached = true;
                            }
                        }
                    }
                } else if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType !== Node.ELEMENT_NODE) return;
                        const elements = node.matches?.(PLAYER_SELECTOR) ? [node] : [];
                        if (node.querySelectorAll) elements.push(...node.querySelectorAll(PLAYER_SELECTOR));
                        elements.forEach(el => {
                            if (el.dataset.screen === 'mini') {
                                applyPositionOnMiniAppear(el);
                                if (!el.__dragListenerAttached) {
                                    const cleanup = startDragListener(el);
                                    el.__dragListenerCleanup = cleanup;
                                    el.__dragListenerAttached = true;
                                }
                            }
                        });
                    });
                }
            }
        };

        const observer = new MutationObserver(handleMutations);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-screen'],
            attributeOldValue: true
        });

        const existingPlayer = document.querySelector(PLAYER_SELECTOR);
        if (existingPlayer && existingPlayer.dataset.screen === 'mini') {
            applyPositionOnMiniAppear(existingPlayer);
            if (!existingPlayer.__dragListenerAttached) {
                const cleanup = startDragListener(existingPlayer);
                existingPlayer.__dragListenerCleanup = cleanup;
                existingPlayer.__dragListenerAttached = true;
            }
        }

        // SPA 支持
        const events = ['pushState', 'replaceState'];
        events.forEach(type => {
            const orig = history[type];
            history[type] = function () {
                const ret = orig.apply(this, arguments);
                setTimeout(() => {
                    // SPA 跳转不清除 tempUserPosition（保留页面内拖动状态）
                }, 0);
                return ret;
            };
        });
    }

    // 初始化
    wait_fn();
    startObserver();
})();