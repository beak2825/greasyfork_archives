// ==UserScript==
// @name         Счетчик проверок СТС
// @version      0.2
// @description  ...
// @author       QC
// @match        https://taximeter-admin.taxi.yandex-team.ru/qc?exam=sts
// @grant        none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/380373/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BE%D0%BA%20%D0%A1%D0%A2%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/380373/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BE%D0%BA%20%D0%A1%D0%A2%D0%A1.meta.js
// ==/UserScript==

(function(){
function writeCounter(){
    $('#dkk-report').text('Замечания: '+reportSts.Block+' Успешно: '+reportSts.Success+' Всего: '+ (+reportSts.Block+ +reportSts.Remarks+ +reportSts.Success))
};

var reportSts = JSON.parse(localStorage.getItem('reportSts'));
if(!!reportSts){
	writeCounter()
}else{
	reportSts = {
	BlackList:0,
	Block:0,
	Remarks:0,
	Success:0,
	};
};

reportSts.add = function(p){
		reportSts[p]++;
		localStorage.setItem('reportSts', JSON.stringify(reportSts));
		writeCounter()
};

reportSts.reset = function(){
	var agree = confirm('Сбросить счетчик проверок?');
	if(agree){
		reportSts.BlackList=0;
		reportSts.Block=0;
		reportSts.Remarks=0;
		reportSts.Success=0;
		localStorage.setItem('reportSts', JSON.stringify(reportSts));
		writeCounter()
	}
};

$('<div/>',{
	css:{display:'inline-block'},
	append: $('<span/>',{
			text: 'Замечания: '+reportSts.Block+' Успешно: '+reportSts.Success+' Всего: '+ (+reportSts.Block+ +reportSts.Remarks+ +reportSts.Success),
			css:{color: 'white', margin:'0 0 0 5px'},
			id:'dkk-report',
			}).add($('<i/>',{
				id: 'report-close',
				text: '❌',
				css:{color:'#5bc0de',font:'18px bold sans-serif',display:'none', cursor:'pointer'},
				click: reportSts.reset,
			}))
}).insertBefore($('.container-filters>.pull-right')).hover(function(){
	$('#report-close').css('display','inline')
}, function(){
	$('#report-close').css('display','none')
});


var typeOfCheck;

$('#btn-ok').bind('click',function(){
	if($('div.check-thumb-view-dkk.cover>span.mark-bad:visible').length === 0 ){
		reportSts.add('Success')
	}else{
		typeOfCheck = 'Success'
	}
});

$('#btn-block').bind('click',function(){
	typeOfCheck = 'Block'
});
$('#btn-error').bind('click',function(){
	reportSts.add(typeOfCheck)
});
})()