// ==UserScript==
// @name         pytamy_adblock
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  pytamy bez reklamy
// @author       Pete Wright
// @match        http*://pytamy.pl/*
// @grant        none
// @include      http*://pytamy.pl/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/380946/pytamy_adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/380946/pytamy_adblock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // usuwa reklamy ze strony
    $("[id=adv03] script").remove()
    $("[id^=adv]").remove()
    $("div:has(div>div>div:contains(REKLAMA))").remove()
})();