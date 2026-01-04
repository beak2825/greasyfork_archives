// ==UserScript==
// @name         F95Zone "Compressed" search button
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Adds a button with a custom button to search for "compressed" on F95Zone threads
// @author       Vic
// @match        https://f95zone.to/threads/*
// @icon         https://www.google.com/s2/favicons?domain=f95zone.to
// @grant        none
// @license      GPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/500598/F95Zone%20%22Compressed%22%20search%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/500598/F95Zone%20%22Compressed%22%20search%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a new button with a custom WinRAR-style icon
    const button = document.createElement('button');
    button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.333 17.333" fill="#fff">
            <path d="M14.75,0H2.585C2.329,0,2.12,0.208,2.12,0.467v8.881v1.653v5.866c0,0.257,0.209,0.466,0.466,0.466
                h9.072c0.13,0,0.257-0.057,0.345-0.156l3.091-3.461c0.077-0.086,0.118-0.194,0.118-0.31V0.467C15.214,0.208,15.006,0,14.75,0z
                 M13.746,12.114l-2.774-0.002c-0.137,0-0.269,0.056-0.366,0.152s-0.151,0.228-0.151,0.366l0.01,3.47H3.517v-5.099V9.348V1.167h4.59
                v0.521h1.117V1.167h4.522V12.114z M9.224,6.513H8.107v-1.93h1.117V6.513z M9.224,4.1H8.107V2.169h1.117V4.1z M9.225,8.114V6.997
                H8.108v1.117h0.071v0.031C7.906,8.169,7.69,8.395,7.69,8.674v4.473c0,0.294,0.239,0.536,0.533,0.536h0.889
                c0.293,0,0.533-0.24,0.533-0.536V8.674c0-0.279-0.217-0.506-0.487-0.529V8.114H9.225z M9.289,11.475v1.29
                c0,0.295-0.238,0.534-0.533,0.534H8.555c-0.294,0-0.532-0.238-0.532-0.534v-1.29c0-0.293,0.238-0.533,0.532-0.533h0.201
                C9.05,10.942,9.289,11.181,9.289,11.475z"/>
        </svg>
    `;
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '10px';
    button.style.backgroundColor = '#ba4545';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '50%'; // to make it round
    button.style.width = '40px';
    button.style.height = '40px';
    button.style.cursor = 'pointer';

    // Append the button to the body
    document.body.appendChild(button);

    // Add click event to the button
    button.addEventListener('click', function() {
        // Find the search box and search button
        const searchBox = document.querySelector('input[name="keywords"]');
        const searchButton = document.querySelector('button[type="submit"]');

        if (searchBox && searchButton) {
            // Set the value of the search box to "compressed" and trigger input events to ensure the value is recognized
            searchBox.value = 'compressed';
            searchBox.dispatchEvent(new Event('input', { bubbles: true }));
            searchBox.dispatchEvent(new Event('change', { bubbles: true }));

            // Add a small delay before clicking the search button
            setTimeout(() => {
                searchButton.click();
            }, 100); // Delay of 100 milliseconds
        } else {
            alert('Search box or search button not found!');
        }
    });
})();
