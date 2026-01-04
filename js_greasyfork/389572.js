// ==UserScript==
// @name         将V2ex移动版网页转为PC版网页
// @namespace    None
// @version      0.3
// @description  将 V2ex 移动版网页转为 PC 版网页
// @author       Owovo
// @match        *://*.v2ex.com/amp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389572/%E5%B0%86V2ex%E7%A7%BB%E5%8A%A8%E7%89%88%E7%BD%91%E9%A1%B5%E8%BD%AC%E4%B8%BAPC%E7%89%88%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/389572/%E5%B0%86V2ex%E7%A7%BB%E5%8A%A8%E7%89%88%E7%BD%91%E9%A1%B5%E8%BD%AC%E4%B8%BAPC%E7%89%88%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function (){
    // 获取当前页面的 URL
    const url = location.href;

    // 判断 URL 中是否包含 "/amp/"
    if (url.includes("/amp/")) {
        // 将 URL 中的 "/amp/" 替换成 "/"
        const url1 = url.replace("/amp/", "/");

        // 截取 URL 中 "/t/" 后面的部分
        const url2 = url1.slice(url1.indexOf("/t/") + 1);

        // 构建新的 URL
        const newUrl = `${location.protocol}//www.v2ex.com/${url2}`;

        // 替换当前页面，并将新的 URL 重定向到新的 URL 上
        location.replace(newUrl);
    }
})();