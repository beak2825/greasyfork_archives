// ==UserScript==
// @name         Házená - Eurohandball
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automaticky přesměruje z detailu zápasu do live url.
// @author       Martin Kaprál
// @match        https://*.eurohandball.com/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eurohandball.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458729/H%C3%A1zen%C3%A1%20-%20Eurohandball.user.js
// @updateURL https://update.greasyfork.org/scripts/458729/H%C3%A1zen%C3%A1%20-%20Eurohandball.meta.js
// ==/UserScript==

(function() {
'use strict';
let matchID = document.querySelector('#main-content > div > div').getAttribute('data-matchid');

window.location.replace("https://ticker.ehfcl.com/Home/Index/" + matchID);

})();