// ==UserScript==
// @name        Быстрый поиск Г/Н (TEST)
// @author      Gusev
// @description /////
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkk
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkb/chairs
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkb/Lightbox
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkb/Stiker
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkb/Charge
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkb/Rug
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkk/priority
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkk/history*
// @version     1
// @grant       none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/378249/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%20%D0%93%D0%9D%20%28TEST%29.user.js
// @updateURL https://update.greasyfork.org/scripts/378249/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%20%D0%93%D0%9D%20%28TEST%29.meta.js
// ==/UserScript==

let car,
    year,
	number,
	carSplit,
	model;
function saveCar(e,params){
    number = params.car.match(/\((((?!\]).)*)\)$/)[1].replace(/\s+/g, '');
    car = params.car.match(/([\s\S]+)\s\[[\s\S]*/)[1];
    year = params.car_year;
    console.log(number,car,year)
};
function findNumber(g){
	if(this.id === 'av-c'){
  		window.open(`https://avtocod.ru/proverkaavto/${number}`, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=300,left=300,width=900,height=400");
	}else if(this.id === 'av-r'){
  		window.open(`https://avtoraport.ru/avtoproverka/${number}`, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=300,left=300,width=900,height=400");
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

checkButton.prependTo(bttnContainer);
checkButton.clone().prop('id', 'av-r').css('background-color', 'rgba(255, 188, 0, 0.71)').prependTo(bttnContainer);
checkButton.clone().prop('id', 'mos').css('background-color', 'rgba(205, 54, 51, 0.71)').prependTo(bttnContainer);
checkButton.clone().prop('id', 'au-r').css('background-color', 'rgba(219, 55, 39, 0.71)').text('Авто.ру').appendTo(bttnContainer);

$('#checkButtons>span').bind('click',findNumber);
$(document).bind('driver_info', saveCar);