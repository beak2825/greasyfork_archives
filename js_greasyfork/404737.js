// ==UserScript==
// @name         shua
// @version      alpha
// @description  shuashuashua
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @grant        none
// @namespace https://greasyfork.org/users/398473
// @downloadURL https://update.greasyfork.org/scripts/404737/shua.user.js
// @updateURL https://update.greasyfork.org/scripts/404737/shua.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var title, time;

    config(ready);

    function config(callback) {
        if (!sessionStorage.oixmRefreshTime) {
            time = parseInt(prompt("时间", 12));
            if (isNaN(time)) return;
            sessionStorage.oixmRefreshTime = time;
        } else {
            time = parseInt(sessionStorage.oixmRefreshTime);
        }
        callback();
    }

    function ready() {
        title = document.title;
        loop();
    }

    function loop() {
        document.title = "[" + formatTime(time) + "] " + title;
        if (time === 0) {
            location.reload();
            return;
        }
        time--;
        setTimeout(loop, 1000);
    }


    function formatTime(t) {
        if (isNaN(t)) return "";
        var s = "";
        var h = parseInt(t / 3600);
        s += (pad(h) + ":");
        t -= (3600 * h);
        var m = parseInt(t / 60);
        s += (pad(m) + ":");
        t -= (60 * m);
        s += pad(t);
        return s;
    }

 
    function pad(n) {
        return ("00" + n).slice(-2);
    }

})();