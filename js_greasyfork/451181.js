// ==UserScript==
// @name         Auto CF
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @author       Chromatical
// @description  Enables CF/ Change Setup
// @match        https://longtail-new.mousehuntgame.com/
// @grant        GM_info
// @include        http://mousehuntgame.com/*
// @include        https://mousehuntgame.com/*
// @include        http://www.mousehuntgame.com/*
// @include        https://www.mousehuntgame.com/*
// @include        http://apps.facebook.com/mousehunt/*
// @include        https://apps.facebook.com/mousehunt/*
// @include        http://hi5.com/friend/games/MouseHunt*
// @include        http://mousehunt.hi5.hitgrab.com/*
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/451181/Auto%20CF.user.js
// @updateURL https://update.greasyfork.org/scripts/451181/Auto%20CF.meta.js
// ==/UserScript==

console.log('Auto CF enabled');

//SETTINGS

//Non-TE
var normalBase = 3080; //aerb = 3080, pb = 2904, aeib = 2120, eeb = 3149
var normalCharm = 1649; //funnel C/S/G = 1648/1652/1649, rupc = 1651, rvc = 553, upc = 545

//TE
var teBase = 3080; //PB
var teCharm = 1651; //rupc

//SETTINGS END

(function() {
    const interval = setInterval(function() {
        let UU = $('.valourRiftHUD-activeAugmentations').find('.valourRiftHUD-activeAugmentation.tu.mousehuntTooltipParent').hasClass('active');
        if (user.environment_name != "Valour Rift" || document.getElementsByClassName("valourRiftHUD-state farming")[0].innerText == "Tower Entrace") {
            return;
        }
        else {
            //Insert fucntions here
            getStats();
            setTimeout(function(){
                autoCF();
            }, 1000)
        }
    }, 30000); // set checking interval here (in miliseconds, 5000 = 5s)
})();

var currentCharm = '';
var currentBase = '';

//Updates current user status
function getStats() {
    currentCharm = user.trinket_item_id;
    currentBase = user.base_item_id;
};

function autoCF(){
    //Check floor
    var floorHundredth = document.getElementsByClassName("valourRiftHUD-number")[0].className.match(/[0-9]/g) || 0;
    var floorTenth = document.getElementsByClassName("valourRiftHUD-number")[1].className.match(/[0-9]/g) || 0;
    var floorOneth = document.getElementsByClassName("valourRiftHUD-number")[2].className.match(/[0-9]/g) || 1;
    var floor = parseInt(floorHundredth + floorTenth + floorOneth);

    //Checks for eclipse floor
    if (floor != 0 && (floor % 8 == 0)) {
        //Sets TE base and charms
        setCharm(teCharm);
        setBase(teBase);
        toggleCF(true);
        console.log("CF Floor!");
    }

    //Non eclipse = normal floor
    else {
        setCharm(normalCharm);
        setBase(normalBase);
        toggleCF(false);
    }
};

//Trap Control
function setCharm(charmID) {
    if (currentCharm != charmID) {
        hg.utils.TrapControl.setTrinket(charmID).go();
    }
};

function setBase(baseID) {
    if (currentBase != baseID) {
        hg.utils.TrapControl.setTrinket(baseID).go();
    }
};
function toggleCF(state) {
    if (user.quests.QuestRiftValour.is_fuel_enabled != state) {
        hg.views.HeadsUpDisplayRiftValourView.toggleFuel(state);
    }
};