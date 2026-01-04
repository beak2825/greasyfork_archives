// ==UserScript==
// @name         Enable PictureInPicture Hulu
// @version      1.0
// @description  Removes "disablepictureinpicture" attribute on hulu player.
// @author       DaemonErrors
// @match        https://www.hulu.com/*
// @grant        none
// @namespace https://greasyfork.org/users/288482
// @downloadURL https://update.greasyfork.org/scripts/381317/Enable%20PictureInPicture%20Hulu.user.js
// @updateURL https://update.greasyfork.org/scripts/381317/Enable%20PictureInPicture%20Hulu.meta.js
// ==/UserScript==

(() => {
    'use strict';

    let target = document.querySelector('body');
    let observer = new MutationObserver(function (mutations) {
        mutations.forEach((mutation) => {
            let elem = document.querySelector('.video-player');
            if (elem.length !== null) {
                elem.removeAttribute('disablepictureinpicture');
                this.disconnect;
            }
        });
    });
    observer.observe(target, { attributes: true, childList: true });
})();