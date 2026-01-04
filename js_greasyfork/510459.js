// ==UserScript==
// @name         Find Replace Content from Local
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fetch and update page content from localhost:9000
// @include      https://*.amazon.*/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/510459/Find%20Replace%20Content%20from%20Local.user.js
// @updateURL https://update.greasyfork.org/scripts/510459/Find%20Replace%20Content%20from%20Local.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentHash = '';

    const firstStyleElement = document.getElementsByTagName('style')[0]
    const originalStyleInnerHtml = firstStyleElement ? firstStyleElement.innerHTML : ''

    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash;
    }

    function updateContent() {
        console.log('========== Find Replace Content from Local (FRCL) ==========');
        GM_xmlhttpRequest({
            method: "GET",
            nocache: true,
            url: "http://localhost:8000",
            onload: function(response) {
                const newHash = hashString(response.responseText);
                if (newHash !== currentHash) {
                    console.log("FRCL - new content detected")
                    const parser = new DOMParser();
                    const fetchedDoc = parser.parseFromString(response.responseText, "text/html");
                    const fetchedBodyChildren = fetchedDoc.body.children;
                    for (const ele in fetchedBodyChildren) {
                        if (ele.tagName === 'STYLE') {
                            console.log('style')
                            if (firstStyleElement) {
                                firstStyleElement.innerHtml = originalStyleInnerHtml + "\n" + ele.innerHtml
                            }
                            else {
                                document.body.appendChild(ele)
                            }
                        }
                        else if (ele.tagName === 'DIV') {
                            console.log('div')
                            const elementId = ele.id;
                            const currentElement = document.getElementById(elementId);
                            if (currentElement) {
                                currentElement.outerHTML = ele.outerHTML;
                                console.log('FRCL - Element updated:', elementId);
                            } else {
                                console.log('FRCL - Matching element not found in current page:', elementId);
                            }
                        }
                    }
                    currentHash = newHash;
                }
            },
            onerror: function(error) {
                console.error('FRCL - Error fetching content:', error);
            }
        });
    }

    // Run updateContent every second
    setInterval(updateContent, 1000);
})();

