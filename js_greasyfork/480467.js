// ==UserScript==
// @name         SimpCity Download Button
// @namespace    http://yu.net/
// @version      1.0
// @description  Add Download Button
// @author       You
// @match        https://simpcity.su/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=simpcity.su
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480467/SimpCity%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/480467/SimpCity%20Download%20Button.meta.js
// ==/UserScript==

const downloadImg = (url) => {
    const urlImg = new URL(url)
    let filename = urlImg.pathname.split("/");
    filename = filename[filename.length - 1]
    if(/\/images\/0fya082315al.png/.test(urlImg)) {
        return
    }

    if(/(.*)\.jpg\.(church|jpg|cat)/.test(urlImg.hostname)) {
        GM_download(url.replace(".md", ""), filename)
    } else {
        GM_download(url, filename)
    }
}

const addDownloadButton = (message, ) => {
    const buttonWrapper = document.createElement("li");
    const button = document.createElement("a");

    const icon = document.createElement("i");
    icon.classList.add("fa", "fa-download")
    button.append(icon)
    buttonWrapper.append(button)

    button.onclick = async function(e) {
        e.preventDefault()
        const images = message.querySelectorAll(".message-content img")
        let count = 1

        for(const img of images) {
            if(img.getAttribute("data-url")) {
                downloadImg(img.getAttribute("data-url"), `Images - ${count}`)
                count +1
                await new Promise(res => setTimeout(res, 1000))
            }
        }
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