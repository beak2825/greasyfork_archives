// ==UserScript==
// @name         AnnoyBot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bwahahha
// @author       ethandacat
// @match        */*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discourse.group
// @grant        none
// @license      CAT License
// @downloadURL https://update.greasyfork.org/scripts/539924/AnnoyBot.user.js
// @updateURL https://update.greasyfork.org/scripts/539924/AnnoyBot.meta.js
// ==/UserScript==

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const annoyingGifs = ["https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.tenor.com%2FukGvcbjfZqEAAAAM%2Fskibidi-toilet-skibidi.gif&f=1&nofb=1&ipt=44f9bde3116939776ef407f3dc0062674394c6df64e30eb160df2d4464fb5186","https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.tenor.com%2FW_JY-eOw3JAAAAAM%2Fomega-nuggets.gif&f=1&nofb=1&ipt=ae56110cf917a55bd94dab80b26a76f8f72cd506b1acd6678e078416ae6854dd"];

var abc = document.createElement("img");
abc.style.width = "100vw";
abc.src = getRandomItem(annoyingGifs);
abc.style.objectFit = "contain"
abc.style.height = "100vh";
document.body.overflow = "hidden";
abc.style.zIndex = "10000";
abc.style.position = "fixed";
abc.style.top = "0";
abc.style.left = "0";
abc.onclick = function() {
    window.open('https://example.com', '_blank');
    const buzz = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
    buzz.play();
}
document.body.appendChild(abc);