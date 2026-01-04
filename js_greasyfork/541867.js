// ==UserScript==
// @name         GGn Filter LN Only
// @namespace    ggn
// @version      1.0
// @author       stormlight
// @description  Adds persistent LN Only checkbox to filter GGn search results with External Link only and hides groups with no LN
// @match        https://gazellegames.net/torrents.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541867/GGn%20Filter%20LN%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/541867/GGn%20Filter%20LN%20Only.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'ggn_ln_only_enabled';

    function addLNOnlyCheckbox() {
        const targetRow = document.querySelector('input[name="filter_cat[1]"]')?.closest('tr');
        if (!targetRow || document.getElementById('ln_only_filter')) return;

        const td = document.createElement('td');
        td.style.whiteSpace = 'nowrap';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'ln_only_filter';
        checkbox.checked = localStorage.getItem(STORAGE_KEY) === 'true';

        const label = document.createElement('label');
        label.setAttribute('for', 'ln_only_filter');
        label.textContent = ' LN Only';

        td.appendChild(checkbox);
        td.appendChild(label);
        targetRow.appendChild(td);

        checkbox.addEventListener('change', () => {
            localStorage.setItem(STORAGE_KEY, checkbox.checked);
            applyFilter();
        });
    }

    function applyFilter() {
        const lnOnly = localStorage.getItem(STORAGE_KEY) === 'true';
        const groupRows = document.querySelectorAll('tr.group');

        groupRows.forEach(groupRow => {
            const groupIdMatch = groupRow.className.match(/group_(\d+)/);
            if (!groupIdMatch) return;

            const groupId = groupIdMatch[1];
            const torrentRows = document.querySelectorAll(`tr.group_torrent.groupid_${groupId}`);
            let anyVisible = false;

            torrentRows.forEach(torrentRow => {
                const hasExternalLink = torrentRow.querySelector('a[title="External Link"][target="_blank"]');
                const show = !lnOnly || hasExternalLink;
                torrentRow.style.display = show ? '' : 'none';
                if (show) anyVisible = true;
            });

            groupRow.style.display = anyVisible ? '' : 'none';
        });
    }

    function setupObserver() {
        const table = document.getElementById('torrent_table');
        if (!table) return;

        const observer = new MutationObserver(applyFilter);
        observer.observe(table, { childList: true, subtree: true });
    }

    function init() {
        addLNOnlyCheckbox();
        applyFilter();
        setupObserver();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
