// ==UserScript==
// @name         移除 https://cn.pornhub.org/ 年龄验证
// @namespace    https://greasyfork.org/users/your-profile
// @version      1.0
// @description  自动移除 https://cn.pornhub.org/ 的年龄验证弹窗
// @author       YourName
// @match        https://cn.pornhub.org/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/536426/%E7%A7%BB%E9%99%A4%20https%3Acnpornhuborg%20%E5%B9%B4%E9%BE%84%E9%AA%8C%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/536426/%E7%A7%BB%E9%99%A4%20https%3Acnpornhuborg%20%E5%B9%B4%E9%BE%84%E9%AA%8C%E8%AF%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 目标元素ID列表
    const targetElements = ['container', 'wrapper'];
    let foundElements = false;

    // 检查并移除元素
    function removeAgeCheck() {
        targetElements.forEach(id => {
            const element = document.getElementById('age-verification-' + id);
            if (element) {
                element.remove();
                foundElements = true;
                console.log(`已移除 age-verification-${id}`);
            }
        });

        // 如果没找到，延迟再试一次（防止页面加载慢）
        if (!foundElements) {
            setTimeout(removeAgeCheck, 1);
        }
    }

    // 页面加载完成后执行
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        removeAgeCheck();
    } else {
        window.addEventListener('DOMContentLoaded', removeAgeCheck);
    }
})();