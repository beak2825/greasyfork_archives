// ==UserScript==
// @name            Autocomplete_forms
// @author          ZIKYN ILIA
// @description     Автозаполнение форм
// @version         1
// @include         *lk.dom.mos.ru/wps/myportal/users/731/form2*
// @encoding 	    utf-8
// @namespace https://greasyfork.org/users/12821
// @downloadURL https://update.greasyfork.org/scripts/15475/Autocomplete_forms.user.js
// @updateURL https://update.greasyfork.org/scripts/15475/Autocomplete_forms.meta.js
// ==/UserScript==



(function (window, undefined) {
	var w;
	if (typeof unsafeWindow != undefined) {
		w = unsafeWindow
	} else {
		w = window;
	}
	if (w.self != w.top) {
		return;
	}

	document.getElementById('bpTaskFrame_ns_Z7_6H0EHG42KGTN80AEVGQFDM10S7_').addEventListener("load", loaded, false);

	function loaded (){
		fr = w.frames[0];

		var r_search_page_2_3 = new RegExp('Раскрытие\\sинформации\\sпо\\s731\\-ПП\\.\\sФорма\\s2\\.3','i');
		if (searchTruth(r_search_page_2_3, fr.document.getElementById('div_5_1_1').getElementsByTagName('span')[0].innerHTML)) {
			var btn = document.createElement('input');
			var txt = document.createElement('textarea');
			btn.id = 'b1';
			txt.id = 'txt';
			btn.type = 'button';
			btn.value = 'Заполнить';
			btn.addEventListener('click', function() {fillFields();}, false);
			fr.document.getElementById('div_5_1_3_1_1').appendChild(btn);
			document.body.appendChild(txt);

			function fillFields() {
				var step = 0;
				var data = document.getElementById('txt');
				var err_mess = 'Не корректная периодичность, либо ед. измерений, в строках: ';
				var r_search_in_file = new RegExp('^(\\d{1,3}[\\.0-9]*?),(\\".*?\\"|.{1,}?),(\\".*?\\"|.*?|),(.*?|),(\\"[\\,0-9]*?\\"|\\s*?|),(\\"[\\,0-9]*?\\"|\\s*?|),(\\"[\\,0-9]*?\\"|\\s*?|)$','gim');
				var r_search_in_str = new RegExp('^(\\d{1,3}[\\.0-9]*?),(\\".*?\\"|.{1,}?),(\\".*?\\"|.*?|),(.*?|),(\\"[\\,0-9]*?\\"|\\s*?|),(\\"[\\,0-9]*?\\"|\\s*?|),(\\"[\\,0-9]*?\\"|\\s*?|)$','i');
				var lines_file = data.value.match(r_search_in_file);

				var r_repl = new RegExp('"','gi');
				for (var i=0; i<lines_file.length; i++) {
					var vals_line = lines_file[i].match(r_search_in_str);
					//console.log(vals_line[1]);

					vals_line[4] = vals_line[4].trim();
					vals_line[5] = vals_line[5].replace(r_repl, '');
					vals_line[5] = vals_line[5].trim();
					vals_line[6] = vals_line[6].replace(r_repl, '');
					vals_line[6] = vals_line[6].trim();
					vals_line[7] = vals_line[7].replace(r_repl, '');
					vals_line[7] = vals_line[7].trim();

					while (fr.document.getElementById('div_5_1_7_1_r'+step).getElementsByTagName('span')[0].innerHTML < vals_line[1]) {
						//Очищаем ячейки строки, если в документе-доноре такой нет
						var str = fr.document.getElementById('div_5_1_7_1_r'+step); //Строка формы №-step
						str.getElementsByTagName('input')[0].value='0';
						str.getElementsByTagName('input')[0].focus();
						str.getElementsByTagName('input')[1].value='0';
						str.getElementsByTagName('input')[1].focus();
						str.getElementsByTagName('input')[2].value='0';
						str.getElementsByTagName('input')[2].focus();
						str.getElementsByTagName('input')[3].value='0';
						str.getElementsByTagName('input')[3].focus();

						if (str.getElementsByTagName('select')[0].options.selectedIndex == 0) {
							str.getElementsByTagName('select')[0].options[20].selected = 'true';
							str.getElementsByTagName('select')[0].focus();
						}
						if (str.getElementsByTagName('select')[1].options.selectedIndex == 0) {
							str.getElementsByTagName('select')[1].options[47].selected = 'true';
							str.getElementsByTagName('select')[1].focus();
						}

						step++;
					}

					if (fr.document.getElementById('div_5_1_7_1_r'+step).getElementsByTagName('span')[0].innerHTML == vals_line[1]) {
						var str = fr.document.getElementById('div_5_1_7_1_r'+step); //Строка формы №-step
						var num_per = str.getElementsByTagName('input')[0];
						var total_cost = str.getElementsByTagName('input')[3];

						if (num_per.style.display == 'none' && total_cost.style.display == 'none') {
							step++;
							continue;
						} else if (num_per.style.display == 'none' && total_cost.style.display != 'none') {
							var total_cost = str.getElementsByTagName('input')[3];
							if (vals_line[7] != '') {
								var r_repl3 = new RegExp(',','gi');
								vals_line[7] = vals_line[7].replace(r_repl3, '.');
								total_cost.value=vals_line[7];
								total_cost.focus();
							} else total_cost.value='0';
							step++;
							continue;
						} else if (num_per.style.display != 'none' && total_cost.style.display != 'none') {
							vals_line[3] = vals_line[3].replace(r_repl, '');
							var r_repl2 = new RegExp('(\\s*\\(.*?\\)|\\(.*?\\))','i');
							vals_line[3] = vals_line[3].replace(r_repl2, '');
							
							var r_search_num_per = new RegExp('^\\d+','i');
							var r_search_val_per = new RegExp('^\\d{0,}(.*?)$','i');

							var matches = r_search_num_per.exec(vals_line[3]);
							if (matches != null) {
								var num_per_value = matches[0];
							} else var num_per_value = '0';

							var matches = r_search_val_per.exec(vals_line[3]);
							if (matches != null) {
								var val_unit_value = matches[1].trim();
							} else var val_unit_value = '';

							num_per.value=num_per_value;
							num_per.focus();

							if (getNumberToValue(val_unit_value, 'period')) {
								var val_per = str.getElementsByTagName('select')[0].options[getNumberToValue(val_unit_value, 'period')];
								val_per.selected = 'true';
								val_per.focus();
							} else err_mess += vals_line[1]+' ';
							if (getNumberToValue(vals_line[4], 'unit')) {
								var val_unit = str.getElementsByTagName('select')[1].options[getNumberToValue(vals_line[4], 'unit')];
								val_unit.selected = 'true';
								val_unit.focus();
							} else err_mess += vals_line[1]+' ';

							var r_repl3 = new RegExp(',','gi');
							var volume = str.getElementsByTagName('input')[1];
							if (vals_line[5] != '') {
								vals_line[5] = vals_line[5].replace(r_repl3, '.');
								volume.value=vals_line[5];
							} else volume.value='0';
							volume.focus();

							var cost = str.getElementsByTagName('input')[2];
							if (vals_line[6] != '') {
								vals_line[6] = vals_line[6].replace(r_repl3, '.');
								cost.value=vals_line[6];
							} else cost.value='0';
							cost.focus();

							var total_cost = str.getElementsByTagName('input')[3];
							if (vals_line[7] != '') {
								vals_line[7] = vals_line[7].replace(r_repl3, '.');
								total_cost.value=vals_line[7];
							} else total_cost.value='0';
							total_cost.focus();
						}
						step++;
					}
				}
				
				if (vals_line[1] < fr.document.getElementById('div_5_1_7_1_r'+step).getElementsByTagName('span')[0].innerHTML) {
					while (fr.document.getElementById('div_5_1_7_1_r'+step).getElementsByTagName('span')[0].innerHTML) {
						//Очищаем ячейки строки, если в документе-доноре такой нет
						var str = fr.document.getElementById('div_5_1_7_1_r'+step); //Строка формы №-step
						str.getElementsByTagName('input')[0].value='0';
						str.getElementsByTagName('input')[0].focus();
						str.getElementsByTagName('input')[1].value='0';
						str.getElementsByTagName('input')[1].focus();
						str.getElementsByTagName('input')[2].value='0';
						str.getElementsByTagName('input')[2].focus();
						str.getElementsByTagName('input')[3].value='0';
						str.getElementsByTagName('input')[3].focus();

						if (str.getElementsByTagName('select')[0].options.selectedIndex == 0) {
							str.getElementsByTagName('select')[0].options[20].selected = 'true';
							str.getElementsByTagName('select')[0].focus();
						}
						if (str.getElementsByTagName('select')[1].options.selectedIndex == 0) {
							str.getElementsByTagName('select')[1].options[47].selected = 'true';
							str.getElementsByTagName('select')[1].focus();
						}

						step++;
					}
				}

				if (err_mess != 'Не корректная периодичность, либо ед. измерений, в строках: ') {
					alert(err_mess.trim()+'. Исправьте их вручную.');
				}
				/*var xmlhttp = getXmlHttp();
		alert('1');
		xmlhttp.open('GET', '4.csv', false);
		alert('2');
		xmlhttp.send(null);
		alert('3');
		if (xmlhttp.status == 200) {
			var response = xmlhttp.responseText;
			alert(response);
		} else {
			alert('Не удалось открыть файл с данными');
		}*/
			}
		}
	}

	function getXmlHttp() {
		var xmlhttp;
		try {
			xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (E) {
				xmlhttp = false;
			}
		}
		if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
			xmlhttp = new XMLHttpRequest();
		}
		return xmlhttp;
	}

	function searchTruth(r, str) {
		if (str.search(r) != -1) {
			return true;
		} else {
			return false;
		}
	}

	function getNumberToValue(val, type) {
		var result;
		if (type=='period') {
			switch(val) {
				case '': result = '20';
					break;
				case 'раз в день, кроме праздничных и воскресных дней': result = '1';
					break;
				case 'В течение часов после снегопада': result = '2';
					break;
				case 'Работа не выполняется': result = '3';
					break;
				case 'Незамедлительное реагирование с момента получения заявки': result = '4';
					break;
				case 'В течение часов с момента получения заявки': result = '5';
					break;
				case 'В течении суток с момента получения заявки': result = '6';
					break;
				case 'В течение часов после обнаружения': result = '7';
					break;
				case 'В течение суток после обнаружения': result = '8';
					break;
				case 'раз в день': result = '9';
					break;
				case 'раз в месяц': result = '10';
					break;
				case 'раз в квартал': result = '11';
					break;
				case 'раз в год': result = '12';
					break;
				case 'Круглосуточно': result = '13';
					break;
				case 'раз в сутки при температуре воздуха более 25 градусов': result = '14';
					break;
				case 'В ходе подготовки к эксплуатации дома в осенне-зимний период': result = '15';
					break;
				case 'В ходе подготовки к эксплуатации дома в весенне-летний период': result = '16';
					break;
				case 'Осмотр раз в год. По итогам осмотра работы включаются в план текущего ремонта': result = '17';
					break;
				case 'Устранение по мере обнаружения дефектов': result = '18';
					break;
				case 'по предписанию надзорного/контрольного органа': result = '19';
					break;
				case 'по мере необходимости': result = '20';
					break;
				case 'раз в неделю': result = '21';
					break;
				case 'раз в день, кроме праздничных и выходных дней': result = '22';
					break;
				default: result = false;
			}
		}

		if (type=='unit') {
			switch(val) {
				case '': result = '47';
					break;
				case '%': result = '1';
					break;
				case '°С*сут': result = '2';
					break;
				case 'Вт/(куб. м*°С)': result = '3';
					break;
				case 'Вт/кв. м': result = '4';
					break;
				case 'ГВт.ч': result = '5';
					break;
				case 'Гкал': result = '6';
					break;
				case 'Гкал*час/кв. м': result = '7';
					break;
				case 'Гкал/год': result = '8';
					break;
				case 'Гкал/кв. м': result = '9';
					break;
				case 'Гкал/час': result = '10';
					break;
				case 'КХ': result = '11';
					break;
				case 'МВт': result = '12';
					break;
				case 'Руб/Гкал': result = '13';
					break;
				case 'Руб/кВт.ч': result = '14';
					break;
				case 'Руб/м3': result = '15';
					break;
				case 'дн.': result = '16';
					break;
				case 'ед.': result = '17';
					break;
				case 'кВА': result = '18';
					break;
				case 'кВт': result = '19';
					break;
				case 'кВт*ч': result = '20';
					break;
				case 'кВт.ч': result = '21';
					break;
				case 'кВт.ч/сут': result = '22';
					break;
				case 'кВт/кв. м': result = '23';
					break;
				case 'кВт/м': result = '24';
					break;
				case 'кВт/ч': result = '25';
					break;
				case 'кв. м': result = '26';
					break;
				case 'кг': result = '27';
					break;
				case 'кг/кв. м': result = '28';
					break;
				case 'ккал': result = '29';
					break;
				case 'ккал/ч': result = '30';
					break;
				case 'км': result = '31';
					break;
				case 'куб. м': result = '32';
					break;
				case 'куб. м/квартира': result = '33';
					break;
				case 'куб. м/сут': result = '34';
					break;
				case 'куб. м/чел.': result = '35';
					break;
				case 'куб. м/чел. в мес.': result = '36';
					break;
				case 'м': result = '37';
					break;
				case 'млн т': result = '38';
					break;
				case 'нор. м3': result = '39';
					break;
				case 'пог. м': result = '40';
					break;
				case 'руб.': result = '41';
					break;
				case 'тыс кВт.ч': result = '42';
					break;
				case 'тыс м3': result = '43';
					break;
				case 'тыс. руб.': result = '44';
					break;
				case 'час': result = '45';
					break;
				case 'чел.': result = '46';
					break;
				case 'шт.': result = '47';
					break;
				default: result = false;
			}
		}
		return result;
	}
})(window);