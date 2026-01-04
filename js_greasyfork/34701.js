// ==UserScript==
// @name           Victory: автоайти
// @version        1.00
// @namespace      virtonomica
// @description    Автоайти
// @include        http*://*virtonomic*.*/*/main/unit/view/*
// @exclude        http*://*virtonomic*.*/*/main/unit/view/*/*
// @downloadURL https://update.greasyfork.org/scripts/34701/Victory%3A%20%D0%B0%D0%B2%D1%82%D0%BE%D0%B0%D0%B9%D1%82%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/34701/Victory%3A%20%D0%B0%D0%B2%D1%82%D0%BE%D0%B0%D0%B9%D1%82%D0%B8.meta.js
// ==/UserScript==

var run = function() {
	function f2(val){
		return Math.floor(100*val)/100;
	}
	function calcQualTop1(q, p){		
		if(p==0) return 0.00;
		//if(type=='office'){return Math.log(14/4.15*q*q/p)/Math.log(1.4);}
		return Math.log(0.2*14*1*q*q/p)/Math.log(1.4);	
	}

	var ttype = $("div.title script").text().split('\n')['4'];
	ttype = ttype.substring(ttype.indexOf('bgunit-')+7, ttype.length-5);
	if (ttype == 'it') {
		var but = $('<button>').append('IT').click( function() {
			var unitID = window.location.href.match(/\d+/)['0'];
			
			$.ajax({
				url: 'https://virtonomica.ru/api/olga/main/token',
				async: false,
				dataType: 'json',
				type: "get",
				success: function(json){
					var token = $(json).selector;
					$.ajax({
						url: 'https://virtonomica.ru/api/olga/main/unit/refresh',
						async: false,
						dataType: 'json',
						type: "post",
						data: "id=" + unitID + "&token=" + token
					});
				}
			});
		
			$.ajax({
				url: 'https://virtonomica.ru/api/olga/main/unit/summary?id=' + unitID,
				async: false,
				dataType: 'json',
				type: "get",
				success: function(json){
					var storage = $(json);
					var cityLevel = +storage[0].city_level;
					var cityPopulation = +storage[0].city_population;
					var curEquip = +storage[0].equipment_count;
					var curEmp = +storage[0].employee_count;
					var playerQual = +storage[0].competence_value;
					var curAdvert = +storage[0].advertising_cost;
					
					var equip = Math.ceil(cityPopulation/35000);
					var emp = equip * 10;
					var advert = 100 * 0.24 * Math.pow(1.2, cityLevel-1) * cityPopulation;
					advert = advert.toFixed(0);
					
					if (advert != curAdvert) {
						$.ajax({
							url: 'https://virtonomica.ru/olga/main/unit/view/' + unitID + '/virtasement',
							async: false,
							type: "post",
							data: 'advertData[type][]=2264&advertData[totalCost]=' + advert
						});
					}
					
					if (equip != curEquip || emp != curEmp) {
						/*$.ajax({
							url: 'https://virtonomica.ru/olga/window/management_units/equipment/multiple/vendor:4728384/product:423275',
							async: false,
							type: 'post',
							data: 'unit[' + unitID + '][operation]=buy&unit[' + unitID + '][qty]=' + (equip - curEquip)
						});*/
						
						$.ajax({
							url: 'https://virtonomica.ru/olga/ajax/unit/supply/equipment',
							async: false,
							type: "post",
							data: 'operation=buy&offer=6875110&unit=' + unitID + '&supplier=6875110&amount=' +  (equip - curEquip)
						});

						
						var kvalSend = f2(calcQualTop1(playerQual, emp));
			
						$.ajax({
							url: 'https://virtonomica.ru/olga/window/unit/employees/engage/' + unitID,
							async: false,
							type: 'post',
							data: 'unitEmployeesData[quantity]=' + emp + '&salary_max=100000&target_level=' + kvalSend + '&trigger=1'
						});
					}
				}
			});
			
			$.ajax({
				url: 'https://virtonomica.ru/api/olga/main/token',
				async: false,
				dataType: 'json',
				type: "get",
				success: function(json){
					var token = $(json).selector;
					$.ajax({
						url: 'https://virtonomica.ru/api/olga/main/unit/refresh',
						async: false,
						dataType: 'json',
						type: "post",
						data: "id=" + unitID + "&token=" + token
					});
				}
			});
			
			location.reload();
		});
		$("#childMenu").after(but);
	}
};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);