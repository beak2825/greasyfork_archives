// ==UserScript==
// @name         Lobby Texture
// @namespace    lelelele
// @version      21
// @description  a trash hack i made
// @author       DarkSnow
// @match        *://*.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406481/Lobby%20Texture.user.js
// @updateURL https://update.greasyfork.org/scripts/406481/Lobby%20Texture.meta.js
// ==/UserScript==


document.getElementById('enterGame').innerHTML = '❄️SnowMod❄️';
document.getElementById('loadingText').innerHTML = '. . . . . . . . . ❄️Thx for not hackin❄️ . . . . . . . . .  ';
document.getElementById('nameInput').placeholder = "unknown";
document.getElementById('chatBox').placeholder = "❄️Snowwy❄️ ?";
document.getElementById('diedText').innerHTML = '❄️YOU DIED!❄️GG!❄️';
document.getElementById('diedText').style.color = "White";

document.getElementById("storeHolder").style = "height: 1500px; width: 450px;"

document.getElementById('adCard').remove();
document.getElementById('errorNotification').remove();

document.getElementById("leaderboard").style.color = "purple";
document.getElementById("gameName").style.color = "Black";
document.getElementById("setupCard").style.color = "White";
document.getElementById("gameName").innerHTML = "❄️SnowMod❄️"
document.getElementById("promoImg").remove();
document.getElementById("scoreDisplay").style.color = "Black";
document.getElementById("woodDisplay").style.color = "White";
document.getElementById("stoneDisplay").style.color = "Black";
document.getElementById("killCounter").style.color = "White";
document.getElementById("foodDisplay").style.color = "White";
document.getElementById("ageText").style.color = "White";
document.getElementById("allianceButton").style.color = "Blue";
document.getElementById("chatButton").style.color = "White";
document.getElementById("storeButton").style.color = "Black";

