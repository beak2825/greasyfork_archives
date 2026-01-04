// ==UserScript==
// @name         JavBus Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  增強JavBus網頁的腳本
// @license MIT
// @author       scbmark
// @match        https://www.javbus.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539825/JavBus%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/539825/JavBus%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addLinkOnVideoPage() {
        let element = document.querySelector('span.header');
        let element2 = element.nextSibling.nextSibling

        let link = document.createElement("a");
        link.style["color"] = "#CC0000";
        let text = element2.textContent.trim();
        link.href = "#";
        link.textContent = text;
        let url = `https://sukebei.nyaa.si/?f=0&c=0_0&q=${encodeURIComponent(text)}`

        link.href = url;
        link.target = "_blank";
        element2.replaceWith(link);
    }

    function hideTorrentBlock() {
        let btn = document.createElement("botton");
        btn.textContent = "Torrent顯示";
        btn.style.position = "fixed";
        btn.style.top = "50px";
        btn.style.right = "10px";
        btn.style.zIndex = "99999";
        btn.style.padding = "6px 10px";
        btn.style.cursor = "pointer";

        document.body.appendChild(btn);

        let isHidden = true;

        let elements = [];
        elements.push(...document.querySelectorAll("#mag-submit-show"), ...document.querySelectorAll("#mag-submit"), ...document.querySelectorAll("#magneturlpost"), document.querySelector("#magneturlpost + .movie"));

        elements.forEach(el => {
            el.style.display = "none";
        });


        btn.addEventListener("click", () => {
            isHidden = !isHidden;
            btn.textContent = isHidden ? "Torrent顯示" : "Torrent隱藏";
            elements.forEach(el => {
                el.style.display = isHidden ? "none" : "";
            });
        });
    }
    addLinkOnVideoPage();
    hideTorrentBlock();
})();