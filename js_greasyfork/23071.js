// ==UserScript==
// @name         GotaPlus
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       Verseh
// @match        http://gota.io/web/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23071/GotaPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/23071/GotaPlus.meta.js
// ==/UserScript==


//Makestyle
function makeStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

//Presets
settings.background = "white";
spike = "smooth";
spike_mother = "smooth";

//Gui
makeStyle('#chat-input { background-color:black; !important;');
document.getElementById("party-panel").style.marginTop = "100px";
document.getElementById("leaderboard-panel").style.borderRadius = "0";
document.getElementById("leaderboard-panel").style.borderWidth = "0px"; 
document.getElementById("leaderboard-panel").style.boxShadow = "0px 0px 0px black";
document.getElementById("leaderboard-panel").style.opacity = "0.6";
document.getElementById("chat-container").style.borderRadius = "0px";
document.getElementById("chat-container").style.borderWidth = "0px"; 
document.getElementById("party-panel").style.boxShadow = "0px 0px 0px black";
document.getElementById("chat-input").style.borderRadius = "0px";
document.getElementById("party-panel").style.opacity = "0.6";
document.getElementById("chat-input").style.width = "400px";
document.getElementById("chat-input").style.color = "white";
document.getElementById("minimap-panel").style.borderRadius = "0";
document.getElementById("party-panel").style.borderRadius = "0";
document.getElementById("minimap-panel").style.borderWidth = "0px"; 
document.getElementById("minimap-panel").style.boxShadow = "0px 0px 0px black";
document.getElementById("party-panel").style.borderWidth = "0px"; 
document.getElementById("party-panel").style.boxShadow = "0px 0px 0px black";
document.getElementById("chat-panel").style.boxShadow = "0px 0px 0px black";
document.getElementById("minimap-panel").style.opacity = "0.6";
document.getElementById("chat-panel").style.marginBottom = "4px"; 
document.getElementById("score-panel").style.borderRadius = "0";
document.getElementById("score-panel").style.borderWidth = "0px"; 
document.getElementById("score-panel").style.boxShadow = "0px 0px 0px black";
document.getElementById("score-panel").style.opacity = "0.6";
document.getElementById("minimap-panel").style.borderWidth = "0px";
document.getElementById("minimap-panel").style.marginBottom = "3px"; 
document.getElementById("score-panel").style.borderWidth = "0px"; 
document.getElementById("leaderboard-panel").style.borderWidth = "0px";
document.getElementById("minimap-panel").style.borderWidth = "0px";
document.getElementById("chat-panel").style.borderWidth = "0px";
document.getElementById("chat-input").style.borderWidth = "0px";
document.getElementById("main-content").style.borderWidth = "0px";
document.getElementById("main-content").style.borderRadius = "0";
document.getElementById("main-content").style.boxShadow = "0px 0px 0px black";
document.getElementById("main-side").style.boxShadow = "0px 0px 0px black";
document.getElementById("main-side").style.borderWidth = "0px";
document.getElementById("main-side").style.borderRadius = "0";
document.getElementById("popup-party").style.borderWidth = "0px";
document.getElementById("popup-party").style.borderRadius = "0";
document.getElementById("popup-party").style.opacity = "0.6";
document.getElementById("popup-party").style.boxShadow = "0px 0px 0px black";
document.getElementById("chat-panel").style.opacity = "0.6";
document.getElementById("chat-input").style.opacity = "0.8";
document.getElementById("chat-panel").style.marginBottom = "5px"; 
document.getElementById("chat-panel").style.marginBottom = "5px"; 
document.getElementById("mCSB_1_scrollbar_vertical").style.opacity = "0"; 
document.getElementById("chat-container").style.marginBottom = "5px"; 
document.getElementById("main-rb").style.borderWidth = "0px";
document.getElementById("main-rb").style.borderRadius = "0";
document.getElementById("main-rb").style.boxShadow = "0px 0px 0px black";

//Score Panel
setInterval(function() {   
  document.getElementById("score-panel").innerText = " Score: " + player.score + " " + "\n Fps: " + fps + " " + "\n Cells: " + player.myCells.length + "/16" + " " + "\n Id: " + player.playerId + " " + "\n \n Rainbow: F2 \n Alpha: F4 \n Zoom: ALT \n Respawn: F6" + " ";
}, 100);

//Keypress
document.addEventListener('keydown', function(e) {
        var key = e.keyCode || e.which;
        switch (key) {
            case 113:
                if (player.rainbow === false) {
                    player.rainbow = true;
} else {
   player.rainbow = false;
}
        }
    });

document.addEventListener('keydown', function(e) {
        var key = e.keyCode || e.which;
        switch (key) {
            case 115:
                if (settings.alpha === 1) {
                    settings.alpha = 0.4;
} else {
   settings.alpha = 1;
}
        }
    });

document.addEventListener('keydown', function(e) {
        var key = e.keyCod || e.which;
        switch (key) {
            case 18:            
                    player.mouseZoom = player.mouseZoom - 0.1;
        }
    });

document.addEventListener('keydown', function(e) {
        var key = e.keyCod || e.which;
        switch (key) {
            case 117:            
                    player.connect(player.currentServer);
        }
    });