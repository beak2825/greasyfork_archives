// ==UserScript==
// @name         Счетчик проверок жалоб
// @version      0.7
// @description  ...
// @author       М
// @include      https://megalith.edadeal.ru/admin/cage/complaint/moderate/*
// @include      https://megalith.edadeal.ru/admin/cage/complaint/*
// @grant        none
// @run-at       document-idle
// @namespace    https://greasyfork.org/ru/scripts/383375
// @downloadURL https://update.greasyfork.org/scripts/383375/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BE%D0%BA%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/383375/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BE%D0%BA%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1.meta.js
// ==/UserScript==

function writeCounter(){
    $('#complaint-report').text(`Обработано: ${reportComplaint.total}`)
};


let reportComplaint = JSON.parse(localStorage.getItem('reportComplaint'));
if(!!reportComplaint){
	writeCounter()
}else{
	reportComplaint = {
	total:0,
	};
};

reportComplaint.add = function(p){
		reportComplaint[p]++;
		localStorage.setItem('reportComplaint', JSON.stringify(reportComplaint));
		writeCounter()
};

const bot_token = 'https://api.telegram.org/bot1145725579:AAHgGGh56EBXkAFMFXt9DfkPTOuf2H2puJg/sendMessage?chat_id=-1002616357199&text=';

reportComplaint.reset = function(){
	var agree = confirm('Сбросить счетчик проверок?');
	if(agree){
        // Извлечение ника и отправка сообщения в Telegram
        var nick = $('body > div > header > nav > div > div.navbar-custom-menu > ul > li > a > span').text();
        var request = new XMLHttpRequest();
        request.open("GET", bot_token+"*"+nick+"*: всего - *"+reportComplaint.total+"*, ⚠️ *сброс счетчика*&parse_mode=Markdown");
        request.send();
		reportComplaint.total = 0;
		localStorage.setItem('reportComplaint', JSON.stringify(reportComplaint));
		writeCounter()
	}
};

$('<div/>',{
	css:{display:'inline-block'},
	append: $('<span/>',{
			text: `Обработано: ${reportComplaint.total}`,
			css:{color: '#000', margin:'0 0 0 5px', padding:'13px 15px', font:'20px Source Sans Pro', backgroundColor:'#ffd700', fontWeight:'bold', display: 'block'},
			id:'complaint-report',
			}).add($('<i/>',{
				id: 'report-close',
				text: 'Сбросить',
				css:{color:'#000',font:'12px Source Sans Pro',display:'none', cursor:'pointer', border:'1px solid #000', backgroundColor:'#fff', margin:'0 0 0 15px', width: '78px', padding: '0px 10px', fontWeight:'bold'},
				click: reportComplaint.reset,
			}))
}).insertAfter($('.navbar-custom-menu')).hover(function(){
	$('#report-close').css('display','inline-block')
}, function(){
	$('#report-close').css('display','none')
});

$('input[name="_save_and_get_next"]').bind('click',function(){
	reportComplaint.add('total')
    // Извлечение ника и отправка сообщения в Telegram
    var nick = $('body > div > header > nav > div > div.navbar-custom-menu > ul > li > a > span').text();
    var request = new XMLHttpRequest();
    request.open("GET", bot_token+"*"+nick+"*: %2B1 жалоба, всего - *"+reportComplaint.total+"*&parse_mode=Markdown");
    request.send();
});

$('input[name="_save_editing"]').bind('click',function(){
	reportComplaint.add('total')
    // Извлечение ника и отправка сообщения в Telegram
    var nick = $('body > div > header > nav > div > div.navbar-custom-menu > ul > li > a > span').text();
    var request = new XMLHttpRequest();
    request.open("GET", bot_token+"*"+nick+"*: %2B1 жалоба, всего - *"+reportComplaint.total+"*&parse_mode=Markdown");
    request.send();
});
