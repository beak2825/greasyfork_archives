// ==UserScript==
// @name         Active Chainers
// @namespace    namespace
// @version      0.1
// @description  description
// @author       tos
// @match        *.torn.com/index.php*
// @match        *.torn.com/halloffame.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25353/Active%20Chainers.user.js
// @updateURL https://update.greasyfork.org/scripts/25353/Active%20Chainers.meta.js
// ==/UserScript==

APIkey = 'APIKEY';

timeNow = Math.floor(Date.now() / 1000);
activeTime = timeNow - 600;

buildChainerDiv();
findChainers();

function buildChainerDiv(){
    container = document.querySelector('#mainContainer');
    chainerDIV = document.createElement('div');
    chainerDIV.style.position = "absolute";
    chainerDIV.style.left = '2%';
    chainerDIV.style.top = '12%';
    chainerDIV.id = 'chainerDIV';
    container.append(chainerDIV);
}

function findChainers(){
    var chainerDiv = document.querySelector('#chainerDIV');
    $.ajax({
        type: "GET",
        url: 'https://api.torn.com/faction/16312?selections=attacks&key='+APIkey,
        success: function (response) {
            var attackKeys = Object.keys(response.attacks);
            for(i=attackKeys.length - 1; i >= 0; i--){
                if(response.attacks[attackKeys[i]].attacker_faction === 16312 && response.attacks[attackKeys[i]].timestamp_ended > activeTime && response.attacks[attackKeys[i]].respect_gain > 0){
                    console.log(response.attacks[attackKeys[i]].attacker_name);
                    var activeChainer = document.createElement('span');
                    if(response.attacks[attackKeys[i]].respect_gain > 10){activeChainer.style.color = 'green';}
                    chainerDiv.append(activeChainer);
                    activeChainer.innerHTML = '<b>' + response.attacks[attackKeys[i]].attacker_name + '</b> ' +
                        ((timeNow - response.attacks[attackKeys[i]].timestamp_ended)/60).toFixed(1) + ' minutes ago<br />';
                }
                if(response.attacks[attackKeys[i]].attacker_faction === 16312 && response.attacks[attackKeys[i]].timestamp_ended > activeTime && response.attacks[attackKeys[i]].respect_gain === 0){
                    console.log(response.attacks[attackKeys[i]].attacker_name);
                    var badHit = document.createElement('span');
                    badHit.style.color = 'red';
                    chainerDiv.append(badHit);
                    badHit.innerHTML = '<b>' + response.attacks[attackKeys[i]].attacker_name + '</b> ' +
                        ((timeNow - response.attacks[attackKeys[i]].timestamp_ended)/60).toFixed(1) + ' minutes ago ' +
                        '<b>' + response.attacks[attackKeys[i]].result +'</b><br />';
                }
            }
        }
    });
}
