// ==UserScript==
// @name         Cosplay Hentai Bypass Ads && Download All Images
// @namespace    http://yu.net/
// @version      1.2
// @description  just description
// @author       Yu
// @match        https://hentai-cosplays.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hentai-cosplays.com
// @grant        GM_webRequest
// @grant        GM_addStyle
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479981/Cosplay%20Hentai%20Bypass%20Ads%20%20Download%20All%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/479981/Cosplay%20Hentai%20Bypass%20Ads%20%20Download%20All%20Images.meta.js
// ==/UserScript==

const splitPathname = (pathname = "") => {
    return pathname.split("/")
}

const getAllImages = async(url) => {
    try {
        const resp = await fetch(url)
        const html = await resp.text()

        const htmlElement = document.createElement("html")
        htmlElement.innerHTML = html

        const imgElement = htmlElement.querySelectorAll("amp-story-grid-layer amp-img")
        const img = []
        imgElement.forEach((item) => img.push(item.getAttribute("src")))

        return img
    } catch(err) {
        throw err;
    }
}

const DownloadAllImages = (images = [], { button }) => {
    button.innerText = `Download All Images`
    button.onclick = () => {
        button.disabled = true
        let count = 0;
        let id = null

        id = setInterval(() => {
            GM_download(images[count], `YuImages-${count + 1}.jpg`)
            button.innerText = `Download ${count + 1} / ${images.length} Images`;
            if(count >= (images.length - 1)) {
                clearInterval(id)
                button.disabled = false
            }

            count += 1
        }, 1000)
    }
}

(function() {
    'use strict';

    const adsLink = [
        "*://*.jads.co/*",
        "*://*.magsrv.com/*",
        "*://stealcurtainsdeeprooted.com/*"
    ]

    GM_webRequest( adsLink.map(link => (
        { selector: {match: link }, action: "cancel" }
    )))

    document.addEventListener("DOMContentLoaded", () => {
        if(window.location.pathname.match(/\/image\//)) {


            const actButton = document.createElement("button")
            actButton.innerText = "Get All Images"
            actButton.classList.add("yuButton")
            actButton.id = "YuButton"

            actButton.style.bottom = "10px"
            actButton.style.right = "10px"
            actButton.style.zIndex = 9999

            document.body.append(actButton)

            GM_addStyle(`button.yuButton { position: fixed; background: #ffaf4c; font-size: 18px; border: unset; padding: 10px 16px; border-radius: 4px; cursor: pointer }
        button.yuButton:disabled { background: #e6e6e6}`)

            actButton.onclick = async () => {
                actButton.disabled = true;

                try {
                    actButton.innerText = "Loading";
                    const slug = splitPathname(window.location.pathname)
                    console.log(slug)
                    const url = `${window.location.origin}/story/${slug[2]}`;
                    const result = await getAllImages(url)
                    if(result.length > 0) {
                        alert("File siap didownload")
                        DownloadAllImages(result, { button: actButton })
                    }else{
                        alert("File tidak tersedia")
                    }

                    actButton.disabled = false;
                } catch(err) {
                    actButton.disabled = false;
                    actButton.innerText = "Get All Images";
                    alert(err.message)
                }

            }
        }
    })


})();