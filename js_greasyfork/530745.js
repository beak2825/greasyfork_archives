// ==UserScript==
// @name         🌙🌛 Lunar V2 LEGIT CHEAT 🌙🌛
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Legit Cheat for GeoGuessr. Google Maps, PlonkIT, Location Display (Country, State, City), Auto Play
// @author       Neo
// @match        https://www.geoguessr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530745/%F0%9F%8C%99%F0%9F%8C%9B%20Lunar%20V2%20LEGIT%20CHEAT%20%F0%9F%8C%99%F0%9F%8C%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/530745/%F0%9F%8C%99%F0%9F%8C%9B%20Lunar%20V2%20LEGIT%20CHEAT%20%F0%9F%8C%99%F0%9F%8C%9B.meta.js
// ==/UserScript==

(function() {
'use strict';


const box = document.createElement('div');
box.style.position = 'fixed';
box.style.top = '50%';
box.style.left = '50%';
box.style.transform = 'translate(-50%, -50%)';
box.style.padding = '20px';
box.style.background = '#1e1e1e';
box.style.color = 'white';
box.style.borderRadius = '12px';
box.style.zIndex = 999999;
box.style.boxShadow = '0 0 12px rgba(0,0,0,0.5)';
box.style.fontFamily = 'Arial, sans-serif';
box.style.width = '260px';
box.style.textAlign = 'center';


const title = document.createElement('div');
title.innerText = 'Lunar V4 Showcase';
title.style.fontSize = '18px';
title.style.marginBottom = '10px';
box.appendChild(title);


const status = document.createElement('div');
status.innerText = 'This version is outdated. Please join the Discord for the updated version.';
status.style.fontSize = '12px';
status.style.marginBottom = '15px';
status.style.opacity = '0.8';
box.appendChild(status);


const discordBtn = document.createElement('button');
discordBtn.innerHTML = `<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/discord.svg" style="width:18px; vertical-align:middle; filter: invert(1); margin-right:6px;"> Join Discord`;
discordBtn.style.background = '#5865F2';
discordBtn.style.color = 'white';
discordBtn.style.display = 'flex';
discordBtn.style.alignItems = 'center';
discordBtn.style.justifyContent = 'center';
discordBtn.style.gap = '6px';
discordBtn.style.width = '100%';
discordBtn.style.padding = '10px';
discordBtn.style.marginBottom = '10px';
discordBtn.style.border = 'none';
discordBtn.style.borderRadius = '8px';
discordBtn.style.cursor = 'pointer';
discordBtn.onclick = () => window.open('https://discord.gg/TaCumDu36N', '_blank');
box.appendChild(discordBtn);


const youtubeBtn = document.createElement('button');
youtubeBtn.innerHTML = `<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg" style="width:18px; vertical-align:middle; filter: invert(1); margin-right:6px;"> Watch Showcase`;
youtubeBtn.style.background = '#FF0000';
youtubeBtn.style.color = 'white';
youtubeBtn.style.display = 'flex';
youtubeBtn.style.alignItems = 'center';
youtubeBtn.style.justifyContent = 'center';
youtubeBtn.style.gap = '6px';
youtubeBtn.style.width = '100%';
youtubeBtn.style.padding = '10px';
youtubeBtn.style.border = 'none';
youtubeBtn.style.borderRadius = '8px';
youtubeBtn.style.cursor = 'pointer';
youtubeBtn.onclick = () => window.open('https://www.youtube.com/watch?v=dHdEgEGhV1A', '_blank');
box.appendChild(youtubeBtn);


const closeBtn = document.createElement('div');
closeBtn.innerText = '✕';
closeBtn.style.position = 'absolute';
closeBtn.style.top = '5px';
closeBtn.style.right = '8px';
closeBtn.style.cursor = 'pointer';
closeBtn.style.fontSize = '14px';
closeBtn.style.opacity = '0.7';
closeBtn.onmouseover = () => closeBtn.style.opacity = '1';
closeBtn.onmouseout = () => closeBtn.style.opacity = '0.7';
closeBtn.onclick = () => box.remove();
box.appendChild(closeBtn);


document.body.appendChild(box);
})();