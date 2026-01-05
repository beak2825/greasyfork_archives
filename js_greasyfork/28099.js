// ==UserScript==
// @name         Dudemaus's DiceBot for Bitsler
// @namespace    dicebotforbitslerbydudemaus
// @version      2018.0116a
// @description  Wont win a fortune, but it will win.
// @author       Dudemaus
// @match        *://www.bitsler.com/play/dice/*
// @match        https://www.bitsler.com/play
// @match        https://www.bitsler.com/play/dice*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant		GM_xmlhttpRequest
// @grant		GM_info
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/28099/Dudemaus%27s%20DiceBot%20for%20Bitsler.user.js
// @updateURL https://update.greasyfork.org/scripts/28099/Dudemaus%27s%20DiceBot%20for%20Bitsler.meta.js
// ==/UserScript==
//////JQuery Compatibility statement//////
this.$ = this.jQuery = jQuery.noConflict(true);
//////JQuery Compatibility statement//////

(function() {

GM_addStyle(".game__container__index { background: url('https://i.imgur.com/l1VFdFf.jpg') no-repeat center center fixed;-webkit-background-size: cover;-moz-background-size: cover;-o-background-size: cover;background-size: cover; }");

//set some variables
     var countLosses = document.querySelectorAll('#history-my-bets-dice .text-danger').length;
     var countWins = document.querySelectorAll('#history-my-bets-dice .text-success').length;
     var winRatio = (countWins / 20) * 100;
     var losscount = 0;




// activate the my bets tab
document.getElementById('bets__content__my__bets').style = "display:block;";
document.getElementById('bets__content__all__bets').style = "display:none;";

//document.getElementById("my__bets").setAttribute("class", "on");
//document.getElementById("all__bets").setAttribute("class", "");
$( "#my__bets" ).click();



//insert the bot
$('.game__container__content').before('<div id="space" style="position:relative;width:100%;inset 0 1px 1px rgba(209,209,209,.8)"><br><div id="dicebot-container" class="tab-content tab-content-xs" style="width: 800px;background-color:#465a66;border-color: #D1D1D1;border-radius: 6px;border-style: solid;border-width: 1px; padding-bottom: 9px;padding-left: 9px;padding-right: 9px; margin-left: 118px; padding-top: 9px;display:block"> <div id="dicebotinnerwrap"> <div id="controlWrapper" style="Display:inline-block;"> <center><img src="https://i.imgur.com/0n5PVGW.png" /><font color="white"> <div id="tipDude" style="Display:inline-block;border-style: solid; border-color: yellow;border-width: 1px;border-radius: 2px;padding:5px;"><font color="yellow">Tip Dude</font></div> </center> <font color="#2aa5c7"><input type="text" name="betNumberOne" ID="betNumberOne" style="text-align:center;"> Base bet <br> <input type="text" name="betNumberTwo" ID="betNumberTwo" style="text-align:center;"> Bet #2 <br> <input type="text" name="betNumberThree" ID="betNumberThree" style="text-align:center;"> Bet #3 <br> <input type="text" name="betNumberFour" ID="betNumberFour" style="text-align:center;"> Bet #4 <br><input type="text" name="betNumberFive" ID="betNumberFive" style="text-align:center;"> Bet #5 <br><input type="text" name="betNumberSix" ID="betNumberSix" style="text-align:center;"> Bet #6 <br><input type="text" name="betNumberSeven" ID="betNumberSeven" style="text-align:center;"> Bet #7 <br><input type="text" name="betNumberEight" ID="betNumberEight" style="text-align:center;"> Bet #8 <br> </font><font color="#465a66"><button id="setBet" value="set bet">Bet Once</button> <button id="dudesAuto">Auto</button> <button id="stopDudesAuto">Stop Auto</button> </font></div> <div id="ulikey" style="Display:inline-block;position: relative; top: -85px;"><font color="Yellow"><b>If you like this bot please donate to any of these addresses:</b></font> <br><b><font size="1"><font color="orange">Ethereum:</font></b> 0xfe460f08c4eaf98a234b2f1230f86971012a70a1<br><b><font color="orange">Bitcoin:</font></b> 1AtKgtemWiT93h4YGBXF9WKvaEpkQaKmmr <br><b><font color="orange">Doge:</font></b> DG4hZEVGBt6kws6dFZ2eCBh4HQAsVrvpbH<br><b><font color="orange">Litecoin:</font></b> LZEL3oEWEM1vsonfTjz11Vvw37zjDd2EQA<br><b><font color="orange">Burst: </font></b>BURST-HU3D-67VZ-L4X4-HW6PF</font></font></div> </div><div id="winIndicator" style="Display:inline-block;position: relative; top: -297px; left: 371px;inset 0 1px 1px rgba(209,209,209,.8);color: #b30000;background-color: #808080;Display:inline-block;position: relative; top: -297px; left: 327px;border-style: solid; border-color: black;border-width: 1px;border-radius: 2px;padding:5px;inset 0 1px 1px rgba(209,209,209,.8);width:55px;"><font color="#e6e6e6">ROLL#</font></div><div id="profitIndicator" style="Display:inline-block;position: relative; top: -297px; left: 327px;color: #1a1a00;background-color: #ffffcc;Display:inline-block;position: relative; top: -297px; left: 330px;border-style: solid; border-color: white;border-width: 1px;border-radius: 2px;padding:5px;box-shadow:inset 0 1px 1px rgba(209,209,209,.8);"></div> <button id="resetProfitLoss" style="position: relative; top: -297px; left: 330px;border-width: 1px;border-radius: 2px;padding:5px;box-shadow:inset 0 1px 1px rgba(209,209,209,.8);">Reset P/L</button><select name="algo" style="position: relative; top: -297px; left: 380px;border-width: 1px;border-radius: 2px;padding:5px;box-shadow:inset 0 1px 1px rgba(209,209,209,.8);"><option value="1">Martingale</option><option value="2">Test Algorithm</option></select><div id="rollHunter" style="Display:inline-block;position: relative; top: -258px; left: -55px;border-width: 1px;border-radius: 2px;padding:5px;color:white;background-color:#465a66;border-color: #D1D1D1;border-radius: 6px;border-style: solid;border-width: 1px;">Post roll # to chat if you roll a... <input type="text" id="rollHunterNumberOne" style="display:inline-block; width:55px;color:#2aa5c7;"></input> -OR- <input type="text" id="rollHunterNumberTwo" style="display:inline-block; width:55px;color:#2aa5c7;"></input></div></div>');


document.getElementById('betNumberOne').value = "0.00000001";
document.getElementById('betNumberTwo').value = "0.00000001";
document.getElementById('betNumberThree').value = "0.00000001";
document.getElementById('betNumberFour').value = "0.00000001";
document.getElementById('betNumberFive').value = "0.0000001";
document.getElementById('betNumberSix').value = "0.0000003";
document.getElementById('betNumberSeven').value = "0.0000006";
document.getElementById('betNumberEight').value = "0.0000013";



      //when set bet button is clicked, set the bet.
document.getElementById('setBet').addEventListener("click", function() {
     var countLosses = document.querySelectorAll('#history-my-bets-dice .text-danger').length;
     var countWins = document.querySelectorAll('#history-my-bets-dice .text-success').length;
     var winRatio = (countWins / 20) * 100;
     var betOne = document.getElementById('betNumberOne').value;
     var betTwo = document.getElementById('betNumberTwo').value;
     var betThree = document.getElementById('betNumberThree').value;
     var betFour = document.getElementById('betNumberFour').value;
     var winChance = document.getElementById('chance-html').innerText;
     var element = document.getElementById("bets__content__my__bets");
     var lastBet0 = parseFloat(element.getElementsByTagName('span')[15].innerText);
     var lastBet1 = parseFloat(element.getElementsByTagName('span')[23].innerText);
     var lastBet2 = parseFloat(element.getElementsByTagName('span')[31].innerText);
     var lastBet3 = parseFloat(element.getElementsByTagName('span')[39].innerText);
     var lastBet4 = parseFloat(element.getElementsByTagName('span')[47].innerText);
     var lastBet5 = parseFloat(element.getElementsByTagName('span')[55].innerText);
     var lastBet6 = parseFloat(element.getElementsByTagName('span')[63].innerText);
     var lastBet7 = parseFloat(element.getElementsByTagName('span')[71].innerText);

    var e = $("select[name='algo'] option:selected").index();
//check algorithm before betting
    if(e == 1){
setInterval(function(){
    if(parseFloat(element.getElementsByTagName('span')[15].innerText) < 0){
        document.getElementById('winIndicator').style = "color: #b30000;background-color: #ffb3b3;Display:inline-block;position: relative; top: -297px; left: 327px;border-style: solid; border-color: red;border-width: 1px;border-radius: 2px;padding:5px;inset 0 1px 1px rgba(209,209,209,.8);width:55px;";
        document.getElementById('winIndicator').innerText = element.getElementsByTagName('span')[14].innerText;
}

    else{
        document.getElementById('winIndicator').style = "color: #145214;background-color: #70db70;Display:inline-block;position: relative; top: -297px; left: 327px;border-style: solid; border-color: #b3ffb3;border-width: 1px;border-radius: 2px;padding:5px;inset 0 1px 1px rgba(209,209,209,.8);width:55px;";
        document.getElementById('winIndicator').innerText = element.getElementsByTagName('span')[14].innerText;
}

 }, 25);
    

	 if(lastBet0 < 0){
	  var bet0 = 0;
	 }
	 else{
	  var bet0 = 1;
	 }

	 if(lastBet1 < 0){
	  var bet1 = 0;
	 }
	 else{
	  var bet1 = 1;
	 }

	 if(lastBet2 < 0){
	  var bet2 = 0;
	 }
	 else{
	  var bet2 = 1;
	 }

	 if(lastBet3 < 0){
	  var bet3 = 0;
	 }
	 else{
	  var bet3 = 1;
	 }

	 if(lastBet4 < 0){
	  var bet4 = 0;
	 }
	 else{
	  var bet4 = 1;
	 }

	 if(lastBet5 < 0){
	  var bet5 = 0;
	 }
	 else{
	  var bet5 = 1;
	 }

	 if(lastBet6 < 0){
	  var bet6 = 0;
	 }
	 else{
	  var bet6 = 1;
	 }

	 if(lastBet7 < 0){
	  var bet7 = 0;
	 }
	 else{
	  var bet7 = 1;
	 }

	 var winLossRatio = bet0+bet1+bet2+bet3+bet4+bet5+bet6+bet7;

	if(winLossRatio < 1){
	document.getElementById('amount').value = document.getElementById('betNumberEight').value;
	calculate_profit();
    play();
	}
	else if(winLossRatio === 1){
	document.getElementById('amount').value = document.getElementById('betNumberSeven').value;
	calculate_profit();
    play();
	}
	else if(winLossRatio === 2){
	document.getElementById('amount').value = document.getElementById('betNumberSix').value;
	calculate_profit();
    play();
	}
	else if(winLossRatio === 3){
	document.getElementById('amount').value = document.getElementById('betNumberFive').value;
	calculate_profit();
    play();
	}
	else if(winLossRatio === 4){
	document.getElementById('amount').value = document.getElementById('betNumberFour').value;
	calculate_profit();
    play();
	}
	else if(winLossRatio === 5){
	document.getElementById('amount').value = document.getElementById('betNumberThree').value;
	calculate_profit();
    play();
	}
	else if(winLossRatio === 6){
	document.getElementById('amount').value = document.getElementById('betNumberTwo').value;
	calculate_profit();
    play();
	}
	else{
	document.getElementById('amount').value = document.getElementById('betNumberOne').value;
	calculate_profit();
    play();
	}
    }

else{
////////////////////////
////////////////////////

setInterval(function(){
    if(parseFloat(element.getElementsByTagName('span')[15].innerText) < 0){
        document.getElementById('winIndicator').style = "color: #b30000;background-color: #ffb3b3;Display:inline-block;position: relative; top: -297px; left: 327px;border-style: solid; border-color: red;border-width: 1px;border-radius: 2px;padding:5px;inset 0 1px 1px rgba(209,209,209,.8);width:55px;";
        document.getElementById('winIndicator').innerText = element.getElementsByTagName('span')[14].innerText;
}

    else{
        document.getElementById('winIndicator').style = "color: #145214;background-color: #70db70;Display:inline-block;position: relative; top: -297px; left: 327px;border-style: solid; border-color: #b3ffb3;border-width: 1px;border-radius: 2px;padding:5px;inset 0 1px 1px rgba(209,209,209,.8);width:55px;";
        document.getElementById('winIndicator').innerText = element.getElementsByTagName('span')[14].innerText;
}

 }, 25);


///////



	if(lastBet7 < 0 && lastBet6 < 0 && lastBet5 < 0 && lastBet4 < 0 && lastBet3 < 0 && lastBet2 < 0 && lastBet1 < 0 && lastBet6 < 0){
	document.getElementById('amount').value = document.getElementById('betNumberEight').value;
	calculate_profit();
    play();
	}
	else if(lastBet6 < 0 && lastBet5 < 0 && lastBet4 < 0 && lastBet3 < 0 && lastBet2 < 0 && lastBet1 < 0 && lastBet6 < 0){
	document.getElementById('amount').value = document.getElementById('betNumberEight').value;
	calculate_profit();
    play();
	}
	else if(lastBet5 < 0 && lastBet4 < 0 && lastBet3 < 0 && lastBet2 < 0 && lastBet1 < 0 && lastBet6 < 0){
	document.getElementById('amount').value = document.getElementById('betNumberSeven').value;
	calculate_profit();
    play();
	}
	else if(lastBet4 < 0 && lastBet3 < 0 && lastBet2 < 0 && lastBet1 < 0 && lastBet6 < 0){
	document.getElementById('amount').value = document.getElementById('betNumberSix').value;
	calculate_profit();
    play();
	}
	else if(lastBet3 < 0 && lastBet2 < 0 && lastBet1 < 0 && lastBet6 < 0){
	document.getElementById('amount').value = document.getElementById('betNumberFive').value;
	calculate_profit();
    play();
	}
	else if(lastBet2 < 0 && lastBet1 < 0 && lastBet6 < 0){
	document.getElementById('amount').value = document.getElementById('betNumberFour').value;
	calculate_profit();
    play();
	}
	else if(lastBet1 < 0 && lastBet6 < 0){
	document.getElementById('amount').value = document.getElementById('betNumberThree').value;
	calculate_profit();
    play();
	}
	else if(lastBet1 < 0){
	document.getElementById('amount').value = document.getElementById('betNumberTwo').value;
	calculate_profit();
    play();
	}
	else{
	document.getElementById('amount').value = document.getElementById('betNumberOne').value;
	calculate_profit();
    play();
	}
}


//// do martingale if not on test algorithm


////////////////////////
////////////////////////




});


document.getElementById('tipDude').addEventListener("click", function() {
username_tip = "dudemaus";
send_tip_modal(1, username_tip);
});



document.getElementById('dudesAuto').addEventListener("click", function() {

    dudesAuto = setInterval(function(){ $("#setBet").click(); }, 100);

});

document.getElementById('stopDudesAuto').addEventListener("click", function() {

           clearInterval(dudesAuto);


});



//code to reset profit/loss div
////////////
document.getElementById('resetProfitLoss').addEventListener("click", function() {

		$.ajax({
			type: "POST",
			url: "/api/reset-current-session",
			success: function(text) {
				var val = JSON.parse(text);
				if (val.return.success == 'true') {
					showSuccessNotification(val.return.value, "");

					datas_current_session = JSON.parse(val.return.content);
					$("#current-bets-number").html(0);
					$("#current-wagered").html((0).toFixed(8));
					$("#current-profit").html((0).toFixed(8));
					$("#current-bets-wins").html(0);
					$("#current-bets-losses").html(0);
					$("#current-lucky").html("-%");
				}
				else {
					showErrorNotification(val.return.value, "");
				}
			},
			error:		function (xhr, ajaxOptions, thrownError)	{errorRequestAbort();},
			timeout:	function (xhr, ajaxOptions, thrownError)	{errorRequestAbort();},
			abort:		function (xhr, ajaxOptions, thrownError)	{errorRequestAbort();}
		});

});
///////////////


})();





//update profit indicator
setInterval(function(){
var zProfit = document.getElementById('current-profit').innerText;
document.getElementById('profitIndicator').innerText = zProfit;
 }, 100);

//change seeds onload and every 5 mins

setInterval(function(){ change_seeds(); }, 60000);


///code to post if rollhunt number is landed
if(rollHunterNumberOne == parseFloat(element.getElementsByTagName('span')[15].innerText)){
    clearInterval(dudesAuto);
    document.getElementById('message').innerText = "B:" + parseFloat(element.getElementsByTagName('span')[8].innerText);
    document.getElementById('message').focus();
    add_message();
}
else if (rollHunterNumberTwo == parseFloat(element.getElementsByTagName('span')[15].innerText)){
    clearInterval(dudesAuto);
    document.getElementById('message').innerText = "B:" + parseFloat(element.getElementsByTagName('span')[8].innerText);
    document.getElementById('message').focus();
    add_message();
}
else{
}

alert('this loaded');
