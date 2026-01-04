// ==UserScript==
// @name         BilibiliPotPlayer
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @namespace    https://gitee.com/qfly1/announce-hub
// @version      2.0.0
// @description  用 PotPlayer 打开 Bilibili 链接进行播放（带暂停功能）
// @author       Lemon&chen310
// @match        https://www.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://live.bilibili.com/*
// @match        https://link.bilibili.com/*
// @match        https://search.bilibili.com/*
// @match        https://t.bilibili.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536993/BilibiliPotPlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/536993/BilibiliPotPlayer.meta.js
// ==/UserScript==

// 需要配合 PotPlayer 插件 https://github.com/chen310/BilibiliPotPlayer 进行使用

(function () {
    "use strict";

    const protocol = "potplayer";
    const img = document.createElement("img");
    img.id = "btnPotplayer"
    img.src = 'data:image/webp;base64,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';

    img.style.width = "50px";
    img.style.height = "50px";
    img.style.position = "fixed";
    img.style.cursor = "pointer";
    img.style.right = "30px";
    img.style.bottom = "70px";
    img.style.zIndex = "9999";

    img.onclick = function () {
        // ------------------- 新增暂停逻辑 -------------------
        // 尝试暂停视频/直播
        let player;
        if (window.location.href.includes("live.bilibili.com")) {
            // 直播页播放器（通常在 #live-player 容器内）
            player = document.querySelector('#live-player video');
        } else {
            // 普通视频页播放器（直接获取 video 标签）
            player = document.querySelector('video');
        }
        if (player) {
            player.pause(); // 调用 HTML5 视频的暂停方法
        }
        // ------------------- 原逻辑保留 -------------------
        let url = window.location.href;
        if (url.indexOf("space.bilibili.com") != -1) {
            if (url.indexOf("/video") != -1 || url.indexOf("/audio") != -1) {
                let order = document.querySelector('.is-active input')?.value || "";
                if (url.search("order=") != -1) {
                    url = url.replace(/order=([a-zA-Z]+)/, "order=" + order);
                } else {
                    if (url.indexOf("?") != -1) {
                        url += "&order=" + order;
                    } else {
                        url += "?order=" + order;
                    }
                }
            }
        }
        url = protocol + "://" + url;
        window.open(url, "_self");
    }

    document.body.appendChild(img)

    function getparameter(s) {
        var p = window.location.href.split("?"+s+"=");
        if (p.length >= 2) {
            p = p[1].split("&")[0];
        } else {
            p = window.location.href.split("&"+s+"=");
            if (p.length >= 2) {
                p = p[1].split("&")[0];
            } else {
                p = "";
            }
        }
        return p;
    }
})();