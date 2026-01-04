// ==UserScript==
// @name         Krunker Bot Host
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Host bots on a server which stay still at spawn, good for farming
// @author       imAChicken (krunker account name)
// @match        https://krunker.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406031/Krunker%20Bot%20Host.user.js
// @updateURL https://update.greasyfork.org/scripts/406031/Krunker%20Bot%20Host.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the submenu buttons div
    let menu = document.getElementById("subLogoButtons");

    let button = document.createElement("div");
    let text = document.createTextNode("Bots");
    button.setAttribute("class", "button small buttonG");
    button.setAttribute("id", "menuBtnServerHost");
    button.setAttribute("onmouseenter", "playTick()");
    button.setAttribute("onclick", `(function(){
        alert("This will open some windows on chrome.  Press OK if you're okay with this");
        let server = prompt("Enter server abbreviation:");
        let id = prompt("Enter server id:");
        let delay = parseInt(prompt("Enter delay (in seconds) before each bot is hosted (recommended 20):"))*1000;

        let url = "https://krunker.io/?game="+server+":"+id;

        let botCount = 100;
        while(botCount > 9){
            botCount = parseInt(prompt("Number of bots (limit 9):"));
        }

        if(!botCount){ return; }

        window.open(url);
        let i = 1;
        let hoster = setInterval(function(){
            window.open(url);

            i++;
            if(i === botCount) clearInterval(hoster);
        }, delay);

        window.focus();
    })()`);
    button.appendChild(text);
    menu.appendChild(button);

})();