// ==UserScript==
// @name         EduElo Cheat - Custom Response Header
// @namespace    https://github.com/MaciusBTW/EduElo-Cheat
// @version      0.1
// @description  Custom script to modify response headers on EduElo site
// @author       MaciusBTW
// @match        https://eduelo.pl/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516289/EduElo%20Cheat%20-%20Custom%20Response%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/516289/EduElo%20Cheat%20-%20Custom%20Response%20Header.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Custom Response with header modification
    const myResponse = Response.error();

    try {
        myResponse.headers.set('Origin', 'https://github.com/MaciusBTW/EduElo-Cheat/blob/main/autocomplete.js');
    } catch (e) {
        console.log('Script created by https://github.com/MaciusBTW!');
    }

})();
