// ==UserScript==
// @name        CoinBrawlsQuesting
// @description Patatoes.
// @namespace   HPrivakosScripts
// @include     https://www.coinbrawl.com/*
// @incluse     *://sh.st/*
// @version     1.18
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17581/CoinBrawlsQuesting.user.js
// @updateURL https://update.greasyfork.org/scripts/17581/CoinBrawlsQuesting.meta.js
// ==/UserScript==

/*
 *
If redirection, resend to coinbrawl
 * 
*/

if(location.host == "sh.st"){
	window.location = "https://www.coinbrawl.com";
}




document.getElementsByTagName('head')[0].innerHTML += ' \
<style> \
.list-quests .reroll-quest { \
	top: 0; \
	right: 15px; \
	font-size: 750%; \
} \
</style>'

/*
 *
Remove useless alert and annoying ads
 * 
*/


setTimeout(function(){if(document.body.textContent == "Retry later\n"){setTimeout(function(){location.reload()}, 2000)}}, 1000);
setInterval(remove, 100);

function remove(){
	if(document.documentURI == "https://www.coinbrawl.com/quests"){
		if(document.getElementsByClassName("alert alert-success").length>=1){document.getElementsByClassName("alert alert-success")[0].outerHTML = "";}
	}
	document.body.childNodes[3].childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[1].style.height = "150px";
	document.getElementsByClassName("text-center")[2].innerHTML = "";
}

console.log(location.pathname);
if(location.pathname.substr(1) == "quests"){
	
	/*
	 *
	Auto Collect and Auto Reroll (Not available for the moment)
	 *
	*/
	
	var Ccollect = getCookie("Cautocollect");
	var Creroll = getCookie("Creroll");
	var Cmore = getCookie("Cmore");
	
	if(Ccollect == "true"){autoCollect()}
	if(Creroll == "true"){autoReroll()}
	if(Cmore == "true"){autoMore()}
	
	setButtons();
	
	function setButtons(){
		var buttons = document.createElement("div");
		buttons.innerHTML = '<div class="row">\
			<div class="col-sm-12" id=>\
			<button id="ECollect" class="btn btn-danger col-sm-2" style="height: 50px" type="button">Enable collect</button>\
			<button id="DCollect" class="btn btn-danger col-sm-2 col-sm-offset-1" style="height: 50px" type="button">Disable collect</button>\
			<button id="EReroll" class="btn btn-danger col-sm-2 col-sm-offset-2" style="height: 50px" type="button">Enable reroll</button>\
			<button id="DReroll" class="btn btn-danger col-sm-2 col-sm-offset-1" style="height: 50px" type="button">Disable reroll</button>\
			<button id="EMore" class="btn btn-primary col-sm-2" style="height: 50px" type="button">Enable more quests</button>\
			<button id="DMore" class="btn btn-primary col-sm-2 col-sm-offset-1" style="height: 50px" type="button">Disable more quests</button>\
			</div>\
			</div>';
		pageNodes = document.body.childNodes[3].childNodes[1].childNodes[1].childNodes[1].childNodes[1];
		pageNodes.insertBefore(buttons, pageNodes.childNodes[8]);
		document.getElementById("ECollect").addEventListener("click", function(){clickButton("ECollect")}, false);
		document.getElementById("DCollect").addEventListener("click", function(){clickButton("DCollect")}, false);
		document.getElementById("EReroll").addEventListener("click", function(){clickButton("EReroll")}, false);
		document.getElementById("DReroll").addEventListener("click", function(){clickButton("DReroll")}, false);
		if(Ccollect == "true"){document.getElementById("ECollect").className = "btn btn-success col-sm-2";}
		if(Ccollect == "false"){document.getElementById("DCollect").className = "btn btn-success col-sm-2 col-sm-offset-1"}
		
		if(Creroll == "true"){document.getElementById("EReroll").className = "btn btn-success col-sm-2 col-sm-offset-2"}
		if(Creroll == "false"){document.getElementById("DReroll").className = "btn btn-success col-sm-2 col-sm-offset-1"}
		
		document.getElementById("ECollect").textContent = "Enable collect (" + document.getElementsByClassName("btn btn-block btn-success btn-lg").length + ")";
		document.getElementById("DCollect").textContent = "Disable collect (" + document.getElementsByClassName("btn btn-block btn-success btn-lg").length + ")";
	}
	
	function clickButton(buttonId){
		var trueorfalse;
		
		var date = new Date();
		date = date + (365*(24*60*60*1000)); // 365 days * numbers of milliseconds per days
		date = date.toUTCString;
		
		if(buttonId == "ECollect"){
			trueorfalse = true;
			document.cookie = "Cautocollect="+trueorfalse+"; expires="+date;
			location.reload();
		}
		if(buttonId == "DCollect"){
			trueorfalse = false;
			document.cookie = "Cautocollect="+trueorfalse+"; expires="+date;
			location.reload();
		}
		if(buttonId == "EReroll"){
			trueorfalse = true;
			document.cookie = "Creroll="+trueorfalse+"; expires="+date;
			location.reload();
		}
		if(buttonId == "DReroll"){
			trueorfalse = false;
			document.cookie = "Creroll="+trueorfalse+"; expires="+date;
			location.reload();
		}
		if(buttonId == "EMore"){
			trueorfalse = true;
			document.cookie = "Cmore="+trueorfalse+"; expires="+date;
			location.reload();
		}
		if(buttonId == "DMore"){
			trueorfalse = false;
			document.cookie = "Cmore="+trueorfalse+"; expires="+date;
			location.reload();
		}
	}
	
	function autoCollect(){
		var claimButtons = document.getElementsByClassName("btn btn-block btn-success btn-lg");
		console.log("Claim remaining -> " + claimButtons.length);
		if(claimButtons.length != 0){document.getElementsByClassName("btn btn-block btn-success btn-lg")[0].click()}
	}
	
	function autoReroll(){
		var rerollButtons = document.getElementsByClassName("fa fa-refresh");
		var nameQuests = document.getElementsByClassName("list-group-item-heading");
		if(rerollButtons.length != 0){
			for(m=0;m<nameQuests.length;m++){
				titleQuests = nameQuests[m].textContent;
				if(titleQuests != "Steal 1000 Gold"){
					rerollButtons[m].click();
					return false;
				}
			}
		}
	}
	
	/*
	 * 
	Get more quests
	 * 
	*/
	
	buttonsQuest();

	function buttonsQuest(){
		document.getElementById("EMore").addEventListener("click", function(){clickButton("EMore")}, false);
		document.getElementById("DMore").addEventListener("click", function(){clickButton("DMore")}, false);
		if(Cmore == "true"){document.getElementById("EMore").className = "btn btn-info col-sm-2"}
		if(Cmore == "false"){document.getElementById("DMore").className = "btn btn-info col-sm-2 col-sm-offset-1"}
	}
	
	function autoMore(){
		var rerollButtons = document.getElementsByClassName("fa fa-refresh");
		if(rerollButtons.length != 0){
			for(i=0;i<100;i++){
				document.getElementsByClassName("fa fa-refresh")[0].click();
			}
		}
	}
}

if(location.pathname == "/"){
	
	/*
	 * 
	Auto attack Crystal Dragon
	 * 
	*/
	
	setInterval(autoAttackDragon, 500);
	
	function autoAttackDragon(){
		if(document.getElementsByClassName("value")[4].textContent.replace(/ /g, "").split("/")[0] != "0"){
			document.getElementsByClassName("btn btn-xs btn-primary")[10].click();
		}
	}
	
	/*
	 * 
	Auto attack Players
	 * 
	*/
	
	setTimeout(autoAttackPlayers, 2000);
	
	function autoAttackPlayers(){
		if(document.getElementsByClassName("value")[4].textContent.replace(/ /g, "").split("/")[0] == "0"){
			if(document.getElementsByClassName("value")[5].textContent.replace(/ /g, "").split("/")[0] != "0"){
				var fighttable = document.getElementsByClassName("table table-bordered fight-table")[0].childNodes[1].childNodes;
				for(x = 0, Nodes = []; x < fighttable.length; x++){
					Nodes[x] = fighttable[x].childNodes[2].textContent.replace("%", "") * 1;
				}
				var maxOfNodes = Math.max(...Nodes);
				for(z in Nodes){
					if(maxOfNodes == Nodes[z]){
						fighttable[z].childNodes[4].childNodes[0].click();
						setTimeout(autoAttackPlayers, 500)
						return true;
					}
				}
			}
		}
		else{setTimeout(autoAttackPlayers, 500); return false;}
	}
	
	
	/*
	 * 
	Auto Bank
	 * 
	*/
	
	setTimeout(autoBank, 5000);
	
	function autoBank(){
		xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", "https://www.coinbrawl.com/bank/deposit_max", true);
		xmlhttp.send();
		setTimeout(autoBank, 5000);
	}
}

if(location.pathname == "/character"){
	
	/*
	 * 
	Get more Stamia
	 * 
	*/
	
	setTimeout(getStamina, 1000, 0);
	
	function getStamina(action){
		if(action == 0){
			if(document.getElementsByClassName("value")[4].textContent.replace(/ /g, "").split("/")[0] == "0" && document.getElementsByClassName("text-right")[2].childNodes[3].className == "btn btn-xs btn-success"){
				document.getElementsByClassName("btn btn-xs btn-success")[1].click();
				setTimeout(getStamina, 1000, 1);
			}
		}
		if(action == 1){
			document.getElementsByClassName("btn btn-primary")[0].click();
		}
	}
}

/*
 * 
ReCaptcha Alerter
 * 
*/

if(location.pathname == "/recaptcha" && document.body.textContent != "Retry later\n"){
	var audioPlayer = new Audio("http://88.182.41.26/scripts/captcha.mp3");
	audioPlayer.play();
}

/*
 * 
Items page (salvage)
 * 
*/

//Coming soon



/*
 * 
Get cookies
 * 
*/

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1);
		if (c.indexOf(name) == 0){
			return c.substring(name.length,c.length);
		}
	}
	return "";
}