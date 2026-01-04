// ==UserScript==
// @name         rvd script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *ivonaservice*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @downloadURL https://update.greasyfork.org/scripts/42362/rvd%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/42362/rvd%20script.meta.js
// ==/UserScript==

//USER SETTINGS
var banMePlz = true; //enable the banner
var sigBetter1Chance    = 0; //Make these add up to 100
var slightBetter1Chance = 50; //Make these add up to 100
var slightBetter2Chance = 50; //Make these add up to 100
var sigBetter2Chance    = 0; //Make these add up to 100
var soundSameChance     = 0; //Make these add up to 100
var soundDiffChance     = 0; //Make these add up to 100
var submitDelayinMS     = 2000;
//END USER SETTINGS

var totalPlayer1;
var curPlayer1;
var totalPlayer2;
var curPlayer2;

checkP1();

function checkP1(){
    setTimeout(function(){
        totalPlayer1Temp = $('#all-player1').text().slice(3);
        totalPlayer1 = totalPlayer1Temp[0]+totalPlayer1Temp[1];
        console.log("Player 1 length is equal to " + totalPlayer1 + " seconds");
        finishP1();
    },1500);
}

function finishP1(){
    setTimeout(function(){
        curPlayer1Temp = $('#spend-player1').text().slice(3);
        curPlayer1 = curPlayer1Temp[0]+curPlayer1Temp[1];
        console.log("Player 1 current time is equal to " + curPlayer1 + " seconds");
        if(Number(curPlayer1) == Number(totalPlayer1)){
            setTimeout(function(){ playP2(); },200);
        }else{
            setTimeout(function(){ playP2(); },2000);
        }
    },Number(totalPlayer1)*1000);
}

function playP2(){
    console.log("Proceeding to player 2");
    $('#playerButton-player2').click();
    setTimeout(function(){
        totalPlayer2Temp = $('#all-player2').text().slice(3);
        totalPlayer2 = totalPlayer2Temp[0]+totalPlayer2Temp[1];
        console.log("Player 2 length is equal to " + totalPlayer2 + " seconds");
        setTimeout(function(){ finishP2(); }, Number(totalPlayer2)*1000);
    },1500);
}

function finishP2(){
    curPlayer2Temp = $('#spend-player2').text().slice(3);
    curPlayer2 = curPlayer2Temp[0]+curPlayer2Temp[1];
    console.log("Player 2 current time is equal to " + curPlayer2 + " seconds");
    if(Number(curPlayer2) == Number(totalPlayer2)){
        setTimeout(function(){ answer(); },1000);
    }else{
        setTimeout(function(){ answer(); },2000);
    }
}

function answer(){
    if(banMePlz){
        console.log("answering");
        slightBetter1Chance += sigBetter1Chance;
        slightBetter2Chance += slightBetter1Chance;
        sigBetter2Chance += slightBetter2Chance;
        soundSameChance += sigBetter2Chance;
        soundDiffChance += soundSameChance;
        console.log("total odds percentage = " + soundDiffChance);
        var guess = randNum(1, soundDiffChance);
        if(guess < sigBetter1Chance){
            $('input#preference1').click();
            console.log("picking answer " + 1);
        }else if(guess < slightBetter1Chance){
            $('input#preference2').click();
            console.log("picking answer " + 2);
        }else if(guess < slightBetter2Chance){
            $('input#preference3').click();
            console.log("picking answer " + 3);
        }else if(guess < sigBetter2Chance){
            $('input#preference4').click();
            console.log("picking answer " + 4);
        }else if(guess < soundSameChance){
            $('input#preference5').click();
            console.log("picking answer " + 5);
        }else if(guess <= soundDiffChance){
            $('input#preference6').click();
            console.log("picking answer " + 6);
        }else{
            $('input#preference5').click();//shouldn't hit this, selects sounds same if error is present
            console.log("picking answer " + 5);
        }
        setTimeout(function(){ document.querySelector(`[id="submit"]`).click(); }, submitDelayinMS);
    }
}
//thank you for looking at my code. Nothing down here needs to be adjusted, User settings located up top. ♥