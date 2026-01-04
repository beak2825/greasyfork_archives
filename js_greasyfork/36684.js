// ==UserScript==
// @name         KX CLAN Extension 
// @description  Suscriber Edition
// @version      3.2
// @namespace    xxxx
// @author       Storm
// @match        *.gota.io/web/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/36684/KX%20CLAN%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/36684/KX%20CLAN%20Extension.meta.js
// ==/UserScript==

window.stop();
document.documentElement.innerHTML = "";

GM_xmlhttpRequest({
	url: "http://gota.io/web",
	method: "GET",
	onload: function(req){
		let response = req.responseText;
		response = response.replace(/<script\s*src="gota\.js\?v=\d\.\d\.\d"><\/script>/i, '<script src="https://hastebin.com/raw/otamoridex.md"></script>');
		response = response.replace(/(Show\s*Border<\/span><br>)/i, '$1 <input type="checkbox" class="checkbox-options" id="cShowSectors"><span>Show Sectors</span><br>');
 		document.open();
		document.write(response);
		document.close();
	}
});

//Storm - Kx Clan Extension V3.2 Suscriber Edition