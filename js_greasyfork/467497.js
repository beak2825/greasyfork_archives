// ==UserScript==
// @name        自动评教脚本
// @namespace   http://pj.bit.edu.cn/pjxt2.0/*
// @version     0.1
// @description 针对BIT的自动评教脚本
// @author      枢衡_KraHsu
// @match     http://pj.bit.edu.cn/pjxt2.0/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467497/%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/467497/%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let groups = document.querySelectorAll('.control-group');

    groups.forEach((group) => {
        let firstInput = group.querySelector('input');
        if (firstInput) {
            firstInput.checked = true;
        }
    });
    let submitButton = Array.from(document.querySelectorAll('a.btn.btn-warning')).find(a => a.textContent.trim() === '提交');

    if (submitButton) {
        submitButton.click();
    }

    setTimeout(() => {
        let OK = Array.from(document.querySelectorAll('a.btn.btn-primary')).find(a => a.textContent.trim() === 'OK');

        if (OK) {
            OK.click();
        }
    }, 1000);
})();
