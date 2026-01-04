// ==UserScript==
// @name         Copy table as Markdown
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Copy table as Markdown to clipboard
// @match      *://*/*
// @grant none
// @author       replica
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483312/Copy%20table%20as%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/483312/Copy%20table%20as%20Markdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let NL = "\n";

    init();
    // Find the table element
    function init() {
        const tables = document.querySelectorAll('table');
        console.log(tables.length);
        if (tables) {
            for(let table of tables) {
                // Create a new button element
                const button = document.createElement('button');
                button.textContent = 'Copy';

                // Set the button's style and position
                button.style.position = 'relative';
                button.style.top = '0';
                button.style.right = '0';
                button.style.zIndex = '9999';

                // Add a click event listener to the button
                button.addEventListener('click', () => {
                    const markdown = convertTable(table);
                    navigator.clipboard.writeText(markdown).then(function() {
                        notification("Copied");
                        console.log('Copying to clipboard was successful!');
                    }, function(err) {
                        console.error('Could not copy text: ', err);
                    });
                });
                table.insertBefore(button, table.firstChild);
            }
        }
    }

    function notification(text) {
        let notification = document.createElement('div');
        notification.textContent = text;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px';
        notification.style.backgroundColor = '#323232';
        notification.style.color = '#fff';
        notification.style.borderRadius = "4px";
        notification.style.opacity = 0;
        notification.style.zIndex = '9999';
        notification.style.transition = 'opacity 0.5s ease-in-out';
        document.body.appendChild(notification);

        notification.style.opacity = '1';

        // 设置3秒后自动消失
        setTimeout(function() {
            notification.style.opacity = '0';
        }, 1000);
    }


    function convertTable(table) {
        let markdownResults = '';
        let markdownTable = convertTableElementToMarkdown(table);
        markdownResults += markdownTable + NL + NL;
        return markdownResults;
    }

    // https://github.com/johnbeech/html-table-to-markdown-converter/blob/master/table-converter.js
    function convertTableElementToMarkdown(tableEl) {
        let rows = [];
        let trEls = tableEl.getElementsByTagName('tr');
        for(let i=0; i<trEls.length; i++) {
            let tableRow = trEls[i];
            let markdownRow = convertTableRowElementToMarkdown(tableRow, i);
            rows.push(markdownRow);
        }
        return rows.join(NL);
    }

    function convertTableRowElementToMarkdown(tableRowEl, rowNumber) {
        let cells = [];
        let cellEls = tableRowEl.children;
        for(let i=0; i<cellEls.length; i++) {
            let cell = cellEls[i];
            cells.push(cell.innerText + ' |');
        }
        let row = '| ' + cells.join(" ");

        if(rowNumber == 0) {
            row = row + NL + createMarkdownDividerRow(cellEls.length);
        }

        return row;
    }

    function createMarkdownDividerRow(cellCount) {
        let dividerCells = [];
        for(let i = 0; i<cellCount; i++) {
            dividerCells.push('---' + ' |');
        }
        return '| ' + dividerCells.join(" ");
    }
})();