// ==UserScript==
// @name         GBF Poker
// @namespace    http://tampermonkey.net/
// @version      5.3.7
// @description  Grind Smart
// @author       eterNEETy
// @match        http://game.granbluefantasy.jp/
// @grant        none
// @namespace    https://greasyfork.org/users/292830
// @require      https://greasyfork.org/scripts/383201-neet-lib/code/NEET%20Lib.js?version=704456
// @downloadURL https://update.greasyfork.org/scripts/383197/GBF%20Poker.user.js
// @updateURL https://update.greasyfork.org/scripts/383197/GBF%20Poker.meta.js
// ==/UserScript==
// jshint esversion: 6
// jshint -W138


// custom variable;
my_profile = "Poker ";
let main_path = "#casino/game/poker/200040";


function deal(rep){
	console.log(deal.name);
	reload(20);
	let init_deal = function() {
		console.log(init_deal.name);
		let cmd = [];
		cmd.push({"cmd":"deal","payload":rep});
		cmd.push({"cmd":"sleep","payload":0.5});
		cmd.push({"cmd":"clickIt","param":getCoord(document.querySelector(query.poker.deal))});
		xhr.open("POST", server);
		xhr.send(JSON.stringify(cmd));
	};
	checkEl(query.poker.deal,0,init_deal);
}

function pickCard(rep) {
	console.log(pickCard.name);
	reload(20);
	let init_pickCard = function() {
		console.log(init_pickCard.name);
		rep.margin_el = getMarginCoord(query.poker.canvas,0);
		let cmd = [];
		cmd.push({"cmd":"pick_card","payload":rep});
		cmd.push({"cmd":"sleep","payload":0.5});
		cmd.push({"cmd":"clickIt","param":getCoord(document.querySelector(query.poker.ok))});
		xhr.open('POST', server);
		xhr.send(JSON.stringify(cmd));
	};
	checkEl(query.poker.ok,0,init_pickCard);
}

function startHighOrLow(rep) {
	console.log(startHighOrLow.name);
	reload(20);
	let init_startHighOrLow = function() {
		console.log(init_startHighOrLow.name);
		rep.margin_el = getMarginCoord(query.poker.canvas,0);
		let cmd = [];
		cmd.push({"cmd":"start_HoL","payload":rep});
		cmd.push({"cmd":"clickIt","param":getCoord(document.querySelector(query.poker.yes))});
		xhr.open('POST', server);
		xhr.send(JSON.stringify(cmd));
	};
	checkEl(query.poker.yes,0,init_startHighOrLow);
}
function playHighOrLow(rep) {
	console.log(playHighOrLow.name);
	reload(20);
	let init_playHighOrLow = function() {
		console.log(init_playHighOrLow.name);
		let cmd = [];
		rep.low = getCoord(document.querySelector(query.poker.low));
		rep.high = getCoord(document.querySelector(query.poker.high));
		cmd.push({"cmd":"play_HoL","payload":rep});
		xhr.open('POST', server);
		xhr.send(JSON.stringify(cmd));
	};
	checkEls([{"query":query.poker.low,"qid":0},{"query":query.poker.high,"qid":0}],init_playHighOrLow);
}

function continueHighOrLow(rep) {
	console.log(continueHighOrLow.name);
	reload(20);
	let init_continueHighOrLow = function() {
		console.log(init_continueHighOrLow.name);
		let cmd = [];
		rep.no = getCoord(document.querySelector(query.poker.no));
		rep.yes = getCoord(document.querySelector(query.poker.yes));
		cmd.push({"cmd":"continue_HoL","payload":rep});
		xhr.open('POST', server);
		xhr.send(JSON.stringify(cmd));
	};
	checkEls([{"query":query.poker.yes,"qid":0},{"query":query.poker.no,"qid":0}],init_continueHighOrLow);
}

function listenNetwork() {
	// clearInterval(reload_counter);
	reload(7);
	let origOpen = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function() {
		this.addEventListener('load', function() {
			if(this.responseURL.indexOf("game.granbluefantasy.jp")>=0){
				let rep;
				// console.log(this);
				if(this.responseURL.indexOf('casino_poker/poker_status')>=0){
					rep = JSON.parse(this.responseText);
					if(rep.game_flag=="0"){
						deal({"url":"poker_status","medal":rep.medal.number});
					}else if(rep.game_flag=="10"){
						pickCard({"url":"poker_status","medal":rep.medal.number,"card_list":rep.card_list});
					}else if(rep.game_flag=="15"){
						startHighOrLow({"url":"poker_status","medal":rep.medal.number,"card_list":rep.card_list,"pay_medal":rep.pay_medal,"bet":rep.bet,"turn":rep.turn});
					}else if(rep.game_flag=="20"){
						playHighOrLow({"url":"poker_status","medal":rep.medal.number,"card_first":rep.hand_list.open_card,"pay_medal":rep.pay_medal});
					}else if(rep.game_flag=="22"){
						continueHighOrLow({"url":"poker_status","medal":rep.medal.number,"card_first":rep.hand_list.open_card_old,"card_second":rep.hand_list.close_card_old,"pay_medal":rep.pay_medal,"turn":rep.turn});
					}
				}else if(this.responseURL.indexOf('casino_poker/poker_deal')>=0){
					rep = JSON.parse(this.responseText);
					pickCard({"url":"poker_deal","medal":rep.medal.number,"card_list":rep.card_list});
				}else if(this.responseURL.indexOf('casino_poker/poker_draw')>=0){
					rep = JSON.parse(this.responseText);
					if(rep.result=="lose"){
						deal({"url":"poker_draw","medal":rep.medal.number,"card_list":rep.card_list,"result":rep.result,"hand":rep.hand,"hand_id":rep.hand_id});
					}else if(rep.result=="win"){
						startHighOrLow({"url":"poker_draw","medal":rep.medal.number,"card_list":rep.card_list,"result":rep.result,"hand":rep.hand,"hand_id":rep.hand_id,"pay_medal":rep.pay_medal});
					}
				}else if(this.responseURL.indexOf('casino_poker/poker_double_start')>=0){
					rep = JSON.parse(this.responseText);
					playHighOrLow({"url":"poker_double_start","medal":rep.medal.number,"card_first":rep.card_first,"pay_medal":rep.pay_medal});
				}else if(this.responseURL.indexOf('casino_poker/poker_double_result')>=0){
					rep = JSON.parse(this.responseText);
					if(rep.result=="lose"){
						deal({"url":"poker_double_result","card_first":rep.card_first,"card_second":rep.card_second,"turn":rep.turn,"result":rep.result,"pay_medal":rep.pay_medal,"medal":rep.medal.number});
					}else if(rep.result=="win" || rep.result=="draw"){
						continueHighOrLow({"url":"poker_status","medal":rep.medal.number,"card_first":rep.card_first,"card_second":rep.card_second,"pay_medal":rep.pay_medal,"turn":rep.turn});
					}
				}else if(this.responseURL.indexOf('casino_poker/poker_double_retire')>=0){
					rep = JSON.parse(this.responseText);
					deal({"url":"poker_double_retire","medal":rep.status.medal.number,"get_medal":rep.status.get_medal});
				}
			}
		});
		origOpen.apply(this, arguments);
	};
}

function init() {
	"use strict";
	let func_name = init.name;
	reload(5);
	path.main = main_path;
	setDebug();
	listenNetwork();
	let checkBody = setInterval(function() {
		console.log(func_name);
		if(document.body !== null){
			clearInterval(checkBody);
			if(document.body.children[0].tagName == "DIV"){
				// reload(30);
				checkError();
			}else{
				console.log("DOM Error");
				reloadNow();
			}
		}
	}, 300);
	// xhr.onreadystatechange=(e)=>{
	// 	console.log(xhr.responseText);
	// }
}

init();