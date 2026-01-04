// ==UserScript==
// @name          Torrenting.com - Show torrent poster
// @namespace     blackspirits.github.io
// @version       1.0
// @description   Show the torrent posters
// @author        BlackSpirits
// @license       MIT
// @match         https://torrenting.com/featured.php*
// @match         https://torrenting.com/browse.php*
// @match         https://torrenting.com/t*
// @grant         GM_xmlhttpRequest
// @connect       torrenting.com
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/540357/Torrentingcom%20-%20Show%20torrent%20poster.user.js
// @updateURL https://update.greasyfork.org/scripts/540357/Torrentingcom%20-%20Show%20torrent%20poster.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
      img.capa-torrent {
        width: 80px !important;
        object-fit: cover !important;
        border: 1px solid #ccc !important;
        margin-top: 2px !important;
        margin-bottom: 2px !important;
      }
      tr.torrentsTableTr td,
      tr.torrentsTableTr th {
        vertical-align: middle !important;
      }
      .t1 td {
        padding: 5px !important;
        margin-right: 80px !important;
      }
    `;
    document.head.appendChild(style);

    const cacheIDs = new Set();

    function extractIdFromUrl(url) {
        const match = url.match(/details\.php\?id=(\d+)/);
        return match ? match[1] : null;
    }

    function fetchAndInsertImage(url, targetTd, applyMarginLeft, insertBeforeEl = null) {
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            onload(res) {
                try {
                    const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
                    const poster = doc.querySelector('img.poster');

                    if (!poster || !poster.src) return;
                    if (targetTd.querySelector('img.capa-torrent')) return;

                    const thumb = document.createElement('img');
                    thumb.src = poster.src;
                    thumb.className = 'capa-torrent';
                    if (applyMarginLeft) thumb.style.marginLeft = '10px';

                    if (insertBeforeEl) {
                        targetTd.insertBefore(thumb, insertBeforeEl);
                    } else {
                        const icon = targetTd.querySelector('img');
                        if (icon && icon.nextSibling) {
                            targetTd.insertBefore(thumb, icon.nextSibling);
                        } else {
                            targetTd.appendChild(thumb);
                        }
                    }
                } catch (e) {
                    console.error('Error processing image to URL:', url, e);
                }
            },
            onerror(err) {
                console.error('Error loading page via GM_xmlhttpRequest for URL:', url, err);
            },
            onabort() {
            },
            ontimeout() {
            }
        });
    }

    const path = location.pathname;

    if (path.includes('/featured.php')) {
        document.querySelectorAll('tr').forEach(row => {
            const link = row.querySelector('a[href^="/details.php?id="]');
            if (!link) return;
            const td = row.querySelectorAll('td')[1];
            if (!td) return;
            td.style.display = 'inline-flex';
            td.style.alignItems = 'center';
            td.style.gap = '6px';
            fetchAndInsertImage('https://torrenting.com' + link.getAttribute('href'), td, false);
        });
    }
    else if (path.includes('/browse.php')) {
        document.querySelectorAll('#torrentsTable tr.torrentsTableTR').forEach(row => {
            const tds = row.querySelectorAll('td');
            if (tds.length < 2) return;

            const link = tds[1].querySelector('a[href^="details.php?id="]');
            if (!link) return;

            const tdIcon = tds[0];
            tdIcon.style.display = 'inline-flex';
            tdIcon.style.alignItems = 'center';
            tdIcon.style.gap = '6px';

            const fullUrl = 'https://torrenting.com/' + link.getAttribute('href');
            fetchAndInsertImage(fullUrl, tdIcon, false);
        });
    }
    else if (path.startsWith('/t')) {
        document.querySelectorAll('tr.torrentsTableTr').forEach(row => {
            const link = row.querySelector('td.torrentNameInfo a.b');
            if (!link) return;
            const tdText = row.querySelector('td.torrentNameInfo');
            if (!tdText) return;
            tdText.style.display = 'inline-flex';
            tdText.style.alignItems = 'center';
            tdText.style.gap = '6px';
            fetchAndInsertImage(
                'https://torrenting.com' + link.getAttribute('href'),
                tdText,
                true,
                link
            );
        });
    }
})();