// ==UserScript==
// @name        YouTube Ad-Master
// @namespace   https://github.com/tientq64/userscripts
// @version     9.9.7
// @description 广告时透明度置0+16倍速，广告结束自动恢复，规避数据伪造禁令
// @author      tientq64 + Gemini
// @match       https://www.youtube.com/*
// @match       https://m.youtube.com/*
// @match       https://music.youtube.com/*
// @exclude     https://studio.youtube.com/*
// @grant       none
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/547035/YouTube%20Ad-Master.user.js
// @updateURL https://update.greasyfork.org/scripts/547035/YouTube%20Ad-Master.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const originalFetch = window.fetch;
    window.fetch = function(url, ...rest) {
            if (typeof url === "string" && url.includes("oad=")) {
                return new Response(new Uint8Array(), { status: 200 });
            }
            return originalFetch.apply(this, arguments);
        };
    let state = {
        savedVolume: 1,
        savedMuted: false,
        isAdActive: false,
        volumeLocked: false
    };

    // --- 逻辑模块 1：深度影子 DOM 探测器 (原版点击函数) ---
    const findButtonsRecursive = (root) => {
        const selectors = [
            '.ytp-ad-skip-button', '.ytp-ad-skip-button-modern',
            '.ytp-skip-ad-button', '.ytp-ad-skip-button-container button',
            '[class*="skip-button"]', '[aria-label*="跳过"]', '[aria-label*="Skip"]',
            '.ytp-ad-overlay-close-button'
        ];
        let found = [];
        selectors.forEach(s => root.querySelectorAll(s).forEach(el => found.push(el)));
        root.querySelectorAll('*').forEach(el => {
            if (el.shadowRoot) found = found.concat(findButtonsRecursive(el.shadowRoot));
        });
        return found;
    };

    const fastClick = (el) => {
        if (!el) return;
        ['mousedown', 'mouseup', 'click'].forEach(name => {
            el.dispatchEvent(new MouseEvent(name, { bubbles: true, cancelable: true, view: window }));
        });
    };

    // --- 逻辑模块 2：动态透明度控制 ---
    const toggleAdVisibility = (isAd) => {
        const player = document.querySelector('#movie_player');
        if (!player) return;

        // 关键：修改透明度而非 display:none，以防被检测容器存在性
        if (isAd) {
            player.style.setProperty('opacity', '0', 'important');
            // 保持交互，但视觉消失
            player.style.setProperty('pointer-events', 'none', 'important');
        } else {
            player.style.removeProperty('opacity');
            player.style.removeProperty('pointer-events');
        }
    };

    // --- 逻辑模块 3：核心引擎 ---
    const runSkipEngine = () => {
        const video = document.querySelector('video.html5-main-video');
        const moviePlayer = document.querySelector('#movie_player');
        // 关键：检测多个可能的广告标志
        const adShowing = moviePlayer && (
            moviePlayer.classList.contains('ad-showing') ||
            moviePlayer.classList.contains('ad-interrupting') ||
            document.querySelector('.ytp-ad-player-overlay')
        );

        

        if (adShowing && video) {
            // --- PIP 跳广告（可选） ---
            if (!document.pictureInPictureElement) {
                video.requestPictureInPicture().then(() => {
                    setTimeout(() => {
                        if (document.pictureInPictureElement) {
                            document.exitPictureInPicture();
                        }
                    }, 200);
                }).catch(() => {});
            }
            if (!state.isAdActive) {
                if (!video.muted && video.volume > 0) {
                    state.savedVolume = video.volume;
                    state.savedMuted = video.muted;
                    state.volumeLocked = true;
                }
                state.isAdActive = true;
                toggleAdVisibility(true);
            }

            // 1. 物理层处理：静音 + 稳健倍速
            video.muted = true;
            video.playbackRate = 8.0;

            // 2. 状态层处理：如果卡在 00:00，模拟一次微小的播放触发
            if (video.currentTime <= 0.1) {
                video.play().catch(() => {});
            }

            // 3. 逻辑层处理：尝试多种方式关闭广告
            // 方式 A: 模拟点击所有可能的跳过按钮
            findButtonsRecursive(document).forEach(btn => fastClick(btn));

            // 方式 B: 调用底层 API (这是解决“跳不过去”最有效的办法)
            if (moviePlayer && typeof moviePlayer.skipAd === 'function') {
                try { moviePlayer.skipAd(); } catch(e) {}
            }

            // 方式 C: 如果卡死了，强行移除 ad 类名（死马当活马医，强制刷新状态机）
            if (video.paused || video.ended) {
                moviePlayer.classList.remove('ad-showing', 'ad-interrupting');
            }

        } else if (video && state.isAdActive) {
            // D. 退出广告
            state.isAdActive = false;
            video.playbackRate = 1.0;
            toggleAdVisibility(false);

            setTimeout(() => {
                if (state.volumeLocked && video) {
                    video.volume = state.savedVolume;
                    video.muted = state.savedMuted;
                }
            }, 200);
            state.volumeLocked = false;
        }
    };

    // --- 逻辑模块 4：通用屏蔽 ---
    const applyUIPenetration = () => {
        const styleId = 'yt-master-transparent-css';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                /* 仅针对广告浮层使用透明隐藏 */
                .ytp-ad-player-overlay, .ytp-ad-module, ytd-ad-slot-renderer {
                    opacity: 0 !important;
                    pointer-events: none !important;
                }
                .ytp-ad-skip-button,
                .ytp-ad-skip-button-modern {
                    opacity: 1 !important;
                    pointer-events: auto !important;
                    display: block !important;
                }

                yt-upsell-dialog-renderer, #pigeon-messaging-container { display: none !important; }
            `;
            document.documentElement.appendChild(style);
        }
        const dismiss = document.querySelectorAll('#dismiss-button, [aria-label*="thanks"], [aria-label*="不用了"]');
        dismiss.forEach(btn => btn.click());
    };

    const tick = () => {
        runSkipEngine();
        requestAnimationFrame(tick);
    };

    setInterval(applyUIPenetration, 800);
    // --- 逻辑模块：阻断广告 DOM 注入 ---
    new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(n => {
                if (n.nodeType === 1) {
                    if (n.classList?.contains("ytp-ad-player-overlay")) n.remove();
                    if (n.tagName === "YTD-AD-SLOT-RENDERER") n.remove();
                }
            });
        });
    }).observe(document, { childList: true, subtree: true });

    requestAnimationFrame(tick);

    window.addEventListener('yt-navigate-finish', () => {
        state.isAdActive = false;
        state.volumeLocked = false;
        toggleAdVisibility(false);
    });
})();