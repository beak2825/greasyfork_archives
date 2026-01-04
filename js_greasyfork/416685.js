// ==UserScript==
// @name         sandjar script avto play multipls 
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  https://freebitco.in/?r=14084084
// @author       You
// @match        https://freebitco.in/?op=home
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416685/sandjar%20script%20avto%20play%20multipls.user.js
// @updateURL https://update.greasyfork.org/scripts/416685/sandjar%20script%20avto%20play%20multipls.meta.js
// ==/UserScript==//// баланс до ставки и после
var BalanceToBet, BalanceAfterBetting;

// прогоночна¤ ставка
var MinimumRate_ToString = "0.00000001"; // текстовый формат
var MinimumRate = +MinimumRate_ToString; // числовой формат

// контрольная ставка - для N ставок
var Rate = [];
var N = 15;
var waitstart = 300;

// индекс ставки
var StavkaID = 0;

// показатель последних ставок
var LastBidResult = 0; // если значение отрицательное, то LO иначе HI

// сколько прогоночных ставок делаем
var GoRate = 3;

// сколько всего ставок делать
var exit_go = 9999999;

// инициализаци¤ переменных
function Initialization_Var(){
	// заполн¤ем массив контрольных ставок
	for(var i = 0; i < N; i++)
		Rate.push("0.00000002");
	var stavim = ["0.00000007", "0.00000021", "0.00000048", "0.00000103", "0.00000213", "0.00000433", "0.00000873", "0.00001753"];
	for(var i = 0; i < 8; i++)
		Rate[i] = stavim [i];
}

// начинаем делать ставки
function Start() {
	// записываем баланс до ставки
	BalanceToBet = +$('#balance')[0].innerHTML;
	if(LastBidResult > GoRate || LastBidResult < -GoRate)
		waitstart = 5000;
	else
		waitstart = 300;
    setTimeout(function () {
		// устанавливаем сумму ставки
		if(LastBidResult > GoRate || LastBidResult < -GoRate)
		{
			$('#double_your_btc_stake')[0].value = Rate[StavkaID];
		}
		else
		{
			$('#double_your_btc_stake')[0].value = MinimumRate_ToString;
		}
		// контрольная ставка
		if(LastBidResult < -GoRate)
		{
			document.querySelector("#double_your_btc_bet_hi_button").click();
		}
		else{
			if(LastBidResult > GoRate)
			{
				document.querySelector("#double_your_btc_bet_lo_button").click();
			}
			else
			{
				document.querySelector("#double_your_btc_bet_hi_button").click();
			}
		}
        CheckBet_WaitOne();
    }, waitstart);
}

// проверка ставки
function CheckBet() {
	BalanceAfterBetting = +$('#balance')[0].innerHTML;
	// если результат еще не известен, то ждем
	if(BalanceToBet == BalanceAfterBetting)
	{
		setTimeout(function () {
		CheckBet();
		}, 300);
	}
	else
	{
		// если делали прогоночную ставку
		if(LastBidResult <= GoRate && LastBidResult >= -GoRate)
			CheckBet_Last();
		else{
			if(LastBidResult > GoRate)
				CheckBet_LO();
			else{
				if(LastBidResult < GoRate)
					CheckBet_HI();
			}
		}
		if(exit_go > 0 && StavkaID <= 3)
		{
			Start();
		}
		else
		{
			soundProigraly();
			console.log("завершили");
			setTimeout(function () {
				Start();
			}, 2000);
		}
		exit_go--;
	}
}

// обработка результата прогоночной ставки
function CheckBet_Last(){
	console.log("прогоночная ставка");
	if(BalanceToBet > BalanceAfterBetting)
	{
		if(LastBidResult > 0)
		{
			LastBidResult = 0;
		}
		LastBidResult--;
	}
	else{
		if(LastBidResult < 0)
			LastBidResult = 0;
		LastBidResult++;
	}
}

// обработка результата контрольной ставки HI
function CheckBet_HI(){
	console.log("контрольная ставка HI");
	if(BalanceToBet > BalanceAfterBetting){
		console.log("проиграли ", StavkaID);
		StavkaID++;
		LastBidResult--;
	}
	else{
		soundPobeda();
		console.log("ѕобеда");
		StavkaID = 0;
		LastBidResult = 0;
	}
}

// обработка результата контрольной ставки LO
function CheckBet_LO(){
	console.log("контрольная ставка LO");
	if(BalanceToBet > BalanceAfterBetting){
		console.log("проиграли ", StavkaID);
		StavkaID++;
		LastBidResult++;
	}
	else{
		soundPobeda();
		console.log("победа");
		StavkaID = 0;
		LastBidResult = 0;
	}
}

// первый этап ожидания после ставки
function CheckBet_WaitOne() {
    setTimeout(function () {
	CheckBet();
    }, 400);
}

function main(){
	Initialization_Var();
	console.log("—тартуем");
	Start();
}

function soundPobeda() {
  var audio = new Audio();
  audio.src = 'http://simple-work.ru/data/mario-zvuk-pobedy.mp3';
  audio.autoplay = true; // јвтоматически запускаем
}

function soundProigraly() {
  var audio = new Audio();
  audio.src = 'http://simple-work.ru/data/proigraly.mp3';
  audio.autoplay = true;
}

main();