// ==UserScript==
// @name         GBF Sound Focus
// @version      0.1
// @description  Continue playing sound when browser loses focus.
// @author       Lalabels
// @match        *://game.granbluefantasy.jp/*
// @match        *://gbf.game.mbga.jp/*
// @grant        none
// @namespace https://greasyfork.org/users/289229
// @downloadURL https://update.greasyfork.org/scripts/381387/GBF%20Sound%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/381387/GBF%20Sound%20Focus.meta.js
// ==/UserScript==

(function() {

    var settings =
        {
            keepSoundOn: true
        };

    if (settings.keepSoundOn) {
        window.addEventListener("blur", function (e) {
            e.stopImmediatePropagation();
        });
    }
})();