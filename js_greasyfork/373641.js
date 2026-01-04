// ==UserScript==
// @name         ChapeisMortais(Versao Bull Hat
// @version      1.0
// @description  Hat Macros, Auto-Hat
// @author       Derpity Derpity
// @match        http://moomoo.io/*
// @match        http://45.77.0.81/?party=45.32.128.142
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @connect      moomoo.io
// @icon http://i.imgur.com/eJSOmz9.png[/img]
// @namespace https://greasyfork.org/users/131053
// @downloadURL https://update.greasyfork.org/scripts/373641/ChapeisMortais%28Versao%20Bull%20Hat.user.js
// @updateURL https://update.greasyfork.org/scripts/373641/ChapeisMortais%28Versao%20Bull%20Hat.meta.js
// ==/UserScript==

(function() {
var weapon;
var foodx;
$("#gameCanvas").mousedown(function(ev){
      if(ev.which == 3)
      {
        document.getElementById("actionBarItem7").onclick();
        var e = jQuery.Event( "keydown", { keyCode: 32 } );
        jQuery( "body" ).trigger( e );
        weapon = setTimeout(function(){ weapon5(); }, 25);
        foodx = setTimeout(function(){ takefood(); }, 40);
      }
});
    function takefood() {
    clearTimeout(foodx);
    document.getElementById("actionBarItem6").onclick();
    }
    function weapon5() {
    clearTimeout(weapon);
    document.getElementById("actionBarItem0").onclick();
    document.getElementById("actionBarItem1").onclick();
    document.getElementById("actionBarItem2").onclick();
    document.getElementById("actionBarItem4").onclick();
    }
})();


(function() {

    'use strict';
    var myVar;
    var myVar2;
    var police = true;
    var ID_BullsHelmet = 7;
    var ID_EMPTY = 0;
    var I,D_BullsHelmet = 7;

    document.addEventListener('keydown', function (e) {
        if (e.keyCode == 46 || e.keyCode == 84) {
            e.preventDefault();
            if (police) {
            storeEquip(ID_BullsHelmet);
            myVar = setTimeout(function(){ h1(); }, 1);
            } else {
            clearTimeout(myVar);
            clearTimeout(myVar2);
            storeEquip(ID_EMPTY);
            }
            police = !police;
        }
    });

    function h1() {
    storeEquip(ID_BullsHelmet);
    clearTimeout(myVar);
    myVar2 = setTimeout(function(){ h2(); }, 1);
    }
    function h2() {
    storeEquip(ID_BullsHelmet);
    clearTimeout(myVar2);
    myVar = setTimeout(function(){ h1(); }, 1);
    }
})();

(function() {
    'use strict';

    var ID_BummleHat = 8;
    var ID_StrawHat = 2;
    var ID_WinterCap = 15;
    var ID_CowboyHat = 5;
    var ID_RangerHat = 4;
    var ID_ExplorerHat = 18;
    var ID_MarksmanCap = 1;
    var ID_SoldierHelmet = 6;
    var ID_HoneycrispHat = 13;
    var ID_MinersHelmet = 9;
    var ID_BoosterHat = 12;
    var ID_BushGear = 10;
    var ID_SpikeGear = 11;
    var ID_BushidoArmor = 16;
    var ID_SamuraiArmor = 20;
    var ID_BullsHelmet = 7;
    var ID_DemolisherArmor = 26;
    var ID_FlipperHat = 31;
    var ID_EmpHelmet = 22;
    var actionBarItem10; // cookie
    var actionBarItem20; // boostpad
    var actionBarItem19; // pitfall
    var actionBarItem4; // katana
    var actionBarItem3; // shortsword

    document.addEventListener('keydown', function(e) {
        switch (e.keyCode - 96) {
            case 0: storeEquip(0); break; // UnEquip
            case 1: storeEquip(ID_BullsHelmet); break;
            case 2: storeEquip(ID_WinterCap); break;
            case 3: storeEquip(ID_SoldierHelmet); break;
            case 4: storeEquip(ID_HoneycrispHat); break;
            case 5: storeEquip(ID_BoosterHat); break;
            case 6: storeEquip(ID_BushGear); break;
            case 7: storeEquip(ID_SpikeGear); break;
            case 8: storeEquip(ID_BushidoArmor); break;
            case 9: storeEquip(ID_SamuraiArmor); break;
        }
    });

})();


(function() {
    'use strict';

    var conf = {
        'map': {
            'w': '130',
            'h': '130',
            'top': '15',
            'left': '15'
        },
    };

    // Change Layout
    $('#mapDisplay').css({
        'top': conf.map.top + 'px', // default 20px
        'left': conf.map.left + 'px',       // default 20px
        'width': conf.map.w + 'px',         // default 130px
        'height': conf.map.h + 'px'         // default 130px
    });
    $('#scoreDisplay').css({
        'bottom': '20px',                   // default 20px
        'left': '20px'                      // default 170px
    });

})();
(function() {
    var leaderboard2 = document.getElementById("setupCard");
        var myCssText = "display:block;margin-top:10px;";
        splixDIV2.innerHTML = '</br>Right Click -> Apple: Not eat, auto get to hand</br>Right Click -> Cookie: auto eat, not get to hand';

})();