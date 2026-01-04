// ==UserScript==
// @name         TikTok Warning Popup (with TikTok Colors, Animation, and Button Effects)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Shows a warning that TikTok may be banned with animated TikTok-themed buttons and an outline effect on hover.
// @author       You
// @match        *://*.tiktok.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512045/TikTok%20Warning%20Popup%20%28with%20TikTok%20Colors%2C%20Animation%2C%20and%20Button%20Effects%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512045/TikTok%20Warning%20Popup%20%28with%20TikTok%20Colors%2C%20Animation%2C%20and%20Button%20Effects%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the popup warning div
    let popupDiv = document.createElement('div');
    popupDiv.id = 'tiktok-warning-popup';
    popupDiv.innerHTML = `
        <div id="tiktok-warning-content">
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
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            animation: fadeIn 1.5s ease-in-out;
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
            padding: 12px 25px;
            font-size: 16px;
            margin: 10px;
            cursor: pointer;
            border-radius: 30px;
            border: 2px solid transparent;
            color: white;
            background-color: black;
            transition: all 0.4s ease-in-out;
            position: relative;
            overflow: hidden;
        }
        #exit-tiktok {
            background-color: #fe2c55; /* TikTok pink */
        }
        #proceed-tiktok {
            background-color: #25f4ee; /* TikTok blue */
        }
        #exit-tiktok:hover, #proceed-tiktok:hover {
            border-color: #000000;
            background-color: white;
            color: black;
        }
        #exit-tiktok:hover::before, #proceed-tiktok:hover::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 30px;
            background: linear-gradient(90deg, #fe2c55, #25f4ee);
            z-index: -1;
            transition: all 0.4s ease;
        }
        @keyframes fadeIn {
            0% {
                opacity: 0;
                transform: translateY(-20px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
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
