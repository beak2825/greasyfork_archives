// ==UserScript==
// @name         youtube-improved
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/watch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374573/youtube-improved.user.js
// @updateURL https://update.greasyfork.org/scripts/374573/youtube-improved.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let btnSpeed = (speed) => {
        let btn = document.createElement('button');
        btn.innerText = speed + 'X';
        btn.onclick = function () {
            document.querySelector('button.ytp-settings-button').click();
            let menuItems = document.querySelectorAll('.ytp-menuitem');
            for (let i=0; i<menuItems.length; i++) {
                if (menuItems[i].children[0].innerText === 'Speed') {
                    menuItems[i].children[1].click();
                    break;
                }
            }
            let idx = 3;
            switch (speed) {
                case '1':
                    idx = 3;
                    break;
                case '1.25':
                    idx = 4;
                    break;
                case '1.5':
                    idx = 5;
                    break;
            }
            document.querySelectorAll('div[role=menuitemradio]')[idx].click();
        };
        return btn;
    };

    setTimeout(() => {
        let infoEl = document.querySelector('#info');
        infoEl.insertBefore(btnSpeed('1.5'), infoEl.childNodes[0]);
        infoEl.insertBefore(btnSpeed('1.25'), infoEl.childNodes[0]);
        infoEl.insertBefore(btnSpeed('1'), infoEl.childNodes[0]);
    }, 3000);
})();