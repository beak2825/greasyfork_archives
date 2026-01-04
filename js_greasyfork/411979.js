// ==UserScript==
// @name         Torn: Mod Master Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show progress towards mod master
// @author       Untouchable [1360035]
// @match        https://www.torn.com/loader.php?sid=itemsMods
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411979/Torn%3A%20Mod%20Master%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/411979/Torn%3A%20Mod%20Master%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        let title = $('#itemMods')[0].children[0].children[0].innerText;
        $('#itemMods')[0].children[0].children[0].innerText = title + " - " + $('.mods')[0].children.length + "/20";
    },500)

})();