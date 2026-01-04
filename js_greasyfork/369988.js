// ==UserScript==
// @name         VicodinScam
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  hide vicodin to stop buying it
// @author       You
// @match        https://www.torn.com/bazaar.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369988/VicodinScam.user.js
// @updateURL https://update.greasyfork.org/scripts/369988/VicodinScam.meta.js
// ==/UserScript==

jQuery(document).ready(filter);

function filter () {
    'use strict';

    // Your code here...
        setTimeout(filter, 1000);

    $("#bazaar-page-wrap > div.bazaar-page-wrap.bazaar-main-wrap > div > ul > li").load().each(function() {
        var scam = $(this).children(".info").children(".desc").children(".wrap").children(".t-overflow");
        console.log($(this).text());
        if ($(this).text().includes("Vicodin")) {
            $(this).hide();
        }
    });
}