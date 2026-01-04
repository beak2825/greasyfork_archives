// ==UserScript==
// @name         Instagram圖片右鍵另存
// @namespace    https://fasttech.pixnet.net/blog
// @version      0.1
// @description  實現右鍵選單另存Instagram圖片功能
// @author       kencyue
// @match        https://www.instagram.com/*
// @icon         https://static.cdninstagram.com/rsrc.php/yS/r/f_5NUHW7AZC.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451484/Instagram%E5%9C%96%E7%89%87%E5%8F%B3%E9%8D%B5%E5%8F%A6%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/451484/Instagram%E5%9C%96%E7%89%87%E5%8F%B3%E9%8D%B5%E5%8F%A6%E5%AD%98.meta.js
// ==/UserScript==
el =document.getElementsByClassName("_aagw");
document.onmousemove = function(){

        for(i=0;i<el.length;i++)
    {
        void(el[i].remove());
    }

};