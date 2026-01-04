// ==UserScript==
// @name         No Ads For GoGoAnime.se
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Removes some ads on gogoanime.se
// @author       NobleWolf42
// @match        https://www1.gogoanime.se/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40887/No%20Ads%20For%20GoGoAnimese.user.js
// @updateURL https://update.greasyfork.org/scripts/40887/No%20Ads%20For%20GoGoAnimese.meta.js
// ==/UserScript==

$('.banner_center').remove();
