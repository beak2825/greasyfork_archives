// ==UserScript==
// @name           Virtonomica: персонал новый дизайн
// @version        1.06
// @namespace      virtonomica
// @description    Отображение максимальной технологии, максимального числа/квалификации сотрудников, которые держит топ.
// @include        *virtonomic*.*/*/main/unit/view/*
// @include        *virtonomic*.*/*/window/unit/employees/engage/*
// @exclude        *virtonomic*.*/*/main/unit/view/*/supply
// @exclude        *virtonomic*.*/*/main/unit/view/*/manufacture
// @exclude        *virtonomic*.*/*/main/unit/view/*/animals
// @exclude        *virtonomic*.*/*/main/unit/view/*/sale
// @exclude        *virtonomic*.*/*/main/unit/view/*/finans_report
// @exclude        *virtonomic*.*/*/main/unit/view/*/technology/*
// @downloadURL https://update.greasyfork.org/scripts/16720/Virtonomica%3A%20%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%BB%20%D0%BD%D0%BE%D0%B2%D1%8B%D0%B9%20%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/16720/Virtonomica%3A%20%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%BB%20%D0%BD%D0%BE%D0%B2%D1%8B%D0%B9%20%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD.meta.js
// ==/UserScript==

var run = function() {
    var new_interface = $("div.unit_box-container").length;
    if (new_interface) {
        // поменять местами заметки и инфу по топ-менеджеру
	var topBox = $("#notice_div").parent().next();
	$("#notice_div").parent().insertAfter(topBox);

	// создать кнопку удаления заметки
	var str = '<div class="unit_button btn-virtonomics-unit-cancel" onclick="$(\'#notice_div\').text(\'\');return unitNoticeSet();">';
	str += '<i class="fa fa-trash fa-lg fa-fw"></i>&nbsp; Удалить заметку</div>';
	$("#notice_div").next().children().eq(0).children().eq(0).after($(str));

	// передвинуть уровень загрузки производства туда, где ему и место
	var loadFactor = $("td:contains('Уровень загрузки производства')").parent();
	if (loadFactor.length) {
		var salaryString = getPersonal_1(getType());
		//console.log("salaryString=" + salaryString);
		loadFactor.insertAfter($("td:contains('" + salaryString + "')").parent());
	}
    }
    //saveAverageCityInfo();
    

    var type, cur_pers;
    var kvTeh = [0, 1, 1.74, 2.41, 3.03, 3.62, 4.19, 4.74, 5.28, 5.8, 6.31, 6.81, 7.3, 7.78, 8.26, 8.73, 9.19, 9.65, 10.1, 10.54, 10.99, 11.42, 11.86, 12.29, 12.71, 13.13, 13.55, 13.97, 14.38, 14.79, 15.19, 15.6, 16, 16.4, 16.8, 17.19, 17.58, 17.97, 18.36, 18.74, 19.13];
    
	/***** Калькулятор *****/
	$('#unit_subtab').each(function() {
		var str = this.innerHTML;
		str += '<br><div id="calcTop"><a id="calcToBloc" class="popup scriptIks_cur"><u>Калькулятор топ-1</u></a></div>';
		var d=document.createElement('div');
		d.id='calcTop1';
		d.style='position: fixed; right: 5px; top: 5px; background:gray; padding: 0px;'
		          +' border-radius:10px; -webkit-border-radius:10px; -moz-border-radius:10px; -khtml-border-radius:10px;';
        
        var ua = navigator.userAgent;
        var strToBrauzer = '<div style="position:relative; margin: 0; padding: 4px;">';
        if (ua.search(/Chrome/) > 0) strToBrauzer = '<div style="position:absolute; margin: 0; padding: 4px; right: 5px; top: 5px;">';
		d.innerHTML = strToBrauzer
		              +'<table style="background-color: white; border-radius:7px; -webkit-border-radius:7px; -moz-border-radius:7px; -khtml-border-radius:7px;">'
		              +'<tr><td align="center" colspan="2" style="color: #708090;"><b><h1>Калькулятор</h1><b><hr></td></tr>'
		              +'<tr><td>Квалификация ТОПа</td> <td><input id="calcTopKv" type="text" size="4" class="scriptIks_imp"></td></tr>'
		              +'<tr><td>Технология</td> <td><input id="calcTopTehImp" type="text" size="4" class="scriptIks_imp"></td></tr>'
		              +'<tr><td>Количество работников</td> <td><input id="calcTopKolRab" type="text" size="4" class="scriptIks_imp"></td></tr>'
		              +'<tr><td>Квалификация работников</td> <td><input id="calcTopKvRab" type="text" size="4" class="scriptIks_imp"></td></tr>'
		              +'<tr><td align="center" colspan="2"><input id="calcButton" type="button" value="Расчитать" class="scriptIks_cur scriptIks_but"></td></tr>'
		              +'<tr><td align="center" colspan="2"><hr></td></tr>'
		              +'<tr><td>Максимальная технология<br>по данной квалификации</td> <td id="calcTopTeh" style="text-align: right;"></td></tr>'
		              +'<tr><td align="center" colspan="2"><hr></td></tr>'
		              +'<tr><td>Максимальное количество<br>персонала при<br>данной квалификации</td> <td id="calcTopRabMax" style="text-align: right;"></td></tr>'
		              +'<tr><td><input id="calcTopRab_MaxImp" value="120" type="text" size="4" class="scriptIks_imp" title="Укажите процент на какой расчитать">&nbsp;%</td> <td id="calcTopRab_Max" style="text-align: right;"></td></tr>'
		              +'<tr><td align="center" colspan="2"><hr></td></tr>'
		              +'<tr><td>Максимальная квалификация<br>персонала при данном количестве<hr></td> <td id="calcTopRab" style="text-align: right;"></td></tr>'
		              +'<tr><td>Минимальная квалификация<br>по данной технолигии</td> <td id="calcTopRabTeh" style="text-align: right;"></td></tr>'
		              +'<tr><td align="center" colspan="2"><hr></td></tr>'
		              +'<tr><td>Максимальное качество<br>оборудования при данной<br>квалификации персонала<hr></td> <td id="calcTopOb" style="text-align: right;"></td></tr>'
		              +'<tr><td>Качество оборудования<br>по данной технолигии</td> <td id="calcTopObTeh" style="text-align: right;"></td></tr>'
		              +'<tr><td align="center" colspan="2"><hr></td></tr>'
		              +'<tr><td>Максимальное количество<br>персонала в отрасли</td> <td id="calcTop3" style="text-align: right;"></td></tr>'
		              +'<tr><td align="center" colspan="2"><hr></td></tr>'
		              +'<tr><td align="right" colspan="2"><a href="http://virtacalc.freehost96.ru/indextop.php" class="popup" title="Так-же расчет нагрузки ТОП-1 и многое другое..." target="_blank"><small>Калькулятор от DeMonyan</small></a></td></tr>'
		              +'<table>'
		              +'<div class="scriptIks_cur scriptIks_exitDiv" id="calcExitBloc" title="Закрыть">'
		              +'<div class="scriptIks_crug1"></div>'
		              +'<div class="scriptIks_exit"><b>X</b></div>'
		              +'<div class="scriptIks_crug"></div>';
		              +'</div>'
		              +'</div>';
		document.body.appendChild(d);
		
		this.innerHTML = str;
		document.getElementById('calcTop1').style.display = "none";
	});
	
	document.getElementById('calcButton').onclick = calcTopGet;
	function calcTopGet(){
	        var p = false;
	        if($('#calcTopTeh').html() != '') p = true;
            // Максимум рабов ТОП-3
            kv = $('#calcTopKv').val();
            var type_1 = type;
            if (type == 'orchard')  type_1 = 'farm';
            pers = calcPersonalTop3(kv, type_1);
            $('#calcTop3').html(pers);
            // Максимальная техна
            if(p) {
                techn = calcTechMax(kv);
                $('#calcTopTeh').html(Math.floor(techn));
            }
            // Максимальное кол. рабов ТОП-1
            kvp = $('#calcTopKvRab').val();
            emp_count = calcPersonalTop1(kv, kvp, type);
            $('#calcTopRabMax').html(emp_count);
            var kvpTeh = kvTeh[$('#calcTopTehImp').val()];
            $('#calcTopRabTeh').html(kvpTeh);
            //-----
            var maxRab = $('#calcTopRab_MaxImp').val();
            $('#calcTopRab_Max').html(Math.floor(emp_count/100*maxRab));
            // Макс. квала рабов
            cur_pers = $('#calcTopKolRab').val();
            maxq=f2(calcQualTop1(kv,cur_pers, type));
            $('#calcTopRab').html(maxq);
            // Макс. оборудование
            max_eq = calcEqQualMax(kvp);
            $('#calcTopOb').html(max_eq);
            if(p) {
                    var teh_eq = calcEqQualMax(kvpTeh);
                    $('#calcTopObTeh').html(teh_eq);
            } else $('#calcTopObTeh').html('');
	}
	
	$('#calcToBloc').click(function(){
	       document.getElementById('calcTop').style.display = "none";
	       document.getElementById('calcTop1').style.display = "block";
	});
	$('#calcExitBloc').click(function(){
	       document.getElementById('calcTop').style.display = "block";
	       document.getElementById('calcTop1').style.display = "none";
	});
	/*************************************/
	
    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;
	
	var mode='';
	$( 'img[src*="812223"]' ).each ( function()
	{
		mode='Crocuta';  // алмазы
	});
	//mode='Crocuta';// офисная мистика
	type = getType();//'unknow';
	var k =getK(type);// 0;

	if((type=='unknow')||(k==0)) return;
	
	//////////////////////////////////	
	var total=getPersonalTotal();
	cur_pers=getPersonal(type);
	var kv = getPlayerQual();
	$('#calcTopKv').val(kv);
		
	// топ-3
	$("td:contains('Суммарное')").next().each(function() {
		str = this.innerHTML;
		//kv = parseInt( str );		
		var type_1 = type;
		if (type == 'orchard')  type_1 = 'farm';
		pers = calcPersonalTop3(kv, type_1);
		$('#calcTop3').html(pers);
		var pers_next=calcPersonalTop3(kv+1, type_1);
		var overload = procVal(pers, total);
		 
		if(overload>102) font='red';
		else if(overload>100) font='blue';
		else font='green';

		if (new_interface) {
			// выделить цветом число подчиненных
			var curText = $(this).text();
			$(this).html($('<font color=' + font + '><b>' + curText + '</b></font>'));
		
			var top3AndFree = '<tr><td>Нагрузка топ-3</td>';
			top3AndFree += '<td><font color=' + font +'><b>' + overload + '%</b></font></td></tr>';
			if (overload != 100) {
				var word = overload < 100 ? 'Свободно' : 'Лишних';
				var delta = Math.abs(pers - total);
				top3AndFree += '<tr><td>' + word + ' подчинённых</td>';
				top3AndFree += '<td><font color=' + font +'><b>' + delta + '</b></font></td></tr>';
			}
			$(this).parent().before($(top3AndFree));

			var str = '<tr><td>Максимальное количество</td><td>' + getThousandsSplitted(pers) + '</td></tr>';
			str += '<tr><td><font color=gray>На следующем уровне квалификации</font></td>';
			str += '<td><font color=gray>' + getThousandsSplitted(pers_next) + '</font></td></tr>'; 
			$(this).parent().after($(str));
		} else {
			var str=' <br><font color=' + font +'>Предельная нагрузка по квале: <b>';
			str+=pers+ '</b>'+' (на след.уровне: '+'<b>'+pers_next+'</b>'+')';
			//str+='</b>'; 
			str+='<br>Загрузка топ-3: <b> '+overload+' %</b>';
			if(overload<100) str+='<br>Свободно рабов: <b>'+(pers-total)+'</b>';
			else if(overload>100) str+='<br>Перебор рабов: <b>'+(total-pers)+'</b>';
			str+= '</b></font>';
			this.innerHTML = this.innerHTML +str;
		}
	});

	// Количество работников
 	var nofp=getPersonal(type);
 	var emp_count = 0;
	
	// топ-1
	var kvp = 0;
	$("td:contains('Уровень квалификации')").next().each(function() { 
		str = this.innerHTML;
		kvp = parseFloat( str );
		$('#calcTopKvRab').val(kvp);
		
		emp_count = calcPersonalTop1(kv, kvp, type);
		$('#calcTopRabMax').html(emp_count);
		$('#calcTopKolRab').val(cur_pers);
		emp_count_next = calcPersonalTop1(kv+1, kvp, type);
				
		var maxq=f2(calcQualTop1(kv, cur_pers, type));
		$('#calcTopRab').html(maxq);
		
		if(maxq<kvp) font='red';
		else font='green';

		// процент загрузки по топ-1
		//console.log("emp_count=" + emp_count + ", nofp=" + nofp);
		var num = procVal(emp_count, nofp);
		if(num>100){
		          if(num<=143) font='orange';
		          else font='red';
		} else font='green';

		if (new_interface) {
			// выделить цветом значение квалификации
			var curText = $(this).text();
			$(this).html($('<font color=' + font + '><b>' + curText + '</b></font>'));

			var beforeString = '';
			//var cityName = $("div.officePlace").clone().children().remove().end().text();
			//var startPos = cityName.indexOf(":") + 2;
			//cityName = cityName.substr(startPos, cityName.indexOf("|") - startPos).replace(/[\s,]+/g, '');
			//cityName = cityName.substr(0, cityName.length - 2);
			//console.log("city=" + cityName);
			//var avgSalaryTr = $(this).parent().prev();
			//var avgSalaryStr = parseFloat(leaveOnlyDigitsAndDots(avgSalaryTr.children().eq(1).text()));
			//console.log("sal = " + avgSalaryStr);
			//var curSalary = parseFloat(leaveOnlyDigitsAndDots(avgSalaryTr.prev().children().eq(1).text()));
			//console.log("curSalary=" + curSalary);
			//avgSalaryTr.prev().children().eq(1).append(" (" + (curSalary / avgSalaryStr * 100).toFixed(0) + "%)");
			//beforeString += '<tr><td>Средняя зарплата в городе</td>';
			//beforeString += '<td>$' + getThousandsSplitted(avgSalaryStr) + ' в неделю</td></tr>';
			if (isFinite(num)) {
				beforeString += '<tr><td>Нагрузка топ-1</td><td><font color=' + font + '><b>' + num + '%</b></font></td></tr>';
			}
			$(this).parent().before($(beforeString));

			var str = '<tr><td>Квалификация для 100%/120% топ-1</td>';
			str += '<td>' + maxq + '/' + f2(calcQualTop1(kv, cur_pers / 1.2, type)) + '</td></tr>';
			//str += '<tr><td><font color=gray>Квалификация для 120% топ-1</font></td>';
			//str += '<td><font color=gray>' + f2(calcQualTop1(kv, cur_pers / 1.2, type)) + '</font></td></tr>';
			str += '<tr><td>Макс. количество с квалой ' + kvp + '</td>';
			str += '<td>' + emp_count + '</td></tr>';
			str += '<tr><td><font color=gray>120% максимального количества</font></td>';
			str += '<td><font color=gray>' + Math.floor(emp_count / 100 * 120) + '</font></td></tr>';
			str += '<tr><td><font color=gray>Макс. на следующем уровне квалы</font></td>';
			str += '<td><font color=gray>' + emp_count_next + '</font></td></tr>';
			$('#calcTopRab_Max').html(Math.floor(emp_count/100*120));
			$(this).parent().next().after($(str));
		} else {
			this.innerHTML = this.innerHTML + '<br><font color=gray>Максимальная квала для 100% по топ-1: <b>' + maxq + '</b></font>';
			this.innerHTML = this.innerHTML + '<br>(<font color='+font+'>Максимальное количество рабов: <b>' + (emp_count) + '</b></font>) ';
			this.innerHTML = this.innerHTML + '<br>(<font color='+font+'>120% количества рабов: <b>' + Math.floor(emp_count/100*120) + '</b></font>)';
			$('#calcTopRab_Max').html(Math.floor(emp_count/100*120));
			// процент загрузки по топ-1
			var num = procVal(emp_count, nofp);
			if(num>100){
			          if(num<=120) font='orange';
			          else font='red';
			} else font='green';
			this.innerHTML = this.innerHTML + '<br><font color=' + font + '>Нагрузка по топ-1: <b>' + num + '%</b></font>';
			///////////
			this.innerHTML = this.innerHTML + '<br>(<font color=gray>На квале ' + (kv+1) + ' (следующий уровень): <b>' + (emp_count_next) + '</b></font>)';
		
//			if(mode=='Crocuta'){
			
			var p5=Math.floor(pers/5);			
			var k5=calcQualTop1(kv,p5,type);			
			var e5=calcEqQualMax(k5);
			this.innerHTML = this.innerHTML + '<br>(<font color=olive>Special 05: <b>5 *' + p5 + '--'  + f2(k5) + '('+e5+')'+'</b></font>)';
			
			p5=Math.floor(pers/10);			
			k5=calcQualTop1(kv,p5,type);			
			e5=calcEqQualMax(k5);
			this.innerHTML = this.innerHTML + '<br>(<font color=olive>Special 10: <b>10*' + p5 + '--'  + f2(k5) + '('+e5+')'+'</b></font>)';
//			}
		}
	});
// техна
	var techn = 0;
	var max_techn = 0;
	$("td:contains('Уровень технологии')").next().each(function() { 
		str = this.innerHTML;
		techn = parseInt( str );
		$('#calcTopTehImp').val(techn);
		max_techn = calcTechMax(kv);
		$('#calcTopTeh').html(Math.floor(max_techn));
		font = 'green';
		if ( max_techn < techn) {
			font = 'red';
		}
		if (new_interface) {
			var curText = $(this).text();
			$(this).html($('<font color=' + font + '><b>' + curText + '</b></font>'));
			str = '<tr><td>Максимальная технология</td><td>' + (max_techn) + '</td></tr>';
			$(this).parent().after($(str));
		} else {
			str = ' <br>(<font color=' + font +'>Максимальная технология: <b>' + (max_techn) + '</b></font>)';
			this.innerHTML = this.innerHTML + str;
		}
	});
//оборудование
	var eq;
	var max_eq = 0;
	$("td:contains('Качество'):first").next().each(function() { 
		str = this.innerHTML;
		eq= parseFloat( str );
		max_eq = calcEqQualMax(kvp);
		$('#calcTopOb').html(max_eq);

		if (eq > max_eq) font = 'red';
		else font = 'green';

		if (new_interface) {
			var required = parseFloat($(this).parent().next().children().eq(1).text());
			if (eq < required) {
				font = 'red';
			}
			// выделить цветом качество
			var curText = $(this).text();
			$(this).html($('<font color=' + font + '><b>' + curText + '</b></font>'));

			//if (eq < required) {
			//	$(this).parent().next().children().eq(1).html($('<font color=' + font + '><b>' + required + '</b></font>'));
			//}
		
			str = '<tr><td>Максимальное по персоналу</td><td>' + (max_eq) + '</td></tr>';
			$(this).parent().next().after($(str));
		} else {
			str = ' <br>(<font color=' + font +'>Макс.качество по персоналу: <b>' + (max_eq) + '</b></font>)';
			this.innerHTML = this.innerHTML + str;
		}
		
		// Вызов калькулятора, чтоб посчтитал
		calcTopGet();
	});
    
    var d = 1;
    var ob, per;
    
// максмальное количество поситетилей по персоналу
    if(type == 'restaurant' || type == 'service' || type == 'medicine' || type == 'repair')
	$("td.title:contains('Количество посетителей')").next().each(function() {
        var str = this.innerHTML;
        
        per = str.match(/\d[.\s\d]*(?=)/g);
        per = [per[0].replace(/[^\d\.]/g,''), per[1].replace(/[^\d\.]/g,'')];
        var pos = per[0];
        
        ob = $("td:contains('Количество оборудования')").next().text().replace(' ','');
        ob = ob.match(/\d[.\s\d]*(?=)/g);
        ob = [ob[0].replace(/[^\d\.]/g,''), ob[1].replace(/[^\d\.]/g,'')];
        
        var posMax = per[1];
        perMax = ob[1];
        
        var spec = $("td.title:contains('Специализация')").next().text();
        switch(spec)
		{
			case('Фитнес'):
			case('Йога'):
			case('Бодибилдинг'):
			case('Группы здоровья'):
			case('Профессиональный спорт'):
			case('Скалолазание'):
				d = 5;
				break;
			case('Танцы'):
				d = 5;
				break;
			case('Прачечная'):
			case('Химчистка'):
			case('Прачечная самообслуживания'):
				d = 10;
				break;
			case('Косметический салон'):
			case('Парикмахерская'):
			case('Центр народной медицины'):
			case('Стоматологическая клиника'):
			case('Диагностический центр'):
			case('Поликлиника'):
			case('Больница'):
			case('Кардиологическая клиника'):
			default:
				d = 1;
		}
		perMax = perMax/d;
        
        var persKol = parseInt( $("td:contains('Количество сотрудников')").next().text().replace(' ','') );
        var maxPer = persKol*(posMax/perMax);
        var s = '<br>Макс. по персоналу: ' + maxPer;
        
        s += '<br>Посещаемость: ' + ( procVal(maxPer, pos) ) + '%';
        
        this.innerHTML = str + s;
	});

	///////////////////////////////////////////////////////////////////////////
	//function getThousandsSplitted(val)
	//возвращает аргумент с разделением пробелами тысяч
	///////////////////////////////////////////////////////////////////////////// 
	function getThousandsSplitted(val) {
		return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	}//end getThousandsSplitted()

	///////////////////////////////////////////////////////////////////////////
	//function leaveDigitsAndDot(val)
	//удаляет из строки все символы, кроме цифр и точек
	///////////////////////////////////////////////////////////////////////////// 
	function leaveOnlyDigitsAndDots(str) {
		return str.replace(/[^\d\.]/g,'');
	}//end leaveDigitsAndDot()

	///////////////////////////////////////////////////////////////////////////
	//function f2(val)
	//возвращает аргумент округлённым до 2-го знака
	///////////////////////////////////////////////////////////////////////////// 
	function f2(val){
		return Math.floor(100*val)/100;
	}//end f2()
	
	
	///////////////////////////////////////////////////////////////////////////
	//function getPlayerQual()
	//возвращает квалификацию игрока
	///////////////////////////////////////////////////////////////////////////// 
	function getPlayerQual(){
		return parseInt($('a:contains("Квалификация игрока")').parent().next().text());
	}//end getPlayerQual()
	
	///////////////////////////////////////////////////////////////////////////
	//function calcPersonalTop3(q, type)
	// q - квалификация игрока
	// 
	//вычисляет максимальное кол-во работающих на предприятиях отрасли для заданной квалификации игрока (топ-3)
	///////////////////////////////////////////////////////////////////////////// 
	function calcPersonalTop3( q, type){
		return ((2*q*q + 6*q)*getK(type));
	}//end calcPersonalTop3()
	
	///////////////////////////////////////////////////////////////////////////
	//function calcPersonalTop1(q, qp,type)
	// q - квалификация игрока
	// qp -  квалификация персонала
	//вычисляет максимальное кол-во работающих с заданной квалификацией на предприятии для заданной квалификации игрока (топ-1)
	///////////////////////////////////////////////////////////////////////////// 
	function calcPersonalTop1(q, qp,type){
		if((mode=='Crocuta')&&(type=='office')){return Math.floor(14*q*q/Math.pow(1.4, qp)/4.15);}
		return Math.floor(0.2*getK(type)*14*q*q/Math.pow(1.4, qp));
	}//end calcPersonalTop1()
	
	///////////////////////////////////////////////////////////////////////////
	//function calcQualTop1(q, p, type)
	// q - квалификация игрока
	// p -  численность персонала
	//вычисляет максимальное квалификацию работающих при заданных их численности и квалификации игрока (обратна calcPersonalTop1())
	///////////////////////////////////////////////////////////////////////////// 
	function calcQualTop1(q, p, type){		
		if(p==0) return 0.00;
		if((mode=='Crocuta')&&(type=='office')){return Math.log(14/4.15*q*q/p)/Math.log(1.4);}
		return Math.log(0.2*14*getK(type)*q*q/p)/Math.log(1.4);	
	}//end calcQualTop1()
	
	///////////////////////////////////////////////////////////////////////////
	//function calcTechMax(q)
	// q - квалификация игрока
	// 
	//вычисляет максимальный уровень технологии для заданной квалификации игрока
	///////////////////////////////////////////////////////////////////////////// 
	function calcTechMax(q){
		return Math.floor(10*Math.pow(q/0.0064, 1/3))/10 ;
	}//end calcTechMax()
	
	///////////////////////////////////////////////////////////////////////////
	//function calcEqQualMax(q)
	// qp - квалификация игрока
	// 
	//вычисляет максимальное качество оборудования/животных для заданной квалификации персонала
	///////////////////////////////////////////////////////////////////////////// 
	function calcEqQualMax( qp ){
		return Math.floor(100*Math.pow(qp, 1.5))/100 ;
	}//end calcEqQualMax
	
	///////////////////////////////////////////////////////////////////////////
	//function getPersonalTotal()
	//возвращает суммарное кол-во работающих в отрасли (топ-3)
	///////////////////////////////////////////////////////////////////////////// 
	function getPersonalTotal(){
		if (new_interface) {
			return parseInt($("#all_staff").text().replace(/\s+/g, ''));
		} else {
			return parseInt($('td.title:contains("Суммарное")').next().text().replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ',''));
		}
		
	}//end getPersonalTotal()
	
	///////////////////////////////////////////////////////////////////////////
	//function getType()
	//возвращает тип в виде строки  (по изображению)
	///////////////////////////////////////////////////////////////////////////// 
	function getType(){
		var img =  $("#unitImage").html();
		if(img=='') return 'unknown';
		img = img.substr(0,img.length-8);
		switch(img)
		{
			case('<img src="/img/v2/units/shop'):
				return 'shop';
				break;
			case('<img src="/img/v2/units/workshop'):
				return 'workshop';
				break;
			case('<img src="/img/v2/units/mill'):
				return 'mill';
				break;
			case('<img src="/img/v2/units/animalfarm'):
				return 'animalfarm';
				break;
			case('<img src="/img/v2/units/medicine'):
				return 'medicine';
				break;
			case('<img src="/img/v2/units/restaurant'):
				return 'restaurant';
				break;
			case('<img src="/img/v2/units/orchard'):
				return 'orchard';
				break;	
			case('<img src="/img/v2/units/farm'):
				return 'farm';
				break;	
			case('<img src="/img/v2/units/mine'):
				return 'mine';
				break;	
			case('<img src="/img/v2/units/lab'):
				return 'lab';
				break;		
			case('<img src="/img/v2/units/villa'):
				return 'villa';
				break;	
			case('<img src="/img/v2/units/warehouse'):
				return 'warehouse';
				break;	
			case('<img src="/img/v2/units/fishingbase'):
				return 'fishingbase';
				break;		
			case('<img src="/img/v2/units/office'):
				return 'office';
				break;	
			case('<img src="/img/v2/units/sawmill'):
				return 'sawmill';
				break;		
			case('<img src="/img/v2/units/service_light'):
				return 'service';
				break;			
			case('<img src="/img/v2/units/power'):
				return 'energy';
				break;			
			case('<img src="/img/v2/units/repair'):
				return 'repair';
				break;	
			case('<img src="/img/v2/units/fuel'):
				return 'fuel';
				break;	
			default:
				return 'unknown';
		}//end switch
	}//end getType()
	///////////////////////////////////////////////////////////////////////////
	//getK(type)
	//возвращает к для расчётов нагрузки по типу
	///////////////////////////////////////////////////////////////////////////
	function getK(type)
	{
		switch(type)
		{
			case('shop'):
			case('restaurant'):
			case('lab'):
				return 5;
				break;
			case('workshop'):
				if (/anna/.test(window.location.href)) {
				return 100;
				break;
				}
				else {
				return 50; 
				break; 
				}
			case('mill'):
			case('sawmill'):
				if (/anna/.test(window.location.href)) {
				return 100;
				break;
				}
				return 50;
				break;
			case('animalfarm'):
				return 7.5;
				break;
			case('medicine'):
			case('fishingbase'):
				return 12.5;
				break;				
			case('farm'):
				return 20;
				break;			
			case('orchard'):
				return 18;
				break;	
			case('mine'):
				if (/anna/.test(window.location.href)) {
				return 50;
				break;
				}
				else {
				return 100;
				break;
				}
			case('office'):
				//if(mode=='Crocuta') return 
				return 1;
				break;	
			case('service'):
				return 1.5;
				break;
			case('energy'):
				return 75.0;
				break;	
			case('repair'):
				return 2.5;
				break;
			case('fuel'):
				return 2.5;
				break;		
			case('villa'):	
			case('warehouse'):	
			case('unknown'):	
			default:
				return 0;
		}//end switch
	}//end getType()	
	///////////////////////////////////////////////////////////////////////////
	//getPersonal(type)
	//возвращает кол-во работников на предприятии (по типу)
	///////////////////////////////////////////////////////////////////////////
	function getPersonal(type)
	{
		var temp = getPersonal_1(type);
		
		if(temp=='' || temp== -1) return (-1); //error
		return parseInt($('td:contains(' + temp + ')').next().text().replace(/\s+/g, ''));
	}//end getPersonal()	
	
	function getPersonal_1(type)
	{
		var temp;
		switch(type)
		{
			case('lab'):
				temp='Количество учёных';
				break;
			case('workshop'):			
			case('mill'):
			case('orchard'):				
			case('farm'):
			case('mine'):
			case('fishingbase'):
			case('sawmill'):
				temp='Количество рабочих';
				break;
			case('animalfarm'):
				temp='Количество работников';				
				break;
			case('medicine'):
			case('office'):
			case('shop'):
			case('restaurant'):
			case('service'):
				temp='Количество сотрудников';				
				break;			
			case('energy'):
				temp='Количество рабочих';
				break;
			case('repair'):	
				temp='Количество сотрудников';				
				break;	
			case('fuel'):	
				temp='Количество сотрудников';				
				break;		
			case('villa'):	
			case('warehouse'):	
			case('unknown'):	
			default:
				temp='';
				break;
		}//end switch
		if(temp=='') return (-1); //error
		return temp;
	}//end getPersonal_1()
	
	///////////////////////////////////////////////////////////////////////////
	//function procVal(num, val)
	//возвращает процент от val по отношению к nun
	///////////////////////////////////////////////////////////////////////////// 
	function procVal(num, val){
		return Math.round(val/(num/100)*100)/100;
	}//end procVal()

	///////////////////////////////////////////////////////////////////////////
	//function saveAverageCityInfo()
	//сохраняет среднегородские данные в локальное хранилище
	///////////////////////////////////////////////////////////////////////////// 
	//function saveAverageCityInfo() {
	//	if (!$("td:contains('Средняя зарплата в городе')").length ||
	//		typeof(localStorage) === "undefined") return;
	//	var cityName = $("abbr").text().replace(/\s+/g, '');
	//	var avgSalary;
	//	$("td:contains('Средняя зарплата в городе')").each(function() {
	//		avgSalary = parseFloat($(this).text().replace(/[^\d\.]/g, ''));
	//	});
	//	//var avgQual;
	//	//$("span:contains('в среднем по городу')").each(function() {
	//	//	var str = $(this).text();
	//	//	str = str.substr(0, str.indexOf(",")).replace(/[^\d\.]/g, '');
	//	//	avgQual = parseFloat(str);
	//	//});
	//
	//	//console.log("city=" + cityName + ", sal=" + avgSalary + ", qual=" + avgQual);
	//	//localStorage.setItem("q" + cityName, avgQual.toString());
	//	var type = $("div.headerContainer").children().eq(0).prop('src');
	//	var lastSlashPos = type.lastIndexOf("/");
	//	type = type.substr(lastSlashPos + 1, type.length - lastSlashPos - 1);
	//	type = type.substr(0, type.indexOf("."));
	//	console.log("type = " + type);
	//	localStorage.setItem(cityName + ":" + type, avgSalary.toString());
	//	//console.log("city=" + cityName + ", salary saved=" + localStorage.getItem(cityName));
	//}//end saveAverageCityInfol()
	
	/*********************************************************************************/
	
// Процент зарплаты
	if (!new_interface) {
		$("td:contains('Зарплата')").next().each(function() { 
			str = this.innerHTML;
		
		        zarp = str.match(/\d[.\s\d]*/g);
		        zzz = (zarp[0].replace(/[^\d\.]/g,'')/zarp[1].replace(/[^\d\.]/g,'')*100).toFixed(0);
		        color = zzz<80?'red':'green';
		        color = zzz>80?'blue':color;
        
			this.innerHTML = '<font color=' + color +'>' + str + ' --> ' + zzz + '%</font>';
		});
	}
}


if(window.top == window) {
    var style = document.createElement("style");
    style.textContent = '.scriptIks_imp { border: 2px solid #708090; border-radius: 5px; background: #e1e1e1; text-align: right; }'
                      +'\n.scriptIks_cur { cursor: pointer; }'
                      +'\n.scriptIks_exitDiv { position: absolute; margin: 0; padding: 0; right: 0; top: 0; }'
                      +'\n.scriptIks_crug { position: absolute; right: 0; top: 0; width: 14px; height: 14px; border: 4px solid gray; border-radius: 50%; padding: 0; }'
                      +'\n.scriptIks_crug1 { position: absolute; right: 0; top: 0; width: 14px; height: 14px; border: 4px solid gray; border-radius: 0 50% 0 50%; padding: 0;  background:white; }'
                      +'\n.scriptIks_exit { position: absolute; margin: 0; padding: 0; right: 5px; top: 1px; font-size: 18px; color: darkred; }'
                      +'\n.scriptIks_but { color:white; border:1px solid #708090; border-radius: 10px; background: #708090; background: linear-gradient(top, #e1e1e1, #708090, #e1e1e1); background: -webkit-linear-gradient(top, #e1e1e1, #708090, #e1e1e1); background: -moz-linear-gradient(top, #e1e1e1, #708090, #e1e1e1); background: -ms-linear-gradient(top, #e1e1e1, #708090, #e1e1e1); background: -o-linear-gradient(top, #e1e1e1, #708090, #e1e1e1); }';
    document.documentElement.appendChild(style);

    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}
