// ==UserScript==
// @name         Steam Price Exchanger
// @version      0.3.1.0
// @description  Exchange price on steam and community
// @author       lzt
// @match        *://*.steampowered.com/*
// @match        *://*.steamcommunity.com/*
// @grant        GM_xmlhttpRequest
// @grant 		 GM_setValue
// @grant 		 GM_getValue
// @grant		 unsafeWindow
// @grant		 window
// @connect      esapi.isthereanydeal.com
// @namespace    steam_price_exchanger
// @downloadURL https://update.greasyfork.org/scripts/410247/Steam%20Price%20Exchanger.user.js
// @updateURL https://update.greasyfork.org/scripts/410247/Steam%20Price%20Exchanger.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Your code here...

    var style = document.createElement("style");
	style.type = "text/css";
	var text = document.createTextNode(".tab_item_discount {width: 180px;}");
	style.appendChild(text);
	var head = document.getElementsByTagName("head")[0];
	head.appendChild(style);

	console.log(GM_getValue("timestamp"))
	if (GM_getValue("timestamp") == undefined) {GM_setValue("timestamp", 0);console.log("set timestamp to 0")};
    unsafeWindow.rub = {"rate": GM_getValue("rub"), "lock": 0};
    unsafeWindow.ars = {"rate": GM_getValue("ars"), "lock": 0};

    function initobserver (rate, unit) {
	    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	    var target = document.body;
	    var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				unsafeWindow.fillprice(rate, unit, 500)
				});
			});
	    var config = { attributes: true, childList: true, characterData: true, subtree: true}
	    observer.observe(target, config);
	}

    unsafeWindow.fillprice = function (rate, unit, delay){
    	if (rate["lock"] == 1) {return -1};
    	rate["lock"] = 1;
        var lists = document.evaluate("//*[contains(text(), '" + unit + "')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        var re = new RegExp(unit == "ARS"?"ARS\\$?\\s*[0-9.,]+":"[0-9.,]+\\s*pуб.?", "ig");
        for(let i = 0; i < lists.snapshotLength; i++) {
        	var item = lists.snapshotItem(i)
            if (item.firstChild.nodeValue == null) {continue};
            if (item.firstChild.nodeValue.search("¥") != -1) {continue};
            if (item.classList.contains("es-regprice") & item.classList.contains("es-flag")) {continue};
            if (item.parentNode.classList.contains("es-flag--cn")) {continue};
            
            var s = item.firstChild.nodeValue.match(re)
            if (s != null) {
                for(let j = 0; j < s.length; j++) {
                    var price = s[j].replace(".", "");
                    price = price.replace(",", ".");
                    price = "¥" + parseInt(parseFloat(price.match(/[0-9.]+/))*rate["rate"]).toString();
                    if ((item.classList.contains("col") & item.classList.contains("search_price")) | 
                    	item.nodeName == "STRIKE") {
                    	item.firstChild.nodeValue = item.firstChild.nodeValue.replace(s[j], s[j].replace(" ", "") + "(" + price + ")").trim();
                    }else {
                    	item.firstChild.nodeValue = item.firstChild.nodeValue.replace(s[j], s[j] + "(" + price + ")").trim()
                    }
                }
            }
        }
        lists = document.getElementsByClassName("col search_price discounted");
        for (let i = 0; i < lists.length; i++) {
        	if (lists[i].childNodes[3].nodeValue == null) {continue};
            if (lists[i].childNodes[3].nodeValue.search("¥") != -1) {continue};
            if (lists[i].childNodes[3].nodeValue.search(unit) == -1) {continue};

        	var price = lists[i].childNodes[3].nodeValue.replace(".", "");
        	price = price.replace(",", ".");
        	price = "¥" + parseInt(parseFloat(price.match(/[0-9.]+/))*rate["rate"]).toString();
        	lists[i].childNodes[3].nodeValue = lists[i].childNodes[3].nodeValue.replace(" ", "").trim() + "(" + price + ")";
        }
        if (unit == "ARS") {setTimeout("window.ars['lock'] = 0", delay)}
        	else{setTimeout("window.rub['lock'] = 0", delay)} 
    }


    if ((new Date().getTime() - GM_getValue("timestamp")) >= 3600000*6 | 
    	typeof(unsafeWindow.rub) == undefined | 
    	typeof(unsafeWindow.ars) == undefined) {
    	console.log("update rates")
    	GM_xmlhttpRequest({
	        method: "get",
	        url: "https://esapi.isthereanydeal.com/v01/rates/?to=CNY",
	        responseType: "json",
	        onload: function(r) {
	            unsafeWindow.ars["rate"] = r.response["data"]["ARS"]["CNY"];
	            unsafeWindow.rub["rate"] =r.response["data"]["RUB"]["CNY"];

	            console.log(unsafeWindow.ars["rate"] + " ARS/CNY");
	            console.log(unsafeWindow.rub["rate"] + " RUB/CNY");
	            GM_setValue("rub", unsafeWindow.rub["rate"]);
	            GM_setValue("ars", unsafeWindow.ars["rate"]);
	            GM_setValue("timestamp", new Date().getTime());

            	unsafeWindow.fillprice(unsafeWindow.rub, "pуб", 0);
			    unsafeWindow.fillprice(unsafeWindow.ars, "ARS", 0);
			    initobserver(unsafeWindow.rub, "pуб");
			    initobserver(unsafeWindow.ars, "ARS");
	        }
    	});
    }else{
    	unsafeWindow.fillprice(unsafeWindow.rub, "pуб", 50);
	    unsafeWindow.fillprice(unsafeWindow.ars, "ARS", 50);
	    initobserver(unsafeWindow.rub, "pуб");
	    initobserver(unsafeWindow.ars, "ARS");
    }
    

})();