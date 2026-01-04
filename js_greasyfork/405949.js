// ==UserScript==
// @name         ogs blind mode
// @version      0.3
// @description  custom stones on OGS
// @author       michiakig
// @match        https://online-go.com/*
// @run-at       document-idle
// @namespace https://greasyfork.org/users/592542
// @downloadURL https://update.greasyfork.org/scripts/405949/ogs%20blind%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/405949/ogs%20blind%20mode.meta.js
// ==/UserScript==

(function() {
    function setup() {
        console.log("[ogs blind mode] setting up");

        // custom place stone functions that do nothing. last move circle handled elsewhere
        GoThemes.white.Plain.prototype.placeWhiteStone = function(ctx, shadow_ctx, stone, cx, cy, radius) { };
        GoThemes.black.Plain.prototype.placeBlackStone = function(ctx, shadow_ctx, stone, cx, cy, radius) { };

        // click the theme selector which will trigger a redraw
        document.querySelector("div.theme-set div.selector.active")

        console.log("[ogs blind mode] done");
    };

    if (typeof data !== "undefined" && typeof GoThemes !== "undefined") {
        setup();
    } else {
        // set up the mutation observer
        // altho this should be installed with @run-at idle, I still saw the code run prior to these globals being available, so just watch the page for updates until they are present
        var observer = new MutationObserver(function (mutations, me) {
            if (typeof data !== "undefined" && typeof GoThemes !== "undefined") {
                setup();
                me.disconnect(); // stop observing
            } else {
                console.log("[ogs blind mode] data or GoThemes not found, waiting...");
            }
        });

        // start observing
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }
})();
