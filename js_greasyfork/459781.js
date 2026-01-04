// ==UserScript==
// @name         马蜂窝手机版-玩法guide 页面优化
// @namespace    mscststs.com
// @version      0.12
// @description  页面优化
// @author       mscststs
// @match        https://m.mafengwo.cn/mmobile/wanfaguide/*
// @require https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=1026406
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mafengwo.cn
// @grant        GM_addStyle
// @license      ISC
// @downloadURL https://update.greasyfork.org/scripts/459781/%E9%A9%AC%E8%9C%82%E7%AA%9D%E6%89%8B%E6%9C%BA%E7%89%88-%E7%8E%A9%E6%B3%95guide%20%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/459781/%E9%A9%AC%E8%9C%82%E7%AA%9D%E6%89%8B%E6%9C%BA%E7%89%88-%E7%8E%A9%E6%B3%95guide%20%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    await mscststs.wait(".guide");
    document.body.innerHTML = document.querySelector(".guide").outerHTML;
    [...document.querySelectorAll("img._j_lazyimg")].map(node=>{
        node.src = node.dataset.url;
    });

    GM_addStyle(/* CSS */`
    body{
        position:relative;
        height:100vh;
        width:100vw;
        padding:30px 25vw;
        overflow-x:hidden;
    }
    *{
        user-select: auto !important;
    }

    `)
})();