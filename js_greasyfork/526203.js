// ==UserScript==
// @name         Copy table
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to copy tables to the clipboard in HTML format for pasting into Word with full borders.
// @author       Bui Quoc Dung
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/526203/Copy%20table.user.js
// @updateURL https://update.greasyfork.org/scripts/526203/Copy%20table.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add some CSS for the copy button
    GM_addStyle(`
        .copy-table-btn {
            margin-top: 5px;
            padding: 5px 10px;
            font-size: 13px;
            background: #333333;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
    `);

    // Function to add the "Copy to Word" button below a table element
    function addCopyButtonToTable(table) {
        // Avoid adding duplicate buttons
        if (table.nextElementSibling && table.nextElementSibling.classList.contains('copy-table-btn')) {
            return;
        }

        // Ensure all table cells have borders
        table.style.borderCollapse = 'collapse';
        table.querySelectorAll('th, td').forEach(cell => {
            cell.style.border = '1px solid black';
            cell.style.padding = '4px';
        });

        // Create the button element
        const btn = document.createElement('button');
        btn.textContent = 'Copy';
        btn.className = 'copy-table-btn';
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            copyTableToClipboard(table);
        });

        // Insert button after the table
        table.parentElement.insertBefore(btn, table.nextSibling);
    }

    // Function that copies the table's HTML to the clipboard
    function copyTableToClipboard(table) {
        const html = table.outerHTML;
        // Try using the Clipboard API with HTML support
        if (navigator.clipboard && navigator.clipboard.write) {
            const type = "text/html";
            const blob = new Blob([html], { type: type });
            const data = [new ClipboardItem({ [type]: blob })];
            navigator.clipboard.write(data).catch(err => {
                console.error('Error copying table: ', err);
                fallbackCopy(html);
            });
        } else {
            fallbackCopy(html);
        }
    }

    // Fallback copy function using a temporary element and execCommand
    function fallbackCopy(html) {
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.innerHTML = html;
        document.body.appendChild(tempDiv);
        const range = document.createRange();
        range.selectNodeContents(tempDiv);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback: Unable to copy', err);
        }
        sel.removeAllRanges();
        document.body.removeChild(tempDiv);
    }

    // Observe the document for new tables (for dynamically loaded content)
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // ELEMENT_NODE
                    if (node.tagName === 'TABLE') {
                        addCopyButtonToTable(node);
                    } else {
                        const tables = node.querySelectorAll('table');
                        tables.forEach(addCopyButtonToTable);
                    }
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Initially add buttons to any tables already on the page
    document.querySelectorAll('table').forEach(addCopyButtonToTable);
})();
