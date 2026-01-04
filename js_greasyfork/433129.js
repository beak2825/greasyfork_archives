// ==UserScript==
// @name         S.P.N.A.T.I.
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  spnati
// @author       Exotik
// @match        https://faraway-vision.io/
// @icon         https://www.google.com/s2/favicons?domain=faraway-vision.io
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/433129/SPNATI.user.js
// @updateURL https://update.greasyfork.org/scripts/433129/SPNATI.meta.js
// ==/UserScript==

function createButton(id, text, onClick)
{
    var btn = document.createElement ('div');
    btn.innerHTML = '<button id="' + id + '" type="button">' + text + '</button>';
    btn.setAttribute ('id', 'buttons');
    document.body.appendChild(btn);
    document.getElementById (id).addEventListener (
        "click", onClick, false
    );
}

createButton("stripPlayer1", "Strip player 1", stripPlayer1);
createButton("stripPlayer2", "Strip player 2", stripPlayer2);
createButton("stripPlayer3", "Strip player 3", stripPlayer3);
createButton("stripPlayer4", "Strip player 4", stripPlayer4);
createButton("stripAll", "Strip all", stripAll);
createButton("stripAllNakedBtn", "Strip all naked", ButtonStripAllNaked);
createButton("masturbatePlayer1", "Masturbate player 1", masturbatePlayer1);
createButton("masturbatePlayer2", "Masturbate player 2", masturbatePlayer2);
createButton("masturbatePlayer3", "Masturbate player 3", masturbatePlayer3);
createButton("masturbatePlayer4", "Masturbate player 4", masturbatePlayer4);
createButton("masturbateAll", "Masturbate all", masturbateAll);
createButton("unlockAllEndings", "Unlock all endings", unlockAllEndings);
createButton("randomBackgorund", "Random background", randomBackground);


function stripAll() {stripAllOnce();}
function stripPlayer1() {stripPlayer(1);}
function stripPlayer2() {stripPlayer(2);}
function stripPlayer3() {stripPlayer(3);}
function stripPlayer4() {stripPlayer(4);}
function masturbatePlayer1() {startMasturbation(1);}
function masturbatePlayer2() {startMasturbation(2);}
function masturbatePlayer3() {startMasturbation(3);}
function masturbatePlayer4() {startMasturbation(4);}
function masturbateAll() {masturbateAllPlayers();}
function ButtonStripAllNaked()
{
    ButtonClickAction("stripAllNaked");
}

function ButtonClickAction (type) {
    switch(type)
    {
        case "stripAllNaked":
            stripAllNaked();
    }
}

//--- Style our newly added elements using CSS.
GM_addStyle ( `
    #myContainer {
        position:               absolute;
        top:                    0;
        left:                   0;
        font-size:              20px;
        background:             orange;
        border:                 3px outset black;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
        padding:                5px 20px;
    }
    #myButton {
        cursor:                 pointer;
    }
    #myContainer p {
        color:                  red;
        background:             white;
    }
` );
function stripAllNaked(){
    /*Strip everyone (except the PC) naked such that one round is left before they lose.*/
    stripAllToLevel(1);
}

function stripAllOnce()
{
    for (var i = 1; i < players.length; i++)
    {
        try { stripPlayer(i); } catch {}
    }
}

function masturbateAllPlayers()
{
    for (var i = 1; i < players.length; i++)
    {
        try { startMasturbation(i); } catch {}
    }
}

function stripNaked(player){
    /*Strip all layers off of a given player (0 is the PC, 1-4 are NPCs).
      Params: player - Integer (0 is the PC, 1-4 are NPCs)
    */
    try { stripToLevel(player, 1); } catch {}
}

function autoWin(){
    /*Automatically win.*/
    try { stripAllToLevel(0); } catch {}
}

function stripAllToLevel(level){
    /*Strip all players (except the PC) down so that they have at most _level_ number of layers left.
      Params: level - Integer (The number of layers to leave left on a player.)
    */
    for(var i = 1; i < players.length; i++){
        try { stripToLevel(i, level); } catch {}
    }
}

function stripToLevel(player, level){
    /*Strip a player down such that they only have (at most) a certain number of layers left.
      Params: player - Integer (0 is the PC, 1-4 are NPCs)
              level - Integer (The number of layers to leave left on a player.)
    */
    for (var c = countClothing(player); c >= level; c--){
        try { stripChoice(player); } catch {}
    }
}

function countClothing(player){
    /* Count the clothing the player has remaining.
       Params: Player - integer (0 is the PC, 1-4 are NPCs)
    */
    var clothes = 0;
    for (var i = 0; i < players[player].clothing.length; i++) {
        if (players[player] && players[player].clothing[i]) {
            clothes++;
        }
    }
    return clothes;
}

function multiStripChoice(player, times){
    /* Strip the indicated player of multiple layer.
       Params: Player - integer (0 is the PC, 1-4 are NPCs)
               times - integer (The number of layers to try to strip.)
    */
    for(var i = 0; (i < times) && (countClothing(player) != -1); i++){
        try { stripChoice(player); } catch {}
    }
}

function stripChoice(player){
    /* Strip the indicated player of a single layer.
       Params: Player - integer (0 is the PC, 1-4 are NPCs)
    */
    try { stripPlayer(player); } catch {}
    try { updateAllGameVisuals(); } catch {}
}

function randomBackground(){
    /*
        Choose a random background from those available.
    */
    //Note this randint helper function could either be inlined or broken out into an actual function.
    var randint = function(a,b){
        return (function(n,x){
                    return Math.floor(Math.random()*(x-n)+n);
                })(Math.min(a,b), Math.max(a,b));
    };
    setBackground(function(){var a = randint(0,23); console.log(a); return a;}());
}

function unlockAllEndings(){
    /*
        Unlocks all the endings in the gallery mode.
        NOTE: You can access the gallery by using the
        command "loadGalleryScreen()" from the main menu.
    */
    for(var i = 0; i < galleryEndings.length; i++)
    {
        try { galleryEndings[i].unlocked = true; } catch {}
    }
}