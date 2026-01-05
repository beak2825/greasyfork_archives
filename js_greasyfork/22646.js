// ==UserScript==
// @name         FreesteamkeysAdRemover
// @namespace    https://greasyfork.org/es/scripts/22646-freesteamkeysadremover
// @version      0.6
// @description  Removes adfly from links
// @author       DonNadie
// @match        http://*.freesteamkeys.me/*
// @match        https://*.freesteamkeys.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22646/FreesteamkeysAdRemover.user.js
// @updateURL https://update.greasyfork.org/scripts/22646/FreesteamkeysAdRemover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $selector = jQuery('#linkbox a, #boxa a, #keylinkz a');

    if ($selector.length == 1) {
        var adLinks = [/http:\/\/linkshrink.net\/([a-z]+)\=/,/http:\/\/adf.ly\/([0-9]+)\//];
        for (var k in adLinks) {
            $selector.attr("href", $selector.attr("href").replace(adLinks[k], ""));
        }
    }
})();