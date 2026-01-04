// ==UserScript==
// @name         code decoration
// @namespace    https://mrain22.cn/
// @version      0.1
// @description  为代码增加<code>标签，以免谷歌翻译翻译代码!
// @author       Xiuming Lee
// @match        http://*/*
// @include      https://*/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcss.com/highlight.js/9.15.9/highlight.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/389178/code%20decoration.user.js
// @updateURL https://update.greasyfork.org/scripts/389178/code%20decoration.meta.js
// ==/UserScript==

(function() {
    'use strict';
     GM_addStyle('.hljs{display:block;overflow-x:auto;padding:.5em;background:#F0F0F0}.hljs,.hljs-subst{color:#444}.hljs-comment{color:#888888}.hljs-keyword,.hljs-attribute,.hljs-selector-tag,.hljs-meta-keyword,.hljs-doctag,.hljs-name{font-weight:bold}.hljs-type,.hljs-string,.hljs-number,.hljs-selector-id,.hljs-selector-class,.hljs-quote,.hljs-template-tag,.hljs-deletion{color:#880000}.hljs-title,.hljs-section{color:#880000;font-weight:bold}.hljs-regexp,.hljs-symbol,.hljs-variable,.hljs-template-variable,.hljs-link,.hljs-selector-attr,.hljs-selector-pseudo{color:#BC6060}.hljs-literal{color:#78A960}.hljs-built_in,.hljs-bullet,.hljs-code,.hljs-addition{color:#397300}.hljs-meta{color:#1f7199}.hljs-meta-string{color:#4d99bf}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:bold}');
    hljs.initHighlightingOnLoad();
    let pres = document.querySelectorAll('pre');
    for (var i = 0; i < pres.length; i++) {
        pres[i].innerHTML = '<code class="java">' + pres[i].innerHTML + '</code>';
    }
})();