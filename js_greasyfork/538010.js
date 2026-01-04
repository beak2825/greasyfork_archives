// ==UserScript==
// @name         inactivesearch - openAll in new tab
// @namespace    http://tampermonkey.net/
// @version      2025-06-01
// @description  Add a button which open all result in the page on the new tab
// @author       @bence04
// @match        https://www.inactivesearch.it/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=inactivesearch.it
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/538010/inactivesearch%20-%20openAll%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/538010/inactivesearch%20-%20openAll%20in%20new%20tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getPositionLinks() {
        const links = [];
        document.querySelectorAll('table.table-inactives a[href*="position_details.php"]').forEach(a => {
            links.push(a.href);
        });
        return links;
    }

    function showConfirmationDialog(linkCount, callback) {
        if (localStorage.getItem("travianSkipConfirm") === "true") {
            callback(true);
            return;
        }

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';

        const message = `Are you sure you want to open all (${linkCount}) position details in new tabs?\n\n` +
            `Notice: Some browsers may block multiple tabs from opening automatically. You might need to allow pop-ups in the top corner after clicking "Always Allow".`;



        const dialog = document.createElement('div');
        dialog.style.background = '#fff';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '8px';
        dialog.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
        dialog.innerHTML = `
            <p style="white-space: pre-line;">${message}</p>
            <label><input type="checkbox" id="dontAskAgain"> Don't ask again</label><br><br>
            <button id="confirmYes" type="button">Yes, open all</button>
            <button id="confirmNo" type="button">Cancel</button>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        document.getElementById("confirmYes").onclick = () => {
            if (document.getElementById("skipConfirmCheckbox").checked) {
                localStorage.setItem("travianSkipConfirm", "true");
            }
            document.body.removeChild(overlay);
            callback(true);
        };

        document.getElementById("confirmNo").onclick = () => {
            document.body.removeChild(overlay);
            callback(false);
        };
    }

    function openAllLinks() {
        const links = getPositionLinks();
        if (links.length === 0) return;

        showConfirmationDialog(links.length, (confirmed) => {
            if (!confirmed) return;
            console.log(links);
            links.forEach(link => {
                console.log(link);
                window.open(link, '_blank');
            });
        });
    }

    function addOpenAllButton() {
        const container = document.querySelector('.nav.nav-pills.multiple-action.panel');
        if (!container) return;

        const li = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Open All Villages';
        button.style.cursor = 'pointer';
        button.className = 'btn btn-primary';
        button.onclick = openAllLinks;

        li.appendChild(button);
        container.appendChild(li);
    }

    window.addEventListener('load', addOpenAllButton);

})();