// ==UserScript==
// @name         Danbooru Tag 提取
// @name:en      Danbooru Tag Crawler
// @namespace    https://danbooru.donmai.us/
// @version      1.01
// @description:zh-cn 一键提取当前图片的General tags并复制到剪贴板
// @description:en Get General tags from Danbooru posts and copy them to clipboard
// @author       LigHT
// @Copyright    2023 LigHT
// @license      MIT
// @match        https://danbooru.donmai.us/*
// @icon         https://www.google.com/s2/favicons?domain=donmai.us
// @grant        GM_setClipboard
// @description Get General tags from Danbooru posts and copy them to clipboard
// @downloadURL https://update.greasyfork.org/scripts/480671/Danbooru%20Tag%20%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/480671/Danbooru%20Tag%20%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var button = document.createElement("button");
    button.innerHTML = "get tag";
    button.style.position = "fixed";
    button.style.bottom = "1%";
    button.style.right = "1%";
    button.style.zIndex = "9999";
    button.style.opacity = "0.5";
    button.addEventListener("mouseover", function() {
        button.style.opacity = "1";
    });
    button.addEventListener("mouseout", function() {
        button.style.opacity = "0.5";
    });
    document.body.appendChild(button);
    button.addEventListener("click", function() {
        var ul = document.querySelector("ul.general-tag-list");
        if (ul) {
            var lis = ul.querySelectorAll("li[data-tag-name]");
            var tags = [];
            for (var i = 0; i < lis.length; i++) {
                var tag = lis[i].getAttribute("data-tag-name");
                tag = tag.replace(/_/g, ' ');
                tags.push(tag);
            }
            var result = tags.join(",");
            GM_setClipboard(result);
            button.innerHTML = "success";
            setTimeout(function() {
                button.innerHTML = "get tag";
            }, 3000);
        }
    });
})();