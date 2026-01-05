// ==UserScript==
// @name        chopcoin timer/nodecount/coordinates
// @namespace   namespace
// @description change title to show a 30 second timer on split, number of nodes, and rough coordinates
// @include     http://chopcoin.io/
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14861/chopcoin%20timernodecountcoordinates.user.js
// @updateURL https://update.greasyfork.org/scripts/14861/chopcoin%20timernodecountcoordinates.meta.js
// ==/UserScript==

var timer = 0;
var timerFloat = 0;
var xCoord = 0;
var yCoord = 0;
var nodeCount = 0;
var frequency = 2; // how many times per second to update title
var id = 0;
var ign = "nothing";
var precision = 1000; // number to divide the board by, since its 12,000 x 12,000

setTitle();
window.addEventListener("keydown", dealWithKeyboard, false);

function setTitle() {
    getCoords();
    if (timerFloat != 0) {
        timerFloat -= 1/frequency;
        timer = Math.round(timerFloat);
    }
    document.title = timer + " | " + nodeCount + " | " + xCoord + " : " + yCoord + ' ' + ign;
    setTimeout(function(){ setTitle(); }, 1000/frequency);
}

function getCoords() {
    id = chopcoin.game.nodes.player_id['length'] - 1; // hackish way to identify my blob
    if (!chopcoin.game.nodes.player_id[id]) id = -1; // chopcoin doesnt clear out on spectate
    xCoord = 0;
    yCoord = 0;
    nodeCount = 0;
    var rawNodes = chopcoin.game.nodes['all'];
    for(var i=0; i<rawNodes.length; i++) {
        if (id == -1 && rawNodes[i]._name) id = rawNodes[i].id; // while in spectate mode, take the id of the first node that has a name
        if (rawNodes[i].id == id) ign = rawNodes[i]._name; // should be in a seperate for loop to get name?
        if (rawNodes[i]._name == ign) {
            nodeCount++;
            //xCoord += Math.round(rawNodes[i].x / 1000);
            //yCoord += Math.round(rawNodes[i].y / 1000);
            xCoord += rawNodes[i].x;
            yCoord += rawNodes[i].y;
            //console.log(xCoord + " : " + yCoord + " nodecount=" + nodeCount + ", name=" + ign);
        }
    }
    xCoord = Math.round(xCoord / nodeCount/ precision);
    yCoord = Math.round(yCoord / nodeCount/ precision);
    if(isNaN(xCoord)) xCoord = 0; // why are we getting NaNs here sometimes
    if(isNaN(yCoord)) yCoord = 0;
}

function dealWithKeyboard(e) {
    if (e.keyCode == "32") timerFloat = 30;
}