// ==UserScript==
// @name         Steam Store - Free Packages Button
// @namespace    Royalgamer06
// @version      1.2
// @description  This userscript adds a button to the steam licenses page that adds free packages.
// @author       Royalgamer06
// @include      /^https:\/\/store\.steampowered\.com\/account\/licenses\/?$/
// @connect      steamdb.info
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/25909/Steam%20Store%20-%20Free%20Packages%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/25909/Steam%20Store%20-%20Free%20Packages%20Button.meta.js
// ==/UserScript==

// ==Code==
jQuery(".breadcrumbs").append("<a id='btnFreePackages' class='btn_green_white_innerfade btn_medium' href='javascript:getFreePackages()' style='float:right;width:170px;'><span style='text-align:center;'>Get Free Packages</span></a>");
unsafeWindow.getFreePackages = function() {
    console.log("Getting free packages...");
    jQuery("#btnFreePackages").html("<center><img alt='ajaxloader' src='//steamcommunity-a.akamaihd.net/public/images/login/throbber.gif'></img></center>").prop("disabled", true);
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://steamdb.info/freepackages/",
        timeout: 30000,
        onload: function(response) {
            var script = jQuery("#freepackages", response.responseText).text();
            console.log(script);
            jQuery("#btnFreePackages").remove();
            console.log("Adding free packages...");
            jQuery.globalEval(script);
        },
        onerror: console.log,
        ontimeout: console.log
    });
};
// ==/Code==