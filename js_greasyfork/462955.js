// ==UserScript==
// @name         [RED] V0/320 Filtering in RED Better Snatches
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds additional filtering options to REDBetter Snatches Menu
// @author       undertheironbridge
// @match        https://redacted.ch/better.php?method=snatch*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462955/%5BRED%5D%20V0320%20Filtering%20in%20RED%20Better%20Snatches.user.js
// @updateURL https://update.greasyfork.org/scripts/462955/%5BRED%5D%20V0320%20Filtering%20in%20RED%20Better%20Snatches.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var before=document.getElementsByClassName('torrent_table')[0];

    var span=document.createElement('span');
    span.setAttribute('style', 'display: block; text-align: center;');
    before.parentNode.insertBefore(span, before);

    const buttons = [
        {
            label: 'Show only missing V0',
            show_fn: (row) => {
                var td = row.getElementsByTagName("td");
                return td[1].textContent == "NO" && td[2].textContent == "YES";
            }
        },
        {
            label: 'Show only missing 320',
            show_fn: (row) => {
                var td = row.getElementsByTagName("td");
                return td[1].textContent == "YES" && td[2].textContent == "NO";
            }
        },
        {
            label: 'Show only both missing',
            show_fn: (row) => {
                var td = row.getElementsByTagName("td");
                return td[1].textContent == "NO" && td[2].textContent == "NO";
            }
        },
        {
            label: 'Show all',
            show_fn: (row) => {
                return true;
            }
        }
    ];

    for (var b of buttons) {
        span.appendChild(makeAnchor(b));
        span.appendChild(document.createTextNode(' | '));
    }
})();

function makeAnchor(btn) {
    var a = document.createElement('a');
    a.innerHTML = btn.label;
    a.href = 'javascript:void(0);';
    a.addEventListener('click', () => { doFilter(btn.show_fn); }, false);
    return a;
}

function doFilter(show_fn) {
    for (var tr of document.getElementsByClassName('torrent torrent_row')) {
        tr.hidden = !show_fn(tr);
    }
}