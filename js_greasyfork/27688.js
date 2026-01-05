// ==UserScript==
// @name         Bakaláři
// @version      0.1
// @description  Zlepšení Bakawebu
// @author       Vingi
// @match        https://bakalari.gymtce.cz/bakaweb/uvod.aspx
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @namespace https://greasyfork.org/users/77285
// @downloadURL https://update.greasyfork.org/scripts/27688/Bakal%C3%A1%C5%99i.user.js
// @updateURL https://update.greasyfork.org/scripts/27688/Bakal%C3%A1%C5%99i.meta.js
// ==/UserScript==

(function() {
    'use strict';
//hide
$(".pravemenu2").hide();
$("#cphmain_docksuplovani_PW-1").hide();
$("#cphmain_dockrozvrh_PW-1").hide();
$("#cphmain_dockkalendar_PW-1").hide();
$("#cphmain_dockkontakty_PW-1").hide();
$("#cphmain_dockprihlaseni_PW-1").hide();
$("#cphmain_docknavigace_PW-1").hide();
$("#cphmain_dockuvodnizprava_PW-1").hide();
//get známky
var klasifikace_url = document.getElementById("hlavnimenu_DXI2i0_T").getAttribute("href");
$.get(klasifikace_url, null, function(object){
$(".rightZone").prepend($(object).find('#cphmain_roundprub').get(0));
});
//get rozvrh
var rozvrh_url = document.getElementById("hlavnimenu_DXI3i0_T").getAttribute("href");
$.get(rozvrh_url, null, function(object){
$(".leftZone").prepend($(object).find('#cphmain_roundrozvrh').get(0));
});
//collapse rozvrh
setTimeout(function () {
	$("#cphmain_roundrozvrh_RPC").hide();
	document.getElementById("cphmain_roundrozvrh_HC").onclick = function(){
		if (!($("#cphmain_roundrozvrh_RPC").hasClass("expanded")))
		{
			$("#cphmain_roundrozvrh_RPC").addClass("expanded");
			$("#cphmain_roundrozvrh_RPC").show();
		}
		else
		{
			$("#cphmain_roundrozvrh_RPC").hide();
			$("#cphmain_roundrozvrh_RPC").removeClass("expanded");
		}
		$("#cphmain_roundprub").offset({ top: $("#cphmain_dockupozorneni_PW-1").offset().top});
	};
}, 2000);
})();