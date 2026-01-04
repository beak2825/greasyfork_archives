// ==UserScript==
// @name         ogs one color mode
// @version      0.2
// @description  one color mode on Online Go Server
// @license MIT
// @author       michiakig
// @match        https://*.online-go.com/*
// @run-at       document-idle
// @namespace https://greasyfork.org/users/592542
// @downloadURL https://update.greasyfork.org/scripts/438225/ogs%20one%20color%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/438225/ogs%20one%20color%20mode.meta.js
// ==/UserScript==

(function() {
    var NAME_MATCHER = "one color";

    // for games without "one color" in the name. put the game ID (from URL) in this list, don't forget the comma
    var OVERRIDE = [
        123,
        456,
    ];

    var OGS_API = "https://online-go.com/api/v1/games/";

    var oldPlaceWhiteStone = null;
    var status = false;
    var lastGameId = null;

    function getGameId() {
        var goban = document.querySelector('div.Goban div.Goban');
        if (goban === null) {
            return null;
        }
        return goban.dataset.gameId;
    }

    function oneColorModeOn() {
        if (status) {
            return;
        }
        // monkey patch the place white stone function, to place a black stone instead:
        GoThemes.white.Plain.prototype.placeWhiteStone = function(ctx, shadow_ctx, stone, cx, cy, radius) {
            GoThemes.black.Plain.prototype.placeBlackStone(ctx, shadow_ctx, stone, cx, cy, radius);
        }
        status = true;
        // click the theme selector which will trigger a redraw
        document.querySelector("div.theme-set div.selector").click();
    }

    function oneColorModeOff() {
        if (!status) {
            return;
        }
        if (oldPlaceWhiteStone !== null) {
            GoThemes.white.Plain.prototype.placeWhiteStone = oldPlaceWhiteStone;
            status = false;
            // click the theme selector which will trigger a redraw
            document.querySelector("div.theme-set div.selector").click();
        } else {
            console.log("[ogs one color mode] oldPlaceWhiteStone was null !!");
        }
    }

    function fetchGameNameAndToggle(gameId) {
        fetch(OGS_API + gameId,{
            "credentials": "include",
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            "referrer": window.location.href,
            "method": "GET",
            "mode": "cors"
        })
        .then(response => response.json())
        .then(data => {
            console.log("[ogs one color mode] got the data, name=", data.name);
            var name = data.name.toLowerCase();
            if (name.match(NAME_MATCHER)) {
                oneColorModeOn();
            } else {
                oneColorModeOff();
            }
        });
    };

    // set up the mutation observer
    var observer = new MutationObserver(function (mutations, me) {
        if (typeof data === "undefined" || typeof GoThemes === "undefined") {
            return;
        }
        if (oldPlaceWhiteStone === null) {
             oldPlaceWhiteStone = GoThemes.white.Plain.prototype.placeWhiteStone;
        }

        // Turn it off after a game finishes:
        if (document.title.match(/Game Finished/)) {
            oneColorModeOff();
            return;
        }

        // Turn it off if we navigate away from individual game page:
        var match = window.location.href.match(/game\/(\d+)/);
        if (!match) {
            oneColorModeOff();
            return;
        }

        if (match.length < 2) {
            console.log("[ogs one color mode] matched game URL but no game ID ??");
            return;
        }

        var gameId = match[1];
        if (gameId === null) {
            console.log("[ogs one color mode] matched game URL but null game ID ??");
            return;
        }

        if (OVERRIDE.includes(parseInt(gameId))) {
            oneColorModeOn();
            return;
        }

        if (lastGameId === gameId) {
            return;
        }
        lastGameId = gameId;
        fetchGameNameAndToggle(gameId);
    });

    // start observing
    observer.observe(document, {
        childList: true,
        subtree: true
    });
})();
