// ==UserScript==
// @name         Flight Rising - Keep Search Settings On Hoard/Vault Toggle
// @namespace    https://greasyfork.org/users/547396
// @version      0.7
// @description  Keep search settings (item name, color, etc) when toggling between Hoard and Vault.
// @author       Jicky
// @match        http*://www1.flightrising.com/hoard
// @match        http*://www1.flightrising.com/hoard/*
// @match        http*://www1.flightrising.com/vault
// @match        http*://www1.flightrising.com/vault/*
// @icon         https://www.google.com/s2/favicons?domain=flightrising.com
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/439295/Flight%20Rising%20-%20Keep%20Search%20Settings%20On%20HoardVault%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/439295/Flight%20Rising%20-%20Keep%20Search%20Settings%20On%20HoardVault%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('a#hoard-action-mode').on("mouseenter.hoardKeepSearch", function() {
        let url = window.location.href.replace(/\/\d+/, '/1'); // drop pagenums
        if (url.includes('/hoard')) {
            $(this).attr('href', url.replace('/hoard','/vault'));
        } else if (url.includes('/vault')) {
            $(this).attr('href', url.replace('/vault','/hoard'));
        }
    });

})();