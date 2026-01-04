// ==UserScript==
// @name         Change Color
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Change ball color in Bonk
// @author       MYTH_doglover
// @match        https://bonk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423461/Change%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/423461/Change%20Color.meta.js
// ==/UserScript==

(function() {
     var redteam = document.createElement("button");   // Create a <button> element
redteam.innerHTML = "Red";                   // Change button text
document.body.appendChild(redteam);               // Append <button> to <body>
redteam.id = 'redteam';
redteam.style.position = "fixed";                //button position
redteam.style.top = 100;
redteam.style.left = 10;

redteam.onclick = function() {

document.getElementById("newbonklobby_redbutton").click();  //turn red
}


     var blueteam = document.createElement("button");   // Create a <button> element
blueteam.innerHTML = "Blue";                   // Change button text
document.body.appendChild(blueteam);               // Append <button> to <body>
blueteam.id = 'blueteam';
blueteam.style.position = "fixed";                //button position
blueteam.style.top = 120;
blueteam.style.left = 10;

blueteam.onclick = function() {

document.getElementById("newbonklobby_bluebutton").click();  //turn blue
}


     var greenteam = document.createElement("button");   // Create a <button> element
greenteam.innerHTML = "Green";                   // Change button text
document.body.appendChild(greenteam);               // Append <button> to <body>
greenteam.id = 'greenteam';
greenteam.style.position = "fixed";                //button position
greenteam.style.top = 140;
greenteam.style.left = 10;

greenteam.onclick = function() {

document.getElementById("newbonklobby_greenbutton").click();  //turn green
}


     var yellowteam = document.createElement("button");   // Create a <button> element
yellowteam.innerHTML = "Yellow";                   // Change button text
document.body.appendChild(yellowteam);               // Append <button> to <body>
yellowteam.id = 'yellowteam';
yellowteam.style.position = "fixed";                //button position
yellowteam.style.top = 160;
yellowteam.style.left = 10;

yellowteam.onclick = function() {

document.getElementById("newbonklobby_yellowbutton").click();  //turn yellow
}

     var noteam = document.createElement("button");   // Create a <button> element
noteam.innerHTML = "FFA";                   // Change button text
document.body.appendChild(noteam);               // Append <button> to <body>
noteam.id = 'noteam';
noteam.style.position = "fixed";                //button position
noteam.style.top = 180;
noteam.style.left = 10;

noteam.onclick = function() {

document.getElementById("newbonklobby_ffabutton").click();  //remove color
}

     var spec = document.createElement("button");   // Create a <button> element
spec.innerHTML = "Spectate";                   // Change button text
document.body.appendChild(spec);               // Append <button> to <body>
spec.id = 'spec';
spec.style.position = "fixed";                //button position
spec.style.top = 200;
spec.style.left = 10;

spec.onclick = function() {

document.getElementById("newbonklobby_specbutton").click();  //remove color
}

})();