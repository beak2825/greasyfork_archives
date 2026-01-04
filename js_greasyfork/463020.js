// ==UserScript==
// @name         店小秘去弹窗
// @license      MIT
// @namespace    https://baidu.com
// @version      0.2
// @description  店小秘去弹窗0.2
// @author       ibryang
// @match        https://www.dianxiaomi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dianxiaomi.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463020/%E5%BA%97%E5%B0%8F%E7%A7%98%E5%8E%BB%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/463020/%E5%BA%97%E5%B0%8F%E7%A7%98%E5%8E%BB%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    removeElementById("expireVipShowInfoModal")
    removeElementById("lazadaShipTipsModal")
})();

function removeElementById(id){
    // 通过获取元素的父节点，然后用 removeChild() 方法删除指定的元素
    const element = document.querySelector("#"+id);
    element.parentNode.removeChild(element);
}