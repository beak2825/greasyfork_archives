// ==UserScript==
// @name         Dexscreener MEV 地址标注
// @namespace    https://www.tampermonkey.net/
// @version      0.2.0
// @description  Dexscreener MEV 地址标注 & GMGN 链接替换
// @author       https://x.com/0xshimmer
// @match        https://dexscreener.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dexscreener.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518285/Dexscreener%20MEV%20%E5%9C%B0%E5%9D%80%E6%A0%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/518285/Dexscreener%20MEV%20%E5%9C%B0%E5%9D%80%E6%A0%87%E6%B3%A8.meta.js
// ==/UserScript==



(function() {
    'use strict';

    function addIconsToRow(row) {
        const addressCell = row.firstChild.children[6];
        const addressLink = addressCell.querySelector('a');
        if (!addressLink || addressCell.querySelector('.custom-icon')) return;

        const address = addressLink.href.split('/account/')[1];

        // const gmgnLink = document.createElement('a');
        // gmgnLink.href = `https://gmgn.ai/sol/address/${address}`;
        // gmgnLink.target = '_blank';
        // gmgnLink.innerHTML = '🔍';
        // gmgnLink.className = 'custom-icon';
        // gmgnLink.style.marginRight = '5px';
        // gmgnLink.style.textDecoration = 'none';

        addressLink.href = `https://gmgn.ai/sol/address/${address}`;

        const copyButton = document.createElement('span');
        copyButton.innerHTML = '📋';
        copyButton.className = 'custom-icon';
        copyButton.style.cursor = 'pointer';
        copyButton.style.marginRight = '5px';
        copyButton.onclick = () => {
            navigator.clipboard.writeText(address);
            copyButton.innerHTML = '✅';
            setTimeout(() => {
                copyButton.innerHTML = '📋';
            }, 1000);
        };

        // addressCell.insertBefore(gmgnLink, addressCell.firstChild);
        addressCell.insertBefore(copyButton, addressCell.firstChild);
    }

    function highlightAdjacentDuplicateRows() {

        const rows = document.querySelectorAll('tr[data-index]');
        if (!rows.length) return;

        for (let i = 0; i < rows.length - 1; i++) {
            const currentRow = rows[i];
            const nextRow = rows[i + 1];

            addIconsToRow(currentRow);
            addIconsToRow(nextRow);

            const type1 = currentRow.firstChild.children[1].textContent;
            const type2 = nextRow.firstChild.children[1].textContent;

            const address1 = currentRow.firstChild.children[6].textContent.slice(0, 6);
            const address2 = nextRow.firstChild.children[6].textContent.slice(0, 6);

            const time1 = currentRow.firstChild.children[0].textContent;
            const time2 = nextRow.firstChild.children[0].textContent;

            if (time1 === time2 && address1 === address2 && type1 != type2) {
                currentRow.style.backgroundColor = 'grey';
                nextRow.style.backgroundColor = 'grey';
                // currentRow.hidden = true;
                // nextRow.hidden = true;
                i++;
            }
        }
    }


    function setupTableObserver() {

        const firstRow = document.querySelector('tr[data-index]');
        if (!firstRow) {
            setTimeout(setupTableObserver, 1000);
            return;
        }

        let timeout;
        const observer = new MutationObserver((mutations) => {
            if (mutations.some(mutation =>
                mutation.addedNodes.length &&
                Array.from(mutation.addedNodes).some(node =>
                    node.classList && node.classList.contains('custom-icon')
                ))) {
                return;
            }

            clearTimeout(timeout);
            timeout = setTimeout(() => {
                console.log('Rows updated');
                highlightAdjacentDuplicateRows();
            }, 200);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        highlightAdjacentDuplicateRows();
    }


    const documentObserver = new MutationObserver(() => {
        const table = document.querySelector('table');
        if (table && !table._hasObserver) {
            console.log('Table found, initializing...');
            table._hasObserver = true;
            setupTableObserver();
        }
    });


    documentObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
