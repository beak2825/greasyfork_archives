// ==UserScript==
// @name         GGn Group Expansion
// @version      1.4
// @author       SleepingGiant
// @description  Adds quick buttons for expanding all groups and filelist on GGn pages.
// @namespace    https://greasyfork.org/users/1395131
// @match        https://gazellegames.net/torrents.php?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534242/GGn%20Group%20Expansion.user.js
// @updateURL https://update.greasyfork.org/scripts/534242/GGn%20Group%20Expansion.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function qsAll(scope, sel) { return (scope || document).querySelectorAll(sel); }

    function getEditionBody(edition) {
        const m = edition.getAttribute('onclick')?.match(/edition_(\d+)/);
        return m ? document.getElementById(`edition_${m[1]}`) : null;
    }

    function isEditionOpen(edition) {
        const tbody = getEditionBody(edition);
        return !!(tbody && tbody.style.display !== 'none');
    }

    function setEditionOpen(edition, wantOpen) {
        const openNow = isEditionOpen(edition);
        if (wantOpen !== openNow) edition.click(); // native toggler
    }

    function forEachTorrentId(scope, fn) {
        qsAll(scope, 'a[onclick], a[href*="torrentid="]').forEach(a => {
            let id = null;
            const oc = a.getAttribute('onclick') || '';
            const hf = a.getAttribute('href') || '';
            const m1 = oc.match(/torrent_(\d+)/);
            if (m1) id = m1[1];
            if (!id) {
                const m2 = hf.match(/torrentid=(\d+)/);
                if (m2) id = m2[1];
            }
            if (id) fn(id);
        });
    }

    function toggleFiles(scope, expand) {
        const anchors = (scope || document).querySelectorAll('a[onclick*="show_files("]');
        anchors.forEach(a => {
            const id = a.getAttribute('onclick')?.match(/\d+/)?.[0];
            if (!id) return;
            const filesDiv = document.getElementById(`files_${id}`);
            if (!filesDiv) return;

            const isShown = window.jQuery ? window.jQuery(`#files_${id}`).is(':visible') : filesDiv.style.display !== 'none' && !filesDiv.classList.contains('hidden');
            const wantShown = (expand === undefined) ? !isShown : !!expand;

            if (wantShown !== isShown) {
                window.show_files(id);
            }
        });
    }

    function toggleTorrentRows(scope, expand) {
        forEachTorrentId(scope, (id) => {
            const sel = `#torrent_${id}`;
            const rowEl = document.getElementById(`torrent_${id}`);
            if (!rowEl) return;

            const isShown = $ ? $(sel).is(':visible') : rowEl.style.display !== 'none' && !rowEl.classList.contains('hidden');
            const wantShown = (expand === undefined) ? !isShown : !!expand;

            if (wantShown !== isShown) {
                window.jQuery(sel).toggle();
            }
        });
    }

    function expandAll() {
        qsAll(document, '.edition_info').forEach(edition => {
            setEditionOpen(edition, true);
            const tbody = getEditionBody(edition);
            if (tbody) {
                toggleTorrentRows(tbody, true);
                toggleFiles(tbody, true);
            }
        });
    }

    function collapseAll() {
        qsAll(document, '.edition_info').forEach(edition => {
            const tbody = getEditionBody(edition);
            if (tbody) {
                toggleFiles(tbody, false);
                toggleTorrentRows(tbody, false);
            }
        });
        qsAll(document, '.edition_info').forEach(edition => setEditionOpen(edition, false));
    }

    function expandEdition(edition) {
        setEditionOpen(edition, true);
        const tbody = getEditionBody(edition);
        if (tbody) {
            toggleTorrentRows(tbody, true);
            toggleFiles(tbody, true);
        }
    }

    function collapseEdition(edition) {
        const tbody = getEditionBody(edition);
        if (tbody) {
            toggleFiles(tbody, false);
            toggleTorrentRows(tbody, false);
        }
        setEditionOpen(edition, false);
    }

    function insertExpandAllButtons() {
        const torrentHeaderTd = Array.from(document.querySelectorAll('td')).find(td =>
            td.textContent.trim() === 'Torrents' &&
            td.querySelector('strong')?.textContent.trim() === 'Torrents'
        );
        if (!torrentHeaderTd) return;

        if (!document.getElementById('expand-all-button')) {
            const expandButton = document.createElement('button');
            expandButton.textContent = 'Expand All';
            expandButton.type = 'button';
            expandButton.style.marginLeft = '10px';
            expandButton.style.fontSize = '0.9em';
            expandButton.id = 'expand-all-button';
            expandButton.addEventListener('click', (e) => { e.stopPropagation(); expandAll(); });
            torrentHeaderTd.appendChild(expandButton);
        }

        if (!document.getElementById('collapse-all-button')) {
            const collapseButton = document.createElement('button');
            collapseButton.textContent = 'Collapse All';
            collapseButton.type = 'button';
            collapseButton.style.marginLeft = '6px';
            collapseButton.style.fontSize = '0.9em';
            collapseButton.id = 'collapse-all-button';
            collapseButton.addEventListener('click', (e) => { e.stopPropagation(); collapseAll(); });
            torrentHeaderTd.appendChild(collapseButton);
        }
    }

    function insertInlineEditionButtons() {
        qsAll(document, '.edition_info').forEach(edition => {
            if (edition.querySelector('.expand-edition-button') || edition.querySelector('.collapse-edition-button')) return;

            const expandBtn = document.createElement('button');
            expandBtn.textContent = 'Expand Edition';
            expandBtn.type = 'button';
            expandBtn.classList.add('expand-edition-button');
            expandBtn.style.marginLeft = '10px';
            expandBtn.addEventListener('click', (e) => { e.stopPropagation(); expandEdition(edition); });
            edition.appendChild(expandBtn);

            const collapseBtn = document.createElement('button');
            collapseBtn.textContent = 'Collapse Edition';
            collapseBtn.type = 'button';
            collapseBtn.classList.add('collapse-edition-button');
            collapseBtn.style.marginLeft = '6px';
            collapseBtn.addEventListener('click', (e) => { e.stopPropagation(); collapseEdition(edition); });
            edition.appendChild(collapseBtn);
        });
    }

    const loader = setInterval(() => {
        insertExpandAllButtons();
        insertInlineEditionButtons();
        if (document.getElementById('expand-all-button') &&
            document.getElementById('collapse-all-button')) {
            clearInterval(loader);
        }
    }, 200);
})();
