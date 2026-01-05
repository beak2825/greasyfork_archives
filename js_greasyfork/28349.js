// ==UserScript==
// @name         Geoguessr Pro
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Get pro in geoguessr
// @author       Dr-Turner
// @match        https://geoguessr.com/*
// @downloadURL https://update.greasyfork.org/scripts/28349/Geoguessr%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/28349/Geoguessr%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var no_pro = "no-pro";
    var pro = "account-status--pro";
    var html = document.getElementsByTagName("html")[0];
    console.log(html.classList);
    html.classList.remove(no_pro);
    html.classList.add(pro);
})();