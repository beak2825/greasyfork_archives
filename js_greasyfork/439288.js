// ==UserScript==
// @name         Crinacle Numbered Rankings
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  To add numbered rangkings to Crinacle's IEM and Headphone rangkings
// @author       Ian Mustafa <mail@ianmustafa.com>
// @match        https://crinacle.com/rankings/*/
// @icon         https://crinacle.com/wp-content/uploads/2020/02/crinaclogo.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439288/Crinacle%20Numbered%20Rankings.user.js
// @updateURL https://update.greasyfork.org/scripts/439288/Crinacle%20Numbered%20Rankings.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const rows = document.querySelectorAll('table.tablepress tbody .column-1');
    rows.forEach((el, i) => {
        const sp = document.createElement('span');
        sp.style.fontWeight = 'bold';
        sp.style.fontSize = '14px';
        sp.style.lineHeight = '18px';
        sp.style.display = 'block';
        sp.innerText = '#' + (i + 1) + ' ';
        el.append(sp);
        const an = document.createElement('span');
        an.style.opacity = 0.5;
        an.style.fontSize = '10px';
        an.style.lineHeight = '14px';
        an.style.display = 'block';
        an.innerText = ((i + 1) / rows.length * 100).toFixed(2) + '%';
        el.append(an);
    });
})();