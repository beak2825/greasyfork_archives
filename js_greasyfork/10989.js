// ==UserScript==
// @name         Mining Rig Rental Cleanup
// @namespace    http://blasttrader.herokuapp.com/
// @version      1.2
// @description  Hides sidebar.
// @author       Jorge Boscan
// @match        https://www.miningrigrentals.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10989/Mining%20Rig%20Rental%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/10989/Mining%20Rig%20Rental%20Cleanup.meta.js
// ==/UserScript==

document.getElementById("main-nav").style.display = 'none';
document.getElementById("content").setAttribute("style","margin-left: 0 !important");
document.getElementsByClassName('foobar-close-button')[0].click();

function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

var btcusd = Number(httpGet("https://api.bitcoinaverage.com/ticker/global/USD/24h_avg"));

var balance = document.getElementById("balance_table");

if (balance !== null) {
	var rows = balance.getElementsByTagName("tbody")[0].children;

	for (var i in rows) {
		var row = rows[i];
		if (typeof row == "object") {
			var payout = Number(row.children[3].textContent);
			row.children[3].textContent = row.children[3].textContent + ", $" + (payout * btcusd).toFixed(2)
		}
	}
	var pendingTag = document.getElementsByTagName("tr")[1].children[1];
	var pendingValue = Number(pendingTag.textContent);
	pendingTag.textContent = pendingValue + ", $" + (pendingValue * btcusd).toFixed(2);
    var balanceTag = document.getElementsByTagName("tr")[2].children[1];
	var balanceValue = Number(balanceTag.textContent);
	balanceTag.textContent = balanceValue + ", $" + (balanceValue * btcusd).toFixed(2);
    
    var totalValue = pendingValue + balanceValue;

    var tbodyHTML = document.getElementsByTagName("tbody")[1].innerHTML;
    tbodyHTML += '<tr>'
		+ '<td align="right"><b>Total</b></td>'
		+ '<td>' + (totalValue).toFixed(8) + ', $' + (btcusd * totalValue).toFixed(2) + '</td></tr>';
    document.getElementsByTagName("tbody")[1].innerHTML = tbodyHTML;
    
    document.getElementsByTagName("tbody")[1].children[3].parentNode.insertBefore(document.getElementsByTagName("tbody")[1].children[3], document.getElementsByTagName("tbody")[1].children[2]);
}