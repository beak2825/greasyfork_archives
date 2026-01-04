// ==UserScript==
// @name         SimpCity Copy Image Button
// @namespace    http://yu.net/
// @version      1.0
// @description  Add Copy Button
// @author       ou
// @match        https://simpcity.su/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=simpcity.su
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481431/SimpCity%20Copy%20Image%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/481431/SimpCity%20Copy%20Image%20Button.meta.js
// ==/UserScript==

const getUrl = (url) => {
    const urlImg = new URL(url)
    if(/\/images\/0fya082315al.png/.test(url)) {
        return null
    }

    if(/(.*)\.jpg\.(church|jpg|cat)/.test(urlImg.hostname)) {
        return url.replace(".md", "")
    }

    return url
}

const addDownloadButton = (message, ) => {
    const buttonWrapper = document.createElement("li");
    const button = document.createElement("a");

    const icon = document.createElement("i");
    icon.classList.add("fa", "fa-copy")
    button.append(icon)
    buttonWrapper.append(button)

    button.onclick = async function(e) {
        e.preventDefault()
        const images = message.querySelectorAll(".message-content img")
        let count = 1

        let text = ""

        for(const img of images) {
            if(img.getAttribute("data-url")) {
                const _url = getUrl(img.getAttribute("data-url"))
                if(_url) text += `${_url}\n`;
                count +1
            }
        }

        await GM_setClipboard(text, "text")
        alert("Links Copied")
    }

    message.querySelector(".message-cell--main header.message-attribution ul.message-attribution-opposite").append(buttonWrapper)

}

(function() {
    'use strict';

    const articles = document.querySelectorAll("article.message")
    for(const article of articles) {
        if(document.querySelector(".message-cell--main .message-content img")) {
            addDownloadButton(article)
        }
    }
})();