// ==UserScript==
// @name         标记可转债是否盈利
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://data.eastmoney.com/kzz/default.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413607/%E6%A0%87%E8%AE%B0%E5%8F%AF%E8%BD%AC%E5%80%BA%E6%98%AF%E5%90%A6%E7%9B%88%E5%88%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/413607/%E6%A0%87%E8%AE%B0%E5%8F%AF%E8%BD%AC%E5%80%BA%E6%98%AF%E5%90%A6%E7%9B%88%E5%88%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function toMark() {
        let tb = document.getElementsByTagName('tbody')[0];
        let trs = tb.getElementsByTagName('tr');
        for (var i = 0;i < trs.length;i++) {
            var td = trs[i].getElementsByTagName('td')[10];
            if (td.innerText.split('.')[0].length >= 3) {
                td.style.background = "red";
            } else {
                td.style.background = "green";
            }
        }
    }
    window.onload = function() {
        setInterval(toMark,2000);
    };
    // Your code here...
})();