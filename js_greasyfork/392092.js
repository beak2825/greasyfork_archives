// ==UserScript==
// @name         СТС поиск г/н
// @version      0.21
// @description  ...
// @author       QC+G
// @match        https://taximeter-admin.taxi.yandex-team.ru/qc?exam=sts1
// @grant        none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/380359/%D0%A1%D0%A2%D0%A1%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%20%D0%B3%D0%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/380359/%D0%A1%D0%A2%D0%A1%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%20%D0%B3%D0%BD.meta.js
// ==/UserScript==

(function() {
let car,
    year,
	number,
	carSplit,
	model;
function saveCar(e,params){
    if (params.car_number === undefined) {
        number
    } else {
        number = params.car_number;
    }
    //number = params.car_number;
    car = params.car.match(/([\s\S]+)\s\[[\s\S]*/)[1];
    year = params.car_year;
};
function findNumber(g){
	if(this.id === 'av-c'){
  		window.open(`https://avtocod.ru/proverkaavto/${number}`, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=300,left=300,width=900,height=400");
	}else if(this.id === 'av-r'){
  		window.open(`https://avtoraport.ru/avtoproverka/${number}`, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=300,left=300,width=900,height=400");
        }else if(this.id === 'av-b'){
  		window.open(`https://b2b.avtocod.ru/reports?limit=5&search=${number}&dateStart=&dateEnd=&status=`,"b2b");
        }else if(this.id === 'dk-k'){
  		window.open(`https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=dkk&limit=100&number=${number}`,"dkk", "toolbar=yes,scrollbars=yes,resizable=yes,top=250,left=400,width=900,height=550");
        }else if(this.id === 'dk-b'){
  		window.open(`https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=branding&limit=100&number=${number}`,"dkk", "toolbar=yes,scrollbars=yes,resizable=yes,top=250,left=400,width=900,height=550");
	}else if(this.id === 'mos'){
		window.open(`http://mtdi.mosreg.ru/deyatelnost/celevye-programmy/taksi1/proverka-razresheniya-na-rabotu-taksi?number=${number}&name=&id=&region=ALL`, "_blank", "toolbar=yes,scrollbars=1,resizable=yes,top=100,left=400,width=900,height=900");
	}else if(this.id === 'au-r'){
		carSplit = car.split(' ');
		model = carSplit[1].replace('-','_').replace("'",'');
		if(carSplit.indexOf('LADA')>=0){
			model = carSplit[2];
			switch(model){
				case 'Priora':
					window.open(`https://auto.ru/catalog/cars/vaz/2170/?year_from=${year}&year_to=${year}`);
					break
				default:
					window.open(`https://auto.ru/catalog/cars/vaz/${model}/?year_from=${year}&year_to=${year}`);
				};
		}else if(carSplit.indexOf('Mercedes-Benz')>=0){
			window.open(`https://auto.ru/catalog/cars/mercedes/${model}/?year_from=${year}&year_to=${year}`);
		}else if(carSplit.indexOf('ЗАЗ')>=0){
			window.open(`https://auto.ru/catalog/cars/zaz/${model}/?year_from=${year}&year_to=${year}`);
		}else if(carSplit.indexOf('Symbol')>=0){
			window.open(`https://auto.ru/catalog/cars/renault/clio_symbol/?year_from=${year}&year_to=${year}`);
		}else if(carSplit.indexOf('H-1')>=0){
			window.open(`https://auto.ru/catalog/cars/hyundai/h_1_starex/?year_from=${year}&year_to=${year}`);
		}else if(carSplit.indexOf('Chery')>=0){
			window.open(`https://auto.ru/catalog/cars/chery/${model}/?year_from=${year}&year_to=${year}`);
		}else if(carSplit.indexOf('C4')>=0 && carSplit.indexOf('Grand')>=0){
			window.open(`https://auto.ru/catalog/cars/citroen/c4_picasso/?year_from=${year}&year_to=${year}`);
		}else if(carSplit.indexOf('ГАЗ')>=0){
			switch(model){
				case'Volga':
					model = 'volga_siber';
			};
			window.open(`https://auto.ru/catalog/cars/gaz/${model}/?year_from=${year}&year_to=${year}`);
		}else if(carSplit.length>2){
			for(let i=2;i<carSplit.length;i++){
				model+=`_${carSplit[i]}`
			};
			//model=`${carSplit[1]}_${carSplit[2]}`
			window.open(`https://auto.ru/catalog/cars/${carSplit[0]}/${model}/?year_from=${year}&year_to=${year}`);
		}else{
            window.open(`https://auto.ru/catalog/cars/${carSplit[0]}/${model}/?year_from=${year}&year_to=${year}`);
        };
    };

};

let container = $('.check-thumb-number');
let info = $('#info');
$('<br>').appendTo(container);
let bttnContainer = $('<div/>',{id:'checkButtons',css:{display:'inline-block'}}).appendTo(container);
let checkButton = $('<span/>',{
	id: 'av-c',
	css:{
		display: 'inline-block',
		margin: '0 10px 0 0',
		padding: '0 3px',
		backgroundColor: 'rgba(43, 190, 226, 0.71)',
		borderRadius: '3px',
		cursor: 'pointer'
	},
	text: 'Поиск г/н',
});

checkButton.text('автокод').prependTo(bttnContainer);
checkButton.clone().prop('id', 'av-r').css('background-color', 'rgba(255, 188, 0, 0.71)').text('рапорт').prependTo(bttnContainer);
checkButton.clone().prop('id', 'mos').css('background-color', 'rgba(205, 54, 51, 0.71)').text('mosreg').prependTo(bttnContainer);
checkButton.clone().prop('id', 'au-r').css('background-color', 'rgba(219, 55, 39, 0.71)').text('авто.ру').appendTo(bttnContainer);
checkButton.clone().prop('id', 'dk-k').css('background-color', 'rgba(100, 100, 255, 0.71)').text('в дкк').appendTo(bttnContainer);
checkButton.clone().prop('id', 'dk-b').css('background-color', 'rgba(150, 100, 50, 0.71)').text('в дкб').appendTo(bttnContainer);
checkButton.clone().prop('id', 'av-b').css('background-color', 'rgba(47, 117, 181, 0.71)').text('автокод b2b').appendTo(bttnContainer);

$('#checkButtons>span').bind('click',findNumber);
$(document).bind('item_info', saveCar);

})();