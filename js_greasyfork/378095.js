// ==UserScript==
// @author        Odd
// @description   Adds a cheat menu to Lyra's Escape!
// @include       http://www.neopets.com/desert/thelostheirloom/lyrasescape/*
// @name          Lyra's Escape Helper
// @namespace     Odd@Clraik
// @version       1.0
// @downloadURL https://update.greasyfork.org/scripts/378095/Lyra%27s%20Escape%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/378095/Lyra%27s%20Escape%20Helper.meta.js
// ==/UserScript==

(function () {

    if (typeof $ == "undefined") $ = unsafeWindow.$;

    $("body").prepend("<div id=\"lyrasEscapeHelper\" style=\"background: #cfcfcf; padding: 16px;\"><table style=\"text-align: center;\"><tr><td><br><b>-Lyra's Escape Helper-</b><br><br></td></tr><tr><td><table cellpadding=\"0\" cellspacing=\"0\" style=\"margin: 0 auto; text-align: left;\"><tr><td><b>Invincible:</b></td><td style=\"padding-left: 16px;\"><input id=\"lyrasEscapeHelperInvincible\" style=\"margin: 0;\" type=\"checkbox\"></td></tr></table></td></tr></table></div>");

    var intervalID;
    var invincible = $("#lyrasEscapeHelperInvincible");

    function apply() {

        if (typeof ig !== undefined && ig.game) {

            ig.game.invincible = (invincible.prop("checked") || false);
        }
    }

    //GreaseMonkey compatible change
    document.getElementById(invincible.attr("id"))
        .addEventListener("change", function () {

            apply();
        });

    intervalID = setInterval
    (

        function () {

            if (typeof ig !== undefined && ig.game) {

                if (intervalID) {

                    clearInterval(intervalID);

                    intervalID = null;

                    apply();
                }
            }
        },
        500
    );
})();