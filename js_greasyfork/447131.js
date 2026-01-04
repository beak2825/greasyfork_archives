// ==UserScript==
// @name         TBD: Blur Stats on TorrentBD
// @namespace    https://naeembolchhi.github.io/
// @version      0.3
// @description  When turned on, all stats are hidden. Take screenshots without worries.
// @author       NaeemBolchhi
// @license      GPL-3.0-or-later
// @match        https://www.torrentbd.com/*
// @match        https://www.torrentbd.net/*
// @match        https://www.torrentbd.org/*
// @match        https://www.torrentbd.me/*
// @exclude      https://*.torrentbd.*/theme
// @exclude      https://*.torrentbd.*/terminal
// @icon         data:image/png;base64,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
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447131/TBD%3A%20Blur%20Stats%20on%20TorrentBD.user.js
// @updateURL https://update.greasyfork.org/scripts/447131/TBD%3A%20Blur%20Stats%20on%20TorrentBD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) {window.location.reload();}
        style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.innerHTML = css;
        head.insertBefore(style, null);
    }

    addStyle(`
        .blurstats, .cr-value, .short-link-counter {
          filter: blur(4px);
        }
        .blurmax, #general-info .col.s12.m5 .cr-wrapper:last-of-type div:last-of-type {
          filter: blur(8px);
        }
    `);

    var statBox = document.querySelectorAll('.table.profile-info-table tbody tr');
    var statLength = statBox.length - 1;
    var links = document.querySelectorAll('#general-info .col.s12.m5 .margin-b-10 a');

    try {
        for (let x = 0; x < statLength; x++) {
            statBox[x].querySelectorAll('td')[1].classList.add('blurstats');
        }
    } catch(e) {}

    try {
        for (let x = 0; x < links.length; x++) {
            links[x].innerHTML = '<span class="blurstats">' + links[x].innerHTML + '</span>';
        }
    } catch(e) {}

})();