// ==UserScript==
// @name         New WilliamHill
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Přesměruje detail zápasu do live url
// @author       Martin Kaprál
// @match        https://sports.williamhill.com/betting/en-gb/*/OB_EV*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=williamhill.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458845/New%20WilliamHill.user.js
// @updateURL https://update.greasyfork.org/scripts/458845/New%20WilliamHill.meta.js
// ==/UserScript==

(function() {
'use strict';
var urlLink = window.location.href;
var matchID = urlLink.match(/[0-9]+/)
var sport = urlLink.match(/([a-z]+)\/OB_EV/)

window.location("https://sports.whcdn.net/scoreboards/app/"+ sport + "/index.html?eventId=" + matchID);
})();