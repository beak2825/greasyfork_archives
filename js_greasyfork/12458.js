// ==UserScript==
// @name       jawz World Vision
// @version    1.0
// @description  enter something useful
// @match      https://wvi.crowdcomputingsystems.com/mturk-web/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/12458/jawz%20World%20Vision.user.js
// @updateURL https://update.greasyfork.org/scripts/12458/jawz%20World%20Vision.meta.js
// ==/UserScript==

$('a').filter(function(index) { return $(this).text() === "Submit"; }).click(function() {
    GM_setClipboard('AHKtab');
});