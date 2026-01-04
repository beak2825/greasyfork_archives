// ==UserScript==
// @name         nnkr kansen timezone fix
// @version      0.14
// @description  Patch the timezone bug on nnkr tenhou kansen app. Use Japan (UTC+9) timezone instead of the user's local timezone.
// @author       shindexro
// @match        https://nnkr.jp/tenhou/kansen*
// @match        http://nnkr.jp/tenhou/kansen*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/430500/nnkr%20kansen%20timezone%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/430500/nnkr%20kansen%20timezone%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const JP_UTC_OFFSET = 9;

    tenhou.passed = function (time) {
        var d = new Date();
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var current = new Date(utc + (3600000*JP_UTC_OFFSET));

        var a = time.split(':');
        var start = new Date(current);
        start.setHours(a[0]);
        start.setMinutes(a[1]);

        var passed = parseInt((current.getTime() - start.getTime()) / (1000*60));
        var past = (passed > 0) ? true : false;
        if(Math.abs(passed) > 60*12){
            passed = Math.abs(passed) - 60*24;
            past = ! past;
        }
        if(Math.abs(passed)>=120){
            return false;
        }else{
            return past ? '+'+ Math.abs(passed)+'分' : '<span class="still">' + Math.abs(passed) + '分後</span>';
        }
    }

})();