// ==UserScript==
// @name         suizhikuo-remove-all-disabled
// @namespace    http://tampermonkey.net/
// @version      2024-06-19
// @description  js去掉所有元素的disabled
// @author       随智阔
// @match	     *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492110/suizhikuo-remove-all-disabled.user.js
// @updateURL https://update.greasyfork.org/scripts/492110/suizhikuo-remove-all-disabled.meta.js
// ==/UserScript==

$(document).ready(function () {
    'use strict';
    // debugger;
    console.log("篡改猴(Tampermonkey)脚本 ---> js去掉所有元素的disabled");

    // 选择所有的表单元素
    var formElements = document.querySelectorAll('input, select, textarea, button');
    // var allElements = document.querySelectorAll('*');
    // 遍历并移除disabled属性
    formElements.forEach(function (element) {
        element.disabled = false;
    });
});