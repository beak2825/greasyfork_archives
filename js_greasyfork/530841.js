// ==UserScript==
// @name         禁止 bing search 点击文本 选择链接 跳转事件
// @namespace    https://greasyfork.org/zh-CN/users/722555-vveishu
// @version      3.0.2
// @description  禁止 bing search 奇葩的跳转事件，可以自由地点击文本、选择链接
// @author       vveishu
// @match        https://www.bing.com/search?*
// @match        https://cn.bing.com/search?*
// @icon         https://www.bing.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530841/%E7%A6%81%E6%AD%A2%20bing%20search%20%E7%82%B9%E5%87%BB%E6%96%87%E6%9C%AC%20%E9%80%89%E6%8B%A9%E9%93%BE%E6%8E%A5%20%E8%B7%B3%E8%BD%AC%E4%BA%8B%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/530841/%E7%A6%81%E6%AD%A2%20bing%20search%20%E7%82%B9%E5%87%BB%E6%96%87%E6%9C%AC%20%E9%80%89%E6%8B%A9%E9%93%BE%E6%8E%A5%20%E8%B7%B3%E8%BD%AC%E4%BA%8B%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取所有具有特定类的元素
    var elements = document.querySelectorAll('.b_rc_gb_sub_cell.b_rc_gb_sub_text');
    elements.forEach(function (element) {
        // 移除 style 属性中的 cursor: pointer
        if (element.style.cursor === 'pointer') {
            element.style.cursor = '';
        }
        // 替换原来的元素，以达到清除事件的效果
        const oldDiv = element;
        const newDiv = oldDiv.cloneNode(true);
        oldDiv.parentNode.replaceChild(newDiv, oldDiv);
    });

})();
