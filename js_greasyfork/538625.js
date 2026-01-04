// ==UserScript==
// @name         Torn RankID Incrementer
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Increment rankID in Torn rank report URL with a button
// @match        https://www.torn.com/war.php?step=rankreport&rankID=*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538625/Torn%20RankID%20Incrementer.user.js
// @updateURL https://update.greasyfork.org/scripts/538625/Torn%20RankID%20Incrementer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get current rankID from URL
    const url = new URL(window.location.href);
    const rankID = parseInt(url.searchParams.get("rankID"), 10);

    // Create the button
    const btn = document.createElement("button");
    btn.textContent = "Next Report";
    btn.style.position = "fixed";
    btn.style.top = "10px";
    btn.style.right = "10px";
    btn.style.zIndex = "9999";
    btn.style.padding = "8px 12px";
    btn.style.background = "#444";
    btn.style.color = "#fff";
    btn.style.border = "none";
    btn.style.borderRadius = "5px";
    btn.style.cursor = "pointer";

    const idBox = document.createElement('input');
    idBox.type = 'number';
    idBox.id = 'myNumberInput'; // Optional: ID for styling or referencing later
    idBox.value = rankID;

    idBox.style.position = "fixed";
    idBox.style.top = "50px";
    idBox.style.right = "10px";
    idBox.style.width = "70px";
    idBox.style.zIndex = "9999";
    idBox.style.padding = "8px 12px";
    idBox.style.background = "#444";
    idBox.style.color = "#fff";
    idBox.style.border = "none";
    idBox.style.borderRadius = "5px";
    idBox.style.cursor = "pointer";

    const goToBtn = document.createElement("button");
    goToBtn.textContent = "Go";
    goToBtn.style.position = "fixed";
    goToBtn.style.top = "50px";
    goToBtn.style.right = "110px";
    goToBtn.style.zIndex = "9999";
    goToBtn.style.padding = "8px 12px";
    goToBtn.style.background = "#ddd";
    goToBtn.style.color = "#444";
    goToBtn.style.border = "none";
    goToBtn.style.borderRadius = "5px";
    goToBtn.style.cursor = "pointer";

    // Add click behavior
    btn.onclick = () => {
        const nextID = rankID + 1;
        url.searchParams.set("rankID", nextID.toString());
        window.location.href = url.toString();
    };

    goToBtn.onclick = () => {
        const nextID = parseInt(idBox.value, 10);
        url.searchParams.set("rankID", nextID.toString());
        window.location.href = url.toString();
    };

    idBox.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') { // Check if Enter key was pressed
            const nextID = parseInt(idBox.value, 10);
            url.searchParams.set("rankID", nextID.toString());
            window.location.href = url.toString();
        }
    });

    // Add to the page
    document.body.appendChild(btn);
    document.body.appendChild(idBox);
    document.body.appendChild(goToBtn);
})();
