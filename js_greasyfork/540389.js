// ==UserScript==
// @name         RTX Video fix
// @name:en         RTX Video fix
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  使用小面积模糊遮罩干扰 RTX Video，解决倍速播放视频时对显卡带来的过度负载
// @description:en  Use a small-area blur overlay to interfere with RTX Video and alleviate excessive GPU load during high-speed video playback.
// @match        *://*/*
// @grant        none
// @license      GPL-v3
// @downloadURL https://update.greasyfork.org/scripts/540389/RTX%20Video%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/540389/RTX%20Video%20fix.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const OVERLAY_ID = '__bili_hdr_corner_blur__';

    function tryInjectOverlay() {
        const video = document.querySelector('video');
        const wrap = document.querySelector('.bpx-player-video-wrap');
        if (!video || !wrap) return;

        let overlay = document.getElementById(OVERLAY_ID);
        const rate = video.playbackRate;

        if (rate > 1.0 && !overlay) {
            const rect = wrap.getBoundingClientRect();

            // 设定遮罩尺寸（右下角 120x120）
            const size = 1;

            overlay = document.createElement('div');
            overlay.id = OVERLAY_ID;
            Object.assign(overlay.style, {
                position: 'fixed',
                left: `${rect.right - size}px`,
                top: `${rect.bottom - size}px`,
                width: `${size}px`,
                height: `${size}px`,
                backdropFilter: 'blur(1px)',
                webkitBackdropFilter: 'blur(1px)',
                pointerEvents: 'none',
                zIndex: '99999999',

            });
            document.body.appendChild(overlay);
            console.log('[HDR控制] 小角落模糊遮罩已插入');
        } else if (rate === 1.0 && overlay) {
            overlay.remove();
            console.log('[HDR控制] 模糊遮罩已移除');
        }

        // 实时跟随播放器位置
        if (overlay && wrap) {
            const rect = wrap.getBoundingClientRect();
            const size = 120;
            Object.assign(overlay.style, {
                left: `${rect.right - size}px`,
                top: `${rect.bottom - size}px`
            });
        }
    }

    setInterval(tryInjectOverlay, 50);
})();
