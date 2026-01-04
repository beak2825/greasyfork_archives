// ==UserScript==
// @name         Libra Ad Lifter
// @version      0.1 :)
// @match        *.agar.io/*
// @grant        none
// @run-at       document-end
// @namespace Youtube.com/Libraa
// @description all ads in the game are removed; death video ads, Menu ads, Spectate Ads.
// @downloadURL https://update.greasyfork.org/scripts/382283/Libra%20Ad%20Lifter.user.js
// @updateURL https://update.greasyfork.org/scripts/382283/Libra%20Ad%20Lifter.meta.js
// ==/UserScript==

var Libra = document.getElementById('adbg');
if (Libra) { Libra.parentNode.removeChild(Libra); }

var Libra1 = document.getElementById('adsBottom');
if (Libra1) { Libra1.parentNode.removeChild(Libra1); }

var Libra2 = document.getElementById('adsGameOver');
if (Libra2) { Libra2.parentNode.removeChild(Libra2); }




var Feed = false;
var Dingus = false;
var imlost = 35;
var instructions = document.getElementById("instructions");
instructions.style.lineHeight = "1.70";
instructions.style.fontSize = "16.5px";
instructions.style.marginTop = "+95px";
instructions.innerHTML +=
    "<center><a href=http://www.youtube.com/Libraa><font color=Blue><b> Libra Youtube </b></font></center></a>" +
    "<center><a href=https://discord.gg/UuVHSZR><font color=#72cb31>💡 Discord 💡 </font></center></a>" +
    "<a href=mailto:LibraTelegram@gmail.com><font color=red>Contact Mail</font></a>" +
    "<center></font></center></a><font> The page if sign-in does not appear <a href=https://Agar.io><font color=#72cb31> Refresh </font>" ;



// I LOVE YOU Solo Game Play :) NO MACRO NO HACK :) // Libra Ad Lifter // www.youtube.com/Libraa //