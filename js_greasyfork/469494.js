// ==UserScript==
// @name         r/piracyArchive Auto Base64 Decoder - reddit
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Automatically Decode Base64 encoded links on reddit r/piracyArchive
// @author       KloudEZ_Support
// @match        *://**/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469494/rpiracyArchive%20Auto%20Base64%20Decoder%20-%20reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/469494/rpiracyArchive%20Auto%20Base64%20Decoder%20-%20reddit.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{20,})$/g

    setInterval(() => {
        const pTags = document.querySelectorAll('p')


        pTags.forEach(pTag => {
            const pTagText = pTag.innerText.split(/\s+/);

            pTagText.forEach(text => {
                if (base64Regex.test(text)) {
                    pTag.innerText = pTag.innerText.replace(text, atob(text));
                    const txt = pTag.innerText.split("\n");
                    const links = [];
                    txt.forEach(link => {
                        links.push("<div style='border: 1px dashed #e6e6e6;padding: 10px;background-image: linear-gradient(45deg, rgba(199,199,199,.25) 25%, rgba(227,227,227,.25) 25%, rgba(227,227,227,.25) 50%, rgba(199,199,199,.25) 50%, rgba(199,199,199,.25) 75%, rgba(227,227,227,.25) 75%, rgba(227,227,227,.25) 100%);background-size: 40px 40px'><a href='" + link + "'>" + link + "</a></div>");
                    });
                    pTag.outerHTML = links.join("\n");
                }
            });
        }


                     )
    }, 200)

    setInterval(() => {
        const h1Tags = document.querySelectorAll('h1')


        h1Tags.forEach(h1Tag => {
            const h1TagText = h1Tag.innerText.split(/\s+/);

            h1TagText.forEach(text => {
                if (base64Regex.test(text)) {
                    h1Tag.innerText = h1Tag.innerText.replace(text, atob(text));
                    const txt = h1Tag.innerText.split("\n");
                    const links = [];
                    txt.forEach(link => {
                        links.push("" + link + "");
                    });
                    h1Tag.outerHTML = links.join("\n");
                }
            });
        }


                     )
    }, 200)

    setInterval(() => {
        const h3Tags = document.querySelectorAll('h3')


        h3Tags.forEach(h3Tag => {
            const h3TagText = h3Tag.innerText.split(/\s+/);

            h3TagText.forEach(text => {
                if (base64Regex.test(text)) {
                    h3Tag.innerText = h3Tag.innerText.replace(text, atob(text));
                    const txt = h3Tag.innerText.split("\n");
                    const links = [];
                    txt.forEach(link => {
                        links.push("" + link + "");
                    });
                    h3Tag.outerHTML = links.join("\n");
                }
            });
        }


                     )
    }, 200)

setInterval(() => {
        const h2Tags = document.querySelectorAll('h2')


        h2Tags.forEach(h2Tag => {
            const h2TagText = h2Tag.innerText.split(/\s+/);

            h2TagText.forEach(text => {
                if (base64Regex.test(text)) {
                    h2Tag.innerText = h2Tag.innerText.replace(text, atob(text));
                    const txt = h2Tag.innerText.split("\n");
                    const links = [];
                    txt.forEach(link => {
                        links.push("" + link + "");
                    });
                    h2Tag.outerHTML = links.join("\n");
                }
            });
        }


                     )
    }, 200)

setInterval(() => {
        const h4Tags = document.querySelectorAll('h4')


        h4Tags.forEach(h4Tag => {
            const h4TagText = h4Tag.innerText.split(/\s+/);

            h4TagText.forEach(text => {
                if (base64Regex.test(text)) {
                    h4Tag.innerText = h4Tag.innerText.replace(text, atob(text));
                    const txt = h4Tag.innerText.split("\n");
                    const links = [];
                    txt.forEach(link => {
                        links.push("" + link + "");
                    });
                    h4Tag.outerHTML = links.join("\n");
                }
            });
        }


                     )
    }, 200)

})();