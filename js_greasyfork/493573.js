// ==UserScript==
// @name         宠物语翻译器（弹窗式）
// @namespace    http://tampermonkey.net/
// @version      2024-04-27_4
// @description  把人语翻译成宠物语
// @author       maso
// @include      /^https:\/\/(www\.)?bondageprojects\.elementfx\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @include      /^https:\/\/(www\.)?bondage-europe\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @license MIT
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/493573/%E5%AE%A0%E7%89%A9%E8%AF%AD%E7%BF%BB%E8%AF%91%E5%99%A8%EF%BC%88%E5%BC%B9%E7%AA%97%E5%BC%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/493573/%E5%AE%A0%E7%89%A9%E8%AF%AD%E7%BF%BB%E8%AF%91%E5%99%A8%EF%BC%88%E5%BC%B9%E7%AA%97%E5%BC%8F%EF%BC%89.meta.js
// ==/UserScript==

// 面向chatGPT编程做的弹窗（

(function() {
    'use strict';

    if (window === window.top) {
        var btn = document.createElement('button');

        // 设置翻译按钮的样式
        btn.style.position = 'fixed';
        btn.style.width = '70px';
        btn.style.height = '40px';
        btn.style.left = '5.5%';
        btn.style.bottom = '10%';
        btn.innerHTML = '翻译器';
        btn.style.zIndex = '9999'; // 确保按钮位于其他元素之上
        document.body.appendChild(btn);

        // 创建一个 iframe 元素
        var iframe = document.createElement('iframe');
        iframe.src = 'https://nsfw-games.vercel.app/puppy-lang';
        iframe.style.position = 'fixed';
        iframe.style.top = '50px';
        iframe.style.left = '50px';
        iframe.style.width = '30%';
        iframe.style.height = '50%';
        iframe.style.border = '1px solid black';
        iframe.style.backgroundColor = 'white';
        iframe.style.zIndex = '9999';

        var flag = 0;

        // 给按钮添加点击事件监听
        btn.addEventListener('click', function() {
            if (!flag){
                document.body.appendChild(iframe);
                flag = 1;
            }else {
                document.body.removeChild(iframe);
                flag = 0;
            }

        });
    }
})();






