// ==UserScript==
// @name         Yify Subtitles
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes Taboola ads that not allows to download subtitles. (very annoying)
// @author       You
// @match        https://www.yifysubtitles.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395659/Yify%20Subtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/395659/Yify%20Subtitles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var oTab = new TaboolaRemover();
    oTab.clean();
})();

function TaboolaRemover() {
    var self = this;
    var _filter = ["Taboola_TOP_LEADERBOARD_AB", "taboola-right-rail-thumbnails", "taboola-above-article-thumbnails", "NATIVE_TABOOLA_ARTICLE", "Taboola_NATIVE_TABOOLA_ARTICLE", "taboola-below-article-thumbnails"];


    this.clean = function() {
        console.log("cleaning");
        _filter.forEach( function(element) {
            var oDom = document.getElementById(element);
            console.log({id: element});
            if (oDom) {
                oDom.remove();
            }
        });
    }

}