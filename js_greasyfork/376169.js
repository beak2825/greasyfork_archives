// ==UserScript==
// @name         Счетчик проверок ДКВУ
// @version      0.3
// @description  ...
// @author       QC
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkb/Dkvu
// @include     https://taximeter-admin.taxi.yandex-team.ru/qc?exam=dkvu
// @grant        none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/376169/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BE%D0%BA%20%D0%94%D0%9A%D0%92%D0%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/376169/%D0%A1%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BE%D0%BA%20%D0%94%D0%9A%D0%92%D0%A3.meta.js
// ==/UserScript==

(function(){
function writeCounter(){
    $('#dkk-report').text('ЧС: '+reportDkvu.BlackList+' Замечания: '+reportDkvu.Block+' Успешно: '+reportDkvu.Success+' Всего: '+ (+reportDkvu.BlackList+ +reportDkvu.Block+ +reportDkvu.Remarks+ +reportDkvu.Success))
};

var reportDkvu = JSON.parse(localStorage.getItem('reportDkvu'));
if(!!reportDkvu){
	writeCounter()
}else{
	reportDkvu = {
	BlackList:0,
	Block:0,
	Remarks:0,
	Success:0,
    history:[],
	};
};

reportDkvu.load = function(){
        var localReportDkvu = JSON.parse(localStorage.getItem('reportDkvu'));
        for(var prop in localReportDkvu){
           reportDkvu[prop] = localReportDkvu[prop]
        };
};


var licenseNumber;
function SaveLicenseInput(){
    licenseNumber = $('#dkvu-license-number').val().replace(/\s+/g, '');
    console.log(licenseNumber);
};
function SaveLicenseItem(e,a){
    licenseNumber = a['driver_license'].replace(/\s+/g, '');
    console.log(licenseNumber);
};
$('#dkvu-license-number').on('change',SaveLicenseInput);
$(document).on('item_info', SaveLicenseItem);

reportDkvu.add = function(p){
		reportDkvu.load();
		reportDkvu['history'].push({licenseNumber,p});
		reportDkvu[p]++;
		console.log(reportDkvu);
		localStorage.setItem('reportDkvu', JSON.stringify(reportDkvu));
		writeCounter()
};

reportDkvu.reset = function(){
	var agree = confirm('Сбросить счетчик проверок?');
	if(agree){
		reportDkvu.BlackList=0;
		reportDkvu.Block=0;
		reportDkvu.Remarks=0;
		reportDkvu.Success=0;
        reportDkvu.history=[];
		localStorage.setItem('reportDkvu', JSON.stringify(reportDkvu));
		writeCounter()
	}
};

$('<div/>',{
	css:{display:'inline-block'},
	append: $('<span/>',{
			text: 'ЧС: '+reportDkvu.BlackList+' Замечания: '+reportDkvu.Block+' Успешно: '+reportDkvu.Success+' Всего: '+ (+reportDkvu.BlackList+ +reportDkvu.Block+ +reportDkvu.Remarks+ +reportDkvu.Success),
			css:{color: 'white', margin:'0 0 0 5px'},
			id:'dkk-report',
			}).add($('<i/>',{
				id: 'report-close',
				text: '🗙',
				css:{color:'#5bc0de',font:'18px bold sans-serif',display:'none', cursor:'pointer'},
				click: reportDkvu.reset,
			}))
}).insertBefore($('.container-filters>.pull-right')).hover(function(){
	$('#report-close').css('display','inline')
}, function(){
	$('#report-close').css('display','none')
});

$('div.pull-right').append($('<button/>',{
	class:'rotate btn btn-info',
	text:'История В/У',
	id:'historyDkvu',
	css:{backgroundColor:'#646f9a'},
}).bind('click',function(){
	var container =  $('.tab-content');
    if($("#check_history").length>0){
            $(container).find('.active.in').removeClass('active in');
            $("#check_history").toggleClass('active in');
            $('#items-tabs>li').removeClass('active');
       }else{
          $(container).find('.active.in').removeClass('active in');
           $('<div/>',{
               id:'check_history',
               class:'tab-pane fade active in',
               append: $('<div/>',{
                   class:'datagrid datagrid-striped datagrid-vertical-top datagrid-disable-scroll-h font12',
                   append:$('<div/>',{
                       class:'datagrid-body nonbounce',
                       append:$('<div/>',{
                           class:'datagrid-content',
                           append: $('<table/>',{
                               id:'history_container',
                               append: $('<tbody/>',{
                                   class:'history_table'
                               })
                           })
                       })
                   })
               })
           }).prependTo(container);
           $('#items-tabs>li').removeClass('active');
       };

    var historyTable = $('.history_table');
    reportDkvu.load();
	historyTable.empty();
	reportDkvu.history.forEach(function(item){
		$(historyTable).append($('<tr/>',{
			append: $('<td/>',{
				text: item['licenseNumber']
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
		reportDkvu.add('Success')
	}else{
		typeOfCheck = 'Remarks'
	}
});

$('#btn-block').bind('click',function(){
	typeOfCheck = 'Block'
});
$('#btn-blacklist').bind('click',function(){
	typeOfCheck = 'BlackList'
});
$('#btn-error').bind('click',function(){
	reportDkvu.add(typeOfCheck)
});
})()