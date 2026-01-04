// ==UserScript==
// @name         Batch Download for postimg.cc (postimages.org)
// @namespace    http://tampermonkey.net/
// @version      2024-11-02
// @description  Adds a button to download all images from a gallery for postimg.cc (postimages.org).
// @match        *://postimg.cc/gallery/*
// @author       xskutsu (Discord: @xskt)
// @license      Creative Commons Attribution-NonCommercial 4.0 International License
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.9.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/515984/Batch%20Download%20for%20postimgcc%20%28postimagesorg%29.user.js
// @updateURL https://update.greasyfork.org/scripts/515984/Batch%20Download%20for%20postimgcc%20%28postimagesorg%29.meta.js
// ==/UserScript==

(function() {
    "use strict";

    GM_registerMenuCommand("Compression Level", function () {
        const value = parseInt(prompt("What level of compression should be used?\nany integer between 0 (best speed) and 9 (best compression)\nDefault: 5"));
        if (isNaN(value) || value !== Math.floor(value) || value < 0 || value > 9) {
            alert(`${value} is not valid!`);
        } else {
            GM_setValue("compressionLevel", value);
        }
    });

    GM_registerMenuCommand("Sleep Time", function () {
        const value = parseInt(prompt("How much time (in ms) should we sleep between downloading original file blobs?\Default: 100ms"));
        if (isNaN(value) || value !== Math.floor(value) || value < 0 || value > 10000) {
            alert(`${value} is not valid!`);
        } else {
            GM_setValue("sleepTime", value);
        }
    });

    async function getAllImages(album) {
        const result = [];
        let page = 1;
        while (true) {
            const response = await fetch("https://postimg.cc/json", {
                "headers": {
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                },
                "referrer": `https://postimg.cc/gallery/${album}`,
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": `action=list&album=${album}&page=${page++}`,
                "method": "POST",
                "mode": "cors",
                "credentials": "omit"
            });
            const data = await response.json();
            for (let i = 0; i < data.images.length; i++) {
                result.push(data.images[i]);
            }
            if (!data.has_page_next) {
                break;
            }
        }
        return result;
    }

    async function fetchOriginalImageURL(code, album) {
        const response = await fetch(`https://postimg.cc/${code}`, {
            "referrer": `https://postimg.cc/gallery/${album}`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "omit"
        });
        const data = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");
        return doc.getElementById("download").href;
    }

    window.addEventListener("load", function () {
        const collapseShareElement = document.getElementById("collapse_share");
        const downloadGalleryElement = collapseShareElement.cloneNode(true);
        downloadGalleryElement.style.color = "#c57f15";
        downloadGalleryElement.style.borderColor = "#c57f15";
        downloadGalleryElement.childNodes[0].classList.remove("fa-codes");
        downloadGalleryElement.childNodes[0].classList.add("fa-download");
        const textNode = downloadGalleryElement.childNodes[1];
        textNode.textContent = "Download Gallery";
        downloadGalleryElement.addEventListener("click", async function () {
            try {
                const album = window.location.pathname.split("/").slice(-1)[0];
                textNode.textContent = "Fetching pages...";
                const images = await getAllImages(album);
                const imageURLs = [];
                for (let i = 0; i < images.length; i++) {
                    textNode.textContent = `Fetching original URLs... (${i + 1}/${images.length})`;
                    const originalURL = await fetchOriginalImageURL(images[i][0], album);
                    imageURLs.push(originalURL.replace(/\?dl=1$/, ""));
                }
                const blobs = [];
                const sleepTime = GM_getValue("sleepTime", 100);
                for (let i = 0; i < images.length; i++) {
                    textNode.textContent = `Fetching original image blobs... (${i + 1}/${images.length})`;
                    const url = imageURLs[i];
                    const response = await fetch(url);
                    const blob = await response.blob();
                    const fileName = url.split("/").pop();
                    blobs.push(fileName, blob);
                    if (i < imageURLs.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, sleepTime));
                    }
                }
                const zip = new JSZip();
                for (let i = 0; i < blobs.length; i += 2) {
                    textNode.textContent = `Adding files to zip... (${i / 2 + 1}/${images.length})`;
                    zip.file(blobs[i], blobs[i + 1]);
                }
                textNode.textContent = `Starting zip...`;
                const compressionLevel = GM_getValue("compressionLevel", 5);
                const content = await zip.generateAsync({
                    type: "blob",
                    compression: compressionLevel === 0 ? "STORE" : "DEFLATE",
                    comment: `Images from album ${album} on postimg.cc (postimages.org)`,
                    compressionOptions: {
                        level: compressionLevel
                    }
                }, function (metadata) {
                    if (metadata.currentFile) {
                        textNode.textContent = `Zipping images... (${metadata.percent.toFixed(2)}%)`;
                    }
                });
                textNode.textContent = `Download finished!`;
                saveAs(content, "gallery_SC2ZHmR.zip");
                textNode.textContent = `Download Gallery`;
            } catch (error) {
                alert("An error has occurred while downloading the gallery. Check logs for more information.");
                console.error(error);
            }
        });
        collapseShareElement.parentNode.prepend(downloadGalleryElement);
    });
})();