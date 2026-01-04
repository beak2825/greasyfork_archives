// ==UserScript==
// @name         Kt-ExampNote 括号包裹工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为所有 kt-exampNote 元素的内容添加括号
// @author       Your Name
// @match        https://www.kielitoimistonsanakirja.fi/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525850/Kt-ExampNote%20%E6%8B%AC%E5%8F%B7%E5%8C%85%E8%A3%B9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/525850/Kt-ExampNote%20%E6%8B%AC%E5%8F%B7%E5%8C%85%E8%A3%B9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function wrapContent() {
        // 选择所有目标元素
        const spans = document.querySelectorAll('span.kt-exampNote');

        spans.forEach(span => {
            // 保留原有 HTML 结构并添加括号

            if(!span.textContent.startsWith("[")){
               span.textContent = `(${span.textContent})`;
            }



        });
    }


    setTimeout(wrapContent, 3000);



})();