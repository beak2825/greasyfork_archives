// ==UserScript==
// @name         PornHub Hide Mouse Cursor
// @name:ru      PornHub скрывает курсор мыши
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hide mouse cursor (pointer) when watching videos on PornHub after 2 seconds of mouse inactivity
// @description:ru Скрытие курсора мыши при просмотре видео на PornHub после 2 секунд бездействия мыши
// @author       Paul Melekhov
// @match        *://*.pornhub.com/view_video.php?viewkey=*
// @match        *://*.youporn.com/watch/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502919/PornHub%20Hide%20Mouse%20Cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/502919/PornHub%20Hide%20Mouse%20Cursor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let timeout;

    const hideCursor = () => {
        document.body.style.cursor = 'none';
    };

    const showCursor = () => {
        document.body.style.cursor = 'default';
        clearTimeout(timeout);
        timeout = setTimeout(hideCursor, 2000);
    };

    const videoPlayer = document.querySelector('.mgp_videoWrapper');

    if (videoPlayer) {
        const videoElement = videoPlayer.querySelector('video');

        if (videoElement) {
            // Remove pointer-events manipulation for blocking elements
            videoPlayer.style.pointerEvents = 'auto';
            videoElement.style.pointerEvents = 'auto';

            document.addEventListener('mousemove', () => {
                showCursor();
            }, true); // Use capture phase

            videoPlayer.addEventListener('mouseenter', () => {
                showCursor();
            }, true); // Use capture phase

            videoPlayer.addEventListener('mouseleave', () => {
                document.body.style.cursor = 'default';
                clearTimeout(timeout);
            }, true); // Use capture phase

            videoElement.addEventListener('play', () => {
                showCursor();
            });

            videoElement.addEventListener('pause', () => {
                document.body.style.cursor = 'default';
                clearTimeout(timeout);
            });

            // Initial call to hide cursor after 2 seconds if there's no movement and video is playing
            if (!videoElement.paused) {
                console.log('initial');
                timeout = setTimeout(hideCursor, 2000);
            }
        }
    }
})();