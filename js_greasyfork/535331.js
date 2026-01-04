// ==UserScript==
// @name         Nodego AccessToken Extractor
// @namespace    https://github.com/itsmesatyavir
// @version      1.0
// @description  Extracts and displays accessToken from localStorage on app.nodego.ai with a copy button.
// @author       ForestArmy
// @license      MIT
// @match        https://app.nodego.ai/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/535331/Nodego%20AccessToken%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/535331/Nodego%20AccessToken%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const token = localStorage.getItem("accessToken");

    if (!token) return;

    const box = document.createElement("div");
    box.innerHTML = `
        <div id="tokenBox">
            <label><strong>Access Token:</strong></label><br>
            <textarea id="accessToken" readonly>${token}</textarea><br>
            <button id="copyToken">Copy</button>
        </div>
    `;
    document.body.appendChild(box);

    GM_addStyle(`
        #tokenBox {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: #fff;
            border: 2px solid #444;
            padding: 10px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            z-index: 9999;
        }
        #accessToken {
            width: 100%;
            height: 60px;
            margin: 5px 0;
            font-family: monospace;
        }
        #copyToken {
            background: #28a745;
            color: white;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 5px;
        }
        #copyToken:hover {
            background: #218838;
        }
    `);

    document.getElementById("copyToken").addEventListener("click", () => {
        GM_setClipboard(token);
        alert("Access Token Copied to Clipboard!");
    });

})();