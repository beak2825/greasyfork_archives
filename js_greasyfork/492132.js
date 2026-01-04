// ==UserScript==
// @name         移除CSDN、博客园动态背景图，减轻CPU负担
// @namespace    http://tampermonkey.net/
// @description  通过判断body挂载的背景图来判断
// @author       NyanKoSenSei
// @license      MIT
// @match        *://*.csdn.net/*
// @match        *://*.cnblogs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @connect      www.csdn.net
// @connect      www.cnblogs.com
// @version      0.0.1
// @downloadURL https://update.greasyfork.org/scripts/492132/%E7%A7%BB%E9%99%A4CSDN%E3%80%81%E5%8D%9A%E5%AE%A2%E5%9B%AD%E5%8A%A8%E6%80%81%E8%83%8C%E6%99%AF%E5%9B%BE%EF%BC%8C%E5%87%8F%E8%BD%BBCPU%E8%B4%9F%E6%8B%85.user.js
// @updateURL https://update.greasyfork.org/scripts/492132/%E7%A7%BB%E9%99%A4CSDN%E3%80%81%E5%8D%9A%E5%AE%A2%E5%9B%AD%E5%8A%A8%E6%80%81%E8%83%8C%E6%99%AF%E5%9B%BE%EF%BC%8C%E5%87%8F%E8%BD%BBCPU%E8%B4%9F%E6%8B%85.meta.js
// ==/UserScript==

window.onload = function() {
    // 加载完毕后，检查body下面是否挂载了图片
    let doc = document.getElementsByTagName("body")[0];
    let body = window.getComputedStyle(doc, null);
    if (body.backgroundImage == undefined || body.backgroundImage == '' || body.backgroundImage == 'none') {
        return;
    }
    // 如果挂载了gif动图，直接给删掉
    if (body.backgroundImage.includes(".gif\")")) {
        doc.style.setProperty("background-image", "url()", 'important');
    }
    // document.querySelector("body").style.cssText="background-image:url() !important";
    // document.querySelector("body").style.cssText="background-repeat:no-repeat !important";
}