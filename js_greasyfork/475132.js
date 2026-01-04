// ==UserScript==
// @name         Entity Manager - Quick EDUID
// @namespace    http://tampermonkey.net/
// @version      2023.08.28.2
// @description  Jumps to the EDUID record when EDUID entered, rather than waiting on a search result
// @author       Vance M. Allen
// @match        https://apps2.sde.idaho.gov/EntityManager/Person/Find
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idaho.gov
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475132/Entity%20Manager%20-%20Quick%20EDUID.user.js
// @updateURL https://update.greasyfork.org/scripts/475132/Entity%20Manager%20-%20Quick%20EDUID.meta.js
// ==/UserScript==

(function() {
    console.warn('Entity Manager - Quick EDUID running.');
    let given = document.getElementById('txtGiven');

    given.onpaste = function() {
        setTimeout(function() {
            if(/^\d{9}$/.test(given.value.trim())) {
                window.location.href = `https://apps2.sde.idaho.gov/EntityManager/Person/View?eduId=${given.value.trim()}`;
            }
        });
    };
})();
