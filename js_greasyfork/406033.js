// ==UserScript==
// @name         Счетчик проверок транзакций
// @version      0.1.3
// @description  ...
// @author       М
// @include      https://megalith.edadeal.ru/admin/cage/transactions-moderate/*
// @grant        none
// @namespace    https://greasyfork.org/ru/scripts/406033
// @downloadURL https://update.greasyfork.org/scripts/406033/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BE%D0%BA%20%D1%82%D1%80%D0%B0%D0%BD%D0%B7%D0%B0%D0%BA%D1%86%D0%B8%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/406033/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BE%D0%BA%20%D1%82%D1%80%D0%B0%D0%BD%D0%B7%D0%B0%D0%BA%D1%86%D0%B8%D0%B9.meta.js
// ==/UserScript==
 
function writeCounter(){
    $('#complaint-report3').text(`Всего: ${reportComplaint3.total}. `)
};
 
function writeCounter2(){
    $('#complaint-report4').text(`разблок ${reportComplaintsuccess.total}, `)
};
 
function writeCounter3(){
    $('#complaint-report5').text(`блок ${reportComplaintdanger.total} `)
};
 
 
let reportComplaint3 = JSON.parse(localStorage.getItem('reportComplaint3'));
if(!!reportComplaint3){
	writeCounter()
}else{
	reportComplaint3 = {
	total:0,
	};
};
 
let reportComplaintsuccess = JSON.parse(localStorage.getItem('reportComplaintsuccess'));
if(!!reportComplaintsuccess){
	writeCounter2()
}else{
	reportComplaintsuccess = {
	total:0,
	};
};
 
let reportComplaintdanger = JSON.parse(localStorage.getItem('reportComplaintdanger'));
if(!!reportComplaintdanger){
	writeCounter3()
}else{
	reportComplaintdanger = {
	total:0,
	};
};
 
reportComplaint3.add = function(p){
		reportComplaint3[p]++;
		localStorage.setItem('reportComplaint3', JSON.stringify(reportComplaint3));
		writeCounter()
};
 
reportComplaintsuccess.add = function(p){
		reportComplaintsuccess[p]++;
		localStorage.setItem('reportComplaintsuccess', JSON.stringify(reportComplaintsuccess));
		writeCounter2()
};
 
reportComplaintdanger.add = function(p){
		reportComplaintdanger[p]++;
		localStorage.setItem('reportComplaintdanger', JSON.stringify(reportComplaintdanger));
		writeCounter3()
};
 
const bot_token = 'https://api.telegram.org/bot1145725579:AAHgGGh56EBXkAFMFXt9DfkPTOuf2H2puJg/sendMessage?chat_id=-1001227054179&text=';

reportComplaint3.reset = function(){
	var agree = confirm('Сбросить счетчики проверок?');
	if(agree){
        // Извлечение ника и отправка сообщения в Telegram
        var nick = $('body > div > header > nav > div > div.navbar-custom-menu > ul > li > a > span').text();
        var request = new XMLHttpRequest();
        request.open("GET", bot_token+"*"+nick+"*: всего - *"+reportComplaint3.total+"*. разблок "+reportComplaintsuccess.total+", блок "+reportComplaintdanger.total+". ⚠️ *сброс счетчика*&parse_mode=Markdown");
        request.send();
		reportComplaint3.total = 0;
        reportComplaintsuccess.total = 0;
        reportComplaintdanger.total = 0;
		localStorage.setItem('reportComplaint3', JSON.stringify(reportComplaint3));
        localStorage.setItem('reportComplaintsuccess', JSON.stringify(reportComplaintsuccess));
        localStorage.setItem('reportComplaintdanger', JSON.stringify(reportComplaintdanger));
		writeCounter()
        writeCounter2()
        writeCounter3()
	}
};
 
$('<div/>',{
	css:{display:'inline-block'},
	append: $('<span/>',{
			text: `Всего: ${reportComplaint3.total}. `,
			css:{color: '#000', margin:'0 0 0 5px'},
			id:'complaint-report3',
			})
}).insertBefore($('.content-table')).hover(function(){
	$('#report-close').css('display','inline-block')
}, function(){
	$('#report-close').css('display','none')
});
 
$('<div/>',{
	css:{display:'inline-block'},
	append: $('<span/>',{
			text: `разблок ${reportComplaintsuccess.total}, `,
			css:{color: '#000', margin:'0 0 0 5px'},
			id:'complaint-report4',
			})
}).insertBefore($('.content-table')).hover(function(){
	$('#report-close').css('display','inline-block')
}, function(){
	$('#report-close').css('display','none')
});
 
$('<div/>',{
	css:{display:'inline-block'},
	append: $('<span/>',{
			text: `блок ${reportComplaintdanger.total} `,
			css:{color: '#000', margin:'0 0 0 5px'},
			id:'complaint-report5',
			}).add($('<i/>',{
				id: 'report-close',
				text: 'Сбросить',
				css:{color:'#000',font:'12px Source Sans Pro',display:'none', cursor:'pointer', border:'1px solid #000', backgroundColor:'#fff', margin:'0 0 0 15px', width: '78px', padding: '0px 10px', fontWeight:'bold'},
				click: reportComplaint3.reset,
			}))
}).insertBefore($('.content-table')).hover(function(){
	$('#report-close').css('display','inline-block')
}, function(){
	$('#report-close').css('display','none')
});
 
$('button').on('click', function(){
    if( $(this).hasClass('btn btn-success') ){
	reportComplaint3.add('total')
    reportComplaintsuccess.add('total')
    // Извлечение ника и отправка сообщения в Telegram
    var nick = $('body > div > header > nav > div > div.navbar-custom-menu > ul > li > a > span').text();
    var request = new XMLHttpRequest();
    request.open("GET", bot_token+"*"+nick+"*: всего - *"+reportComplaint3.total+"*. разблок "+reportComplaintsuccess.total+", блок "+reportComplaintdanger.total+". ✅ разблокирован&parse_mode=Markdown");
    request.send();
         }
    if( $(this).hasClass('btn btn-danger') ){
	reportComplaint3.add('total')
    reportComplaintdanger.add('total')
    // Извлечение ника и отправка сообщения в Telegram
    var nick = $('body > div > header > nav > div > div.navbar-custom-menu > ul > li > a > span').text();
    var request = new XMLHttpRequest();
    request.open("GET", bot_token+"*"+nick+"*: всего - *"+reportComplaint3.total+"*. разблок "+reportComplaintsuccess.total+", блок "+reportComplaintdanger.total+". ❌ заблокирован&parse_mode=Markdown");
    request.send();
         }
});