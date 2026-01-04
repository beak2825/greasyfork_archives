// ==UserScript==
// @name         Food Club Quick Bet Links
// @version      0.3
// @description  Get rich
// @author       ben (mushroom)
// @match        https://www.grundos.cafe/games/foodclub/current_bets
// @icon         https://www.google.com/s2/favicons?domain=grundos.cafe
// @grant        none
// @namespace https://greasyfork.org/users/727556
// @downloadURL https://update.greasyfork.org/scripts/449515/Food%20Club%20Quick%20Bet%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/449515/Food%20Club%20Quick%20Bet%20Links.meta.js
// ==/UserScript==

function encodeQueryData(data) {
   const ret = [];
   for (let d in data)
     ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
   return ret.join('&');
}


(function() {
    'use strict';

    // PREPARE TEXT BOX
    var textBox = document.createElement('textarea')
    document.getElementById('current_bets').insertAdjacentElement('afterend', textBox)
    textBox.value = 'Quick Links to your FC Bets:\r\n\r\n'
    textBox.style.width = '500px'
    textBox.style.height = '200px'

    var pirate_dict = {
        "Scurvy Dan the Blade": 1,
        "Young Sproggie": 2,
        "Orvinn the First Mate": 3,
        "Lucky McKyriggan": 4,
        "Sir Edmund Ogletree": 5,
        "Peg Leg Percival": 6,
        "Bonnie Pip Culliford": 7,
        "Puffo the Waister": 8,
        "Stuff-A-Roo": 9,
        "Squire Venable": 10,
        "Captain Crossblades": 11,
        "Ol Stripey": 12,
        "Ned the Skipper": 13,
        "Fairfax the Deckhand": 14,
        "Gooblah the Grarrl": 15,
        "Franchisco Corvallio": 16,
        "Federismo Corvallio": 17,
        "Admiral Blackbeard": 18,
        "Buck Cutlass": 19,
        "The Tailhook Kid": 20
    }

    // Initialize array of quick links
    var quick_links = []

    // Grab each td
    var bets = document.getElementsByName('fc_bet_info')

    for (var i=0; i<bets.length; i++){

        // Bet data
        var bet_data = {}

        // Create bet array
        var bet_array = bets[i].innerText.split('\n')
        bet_array.pop()

        for (var j=0; j<bet_array.length; j++){


            // Split bet string
            var individual_bet = bet_array[j].split(': ')

            if (individual_bet[0] == 'Shipwreck'){
                bet_data['bet1'] = pirate_dict[individual_bet[1]]
            }
            if (individual_bet[0] == 'Lagoon'){
                bet_data['bet2'] = pirate_dict[individual_bet[1]]
            }
            if (individual_bet[0] == 'Treasure Island'){
                bet_data['bet3'] = pirate_dict[individual_bet[1]]
            }
            if (individual_bet[0] == 'Hidden Cove'){
                bet_data['bet4'] = pirate_dict[individual_bet[1]]
            }
            if (individual_bet[0] == 'Harpoon Harry\'s'){
                bet_data['bet5'] = pirate_dict[individual_bet[1]]
            }

        }

        textBox.value += (i+1) + ' - https://www.grundos.cafe/games/foodclub/bet?' + encodeQueryData(bet_data) + '\r\n'
        console.log('https://www.grundos.cafe/games/foodclub/bet?' + encodeQueryData(bet_data))

    }
})();