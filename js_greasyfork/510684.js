// ==UserScript==
// @name         Reddit Image Downloader
// @namespace    http://tampermonkey.net/
// @version      2024-09-12
// @description  Adds download button for image post in reddit
// @author       FlinCode
// @match        https://www.reddit.com/r/*/comments/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510684/Reddit%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/510684/Reddit%20Image%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const img = document.getElementById("post-image")
    if (img) {
        const items = img.srcset.split(",").map(item => item.trim())
        const imgSrc = items[items.length - 1]
        console.log(imgSrc)
        addUrls([imgSrc])
    } else {
        const imgs = document.getElementsByClassName("media-lightbox-img")

        let urls = []
        for (let i = 0; i < imgs.length; i++) {
            const img = imgs[i]
            const items = img.srcset.split(",").map(item => item.trim())
            const imgSrc = items[items.length - 1]
            urls.push(imgSrc)
            console.log("Image: " + i, imgSrc)
        }
        addUrls(urls)
    }

    function addUrls(urls) {
        const box = querySelectorAllShadows("shreddit-post")[0]
        // add url buttons to download
        urls.forEach((url, idx) => {
            url = convertUrl(url)
            const a = document.createElement("a")
            a.innerHTML = "Download " + (idx + 1)
            a.href = url
            a.download = url.split("/").pop()
            a.target = "_blank"
            a.className = "button-bordered button-small button join-btn leading-none min-w-[100px]"
            a.style.padding = "9px";
            a.style.textDecoration = "none"
            a.style.marginLeft = "5px"
            box.appendChild(a)
        });
    }

    // https://i.redd.it/file-name.jpeg

    function convertUrl(url) {
        let base = "https://i.redd.it/";
        const u = new URL(url)
        const stem = u.pathname.split("v0-").pop()
        return base + stem
    }

    function querySelectorAllShadows(selector, el = document.body) {
        const childShadows = Array.from(el.querySelectorAll('*')).
        map(el => el.shadowRoot).filter(Boolean);

        const childResults = childShadows.map(child => querySelectorAllShadows(selector, child));

        const result = Array.from(el.querySelectorAll(selector));
        return result.concat(childResults).flat();
    }
})();