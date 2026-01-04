// ==UserScript==
// @name         FMHY Decoder
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Decode Base64 encoded links from the https://fmhy.pages.dev/
// @author       FMHY
// @match        https://fmhy.pages.dev/base64*
// @match        https://fmhy.pages.dev/base64
// @match        https://fmhy.pages.dev/base64/*
// @icon         data:image/jpeg;base64,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
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480982/FMHY%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/480982/FMHY%20Decoder.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{20,})$/g

    // Must set an interval, otherwise the content that is lazy loaded (e.g. loaded on scrolling) will not get decoded
    setInterval(() => {
        const pTags = document.querySelectorAll('p')

        pTags.forEach(pTag => {
            // Split the string into an array and check each element for a base64 encoded string
            const pTagText = pTag.innerText.split(/\s+/);

            pTagText.forEach(text => {
                if (base64Regex.test(text)) {
                    // If the string is a base64 encoded string, decode it and replace the p tag with the decoded string
                    pTag.innerText = pTag.innerText.replace(text, atob(text));
                    const txt = pTag.innerText.split("\n");
                    const links = [];
                    txt.forEach(link => {
                        links.push("<a href='" + link + "'>" + link + "</a>");
                    });
                    pTag.outerHTML = links.join("\n");
                }
            });
        })
    }, 500)
})();