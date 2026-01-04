// ==UserScript==
// @name         Tetr.io advanced stats
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license MIT
// @description  Adds three columns with advanced stats (DS/piece, APP, APP+DS/piece) to the tetra channel's game list.
// @author       Fischly
// @match        https://ch.tetr.io/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tetr.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450686/Tetrio%20advanced%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/450686/Tetrio%20advanced%20stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!document.location.pathname.includes('league')) return;

    const observer = new MutationObserver(function(mutations, observer) {
        observer.disconnect();

        const header = document.querySelector('#theader');
        const addAfter = header.children[5];

        addAfter.insertAdjacentHTML('afterend', '<th title="attack per piece + downstack per piece">APP+DS/pce</th>');
        addAfter.insertAdjacentHTML('afterend', '<th title="attack per piece">APP</th>');
        addAfter.insertAdjacentHTML('afterend', '<th title="downstack per piece">DS/pce</th>');

        const recordList = document.querySelector('#recordlist');

        const extract = item => Number.parseFloat(item.firstChild.textContent + item.childNodes[1].innerText);

        for (const row of recordList.children) {
            const pps = extract(row.children[3]);
            const apm = extract(row.children[4]);
            const vs  = extract(row.children[5]);

            const app = apm / (pps * 60);
            const ds_pce = ((vs / 100) - (apm / 60)) / pps;
            const app_ds_pce = app + ds_pce;

            console.log(pps, apm, vs, app, ds_pce);

            const addColAfter = row.children[5];

            const app_decimal = (app.toFixed(3) - (app.toFixed(3) | 0)).toString().slice(2);
            const ds_pce_decimal = (ds_pce.toFixed(3) - (ds_pce.toFixed(3) | 0)).toString().slice(2);
            const app_ds_pce_decimal = (app_ds_pce.toFixed(3) - (app_ds_pce.toFixed(3) | 0)).toString().slice(2);

            addColAfter.insertAdjacentHTML('afterend', `<td>${app_ds_pce | 0}<sub>.${app_ds_pce_decimal}</td>`);
            addColAfter.insertAdjacentHTML('afterend', `<td>${app | 0}<sub>.${app_decimal}</td>`);
            addColAfter.insertAdjacentHTML('afterend', `<td>${ds_pce | 0}<sub>.${ds_pce_decimal}</td>`);
        }
    });

    observer.observe(document.querySelector('#recordlist'), {attributes: true, childList: true, subtree: true});
})();