// ==UserScript==
// @name         show link on dood playlist
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  script to display links on doodstream playlist
// @author       vallerydelexy
// @match        https://dood.to/f/*
// @match        https://dood.so/f/*
// @match        https://dood.wf/f/*
// @match        https://dood.re/f/*
// @match        https://dood.la/f/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dood.re
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456906/show%20link%20on%20dood%20playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/456906/show%20link%20on%20dood%20playlist.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // show links
    var links = []
    var as = document.querySelectorAll('a')
    as.forEach((a)=>{
        links.push(a.href)
    })
    var link = new Set(links)
    var strlink = Array.from(link).reduce((a, b) => { return a + b + " " }, "")

    // show size
    function toBytes(size, type)
    {
        const types = ["B", "KB", "MB", "GB", "TB"];
        const key = types.indexOf(type.toUpperCase())
        if (typeof key !== "boolean") {
            return size * 1024 ** key;
        }
        return "invalid type: type must be GB/KB/MB etc.";
    }
    function bytesToSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        if (bytes === 0) return 'n/a'
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
        if (i === 0) return `${bytes} ${sizes[i]})`
  return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
    }
    let names = Array.from(document.querySelectorAll(".name"))
    let totalSize = 0
    let totalFile = 0
    names.forEach((name)=>{
        let span = name.querySelector("span")
        let currentSizeFromText = span.innerText.split(" ")
        let currentSize = toBytes(currentSizeFromText[0],currentSizeFromText[1])
        totalSize += currentSize
        totalFile++
    })
    const readableSize = "\n\n"+bytesToSize(totalSize)
    // render to the page
    const wrappernode = document.createElement("p")
    const sizewrapper = document.createElement("h2")
    wrappernode.style = "font-size: 6px;"
    sizewrapper.style = "color:#f90;"
    sizewrapper.classList.add("font-weight-bold");
    sizewrapper.classList.add("text-center");
    const textnode = document.createTextNode(strlink)
    const sizenode = document.createTextNode(readableSize + " | " + totalFile + " Video")
    wrappernode.appendChild(textnode)
    sizewrapper.appendChild(sizenode)
    document.querySelector('h1').parentNode.appendChild(sizewrapper)
    document.querySelector('h1').parentNode.appendChild(wrappernode)
})();