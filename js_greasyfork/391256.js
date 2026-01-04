// ==UserScript==
// @name         hide single problem tag on CF
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  hide single problem tag on Codeforces
// @author       ouuan
// @match        https://codeforces.com/*
// @match        https://codeforc.es/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391256/hide%20single%20problem%20tag%20on%20CF.user.js
// @updateURL https://update.greasyfork.org/scripts/391256/hide%20single%20problem%20tag%20on%20CF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var cur = 0;
    var tags, btn, hint;

    function change() {
        if (cur ^= 1) {
            tags.style.display = 'block';
            hint.style.display = 'none';
            btn.innerText = '▲';
        } else {
            hint.style.display = 'block';
            tags.style.display = 'none';
            btn.innerText = '▼';
        }
    }

    var boxes = document.querySelectorAll('.roundbox.sidebox');

    for (var box of boxes) {
        if (box.innerText.match('Problem tags')) {
            tags = box.children[3];
            tags.style.display = 'none';
            hint = document.createElement('span');
            hint.innerText = 'Tags are hidden.';
            hint.style.padding = '0.5em';
            hint.style.display = 'block';
            box.appendChild(hint);
            btn = document.createElement('span');
            btn.style.cursor = 'pointer';
            btn.innerText = '▼';
            btn.onclick = change;
            box.children[2].appendChild(btn);
        }
    }
})();