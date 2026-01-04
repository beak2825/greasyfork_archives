// ==UserScript==
// @name         Penguins Instead Of ShellShockers Logo!
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Changes The ShellShockers Logo, Into Penguins!!!!
// @author       NoahOfTech
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
// @icon         https://media.discordapp.net/attachments/896318037316231278/957556666449154048/111925035_penguino.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442189/Penguins%20Instead%20Of%20ShellShockers%20Logo%21.user.js
// @updateURL https://update.greasyfork.org/scripts/442189/Penguins%20Instead%20Of%20ShellShockers%20Logo%21.meta.js
// ==/UserScript==

document.title="(Penguin Theme In Use!) shellshock.io-alt url: geometry.best";
setTimeout(function(){
    document.getElementById("logo").innerHTML = "<img src='https://media.discordapp.net/attachments/896318037316231278/957556666449154048/111925035_penguino.jpg'>";
}, 2000);
let style = document.createElement('link');
style.rel = 'stylesheet';
style.href = 'https://media.discordapp.net/attachments/896318037316231278/957556666449154048/111925035_penguino.jpg';
document.head.appendChild(style);