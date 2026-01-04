// ==UserScript==
// @name         Ограничение Вызванных
// @author      Gusev
// @description +ограничение по дате
// @version      0.4
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkk
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkk/priority
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/381781/%D0%9E%D0%B3%D1%80%D0%B0%D0%BD%D0%B8%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%92%D1%8B%D0%B7%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D1%85.user.js
// @updateURL https://update.greasyfork.org/scripts/381781/%D0%9E%D0%B3%D1%80%D0%B0%D0%BD%D0%B8%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%92%D1%8B%D0%B7%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D1%85.meta.js
// ==/UserScript==
(function() {
let queueIsInvited;
const buttonsOn = () =>{
	$('#btn-blacklist').removeClass('hide');
	$('#btn-block').removeClass('hide');
	$('#btn-ok').removeClass('hide');
};

const buttonsOff = () =>{
	$('#btn-blacklist').addClass('hide');
	$('#btn-block').addClass('hide');
	$('#btn-ok').addClass('hide');
};

const makeRestrict = () => {
	let dataInvite =  $('tr.selected').attr('data-invite');
	if(dataInvite !== ''){
		buttonsOff();
	}else{
		buttonsOn();
	}
};

const checkQueue = () =>{
	let val = $('#category').val();
	if(val === 'DkkCommonInvite' || val === 'DkkPriorityInvite' || val === 'DkkCommonBlock' || val === 'DkkPriorityBlock'){
		queueIsInvited = true;
	}else{
		queueIsInvited = false;
	}
};


const checkDate = () =>{
	let itemDate = $('tr.selected>td.padding-s>div.car-images.center>div.content').text();
	if(itemDate.search(/Сегодня/)== 0 && queueIsInvited){
		buttonsOn();
	}else if(itemDate.search(/Сегодня/)== 0 && !queueIsInvited){	
		makeRestrict();
	}else{
		itemDate = itemDate.match(/\d\d.\d\d.\d\d/)[0].split('.');
		let today = new Date().setHours(0, 0, 0, 0);
		itemDate = new Date(`20${itemDate[2]},${itemDate[1]},${itemDate[0]}`);
		let diff = today - itemDate;
		if(diff >= 864000000){
			buttonsOff()
		}else if(diff < 864000000 && queueIsInvited){
			buttonsOn();
		}else if(diff < 864000000 && !queueIsInvited){
			makeRestrict();
		}
		
	}
}

$('#category').change(checkQueue);
$(document).bind('item_info',checkDate);
})();