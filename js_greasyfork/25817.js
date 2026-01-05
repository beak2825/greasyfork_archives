// ==UserScript==
// @name        kingbus
// @namespace   qqboxy
// @description Fix Kingbus Printing
// @match     http://order.kingbus.com.tw/*
// @match     https://order.kingbus.com.tw/*
// @version     0.0.1
// @downloadURL https://update.greasyfork.org/scripts/25817/kingbus.user.js
// @updateURL https://update.greasyfork.org/scripts/25817/kingbus.meta.js
// ==/UserScript==
(function () {
	document.getElementById("Button5").onclick = function() {
		var value = document.getElementById("block").innerHTML;
		var printPage = window.open("","printPage","");
		printPage.document.open();
		printPage.document.write("<HTML><head></head><BODY onload='window.print();window.close()'>");
		printPage.document.write("<PRE>");
		printPage.document.write(value);
		printPage.document.write("</PRE>");
		printPage.document.close("</BODY></HTML>");
	}
})();