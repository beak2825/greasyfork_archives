// ==UserScript==
// @name         Beatsaver oneclick install link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a link to download the song from beatsaver
// @author       David Liao
// @match        https://scoresaber.com/leaderboard/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389497/Beatsaver%20oneclick%20install%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/389497/Beatsaver%20oneclick%20install%20link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // nab the id from inside the commented beastsaver url
    let commentElement = document.querySelector("html body div.section div.container div.content div.columns.is-desktop.is-flex-reverse div.column.is-one-third-desktop div.box.has-shadow");
    let urlRegexp = /https:\/\/bsaber\.com\/songs\/(\w+)/g;
    let matches = urlRegexp.exec(commentElement.innerHTML);

    if (matches.length < 2) {
        return;
    }

    // write that id to a new link next to the title
    let titleElement = document.querySelector(".is-5 > a:nth-child(1)")
    titleElement.insertAdjacentHTML('afterend', ' - <a href="beatsaver://' + matches[1] + '">OneClick™ Install</a>');

})();