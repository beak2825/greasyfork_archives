// ==UserScript==
// @name         MelloMe custom sub script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  for MelloMe
// @author       You
// @match        https://shellshock.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404981/MelloMe%20custom%20sub%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/404981/MelloMe%20custom%20sub%20script.meta.js
// ==/UserScript==

alert("Auto typer will begin in 1 minute. Please join a game in 1 minute.")

setTimeout(function() {
    alert("Auto typer on...\nClick on the imput box to create a message")
    document.getElementById("chatIn").addEventListener("click", function(){
        var phrases = ["Sub 2 MelloMe Plz", "It's the gaming channel!", "Sub!"]
        document.getElementById("chatIn").value = phrases[Math.floor(Math.random() * phrases.length)];
    });
}, 60000)
