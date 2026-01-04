// ==UserScript==
    // @name         Martingale Strategy Calculator
    // @version      1.0
    // @description  Calculate betting strategy based on desired profit and number of rolls to target that profit. Console log has list of bets to be made.
    // @description  See 
    // @description  Please sign up using my ref link:
    // @description  Would be happy about a donation when you make money with the script! > BTC
    // @author       rorg314
    // @match        https://freebitco.in/?op=home
    // @match        https://freebitco.in/?op=home#
    // @match        https://freebitco.in/
    // @match        https://freebitco.in/*
    // @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js

// @namespace https://greasyfork.org/users/583382
// @downloadURL https://update.greasyfork.org/scripts/405084/Martingale%20Strategy%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/405084/Martingale%20Strategy%20Calculator.meta.js
// ==/UserScript==


//Config values//
var n = 1;
var betlast = 0;
var testbet = 0;
var nmax = 100;
var profit =0;
var rolls = 0;
var dprof = 0;
var cumsum = 0;
var minbet = [];
var cumsumarray = [];
var tries=0;
var testcum = 0;
var testprofit = 0;
var maxroll = 0;
//USER VALUES//
var odd = 5; //Desired odds
var npmax = 4; //Desired number of rolls win max profit
var iniprof = 100; // Desired max profit
var maxSpend = 500000; // Desired max spend before lose
//USER VALUES//

//FUNCTIONS//
//Test bet required to reach desired profit value (after n rolls)
function testprof() {
	testcum = cumsum;
	testbet=0;
	testprofit = odd*testbet-testcum;
	while(testprofit <= dprof){
	testbet++;
	testcum++;
	testprofit = odd*testbet-testcum;
	}
}
//Test the bet required on the n-th roll
function testn() {
	if(cumsum < maxSpend){
			if(n<=npmax){dprof = iniprof;} else {dprof = 1;} //switch to break even after npmax rolls
	testprof(); //Call testprof
	betlast = testbet;
	cumsum = cumsum + betlast;
	cumsumarray[n] = cumsum;
	minbet[n] = testbet;
	n++;
	}
    else{maxroll = n; nmax = n;}//stop if bet over max
}

while(n<nmax){ testn();}

console.log(minbet);
console.log('Max lose streak = ' + maxroll);
