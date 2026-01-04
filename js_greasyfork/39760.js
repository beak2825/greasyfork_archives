// ==UserScript==
// @name         Roblox Advanced Helper
// @namespace    http://iomods.weebly.com/
// @version      1.3
// @description  Roblox Advanced Settings + Background Colors [BETA] + Easy Game Joining By ID + Advanced Ad Removing
// @author       SnowLord7
// @match        https://www.roblox.com/*
// @grant        (C) SnowLord7 2018
// @downloadURL https://update.greasyfork.org/scripts/39760/Roblox%20Advanced%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/39760/Roblox%20Advanced%20Helper.meta.js
// ==/UserScript==

var customHTML = '';
customHTML += '<div class="customSettings">';
customHTML += '<div class="customText">';
customHTML += '<h3>Custom Settings</h3><br>';
customHTML += '<p>Background <input style="color: black;" id="customBackgroundInput" placeholder=""></input></p>';
customHTML += '<p>Join Game By ID <input style="color: black;" id="customJoinGameInput" value="301549746" placeholder="301549746" type="number"> <button style="color: black; border: 1px solid grey; border-radius: 3px; heigth: 5%;" id="customJoinGameButton">Go</button></p>';
customHTML += '<p>Remove Uncaught Ads <button id="customAdKill" style="color: black; border-radius: 3px; border: 1px solid grey; heigth: 5%;">KILL ADS</button></p>';
customHTML += '<p id="customName"></p>';
customHTML += '</div></div>';
customHTML += '<style>';
customHTML += '.customSettings{border:1px solid rgba(46,48,54,.6);border-radius:3px;background-color:#004977;position:relative;color:#fff;width:370px;height:190px;top:-180px;line-height:0;padding:0;font-size:15px;transition:.5s}.customSettings:hover{top:-20px}.customText{margin-left:10px}';
customHTML += '</style>';
document.getElementsByClassName("xsmall age-bracket-label")[0].innerHTML = customHTML;
document.getElementById("customAdKill").addEventListener("click", adKill, false);
document.getElementById("customJoinGameButton").addEventListener("click", joinGame, false);
document.getElementById("customBackgroundInput").value = document.body.style.backgroundColor;

function customBackground() {
    try {
        document.body.style.backgroundColor = document.getElementById("customBackgroundInput").value;
        document.getElementsByClassName("content")[0].style.backgroundColor = document.getElementById("customBackgroundInput").value;
    } catch(e) {}
    setTimeout(customBackground, 100);
}

function joinGame() {
    var customID = document.getElementById("customJoinGameInput").value;
    Roblox.GameLauncher.joinMultiplayerGame(customID);
}

function adKill() {
	try {
		document.getElementById("Skyscraper-Abp-Left").remove();
		//console.log("Removed an Ad!");
	} catch(e) {}
	try {
		document.getElementById("Skyscraper-Abp-Right").remove();
		//console.log("Removed an Ad!");
	} catch(e) {}
	try {
		document.getElementById("Leaderboard-Abp").remove();
		//console.log("Removed an Ad!");
	} catch(e) {}
	try {
		document.getElementById("AdvertisingLeaderboard").remove();
		//console.log("Removed an Ad!");
	} catch(e) {}
	try {
		document.getElementById("Ads_WideSkyscraper").remove();
		//console.log("Removed an Ad!");
	} catch(e) {}
	try {
		document.getElementById("Leaderboard-Abp").remove();
		//console.log("Removed an Ad!");
	} catch(e) {}
	try {
		for (i = 0; i < 3; i++) {
			document.getElementsByClassName("ads-container")[0].remove();
			document.getElementsByClassName("ads-container")[i].remove();
		}
		//console.log("Removed an Ad!");
	} catch(e) {}
	console.log("Attempted to remove ads.");
}

document.getElementById("customName").innerHTML = Roblox.CurrentUser.name;
customBackground();
adKill();