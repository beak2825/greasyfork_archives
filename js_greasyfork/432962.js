// ==UserScript==
// @name         🍳Egg Mod🍳
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hat Hotkey (G=SoldierHelmet).(T=Tankgear).(Y=BoosterHat).(H=EMPHelmet)
// @author       UnderTaler
// @match        *://moomoo.io/*
// @match        *://*sandbox.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432962/%F0%9F%8D%B3Egg%20Mod%F0%9F%8D%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/432962/%F0%9F%8D%B3Egg%20Mod%F0%9F%8D%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();// document.getElementById("gameUI").style.backgroundImage = "url('')";
// document.getElementById("mainMenu").style.backgroundImage = "url('')";
document.getElementById('enterGame').innerHTML = 'EgG MoD OP';
document.getElementById('loadingText').innerHTML = '. . . . . . . . . Load Egg.Mod . . . . . . . . .  ';
document.getElementById('nameInput').placeholder = "rEaDy To KiL";
document.getElementById('chatBox').placeholder = "👓HI👓";
document.getElementById('diedText').innerHTML = '🎸 N0ObS LuCk 🎸';
document.getElementById('diedText').style.color = "Purple";

document.getElementById("storeHolder").style = "height: 1500px; width: 450px;"

document.getElementById('adCard').remove();
document.getElementById('errorNotification').remove();
document.getElementById("enterGame").style.color="blue";
document.getElementById("leaderboard").style.color = "Cyan";
document.getElementById("gameName").style.color = "Blue";
document.getElementById("setupCard").style.color = "Pink";
document.getElementById("gameName").innerHTML = "🍳Egg Mod🍳"
document.getElementById("promoImg").remove();
document.getElementById("scoreDisplay").style.color = "Orange";
document.getElementById("woodDisplay").style.color = "Purple";
document.getElementById("stoneDisplay").style.color = "Magenta";
document.getElementById("killCounter").style.color = "Red";
document.getElementById("foodDisplay").style.color = "Cyan";
document.getElementById("ageText").style.color = "Purple";
document.getElementById("allianceButton").style.color = "Yellow";
document.getElementById("chatButton").style.color = "Blue";
document.getElementById("storeButton").style.color = "Red";
document.getElementById("enterGame").style.color="Cyan";

let hue = 0;

let replaceInterval = setInterval(() => {
if (CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = ((oldFunc) => function() { if (this.fillStyle == "#8ecc51") this.fillStyle = `hsl(${hue}, 100%, 50%)`; return oldFunc.call(this, ...arguments); })(CanvasRenderingContext2D.prototype.roundRect);
  clearInterval(replaceInterval);
}}, 10);

function changeHue() {
  hue += Math.random() * 3;
}

setInterval(changeHue, 10);

setInterval(() => window.follmoo && follmoo(), 10);

 var ID_BullHelmet = 7;
    var ID_TurretGear = 53;
    var ID_FlipperHat = 31;
    var ID_SoldierHelmet = 6;
    var ID_TankGear = 40;
    var ID_EmpHelmet = 22;


    document.addEventListener('keydown', function(e) {
        if(e.keyCode === 16 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(0);
        }
        else if (e.keyCode === 84 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(ID_TankGear);
        }
        else if (e.keyCode === 71 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(ID_SoldierHelmet);
        }
        else if (e.keyCode === 32 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(ID_BullHelmet);
        }
        else if (e.keyCode === 89 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(ID_BoosterHat);
        }
        else if (e.keyCode === 72 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(ID_EmpHelmet);
        }
        else if (e.keyCode === 50 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(ID_TurretGear);
        }

    });
$('#leaderboard').append('U Can Do It🔥');