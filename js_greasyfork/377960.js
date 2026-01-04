// ==UserScript==
// @name         修改牛客网编辑器字体
// @namespace    http://www.nowcoder.com/
// @version      0.1
// @description  把牛客网的代码编辑器字体改成Consolas!
// @author       delbertbeta
// @match        https://www.nowcoder.com/practice/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377960/%E4%BF%AE%E6%94%B9%E7%89%9B%E5%AE%A2%E7%BD%91%E7%BC%96%E8%BE%91%E5%99%A8%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/377960/%E4%BF%AE%E6%94%B9%E7%89%9B%E5%AE%A2%E7%BD%91%E7%BC%96%E8%BE%91%E5%99%A8%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let head = document.getElementsByTagName('head')[0]
    let style = document.createElement('style')
    let value = ".cm-s-monokai.CodeMirror {font-family: 'Monaco','Menlo','Ubuntu Mono','Consolas','source-code-pro',monospace !important}"
    style.innerHTML = value
    head.appendChild(style)
})();