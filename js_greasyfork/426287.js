// ==UserScript==
// @name         Novicane - SPNATI Cheat
// @namespace    https://www.github.com/anonfoxer
// @version      0.2.0
// @description  Collection of cheats for the browser game SPNATI, put into a large userscript for ease of use
// @author       anonfoxer
// @match        https://spnati.net/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426287/Novicane%20-%20SPNATI%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/426287/Novicane%20-%20SPNATI%20Cheat.meta.js
// ==/UserScript==


/* Making the buttons and appending them all
just underneath the name bubble of each character.
Kinda roundabout but eh. */

//cheat name button because flair is important.
var cheatNameDummy = document.createElement("button");
cheatNameDummy.innerHTML = "Novicane v0.2.0";
var gameVers = document.getElementById("title-version-button");
gameVers.appendChild(cheatNameDummy);

//enable debug bbutton
var enableDebugButton = document.createElement("button");
enableDebugButton.innerHTML = "Enable Debug mode";
var body = document.getElementById("player-name-label-minimal");
document.body.appendChild(enableDebugButton);

//win hand button
var winHandButton = document.createElement("button");
winHandButton.innerHTML = "Win Hand";
document.body.appendChild(winHandButton);

//instant epilogue button
/*
var instantEpilogueButton = document.createElement("button");
instantEpilogueButton.innerHTML = "Instant Epilogue";
document.body.appendChild(instantEpilogueButton);
*/

//debug Listener
enableDebugButton.addEventListener ("click", function() {
    try{
        console.log("Attempting to enable debug mode...")
        DEBUG = true;
        updateDebugState(true);
        console.log("Debug mode enabled.");
    }
    catch (e) {
        console.log("An error occured when trying to enable debug mode: " + e);
        alert("Failed to enable debug mode. Check console for details!");
    }
});

//win hand listener
winHandButton.addEventListener ("click", function() {
    players[0].hand.cards = [ 14, 13, 12, 11, 10 ].map(function(n) { return new Card(0 - 1, n); });
});


//instant epilogue listener
/*
instantEpilogueButton.addEventListener ("click", function() {
    var character = prompt("Enter the name of the character you want to see the epilogue of. They must have an epilogue written.","raven");
    console.log(character);
    doEpilogueModal(character);
});
*/