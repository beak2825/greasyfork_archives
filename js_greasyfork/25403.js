// ==UserScript==
// @name         39thX Active Chainers
// @namespace    namespace
// @version      0.4
// @description  prints Active chainers on the left (API call every 10 seconds)
// @author       tos
// @match        *.torn.com/index.php*
// @match        *.torn.com/halloffame.php*
// @match        *.torn.com/factions.php?step=your*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25403/39thX%20Active%20Chainers.user.js
// @updateURL https://update.greasyfork.org/scripts/25403/39thX%20Active%20Chainers.meta.js
// ==/UserScript==

APIkey = 'APIKEY';  //YOUR API KEY HERE

timeNow = Math.floor(Date.now() / 1000);
activeTime = timeNow - 600; //LENGTH OF TIME TO BE CONSIDERED ACTIVE IN SECONDS
loggedAttacks = {};

buildChainerDiv();
tenSecLoop();
function tenSecLoop(){
    findChainers();
    setTimeout(tenSecLoop, 10000);  //TIMEOUT FOR API CALL IN MILLISECONDS
}


function buildChainerDiv(){
    container = document.querySelector('#mainContainer');
    var chainerDIV = document.createElement('div');
    chainerDIV.style.position = "absolute";
    chainerDIV.style.left = '2%'; //  WHERE TO POSITION THE RESULTS
    chainerDIV.style.top = '12%'; //  THESE VALUES CAN BE ADJUSTED AS PERCENTS OR IN PIXELS AS FOLLOWS: '10px'
    chainerDIV.id = 'chainerDIV';
    container.append(chainerDIV);
}

function findChainers(){
    var chainerDiv = document.querySelector('#chainerDIV');
    $.ajax({
        type: "GET",
        url: 'https://api.torn.com/faction/16312?selections=attacks&key='+APIkey,
        success: function (response) {
            console.log('API call made');
            var attackKeys = Object.keys(response.attacks);
            for(i=0; i < attackKeys.length; i++){
                if(!(attackKeys[i] in loggedAttacks)){
                    loggedAttacks[attackKeys[i]] = response.attacks[attackKeys[i]];
                    printAttack(response.attacks[attackKeys[i]]);
                }
            }
        }
    });
}

function printAttack(response){
    var chainerDiv = document.getElementById('chainerDIV');
    if(response.attacker_faction === 16312 && response.timestamp_ended > activeTime && response.respect_gain > 0){
        var activeChainer = document.createElement('span');
        chainerDiv.prepend(activeChainer);
        if(response.respect_gain > 10){
            activeChainer.style.color = 'green';
            activeChainer.innerHTML = (new Date(response.timestamp_ended * 1000)).toUTCString().split(' ')[4] +
                ' <b>' + response.attacker_name + '</b> (+'+ response.respect_gain + ') on <b>' + response.defender_factionname + '</b><br />';
        }
        else{
            activeChainer.innerHTML = (new Date(response.timestamp_ended * 1000)).toUTCString().split(' ')[4] +
                ' <b>' + response.attacker_name + '</b><br />';
        }
    }
    if(response.attacker_faction === 16312 && response.timestamp_ended > activeTime && response.respect_gain === 0){
        var badHit = document.createElement('span');
        badHit.style.color = '#aaaaaa';
        chainerDiv.prepend(badHit);
        badHit.innerHTML = (new Date(response.timestamp_ended * 1000)).toUTCString().split(' ')[4] +
            ' <b>' + response.attacker_name + '</b> ' + '<b>' + response.result +'</b> ' +
            '<a style="color:#aaaaaa" href="https://www.torn.com/profiles.php?XID=' + response.defender_id + '">' + response.defender_name + '</a><br />';
    }
    if(response.defender_faction === 16312 && response.timestamp_ended > activeTime && response.result === 'Hospitalize' &&response.attacker_factionname === 'MMCP'){
        var retal = document.createElement('a');
        retal.style.color = '#AD4024';
        retal.href = 'https://www.torn.com/profiles.php?XID='+response.attacker_id;
        chainerDiv.prepend(retal);
        retal.innerHTML = (new Date(response.timestamp_ended * 1000)).toUTCString().split(' ')[4] +
            ' <b>' + response.attacker_name + '</b> ' + response.result + ' <b>'+ response.defender_name + '</b><br />';
    }
}
