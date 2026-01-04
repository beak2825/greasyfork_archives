// ==UserScript==
// @name         Append own Referall to Plati Market URLs
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Appends ?ai=1364108 to Plati Market item pages, referral for digiseller umairnawaz184@gmail.com
// @author       ummayrr
// @match        https://plati.market/itm/*
// @match        https://digiseller.market/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/529725/Append%20own%20Referall%20to%20Plati%20Market%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/529725/Append%20own%20Referall%20to%20Plati%20Market%20URLs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let url = new URL(window.location.href);
    let ai = url.searchParams.get('ai');

    if (!ai || ai === '') {
        url.searchParams.set('ai', '1364108');
        window.location.replace(url.href);
    }
})();
