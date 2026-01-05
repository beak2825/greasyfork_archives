// ==UserScript==
// @name         Coinbrawl
// @version      0.53
// @description  try to take over the world!
// @author       You
// @match        https://www.coinbrawl.com/*
// @grant        none
// @namespace https://greasyfork.org/users/25633
// @downloadURL https://update.greasyfork.org/scripts/17437/Coinbrawl.user.js
// @updateURL https://update.greasyfork.org/scripts/17437/Coinbrawl.meta.js
// ==/UserScript==

var numAttack = 0;

//ads
$('div.panel-game-content:first').hide();
$('div.col-sm-9 > center').hide();
$('div.col-sm-3').hide();
document.body.style.fontSize = "10px";
$('div.panel-body > p').hide();

setTimeout(function(){ 
    location.reload();
},3600000); //1hr

if (location.href=="https://www.coinbrawl.com/recaptcha"){

    setTimeout(function(){ 
        top.location.href = "https://www.coinbrawl.com/";
    },120000);

} else if ( $("li.active a[href='/").length == 1 ){ //On main page

    $('div.col-sm-6').hide();
    $('div.col-sm-4').hide();
    $('div.col-sm-8').hide();

    var BANKLIMIT = 2752170;
    var withdrawLimit = 50000;

    var startS = setInterval(function(){

        var rawSta = $('#quick-stats > div > div > ul > li:nth-child(5) > span.value > span:nth-child(2)').text();
        var rawTok = $('#quick-stats > div > div > ul > li:nth-child(6) > span.value > span:nth-child(2)').text();
        var gold = $('#quick-stats > div > div > ul > li:nth-child(7) > span.value.text-success > span:nth-child(2)').text();
        var cuurentBank = $('#quick-stats > div > div > ul > li:nth-child(9) > span.value.text-success > span:nth-child(2)').text();
        var stamina = rawSta.split("/");
        var token = rawTok.split("/");

        if (token[0] > 0 ) {
            //setTimeout(function(){ 

            attackUser();
            //},600);
        } else {
            alertSoundeff();
        }

        if ( gold > withdrawLimit && cuurentBank < BANKLIMIT ) {
            console.log('[BOT] Gold limit reached. Depositing to Bank');
            top.location.href = "https://www.coinbrawl.com/bank/deposit_max";
        } 

    },3000);

} else if ( $("li.active a[href='/bank").length == 1 ){ 
    var gotoArena = setTimeout(function(){
        top.location.href = "https://www.coinbrawl.com/";
    },3000);
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for ( var i=0; i <1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}


function attackUser(){
    var hasNon = true;
    var prevI = 0;
    var prevP = 0;
    numAttack = 0;

    $('tbody:first > tr').each(function(index, element){
        var winGreen = $(this).find('div.text-success').text().replace('%','');

        if (  winGreen > 0 && !(prevI == index && prevP == winGreen) ) {
            numAttack++;
            
            $(this).find('td > a')[0].click();
            $(this).find('td').css("background", "brown");
            sleep(1000);
            
            prevI = index;
            prevP = winGreen;
            hasNon = false;
            
            //console.log('Pos: ', index, ' | ', winGreen, '%');         
        } 

        if (numAttack == 1){
            $('#npc-battle-table > div > table > tbody > tr:nth-child(6) > td').css("background", "brown");
            $('#npc-battle-table > div > table > tbody > tr:nth-child(6) > td:nth-child(5) > a')[0].click();
            
            sleep(1000);
            return;
        }
        sleep(700);
    });

    if (hasNon) {
        $('tbody:first > tr:first').find('td').css("background", "red");
        $('tbody:first > tr:first').find('td > a')[0].click();
        
        sleep(800);

    }
}

function alertSoundeff(){
    track = '';
    for(i=0;i<8;) {
        i++;
        for(k = l = 11025; k--;) {
            track += String.fromCharCode(
                Math.sin(k/88400*2*Math.PI*481.34)
                * Math.min((l-k)/83,k/l)
                * (i%5&&i%9-3?88:33) + 128);
        }
    }
    player = new Audio('data:audio/wav;base64,UklGRkRiBQBXQVZFZm10IBAAAAA\
BAAEARKwAAESsAAABAAgAZGF0YSBi'+btoa('\5\0'+track));
    player.play();
}


