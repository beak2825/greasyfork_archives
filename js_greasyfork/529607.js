// ==UserScript==
// @name         bili字体小助手
// @namespace    http://tampermonkey.net/
// @version      10.0
// @description  使我的bilibili评论区字体变大
// @author       You
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529607/bili%E5%AD%97%E4%BD%93%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/529607/bili%E5%AD%97%E4%BD%93%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
GM_addStyle(`
:root {
    --bili-rich-text-font-size: 20px!important;                             /*定义 "--bili-rich-text-font-size" 为20px*/
}

@media screen and (min-width: 1681px) {
    :root {
       --bili-comments-font-size-content: 20px!important;                   /*修改定义*/
        --bili-comments-line-height-content: 27px!important;                /*修改定义*/
    }
}

:host {
    font-size: var(--bili-rich-text-font-size, 20px!important);
}

`);
