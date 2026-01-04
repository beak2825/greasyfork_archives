// ==UserScript==
// @name         violation
// @namespace    zero.violation.torn
// @version      1.2
// @description  adds button for attacks single click
// @author       -zero [2669774]
// @match        https://www.torn.com/loader.php?sid=attack*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472919/violation.user.js
// @updateURL https://update.greasyfork.org/scripts/472919/violation.meta.js
// ==/UserScript==

var weaponID = 3; // Primary: 1, Melee: 3. Secondary: 2
const fightResult = 'hosp'; // hosp, leave, mug
const useTemp = true;






const start = `<button id='start'  style='width:150px;height:80px;' class="torn-btn zeroAttack">Start</button>`;
const attack = `<button id='attack' style='width:150px;height:80px;' class="torn-btn zeroAttack">Attack</button>`;
const hosp = `<button id='hosp' style='width:150px;height:80px;' class="torn-btn zeroAttack">Hosp</button>`;
const temp = `<button id='temp' style='width:150px;height:80px;' class="torn-btn zeroAttack">Temp</button>`;
const resp = `<span id='response'>violation</span>`;
const container = `<div id='attackContainer'></div>`;





var url = window.location.href;
let targets = JSON.stringify(url.match(/user2ID=\d*/gm));
var v = targets.substring(10, targets.length - 2);

function getRFC() {
    var rfc = $.cookie('rfc_v');
    if (!rfc) {
        var cookies = document.cookie.split('; ');
        for (var i in cookies) {
            var cookie = cookies[i].split('=');
            if (cookie[0] == 'rfc_v') {
                return cookie[1];
            }
        }
    }
    return rfc;
}



function insert() {
    $('#header-root').append(container);

    $('#attackContainer').append(start);

    $('#header-root').append(container);







    $('#attackContainer').css('display', 'flex');
    $('#attackContainer').css('justify-content', 'center');
    $('#attackContainer > button').css('margin', '10px');




    $('#header-root').append(resp);
    $('#response').css('display', 'table');
    $('#response').css('margin', '0 auto');

    $('#start').on('click', fstart);



}

function fstart() {
    console.log('start');
    $('#start').addClass('disabled');
    $('#start').prop('disabled', true);

    const link = `https://www.torn.com/loader.php?sid=attackData&mode=json&user2ID=${v}&rfcv=${getRFC()}`;


    $.post(link, {
        sid: "attackData",
        mode: "json",
        user2ID: v,
        rfcv: getRFC()

    }, function (statResp) {

        if (statResp.startErrorTitle || statResp.DB.defenderUser.life <= 1) {

            $('#response').html(statResp.startErrorTitle || "Unconscious");
            $('#start').removeClass('disabled');
            $('#start').prop('disabled', false);
        }
        else {
            rstart();
        }


    });



}

function rstart() {
    $.post('loader.php?sid=attackData&mode=json', {
        step: 'startFight',
        user2ID: v
    },
        function (result) {
            console.log(result);
            var stat = result.DB.hasOwnProperty('error');
            console.log(stat);
            if (stat) {
                $('#response').html(result.DB.error);
                $('#start').removeClass('disabled');
                $('#start').prop('disabled', false);

            }
            else {
                //    console.log('here');
                $('#response').html('Started');


                $('#start').off('click');

                if (useTemp) {
                    $('#start').attr('id', 'temp');
                    $('#temp').on('click', ftemp);
                    $('#temp').html('Temp');
                    $('#temp').removeClass('disabled');
                    $('#temp').prop('disabled', false);
                }
                else {
                    $('#start').prop('id', 'attack');
                    $('#attack').on('click', fattack);
                    $('#attack').html('Attack');
                    $('#attack').removeClass('disabled');
                    $('#attack').prop('disabled', false);
                }



            }

        });
}

function fattack() {
    $('#attack').addClass('disabled');
    $('#attack').prop('disabled', true);
    console.log('attack');
    $.post('loader.php?sid=attackData&mode=json&rfcv=' + getRFC(), {
        step: 'attack',
        user2ID: v,
        user1EquipedItemID: weaponID
    },
        function (result) {
            var stat = result.DB.hasOwnProperty('error');
            if (stat) {
                $('#response').html(result.DB.error);

            }
            else {
                let life = result.DB.defenderUser.life;
                let myLife = result.DB.attackerUser.life;
                /*
                                if (life <= 600){
                                    weaponID = 1;

                                }
                    */
                $('#response').html(`ATTACKER: ${myLife}/ DEFENDER: ${life}`);
                $('#attack').removeClass('disabled');
                $('#attack').prop('disabled', false);

                if (life <= 1) {
                    $('#attack').off('click');
                    $('#attack').attr('id', 'hosp');
                    $('#hosp').on('click', fhosp);
                    $('#hosp').html('Hosp');

                }
            }

        });
}


function fhosp() {
    console.log('hosp');
    $('#hosp').addClass('disabled');
    $('#hosp').prop('disabled', true);
   
    $.post('loader.php?sid=attackData&mode=json', {
        step: 'finish',
        fightResult: fightResult
    },
        function (result) {
            var stat = result.DB.hasOwnProperty('error');
            if (stat) {
                $('#response').html(result.DB.error);

            }
            else {
                $('#response').html(result.info.info);
                // selfHosp();


            }

        });
}

function ftemp() {
    console.log('temp');
    $('#temp').addClass('disabled');
    $('#temp').prop('disabled', true);
    $.post('loader.php?sid=attackData&mode=json', {
        step: 'attack',
        user2ID: v,
        user1EquipedItemID: 5
    },
        function (result) {
            var stat = result.DB.hasOwnProperty('error');
            if (stat) {
                $('#response').html(result.DB.error);

            }
            else {
                let life = result.DB.defenderUser.life;
                let myLife = result.DB.attackerUser.life;
                $('#response').html(`ATTACKER: ${myLife} / DEFENDER: ${life}`);
                $('#temp').removeClass('disabled');
                $('#temp').prop('disabled', false);
                $('#temp').off('click');

                if (life <= 1) {

                    $('#temp').prop('id', 'hosp');
                    $('#hosp').on('click', fhosp);
                    $('#hosp').html('Hosp');
                    return;

                }



                $('#temp').prop('id', 'attack');
                $('#attack').on('click', fattack);
                $('#attack').html('Attack');

            }

        });
}

(function () {
    'use strict';
    insert();
    // Your code here...
})();

