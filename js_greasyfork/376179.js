// ==UserScript==
// @name         Счетчик проверок ДКБ
// @version      0.8
// @description  ...
// @author       Gusev
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkb/Branding
// @include        https://taximeter-admin.taxi.yandex-team.ru/qc?exam=branding*
// @grant        none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/376179/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BE%D0%BA%20%D0%94%D0%9A%D0%91.user.js
// @updateURL https://update.greasyfork.org/scripts/376179/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BE%D0%BA%20%D0%94%D0%9A%D0%91.meta.js
// ==/UserScript==

(function(){
	
	function makeCounter(a){
			function writeCounter(){
$('.container-filters>.check-thumb-number').css('width','250px');
		    $('#dkk-report').text('Блоки: '+reportDkb.Block+' Замечания: '+reportDkb.Remarks+' Успешно: '+reportDkb.Success+' Всего: '+ (+reportDkb.Block+ +reportDkb.Remarks+ +reportDkb.Success))
		};

		var reportDkb = JSON.parse(localStorage.getItem(a));
		if(!!reportDkb){
			writeCounter()
		}else{
			reportDkb = {
			Block:0,
			Remarks:0,
			Success:0,
			};
		};

		reportDkb.add = function(p){
				reportDkb[p]++;
				localStorage.setItem(a, JSON.stringify(reportDkb));
				writeCounter()
		};

		reportDkb.reset = function(){
			var agree = confirm('Сбросить счетчик проверок?');
			if(agree){
				reportDkb.BlackList=0;
				reportDkb.Block=0;
				reportDkb.Remarks=0;
				reportDkb.Success=0;
				localStorage.setItem(a, JSON.stringify(reportDkb));
				writeCounter()
			}
		};

		$('<div/>',{
			css:{display:'inline-block', marginLeft: '325px'},
			append: $('<span/>',{
					text: 'Блоки: '+reportDkb.Block+' Замечания: '+reportDkb.Remarks+' Успешно: '+reportDkb.Success+' Всего: '+ (+reportDkb.Block+ +reportDkb.Remarks+ +reportDkb.Success),
					css:{color: 'white', margin:'0 0 0 5px'},
					id:'dkk-report',
					}).add($('<i/>',{
						id: 'report-close',
						text: '🗙',
						css:{color:'#5bc0de',font:'18px bold sans-serif',display:'inline-block', cursor:'pointer'},
						click: reportDkb.reset,
					}))
		}).insertBefore($('.container-filters>.pull-right'));


		var typeOfCheck;

		$('#btn-ok').bind('click',function(){
				reportDkb.add('Success')
		});
		$('#btn-block').bind('click',function(){
			typeOfCheck = 'Block'
		});
		$('#btn-dkb-minor-remarks').bind('click',function(){
			typeOfCheck = 'Remarks'
		});
		$('#btn-error').bind('click',function(){
			reportDkb.add(typeOfCheck)
		});

	};
makeCounter('reportBranding')

})()