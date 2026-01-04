// ==UserScript==
// @name         Board Game Arena Games Tab Create Table button
// @namespace    https://boardgamearena.com
// @version      0.3
// @description  adds a create table button to each game in the game list so you don't have to use the crappy play now section
// @author       ArmBandito
// @match        https://boardgamearena.com/*
// @match        https://*.boardgamearena.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419719/Board%20Game%20Arena%20Games%20Tab%20Create%20Table%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/419719/Board%20Game%20Arena%20Games%20Tab%20Create%20Table%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Select the node that will be observed for mutations
    const targetNode = document.getElementById("main-content");
    if(targetNode != null){
        // Options for the observer (which mutations to observe)
        const config = {childList: true,};
        //const config = { attributes: false, childList: true, subtree: false };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(pageChange);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);

        //this is for the game info page when we directly load a single game page
        const gametargetNode = document.getElementById("play_game_buttons");
        GameInfoPlay(gametargetNode);
    }
})();

//on page change do our work
function pageChange () {

    //loop throught game rows and increase the height to accomadate for new button
    var gameslistrows = document.querySelectorAll('.gamelist_itemrow');
    for(var gamerow of gameslistrows.values()) {
        gamerow.style.height = "275px";
    }

    //loop through list of games, and create a "create table" button for each
    var gameslist = document.querySelectorAll('.gamelist_item');
    for(var game of gameslist.values()) {
        game.style.height = "240px";
        var btn = document.createElement("button");
        btn.innerHTML = "Create Table";
        btn.classList.add("bgabutton");
        btn.classList.add("bgabutton_blue");
        btn.style.textAlign = "center";
        btn.style.marginLeft = "5%";
        btn.style.marginRight = "5%";
        btn.style.marginTop = "10px";
        btn.style.marginBottom = "10px";
        btn.style.width = "90%";
        btn.addEventListener("click", createGameTable);

        game.appendChild(btn);
    }


    //this is for the game info page when we click on a single game when the page is already loaded
    const info_play_game = document.getElementById("play_game_buttons");
    GameInfoPlay(info_play_game);

}

function GameInfoPlay(element){
    if(element != null){
        var btn = document.createElement("button");
        btn.innerHTML = "Create Table";
        btn.classList.add("bgabutton");
        btn.classList.add("bgabutton_big");
        btn.classList.add("bgabutton_blue");

        btn.addEventListener("click", createGameTable);

        element.appendChild(btn);
    }
}

//when the creat table button for a game is pressed fire off a request for a new table
function createGameTable(){
    //grab game id
    var game_id = this.parentNode.id.split("_");
    //two different sources of game id whether or not there is currently a filter
    if(game_id.length == 4){
        game_id = game_id[3];
    }else{
        game_id = game_id[4];
    }

    if(game_id == null){
        // if game id wasn't found in parent then we're on the single game page
        const single_game_id = document.getElementById("game_id");
        game_id = single_game_id.innerText;
    }

    //send async request for a new table
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            createTableResponse(JSON.parse(xmlHttp.responseText));
        }
    }
    xmlHttp.open("GET", window.location.origin + "/table/table/createnew.html?game=" + game_id, true);
    xmlHttp.send(null);
}

function createTableResponse(resonse){
    console.log(resonse);
    if(resonse.status == 1){
        window.location = window.location.origin + "/table?table=" + resonse.data.table;
    }
    else{
        alert("Failed to create table: " + resonse.error);
    }
}
