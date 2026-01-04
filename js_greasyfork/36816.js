// ==UserScript==
// @name		Youforce Kilometers Declareren
// @description	Met dit script kun je makkelijk een hele maand declareren in Youforce.
// @version		3
// @namespace	https://login.youforce.biz/hss_hre_prod/hss.net/Formulieren/Declaraties.aspx
// @grant GM_getValue
// @grant GM_setValue
// @require		http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @include		https://login.youforce.biz/hss_hre_prod/hss.net/Formulieren/Declaraties.aspx*
// @downloadURL https://update.greasyfork.org/scripts/36816/Youforce%20Kilometers%20Declareren.user.js
// @updateURL https://update.greasyfork.org/scripts/36816/Youforce%20Kilometers%20Declareren.meta.js
// ==/UserScript==

$(document).ready(function() {

	the_fpSpread.spreads[0].SetValue(9, 3, GM_getValue('omschrijving', ''));
	the_fpSpread.spreads[0].SetValue(9, 4, GM_getValue('postcodeVan', ''));
	the_fpSpread.spreads[0].SetValue(9, 5, GM_getValue('postcodeNaar', ''));
	the_fpSpread.spreads[0].SetValue(9, 6, GM_getValue('rit', 'Enkele rit'));
	the_fpSpread.spreads[0].SetValue(9, 7, GM_getValue('kilometers', ''));

	var workdays = GM_getValue('workdays', [1, 2, 3, 4, 5]);

	var nav = $('#knoppenbalkStatusEnNavigatieKnoppen');
	nav.append('<p>Let op vakanties en dergelijke!</p>');

	nav.append($('<span>werkdagen: </span>'));
	nav.append($('<span><input type="checkbox" id="maandag" name="workdays[]" value="1"> <label for="maandag">maandag</label></span>'));
	nav.append($('<span><input type="checkbox" id="dinsdag" name="workdays[]" value="2"> <label for="dinsdag">dinsdag</label></span>'));
	nav.append($('<span><input type="checkbox" id="woensdag" name="workdays[]" value="3"> <label for="woensdag">woensdag</label></span>'));
	nav.append($('<span><input type="checkbox" id="donderdag" name="workdays[]" value="4"> <label for="donderdag">donderdag</label></span>'));
	nav.append($('<span><input type="checkbox" id="vrijdag" name="workdays[]" value="5"> <label for="vrijdag">vrijdag</label></span>'));
	
	$('input[name="workdays[]"]').each(function () {
		if (workdays.includes(parseInt($(this).val()))) {
			$(this).prop('checked', 'checked');
		}
	});

	var button = $('<input type="button" value="Vul rest van maand vanaf eerste rij">');
	button.click(fill);
	nav.append(button);

	nav.children().css('margin-left', '10px');

	function fill() {
	
		var dateString = the_fpSpread.spreads[0].GetValue(9, 1);
		var omschrijving = the_fpSpread.spreads[0].GetValue(9, 3);
		var postcodeVan = the_fpSpread.spreads[0].GetValue(9, 4);
		var postcodeNaar = the_fpSpread.spreads[0].GetValue(9, 5);
		var rit = the_fpSpread.spreads[0].GetValue(9, 6);
		var kilometers = the_fpSpread.spreads[0].GetValue(9, 7);

		workdays = []
		$('input[name="workdays[]"]:checked').each(function () {
			workdays.push(parseInt($(this).val()));
		});

		GM_setValue('omschrijving', omschrijving);
		GM_setValue('postcodeVan', postcodeVan);
		GM_setValue('postcodeNaar', postcodeNaar);
		GM_setValue('rit', rit);
		GM_setValue('kilometers', kilometers);
		
		GM_setValue('workdays', workdays);

		var parts = dateString.split('-');
		var date = new Date(parts[2], parseInt(parts[1]) - 1, parts[0]);
		var daysInMonth = new Date(parts[2], parts[1], 0).getDate();

		var rowIndex = 9
		for (var i = date.getDate(); i <= daysInMonth; i++) {

			if (workdays.includes(date.getDay())) {
				the_fpSpread.spreads[0].SetValue(rowIndex, 1, date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());
				the_fpSpread.spreads[0].SetValue(rowIndex, 3, omschrijving);
				the_fpSpread.spreads[0].SetValue(rowIndex, 4, postcodeVan);
				the_fpSpread.spreads[0].SetValue(rowIndex, 5, postcodeNaar);
				the_fpSpread.spreads[0].SetValue(rowIndex, 6, rit);
				the_fpSpread.spreads[0].SetValue(rowIndex, 7, kilometers);
				rowIndex++;
			}

			date.setDate(date.getDate() + 1);
		}

		while (rowIndex < 34) {
			the_fpSpread.spreads[0].SetValue(rowIndex, 1, '');
			the_fpSpread.spreads[0].SetValue(rowIndex, 3, '');
			the_fpSpread.spreads[0].SetValue(rowIndex, 4, '');
			the_fpSpread.spreads[0].SetValue(rowIndex, 5, '');
			the_fpSpread.spreads[0].SetValue(rowIndex, 6, '');
			the_fpSpread.spreads[0].SetValue(rowIndex, 7, '');
			rowIndex++;
		}
		
		the_fpSpread.spreads[0].UpdatePostbackData();
		the_fpSpread.spreads[0].Update();
	}
});