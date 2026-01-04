// ==UserScript==
// @name Freebitco.in mutiply roll booster
// @author         K0ntra
// @namespace      http://tampermonkey.net/
// @version        1.05
// @description    mutiply roll booster
// @include https://freebitco.in/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/403144/Freebitcoin%20mutiply%20roll%20booster.user.js
// @updateURL https://update.greasyfork.org/scripts/403144/Freebitcoin%20mutiply%20roll%20booster.meta.js
// ==/UserScript==

function jqWait() {
	if (typeof(jQuery) === 'undefined')
		setTimeout(jqWait, 300);
	else
		b0_init();
}
jqWait();

function b0_init() {
	$('body').append('<div id="b0_d" style="display:none;position:fixed;right:10px;top:50px;width:140px;border:solid 1px #000;background-color:#fff;padding:5px;text-align:center;z-index:9999"></div>');
	$('#b0_d').append('<b>Auto</b><br>Rolls: <input id="n0_num" value="100" style="width:40px"><br>');
	$('#b0_d').append('x on lose: <input type="checkbox" id="b0_mtr" checked><br>');
	$('#b0_d').append('<button id="b0_go" style="font-size:1em">GO</button><br><b>Manual</b><br>');
	$('#b0_d').append('<button id="b0_min" style="font-size:1em">Min</button> <button id="b0_dbl" style="font-size:1em">x' + b0_mult() + '</button><br>');
	$('#b0_d').append('<button id="b0_bet" style="font-size:1em">BET</button><br>');
	$('#b0_d').append('Min: <input id="n0_min" value="10" style="width:40px"><br>');
	$('#b0_d').append('<span id="b0_res"></span>');
	$('#b0_go').click(b0_go);
	$('#b0_bet').click(b0_rbet);
	$('#b0_dbl').click(function () {
		var bet = parseFloat($('#double_your_btc_stake').val()) * b0_mult();
		$('#double_your_btc_stake').val(bet.toFixed(8));
		$("#double_your_btc_stake").keyup();
	});
	$('#b0_min').click(b0_set_min);
	$("#double_your_btc_payout_multiplier").on("keyup", b0_mult_kf);
	b0_state = 0;
	b0_num = Number($('#n0_num').val());
	b0_cnt = 0;
	b0_wincnt = 0;
	b0_beg_bal = b0_balance();

	$(document).ajaxSuccess(function () {
		if (current_page_tab == 'double_your_btc')
			$('#b0_d').show();
		else
			$('#b0_d').hide();
		if (typeof(b0_res) === 'function')
			b0_res();
		$('.lottery_winner_table_box_container>div:nth-child(4):visible').each(function () {
			var r = parseInt($(this).text());
			if (r == 8888)
				$(this).css('background-color', '#8f8');
		});
	});

}
function b0_go() {
	if (b0_state === 0) {
		$('#b0_go').text('STOP');
		b0_beg_bal = b0_balance();
		b0_num = Number($('#n0_num').val());
		b0_cnt = 0;
		b0_wincnt = 0;
		b0_lostcnt = 0;
		b0_state = 1;
		b0_bet();
	} else {
		$('#b0_go').text('GO');
		b0_state = 0;
	}
}

function b0_bet() {
	if (b0_state === 0)
		return;
	if (b0_cnt > b0_num)
		return b0_go();
	var timeout = Math.floor(Math.random() * 5000 + 500);
	if (b0_state == 1) {
		b0_set_min();
		b0_state = 2;
		b0_cnt++;
		b0_rbet();
		setTimeout(b0_bet, timeout);
		return;
	} else if (b0_state == 2) {
		if ($('#double_your_btc_bet_hi_button').is('disabled')) {
			setTimeout(b0_bet, timeout);
			return;
		} else if ($('#double_your_btc_bet_win').is(':visible')) {
			b0_cnt++;
			b0_wincnt++;
			b0_lostcnt = 0;
			b0_set_min();
			b0_rbet();
			setTimeout(b0_bet, timeout);
			return;
		} else if ($('#double_your_btc_bet_lose').is(':visible')) {
			b0_cnt++;
			b0_lostcnt++;
			if ($('#b0_mtr').is(':checked'))
				$('#b0_dbl').click();
			if (b0_balance() < 1)
				return b0_go();
			b0_rbet();
			setTimeout(b0_bet, timeout);
			return;
		} else {
			alert('error');
			return b0_go();
		}
	}
}

function b0_rbet() {
	var b0_choice = b0_rnd();
	$('#double_your_btc_bet_' + b0_choice + '_button').click();
	b0_res();
}

function b0_mult() {
	return 1 / (Number($('#double_your_btc_payout_multiplier').val()) - 1) + 1;
}

function b0_mult_kf() {
	$('#b0_dbl').text('x' + b0_mult().toFixed(2));
}

function b0_set_min() {
	b0_min = Number($('#n0_min').val());
	b0_min = Math.min(b0_min, Math.floor(b0_balance() / 2));
	$('#double_your_btc_stake').val((b0_min / 1e8).toFixed(8));
	$("#double_your_btc_stake").keyup();
}

function b0_res() {
	var profit = Math.round(b0_balance() - b0_beg_bal);
	$('#b0_res').html('Bets: ' + b0_cnt + '<br>Wins: ' + b0_wincnt + '<br>Profit: ' + profit);
}

function b0_balance() {
	var balance = parseFloat($("#balance").html()) * 1e8;
	if ($('#bonus_account_balance'))
		balance += parseFloat($('#bonus_account_balance').html()) * 1e8;
	return balance;
}

function b0_rnd() {
	return crypto.getRandomValues(new Int8Array(1))[0] > 0 ? 'hi' : 'lo';
}
