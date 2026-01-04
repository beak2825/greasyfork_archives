// ==UserScript==
// @name         4-5x opps
// @version      1.337
// @namespace    oof
// @description  void bd fight
// @license      MIT
// @author       Jay
// @match        *://*.neopets.com/dome/arena.phtml*
// @match        *://*.neopets.com/dome/fight.phtml*
// @downloadURL https://update.greasyfork.org/scripts/544963/4-5x%20opps.user.js
// @updateURL https://update.greasyfork.org/scripts/544963/4-5x%20opps.meta.js
// ==/UserScript==

var abilityToUseFirst = 21; // First Turn, Lens Flare
var FirstTurnWeapon1 = "Super Attack Pea";
var FirstTurnWeapon2 = "Obsidian Scorchstone";

var time = 2000;

// Function to generate a random delay between min and max milliseconds
function randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

if (document.URL.indexOf("dome/arena.phtml") != -1) {
    $(document).ready(function(){
        $("[id='start']").click();
        try {
            setTimeout(function(){ ability(abilityToUseFirst); }, 2000); // Fixed delay
        } catch(e) {}
        setTimeout(function(){ equip(); }, 2500); // Fixed delay
        setTimeout(function(){ fight(); }, randomDelay(2900, 3500)); // Random delay
    });
}

function ability(ability) {
    $("[id='p1am']").click();
    $("[data-ability='" + ability + "']").click();
}

function fight() {
    var slotw1 = document.getElementsByClassName("menu p1")[0].innerHTML;
    var slotw2 = document.getElementsByClassName("menu p1")[1].innerHTML;
    var slota = document.getElementsByClassName("menu p1")[2].innerHTML;

    if (slotw1.includes("background-image") || slotw2.includes("background-image")) {
        var fightButton = $("[id='fight']");
        fightButton.click();
        setTimeout(function() {
            // Retry if fight didn’t trigger
            if (document.URL.indexOf("fight.phtml") === -1) { // Check if still on arena.phtml
                fightButton.click();
            }
            setTimeout(function(){ enemyHP(); }, randomDelay(2000, 3000)); // Random delay
        }, randomDelay(2000, 3000)); // Random delay
    } else {
        equip();
        setTimeout(function(){ fight(); }, randomDelay(2000, 3000)); // Random delay
    }
}

function enemyHP() {
    var p1hp = document.getElementById("p1hp").outerHTML.toString();
    if (p1hp.includes('id="p1hp">0</div>')) {
        alert("You were defeated :c");
    }
    var p2hp = document.getElementById("p2hp").outerHTML.toString();
    if (p2hp.includes('id="p2hp">0</div>')) {
        finish();
    }
}

function equip() {
    document.getElementsByClassName("menu p1")[0].click();
    try {
        document.querySelector('img[alt="' + FirstTurnWeapon1 + '"]').click();
    } catch(e) {
        document.querySelector('img[title="' + FirstTurnWeapon1 + '"]').click();
    }
    if (FirstTurnWeapon2 !== "") {
        document.getElementsByClassName("menu p1")[1].click();
        try {
            document.querySelector('img[alt="' + FirstTurnWeapon2 + '"]').click();
        } catch(e) {
            document.querySelector('img[title="' + FirstTurnWeapon2 + '"]').click();
        }
    }
}

function finish() {
        setTimeout(function() {
            var playAgain = document.getElementById('bdplayagain');
            if (playAgain) {
                playAgain.click();
                setTimeout(function() {
                    // Retry if still on fight.phtml (fight didn’t restart)
                    if (document.URL.indexOf("arena.phtml") === -1) {
                        playAgain.click();
                    }
                }, randomDelay(1700, 1300)); // Random delay for retry
            } else {
                // Retry once after an additional delay if "Play Again" not found initially
                setTimeout(function() {
                    playAgain = document.getElementById('bdplayagain');
                    if (playAgain) {
                        playAgain.click();
                    }
                }, randomDelay(1700, 1300)); // Random delay for retry
            }
    }, randomDelay(1700, 1300)); // Initial delay before starting the finish sequence
}