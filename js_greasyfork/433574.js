// ==UserScript==
// @name         Fix xyzzy Img tags
// @namespace    http://tampermonkey.net/
// @version      1.32
// @description  This is a quick fix for xyzzy.clrtd.com to get pictures to show up on custom cards.
// @author       Kevinf100
// @match        https://xyzzy.clrtd.com/zy/game.jsp
// @icon         https://www.google.com/s2/favicons?domain=clrtd.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433574/Fix%20xyzzy%20Img%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/433574/Fix%20xyzzy%20Img%20tags.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        function fix_image_tags() {
            var card_text_array = document.getElementsByClassName("card_text");
            for (var i = 0; i < card_text_array.length; i++)
            {
                if (card_text_array[i].innerHTML.search("\\[img\\]") != -1)
                {
                    var changed_text = card_text_array[i].innerHTML.replace("[img]", "<img src=\"");
                    changed_text = changed_text.replace("[/img]", "\" width=\"100%\" height=\"80%\">");
                    if (changed_text[changed_text.length - 1] === ".")
                    {
                        changed_text = changed_text.slice(0, -1);
                    }
                    card_text_array[i].innerHTML = changed_text;
                }
            }
        }

        cah.Game.prototype.orginal_dealtCards = cah.Game.prototype.dealtCards;

        cah.Game.prototype.dealtCards = function(cards) {
            this.orginal_dealtCards(cards);
            fix_image_tags();
        }

        cah.Game.prototype.orginal_setRoundWhiteCards = cah.Game.prototype.setRoundWhiteCards;

        cah.Game.prototype.setRoundWhiteCards = function(cardSets) {
            this.orginal_setRoundWhiteCards(cardSets);
            fix_image_tags();
        }
        $(".your_hand").html("Your Hand With Images");
    }, false);
})();