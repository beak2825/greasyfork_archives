// ==UserScript==
// @name         Youtube|B站|反跟踪
// @namespace    http://tampermonkey.net/
// @version      2023-12-18
// @description  Youtube|B站|反跟踪去除跟踪参数
// @author       Time
// @match        *://www.youtube.com/*
// @match        *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM.setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481513/Youtube%7CB%E7%AB%99%7C%E5%8F%8D%E8%B7%9F%E8%B8%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/481513/Youtube%7CB%E7%AB%99%7C%E5%8F%8D%E8%B7%9F%E8%B8%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var config = {
        bilibili: {
            check: true,
            interval: null
        }
    };

    // Your code here...
    function youtubeHandle() {
        setInterval(function () {
            var shareEle = document.getElementById("share-url");
            if (shareEle) {
                var shareUrl = document.getElementById("share-url").value;
                if (shareUrl) {
                    var modifiedLink = shareUrl.replace(/\?.*/, "");
                    console.log(modifiedLink);
                    document.getElementById("share-url").value = modifiedLink;
                }
            }
        }, 500);
    }
    function bilibiliHandle() {
        config.bilibili.interval = setInterval(function () {
            var shareEle = document.getElementById("share-btn-inner");
            if (shareEle) {
                shareEle.addEventListener('click', function () {
                    var shareUrl = window.location.href;
                    var modifiedLink = shareUrl.replace(/\?.*/, "");
                    console.log(modifiedLink);
                    setTimeout(function () {
                        GM.setClipboard(modifiedLink);
                    }, 1000);
                });
                clearInterval(config.bilibili.interval);
            }
        }, 1000);
    }
    youtubeHandle();
    bilibiliHandle();
})();