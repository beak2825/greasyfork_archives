// ==UserScript==
// @name         Copy All Link Imagas
// @namespace    http://yu.net/
// @version      2024-01-27
// @description  try 
// @author       Yu
// @match        https://bunkr.sk/*
// @match        https://simpcity.su/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=monotaro.id
// @require      https://update.greasyfork.org/scripts/485684/1317487/Downloader%20JS%20File.js
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485236/Copy%20All%20Link%20Imagas.user.js
// @updateURL https://update.greasyfork.org/scripts/485236/Copy%20All%20Link%20Imagas.meta.js
// ==/UserScript==

function createDownloadElement() {
    const button = document.createElement("button")
    button.style.background = "#ffd369";
    button.style.color = "#272727"
    button.style.fontWeight = "bold";
    button.classList.add("block", "mx-auto", "py-2", "px-4", "rounded");
    button.innerText = "Copy All Link";

    return button
}

function handleDownloadAllImages() {
    const elements = document.querySelectorAll(".grid-images_box a");
    const list = []
    elements.forEach(item => {
        if(item.href.includes("/i/")) {
            list.push(`https://i-taquito.bunkr.ru/${item.href.replace("https://bunkr.sk/i/", "")}`)
        } else if(item.href.includes("/v/")) {
            list.push(`https://milkshake.bunkr.ru/${item.href.replace("https://bunkr.sk/v/", "")}`)
        }
    })
    
    if("navigator" in window) {
        navigator.clipboard.writeText(list.join("\n")).then(() => window.alert("Link Copied")).catch((err) => alert(err))
    } else {
        alert("Browser not supported");
    }
}

function handleBunkr() {
    const button = createDownloadElement();
    button.onclick = handleDownloadAllImages;

    document.querySelector("section").append(button);
}

function removeAllIframe() {
    const all = document.querySelectorAll("iframe");
    if(!all) return;
    
    for(const element of all) {
        element.remove()
    }
}

(function() {
    'use strict';
    const host = window.location.host;

    if(host.includes("bunkr.sk")) { handleBunkr() }
    
    removeAllIframe();
    setInterval(() => removeAllIframe(), 1000);
})();