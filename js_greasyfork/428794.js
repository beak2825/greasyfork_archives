// ==UserScript==
// @name         网站通用置顶功能
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  解决了浏览网页时部分网页没有置顶这一功能
// @author       glk-hll
// @include      https://*/*
// @include      http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428794/%E7%BD%91%E7%AB%99%E9%80%9A%E7%94%A8%E7%BD%AE%E9%A1%B6%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/428794/%E7%BD%91%E7%AB%99%E9%80%9A%E7%94%A8%E7%BD%AE%E9%A1%B6%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let Topping = document.createElement('img')
    document.body.appendChild(Topping)
    Topping.style.position = 'fixed';
    Topping.style.width = '70px';
    Topping.style.height = '70px';
    Topping.style.top = '157px';
    Topping.style.right = '20px';
    Topping.style.zIndex = 999;
    Topping.style.display = 'flex';
    Topping.style.justifyContent = 'center';
    Topping.style.alignItems = 'center';
    Topping.style.cursor = 'pointer';
    Topping.style.opacity = 0;
    Topping.style.transition = 'all 0.5s'
    Topping.style.borderRadius = '15px'
    // Topping.src = "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=254555764,2291208299&fm=26&gp=0.jpg"
	Topping.src = "https://user-images.githubusercontent.com/44257305/124230833-1addcc80-db42-11eb-8914-f5376863fb0f.png"

    document.addEventListener('mousewheel',function(){
        if ( window.scrollY >= 100 ) {
            Topping.style.opacity = 1
        } else {
            Topping.style.opacity = 0
        }
    },false);

    Topping.addEventListener("click", function(){
        window.scrollTo(0, 0)
        Topping.style.opacity = 0;
    }, false);
    
})();