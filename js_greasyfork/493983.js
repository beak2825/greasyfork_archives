// ==UserScript==
// @name         百度首页管理
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除百度首页推荐栏，学习更专注
// @author       ahzvenol 
// @match        https://www.baidu.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @license      AGPL V3
// @downloadURL https://update.greasyfork.org/scripts/493983/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/493983/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = ()=>{
        document.querySelector("#s_menu_mine")?.click()
        const element = document.createElement('div')
        element.classList.add('s-menu-item')
        element.innerText = "不推荐"
        document.querySelector(".s-menu-item[data-id='2']").parentElement.appendChild(element)
        document.querySelector(".s-menu-item[data-id='2']").remove()
    }
})();