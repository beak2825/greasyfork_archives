// ==UserScript==
// @name         知乎公式复制LaTeX
// @namespace    https://jasongzy.com
// @version      1.0
// @description  在知乎中直接复制公式即可得到对应的LaTeX代码
// @author       jasongzy
// @match        https://www.zhihu.com/*
// @match        https://www.zhihu.com/question/*
// @match        https://zhuanlan.zhihu.com/p/*
// @icon         https://www.google.com/s2/favicons?domain=zhihu.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/432542/%E7%9F%A5%E4%B9%8E%E5%85%AC%E5%BC%8F%E5%A4%8D%E5%88%B6LaTeX.user.js
// @updateURL https://update.greasyfork.org/scripts/432542/%E7%9F%A5%E4%B9%8E%E5%85%AC%E5%BC%8F%E5%A4%8D%E5%88%B6LaTeX.meta.js
// ==/UserScript==

GM_addStyle('.MathJax_Preview ~ .math-holder {font-size:0 !important; display:inline !important;}');
GM_addStyle('span.MJX_Assistive_MathML {display: none !important;}');

function edit_latex() {
    let eqs = document.querySelectorAll(".MathJax_Preview ~ .math-holder");
    // console.log(eqs);
    for (let i = 0; i < eqs.length; i++) {
        if (!eqs[i].textContent.startsWith('$') || !eqs[i].textContent.endsWith('$')) {
            let latex = '$' + eqs[i].textContent + '$';
            eqs[i].textContent = latex;
            // console.log(latex);
        }
    }
}

document.addEventListener('scroll', edit_latex);

(window.onload = function () {
    'use strict';
    setTimeout(function () {
        edit_latex();
    }, 3000);
})
