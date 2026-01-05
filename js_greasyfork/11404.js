// ==UserScript==
// @name         HP VoteBot
// @namespace    http://www.hacker-project.com/
// @version      0.3
// @description  Automatically emulates votes for HP
// @author       Kevin Mitnick
// @match        http://www.hacker-project.com/index.php?action=view*
// @match        http://hacker-project.com/index.php?action=view*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/11404/HP%20VoteBot.user.js
// @updateURL https://update.greasyfork.org/scripts/11404/HP%20VoteBot.meta.js
// ==/UserScript==
function main() {
    
    // TIME TO DELAY - HP WILL NEGATE REWARD IF THIS IS SET TOO LOW
    var DELAY = 3.0;
    
    var frame = document.getElementById("viewFrame");
    $(frame).ready(function() { setTimeout(function() { frame.src = frame.src; }, Math.round(DELAY*1000)); });
    
    var loc = new String(document.location);
    if (loc.indexOf("&a2=reward")>-1) {
        var firstPart = loc.substring(0, loc.indexOf("&", loc.indexOf("&_a=")+4));
        var num = parseInt(firstPart.substring(firstPart.indexOf("&_a=")+4, firstPart.length));
        var numLen = num.toString().length;
        num++;
        if (num<=20) document.location.href = firstPart.substring(0, firstPart.length-numLen)+num;
    }
    
}
main();