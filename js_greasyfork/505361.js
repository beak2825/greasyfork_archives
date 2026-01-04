// ==UserScript==
// @name         PornHub Video AutoFocus
// @name:ru      PornHub видео автофокус
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically focuses the video player on PornHub so that you can use keyboard shortcuts immediately after page load
// @description:ru Автоматически делает активный видеоплеер на PornHub так, что вы сразу можете использовать горячие клавиши после открытия страницы
// @author       Paul Melekhov
// @match        *://*.pornhub.com/view_video.php?viewkey=*
// @match        *://*.youporn.com/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornhub.com
// @grant        none
// @license MIT
// @homepageURL  https://github.com/gugglegum/pornhub-video-autofocus/issues
// @supportURL   https://github.com/gugglegum/pornhub-video-autofocus/issues
// @downloadURL https://update.greasyfork.org/scripts/505361/PornHub%20Video%20AutoFocus.user.js
// @updateURL https://update.greasyfork.org/scripts/505361/PornHub%20Video%20AutoFocus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const videoWrapper = document.querySelector('.mgp_videoWrapper');

    if (videoWrapper) {
        const playerDiv = videoWrapper.parentElement;
        if (playerDiv) {
            playerDiv.focus();
        }
    }
})();
