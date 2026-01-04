// ==UserScript==
// @name         Highlight Updates in History
// @namespace    http://tampermonkey.net/
// @version      2024-03-26
// @description  Highlights Updates in history tab of Nexus Mods
// @author       TragicNet
// @match        https://www.nexusmods.com/users/myaccount?tab=download+history
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nexusmods.com
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/491042/Highlight%20Updates%20in%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/491042/Highlight%20Updates%20in%20History.meta.js
// ==/UserScript==

function updateDateColors(newColor, oldColor) {
    let tableRows = document.querySelectorAll('tbody > tr');
    tableRows.forEach((row) => {
        let dlDate = new Date(row.querySelector('td:nth-child(2)').innerHTML);
        let updateDate = new Date(row.querySelector('td:nth-child(5)').innerHTML);
        if(dlDate > updateDate) {
            row.querySelector('td:nth-child(2)').style.color = newColor;

        } else {
            row.querySelector('td:nth-child(2)').style.color = oldColor;
        }
    })
}


window.addEventListener('load', (event) => {
    // Select the node that will be observed for mutations
    const targetNode = document.getElementById("tab-my-download-history");

    // Options for the observer (which mutations to observe)
    const config = { childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
        updateDateColors('cyan', 'red');
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
});
