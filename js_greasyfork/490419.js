// ==UserScript==
// @name         SoruxGpt Beautify
// @namespace    http://scarletborders.top/
// @license      MIT
// @version      2024-03-21_a2
// @description  beautify for soruxgpt.com
// @author       scarletborder
// @match        https://user.soruxgpt.com/login
// @icon         https://www.google.com/s2/favicons?sz=64&domain=soruxgpt.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490419/SoruxGpt%20Beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/490419/SoruxGpt%20Beautify.meta.js
// ==/UserScript==

// global
var Login_Page = document.querySelector("#root > div");

// init 初始化函数
(function() {
    'use strict';

    // Your code here...
    let btn = document.createElement('button');
    btn.textContent = 'BK';
    var bk_url = "";
    btn.addEventListener('click',() => {
        bk_url = prompt("type your image url\n", "");
        if(bk_url){
            Login_Page.style["backgroundImage"] = 'url("'+bk_url + '")';
    }});
    Login_Page.appendChild(btn);
})();