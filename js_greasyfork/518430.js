// ==UserScript==
// @name         UCAS中国科学院大学课程评估脚本
// @namespace    http://tampermonkey.net/
// @version      2024-11-22
// @description  快速填写课程评估表单
// @author       XJD
// @match        https://xkcts.ucas.ac.cn:8443/evaluate/evaluateCourse*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ucas.ac.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518430/UCAS%E4%B8%AD%E5%9B%BD%E7%A7%91%E5%AD%A6%E9%99%A2%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E8%AF%84%E4%BC%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/518430/UCAS%E4%B8%AD%E5%9B%BD%E7%A7%91%E5%AD%A6%E9%99%A2%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E8%AF%84%E4%BC%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('input[type="radio"]').forEach(function(radio) {
        if (radio.value === '5' || radio.id === '1361') {
            radio.checked = true;
        }
    });

    document.querySelectorAll('textarea').forEach(function(textarea) {
        textarea.value = '十五字十五字十五字十五字十五字';
    });

    document.querySelectorAll('input[type="checkbox"]').forEach(function(checkbox) {
        if (checkbox.id === '1368') {
            checkbox.checked = true;
        }
    });


    // Optional: Automatically submit the form
    // document.forms[0].submit();
})();
