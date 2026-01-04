// ==UserScript==
// @name         2025 Machine
// @namespace    http://tampermonkey.net/
// @version      1.305
// @license      MIT
// @description  Tags
// @author       Kya
// @match        https://evades.io/*
// @match        https://evades.online/*
// @match        *://192.99.150.59/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529847/2025%20Machine.user.js
// @updateURL https://update.greasyfork.org/scripts/529847/2025%20Machine.meta.js
// ==/UserScript==

(function(){'use strict';let tags=[{name:"kya",tag:"[🐐] "},{name:"Zade",tag:"[LEAD] "},{name:"gok4rt",tag:"[CMD] "},{name:"yeetyeet47",tag:"[CMD] "},{name:"Akira",tag:"[JR CMD] "},{name:"Anorak",tag:"[JR CMD] "},{name:"Bunny 🐰 :)",tag:"[JR CMD] "},{name:"Lunari",tag:"[GOAT] "}];let rainbowClass="rainbow-text",chatClass="chat-message-sender",leaderboardClass="leaderboard-name",applyTags=()=>{document.querySelectorAll(`.${chatClass}`).forEach(e=>{tags.forEach(u=>{if(e.innerText.trim()===u.name&&!e.innerText.includes(u.tag)){e.innerText=u.tag+e.innerText;e.classList.add(rainbowClass);}});});document.querySelectorAll(`.${leaderboardClass}`).forEach(e=>{tags.forEach(u=>{if(e.innerText.trim().startsWith(u.name)&&!e.innerText.includes(u.tag)){e.innerText=u.tag+e.innerText;e.classList.add(rainbowClass);}});});};setTimeout(()=>{applyTags();setInterval(applyTags,0);},0);let style=document.createElement("style");style.innerHTML=`@keyframes rainbow{0%{color:red;}16%{color:orange;}32%{color:yellow;}48%{color:green;}64%{color:blue;}80%{color:indigo;}100%{color:violet;}}.${rainbowClass}{animation:rainbow 2s infinite linear;}`;document.head.appendChild(style);let active=false;document.addEventListener('keydown',e=>{if(e.key==='['){active=!active;document.dispatchEvent(new KeyboardEvent(active?'keydown':'keyup',{key:'d',code:'KeyD',which:68,keyCode:68,charCode:0,bubbles:true,cancelable:true,view:window}));}});['keyup','keydown'].forEach(t=>{document.addEventListener(t,e=>{if(e.key==='d'&&active){active=false;}});});})();
