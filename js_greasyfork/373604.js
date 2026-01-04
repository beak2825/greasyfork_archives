// ==UserScript==
// @name         替换网页字体为微软雅黑，英文及代码字体为Fira Code
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  替换网页字体为微软雅黑，代码字体为Fira Code
// @author       gooin@outlook.com
// @include     	http://*
// @include			https://*
// @grant        none
// @run-at			document-idle
// @downloadURL https://update.greasyfork.org/scripts/373604/%E6%9B%BF%E6%8D%A2%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E4%B8%BA%E5%BE%AE%E8%BD%AF%E9%9B%85%E9%BB%91%EF%BC%8C%E8%8B%B1%E6%96%87%E5%8F%8A%E4%BB%A3%E7%A0%81%E5%AD%97%E4%BD%93%E4%B8%BAFira%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/373604/%E6%9B%BF%E6%8D%A2%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E4%B8%BA%E5%BE%AE%E8%BD%AF%E9%9B%85%E9%BB%91%EF%BC%8C%E8%8B%B1%E6%96%87%E5%8F%8A%E4%BB%A3%E7%A0%81%E5%AD%97%E4%BD%93%E4%B8%BAFira%20Code.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let codeEle = document.getElementsByTagName('code')
    for(let code of codeEle){
        code.style.fontFamily="Fira Code"
    }
    let preEle = document.getElementsByTagName('pre')
    for(let code of preEle){
        code.style.fontFamily="Fira Code"
    }
    // codepen
    let codepenEle = document.getElementsByClassName("CodeMirror")
     for(let code of codepenEle){
        code.style.fontFamily="Fira Code"
    }
})();