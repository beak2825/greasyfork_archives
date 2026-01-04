// ==UserScript==
// @name         ogs custom stones
// @version      0.1
// @description  custom stones on OGS
// @author       michiakig
// @match        https://online-go.com/*
// @run-at       document-idle
// @namespace https://greasyfork.org/users/592542
// @downloadURL https://update.greasyfork.org/scripts/405885/ogs%20custom%20stones.user.js
// @updateURL https://update.greasyfork.org/scripts/405885/ogs%20custom%20stones.meta.js
// ==/UserScript==

(function() {
    function setup() {
        console.log("[ogs custom stones] setting up");

        // custom place stone function for flat edges
        var placeStoneFn = function(image) {
            return function(ctx, shadow_ctx, stone, cx, cy, radius) {
                ctx.drawImage(image, cx - radius, cy - radius, radius * 2, radius * 2);
            };
        };

        var white = document.createElement('img');
        white.setAttribute('src', 'https://i.imgur.com/b8lmPkX.png');
        var black = document.createElement('img');
        black.setAttribute('src', 'https://i.imgur.com/wlBc7bp.png');

        GoThemes.white.Plain.prototype.placeWhiteStone = placeStoneFn(white);
        GoThemes.black.Plain.prototype.placeBlackStone = placeStoneFn(black);
        // click the theme selector which will trigger a redraw
        document.querySelector("div.theme-set div.selector").click();

        console.log("[ogs custom stones] done");
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
                console.log("[ogs custom stones] data or GoThemes not found, waiting...");
            }
        });

        // start observing
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }
})();
