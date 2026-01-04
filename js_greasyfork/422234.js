// ==UserScript==
// @name FREEBITCO.IN BOT
// @description bitcoin bot for freebitco.in
// @include     https://freebitco.in/*
// @copyright   2021, projet1jc@gmail.com
// @namespace 	jaycee
// @author 	jaycee
// @version	0.0.8
// @downloadURL https://update.greasyfork.org/scripts/422234/FREEBITCOIN%20BOT.user.js
// @updateURL https://update.greasyfork.org/scripts/422234/FREEBITCOIN%20BOT.meta.js
// ==/UserScript==

function loadScript(url, callback)
{
	var head = document.head;
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	script.onreadystatechange = callback;
	script.onload = callback;
	head.appendChild(script);
}

/**************************************************/

var config = {
	initialBet: 1e-8,
	initialOdds: 2,
	neededConsecutiveLosses: 8,
	maxNumberOfTries: 20000,
	initialIncreasedBet: 0.00000125,
	maxIncreasedBet: 0.01024,
	betMultiplier: 2,
	virtual: false,
	virtualCapital: 0.02046,
	speed: 300,
	randomSpeedEcartype: 200,
	stopLoss : 4.00000000,
	takeProfit : 0.00010000,
	randomizeClientSeed: true,
	delayWait: 0,
	delayConsecutiveLoss: 12,
	randomDelayEcartype: 0,
	stopConsecutiveLosses : 0,
	betType : 'hi',
	alternate : 'dont',
	automaticFreeRolls : true,
	rpBonus : true,
	freeRollMaxWager : 0.00000300,
	freeRollWaitingTimeFirstClick : 2500,
	freeRollWaitingTimeErrors : 2500,
	freeRollWaitingTimeReclick : 60000,
	freeRollWaitingTimeEcartype : 1000,
	freeRollMaxNumberOfReclicks : 2, 
	blockReloadPage: false
}

//***********************************

var bet;
var odds;
var balance;
var realBalance = parseFloat($('#balance').html());
var exit = true;
var timeout;
var highIncreasedBet;
var lowIncreasedBet;
var maxConsecutiveLossesOnIncreasedBet;
var losingChances;
var consecutiveLosses;
var numberRolled = 0;
var numberOfTries = 0;
var maxConsecutiveLosses_stat = [];
var earnings = 0.00;
var client_seed = $('#next_client_seed').val();
var next_nonce = parseInt($('#next_nonce').text(), 10);
var waitWave = false;
var minNeededFunds;
var freeRollAlreadyTimed = false;

//*********************************

function main() {
	var interval = function(){
		if(!waitWave){
			rollBot();
			if(!exit) timeout = setTimeout(interval, Math.max(0, getRandomArbitrary(config.speed-config.randomSpeedEcartype, config.speed+config.randomSpeedEcartype)));
		}
		else{
			waitWave = false;
			if(!exit) timeout = setTimeout(interval, Math.max(0, getRandomArbitrary(config.delayWait-config.randomDelayEcartype, config.delayWait+config.randomDelayEcartype)));
		}
	}
	interval();
}

function rollBot() {
	var balanceTmp = parseFloat($('#balance').html());
	if(earnings > -config.stopLoss && earnings < config.takeProfit && balanceTmp != balance){
		if(!config.virtual){
			numberRolled = parseInt($('#multiplier_first_digit').html()+$('#multiplier_second_digit').html()+$('#multiplier_third_digit').html()+$('#multiplier_fourth_digit').html()+$('#multiplier_fifth_digit').html(), 10);
			earnings += balanceTmp - balance;
			realBalance = balanceTmp;
		}
		if((config.betType == 'hi' && numberRolled <= highIncreasedBet) || (config.betType == 'lo' && numberRolled >= lowIncreasedBet)){
			consecutiveLosses++;
			//
			if(config.delayWait > 0 && consecutiveLosses >= config.delayConsecutiveLoss) waitWave = true;
			//
			if(config.alternate == 'loss'){
				if(config.betType == 'hi') config.betType = 'lo';
				else config.betType = 'hi';
			}
		}
		else if (bet != config.initialBet){
			if(consecutiveLosses <= maxConsecutiveLosses_stat.length){
				maxConsecutiveLosses_stat[consecutiveLosses-1]++;
			}
			bet = config.initialBet;
			odds = config.initialOdds;
			if(config.stopConsecutiveLosses > 0 && consecutiveLosses >= config.stopConsecutiveLosses) exit = true;
			consecutiveLosses = 0;
			document.getElementById("double_your_btc_payout_multiplier").value = odds.toFixed(2).toString();
			document.getElementById("double_your_btc_stake").value = bet.toFixed(8).toString();
			numberOfTries++;
			if(numberOfTries == config.maxNumberOfTries) exit = true;
			//
			if(config.alternate == 'win'){
				if(config.betType == 'hi') config.betType = 'lo';
				else config.betType = 'hi';
			}
		}
		else{
			if(consecutiveLosses > 0 && consecutiveLosses <= maxConsecutiveLosses_stat.length){
				maxConsecutiveLosses_stat[consecutiveLosses-1]++;
			}
			if(config.stopConsecutiveLosses > 0 && consecutiveLosses >= config.stopConsecutiveLosses) exit = true;
			consecutiveLosses = 0;
			numberOfTries++;
			if(numberOfTries == config.maxNumberOfTries) exit = true;
			//
			if(config.alternate == 'win'){
				if(config.betType == 'hi') config.betType = 'lo';
				else config.betType = 'hi';
			}
		}
		if(((consecutiveLosses == config.neededConsecutiveLosses && bet == config.initialBet) || (consecutiveLosses > config.neededConsecutiveLosses && bet != config.initialBet)) && consecutiveLosses > 0){
			if(bet == config.initialBet){
				bet = config.initialIncreasedBet;
				odds = config.initialOdds;
				document.getElementById("double_your_btc_payout_multiplier").value = odds.toFixed(2).toString();
				document.getElementById("double_your_btc_stake").value = bet.toFixed(8).toString();
			}
			else if(bet*config.betMultiplier <= config.maxIncreasedBet){
				bet *= config.betMultiplier;
				document.getElementById("double_your_btc_stake").value = bet.toFixed(8).toString();
			}
			else{
				bet = config.initialBet;
				odds = config.initialOdds;
				document.getElementById("double_your_btc_payout_multiplier").value = odds.toFixed(2).toString();
				document.getElementById("double_your_btc_stake").value = bet.toFixed(8).toString();
				numberOfTries++;
				if(numberOfTries == config.maxNumberOfTries) exit = true;
			}
		}
		balance = balanceTmp;
		//
		var maxConsecutiveLosses_stat_string = '';
		for (var i in maxConsecutiveLosses_stat)
		{
			maxConsecutiveLosses_stat_string += maxConsecutiveLosses_stat[i] + ", ";
		}
		maxConsecutiveLosses_stat_string = maxConsecutiveLosses_stat_string.substr(0, maxConsecutiveLosses_stat_string.length-2);
		//
		if (config.randomizeClientSeed) {
			var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			var randomString = '';
			for (i = 0; i < 16; i++) {
				var randomPoz = Math.floor(Math.random() * charSet.length);
				randomString += charSet.substring(randomPoz, randomPoz + 1);
			}
			$('#next_client_seed').val(randomString);
			client_seed = randomString;
		}
		//
		$('#ui_bot_number_tries').text(numberOfTries);
		$('#ui_bot_profit').text(earnings.toFixed(8));
		$('#ui_bot_current_cons_losses').text(consecutiveLosses);
		$('#ui_bot_cons_losses_matrix').text(maxConsecutiveLosses_stat_string);
		if(config.betType == 'hi'){
			$('#ui_bot_bet_type').text('Betting higher than');
			$('#ui_bot_high_bet').text(highIncreasedBet);
		}
		else{
			$('#ui_bot_bet_type').text('Betting lower than');
			$('#ui_bot_high_bet').text(lowIncreasedBet);
		}
		//
		if(!config.virtual) $('#double_your_btc_bet_'+config.betType+'_button').click();
		else $('#balance').text(virtual_click_bet().toFixed(8).toString());
		//
		if(config.alternate == 'bet'){
			if(config.betType == 'hi') config.betType = 'lo';
			else config.betType = 'hi';
		}
	}
	else if(earnings <= -config.stopLoss || earnings >= config.takeProfit){
		exit = true;
	}
}

function virtual_click_bet(){
	var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var randomString = '';
	for (var i = 0; i < 61; i++) {
		var randomPoz = Math.floor(Math.random() * charSet.length);
		randomString += charSet.substring(randomPoz, randomPoz + 1);
	}
	var server_seed = randomString;
	//
	var string1 = ""+next_nonce+":"+server_seed+":"+next_nonce;
	var string2 = ""+next_nonce+":"+client_seed+":"+next_nonce;
	var hash = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(string1, string2));
	var string3 = hash.substring(0, 8);
	var hexToDec = parseInt(string3, 16);
	var roll = Math.round(hexToDec/429496.7295);
	numberRolled = roll;
	//
	next_nonce++;
	var high = parseInt(10000-9500/odds, 10);
	var low = parseInt(9500/odds, 10);
	if((config.betType == 'hi' && roll > high) || (config.betType == 'lo' && roll < low)){
		var result = bet*(odds-1.00);
		earnings += result;
		return balance+result;
	}
	else{
		earnings -= bet;
		return balance-bet;
	}
}

function updateUI(){
	balance = (config.virtual) ? config.virtualCapital : realBalance;
	if(!config.virtual){
		if(config.initialIncreasedBet > balance){
			config.initialIncreasedBet = balance;
			$('#ui_bot_initial_increased_bet').val(config.initialIncreasedBet.toFixed(8));
		}
		if(config.maxIncreasedBet > balance){
			config.maxIncreasedBet = balance;
			$('#ui_bot_max_increased_bet').val(config.maxIncreasedBet.toFixed(8));
		}
		if(config.stopLoss < 0.0){
			config.stopLoss = 0;
			$('#ui_bot_sl').val(config.stopLoss.toFixed(8));
		}
	}
	highIncreasedBet = parseInt(10000-9500/config.initialOdds, 10);
	lowIncreasedBet = parseInt(9500/config.initialOdds, 10);
	maxConsecutiveLossesOnIncreasedBet = Math.max(0, Math.floor(Math.log(config.maxIncreasedBet/config.initialIncreasedBet)/Math.log(config.betMultiplier)));
	losingChances = Math.pow(highIncreasedBet/10000, maxConsecutiveLossesOnIncreasedBet+config.neededConsecutiveLosses+1);
	var i = 0;
	var betTmp = config.initialIncreasedBet;
	minNeededFunds = betTmp;
	for(i=0;i<maxConsecutiveLossesOnIncreasedBet;i++){
		betTmp *= config.betMultiplier;
		minNeededFunds += betTmp;
	}
	minNeededFunds = parseFloat(minNeededFunds.toFixed(8));
	//
	if(config.betType == 'hi'){
		$('#ui_bot_bet_type').text('Betting higher than');
		$('#ui_bot_high_bet').text(highIncreasedBet);
	}
	else{
		$('#ui_bot_bet_type').text('Betting lower than');
		$('#ui_bot_high_bet').text(lowIncreasedBet);
	}
	$('#ui_bot_losing_chances').text((losingChances*100).toFixed(8)+'%');
	$('#ui_bot_max_cons_losses').text(config.neededConsecutiveLosses+maxConsecutiveLossesOnIncreasedBet);
	$('#ui_bot_legend_increased_bet').text('After '+config.neededConsecutiveLosses+' consecutive losses parameters');
	$('#ui_bot_max_loss').text(minNeededFunds.toFixed(8));
	$('#ui_bot_delay_waves_text').text('(betting will be delayed by '+config.delayWait+'ms after reaching '+config.delayConsecutiveLoss+' consecutive losses in order to dodge future losses and increase profit probability)');
	$('#ui_bot_random_speed_text').text('(speed will randomly oscillate between '+Math.max(0, (config.speed-config.randomSpeedEcartype))+' and '+(config.speed+config.randomSpeedEcartype)+', increasing randomness and therefore profit probability)');
	$('#ui_bot_random_delay_text').text('(the previous delay will randomly oscillate between '+Math.max(0, (config.delayWait-config.randomDelayEcartype))+' and '+(config.delayWait+config.randomDelayEcartype)+', increasing randomness and therefore profit probability)');
	$('#ui_bot_stop_cl_text').text('Stop after reaching '+config.stopConsecutiveLosses+' consecutive losses');
	//
	for(var e in config){
		setCookie('configBot_'+e, JSON.stringify(config[e]), 7);
	}
}

function updateMatrixConsecutiveLosses(){
	var i = 0;
	maxConsecutiveLosses_stat = [];
	for(i=0;i<Math.max(1, config.neededConsecutiveLosses)+maxConsecutiveLossesOnIncreasedBet+10;i++){
		maxConsecutiveLosses_stat.push(0);
	}
	var maxConsecutiveLosses_stat_string = '';
	for (i in maxConsecutiveLosses_stat)
	{
		maxConsecutiveLosses_stat_string += maxConsecutiveLosses_stat[i] + ((i == maxConsecutiveLosses_stat.length-1) ? "" : ", ");
	}
	$('#ui_bot_cons_losses_matrix').text(maxConsecutiveLosses_stat_string);
}

var unlockCaptcha = function(){
	//
	$($('.double_your_btc_link')[0]).click();
	setTimeout(function(){$($('.free_play_link')[0]).click();}, 1000);
	//
	if($('#unblock_modal_no_captcha_container').css('display') != 'none'){
		var wager_required = parseFloat($('#unblock_modal_no_captcha #option_container_buy_lottery').text().substring(6, 16));
		if(realBalance >= wager_required) {
			var nb_consecutive_free_rolls = Math.ceil(wager_required/config.freeRollMaxWager);
			if(wager_required <= config.freeRollMaxWager){
			    $('.play_jackpot').prop('checked', false);
				document.getElementById("double_your_btc_payout_multiplier").value = '1.01';
				document.getElementById("double_your_btc_stake").value = config.freeRollMaxWager.toFixed(8);
				$('#double_your_btc_bet_'+config.betType+'_button').click();
			}
			else if(nb_consecutive_free_rolls < 10 || parseInt($('#free_play_digits').text().replaceAll(' ', '')) >= 9886 || parseFloat($($('#bet_history_table .large-2')[5]).text()) > parseFloat($('#fp_min_reward').text())){
				if(nb_consecutive_free_rolls < 100){
					var balanceTmp = parseFloat($('#balance').html());
					//
					$('.play_jackpot').prop('checked', false);
					document.getElementById("double_your_btc_payout_multiplier").value = '1.01';
					document.getElementById("double_your_btc_stake").value = config.freeRollMaxWager.toFixed(8);
					$('#double_your_btc_bet_'+config.betType+'_button').click();
					//
					var current_consecutive_free_rolls = 1;
					//
					var interval_free_roll = function(){
						var balanceTmp2 = parseFloat($('#balance').html());
						//
						if(balanceTmp != balanceTmp2 && current_consecutive_free_rolls < nb_consecutive_free_rolls){
							balanceTmp = balanceTmp2;
							document.getElementById("double_your_btc_payout_multiplier").value = '1.01';
							document.getElementById("double_your_btc_stake").value = config.freeRollMaxWager.toFixed(8);
							$('#double_your_btc_bet_'+config.betType+'_button').click();
							//
							current_consecutive_free_rolls++;
							setTimeout(interval_free_roll, 2000);
						}
					}
					setTimeout(interval_free_roll, 2000);
				}
			}
			else{
				console.log("FBTC BOT: we could not roll because of captchas and because the requirements are too high ("+wager_required+"), please fullfill the necessary requirements to unlock them before. (You can see them on the main page by clicking on 'REQUIREMENTS TO UNLOCK BONUSES').");
			}
		}
		else{
			console.log("FBTC BOT: we could not roll because of captchas, please fullfill the necessary requirements to unlock them before. (You can see them on the main page by clicking on 'REQUIREMENTS TO UNLOCK BONUSES').");
		}
	}
}

function freeRollBot() {
	var interval = function(){
		if(config.automaticFreeRolls){
			unlockCaptcha();
			if(!document.getElementById('time_remaining') || $('#time_remaining').text() == "" || $('#time_remaining').css('display') == 'none' || $('#time_remaining').text() == "0Minutes0Seconds"){
				freeRollAlreadyTimed = false;
				if(config.rpBonus && (!document.getElementById('bonus_span_free_points') || $('#bonus_container_free_points').css('display') == 'none')){
					var rps = parseInt($($('.user_reward_points')[0]).text().replace(',', ''));
					if(rps >= 1200){
						RedeemRPProduct('free_points_100');
					}
					else if(rps >= 600){
						RedeemRPProduct('free_points_50');
					}
					else if(rps >= 300){
						RedeemRPProduct('free_points_25');
					}
					else if(rps >= 120){
						RedeemRPProduct('free_points_10');
					}
					else if(rps >= 12){
						RedeemRPProduct('free_points_1');
					}
				}
				setTimeout(function(){
					$('#free_play_form_button').click();
					var number_of_reclicks = 0;
					var interval_reclick = function(){
						if(number_of_reclicks < config.freeRollMaxNumberOfReclicks && ((!!document.getElementById('same_ip_error') && $('#same_ip_error').css('display') != 'none') || (!!document.getElementById('free_play_error') && $('#free_play_error').css('display') != 'none'))){
							unlockCaptcha();
							setTimeout(function(){
								$('#same_ip_error').css('display', 'none');
								$('#free_play_error').css('display', 'none');
								$('#free_play_form_button').click();
								number_of_reclicks++;
								setTimeout(interval_reclick, 2000);
							}, Math.max(0, getRandomArbitrary(config.freeRollWaitingTimeReclick-config.freeRollWaitingTimeEcartype, config.freeRollWaitingTimeReclick+config.freeRollWaitingTimeEcartype)));
						}
						else{
							$('#same_ip_error').css('display', 'none');
							$('#free_play_error').css('display', 'none');
							if(autobet_dnr == true){
								setTimeout(interval, 3600000);
								freeRollAlreadyTimed = true;
							}
							setTimeout(unlockCaptcha, 900000);
							setTimeout(unlockCaptcha, 1800000);
							setTimeout(unlockCaptcha, 2700000);
						}
					}
					setTimeout(interval_reclick, Math.max(0, getRandomArbitrary(config.freeRollWaitingTimeErrors-config.freeRollWaitingTimeEcartype, config.freeRollWaitingTimeErrors+config.freeRollWaitingTimeEcartype)));
				}, Math.max(0, getRandomArbitrary(config.freeRollWaitingTimeFirstClick-config.freeRollWaitingTimeEcartype, config.freeRollWaitingTimeFirstClick+config.freeRollWaitingTimeEcartype)));
			}
			else if(autobet_dnr == true && !freeRollAlreadyTimed && !(!document.getElementById('time_remaining') || $('#time_remaining').text() == "" || $('#time_remaining').css('display') == 'none' || $('#time_remaining').text() == "0Minutes0Seconds")){
				setTimeout(interval, (parseInt(($('#time_remaining').text()).split('Minutes')[0])+2)*1000*60);
				freeRollAlreadyTimed = true;
			}
		}
	}
	interval();
}

var myCode = function(){
	for(var e in config){
		if(getCookie('configBot_'+e) == "") setCookie('configBot_'+e, JSON.stringify(config[e]), 7);
		else config[e] = JSON.parse(getCookie('configBot_'+e));
	}
	//
	$('body').prepend(
'<style type="text/css">#ui_bot .form-style-3{max-width: 450px;font-family: "Lucida Sans Unicode", "Lucida Grande", sans-serif;}#ui_bot .form-style-3 label{display:block;margin-bottom: 10px;cursor: default;}#ui_bot .form-style-3 label > span{float: left;width: 100%;color: black;font-weight: bold;font-size: 0.7em;margin-bottom: 3px;cursor: default;}#ui_bot .form-style-3 fieldset{border-radius: 10px;-webkit-border-radius: 10px;-moz-border-radius: 10px;margin: 0px 0px 10px 0px;border:none;border-top: 1px solid grey;padding: 10px;background: #e5e5f3;box-shadow: inset 0px 0px 15px grey;-moz-box-shadow: inset 0px 0px 15px grey;-webkit-box-shadow: inset 0px 0px 15px grey;}#ui_bot .form-style-3 fieldset legend{color: #000000;border-top: 1px solid grey;border-left: 1px solid grey;border-right: 1px solid grey;border-radius: 5px 5px 0px 0px;-webkit-border-radius: 5px 5px 0px 0px;-moz-border-radius: 5px 5px 0px 0px;background: #adabf4;padding: 3px 8px 3px 8px;box-shadow: -0px -1px 2px grey;-moz-box-shadow:-0px -1px 2px grey;-webkit-box-shadow:-0px -1px 2px grey;font-weight: bold;font-size: 12px;}#ui_bot .form-style-3 textarea{width:250px;height:100px;}#ui_bot .form-style-3 input[type=text],#ui_bot .form-style-3 input[type=date],#ui_bot .form-style-3 input[type=datetime],#ui_bot .form-style-3 input[type=number],#ui_bot .form-style-3 input[type=search],#ui_bot .form-style-3 input[type=time],#ui_bot .form-style-3 input[type=url],#ui_bot .form-style-3 input[type=email],#ui_bot .form-style-3 input[type=checkbox],#ui_bot .form-style-3 select, #ui_bot .form-style-3 textarea{outline: none;color: #777777;padding: 5px 8px 5px 8px;background: #FFFFFF;width:100%;border:none;border-bottom:1px solid grey;}#ui_bot .form-style-3 .text_ui_bot{width:100%;background:none;margin-bottom:3px;color:#ffd700;}#ui_bot{position:fixed;top:50px;bottom:10px;max-width:350px;overflow:scroll;left:5px;z-index:999;background-color:#e8e8f5;padding:0px;border:3px solid black;font-family: "Lucida Sans Unicode", "Lucida Grande", sans-serif;}#title_ui_bot{color:white;width:100%;background-color:#2a2851;font-weight:bold;text-align:center;font-size:1.1em;padding:10px 0 10px 0;margin-bottom:2px;}#ui_bot table{ border-spacing: 1; border-collapse: collapse;background:#736ee3;width:100%;margin:0 auto;margin-bottom:10px;}#ui_bot tr td{padding:6px;font-weight:bold;background:#736ee3;color:#feff00;font-size:0.8em;border-bottom:1px solid #aeaed9;width:50%;}#button_start_ui_bot{width:50%;padding:13px 0;text-align:center;float:left;background:#3cd476;color:white;font-weight:bold;margin-bottom:5px;-webkit-box-shadow: 0 8px 6px -6px black;   -moz-box-shadow: 0 8px 6px -6px black;        box-shadow: 0 8px 6px -6px black;}#button_start_ui_bot:hover{background:#06e95d;}#button_stop_ui_bot{width:50%;padding:13px 0;text-align:center;background:#ea4a62;color:white;float:right;font-weight:bold;margin-bottom:5px;-webkit-box-shadow: 0 8px 6px -6px black;   -moz-box-shadow: 0 8px 6px -6px black;        box-shadow: 0 8px 6px -6px black;}#button_stop_ui_bot:hover{background:#dd344d;}#button_stop_ui_bot:active, #button_start_ui_bot:active{-webkit-box-shadow: inset 0px 4px 4px #000000;     -moz-box-shadow: inset 0px 4px 4px #000000;          box-shadow: inset 0px 4px 4px #000000;}#button_stop_ui_bot:hover, #button_start_ui_bot:hover{cursor:pointer;}.ui_bot_titre_stats{text-align:left;}.ui_bot_stats_text{text-align:right;}#title2_ui_bot{display:block;text-align:left;font-size:0.7em;color:#ebebeb;font-weight:normal;padding:6px 0 5px 0;}#title2_ui_bot a{color: white;text-decoration:underline;}</style><div id="ui_bot"><div id="title_ui_bot">FBTC BOT<br/><span id="title2_ui_bot">Donate: 3NdExhrYyFZSUd5KiVQiKYFFcgdpDEwMC6<br/>Visit: <a href="https://www.freebitcoinbot.fun" target="_blank">freebitcoinbot.fun</a></span></div><div id="button_start_ui_bot">START</div><div id="button_stop_ui_bot">STOP</div><table><tr id="ui_bot_profit_line"><td class="ui_bot_titre_stats">Profit</td><td class="ui_bot_stats_text" id="ui_bot_profit">0</td></tr><tr><td class="ui_bot_titre_stats" id="ui_bot_bet_type">Betting higher than</td><td class="ui_bot_stats_text" id="ui_bot_high_bet">0</td></tr><tr><td class="ui_bot_titre_stats">Number of tries</td><td class="ui_bot_stats_text" id="ui_bot_number_tries">0</td></tr><tr><td class="ui_bot_titre_stats">Current consecutive losses</td><td class="ui_bot_stats_text" id="ui_bot_current_cons_losses">0</td></tr><tr><td class="ui_bot_titre_stats">Consecutive losses matrix</td><td class="ui_bot_stats_text" id="ui_bot_cons_losses_matrix">0</td></tr><tr><td class="ui_bot_titre_stats">Max possible consecutive losses before losing</td><td class="ui_bot_stats_text" id="ui_bot_max_cons_losses">0</td></tr><tr><td class="ui_bot_titre_stats">Highest possible loss</td><td class="ui_bot_stats_text" id="ui_bot_max_loss">0</td></tr><tr><td class="ui_bot_titre_stats">Losing chances for each try</td><td class="ui_bot_stats_text" id="ui_bot_losing_chances">0</td></tr></table><div class="form-style-3"><form><fieldset><legend>Initial parameters</legend><label for="field1"><span>Bet</span><input id="ui_bot_initial_bet" type="text" class="input-field" name="field1" value="0.00000001" /></label><label for="field2"><span>Odds</span><input id="ui_bot_initial_odds" type="text" class="input-field" name="field2" value="2.00" /></label><label for="field2"><span>Needed consecutive losses before increasing the bet</span><input id="ui_bot_needed_cons_losses" type="text" class="input-field" name="field2" value="12" /></label></fieldset><fieldset><legend id="ui_bot_legend_increased_bet">After 12 consecutive losses parameters</legend><label for="field1"><span>Increased bet</span><input id="ui_bot_initial_increased_bet" type="text" class="input-field" name="field1" value="0.00002000" /></label><label for="field2"><span>Bet multiplier for each consecutive loss</span><input id="ui_bot_bet_multiplier" type="text" class="input-field" name="field2" value="2.00" /></label><label for="field2"><span>Highest possible bet until coming back to the initial parameters</span><input id="ui_bot_max_increased_bet" type="text" class="input-field" name="field2" value="0.00512000" /></label></fieldset><fieldset><legend>Betting limits</legend><label for="field1"><span>Stop loss</span><input id="ui_bot_sl" type="text" class="input-field" name="field1" value="0.00000000" /></label><label for="field2"><span>Take profit</span><input id="ui_bot_tp" type="text" class="input-field" name="field2" value="0.00020000" /></label><label for="field2"><span>Max number of tries</span><input id="ui_bot_max_number_tries" type="text" class="input-field" name="field2" value="100000" /></label><label for="field2"><span id="ui_bot_stop_cl_text">Stop after reaching x consecutive losses</span><input id="ui_bot_stop_cons_losses" type="text" class="input-field" name="field2" value="0" /></label></fieldset><fieldset><legend>Other parameters</legend><label for="field2"><span>Bet high</span><input id="ui_bot_bet_hi" type="radio" class="input-field" name="radio_bet" checked="checked"/></label><label for="field2"><span>Bet low</span><input id="ui_bot_bet_lo" type="radio" class="input-field" name="radio_bet"/></label><br/><label for="field2"><span>Do not alternate bet type</span><input id="ui_bot_dont_alternate" type="radio" class="input-field" name="radio_alternate" checked="checked"/></label><label for="field2"><span>Alternate bet type at each bet</span><input id="ui_bot_alternate_bet" type="radio" class="input-field" name="radio_alternate"/></label><label for="field2"><span>Alternate bet type at each loss</span><input id="ui_bot_alternate_loss" type="radio" class="input-field" name="radio_alternate"/></label><label for="field2"><span>Alternate bet type at each win</span><input id="ui_bot_alternate_win" type="radio" class="input-field" name="radio_alternate"/></label><br/><label for="field2"><span>Randomize client seed<br/><span style="font-weight:normal;font-style:italic;font-size:0.8em;">(increase randomness and therefore profit probability)</span></span><input id="ui_bot_randomize_seed" type="checkbox" class="input-field" name="field2" checked="checked" style="width:auto;"/></label><br/><label for="field2"><span>Virtual betting<br/><span style="font-weight:normal;font-style:italic;font-size:0.8em;">(if checked, you won\'t bet real BTC, it\'ll only be a simulation)</span></span><input id="ui_bot_virtual" type="checkbox" class="input-field" name="field2" checked="checked" style="width:auto;"/></label><label for="field2"><span>Virtual balance<br/><span style="font-weight:normal;font-style:italic;font-size:0.8em;">(if the virtual betting is enabled, you can choose your starting balance)</span></span><input id="ui_bot_virtual_balance" type="text" class="input-field" name="field2" value="" /></label><br/><label for="field2"><span>Speed of betting (ms)</span><input id="ui_bot_speed" type="text" class="input-field" name="field2" value="300" /></label><label for="field2"><span>Random speed ecartype<br/><span id="ui_bot_random_speed_text" style="font-weight:normal;font-style:italic;font-size:0.8em;"></span></span><input id="ui_bot_random_speed_ecartype" type="text" class="input-field" name="field2"/></label><br/><label for="field2"><span>Delay of losing waves (ms)<br/><span id="ui_bot_delay_waves_text" style="font-weight:normal;font-style:italic;font-size:0.8em;"></span></span><input id="ui_bot_delay_waves" type="text" class="input-field" name="field2"/></label><label for="field2"><span>Delay losing waves from<br/><span style="font-weight:normal;font-style:italic;font-size:0.8em;">(enter the consecutive losses limit from which betting will be delayed)</span></span><input id="ui_bot_delay_waves_cl" type="text" class="input-field" name="field2"/></label><label for="field2"><span>Random delay ecartype<br/><span id="ui_bot_random_delay_text" style="font-weight:normal;font-style:italic;font-size:0.8em;">**</span></span><input id="ui_bot_random_delay_ecartype" type="text" class="input-field" name="field2"/></label></fieldset><fieldset><legend>Free rolls</legend><label for="field2"><span>Automatic free rolls<br/><span style="font-weight:normal;font-style:italic;font-size:0.8em;">(the Free BTC game will be played automatically every hour, be sure to have unlocked captchas a first time or it will not work)</span></span><input id="ui_bot_automatic_free_rolls" type="checkbox" class="input-field" name="field2" style="width:auto;"/></label><label for="field2"><span>Automatic RP bonus<br/><span style="font-weight:normal;font-style:italic;font-size:0.8em;">(earn more RP per free roll using the maximum possible RP bonus you can have - up to 1248 RP profit per day)</span></span><input id="ui_bot_rp_bonus" type="checkbox" class="input-field" name="field2" style="width:auto;"/></label><label for="field2"><span>Do not reload the page every hour<br/><span style="font-weight:normal;font-style:italic;font-size:0.8em;">(block the automatic page reloading every hour)</span></span><input id="ui_bot_block_reload" type="checkbox" class="input-field" name="field2" style="width:auto;"/></label><label for="field2"><span>Wagering amount when re-unlocking captcha<br/><span id="ui_bot_max_wager_text" style="font-weight:normal;font-style:italic;font-size:0.8em;">(requirements to unlock captchas will rise after each roll, so you have to wager some satoshis regularly to unlock it again - the minimum you can set is 100 satoshis)</span></span><input id="ui_bot_max_wager" type="text" class="input-field" name="field2"/></label><label for="field2"><span>Delay before rolling (ms)<br/><span id="ui_bot_delay_before_rolling_text" style="font-weight:normal;font-style:italic;font-size:0.8em;">(waiting before rolling will preempt you from begin discovered as a bot)</span></span><input id="ui_bot_delay_before_rolling" type="text" class="input-field" name="field2"/></label><label for="field2"><span>Delay before checking if an error occured (ms)<br/><span id="ui_bot_delay_error_text" style="font-weight:normal;font-style:italic;font-size:0.8em;">(errors take some time to occur because of the connection latency - so you have to wait a little bit after each roll)</span></span><input id="ui_bot_delay_error" type="text" class="input-field" name="field2"/></label><label for="field2"><span>Delay before re-rolling if an error occured (ms)<br/><span id="ui_bot_delay_reroll_text" style="font-weight:normal;font-style:italic;font-size:0.8em;">(if you try to roll multiple times without waiting, your ip will get blocked, so you have to wait in order to avoid that)</span></span><input id="ui_bot_delay_reroll" type="text" class="input-field" name="field2"/></label><label for="field2"><span>Random ecartype for each delay (ms)<br/><span id="ui_bot_delay_ecartype_text" style="font-weight:normal;font-style:italic;font-size:0.8em;">(add randomness to your delays in order to look more human)</span></span><input id="ui_bot_delay_ecartype" type="text" class="input-field" name="field2"/></label><label for="field2"><span>Max number of re-rolls<br/><span id="ui_bot_max_rerolls_text" style="font-weight:normal;font-style:italic;font-size:0.8em;">(trying to re-roll too much times when an error occurs will also block your ip)</span></span><input id="ui_bot_max_rerolls" type="text" class="input-field" name="field2"/></label></fieldset></form></div></div>'
);
	$('#ui_bot_initial_bet').val(config.initialBet.toFixed(8));
	$('#ui_bot_initial_odds').val(config.initialOdds.toFixed(2));
	$('#ui_bot_needed_cons_losses').val(config.neededConsecutiveLosses);
	$('#ui_bot_initial_increased_bet').val(config.initialIncreasedBet.toFixed(8));
	$('#ui_bot_max_increased_bet').val(config.maxIncreasedBet.toFixed(8));
	$('#ui_bot_bet_multiplier').val(config.betMultiplier.toFixed(2));
	$('#ui_bot_sl').val(config.stopLoss.toFixed(8));
	$('#ui_bot_tp').val(config.takeProfit.toFixed(8));
	$('#ui_bot_max_number_tries').val(config.maxNumberOfTries);
	$('#ui_bot_stop_cons_losses').val(config.stopConsecutiveLosses);
	if(config.betType == 'hi') $('#ui_bot_bet_hi').prop("checked", true);
	else $('#ui_bot_bet_lo').prop("checked", true);
	if(config.alternate == 'dont') $('#ui_bot_dont_alternate').prop("checked", true);
	else if(config.alternate =='bet') $('#ui_bot_alternate_bet').prop("checked", true);
	else if(config.alternate =='loss') $('#ui_bot_alternate_loss').prop("checked", true);
	else if(config.alternate =='win') $('#ui_bot_alternate_win').prop("checked", true);
	$('#ui_bot_randomize_seed').prop("checked", config.randomizeClientSeed);
	$('#ui_bot_virtual').prop("checked", config.virtual);
	$('#ui_bot_virtual_balance').val(config.virtualCapital.toFixed(8));
	$('#ui_bot_speed').val(config.speed);
	$('#ui_bot_random_speed_ecartype').val(config.randomSpeedEcartype);
	$('#ui_bot_delay_waves').val(config.delayWait);
	$('#ui_bot_delay_waves_cl').val(config.delayConsecutiveLoss);
	$('#ui_bot_random_delay_ecartype').val(config.randomDelayEcartype);
	$('#ui_bot_automatic_free_rolls').prop("checked", config.automaticFreeRolls);
	$('#ui_bot_rp_bonus').prop("checked", config.rpBonus);
	$('#ui_bot_block_reload').prop("checked", config.blockReloadPage);
	if(config.blockReloadPage) autobet_dnr = true;
	if(config.automaticFreeRolls) freeRollBot();
	$('#ui_bot_max_wager').val(config.freeRollMaxWager);
	$('#ui_bot_delay_before_rolling').val(config.freeRollWaitingTimeFirstClick);
	$('#ui_bot_delay_error').val(config.freeRollWaitingTimeErrors);
	$('#ui_bot_delay_reroll').val(config.freeRollWaitingTimeReclick);
	$('#ui_bot_delay_ecartype').val(config.freeRollWaitingTimeEcartype);
	$('#ui_bot_max_rerolls').val(config.freeRollMaxNumberOfReclicks);
	//
	updateUI();
	updateMatrixConsecutiveLosses();
	$('title').remove();
	//
	var intervalPopup = function(){
		closeRandomPopupInterval($('div.close_daily_jackpot_main_container_div'),90);
		closeRandomPopupInterval($('i.fa.fa-times-circle.close_deposit_promo_message'),90);
		closeRandomPopupInterval($('div#lambo_contest_msg a.close'),10);
		closeRandomPopupInterval($('div#earn_btc_msg a.close'),20);
		closeRandomPopupInterval($('div#enable_2fa_msg_alert a.close'),30);
		closeRandomPopupInterval($("[id^='hide_rp_promo']"),50);
		closeRandomPopupInterval($("[id^='hide_rp_promo']"),50);
		closeRandomPopupInterval($('#myModal22 .close-reveal-modal'), 50);
		closeRandomPopupInterval($('.pushpad_deny_button'), 50);
		closeRandomPopupInterval($('.close-reveal-modal'), 50);
		setTimeout(intervalPopup, 140000);
	}
	setTimeout(intervalPopup, 140000);
	//
	$('#button_start_ui_bot').on('click', function(){
		if(exit){
			exit = false;
			bet = config.initialBet;
			odds = config.initialOdds;
			consecutiveLosses = 0;
			earnings = 0;
			numberOfTries = 0;
			maxConsecutiveLosses_stat.splice();
			updateMatrixConsecutiveLosses();
			document.getElementById("double_your_btc_payout_multiplier").value = odds.toFixed(2).toString();
			document.getElementById("double_your_btc_stake").value = bet.toFixed(8).toString();
			if(!config.virtual) $('#double_your_btc_bet_'+config.betType+'_button').click();
			else{
				$('#balance').text(config.virtualCapital.toFixed(8).toString());
				$('#balance').text(virtual_click_bet().toFixed(8).toString());
			}
			main();
		}
	});
	$('#button_stop_ui_bot').on('click', function(){
		if(!exit){
			exit = true;
			clearTimeout(timeout);
		}
	});
	$('#ui_bot_initial_bet').on('focusout', function(){
		if(isDecimal($(this).val()) && parseFloat($(this).val()) >= 0.00000001) config.initialBet = parseFloat($(this).val());
		else{
			config.initialBet = 0.00000001;
			$(this).val(config.initialBet.toFixed(8));
		}
		updateUI();
	});
	$('#ui_bot_initial_odds').on('focusout', function(){
		if(isDecimal($(this).val()) && parseFloat($(this).val()) <= 4750.00 && parseFloat($(this).val()) >= 1.01) config.initialOdds = parseFloat($(this).val());
		else{
			config.initialOdds = 2.00;
			$(this).val(config.initialOdds.toFixed(2));
		}
		updateUI();
	});
	$('#ui_bot_needed_cons_losses').on('focusout', function(){
		if(isInt($(this).val()) && parseInt($(this).val(), 10) >= 1) config.neededConsecutiveLosses = parseInt($(this).val());
		else{
			config.neededConsecutiveLosses = 1;
			$(this).val(config.neededConsecutiveLosses);
		}
		updateUI();
	});
	$('#ui_bot_initial_increased_bet').on('focusout', function(){
		if(isDecimal($(this).val()) && parseFloat($(this).val()) >= 0.00000001) config.initialIncreasedBet = parseFloat($(this).val());
		else{
			config.initialIncreasedBet = 0.00000001;
			$(this).val(config.initialIncreasedBet.toFixed(8));
		}
		updateUI();
	});
	$('#ui_bot_max_increased_bet').on('focusout', function(){
		if(isDecimal($(this).val()) && parseFloat($(this).val()) >= config.initialIncreasedBet) config.maxIncreasedBet = parseFloat($(this).val());
		else{
			config.maxIncreasedBet = config.initialIncreasedBet;
			$(this).val(config.maxIncreasedBet.toFixed(8));
		}
		updateUI();
	});
	$('#ui_bot_bet_multiplier').on('focusout', function(){
		if(isDecimal($(this).val()) && parseFloat($(this).val()) >= 1.01) config.betMultiplier = parseFloat($(this).val());
		else{
			config.betMultiplier = 2.00;
			$(this).val(config.betMultiplier.toFixed(2));
		}
		updateUI();
	});
	$('#ui_bot_sl').on('focusout', function(){
		if(isDecimal($(this).val())) config.stopLoss = parseFloat($(this).val());
		else{
			config.stopLoss = 0.00000000;
			$(this).val(config.stopLoss.toFixed(8));
		}
		updateUI();
	});
	$('#ui_bot_tp').on('focusout', function(){
		if(isDecimal($(this).val()) && parseFloat($(this).val()) > 0) config.takeProfit = parseFloat($(this).val());
		else{
			config.takeProfit = 0.00000100;
			$(this).val(config.takeProfit.toFixed(8));
		}
		updateUI();
	});
	$('#ui_bot_max_number_tries').on('focusout', function(){
		if(isInt($(this).val()) && parseInt($(this).val(), 10) >= 1) config.maxNumberOfTries = parseInt($(this).val());
		else{
			config.maxNumberOfTries = 1;
			$(this).val(config.maxNumberOfTries);
		}
		updateUI();
	});
	$('#ui_bot_stop_cons_losses').on('focusout', function(){
		if(isInt($(this).val()) && parseInt($(this).val(), 10) >= 1) config.stopConsecutiveLosses = parseInt($(this).val());
		else{
			config.stopConsecutiveLosses = 0;
			$(this).val(config.stopConsecutiveLosses);
		}
		updateUI();
	});
	$('#ui_bot_bet_hi').on('change', function(){
		if($(this).prop('checked')) config.betType = 'hi';
		updateUI();
	});
	$('#ui_bot_bet_lo').on('change', function(){
		if($(this).prop('checked')) config.betType = 'lo';
		updateUI();
	});
	$('#ui_bot_dont_alternate').on('change', function(){
		if($(this).prop('checked')) config.alternate = 'dont';
		updateUI();
	});
	$('#ui_bot_alternate_bet').on('change', function(){
		if($(this).prop('checked')) config.alternate = 'bet';
		updateUI();
	});
	$('#ui_bot_alternate_loss').on('change', function(){
		if($(this).prop('checked')) config.alternate = 'loss';
		updateUI();
	});
	$('#ui_bot_alternate_win').on('change', function(){
		if($(this).prop('checked')) config.alternate = 'win';
		updateUI();
	});
	$('#ui_bot_randomize_seed').on('change', function(){
		config.randomizeClientSeed = $(this).prop('checked');
		updateUI();
	});
	$('#ui_bot_virtual').on('change', function(){
		config.virtual = $(this).prop('checked');
		updateUI();
	});
	$('#ui_bot_virtual_balance').on('focusout', function(){
		if(isDecimal($(this).val()) && parseFloat($(this).val()) >= 0.00000001) config.virtualCapital = parseFloat($(this).val());
		else{
			config.virtualCapital = 0.00100000;
			$(this).val(config.virtualCapital.toFixed(8));
		}
		updateUI();
	});
	$('#ui_bot_random_speed_ecartype').on('focusout', function(){
		if(isInt($(this).val()) && parseInt($(this).val(), 10) >= 0) config.randomSpeedEcartype = parseInt($(this).val(), 10);
		else{
			config.randomSpeedEcartype = 0;
			$(this).val(config.randomSpeedEcartype);
		}
		updateUI();
	});
	$('#ui_bot_speed').on('focusout', function(){
		if(isInt($(this).val()) && parseInt($(this).val(), 10) >= 1) config.speed = parseInt($(this).val(), 10);
		else{
			config.speed = 300;
			$(this).val(config.speed);
		}
		updateUI();
	});
	$('#ui_bot_delay_waves').on('focusout', function(){
		if(isInt($(this).val()) && parseInt($(this).val(), 10) >= 0){
			config.delayWait = parseInt($(this).val(), 10);
		}
		else{
			config.delayWait = 0;
			$(this).val(config.delayWait);
		}
		updateUI();
	});
	$('#ui_bot_delay_waves_cl').on('focusout', function(){
		if(isInt($(this).val()) && parseInt($(this).val(), 10) >= 0) config.delayConsecutiveLoss = parseInt($(this).val());
		else{
			config.delayConsecutiveLoss = config.neededConsecutiveLosses;
			$(this).val(config.neededConsecutiveLosses);
		}
		updateUI();
	});
	$('#ui_bot_random_delay_ecartype').on('focusout', function(){
		if(isInt($(this).val()) && parseInt($(this).val(), 10) >= 0) config.randomDelayEcartype = parseInt($(this).val(), 10);
		else{
			config.randomDelayEcartype = 0;
			$(this).val(config.randomDelayEcartype);
		}
		updateUI();
	});
	$('#ui_bot_automatic_free_rolls').on('change', function(){
		config.automaticFreeRolls = $(this).prop('checked');
		if(config.automaticFreeRolls) freeRollBot();
		updateUI();
	});
	$('#ui_bot_rp_bonus').on('change', function(){
		config.rpBonus = $(this).prop('checked');
		updateUI();
	});
	$('#ui_bot_block_reload').on('change', function(){
		config.blockReloadPage = $(this).prop('checked');
		if(config.blockReloadPage){
			autobet_dnr = true;
			if(config.automaticFreeRolls) freeRollBot();
		}
		else autobet_dnr = false;
		updateUI();
	});
	$('#ui_bot_max_wager').on('focusout', function(){
		if(isDecimal($(this).val()) && parseFloat($(this).val()) >= 0.00000100) config.freeRollMaxWager = parseFloat($(this).val());
		else{
			config.freeRollMaxWager = 0.00000100;
			$(this).val(config.freeRollMaxWager);
		}
		updateUI();
	});
	$('#ui_bot_delay_before_rolling').on('focusout', function(){
		if(isInt($(this).val()) && parseInt($(this).val(), 10) >= 0) config.freeRollWaitingTimeFirstClick = parseInt($(this).val(), 10);
		else{
			config.freeRollWaitingTimeFirstClick = 2500;
			$(this).val(config.freeRollWaitingTimeFirstClick);
		}
		updateUI();
	});
	$('#ui_bot_delay_error').on('focusout', function(){
		if(isInt($(this).val()) && parseInt($(this).val(), 10) >= 0) config.freeRollWaitingTimeErrors = parseInt($(this).val(), 10);
		else{
			config.freeRollWaitingTimeErrors = 2500;
			$(this).val(config.freeRollWaitingTimeErrors);
		}
		updateUI();
	});
	$('#ui_bot_delay_reroll').on('focusout', function(){
		if(isInt($(this).val()) && parseInt($(this).val(), 10) >= 10000) config.freeRollWaitingTimeReclick = parseInt($(this).val(), 10);
		else{
			config.freeRollWaitingTimeReclick = 60000;
			$(this).val(config.freeRollWaitingTimeReclick);
		}
		updateUI();
	});
	$('#ui_bot_delay_ecartype').on('focusout', function(){
		if(isInt($(this).val()) && parseInt($(this).val(), 10) >= 0) config.freeRollWaitingTimeEcartype = parseInt($(this).val(), 10);
		else{
			config.freeRollWaitingTimeEcartype = 1000;
			$(this).val(config.freeRollWaitingTimeEcartype);
		}
		updateUI();
	});
	$('#ui_bot_max_rerolls').on('focusout', function(){
		if(isInt($(this).val()) && parseInt($(this).val(), 10) >= 0) config.freeRollMaxNumberOfReclicks = parseInt($(this).val(), 10);
		else{
			config.freeRollMaxNumberOfReclicks = 1;
			$(this).val(config.freeRollMaxNumberOfReclicks);
		}
		updateUI();
	});
}

function isDecimal (s) {
	var isDecimal_re = /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/;
	return String(s).search (isDecimal_re) != -1
}

function isInt(value) {
  return !isNaN(value) &&
		 parseInt(Number(value)) == value &&
		 !isNaN(parseInt(value, 10));
}

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

function closeRandomPopupInterval (target, randomness) {
	var rand = getRandomArbitrary(1,100);
	if (rand < randomness && target.is(':visible')) {
		setTimeout(function(){
			target.click();
		}, getRandomArbitrary (500,120000));
	}
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
	var c = ca[i];
	while (c.charAt(0) == ' ') {
	  c = c.substring(1);
	}
	if (c.indexOf(name) == 0) {
	  return c.substring(name.length, c.length);
	}
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

loadScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js", myCode);

