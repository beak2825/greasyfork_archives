// ==UserScript==
// @name         MouseHunt - Spooky Shuffle Tracker
// @author       Rani Kheir
// @namespace    https://greasyfork.org/users/4271-rani-kheir
// @version      5.1
// @description  Play Spooky Shuffle more conveniently by keeping track of what you've already uncovered
// @include      https://www.mousehuntgame.com/
// @include      https://www.mousehuntgame.com/index.php
// @include      https://www.mousehuntgame.com/canvas*
// @include      https://www.mousehuntgame.com/camp.php*
// @include      https://www.mousehuntgame.com/inventory.php?tab=special
// @include      https://www.mousehuntgame.com/item.php?item_type=2014_spooky_shuffle_admission_ticket_stat_item
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34761/MouseHunt%20-%20Spooky%20Shuffle%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/34761/MouseHunt%20-%20Spooky%20Shuffle%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clearFields(length) {
        if (document.getElementById("card-hack-0")) {
            for (var i = 0; i < length; i++) {
                var ele = document.getElementById("card-hack-" + i);
                ele.style.color = "black";
                ele.firstChild.innerHTML = "-----";
            }
        }
    }

    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {
            try {
              var x = JSON.parse(this.responseText);
              //console.log(x);
            } catch (err) {
              return false;
            }

            if (x.memory_game != undefined) {
                var cards = x.memory_game.cards;
                var len = x.memory_game.cards.length;

                if (x.memory_game.is_complete === true) {
                    setTimeout(function(){ clearFields(len); }, 3000);
                }

                var board = document.getElementsByClassName("halloweenMemoryGame-content")[0];
                if (board) {
                    board.style.height = "510px";
                }

                // board set up already
                if (document.getElementById("card-hack-0")) {
                    for (var i = 0; i < len; i++) {
                        if (x.memory_game.cards[i].name !== null) {
                            var ele = document.getElementById("card-hack-" + i);
                            ele.style.color = "green";
                            ele.firstChild.innerHTML = x.memory_game.cards[i].name;
                        }
                    }
                // new game (or reloaded board), setting up placeholders
                } else {
                    for (var i = 0; i < len; i++) {
                        var divElement = document.createElement("Div");
                        divElement.id = "card-hack-" + i;
                        divElement.style.marginLeft = "12px";
                        divElement.style.textAlign = "center";
                        divElement.style.fontWeight = "bold";
                        divElement.style.fontSize = "smaller";
                        var paragraph = document.createElement("P");
                        var text = document.createTextNode("-----");
                        paragraph.appendChild(text);
                        divElement.appendChild(paragraph);
                        document.querySelector("[data-card-id='" + i + "']").appendChild(divElement);
                    }
                }
            }
        });
        origOpen.apply(this, arguments);
    };
})();