// ==UserScript==
// @name         黑色的Luogu
// @namespace    http://tampermonkey.net/
// @version      2025-07-29
// @description  让洛谷变成深色模式
// @author       c6h8o7-code
// @license MIT
// @match        https://www.luogu.com.cn/
// @match        https://www.luogu.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544261/%E9%BB%91%E8%89%B2%E7%9A%84Luogu.user.js
// @updateURL https://update.greasyfork.org/scripts/544261/%E9%BB%91%E8%89%B2%E7%9A%84Luogu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (function() {
        'use strict';

        var style = document.createElement('style');
        style.innerHTML = `
    * {
        color: #FFFFFF;
    }
    span {color: #FFFFFF !important;}
    .am-comment-bd, .am-comment-hd, .lg-article, .lg-article-sub, .lg-article-nctrl, .lg-index-contest, .lg-left {
    background: rgba(0,0,0,.7);
    padding: 16px;
    margin-bottom: 15px;
    position: relative;

}
 .lg-left {
    color: #456
}
.header-layout.tiny[data-v-7ddab1d5], .card, .l-card, .top-bar, .sidebar, .bottom-wrap, .bottom, .problem, .language-cpp, .line-numbers{
   color: rgb(23, 43, 53);
   background-color: rgb(23, 43, 53) !important
}
.selected {
    background-color: rgb(11, 45, 14)
}
input, textarea, .message, .lfe-code{
   background-color: rgb(19, 19, 81) !important
}
input:-ms-input-placeholder, input:-moz-input-placeholder, input::-webkit-input-placeholder{
   color: rgb(114, 51, 41)
}
`;
        document.head.appendChild(style);
    })();
    window.addEventListener('load', function() {
        document.querySelector("#app > div.main-container > main").style="background-color: rgb(23, 23, 53)"
        document.querySelector("#app > div.main-container > div.wrapper.wrapped.lfe-body.header-layout.tiny > div.background").style.backgroundColor="rgb(23, 43, 53)"
        document.querySelector("#app > div.main-container > div.wrapper.wrapped.lfe-body.header-layout.tiny > div.container").style.backgroundColor="rgb(23, 43, 53)"
        if(window.location.href.toString().startsWith("https://www.luogu.com.cn/user")){
            window.location.href="https://www.bilibili.com/video/BV1UT42167xb/"
        }
    }, false);
})();