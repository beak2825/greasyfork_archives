// ==UserScript==
// @name         FLBOT(free-litecoin) - Best and first bot for free-litecoin multiplier
// @namespace    http://free-litecoin.com/
// @version      0.4
// @description  [BETA] BETA VERSION OF FLBOT - AUTO MULTIPLY. INCREASE YOUR CHANCES!
// @author       Charset404, BrunoB
// @match        https://www.free-litecoin.com/multiply
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420828/FLBOT%28free-litecoin%29%20-%20Best%20and%20first%20bot%20for%20free-litecoin%20multiplier.user.js
// @updateURL https://update.greasyfork.org/scripts/420828/FLBOT%28free-litecoin%29%20-%20Best%20and%20first%20bot%20for%20free-litecoin%20multiplier.meta.js
// ==/UserScript==


var winChance;		// Seta quantos % de ganho você tem de ganhar/perder (Arrow how many % gain you have to win/lose). Win chance, 1 and 95
var setLowHigh;		// 0 = Jogar em Low | 1 = jogar em High. (0 = play Low | 1 = play High.)
var nunberOfRows;	// Seta o numero de jogadas. (Set the number of rolls)

//==========================================================================================================================================================
// Não edite abaixo sem conhecimento. (Do not edit below without knowledge)
loadinput();

// Global Variables
var botBreak = 0; // to count
var botInterval;
var update; // update ltc values
var lssWn; // update Loss/Win values

function myLoop() {
    let getColor = document.getElementById("winlose");
    document.getElementById("winchance").value = winChance;

    if (botBreak == nunberOfRows) {
		stopAll();
        var showStats = document.getElementById("getstats");
        savevalue = savevalue; // Analizar ver se essa linha está funcionando outro dia
        loadinput();
		getColor.innerText = "";
        showStats.innerText = messages.endingbot;
    } else {
        if (getColor.style.color === "red" && getColor.innerText !== "") {
            changevalue(1); // It multiplies 2x the value of the bet if you lose.
            bet(setLowHigh);
			botBreak++; // count to stop bot
        } else if (getColor.style.color === "green" && getColor.innerText !== "") {
            savevalue = savevalue; // Resets the bet to base, if it wins. Analizar ver se essa linha está funcionando outro dia
            loadinput();
            bet(setLowHigh);
			botBreak++;
        } else if (getColor.innerText === "") {
            bet(setLowHigh);
        }
    }
}

function loadHTML() {
    var getHtml = document.querySelector(".paddingtop"); // Takes the string of the current content.
    var htmlTemp = getHtml.innerHTML;

    var inserthtml = `
        <div id="buttons">
			<button id="closex">X</button>
	        <h1>FLBOT</h1>
	        <h1 id="subtext">Free-Litecoin BOT</h1>

			<div class="conf">
				<h1>Configuration Panel</h1>
				<table id="config">
					<tr>
						<th style="padding: 0px 0px 5px 15px;">Settings</th>
						<th style="padding-bottom: 5px;">Value</th>
					</tr>
					<tr>
						<td>Bet?</td>
						<td><input type="number" step="0.00000001" min="0.00000001" max="10" id="postltc" value="0.00000001" oninput="reclc();"></td>
					</tr>
					<tr>
						<td>% Win/Loss?</td>
						<td><input type="number" step="1" min="1" max="95" id="losswin" value="50"></td>
					</tr>
					<tr>
						<td>[0] Low/High [1]?</td>
						<td><input type="number" min="0" max="1" id="lowhigh" value="0"></td>
					</tr>
					<tr>
						<td>How Many Bets?</td>
						<td><input type="number" step="1" min="1" id="naposta" value="300"></td>
					</tr>
				</table>
			</div>

	        <div id="infos">
	            <p id="ltcmoney"><span style="color: #cdcdcd">TOTAL LTC:</span> 0.00000000</p>
	            <p id="ltcwins"><span style="color: #cdcdcd">WINS:</span> <span id="wins">0</span></p>
	            <p id="ltcloss"><span style="color: #cdcdcd">LOSS:</span> <span id="loss">0</span></p>
	            <p id="ltcstats"><span style="color: #cdcdcd; display: block;">STATUS: <span id="getstats">Start with the blue button</span></span><button id="bot-msg">Setting</button></p>
        	</div>

	        <button id="bstart">Start FLBOT</button>
	        <button id="bstop">Stop FLBOT</button>

			<div style="font-size:12px;margin:0 auto;width:300px; color: #ececec">
					<img id="donate" src="https://blockchain.info/Resources/buttons/donate_64.png" />
				<div class="blockchain">
					<p align="center">Please Donate To Bitcoin Address: <b>19SUy2D1QwzYGBChXmUp3bG5UWtp2i64Ay</b></p>
					<div align="center">
						<svg shape-rendering="crispEdges" height="100" width="100" viewBox="0 0 29 29" class="qrcode">
							<path fill="#FFFFFF" d="M0,0 h29v29H0z"></path>
							<path fill="#000000"
								d="M0 0h7v1H0zM8 0h1v1H8zM10 0h1v1H10zM12 0h1v1H12zM14 0h1v1H14zM18 0h1v1H18zM20 0h1v1H20zM22,0 h7v1H22zM0 1h1v1H0zM6 1h1v1H6zM9 1h6v1H9zM20 1h1v1H20zM22 1h1v1H22zM28,1 h1v1H28zM0 2h1v1H0zM2 2h3v1H2zM6 2h1v1H6zM8 2h3v1H8zM13 2h1v1H13zM16 2h1v1H16zM18 2h1v1H18zM22 2h1v1H22zM24 2h3v1H24zM28,2 h1v1H28zM0 3h1v1H0zM2 3h3v1H2zM6 3h1v1H6zM8 3h3v1H8zM12 3h6v1H12zM22 3h1v1H22zM24 3h3v1H24zM28,3 h1v1H28zM0 4h1v1H0zM2 4h3v1H2zM6 4h1v1H6zM8 4h1v1H8zM11 4h6v1H11zM22 4h1v1H22zM24 4h3v1H24zM28,4 h1v1H28zM0 5h1v1H0zM6 5h1v1H6zM10 5h2v1H10zM13 5h1v1H13zM16 5h1v1H16zM19 5h2v1H19zM22 5h1v1H22zM28,5 h1v1H28zM0 6h7v1H0zM8 6h1v1H8zM10 6h1v1H10zM12 6h1v1H12zM14 6h1v1H14zM16 6h1v1H16zM18 6h1v1H18zM20 6h1v1H20zM22,6 h7v1H22zM10 7h1v1H10zM12 7h1v1H12zM16 7h2v1H16zM19 7h1v1H19zM0 8h4v1H0zM6 8h1v1H6zM8 8h1v1H8zM10 8h3v1H10zM18 8h2v1H18zM21 8h1v1H21zM24 8h3v1H24zM28,8 h1v1H28zM1 9h3v1H1zM7 9h2v1H7zM10 9h1v1H10zM12 9h1v1H12zM14 9h1v1H14zM16 9h2v1H16zM20 9h1v1H20zM22 9h3v1H22zM27,9 h2v1H27zM1 10h1v1H1zM3 10h1v1H3zM6 10h2v1H6zM9 10h5v1H9zM16 10h2v1H16zM22 10h1v1H22zM25 10h1v1H25zM27 10h1v1H27zM1 11h3v1H1zM5 11h1v1H5zM8 11h3v1H8zM13 11h1v1H13zM15 11h1v1H15zM19 11h1v1H19zM21 11h3v1H21zM28,11 h1v1H28zM1 12h1v1H1zM6 12h5v1H6zM12 12h2v1H12zM15 12h3v1H15zM19 12h3v1H19zM23 12h2v1H23zM26 12h1v1H26zM4 13h1v1H4zM7 13h1v1H7zM9 13h1v1H9zM11 13h2v1H11zM16 13h1v1H16zM21 13h2v1H21zM25 13h1v1H25zM27,13 h2v1H27zM1 14h2v1H1zM4 14h1v1H4zM6 14h1v1H6zM8 14h2v1H8zM11 14h1v1H11zM13 14h2v1H13zM18 14h2v1H18zM22 14h3v1H22zM26,14 h3v1H26zM0 15h2v1H0zM4 15h2v1H4zM7 15h3v1H7zM11 15h1v1H11zM15 15h2v1H15zM19 15h1v1H19zM21 15h2v1H21zM24 15h2v1H24zM0 16h2v1H0zM5 16h5v1H5zM12 16h1v1H12zM16 16h4v1H16zM21 16h1v1H21zM28,16 h1v1H28zM2 17h4v1H2zM7 17h2v1H7zM10 17h1v1H10zM13 17h1v1H13zM18 17h1v1H18zM20 17h1v1H20zM22 17h2v1H22zM25 17h2v1H25zM0 18h1v1H0zM2 18h1v1H2zM5 18h3v1H5zM9 18h2v1H9zM15 18h2v1H15zM20 18h1v1H20zM23 18h3v1H23zM2 19h2v1H2zM5 19h1v1H5zM7 19h2v1H7zM10 19h2v1H10zM16 19h4v1H16zM23 19h4v1H23zM28,19 h1v1H28zM1 20h1v1H1zM4 20h1v1H4zM6 20h1v1H6zM8 20h2v1H8zM14 20h1v1H14zM17 20h10v1H17zM28,20 h1v1H28zM8 21h1v1H8zM13 21h2v1H13zM19 21h2v1H19zM24,21 h5v1H24zM0 22h7v1H0zM9 22h2v1H9zM14 22h1v1H14zM16 22h2v1H16zM19 22h2v1H19zM22 22h1v1H22zM24 22h1v1H24zM27 22h1v1H27zM0 23h1v1H0zM6 23h1v1H6zM9 23h7v1H9zM20 23h1v1H20zM24 23h2v1H24zM0 24h1v1H0zM2 24h3v1H2zM6 24h1v1H6zM9 24h3v1H9zM15 24h1v1H15zM17 24h2v1H17zM20,24 h9v1H20zM0 25h1v1H0zM2 25h3v1H2zM6 25h1v1H6zM8 25h2v1H8zM11 25h1v1H11zM13 25h2v1H13zM16 25h5v1H16zM24 25h1v1H24zM28,25 h1v1H28zM0 26h1v1H0zM2 26h3v1H2zM6 26h1v1H6zM8 26h3v1H8zM12 26h1v1H12zM14 26h1v1H14zM16 26h2v1H16zM19 26h1v1H19zM21 26h1v1H21zM25 26h2v1H25zM28,26 h1v1H28zM0 27h1v1H0zM6 27h1v1H6zM8 27h1v1H8zM12 27h2v1H12zM19 27h1v1H19zM21 27h1v1H21zM23 27h2v1H23zM27 27h1v1H27zM0 28h7v1H0zM8 28h1v1H8zM11 28h1v1H11zM18 28h4v1H18zM23 28h1v1H23zM25 28h1v1H25zM27 28h1v1H27z">
							</path>
						</svg>
					</div>
				</div>
			</div>
	        <a href="https://github.com/Charset404/FLBOT-free-litecoin" class="donate">Source code: Charset404</a>
        </div>
	`;

    htmlTemp = inserthtml + htmlTemp; // Concatenates the strings by putting the new html before the htmlTemp

    // Put the new string (that's the html) on the DOM
    getHtml.innerHTML = htmlTemp;
} loadHTML();

function loadCSS() {
    /**
     * Utility function to add CSS in multiple passes.
     * @param {string} styleString
     */
    function addStyle(styleString) {
        const style = document.createElement("style");
        style.textContent = styleString;
        document.head.append(style);
    }

    addStyle(`
		#buttons {
		  position: relative;
		  display: block;
		  width: 300px;
		  background-color: #161717;
		  margin: 20px auto 10px;
		  padding: 30px 0px;
		}

		#buttons h1 {
		  font-size: 25px;
		  text-align: center;
		  color: #007bff;
		}

		#buttons > #subtext {
		  font-size: 15px;
		  color: #cdcdcd;
		}

		#bstart, #bstop {
		  padding: 10px;
		  text-align: center;
		  font-size: 15px;
		  background-color: #1e7e34;
		  color: #fff;
		  border: none;
		}

		#bstop {
		  margin-left: 5px;
		  background-color: #bf0e0e;
		}

		#bstart:hover, #bstop:hover {
		  cursor: pointer;
		  border-bottom: 3px solid #ced4da;
		}


		/*CSS Infos*/
		#infos {
		  font-size: 14px;
		  color: #cdcdcd;
		  margin-top: 20px;
		}

		#infos > p {
		  margin-top: 20px;
		}

		/* css infos > p*/
		#ltcmoney {
		  color: #D6FF5C;
		}

		#ltcwins {
		  color: green;
		}

		#ltcloss {
		  color: red;
		}

		/*Donate*/
		#donate {
			width: 220px;
			color: #cdcdcd;
			margin-top: 25px;
		}

		.donate {
			color: #cdcdcd;
		}

		.donate:hover {
			color: #c51f1f;
		}

		#donate:hover {
		  cursor: pointer;
		}

		.blockchain {
			display: none;
		}
		/*Config*/
		.conf {
			height: 235px !important;
			position: absolute;
			background-color: #161717;
			width: 100%;
			height: 218px;
			display: none;
			margin-top: 15px;
		}

		.conf h1 {
			font-size: 20px !important;
		}

		#config {
			margin: 0 auto;
			color: #cdcdcd;
		}

		#config td {
			padding-left: 10px;
		}

		#config, td input  {
			background-color: #161717;
			text-align: center;
			font-size: 13px;
			margin-top: 5px;
			margin-bottom: 5px;
		}

		#postltc, #losswin, #lowhigh, #naposta {
			width: 114px;
		}

		#postltc  {
			color: #D6FF5C;
			border: 1px #d6ff5c solid;
		}

		#losswin {
			color: #007bff;
			border: 1px #007bff solid;
		}

		#lowhigh {
			color: #1e7e34;
			border: 1px #1e7e34 solid;
		}

		#naposta {
			color: #dc3545;
			border: 1px #dc3545 solid;
		}

		#closex {
			display: none;
			width: 30px;
			position: absolute;
			right: 15px;
			top: 15px;
			background-color: #333333;
			border: none;
			color: #d8d7d7;
		}

		#closex:hover {
			background-color: #fb1e33;
			color: #fff;
		}

		#bot-msg {
			background-color: #004086;
			border: none;
			font-size: 12px;
			color: #fff;
			cursor: pointer;
			margin-top: 10px;
		}

	`);
} loadCSS();

// HTML Global Variables
var bstop = document.getElementById("bstop"); // Stop Button
var popup = document.querySelector(".donate"); // Donate Button
var bstart = document.getElementById("bstart"); // Start Button
var flMoney = document.getElementById("money"); // Free-litecoin ltc value
var showStats = document.getElementById("getstats"); // getStats
var getBotMoney = document.getElementById("ltcmoney"); // Bot ltc value
var configClose = document.getElementById("closex"); // Close button
var botMsg = document.getElementById("bot-msg"); // Config button
var confConf = document.querySelector(".conf"); // Config
var donateBtc = document.getElementById("donate"); // Donate img

bstart.addEventListener("click", function() {
	updateLtc();
	updateLossWin();
    botInterval = setInterval(myLoop, 3000);
    showStats.innerText = messages.startbot;
});

bstop.addEventListener("click", function () {
	let getColor = document.getElementById("winlose");
	stopAll();
    loadinput();
	getColor.innerText = "";
    showStats.innerText = messages.stopbot;
});

configClose.addEventListener("click", function() {
	verify();
	loadinput;
});

botMsg.addEventListener("click", function() {
	configClose.style.display = "block";
	confConf.style.display = "block";
});

donateBtc.addEventListener("click", function () {
	var adressWallet = document.querySelector(".blockchain"); // Adress
	if (adressWallet.style.display === "none")
	{
		adressWallet.style.display = "block";
	} else {
		adressWallet.style.display = "none";
	}
});


function updateLtc() {
    update = setInterval(function() {
        getBotMoney.innerText = flMoney.innerText; // Free-litecoin money show in FLBOT
    }, 500);
} getBotMoney.innerText = flMoney.innerText; // Update on load

function updateLossWin() {
	lssWn = setInterval(function() {
		let getColor = document.getElementById("winlose");
		var loss = document.getElementById("loss"); // Loss cout
		var wins = document.getElementById("wins"); // Win cout

		if (getColor.style.color === "red" && getColor.innerText !== "") {
			loss.innerText++;
		} else if (getColor.style.color === "green" && getColor.innerText !== "") {
			wins.innerText++;
		} else if (getColor.innerText === "") {
			return true
		}

	}, 3000);
}

function stopAll() {
	botBreak = 0;
	clearInterval(botInterval);
	clearInterval(update);
	clearInterval(lssWn);
}

popup.addEventListener("click", function () {
    alert(messages.helpme);
});

// Security Config Verify
var messages = {
	loadedsetting: "Start, configuration loaded!",
	startbot: "Farming...",
	stopbot: "Stop!",
	endingbot: "Finished!",
	error:"Security check failed, please check the settings fields.",
    sucess:"Configuration successfully validated!",
	helpme: "Contribute to our Github repository, or make a symbolic donation to help us with future projects and free updates.\n\n BTC: 168tx42M6zPEL9VA9ee3Yx7SmmYLMc9ajx\n LTC(min 0.001): LXsadeqAXBE7CzbSebxcgBfsmz8WBFGznz"
};

function verify(userXXXX) {
	var configBet = document.getElementById("postltc");
	var configLossWin = document.getElementById("losswin");
	var configLowHigh = document.getElementById("lowhigh");
	var configNuAposta = document.getElementById("naposta");

	userXXXX = true;

	if (configBet.value < 0.00000001 || configBet.value > 10|| configLossWin.value < 1) {
    	alert(messages.error);
		userXXXX = false;
        return false;
    }

    if (configLowHigh.value < 0 || configLowHigh.value > 1 || configNuAposta.value < 1) {
    	alert(messages.error);
		userXXXX = false;
        return false;
    }

	if (configBet.value == "" || configLossWin.value == "" || configLossWin.value > 95) {
    	alert(messages.error);
		userXXXX = false;
        return false;
    }

    if (configLowHigh.value == "" || configNuAposta.value == "") {
    	alert(messages.error);
		userXXXX = false;
        return false;
    }

	if (userXXXX == true) {
		alert(messages.sucess);
		confConf.style.display = "none";
		showStats.innerText = messages.loadedsetting;
		configClose.style.display = "none";

		savevalue = configBet.value;
		winChance = configLossWin.value;
		setLowHigh = configLowHigh.value;
		nunberOfRows = configNuAposta.value;
		loadinput();
		saveinput();
	}
}