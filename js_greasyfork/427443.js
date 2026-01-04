// ==UserScript==
// @name         Luogu Solution Delayer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  就不让你看洛谷题解！
// @author       nalemy
// @match        https://www.luogu.com.cn/problem/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427443/Luogu%20Solution%20Delayer.user.js
// @updateURL https://update.greasyfork.org/scripts/427443/Luogu%20Solution%20Delayer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var sol = null, int = null;
    int = setInterval(() => {
        sol = document.evaluate('//*[@id="app"]/div[2]/main/div/section[1]/div[1]/a[2]', document).iterateNext();
        if (sol != null) {
            console.log(1);
            var start = new Date().getTime();
            var par = sol.parentElement;
            var base = par.innerHTML;
            int = setInterval(() => {
                sol.remove();
                // 下面的 30000 可以改成隐藏多长时间（毫秒）
                if (new Date()-start >= 30000) {
                    clearInterval(int);
                    console.log(2);
                    par.innerHTML = base;
                }
            }, 100);
        }
    }, 10);
})();