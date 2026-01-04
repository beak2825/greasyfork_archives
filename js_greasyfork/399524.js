// ==UserScript==
// @name        Кнопки поиска истории ЛЕНА
// @author      Youinvisible
// @description /////
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkk
// @include     https://taximeter-admin.taxi.yandex-team.ru/dkk/priority
// @include     https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=dkk*
// @include     https://taximeter-admin.taxi.yandex-team.ru/qc?exam=branding*
// @version     0.0.2
// @grant       none

// @namespace https://greasyfork.org/users/440504
// @downloadURL https://update.greasyfork.org/scripts/399524/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0%20%D0%B8%D1%81%D1%82%D0%BE%D1%80%D0%B8%D0%B8%20%D0%9B%D0%95%D0%9D%D0%90.user.js
// @updateURL https://update.greasyfork.org/scripts/399524/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0%20%D0%B8%D1%81%D1%82%D0%BE%D1%80%D0%B8%D0%B8%20%D0%9B%D0%95%D0%9D%D0%90.meta.js
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
};
function findNumber(g){
	if(this.id === 'av-c'){
  		window.open(`https://avtocod.ru/proverkaavto/${number}`, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=300,left=300,width=900,height=400");
	}else if(this.id === 'av-r'){
  		window.open(`https://avtoraport.ru/avtoproverka/${number}`, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=300,left=300,width=900,height=400");
        }else if(this.id === 'dkk'){
  		window.open(`https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=dkk&limit=100&number=${number}`,"dkk");
        }else if(this.id === 'sts'){
  		window.open(`https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=sts&limit=100&number=${number}`,"sts");
            }else if(this.id === 'dkb'){
      window.open(`https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=branding&limit=100&number=${number}`,"dkb");

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
 }else if(this.id === 'au-wp'){
		carSplit = car.split(' ');
		model = carSplit[1].replace('-','-').replace("'",'');
		if(carSplit.indexOf('LADA')>=0){
			model = carSplit[2];
			switch(model){
				case 'Priora':
					window.open(`https://www.autowp.ru/lada/priora`);
					break
				case '2107':
					window.open(`https://www.autowp.ru/lada/2107`);
					break
				case '2108':
					window.open(`https://www.autowp.ru/lada/2108`);
					break
				case '2109':
					window.open(`https://www.autowp.ru/lada/2109`);
					break
				case '21099':
					window.open(`https://www.autowp.ru/lada/21099`);
					break
				case '2110':
					window.open(`https://www.autowp.ru/lada/110`);
					break
				case '2111':
					window.open(`https://www.autowp.ru/lada/111`);
					break
				case '2112':
					window.open(`https://www.autowp.ru/lada/112`);
					break
				case '2113':
					window.open(`https://www.autowp.ru/lada/samara_2`);
					break
				case '2114':
					window.open(`https://www.autowp.ru/lada/samara_2`);
					break
				case '2115':
					window.open(`https://www.autowp.ru/lada/samara_2`);
					break
				case 'Granta':
					window.open(`https://www.autowp.ru/lada/granta`);
					break
				case 'Vesta':
					window.open(`https://www.autowp.ru/lada/vesta`);
					break
				case 'XRAY':
					window.open(`https://www.autowp.ru/lada/xray`);
					break
                };
		}else if(carSplit.indexOf('Mercedes-Benz')>=0){
			window.open(`https://www.autowp.ru/mercedes-benz/${model}`);
        }else if(carSplit.indexOf('W124')>=0){
			window.open(`https://www.autowp.ru/mercedes-benz/E-klasse`);
          }else if(carSplit.indexOf('3er')>=0){
			window.open(`https://www.autowp.ru/bmw/3_series`);
        }else if(carSplit.indexOf('5er')>=0){
			window.open(`https://www.autowp.ru/bmw/5_series`);
        }else if(carSplit.indexOf('RAV')>=0){
			window.open(`https://www.autowp.ru/toyota/rav4`);
        }else if(carSplit.indexOf('Fit')>=0){
			window.open(`https://www.autowp.ru/honda/Fit`);
         }else if(carSplit.indexOf('Almera Classic')>=0){
			window.open(`https://www.autowp.ru/nissan/almera/classic`);
        }else if(carSplit.indexOf('Solano')>=0){
			window.open(`https://www.autowp.ru/lifan/solano_ii`);
        }else if(carSplit.indexOf("Cee'd")>=0){
			window.open(`https://www.autowp.ru/kia/cee_d`);
        }else if(carSplit.indexOf('LTI')>=0){
			window.open(`https://www.autowp.ru/LTI`);
         }else if(carSplit.indexOf('Breez')>=0){
			window.open(`https://www.autowp.ru/lifan/520`);
        }else if(carSplit.indexOf('Prado')>=0){
			window.open(`https://www.autowp.ru/Toyota/Land_Cruiser_Prado`);
        }else if(carSplit.indexOf('volkswagen')>=0){
			window.open(`https://www.autowp.ru/volkswagen/${model}`);
		}else if(carSplit.indexOf('ЗАЗ')>=0){
			window.open(`https://www.autowp.ru/zaz/${model}`);
        }else if(carSplit.indexOf('Газель')>=0){
			window.open(`https://www.autowp.ru/gaz`);
		}else if(carSplit.indexOf('Symbol')>=0){
			window.open(`https://www.autowp.ru/renault/symbol`);
		}else if(carSplit.indexOf('Ravon')>=0){
            window.open(`https://www.autowp.ru/ravon/${model}`);
        }else if(carSplit.indexOf('on-DO')>=0){
            window.open(`https://www.autowp.ru/datsun/do`);
        }else if(carSplit.indexOf('mi-DO')>=0){
            window.open(`https://www.autowp.ru/datsun/do`);
		}else if(carSplit.indexOf('H-1')>=0){
			window.open(`https://www.autowp.ru/hyundai/h-1`);
       	}else if(carSplit.indexOf('Xsara Picasso')>=0){
			window.open(`https://www.autowp.ru/citroen/xsara_picasso`);
        }else if(carSplit.indexOf('W124')>=0){
			window.open(`https://www.autowp.ru/mercedes-benz/e-klasse`);
		}else if(carSplit.indexOf('Chery')>=0){
			window.open(`https://www.autowp.ru/chery`);
        }else if(carSplit.indexOf('EC7')>=0){
			window.open(`https://www.autowp.ru/geely/emgrand`);
        }else if(carSplit.indexOf('Профи')>=0){
			window.open(`https://www.autowp.ru/uaz/profi`);
        }else if(carSplit.indexOf('ИЖ')>=0){
			window.open(`https://www.autowp.ru/iz`);
        }else if(carSplit.indexOf('ГАЗЕЛЬ')>=0){
			window.open(`https://www.autowp.ru/gaz/3302`);
        }else if(carSplit.indexOf('Cebrium')>=0){
			window.open(`https://www.autowp.ru/lifan/720`);
        }else if(carSplit.indexOf('NEXT')>=0){
			window.open(`https://www.autowp.ru/gaz/gazel/69036`);
         }else if(carSplit.indexOf('3110')>=0){
            window.open(` https://www.autowp.ru/gaz/volga`);
          }else if(carSplit.indexOf('31105')>=0){
            window.open(` https://www.autowp.ru/gaz/volga`);
        }else if(carSplit.indexOf('Prius')>=0){
			window.open(`https://www.autowp.ru/toyota/${model}`);
        }else if(carSplit.indexOf('T600')>=0){
            window.open(`https://www.autowp.ru/zotye/t600_1`);
        }else if(carSplit.indexOf('Валдай')>=0){
            window.open(`https://www.autowp.ru/gaz/valdaj`);
		}else if(carSplit.indexOf('C4')>=0 && carSplit.indexOf('Grand')>=0){
			window.open(`https://www.autowp.ru/citroen/c4`);
		}else if(carSplit.indexOf('ГАЗ')>=0){
			switch(model){
				case'Volga':
					model = 'volga_siber';
			};
			window.open(`https://www.autowp.ru/gaz/${model}`);
            	}else if(carSplit.indexOf('ГАЗ')>=0){
		}else if(carSplit.length>2){
			for(let i=2;i<carSplit.length;i++){
				model+=`_${carSplit[i]}`;

			};
			//model=`${carSplit[1]}${carSplit[2]}`
			window.open(`https://www.autowp.ru/${carSplit[0]}/${model}`);
		}else{
            window.open(`https://www.autowp.ru/${carSplit[0]}/${model}`);
        };
    };

};

let container = $('#content>.check-thumb-number');
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
checkButton.clone().prop('id', 'au-wp').css('background-color', 'rgba(22,71,65)').text('AutoWP').appendTo(bttnContainer);
checkButton.clone().prop('id', 'sts').css('background-color', 'rgba(255, 188, 0, 0.71)').text('СТС').appendTo(bttnContainer);
checkButton.clone().prop('id', 'dkk').css('background-color', 'rgba(60, 120, 216, 0.71)').text('История ДКК').appendTo(bttnContainer);
checkButton.clone().prop('id', 'dkb').css('background-color', 'rgba(194, 123, 160, 0.71)').text('История ДКБ').appendTo(bttnContainer);

$('#checkButtons>span').bind('click',findNumber);
$(document).bind('item_info', saveCar);