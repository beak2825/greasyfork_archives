// ==UserScript==
// @name         NORAN
// @namespace    zero.noran.torn
// @version      1.1
// @description  adds button for attacks single click
// @author       -zero [2669774]
// @match        https://www.torn.com/loader.php?sid=attack*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464777/NORAN.user.js
// @updateURL https://update.greasyfork.org/scripts/464777/NORAN.meta.js
// ==/UserScript==

const weaponID = 3; // Primary: 1, Melee: 3. Secondary: 2
const fightResult = 'leave'; // hosp, leave, mug
const useTemp = false;

const start = `<button id='start' class="torn-btn">Start</button>`;
const attack = `<button id='attack' class="torn-btn">Attack</button>`;
const hosp = `<button id='hosp' class="torn-btn">Hosp</button>`;
const temp = `<button id='temp' class="torn-btn">Temp</button>`;
const resp = `<span id='response'>NORAN</span>`;
const container = `<div id='attackContainer'></div>`;



var url = window.location.href;
let targets = JSON.stringify(url.match(/user2ID=\d*/gm));
var v = targets.substring(10, targets.length-2);


function insert(){
    $('#header-root').append(container);

    $('#attackContainer').append(start);
    // $('#attackContainer').append(attack);
    // $('#attackContainer').append(temp);
    // $('#attackContainer').append(hosp);




    $('#attackContainer').css('display','flex');
    $('#attackContainer').css('justify-content','center');
    $('#attackContainer > button').css('margin','10px');


    /*
    $('div[class^="titleContainer"]').append(start);
    $('div[class^="titleContainer"]').append(attack);
    $('div[class^="titleContainer"]').append(temp);
    $('div[class^="titleContainer"]').append(hosp);

*/


    // $('div[class^="topSection"]').insertAfter(resp);
    $('#header-root').append(resp);
    $('#response').css('display','table');
    $('#response').css('margin','0 auto');

    $('#start').on('click',fstart);
    //   $('#attack').on('click',fattack);
    // $('#hosp').on('click',fhosp);
    //$('#temp').on('click',ftemp);



}

function fstart(){
    console.log('start');
    $('#start').addClass('disabled');
    $('#start').prop('disabled',true);
    $.post('loader.php?sid=attackData&mode=json', {
        step: 'startFight',
        user2ID: v
    },
           function(result){
        console.log(result);
        var stat = result.DB.hasOwnProperty('error');
        console.log(stat);
        if (stat){
            $('#response').html(result.DB.error);
            $('#start').removeClass('disabled');
            $('#start').prop('disabled',false);

        }
        else{
            //    console.log('here');
            $('#response').html('Started');

            $('#start').removeClass('disabled');
            $('#start').prop('disabled',false);
            $('#start').off('click');

            if (useTemp){
                $('#start').attr('id','temp');
                $('#temp').on('click',ftemp);
                $('#temp').html('Temp');
            }
            else{
                $('#start').prop('id','attack');
                $('#attack').on('click',fattack);
                $('#attack').html('Attack');
            }


        }

    });

}

function fattack(){
    $('#attack').addClass('disabled');
    $('#attack').prop('disabled',true);
    console.log('attack');
    $.post('loader.php?sid=attackData&mode=json&rfcv=undefined', {
        step: 'attack',
        user2ID: v,
        user1EquipedItemID: weaponID
    },
           function(result){
        var stat = result.DB.hasOwnProperty('error');
        if (stat){
            $('#response').html(result.DB.error);

        }
        else{
            let life = result.DB.defenderUser.life;
            let myLife = result.DB.attackerUser.life;
            $('#response').html(`ATTACKER: ${myLife}/ DEFENDER: ${life}`);
            $('#attack').removeClass('disabled');
            $('#attack').prop('disabled',false);

            if (life <= 1){
                $('#attack').off('click');
                $('#attack').attr('id','hosp');
                $('#hosp').on('click',fhosp);
                $('#hosp').html('Hosp');

            }
        }

    });
}

function fhosp(){
    console.log('hosp');
    $('#hosp').addClass('disabled');
    $('#hosp').prop('disabled',true);
    $.post('loader.php?sid=attackData&mode=json', {
        step: 'finish',
        fightResult: fightResult
    },
           function(result){
        var stat = result.DB.hasOwnProperty('error');
        if (stat){
            $('#response').html(result.DB.error);

        }
        else{
            $('#response').html(fightResult);
        }

    });
}

function ftemp(){
    console.log('temp');
    $('#temp').addClass('disabled');
    $('#temp').prop('disabled',true);
    $.post('loader.php?sid=attackData&mode=json', {
        step: 'attack',
        user2ID: v,
        user1EquipedItemID: 5
    },
           function(result){
        var stat = result.DB.hasOwnProperty('error');
        if (stat){
            $('#response').html(result.DB.error);

        }
        else{

            $('#temp').removeClass('disabled');
            $('#temp').prop('disabled',false);
            $('#temp').off('click');


            $('#temp').prop('id','attack');
            $('#attack').on('click',fattack);
            $('#attack').html('Attack');

            let life = result.DB.defenderUser.life;
            let myLife = result.DB.attackerUser.life;
            $('#response').html(`ATTACKER: ${myLife} / DEFENDER: ${life}`);
        }

    });
}

(function() {
    'use strict';
    insert();
    // Your code here...
})();