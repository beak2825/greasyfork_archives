// ==UserScript==
// @name        ChopcoinAds
// @namespace   HPrivakosScripts
// @description Autoreload ads on chopcoin
// @include     http://chopcoin.io/
// @version     1
// @grant       none
// @author      HPrivakos
// @downloadURL https://update.greasyfork.org/scripts/17100/ChopcoinAds.user.js
// @updateURL https://update.greasyfork.org/scripts/17100/ChopcoinAds.meta.js
// ==/UserScript==


timeAds();

function timeAds() {
  if(document)
	var newDiv = document.createElement("div");
	newDiv.id = "timeAdsChoose";
	newDiv.innerHTML = '<h4 id="adsTitle" value=""></h4>\
		<button type="button" id="ads0" class="btn btn-default" lang="en" value="Disable auto-refresh">Disable auto-refresh</button>\
		<button type="button" id="ads1" class="btn btn-default" lang="en" value="Refreshing rate -> 30s">Refreshing rate -> 30s</button>\
		<button type="button" id="ads2" class="btn btn-default" lang="en" value="Refreshing rate -> 60s">Refreshing rate -> 60s</button>\
    <button type="button" id="refreshButton" class="btn btn-default" lang="en" value="Click here for refresh" style="display:none;">Click here for refresh the page</button>';
	document.getElementById('content').appendChild(newDiv);	
	document.getElementById('adsTitle').style = 'background-color: #0a86f8;color:white;padding:5px;text-transform:uppercase;font-weight:300!important;-webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);-moz-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);';
	document.getElementById('adsTitle').textContent = 'Set the refresh time of CoinAds';
  document.getElementById('adsTitle').value = document.getElementById('adsTitle').textContent;
	
	document.getElementById("ads0").addEventListener("click", function(){setTimeAds(0);}, false);
	document.getElementById("ads1").addEventListener("click", function(){setTimeAds(1);}, false);
	document.getElementById("ads2").addEventListener("click", function(){setTimeAds(2);}, false);
  document.getElementById("refreshButton").addEventListener("click", function(){reloadPage();}, false);
	
  var selected = getCookie("refreshAds");
	for(a=0;a<3;a++){
	var actualElement = document.getElementById("ads"+a);
	var ifSelected = actualElement.value + " (Selected!)";
	actualElement.style = 'width:33%;';
	if(a==selected){actualElement.textContent=ifSelected;}
	}
}

var selected = getCookie("refreshAds");
if(selected != 0) setTimeout(function(){refreshAds(selected)}, 30*selected*1000);

function setTimeAds(refresh){
	var setTimeAdsTimeout;
	var date = new Date();
	date = date + (365*(24*60*60*1000)); // 365 days * numbers of milliseconds per days
	date = date.toUTCString;
	try{
	document.cookie = "refreshAds="+refresh+"; expires="+date;
	}catch(err){console.log(err);}
	var selected = getCookie("refreshAds");
	for(a=0;a<3;a++){
   document.getElementById("ads"+a).style.display = "none";
	}
  var h4 = 	document.getElementById('adsTitle');
  h4.textContent = h4.value + " - Need refresh to be validate";
  document.getElementById("refreshButton").style.width = "100%";
  document.getElementById("refreshButton").style.display = "block";
}

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

function refreshAds(refreshTime){
  try{
  var date = new Date();
  var hours = "0" + date.getUTCHours();
	var minutes = "0" + date.getUTCMinutes();
  var seconds = "0" + date.getUTCSeconds();
  console.log("Ads refresh! -> " + hours.substr(-2) + ":" + minutes.substr(-2) + ":" + seconds.substr(-2));
	var refreshTimeTimeout;
	var coinads = document.getElementById('coinadiframe');
	coinads.src = coinads.src;
	var toSeconds = 1000;
	if (refreshTime == "0"){console.log("Bouuuh =(");}
	if (refreshTime == "1"){refreshTimeTimeout = setTimeout(function(){refreshAds(refreshTime);console.log("Refresh from refreshAds");}, 30*toSeconds);}
	if (refreshTime == "2"){refreshTimeTimeout = setTimeout(function(){refreshAds(refreshTime);console.log("Refresh from refreshAds");}, 60*toSeconds);}
  }catch(err){console.log(err);}
}

function reloadPage(){
  var refreshButton = document.getElementById('refreshButton').value;
  if(chopcoin.game.playing() == true){    
    document.getElementById('refreshButton').textContent = refreshButton + " - Cannont refresh now, you are playing.";
  }
  else {location.reload();document.getElementById('refreshButton').textContent = refreshButton + " - Refresh!";}
}