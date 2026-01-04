// ==UserScript==
// @name         CSND latex公式复制
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Click to copy equation in Wikipedia and Zhihu
// @author       curious
// @match        https://blog.csdn.net/*/article/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480518/CSND%20latex%E5%85%AC%E5%BC%8F%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/480518/CSND%20latex%E5%85%AC%E5%BC%8F%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
const reverseMatchUntilNewline = function(inputString) {
    let i = inputString.length - 1;
    for (; i >= 0; i--) {
        if (inputString[i] === '\n') {
            // 遇到换行符时停止匹配
            break;
        }
    }
    return inputString.substring(i).trim();
};
function edit_latex() {
    let eqs = document.querySelectorAll(".katex");
    // console.log(eqs);
    for (let i = 0; i < eqs.length; i++) {
        let latex = '';
        // 检查是否存在 <annotation> 标签
        let annotation = eqs[i].querySelector('annotation');
        if (annotation) {
            console.log('latex:annotation');
            latex = '$' + annotation.textContent.trim() + '$';
            annotation.textContent = latex;
        } else {
            // 如果没有找到 <annotation>，可能需要更复杂的处理来从 HTML 转换回 LaTeX
            let kmathml = eqs[i].querySelector('.katex-mathml')
            latex = '$ ' + reverseMatchUntilNewline(kmathml.textContent.trim()) + ' $'
            kmathml.textContent = latex;
        }
        eqs[i].textContent = latex;
        
    }
}

document.addEventListener('scroll', edit_latex);

(window.onload = function () {
    'use strict';
    setTimeout(function () {
        edit_latex();
    }, 3000);
})