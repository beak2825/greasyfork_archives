// ==UserScript==
// @name         Enviar recursos
// @namespace    http://tampermonkey.net/
// @version      0
// @description  Dar recursos ao Bernas!
// @author       MacDowM
// @include      https://*&mode=send*
// @downloadURL https://update.greasyfork.org/scripts/420223/Enviar%20recursos.user.js
// @updateURL https://update.greasyfork.org/scripts/420223/Enviar%20recursos.meta.js
// ==/UserScript==

var madeira = 2300; //Quantidade de madeira para enviar
var argila = 2500; //Quantidade de argila para enviar
var ferro = 2200; //Quantidade de ferro para enviar
//var aldeia = "426|482"; //Aldeia que recebe
var aldeia = "426|482"; //Aldeia que recebe
var time = 9654 + Math.floor(Math.random() * 1234);
var resources_total = madeira + argila + ferro;

function checkMerchantMultiplier(){
    var merchants_availible = $('#market_merchant_available_count').text();
    var merchants_needed = Math.ceil(resources_total / 1000);
    var m_multi = 0;

    do{
        m_multi++
    }
    while((m_multi * merchants_needed) <= merchants_availible);

    return m_multi - 1;
}

function checkWoodMultiplier(){
    var w_multi = 0;
    var wood_availible = parseInt($('span[id=wood]').text());

    do{
        w_multi++
    }
    while((w_multi * madeira) <= wood_availible);

    return w_multi - 1;
}

function checkStoneMultiplier(){
    var s_multi = 0;
    var stone_availible = parseInt($('span[id=stone]').text());

    do{
        s_multi++
    }
    while((s_multi * argila) <= stone_availible);

    return s_multi - 1;
}

function checkIronMultiplier(){
    var i_multi = 0;
    var iron_availible = parseInt($('span[id=iron]').text());

    do{
        i_multi++
    }
    while((i_multi * ferro) <= iron_availible);

    return i_multi - 1;
}

function inputResources(){
    var general_multiplier = Math.min(checkMerchantMultiplier(), checkWoodMultiplier(), checkStoneMultiplier(), checkIronMultiplier());
    var wood = $('input[name=wood]');
    var stone = $('input[name=stone]');
    var iron = $('input[name=iron]');
    setTimeout(function() {wood.val(madeira * general_multiplier);}, 15);
    console.log("Setting " + madeira * general_multiplier + " wood.");
    setTimeout(function() {stone.val(argila * general_multiplier);}, 15);
    console.log("Setting " + argila * general_multiplier + " stone.");
    setTimeout(function() {iron.val(ferro * general_multiplier);}, 15);
    console.log("Setting " + ferro * general_multiplier + " iron.");
}

function inputVillage(){
    var target = $('input[name=input]');
    target.val(aldeia);
}

function nextVillage(){
    $('span[class=groupRight]').click();
    $('span[class=arrowRight]').click();
}

function checkMerchants(){
    console.log('Checking merchants... ');
    var merchants_availible = $('#market_merchant_available_count').text();
    var merchants_needed = Math.ceil(resources_total / 1000);
    console.log('Availible merchants: ' + merchants_availible);
    console.log('Needed merchants: ' + merchants_needed);
    if (merchants_needed <= merchants_availible){
        console.log('Enough merchants!');
        return true;
    }else{
        console.log('Not enough merchants!');
        return false;
    }
}

function checkWood(){
    console.log('Checking wood... ');
    var wood_availible = parseInt($('span[id=wood]').text());
    var wood_needed = madeira;
    console.log('Availible wood: ' + wood_availible);
    console.log('Needed wood: ' + wood_needed);
    if (wood_needed <= wood_availible){
        console.log('Enough wood!');
        return true;
    }else{
        console.log('Not enough wood!');
        return false;
    }
}

function checkStone(){
    console.log('Checking stone... ');
    var stone_availible = parseInt($('span[id=stone]').text());
    var stone_needed = argila;
    console.log('Availible stone: ' + stone_availible);
    console.log('Needed stone: ' + stone_needed);
    if (stone_needed <= stone_availible){
        console.log('Enough stone!');
        return true;
    }else{
        console.log('Not enough stone!');
        return false;
    }
}

function checkIron(){
    console.log('Checking iron... ');
    var iron_availible = parseInt($('span[id=iron]').text());
    var iron_needed = madeira;
    console.log('Availible iron: ' + iron_availible);
    console.log('Needed iron: ' + iron_needed);
    if (iron_needed <= iron_availible){
        console.log('Enough iron!');
        return true;
    }else{
        console.log('Not enough iron!');
        return false;
    }
}

function accept(){
    setTimeout(function() {$('input[value=Enviar][tabindex=8]').click();} , 150);
}

function process(){
    if (checkMerchants() && checkWood() && checkStone() && checkIron()){
        inputResources();
        inputVillage();
        accept();
    }else{
        setTimeout(nextVillage(), 250);
    }
}


if($('#content_value h2').text() == 'Confirmar transporte'){
    setTimeout(function() {$('input[value=Enviar]').click();} , 150);
}else{
    process();
}