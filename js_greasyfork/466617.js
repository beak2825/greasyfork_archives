// ==UserScript==
// @name         HentaiFox Loader
// @namespace    http://hentaifox.com/
// @version      1.1
// @description  Load all the manga on MangaFox onto one scrollable page
// @author       testacda1
// @match *://*.hentaifox.com/g/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hentaifox.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466617/HentaiFox%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/466617/HentaiFox%20Loader.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let pages = document.getElementsByClassName("total_pages")[1].innerText;
    let currentPage = document.getElementsByClassName("current")[1].innerText;
    let imageServer = document.querySelector("#gimg").getAttribute("data-src").replace("https://i.hentaifox.com/", "");
    imageServer = imageServer.substring(0, imageServer.lastIndexOf("/") + 1);
    let parentNode = document.querySelector(".next_img");
    for (let i = parseInt(currentPage) + 1; i <= pages; i++) {
        let img = document.createElement("img");
        img.src = "https://i.hentaifox.com/" + imageServer + i + ".jpg";
        img.style.maxWidth = "1280px";
        img.style.maxHeight = "1816px";
        img.style.margin = "0 auto";
        img.style.display = "block";
        parentNode.appendChild(img);
    }
})();