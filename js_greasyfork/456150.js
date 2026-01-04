// ==UserScript==
// @name         向猫抓发送一条资源的示例
// @namespace    https://bmmmd.com/
// @version      0.1
// @description  示例 向猫抓发送一条资源
// @author       bmm
// @match        https://o2bmm.gitbook.io/cat-catch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bmmmd.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456150/%E5%90%91%E7%8C%AB%E6%8A%93%E5%8F%91%E9%80%81%E4%B8%80%E6%9D%A1%E8%B5%84%E6%BA%90%E7%9A%84%E7%A4%BA%E4%BE%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/456150/%E5%90%91%E7%8C%AB%E6%8A%93%E5%8F%91%E9%80%81%E4%B8%80%E6%9D%A1%E8%B5%84%E6%BA%90%E7%9A%84%E7%A4%BA%E4%BE%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
        参数说明
        action 发送资源固定为 catCatchAddMedia
        url 资源地址
        href 当前页面地址 一般为 location.href 即可
        ext 资源的扩展 不带“.” 如 mp4
        mime 资源的mime
        referer 打开资源所需的 referer
    */
    // 发送一条资源地址
    window.postMessage({
        action: "catCatchAddMedia",
        url: "https://github.com/xifangczy/cat-catch",
        href: location.href,
        ext: "html",
        mime: "test/text",
        referer: "https://github.com"
    });

    // 下载资源并转换成blob链接发送
    fetch("https://bmmmd.com/")
    .then(response => response.blob())
    .then(function (blob) {
        window.postMessage({
            action: "catCatchAddMedia",
            url: window.URL.createObjectURL(blob),
            href: location.href,
            ext: "html",
        });
    });

    /*
        参数说明
        action 发送密钥固定为 catCatchAddKey
        key 密钥
        href 当前页面地址 一般为 location.href 即可
        ext 密钥类型 
    */
    // 发送经过base64编码后的key
    window.postMessage({
        action: "catCatchAddKey",
        key: "5oGt5Zac5L2g77yM5Y+R546w5LiA5Liq5q+r5peg5oSP5LmJ55qE5b2p6JuL8J+QsQ==",
        href: location.href,
        ext: "base64Key",
    });
})();