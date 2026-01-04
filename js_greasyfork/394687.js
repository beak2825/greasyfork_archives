// ==UserScript==
// @name Space Kings: Resource Transport
// @namespace https://greasyfork.org/ru/users/229054-rovor
// @description Показывает число транспортов необходимое для вывоза ресурсов
// @version 1.0
// @creator Rovor
// @include http://*uni1.spacekings.ru/fleet.php*
// @downloadURL https://update.greasyfork.org/scripts/394687/Space%20Kings%3A%20Resource%20Transport.user.js
// @updateURL https://update.greasyfork.org/scripts/394687/Space%20Kings%3A%20Resource%20Transport.meta.js
// ==/UserScript==

(function(){

    var ally_capacity_bonuse = 0;
	var	space_station_fleet_copacity_bonuse = 0;
		ally_capacity_bonuse = parseFloat($("input[name=ally_capacity_bonuse]").val());
		space_station_fleet_copacity_bonuse = parseFloat($("input[name=space_station_fleet_copacity_bonuse]").val());
	var ArtifactBonus = 0;
		if (document.getElementsByName("ship299")[0]){
			if (document.getElementsByName("ship299")[0].value > 0){
				ArtifactBonus = parseFloat(document.getElementsByName("ArtifactBonusCargo")[0].value);}
		}
    var bonus =(1 + ArtifactBonus * 0.01 + ally_capacity_bonuse + space_station_fleet_copacity_bonuse);

	var metal = document.getElementById("MetalVal").innerHTML;
	metal = parseInt(metal.replace(/\D/g, ''));

	var crystal = document.getElementById("CrystalVal").innerHTML;
	crystal = parseInt(crystal.replace(/\D/g, ''));

	var deuterium = document.getElementById("DeuteriumVal").innerHTML;
	deuterium = parseInt(deuterium.replace(/\D/g, ''));

	var total = metal + crystal + deuterium;
	var sc = Math.ceil(total/(document.getElementsByName("capacity202")[0].value * bonus));
	var bc = Math.ceil(total/(document.getElementsByName("capacity203")[0].value * bonus));
    var mc = Math.ceil(total/(document.getElementsByName("capacity216")[0].value * bonus));
    var i=0;
    var mainTbl = document.getElementsByTagName("table");
    var tds = mainTbl[8].getElementsByTagName("td");

	for (i=0;i<tds.length;i++){
        if(tds[i].innerText == "Малый транспорт")tds[i+1].innerHTML +=" <a href=\"#\" onClick=\"document.getElementsByName('ship202')[0].value = "+sc+"; miniInfo();\"><b>("+sc+")</b></a>";
		else if (tds[i].innerText == "Большой транспорт")tds[i+1].innerHTML +=" <a href=\"#\" onClick=\"document.getElementsByName('ship203')[0].value = "+bc+"; miniInfo();\"><b> ("+bc+")</b></a>";
		else if (tds[i].innerText == "Мега-транспорт")tds[i+1].innerHTML +=" <a href=\"#\" onClick=\"document.getElementsByName('ship216')[0].value = "+mc+"; miniInfo();\"><b> ("+mc+")</b></a>";
	}
})();