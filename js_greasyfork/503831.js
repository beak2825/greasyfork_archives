// ==UserScript==
// @name         Add Rainbow Span to UserName
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Find UserName elements and wrap them in a span with a rainbow class.
// @author       Gangz1o
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503831/Add%20Rainbow%20Span%20to%20UserName.user.js
// @updateURL https://update.greasyfork.org/scripts/503831/Add%20Rainbow%20Span%20to%20UserName.meta.js
// ==/UserScript==
/* 
火焰特效
Fire Style
.rainbow {
           -webkit-animation-duration: 0.8s;
    -webkit-animation-name: flamemotion;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-direction: alternate;
    color: #ffe
        }
        @-webkit-keyframes flamemotion {
    0% {
        text-shadow: 0 -0.05em .2em #fff,.01em -0.02em .15em #fe0,.01em -0.05em .15em #fc0,.02em -0.15em .2em #f90,.04em -0.2em .3em #f70,.05em -0.25em .4em #f70,.06em -0.2em .9em #f50,.1em -0.1em 1em #f40
    }

    25% {
        text-shadow: 0 -0.05em .2em #fff,0 -0.05em .17em #fe0,.04em -0.12em .22em #fc0,.04em -0.13em .27em #f90,.05em -0.23em .33em #f70,.07000000000000001em -0.28em .47em #f70,.1em -0.3em .8em #f50,.1em -0.3em .9em #f40
    }

    50% {
        text-shadow: 0 -0.05em .2em #fff,.01em -0.02em .15em #fe0,.01em -0.05em .15em #fc0,.02em -0.15em .2em #f90,.04em -0.2em .3em #f70,.05em -0.25em .4em #f70,.06em -0.2em .9em #f50,.1em -0.1em 1em #f40
    }

    75% {
        text-shadow: 0 -0.05em .2em #fff,0 -0.06em .18em #fe0,.05em -0.15em .23em #fc0,.05em -0.15em .3em #f90,.07000000000000001em -0.25em .4em #f70,.09em -0.3em .5em #f70,.1em -0.3em .9em #f50,.1em -0.3em 1em #f40
    }

    100% {
        text-shadow: 0 -0.05em .2em #fff,.01em -0.02em .15em #fe0,.01em -0.05em .15em #fc0,.02em -0.15em .2em #f90,.04em -0.2em .3em #f70,.05em -0.25em .4em #f70,.06em -0.2em .9em #f50,.1em -0.1em 1em #f40
    }
}


*/

(function() {
    'use strict';

    // 这里设置你的用户名,如果你有多个的话
    const userNameTexts = ["UserName1", "UserName2"];

    // 查找页面中的所有元素，排除 <script> 和 <style>
    const elements = document.querySelectorAll('*:not(script):not(style)');

    elements.forEach(element => {
        if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
            const text = element.textContent.trim();
            // 检查当前元素的文本内容是否在 userNameTexts 数组中
            if (userNameTexts.includes(text)) {
                // 替换文本为带有 <span class="rainbow"> 的新内容
                element.innerHTML = `<span class="rainbow">${text}</span>`;
            }
        }
    });

    // 为 .rainbow 类添加一些样式
    const style = document.createElement('style');
    style.textContent = `
        .rainbow {
           background: linear-gradient(135deg, #9B5DE5, #F15BB5, #FEE440, #00F5D4, #00BBF9,#9ED4E3);
           -webkit-background-clip: text;
           background-clip: text;
           color: transparent;
           animation: rainbow_animation 8s cubic-bezier(0.3, 0, 1, 1) infinite;
           background-size: 300% 100%;
        }
        @keyframes rainbow_animation {
        0%,100% {
           background-position: 0 50%;
        }
        20% {
           background-position: 100% 50%;
        }
      }
    `;
    document.head.appendChild(style);
})();
