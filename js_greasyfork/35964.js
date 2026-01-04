// ==UserScript==
// @name           iks:virtonomic Настройка юнита
// @version        1.10
// @namespace      virtonomica
// @description    Отображение максимального числа сотрудников, которое держит топ, а также максимальной технологии установленной в подразделении. Показ процентного соотношения зарплаты от среднегородской.
// @include        http*://*virtonomic*.*/*/main/unit/view/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/35964/iks%3Avirtonomic%20%D0%9D%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0%20%D1%8E%D0%BD%D0%B8%D1%82%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/35964/iks%3Avirtonomic%20%D0%9D%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0%20%D1%8E%D0%BD%D0%B8%D1%82%D0%B0.meta.js
// ==/UserScript==

// Окно калькулятора
var strSetting = "<style>"
					+".calcTop { background-color: white; position:fixed;margin:0; padding:0; display:none; top:10px; width:250px; color: #708090;"
						+" border: 2px solid #b4b4b4; box-shadow: 0 0 0 2px #708090, 0 0 0 4px #b4b4b4; border-radius:11px; -webkit-border-radius:11px; -moz-border-radius:11px; -khtml-border-radius:13px}"
					+" .calcTop > div:nth-child(1) { position:relative; margin:0; padding:0}"
					+" .calcTop td:nth-child(2) { text-align: right; white-space: nowrap; color: blue }"
					+" .calcTop th { background-color:#e1e1e1; text-align:center; border-radius:7px; height:28px }"

					+' .scriptIks_imp { border: 2px solid #708090; border-radius:50%; background:#e1e1e1; text-align:right }'
					+' .scriptIks_cur { cursor: pointer }'
					+" .scriptIks_exit {background: url(data:image/svg+xml;base64,"
						+'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABHNCSVQICAgIfAhkiAAABO9JREFUSIm9l2tsFFUUx3+zM9vHtsi05Rk/iB8kiHwAURISwwciRgQMiX5QXgEENUjQGIigVR6C1YhCgEoM'
						+'WPBJJNFEIZLoJ0NItIBKFDWC+Cogj3andGf6mHvv8cPMtrvdXWgiepLNbs793/u759xzz+xY5JiXcocjsh+RKVYqBY7TNyhCvglIsd+RVrq6ojmW9SUwxw28c7mzrRzofOAd+7axVKyrh8oUhCGiFSgN'
						+'SoHWkU/FPh35RSnI0YnWECrUgYPon37OIpa7gdeYB/ZS7jyEd1O7d2LV1sYLxwuZ6DvPFyrE5GwoC+vdUOxTGgkCwvf2Eaek3g28TQCWl3JHgnWusnErluvGUeg40vxoe32hKtToXF+UGZRCjMacPoNu'
						+'PgqJBMBQN/AuO4jstSdOwKqqQoKgNCxOrWTBWX/W1z/6nNRbgweDMVnwAWCyA9xTtnQxkvEjcagQrbCURhuFCUOc0PRFojWiwvwN5kTfY0JsLdhhlGqMQX7/A2w7e7wTAByruhq6e6CnOxLGu/atkJ4R'
						+'dVSNG0/3r2co++qbqGBzNGiNGBN9t7XSM30q1pjRXDrwEc6R49R0aCSTQVpbweqt43Iv5d7kkHQQPwM98ZmECkspuoalGLng0Uh6+yT86kEkPj4YXRURxPOQCxeQP/9Cnz2HeX4VtctWAOBOvZfv7ryF'
						+'6pbL2IZcaNbGOghRmsMwTl2IUYrUuMl5yqrpM7jid2A3fYBuPoZkMmDbiFLI+tXU1q/N0w9ftAxZtQ5I9IcC2AnEQBCA7yOBj/gB+AHmxPcF6hsefAh//OioCG07Or/1a6jpBwUI9jThSFEoAAmMIJkY'
						+'mPER30eCgPLmE2T2vFUwYdhLm+l+cgmW1piGF6hZ/WyB5vzjjzDkx5ac9lRoVvvQG8W5f0Z8N7MXX4E24Ad0jRlF3fbGgomdx5qpvGNSgf/v5Y9R2fRhsXPNtVkOYqJIVQjKxNWqkLSH/uEkzuHDtIqh'
						+'bsfOvJm50DAMSSaTXHx6BZW79+VenZLmYCRKs4p7sNZI2sP8cipS2DbO7vdpTSap27Kt6CI6maR99SrKdzRBMnlNKEACEcgpKtLtfdCs2TZOYxP+8eaii4RfHKLslS0DhgIkREx0neKi0qdPFaq0Rj2x'
						+'mKqJhWcKMGjadHqeeSq6kgMFYwQJgqiaW86C6ffc1Rq1ZG7JNGdtyMub6V6+OHrIDAgsEl+jAOnszB81BrV0XkFhQVTV/W3Y69voXPJwkT8NJcAS+EjHlbwBSwS1bBF1298omHRxzUrCu+4mvfW1grER'
						+'O94kWPDANcF4KVe8qhrxUm7vpz3lSst906SYXVizUrzKwZG24gZpa9hUVHd6wq15a/b7zIx6Wr/UCJCYPbNgk5fWPUf51l19zSGRwFrbQHrj+sJUTpuKtkqnvGgztYBLb+/K87U2vEhZw7aCjmQ5DtaG'
						+'V0lv3JDnT3/2CVbpnqktL+UW3VZbhSYzcSxD5yxEjnxNau9+KCsrGYEoRefc2Zjx42g79CnVR09S21kSPKok2AJUAkI0KW1jrtp64zkC3baQFIurZLnbDbyKBPB50QgA20CFGRgUQCwoM1eFAnwL0Rkv'
						+'HNiy181mASTcwDsPzP+foPVu4F2GIm8S/yG08E0iBz4c2A9MuY7Aq7879dtADXAzMOhfADuA39zASxcb/AeyO0uL5H6hJgAAAABJRU5ErkJggg=='
						+"); position: absolute; top:2px; right:2px; margin:0; padding:0; width:30px; height:30px}"
					+' .scriptIks_but { color:white; border:1px solid #708090; border-radius: 10px; background: #708090;'
						+' background: linear-gradient(top, #e1e1e1, #708090, #e1e1e1);'
						+' background: -webkit-linear-gradient(top, #e1e1e1, #708090, #e1e1e1);'
						+' background: -moz-linear-gradient(top, #e1e1e1, #708090, #e1e1e1);'
						+' background: -ms-linear-gradient(top, #e1e1e1, #708090, #e1e1e1);'
						+' background: -o-linear-gradient(top, #e1e1e1, #708090, #e1e1e1) }'
					//----------
					+" #unitInfoCal { margin:0 2px; padding:0 }"
					+" #unitInfoCal td { border-top: 1px solid #b4b4b4 }"
					+" #unitInfoCal hr { height: 1px; color: #b4b4b4 }"

					+" .scriptIks_news {background: url(data:image/svg+xml;base64,"
						+'iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABHNCSVQICAgIfAhkiAAABT1JREFUSIm1lmlsVFUUx//nvm22ttNp6UYpS0HB4oeyKdgICmEJGJW1CgmIBo2EJgoFNwpBCjFKYgSXEImA'
						+'u0hVEIwoa2mtoAhEWdqCdEoLndplpu3MvHnL9UMpsXSmpbX8kvvh3ft/93/PyTm5F+iEzeeaUndeDsmdaXoKCze5o7SWnj9pZvlscuV5tWHunTCmSAtrS4Plfs1MDwQZNo+0RNT1lLAR5/76zzaNU/pV'
						+'L4crRsSy09VLe9tY/O/Hhl+u02GP4bDGORZUeALQdaAlCCjcOXV/Kf/qSEPNYJ9KribSMNzmYMfLzxfvmze2rifGHVKYU1i725CUmW5fEAIBpmkgs18UKn0hWCUFIjPBuQC/bkDXCUEtgGSL2NTY7M9N'
						+'sok/bhybeKXbxsuPla60upLe+OOKHyY3AXAwiCCuQQeBSABAIA4QGeDEWuc0DZKNQQTTk4zA7i3T+md3y/iZwvrKhpZgakOT3oWUd1wjgDFAIwMpJPk+f6xvzJwvL9Gueem3itvvNqeg7BPF6Zx/ucoH'
						+'6kYNcwCyqOqyGnPFSwHDIigwmH9gAjG5IHtIxJ0IAB7dfja9z+DkstMXPESQO8QTDmb4wWUr4pXQ5KBOJWP7Sf40Zyova2iBajY6mGlb9l1Zo1KxNCMv3P8iANRobM/1iw0UCHAQqV2EyKExoK/dsvLg'
						+'Qs8moiwTAA63V/kA5G8tck9aEinike8UviJYkvK9Xh+MLuMkcHBf+WL7IIob2qM2akOsb7ZPpFA9DJWDMwI3OYgiJJsTLJJQ+n9NAYBNja9ZXt+MNXF26YSmBaAGDagqgxYiaCpHSGXQQjeGRmgJmKM2'
						+'7T3pBIAlGwuGjXrxs1OY/UF+9oZ9ud0x7lB1T3x0ctCJUu+helissiQm6KYJU9NBxME5QCAMS3KcKnphxMgzpdfiMlfv93BuMm5yiAIwIFpofmrK6Oe27D589OkJqTXrn52l3ZZxG+/+dFHZd7EhpdKn'
						+'Dk+Ksn74c1kwIVrUAAI4Y/zxDHvajkVjro5bvtNTUhXow0kGBwd4ayUwxsB1vaaPTbg0c0Typ+/nTHvvtoxvhXN3zL0bq8Y3NPonWhVpcihgTHG/9ZAbAMQnt3OdCOA3aoMIhNYeZ4xghjgcVoIIo9gu'
						+'KoeSYy07euW6S83Z81dVo++e2xITQWTCLrFrZdfUeZuGcKZ07ofWDNhjopEWuHY67H0MADNyvxnXlWHGqm9fp4U/cFW0iWACqJMBJkASRCQKRsX5rYs2RIy42ubMnvv2odnFF5rXTM+QA/lzp9BLXxxg'
						+'BZdM5ZE0/b7v3fKBc3Wcw64DukwRI7gJR2xqAhqrfZPaMhCRu18+Gqho0hRTNyqsIphmCrJJepKqA5wRQNTxogqHSYh1WZFhDR07nvfw+E6N7193nErysnhC7pFqTxDJMFvbpPOzhlknAxZFQV+XUl/+'
						+'6ui4tumIGSrJy+IA4HlzQsqYVFeRIyqKi7IESAK4yABRAIQbQxQBgQGSBSRKgCCAMwbOGIgsSEh1gtV7c9qdp5Pjt2PS+qLMuKSBD5yqrN5crTIoVgZRkiBLBEYCdB5CyB+C3eZAhdsDiDIIQHysDIeJ'
						+'gr/XZs7qkXE4vj7w58xtF7xBiVv4O9P7ewcMji9OfO23vcxpn1Fz3Q9Z5EhIjNEk9zWX3RXXcnZ1xs2K6PX38uKdFQsONoY+dle1wOWKwlDUrShaNWbTrbpeNwaAlPWlXBUM2CShsHLFXQ+G03Tdfj1g'
						+'qFOYH20TMZyF1t2J/SNyppYrv5fXDulM8y8o0xvHHOFTuAAAAABJRU5ErkJggg=='
						+"); position: absolute; top:2px; right:5px; margin:0; padding:0; width:30px; height:30px}"
					+" .scriptIks_cal {background: url(data:image/svg+xml;base64,"
						+'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'
						+'/4k7KvX0dCV2AAAAAElFTkSuQmCC'
						+"); position: absolute; top:2px; left:3px; margin:0; padding:0; width:24px; height:30px}"
				+"</style>"

				// Основное окно
				+"<div id='unitInfo' class='calcTop' style='left:10px'><div>"
				+"<table id='unitInfoCal' cellpadding=2>"
					+"<tr><th class='scriptIks_cur' title='Переместить'><b><h1>ТОП-1</h1></b></th></tr>"
					+"<tr><td style='border-top:none'><table cellpadding=2>"
						+"<tr><td style='border-top:none'>Зарплата одного сотрудника</td> <td style='border-top:none'><font id='employee_salary'>0</font>"
							+"<font id='color_salary' title='Процентов от средней по городу'> (<font id='wage_percentage_salary'>0</font> %)</font></td></tr>"
						+"<tr><td>Уровень квалификации сотрудников</td> <td><font id='employee_level'>0</font> <font title='требуется'>(~<font id='employee_level_required'>0</font>)</font></td></tr>"
						+"<tr><td>Загрузка</td> <td id='percent_load_top1_'><font id='percent_load_top1'>0</font> %</td></tr>"
						+"<tr><td>Максимальная квалификация сотрудников для полной загрузки ТОП-1</td> <td id='employee_level_maximum'>0</td></tr>"
						+"<tr><td>Максимальное количество сотрудников при данной их квалификации</td> <td>"
							+"<font id='maximum_workers' title='100 %'>0</font><font id='maximum_workers_'><hr><font id='maximum_workers_1'>0</font></font></td></tr>"
						+"<tr><th colspan='2'><b><h1>Оборудование</h1></b></th></tr>"
						+"<tr><td style='border-top:none'>Качество</td> <td id='equipment_quality' style='border-top:none'>0</td></tr>"
						+"<tr><td>Максимальное качество при данной квалификации сотрудников</td> <td id='equipment_quality_max'>0</td></tr>"
						+"<tr name='technology'><td>Минимальное качество по технологии</td> <td id='equipment_quality_technology'>0</td></tr>"
						+"<tr name='office'><td>Управленческая мощность офиса</td> <td><font id='office_control_power'>0</font></td></tr>"
						+"<tr><th colspan='2'><b><h1>ТОП-3</h1></b></th></tr>"
						+"<tr><td style='border-top:none'>Суммарное количество подчинённых по профильной квалификации</td> <td id='labor_summary' style='border-top:none'>0</td></tr>"
						+"<tr><td>Предельная нагрузка по квалификации</td> <td id='labor_summary'><font id='labor_summary_max'>0</font><hr><font id='labor_summary_max1' title='На следующем уровне квалификации'>0</font></td></tr>"
						+"<tr><td>Загрузка</td> <td><font id='overload_top3'>0</font> %</td></tr>"
						+"<tr name='labor_summary_plus'><td>Можно еще нанять в отрасле</td> <td id='labor_summary_plus' style='color:green'>0</td></tr>"
						+"<tr name='labor_summary_mimus'><td>Перебор рабочих в отрасле</td> <td id='labor_summary_mimus' style='color:red'>0</td></tr>"

						+"<tr name='customers'><th colspan='2'><b><h1>Посещаемость</h1></b></th></tr>"
						+"<tr name='customers'><td style='border-top:none'>Количество посетителей</td> <td id='customers_count' style='border-top:none'>0</td></tr>"
						+"<tr name='customers'><td>Максимально по персоналу</td> <td id='customers_max'>0</td></tr>"
						+"<tr name='customers'><td>Процент посещаемости</td> <td><font id='customers_percent'>0</font> %</td></tr>"
					+'</table></td></tr>'
				+"</table>"
				+'<div class="scriptIks_news scriptIks_cur" title="Обновить кэш сервера"></div>'
				+'<div id="calcToBloc" class="scriptIks_cal scriptIks_cur" title="Калькулятор"></div>'
				+'<div id="unitInfoBloc" style="position: absolute; margin:0; padding:0; display:none; width:100%; height:100%; top:0; background: #e1e1e1; opacity: 0.7;">'
				+'<div style="position: absolute; border: 2px solid #b4b4b4; background:#708090; width:10px; height:10px; border-radius:5px; -webkit-border-radius:5px; -moz-border-radius:5px; -khtml-border-radius:7px">'
				+'</div></div>'
                +"</div></div>"

				// Окно калькулятора
				+"<div id='calcTop1' class='calcTop' style='right:10px'><div>"
				+'<table style="width: 100%">'
					+'<tr><th style="cursor: move" title="Переместить"><b><h1>Калькулятор</h1></b></th></tr>'
					+'<tr><td><table>'
					+'<tr><td>Квалификация ТОПа</td> <td><input id="calcTopKv" type="text" size="4" class="scriptIks_imp"></td></tr>'
					+'<tr name="technology"><td>Технология</td> <td><input id="calcTopTehImp" type="text" size="4" class="scriptIks_imp"></td></tr>'
					+'<tr><td>Количество работников</td> <td><input id="calcTopKolRab" type="text" size="4" class="scriptIks_imp"></td></tr>'
					+'<tr><td>Квалификация работников</td> <td><input id="calcTopKvRab" type="text" size="4" class="scriptIks_imp"></td></tr>'
					+'<tr><td align="center" colspan="2"><input id="calcButton" type="button" value="Расчитать" class="scriptIks_cur scriptIks_but"></td></tr>'
					+'<tr name="technology"><td align="center" colspan="2"><hr></td></tr>'
					+'<tr name="technology"><td>Максимальная технология<br>по данной квалификации</td> <td id="calcTopTeh"></td></tr>'
					+'<tr><td align="center" colspan="2"><hr></td></tr>'
					+'<tr><td>Максимальное количество<br>персонала при<br>данной квалификации</td> <td id="calcTopRabMax"></td></tr>'
					+'<tr><td><input id="calcTopRab_MaxImp" value="120" type="text" size="4" class="scriptIks_imp" title="Укажите процент на какой расчитать">'
										+'&nbsp;%</td> <td id="calcTopRab_Max"></td></tr>'
					+'<tr><td align="center" colspan="2"><hr></td></tr>'
					+'<tr><td>Максимальная квалификация<br>персонала при данном количестве</td> <td id="calcTopRab"></td></tr>'
					+'<tr name="technology"><td><hr>Минимальная квалификация<br>по данной технолигии</td> <td id="calcTopRabTeh"></td></tr>'
					+'<tr><td align="center" colspan="2"><hr></td></tr>'
					+'<tr><td>Максимальное качество<br>оборудования при данной<br>квалификации персонала</td> <td id="calcTopOb"></td></tr>'
					+'<tr name="technology"><td><hr>Качество оборудования<br>по данной технолигии</td> <td id="calcTopObTeh"></td></tr>'
					+'<tr><td align="center" colspan="2"><hr></td></tr>'
					+'<tr><td>Максимальное количество<br>персонала в отрасли</td> <td id="calcTop3"></td></tr>'
					+'</table></td></tr>'
				+'<table>'
				+'<div class="scriptIks_exit scriptIks_cur" id="calcExitBloc" title="Закрыть"></div>'
				+'</div></div>';


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
	'set': function(id, strStorage){
		window.localStorage.setItem(strStorage,
									JSON.stringify( {	'top': $(id).css('top'),
														'left': $(id).css('left'),
														'width': $(id).css('width') } ));
	},
	'get': function(strStorage){
		if( window.localStorage.getItem(strStorage) ) return ( JSON.parse( window.localStorage.getItem(strStorage) ) );
		else return false;
	},
	'resizHeight':  function(id){
		$(id).css({'height':'auto'});
	}
},
// Изменение окна информации о юните
Move = {
	'InfoUnut': function(){
		$( '#unitInfo' ).css({'z-index':unitWork.zIndex+1}).mouseup( function() {
			$('#unitInfo').css({'height':'auto'});
			coordinatesCalc.set('#unitInfo', 'coordinatesUnitInfo');
		});
		switch(unitWork.url[6]) {
			case undefined:
				$( '#unitInfo' ).resizable({'minWidth': 250, 'maxWidth': 570, 'handles':'e'});
				$( '.ui-resizable-handle' ).css({'background-color':'white', 'width':'2px', 'height':'95%', 'top':'2.5%'});
				break;
			default:
				$('#calcToBloc').css('display', 'none');
				$('.scriptIks_news').css('display', 'none');
                $('#unitInfoCal th.scriptIks_cur').removeAttr('title');
				break;
		}
		//-----------
		var coordinates = coordinatesCalc.get('coordinatesUnitInfo');
		if( coordinates != false ) {
			$('#unitInfo').css({
				'display': 'block',
				'top': coordinates.top,
				'left': coordinates.left,
				'width': coordinates.width,
				'height':'auto'
			});
        }
		$('#unitInfo').draggable({
			cancel: '#unitInfo table table',
			containment: 'body',
			cursor: 'move',
			snap: 'body'
		});
		$('#unitInfo h1:nth-child(1)').mouseup( function(){ coordinatesCalc.set('#unitInfo', 'coordinatesUnitInfo'); } );

 	   //------
		$('#calcToBloc').click(function(){
			$('#calcTop1').css('display', 'block');
			$(this).css('display', 'none');
		});
        this.Calculator();
	},
	'Calculator': function(){
		var coordinates = coordinatesCalc.get('coordinatesCalculator');
		if( coordinates != false ) {
			$('#calcTop1').css({
				'top': coordinates.top,
				'left': coordinates.left,
				'width': coordinates.width,
				'height':'auto'
			});
        }
		$('#calcTop1').css({'z-index':unitWork.zIndex+1+$('#unitInfo *').length}).draggable({
			cancel: '#calcTop1 table table',
			containment: 'body',
			cursor: 'move',
			snap: 'body'
		});
		$('#calcTop1 h1:nth-child(1)').mouseup( function(){ coordinatesCalc.set('#calcTop1', 'coordinatesCalculator'); } );

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
		$('#calcButton').click(function(){ calcTopGet(); });

 	   //------
		$('#calcExitBloc').click(function(){
			$('#calcTop1').css('display', 'none');
			$('#calcToBloc').css({'display':'block'});
		});
	},
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
		$('.scriptIks_news').click(function(){ to.get(); });
	}
},

// Функции
unitWork =  {
 	'unit':{}, 'forecast':{}, 'zIndex':0, 'type':'',
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
		case('Больница'):
			d = 0.2;
			break;
		case('Стоматологическая клиника'):
			d = 0.5;
			break;
		case('Фитнес'):
		case('Йога'):
		case('Бодибилдинг'):
		case('Группы здоровья'):
		case('Профессиональный спорт'):
		case('Скалолазание'):
		case('Диагностический центр'):
		case('Поликлиника'):
		case('Детский сад'):
			d = 5;
			break;
		case('Прачечная'):
		case('Химчистка'):
		case('Прачечная самообслуживания'):
		case('SPA-салон'):
			d = 10;
			break;
		case('Косметический салон'):
			d = 20;
			break;
		case('Рыбный ресторан'):
		case('Устричный ресторан'):
			d = 30;
			break;
		case('Парикмахерская'):
		case('Сырный ресторан'):
			d = 40;
			break;
		case('Стейк ресторан'):
		case('Вегетарианский ресторан'):
		case('Ресторан мексиканской кухни'):
			d = 50;
			break;
		case('Пивной ресторан'):
		case('Ресторан итальянской кухни'):
		case('Ресторан греческой кухни'):
			d = 60;
			break;
		case('Фастфуд'):
			d = 70;
			break;
		case('Кафе-мороженое'):
		case('Кафе-кондитерская'):
		case('Кофейня'):
		case('Блинная'):
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
	var url = window.location.pathname.split('/');
	unitWork.url = url;
	$.post('/api/' + url[1] + '/main/unit/summary', { 'id': url[5] }).success( function(data){
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
				$.post('/api/' + url[1] + '/main/unit/forecast', { 'id': url[5] }).success( function(data_){
					unitWork.forecast = data_;
					setInfoUnut();
					Move.InfoUnut();
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
				serviceUnit();
				break;
			default:
				$('tr[name="customers"]').css( 'display', 'none' );
		}
    });
}