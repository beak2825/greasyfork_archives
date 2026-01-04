// ==UserScript==
// @name         替换代码字体为Fira Code
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  replace code font with Fira Code
// @author       913466287@qq.com
// @include     	http://*
// @include			https://*
// @grant        none
// @run-at			document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501884/%E6%9B%BF%E6%8D%A2%E4%BB%A3%E7%A0%81%E5%AD%97%E4%BD%93%E4%B8%BAFira%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/501884/%E6%9B%BF%E6%8D%A2%E4%BB%A3%E7%A0%81%E5%AD%97%E4%BD%93%E4%B8%BAFira%20Code.meta.js
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