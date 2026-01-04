// ==UserScript==
// @name         Gamehag Farmer
// @name:pl Farmiarka Gamehag
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Farm gamehag points easily.
// @description:pl Farmuj kamienię dusz na gamehag.
// @author       Teala24k
// @match        https://gamehag.com/tv-zone
// @icon https://www.google.com/s2/favicons?domain=gamehag.com&sz=128
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451937/Gamehag%20Farmer.user.js
// @updateURL https://update.greasyfork.org/scripts/451937/Gamehag%20Farmer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function d() {
        document.querySelector("#instream > div.bannertarget > div").click()
    }
    function e(){
        document.querySelector("#page-content > div.page.page-tv.ng-scope > div > div.row.tile-grid.clear-last > div.col.col-12.col-lg-8 > div > div.result.is-visible > div.result__actions > button.result__primary").click()
    }
    function q(){
        document.querySelector("#page-content > div.page.page-tv.ng-scope > div > div.row.tile-grid.clear-last > div.col.col-12.col-lg-8 > div > button > div.video__loader").click()
    }
    var b = setInterval(d,1000);
    var h = setInterval(e,1000);
    var j = setInterval(q,500);
})();