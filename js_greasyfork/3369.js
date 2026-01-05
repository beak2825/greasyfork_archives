// ==UserScript==
// @name       OTRKeyFinder @ Fernsehserien.de
// @namespace  http://www.fernsehserien.de/
// @include  http://www.fernsehserien.de/*
// @grant       GM_log
// @match    http://www.fernsehserien.de/*
// @version    0.2
// @description  Add OTR search links
// @copyright  2013+, Frank Glaser
// @downloadURL https://update.greasyfork.org/scripts/3369/OTRKeyFinder%20%40%20Fernsehseriende.user.js
// @updateURL https://update.greasyfork.org/scripts/3369/OTRKeyFinder%20%40%20Fernsehseriende.meta.js
// ==/UserScript==
//debugger;

function pad(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

var title = escape(
		document.evaluate(
			"string( //h1/text() )", 
			document, 
			null, 
			XPathResult.STRING_TYPE, 
			null
		).stringValue.replace(/\W/g, ' ').replace(/ /g, '+')
	);

var allTrs = document.evaluate(
		"//table[@class='sendetermine  ']/tbody/tr[not(@class)]", 
		document, 
		null, 
		XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, 
		null
	);

for (var i=0;i<allTrs.snapshotLength;i++) { 
	try{
		var thisTr = allTrs.snapshotItem(i);
        //GM_log(thisTr);
        var date = thisTr.firstChild.nextSibling.nextSibling.firstChild.textContent;
        var usdate = date.substr(-2,2)+"."+date.substr(3,2)+"."+date.substr(0,2);
        var channel = thisTr.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.firstChild.textContent.replace(/\W/g, '');
		
        var url = "http://www.otrkeyfinder.com/?search="+title+"+"+usdate+"+"+channel;
		
		var td = document.createElement("td");
		var a = document.createElement("a");
		a.href = url;
		a.title = url;
		//a.target = "_blank";
		var text = document.createTextNode("OtrKF");
		
		a.appendChild(text);
		td.appendChild(a);
		thisTr.appendChild(td);
	}
	catch(err){
        GM_log("Userscript error:");
        GM_log(err);
	}
}
