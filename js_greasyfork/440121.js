// ==UserScript==
// @name         JSLinux Tweaks
// @namespace    http://tampermonkey.net/
// @version      1.O
// @description  Adds a fullscreen button to JSLinux and sets min memory
// @author       Andrea Bonari
// @include      https://bellard.org/jslinux/vm.html*
// @icon         https://www.google.com/s2/favicons?domain=bellard.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440121/JSLinux%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/440121/JSLinux%20Tweaks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MIN_MEMORY = 256;

    window.addEventListener('load', () => {

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        if(urlParams.get('mem') < MIN_MEMORY) {
            window.location.href = location.search.replace(/mem=[^&$]*/i, `mem=${MIN_MEMORY}`);

        }

        document.querySelector('#term_bar label').insertAdjacentHTML( 'beforeend', '<img title="Fullscreen" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/OOjs_UI_icon_fullScreen.svg/1200px-OOjs_UI_icon_fullScreen.svg.png" width="20" style="margin-left: 10px;">');

        let old_width, old_height, timeout;
        const oldDisplay = document.querySelector('.term_scrollbar').style.display;

        const container = document.querySelector('#term_container');

        document.querySelector('#term_bar label img[title="Fullscreen"]').addEventListener('click', () => {
            old_height = container.offsetHeight;
            old_width = container.offsetWidth;

            document.querySelector('.term_scrollbar').style.display = 'none';

            timeout = setTimeout(() => {
                term.resizePixel(window.screen.width, window.screen.height);
                console_resize_event();
            }, 1000);

            container.requestFullscreen();
        });

        container.addEventListener('fullscreenchange', e => {
            if(document.fullscreenElement) return;

            clearTimeout(timeout);
            document.querySelector('.term_scrollbar').style.display = oldDisplay;

            term.resizePixel(old_width, old_height);
            console_resize_event();
        })
    }, false);
})();