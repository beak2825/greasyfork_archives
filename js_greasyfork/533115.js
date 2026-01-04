// ==UserScript==
// @name         VS Code Extension Downloader
// @namespace    https://github.com/yookibooki/userscripts
// @version      1.0
// @description  Downloads .vsix package on VS Code Marketplace
// @match        https://marketplace.visualstudio.com/items*
// @downloadURL https://update.greasyfork.org/scripts/533115/VS%20Code%20Extension%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/533115/VS%20Code%20Extension%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = new URL(window.location.href);
    const itemName = url.searchParams.get("itemName");
    if (!itemName) return;

    const [publisher, extensionName] = itemName.split(".");
    if (!publisher || !extensionName) return;

    const observer = new MutationObserver(() => {
        const versionCell = document.querySelector("table.ux-table-metadata td[aria-labelledby='Version'], table.ux-table-metadata td[aria-labelledby='version']");

        if (versionCell && !versionCell.querySelector('.vsix-download-link')) {
            const version = versionCell.textContent.trim();

            const link = document.createElement("a");
            link.href = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extensionName}/${version}/vspackage/`;
            link.textContent = version;
            link.className = "vsix-download-link";
            link.title = "Download .vsix package";

            versionCell.textContent = '';
            versionCell.appendChild(link);
        }
    });

    observer.observe(document, { childList: true, subtree: true });
})();