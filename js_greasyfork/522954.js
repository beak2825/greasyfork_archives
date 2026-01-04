// ==UserScript==
// @name         MZ - 2D/3D Buttons
// @namespace    douglaskampl
// @version      1.6
// @description  Adds 2D/3D buttons to certain pages
// @author       Douglas
// @match        https://www.managerzone.com/?p=league*
// @match        https://www.managerzone.com/?p=friendlyseries*
// @match        https://www.managerzone.com/?p=cup*
// @match        https://www.managerzone.com/?p=private_cup*
// @match        https://www.managerzone.com/?p=national_teams*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522954/MZ%20-%202D3D%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/522954/MZ%20-%202D3D%20Buttons.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function processLeagueOrWorldLeaguePage() {
        const matchDate = parseDateFromHeader();
        if (matchDate && matchDate > new Date()) return;
        const tables = document.querySelectorAll('table.hitlist.marker');
        tables.forEach(t => {
            const rows = t.querySelectorAll('tbody tr');
            rows.forEach(r => {
                const link = r.querySelector('td:nth-child(2) a[href*="mid="]');
                if (!link) return;
                if (/X\s*-\s*X/i.test(link.textContent)) return;
                const mid = link.href.match(/mid=(\d+)/)?.[1];
                if (!mid) return;
                const td3 = r.querySelector('td:nth-child(3)');
                if (!td3 || td3.querySelector('.matchIcon')) return;
                td3.appendChild(createButtons(mid));
            });
        });
    }

    function processFriendlyLeaguePage() {
        const matchDate = parseDateFromHeader();
        if (matchDate && matchDate > new Date()) return;
        const tables = document.querySelectorAll('table.hitlist.marker');
        tables.forEach(t => {
            const rows = t.querySelectorAll('tbody tr');
            rows.forEach(x => {
                const a = x.querySelector('td:nth-child(2) a[href*="mid="]');
                if (!a) return;
                if (/X\s*-\s*X/i.test(a.textContent)) return;
                const mid = a.href.match(/mid=(\d+)/)?.[1];
                if (!mid) return;
                const td3 = x.querySelector('td:nth-child(3)');
                if (!td3 || td3.querySelector('.matchIcon')) return;
                td3.appendChild(createButtons(mid));
            });
        });
    }

    function processCupPage() {
        const t = document.querySelector('table.hitlist.marker');
        if (!t) return;
        const r = t.querySelectorAll('tbody tr');
        r.forEach(x => {
            const a = x.querySelector('td:nth-child(2) a[href*="mid="]');
            if (!a) return;
            if (/X\s*-\s*X/i.test(a.textContent)) return;
            const mid = a.href.match(/mid=(\d+)/)?.[1];
            if (!mid) return;
            const td3 = x.querySelector('td:nth-child(3)');
            if (!td3 || td3.querySelector('.matchIcon')) return;
            td3.appendChild(createButtons(mid));
        });
    }

    function processNTPage() {
        const rows = document.querySelectorAll('td.bold[style*="white-space: nowrap"]');
        let lastMatchRow = null;

        for (const row of rows) {
            const sibling = row.nextElementSibling;
            if (!sibling) continue;

            const matchLink = sibling.querySelector('a[href*="mid="]');
            if (matchLink) {
                lastMatchRow = sibling;
                break;
            }
        }

        if (!lastMatchRow) return;
        if (lastMatchRow.querySelector('.matchIcon')) return;

        const matchLink = lastMatchRow.querySelector('a[href*="mid="]');
        if (!matchLink || /X\s*-\s*X/i.test(matchLink.textContent)) return;

        const matchId = matchLink.href.match(/mid=(\d+)/)?.[1];
        if (!matchId) return;

        const flags = lastMatchRow.querySelectorAll('img[src*="flags"]');
        if (flags.length >= 2) {
            flags[1].insertAdjacentElement('afterend', createButtons(matchId));
        } else {
            matchLink.insertAdjacentElement('afterend', createButtons(matchId));
        }
    }

    function handlePage() {
        if (location.search.includes('p=league')) {
            processLeagueOrWorldLeaguePage();
        } else if (location.search.includes('p=friendlyseries')) {
            processFriendlyLeaguePage();
        } else if (location.search.includes('p=national_teams')) {
            processNTPage();
        } else {
            processCupPage();
        }
    }

    function createButtons(matchId) {
        const btnContainer = document.createElement('span');
        const btn2d = document.createElement('a');
        btn2d.className = 'matchIcon shadow_soft';
        btn2d.href = `/?p=match&sub=result&type=2d&play=2d&mid=${matchId}`;
        btn2d.title = 'Watch match in 2D';
        btn2d.rel = 'nofollow';
        btn2d.style.fontSize = '9px';
        btn2d.style.height = '10px';
        btn2d.innerHTML = '<i>2D</i><span>&nbsp;2D&nbsp;</span>';
        btn2d.onclick = function(e) {
            e.preventDefault();
            powerboxCloseAll();
            mz.openGameLayer('2d', matchId);
            mz.noSleep.enable();
            return false;
        };
        const btn3d = document.createElement('a');
        btn3d.className = 'matchIcon shadow_soft inverted';
        btn3d.href = `/?p=match&sub=result&type=3d&play=3d&mid=${matchId}`;
        btn3d.title = 'Watch match in 3D';
        btn3d.rel = 'nofollow';
        btn3d.style.fontSize = '9px';
        btn3d.style.height = '10px';
        btn3d.style.margin = '0';
        btn3d.innerHTML = '<i>3D</i><span>&nbsp;3D&nbsp;</span>';
        btn3d.onclick = function(e) {
            e.preventDefault();
            powerboxCloseAll();
            mz.openGameLayer('3d', matchId);
            mz.noSleep.enable();
            return false;
        };
        btnContainer.appendChild(btn2d);
        btnContainer.appendChild(btn3d);
        return btnContainer;
    }

    function parseDateFromHeader() {
        const h2 = document.querySelector('h2.subheader.clearfix');
        if (!h2) return null;
        const text = h2.textContent.trim();
        const match = text.match(/(\d{1,2}\/\d{1,2}\/\d{4})\s+(\d{1,2}:\d{2}(am|pm))/i);
        if (!match) return null;
        const [ , datePart, timePart ] = match;
        const [ d, m, y ] = datePart.split('/').map(n => parseInt(n, 10));
        const parts = timePart.match(/(\d{1,2}):(\d{2})(am|pm)/i);
        if (!parts) return null;
        let [ , hh, mm, ampm ] = parts;
        let h = parseInt(hh, 10);
        const min = parseInt(mm, 10);
        ampm = ampm.toLowerCase();
        if (ampm === 'pm' && h < 12) h += 12;
        if (ampm === 'am' && h === 12) h = 0;
        return new Date(y, m - 1, d, h, min, 0);
    }

    let timeout = null;
    const observer = new MutationObserver(() => {
        if (!timeout) {
            timeout = setTimeout(() => {
                handlePage();
                timeout = null;
            }, 500);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handlePage);
    } else {
        handlePage();
    }
})();
