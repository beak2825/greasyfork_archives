// ==UserScript==
// @name         Zombs.io Populations
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Population of the entire game and each region
// @author       Apex
// @match        *://zombs.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425560/Zombsio%20Populations.user.js
// @updateURL https://update.greasyfork.org/scripts/425560/Zombsio%20Populations.meta.js
// ==/UserScript==

const entirePop = document.getElementsByClassName("hud-intro-wrapper")[0].children[1];
const request = new XMLHttpRequest();
request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let data = JSON.parse(request.responseText);
        entirePop.innerHTML = `People in game now: ${data.players} / ${(data.players / data.capacity * 100).toFixed(2)}%`;
        let servers = ["US East", "US West", "Europe", "Asia", "Australia", "South America"];
        for (let i in servers) {
            game.ui.components.Intro.serverElem.children[i].setAttribute("label", `${servers[i]}: Population: ${data.regions[servers[i]].players}`);
        }
    }
};
request.open("GET", "http://zombs.io/capacity", true);
request.send();