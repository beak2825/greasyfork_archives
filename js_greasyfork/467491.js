// ==UserScript==
// @name         ar5iv helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  避免翻译 ar5iv 页面上的公式
// @author       superzero
// @license      MIT
// @match        https://ar5iv.labs.arxiv.org/html/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arxiv.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467491/ar5iv%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/467491/ar5iv%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 获取所有class为ltx_Math和ltx_equationgroup的元素
    var mathElems = document.querySelectorAll('.ltx_Math, .ltx_equationgroup, .ltx_equation, .ltx_figure, .ltx_table');

    // 遍历所有元素
    for (var i = 0; i < mathElems.length; i++) {
        // 给元素添加translate属性
        mathElems[i].setAttribute('translate', 'no');

        // 获取元素内部所有标签
        var tags = mathElems[i].getElementsByTagName('*');

        // 遍历所有标签
        for (var j = 0; j < tags.length; j++) {
            // 给标签添加translate属性
            tags[j].setAttribute('translate', 'no');
        }
    }


    // 获取所有class既是ltx_caption又是ltx_centering的元素
    var elems = document.querySelectorAll('.ltx_caption.ltx_centering');

    // 遍历所有元素
    for (var k = 0; k < elems.length; k++) {
        // 给元素添加属性，例如添加translate属性
        elems[k].setAttribute('translate', 'no');
    }
})();