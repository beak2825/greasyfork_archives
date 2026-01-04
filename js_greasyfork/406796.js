
// ==UserScript==
// @version      1.0.7
// @author       namtt007
// @match        https://stake.com
// @name         auto claim reload
// @namespace    namtt007
// @description  namtt007
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/406796/auto%20claim%20reload.user.js
// @updateURL https://update.greasyfork.org/scripts/406796/auto%20claim%20reload.meta.js
// ==/UserScript==
//1132x14 (screen script)

var xSetting = 952
var ySetting = 31
var xVip = 904
var yVip = 151
var xReload = 420
var yReload = 83
var xClaim = 573
var yClaim = 433

var xCloseClaimPopUp = 840
var yCloseClaimPopUp = 182

var xCasinoButton = 126
var yCasinoButton = 33

var count = 0

function click(x,y)
{
	console.log("click: " + x + "," +y);
	var ev = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true,
        'screenX': x,
        'screenY': y
    });

    var el = document.elementFromPoint(x, y);

    el.dispatchEvent(ev);
}

function delayTime(){
  var wait = 5000;
  return wait ;
}

function autoClaimReload()
{
	count++;
	if(count == 1){
		setTimeout(function(){
			click(xSetting, ySetting);
		}, delayTime());
	} else if(count == 10){
		setTimeout(function(){
			click(xVip, yVip);
		}, delayTime());
	} else if(count == 20){
		setTimeout(function(){
			click(xReload, yReload);
		}, delayTime());
	} else if(count == 30){
		setTimeout(function(){
			click(xClaim, yClaim);
		}, delayTime());
	} else if(count == 40){
		setTimeout(function(){
			click(xCloseClaimPopUp, yCloseClaimPopUp);
		}, delayTime());
	} else if(count == 50){
		setTimeout(function(){
			click(xCasinoButton, yCasinoButton);
			count = 0
		}, delayTime());
	}
	console.log("count: " + count);
}

//setInterval(autoClaimReload, 60000*11);
setInterval(autoClaimReload, 1000);