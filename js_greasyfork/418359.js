// ==UserScript==
// @name            byom.de: Auto-Login
// @description     Fill in the mail ID given as anchor in format "mailId=<id>"
// @match           https://www.byom.de/*
// @run-at          document-end
// @author          Archangel1C
// @license         GPL-3.0-only
// @namespace       https://github.com/Archangel1C
// @version         0.1
// @grant           none
// @compatible      chrome
// @contributionURL https://flattr.com/@Archangel1C
// @downloadURL https://update.greasyfork.org/scripts/418359/byomde%3A%20Auto-Login.user.js
// @updateURL https://update.greasyfork.org/scripts/418359/byomde%3A%20Auto-Login.meta.js
// ==/UserScript==
//
// Sources/Influences:
//

(function loginAs() {
    // debugger instruction lets Chrome stop here
    //  debugger;

    // https://www.w3schools.com/js/js_strict.asp
    // https://stackoverflow.com/a/1335881/4423698
    'use strict';

    const hash = document.location.hash;
    var mailId = hash.substring(hash.lastIndexOf('=') + 1);
    if (mailId == null || mailId.length == 0) {
        console.log(`[${GM_info.script.name}] no mailId given`);
        return;
    }

    const textField = document.querySelector("#main-search");
    if (textField == null) {
        console.log(`[${GM_info.script.name}] could not find textfield`);
        return;
    }

    const loginButton = document.querySelector("#main-search-button");
    if (loginButton == null) {
        console.log(`[${GM_info.script.name}] could not find login button`);
        return;
    }

    console.log(`[${GM_info.script.name}] logging in as '${mailId}@byom.de'...`);
    textField.value = mailId;
    loginButton.click();

})();
