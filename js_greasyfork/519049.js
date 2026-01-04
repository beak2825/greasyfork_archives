// ==UserScript==
// @name         Копировать подсветки для Food.ru
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to copy the first column of a table inside div#podsvetki to clipboard
// @author       GreatFireDragon
// @match        https://arsenkin.ru/tools/sp/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arsenkin.ru
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519049/%D0%9A%D0%BE%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%20%D0%BF%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20Foodru.user.js
// @updateURL https://update.greasyfork.org/scripts/519049/%D0%9A%D0%BE%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%20%D0%BF%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20Foodru.meta.js
// ==/UserScript==

// GM_addStyle to add custom styles for the "Copy" button
GM_addStyle(`
    #copyButton {
        padding: 10px 20px;
        font-size: 14px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
    }

    #copyButton:hover {
        background-color: #45a049;
        transform: scale(1.05);
    }

    #copyButton:active {
        background-color: #388e3c;
        transform: scale(0.98);
    }

    #copyButton:focus {
        outline: none;
        box-shadow: 0 0 10px rgba(0, 128, 0, 0.6);
    }
`);

// Function to find div#podsvetki and add the "copy" button
function tryAddCopyButton() {
    const podsvetkiDiv = document.getElementById("podsvetki");
    if (podsvetkiDiv) {
        const copyButton = document.createElement("button");
        copyButton.id = "copyButton";
        copyButton.innerText = "Copy";
        copyButton.addEventListener("click", copyFirstColumnToClipboard);
        podsvetkiDiv.insertBefore(copyButton, podsvetkiDiv.firstChild);
    } else {
        setTimeout(tryAddCopyButton, 1000); // Try again
    }
}

// Function to copy the first column of the table inside div#podsvetki to clipboard
function copyFirstColumnToClipboard() {
    const podsvetkiDiv = document.getElementById("podsvetki");
    if (podsvetkiDiv) {
        const table = podsvetkiDiv.querySelector("table");
        if (table) {
            const firstColumnTexts = Array.from(table.querySelectorAll("tr td:first-child")).map(td => td.innerText.trim());
            const textToCopy = firstColumnTexts.join("\n");

            // Copy to clipboard
            navigator.clipboard.writeText(textToCopy).then(() => {
                console.log("First column copied to clipboard!");
                podsvetkiDiv.style.backgroundColor = "lightgreen";
                setTimeout(() => {podsvetkiDiv.style.backgroundColor = "";}, 500);
            }).catch(err => {
                alert('Failed to copy: ', err);
            });
        } else {
            alert("No table found in #podsvetki.");
        }
    }
}

// Add event listener to button#ok
document.getElementById("ok").addEventListener("click", () => {
    setTimeout(tryAddCopyButton, 2000); // Wait 2 seconds before trying to find #podsvetki
});




