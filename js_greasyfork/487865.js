// ==UserScript==
// @name         Simple Hack V-0.6
// @namespace    - 
// @license      MIT
// @version      0.6
// @description  Hack Moomoo.io By 2k09__ , the mod have , HatMacro , Insta Kill(keyr) , Enjoy :D
// @author       2k09__
// @match        *://moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487865/Simple%20Hack%20V-06.user.js
// @updateURL https://update.greasyfork.org/scripts/487865/Simple%20Hack%20V-06.meta.js
// ==/UserScript==

 alert(`KeyR = InstaKill || ShiftLeft = Unequip Hat || ShiftRight = BoosterHat || By 2k09__`);

//Key Code for the diesired key( in this example, the 'r' key )
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

 let ID_ThiefGear = 52;
 let ID_SamuraiArmor = 6;
 let ID_BullsHelmet = 7;
 let ID_TurretGear = 53;
 let ID_SoldierHelmet = 87;

function Primary() {
    ID_Primary = e.keypress;
    let ID_Primary = 13;
};
function Secundary() {
    ID_Secondary = e.keypress;
    let ID_Secondary = 27;
};

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
        StoreEquip(ID_ThieftGear);
            setTimeout(() => {
        code(ID_Primary);
            }, 500);
            
        // Delay after Action3 (In milliseconds)
        var delay3 = 160; // 1.5 Sceonds
    //ACTION4
        setTimeout(function() {
        StoreEquip(ID_SamuraiArmor);
            setTimeout(() => {
        code(ID_Secondary);
            }, 500);
            
        // Delay after Action4 (In milliseconds)
        var delay4 = 150; // 0.5 Sceonds
    //ACTION5
        setTimeout(function() {
        StoreEquip(ID_SamuraiArmor);
            setTimeout(() => {
        code(ID_Secondary);
            }, 500);
            
        // Delay after Action5 (In milliseconds)
        var delay5 = 150; // 0.8 Sceonds
    //ACTION6
        setTimeout(function() {
        StoreEquip(ID_SoldierHelmet);
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

let ID_BoosterHat = 72;

document.addEventListener('keydown', function(e) {
    switch(e.keycode) {
    case 6: StoreEquip(0); break; // "Shiftleft" To Unequip
    case 32: StoreEquip(ID_BoosterHat); break; // "ShiftRight" To wear BoosterHat
    }
  });