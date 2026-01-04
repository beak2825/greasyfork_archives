// ==UserScript==
// @name        Best algorithm to play Multiply odd 1.5 win chance 63% (NOT FOR LOW BALANCE)
// @description Play with higher chance , READ FIRST
// @include     https://freebitco.in/*
// @copyright   2019, William.freelancer30@gmail.com
// @version     1.41
// @namespace 	william
// @downloadURL https://update.greasyfork.org/scripts/391757/Best%20algorithm%20to%20play%20Multiply%20odd%2015%20win%20chance%2063%25%20%28NOT%20FOR%20LOW%20BALANCE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/391757/Best%20algorithm%20to%20play%20Multiply%20odd%2015%20win%20chance%2063%25%20%28NOT%20FOR%20LOW%20BALANCE%29.meta.js
// ==/UserScript==


bconfig = {
minWait: 3000,
maxWait : 5000,
odd : 1.5,
bet : 0.00000002
};




//***********************************
var add = bconfig.bet;
var x = add;
var choice;
var body = $('body');
var maxWait = bconfig.maxWait;
var minWait = bconfig.minWait;
var c = 1;
var roll;
var hi = "hi";
var lo = "lo";
var sum = 0.00000000;
var stopprofit = 1.00000000;
var stoploss = -1.00000000;
var y = 1;
var state = 1 ;
//*********************************


var choiceroll = prompt("Please enter number of rolls", "10");
roll = parseInt(choiceroll, 10);

var rp = confirm("Do you want to stop the script on PROFIT");
if (rp == true) {
	var choiceprofit= prompt("Please enter a value in Satoshi", "100");
	stopprofit = parseInt(choiceprofit, 10);
	}

var rl = confirm("Do you want to stop the script on LOSS");
if (rl == true) {
	var choiceloss= prompt("Please enter a negative value in Satoshi", "-50");
	stoploss = parseInt(choiceloss, 10);
	}

function getRandomWait() {
	var wait;
	do {
		wait = Math.floor(Math.random() * maxWait) + 100;
		}
		while (wait < minWait);
		console.log(wait);
   return wait;
}

var init_balance = $('#balance').html();
document.getElementById("double_your_btc_payout_multiplier").value = "1.5";

rollDice = function(choice) {
	
var balance = $('#balance').html();	
if (x < 0.00000001) {
	x = add;
	document.getElementById("double_your_btc_stake").value = x.toFixed(8).toString();
}
var lenLose = $('#double_your_btc_bet_lose').html().length;
//console.log(lenLose);
var lenWin = $('#double_your_btc_bet_win').html().length;
//console.log(lenWin);
if (lenLose > 36 && lenWin == 0 && state == 1) {
	lenWin = 0;
	lenLose = 0;
	//x = x + add;
	y = y * 3;
	x = add * y;
	document.getElementById("double_your_btc_stake").value = x.toFixed(8).toString();
	$('#double_your_btc_bet_' + choice + '_button').click();
}else if (lenWin > 36 && lenLose == 0 && state == 1){
	lenWin = 0;
	lenLose = 0;
	if (x >= add * bconfig.odd * 2 ) {
		y = 1;
		x = add * y;
		document.getElementById("double_your_btc_stake").value = x.toFixed(8).toString();
		
		
	}
	
	$('#double_your_btc_bet_' + choice + '_button').click();
	
	
}
c++;
console.log("Roll number :"+c);
sum = parseFloat(balance) - parseFloat(init_balance) ;



if (((sum * 100000000) > stopprofit) || ((sum * 100000000) < stoploss)){
	
	console.log("Script stopped");
        state = 0;
	alert("Script stopped, " + " Profit = " + sum.toFixed(8).toString());
        location.reload();
	
	}
	
}

/*if (choice == null || choice == "") {
  choice = "hi";
} else {
  
}*/
    body.prepend(
        $('<div/>').attr('style',"position:fixed;top:50px;left:0;z-index:999;width:400px;background-color:#227d5c;color: white; text-align: center;")
            .append(
                $('<div/>').attr('id','autofaucet')
                    .append($('<p/> text-align: center').text("Donate:"))
                    .append($('<p/> text-align: center').text("1BssWLxeEEpt8DxDqaDyhkW2ohdGUfS5YW"))
                    .append($('<p/> text-align: center').text("Click to copy"))
                    .append($('<p/>')
                    )
            ).click(function(){
            var $temp = $('<input>').val("3A6gwzt32xbxkCH2LFDm97wXs1pHKFbb2y");
            body.append($temp);
            $temp.select();
            document.execCommand("copy");
            $temp.remove();
        })
    ).prepend($('<style/>')
        .text("#autofaucet p { margin: 0; margin-left: 0px;  text-align: center; }")
)

document.getElementById("double_your_btc_stake").value = x.toFixed(8).toString();
$('#double_your_btc_bet_' + hi + '_button').click();



function main(n) {
	function timer(){ // create a unique function (scope) each time
      var k = i; // save i to the variable k
      setTimeout(()=>{
		 if (state == 0){	 
			 return;
		 }else{
			if (k % 2 == 0){
				//console.log ("rolling high ..");
				rollDice("hi");
				}else{
					//console.log ("rolling low ..");
					rollDice("lo");
					}
					console.log ("Profit = " + sum.toFixed(8).toString());
		 }
		 
      },i*getRandomWait());
	  
   }
   timer();
}

for(var i = 1; i < roll; i++) {
   main(i);
}
