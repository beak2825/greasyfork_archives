// ==UserScript==
// @name         SCUT library helper
// @namespace    https://www.scut.edu.cn/
// @version      0.11
// @description  我家图书馆还蛮大的。不来约一发吗？看累了就直接睡觉，没问题的（安心感）
// @author       NaN
// @match        https://mypass.scut.edu.cn/hsmobile/*
// @grant        none
// @run-at       document-end
// @require      https://cdn.bootcdn.net/ajax/libs/datejs/1.0/date.min.js
// @downloadURL https://update.greasyfork.org/scripts/410955/SCUT%20library%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/410955/SCUT%20library%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.xmSelectTimeDate = function () {
        let arr = [];
        for (let i = 0; i <= 30;++i) {
            let j = Date.today().addDays(i).toISOString().split('T')[0];
            arr.push({name: j, value: j, selected: false});
        }
        arr[0].selected = true;
        return arr;
    }
})();