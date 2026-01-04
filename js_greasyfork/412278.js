// ==UserScript==
// @name         timers on notifications
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @description  lol10
// @author       shtos
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412278/timers%20on%20notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/412278/timers%20on%20notifications.meta.js
// ==/UserScript==

(function() {
    'use strict';
//<span id="notification-furnace-bars-needed" style="position: absolute; left: 30px; bottom: 5px;">200</span>
    const furnaceNotif = 'notification-furnace';
    const foundryNotif = 'notification-charcoalFoundry';
    const rocketNotif = 'notification-rocket';
    const oldSmelt = window.smelt;
    window.smelt = function(){
        oldSmelt.apply(this, arguments);
        let bar = arguments[0] == 'copper' ? 'bronzeBars' : arguments[0] == 'sand' ? 'glass' : arguments[0] + 'Bars'
        document.querySelector(`#${furnaceNotif}-img-new`).src = `/images/${bar}.png`
    }
    const startThing = () => {
        if(window.var_username){
            $(`#${furnaceNotif}`)[0].style.position = 'relative'
            $(`#${furnaceNotif}`).append(`<img id="notification-furnace-img-new" class="img-50" src="/images/${getBestFurnace()}.png"><span id=${furnaceNotif}-timer></span><span id="${furnaceNotif}-bars-needed" style="position: absolute; left: 30px; bottom: 5px;text-shadow:-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;"></span>`);
            $(`#${foundryNotif}`).append(`<span id=${foundryNotif}-timer></span>`);
            $(`#${rocketNotif}`).append(`<span id=${rocketNotif}-timer></span>`);
            $(`#${furnaceNotif}-value`).hide()
            $(`#${furnaceNotif}-img`).hide()
            $(`#${foundryNotif}-value`).hide()
            $(`#${rocketNotif}-value`).hide()
            const oldSetItems = window.setItems;
            window.setItems = function(data) {
                oldSetItems.apply(this, arguments);
                if (var_smeltingNeededTimer > 0){
                    document.querySelector(`#${furnaceNotif}-timer`).textContent = updateTimer('furnace');
                    document.querySelector(`#${furnaceNotif}-bars-needed`).textContent = (var_smeltingRequestedAmount - var_smeltingCurrentAmount)
                }
                if (typeof var_charcoalFoundry != 'undefined'){
                    var_charcoalFoundryNeededTimer > 0
                        ? (document.querySelector(`#${foundryNotif}-timer`).textContent = updateTimer('foundry'))
                    : null;
                }
                if(typeof var_rocket != 'undefined'){
                    var_rocketStatus == 1 || var_rocketStatus == 3
                        ? (document.querySelector(`#${rocketNotif}-timer`).textContent = updateTimer('rocket'))
                    : null;
                }
            }
        }else{
            setTimeout(startThing, 1000)
        }
    }
    startThing()

    function updateTimer(key) {
        let average, dest, potion
        switch (key) {
            case 'furnace':
                potion = typeof var_largeRocketSpeedPotionTimer != 'undefined' && var_largeFurnacePotionTimer > 0 ? 3 : 1
                return formatTime(
                    ((var_smeltingRequestedAmount - var_smeltingCurrentAmount) * var_smeltingNeededTimer -
                    var_smeltingCurrentTimer)/potion
                );
            case 'foundry':
                return formatTime(
                    (var_charcoalFoundryRequestedAmount - var_charcoalFoundryCurrentAmount) *
                    var_charcoalFoundryNeededTimer -
                    var_charcoalFoundryCurrentTimer
                );
            case 'rocket':
                potion = typeof var_largeRocketSpeedPotionTimer != 'undefined' && var_largeRocketSpeedPotionTimer > 0 ? 2 : 1
                average = var_rocketDestination == 'moon' ? 2 : 140
                dest = var_rocketDestination == 'moon' ? 384000 : 54000000
                return var_rocketStatus == 1 ? formatTime((dest - var_rocketKm) / average / potion)
                     : var_rocketStatus == 3 ? formatTime(var_rocketKm / average / potion) : null;
        }
    }

})();