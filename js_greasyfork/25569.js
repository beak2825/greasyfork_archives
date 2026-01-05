// ==UserScript==
// @name         39thX Hit Watch
// @namespace    namespace
// @version      1.3.4
// @description  description
// @author       tos
// @match        *.torn.com/index.php*
// @match        *.torn.com/halloffame.php*
// @match        *.torn.com/factions.php?step=your*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25569/39thX%20Hit%20Watch.user.js
// @updateURL https://update.greasyfork.org/scripts/25569/39thX%20Hit%20Watch.meta.js
// ==/UserScript==

//Adjust the @match lines above to tell the script what pages to show on

APIkey = 'APIkey';  //YOUR API KEY HERE
prevMin = 60;  //HOW MANY MINUTES TO DISPLAY
apiSec = 15;  //INTERVAL BETWEEN API CALLS IN SECONDS
fontSizePref = '100%'; //ADJUST FONT SIZE VALUE MAY BE GREATER THAN 100%


timeNow = Math.floor(Date.now() / 1000);
activeTime = timeNow - (prevMin * 60);

//These are intended to be initialized blank
loggedAttacks = {};
retalIDs = [];
myFac = '';

buildChainerDiv();
activeWars();
function apiLoop(){
    findChainers();
    setTimeout(apiLoop, (apiSec * 1000));
}

//build container for output
function buildChainerDiv(){
    var container = document.querySelector('#mainContainer');
    var chainerDIV = document.createElement('div');
    chainerDIV.id = 'chainerDIV';
    chainerDIV.style.position = "absolute";
    chainerDIV.style.flexWrap = "wrap";
    chainerDIV.style.fontSize = fontSizePref;
    chainerDIV.style.left = '5px'; //  WHERE TO POSITION THE RESULTS
    chainerDIV.style.top = '100px'; //  THESE VALUES CAN BE ADJUSTED AS PERCENTS OR IN PIXELS AS FOLLOWS: '10px'
    container.append(chainerDIV);
    resizeDIV();
}

//Event Listener for window resize
var timeout = false;
window.addEventListener('resize', function() {
  clearTimeout(timeout);
  timeout = setTimeout(resizeDIV, 1000);
});

//Resize output container to fit screen
function resizeDIV(){
    var contentWrap = document.querySelector('.content');
    var mainContainer = document.querySelector('#mainContainer');
    var marginSpace = Math.trunc((contentWrap.offsetWidth - mainContainer.offsetWidth) / 2);
    var chainerDiv = document.getElementById('chainerDIV');
    var chainerwidth = (marginSpace - 5) +'px';  // Notice the minus 5 here if you adjusted the left positioning in line 39 change this to match
    chainerDiv.style.width = chainerwidth;
}


function activeWars(){
    var chainerDiv = document.querySelector('#chainerDIV');
    $.ajax({
        type: "POST",
        url: 'https://api.torn.com/faction/?&key='+APIkey,
        success: function (response) {
            myFac = response.ID.toString();
            retalIDs = Object.keys(response.wars);
            apiLoop();
        }
    });
}

//API call looking for new hits
function findChainers(){
    var chainerDiv = document.querySelector('#chainerDIV');
    $.ajax({
        type: "POST",
        url: 'https://api.torn.com/faction/?selections=attacks&key='+APIkey,
        success: function (response) {
            var attackKeys = Object.keys(response.attacks);
            for(i=0; i < attackKeys.length; i++){
                if(!(attackKeys[i] in loggedAttacks) && response.attacks[attackKeys[i]].timestamp_ended > activeTime){
                    loggedAttacks[attackKeys[i]] = response.attacks[attackKeys[i]];
                    printAttack(response.attacks[attackKeys[i]]);
                }
            }
        }
    });
}

//Format and prepend new attacks
function printAttack(response){
    var respect = '';
    var faction = '';
    var colorCode = '000000';
    var chainerDiv = document.getElementById('chainerDIV');
    if(response.respect_gain === 0 && response.attacker_faction === parseInt(myFac)){
        colorCode = 'aaaaaa';
    }else if(response.defender_faction === parseInt(myFac)){
        colorCode = 'ce8686';
        if(retalIDs.includes(response.attacker_faction.toString()) && response.result === 'Hospitalize'){
            colorCode = 'ff0000';
            faction = ' <a style="color:#'+ colorCode +';text-decoration:none;" href="/profiles.php?XID='+ response.attacker_id +'"><b> [RETAL '+ response.attacker_factionname +']</b></a>';
        }
    }
    if(response.respect_gain > 10){
        colorCode = '399757';
        respect = ' (+'+ response.respect_gain +')';
        faction = ' <a style="color:#'+ colorCode +';" href="/factions.php?step=profile&ID='+ response.defender_faction +'"><b> on '+ response.defender_factionname +'</b></a>';
    }
    var newAttack = document.createElement('span');
    newAttack.style.color = '#'+ colorCode;
    chainerDiv.prepend(newAttack);
    var attacker;
    if(response.attacker_name && response.attacker_id){
        attacker = ' <a style="text-decoration: none; color:#'+ colorCode +';" href="/profiles.php?XID='+ response.attacker_id +'"><b>'+ response.attacker_name +'</b></a> ';}
    else{
        attacker = ' "Someone" ';}

    newAttack.innerHTML = (new Date(response.timestamp_ended * 1000)).toUTCString().split(' ')[4] + attacker + response.result +
        ' <a style="text-decoration: none; color:#'+ colorCode +';" href="/profiles.php?XID='+ response.defender_id +'"><b>'+ response.defender_name +'</b></a>'+
        respect + faction +'<br /><br />';
}