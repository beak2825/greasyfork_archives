// ==UserScript==
// @name               U-NEXT Max Resolution
// @name:zh-CN         U-NEXT 强制最高画质
// @name:ja            U-NEXT 最高画質固定
// @namespace          http://tampermonkey.net/
// @match              https://*.unext.jp/*
// @grant              none
// @version            1.0
// @author             DiruSec
// @license            MIT
// @icon               https://www.google.com/s2/favicons?sz=64&domain=unext.jp
// @description        Force streaming video at maximum resolution on U-NEXT.
// @description:zh-CN  强制 U-NEXT 使用最高分辨率进行播放
// @description:ja     U-NEXTの再生画質を最高画質に固定させる
// @downloadURL https://update.greasyfork.org/scripts/506902/U-NEXT%20Max%20Resolution.user.js
// @updateURL https://update.greasyfork.org/scripts/506902/U-NEXT%20Max%20Resolution.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove all <Representation> elements except the one with the largest bandwidth
    function filterRepresentations(xmlString) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");

        const adaptationSets = xmlDoc.getElementsByTagNameNS("*", "AdaptationSet");

        for (let i = 0; i < adaptationSets.length; i++) {
            const adaptationSet = adaptationSets[i];
            const representations = adaptationSet.getElementsByTagNameNS("*", "Representation");

            let maxBandwidth = -1;
            let maxRepresentation = null;

            for (let j = 0; j < representations.length; j++) {
                const representation = representations[j];
                const bandwidth = parseInt(representation.getAttribute("bandwidth"), 10);

                if (bandwidth > maxBandwidth) {
                    maxBandwidth = bandwidth;
                    maxRepresentation = representation;
                }
            }

            // Remove all <Representation> elements except the one with the largest bandwidth
            for (let j = representations.length - 1; j >= 0; j--) {
                const representation = representations[j];
                if (representation !== maxRepresentation) {
                    adaptationSet.removeChild(representation);
                }
            }
        }

        // Serialize the DOM object back to a string
        const serializer = new XMLSerializer();
        return serializer.serializeToString(xmlDoc);
    }

    // Save the original fetch function
    const originalFetch = window.fetch;

    // Override the fetch function
    window.fetch = async function(...args) {
        const url = args[0];

        // Check if the URL matches the pattern
        const regex = /https:\/\/playlist\.unext\.jp\/playlist\/v00001\/dash\/get\/.*?\.mpd.*/;

        if (regex.test(url)) {

            // Perform the fetch request
            const response = await originalFetch(...args);

            // Clone the response so that we can modify it
            const responseClone = await response.clone().text();

            // Modify the XML response
            const modifiedXml = filterRepresentations(responseClone);

            // Return a new Response object with the modified XML
            return new Response(modifiedXml, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });
        }

        // If the URL doesn't match, return the original fetch call
        return originalFetch(...args);
    };
})();