// ==UserScript==
// @name         Grid Button
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  GRID EXTENTION WOOOOOOO
// @author       Lin3y
// @match        https://trackerhub.vercel.app/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/465541/Grid%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/465541/Grid%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const button = document.createElement("button");
    button.textContent = "Grid";
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
    button.style.border = "none";
    button.style.borderRadius = "10px";
    button.style.backgroundColor = "#ddd";
    button.style.color = "#333";
    button.style.padding = "10px 20px";
    button.style.fontSize = "18px";
    button.style.cursor = "pointer";
    button.addEventListener("click", showGrid);

    if (window.self === window.top) {
        document.body.appendChild(button);
    }
    const overlay = document.createElement("div");
    overlay.style.display = "none";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    overlay.style.zIndex = "9999";
    overlay.addEventListener("click", hideGrid);

    document.body.appendChild(overlay);

    const iframe = document.createElement("iframe");
    iframe.src = "https://gridguy101.github.io/gridthing";
    iframe.style.display = "block";
    iframe.style.width = "80%";
    iframe.style.height = "80%";
    iframe.style.position = "absolute";
    iframe.style.top = "50%";
    iframe.style.left = "50%";
    iframe.style.transform = "translate(-50%, -50%)";

    iframe.addEventListener("load", function() {
        const url = iframe.contentWindow.location.href;
        if (url.startsWith(window.location.origin)) {
            hideGrid();
            window.location.href = url;
        }
    });

    overlay.appendChild(iframe);

    function showGrid() {
        overlay.style.display = "block";
    }

    function hideGrid() {
        overlay.style.display = "none";
    }

    GM_addStyle(`
        /* Style the close button */
        #grid-close-button {
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 50px;
            color: white;
            background-color: transparent;
            border: none;
            cursor: pointer;
        }

        #grid-close-button:hover {
            color: #ccc;
        }
    `);

    const closeButton = document.createElement("button");
    closeButton.id = "grid-close-button";
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", hideGrid);
    overlay.appendChild(closeButton);
})();
