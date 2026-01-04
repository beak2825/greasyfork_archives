// ==UserScript==
// @name         Word and Color Editer Bloody Edition
// @namespace    http://tampermonkey.net/
// @version      0.1 Bloody
// @description  Changes Colors and Words Simple
// @author       AirRaidZ/ Sub Guest On YT
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://beta.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415427/Word%20and%20Color%20Editer%20Bloody%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/415427/Word%20and%20Color%20Editer%20Bloody%20Edition.meta.js
// ==/UserScript==
document.getElementById('enterGame').innerHTML = 'NEED BLOOD!';
document.getElementById('loadingText').innerHTML = '. . . . BLOOD IS COMING . . . .';
document.getElementById('nameInput').placeholder = "🔴BLOOD🔴";
document.getElementById('loadingText').style.color = "red";
document.getElementById('chatBox').placeholder = "I Will Destroy You!";
document.getElementById('diedText').innerHTML = '🆘 bYe ByE 🆘';
document.getElementById('diedText').style.color = "red";

document.getElementById('adCard').remove();
document.getElementById('errorNotification').remove();

document.getElementById("leaderboard").style.color = "red";
document.getElementById("setupCard").style.color = "red";
document.getElementById("gameName").innerHTML = "BLOOD.IO"
document.getElementById("gameName").style.color = "red";
document.getElementById("promoImg").remove();
document.getElementById("allianceButton").style.color = "red";
document.getElementById("chatButton").style.color = "red";
document.getElementById("storeButton").style.color = "red";