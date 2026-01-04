// ==UserScript==
// @name         解除CSDN代码不可选中
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解除CSDN代码不可选中,解除文本不可选中
// @author       shinn_lancelot
// @match        https://blog.csdn.net/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450443/%E8%A7%A3%E9%99%A4CSDN%E4%BB%A3%E7%A0%81%E4%B8%8D%E5%8F%AF%E9%80%89%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/450443/%E8%A7%A3%E9%99%A4CSDN%E4%BB%A3%E7%A0%81%E4%B8%8D%E5%8F%AF%E9%80%89%E4%B8%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // let contentViewObj = document.querySelector('#content_views');
    let codeObjs = document.querySelectorAll('code');
    let preObjs = document.querySelectorAll('pre');
    let copyBtnDom = '';

    for (var i = 0, length = codeObjs.length; i < length; i++) {
        codeObjs[i].style += codeObjs[i].style + '; user-select: text !important;';
    }

    for (var j = 0, len = preObjs.length; j < len; j++) {
        preObjs[j].style += preObjs[j].style + '; user-select: text !important;';
        copyBtnDom = document.createElement('button');
        copyBtnDom.innerHTML = '复制全部';
        copyBtnDom.style = 'box-sizing: border-box; padding: 5px 19px; border-radius: 3px; color: #fff; background-color: #aaaaaa; position: absolute; right: 12px; top: 33px; z-index: 1000; font-size: 12px; font-weight: 100;';
        // preObjs[j].append(copyBtnDom);
    }

    function copyText(elObj) {
        elObj.select();
        document.execCommand('copy');
    }
})();