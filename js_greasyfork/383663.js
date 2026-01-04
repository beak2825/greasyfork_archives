// ==UserScript==
// @name		Отчети
// @namespace		https://greasyfork.org/en/users/10060-lisugera
// @version		0.8
// @description		Линк към отчети.
// @author		lisugera
// @match		https://www.erepublik.com/*
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/383663/%D0%9E%D1%82%D1%87%D0%B5%D1%82%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/383663/%D0%9E%D1%82%D1%87%D0%B5%D1%82%D0%B8.meta.js
// ==/UserScript==


$j('#hpTopNews').before("Мои отчети от днес: <strong><a href='javascript:openReports(1)'>Авио</a></strong>/<strong><a href='javascript:openReports(2)'>Земя</a></strong>");
window.openReports = openReports;

function openReports(type) {
	var today = (new Date(SERVER_DATA.serverTime.rfc.slice(0, SERVER_DATA.serverTime.rfc.length-6) + " UTC")).toISOString().substring(0, 10);
	var query, url;
	if(type == 1) {
		query = "select A, B, E, F, G, H, I, J, K where C contains " + erepublik.citizen.citizenId + " and A >= datetime'" + today + " 00:00:00' and N != 1 label A 'eRep време', G 'Щета', J 'Финансиране', K '★'";
		url = "https://docs.google.com/spreadsheets/u/2/d/1h55CDhuimkLCS0VR3bhR2DarMt231k6jkAgnynBN-Zc/gviz/tq?tqx=out:html&tq=" + encodeURIComponent(query);
	} else {
		query = "select A, B, E, F, G, H, I, J, K, L where C contains " + erepublik.citizen.citizenId + " and A >= datetime'" + today + " 00:00:00' and O != 1 label A 'eRep време', H 'Щета', K 'Финансиране', L '★'";
		url = "https://docs.google.com/spreadsheets/u/2/d/19_3JFNSUqnBWNb8bhAurpMlg29X0bA3qAZMVPQVblKQ/gviz/tq?tqx=out:html&tq=" + encodeURIComponent(query);
	}
	var isAndroid = /(android)/i.test(navigator.userAgent);
	if(isAndroid) {
		window.open("googlechrome://navigate?url=" + url, "_system");
	} else {
		window.open(url, "_system");
	}
}
