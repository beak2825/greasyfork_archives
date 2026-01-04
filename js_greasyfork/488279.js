// ==UserScript==
// @name         🌟JS_Mod🌟
// @namespace    -
// @version      0.1
// @description  Insta And MacroHat || OP MOD ! || Insta = R || MacroHat = TankGear: Z - BoosterHat: B!
// @author       2k09__
// @license      MIT
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488279/%F0%9F%8C%9FJS_Mod%F0%9F%8C%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/488279/%F0%9F%8C%9FJS_Mod%F0%9F%8C%9F.meta.js
// ==/UserScript==

setTimeout(() => {
    document.getElementById("gameName").innerHTML = '🌟JS🌟';
}, 1000);

setTimeout(() => {
    document.getElementById("gameName").innerHTML = '🌟MOD🌟';
}, 1000);
setTimeout(() => {
    document.getElementById("gameName").innerHTML = '🌟JS🌟';
}, 1000);

setTimeout(() => {
    document.getElementById("gameName").innerHTML = '🌟MOD🌟';
}, 1000);
setTimeout(() => {
    document.getElementById("gameName").innerHTML = '🌟JS🌟';
}, 1000);

setTimeout(() => {
    document.getElementById("gameName").innerHTML = '🌟MOD🌟';
}, 1000);
setTimeout(() => {
    document.getElementById("gameName").innerHTML = '🌟JS🌟';
}, 1000);

setTimeout(() => {
    document.getElementById("gameName").innerHTML = '🌟MOD🌟';
}, 1000);
setTimeout(() => {
    document.getElementById("gameName").innerHTML = '🌟JS🌟';
}, 1000);

setTimeout(() => {
    document.getElementById("gameName").innerHTML = '🌟MOD🌟';
}, 1000);
setTimeout(() => {
    document.getElementById("gameName").innerHTML = '🌟JS🌟';
}, 1000);

setTimeout(() => {
    document.getElementById("gameName").innerHTML = '🌟MOD🌟';
}, 1000);

setTimeout(() => {
document.getElementById('loadingText').innerHTML = 'Reload.';
}, 1000);
    setTimeout(() => {
document.getElementById('loadingText').innerHTML = 'Reload..';
    }, 1000);
        setTimeout(() => {
document.getElementById('loadingText').innerHTML = 'Reload...';
        }, 1000);
setTimeout(() => {
document.getElementById('loadingText').innerHTML = 'Reload.';
}, 1000);
    setTimeout(() => {
document.getElementById('loadingText').innerHTML = 'Reload..';
    }, 1000);
        setTimeout(() => {
document.getElementById('loadingText').innerHTML = 'Reload...';
        }, 1000);
            
document.getElementById("moomooio_728x90_home").Style.display = "none"; // Remove Sidney's Ads
            
document.getElementById("Leaderboard").append = "🌟By 2k09__🌟";
            
setTimeout(() => {
document.getElementById('DeathText').innerHTML = "Why Die : (";
}, 1000);
setTimeout(() => {
    document.getElementById('DeathText').innerHTML = "🌟Revenge Now : )";
}, 1000);
setTimeout(() => {
document.getElementById('DeathText').innerHTML = "Why Die : (";
}, 1000);
var ID_TankGear = 6;
var ID_BoosterHat = 72;

document.addEventListener('keydown', function (e) {
    switch(e.keycode) {
            case 6: StoreEquip(0); break; // "Shift" To Unequip
        case 32: StoreEquip(ID_TankGear); break; // "Z" To Wear TankGear
        case 86: StoreEquip(ID_BoosterHat); break; // "B" To Wear BoosterHat
    };
})
                          //key code for the diesired key(in this example, the 'r' key)
let targetkey = 82;
let e;
let delay1;
let delay2;
let delay3;
let delay4;
let delay5;
let delay6;
let StoreEquip;
let code;
                          
function Primary() {
    ID_Primary = e.keypress;
    let ID_Primary = 13;
};
function Secundary() {
    ID_Secondary = e.keypress;
    let ID_Secondary = 27;
};

let ID_SamuraiArmor = 6;
let ID_TurretGear = 19;
let ID_BullsHelmet = 52;

//function to perform Actions with delay's
function performActions() {
    
    //ACTION1
        setTimeout(function() {
        StoreEquip(ID_BullsHelmet);
            setTimeout(() => {
        code.Atack(ID_Primary);
            }, 1000);
            
        // Delay after Action1 (In milliseconds)
        var delay1 = 150; // 2 Sceonds
    //ACTION2
        setTimeout(function() {
        StoreEquip(ID_TurretGear);
            setTimeout(() => {
        code.Atack(ID_Secondary);
            }, 500);
                       
        // Delay after Action2 (In milliseconds)
        var delay2 = 150; // 1 Sceonds
    //ACTION3
        setTimeout(function() {
        StoreEquip(ID_SamuraiArmor);
            setTimeout(() => {
        code(ID_Primary);
            }, 500);
            
        // Delay after Action3 (In milliseconds)
        var delay3 = 160; // 1.5 Sceonds
    //ACTION4
        setTimeout(function() {
        StoreEquip(ID_TurretGear);
            setTimeout(() => {
        code(ID_Secondary);
            }, 500);
            
        // Delay after Action4 (In milliseconds)
        var delay4 = 150; // 0.5 Sceonds
    //ACTION5
        setTimeout(function() {
        StoreEquip(ID_TurretGear);
            setTimeout(() => {
        code(ID_Secondary);
            }, 500);
            
        // Delay after Action5 (In milliseconds)
        var delay5 = 150; // 0.8 Sceonds
    //ACTION6
        setTimeout(function() {
        StoreEquip(ID_SamuraiArmor);
            setTimeout(() => {
        code(ID_Primary);
            }, 1500);
            
        // Delay after Action1 (In milliseconds)
        var delay6 = 160; // 3 Sceonds
            
             }, delay6);
            }, delay5);
           }, delay4);
          }, delay3);
         }, delay2);
        }, delay1);
}
//Event listener for key press
document.addEventListener('keydown' , function(event) {
    if (event.keycode === targetkey) {
        performActions
    };
   });