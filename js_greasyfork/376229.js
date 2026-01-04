// ==UserScript==
// @name         CSDN Clean Page
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  关闭未登录时的底部通知，自动点击“阅读更多”，关闭“转盘”
// @author       You
// @match        https://blog.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376229/CSDN%20Clean%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/376229/CSDN%20Clean%20Page.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    var a = $(".btn-close");
    var m = $("#btn-readmore");

    var ad1 = $('#_360_interactive');
    var ad2 = $('#adContent');

    var counter = 0;
    while (a.length == 0 || m.length == 0) {
        await sleep(2000);
        counter ++;
        if (counter > 16) {
            console.log('Waited 32 seconds, exiting...');
            return -1;
        }
        console.log("Length: a:", a.length, "m:", m.length);
    }

    for (var i = 0; i < a.length; i++) {
        a[i].click();
    }
    console.log("a clicked");
    m[0].click()
    console.log("m clicked");

    console.log("All Btns Clicked");

    ad1.remove();
    ad2.remove();

    return 0;
})();