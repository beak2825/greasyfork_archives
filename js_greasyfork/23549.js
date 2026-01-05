// ==UserScript==
// @name           Atlantis Konglomerat top manager info
// @namespace      virtonomica
// @version        1.02
// @description    Расширенная информация об опыте в Квалификации
// @include        *virtonomic*.*/*/main/user/privat/persondata/knowledge
// @downloadURL https://update.greasyfork.org/scripts/23549/Atlantis%20Konglomerat%20top%20manager%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/23549/Atlantis%20Konglomerat%20top%20manager%20info.meta.js
// ==/UserScript==

var run = function() {
	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
   	$ = win.$;

	/**
	* записать данные в локальное хранилище, с проверкой ошибок
	*/
	function ToStorage(name,  val) {
		try {
			window.localStorage.setItem( name,  JSON.stringify( val ) );
		} catch(e) {
			out = "Ошибка добавления в локальное хранилище";
			//console.log(out);
		}
	}

	function getFromStorage(obj, id_shop) {
		if (obj[id_shop] == null) return '';
		return JSON.stringify(obj[id_shop]);
	}

	// получить строку с показателем успешности роста
	// key - идентификационный номер квалификации
	// Kn  -  уровень квалификации
	// kv_up - прирост квалы
	// kv0 - квала без штрафа
	function getOptimal(key, kn, kv_up, kv0){
		if ( isNaN(kv_up) ) {
			kv_up = 0;
			return "&nbsp;";
		}
		// максимально возможный прирост
		var max = 0.9999409*Math.pow(kn, -0.569406) ;
		// коррекция на штрафа
		var delta = kn-kv0-1;
		if (delta > 0) {
			kv_up *= Math.pow(1.05, delta );
		}
		var ups = Math.floor( (kv_up * 10) / (max *10) );
		var color = '#228822';
		if (key === 422124 && ups < 79 // макс рост по электроэнергетике - 79%
			|| key === 422788 && ups < 69 // макс рост по авторемонту и автозаправкам - 69%
			|| key !== 422124 && key !== 422788 && ups < 97) {
			color = 'red';
		}
		return "<font color=" + color + ">" + ups + "%</font>";
	}
	// сколько пересчетов до роста
	// exp - текущее значение опыта по квалификации
	// up - текущий прирост квалы
	function getLastDays( exp,  up) 
	{
		if ( isNaN(up) ) {
			return "&nbsp;";
		}
		var last = 100 - exp;
		var days = last / up;
		return Math.ceil( days);
	}	

	//
	// Число дней на изучение без штрафа
	//
	function getLastDays2(exp,  up, kv, kv0) 
	{
		if ( isNaN(up) ) {
			return "";
		}
		if (kv0 == undefined) return "";
		if (kv0 == 0 ) return "";

		var delta = kv-kv0-1;
		if (delta <= 0) return "";

		var last = 100 - exp;
		var x = Math.pow(1.05, delta );

		var days = last / up / x;

		return Math.ceil( days);
	}

	function getPenalty( kv, kv0) {
		if (kv0 == undefined) return "";
		if (kv0 == 0 ) return "";

		var delta = kv-kv0-1;
		//console.log("delta=" + kv + " - " + kv0 + " = " + delta);
		if (delta <= 0) return "<b>" + kv0 + "</b><br>";

		var x = 1/Math.pow(1.05, delta );
		ret =  Math.round(x*10000) /100;
		return  "<b>" + kv0 + "</b><br><font color=darkblue>" +ret + "%</font>";
	}
	
	// скрываем напоминание о снятии штрафа
	$("td.info_col").hide();
	$("td.info_col").prev().hide();

	// скрываем информацию для нубов
	$('p:contains("Чем выше уровень")').hide();
	$('h1:contains("Квалификация")').hide();
	$('h3:contains("Доступно очков для конвертации в квалификацию")').hide();

	// скрыть деньги
	//$("span.money").hide();

	// скрыть большую картинку
	$(".qual_illustration").hide();

	// скрыть заголовки
	$("th.header").hide();
	var headers2 = $("th.header2");
	headers2.parent().hide();

	// скрыть названия квал
	$("div[id^=\"nm\"]").hide();

	// еще освободить немного места
	$("#mainContent").css("padding-top", "0px");

	// меняем цвет опыта
	//$("div.fill1").css("background-color","black");
	// меняем цвет прироста
	//$("tr.odd td:last-child").css("color","black");//#228822
	// меняем цвет текста
	$("div.text").css("color", "black");
	// меняем цвет бонусной квалы
	$("span.bonusValue").css("color", "white");
	$("div.fill2").css("background-color", "#9fef5f");

	// меняем z-индексы
	$("div.fill2").css("z-index", "0");
	$("div.fill1").css("z-index", "1");
	$("div.text").css("z-index", "1");

	// меняем фон строк в таблице с параметрами
	//$("tr.odd").css("background-color", "white");

	// меняем цвета кнопок в квалификации
	//$("input", $("tr.odd", form ) ).css("background-color", "#B0B0FF").css("color","black");

	var i = 0;
	// имя пользователя
	var UserName= $("#fio").text();
	// Реалм
	var realm = /^http[s]?:\/\/virtonomic[as]\.(\w+)\/(\w+)\/\w+\//.exec(location.href)[2];
	// Идентификационная строка блока записей
	var idx_string = realm + "_" + UserName;

	// массив соответствий порядку квалификаций их ИД
	var kv_link = new Array;
	// Цикл по всем квалификациям
	// gaKnowledgeLevel - массив из игры, содержащий значения всех квалификаций
	//i = 0;
	//for (var key in gaKnowledgeLevel) {
	//    	kv_link[i] = key;
	//	i++;
	//}

	// число квалификаций
	var nkval = $("tr.qual_item").length;

	var i = 0;
	var k = 0;
	var exp = new Object();
	// массив с данными по приросту
	var up = new Object();
	var form = $("table.qual");
	var ncol = $("tr.qual_item td", form).length / nkval;
	// Ищем текущий опыт и прирост по квалификациям
	$("tr.qual_item td", form).each(function() {
		var indx = i;	     	// номер столбца
		indx = indx % ncol;		// номер колонки
		if (indx == 3)  {
			var textDivVal = $("div.text", $(this)).text();
			curExp = parseFloat(textDivVal.substr(0, textDivVal.indexOf("%") - 1));
			var spanText = $("span", $("div.text", $(this))).text();
			curUp = parseFloat(spanText.substr(spanText.indexOf(":") + 1));
		}
		if (indx == 5)  {
			key = kv_link[k] = parseInt($(this).attr('id').substr(1));
			exp[key] = curExp;
			up[key] = curUp;
			k++;
		}
		i++;
	});

	kvala_save = JSON.parse( window.localStorage.getItem('kvala_save') );
   	if ( kvala_save == null ) kvala_save = new Object();
	if ( kvala_save[idx_string] == null ) kvala_save[idx_string]  = new Object();
	// временный код - чистим хранилище от старых данных
	for (var key in kvala_save) {
	    	if (key<10) delete kvala_save[key];
	}

	i = 0;
	$("tr.qual_item td:last-child", form).each(function() {
		key = kv_link[i];
		console.log("key=" + key + ", exp[key]=" + exp[key] + ", up[key]=" + up[key] + ", kvala_save=" + kvala_save[ idx_string ][ key ]);
		str = getOptimal(key, gaKnowledgeLevel[ key ], up[ key ], kvala_save[ idx_string ][ key ] );
		$(this).parent().append("<td id=up_"+ key +">" + str + "");
		// сколько пересчетов до роста
		str = "<td id=day_" + key;// + " help='";
		d = getLastDays2(  exp[ key ] , up[ key ], gaKnowledgeLevel[ key ], kvala_save[ idx_string ][ key ] );
		str += ">" + getLastDays(exp[ key ] , up[ key ]);

		$(this).parent().append( str );
		i++;
	});

	//$("tr.qual_item td:first-child", form).append("<br>");

	// Добавляем иконку в начале каждой строки
	el = $("tr.qual_item td:first-child", form);
	var i= 1;
	for(k=0; k < el.length; k++) {
		key = kv_link[ k ];
		val = gaKnowledgeLevel[ key ];
		if ( kvala_save[ idx_string ][ key ] == undefined) kvala_save[ idx_string ][ key ] = 0;
		if ( kvala_save[ idx_string ][ key ] > 1) val = kvala_save[ idx_string ][ key ];
		var txt = "<br><h3>Сохраняем данные о квалификации</h3><br>";
		txt += "Введите значение квалификации, <br>которая была после последнего улучшения за очки:<br><center><input id=kv_value_" + key + " value=" + val +" style='background:white'></input>";
		txt += "<br><br><img src=http://www.iconsearch.ru/uploads/icons/ultimategnome/48x48/stock_export.png id=kv_btn_"+key+" help=" +key+" title='Запомнить в локальном хранилище' style='cursor:pointer'><br><br></center>";
		var div_form = "<div id=kv_set_" +key+" style='padding:8px; background: none repeat scroll 0% 0% rgb(223, 223, 223); z-index: 1002; position: absolute; border: 1px solid rgb(0, 0, 0); display: none;'>" + txt + "</div>";
		el.eq(k).after("<td align=center><span id=kv_info_" + key + " >" + getPenalty( gaKnowledgeLevel[ key ],  kvala_save[ idx_string ][ key ] ) + "</span>");
		el.eq(k).after(div_form);
		el.eq(k).after("<td width=\"1%\"><img help=\"" + key + "\" src=\"http://www.iconsearch.ru/uploads/icons/musthave/32x32/settings.png\" style=\"cursor:pointer\"></td>");
	}

	// функция клика по иконке
	var img = $("img[help]");
	img.click( function() {
		n_kv = $(this).attr('help');
		str = "#kv_set_" + n_kv;
		$(str).toggle();
	});

	// сохранить значение квалы в хранилище и спрятать окошко
	$("img[id^='kv_btn_']").click( function() {
		n_kv = $(this).attr('help');
		kvala_save[idx_string][n_kv] = $("#kv_value_" +n_kv).attr('value');
		$("#kv_info_" + n_kv).html( kvala_save[idx_string][n_kv] );
		ToStorage('kvala_save', kvala_save);
		$("#kv_set_" + n_kv).hide();

		str = getPenalty( gaKnowledgeLevel[n_kv],  kvala_save[idx_string][n_kv] );
		$("#kv_info_" + n_kv). html(  str );

		str = getOptimal(n_kv, gaKnowledgeLevel[ n_kv ], up[ n_kv ], kvala_save[idx_string][ n_kv ] );
		$("#up_"+ n_kv).html( str );

		d = getLastDays2(  exp[ n_kv ] , up[ n_kv ], gaKnowledgeLevel[ n_kv ], kvala_save[ idx_string ][ n_kv ] );
		str = '';
		if (d != '') str = "Число дней до изучения при отсутсвии штрафа: " + d ;
		$("#day_" + n_kv).attr('help', str );

	});

	// рисуем шапку
	var table = $("table.qual tbody");

	var helpbar = "<br><div style='background:#DFDFDF; z-index:2; position:absolute;" 
	+ "border:solid 1px #000000; display: none; padding:8px; " 
	+ "border-radius: 4px 4px 4px 4px; box-shadow: 0 1px 3px 0 #999999;' "
	+ "id='helpbar'><span id=helpbar_text>&nbsp;</span></div>";

	var my_header = "<th>&nbsp;<th class='header2' help='Задать последнюю квалификацию,<br>не имеющую штрафа'>Квала"; 
	my_header+= "<th class='header2' help='Запомненная квалификация и размер штрафа на рост.<br>(100% означает, что штраф отсутствует)'>Штраф";
	my_header+= "<th>&nbsp;<th>&nbsp;<th class='header2' help='Текущий опыт и его рост'>Текущее значение и прирост опыта";
	my_header+= "<th class='header2' help='Идеальность роста<br>(с учетом действующего штрафа)'>Идеал";
	my_header+= "<th class='header2' help='Число дней до увеличения уровня квалификации'>Дни";
	$("tr:eq(0)", table).before( my_header );

	//$("#avaliablePointCountToLearn").append(" <span id=xy>")
	table.before( helpbar );

	var wr = $("#wrapper");
	mx = 0;
	//alert( $("td[help]").length );

	$("th,td[help]").mouseover( function() {
		str = $(this).attr('help');
		if (str != undefined) {
			if (str == '') return;
			$("#helpbar").show();

			// размеры экрана
			w = (window.innerWidth ? window.innerWidth : (document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.offsetWidth));
			//h = (window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.offsetHeight));

			newx = mx +20 - wr.position().left ;
			newy = my + 12;
			

			//$("#helpbar_text").html( str + "<br>MX=" + mx + "<br>newx=" + newx + "<br>W=" +w + "<br>WRAPER="  + wr.position().left );
			$("#helpbar_text").html( str );

			wdiv = $("#helpbar").width();
			if (wdiv < 160) {
				document.getElementById("helpbar").style.width = '160px';
				wdiv = 160;
			}
			
			if ( (newx + wdiv  ) > (w - wr.position().left) ) newx = w - $("#helpbar").width() - wr.position().left-20;

			document.getElementById("helpbar").style.left = newx + 'px';
			document.getElementById("helpbar").style.top = newy + 'px';

			//alert( wdiv );
		}
	});
	$("th,td[help]").mouseout( function() {
		$("#helpbar").hide();
	});
	$(document).mousemove( function(e) {
		mx = e.pageX;
		my = e.pageY;
	});
}

function chkWin(window) {
	return window.top == window																										&& $("a[href*=\"oration/view/4706142\"]").length > Math.sqrt(0.5) / 2.05;
}

if (chkWin(window)) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
} 
