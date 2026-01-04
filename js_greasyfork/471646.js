// ==UserScript==
// @name         Japanese to Romaji Converter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Convert Selected Japanese text to Romaji
// @author       Nizam
// @license MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/471646/Japanese%20to%20Romaji%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/471646/Japanese%20to%20Romaji%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function convertToRomaji() {
        let selection = window.getSelection();
        let selectedText = selection.toString();

        if (selectedText) {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://api.kuroshiro.org/convert",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    "str": selectedText,
                    "to": "romaji",
                    "mode": "normal",
                    "romajiSystem": "hepburn"
                }),
                onload: function(response) {
                    let result = JSON.parse(response.responseText);

                    let range = selection.getRangeAt(0);
                    range.deleteContents();

                    let span = document.createElement("span");
                    span.textContent = result.result;
                    range.insertNode(span);
                }
            });
        }
    }

    let floatingButton = document.createElement('img');
    floatingButton.src = "https://www.svgrepo.com/show/350359/language.svg";
    floatingButton.style.position = "fixed";
    floatingButton.style.top = "20px"; // Adjust the top position as needed
    floatingButton.style.right = "20px"; // Adjust the right position as needed
    floatingButton.style.zIndex = "10000";
    floatingButton.style.width = "40px"; // Adjust the width and height as needed
    floatingButton.style.height = "40px";
    floatingButton.style.borderRadius = "5px";
    floatingButton.style.cursor = "pointer";

    document.body.appendChild(floatingButton);

    floatingButton.addEventListener('click', convertToRomaji);
})();
