// ==UserScript==
// @name         Goatlings: Catch a Falling Star Autoplayer
// @description  It'll play Catch a Falling Star every 3 hours
// @author       Felix G. "Automalix"
// @namespace    https://greasyfork.org/en/users/322117
// @match        http://www.goatlings.com/catchstar/play
// @grant        none
// @version 0.0.1.20190910124452
// @downloadURL https://update.greasyfork.org/scripts/389992/Goatlings%3A%20Catch%20a%20Falling%20Star%20Autoplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/389992/Goatlings%3A%20Catch%20a%20Falling%20Star%20Autoplayer.meta.js
// ==/UserScript==

var content = document.body.textContent || document.body.innerText;

var catching = content.indexOf("You caught")!==-1;
if(catching){
    setTimeout ( function() {location.href = "http://www.goatlings.com/catchstar/play"}, 1200);}

var wait = content.indexOf("ERROR: You can play this game every 3 hours!")!==-1;
if(wait){
        setTimeout ( function () { location.href = "http://www.goatlings.com/catchstar/play"}, 3600000 );}

