// ==UserScript==
// @name         Futsal Portugalsko Zero
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Přesměruje detail do správné live url
// @author       Michal Hornok
// @match        https://www.zerozero.pt/match.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zerozero.pt
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477694/Futsal%20Portugalsko%20Zero.user.js
// @updateURL https://update.greasyfork.org/scripts/477694/Futsal%20Portugalsko%20Zero.meta.js
// ==/UserScript==

(function() {
    let targetURL = 'https://www.zerozero.pt/match_live_com.php?id=8140449';
    let currentURL = window.location.href
    let match = currentURL.match(/id=(\d+)/);
    if (match && match[1]) {
        targetURL = 'https://www.zerozero.pt/match_live_com.php?id=' + match[1];
        window.location.href = targetURL;
    }
})();