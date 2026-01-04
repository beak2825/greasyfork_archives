// ==UserScript==
// @name        Plus one Minus one algorithm with odd 1.44 win chance 66%
// @description Play with higher chance
// @include     https://freebitco.in/*
// @copyright   2019, William.freelancer30@gmail.com
// @version     2.01
// @namespace 	william
// @downloadURL https://update.greasyfork.org/scripts/391646/Plus%20one%20Minus%20one%20algorithm%20with%20odd%20144%20win%20chance%2066%25.user.js
// @updateURL https://update.greasyfork.org/scripts/391646/Plus%20one%20Minus%20one%20algorithm%20with%20odd%20144%20win%20chance%2066%25.meta.js
// ==/UserScript==
bconfig = {
wait: 3000,
initialBet: 0.00000007
};

var x = bconfig.initialBet;
var i;
var choice;
var body = $('body');
var maxWait = 3000;
var minWait = 2000;
var c = 1;
var roll;
var hi = "hi";
var lo = "lo";
var sum = 0.00000000;
var add = 0.00000007;
var odd = 1.44;
var stopprofit = 1.00000000;
var stoploss = -1.00000000;
var state = 1;

//var choiceSelect = prompt("Please choose hi or lo", "hi");
//choice = choiceSelect;



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
document.getElementById("double_your_btc_payout_multiplier").value = "1.44";

rollDice = function(choice) {
	
var balance = $('#balance').html();	
if (x < 0.00000001) {
	x = 0.00000007
	document.getElementById("double_your_btc_stake").value = x.toFixed(8).toString();
}
var lenLose = $('#double_your_btc_bet_lose').html().length;
//console.log(lenLose);
var lenWin = $('#double_your_btc_bet_win').html().length;
//console.log(lenWin);
if (lenLose > 36 && lenWin == 0 && state == 1) {
	x = x + add;
	document.getElementById("double_your_btc_stake").value = x.toFixed(8).toString();
	$('#double_your_btc_bet_' + choice + '_button').click();
}else if (lenWin > 36 && lenLose == 0 && state == 1){
	if (x >= 0.00000013) {
		x = x - add;
		document.getElementById("double_your_btc_stake").value = x.toFixed(8).toString();
		
		
	}
	$('#double_your_btc_bet_' + choice + '_button').click();
	
}
c++;
console.log("Roll number :"+c);
sum = parseFloat(balance) - parseFloat(init_balance) ;



if (((sum * 100000000) > stopprofit) || ((sum * 100000000) < stoploss)){
	
	console.log("Script stopped");
	alert("Script stopped, " + " Profit = " + sum.toFixed(8).toString());
	//location.reload();
	state = 0;
	
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



/*function setDelay(i,hilo) {
	setTimeout(function(){ rollDice(hilo); }, i*getRandomWait());
}*/

for(i = 1; i < roll; i++) {
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
