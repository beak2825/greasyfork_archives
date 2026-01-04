// ==UserScript==
// @name         Allegro - Rozłącz Oferty!
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Stop przymusowo połączonym ofertom na Allegro!
// @author       Mr. Hermano
// @match        https://allegro.pl/kategoria/*
// @match        https://allegro.pl/listing*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503580/Allegro%20-%20Roz%C5%82%C4%85cz%20Oferty%21.user.js
// @updateURL https://update.greasyfork.org/scripts/503580/Allegro%20-%20Roz%C5%82%C4%85cz%20Oferty%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let url = window.location.href;
    if (!url.includes('description=1')) {
        window.location.replace(url + (url.includes('?') ? '&' : '?') + 'description=1');
    }
})();