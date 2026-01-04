// ==UserScript==
// @name         Etherscan EasyRead
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  change timestamp on etherscan, make it easier to be analysised.
// @author       verazuo
// @match        https://etherscan.io/address/*
// @match        https://etherscan.io/txs?*
// @match        https://etherscan.io/txsInternal?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381875/Etherscan%20EasyRead.user.js
// @updateURL https://update.greasyfork.org/scripts/381875/Etherscan%20EasyRead.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var t;
    if (window.location.href.match("https://etherscan.io/address/")){
        t = document.getElementById("transactions");
    } else if (window.location.href.match("https://etherscan.io/txsInternal?")){
        t = document.getElementsByClassName("card-body")[0];
    } else if (window.location.href.match("https://etherscan.io/txs?")){
        t = document.getElementById("ContentPlaceHolder1_mainrow");
    }

    var trs = t.getElementsByTagName('tr');

	for (var i=1;i<trs.length;i++)
	{
		var tr = trs[i].getElementsByTagName("td");
        if(tr.length < 3){
            continue;
        }
        var span;
        if (window.location.href.match("https://etherscan.io/txsInternal?")){
			span = tr[1].getElementsByTagName("span")[0];
        } else {
        	span = tr[2].getElementsByTagName("span")[0];
        }
        if (span === undefined){
 			continue;
        }
        var date = new Date(span.title);
        var myDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2)+ ":" + ("0" + date.getSeconds()).slice(-2);
        span.innerHTML=myDate;
    }
})();
