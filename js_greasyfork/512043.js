// ==UserScript==
// @name         TikTok Warning Popup (with Logo, Font, and Styled Buttons)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Shows a warning that TikTok may be banned with a TikTok logo, custom font, and pink rounded buttons.
// @author       You
// @match        *://*.tiktok.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512043/TikTok%20Warning%20Popup%20%28with%20Logo%2C%20Font%2C%20and%20Styled%20Buttons%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512043/TikTok%20Warning%20Popup%20%28with%20Logo%2C%20Font%2C%20and%20Styled%20Buttons%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the popup warning div
    let popupDiv = document.createElement('div');
    popupDiv.id = 'tiktok-warning-popup';
    popupDiv.innerHTML = `
        <div id="tiktok-warning-content">
            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/TikTok_logo.svg/640px-TikTok_logo.svg.png" alt="TikTok Logo" id="tiktok-logo">
            <h1>TikTok Warning</h1>
            <p>TikTok could be banned in the U.S. by January 2025 unless its Chinese parent company, ByteDance, sells it to a U.S. company.</p>
            <p>This is currently being fought in court, but the future of TikTok in the U.S. remains uncertain.</p>
            <div>
                <button id="exit-tiktok">Exit TikTok</button>
                <button id="proceed-tiktok">Proceed</button>
            </div>
        </div>
    `;

    // Apply styles to the popup
    let style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');

        #tiktok-warning-popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: 'Montserrat', sans-serif;
        }
        #tiktok-warning-content {
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        #tiktok-logo {
            width: 100px;
            margin-bottom: 20px;
        }
        #tiktok-warning-content h1 {
            font-size: 24px;
            margin-bottom: 10px;
        }
        #tiktok-warning-content p {
            font-size: 16px;
            margin-bottom: 20px;
        }
        #tiktok-warning-content button {
            padding: 10px 20px;
            font-size: 16px;
            margin: 5px;
            cursor: pointer;
            border-radius: 25px;
            border: none;
            color: white;
        }
        #exit-tiktok {
            background-color: #ff007f; /* Pink color */
        }
        #proceed-tiktok {
            background-color: #ff007f; /* Pink color */
        }
        #exit-tiktok:hover, #proceed-tiktok:hover {
            background-color: #ff3399; /* Lighter pink on hover */
        }
    `;

    // Append the popup and styles to the document
    document.head.appendChild(style);
    document.body.appendChild(popupDiv);

    // Exit TikTok when "Exit TikTok" is clicked
    document.getElementById('exit-tiktok').addEventListener('click', function() {
        window.location.href = 'https://google.com'; // Redirects to another site (e.g., Google)
    });

    // Remove popup and allow TikTok to load when "Proceed" is clicked
    document.getElementById('proceed-tiktok').addEventListener('click', function() {
        document.getElementById('tiktok-warning-popup').style.display = 'none';
    });
})();
