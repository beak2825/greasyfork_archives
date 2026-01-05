// ==UserScript==
// @name        CoinBrawlsTarget
// @description Patatoes.
// @namespace   HPrivakosScripts
// @include     https://www.coinbrawl.com/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18714/CoinBrawlsTarget.user.js
// @updateURL https://update.greasyfork.org/scripts/18714/CoinBrawlsTarget.meta.js
// ==/UserScript==

var target = "Unicorn";


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

if(location.pathname == "/"){
	/*
	 * 
	Auto attack Players
	 * 
	*/
	
	setTimeout(autoAttackPlayers, 2000)
	setTimeout(function(){location.reload()}, 5000)
	
	function autoAttackPlayers(){
		
		for(i=0; i<5; i++){
			var username = document.getElementsByClassName("user-info")[i].childNodes[0].childNodes[0].textContent;
			console.log(username);
			if(username == target){
				document.getElementsByClassName("btn btn-xs btn-primary")[i].click();
			}
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