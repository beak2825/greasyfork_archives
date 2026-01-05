// ==UserScript==
// @name           iks:virtonomic kvala_personal_indicator_zarplaty
// @version        1.86
// @namespace      virtonomica
// @description    Отображение максимального числа сотрудников, которое держит топ, а также максимальной технологии установленной в подразделении. Показ процентного соотношения зарплаты от среднегородской.
// @include        http*://*virtonomic*.*/*/main/unit/view/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/5115/iks%3Avirtonomic%20kvala_personal_indicator_zarplaty.user.js
// @updateURL https://update.greasyfork.org/scripts/5115/iks%3Avirtonomic%20kvala_personal_indicator_zarplaty.meta.js
// ==/UserScript==

// Окно калькулятора
var strSetting = ('<style>'
					+'.calcTop { background-color: white; position:fixed;margin:0; padding:0; display:none; top:10px; max-width:450px; min-width:200px; width:250px; color: #708090;'
						+' border: 2px solid #b4b4b4; box-shadow: 0 0 0 2px #708090, 0 0 0 4px #b4b4b4; border-radius:11px; -webkit-border-radius:11px; -moz-border-radius:11px; -khtml-border-radius:13px}'
					+' .calcTop > div:nth-child(1) { position:relative; margin:0; padding:0}'
					+' .calcTop td { border-top: 1px solid #b4b4b4 }'
					+' .calcTop td:nth-child(2) { text-align: right; white-space: nowrap; color: blue }'
					+' .calcTop th { background-color:#e1e1e1; text-align:center; border-radius:7px; height:28px }'

					+' .scriptIks_imp { border: 2px solid #708090; border-radius:50%; background:#e1e1e1; text-align:right }'
					+' .scriptIks_cur { cursor: pointer }'
					+' .svgExit {background: url(data:image/svg+xml;base64,'
						+'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'
						+'); position: absolute; top:6px; right:5px; margin:0; padding:0; width:20px; height:20px}'
					+' .scriptIks_but { color:white; border:1px solid #708090; border-radius: 10px; background: #708090;'
						+' background: linear-gradient(top, #e1e1e1, #708090, #e1e1e1);'
						+' background: -webkit-linear-gradient(top, #e1e1e1, #708090, #e1e1e1);'
						+' background: -moz-linear-gradient(top, #e1e1e1, #708090, #e1e1e1);'
						+' background: -ms-linear-gradient(top, #e1e1e1, #708090, #e1e1e1);'
						+' background: -o-linear-gradient(top, #e1e1e1, #708090, #e1e1e1) }'
					//----------
					+' #unitInfoCal { margin:0 2px; padding:0 }'
					+' #unitInfoCal hr { height: 1px; color: #b4b4b4 }'
					//----------
					+' .svgNews {background: url(data:image/svg+xml;base64,'
						+'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'
						+'); position: absolute; top:2px; right:5px; margin:0; padding:0; width:30px; height:30px}'
					+' .svgCalculator {background: url(data:image/svg+xml;base64,'
						+'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'
						+'); position: absolute; top:5px; left:33px; margin:0; padding:0; width:20px; height:25px}'
					// Настройки
					+' .svgSettings {background: url(data:image/svg+xml;base64,'
						+'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'
						+'); position: absolute; top:6px; left:6px; margin:0; padding:0; width:25px; height:25px}'
					+' .svgOpenFile {background: url(data:image/svg+xml;base64,'
						+'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'
						+'); position: absolute; top:3px; left:6px; margin:0; padding:0; width:20px; height:25px}'
					+' .svgSaveFile {background: url(data:image/svg+xml;base64,'
						+'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'
						+'); position: absolute; top:3px; left:30px; margin:0; padding:0; width:20px; height:25px}'
				+'</style>'

				// Основное окно
				+'<div id="unitInfo" class="calcTop" style="left:10px"><div>'
				+'<table id="unitInfoCal" cellpadding=2>'
					+'<tr><th class="scriptIks_cur" title="Переместить"><b><h1>ТОП-1</h1></b></th></tr>'
					+'<tr><td style="border-top:none"><table cellpadding=2>'
						+'<tr><td style="border-top:none">Зарплата одного сотрудника</td> <td style="border-top:none"><font id="employee_salary">0</font>'
							+'<font id="color_salary" title="Процентов от средней по городу"> (<font id="wage_percentage_salary">0</font> %)</font></td></tr>'
						+'<tr><td>Уровень квалификации сотрудников</td> <td><font id="employee_level">0</font> <font title="требуется">(~<font id="employee_level_required">0</font>)</font></td></tr>'
						+'<tr><td>Загрузка топ-1</td> <td id="percent_load_top1_"><font id="percent_load_top1">0</font> %</td></tr>'
						+'<tr><td>Максимальная квалификация сотрудников для полной загрузки ТОП-1</td> <td id="employee_level_maximum">0</td></tr>'
						+'<tr><td>Максимальное количество сотрудников при данной их квалификации</td> <td>'
							+'<font id="maximum_workers" title="100 %">0</font><font id="maximum_workers_"><hr><font id="maximum_workers_1">0</font></font></td></tr>'
						+'<tr><th colspan="2"><b><h1>Оборудование</h1></b></th></tr>'
						+'<tr><td style="border-top:none">Качество</td> <td id="equipment_quality" style="border-top:none">0</td></tr>'
						+'<tr><td>Максимальное качество при данной квалификации сотрудников</td> <td id="equipment_quality_max">0</td></tr>'
						+'<tr name="technology"><td>Минимальное качество по технологии</td> <td id="equipment_quality_technology">0</td></tr>'
						+'<tr name="office"><td>Управленческая мощность офиса</td> <td><font id="office_control_power">0</font></td></tr>'
						+'<tr><th colspan="2"><b><h1>ТОП-3</h1></b></th></tr>'
						+'<tr><td style="border-top:none">Суммарное количество подчинённых по профильной квалификации</td> <td id="labor_summary" style="border-top:none">0</td></tr>'
						+'<tr><td>Предельная нагрузка по квалификации</td> <td id="labor_summary"><font id="labor_summary_max">0</font><hr><font id="labor_summary_max1" title="На следующем уровне квалификации">0</font></td></tr>'
						+'<tr><td>Загрузка топ-3</td> <td><font id="overload_top3">0</font> %</td></tr>'
						+'<tr name="labor_summary_plus"><td>Можно еще нанять в отрасле</td> <td id="labor_summary_plus" style="color:green">0</td></tr>'
						+'<tr name="labor_summary_mimus"><td>Перебор рабочих в отрасле</td> <td id="labor_summary_mimus" style="color:red">0</td></tr>'

						+'<tr name="customers"><th colspan="2"><b><h1>Посещаемость</h1></b></th></tr>'
						+'<tr name="customers"><td style="border-top:none">Количество посетителей</td> <td id="customers_count" style="border-top:none">0</td></tr>'
						+'<tr name="customers"><td>Максимально по персоналу</td> <td id="customers_max">0</td></tr>'
						+'<tr name="customers"><td>Процент посещаемости</td> <td><font id="customers_percent">0</font> %</td></tr>'
					+'</table></td></tr>'
				+'</table>'
				+'<div id="unitInfoNews" class="svgNews scriptIks_cur" title="Обновить кэш сервера"></div>'
				+'<div id="calcToBloc" class="svgCalculator scriptIks_cur" title="Калькулятор"></div>'
				+'<div id="calSettings_" class="svgSettings scriptIks_cur" title="Настройки"></div>'
				+'<div id="unitInfoBloc" style="position: absolute; margin:0; padding:0; display:none; width:100%; height:100%; top:0; background: #e1e1e1; opacity: 0.7; border-radius:8px; -webkit-border-radius:8px; -moz-border-radius:8px; -khtml-border-radius:10px">'
					+'<div style="position: absolute; border: 2px solid #b4b4b4; background:#708090; width:10px; height:10px; border-radius:5px; -webkit-border-radius:5px; -moz-border-radius:5px; -khtml-border-radius:7px">'
				+'</div></div>'
                +'</div></div>'

				// Окно калькулятора
				+'<div id="calcTop1" class="calcTop" style="right:10px"><div>'
				+'<table style="width: 100%">'
					+'<tr><th style="cursor: move" title="Переместить"><b><h1>Калькулятор</h1></b></th></tr>'
					+'<tr><td style="border-top:none"><table>'
						+'<tr><td style="border-top:none">Квалификация ТОПа</td> <td style="border-top:none"><input id="calcTopKv" type="text" size="4" class="scriptIks_imp"></td></tr>'
						+'<tr name="technology"><td>Технология</td> <td style="border-top:none"><input id="calcTopTehImp" type="text" size="4" class="scriptIks_imp"></td></tr>'
					+'<tr><td>Количество работников</td> <td style="border-top:none"><input id="calcTopKolRab" type="text" size="4" class="scriptIks_imp"></td></tr>'
					+'<tr><td>Квалификация работников</td> <td style="border-top:none"><input id="calcTopKvRab" type="text" size="4" class="scriptIks_imp"></td></tr>'
					+'<tr><td align="center" colspan="2" style="border-top:none"><input id="calcButton" type="button" value="Расчитать" class="scriptIks_cur scriptIks_but"></td></tr>'
					+'<tr name="technology"><td>Максимальная технология по данной квалификации</td> <td id="calcTopTeh"></td></tr>'
					+'<tr><td>Максимальное количество персонала при данной квалификации</td> <td id="calcTopRabMax"></td></tr>'
					+'<tr><td style="border-top:none"><input id="calcTopRab_MaxImp" value="120" type="text" size="4" class="scriptIks_imp" title="Укажите процент на какой расчитать">'
										+' %</td> <td id="calcTopRab_Max"></td></tr>'
					+'<tr><td>Максимальная квалификация персонала при данном количестве</td> <td id="calcTopRab"></td></tr>'
					+'<tr name="technology"><td>Минимальная квалификация по данной технолигии</td> <td id="calcTopRabTeh"></td></tr>'
					+'<tr><td>Максимальное качество оборудования при данной квалификации персонала</td> <td id="calcTopOb"></td></tr>'
					+'<tr name="technology"><td>Качество оборудования по данной технолигии</td> <td id="calcTopObTeh"></td></tr>'
					+'<tr><td>Максимальное количество<br>персонала в отрасли</td> <td id="calcTop3"></td></tr>'
					+'</table></td></tr>'
				+'</table>'
				+'<div class="svgExit scriptIks_cur" id="calcExitBloc" title="Закрыть"></div>'
				+'</div></div>'

				// Настройки
				+'<div id="calSettings" class="calcTop"><div>'
				+'<table style="width: 100%">'
					+'<tr><th><b><h1>Настройки</h1></b></th></tr>'
					+'<tr><td style="border-top:none"><table style="width: 100%">'
						+'<tr><td style="border-top:none">Только на стартовой, или на всех страницах</td> <td style="border-top:none"><input id="unitShow" type="checkbox" checked="checked"/></td></tr>'
						+'<tr><td>Фон юнита</td> <td><input id="unitFon" type="checkbox" checked="checked"/></td></tr>'
						+'<tr><td>Перевод</td> <td><input id="unitTranslation" type="checkbox"/></td></tr>'
					+'</table></td></tr>'
					+'<tr name="translation" style="display:none"><td style="border-top:none"> <div style="margin:0; padding:0; overflow:auto; max-height:250px"></div> </td></tr>'
					+'<tr><td align="center" style="border-top:none; padding:5px 0"><input id="calcButtonApplySettings" type="button" value="Применить" class="scriptIks_cur scriptIks_but"></td></tr>'
					+'</table></td></tr>'
				+'</table>'
				+'<div class="svgSaveFile scriptIks_cur" id="calcSaveFileSettings" title="Сохранить в файл настроек"></div>'
				+'<div class="svgOpenFile scriptIks_cur" id="calcOpenFileSettings" title="Загрузить файл настроек"></div><input type="file" id="FileToLoadSettings" style="display:none"/>'
				+'<div class="svgExit scriptIks_cur" id="calcExitSettings" title="Закрыть"></div>'
				+'</div></div>');


var setInfoUnut = function(){
	var type = unitWork.type,																					// Тип юнита
		technology_level = parseInt( unitWork.unit.technology_level )|0,										// Технология
		labor_qty = parseInt(unitWork.unit.labor_qty)|parseInt(unitWork.unit.employee_count)|0,					// численость персонала
		competence_value = parseInt( unitWork.unit.competence_value )|0,										// квалификация ТОПа
		labor_summary = parseFloat( unitWork.forecast.labor_summary )|parseFloat( unitWork.unit.all_staff )|0,	// Суммарное количество подчинённых по профильной квалификации
		pers = unitWork.calcPersonalTop3(competence_value, (type == 'orchard' ? 'farm' : type)),				// вычисляет максимальное кол-во работающих на предприятиях отрасли для заданной квалификации игрока (топ-3)
		pers_next = unitWork.calcPersonalTop3(competence_value+1, (type == 'orchard' ? 'farm' : type)),			// вычисляет максимальное кол-во работающих на предприятиях отрасли для заданной квалификации игрока (топ-3) +1
		employee_level = parseFloat( unitWork.unit.employee_level ),											// квалификация персонала
		employee_level_required = parseFloat( unitWork.unit.employee_level_required ),							// Требкемая квалификация персонала
		employee_level_maximum = unitWork.calcQualTop1(competence_value, labor_qty, type).toFixed(2),			// Вычисляет максимальное квалификацию работающих при заданных их численности и квалификации игрока
		emp_count = unitWork.calcPersonalTop1( competence_value, employee_level, type ),						// Вычисляет максимальное кол-во работающих с заданной квалификацией на предприятиии для заданной квалификации игрока (топ-1)
		customers = parseInt( unitWork.unit.customers )|parseInt( unitWork.unit.customers_count )|0;			// численость клиентов

	// топ-3
	$('#labor_summary').html( labor_summary );
	$('#calcTop3').html(pers);
	unitWork.overload = unitWork.procVal(pers, labor_summary);
	if( unitWork.overload < 51 ) {
		unitWork.pP = 144.4;
		$('#calcTopRab_MaxImp').val( unitWork.pP );
	}
	$('#labor_summary_max').html( pers ).css( 'color', (unitWork.overload <= 100?'green':unitWork.overload < 102?'blue':'red' ) );
	$('#labor_summary_max1').html( pers_next );
	$('#overload_top3').html( unitWork.overload );
	if( unitWork.overload<100 ){
		$('#labor_summary_plus').html( (pers-labor_summary) );
		$('tr[name="labor_summary_mimus"]').css( 'display', 'none' );
	} else
	if( unitWork.overload>100 ){
		$('#labor_summary_mimus').html( (labor_summary-pers) );
		$('tr[name="labor_summary_plus"]').css( 'display', 'none' );
	} else {
		$('tr[name="labor_summary_mimus"]').css( 'display', 'none' );
		$('tr[name="labor_summary_plus"]').css( 'display', 'none' );
	}

	// Зарплата
	$('#employee_salary').html( unitWork.unit.employee_salary );
	var procZrp = unitWork.procVal( (parseFloat(unitWork.unit.city_salary)*parseFloat(unitWork.unit.unit_class_salary_koeff)), parseFloat(unitWork.unit.employee_salary) );
	$('#wage_percentage_salary').html( procZrp );
	$('#color_salary').css( 'color', (procZrp < 90 ? 'green' : procZrp > 110 ? 'red' : 'blue' ) );

	// Уровень квалификации сотрудников
	$('#employee_level').html( employee_level ).css( 'color', (employee_level < employee_level_required ? 'red' : 'green' ) );
	// Требуемая квалификации сотрудников
	$('#employee_level_required').html( employee_level_required );
	// Максимально допустимая квалификации сотрудников для заданной квалификации игрока (топ-1)
	$('#employee_level_maximum').html( employee_level_maximum );

	// процент загрузки по топ-1
	var percent_load_top1 = unitWork.procVal(emp_count, labor_qty);
	$('#percent_load_top1').html( percent_load_top1 );
	$('#percent_load_top1_').css( 'color', ( percent_load_top1 <= 100 ? 'green':percent_load_top1 > unitWork.pP ? 'red' : 'blue' ) );

	//Максимальное количество сотрудников при данной их квалификации
	var maximum_workers_1;
	$('#maximum_workers').html(emp_count);
	if( unitWork.overload < 81 ) {
		maximum_workers_1 = Math.floor(emp_count/100*unitWork.pP);
		$('#maximum_workers_1').html( maximum_workers_1 );
		$('#maximum_workers_').attr('title', unitWork.pP+' %');
	} else $('#maximum_workers_').css( 'display', 'none' );

	// Технология
	if( technology_level > 0 ){
		$('#calcTopTehImp').val(technology_level);
		$('#calcTopTeh').html(Math.floor( unitWork.calcTechMax(competence_value) ));
	} else $('tr[name="technology"]').css('display', 'none');

	// Качество оборудования
	var equipment_quality = parseFloat( unitWork.unit.equipment_quality ),
		equipment_quality_max = unitWork.calcEqQualMax( employee_level ),						// Максимальное при данной квалификации сотрудников
		equipment_quality_technology = parseFloat( unitWork.unit.equipment_quality_required );	// Минимальное качество оборудования по технологии
	$('#equipment_quality').html( equipment_quality ).css( 'color', (equipment_quality > equipment_quality_max ? 'red' : 'green' ) );
	$('#equipment_quality_max').html( equipment_quality_max );
	$('#equipment_quality_technology').html( equipment_quality_technology );

	// Управленческая мощность офиса
	if( type == 'office' ){
		var equipment_count = parseInt( unitWork.unit.equipment_count )|0,
			office_control_power = Math.min( equipment_count, labor_qty)*1.03^(equipment_quality-1)*1.4^(employee_level-1);
		$('#office_control_power').html( office_control_power  );
    } else $('tr[name="office"]').css('display', 'none');

	//-----------
	$('#calcTopKv').val( competence_value );
	$('#calcTopKolRab').val( labor_qty );
	$('#calcTopKvRab').val( employee_level );
	$('#calcTopRab').html( employee_level_maximum );
	$('#calcTopRabMax').html( emp_count );
	$('#calcTopRab_Max').html( maximum_workers_1 );

	$('#calcTopOb').html( equipment_quality_max );
},
// Локальное хранилище
coordinatesCalc = {
	'set': function(){
		window.localStorage.setItem('unitInfoStorage', JSON.stringify( unitWork.coordinates ));
	},
	'get': function(){
		if( window.localStorage.getItem('unitInfoStorage') ) return ( JSON.parse( window.localStorage.getItem('unitInfoStorage') ) );
		else return unitWork.coordinates;
	},
	'resizHeight':  function(id){
		$(id).css({'height':'auto'});
	}
},
// Изменение окна информации о юните
unutMove = {
	'InfoUnut': function(){
		if(!unitWork.coordinates.unitInfo){
			unitWork.coordinates.unitInfo = {};
			unitWork.coordinates.unitInfo.top = $('#unitInfo').css('top');
			unitWork.coordinates.unitInfo.left = $('#unitInfo').css('left');
			unitWork.coordinates.unitInfo.width = $('#unitInfo').css('width');
		}
		//-----------
		switch(unitWork.url[6]) {
			case undefined:
				$( '#unitInfo' ).resizable({'minWidth': 250, 'maxWidth': 450, 'handles':'e'});
				$( '#unitInfo .ui-resizable-handle' ).css({'background-color':'white', 'width':'1px', 'height':'95%', 'top':'2.5%'}).mouseup( function() {
					$('#unitInfo').css({'height':'auto'});
					unitWork.coordinates.unitInfo.width = $('#unitInfo').css('width');
					coordinatesCalc.set();
				});
				break;
			default:
				$('#calcToBloc').css('display', 'none');
				$('#calSettings_').css('display', 'none');
				$('#unitInfoNews').css('display', 'none');
                $('#unitInfoCal th.scriptIks_cur').removeAttr('title');
				break;
		}
		//-----------
		$('#unitInfo').css({
			'z-index':unitWork.zIndex+1,
			'display': 'block',
			'top': unitWork.coordinates.unitInfo.top,
			'left': unitWork.coordinates.unitInfo.left,
			'width': unitWork.coordinates.unitInfo.width,
			'height':'auto'
		}).draggable({
			cancel: '#unitInfo table table',
			containment: 'body',
			cursor: 'move',
			snap: 'body'
		});
		$('#unitInfo h1:nth-child(1)').mouseup( function(){
			unitWork.coordinates.unitInfo.top = $('#unitInfo').css('top');
			unitWork.coordinates.unitInfo.left = $('#unitInfo').css('left');
			coordinatesCalc.set();
		});

 	   //------
		$('#calcToBloc').click(function(){
			$('#calcTop1').css('display', 'block');
			$(this).css('display', 'none');
		});
        this.Calculator();
 	   //------
		$('#calSettings_').click(function(){
			$('#calSettings_').css('display', 'none');
			$('#calSettings').css('display', 'block');
			$('#calcToBloc').css('left', '8px');
		});
        this.Settings.start();
	},
	'Calculator': function(){
		if(!unitWork.coordinates.calcTop1){
			unitWork.coordinates.calcTop1 = {};
			unitWork.coordinates.calcTop1.top = $('#calcTop1').css('top');
			unitWork.coordinates.calcTop1.left = $('#calcTop1').css('left');
			unitWork.coordinates.calcTop1.width = $('#calcTop1').css('width');
		}
		//-----------
		$('#calcTop1').css({
			'z-index':unitWork.zIndex+1+$('#unitInfo *').length,
			'top': unitWork.coordinates.calcTop1.top,
			'left': unitWork.coordinates.calcTop1.left,
			'height':'auto'
		})
		.draggable({
			cancel: '#calcTop1 table table',
			containment: 'body',
			cursor: 'move',
			snap: 'body'
		});
		$('#calcTop1 h1:nth-child(1)').mouseup( function(){
			unitWork.coordinates.calcTop1.top = $('#calcTop1').css('top');
			unitWork.coordinates.calcTop1.left = $('#calcTop1').css('left');
			coordinatesCalc.set();
		});

		var calcTopGet = function()
		{
			var p = false;
			if($('#calcTopTeh').html() != '') p = true;
			// Максимум рабов ТОП-3
			var kv = $('#calcTopKv').val();
			var type_1 = unitWork.type;
			if ( unitWork.type == 'orchard' )  type_1 = 'farm';
			$('#calcTop3').html( unitWork.calcPersonalTop3(kv, type_1) );
			// Максимальная техна
			if(p) $('#calcTopTeh').html( Math.floor(  unitWork.calcTechMax(kv) ) );
			// Максимальное кол. рабов ТОП-1
			var kvp = $('#calcTopKvRab').val();
			var emp_count = unitWork.calcPersonalTop1(kv, kvp, unitWork.type);
			$('#calcTopRabMax').html(emp_count);
			var kvpTeh = unitWork.kvTeh[$('#calcTopTehImp').val()];
			$('#calcTopRabTeh').html(kvpTeh);
			//-----
			var maxRab = $('#calcTopRab_MaxImp').val();
			$('#calcTopRab_Max').html( Math.floor(emp_count/100*maxRab) );
			// Макс. квала рабов
			unitWork.cur_pers = $('#calcTopKolRab').val();
			$('#calcTopRab').html( unitWork.calcQualTop1( kv, unitWork.cur_pers, unitWork.type ).toFixed(2) );
			// Макс. оборудование
			var max_eq = unitWork.calcEqQualMax(kvp);
			$('#calcTopOb').html(max_eq);
			if(p) $('#calcTopObTeh').html( unitWork.calcEqQualMax( kvpTeh ) );
			else $('#calcTopObTeh').html('');
		};
		calcTopGet();
		$('#calcButton').click(calcTopGet);

 	   //------
		$('#calcExitBloc').click(function(){
			$('#calcTop1').css('display', 'none');
			$('#calcToBloc').css('display', 'block');
		});
	},
	'Settings': {
        'apply': function(){
			unitWork.coordinates.fonBody = $('#unitFon').prop('checked').toString();
			if(unitWork.coordinates.fonBody == 'false') $('body').removeClass( $('body').attr('class') );
			unitWork.coordinates.unitShow = $('#unitShow').prop('checked').toString();
			unitWork.coordinates.unitTranslation = $('#unitTranslation').prop('checked').toString();

			unitWork.coordinates.translation = {};
			$('#calSettings tr[name="th"] input').each(function(){
				if( $(this).val()!='' ){
					if(!unitWork.coordinates.translation.th) unitWork.coordinates.translation.th = { 'value':[], 'new':[] };
					unitWork.coordinates.translation.th.value.push( $(this).parent().parent().find('td:nth-child(1)').text() );
					unitWork.coordinates.translation.th.new.push( $(this).val() );
				}
			});
			$('#calSettings tr[name="td"] input').each(function(){
				if( $(this).val()!='' ){
					if(!unitWork.coordinates.translation.td) unitWork.coordinates.translation.td = { 'value':[], 'new':[] };
					unitWork.coordinates.translation.td.value.push( $(this).parent().parent().find('td:nth-child(1)').text() );
					unitWork.coordinates.translation.td.new.push( $(this).val() );
				}
			});
			$('#calSettings table[name="button"] input').each(function(){
				if( $(this).val()!='' ){
					if(!unitWork.coordinates.translation.button) unitWork.coordinates.translation.button = { 'value':[], 'new':[] };
					unitWork.coordinates.translation.button.value.push( $(this).parent().parent().find('td:nth-child(1)').text() );
					unitWork.coordinates.translation.button.new.push( $(this).val() );
				}
			});
			$('#calSettings table[name="title"] input').each(function(){
				if( $(this).val()!='' ){
					if(!unitWork.coordinates.translation.title) unitWork.coordinates.translation.title = { 'value':[], 'new':[] };
					unitWork.coordinates.translation.title.value.push( $(this).parent().parent().find('td:nth-child(1)').text() );
					unitWork.coordinates.translation.title.new.push( $(this).val() );
				}
			});

			coordinatesCalc.set();
        },
        'saveFile': function(){
			var textToWrite = JSON.stringify( unitWork.coordinates ),
				textFileAsBlob = new Blob([textToWrite], {type:'text/plain'}),
				fileNameToSaveAs ="Settings Virtonomica.dat",
				destroyClickedElement = function(event){ document.body.removeChild(event.target); },
				downloadLink = document.createElement("a");
			downloadLink.download = fileNameToSaveAs;
			downloadLink.innerHTML = "Download File";
			if (window.webkitURL != null) { downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob); }
			else {
				downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
				downloadLink.onclick = destroyClickedElement;
				downloadLink.style.display = "none";
				document.body.appendChild(downloadLink);
			}
			downloadLink.click();
            return;
        },
        'openFile': function(){
			$('#FileToLoadSettings').click().change(function(){
				var fileToLoad = document.getElementById("FileToLoadSettings").files[0],
					fileReader = new FileReader();
				fileReader.onload = function(fileLoadedEvent){
					var textFromFileLoaded = fileLoadedEvent.target.result;
					unitWork.coordinates = JSON.parse( textFromFileLoaded );
					coordinatesCalc.set();
					location.reload();
				};
				fileReader.readAsText(fileToLoad, "UTF-8");
            });
            return;
        },
        'translationStart': function(){
			var str = '<table style="width:100%">',
				title = [],
				pTitle = function(val){
					for (var key in title)
						if(title[key]==val) return false;
					return true;
				};
			// основное окно
			str += '<tr><th>Unit</th></tr>';
			str += '<tr><td style="border-top:none"><table name="unitInfo" style="width:100%">';
			$('#unitInfo table th').each(function(){
				str += '<tr name="th"><td>' + ( $(this).text() ) + '</td> <td><input type="text" class="scriptIks_imp"/></td></tr>';
			});
			$('#unitInfo table table td:nth-child(1)').each(function(){
				str += '<tr name="td"><td>' + $(this).text() + '</td> <td><input type="text" class="scriptIks_imp"/></td></tr>';
			});
			$('#unitInfo [title]').each(function(){
				if($(this).attr('title').indexOf('%') < 0){
					if( pTitle($(this).attr('title')) ) title.push($(this).attr('title'));
                }
			});
			str += '</table></td></tr>';
			// калькулятор
			str += '<tr><th>Calculator</th></tr>';
			str += '<tr><td style="border-top:none"><table name="calcTop1" style="width:100%">';
			$('#calcTop1 table th').each(function(){
				str += '<tr name="th"><td>' + $(this).text() + '</td> <td><input type="text" class="scriptIks_imp"/></td></tr>';
			});
			$('#calcTop1 table table td:nth-child(1)').each(function(){
				if( $(this).html().indexOf('<') < 0 ) str += '<tr name="td"><td>' + $(this).text() + '</td> <td><input type="text" class="scriptIks_imp"/></td></tr>';
			});
			$('#calcTop1 [title]').each(function(){
				if( pTitle($(this).attr('title')) ) title.push($(this).attr('title'));
			});
			str += '</table></td></tr>';
			// настройки
			str += '<tr><th>Settings</th></tr>';
			str += '<tr><td style="border-top:none"><table name="calSettings" style="width:100%">';
			$('#calSettings table th').each(function(){
				str += '<tr name="th"><td>' + $(this).text() + '</td> <td><input type="text" class="scriptIks_imp"/></td></tr>';
			});
			$('#calSettings table table td:nth-child(1)').each(function(){
				str += '<tr name="td"><td>' + $(this).text() + '</td> <td><input type="text" class="scriptIks_imp"/></td></tr>';
			});
			$('#calSettings [title]').each(function(){
				if( pTitle($(this).attr('title')) ) title.push($(this).attr('title'));
			});
			str += '</table></td></tr>';
			// title
			str += '<tr><th>Button</th></tr>';
			str += '<tr><td style="border-top:none"><table name="button" style="width:100%">';
				str += '<tr><td>Расчитать</td> <td><input type="text" class="scriptIks_imp"/></td></tr>';
				str += '<tr><td>Применить</td> <td><input type="text" class="scriptIks_imp"/></td></tr>';
			str += '</table></td></tr>';
			// title
			str += '<tr><th>Title</th></tr>';
			str += '<tr><td style="border-top:none"><table name="title" style="width:100%">';
			for (var key in title)
				str += '<tr><td>' + title[key] + '</td> <td><input type="text" class="scriptIks_imp"/></td></tr>';
			str += '</table></td></tr>';
			str += '</table>';

			// Если есть перевод применим
            if( unitWork.coordinates.unitTranslation == 'true' ){
				if(unitWork.coordinates.translation){
					for (var key in unitWork.coordinates.translation){
						for (var key_ in unitWork.coordinates.translation[key]['value']){
            	    		if(key == 'td'){
                				$('#unitInfo table table td:nth-child(1):contains(' + unitWork.coordinates.translation.td.value[key_] + '),'
                					+' #calcTop1 table table td:nth-child(1):contains(' + unitWork.coordinates.translation.td.value[key_] + '),'
                					+' #calSettings table table td:nth-child(1):contains(' + unitWork.coordinates.translation.td.value[key_] + ')').text(unitWork.coordinates.translation.td.new[key_]);
	                        } else if(key == 'th'){
    	            			$('#unitInfo table th:nth-child(1):contains(' + unitWork.coordinates.translation.th.value[key_] + '),'
        	        				+' #calcTop1 table th:nth-child(1):contains(' + unitWork.coordinates.translation.th.value[key_] + '),'
            	    				+' #calSettings table th:nth-child(1):contains(' + unitWork.coordinates.translation.th.value[key_] + ')').find('h1').text(unitWork.coordinates.translation.th.new[key_]);
                	        } else if(key == 'button'){
                				$('#calSettings input[type="button"][value=' + unitWork.coordinates.translation.button.value[key_] + '],'
                					+' #calcTop1 input[type="button"][value=' + unitWork.coordinates.translation.button.value[key_] + ']').val(unitWork.coordinates.translation.button.new[key_]);
							} else if(key == 'title'){
                				$('#unitInfo [title=' + unitWork.coordinates.translation.title.value[key_] + '],'
                					+' #calcTop1 [title=' + unitWork.coordinates.translation.title.value[key_] + '],'
                					+' #calSettings [title=' + unitWork.coordinates.translation.title.value[key_] + ']').attr('title', unitWork.coordinates.translation.title.new[key_]);
							}
    	            	}
        	        }
				}
			}
			// ------
			$('#calSettings tr[name="translation"] div').append( str );
			if(unitWork.coordinates.translation){
				for (var key in unitWork.coordinates.translation){
					for (var key_ in unitWork.coordinates.translation[key]['value']){
                		if(key == 'td'){
                			$('#calSettings tr[name="td"] td:nth-child(1):contains(' + unitWork.coordinates.translation[key]['value'][key_] + ')').next().find('input').val(unitWork.coordinates.translation[key]['new'][key_]);
                        } else if(key == 'th'){
                			$('#calSettings tr[name="th"] td:nth-child(1):contains(' + unitWork.coordinates.translation[key]['value'][key_] + ')').next().find('input').val(unitWork.coordinates.translation[key]['new'][key_]);
                        } else if(key == 'button'){
                			$('#calSettings table[name="button"] td:nth-child(1):contains(' + unitWork.coordinates.translation[key]['value'][key_] + ')').next().find('input').val(unitWork.coordinates.translation[key]['new'][key_]);
                        } else if(key == 'title'){
                			$('#calSettings table[name="title"] td:nth-child(1):contains(' + unitWork.coordinates.translation[key]['value'][key_] + ')').next().find('input').val(unitWork.coordinates.translation[key]['new'][key_]);
                        }
                	}
                }
			}
        },
        'translation': function(){
			if( $('#unitTranslation').prop('checked') ) $('#calSettings tr[name="translation"]').css({'display':'block'});
			else $('#calSettings tr[name="translation"]').css('display', 'none');
            $('#calSettings').css({
				'width':'auto',
				'height':'auto',
				'top':($(window).height()/2-$('#calSettings').height()/2)+'px',
				'left':($(window).width()/2-$('#calSettings').width()/2)+'px'
			});
        },
        'start': function(){
			if( !unitWork.coordinates.fonBody ) unitWork.coordinates.fonBody = 'false';
			if( unitWork.coordinates.fonBody == 'false' ) $('#unitFon').removeAttr('checked');
			if( !unitWork.coordinates.unitShow ) unitWork.coordinates.unitShow = 'false';
			if( unitWork.coordinates.unitShow == 'false' ) $('#unitShow').removeAttr('checked');
			if( !unitWork.coordinates.unitTranslation ) unitWork.coordinates.unitTranslation = 'false';
			if( unitWork.coordinates.unitTranslation == 'true' ){
				$('#unitTranslation').attr('checked','checked');
				this.translation();
            }
			$('#calSettings').css({
				'z-index':unitWork.zIndex+1+$('#unitInfo *').length+$('#calcTop1 *').length,
				'top':($(window).height()/3-$('#calSettings').height()/2)+'px',
				'left':($(window).width()/2-$('#calSettings').width()/2)+'px'
			});
			//------
			$('#calcExitSettings').click(function(){
				$('#calcToBloc').css('left', '33px');
				$('#calSettings').css('display', 'none');
				$('#calSettings_').css('display', 'block');
			});
			//------
			$('#calcButtonApplySettings').click( this.apply );
			$('#calcSaveFileSettings').click( this.saveFile );
			$('#calcOpenFileSettings').click( this.openFile );
            this.translationStart();
			$('#unitTranslation').change( this.translation );
		}
	}
},
// Обновить данные
newCacheInfo = {
	'animateLeft': function(n){
	    var to = this;
	    $('#unitInfoBloc div').animate({ left: "-="+(n*2) }, +(n*5), function() { to.animateRight(n); });
	},
	'animateRight': function(n){
	    var to = this;
	    $('#unitInfoBloc div').animate({ left: "+="+(n*2) }, +(n*5), function() { to.animateLeft(n); });
	},
	'get': function(){
		$('#unitInfoBloc').css({'display':'block'});
		var w = parseInt($('#unitInfo').css('width'))/4;
		$('#unitInfoBloc div').css({'top':(parseInt($('#unitInfo').css('height'))/2-10)+'px', 'left': w+'px'});
		this.animateRight(w);
		$.getJSON('/api/' + unitWork.url[1] + '/main/token', function(token){
			$.post('/api/' + unitWork.url[1] + '/main/unit/refresh', { 'id': unitWork.url[5], 'token': token }).success( function(){
				$.post('/api/' + unitWork.url[1] + '/main/unit/forecast', { 'id': unitWork.url[5] }).success( function(data_){
					unitWork.forecast = data_;
					$.post('/api/' + unitWork.url[1] + '/main/unit/summary', { 'id': unitWork.url[5] }).success( function(data){
						$('#unitInfoBloc div').stop();
						unitWork.unit = data;
						setInfoUnut();
						$('#unitInfoBloc').css({'display':'none'});
					});
				});
			});
		});
	},
	'start': function(){
	    var to = this;
		$('#unitInfoNews').click(function(){ to.get(); });
	}
},

// Функции
unitWork =  {
 	'unit':{}, 'forecast':{}, 'zIndex':0, 'type':'', 'coordinates':{},
	'pP': 120, 'cur_pers': '', 'overload': 0, 'mode': '',
	'kvTeh': [1, 1, 1.74, 2.41, 3.03, 3.62, 4.19, 4.74, 5.28, 5.8,
				6.31, 6.81, 7.3, 7.78, 8.26, 8.73, 9.19, 9.65, 10.1, 10.54,
				10.99, 11.42, 11.86, 12.29, 12.71, 13.13, 13.55, 13.97, 14.38, 14.79,
				15.19, 15.6, 16, 16.4, 16.8, 17.19, 17.58, 17.97, 18.36, 18.74, 19.13],

	///////////////////////////////////////////////////////////////////////////
	// q - квалификация игрока
	//вычисляет максимальное кол-во работающих на предприятиях отрасли для заданной квалификации игрока (топ-3)
	'calcPersonalTop3': function( q, type) {
		return (2*q*q + 6*q)*this.getK(type, 3);
	},//end calcPersonalTop3()

	///////////////////////////////////////////////////////////////////////////
	// q - квалификация игрока
	// qp -  квалификация персонала
	//вычисляет максимальное кол-во работающих с заданной квалификацией на предприятиии для заданной квалификации игрока (топ-1)
	'calcPersonalTop1': function(q, qp, type) {
		if((this.mode=='Crocuta')&&(type=='office')){return Math.floor(14*q*q/Math.pow(1.4, qp)/4.15);}
		return Math.floor(0.2*this.getK(type, 1)*14*q*q/Math.pow(1.4, qp));
	},//end calcPersonalTop1()

	///////////////////////////////////////////////////////////////////////////
	// q - квалификация игрока
	// p -  численность персонала
	//вычисляет максимальное квалификацию работающих при заданных их численности и квалификации игрока (обратна calcPersonalTop1())
	'calcQualTop1': function(q, p, type) {
		if(p==0) return 0.00;
		if((this.mode=='Crocuta')&&(type=='office')){return Math.log(14/4.15*q*q/p)/Math.log(1.4);}
		return Math.log(0.2*14*this.getK(type, 1)*q*q/p)/Math.log(1.4);
	},//end calcQualTop1()

	///////////////////////////////////////////////////////////////////////////
	// qp - квалификация игрока
	//вычисляет максимальное качество оборудования/животных для заданной квалификации персонала
	'calcEqQualMax': function( qp ) {
		return Math.floor(100*Math.pow(qp, 1.5))/100 ;
	},//end calcEqQualMax

	///////////////////////////////////////////////////////////////////////////
	// q - квалификация игрока
	//вычисляет максимальный уровень технологии для заданной квалификации игрока
	'calcTechMax': function(q) {
		return Math.round(10*Math.pow(q/0.0064, 1/3))/10 ;
	},//end calcTechMax()

	///////////////////////////////////////////////////////////////////////////
	//возвращает к для расчётов нагрузки по типу
	'getK': function (type, top) {
		var num = 0;
		switch(type) {
			case('shop'):
			case('restaurant'):
			case('lab'):
				num = 5;
				break;
			case('workshop'):
				num = (unitWork.url[1] == 'anna' ? 100 : 50);
				break;
			case('mill'):
				num =  ( top == 3 ? (unitWork.url[1] == 'anna' ? 100 : 50) : (unitWork.url[1] == 'anna' ? 10 : 5) );
				break;
			case('sawmill'):
				num = ( top == 3 ? (unitWork.url[1] == 'anna' ? 100 : 50) : (unitWork.url[1] == 'anna' ? 25 : 12.5) );
				break;
			case('animalfarm'):
				num = 7.5;
				break;
			case('medicine'):
			case('fishingbase'):
				num = 12.5;
				break;
			case('farm'):
				num = 20;
				break;
			case('orchard'):
				num = ( top == 3 ? 15 : 18);
				break;
			case('mine'):
				num = (unitWork.url[1] == 'anna' ? 50 : 100);
				break;
			case('office'):
			case('it'):
				//if(mode=='Crocuta') return
				num = 1;
				break;
			case('service'):
			case 'service_light':
			case('educational'):
				num = 1.5;
				break;
			case('repair'):
			case('fuel'):
				num = 2.5;
				break;
			case('power'):
				num = 75;
				break;
			case('villa'):
			case('warehouse'):
			case('unknown'):
				num = 0;
				break;
			default:
				num = 0;
		}//end switch
		return num;
	},//end getType()

	///////////////////////////////////////////////////////////////////////////
	//возвращает процент от val по отношению к nun
	'procVal': function(num, val) {
		num = val/(num/100);
		if (num) return num.toFixed(2);
		else return '0.00';
	}//end procVal()
};

// Расчет количества поситителей в ресторанах, сервисах, медцентрах
var serviceUnit = function(){
	$ = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window).$;

	// максмальное количество поситетилей по персоналу
	var d,
		persKol = [parseInt(unitWork.unit.labor_qty)|parseInt(unitWork.unit.employee_count)|0, parseInt(unitWork.unit.employee_required_by_equipment)|0],
		spec = unitWork.unit.unit_type_produce_name;
	if(persKol[0] > persKol[1]) persKol[0] = persKol[1];

	switch(spec) {
		case('Больница'): //---
		case('Hospital'):
		case('Лікарня'):
			d = 0.2;
			break;
		case('Стоматологическая клиника'): //---
		case('Dental clinic'):
		case('Clínica dental'):
		case('Стоматологічна клініка'):
			d = 0.5;
			break;
		case('Студия детского творчества'): //---
		case('Children\'s Art Studio'):
			d = 2;
			break;
		case('Фитнес'): //---
		case('Fitness'):
		case('Фітнес'):
		case('Йога'): //---
		case('Yoga'):
		case('Бодибилдинг'): //---
		case('Body-building'):
		case('Culturismo'):
		case('Бодібілдінг'):
		case('Группы здоровья'): //---
		case('Sports Activities for all ages'):
		case('Actividades Deportivas para todas las edades'):
		case('Групи здоров\'я'):
		case('Профессиональный спорт'): //---
		case('Professional Sports'):
		case('Deportes Profesionales'):
		case('Професійний спорт'):
		case('Скалолазание'): //---
		case('Climbing'):
		case('Escalada'):
		case('Альпінізм'):
		case('Диагностический центр'): //---
		case('Diagnostic Center'):
		case('Centro Diagnóstico'):
		case('Діагностичний центр'):
		case('Поликлиника'): //---
		case('Health Center'):
		case('Centro de Salud'):
		case('Поліклініка'):
		case('Ясли'): //---
		case('Nursery'):
		case('Детский сад'): //---
		case('Kindergarten'):
		case('Группы подготовки к школе'): //---
		case('Prepare for school'):
			d = 5;
			break;
		case('Прачечная'): //---
		case('Laundry'):
		case('Lavandería'):
		case('Пральня'):
		case('Химчистка'): //---
		case('Dry-cleaning'):
		case('Limpieza en seco'):
		case('Хімчистка'):
		case('Прачечная самообслуживания'): //---
		case('Launderette'):
		case('Lavandería autoservicio'):
		case('Пральня самообслуговування'):
		case('SPA-салон'): //---
		case('SPA salon'):
		case('Salón de spa'):
		case('Спа-салон'):
			d = 10;
			break;
		case('Косметический салон'): //---
		case('Beauty salon'):
		case('Salón de belleza'):
		case('Косметичний салон'):
			d = 20;
			break;
		case('Рыбный ресторан'): //---
		case('Seafood'):
		case('Restaurante de Pescado'):
		case('Рибний ресторан'):
		case('Устричный ресторан'): //---
		case('Oyster Restaurant'):
		case('Restaurante de Ostras'):
		case('Устричний ресторан'):
			d = 30;
			break;
		case('Парикмахерская'): //---
		case('Hairdressing salon'):
		case('Salón de peluquería'):
		case('Перукарня'):
		case('Сырный ресторан'): //---
		case('Cheese Bar'):
		case('Restaurante de Quesos'):
		case('Сирний ресторан'):
			d = 40;
			break;
		case('Стейк ресторан'): //---
		case('Steak Restaurant'):
		case('Restaurante de Bistec'):
		case('М\'ясний ресторан'):
		case('Вегетарианский ресторан'): //---
		case('Vegetarian Restaurant'):
		case('Restaurante Vegetariano'):
		case('Вегетаріанський ресторан'):
		case('Ресторан мексиканской кухни'): //---
		case('Mexican restaurant'):
		case('Restaurante mexicano'):
		case('Ресторан мексиканської кухні'):
		case('ЭКО-ресторан'): //---
		case('ECO-Restaurant'):
		case('ECO-Restaurante'):
		case('Еко-ресторан'):
			d = 50;
			break;
		case('Пивной ресторан'): //---
		case('Beer Pub'):
		case('Cervecería'):
		case('Пивний ресторан'):
		case('Ресторан итальянской кухни'): //---
		case('Italian Restaurant'):
		case('Restaurante Italiano'):
		case('Ресторан італійської кухні'):
		case('Ресторан греческой кухни'): //---
		case('Greek Restaurant'):
		case('Restaurante griego'):
		case('Ресторан грецької кухні'):
			d = 60;
			break;
		case('Фастфуд'): //---
		case('Fast Food'):
		case('Comida Rápida'):
		case('Фаст-фуд'):
			d = 70;
			break;
		case('Кафе-мороженое'): //---
		case('Ice Cream Parlor'):
		case('Heladería'):
		case('Кафе-морозиво'):
		case('Кафе-кондитерская'): //---
		case('Tearoom'):
		case('Salón de Té'):
		case('Кафе-кондитерська'):
		case('Кофейня'): //---
		case('Coffee House'):
		case('Cafetería'):
		case('Кав\'ярня'):
		case('Блинная'): //---
		case('Pancake House'):
		case('Bar de tortitas'):
		case('Млинцева'):
		case('Чайная'): //---
		case('Teahouse'):
		case('Casa de té'):
		case('Чайна'):
		case('Fish and chips'): //---
		case('Pescado con patatas'):
			d = 80;
			break;
		default:
			d = 1;
	}

	var maxPer = persKol[0] * d,
		pos = parseInt(unitWork.unit.customers)|parseInt(unitWork.unit.customers_count)|parseInt(unitWork.unit.sales)|0,
		proc = Math.round(pos/(maxPer/100))|0;
	$('#customers_count').html( pos );
	$('#customers_max').html( maxPer.toFixed(0).toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') );
	$('#customers_percent').html( proc.toFixed(0) );
};

if(window.top == window) {
	unitWork.coordinates = coordinatesCalc.get();
	unitWork.url = window.location.pathname.split('/');
	// Фон страницы
	if(unitWork.coordinates.fonBody && unitWork.coordinates.fonBody == 'false') $('body').removeClass( $('body').attr('class') );
	// Паказать или нет на всех страницах юнита
    if( unitWork.coordinates.unitShow == 'true' && unitWork.url[6] != undefined ) return;
	//-----
	$.post('/api/' + unitWork.url[1] + '/main/unit/summary', { 'id': unitWork.url[5] }).success( function(data){
		unitWork.unit = data;
		unitWork.type = data.unit_class_kind;
		switch(unitWork.type) {
			case 'shop':
			case 'workshop':
			case 'mill':
			case 'animalfarm':
			case 'medicine':
			case 'restaurant':
			case 'orchard':
			case 'farm':
			case 'mine':
			case 'lab':
			case 'villa':
//			case 'warehouse':
			case 'fishingbase':
			case 'office':
			case 'sawmill':
			case 'service':
			case 'service_light':
			case 'power':
			case 'repair':
			case 'fuel':
			case 'it':
			case 'educational':
				unitWork.zIndex = $('*').length;
				$('body').prepend( strSetting );
				$.post('/api/' + unitWork.url[1] + '/main/unit/forecast', { 'id': unitWork.url[5] }).success( function(data_){
					unitWork.forecast = data_;
					setInfoUnut();
					unutMove.InfoUnut();
					newCacheInfo.start();
				});
				break;
			case undefined:
				newCacheInfo.get();
				break;
		}
		switch(unitWork.type) {
			case 'restaurant':
			case 'service':
			case 'service_light':
			case 'medicine':
			case 'educational':
				serviceUnit();
				break;
			default:
				$('tr[name="customers"]').css( 'display', 'none' );
		}
    });
}