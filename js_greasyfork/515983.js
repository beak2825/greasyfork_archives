// ==UserScript==
// @name         SteamDB DLC List Copier
// @author       latecry
// @namespace    http://tampermonkey.net/
// @version      1.1
// @icon         https://external-content.duckduckgo.com/ip3/steamdb.info.ico
// @description  Copy BBCode formatted DLC list on SteamDB
// @match        https://steamdb.info/app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515983/SteamDB%20DLC%20List%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/515983/SteamDB%20DLC%20List%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function copyDLCList() {
        const dlcElements = document.querySelectorAll('tr.app[data-appid]');
        if (dlcElements.length === 0) {
            alert("No DLC found on this page.");
            return;
        }
        let dlcList = "Included DLC:";
        dlcElements.forEach(dlc => {
            const dlcNameElement = dlc.querySelector('td:nth-child(2)');
            if (dlcNameElement) {
                const dlcName = dlcNameElement.textContent.trim();
                dlcList += `\n[*]${dlcName}`;
                console.log("DLC found:", dlcName);
            } else {
                console.log("No second <td> element found within DLC element:", dlc);
            }
        });
        const tempTextArea = document.createElement("textarea");
        tempTextArea.value = dlcList;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();

        try {
            document.execCommand("copy");
        } catch (err) {
            console.error("Failed to copy text: ", err);
            alert("Failed to copy DLC list. Please try again.");
        } finally {
            document.body.removeChild(tempTextArea);
        }
    }

    const copyButton = document.createElement("a");
    copyButton.href = "#";
    copyButton.role = "button";
    copyButton.className = "tooltipped tooltipped-n";
    copyButton.setAttribute("aria-label", "Copy DLC List");
    copyButton.style.color = "#ffffff";
    copyButton.style.backgroundColor = "#0078d7";
    copyButton.style.borderRadius = "4px";
    copyButton.style.padding = "6px 10px";
    copyButton.style.marginLeft = "10px";
    copyButton.style.display = "inline-flex";
    copyButton.style.alignItems = "center";
    copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-copy" aria-hidden="true"><path d="M6 1.5A1.5 1.5 0 0 1 7.5 0h6A1.5 1.5 0 0 1 15 1.5v9a1.5 1.5 0 0 1-1.5 1.5H12v1.5a1.5 1.5 0 0 1-1.5 1.5h-6A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3H6V1.5ZM4.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5V4.5a.5.5 0 0 0-.5-.5h-6Zm7-1a.5.5 0 0 1 .5.5V10h1V1.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0-.5.5V3h5Z"></path></svg> <span>Copy DLC List</span>';

    copyButton.addEventListener("click", function(event) {
        event.preventDefault();
        copyDLCList();
    });

    const target = document.querySelector(".pagehead-actions") || document.querySelector(".header-buttons");
    if (target) {
        target.appendChild(copyButton);
    }
})();
