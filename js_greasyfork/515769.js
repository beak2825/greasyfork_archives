// ==UserScript==
// @name         laplace复杂功能实现
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  实现公告最上面的关闭按钮的关闭功能
// @author       Darknights
// @match        https://laplace.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=laplace.live
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515769/laplace%E5%A4%8D%E6%9D%82%E5%8A%9F%E8%83%BD%E5%AE%9E%E7%8E%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/515769/laplace%E5%A4%8D%E6%9D%82%E5%8A%9F%E8%83%BD%E5%AE%9E%E7%8E%B0.meta.js
// ==/UserScript==


'use strict';

window.onload = () => {
    let buttonArr = document.querySelectorAll(".relative > .appearance-none");
    if(buttonArr.length>0){
        buttonArr[0].onclick=function(){
            buttonArr[2].click();
        }
    }
}
