// ==UserScript==
// @name        Engageme.tv Script
// @name:en        Engageme.tv Script
// @version      0.4
// @description  Automates watching Engageme.tv videos
// @author       Joshua Verdehem, Cannon Johns
// @match        http://engageme.tv/*
// @grant        none
// @namespace https://greasyfork.org/users/96050
// @downloadURL https://update.greasyfork.org/scripts/26668/Engagemetv%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/26668/Engagemetv%20Script.meta.js
// ==/UserScript==

setInterval(function runScript() {

    //Set the volume to 0 to prevent earrape
jwplayer().setVolume(0);

//Answers the "Are you still watching" popup is it does occour
yesiam();

//Seeks to the 1000 second mark (Should skip lol)
jwplayer().seek(1000);

//fixed any accidental pauses if the player bugs out.
jwplayer().play(true);

}, 5000);

function replayOnEnd() {
    if (jwplayer().on('playlistComplete'))
    {
         interval = setInterval(runScript,5000);
    }
}

var interval;
// adds the start button
jwplayer().addButton(
   'https://financialservices.coles.com.au/Assets/FinancialService/Images/icon-play.png',
   'Start Script',
   function() {
       interval = setInterval(runScript,5000);

},
'start'
);
//adds the pause button
jwplayer().addButton(
   'https://financialservices.coles.com.au/Assets/FinancialService/Images/icon-nav-pause-hover.png',
   'Stop Script (please double click!)',
   function() {
       clearInterval(interval);

},
'stop'
);
//adds the x2 button
jwplayer().addButton(
   '',
   'Start Script 2 times faster',
   function() {
       interval = setInterval(runScript,2500);

},
'startdouble'
);

