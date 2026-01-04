// ==UserScript==
// @name         cancelBtn
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  取消离线包图片选中态!
// @author       You
// @match        https://yoda.corp.kuaishou.com/*
// @icon         https://www.google.com/s2/favicons?domain=kuaishou.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432555/cancelBtn.user.js
// @updateURL https://update.greasyfork.org/scripts/432555/cancelBtn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let cancelBtn = document.createElement('div');
    cancelBtn.innerHTML = "取消图片";
    cancelBtn.className = "yh_cancelBtn";
    cancelBtn.onclick = function(){
        // 模拟点击页面展开符
        const pages = document.querySelectorAll('.tree-checkbox-selection > ul > li > i');
        pages.forEach((item) => {
            item.click();
        });
        // 模拟点击success展开符
        const success = document.querySelectorAll('.tree-checkbox-selection > ul > li > ul > li > i');
        success.forEach((item) => {
            item.click();
        });
        // 模拟点击img展开符
        const imgsTree = document.querySelectorAll('.tree-checkbox-selection > ul > li > ul > li > ul > li:nth-child(4) > .tree-selected');
        imgsTree.forEach((item) => {
            item.children[0].click();
        });
    }
    document.body.appendChild(cancelBtn);
    let style = document.createElement('style');
    style.type = "text/css";
    let styleCon = document.createTextNode(".yh_cancelBtn{position: fixed; right: 0; top: calc(50% - 22px); width: 85px; height: 44px; font-size: 13px; background-color: #ff976a; border-radius: 2px; line-height: 44px; text-align: center; color: #fff;cursor: pointer;}")
    style.appendChild(styleCon);
    let head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
})();