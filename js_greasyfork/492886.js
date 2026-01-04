// ==UserScript==
// @name         直接打开抖音分享地址
// @namespace    http://domain.com/directory
// @version      0.1
// @description  打开前面有字的抖音分享地址，直接跳转链接。
// @author       幸福的赢得
// @run-at       document-start
// @match        *://cn.bing.com/search?*
// @match        *://m.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492886/%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%E6%8A%96%E9%9F%B3%E5%88%86%E4%BA%AB%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/492886/%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%E6%8A%96%E9%9F%B3%E5%88%86%E4%BA%AB%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

if (/v\.douyin\.com/.test(location.href)) {

    var plainPath =
    decodeURIComponent(location.href)

    plainPath = 
    plainPath.replace(/^.*?v\.douyin\.com\// , '');

    plainPath = 
    plainPath.replace(/\+.*/ , '');

    plainPath = 
    "https://v.douyin.com/" + plainPath

    location.replace(plainPath);

}
    