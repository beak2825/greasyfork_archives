// ==UserScript==
// @name         Nicehash Usd Payout.
// @namespace    http://http://blasttrader.herokuapp.com/
// @version      1.0.1
// @description  Adds the usd conversion of the payout.
// @author       Glitch
// @match        https://www.westhash.com/?p=miners&a=1&addr=*
// @match        https://www.nicehash.com/?p=miners&a=1&addr=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11102/Nicehash%20Usd%20Payout.user.js
// @updateURL https://update.greasyfork.org/scripts/11102/Nicehash%20Usd%20Payout.meta.js
// ==/UserScript==

function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

var btcusd = Number(httpGet("https://api.bitcoinaverage.com/ticker/global/USD/24h_avg"));

var pending = document.getElementsByTagName("strong")[3];
var pendingAmount = Number(pending.textContent);
pending.textContent = pendingAmount + ", $" + (btcusd * pendingAmount).toFixed(2);

var rows = document.getElementsByTagName("tbody")[3].children;
for (var i in rows) {
	if (typeof rows[i] === "object") {
		console.log(typeof rows[i]);
		var payout = rows[i].children[3];
		var earned = Number(payout.textContent);
		payout.textContent = payout.textContent + ', $' + (earned * btcusd).toFixed(2);
	}
}