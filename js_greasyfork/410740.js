// ==UserScript==
// @version      1.0.0
// @author       nam.d02th@gmail.com
// @match        https://freebitco.in/*
// @name         odd 2 random
// @namespace    1.0.0
// @description  namtt007
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/410740/odd%202%20random.user.js
// @updateURL https://update.greasyfork.org/scripts/410740/odd%202%20random.meta.js
// ==/UserScript==

var chance     = 49.5;
var odd		   = 100/chance;
var detect	   = 0.00000001;
var nextbet    = detect;
var ctL        = 0;
var balance    = parseFloat(document.getElementById("balance2").innerHTML.substr(0, 10));
var initbalance =  balance;
var stopprofit = balance/5;
var r          = Random_integer(3,9);
var s 		   = r+9;
var bethigh	   = false;
var previousbet = nextbet;

function Random_integer(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function dobet(){
	console.log("initbalance: " + initbalance);
	console.log("balance: " + balance);
	console.log("INCREASE BALANCE: " + (balance - initbalance)/initbalance*100 + "%");
	console.log("ctL: "+ctL);
	console.log("r: "+r);
	console.log("s: "+s);
	if((balance - initbalance) > stopprofit){
		console.log("REACH TARGET");
		stop();
	} else {
		if (document.getElementById('double_your_btc_bet_hi_button').disabled === false) {
			nextbet = detect;
			var won = document.getElementById('double_your_btc_bet_win').innerHTML;
			if (won.match(/(\d+\.\d+)/) !== null) {
				nextbet = detect;
				bethigh = Random_integer(0,100)%2==0;
				ctL     = 0;
				r       = Random_integer(3,9);	
				s       = r+9;	
			}
			
			var lost = document.getElementById('double_your_btc_bet_lose').innerHTML;
			if (lost.match(/(\d+\.\d+)/) !== null ) {
				ctL +=1;
				if (ctL == r) {
					nextbet = balance/1000;
					bethigh = Random_integer(0,100)%2==0;
				}
				if (ctL == s) {
					nextbet = detect;
					ctL     = 0;
				}
				if (ctL > r) {
					nextbet = previousbet*2;
					bethigh = Random_integer(0,100)%2==0;
				}
			}
			
			//bet
			document.getElementById("double_your_btc_payout_multiplier").value = odd;
			document.getElementById("double_your_btc_stake").value = nextbet;
			previousbet = nextbet;
			if(bethigh){
				document.getElementById('double_your_btc_bet_hi_button').click();
			} else {
				document.getElementById('double_your_btc_bet_lo_button').click();
			}		
		}
	}
	console.log("------------------------------------------");
}

//Stop the script 
function stop(){
    clearInterval(martingale);    
}

function start(){
    martingale = setInterval(dobet, 1000);    
}

start();