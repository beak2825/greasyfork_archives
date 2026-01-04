// ==UserScript==
// @name         Macro , Eject and Auto TrickSplit
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  TrickSplit and Eject for fanix.io Macro
// @author       Həsən Həsənli
// @match        https://fanix.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394584/Macro%20%2C%20Eject%20and%20Auto%20TrickSplit.user.js
// @updateURL https://update.greasyfork.org/scripts/394584/Macro%20%2C%20Eject%20and%20Auto%20TrickSplit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var EjectDown = false;
    var BotEjectDown = false;
    var speed = 0.00000000000001;
    window.addEventListener("keydown",keydown);
    window.addEventListener("keyup",keyup);

    function keyup(event){
        if (event.keyCode == 87 && EjectDown == true){
        EjectDown = false;
        }
        if(event.keyCode == 68 && BotEjectDown == true){
        BotEjectDown = false;
        }
    }
    function keydown(event){
        if (event.keyCode == 68 && BotEjectDown == false){ //key D
             setTimeout(BotEject,speed);
             BotEjectDown = true;

        }
        //Auto Tricksplit 2/1  (2 --> Bots//// 1 --> Users)
        if(event.keyCode == 82 ){ // key R
           Bot();
           Bot();
           Bot();
           UserSplit();


        }
        if(event.keyCode == 16 ){
           UserMacroSplit();
           UserMacroSplit();
           BotSplit();
           }
        if(event.keyCode == 70 ){ // key F
            Bot();
        }
        if (event.keyCode == 87 && EjectDown == false){ // key W
              setTimeout(eject,speed);
              EjectDown = true;
        }

    function BotSplit(){
         $("body").trigger($.Event("keydown", { keyCode: 65})); // key A
         $("body").trigger($.Event("keyup", { keyCode: 65}));
    }
    function UserSplit(){
        $("body").trigger($.Event("keydown",{ keyCode: 32}));
        $("body").trigger($.Event("keyup", { keyCode: 32}));
    }
    function UserMacroSplit(){
        $("body").trigger($.Event("keydown",{ keyCode: 81}));
        $("body").trigger($.Event("keyup", { keyCode: 81}));
    }
    function Bot(){
         BotSplit();
         setTimeout(BotSplit, speed);
         setTimeout(BotSplit, speed*2);
         setTimeout(BotSplit, speed*3);

    }

    function BotEject(){
       if(BotEjectDown){
        window.onkeydown({keyCode: 68}); // key D
        window.onkeyup({keyCode: 68});
        setTimeout(BotEject,speed);
        }

    }

    function eject(){
        if(EjectDown){
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(eject,speed);
        }
    }
    }
})();