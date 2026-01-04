// ==UserScript==
// @name         MooMoo ALL-IN-ONE MACRO
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  MooMoo Macro + AutoBuy || Both useful and not so useful hats
// @author       You
// @match                 *://moomoo.io/*
// @match                 *://sandbox.moomoo.io/*
// @match                 *://dev.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408697/MooMoo%20ALL-IN-ONE%20MACRO.user.js
// @updateURL https://update.greasyfork.org/scripts/408697/MooMoo%20ALL-IN-ONE%20MACRO.meta.js
// ==/UserScript==

(function() {

    document.getElementById("storeHolder").style = "height: 1500px; width: 450px;";
    document.getElementById("gameName").style.color = "green";
    document.getElementById("setupCard").style.color = "green";
    document.getElementById("gameName").innerHTML = "MooMoo.io <br>HAT MOD";
    document.getElementById('adCard').remove();
    document.getElementById("leaderboard").append('HAT MOD');
    document.getElementById("leaderboard").style.color = "#38F738";
    document.getElementById("allianceButton").style.color = "#38F738";
    document.getElementById("chatButton").style.color = "#38F738";
    document.getElementById("storeButton").style.color = "#38F738";
    $("#mapDisplay").css("background", "url('https://i.imgur.com/fgFsQJp.png')");
    document.getElementById("diedText").innerHTML = "YOU IS DED</br> >:)!!!!";
    $("#adCard").css({display: "none"});
    $("#gameCanvas").css('cursor', 'url(http://cur.cursors-4u.net/user/use-1/use153.cur), default');
    $("#moomooio_728x90_home").parent().css({display: "none"});

    let toggle = 'Normal';
    const toggleKey = 186; //;
    document.title = `MooMoo (${toggle})`;

    const hatList = {
       Unequip: 0,
       MooCap: 51,
       AppleCap: 50,
       MooHead: 38,
       PigHead: 29,
       FluffHead: 30,
       PandouHead: 36,
       BearHead: 37,
       MonkeyHead: 38,
       PolarHead: 44,
       FezHat: 35,
       EnigmaHat: 42,
       BlitzHat: 43,
       BobXIIIHat: 49,
       BumbleHat: 8,
       StrawHat: 2,
       WinterHat: 15,
       CowboyHat: 5,
       RangerHat: 4,
       ExplorerHat: 18,
       FlipperHat: 31,
       MarksmanCap: 1,
       BushGear: 10,
       Halo: 48,
       SoldierHelmet: 6,
       AntiVenomGear: 23,
       MedicGear: 13,
       MinersHelmet: 9,
       MusketeerHat: 32,
       BullHelmet: 7,
       EmpHelmet: 22,
       BoosterHat: 12,
       BarbarianArmor: 26,
       PlagueMask: 21,
       BullMask: 46,
       WindmillHat: 14,
       SpikeGear: 11,
       TurretGear: 53,
       SamuraiArmor: 20,
       BushidoArmor: 16, //55
       ScavengerGear: 27,
       TankGear: 40,
       ThiefGear: 52,
       AssasainGear: 56,
       Darknight: 0 //26,
   };

    const keyList = {
        shift: 16,
        0: 48,
        1: 49,
        2: 50,
        3: 51,
        4: 52,
        5: 53,
        6: 54,
        7: 55,
        8: 56,
        9: 57,
        a: 65,
        b: 66,
        c: 67,
        d: 68,
        e: 69,
        f: 70,
        g: 71,
        h: 72,
        i: 73,
        j: 74,
        k: 75,
        l: 76,
        m: 77,
        n: 78,
        o: 79,
        p: 80,
        q: 81,
        r: 82,
        s: 83,
        t: 84,
        u: 85,
        v: 86,
        w: 87,
        x: 88,
        y: 89,
        z: 90,
    };

    function key(name) {
        return keyList.name;
    };

    function buyAndEquip(hat) {
        let target = hatList.hat;
        storeBuy(target);
        storeEquip(target);
    }

    if (document.activeElement.id !== 'chatBox'){
         document.addEventListener('keydown', function(e) {
            if (e.keycode == toggleKey) {toggle == 'Normal' ? toggle = 'Abnormal' : toggle = 'Normal'};
            document.title = `MooMoo (${toggle})`
        })
     }

     if (document.activeElement.id !== 'chatBox' && toggle == 'Normal'){
         document.addEventListener('keydown', function(e) {
            switch (e.keyCode) {
                case key('shift'): buyAndEquip('Unequip'); break;
                case key('r'): buyAndEquip('BullHelmet'); break;
                case key('t'): buyAndEquip('TurretGear'); break;
                case key('g'): buyAndEquip('SoldierHelmet'); break;
                case key('b'): buyAndEquip('BoosterHat'); break;
                case key('z'): buyAndEquip('TankGear'); break;
                case key('u'): buyAndEquip('SamuraiArmor'); break;
                case key('m'): buyAndEquip('MedicGear'); break;
                case key('n'): buyAndEquip('WinterCap'); break;
                case key('h'): buyAndEquip('AntiVenomGear'); break;
                case key('y'): buyAndEquip('FlipperHat'); break;
                case key('i'): buyAndEquip('AssasainGear'); break;
                case key('p'): buyAndEquip('SpikeGear'); break;
            }
        });
     }

     if (document.activeElement.id !== 'chatBox' && toggle == 'Abnormal'){
         document.addEventListener('keydown', function(e) {
            switch (e.keyCode) {
                case key('shift'): buyAndEquip('Unequip'); break;
                case key('r'): buyAndEquip('AppleCap'); break;
                case key('t'): buyAndEquip('FezHat'); break;
                case key('g'): buyAndEquip('PolarHat'); break;
                case key('b'): buyAndEquip('MooHead'); break;
                case key('z'): buyAndEquip('MooCap'); break;
                case key('u'): buyAndEquip('FluffHead'); break;
                case key('m'): buyAndEquip('MonkeyHead'); break;
                case key('n'): buyAndEquip('BearHead'); break;
                case key('h'): buyAndEquip('PandouHead'); break;
                case key('y'): buyAndEquip('BushGear'); break;
                case key('i'): buyAndEquip('BummbleHat'); break;
                case key('p'): buyAndEquip('PigHead'); break;
            }
        });
     }
})();