// ==UserScript==
// @name         JPDB KanjiVG Image Replacer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Replace kanji image on jpdb.io with KanjiVG image
// @author       edelmeister
// @match        https://jpdb.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jpdb.io
// @grant        GM_xmlhttpRequest
// @license      CC BY 4.0
// @downloadURL https://update.greasyfork.org/scripts/476944/JPDB%20KanjiVG%20Image%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/476944/JPDB%20KanjiVG%20Image%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const customCSS = `
        .kanji.plain svg {
            width: 300px !important;
            height: 300px !important;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = customCSS;
    document.head.appendChild(styleSheet);

    console.log('Script is running'); // This will log that your script is running

    const linkElement = document.querySelector('a.kanji.plain'); // Find the link element with the kanji character
    if (!linkElement) return; // Exit if the link element is not found
    console.log(linkElement); // Log the link element

    const hrefValue = linkElement.getAttribute('href'); // Get the href attribute value from the link element
    console.log(hrefValue); // Log the href attribute value

    const kanjiWithHash = hrefValue.split('/')[2]; // Split the href value by '/' and get the part that contains the kanji character and '#a'
    const kanji = kanjiWithHash.split('#')[0]; // Split that part by '#' to get just the kanji character
    console.log(kanji); // Log the kanji character

    const unicodeHex = kanji.charCodeAt(0).toString(16).toLowerCase().padStart(5, '0'); // Convert the kanji character to lowercase hexadecimal unicode value and pad it with zeros to 5 characters
    console.log(unicodeHex); // Log the unicode hexadecimal value

    const url = `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${unicodeHex}.svg`; // Construct the URL to the SVG image on KanjiVG repository
    console.log(url); // Log the URL

    // Function to fetch the SVG content and replace the image on jpdb.io
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
            if (response.status === 404) {
                console.log('SVG image not found, not replacing the image.');
                return; // Exit the function if the SVG image is not found
            }
            const svgElement = document.querySelector('svg.kanji'); // Find the SVG element on jpdb.io
            if (svgElement) {
                svgElement.outerHTML = response.responseText; // Replace the content of the SVG element with the fetched SVG content
            } else {
                console.log('SVG element not found'); // Log if the SVG element is not found
            }
        }
    });
})();
