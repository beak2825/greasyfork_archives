// ==UserScript==
// @name           Бизнесмания: поиск помещений
// @version        1.01
// @author         Agor71
// @description    Поиск помещений
// @include        http*://bizmania.ru/units/division/rent*
// @include        http*://bizmania.ru/units/create/*
// @include        http*://bizmania.ru/units/division/rentmove/*
// @namespace https://greasyfork.org/users/10556
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.28.15/js/jquery.tablesorter.js

// @downloadURL https://update.greasyfork.org/scripts/32176/%D0%91%D0%B8%D0%B7%D0%BD%D0%B5%D1%81%D0%BC%D0%B0%D0%BD%D0%B8%D1%8F%3A%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%20%D0%BF%D0%BE%D0%BC%D0%B5%D1%89%D0%B5%D0%BD%D0%B8%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/32176/%D0%91%D0%B8%D0%B7%D0%BD%D0%B5%D1%81%D0%BC%D0%B0%D0%BD%D0%B8%D1%8F%3A%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%20%D0%BF%D0%BE%D0%BC%D0%B5%D1%89%D0%B5%D0%BD%D0%B8%D0%B9.meta.js
// ==/UserScript==

var run = function() {
	// Это нужно вставить в заголовок скрипта:
	// @require https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.28.15/js/jquery.tablesorter.js

	$('body > div.bodyint > table.footer').before("<div align='center'><table id='panel' class='sortable' bgcolor='#ffffff' width=1600><thead><tr><th>Переезд</th><th>ID</th><th>x:y</th><th>Жители</th><th>Богатство</th><th>Свободная площадь</th><th>Привлекательность</th><th>Население</th><th>Ср. богатство</th><th>Оценка</th><th>Ср. привлекательность</th><th>Сум. привлекательность</th><th>Ср. аренда</th><th>Сум. аренда</th><th>Mun</th><th>Mun Attr</th></tr></thead><tbody>");
		
	cityID = $('#cityflash > param:nth-child(4)')["0"].attributes[1].nodeValue.substring(16,19).match(/\d+/)['0'];
	shopSq = $('#cityflash > param:nth-child(4)')["0"].attributes[1].nodeValue;
	shopSq = shopSq.substr(shopSq.indexOf('rentSquare=')+11, 5).match(/\d+/)['0'];
	mapArr = [];
	mapArrW = [];
	mapArrAttr = [];
    mapArrP = [];
    mapArrMun = [];
    mapArrMunAttr = [];
    storage = '';
    //munBuil = ['cliniccenter','college','court','historic','hospital','hotel','institute','metro','police','policlinic','prison','school','stadium','station','theatre'];
    munBuil = ['school','cliniccenter','college','hospital','institute','policlinic'];
	
	var button = $('<button>').append('Запустить').click( function() {
		var storage;
		$.ajax({
			url: 'https://spacom.ru/info.php?id=' + cityID,
			type: "GET",
			crossDomain: true,
			dataType: 'json',
			//async: false,
			success: function(json){
				storage = $(json);
				var maxK = storage["0"].objects.house.length;
                for(var x = 0; x < munBuil.length; x++) {
                    if (typeof storage["0"].objects[munBuil[x]] !== 'undefined') {
                        var maxX = storage["0"].objects[munBuil[x]].length;
                        for(var c = 0; c < maxX; c++) {
                        var houseMunX = +storage["0"].objects[munBuil[x]][c]["@attributes"].x;
                        var houseMunY = +storage["0"].objects[munBuil[x]][c]["@attributes"].y;
                        var houseMunAttr = parseFloat((+storage["0"].objects[munBuil[x]][c]["@attributes"].attr).toFixed(2));
                        if (typeof mapArrMun[houseMunX] == 'undefined') { mapArrMun[houseMunX] = []; mapArrMunAttr[houseMunX] = []; }
                        mapArrMun[houseMunX][houseMunY] = 1;
                        mapArrMunAttr[houseMunX][houseMunY] = houseMunAttr;
                        }
                    }
                }
                
				console.log(storage);
				for(var k = 0; k < maxK; k++){
					var houseX = +storage["0"].objects.house[k]["@attributes"].x;
					var houseY = +storage["0"].objects.house[k]["@attributes"].y;
					var mapPopAttr = parseFloat((+storage["0"].objects.house[k]["@attributes"].attr).toFixed(2));
                    var mapRentP = parseFloat(storage["0"].objects.house[k].rent["@attributes"].p);
					var mapPopQ = 0;
					var mapPopW = 0;
					if (typeof storage["0"].objects.house[k].inh !== 'undefined') {
						mapPopQ = +storage["0"].objects.house[k].inh["@attributes"].q;
						mapPopW = +parseFloat((+storage["0"].objects.house[k].inh["@attributes"].w).toFixed(0));
					}
					if (typeof mapArr[houseX] == 'undefined') { mapArr[houseX] = []; mapArrW[houseX] = []; mapArrAttr[houseX] = []; mapArrP[houseX] = []; }
					//mapArr[houseX][houseY] = parseInt(mapPopQ * Math.pow(1.2, mapPopW));
					mapArr[houseX][houseY] = mapPopQ;
					mapArrW[houseX][houseY] = mapPopW;
					mapArrAttr[houseX][houseY] = mapPopAttr;
                    mapArrP[houseX][houseY] = mapRentP;
				}
				
				for(var i = 0; i < maxK; i++){
					var rentO = +storage["0"].objects.house[i].rent["@attributes"].o;
					var rentS = +storage["0"].objects.house[i].rent["@attributes"].s;
					var rentFree = rentS - rentO;
					
					if (rentFree >= shopSq) {
						var popQ = 0;
						var popW = 0;
						if (typeof storage["0"].objects.house[i].inh !== 'undefined') {
							popQ = +storage["0"].objects.house[i].inh["@attributes"].q;
							popW = +parseFloat((+storage["0"].objects.house[i].inh["@attributes"].w).toFixed(0));
						}
						
						var houseX = +storage["0"].objects.house[i]["@attributes"].x;
						var houseY = +storage["0"].objects.house[i]["@attributes"].y;
						
						var areaL = 4;
						var Sup = 0;
						var Sup2 = 0;
                        var Sup3 = 0;
						var Sup4 = 0;
						var Sup5 = 0;
                        var Sup6 = 0;
                        var Sup7 = 0;
						var l = 0;
                        var Mun = 0;
                        var Mun2 = 0;
						// 2 уровень, 100 кв - 12 клеток
						// 5 уровень, 500 кв - 15 клеток
						// 3 уровень, 200 кв - 13 клеток
						// 1 уровень, 50 кв - 11 клеток
						for (var j = houseX - areaL; j < houseX + areaL; j++){
							if (typeof mapArr[j] !== 'undefined') {
								for (var n = houseY - areaL; n < houseY + areaL; n++){
									if (Math.sqrt(Math.pow(houseX - j, 2) + Math.pow(houseY - n, 2)) <= areaL) {
										if (typeof mapArr[j][n] !== 'undefined') { Sup = Sup + mapArr[j][n]; Sup2 = Sup2 + mapArrW[j][n]; Sup4 = Sup4 + mapArrAttr[j][n]; Sup6 = Sup6 + mapArrP[j][n]; l += 1; }
									}
								}
							}
                            if (typeof mapArrMun[j] !== 'undefined') {
								for (var n = houseY - areaL; n < houseY + areaL; n++){
									if (Math.sqrt(Math.pow(houseX - j, 2) + Math.pow(houseY - n, 2)) <= areaL) {
										if (typeof mapArrMun[j][n] !== 'undefined') { Mun += 1; Mun2 = Mun2 + mapArrMunAttr[j][n]; }
									}
								}
							}
						}
						Sup2 = (Sup2 / l).toFixed(2);
                        Sup3 = (Sup * Math.pow(1.2, Sup2)).toFixed(0);
						Sup5 = (Sup4 / l).toFixed(2);
						Sup4 = Sup4.toFixed(2);
                        Sup6 = Sup6.toFixed(2);
                        Sup7 = (Sup6 / l).toFixed(2);
                        Mun2 = Mun2.toFixed(2);
						
						var houseID = storage["0"].objects.house[i]["@attributes"].id;
						var houseAttr = parseFloat((+storage["0"].objects.house[i]["@attributes"].attr).toFixed(2));
                        
						$('#panel').find('tbody').append('<tr><td><a href="javascript:popupExecute(\'window.parent.rentSquare(' + houseID + ')\',\'rentbutton\')" id="rentbutton"><img src="/img/btns/buy.gif" border="0" title="арендовать площадь"></a></td><td>' + houseID + '</td><td>' + houseX + ' : ' + houseY + '</td><td>' + popQ + '</td><td>' + popW + '</td><td>' + rentFree + '</td><td>' + houseAttr + '</td><td>' + Sup + '</td><td>' + Sup2 + '</td><td>' + Sup3 + '</td><td>' + Sup5 + '</td><td>' + Sup4 + '</td><td>' + Sup7 + '</td><td>' + Sup6 + '</td><td>' + Mun + '</td><td>' + Mun2 + '</td></tr>');
					}
				}
				$("#panel").tablesorter({theme: 'blue', sortList: [[15,1],[9,1]]});
			}
		});
        return false;
	});
	$('body > div.bodyint > table.footer').before(button);

};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);