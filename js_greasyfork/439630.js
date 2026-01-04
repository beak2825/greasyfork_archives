// ==UserScript==
// @name         Gemini Akai Theme
// @namespace    http://tampermonkey.net/
// @version      1
// @description  GMN theme for shellshock.io
// @author       Akai
// @match        https://shellshock.io/*
// @match        https://eggcombat.com/*
// @match        https://eggfacts.fun/*
// @match        https://biologyclass.club/*
// @match        https://egghead.institute/*
// @match        https://egg.dance/*
// @match        https://eggisthenewblack.com/*
// @match        https://mathfun.rocks/*
// @match        https://hardboiled.life/*
// @match        https://overeasy.club/*
// @match        https://zygote.cafe/*
// @match        https://eggsarecool.com/*
// @match        https://deadlyegg.com/*
// @match        https://mathgames.world/*
// @match        https://hardshell.life/*
// @match        https://violentegg.club/*
// @match        https://yolk.life/*
// @match        https://softboiled.club/*
// @match        https://scrambled.world/*
// @match        https://deathegg.world/*
// @match        https://violentegg.fun/*
// @match        https://krunker.io/*
// @icon         https://media.discordapp.net/attachments/929178886674206730/933286599498792980/gemini_1.png?width=504&height=504
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439630/Gemini%20Akai%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/439630/Gemini%20Akai%20Theme.meta.js
// ==/UserScript==

document.title="GMN Server Clan Theme";
setTimeout(function(){
    document.getElementById("logo").innerHTML = "<img src='https://media.discordapp.net/attachments/929178886674206730/933286599498792980/gemini_1.png?width=504&height=504'>";
}, 2000);
let style = document.createElement('link');
style.rel = 'stylesheet';
style.href = 'https://gmnakai-1.minh-quanquan27.repl.co/style.css';
document.head.appendChild(style);