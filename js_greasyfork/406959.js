// ==UserScript==
// @version      1.0.3
// @author       nam.d02th@gmail.com
// @match        https://freebitco.in/*
// @name         detect 1 or 10000
// @namespace    1.0.1
// @description  namtt007
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/406959/detect%201%20or%2010000.user.js
// @updateURL https://update.greasyfork.org/scripts/406959/detect%201%20or%2010000.meta.js
// ==/UserScript==


//Martingale script
//Double bet on every lose ... base bet on win
var base_bet = 0.00000001;
var payout = 1.01 + Math.random() * 0.02; // odds should be from 1.1 -> 1.3

//Change client seed after every roll
function client_seed() {
  var text = document.getElementById("next_server_seed_hash").value;
  var text_change = text.substr(Random_integer(0,text.length/2), text.length - 1);
  document.getElementById("next_client_seed").value = text_change;
}

//Stop the script 
function stop(){
    clearInterval(martingale);    
}

function start(){
    martingale = setInterval(play, 1000);    
}

function Random_integer(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
} 

function Random_integer(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
} 
// query history
// start from newest
// con 1500 iteraciones son al rededor de 30mil rolls, es lo maximo que deja mostrar el freebitcoin
// el script no contiene links a ningun lugar
var maxIterations = 0;

var $newHistory = $('#newer_bet_history');

var $olderHistory = $('#older_bet_history');

var currentIteration = 0;

var table = [];

var last_number = [];
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

    if ($newHistory.is(':disabled') || $olderHistory.is(':disabled')) {
        //setTimeout(getData, 400);
        //return;
    }

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

	for(var i = 0 ; i < last_number.length; i++)
	{
		//console.log("namtt last_number[" + i + "]:"+ last_number[i]);
	} 
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
// my strategy

//Bet Randomly
function Bet() {
	var randomBet = Random_integer(0,1);
	if(randomBet == 0){
		document.getElementById('double_your_btc_bet_lo_button').click();
	} else {
		document.getElementById('double_your_btc_bet_hi_button').click();
	}
}

var lastBetRoll = 0
function play() {
	
    if (document.getElementById('double_your_btc_bet_hi_button').disabled === false) {
		
		loop();
		lastBetRoll = last_number[0];
		console.log("lastBetRoll: " + lastBetRoll);
		
		if(lastBetRoll <= 10 || lastBetRoll >= 9990 || lastBetRoll == 10000){
			document.getElementById('free_play_form_button').click();
			stop();
			return;
		}
		document.getElementById("double_your_btc_stake").value = base_bet;
		document.getElementById("double_your_btc_payout_multiplier").value = payout;
		
        Bet();
		
    }  
}

//Initiate the script after every 1000 milliseconds
start();
