// ==UserScript==
// @name         LADS Copy Release Tickets
// @version      0.4
// @description  Copy release ticket information to the clipboard
// @author       Busung Kim
// @match        https://bts.linecorp.com/projects/LADS/versions/*
// @match        https://jira.workers-hub.com/projects/*/versions/*
// @grant        GM_setClipboard
// @license      MIT
// @namespace https://greasyfork.org/users/1192532
// @downloadURL https://update.greasyfork.org/scripts/477089/LADS%20Copy%20Release%20Tickets.user.js
// @updateURL https://update.greasyfork.org/scripts/477089/LADS%20Copy%20Release%20Tickets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Style
    const styleElem = document.createElement('style');
    styleElem.textContent = `
        .right-aligned {
            text-align: right;
        }
        .right-aligned > * {
            display: inline-block;
        }
    `;
    document.head.append(styleElem);

    const appendTextTemporarily = (elem, targetText) => {
        const originalText = elem.innerHTML;

        elem.innerHTML = `${originalText} ${targetText}`;
        setTimeout(() => {
            elem.innerHTML = originalText;
        }, 3_000);
    };

    function escapeSquareBrackets(str) {
        const regex = /[\[\]]/g;
        return str.replace(regex, function(match) {
            if (match === "[") {
                return "\\[";
            } else if (match === "]") {
                return "\\]";
            }
        });
    }

    const copyButtonElem = document.createElement('button');
    copyButtonElem.id = 'btn-copy-clipboard';
    copyButtonElem.classList.add('aui-button', 'aui-button-secondary');
    copyButtonElem.innerHTML = 'Copy to clipboard';
    copyButtonElem.onclick = () => {
        try {
            const content = Array.from(document.querySelectorAll('tbody.release-report-issues > tr').values())
                .map(r => {
                    const key = r.childNodes[2].textContent;
                    const summary = r.childNodes[3].textContent;
                    const link = `${window.location.origin}/browse/${key}`;

                    return `# [${key} ${escapeSquareBrackets(summary)}|${link}]`;
                })
                .join('\n');
            GM_setClipboard(content, 'text');
            appendTextTemporarily(copyButtonElem, '✔');
        } catch (e) {
            appendTextTemporarily(copyButtonElem, '✘');
            console.log('failed to copy content to the clipboard: ', e);
            return;
        }
    };

    const rowElem = document.createElement('div');
    rowElem.classList.add('row', 'right-aligned');
    rowElem.appendChild(copyButtonElem);

    const divElem = document.createElement('div');
    divElem.classList.add('tm-generated');
    divElem.appendChild(rowElem);

    const releaseReportElem = document.getElementById('release-report-tabs-section');
    releaseReportElem.appendChild(divElem);
})();
