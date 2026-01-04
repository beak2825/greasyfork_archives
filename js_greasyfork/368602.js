// ==UserScript==
// @name         Rambler: Анька
// @version      1.00.1
// @description  Ну тут как бы всё ясно
// @author       Agor71
// @include      http*://rb.mail.ru/ads/campaigns/*
// @namespace https://greasyfork.org/users/10556
// @downloadURL https://update.greasyfork.org/scripts/368602/Rambler%3A%20%D0%90%D0%BD%D1%8C%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/368602/Rambler%3A%20%D0%90%D0%BD%D1%8C%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function (w) {
	function main() {
		//Дата начала. Формат ДД-ММ-ГГГГ ('27-05-2018')
		var dateBegin = '01-04-2018';

		//Дата конца. Формат ДД-ММ-ГГГГ ('27-05-2018')
		var dateEnd ='30-04-2018';

        //Puid первый и второй. Пуид 1 - тип утройства, пуид 2 - площадка
        var puid1 = '';
        var puid2 = '';

		//Список кампаний. По одной штуке на строку, разделитель - новая строка. Обратить внимание, что первая и последняя строка расположены на одной строке с открывающей и закрывающей кавычками. Иначе будут возникать лишние сущности
		var listRK = `9856871
10066479
9753796
9753777
9961834
9755810
9961809
10367285
9756320
9961873
9652235
10368033
10368217`;
		var list = listRK.split('\n');

		//Создаём таблицу
		var table = $('<table>').append('<tr><td>№ РК</td><td>Хронометраж</td><td>Досмотры</td></tr>');

		var storage, chrono, views;
		$(list).each(function(i){
			//Берём хронометраж
			$.ajax({
				url: 'https://rb.mail.ru/ads/campaigns/' + list[i] + '/gpmd/statistics/?date_from=' + dateBegin + '&date_to=' + dateEnd + '&date_type=day&puid1=' + puid1 + '&puid2=' + puid2 + '&puid3=',
                async: false,
				type: 'get',
				success: function(html){
					storage = $(html);
					chrono = parseInt(storage.find('td.value-left.nowrap.text-content-restricted-by-width').eq(0).text());
				}
			});

			//Берём досмотры
			$.ajax({
				url: 'https://rb.mail.ru/ads/campaigns/' + list[i] + '/gpmd/event_statistic/?date1=' + dateBegin + '&date2=' + dateEnd + '&date_type=day&puid1=' + puid1 + '&puid2=' + puid2 + '&puid3=',
                async: false,
				type: 'get',
				success: function(html){
					storage = $(html);
					var num = storage.find('table.table > tbody > tr:contains("Телеметрия: Видео просмотрено полностью (1004)")')[0].rowIndex;;
					views = storage.find('div.overflow > table > tbody > tr').eq(num-2).children().last().text().replace(/\s/g,'').replace('.',',');
				}
			});

			//Заполняем таблицу
			$(table).append('<tr><td>' + list[i] + '</td><td>' + chrono + '</td><td>' + views + '</td></tr>');
			$('body').append(table);
		});
	}

	//Создаём кнопку
	var button = $('<button>').attr('style','font: 11px Tahoma;').append('Спарсить').click(function() {
		main();
	});
	$('div.logout').append(button);

})(unsafeWindow);