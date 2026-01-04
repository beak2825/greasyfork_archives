// ==UserScript==
// @name           Virtonomica: услуговые тендеры неОлигархов
// @version        1.01
// @namespace      virtonomica_service_tenders_for_nonOligarchs
// @description    Из названия уже всё ясно
// @include        http*://virtonomica.ru/*/main/globalreport/marketing/*
// @downloadURL https://update.greasyfork.org/scripts/369606/Virtonomica%3A%20%D1%83%D1%81%D0%BB%D1%83%D0%B3%D0%BE%D0%B2%D1%8B%D0%B5%20%D1%82%D0%B5%D0%BD%D0%B4%D0%B5%D1%80%D1%8B%20%D0%BD%D0%B5%D0%9E%D0%BB%D0%B8%D0%B3%D0%B0%D1%80%D1%85%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/369606/Virtonomica%3A%20%D1%83%D1%81%D0%BB%D1%83%D0%B3%D0%BE%D0%B2%D1%8B%D0%B5%20%D1%82%D0%B5%D0%BD%D0%B4%D0%B5%D1%80%D1%8B%20%D0%BD%D0%B5%D0%9E%D0%BB%D0%B8%D0%B3%D0%B0%D1%80%D1%85%D0%BE%D0%B2.meta.js
// ==/UserScript==

(function () {
	//Список ссылок на предприятия, для которых будет происходить считывание
	var unitsStr = `https://virtonomica.ru/olga/main/unit/view/6477947
https://virtonomica.ru/olga/main/unit/view/6727502
https://virtonomica.ru/olga/main/unit/view/6994365
https://virtonomica.ru/olga/main/unit/view/6740772`;

    var units = unitsStr.split('\n');

	var filter = 0;
	
	function getThousandsSplitted(val) {
		return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	}

	function getCities(realm){
		var storage;
		$.ajax({
			url: 'https://virtonomica.ru/api/' + realm + '/main/geo/city/browse',
			async: false,
			type: "get",
			success: function(json){
				storage = $(json);
			}
		});
		return storage;
	}

	function getPlayerName(url, realm){
		var playerName;
		$.ajax({
			url: 'https://virtonomica.ru/' + realm + '/main/user/view/' + url,
			type: "get",
			async: false,
			success: function(html){
				playerName = $(html).find('td:contains("Логин")').text().match(/Логин:\s.*/)[0].replace('Логин: ','');
			}
		});
		return playerName;
	}

	function getRatings(realm, player, type, cityID, regionID, countryID){
		var result = 0;
		$.ajax({
			url: 'https://virtonomica.ru/' + realm + '/main/company/toplist/service/' + type + '/' + countryID + '/' + regionID + '/' + cityID,
			type: "get",
			async: false,
			success: function(html){
				result = $(html).find('#mainContent > table > tbody > tr > td:contains("'+ player + '")').eq(0).next().next().text().replace(/\D+/g,'');
			}
		});
		return result;
	}

	function checkMayor(realm, cityID, player, unitID, typeMayor, type){
		var checkResult = true;

		if (filter != type) {
			$.ajax({
				url: 'https://virtonomica.ru/' + realm + '/main/common/util/setfiltering/dbpolitics/units/class=' + typeMayor + '/type=' + type + '/size=0',
				type: "get",
				async: false,
				success: function(){
					filter = type;
				}
			});
		}

		$.ajax({
			url: 'https://virtonomica.ru/' + realm + '/main/politics/mayor/' + cityID + '/units',
			type: "get",
			async: false,
			success: function(html){
				$(html).find('.unit-list > tbody > tr > td:contains("' + player + '")').each(function(){
					var link = $(this).parent().children().eq(1).children().eq(0).attr('href');
					
					if (unitID != link.match(/\d+/g)[0]) {
						$.ajax({
							url: link,
							type: "get",
							async: false,
							success: function(html){
								var serviceQuality = $(html).find('td:contains("Уровень сервиса")').next().text();
								//console.log(serviceQuality);
								if (serviceQuality != 'Не известен') { checkResult = false; }
							}
						});
					}
					
					//Старый функционал
					//var pers = $(this).nextAll().slice(3,4).text();
					//var vac = $(this).nextAll().slice(4,5).children(0).attr('title');
					//var unit = $(this).parent().children().eq(0).text();
					//if ((pers != 0 || vac != 'В отпуске') && unit != unitID) { checkResult = false; }
				});
			}
		});
		return checkResult;
	}

	function checkUnits(unit_url){
		$.ajax({
			url: unit_url,
			type: "get",
			async: false,
			success: function(html){
				//console.log($(html));
				var price = $(html).find('td:contains("Цена")').next().text().replace(/\D+/g,'')/100;
				var customers = $(html).find('td:contains("Количество посетителей")').next().text().replace(/\D+/g,'');
				var modifier = $(html).find('td:contains("Количество посетителей")').next().text().substr(0,5);
				switch(modifier) {
					case 'около': modifier = 0.5; break;
					case 'более': modifier = 0.8; break;
					case 'менее': modifier = 0.3; break
				}

				var city = $(html).find('div.title').eq(0).text().match(/[а-яёА-ЯЁ\- ]+(\(\w+\))?/gi);
				var companyLink = $(html).find('a:contains("Написать письмо менеджеру подразделения")').attr('href').replace(/\D+/g,'');
				var player = getPlayerName(companyLink, realm);
				var unitID = unit_url.match(/\d+/g)[0];

				var type = $(html).find("div.title script").text().split('\n')[6].replace("$('.headern .picture').addClass",'').replace('bg-page-unit-header-','').replace(/\W+/g,'');;
				switch(type) {
					case('restaurant'): typeRating = 373265; typeMayor = 373182; type = 0; break;
					case('medicine'): typeRating = 359926; typeMayor = 359822; type = 0; break;
					case('repair'): typeRating = 422825; typeMayor = 422811; type = 0; break;
					case('kindergarten'): typeRating = 423707; typeMayor = 423693; type = 0; break;
					case('hairdressing'): typeRating = 373245; typeMayor = 348193; type = 373245; break;
					case('fitness'): typeRating = 348207; typeMayor = 348193; type = 348207; break;
					case('laundry'): typeRating = 373255; typeMayor = 348193; type = 373255; break;
					case('cellular'): typeRating = 423795; typeMayor = 423353; type = 0; break;
				}

				var flag = false;
				var cityID, regionID, countryID;
				$.each(city, function(i) {
					if (flag) return;
					$.each(cityStorage[0], function(j) {
						if (cityStorage[0][j].city_name.replace(/\s/g,'') == city[i].replace(/\s/g,'')) { countryID = +cityStorage[0][j].country_id; regionID = +cityStorage[0][j].region_id; cityID = +cityStorage[0][j].city_id; flag = true; }
					});
				});

				var profit = getThousandsSplitted(getRatings(realm, player, typeRating, cityID, regionID, countryID));
				var check = checkMayor(realm, cityID, player, unitID, typeMayor, type);
				if (check == false) { profit = 'около ' + getThousandsSplitted(price * customers * modifier); }
				if (check == false) { check = 'Да'; } else { check = 'Нет'; }

				$('#nko_table').append('<tr><td>' + player + '</td><td>' + profit + '</td><td>' + check + '</td><td><a href="' + unit_url + '">Тыц-шпыц</a></td></tr>');
			}
		});
	}

	var button = $('<li>').append('<a>нКО</a>').click( function() {
		var table = $('<table id="nko_table" style="border-spacing: 30px; background: white; z-index: 10000; margin: auto;">').append('<tr><td>Игрок</td><td>Результат</td><td>Нарушение правил</td><td>Ссылка на подразделение</td></tr>');
		table.prependTo('body');

		realm = window.location.href.match(/\/(\w+)\/main\//)[1];

		$.ajax({
			url: 'https://virtonomica.ru/api/' + realm + '/main/geo/city/browse',
			async: false,
			type: "get",
			success: function(json){
				cityStorage = $(json);
			}
		});

		$.ajax({
			url: 'https://virtonomica.ru/' + realm + '/main/common/util/setpaging/usermain/topRating/10000',
			async: false,
		});
		$.ajax({
			url: 'https://virtonomica.ru/' + realm + '/main/common/util/setpaging/dbpolitics/units//10000',
			async: false,
		});

		$.each(units, function(i) {
			checkUnits(units[i]);
		});

		$.ajax({
			url: 'https://virtonomica.ru/' + realm + '/main/common/util/setpaging/usermain/topRating/50',
			async: false,
		});
		$.ajax({
			url: 'https://virtonomica.ru/' + realm + '/main/common/util/setpaging/dbpolitics/units//50',
			async: false,
		});
		
		alert('Готово!');
	})

	$('.tabu').append(button);

})(unsafeWindow);