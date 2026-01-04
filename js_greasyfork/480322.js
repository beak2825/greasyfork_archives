// ==UserScript==
// @name         掘金酱UI调整
// @namespace
// @include      *://e.juejin.cn/
// @version      0.0.1
// @description  简单得通过更改样式隐藏掘金酱部分模块
// @author       ymzhao
// @namespace 
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/480322/%E6%8E%98%E9%87%91%E9%85%B1UI%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/480322/%E6%8E%98%E9%87%91%E9%85%B1UI%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==
GM_addStyle(`
    .layout:not(.classic) .other-source { max-width: unset; }
    .main-area .right-aside { display: none; }
`);