// ==UserScript==
// @name         Steam auto redeem key
// @description  Automatically accepts the agreement and activates a steam key, when opening a register key url.
// @namespace    https://greasyfork.org/en/users/10848
// @version      1.0
// @author       sergio91pt
// @match        https://store.steampowered.com/account/registerkey
// @match        https://store.steampowered.com/account/registerkey?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379001/Steam%20auto%20redeem%20key.user.js
// @updateURL https://update.greasyfork.org/scripts/379001/Steam%20auto%20redeem%20key.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById('accept_ssa').checked = true;

    if (document.querySelector('input[name="product_key"]').value !== '') {
        document.getElementById('register_btn').click();
    }
})();