// ==UserScript==
// @name         Novicane - SPNATI Cheat
// @namespace    https://www.github.com/anonfoxer2
// @version      1.0.1
// @description  Collection of cheats for the browser game SPNATI, put into a large userscript for ease of use
// @author       anonfoxer
// @match        https://spnati.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457658/Novicane%20-%20SPNATI%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/457658/Novicane%20-%20SPNATI%20Cheat.meta.js
// ==/UserScript==

/* Changes in 1.0.1:
- Fixed the typo of the name (finally)
- Added proper try..catch error handling where needed.*/


/* Making the buttons and appending them all
just underneath the name bubble of each character.
Kinda roundabout but eh.

Yes i am well aware debug mode lets you do all of these things but
1. it only really works in offline
2. doing it in the online version is tedious even with a script like this
3. this is smaller than downloading the offline version
4. this works on android devices.

im sick of people discrediting work like this because "Oh well debug mode and offline version"
yes, that is an option, but please stop pretending like stuff like this isn't useful.*/

console.log("N O V O C A I N E _ L O A D I N G . . .");

//cheat name button because flair is important. Appends itself underneath the button that displays game version.
//Clicking it just displays the game version info.
var cheat = document.createElement("button");
cheat.innerHTML = "Novocaine v1.0.1";
var gameVers = document.getElementById("title-version-button");
gameVers.appendChild(cheat);


//win hand button. all buttons from here down append to the card display area.
var winHandButton = document.createElement("button");
winHandButton.innerHTML = "Win Hand";
document.getElementsByClassName("optional-bordered player-card-area")[0].appendChild(winHandButton);

//info button
var splashButton = document.createElement("button");
splashButton.innerHTML = "Info";
document.getElementsByClassName("optional-bordered player-card-area")[0].appendChild(splashButton);

//instant epilogue button
var instantEpilogueButton = document.createElement("button");
instantEpilogueButton.innerHTML = "Epilogue";
document.getElementsByClassName("optional-bordered player-card-area")[0].appendChild(instantEpilogueButton);


//splash listener
splashButton.addEventListener ("click", function() {
try {
    console.log("Novocaine >> Displaying cheat splash...");
    alert("Novocaine v1.0.1 by anonfoxer");
    alert("Changes!\n-Fixed the typo in the name.\n-Added proper try..catch error handling where needed.\n\n\nUsage:\nClick win hand at any time to win the hand instantly.\nClick Epilogue to immediately jump to the epilogues that are available with the characters you\'ve been playing against.\nClick info to show this dialogue.");
}
catch (e) {
    console.log("Novocaine >> Error when displaying cheat splash. Error:");
    console.log(e);
}
});

//win hand listener
winHandButton.addEventListener ("click", function() {
try {
    console.log("Novocaine >> Giving player winning hand...");
    players[0].hand.cards = [ 14, 13, 12, 11, 10 ].map(function(n) { return new Card(0 - 1, n); });
}
    catch (e) {
    console.log("Novocaine >> An error occurred when trying to force a winning hand. Error:");
    console.log(e);
    }
});


//instant epilogue listener
instantEpilogueButton.addEventListener ("click", function() {
try {
    console.log("Novocaine >> Forcing epilogue modal...");
    doEpilogueModal();
}
catch (e) {
    console.log("Novocaine >> Error when forcing epilogue dialogue box. Error:");
    console.log(e);
}
});

console.log("Novocaine >> Loaded.");
