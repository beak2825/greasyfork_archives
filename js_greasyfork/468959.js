// ==UserScript==
// @name         LT员工季度互评自动填分数
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  员工季度互评自动填分数!
// @author       wenyc15
// @match        http://10.80.129.32/OTHERSYSTEM/ehrjxkh/QuarterGZ/MutualEvaluation.aspx?*
// @icon         https://www.google.com/s2/favicons?domain=129.32
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468959/LT%E5%91%98%E5%B7%A5%E5%AD%A3%E5%BA%A6%E4%BA%92%E8%AF%84%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%88%86%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/468959/LT%E5%91%98%E5%B7%A5%E5%AD%A3%E5%BA%A6%E4%BA%92%E8%AF%84%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%88%86%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function () {
        var lstA = document.querySelectorAll('input[id^="txtA"]');
        var lstB = document.querySelectorAll('input[id^="txtB"]');
        var lstC = document.querySelectorAll('input[id^="txtC"]');
        for( var i = 0; i< lstA.length ;i++){
            lstA[i].value = Math.floor(Math.random()*(3)+37)
            lstB[i].value = Math.floor(Math.random()*(3)+27)
            lstC[i].value = Math.floor(Math.random()*(3)+27)
        }


    }
    // Your code here...
})();