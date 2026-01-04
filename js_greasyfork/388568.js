// ==UserScript==
// @name         TW - Pedido Mercado
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Lordsthan
// @match        https://*.tribalwars.com.br/game.php?village=*&screen=market*&mode=call*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388568/TW%20-%20Pedido%20Mercado.user.js
// @updateURL https://update.greasyfork.org/scripts/388568/TW%20-%20Pedido%20Mercado.meta.js
// ==/UserScript==

function getMinimumAmount(supply){
    switch(supply){
        case 'wood':
            return 337;
        case 'stone':
            return 361;
        case 'iron':
            return 302;
    }
}

function getSupplyAmount(index, supply){
    return parseInt(document.getElementsByClassName('res ' + supply)[index].innerHTML.replace( /\D+/g, ''));
}

function getSupplyMultiplicator(index){
    return Math.floor(getSupplyAmount(index, getLowestSupplyName(index)) / getMinimumAmount(getLowestSupplyName(index)));
}

function getLowestSupplyAmount(index){
    return Math.min(getSupplyAmount(index, 'wood'), getSupplyAmount(index, 'stone'), getSupplyAmount(index, 'iron'));
}

function getLowestSupplyName(index){
    if(getLowestSupplyAmount(index) == getSupplyAmount(index, 'wood')){
        return 'wood';
    }
    else if(getLowestSupplyAmount(index) == getSupplyAmount(index, 'stone')){
        return 'stone';
    }
    else if(getLowestSupplyAmount(index) == getSupplyAmount(index, 'iron')){
        return 'iron';
    }
}

function getTraderAmount(index){
    return parseInt(document.getElementsByClassName('traders')[index-1].innerHTML.split('/')[0]);
}

function getMaximumTradeableAmount(index, supply){
    if(getSupplyMultiplicator(index) > getTraderAmount(index)){
        return getTraderAmount(index) * getMinimumAmount(supply);
    }
    else{
        return getSupplyMultiplicator(index) * getMinimumAmount(supply);
    }
}

function getTradeableAmount(index, supply){
    return getMinimumAmount(supply) * (Math.floor(getSupplyAmount(index, supply) / getMinimumAmount(supply)));
}

function getSupplyName(index){
    switch(index){
        case 0:
            return 'wood';
        case 1:
            return 'stone';
        case 2:
            return 'iron';
    }
}

function fixClassName(name, supply){
    var old = [].slice.apply(document.getElementsByClassName(name + supply));
    for(var k = 0; k < old.length; k++){
        old[k].className = old[k].className.replace(name + supply, 'res ' + supply);
    }
}

var a = 0;

function delayedLoop(){
    if(document.getElementsByClassName('call_button btn')[a].value == 'Pedido'){
        document.getElementsByClassName('call_button btn')[a].click();
    }
    if(++a == document.getElementsByClassName('call_button btn')){
        return;
    }
    window.setTimeout(delayedLoop, 1000);
}

function run(){
    var villageAmount = document.getElementById("village_list").rows.length;
    var selectedVillage = false;
    if(document.getElementById("village_list") !== null && villageAmount > 0){
        for(var i = 1; i < villageAmount; i++){
            if(!selectedVillage){
                document.getElementsByClassName('call_button btn')[i-1].click();
                selectedVillage = true;
                if(document.getElementsByClassName('call_button btn')[i-1].value == 'Pedido'){
                    document.getElementsByName('wood')[i-1].value = getMaximumTradeableAmount(i, 'wood');
                    document.getElementsByName('stone')[i-1].value = getMaximumTradeableAmount(i, 'stone');
                    document.getElementsByName('iron')[i-1].value = getMaximumTradeableAmount(i, 'iron');
                }
                selectedVillage = false;
            }
        }
        delayedLoop();
    }
}

(function() {
    'use strict';
    var name = ['warn ', 'warn_90 '];
    var supply = ['wood', 'stone', 'iron'];
    for(var i = 0; i < name.length; i++){
        for(var j = 0; j < supply.length; j++){
            fixClassName(name[i], supply[j]);
        }
    }
    run();
    setInterval(function() {window.location.reload();}, 60000);
})();