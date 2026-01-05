// ==UserScript==
// @name           Virtonomica:30 People
// @namespace      Virtonomica
// @description    Расчет, показ и установка рекламы для 30 населений города
// @author         UnclWish
// @version        4.3
// @include        *virtonomic*.*/*/main/unit/view/*/virtasement*
// @downloadURL https://update.greasyfork.org/scripts/20467/Virtonomica%3A30%20People.user.js
// @updateURL https://update.greasyfork.org/scripts/20467/Virtonomica%3A30%20People.meta.js
// ==/UserScript==
var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    var $ = win.$;

	var title=$('#wrapper > div.metro_header > div > div.picture').attr('class');
	var a1=(location.href).slice(-3);
	var a2=$('div.title').text().trim();
	//if (isNaN(a1)) return; //Выход если не главная страница
	//if ((title.search('unit-header-office') != -1) & isNaN(a1)) return; // Выход если офис
	if ($('#mainContent > form > table.infoblock > tbody > tr:nth-child(1) > th').text() == "Рекламируемых товаров:") return;
	//console.log ('Working');
	//console.log($('#mainContent > form > table.infoblock > tbody > tr:nth-child(1) > th').text());
	//if (a2.indexOf("Офис") == -1 ) return; //Выход если главная страница не нашей компании


	function numberFormat (number) {
        number += '';
        var parts = number.split('.');
        var int = parts[0];
        var dec = parts.length > 1 ? '.' + parts[1] : '';
        var regexp = /(\d+)(\d{3}(\s|$))/;
        while (regexp.test(int)) {
            int = int.replace(regexp, '$1 $2');
        }
        return int + dec;
    }

	var form = $('form[name=unit_marketing]');

	var fl_people = parseInt($("[data-name='population']").text().replace(/[^\d]/g, '')),
        fl_tcost = parseFloat($("[data-name='contact_cost']").text().replace(/[^\.\d]/g, '')),
        fl_ccount = parseInt($("[data-name='countact_count']").text().replace(/[^\d]/g, ''));

	var inputview = $('<button class="btn btn-circle btn-success btn-sm">x30</button>').unbind('click').click( function() {
//		var fl_people = parseInt($("input[name='advertData[population]']").val().replace(/ /g, '')),
//            fl_tcost = parseFloat($("input[name='cost']").val().replace(/ /g, '')),
//            fl_ccount = parseInt($("input[name='advertData[contactCount]']").val().replace(/ /g, '')),
            //fl_cost = (fl_tcost / fl_ccount);
        //var fl_val = /([\D]+)*([\d\s]+\.*\d*)/.exec(people)[2].replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "");
        //fl_people = parseInt(fl_val);
        var fl_cost = Math.ceil(fl_people * fl_tcost * 30);
		//console.log(parseInt($("[data-name='population']").text().replace(/[^\d]/g, '')));
		//console.log(parseFloat($("[name='cost']").val().replace(/ /g, '')));
        //console.log(fl_people);
		//console.log(fl_tcost);
		//console.log(fl_ccount);
		if (isNaN(fl_cost))
            $("#out_p").text('Не выбрано размещение рекламы');
        else
        $("#out_p").text( numberFormat(fl_people * 30) +' = ©' + numberFormat(fl_cost));
    });

    var input30 = $('<button class="btn btn-circle btn-success btn-sm">x30</button>').unbind('click').click( function() {
		var fl_cost = Math.ceil(fl_people * fl_tcost * 30);
		if ($('input[name="type_ids[]"]:checked').length)
		{
        //console.log(!$('input[name="type_ids[]"]:checked').length);
		$("input[name='cost']").val(fl_cost);
        //refresh (fl_cost);
		$(form).submit();
		}
		else $("#out_p").text('Не выбрано размещение рекламы');
    });

    var input1 = $('<button class="btn btn-circle btn-success btn-sm">x1</button>').unbind('click').click( function() {
		var fl_cost = Math.ceil(fl_people * fl_tcost);
		if ($('input[name="type_ids[]"]:checked').length)
		{
		$("input[name='cost']").val(fl_cost);
        //refresh (fl_cost);
		$(form).submit();
		}
		else $("#out_p").text('Не выбрано размещение рекламы');
    });

    var input2 = $('<button class="btn btn-circle btn-success btn-sm">x2</button>').unbind('click').click( function() {
		var fl_cost = Math.ceil(fl_people * fl_tcost * 2);
		if ($('input[name="type_ids[]"]:checked').length)
		{
		$("input[name='cost']").val(fl_cost);
        //refresh (fl_cost);
		$(form).submit();
		}
		else $("#out_p").text('Не выбрано размещение рекламы');
    });

	var input3 = $('<button class="btn btn-circle btn-success btn-sm">x3</button>').unbind('click').click( function() {
		var fl_cost = Math.ceil(fl_people * fl_tcost * 3);
		if ($('input[name="type_ids[]"]:checked').length)
		{
		$("input[name='cost']").val(fl_cost);
        //refresh (fl_cost);
		$(form).submit();
		}
		else $("#out_p").text('Не выбрано размещение рекламы');
    });

	var input5 = $('<button class="btn btn-circle btn-success btn-sm">x5</button>').unbind('click').click( function() {
		var fl_cost = Math.ceil(fl_people * fl_tcost * 5);
		if ($('input[name="type_ids[]"]:checked').length)
		{
		$("input[name='cost']").val(fl_cost);
        //refresh (fl_cost);
		$(form).submit();
		}
		else $("#out_p").text('Не выбрано размещение рекламы');
    });

	var input6 = $('<button class="btn btn-circle btn-success btn-sm">x6</button>').unbind('click').click( function() {
		var fl_cost = Math.ceil(fl_people * fl_tcost * 6);
		if ($('input[name="type_ids[]"]:checked').length)
		{
		$("input[name='cost']").val(fl_cost);
        //refresh (fl_cost);
		$(form).submit();
		}
		else $("#out_p").text('Не выбрано размещение рекламы');
    });

    var input10 = $('<button class="btn btn-circle btn-success btn-sm">x10</button>').unbind('click').click( function() {
		var fl_cost = Math.ceil(fl_people * fl_tcost * 10);
		if ($('input[name="type_ids[]"]:checked').length)
		{
		$("input[name='cost']").val(fl_cost);
        //refresh (fl_cost);
		$(form).submit();
		}
		else $("#out_p").text('Не выбрано размещение рекламы');
    });

    var input20 = $('<button class="btn btn-circle btn-success btn-sm">x20</button>').unbind('click').click( function() {
		var fl_cost = Math.ceil(fl_people * fl_tcost * 20);
		if ($('input[name="type_ids[]"]:checked').length)
		{
		$("input[name='cost']").val(fl_cost);
        //refresh (fl_cost);
		$(form).submit();
		}
		else $("#out_p").text('Не выбрано размещение рекламы');
    });

    var inputmax = $('<button class="btn btn-circle btn-primary btn-sm">MAX</button>').unbind('click').click( function() {
		var fl_cost = Math.ceil(fl_people * fl_tcost * 1600);
		if ($('input[name="type_ids[]"]:checked').length)
		{
		$("input[name='cost']").val(fl_cost);
        //refresh (fl_cost);
		$(form).submit();
		}
		else $("#out_p").text('Не выбрано размещение рекламы');
    });

    var inputviewmax = $('<button class="btn btn-circle btn-primary btn-sm">MAX</button>').unbind('click').click( function() {
		var fl_cost = Math.ceil(fl_people * fl_tcost * 1600);
        if (isNaN(fl_cost))
            $("#out_p").text('Не выбрано размещение рекламы');
        else
            $("#out_p").text( numberFormat(fl_people*1600) +' = $' + numberFormat(fl_cost));
    });

    var correctmax = $('<button class="btn btn-circle btn-primary btn-sm">Корректировка</button>').unbind('click').click( function() {
		var fl_cost = parseFloat($("input[name='cost']").val().replace(/ /g, '')),
            fl_eff = parseFloat($("[data-name='productivity']").text().replace(/[^\.\d]/g, ''));
        if (fl_eff===0) $("#out_p").text('Скорректировать сумму рекламы для 100% эффективности можно только после выбора размещения рекламы, для новых подразделений - на следующий пересчет после создания подразделения');
        if ((fl_eff>0)&(fl_eff<100)) {
            fl_cost = fl_cost * (fl_eff / 100);
			if ($('input[name="type_ids[]"]:checked').length)
			{
			$("input[name='cost']").val(fl_cost);
        	//refresh (fl_cost);
			$(form).submit();
			}
			else $("#out_p").text('Не выбрано размещение рекламы');
			}
        if (fl_eff===100) $("#out_p").text('Корректировка суммы рекламы не требуется - квалификации вашего топ-менеджера достаточно');
    });

    $('#virtasement').before('<div id=out_p align=center>').before('<b>Скрипт установки рекламы под 30 населений<br>').before('Просмотр: ').before(inputview).before(inputviewmax).before('<br>').before('Установка:').before(input30).before(input1).before(input2).before(input3).before(input5).before(input6).before(input10).before(input20).before(inputmax).before('<br>').before('Исправление максимальной рекламы под квалификацию:').before(correctmax);
//    $("table.tabsub").after(inputmax).after(input3).after(input2).after(input1).after(input).after('<div id=out_p>');

};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);