// ==UserScript==
// @name         Medal No Watermark Downloader (MedalBypass)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Download Medal clips without watermark via MedalBypass API (corrected for /clips/ URL)
// @author       You
// @match        https://medal.tv/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      medalbypass.vercel.app
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534334/Medal%20No%20Watermark%20Downloader%20%28MedalBypass%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534334/Medal%20No%20Watermark%20Downloader%20%28MedalBypass%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract Medal clip ID properly
    function getClipID() {
        const match = window.location.href.match(/clips\/([^/?]+)/);
        return match ? match[1] : null;
    }

    function createButton() {
        const btn = document.createElement('button');
        btn.innerText = "⬇️ No Watermark";
        btn.style.position = "fixed";
        btn.style.bottom = "20px";
        btn.style.right = "20px";
        btn.style.zIndex = "10000";
        btn.style.padding = "10px";
        btn.style.backgroundColor = "#ff5722";
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.borderRadius = "8px";
        btn.style.fontSize = "18px";
        btn.style.cursor = "pointer";
        btn.style.boxShadow = "0 4px 6px rgba(0,0,0,0.2)";

        btn.onclick = function() {
            const clipID = getClipID();
            if (!clipID) {
                alert("No Medal clip ID detected!");
                return;
            }

            const apiUrl = `https://medalbypass.vercel.app/api/clip?id=${clipID}`;

            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                onload: function(response) {
                    const data = JSON.parse(response.responseText);
                    if (data.valid && data.src) {
                        GM_download(data.src, `${clipID}.mp4`);
                    } else {
                        alert("Error: " + (data.reasoning || "Unknown error."));
                    }
                },
                onerror: function() {
                    alert("Failed to reach MedalBypass API.");
                }
            });
        };

        document.body.appendChild(btn);
    }

    window.addEventListener('load', createButton);

})();
