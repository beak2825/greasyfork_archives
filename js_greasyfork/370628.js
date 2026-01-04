// ==UserScript==
// @name         Optimize Browser
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Have a better experience to use browser.
// @author       Eugene Liu
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/370628/Optimize%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/370628/Optimize%20Browser.meta.js
// ==/UserScript==

(function () {//Ignore MouseWheel,only care key and mouse.
    var timerID;
    var timeout;
    var speed = 50;
    var EugeneScroll;
    var stopAutoScroll = false;

    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 118) {
            if (stopAutoScroll === false) {
                stopAutoScroll = true;
            } else {
                stopAutoScroll = false;
            }
        }
    };

    function ScreenSaver(settings) {
        timeout = settings.timeout;
        document.body.onmousemove = document.body.onmousedown = document.body.onkeydown = document.body.onkeypress = ScreenSaver.prototype.onevent;
        timerID = window.setTimeout(function () {
            if (!stopAutoScroll) {
                moveDown();
            }
        }, timeout);
    }

    ScreenSaver.prototype.onevent = function (e) {
        window.clearTimeout(timerID);
        stopMove();
        timerID = window.setTimeout(function () {
            if (!stopAutoScroll) {
                moveDown();
            }
        }, timeout);
    };

    function initScreenSaver() {
        new ScreenSaver({timeout: 5000});
    }

    function moveDown() {
        EugeneScroll = setInterval(function () {
            window.scrollBy(0, +1);
        }, speed);
    }

    function stopMove() {
        clearInterval(EugeneScroll);
    }

    window.onload = function () {
        initScreenSaver();
    }
})();