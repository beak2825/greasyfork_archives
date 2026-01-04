// ==UserScript==
// @name         Join Player v2 Roblox
// @license      C4-Suhail
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  this makes it you will allways join the same lobby as your freinds but it might not work if they have it you cant join them or random people
// @Note         Dont Steal This Code i Worked Really Hard On It
// @author       C4-Suhail
// @match        https://*www.roblox.com/users/*
// @icon         https://www.google.com/s2/favicons?domain=roblox.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438177/Join%20Player%20v2%20Roblox.user.js
// @updateURL https://update.greasyfork.org/scripts/438177/Join%20Player%20v2%20Roblox.meta.js
// ==/UserScript==





    'use strict';
     //button and Text
     var btn = document.createElement("BUTTON");
     const text = document.createElement("p");



     document.body.appendChild(text);
     document.body.appendChild(btn);

     text.style = ("position: absolute; top: 125px; left: 63%;")
     text.innerHTML = ("")

     btn.id = ("Joinv2")
     btn.innerHTML = "Join v2"
     btn.style = ("position: absolute; top: 100px; left: 65%; z-index: 3; background-color: rgb(0, 176, 111); color: rgb(255, 255, 255); border-bottom-color: rgb(0, 176, 111); border-bottom-color: rgb(0, 176, 111); border-top-color: rgb(0, 176, 111); border-right-color: rgb(0, 176, 111);border-left-color: rgb(0, 176, 111); border-radius: 8px; font-size: 20px; border: rgb(0, 176, 111);")
     //onclick
     btn.onclick = function () {
         text.innerHTML = ("Connecting to user")
         text.style = ("position: absolute; top: 125px; left: 63%; color: #ce1818;")
         var player_id = ("N/A"+window.location.href);
         player_id = player_id.replace(/\D/g,'');
         Roblox.GameLauncher.followPlayerIntoGame(player_id);;
                  setTimeout(Text, 5000)
         function Text() {
             text.innerHTML = "Connected to user"
             text.style = ("position: absolute; top: 125px; left: 63%; color: #4fb532;")
                               setTimeout(Text, 7000)
         function Text() {
             btn.innerHTML = "Join v2"
             text.innerText = "";
}
}

    };

var table = document.getElementById('content');
table.appendChild(btn);
table.appendChild(text);
