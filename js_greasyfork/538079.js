// ==UserScript==
// @name         Anna's Archive IPFS Link Checker
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Checks IPFS links, styles them, opens in new tab, shows progress (text only) and accessible count.
// @author       Bui Quoc Dung
// @match        https://annas-archive.*/ipfs_downloads*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @icon         https://annas-archive.org/favicon.ico
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538079/Anna%27s%20Archive%20IPFS%20Link%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/538079/Anna%27s%20Archive%20IPFS%20Link%20Checker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        ul.mb-4 > li {
            transition: opacity 0.3s ease-in-out, font-weight 0.3s ease-in-out;
            color: black;
            font-weight: normal;
        }
        ul.mb-4 > li a {
            color: black !important;
            text-decoration: none !important;
            font-weight: inherit;
        }
        ul.mb-4 > li span {
            color: black;
        }
        #ipfs-checker-progress-text {
            text-align: center;
            font-size: 0.95em;
            color: black;
            font-weight: bold;
            margin: 10px 0;
        }
    `);

    const ipfsLists = document.querySelectorAll('ul.mb-4');
    if (ipfsLists.length === 0) {
        console.log("Anna's Archive IPFS Link Checker: No IPFS lists found.");
        return;
    }

    // Create progress text element only (no progress bar)
    const progressTextElement = document.createElement('div');
    progressTextElement.id = 'ipfs-checker-progress-text';
    progressTextElement.textContent = 'Initializing...';

    const mainContent = document.querySelector('main') || document.body;
    if (ipfsLists[0].parentNode) {
        ipfsLists[0].parentNode.insertBefore(progressTextElement, ipfsLists[0]);
    } else {
        mainContent.insertBefore(progressTextElement, mainContent.firstChild);
    }

    let linksToProcess = [];
    ipfsLists.forEach(list => {
        const listItems = list.querySelectorAll('li');
        listItems.forEach(li => {
            const linkElement = li.querySelector('a[href^="http"]');
            if (linkElement) {
                linksToProcess.push({
                    liElement: li,
                    linkElement: linkElement,
                    url: linkElement.href
                });
            }
        });
    });

    const totalLinks = linksToProcess.length;
    let checkedLinks = 0;
    let accessibleLinks = 0;

    if (totalLinks === 0) {
        progressTextElement.textContent = "No links found to check.";
        return;
    }

    function updateProgressText() {
        checkedLinks++;
        if (checkedLinks < totalLinks) {
            progressTextElement.textContent = `Checking ${checkedLinks} of ${totalLinks} links...`;
        } else {
            let finalMessage = `All ${totalLinks} links checked!`;
            if (accessibleLinks > 0) {
                finalMessage += ` ${accessibleLinks} accessible.`;
            } else {
                finalMessage += ` None accessible.`;
            }
            progressTextElement.textContent = finalMessage;
        }
    }

    progressTextElement.textContent = `Checking 0 of ${totalLinks} links...`;

    linksToProcess.forEach(item => {
        const { liElement, linkElement, url } = item;

        linkElement.target = '_blank';
        liElement.style.opacity = '0.6';

        GM_xmlhttpRequest({
            method: 'HEAD',
            url: url,
            timeout: 15000,
            onload: function (response) {
                if (response.status >= 200 && response.status < 400) {
                    liElement.style.fontWeight = 'bold';
                    liElement.style.opacity = '0.9';

                    linkElement.style.color = 'black';
                    linkElement.style.textDecoration = 'none';
                    linkElement.style.fontWeight = 'inherit';

                    accessibleLinks++;
                } else {
                    liElement.style.fontWeight = 'normal';
                }
                updateProgressText();
            },
            onerror: function () {
                liElement.style.fontWeight = 'normal';
                updateProgressText();
            },
            ontimeout: function () {
                liElement.style.fontWeight = 'normal';
                updateProgressText();
            }
        });
    });
})();
