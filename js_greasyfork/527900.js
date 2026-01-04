// ==UserScript==
// @name         Devtool mobile
// @version      1.4
// @description  Enables you to open developer tools on mobile
// @author       ㅇㅇ
// @license      MIT
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/1426529
// @downloadURL https://update.greasyfork.org/scripts/527900/Devtool%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/527900/Devtool%20mobile.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var erudaLoaded = false;
    var erudaScript = null;
    var touchCount = 0;
    var touchTimer = null;

    function loadEruda() {
        if (!erudaLoaded) {
            erudaScript = document.createElement('script');
            erudaScript.src = "//cdn.jsdelivr.net/npm/eruda";
            document.body.appendChild(erudaScript);

            erudaScript.onload = function () {
                eruda.init();
                eruda.show();
                erudaLoaded = true;
                localStorage.setItem('erudaLoaded', 'true');
            };
        }
    }

    function unloadEruda() {
        if (erudaLoaded) {
            eruda.destroy();
            document.body.removeChild(erudaScript);
            erudaScript = null;
            erudaLoaded = false;
            localStorage.setItem('erudaLoaded', 'false');
        }
    }

    document.addEventListener('touchstart', function (e) {
        if (e.touches.length === 2) { // 두 손가락 터치 감지
            touchCount++;

            if (touchTimer) {
                clearTimeout(touchTimer);
            }

            touchTimer = setTimeout(function () {
                touchCount = 0; // 300ms 이후 터치 카운트 초기화
            }, 300);

            if (touchCount === 3) { // 3번 터치 시 동작
                erudaLoaded ? unloadEruda() : loadEruda();
                touchCount = 0;
            }
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'R') {
            erudaLoaded ? unloadEruda() : loadEruda();
        }
    });

    if (localStorage.getItem('erudaLoaded') === 'true') {
        loadEruda();
    }
})();