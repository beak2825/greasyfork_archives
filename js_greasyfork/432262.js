// ==UserScript==
// @name         屏蔽musictools暗号
// @namespace    http://www.xx7z.com/
// @version      0.2
// @description  每次下musictools都要去公众号回复暗号，比较麻烦，写了个简单的小脚本隐藏了暗号窗口。
// @author       老白
// @match        http://tool.yijingying.com/*
// @match        https://tool.yijingying.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/432262/%E5%B1%8F%E8%94%BDmusictools%E6%9A%97%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/432262/%E5%B1%8F%E8%94%BDmusictools%E6%9A%97%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    let css=`
    .jconfirm
    {
    z-index: -1;
    height:0;
    }
    `
    GM_addStyle(css)
})();