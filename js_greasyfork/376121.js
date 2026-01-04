// ==UserScript==
// @name         Счетчик проверок ДКК
// @version      0.8.5
// @description  ...
// @author       Gusev
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkk
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkk/priority
// @grant        none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/376121/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BE%D0%BA%20%D0%94%D0%9A%D0%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/376121/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BE%D0%BA%20%D0%94%D0%9A%D0%9A.meta.js
// ==/UserScript==

function Dkk(){
var number;
$(document).bind('item_info', function(e,params){
	number = params.car.match(/\((((?!\]).)*)\)$/)[1].replace(/\s+/g, '');
});

function writeCounter(){
    $('#dkk-report').text('ЧС: '+reportDkk.BlackList+' Блоки: '+reportDkk.Block+' Замечания: '+reportDkk.Remarks+' Успешно: '+reportDkk.Success+' Всего: '+ (+reportDkk.BlackList+ +reportDkk.Block+ +reportDkk.Remarks+ +reportDkk.Success))
};

var reportDkk = JSON.parse(localStorage.getItem('reportDkk'));
if(!!reportDkk){
	writeCounter()
}else{
	reportDkk = {
	BlackList:0,
	Block:0,
	Remarks:0,
	Success:0,
	history:[],
	};
};

reportDkk.load = function(){
        var localReportDkk = JSON.parse(localStorage.getItem('reportDkk'));
        for(var prop in localReportDkk){
           reportDkk[prop] = localReportDkk[prop]
        };
};

reportDkk.add = function(p){
		reportDkk.load();
		reportDkk[p]++;
		reportDkk['history'].push({number,p});
		localStorage.setItem('reportDkk', JSON.stringify(reportDkk));
		writeCounter()
};

reportDkk.reset = function(){
	var agree = confirm('Сбросить счетчик проверок?');
	if(agree){
		reportDkk.BlackList=0;
		reportDkk.Block=0;
		reportDkk.Remarks=0;
		reportDkk.Success=0;
		reportDkk.history=[];
		localStorage.setItem('reportDkk', JSON.stringify(reportDkk));
		writeCounter()
	}
};

$('<div/>',{
	css:{display:'inline-block'},
	append: $('<span/>',{
			text: 'ЧС: '+reportDkk.BlackList+' Блоки: '+reportDkk.Block+' Замечания: '+reportDkk.Remarks+' Успешно: '+reportDkk.Success+' Всего: '+ (+reportDkk.BlackList+ +reportDkk.Block+ +reportDkk.Remarks+ +reportDkk.Success),
			css:{color: 'white', margin:'0 0 0 5px'},
			id:'dkk-report',
			}).add($('<i/>',{
				id: 'report-close',
				text: '🗙',
				css:{color:'#5bc0de',font:'18px bold sans-serif',display:'none', cursor:'pointer'},
				click: reportDkk.reset,
			}))
}).insertBefore($('.container-filters>.pull-right')).hover(function(){
	$('#report-close').css('display','inline')
}, function(){
	$('#report-close').css('display','none')
});

$('div.pull-right').append($('<button/>',{
	class:'rotate btn btn-info',
	text:'История г/н',
	id:'historyDkk',
	css:{backgroundColor:'#646f9a'},
}).bind('click',function(){
	var container =  $('.datagrid-content>table>tbody:last');
    reportDkk.load();
	container.empty();
	reportDkk.history.forEach(function(item){
		$(container).append($('<tr/>',{
			append: $('<td/>',{
				text: item['number']
			}).add($('<td/>',{
				text:item['p']
			}))
		}))
	});
	})
);

var typeOfCheck;

$('#btn-ok').bind('click',function(){
	if($('div.check-thumb-view-dkk.cover>span.mark-bad:visible').length === 0 ){
		reportDkk.add('Success')
	}else{
		typeOfCheck = 'Remarks'
	}
});
$('#btn-ok-remarks').bind('click',function(){
	typeOfCheck = 'Remarks'
});

$('#btn-block').bind('click',function(){
	typeOfCheck = 'Block'
});
$('#btn-blacklist').bind('click',function(){
	typeOfCheck = 'BlackList'
});
$('#btn-error').bind('click',function(){
	reportDkk.add(typeOfCheck)
});
}

Dkk()

//
function converTime(time){
    const date = time.split('.')
    return new Date(`20${date[2]}`, date[1]-1, date[0])
}

function opacityHistory(){
    setTimeout(() => {
        let table = document.querySelector('#table-mkk-driver>.datagrid-body>.datagrid-content>table>tbody')
        const tableHistory = table !== null ? [...table.querySelectorAll('tr>td>.clearfix>.padding-s-bottom')] : []
        tableHistory.forEach(item => {
            const time = converTime(item.querySelector('b').textContent.split(' ')[0])
            const user = item.querySelector('.gray').textContent.replace(/— /,'').trim()
            const resoluion = item.querySelector('.gray.clearfix') || null
            if (resoluion !== null) resoluion.style.userSelect = 'none'
            const diffTime = Math.floor(new Date()-time)/(24*60*60*1000)
            if(user === 'ml_Calvin' || user === 'Toloka' || diffTime > 20){
                item.closest('tr').style.opacity = '0.5'
            }
        })
    }, 2000)
}

$(document).bind('item_info', function(e, params){
    opacityHistory()
})

document.querySelector('li[data-mode="driver"]>a').addEventListener('click', () => opacityHistory())
document.querySelector('li[data-mode="car_number"]>a').addEventListener('click', () => opacityHistory())