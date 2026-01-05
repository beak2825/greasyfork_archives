// ==UserScript==
// @name         Faction Hit Watch
// @namespace    namespace
// @version      0.1
// @description  description
// @author       tos
// @match        *.torn.com/factions.php?step=your*
// @match        *.torn.com/index.php
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/29982/Faction%20Hit%20Watch.user.js
// @updateURL https://update.greasyfork.org/scripts/29982/Faction%20Hit%20Watch.meta.js
// ==/UserScript==

GM_addStyle('#chainerDIV a {'+
            'text-decoration: none;'+
            'color:inherit;'+
            'font-weight: bold;}'+
            
            '#chainerDIV li {'+
            'padding: 2px 5px 3px 5px;}'+
            
            '.incoming-hit {'+
            'color: #9a9a9a;}'+
            
            '.outgoing-hit {'+
            'color: #9a9a9a;}'+
            
            '.chain-hit {'+
            'color: #000000;}'+
            
            '.bonus-event {'+
            'color: #4d7c1e;'+
            'font-size: 110%;'+
            'font-weight: 500;}'
           );

const APIkey = 'APIKEY';  //YOUR API KEY HERE
const prevMin = 60;  //HOW MANY MINUTES TO DISPLAY
const apiSec = 6;  //INTERVAL BETWEEN API CALLS IN SECONDS



const timeNow = Math.floor(Date.now() / 1000);
const activeTime = timeNow - (prevMin * 60);
var last_chain_hit = activeTime;
var chain_count = 0;

//These are intended to be initialized blank
var loggedAttacks = {};
var retalIDs = [];
var myFac = '';

buildChainerDiv();
prefillChainerDIV();



//build container for output
function buildChainerDiv(){
    var container = document.querySelector('.content');
    var mainContainer = document.querySelector('#mainContainer');
    
    var chainerDIV = document.createElement('div');
    chainerDIV.id = 'chainerDIV';
    chainerDIV.style.position = "absolute";
    chainerDIV.style.flexWrap = "wrap";
    
    //var prev_min_INPUT = document.createElement('INPUT');
    //chainerDIV.append(prev_min_INPUT);
    
    var hitList = document.createElement('UL');
    hitList.id = 'hit-list';
    hitList.style.listStyle = 'none';
    chainerDIV.append(hitList);
    container.insertBefore(chainerDIV, mainContainer);
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
    var chainerwidth = marginSpace +'px';
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
            setTimeout(findChainers, (apiSec * 1000));
        }
    });
}

//API call looking for new hits
function prefillChainerDIV(){
    $.ajax({
        type: "POST",
        url: 'https://api.torn.com/faction/?selections=attacknewsfull&key='+APIkey,
        success: function (response) {
            parseAttackNews(response);
            activeWars();
        }
    });
}
function findChainers(){
    $.ajax({
        type: "POST",
        url: 'https://api.torn.com/faction/?selections=attacknews&key='+APIkey,
        success: function (response) {
            parseAttackNews(response);
            setTimeout(findChainers, (apiSec * 1000));
        }
    });
}
function parseAttackNews(res) {
    var attackKeys = Object.keys(res.attacknews);
    for(i=0; i < attackKeys.length; i++){
        if(res.attacknews[attackKeys[i]].timestamp > activeTime){
            if(!(attackKeys[i] in loggedAttacks)){
                    loggedAttacks[attackKeys[i]] = res.attacknews[attackKeys[i]];
                    printAttack(res.attacknews[attackKeys[i]]);
                }
        }
    }
}

//Format and prepend new attacks
function printAttack(response){
    var hit_list = document.getElementById('hit-list');
    var timestamp = response.timestamp;
    //console.log(timestamp);
    var news = response.news;
    
    var new_LI = document.createElement('LI');
    new_LI.innerHTML = (new Date(timestamp * 1000)).toUTCString().split(' ')[4] + ' ' + news;
    new_LI.className = 'outgoing-hit';
    //new_LI.style.padding = '2px 5px 3px 5px';
    
    if (timestamp - last_chain_hit > 300) {
        chain_count = 0;
    }
    if (news.includes('Chain #')) {
        chain_count = parseInt(news.split('#')[1].split(' ')[0]);
    }
    if (news.includes('respect)') && !news.includes('Chain #')) {
        last_chain_hit = timestamp;
        //console.log('hit:', chain_count, 'last_active:', res.attacknews[attackKeys[i]].timestamp - last_chain_hit);
    }
    
    if (news.includes('respect)') && !news.includes('Chain #')) {
        new_LI.className = 'chain-hit';
        new_LI.innerHTML = chain_count.toString()+ ' - '+ (new Date(timestamp * 1000)).toUTCString().split(' ')[4] + ' ' + news;
        //console.log('chain@:', chain_count, ' - ', news, ' = ', timestamp - last_chain_hit);
        chain_count += 1;
    }
    else if (news.includes('Chain #')) {
        new_LI.className = 'bonus-event';
        new_LI.innerHTML = news;
    }
    else {
        //console.log('chain@:', chain_count, ' - ', news, ' = ', timestamp - last_chain_hit);
    }
    hit_list.prepend(new_LI);
}





