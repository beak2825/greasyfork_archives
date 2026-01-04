// ==UserScript==
// @name        HBO Max Export watchlist
// @namespace   DWizzy:HBOmax-export
// @version     0.3.02
// @description Exports all films and series from HBO Max profile page.
//              Please select sorting from A-Z and scroll to the bottom of the page
//              to ensure proper loading.
//              Limitations:
//              - Only tested on the Dutch-language version of hbomax.com (but avoided using Dutch selectors).
//              - The 'continue watching'-list is not exported because not shown. This includes remaining playtime.
//              - The marker for what is already watched is not exported.
//              - For some series, the upcoming episode is shown.
//              - A distinction between series and movies is not made.
// @author      DWizzy
// @license     https://www.gnu.org/licenses/gpl-3.0.en.html
// @match       https://play.hbomax.com/profile
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/472776/HBO%20Max%20Export%20watchlist.user.js
// @updateURL https://update.greasyfork.org/scripts/472776/HBO%20Max%20Export%20watchlist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;

    function waitForElement(selector, callback) {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            }
        }, 100);
    }

    function createExportButton() {
        const exportButton = document.createElement("button");
        exportButton.innerHTML = "Export";
        exportButton.style.position = "fixed";
        exportButton.style.top = "10px";
        exportButton.style.right = "10px";
        exportButton.style.zIndex = "9999";
        exportButton.addEventListener("click", exportLinks);
        document.body.appendChild(exportButton);
    }

    function exportLinks() {
        const links = document.querySelectorAll("a[href*=':type:'][role='link']");
        const data = [["Href", "Title", "Alternate Title"]];

        links.forEach(link => {
            const href = link.getAttribute("href");
            const domain = window.location.origin; // Get the domain name
            const fullHref = domain + href;

            const title = getLinkTitle(link, "[data-testid='title-main']");
            const titleAlt = getLinkTitle(link, "[data-testid='title-alt']");

            data.push([fullHref, '"' + title + '"', '"' + titleAlt + '"']); // Enclose in quotes
        });

        downloadCSV(data);
    }

    function getLinkTitle(link, selector) {
        const titleElement = link.querySelector(selector);
        return titleElement ? titleElement.textContent.trim() : "";
    }

    function downloadCSV(data) {
        const csvContent = data.map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "hbo-max-watchlist.csv";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    if (currentUrl === "https://play.hbomax.com/profile") {
        console.log("Script is running on the HBO Max profile page.");
        waitForElement("[data-testid='MyStuffEditButtonTextOnly']", createExportButton);
    } else {
        console.log("Script is not running on the HBO Max profile page.");
    }
})();
