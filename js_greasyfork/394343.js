// ==UserScript==
// @name         Search on Steam
// @namespace    https://github.com/silevilence/SearchOnSteam
// @version      0.1
// @description  Search selected words on steam store
// @author       Silevilence
// @match        *://*/*
// @grant        GM_openInTab
// @run-at       context-menu
// @supportURL   https://github.com/silevilence/SearchOnSteam/issues
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=silevilence@outlook.com&item_name=Greasy+Fork+donation
// @icon         https://steamstore-a.akamaihd.net/public/shared/images/responsive/share_steam_logo.png
// @downloadURL https://update.greasyfork.org/scripts/394343/Search%20on%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/394343/Search%20on%20Steam.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    var sel = document.getSelection();
    GM_openInTab("https://store.steampowered.com/search/?term=" + encodeURI(sel)
        .replace("&", "%26").replace("=", "%3D").replace("?", "%3F"));
})();