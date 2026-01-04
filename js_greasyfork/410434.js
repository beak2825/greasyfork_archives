// ==UserScript==
// @version      2.0.0
// @author       nam.d02th@gmail.com
// @match        https://freebitco.in/*
// @name         auto roll detect 999x
// @namespace    namtt007
// @description  namtt007
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/410434/auto%20roll%20detect%20999x.user.js
// @updateURL https://update.greasyfork.org/scripts/410434/auto%20roll%20detect%20999x.meta.js
// ==/UserScript==

var Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };
var lastBetRoll = 0;
let last_number = [];

function Random_integer(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
} 

(function() {
    'use strict';
var body = $('body');
var points = {};
var count_min = 1;
var reward = {};
    reward.select = function() {
        reward.points = parseInt($('.user_reward_points').text().replace(',',""));
        reward.bonustime = {};
        if ($("#bonus_container_free_points").length != 0) {
            reward.bonustime.text = $('#bonus_span_free_points').text();
            reward.bonustime.hour = parseInt(reward.bonustime.text.split(":")[0]);
            reward.bonustime.min = parseInt(reward.bonustime.text.split(":")[1]);
            reward.bonustime.sec = parseInt(reward.bonustime.text.split(":")[2]);
            reward.bonustime.current = reward.bonustime.hour * 3600 + reward.bonustime.min * 60 + reward.bonustime.sec;
        } else
            reward.bonustime.current = 0;
        console.log(reward.bonustime.current);
        if (reward.bonustime.current !== 0) {
            console.log(reward.bonustime.current);
        } else {
            /* namtt remove for don't buy free btc bonus 1000%
			if (reward.points < 12) {
                console.log("waiting for points");
            }
            else if (reward.points < 120) {
                    console.log("waiting for points 60");
                    RedeemRPProduct('free_points_1');
                }
            else if (reward.points < 600) {
                    console.log("waiting for points 120");
                    RedeemRPProduct('free_points_10');
                }
            else if (reward.points < 1200) {
                    console.log("waiting for points 600");
                    RedeemRPProduct('free_points_50');
                }
            else {
                RedeemRPProduct('free_points_100');
            }
            
			if ($('#bonus_span_fp_bonus').length === 0)
                if (reward.points >= 4400)
                    RedeemRPProduct('fp_bonus_1000');
			*/
        }
    };
   
    setTimeout(reward.select,1000);
    setInterval(reward.select,60000);
$(document).ready(function(){
	console.log("Status: Page loaded.");
    setTimeout(function(){
        $('#free_play_form_button').click();
        console.log("Status: Button ROLL clicked.");
    }, Random_integer(2000,4000));
	
	setTimeout(function(){
        $('.close-reveal-modal')[0].click();
        console.log("Status: Button CLOSE POPUP clicked.");
    }, Random_integer(12000,18000));
	
    var elapsedTime = setInterval(function(){
		var MULTIPLY_BTC = document.getElementsByClassName("double_your_btc_link");
		MULTIPLY_BTC[0].click();
        console.log("Status: Elapsed time " + count_min + " minutes");
        count_min = count_min + 1;
		loop();
		lastBetRoll = last_number[0];
		console.log("lastBetRoll: " + lastBetRoll);
    }, 60000);
	
    var autoFreeRoll = setInterval(function(){
        $('#free_play_form_button').click();
        console.log("Status: Button ROLL clicked again.");
    }, Random_integer(3605000,3615000));
	
	if(lastBetRoll >= 9990){
		//send email
		Email.send({
			Host: "smtp.live.com",
			Username : "namtest123456789@hotmail.com",
			Password : "Namxo2020",
			To : 'nonal46794@kespear.com',
			From : "namtest123456789@hotmail.com",
			Subject : "[Freebitco] ROLLED 999x",
			Body : "ROLLED 999x!!!!",
			}).then(
				message => alert("mail sent successfully")
			).catch((error) => {
				console.error('Error:', error);
			});	
		
		clearInterval(elapsedTime);
		clearInterval(autoFreeRoll);
		return;
	}
		
});

})();


// query history
// start from newest
// con 1500 iteraciones son al rededor de 30mil rolls, es lo maximo que deja mostrar el freebitcoin
// el script no contiene links a ningun lugar
var maxIterations = 0;

var $newHistory = $('#newer_bet_history');

var $olderHistory = $('#older_bet_history');

var currentIteration = 0;

var table = [];

//let last_number = [];
var idx_last_number = 0;

//var hashTable = {};

var loopSpeedMS = 150;

$('textarea#my_custom_history').remove();


function loop() {
    
	/*
	if(currentIteration > maxIterations) {
        // show data
		getTableStr();
        return;
    }
	*/

    currentIteration++;

    getIteration();
	   
}


function getIteration () {

    if (currentIteration == 1) {
        //$newHistory.click();
    }else {
        //$olderHistory.click(); //tut here
    }


    getData();


}


function getData() {

  

   readTable();

    //setTimeout(loop, loopSpeedMS);
}


function readTable() {
    var container = $('#bet_history_table_rows');

    var rows = $('>div', container);

    var currentDate = '';
	idx_last_number = 0;

    $.each(rows, function (idx, row) {

        var $r = $(row);

        if( /^multiply_history_date_row_.*/.test( $r.attr('id'))) {
            currentDate = getDateStr($r);
            return true;// continue next element
        }


        if ($r.hasClass('multiply_history_table_header')) {
            // ignore row
            return true;// continue next element
        }


        var rowObject = []

        var rowData = $r.find('>div:first>div');

        $.each(rowData, function (kdx, cell){

            
			
            switch(kdx) {
                case 0:
                   //rowObject.push( currentDate + ' ' + $(cell).text());
                break;
                case 1:
                    //rowObject.push($(cell).text());
                break;
                case 2:
                    //rowObject.push($(cell).text());
                break;
                case 3:
                    rowObject.push($(cell).text());
                break;
                case 4:
                    //rowObject.push($(cell).text());
                break;
                case 5:
                    //rowObject.push($(cell).text());
                break;
                case 6:
                   //rowObject.push($(cell).text());
                break;
                case 7:
                    // skip this column 
                    //rowObject.push($(cell).text());
                break;
                case 8:
                    // parser el link del click para obtener el conteo de apuestas y utilizarlo como ID

                    var linkInfo = parseLinkInfo($(cell));
                    //rowObject.push(linkInfo[0]);// NONCE value
                    //rowObject.push(linkInfo[1]);
                break;
                default:

            }

        });


        var rowCSVStr = rowObject.join(';')
		
        // remove duplicated elements
        // was added nonce value like id
        // hashTable[rowObject[0] + '|' + rowObject[0]] = rowCSVStr
		
		

        table.push(rowCSVStr);
		//console.log("rowData.length:"+ rowData.length);
		last_number[idx_last_number++] = parseInt(""+ rowObject[0]);
		
    });

}

function getDateStr($row) {

    // Example DATE: 28/08/2018
    var strDateRaw = $row.find('div').html().split(' ');
    strDateRaw = strDateRaw[1].split('/');

    return '' +  strDateRaw[2] + '-' + strDateRaw[1] +'-'+ strDateRaw[0];



}

function getTableStr(lineSeparator) {

    if (!lineSeparator)
        lineSeparator = '|';


    var r = table.join(lineSeparator);

       // add text area

       $('body').append('<textarea id="my_custom_history"></textarea>');


$('textarea#my_custom_history').text(r);

var copyText = document.getElementById("my_custom_history")

copyText.select();

document.execCommand("copy");



}

function parseLinkInfo($cell){

    var verifierLink = $cell.find('a').attr('href');

    var nonce = '-1';

    try {
        var matches = verifierLink.match(/nonce=(\d+)/);
        nonce = matches[1];
    }catch(_ex) {
        /* empty */
    }

    return [nonce, verifierLink];

}