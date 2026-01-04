// ==UserScript==
// @name        PH English Only
// @namespace   https://greasyfork.org/en/users/1229931-aeos7
// @match       https://de.pornhub.com/*
// @match       https://fr.pornhub.com/*
// @match       https://es.pornhub.com/*
// @match       https://it.pornhub.com/*
// @match       https://pt.pornhub.com/*
// @match       https://pl.pornhub.com/*
// @match       https://rt.pornhub.com/*
// @match       https://cn.pornhub.com/*
// @match       https://nl.pornhub.com/*
// @match       https://cz.pornhub.com/*
// @match       https://jp.pornhub.com/*
// @run-at      document-end
// @grant       none
// @version     1.0.4
// @author      AEOS7
// @description Forces PH to use English only
// @downloadURL https://update.greasyfork.org/scripts/483355/PH%20English%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/483355/PH%20English%20Only.meta.js
// ==/UserScript==

function change() {
    document.querySelectorAll("a.networkTab")[11].click();
}
setTimeout(change, 2000);