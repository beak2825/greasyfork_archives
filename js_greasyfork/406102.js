// ==UserScript==
// @name         Track daily takepoint stats
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  track daily stats
// @author       Tobi
// @match        https://stats.takepoint.io/gameState
// @match        https://takepoint.io/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/406102/Track%20daily%20takepoint%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/406102/Track%20daily%20takepoint%20stats.meta.js
// ==/UserScript==

(function() {
'use strict';
var maxReq = 100; //number of requests, 100 for reliable results
var scores = [];
var stats = [];
var num = [];
var state = [];
var hiScoresReq = new XMLHttpRequest();

function send(){
    hiScoresReq.open('GET', 'https://stats.takepoint.io/gameState');
    hiScoresReq.send();
}

function processor(){
    stats.sort();
    state.sort();
    var z = 0
    for(var i = 0; i < state.length; i++){
        z = i + 1;
        if(state[i] == state[z]){
            stats.splice(z, 1);
            state.splice(z, 1);
            i--;
        }
    }
    for(var x in stats){
        console.log(stats[x]);
    }
    /* only if you wanna download
    if(confirm("Wanna download the daily facts?")){
        var blob = new Blob([stats.toString()],
                            { type: "text/plain;charset=utf-8" });
        saveAs(blob, "scores.txt"); //save data to file, filesave.js library required, just add this to the top: // @require      https://raw.githubusercontent.com/eligrey/FileSaver.js/master/src/FileSaver.js
    }
    */
}


for(var i = 0; i < maxReq; i++){ //do %maxReq% requests at a speed of 1/3 request per second (fastest reliable one)
    setTimeout(send, i*300);
}

hiScoresReq.onreadystatechange = function(){
    if(this.readyState == 4){

        scores = JSON.parse(this.response);
        /* only for highscores
        for(var i = 1; i <= 5; i++){
        	console.log(i + ". " + scores[i-1].username + " - " + scores[i-1].score);
        }
        */
        for(var n in scores){
            if(!scores[n].username){
                //console.log(scores[n] + " " + n.toLocaleString() + " today!"); print out gamefact immediatly
                stats.push(n.toLocaleString() + " " + scores[n]);
                num.push(scores[n]);
                state.push(n.toLocaleString());
            }
        }
    }
}
//console.log(num);
//console.log(state);
console.log(stats);
setTimeout(processor, maxReq * 300 + 5000); //takes 35 seconds with maxReq = 100 to display facts



    // Your code here...
})();