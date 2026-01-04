// ==UserScript==
// @name         ant.design 组件库置顶图标
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解决 ant.design 组件库 中暂时没有置顶功能的问题
// @author       glk-hll
// @include      https://ant.design/components/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407963/antdesign%20%E7%BB%84%E4%BB%B6%E5%BA%93%E7%BD%AE%E9%A1%B6%E5%9B%BE%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/407963/antdesign%20%E7%BB%84%E4%BB%B6%E5%BA%93%E7%BD%AE%E9%A1%B6%E5%9B%BE%E6%A0%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let Topping = document.createElement('img')
    document.body.appendChild(Topping)
    Topping.style.position = 'fixed';
    Topping.style.width = '70px';
    Topping.style.height = '70px';
    Topping.style.bottom = '157px';
    Topping.style.right = '20px';
    Topping.style.zIndex = 9;
    Topping.style.display = 'flex';
    Topping.style.justifyContent = 'center';
    Topping.style.alignItems = 'center';
    Topping.style.cursor = 'pointer';
    Topping.style.opacity = 0;
    Topping.style.transition = 'all 0.5s'
    Topping.style.borderRadius = '15px'
    Topping.src = "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=254555764,2291208299&fm=26&gp=0.jpg"

    document.addEventListener('mousewheel',function(){
        if ( window.scrollY >= 1000 ) {
            Topping.style.opacity = 1
        } else {
            Topping.style.opacity = 0
        }
    },false);

    Topping.addEventListener("click", function(){
        window.scrollTo(0, 0)
        Topping.style.opacity = 0;
    }, false);
    // Your code here...
})();