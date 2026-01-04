// ==UserScript==
// @name           Victory: персональный манипулятор
// @version        1.03
// @namespace      Victory
// @description    Найм персонала и установка квалы
// @include        http*://*virtonomic*.*/*/main/unit/view/*
// @exclude        http*://*virtonomic*.*/*/main/unit/view/*/*
// @downloadURL https://update.greasyfork.org/scripts/33428/Victory%3A%20%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20%D0%BC%D0%B0%D0%BD%D0%B8%D0%BF%D1%83%D0%BB%D1%8F%D1%82%D0%BE%D1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/33428/Victory%3A%20%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20%D0%BC%D0%B0%D0%BD%D0%B8%D0%BF%D1%83%D0%BB%D1%8F%D1%82%D0%BE%D1%80.meta.js
// ==/UserScript==

var run = function() {
	$( document ).ready(function() {
		var type = getType();
		if (type == 'villa' || type == 'warehouse') return;

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
		//function calcQualTop1(q, p, type)
		// q - квалификация игрока
		// p -  численность персонала
		//вычисляет максимальное квалификацию работающих при заданных их численности и квалификации игрока (обратна calcPersonalTop1())
		///////////////////////////////////////////////////////////////////////////// 
		function calcQualTop1(q, p, type){		
			if(p==0) return 0.00;
			//if(type=='office'){return Math.log(14/4.15*q*q/p)/Math.log(1.4);}
			return Math.log(0.2*14*getK1(type)*q*q/p)/Math.log(1.4);	
		}//end calcQualTop1()

		///////////////////////////////////////////////////////////////////////////
		//function getType()
		//возвращает тип в виде строки  (по изображению)
		///////////////////////////////////////////////////////////////////////////// 
		function getType(){
			var img =  $('.bg-image').attr('class');
			if(img=='') return 'unknown';
			img = img.substring(16,img.length-16);
			return img;
		}
		///////////////////////////////////////////////////////////////////////////
		//getK1(type)
		//возвращает к для расчётов нагрузки по типу для топ-1
		///////////////////////////////////////////////////////////////////////////
		function getK1(type)
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
					if (/anna/.test(window.location.href)) {
					return 10;
					break;
					}
					return 5;
					break;
				case('sawmill'):
					if (/anna/.test(window.location.href)) {
					return 25;
					break;
					}
					return 12.5;
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
					return 15;
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
				case('service_light'):
					return 1.5;
					break;
				case('power'):
					return 75.0;
					break;	
				case('repair'):
					return 2.5;
					break;
				case('fuel'):
					return 2.5;
					break;		
				case('educational'):
					return 1.5;
					break;
				case('it'):
					return 1;
					break;	
				case('villa'):	
				case('warehouse'):	
				case('unknown'):	
				default:
					return 0;
			}//end switch
		}	

		///////////////////////////////////////////////////////////////////////////
		//getPersonal(type)
		//возвращает кол-во работников на предприятии (по типу)
		///////////////////////////////////////////////////////////////////////////
		function getPersonal(type)
		{
			var temp = getPersonal_1(type);
			
			if(temp=='' || temp== -1) return (-1); //error
				return parseInt($('td:contains(' + temp + ')').next().html().replace(/\s+/g, ''));
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
				case('mine'):
				case('fishingbase'):
				case('sawmill'):
					temp='Количество рабочих';
					break;
				case('animalfarm'):
					temp='Количество раб';				
					break;
				case('orchard'):	
					temp='Количество раб';				
					break;
				case('farm'):
					temp='Количество раб';				
					break;
				case('medicine'):
				case('office'):
				case('shop'):
				case('restaurant'):
				case('service_light'):
					temp='Количество сотрудников';				
					break;			
				case('power'):
					temp='Количество рабочих';
					break;
				case('repair'):	
					temp='Количество сотрудников';				
					break;	
				case('fuel'):	
					temp='Количество сотрудников';				
					break;		
				case('educational'):	
					temp='Количество сотрудников';				
					break;	
				case('it'):	
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
		
		function getMaxPers(unitID)
		{
			var maxPers = 0;
			$.ajax({
				url: 'https://virtonomica.ru/olga/window/unit/employees/engage/' + unitID,
				async: false,
				type: 'get',
				success: function(html){
					var storage = $(html);
					maxPers = storage.find('th:contains("Максимальное количество")').next()['0'].innerText.replace(/\s/g,'').match(/\d+/g)['0'];
				}
			});
			return maxPers;
		}	
		
		var butHireTreb = $('<button>').append('Найм Треб').click( function() {
			var unitID = window.location.href.match(/\d+/)['0'];
			var kolSend = 1000000;
			$.ajax({
				url: 'https://virtonomica.ru/olga/window/unit/employees/engage/' + unitID,
				async: false,
				type: 'post',
				data: 'unitEmployeesData[quantity]=' + kolSend + '&salary_max=100000&target_level=&trigger=2'
			});
			location.reload();
		});
		
		var butHire100 = $('<button>').append('Найм 100%').click( function() {
			var unitID = window.location.href.match(/\d+/)['0'];
			var type = getType();
			var kv = getPlayerQual();
			var kolSend = getMaxPers(unitID);
			var kvalSend = f2(calcQualTop1(kv, kolSend, type));
			
			$.ajax({
				url: 'https://virtonomica.ru/olga/window/unit/employees/engage/' + unitID,
				async: false,
				type: 'post',
				data: 'unitEmployeesData[quantity]=' + kolSend + '&salary_max=100000&target_level=' + kvalSend + '&trigger=1'
			});
			location.reload();
		});
		
		var butTreb = $('<button>').append('Треб').click( function() {
			var unitID = window.location.href.match(/\d+/)['0'];
			$.ajax({
				url: 'https://virtonomica.ru/olga/window/unit/employees/engage/' + unitID,
				async: false,
				type: 'post',
				data: 'salary_max=100000&target_level=&trigger=2'
			});
			location.reload();
		});
		
		var but100 = $('<button>').append('100%').click( function() {
			var unitID = window.location.href.match(/\d+/)['0'];
			var type = getType();
			var kv = getPlayerQual();
			var curPers = getPersonal(type);
			var kvalSend = f2(calcQualTop1(kv, curPers, type));
			
			$.ajax({
				url: 'https://virtonomica.ru/olga/window/unit/employees/engage/' + unitID,
				async: false,
				type: 'post',
				data: '&salary_max=100000&target_level=' + kvalSend + '&trigger=1'
			});
			location.reload();
		});
		
		var but120 = $('<button>').append('120%').click( function() {
			var unitID = window.location.href.match(/\d+/)['0'];
			var type = getType();
			var kv = getPlayerQual();
			var curPers = getPersonal(type);
			var kvalSend = f2(calcQualTop1(kv, curPers/1.2, type));
			
			$.ajax({
				url: 'https://virtonomica.ru/olga/window/unit/employees/engage/' + unitID,
				async: false,
				type: 'post',
				data: '&salary_max=100000&target_level=' + kvalSend + '&trigger=1'
			});
			location.reload();
		});
		
		var but144 = $('<button>').append('144%').click( function() {
			var unitID = window.location.href.match(/\d+/)['0'];
			var type = getType();
			var kv = getPlayerQual();
			var curPers = getPersonal(type);
			var kvalSend = f2(calcQualTop1(kv, curPers/1.44, type));
			
			$.ajax({
				url: 'https://virtonomica.ru/olga/window/unit/employees/engage/' + unitID,
				async: false,
				type: 'post',
				data: '&salary_max=100000&target_level=' + kvalSend + '&trigger=1'
			});
			location.reload();
		});
		
		var butShablon = $('<button>').append('Шаблон').click( function() {
			var unitID = window.location.href.match(/\d+/)['0'];
			var type = getType();
			var kolSend = 1000000;
			var kvalSend = 0;
			
			switch(type)
			{
				case('shop')://Магазин
					kvalSend = 1;
					break;
				case('restaurant')://Ресторан
					kvalSend = 1;
					break;
				case('lab')://Лаборатория
					kvalSend = 1;
					break;
				case('workshop')://Завод
					kvalSend = 1;
					break;
				case('mill')://Мельница
					kvalSend = 1;
					break;
				case('sawmill')://Лесопилка
					kvalSend = 1;
					break;
				case('animalfarm')://Животноводческая ферма
					kvalSend = 1;
					break;
				case('medicine')://Больница
					kvalSend = 1;
					break;
				case('fishingbase')://Рыббаза
					kvalSend = 1;
					break;			
				case('farm')://Земледельческая ферма
					kvalSend = 1;
					break;		
				case('orchard')://Плантация
					kvalSend = 1;
					break;
				case('mine')://Шахта
					kvalSend = 1;
					break;
				case('office')://Офис
					kvalSend = 1;
					break;
				case('service_light')://Фитнес-центр, парикмахерская, прачка
					kvalSend = 1;
					break;
				case('power')://Электростанция
					kvalSend = 1;
					break;
				case('repair')://Мастерская
					kvalSend = 1;
					break;
				case('fuel')://АЗС
					kvalSend = 1;
					break;		
				case('educational')://Детсад
					kvalSend = 1;
					break;
				case('it')://Айтишка
					kvalSend = 1;
					break;
				default:
					kvalSend = 1;
					break;;
			}
			
			$.ajax({
				url: 'https://virtonomica.ru/olga/window/unit/employees/engage/' + unitID,
				async: false,
				type: 'post',
				data: 'unitEmployeesData[quantity]=' + kolSend + '&salary_max=100000&target_level=' + kvalSend + '&trigger=1'
			});
			location.reload();
		});
		
		$("#childMenu").after(but144).after(but120).after(but100).after(butTreb).after(butHire100).after(butHireTreb).after(butShablon);
	})
};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);