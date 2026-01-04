// ==UserScript==
// @name         91porny|九色视频助手
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  jiuse|91PORNY|九色视频|自动跳转HD高清视频|获取视频下载链接|一键下载|N_m3u8DL-CLI
// @author       moeote
// @match        https://91porny.com/video/view/*
// @match        https://jiuse*.com/video/view/*
// @match        https://jiuse.vip/video/view/*
// @match        https://*.jiuse.vip/video/view/*
// @match        https://91porny.com/video/viewhd/*
// @match        https://jiuse*.com/video/viewhd/*
// @match        https://jiuse.vip/video/viewhd/*
// @match        https://*.jiuse.vip/video/viewhd/*
// @icon         https://www.google.com/s2/favicons?domain=91porny.com
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.7.2/base64.min.js
// @homepage     https://greasyfork.org/zh-CN/scripts/437662-91porny-%E4%B9%9D%E8%89%B2%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437662/91porny%7C%E4%B9%9D%E8%89%B2%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/437662/91porny%7C%E4%B9%9D%E8%89%B2%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 自动跳转HD高清视频
    var url = window.location.href;
    if(url.search("/view/") != -1) {
        var replaceUrl = url.replace("/view/", "/viewhd/") + "?server=line3";
        console.log(replaceUrl)
        window.location.href = replaceUrl;
    }

    // 获取视频下载链接
    var u = document.querySelector("#video-play").dataset.src;
    var n = document.querySelector("#videoShowPage > div:nth-child(1) > div > h4").innerText;
    var l = "\"" + u + "\" --workDir \"%USERPROFILE%\\Downloads\\m3u8dl\" --saveName \"" + n + "\" --enableDelAfterDone --disableDateInfo --noProxy";
    console.log(u);
    console.log(l);
    l = "m3u8dl://" + Base64.encode(l);
    console.log(l);
    var a = document.createElement("a");
    a.setAttribute("href", l)
    var input = document.createElement("input");
    input.type = "button";
    input.value = "m3u8视频下载";
    a.appendChild(input);
    document.querySelector("div.videoInfos.d-flex.text-normal.justify-content-between.align-items-center").appendChild(a);
})();