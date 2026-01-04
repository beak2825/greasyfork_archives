// ==UserScript==
// @name         Trimon Mod
// @namespace    http://tampermonkey.net/
// @version      0.0.a4
// @description  Mod in maintenance
// @author       Stelwine
// @match        *://moomoo.io/*
// @match        *://*sandbox.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434953/Trimon%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/434953/Trimon%20Mod.meta.js
// ==/UserScript==

    (function() {
        'use strict';
    })();// document.getElementById("gameUI").style.backgroundImage = "url('')";
// document.getElementById("mainMenu").style.backgroundImage = "url('')";

     // Sovrascrittura
    document.getElementById('enterGame').innerHTML = 'Play';
    document.getElementById('loadingText').innerHTML = 'Loading...';
    document.getElementById('nameInput').placeholder = "Welcome";
    document.getElementById('chatBox').placeholder = "Press Enter to send";
    document.getElementById('diedText').innerHTML = 'Imagine dyeing lol';
    document.getElementById("gameName").innerHTML = "Trimon Mod"
     
     // Colore della Sovrascrittura
    document.getElementById("gameName").style.color = "Red";
    document.getElementById("woodDisplay").style.color = "Brown";
    document.getElementById("stoneDisplay").style.color = "Gray";
    document.getElementById("killCounter").style.color = "Red";
    document.getElementById("foodDisplay").style.color = "Orange";
    document.getElementById("ageText").style.color = "White";
     
     // variabili con classificazione per numerazione dei cappelli secondo moomoo.io
        var BullHelmet = 7;
        var TurretGear = 53;
        var FlipperHat = 31;
        var SoldierHelmet = 6;
        var TankGear = 40;
        var EmpHelmet = 22;
     
     // StoreEquip('VARIABILE'), rappresenta la variabile soprannominata dal var
     // e.KeyBode === NUMERO, rappresenta il numero in cui viene identificato il tasto della tastiera
        document.addEventListener('keydown', function(e) {
            if(e.keyCode === 16 && document.activeElement.id.toLowerCase() !== 'chatbox')
            {
            storeEquip(0);
            }
            else if (e.keyCode === 67 && document.activeElement.id.toLowerCase() !== 'chatbox') // C
            {
            storeEquip(TankGear);
            }
            else if (e.keyCode === 86 && document.activeElement.id.toLowerCase() !== 'chatbox') // V
            {
            storeEquip(SoldierHelmet);
            }
            else if (e.keyCode === 66 && document.activeElement.id.toLowerCase() !== 'chatbox') // B
            {
            storeEquip(BullHelmet);
            }
            else if (e.keyCode === 78 && document.activeElement.id.toLowerCase() !== 'chatbox') // N
            {
            storeEquip(BoosterHat);
            }
            else if (e.keyCode === 77 && document.activeElement.id.toLowerCase() !== 'chatbox') // M
            {
            storeEquip(EmpHelmet);
            }
            else if (e.keyCode === 71 && document.activeElement.id.toLowerCase() !== 'chatbox') // G
            {
            storeEquip(TurretGear);
            }
     // Anti-Lag
    document.getElementById('adCard').remove();
    document.getElementById('errorNotification').remove();
    document.getElementById("promoImg").remove();

        });
     // codici non certi
    $('#leaderboard').append('scala dei trimoni');