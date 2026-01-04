// ==UserScript==
// @name         JPG Cat album Download
// @namespace    http://yu.net/
// @version      2024-01-16
// @description  try
// @author       Yu
// @match        https://jpg4.su/a/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jpg4.su
// @grant        GM_openInTab
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484920/JPG%20Cat%20album%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/484920/JPG%20Cat%20album%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function handleClick(e) {
        e.preventDefault();
        const images = document.querySelectorAll(".pad-content-listing .list-item img")
        for(const img of images) {
            const url = img.src.replace(".md", "")
            let filename = url.pathname.split("/");
            filename = filename[filename.length - 1]
            filename = filename.replace(".md", "")
            GM_download(url, filename)
            // GM_openInTab(url)
        }
    }

    function handleCopyLink(e) {
        e.preventDefault();
        const images = document.querySelectorAll(".pad-content-listing .list-item img")
        let copy = ""
        for(const img of images) {
            const url = img.src.replace(".md", "")
            copy += `${url}\n`;
        }

        navigator.clipboard.writeText(copy);
    }

    const list = document.createElement("li")
    const a = document.createElement("a")
    a.innerText = "Download"
    a.onclick = handleClick

    const list2 = document.createElement("li")
    const a2 = document.createElement("a")
    a2.innerText = "Copy All Link"
    a2.onclick = handleCopyLink

    list.append(a)
    list2.append(a2)

    document.querySelector(".content-tabs").append(list, list2)
})();