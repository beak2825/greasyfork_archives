// ==UserScript==
// @name         Twonky Explorer Injector
// @version      v20250626.1600
// @description  This add-on simply redirect to Twonku Explorer
// @author       ltlwinston
// @match        http*://*/*
// @namespace    https://greasyfork.org/users/754595
// @downloadURL https://update.greasyfork.org/scripts/540855/Twonky%20Explorer%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/540855/Twonky%20Explorer%20Injector.meta.js
// ==/UserScript==
(async function() {
    'use strict';

    if (!document.title.match(/(twonky|pv connect|mediaserver)/i) || document.title.match(/(enhancher|explorer)/i)) {
        return;
    }
    const btnSetup = document.createElement('div');
    btnSetup.setAttribute('style','z-index: 9999; position: fixed; top: 50%; left: 1em; background: white; border-radius: 2px; cursor: pointer; padding: 0.5em');
    btnSetup.innerHTML = `<a href="/twonkyexplorer">Start Twonky<br>Explorer!</a>`;
    document.body.appendChild(btnSetup);
})();