// ==UserScript==
// @name         GameBanana Mod Has Downloaded Marker
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Mark out GameBanana downloaded mods
// @author       You
// @match        *://gamebanana.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465516/GameBanana%20Mod%20Has%20Downloaded%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/465516/GameBanana%20Mod%20Has%20Downloaded%20Marker.meta.js
// ==/UserScript==

function aButton(id, innerHTML, onClick) {
    const btn = document.createElement('button');
    btn.innerHTML = innerHTML;
    Object.assign(btn.style, {
        position: 'fixed',
        top: id * 10 + (id - 1) * 27 + 'px',
        right: '10px',
        zIndex: 100
    });
    btn.addEventListener('click', (e) => onClick.call(btn, e, btn));
    document.body.appendChild(btn);
    return btn;
}

function parseIdFromLink(link) {
    return link.replace(/[^\d]/g, "");
}

function mark(hasDownloadedModsId) {
    let mods = [...document.querySelectorAll('.RecordsGrid > .Record')];
    for (const mod of mods) {
        const referLink = (mod.querySelector('a.Preview') || mod.querySelector('a.Name')).href;
        const id = parseIdFromLink(referLink);
        const hasDownloadedMark = mod.querySelector('.has-downloaded');
        if (hasDownloadedModsId.includes(id)) {
            // this mod has been downloaded
            if (hasDownloadedMark)
                continue;
            const markAsDownloaded = document.createElement('span');
            markAsDownloaded.className = 'has-downloaded';
            markAsDownloaded.style.fontSize = '1.5em';
            markAsDownloaded.innerHTML = '✔';
            mod.querySelector('.Identifiers').appendChild(markAsDownloaded);
        } else {
            if (hasDownloadedMark != null)
                hasDownloadedMark.parentNode.removeChild(hasDownloadedMark);
        }
    }
}

(function() {
    'use strict';

    console.log('GameBanana Mod Has Downloaded Marker executed!');
    aButton(1, 'Enter Id List', () => {
        let result = prompt('Enter Downloaded Ids, e.g. ["123", "124"]');
        if (result == null || result.trim() === '')
            return;
        result = result.replace(/'/g, '"');
        if (result) {
            try {
                localStorage.setItem('marker', result);
            } catch (e) {
                alert('Invalid json');
            }
        }
    });
    if (location.href.includes('mods')) {
        aButton(2,
                JSON.parse(localStorage.getItem('marker') || '[]').includes(parseIdFromLink(location.href)) ? 'Unmark as downloaded' : 'Mark as downloaded',
                (_, me) => {
            const old = JSON.parse(localStorage.getItem('marker') || '[]');
            const id = parseIdFromLink(location.href);
            if (old.includes(id)) {
                // remove from downloaded
                localStorage.setItem('marker', JSON.stringify(old.filter(one => one !== id)));
                me.innerHTML = 'Mark as downloaded';
            } else {
                // add from downloaded
                old.push(id);
                localStorage.setItem('marker', JSON.stringify(old));
                me.innerHTML = 'Unmark as downloaded';
            }
        });
    }
    setInterval(() => mark(JSON.parse(localStorage.getItem('marker') || '[]')), 2000);
})();
