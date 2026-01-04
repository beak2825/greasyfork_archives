// ==UserScript==
// @name         TM青发批发插件
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  仅供娱乐、整蛊
// @match        https://trophymanager.com/scouts/hire/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497413/TM%E9%9D%92%E5%8F%91%E6%89%B9%E5%8F%91%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/497413/TM%E9%9D%92%E5%8F%91%E6%89%B9%E5%8F%91%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有带有 "button" 类的链接
    var buttons = document.querySelectorAll('a.button');

    // 隐藏这些链接
    buttons.forEach(function(button) {
        button.style.display = 'none';
    });
    // 获取所有带有 "align_center" 类的表格单元格
    var cells = document.querySelectorAll('td.align_center');

    // 替换这些单元格的内容为指定的图片元素
    cells.forEach(function(cell, index) {
        if (index%7==1|index%7==5) {
            cell.innerHTML = '<img src="/pics/star.png" alt="20" title="20">';
        }
    });

    var subtle = document.querySelectorAll('span.subtle.small');

    // 替换这些单元格的内容为指定的图片元素
    subtle.forEach(function(subtle) {
        subtle.innerHTML = '<span class="subtle small">工资: 100,000,000, 签约: 250 M</span>';
    });
})();
