// ==UserScript==
// @version      0.6.9 (13/06/2020)
// @author       nam.d02th@gmail.com
// @match        https://freebitco.in/*
// @name         tao song namtt007
// @namespace    0.6.9
// @description  namtt007
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/402351/tao%20song%20namtt007.user.js
// @updateURL https://update.greasyfork.org/scripts/402351/tao%20song%20namtt007.meta.js
// ==/UserScript==


//Martingale script
//Double bet on every lose ... base bet on win

//config here
var RODA_LIMIT = 1;
var LOSE_LIMIT_HIGHSTAKE = 1;
var LOSE_LIMIT_HIGHSTAKE_TURN_OUT = 0;
var MULTIPLY_BY_STAKEHIGH = 1.5 + Math.random() * 0.2; // 1.5 ->1.7
var payout = 1.01 + Math.random() * 0.02; // odds should be from 1.1 -> 1.3
var highPayout = 5.01 + Math.random() * 0.99;  //odds should be from 5.01 -> 5.99

//autobet_bet_alternate
var AUTOBET_PAYOUT = 3; // 30 + Math.random() * 2
var AUTOBET_ROLLCOUNT = 1;
var AUTOBET_BASE_BET = 0.00000010;
var AUTOBET_LOSEINCREASEBETPERCENT = 1;
var wager = 0;
var betHi = document.getElementById("autobet_bet_hi");
var betLo = document.getElementById("autobet_bet_lo");
var betalt = document.getElementById("autobet_bet_alternate");
var betOdds = document.getElementById("autobet_bet_odds");
var betRollCount = document.getElementById("autobet_roll_count");
var betBase = document.getElementById("autobet_base_bet");
var betStopAfterProfit = document.getElementById("stop_after_profit");
var betLoseIncreaseBet = document.getElementById("autobet_lose_increase_bet");
var betLoseIncreaseBetPercent = document.getElementById("autobet_lose_increase_bet_percent");
var betLoseReturnToBase = document.getElementById("autobet_lose_return_to_base");
var betStopAfterProfitValue = document.getElementById("stop_after_profit_value");
var betStopAfterLoss = document.getElementById("stop_after_loss");
var betStopAfterLossValue = document.getElementById("stop_after_loss_value");
var startBet = document.getElementById("start_autobet");


//manual bet
var MANUALBET_PAYOUT = 3;  // 30 + Math.random() * 2odds should be from 5.01 -> 5.99
var MANUALBET_BASE_BET = 0.00000010;

var use_autoBet = true;

var bigBet_lose_count = 0;
var BIGBET_LOSE_INTERVAL = 99999;
var BIGBET_LOSE_STOP = 999999;
var changeSide = true;

//Base bet
var base_bet = 0.00000002;
var BTC_TO_STS = 100000000;

//min 2 => balance > 500 sts (base 2, lose x1.5, 9 row => 38 x 2 = 76 sts => (time 10: 76 x 4 => 304) => total = 76x2 + 304 = 456 sts)
//min 3 => balance > 700 sts (base 3, lose x1.5, 9 row => 38 x 4 = 114  sts => (time 10: 114 x 4 => 456) => total = 114 x 2 + 456 = 684 sts)
//min 4 => balance > 924 sts (base 4, lose x1.5, 9 row => 38 x 4 = 152  sts => (time 10: 152 x 4 => 608) => total = 158 x 2 + 608 = 924 sts)
//min 5 => balance > 1050 sts (base 5, lose x1.5, 9 row => 38 x 5 = 175  sts => (time 10: 175 x 4 => 700) => total = 175 x 2 + 700 = 1050 sts)
//min 6 => balance > 1368 sts (base 6, lose x1.5, 9 row => 38 x 6 = 228  sts => (time 10: 228 x 4 => 912) => total = 228 x 2 + 912 = 1368 sts)
//min 7 => balance > 1596 sts (base 7, lose x1.5, 9 row => 38 x 7 = 266  sts => (time 10: 266 x 4 => 1064) => total = 266 x 2 + 1064 = 1596 sts)
//min 8 => balance > 1824 sts (base 8, lose x1.5, 9 row => 38 x 8 = 304  sts => (time 10: 304 x 4 => 1216) => total = 304 x 2 + 1216 = 1824 sts)
//min 9 => balance > 2052 sts (base 9, lose x1.5, 9 row => 38 x 9 = 342  sts => (time 10: 342 x 4 => 1368) => total = 342 x 2 + 1368 = 2052 sts)
//min 10 => balance > 2280 sts (base 10, lose x1.5, 9 row => 38 x 10 = 380  sts => (time 10: 380 x 4 => 1520) => total = 380 x 2 + 1520 = 2280 sts)

var MUL_BASE_BET = 4;
var balance_one = parseFloat(document.getElementById("balance2").innerHTML.substr(0, 10));

var profit_limit_value = 0.00010001;


var number_roll_roda = 0;


//The number of rolls after which the script will stop
var number_of_rolls_limit = 9999999999999;
var number_of_rolls_stop = 0;
var number_of_midle = 0;

var number_of_rolls_limit_highPayout = 20;
var number_max = 0;
var number_min = 0;
var number_max_min = 0;
var number_at_margin = 0;
var RANGE_CHECK_MARGIN = 40;
var DELTA_CHECK_MARGIN = 10;
var DELTA_CHECK_MARGIN_TOO_LONG = 20;
var RANGE_MANY_MARGIN = 30;

var DELTA_MARGIN_MIN = 1500;
var DELTA_MARGIN_MAX= 3000;
var DELTA_MARGIN_DEFAULT= 1868;
var DELTA_MARGIN = 1868;

var DEFAULT_PAYOUT = 1.9;


var multi_fail = 1;

//choose strategy
var turn_out = false;
var change_low_odds = false;
var change_low_odds_counter = 0;
var wrong_way = false;
var current_bet = -1;


//lose row
var lose_row = 0;
var multi_stake_fail = 1;
var random_no_lose_multi_stake = 0;
var predict_number = "";
var previous_number = "";

//delta value

var MIDLE_MARGIN = 5000;
var TOP_MARGIN = 10000;
var BOTTOM_MARGIN = 0;
var follow_bet = false;
var start_stake_high = false;
var follow_bet_hi = false;
var follow_bet_low = false;
var LOSE_LIMIT = 30;

var on_lose_multiply_by = 2;
var on_lose_multiply_by_stakehigh = MULTIPLY_BY_STAKEHIGH;

var number_of_rolls = 0;
var number_of_rolls_highStake = 0;

document.getElementById("double_your_btc_stake").value = base_bet;
document.getElementById("double_your_btc_payout_multiplier").value = payout ;

//Change to 'true' if you want to stop after exceeding a certain profit
var profit_limit = false;



//Change to 'true' if you want to stop after exceeding a certain loss
var loss_limit =  false;
var loss_limit_value =  0.10002000 // lose 15 row

//Change client seed after every roll

function client_seed() {
  document.getElementById("next_client_seed").value = document.getElementById("next_server_seed_hash").value;
}

function get_Predict_number() {
	if(!win_highStake)
		Adjust_Stake();

	var delta = last_number[0] - last_number[1];
	var delta_1 = MIDLE_MARGIN - last_number[0];
	var delta_2 = TOP_MARGIN - last_number[0];
	var delta_3 = BOTTOM_MARGIN - last_number[0];

	if(start_stake_high)
	{
		if(delta < 0)
		{
			if(Math.abs(delta) > DELTA_MARGIN)
			{
				if(previous_number > 5250)
					predict_number = 2500;
				else
					predict_number = 7500;
			}
			else
			{
				if(previous_number > 5250)
				{
					if(	Math.abs(delta_1) > DELTA_MARGIN )
					{
						predict_number = 2500;
					}
					else
					{
						predict_number = previous_number;
					}
				}
				else
				{
					if( Math.abs(delta_3) > DELTA_MARGIN)
					{
						predict_number = 7500;
					}
					else
					{
						predict_number = previous_number;
					}
				}
			}
		}
		else
		{
			if(Math.abs(delta) > DELTA_MARGIN)
			{
				if(previous_number > 5250)
					predict_number = 2500;
				else
					predict_number = 7500;
			}
			else
			{
				if(previous_number > 5250)
				{
					if( Math.abs(delta_2) > DELTA_MARGIN )
					{
						predict_number = 2500;
					}
					else
					{
						predict_number = previous_number;
					}
				}
				else
				{
					if( Math.abs(delta_1) > DELTA_MARGIN )
					{
						predict_number = 7500;
					}
					else
					{
						predict_number = previous_number;
					}
				}
			}
		}
	}
	else
	{
		if(delta < 0)
		{
			if( !turn_out )
			{
				// decrease
				if(previous_number >= 5000)
				{
					if(	Math.abs(delta_1) > Math.abs (delta ) )
					{
						predict_number = previous_number;

					}
					else
					{
						predict_number = 2500;

					}
				}
				else
				{
					if( Math.abs(delta_3) > Math.abs (delta) )
					{
						predict_number = previous_number;

					}
					else
					{
						predict_number = 7500;

					}
				}
			}
			else
			{
				// increase
				if(previous_number >= 5000)
				{
					if( Math.abs(delta_2) > Math.abs (delta) )
					{
						predict_number = previous_number;

					}
					else
					{
						predict_number = 2500;

					}
				}
				else
				{
					if( Math.abs(delta_1) > Math.abs (delta) )
					{
						predict_number = previous_number;

					}
					else
					{
						predict_number = 7500;

					}
				}
			}
		}
		else
		{
			if( !turn_out )
			{
				// increase
				if(previous_number > 5000)
				{
					if( Math.abs(delta_2) > Math.abs (delta) )
					{
						predict_number = previous_number;

					}
					else
					{
						predict_number = 2500;

					}
				}
				else
				{
					if( Math.abs(delta_1) > Math.abs (delta) )
					{
						predict_number = previous_number;

					}
					else
					{
						predict_number = 7500;

					}
				}
			}
			else
			{
				// decrease
				if(previous_number > 5000)
				{
					if(	Math.abs(delta_1) > Math.abs (delta ) )
					{
						predict_number = previous_number;

					}
					else
					{
						predict_number = 2500;

					}
				}
				else
				{
					if( Math.abs(delta_3) > Math.abs (delta) )
					{
						predict_number = previous_number;

					}
					else
					{
						predict_number = 7500;

					}
				}
			}
		}
	}

	console.log("previous_number   " + previous_number );


}

function Adjust_Stake() {

	if(!start_stake_high )
	{
		var delta = last_number[0] - last_number[1];
		if ( previous_number >= 5000 && previous_number <= 6500) {
			if(lose_row == 1 && (number_max + number_min < 5)){
				document.getElementById("double_your_btc_payout_multiplier").value = highPayout;
				document.getElementById("double_your_btc_stake").value = base_bet * MUL_BASE_BET * 2;
				start_stake_high = true;
				number_of_rolls_highStake = 0;
				console.log("START WITH STAKE_HIGH from HIGH");
				follow_bet_low = true;
				follow_bet_hi = false;
			} else if(number_of_rolls - number_at_margin > DELTA_CHECK_MARGIN)
			{
				if(number_of_rolls - number_at_margin > DELTA_CHECK_MARGIN_TOO_LONG)
				{
					document.getElementById("double_your_btc_payout_multiplier").value = highPayout;
					document.getElementById("double_your_btc_stake").value = base_bet * MUL_BASE_BET * 2;
					start_stake_high = true;
					number_of_rolls_highStake = 0;
					console.log("START WITH STAKE_HIGH from HIGH");
					follow_bet_low = true;
					follow_bet_hi = false;
				}
				else
				{
					number_of_rolls = 0;
					number_max = 0;
					number_min = 0;
					number_at_margin = 0;
					number_of_rolls_highStake = 0;
				}
			}
			else
			{
				number_at_margin = number_of_rolls;
				number_max++;
				number_max_min = number_max + number_min;
				if( number_max_min == 10 || (number_max_min / number_of_rolls >= 0.3 && number_of_rolls >= RANGE_MANY_MARGIN))
				{
					if(number_of_rolls >= RANGE_CHECK_MARGIN)
					{
						number_of_rolls = 0;
						number_max = 0;
						number_min = 0;
						number_at_margin = 0;
						number_of_rolls_highStake = 0;
					}
					else
					{
						document.getElementById("double_your_btc_payout_multiplier").value = highPayout;
						if(number_max_min / number_of_rolls >= 0.3 && number_of_rolls >= RANGE_MANY_MARGIN)
						{
							document.getElementById("double_your_btc_stake").value = base_bet * MUL_BASE_BET * 2;
						}
						else
						{
							document.getElementById("double_your_btc_stake").value = base_bet * MUL_BASE_BET;
						}
						start_stake_high = true;
						number_of_rolls_highStake = 0;
						console.log("START WITH STAKE_HIGH from HIGH");
						follow_bet_low = true;
						follow_bet_hi = false;
					}
				}
			}
		}
		else if ( previous_number >= 3500 && previous_number <= 5000)
		{
			if(lose_row == 1 && (number_max + number_min < 5)){
				document.getElementById("double_your_btc_payout_multiplier").value = highPayout;
				document.getElementById("double_your_btc_stake").value = base_bet * MUL_BASE_BET * 2;
				start_stake_high = true;
				number_of_rolls_highStake = 0;
				console.log("START WITH STAKE_HIGH from LOW");
				follow_bet_low = false;
				follow_bet_hi = true;
			} else if(number_of_rolls - number_at_margin > DELTA_CHECK_MARGIN)
			{
				if(number_of_rolls - number_at_margin > DELTA_CHECK_MARGIN_TOO_LONG)
				{
					document.getElementById("double_your_btc_payout_multiplier").value = highPayout;
					document.getElementById("double_your_btc_stake").value = base_bet * MUL_BASE_BET * 2;
					start_stake_high = true;
					number_of_rolls_highStake = 0;
					console.log("START WITH STAKE_HIGH from LOW");
					follow_bet_low = false;
					follow_bet_hi = true;
				}
				else
				{
					number_of_rolls = 0;
					number_max = 0;
					number_min = 0;
					number_at_margin = 0;
					number_of_rolls_highStake = 0;
				}
			}
			else
			{
				number_at_margin = number_of_rolls;
				number_min++;
				number_max_min = number_max + number_min;
				if( number_max_min == 10 || (number_max_min / number_of_rolls >= 0.3 && number_of_rolls >= RANGE_MANY_MARGIN))
				{
					if(number_of_rolls >= RANGE_CHECK_MARGIN)
					{
						number_of_rolls = 0;
						number_max = 0;
						number_min = 0;
						number_at_margin = 0;
						number_of_rolls_highStake = 0;
					}
					else
					{
						document.getElementById("double_your_btc_payout_multiplier").value = highPayout;
						if(number_max_min / number_of_rolls >= 0.3 && number_of_rolls >= RANGE_MANY_MARGIN)
						{
							document.getElementById("double_your_btc_stake").value = base_bet * MUL_BASE_BET * 2;
						}
						else
						{
							document.getElementById("double_your_btc_stake").value = base_bet * MUL_BASE_BET;
						}
						start_stake_high = true;
						number_of_rolls_highStake = 0;
						console.log("START WITH STAKE_HIGH from LOW");
						follow_bet_low = false;
						follow_bet_hi = true;

					}
				}
			}
		}
	}


	console.log("number_of_rolls: " + number_of_rolls);
	console.log("number_at_margin: " + number_at_margin);
	console.log("number_max:   " + number_max );
	console.log("number_min:   " + number_min );

}

//Bet Randomly

function Bet() {
	if(usingNamtt007Strategy){
		if (array[index] == 0) {
		document.getElementById('double_your_btc_bet_lo_button').click();
		}
		else {
			document.getElementById('double_your_btc_bet_hi_button').click();
		}
	} else {
		if (predict_number >= 5000) {
			document.getElementById('double_your_btc_bet_hi_button').click();
			current_bet = 1;
		}
		else {
			document.getElementById('double_your_btc_bet_lo_button').click();
			current_bet = 0;
		}
	}
}

//Stop the script

function stop(){
    clearInterval(martingale);
}

function start(){
    martingale = setInterval(play, 500);
}

function resetValue(){
	document.getElementById("double_your_btc_stake").value = base_bet;
	follow_bet = false;
	document.getElementById("double_your_btc_payout_multiplier").value = payout;
	start_stake_high = false;
	number_roll_roda = 0;
	win_highStake = false;

	number_of_rolls = 0;
	number_max = 0;
	number_min = 0;
	number_at_margin = 0;
	number_of_rolls_highStake = 0;

	var MULTIPLY_BY_STAKEHIGH = 1.5 + Math.random() * 0.2; // 1.5 ->1.7
	payout = 1.01 + Math.random() * 0.02;
	highPayout = 5.01 + Math.random() * 0.99;  //odds should be from 5.01 -> 5.99
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


var start_AutoBet = false;

function Random_integer(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Initiate the script once

var current_stake = 0;
var win_highStake = false;

var current_bigBetStake = 0;

function getRandomWaitWhenLose(){
  var wait = Random_integer(5047,8096);
  console.log('Waiting for ' + wait + 'ms before next bet.');
  return wait ;
}

function Random_integer(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function VoDuyenStrategy() {
    if(previous_number > 5250){
		betHi.checked = true;
		betLo.checked = false;
	} else {
		betHi.checked = false;
		betLo.checked = true;
	}

	betOdds.value = 30;
	betRollCount.value = 11;
	betBase.value = 0.00000002;
	betStopAfterProfit.checked = true;
	betLoseIncreaseBet.checked = true;
	betLoseIncreaseBetPercent.value = 20;
	betStopAfterProfitValue.value = 0.00000001;
	betStopAfterLoss.checked = true;
	betStopAfterLossValue.value = 0.00003001;
	//startBet.click();
    stop();
    return;
}

var usingNamtt007Strategy = false;
var array = [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1];
var index = 0;
var Namtt007Strategy_base_bet = 0.00000010;
var Namtt007_STOP = 10;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function Namtt007Strategy() {
	index = 0;
    shuffleArray(array);
	console.log("FOLLOW Namtt007Strategy");
	for(var i=0; i< Namtt007_STOP; i++){
		console.log(array[i]);
	}
	Namtt007_STOP = Math.floor(5 + Math.random() * 8);
    console.log("Namtt007_STOP: " + Namtt007_STOP);
	document.getElementById("double_your_btc_stake").value = current_bigBetStake*1.5;

}

function play() {
    if (document.getElementById('double_your_btc_bet_hi_button').disabled === false) {

		balance_two = parseFloat(document.getElementById("balance2").innerHTML.substr(0, 10));
		

		loop();
		previous_number = last_number[0];

        profit = balance_two - balance_one ;
        loss = balance_one-balance_two;

        won = document.getElementById('double_your_btc_bet_win').innerHTML;

        if (won.match(/(\d+\.\d+)/) !== null) {
			wager += parseFloat($('#double_your_btc_stake').val());

            document.getElementById("double_your_btc_stake").value = base_bet;

			lose_row = 0;
			follow_bet = false;
			document.getElementById("double_your_btc_payout_multiplier").value = payout;

			if(start_stake_high)
			{
				if(number_roll_roda == 0)
				{
					console.log("WIN WITH HIGHSTAKE at roll: " + number_of_rolls_highStake);
					win_highStake = true;
					number_of_rolls_highStake = 0;
					number_at_margin = 0;
					number_of_rolls = 0;
					number_max = 0;
					number_min = 0;
					on_lose_multiply_by_stakehigh = MULTIPLY_BY_STAKEHIGH;

					if(previous_number >= 5000)
						turn_out = true;
					else
						turn_out = false;

					number_of_midle = 0;
					change_low_odds = false;
					change_low_odds_counter = 0;
					wrong_way = false;

				}

			}
			else
			{
				win_highStake = false;
			}

			if(usingNamtt007Strategy && index > 0){
				console.log("WIN NAMTT007 STRATEGE");
				setTimeout(function(){
						window.location.reload();
						console.log("REFRESH PAGE");
					  }, 1 * 1000 * 30);
				stop();
				return;
			} else if(start_AutoBet ){
				console.log("WIN AUTOBET");
				resetValue();
				bigBet_lose_count = 0;
				current_bigBetStake = 0;
				start_AutoBet = false;
				usingNamtt007Strategy = false;
				
			}
        }

        lost = document.getElementById('double_your_btc_bet_lose').innerHTML;

        if (lost.match(/(\d+\.\d+)/) !== null ) {
            wager += parseFloat($('#double_your_btc_stake').val());
			lose_row++;

			if(!start_stake_high || win_highStake)
			{

			}
			else
			{
				if(previous_number >=4000 && previous_number <= 6000)
					number_of_midle++;

				//console.log("current_bet: " + current_bet);
				console.log("previous_number: " + previous_number);


				if( ( (current_bet == 0 && previous_number >= 8417)
					|| (current_bet == 1 && previous_number <= 1583)
					) && !change_low_odds && number_of_rolls_highStake >=6
				)
				{
					wrong_way = true;
				}
				console.log("wrong_way: " + wrong_way + " ---------********");

				if(( (number_of_rolls_highStake >=5 && number_of_midle/number_of_rolls_highStake >= 0.6)
				|| number_of_rolls_highStake == LOSE_LIMIT_HIGHSTAKE_TURN_OUT
				|| wrong_way
				) && !change_low_odds
				)
				{
					document.getElementById("double_your_btc_payout_multiplier").value = payout;
					current_bet_amount = document.getElementById("double_your_btc_stake").value;
					document.getElementById("double_your_btc_stake").value = current_bet_amount * 1.5 ;
					on_lose_multiply_by_stakehigh = on_lose_multiply_by;
					console.log("MANY MIDLE NUMBER - CHANGE PAYOUT");
					change_low_odds = true;
					change_low_odds_counter = 0;
					number_of_midle = 0;
					if(wrong_way)
						wrong_way = false;


					// stop: lose all, start begin
					//stop();
					//return;
				}
				if(number_of_rolls_highStake == LOSE_LIMIT_HIGHSTAKE)
				{
					console.log("LOSE ALL - START AGAIGN");
					document.getElementById("double_your_btc_stake").value = base_bet;
					lose_row = 0;
					follow_bet = false;
					document.getElementById("double_your_btc_payout_multiplier").value = payout;
					start_stake_high = false;
					number_of_rolls_highStake = 0;
					number_at_margin = 0;
					number_of_rolls = 0;
					number_max = 0;
					number_min = 0;
					on_lose_multiply_by_stakehigh = MULTIPLY_BY_STAKEHIGH;

					if(previous_number >= 5000)
						turn_out = true;
					else
						turn_out = false;

					number_of_midle = 0;
					change_low_odds = false;
					change_low_odds_counter = 0;
					wrong_way = false;


					/*
					//stop: lose all, start begin
					console.log("LOSE ALL - STOP");
					stop();
					return;
					*/
				}
			}


			//to do: double is here
			//document.getElementById("double_your_btc_stake").value = base_bet;

			if(start_AutoBet ){
				console.log("LOSE AUTOBET");
				resetValue();
				bigBet_lose_count++;

				if(bigBet_lose_count == BIGBET_LOSE_STOP){
					usingNamtt007Strategy = true;
					Namtt007Strategy();
					console.log("USE Namtt007Strategy");
				}

				if(bigBet_lose_count % BIGBET_LOSE_INTERVAL == 0){
					if(changeSide){
						changeSide = false;
					} else {
						changeSide = true;
					}
				}
				start_AutoBet = false;
			}

			if(usingNamtt007Strategy){
				document.getElementById("double_your_btc_payout_multiplier").value = 3;
				current_bet_amount = document.getElementById("double_your_btc_stake").value;
				document.getElementById("double_your_btc_stake").value = current_bet_amount*1.5;
			} else {
				current_bet_amount = document.getElementById("double_your_btc_stake").value;
				document.getElementById("double_your_btc_stake").value = base_bet;
			}

        }

		current_stake = Math.round( document.getElementById("double_your_btc_stake").value * BTC_TO_STS );
		//console.log("Stake: " + current_stake + " sts");
		//console.log("balance_one: " + balance_one);
		//console.log("balance_two: " + balance_two);

		//console.log("Lose row " + lose_row);

		
		client_seed();
		

        get_Predict_number();

		if(start_stake_high)
		{
			if(number_max_min = 10 || lose_row > 0 ){
				if(number_max > number_min){
					if(changeSide){
						betHi.checked = true;
						betLo.checked = false;
					} else {
						betHi.checked = false;
						betLo.checked = true;
					}

					betalt.checked = false;
					MANUALBET_PAYOUT = 3; // 30 + Math.random() * 2
					if(bigBet_lose_count > 0){
						document.getElementById("double_your_btc_stake").value = current_bigBetStake*1.6;
					} else {
						document.getElementById("double_your_btc_stake").value = MANUALBET_BASE_BET;
					}
					current_bigBetStake = document.getElementById("double_your_btc_stake").value;
					document.getElementById("double_your_btc_payout_multiplier").value = MANUALBET_PAYOUT;
				} else {
					if(changeSide){
						betHi.checked = false;
						betLo.checked = true;
					} else {
						betHi.checked = true;
						betLo.checked = false;
					}

					betalt.checked = false;
					MANUALBET_PAYOUT = 3; // 30 + Math.random() * 2
					if(bigBet_lose_count > 0){
						document.getElementById("double_your_btc_stake").value = current_bigBetStake*1.6;
					} else {
						document.getElementById("double_your_btc_stake").value = MANUALBET_BASE_BET;
					}
					current_bigBetStake = document.getElementById("double_your_btc_stake").value;
					document.getElementById("double_your_btc_payout_multiplier").value = MANUALBET_PAYOUT;
				}

				AUTOBET_PAYOUT = 3; // 30 + Math.random() * 2
				betOdds.value = AUTOBET_PAYOUT;
				betRollCount.value = AUTOBET_ROLLCOUNT;
				betBase.value = current_bigBetStake;
				betStopAfterProfit.checked = true;
				betLoseIncreaseBet.checked = true;
				betLoseIncreaseBetPercent.value = AUTOBET_LOSEINCREASEBETPERCENT;
				betLoseReturnToBase.checked = false;

				startBet.click();

				if(use_autoBet){
					start_AutoBet = true;
					return;
				}
				else {
					stop();
					return;
				}
			} else {
				resetValue();
				return;
			}
		}
		//console.log("RESULT NUMBER: " + previous_number);
		//console.log("number_of_rolls_stop: " + number_of_rolls_stop);


		//console.log("TARGET PROFIT: " + Math.round( profit_limit_value * BTC_TO_STS ) + " sts");
		/*
		if(start_AutoBet || start_stake_high)
		{
			stop();
			console.log("profit limit reached");
			return;
		}
		*/

		if (profit >= profit_limit_value){
            stop();
			//balance_one	= balance_two;
            console.log("profit limit reached");
			return;
         }

        if (loss >= loss_limit_value ){
            stop();
            //balance_one	= balance_two;
			console.log("loss limit reached");
			return;
         }

        if (number_of_rolls_stop >= number_of_rolls_limit && !start_stake_high){
            stop();
            console.log("rolls limit reached");
			return;
         }

		if(usingNamtt007Strategy && index == Namtt007_STOP){
			console.log("FAIL NAMTT007 STRATEGY");
			setTimeout(function(){
						window.location.reload();
						console.log("REFRESH PAGE");
					  }, 1 * 1000 * 30);
			stop();
			return;
		}

        Bet();

		if(usingNamtt007Strategy){
			index++;
			console.log("index: " + index);
		}

        number_of_rolls += 1;
		number_of_rolls_stop+=1;

		if(start_stake_high)
		{
			if(win_highStake)
			{
				number_roll_roda ++;
				number_of_rolls_highStake = 0;
				if(number_roll_roda == RODA_LIMIT)
				{
					start_stake_high = false;
					number_roll_roda = 0;
					win_highStake = false;
					number_of_rolls = 0;
					number_max = 0;
					number_min = 0;
					number_at_margin = 0;
					number_of_rolls_highStake = 0;
				}
				console.log("number_roll_roda: " + number_roll_roda);
			}
			else
			{
				number_of_rolls_highStake++;
			}
		}
		console.log("bigBet_lose_count: " + bigBet_lose_count);
		console.log("changeSide: " + changeSide);
		console.log("wager: " + wager.toFixed(8));
		var profit_sts = Math.round( profit * BTC_TO_STS );
		console.log("-----profit-------: " + profit.toFixed(8) );
    }
}


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




//Initiate the script after every 1000 milliseconds

//var martingale = setTimeout(play, 1000);
var martingale = setInterval(play, 1000);
