// ==UserScript==
// @name         Poe缩小侧边,增大聊天区域
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  缩小侧边,增大聊天区域
// @author       You
// @match        https://poe.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poe.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470579/Poe%E7%BC%A9%E5%B0%8F%E4%BE%A7%E8%BE%B9%2C%E5%A2%9E%E5%A4%A7%E8%81%8A%E5%A4%A9%E5%8C%BA%E5%9F%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/470579/Poe%E7%BC%A9%E5%B0%8F%E4%BE%A7%E8%BE%B9%2C%E5%A2%9E%E5%A4%A7%E8%81%8A%E5%A4%A9%E5%8C%BA%E5%9F%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有的 aside 元素
    const asideElements = document.getElementsByTagName("aside");

    // 遍历所有的 aside 元素，将宽度设置为 200px
    for (let i = 0; i < asideElements.length; i++) {
        asideElements[i].style.width = "200px";
    }
})();
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://poe.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poe.com
// @grant        none
// @license MIT
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load',()=>{
        // 获取所有的 aside 元素
        const asideElements = document.getElementsByTagName("aside");

        // 遍历所有的 aside 元素，将宽度设置为 200px
        for (let i = 0; i < asideElements.length; i++) {
            asideElements[i].style.width = "200px";
        }
        const styleTag = document.createElement('style');
        styleTag.innerHTML = `
        .ChatPageMain_container__1aaCT,.ChatPageMain_container__2O2h8,.Message_botMessageBubble__aYctV {max-width: initial !important; }

        .MainColumn_column__z1_q8,.MainColumn_column__UEunw{width:-webkit-fill-available;}

        .Message_humanMessageBubble__Nld4j,.Message_botMessageBubble__CPGMI { max-width: 100ch !important; }

        .GrowingTextArea_textArea__eadlu{max-height:1000px !important;} `;
        document.head.appendChild(styleTag);

        //setTimeout(()=>document.querySelector('.ChatBotDetailsSidebar_buttonContainer__fBLO5>button')?.click(),500);
    });
})();