// ==UserScript==
// @name         贴吧屏蔽封禁框
// @namespace    http://tampermonkey.net/
// @description  名副其实.此脚本永久开源永久免费,仅供合法使用,产生的一切不良影响均由脚本使用者自己承担,本人概不负责.
// @match        *://tieba.baidu.com/i/*
// @match        *://tieba.baidu.com/home*
// @icon         http://baidu.com/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @version 0.0.1.20230127051301
// @downloadURL https://update.greasyfork.org/scripts/458937/%E8%B4%B4%E5%90%A7%E5%B1%8F%E8%94%BD%E5%B0%81%E7%A6%81%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/458937/%E8%B4%B4%E5%90%A7%E5%B1%8F%E8%94%BD%E5%B0%81%E7%A6%81%E6%A1%86.meta.js
// ==/UserScript==
-function(uw){
    const path=location.pathname,as=GM_addStyle;
    if(path.includes('/home')||path.includes('/i/')){//屏蔽封禁框
        as(`.dialogJ,.dialogJfix,.dialogJshadow,.ui-draggable,.dialogJmodal,.dialog_block,.j_itb_block{
            display:none!important;
            z-index:0!important;
        }`)
    }
}(unsafeWindow)
