// ==UserScript==
// @name         设置 知乎 喜欢了的回答 图标为红色
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  设置知乎喜欢了的回答的图标为红色
// @author       抖抖小柯基
// @match        https://www.zhihu.com/question/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467968/%E8%AE%BE%E7%BD%AE%20%E7%9F%A5%E4%B9%8E%20%E5%96%9C%E6%AC%A2%E4%BA%86%E7%9A%84%E5%9B%9E%E7%AD%94%20%E5%9B%BE%E6%A0%87%E4%B8%BA%E7%BA%A2%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/467968/%E8%AE%BE%E7%BD%AE%20%E7%9F%A5%E4%B9%8E%20%E5%96%9C%E6%AC%A2%E4%BA%86%E7%9A%84%E5%9B%9E%E7%AD%94%20%E5%9B%BE%E6%A0%87%E4%B8%BA%E7%BA%A2%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("load", (event) => {
        setInterval(function(){
            let likeButtons = document.querySelectorAll('svg.Zi--Heart')
            for(let i = 0; i < likeButtons.length; i++){
                if (likeButtons[i].parentNode.parentNode.textContent.includes('取消喜欢')){
                    likeButtons[i].setAttribute('fill', 'red')
                    // console.info(likeButtons[i])
                }
            }
            // console.info('aaaa')
        }, 1000);
    });
    // Your code here...
})();