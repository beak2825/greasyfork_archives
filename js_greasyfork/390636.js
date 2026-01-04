// ==UserScript==
// @name         Счетчик проверок алиасов
// @version      0.1
// @description  ...
// @author       М
// @include      https://megalith.edadeal.ru/admin/cage/complaintresult/details/*
// @include      https://megalith.edadeal.ru/admin/cage/complaintresult/*
// @grant        none
// @namespace    https://greasyfork.org/ru/scripts/390636
// @downloadURL https://update.greasyfork.org/scripts/390636/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BE%D0%BA%20%D0%B0%D0%BB%D0%B8%D0%B0%D1%81%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/390636/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BE%D0%BA%20%D0%B0%D0%BB%D0%B8%D0%B0%D1%81%D0%BE%D0%B2.meta.js
// ==/UserScript==

function writeCounter(){
    $('#complaint-report2').text(`Обработано алиасов: ${reportComplaint2.total}`)
};


let reportComplaint2 = JSON.parse(localStorage.getItem('reportComplaint2'));
if(!!reportComplaint2){
	writeCounter()
}else{
	reportComplaint2 = {
	total:0,
	};
};

reportComplaint2.add = function(p){
		reportComplaint2[p]++;
		localStorage.setItem('reportComplaint2', JSON.stringify(reportComplaint2));
		writeCounter()
};

reportComplaint2.reset = function(){
	var agree = confirm('Сбросить счетчик проверок?');
	if(agree){
		reportComplaint2.total = 0;
		localStorage.setItem('reportComplaint2', JSON.stringify(reportComplaint2));
		writeCounter()
	}
};

$('<div/>',{
	css:{display:'inline-block'},
	append: $('<span/>',{
			text: `Обработано алиасов: ${reportComplaint2.total}`,
			css:{color: '#000', margin:'0 0 0 5px'},
			id:'complaint-report2',
			}).add($('<i/>',{
				id: 'report-close',
				text: 'Сбросить',
				css:{color:'#000',font:'12px Source Sans Pro',display:'none', cursor:'pointer', border:'1px solid #000', backgroundColor:'#fff', margin:'0 0 0 15px', width: '78px', padding: '0px 10px', fontWeight:'bold'},
				click: reportComplaint2.reset,
			}))
}).insertBefore($('.content-table')).hover(function(){
	$('#report-close').css('display','inline-block')
}, function(){
	$('#report-close').css('display','none')
});

$('input[name="_accept"]').bind('click',function(){
	reportComplaint2.add('total')
});

$('input[name="_reject"]').bind('click',function(){
	reportComplaint2.add('total')
});

$('input[name="_accept_next"]').bind('click',function(){
	reportComplaint2.add('total')
});

$('input[name="_reject_next"]').bind('click',function(){
	reportComplaint2.add('total')
});