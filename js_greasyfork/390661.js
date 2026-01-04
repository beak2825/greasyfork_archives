// ==UserScript==
// @name        Plus one Minus one algorithm
// @description Play for ten times then refresh the page and select diffrent bet (HI/LO)
// @include     https://freebitco.in/*
// @copyright   2019, William.freelancer30@gmail.com
// @version     1.9
// @namespace 	william
// @downloadURL https://update.greasyfork.org/scripts/390661/Plus%20one%20Minus%20one%20algorithm.user.js
// @updateURL https://update.greasyfork.org/scripts/390661/Plus%20one%20Minus%20one%20algorithm.meta.js
// ==/UserScript==
bconfig = {
wait: 3000,
initialBet: 0.00000002
};

var x = bconfig.initialBet;
var i;
var choice;
var body = $('body');
var maxWait = 3000;
var minWait = 2000;
var c = 1;
var roll;

var choiceSelect = prompt("Please choose hi or lo", "hi");
choice = choiceSelect;
var choiceroll = prompt("Please enter number of rolls", "10");
roll = parseInt(choiceroll, 10);

function getRandomWait() {
	var wait;
	do {
		wait = Math.floor(Math.random() * maxWait) + 100;
		}
		while (wait < minWait);
		console.log(wait);
   return wait;
}

rollDice = function() {
	
if (x < 0.00000001) {
	x = 0.00000002
	document.getElementById("double_your_btc_stake").value = x.toFixed(8).toString();
}
var lenLose = $('#double_your_btc_bet_lose').html().length;
//console.log(lenLose);
var lenWin = $('#double_your_btc_bet_win').html().length;
//console.log(lenWin);
if (lenLose > 36 && lenWin == 0) {
	x = x + 0.00000001;
	//console.log(x);
	document.getElementById("double_your_btc_stake").value = x.toFixed(8).toString();
	//parseFloat($('#double_your_btc_stake').val(parseFloat(x)));
	$('#double_your_btc_bet_' + choice + '_button').click();
}else if (lenWin > 36 && lenLose == 0){
	if (x >= 0.00000003) {
		x = x - 0.00000001;
	//	console.log(x);
		document.getElementById("double_your_btc_stake").value = x.toFixed(8).toString();
		//parseFloat($('#double_your_btc_stake').val(parseFloat(x)));
		
	}
	//console.log(x);
	$('#double_your_btc_bet_' + choice + '_button').click();
	
	
}
c++;
console.log(c);
};

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
            var $temp = $('<input>').val("37rtYG6a3ZaZjYNZThiQNTBVifxK44V6eS");
            body.append($temp);
            $temp.select();
            document.execCommand("copy");
            $temp.remove();
        })
    ).prepend($('<style/>')
        .text("#autofaucet p { margin: 0; margin-left: 0px;  text-align: center; }")
)

document.getElementById("double_your_btc_stake").value = x.toFixed(8).toString();
$('#double_your_btc_bet_' + choice + '_button').click();		
for (i = 1; i < roll; i++) {
	setTimeout(function(){ rollDice(); }, i*getRandomWait());
}
