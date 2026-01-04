// ==UserScript==
// @name         Convert TransIP DNS to dnscontrol JSON
// @namespace    http://peschar.net/
// @version      1.0
// @description  Provide a panel with JSON for dnscontrol on the TransIP DNS mangement page.
// @author       Albert Peschar
// @match        https://www.transip.nl/cp/domein-hosting/*
// @match        https://www.transip.eu/cp/domain-hosting/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423778/Convert%20TransIP%20DNS%20to%20dnscontrol%20JSON.user.js
// @updateURL https://update.greasyfork.org/scripts/423778/Convert%20TransIP%20DNS%20to%20dnscontrol%20JSON.meta.js
// ==/UserScript==

'use strict';

const RECORD_LIST_SELECTOR = '#dnsEntries';

let reentrant = false;
let existingPanel;

(new MutationObserver(function (mutations) {
    if (reentrant) {
        return;
    }
    mutations.forEach(mutation => {
        const recordList =
              mutation.target.querySelector(RECORD_LIST_SELECTOR) ||
              mutation.target.closest(RECORD_LIST_SELECTOR);
        if (recordList) {
            reentrant = true;
            try {
                updateExport(recordList);
            } finally {
                Promise.resolve().then(() => {reentrant = false});
            }
        }
    });
})).observe(document.documentElement, {
    subtree: true,
    childList: true
});

function updateExport(recordList) {
    const result = [];
    recordList.querySelectorAll(':scope > .dns-form-panels > .form-panel').forEach(record => {
        const name = record.querySelector('input.name').value;
        if (name == '') {
            return;
        }
        const type = record.querySelector('select.type').value;
        const content = record.querySelector('input.content').value;
        let match, args;
        if (type == 'MX' && (match = /^(\d+)\s+(.+)$/.exec(content))) {
            args = [name, parseInt(match[1]), match[2]];
        } else {
            args = [name, content];
        }
        result.push(`    ${type}(${args.map(JSON.stringify).join(', ')}),\n`);
    });

    const panel = document.createElement('div');
    panel.className = 'overview-panel ocp-text';

    const pre = document.createElement('pre');
    pre.innerText = `[\n${result.join('')}]`;
    panel.appendChild(pre);

    if (existingPanel) {
        existingPanel.remove();
    }

    const afterPanel = recordList.closest('.overview-panel');
    afterPanel.parentNode.insertBefore(panel, afterPanel.nextSibling);

    existingPanel = panel;
}