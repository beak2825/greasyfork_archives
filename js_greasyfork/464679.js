// ==UserScript==
// @name         优化斗鱼web鱼吧
// @namespace    https://www.liebev.site
// @version      0.1
// @description  douyu，优化斗鱼web鱼吧，自动展开所有overflow内容
// @author       LiebeV
// @license      MIT: Copyright (c) 2023 LiebeV
// @match        https://yuba.douyu.com/group/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464679/%E4%BC%98%E5%8C%96%E6%96%97%E9%B1%BCweb%E9%B1%BC%E5%90%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/464679/%E4%BC%98%E5%8C%96%E6%96%97%E9%B1%BCweb%E9%B1%BC%E5%90%A7.meta.js
// ==/UserScript==

'use strict';

async function yuba() {
    console.log("已经创建yuba样式表");
    return `.index-listDesc-02cUw,.index-listTitle-\\+WMpi{height:auto!important;white-space:normal!important;}`;
}

async function addStyle(css) {
    const liebev = document.getElementById("LiebeV");
    // console.log(liebev);
    if (liebev) {
        liebev.innerHTML = css;
        console.log("原css已更新");
    } else {
        const style = document.createElement("style");
        style.id = "LiebeV";
        style.type = "text/css";

        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
        console.log("新css已插入");
    }
}

(async function() {
    const css = await yuba();
    addStyle(css);
})();

