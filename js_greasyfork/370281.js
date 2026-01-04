// ==UserScript==
// @name         Duome Username-to-Link
// @namespace    mog86uk-duome-username-to-link
// @version      1.02
// @description  duome.eu - Makes usernames in the ranking tables clickable, removing the hassle involved in getting to that user's Duome page.
// @author       mog86uk (aka. testmoogle)
// @match        https://duome.eu/*
// @match        https://www.duome.eu/*
// @grant        GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/370281/Duome%20Username-to-Link.user.js
// @updateURL https://update.greasyfork.org/scripts/370281/Duome%20Username-to-Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('#GoldenOwls td.xx1:hover {color: #1caff6; text-decoration: underline; cursor: pointer;}');

    document.getElementById('GoldenOwls').addEventListener('click', function() {
        var user,
            usertd = document.querySelectorAll('td.xx1:hover');

        if (usertd.length == 1) {
            user = usertd[0].innerText;
            window.open('https://duome.eu/' + user);
        }
    });
})();