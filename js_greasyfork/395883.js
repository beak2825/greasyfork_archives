// ==UserScript==
// @name         Corsette
// @namespace    http://tampermonkey.net/
// @version      0.1.2.3
// @description  PnW tools by Rosey Song
// @author       Rosey Song
// @match        https://politicsandwar.com/*
// @grant        GM_setvalue
// @grant        GM_getvalue
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/395883/Corsette.user.js
// @updateURL https://update.greasyfork.org/scripts/395883/Corsette.meta.js
// ==/UserScript==

$('div').eq(12).remove();

$(document).ready(function () {
    var hashParams = window.location.hash.substring(1).split('&');

    var key = '';

    //Adds Combat Strike Information
    if (document.URL.includes('nation/war/groundbattle') || document.URL.includes('nation/war/airstrike') || document.URL.includes('nation/war/navalbattle')) {
        var atkscore = $("td").eq(4).text().trim().replace(',','');
        var defscore;

        //Adds popup window to display information
        displayBuilder();

        //Sets the defensive army value
        if (document.URL.includes('groundbattle')) defscore = $("td").eq(12).text().trim().replace(',','');
        if (document.URL.includes('airstrike')) defscore = $("td").eq(19).text().trim().replace(',','');
        if (document.URL.includes('navalbattle')) defscore = $("td").eq(11).text().trim().replace(',','');

        //Converts attacker and defender army values into ints for the Battle Calc function
        atkscore = parseInt(atkscore,10);
        defscore = parseInt(defscore,10);

        var result = battlecalc(atkscore, defscore);

        //Displays the information in the popup
        var displayText = document.createElement("p");
        displayText.innerHTML = "Immense Triumph: " + result[0] + "%<br>Moderate Success: " + result[1] + "%<br>Pyhric Victory: " + result[2] + "%<br>Utter Failure: " + result[3] + "%";
        $("#display").append(displayText);
    }

    if (document.URL.includes('nation/id')) {
        var id = document.URL.split('=')[1];

        fetch('https://politicsandwar.com/api/alliance-members/?allianceid=' + 7346 + '&key=' + key)
            .then((response) => {
                return response.json();
            })
            .then((alliancejson) => {
                //Searches the json for the nation user is on
                var nation = alliancejson.nations;
                for(var i = 0; i < nation.length; i++) if (nation[i].nationid == id) return nation[i];
            })
            .then((nation) => {
                //Sorts resource values into an object for easier access.
                var warchest = {
                    'cash':nation.money,
                    'aluminum':nation.aluminum,
                    'steel':nation.steel,
                    'gasoline':nation.gasoline,
                    'munitions':nation.munitions
                };

                ///TODO: Move this into an array for loop
                //Builds the table to display for user
                var header = document.createElement('tr');
                header.innerHTML = '<tr><th colspan="2"><i class="fa fa-university" aria-hidden="true"></i> Alliance Information</th></tr>';

                var money = document.createElement('tr');
                money.innerHTML = '<td width="43%">Cash Amount: </td><td>$' + warchest.cash.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td></tr>';

                var aluminum = document.createElement('tr');
                aluminum.innerHTML = '<td>Aluminum Amount: </td><td>' + warchest.aluminum.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td></tr>';

                var steel = document.createElement('tr');
                steel.innerHTML = '<td>Steel Amount: </td><td>' + warchest.steel.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td></tr>';

                var gasoline = document.createElement('tr');
                gasoline.innerHTML = '<td>Gasoline Amount: </td><td>' + warchest.gasoline.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td></tr>';

                var munitions = document.createElement('tr');
                munitions.innerHTML = '<td>Munitions Amount: </td><td>' + warchest.munitions.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td></tr>';


                $('tr').eq(0).before(header, money, aluminum, steel, gasoline, munitions);
            })
            .catch();
    }
    if (document.URL.includes('&display=bank')) {
        for(var i = 0; i < hashParams.length; i++){
            var p = hashParams[i].split('=');
            $('[name="' + p[0] + '"]').val(p[1])
        }
    }
});

function displayBuilder () {
    var display = $("<div id=\"display\"></div>");
    $('body').append(display);
    $('#display').css({
        'background-color': 'grey',
        'color': 'white',
        'height': '100px',
        'width': '280px',
        'position': 'fixed',
        'top': '5px',
        'left': '5px',
        'border-radius':'5px',
        'border':'5px solid grey'
    });
}

function battlecalc (attackerNum, defenderNum) {
    var utterFailure = 0;
    var pyhriccVictory = 0;
    var moderateSuccess = 0;
    var immenseTriumph = 0;

    for (var i = 0; i < 500; i++) {
        var winCount = 0;
        for (var j = 0; j < 3; j++) {
            var attackScore = parseInt(attackerNum, 10) * battleRNG();
            var defendScore = parseInt(defenderNum, 10) * battleRNG();

            if (attackScore > defendScore) {
                winCount++;
            }
            console.log("Scores: " + attackScore + " " + defendScore);
        }
        switch (winCount) {
            case 0:
                utterFailure++;
                break;
            case 1:
                pyhriccVictory++;
                break;
            case 2:
                moderateSuccess++;
                break;
            case 3:
                immenseTriumph++;
                break;
        }
    }
    var percents = [immenseTriumph/5,moderateSuccess/5,pyhriccVictory/5,utterFailure/5];
    return percents;
}

function battleRNG () {
    var result = 1 - (Math.random() * 60 / 100);
    return result;
}