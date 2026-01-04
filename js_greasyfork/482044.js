// ==UserScript==
// @name         PsxHax Forums CUSA Number Replacer
// @version      0.3
// @description  Replace CUSA numbers with game names
// @author       Jelly Time
// @match        https://www.psxhax.com/forums/_/*
// @grant        none
// @run-at       document-idle
// @license AGPL-3.0-or-later
// @namespace https://greasyfork.org/users/1227452
// @downloadURL https://update.greasyfork.org/scripts/482044/PsxHax%20Forums%20CUSA%20Number%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/482044/PsxHax%20Forums%20CUSA%20Number%20Replacer.meta.js
// ==/UserScript==

/* jshint esversion:11 */

(async function () {
    'use strict';

    // Function to convert a string to an ArrayBuffer
    function stringToArrayBuffer(str) {
        const encoder = new TextEncoder();
        return encoder.encode(str);
    }

    // Function to convert an ArrayBuffer to a hex string
    function arrayBufferToHexString(buffer) {
        const byteArray = new Uint8Array(buffer);
        return Array.from(byteArray, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Function to convert a hex string to an ArrayBuffer
    function hexStringToArrayBuffer(hexString) {
        const buffer = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        return buffer.buffer;
    }

    // Function to generate HMAC-SHA1 hash
    async function generateHmacSha1(key, data) {
        // Convert key and data to ArrayBuffers
        const keyArrayBuffer = hexStringToArrayBuffer(key);
        const dataArrayBuffer = stringToArrayBuffer(data);

        // Import the key
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyArrayBuffer,
            { name: 'HMAC', hash: { name: 'SHA-1' } },
            false,
            ['sign']
        );

        // Generate the HMAC-SHA1 hash
        const signature = await crypto.subtle.sign(
            { name: 'HMAC', hash: 'SHA-1' },
            cryptoKey,
            dataArrayBuffer
        );

        // Convert the signature to a hex string and make it uppercase
        return arrayBufferToHexString(signature).toUpperCase();
    }

// Function to replace CUSA numbers with game names using the public API
    async function replaceGameNames() {
        const elements = document.querySelectorAll('a'); // Select all links on the page

        for (const element of elements) {
            const cusaNumberMatch = element.textContent.trim().match(/^\d{5}$/); // filter to just CUSAs

            if (cusaNumberMatch) {
                const cusaNumber = cusaNumberMatch[0];

                try {
                    // Check if the CUSA number is in the exclusion list
                    const isExcluded = ['00000', '00001', '00002', '00003', '00005', '00006'].includes(cusaNumber);

                    if (!isExcluded) {
                        // Replace the URL placeholders with the actual values
                        const hmacSha1Uppercase = await generateHmacSha1('F5DE66D2680E255B2DF79E74F890EBF349262F618BCAE2A9ACCDEE5156CE8DF2CDF2D48C71173CDC2594465B87405D197CF1AED3B7E9671EEB56CA6753C2E6B0', `CUSA${cusaNumber}_00`);
                        const apiUrl = `https://tmdb.np.dl.playstation.net/tmdb2/CUSA${cusaNumber}_00_${hmacSha1Uppercase}/CUSA${cusaNumber}_00.json`;

                        console.log(apiUrl);

                        // Fetch data from the public API
                        const response = await fetch(apiUrl);
                        const data = await response.json();

                        // Assuming the API response has a 'names' array
                        const gameNames = data.names || [];

                        // Find the English name in the 'names' array
                        const englishName = gameNames.find(name => name.lang === undefined)?.name;

                        if (englishName) {
                            // Replace the CUSA number with the retrieved game name
                            element.textContent = `${cusaNumber} (${englishName})`;
                        } else {
                            console.error(`English name not found for CUSA: ${cusaNumber}`);
                        }
                    } else {
                        console.log(`CUSA number ${cusaNumber} is in the exclusion list. Skipping API call.`);
                    }
                } catch (error) {
                    console.error(`Error fetching data for CUSA: ${cusaNumber}`, error);
                }
            }
        }
    }

// Run the function when the page is loaded
    await replaceGameNames();
})();

