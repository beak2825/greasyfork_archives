// ==UserScript==
// @namespace   dex.gos
// @name        Gates of Survival - Boost Box Maintainer
// @description Does stuff with the collapsable boost box in the game. Right now that just means saving, and continuously re-applying, the collapsed (or not) state of the box.
// @include     https://www.gatesofsurvival.com/game/index.php?page=main
// @grant       none
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/392648/Gates%20of%20Survival%20-%20Boost%20Box%20Maintainer.user.js
// @updateURL https://update.greasyfork.org/scripts/392648/Gates%20of%20Survival%20-%20Boost%20Box%20Maintainer.meta.js
// ==/UserScript==

// The game does everything by AJAX requests, so the standard way to make the script only run on certain pages doesn't apply. Use this to hook into each AJAX call and make the
// script run each time the correct "page" loads.
function callbackIfPageMatched(matchUrlRegEx, callback) {
    $(document).ajaxSuccess(
        function(event, xhr, settings) {
            var result = matchUrlRegEx.exec(settings.url);
            if(result != null) {
                callback();
            }
        }
    );
}


var GoS_BoostBox = {
    logging: false,
    collapsed: true,
    logText: function (text) {
        if (GoS_BoostBox.logging) {
            console.log("dex.gos.boostBox    " + text);
        }
    },
    setSavedState: function() {
        // Unfortunately, because something like this isn't running in the game's PHP code, and because the HTML is
        // loaded with a jQuery "load" call, there is no way to modify the HTML to be correct before the browser
        // displays it. This can only react to the page/HTML change and then quickly apply its change right after,
        // which means there is still a noticeable effect of the page loading and then the box expanding.
        let buttons = $("#page2 button.collapsible")
        buttons.each(function() {
            let button = $(this);
            if (button.text() == "Show Activated Game Boost(s)") {
                // Found the correct button.
                GoS_BoostBox.logText("Found the boost box button.");

                // The game loads the box collapsed by default, so if that was the last saved state, then do nothing.
                // However, if the last saved state was uncollapsed, apply the uncollapsed settings to the button and
                // the associated div by simulating a click on the button so the associated JavaScript can run and do
                // its thing (instead of recreating the CSS changes, which could be done, though it would be easier
                // if this was just using a "display: none" setting to toggle on and off instead of needing to know
                // what the element height should be and setting it to that).
                if (!GoS_BoostBox.collapsed) {
                    button.trigger("click");
                    GoS_BoostBox.logText("Expanded the boost box.");
                }

                // Now that that potential click is over, attach a second on-click even that will toggle the "collapsed"
                // setting of this object (via the saveState method) when the button is clicked.
                button.click(function() {
                    GoS_BoostBox.saveState(!GoS_BoostBox.collapsed);
                });
            }
        });
    },
    saveState: function(newState) {
        // If this was part of the official game, this would be an independant method that would make an equivalent AJAX call back
        // to the server to store the new default state in the user's PHP session.
        // Since this is a user script, it has to store it locally in this object instead.
        GoS_BoostBox.collapsed = newState;
        let boostBoxState = {collapsed: GoS_BoostBox.collapsed};
        let boostBoxStateString = JSON.stringify(boostBoxState);
        localStorage.dex_gos_boostBoxState = boostBoxStateString;
    },
    start: function () {
        let boostBoxStateString = localStorage.getItem("dex_gos_boostBoxState");
        GoS_BoostBox.logText("Stringified boostBoxStateString from storage: " + boostBoxStateString);

        if (boostBoxStateString != null) {
            let boostBoxState = JSON.parse(boostBoxStateString);
            GoS_BoostBox.collapsed = boostBoxState.collapsed;
        }
    }
};


GoS_BoostBox.start();
callbackIfPageMatched(/^fight.php/i, GoS_BoostBox.setSavedState);
callbackIfPageMatched(/^skills.php/i, GoS_BoostBox.setSavedState);
