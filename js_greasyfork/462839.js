// ==UserScript==
// @name         URL Expander
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Expand TinyURL, Reurl.cc, and Bit.ly links to their original URLs
// @author       ChatGPT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/462839/URL%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/462839/URL%20Expander.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    function replaceLink(element, newUrl) {
        element.href = newUrl;
    }

    async function expandTinyUrl(tinyUrl) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: tinyUrl.replace('://tinyurl.com/', '://preview.tinyurl.com/'),
                onload: function (response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const redirectUrl = doc.querySelector("#redirecturl");
                    if (redirectUrl) {
                        resolve(redirectUrl.href);
                    } else {
                        reject("Original URL not found");
                    }
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
    }

    async function expandReurl(reurl) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: reurl + "+",
                onload: function (response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const redirectUrl = doc.querySelector(".row .col-md-12.text-center a");
                    if (redirectUrl) {
                        resolve(redirectUrl.href);
                    } else {
                        reject("Original URL not found");
                    }
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
    }

    async function expandBitly(bitlyUrl) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: bitlyUrl + "+",
                onload: function (response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const redirectUrl = doc.querySelector(".item-detail--url");
                    if (redirectUrl) {
                        resolve(redirectUrl.textContent.trim());
                    } else {
                        reject("Original URL not found");
                    }
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
    }

    const tinyUrls = document.querySelectorAll('a[href^="https://tinyurl.com/"]');
    for (const link of tinyUrls) {
        try {
            const expandedUrl = await expandTinyUrl(link.href);
            replaceLink(link, expandedUrl);
        } catch (error) {
            console.error(`Error expanding TinyURL: ${error}`);
        }
    }

    const reurls = document.querySelectorAll('a[href^="https://reurl.cc/"]');
    for (const link of reurls) {
        try {
            const expandedUrl = await expandReurl(link.href);
            replaceLink(link, expandedUrl);
        } catch (error) {
            console.error(`Error expanding Reurl.cc: ${error}`);
        }
    }

    const bitlyUrls = document.querySelectorAll('a[href^="https://bit.ly/"]');
    for (const link of bitlyUrls) {
        try {
            const expandedUrl = await expandBitly(link.href);
            replaceLink(link, expandedUrl);
        } catch (error) {
            console.error(`Error expanding Bit.ly: ${error}`);
        }
    }
})();
