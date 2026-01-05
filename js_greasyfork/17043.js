// ==UserScript==
// @name		CC Tools (HPrivakos's version)
// @namespace	HPrivakosScripts
// @description	Somes tools for add informations in ChopCoin
// @author		HPrivakos (and Unregistered)
// @include		http://chopcoin.io/*
// @version		1.16
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/17043/CC%20Tools%20%28HPrivakos%27s%20version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/17043/CC%20Tools%20%28HPrivakos%27s%20version%29.meta.js
// ==/UserScript==

document.getElementById('chatshowhide').style.width = "100%";

var timer = 0;
var timerFloat = 0;
var xCoord = 0;
var yCoord = 0;
var nodeCount = 0;
var popped = false;
var frequency = 5; // how many times per second to update title
var id = 0;
var ign = "nothing";
var precision = 100; // number to divide the board by, since its 12,000 x 12,000, the range will be 0-12
var faucetJSON = { value: '' };
var lowrollerJSON = { value: '' };
var teamJSON = { value: '' };
var accountHTML = { value: '' };

// All modes and UTC time
var modes = {"text":[{"AdditionalText":"","MaxCells":"16","MaxVirus":"50","Name":"Normal","RecombineTime":"20","ShootsBomb":"2","Speed":"Normal"},{"AdditionalText":"","MaxCells":"40","MaxVirus":"50","Name":"Split","RecombineTime":"10","ShootsBomb":"1","Speed":"Normal"},{"AdditionalText":"","MaxCells":"16","MaxVirus":"120","Name":"Bomb","RecombineTime":"20","ShootsBomb":"2","Speed":"Normal"},{"AdditionalText":"","MaxCells":"16","MaxVirus":"50","Name":"Speed","RecombineTime":"20","ShootsBomb":"2","Speed":"Fast"},{"AdditionalText":"Faucet is closed for the moment.","Name":"FaucetStop"}],"time":[{"Name":"Split","Hours":"0"},{"Name":"Normal","Hours":"159"},{"Name":"Speed","Hours":"401"},{"Name":"Bomb","Hours":"603"},{"Name":"Split","Hours":"805"},{"Name":"Normal","Hours":"1007"},{"Name":"Speed","Hours":"1209"},{"Name":"Bomb","Hours":"1411"},{"Name":"Split","Hours":"1613"},{"Name":"Normal","Hours":"1815"},{"Name":"FaucetStop","Hours":"2017"},{"Name":"Bomb","Hours":"2200"},{"Name":"Inifinite","Hours":"9999"}]};


window.addEventListener("keydown", dealWithKeyboard, false);


setTimeout( function(){ setInterval(function(){ajax("http://158.69.120.11:5556/", faucetJSON);}, 2000)} , 1000); // delay 1/2s, check every 2s
setTimeout( function(){ setInterval(function(){ajax("http://158.69.120.11:7891/", lowrollerJSON);}, 4000)} , 1000); // delay 1s, check every 4s
setTimeout( function(){ setInterval(function(){ajax("http://158.69.120.11:7881/", teamJSON);}, 4000)} , 1000); // delay 1s, check every 4s

document.getElementById('chatshowhide').style.textAlign = 'right';
document.getElementById('chatshowhide').innerHTML = '<span style="float:left;color:white;" id="extras1"></span>\
<span id="timer1" style="color:#447;"></span>&nbsp;|&nbsp;\
<span id="nodes1" style="color:#474;"></span>&nbsp;|&nbsp;\
<span id="faPlayers1" style="color:#774;"></span>&nbsp;/&nbsp;\
<span id="lrPlayers1" style="color:#774;"></span>&nbsp;|&nbsp;\
<span id="trPlayers1" style="color:#774;"></span>&nbsp;|&nbsp;\
<span id="coordx1" style="color:#744;"></span>&nbsp;-&nbsp;\
<span id="coordy1" style="color:#744;"></span>&nbsp;&nbsp;\
<span style="float:left;">\
<span id="additionalText" style="color:#058CA1;float:left;"></span>\
<span id="actualMode" style="color:#058CA1;float:left;"></span>\
<span id="separatorMode0" style="float:left;">&nbsp|&nbspMax&nbspcells:&nbsp</span>\
<span id="maxCells" style="color:#058CA1;float:left;"></span>\
<span id="separatorMode1" style="float:left;">&nbsp|&nbspRecombine:&nbsp</span>\
<span id="recombineTime" style="color:#058CA1;float:left;"></span>\
<span id="separatorMode2" style="float:left;color:#058CA1;">s</span>\
<span id="separatorMode3" style="float:left;">&nbsp|&nbspSpeed:&nbsp</span>\
<span id="speed" style="color:#058CA1;float:left;"></span>\
</span>';
+ document.getElementById('chatshowhide').innerHTML;

// visible when chatbox is up
document.getElementById('chatlink').style.textAlign = 'left';
document.getElementById('chatlink').style.fontSize = '16px';
document.getElementById('chatlink').innerHTML =	'<a href="/chat/"><span lang="en" style="float:right;font-size:12px;">Chat commands / User groups / Rules</span></a>\
<span style="float:right;color:white;" id="extras2" ></span>\
<span id="timer2" style="color:#447;"></span>&nbsp;|&nbsp;\
<span id="nodes2" style="color:#474;"></span>&nbsp;|&nbsp;\
<span id="faPlayers2" style="color:#774;"></span>&nbsp;&nbsp;\
<span id="lrPlayers2" style="color:#774;"></span>&nbsp;|&nbsp;\
<span id="trPlayers2" style="color:#774;"></span>&nbsp;|&nbsp;\
<span id="coordx2" style="color:#744;"></span>&nbsp;&nbsp;\
<span id="coordy2" style="color:#744;"></span>&nbsp;&nbsp;';

faucetInformations();

setInterval(function(){setTitle();}, 1000/frequency);
function setTitle() {
    getCoords();
    getNodeCount();
    if (popped) {
        if(chopcoin.game.server_id == "faucet") timerFloat = 20000;
        else timerFloat = 30000;
        popped = false; // resent popped
    }
    // depreciate by 1 second
    if (timerFloat != 0) {
        timerFloat -= 1000/frequency;
        timer = Math.round(timerFloat/1000);
    }
    document.title = timer + " | " + nodeCount + " | " + xCoord + " : " + yCoord;
    setText();
}

function getCoords() {
    xCoord = Math.round(chopcoin.game.viewport.nx / precision);
    yCoord = Math.round(chopcoin.game.viewport.ny / precision);
}

function getNodeCount() {
    if (chopcoin.game.nodes.player.length > nodeCount+1) popped = true; // check if we were popped
    nodeCount = chopcoin.game.nodes.player.length;
}

function setText() {    
    document.getElementById('timer1').textContent = timer;
    document.getElementById('nodes1').textContent = nodeCount;
    document.getElementById('faPlayers1').textContent = parsePlayers(faucetJSON.value);
    document.getElementById('lrPlayers1').textContent = parsePlayers(lowrollerJSON.value);
    document.getElementById('trPlayers1').textContent = parsePlayers(teamJSON.value);
    document.getElementById('coordx1').textContent = xCoord;
    document.getElementById('coordy1').textContent = yCoord;

    document.getElementById('timer2').textContent = timer;
    document.getElementById('nodes2').textContent = nodeCount;
    document.getElementById('faPlayers2').textContent = parsePlayers(faucetJSON.value);
    document.getElementById('lrPlayers2').textContent = parsePlayers(lowrollerJSON.value);
    document.getElementById('trPlayers2').textContent = parsePlayers(teamJSON.value);
    document.getElementById('coordx2').textContent = xCoord;
    document.getElementById('coordy2').textContent = yCoord;
}

function dealWithKeyboard(e) {
	if (e.keyCode == "32" && document.activeElement.getAttribute('name') != "chat") { // now it wont start timer when typing in chat
		var date = new Date();
		var hours = "0" + date.getUTCHours();
		var minutes = "0" + date.getUTCMinutes();
		
		var dTotal = hours.substr(-2) + minutes.substr(-2);
		var dTotal = Math.round(dTotal).toString();
		
		if(chopcoin.game.server_id == "faucet") {
			if(dTotal > modes.time[3].Hours && dTotal < modes.time[4].Hours){timerFloat = 10000;console.log("Split -> 06:03");}
			if(dTotal > modes.time[7].Hours && dTotal < modes.time[8].Hours){timerFloat = 10000;console.log("Split -> 14:11");}
			if(dTotal > Math.round(modes.time[11].Hours)){timerFloat = 10000;console.log("Split -> 22:00");}
			else {timerFloat = 20000;}
		}
		else timerFloat = 30000;
	}
	else if (e.keyCode == "49") { getAccount(); }
}

function ajax(url, object) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() { if(xmlhttp.responseText) object.value = xmlhttp.responseText; };
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function parsePlayers(text) {
	try {
		var output;
		if(typeof InstallTrigger !== 'undefined') { // identify firefox since it doesnt want to parse json, dont ask why, idk
			output = text.substring(19, text.indexOf("max_players")-2);
			}
		else {
			responseObj = JSON.parse(text);
			output = responseObj.current_players;
		}
		return output;
	} catch(err) {return '0'};
}

function getAccount() {
    var xmlhttp = new XMLHttpRequest();
    var doc = document.implementation.createHTMLDocument('account');
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //doc.innerHTML = xmlhttp.responseText;
            doc.documentElement.innerHTML = xmlhttp.responseText;
            var balance = doc.getElementById('account_information').childNodes[1].childNodes[2].childNodes[3].textContent;
            var provisional = doc.getElementById('account_information').childNodes[1].childNodes[4].childNodes[3].textContent.split(' ', 1)[0] + " BTC";
            console.log(balance);
            
            document.getElementById('extras1').textContent = balance;
            document.getElementById('extras2').textContent = balance;
            document.getElementById('extras1').style.opacity = '1';
            document.getElementById('extras2').style.opacity = '1';
            
            setTimeout( function(){ document.getElementById('extras1').style.opacity = '0'; }, 2000); // 2s
            setTimeout( function(){ document.getElementById('extras2').style.opacity = '0'; }, 2000); // 2s
            
            setTimeout( function(){ document.getElementById('extras1').textContent = provisional; }, 4000);
            setTimeout( function(){ document.getElementById('extras2').textContent = provisional; }, 4000);
            
            setTimeout( function(){ document.getElementById('extras1').style.opacity = '1'; }, 4000); // 2s
            setTimeout( function(){ document.getElementById('extras2').style.opacity = '1'; }, 4000); // 2s
            
            setTimeout( function(){ document.getElementById('extras1').style.opacity = '0'; }, 6000); // 2s
            setTimeout( function(){ document.getElementById('extras2').style.opacity = '0'; }, 6000); // 2s
            
            setTimeout( function(){ document.getElementById('extras1').textContent = ''; }, 8000); 
            setTimeout( function(){ document.getElementById('extras2').textContent = ''; }, 8000); 
        }
    };
    xmlhttp.open("GET", "http://chopcoin.io/account/", true);
    xmlhttp.send();
}

function faucetInformations() {
	var date = new Date();
	var hours = "0" + date.getUTCHours();
	var minutes = "0" + date.getUTCMinutes();
	
	var dTotal = hours.substr(-2) + minutes.substr(-2);
	var dTotal = Math.round(dTotal);
	for(m=0;m<12;m++){
		if(dTotal > modes.time[m].Hours && dTotal < modes.time[m+1].Hours){
			for(i=0;i<4;i++){
				if(modes.time[m].Name == modes.text[i].Name){
					document.getElementById('actualMode').textContent = modes.text[i].Name;
					document.getElementById('additionalText').textContent = modes.text[i].AdditionalText;
					document.getElementById('maxCells').textContent = modes.text[i].MaxCells;
					document.getElementById('recombineTime').textContent = modes.text[i].RecombineTime;
					document.getElementById('speed').textContent = modes.text[i].Speed;
					for(sM=0;sM<3;sM++){document.getElementById('separatorMode'+sM.toString()).style.display = "block";}
				}
			}
			if(modes.time[m].Name == modes.text[4].Name){document.getElementById('additionalText').textContent = modes.text[4].AdditionalText; for(sM=0;sM<3;sM++){document.getElementById('separatorMode'+sM).style.display = "none";}}
	   }
	}
	setTimeout(function(){ faucetInformations(); }, 600000/frequency);
}