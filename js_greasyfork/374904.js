// ==UserScript==
// @name Space Kings: Resource Transport
// @namespace https://greasyfork.org/ru/users/229054-rovor
// @description Показывает число транспортов необходимое для вывоза ресурсов
// @version 1.0
// @creator Rovor
// @include http://*uni1.spacekings.ru/fleet.php*
// @downloadURL https://update.greasyfork.org/scripts/374904/Space%20Kings%3A%20Resource%20Transport.user.js
// @updateURL https://update.greasyfork.org/scripts/374904/Space%20Kings%3A%20Resource%20Transport.meta.js
// ==/UserScript==

(function(){

	var metal = document.getElementById("MetalVal").innerHTML;
	metal = parseInt(metal.replace(/\D/g, ''));

	var crystal = document.getElementById("CrystalVal").innerHTML;
	crystal = parseInt(crystal.replace(/\D/g, ''));

	var deuterium = document.getElementById("DeuteriumVal").innerHTML;
	deuterium = parseInt(deuterium.replace(/\D/g, ''));

	var total = metal + crystal + deuterium;

	var sc = Math.ceil(total/7000);
	var bc = Math.ceil(total/70000);
    var mc = Math.ceil(total/350000);
    var i=0;
    var mainTbl = document.getElementsByTagName("table");
    var tds = mainTbl[8].getElementsByTagName("td");
	for (i=0;i<tds.length;i++){
		if (tds[i].innerText == "Малый транспорт") tds[i+1].innerHTML += "<b>("+sc+")</b>";
		else if (tds[i].innerText == "Большой транспорт") tds[i+1].innerHTML += "<b>("+bc+")</b>";
		else if (tds[i].innerText == "Мега-транспорт") tds[i+1].innerHTML += "<b>("+mc+")</b>";
	}
})();