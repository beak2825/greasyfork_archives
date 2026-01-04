// ==UserScript==
// @name           Antinoobs: парсер Стима
// @version        1.00
// @namespace      antinoobs_steam_parser
// @description    Из названия уже всё ясно
// @include        https://store.steampowered.com/genre/*/*
// @include        https://store.steampowered.com/tags/ru/*
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/370595/Antinoobs%3A%20%D0%BF%D0%B0%D1%80%D1%81%D0%B5%D1%80%20%D0%A1%D1%82%D0%B8%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/370595/Antinoobs%3A%20%D0%BF%D0%B0%D1%80%D1%81%D0%B5%D1%80%20%D0%A1%D1%82%D0%B8%D0%BC%D0%B0.meta.js
// ==/UserScript==

(function () {
	var jq = document.createElement('script');
	jq.src = "https://steamstore-a.akamaihd.net/public/shared/javascript/jquery-1.8.3.js";
	document.getElementsByTagName('head')[0].appendChild(jq);

	setTimeout(createButtons, 10000);

	var name;
	var link;
	var page;
	var lastPage;
	var i = 1;

	function parser(link2){
		$.ajax({
			url: link2,
			async: false,
			type: "get",
			success: function(json){
				var storage = $(json);
				storage = storage[0].results_html;
				console.log(storage[0].results_html);
				var reLink = /(https:\/\/store.steampowered.com\/\w+\/\d+\/.*?[/"])/g;
				var reName = /<div class="tab_item_name">.*?<\/div>/g;

				var link = storage.match(reLink);
				var name = storage.match(reName);
				
				var length = link.length;
				var i = 0;
				
				while (i < length) {
					if (/\/bundle\//g.test(link[i]) || /\/sub\//g.test(link[i])) { name.splice(i,1); link.splice(i,1); length--; }
					else { i++; }
				}

				/*$(name).each(function(i) {
					name[i].replace('<div class="tab_item_name">','').replace('</div>','').replace(/[^a-zA-Za-яА-ЯёЁ0-9\s]/g,'').replace(/\s+/g,' ');
				});*/
				$(name).each(function(i) {
					$('#myTable').append('<tr><td>' + name[i].replace('<div class="tab_item_name">','').replace('</div>','').replace(/[^a-zA-Za-яА-ЯёЁ0-9\s\-]/g,'').replace(/\s+/g,' ') + '</td><td>' + link[i] + '</td></tr>');
				});

			}
		});
	}

	function parseGames(link,lastPage){
		if (i <= lastPage) {
			var link2 = link + '?query=&start=' + (i - 1) * 15 + '&count=15&cc=RU&l=russian&no_violence=0&no_sex=0&v=4&tag=';
			parser(link2);
			i++;
			setTimeout(parseGames(link,lastPage), 5000);
		}
	}

	function indie(){
	}

	function earlyAccess(){
		link = 'https://store.steampowered.com/contenthub/querypaginated/earlyaccess/TopSellers/render/';
		lastPage = 20;
		parseGames(link,lastPage);
	}

	function createButtons(){
		var button = $('<button>').append('Ранний доступ').click(function() {
			earlyAccess();
		});
		$('body').append(button);
		var table = $('<table id="myTable">').append('<tr><td>Название</td><td>Ссылка</td></tr>');
		$('body').append(table);
	}
})(unsafeWindow);