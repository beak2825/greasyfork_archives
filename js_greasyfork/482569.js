// ==UserScript==
// @name         扬州大学一键教评
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动选择并填充打开后等待时间到会自动 提交
// @author       You
// @match        http://ydjwxs.yzu.edu.cn/student/teachingEvaluation/teachingEvaluation/evaluationPage
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yzu.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482569/%E6%89%AC%E5%B7%9E%E5%A4%A7%E5%AD%A6%E4%B8%80%E9%94%AE%E6%95%99%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/482569/%E6%89%AC%E5%B7%9E%E5%A4%A7%E5%AD%A6%E4%B8%80%E9%94%AE%E6%95%99%E8%AF%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var tdElements = document.querySelectorAll('td[style="width:98%;"]');

    // 遍历每个符合条件的 td 元素并点击其中的第一个 div 中的 label 元素
    tdElements.forEach(function(td) {
    var firstDiv = td.querySelector('div');

    // 找到第一个 div 中的 label 元素
    if (firstDiv) {
        var label = firstDiv.querySelector('label');

        // 模拟点击操作
        if (label) {
            label.click();
        }
    }
});
    const text = document.querySelector('#page-content-template > div > div > div.widget-content > form > div > table > tbody > tr:nth-child(43) > td > div > textarea')
    text.innerText='很好'
    setTimeout(function() {
    const sub = document.querySelector('#buttonSubmit')
    sub.click();
    setTimeout(function() {
    document.querySelector('#layui-layer1 > div.layui-layer-btn > a.layui-layer-btn0').click()
}, 1000);
}, 31000);
})();