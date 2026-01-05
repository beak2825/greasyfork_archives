// ==UserScript==
// @namespace       dex.gos
// @name            Gates of Survival - Hide "Eat" Button
// @description     Hides the "Eat Another X" button when the screen already reports that you have zero of X left. Also hides the button if your health is already full.
// @include         https://www.gatesofsurvival.com/game/index.php?page=main
// @grant           none
// @version         1.3
// @downloadURL https://update.greasyfork.org/scripts/20817/Gates%20of%20Survival%20-%20Hide%20%22Eat%22%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/20817/Gates%20of%20Survival%20-%20Hide%20%22Eat%22%20Button.meta.js
// ==/UserScript==

// The game does everything by AJAX requests, so the standard way to make the script only run on certain pages doesn't apply. Use this to hook into each AJAX call and make the
// script run each time the correct "page" loads.
function callbackIfPageMatched(matchUrlRegEx, callback) {
    $(document).ajaxSuccess(
        function(event, xhr, settings) {
            var result = matchUrlRegEx.exec(settings.url);
            if(result != null) {
                // Wait 250 milliseconds before calling the function so that the page has hopefully had time to update.
                window.setTimeout(callback, 250);
            }
        }
    );
}

function eatLogic() {
    var hideButton = false;
    
    // Get the html of the "page" as a string.
    var pageContent = $("#page > center").html();
    // Look for the amount of food item remaining.
    var rgxFood = /still have <b>(\d*,?\d+).*?<\/b> remaining/i;
    var result = rgxFood.exec(pageContent);
    if (result != null && result[1] == 0) {
        // None of this food is left.
        hideButton = true;
    }
    
    // Also check for full health.
    var rgxHealth = /<b>Current Health<\/b>:\s*(\d+)\s*\/\s*(\d+)/i;
    var result = rgxHealth.exec(pageContent);
    if (result != null) {
        var curHlth = parseInt(result[1].replace(/,/g, ""), 10);
        var maxHlth = parseInt(result[2].replace(/,/g, ""), 10);
        if (curHlth >= maxHlth) {
            // Health is full
            hideButton = true;
        }
    }
    
    if (hideButton) {
        // Either there is no food left, or the player's health is full. Either way, hide the "Eat another X" button.
        var btn = $("#page div#form");
        btn.remove();
    }
}


// Some ajax responses (those that are fronted by "exploration") cause jQuery to be reloaded. This invalidates all of the handlers this script sets up.
// This workaround checks for that situation and re-sets up the script. To keep things simpler, it is also used for the first load of the script.
jQueryCheck();

function jQueryCheck() {
    if (typeof $.dex_eat_jQueryCheck == "undefined") {
        // jQuery has been reloaded (or this is the script's first run).
        // Redo the handlers from this script.
        callbackIfPageMatched(/^heal.php/i, eatLogic);
        
        $.dex_eat_jQueryCheck = true;
        $(document).ajaxComplete(
            function(event, xhr, settings) {
                // Wait 250 milliseconds before calling the function so that the page has hopefully had time to finish fetching the new jQuery if it was directed to.
                window.setTimeout(jQueryCheck, 250);
            }
        );
    }
}