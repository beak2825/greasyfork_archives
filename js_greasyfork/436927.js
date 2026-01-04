// ==UserScript==
// @name         Personal Mod for my Friend
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hat Hotkey (G=SoldierHelmet).(T=Tankgear).(Y=BoosterHat).(H=EMPHelmet)
// @author       UnderTaler
// @match        *://moomoo.io/*
// @match        *://*sandbox.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436927/Personal%20Mod%20for%20my%20Friend.user.js
// @updateURL https://update.greasyfork.org/scripts/436927/Personal%20Mod%20for%20my%20Friend.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();// document.getElementById("gameUI").style.backgroundImage = "url('')";
// document.getElementById("mainMenu").style.backgroundImage = "url('')";
document.getElementById('enterGame').innerHTML = 'CLICK HERE TO PLAY ';
document.getElementById('loadingText').innerHTML = '. . . . . . . . . Load RAINBOW.MOD . . . . . . . . .  ';
document.getElementById('nameInput').placeholder = "Salam Qaz";
document.getElementById('chatBox').placeholder = "Hi";
document.getElementById('diedText').innerHTML = 'Nice try qaz';
document.getElementById('diedText').style.color = "Blue";

document.getElementById("storeHolder").style = "height: 1500px; width: 450px;"

document.getElementById('adCard').remove();
document.getElementById('errorNotification').remove();
document.getElementById("enterGame").style.color="blue";
document.getElementById("leaderboard").style.color = "White";
document.getElementById("gameName").style.color = "Blue";
document.getElementById("setupCard").style.color = "Pink";
document.getElementById("gameName").innerHTML = 'Private Mod for Qaz'
document.getElementById("promoImg").remove();
document.getElementById("scoreDisplay").style.color = "White";
document.getElementById("woodDisplay").style.color = "Red";
document.getElementById("stoneDisplay").style.color = "Red";
document.getElementById("killCounter").style.color = "Black";
document.getElementById("foodDisplay").style.color = "Red";
document.getElementById("ageText").style.color = "White";
document.getElementById("allianceButton").style.color = "White";
document.getElementById("chatButton").style.color = "White";
document.getElementById("storeButton").style.color = "White";
document.getElementById("enterGame").style.color="Green";

let hue = 5;

let replaceInterval = setInterval(() => {
if (CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = ((oldFunc) => function() { if (this.fillStyle == "#8ecc51") this.fillStyle = `hsl(${hue}, 100%, 50%)`; return oldFunc.call(this, ...arguments); })(CanvasRenderingContext2D.prototype.roundRect);
  clearInterval(replaceInterval);
}}, 10);


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
$('#leaderboard').append('🍎');