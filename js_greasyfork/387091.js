// ==UserScript==
// @name         Agario Nickname Extender
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows an infinite nickname, and you can animate it! (check additional info for tutorial)
// @author       You
// @match        https://agar.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387091/Agario%20Nickname%20Extender.user.js
// @updateURL https://update.greasyfork.org/scripts/387091/Agario%20Nickname%20Extender.meta.js
// ==/UserScript==
(function() {

    var nicknames = ["placeholder", "placeholder2"];
    var iter = -1;

    window.setInterval(function(){
        const ingame = agarApp.API._inGame;
        var l = nicknames.length;
        if(!ingame) {return;}
        if(l === 1) {return;}
        iter++;
        if(iter >= l) {iter = 0;}
        core.sendNick(nicknames[iter]);
    }, 2000);
    'use strict';
    document.addEventListener('keypress', function() {
        document.getElementById('nick').setAttribute("maxlength", "999");
        console.log(document.getElementById('nick').getAttribute("maxlength"));
    });
    const pb = document.getElementById('play')
    pb.onclick = function() {
        core.setMinimap(true);
        core.playersMinimap(true);
        const val = document.getElementById('nick').value;
        core.sendNick(val);
        var nicks = val.split('|');
        console.log(nicks);
        iter = -1;
        nicknames = nicks;
    }
})();