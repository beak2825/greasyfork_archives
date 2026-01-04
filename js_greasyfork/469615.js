// ==UserScript==
// @name         [Outdated] Stable Diffusion Metadata Discord Image Overlay
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  [Outdated] Displays Stable Diffusion metadata generated as an overlay on Discord images.
// @author       moony
// @icon         https://iconarchive.com/icons/ccard3dev/dynamic-yosemite/256/Preview-icon.png
// @match        https://discord.com/*
// @require      https://cdn.jsdelivr.net/npm/exifreader@4.12.0/dist/exif-reader.min.js
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/469615/%5BOutdated%5D%20Stable%20Diffusion%20Metadata%20Discord%20Image%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/469615/%5BOutdated%5D%20Stable%20Diffusion%20Metadata%20Discord%20Image%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function readExif(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "arraybuffer",
                onload: (response) => resolve(getPromptFromTags(ExifReader.load(response.response, { expanded: true }))),
                onerror: reject
            });
        });
    }

    function getPromptFromTags(tags) {
        let com = "";
        if (tags.exif && tags.exif.UserComment) return decodeUnicode(tags.exif.UserComment.value);
        if (!tags.pngText) return "";
        if (tags.pngText.parameters) return tags.pngText.parameters.description;
        if (tags.pngText.Dream) return tags.pngText.Dream.description + (tags.pngText["sd-metadata"] ? "\r\n" + tags.pngText["sd-metadata"].description : "");
        if (tags.pngText.Software && tags.pngText.Software.description == "NovelAI") {
            const positive = tags.pngText.Description.description;
            const negative = tags.pngText.Comment.description.replaceAll(/\\u00a0/g, " ").match(/"uc": "([^]+)"[,}]/)[1];
            let others = tags.pngText.Comment.description.replaceAll(/\\u00a0/g, " ") + "\r\n";
            others += tags.pngText.Software.description + "\r\n";
            others += tags.pngText.Title.description + "\r\n";
            others += tags.pngText.Source.description;
            return JSON.stringify({positive, negative, others});
        }
        Object.keys(tags.pngText).forEach(tag => com += tags.pngText[tag].description);
        return com;
    }

    function decodeUnicode(array) {
        const plain = array.map(t => t.toString(16).padStart(2, "0")).join("");
        if (!plain.match(/^554e49434f44450/)) return "";
        const hex = plain.replace(/^554e49434f44450[0-9]/, "").replace(/[0-9a-f]{4}/g, ",0x$&").replace(/^,/, "");
        return hex.split(",").map(v => String.fromCodePoint(v)).join("");
    }

    async function getExif(url) {
        try {
            return await readExif(url);
        } catch (error) {
            console.error(error);
            return '';
        }
    }

    async function processUrl(url, maxWidth) {
        const cleanUrl = url.split('?')[0];
        const text = await getExif(cleanUrl);
        let truncatedText = '';
        let words = text.split(' ');
        for (let word of words) {
            if ((truncatedText + word).length > maxWidth) truncatedText += '\n';
            truncatedText += word + ' ';
        }
        return truncatedText.trim();
    }

    async function addTextOverlayWithUrl(imageElement) {
        let img = new Image();
        img.src = imageElement.getAttribute('data-safe-src');
        let wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        let textOverlay = document.createElement('div');
        textOverlay.className = 'text-overlay';
        let urlText = document.createElement('span');
        urlText.textContent = await processUrl(img.src, img.clientWidth);
        imageElement.appendChild(img);
        imageElement.insertBefore(wrapper, img);
        wrapper.appendChild(textOverlay);
        wrapper.appendChild(img);
        textOverlay.appendChild(urlText);
    }

    async function checkForNewImages() {
        let imageElements = document.querySelectorAll('a[data-safe-src]');
        for (let imageElement of imageElements) {
            if (!imageElement.classList.contains('textOverlayAdded')) {
                await addTextOverlayWithUrl(imageElement);
                imageElement.classList.add('textOverlayAdded');
            }
        }
    }

    setTimeout(() => setInterval(checkForNewImages, 2000), 5000);

    GM_addStyle(`
        .text-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            padding: 5px;
            color: white;
            font-family: sans-serif;
            font-size: 12px;
            word-wrap: break-word;
            white-space: pre-wrap;
        }
        .text-overlay span {
            color: white;
            text-decoration: none;
        }
        img {
            object-fit: contain;
            width: 100%;
            height: 100%;
        }
    `);
})();
