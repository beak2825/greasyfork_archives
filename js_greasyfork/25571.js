// ==UserScript==
// @name         Vertix Script
// @namespace    http://vertix.io/*
// @version      0.1
// @description  A script created by /u/ReelablePenny14 and /u/HighNoon643
// @author       /u/ReelablePenny14 and /u/HighNoon643
// @match        http://vertix.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25571/Vertix%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/25571/Vertix%20Script.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    addGlobalStyle('#mainTitleText { width: 100% !important; color: #1EB656 !important; font-size: 100px !important; text-align: center !important; text-shadow: 0 1px 0 #ff0000, 0 2px 0 #ff3300, 0 3px 0 #ffff00, 0 4px 0 #726767, 0 5px 0 #009900 !important; -webkit-animation: rainbow 4s linear infinite !important; -moz-animation: rainbow 4s linear infinite !important; animation: rainbow 4s linear infinite !important; }');
    addGlobalStyle('@keyframes rainbow  { 0% {color: red;}!important 14% {color: orange;}!important 28% {color: yellow;}!important 42% {color: green;}!important 56% {color: blue;}!important 70% {color: #4B0082;}!important 84% {color: purple;}!important}');
    addGlobalStyle('@-webkit-keyframes rainbow  {0% {color: red;}!important 14% {color: orange;}!important 28% {color: yellow;}!important 52% {color: green;}!important 46% {color: blue;}!important 70% {color: #4B0082;}!important 84% {color: purple;}!important}');
 
    document.title = "Starr.io";
 
})();
 
(function() {
    'use strict';
    window.onload = function() {
     // document.body.innerHTML= document.body.innerHTML.replace('<button id="startButton">ENTER GAME</button>','<button id="startButton">Shoot Em Up</button>');
document.body.innerHTML= document.body.innerHTML.replace('<div id="mainTitleText">VERTIX ONLINE</div>','<div id="mainTitleText">Starr.io</div>');
document.body.innerHTML= document.body.innerHTML.replace('<h3 class="menuHeader">ADVERTISEMENT</h3>','<h3 class="menuHeader">ADVERTISEMENT</h3>');
document.body.innerHTML= document.body.innerHTML.replace('<input type="text" tabindex="0" autofocus="" placeholder="Player Name" id="playerNameInput" maxlength="15">','<input type="text" tabindex="0" autofocus="" placeholder="Starry the Hoolisaur" id="playerNameInput" maxlength="15">');
document.body.innerHTML= document.body.innerHTML.replace('<a target="_blank" href="https://twitter.com/SidneydeVries12" class="link">SIDNEY DE VRIES</a>','<a target="_blank" href="https://discord.gg/0xbB7WraEK2EWPTf" class="link">ReelablePenny14 and Starry</a>'); };
    })();