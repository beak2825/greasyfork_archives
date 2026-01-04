// ==UserScript==
// @name         Youtube music control
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Control keys for youtube music
// @author       KoctrX
// @match        https://music.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392547/Youtube%20music%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/392547/Youtube%20music%20control.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', function() {
        document.body.addEventListener('keydown', e => {
            switch (e.keyCode) {
                case 102:
                    document.getElementsByClassName('next-button')[0].click();
                    break;
                case 100:
                    document.getElementsByClassName('previous-button')[0].click();
                    break;
                case 98:
                    document.getElementsByClassName('dislike')[0].click();
                    break;
                case 104:
                    document.getElementsByClassName('like')[0].click();
                    break;
            }
        });
    }, false);
})();