// ==UserScript==
// @name         cookie
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  获取当前网页cookie的按钮，按钮位置在左上角；点击按钮后会把当前页面的cookie放置剪切板。
// @author       Huang
// @match        http*://*
// @include      http*://*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        GM_setClipboard
// @license  none
// @downloadURL https://update.greasyfork.org/scripts/455295/cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/455295/cookie.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let Container = document.createElement('div');
Container.id = "get-cookie-current_url";
Container.style.position="fixed"
Container.style.left="0px"
Container.style.top="0px"
Container.style['z-index']="999999"
Container.innerHTML =`<button id="but-get-cookie-current_url" style="position:absolute; ">浮动按钮</button>`

document.body.appendChild(Container);

var btn;
var current_cookies;
btn = document.getElementById('but-get-cookie-current_url');
        btn.onclick = function (){
            current_cookies=document.cookie;
            GM_setClipboard(current_cookies);
            return;
        };

})();