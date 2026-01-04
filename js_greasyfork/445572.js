/* This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.*/

/* Read Steam Subscriber Agreement before using this! */

// ==UserScript==
// @name         Steam auto-activate
// @namespace    http://ttmyller.azurewebsites.net/
// @license      WTFPL; http://www.wtfpl.net/
// @version      0.1
// @description  Automatically agrees to Steam subscriber agreement and activates key. Saves a ton of clicks when activating items from bundles.
// @author       ttmyller
// @match        *://store.steampowered.com/account/registerkey?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445572/Steam%20auto-activate.user.js
// @updateURL https://update.greasyfork.org/scripts/445572/Steam%20auto-activate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById("accept_ssa").checked = true;
    document.getElementById("register_btn").click();
})();