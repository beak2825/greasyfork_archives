// ==UserScript==
// @name         MIYAGPT自动选中上下文
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  MIYAGPT自动选中上下文、输入框样式扩大、最大输入字符修改
// @author       You
// @match        https://*.miyadns.com/*
// @icon         https://www.miyadns.com/img/avatar.adff939f.jpg
// @grant        none
// @license      MIT License
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/500931/MIYAGPT%E8%87%AA%E5%8A%A8%E9%80%89%E4%B8%AD%E4%B8%8A%E4%B8%8B%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/500931/MIYAGPT%E8%87%AA%E5%8A%A8%E9%80%89%E4%B8%AD%E4%B8%8A%E4%B8%8B%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function selectCheckboxes() {
    var divs = Array.from(document.querySelectorAll('.chatSection')); // 将NodeList转换为Array
    divs = divs.filter(div => div.className === "chatSection"); // 筛选出只有"chatSection"类名的元素
    divs.forEach(function(div) {
        var checkboxes = div.querySelectorAll('.q-checkbox__inner.relative-position.non-selectable.q-checkbox__inner--falsy');
        checkboxes.forEach(function(checkbox) {
            checkbox.classList.remove("q-checkbox__inner--falsy"); // 移除falsy样式
            checkbox.classList.add("q-checkbox__inner--truthy"); // 添加truthy样式
        });
    });
}


    window.addEventListener('load', function() {

    // 修改最大字符
    var textarea = document.querySelector('.el-textarea__inner');
    textarea.setAttribute('maxlength', '4000'); // 将最大输入长度设置为4000
    // 文本也修改了吧
   var element = document.querySelector(".infoBtn-box .all");
        if (element) {
            element.textContent = "/ 4000";
        } // 将计数器最大值也修改为4000

    //新增textarea高度样式
    var originalHeight = textarea.style.height; // 记录原始高度
    textarea.addEventListener('focus', function() {
        textarea.style.height = "1.2rem"; // 当textarea获取焦点时，设置高度为4行
    });
    textarea.addEventListener('blur', function() {
        textarea.style.height = originalHeight; // 当textarea失去焦点时，恢复原始高度
    });


    var button = document.querySelector('.q-btn.q-btn-item.non-selectable.no-outline.q-btn--flat.q-btn--round.q-btn--actionable.q-focusable.q-hoverable.q-btn--dense');
    button.addEventListener('click', function(e) {
        e.preventDefault(); // 阻止按钮默认事件
        selectCheckboxes();
        // 在这里执行按钮的后续事件
    });

    // 这里添加对回车键的监听
    window.addEventListener('keydown', function(e) {
        if (e.keyCode === 13) { // 如果按下的是回车键
            e.preventDefault(); // 阻止默认事件
            selectCheckboxes();
            // 在这里执行回车键的后续事件
        }
    });
}, false);


})();
