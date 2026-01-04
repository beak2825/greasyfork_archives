// ==UserScript==
// @name		a game for multiplier the balance in 10 minutes
// @author		Danik Odze
// @namespace	http://tampermonkey.net/
// @version		1.01
// @description	Multiplies your Satoshi every 6 seconds. Doubles when you lose.
// @include		https://freebitco.in/*
// @license MIT
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/463275/a%20game%20for%20multiplier%20the%20balance%20in%2010%20minutes.user.js
// @updateURL https://update.greasyfork.org/scripts/463275/a%20game%20for%20multiplier%20the%20balance%20in%2010%20minutes.meta.js
// ==/UserScript==
//by Metho
function Bot(CLIENT_SEED, CSRF_TOKEN) {
	Output.apply(this, arguments);
	this.CLIENT_SEED = CLIENT_SEED;
	this.CSRF_TOKEN = CSRF_TOKEN;
	this.BET_UNIT = 0.00000001;
	this.runtimeLoop = true;
	this.requestNetwork = new XMLHttpRequest();
	this.roll = function(bet, multiplier, mode) {
		this.requestNetwork.open('GET', '/cgi-bin/bet.pl?stake=' + bet + '&multiplier=' + multiplier + '&m=' + mode + '&client_seed=' + this.CLIENT_SEED + '&csrf_token=' + this.CSRF_TOKEN, false);
		this.requestNetwork.send();
		return this.requestNetwork.responseText;
	};
	this.start = function(bet) {
		var cntWin = 0;
		var stopPlay = 100;
		var startAmount, firstTime; // sessionBalance;
		bet = this.increaseAmount(bet);
		startAmount = bet;
		firstTime = true;
		sessionBalance = 0;
		loop(this, function() {
			return this.runtimeLoop;
		}, function() {
			var mode, responseElements;
			mode = this.getRandomMode();
			responseElements = this.roll(bet, 2, mode).split(':', 5);
			if(responseElements[0] === 's1') {
				if(responseElements[1] === 'w') { // win
					cntWin++;
					document.querySelector("#wait > p:nth-child(3)").textContent=("Вы сделали ставку " + responseElements[4] + " BTC (биткойн) на " + mode + " и выиграли.");

					this.printOutput("Вы сделали ставку " + responseElements[4] + " BTC (биткойн) на " + mode + " и выиграли.", 'color: #00C800; background-color: #CCFFCC;');
					sessionBalance += bet;
					// bet += this.increaseAmount(1);
					// if (sessionBalance >= 0) { // reset
					//     this.printOutput('Промежуточный баланс был сброшен. Цель достигнута.', 'color: #00C800; background-color: #CCFFCC;');
					//     bet = startAmount;
					//     sessionBalance = 0;
					// } else if (bet * 2 > -sessionBalance + this.increaseAmount(1)) {
					//     bet = this.increaseAmount(Math.ceil(this.decreaseAmount(-sessionBalance * 0.5)));
					// }
					bet = startAmount;
					firstTime = true;
				} else { // lose
				document.querySelector("#wait > p:nth-child(3)").textContent=("Вы noставили " + responseElements[4] + " BTC (биткойн) на " + mode + " и проиграли.")
					this.printOutput("Вы noставили " + responseElements[4] + " BTC (биткойн) на " + mode + " и проиграли.", 'color: #C80000; background-color: #FFCCCC;');
					sessionBalance -= bet;
					if(firstTime) {
						firstTime = false;
					} else {
						bet *= 2;
						bet += startAmount;
					}
				}
				//this.printOutput(this.fillInput('Состояние счета:', 16) + responseElements[3], 'color: #0000C8; background-color: #CCCCFF;');
				// this.printOutput(this.fillInput('Промежуточный баланс:', 16) + sessionBalance.toFixed(8), 'color: #0000C8; background-color: #CCCCFF;');
				$('#balance').html(responseElements[3]);
				$('#balance2').html(responseElements[3]);
			} else { // error
				alert('Произошла ошибка. Ошибка: "' + responseElements[1] + '"');
				this.runtimeLoop = false;
			}
			if(cntWin > stopPlay) {
				this.runtimeLoop = false; // <= debugging
				document.querySelector("#wait > p:nth-child(3)").textContent=('profit: ' + sessionBalance.toFixed(8));
				console.log('profit: ' + sessionBalance.toFixed(8));
			}
		});
	};
	this.stop = function() {
		this.runtimeLoop = false;
	};
	this.increaseAmount = function(amountValue) {
		return amountValue * this.BET_UNIT;
	};
	this.decreaseAmount = function(amountValue) {
		return 1 / this.BET_UNIT * amountValue;
	};
	this.getRandomMode = function() {
		return this.getRandomElement('hi', 'lo');
	};
	this.getRandomElement = function() {
		return arguments[Math.round(Math.random() * (arguments.length - 1))];
	};
}

function Output() {
	this.printOutput = function(text, textStyle) {
		var initiatorStyle = 'color: rgba(0, 0, 0, 0.5);';
		text = this.prepareText(text);
		if(typeof textStyle !== 'string') {
			textStyle = '';
		}
		console.log(this.fillInput('%c=>%c', 10) + '%c' + text, initiatorStyle, 'color: initial;', textStyle);
	};
	this.fillInput = function(text, endSize) {
		var fillSize = endSize - text.length;
		if(fillSize > 0) {
			text += ' '.repeat(fillSize);
		}
		return text;
	};
	this.prepareText = function(text) {
		return ' ' + text.trim() + ' ';
	};
}
Bot.prototype = Object.create(Output.prototype);
Bot.prototype.constructor = Bot;

function loop(thisArg, condition, action) {
	var conditionStatement, argsArray;
	conditionStatement = condition.apply(thisArg);
	argsArray = arguments;
	window.setTimeout(function() {
		if(conditionStatement) {
			action.apply(thisArg);
			argsArray.callee.apply(null, argsArray);
		}
	}, 0);
}

function getCookie(cookieName) {
	var cookieResult, cookieValue;
	cookieResult = document.cookie.split(cookieName, 2)[1];
	cookieValue = '';
	for(var i = 1, l = cookieResult.length; i < l; i++) {
		if(cookieResult[i] === ';') {
			return cookieValue;
		}
		cookieValue += cookieResult[i];
	}
}

function play(clientSeed) {
	var BotSession;
	console.log('Бот был запущен. Сеанс инициализирован.');
	BotSession = new Bot(clientSeed, getCookie('csrf_token'));
	BotSession.start(1);
}

function randomSeed(clientSeed) {
	var randomString = '';
	for(var i = 0; i < 16; i++) {
		var randomPoz = Math.floor(Math.random() * charSet.length);
		randomString += charSet.substring(randomPoz, randomPoz + 1);
	}
	return randomString;
}
setTimeout(function(){
console.log(randomSeed());
play(randomSeed());
}, 10 * 60 * 1000);//запуск через 10 мин. после обнавления страницы
