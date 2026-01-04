// ==UserScript==
// @name         闲鱼网页标题
// @namespace    http://tampermonkey.net/
// @version      2024-11-12
// @description  把闲鱼网页的标题改成商品的描述
// @author       Clansty
// @match        *://www.goofish.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=goofish.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516968/%E9%97%B2%E9%B1%BC%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/516968/%E9%97%B2%E9%B1%BC%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const id = setInterval(()=>{
        const contentChildren = document.getElementById('content').children;
        const containerChildren = Array.from(contentChildren).find(it=>it.className.startsWith('item-container')).children;
        const mainContainerChildren = Array.from(containerChildren).find(it=>it.className.startsWith('item-main-container')).children;
        const mainInfoChildren = Array.from(mainContainerChildren).find(it=>it.className.startsWith('item-main-info')).children;
        const text = mainInfoChildren[mainInfoChildren.length-1].children[0].innerText;
        if(text){
            document.title = text;
            clearInterval(id);
        }
    }, 500)
    // Your code here...
})();