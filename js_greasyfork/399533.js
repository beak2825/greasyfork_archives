// ==UserScript==
// @name         Цветовая подсветка в данных тс
// @namespace https://greasyfork.org/users/191824
// @version      0.5.6
// @description  ...
// @author       youinvisible
// @include       https://taximeter-admin.taxi.yandex-team.ru/dkk
// @include       https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=dkk*
// @include       https://taximeter-admin.taxi.yandex-team.ru/dkk/priority*
// @include       https://taximeter-admin.taxi.yandex-team.ru/qc?exam=branding
// @include       https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=branding

// @downloadURL https://update.greasyfork.org/scripts/399533/%D0%A6%D0%B2%D0%B5%D1%82%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%BF%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%B2%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85%20%D1%82%D1%81.user.js
// @updateURL https://update.greasyfork.org/scripts/399533/%D0%A6%D0%B2%D0%B5%D1%82%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%BF%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%B2%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85%20%D1%82%D1%81.meta.js
// ==/UserScript==

function setColor(e, params){
	function mark(c,v){
	var el = $('<span/>',{
			css: {
				display: 'inline-block',
				padding: '0 10px',
				border: '1px solid rgb(128,128,128)',
                borderRadius: '5px',
				backgroundColor: v,
			},
            class: 'car-color',
			text: c,
		}).prop('outerHTML');
		src = src.replace(c, el);
		$('#info').html(src);
        $('.car-color').bind('click', function(){
            $(this).css({backgroundColor: 'transparent',border: 'none',padding:'0'})
        });
	};



	var src = $('#info').html();
	var pattern = /[\s\S]*\d{4,4}\s(.+?)\s\(/;
	var color = src.match(pattern)[1];

    if (src.includes('Белград')) {
        let patternSrb = /\([\s\S]*\)/
        let numberSrb = src.match(patternSrb).join()
        if (numberSrb.includes('TX') || numberSrb.includes('tx')) {
            mark(numberSrb, 'rgb(22, 198, 34)')
        } else {
            mark(numberSrb, 'red')
        }
    }


    const arrRegion = [
        '01',
        '02', '102', '702',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13', '113',
        '14',
        '15',
        '16', '116', '716',
        '17',
        '18',
        '19',
        '20',
        '21', '121',
        '22', '122',
        '23', '93', '123', '193',
        '24', '124', '84', '88',
        '25', '125',
        '26', '126',
        '27',
        '28',
        '29',
        '30',
        '31',
        '32',
        '33',
        '34', '134',
        '35',
        '36', '136',
        '37',
        '38', '138', '85',
        '39',
        '40',
        '41',
        '42', '142',
        '43',
        '44',
        '45',
        '46',
        '47', '147',
        '48',
        '49',
        '50', '90', '150', '190', '750', '790',
        '51',
        '52', '152',
        '53',
        '54', '154',
        '55',
        '56', '156',
        '57',
        '58',
        '59', '159', '81',
        '60',
        '61', '161', '761',
        '62',
        '63', '163', '763',
        '64', '164',
        '65',
        '66', '96', '196',
        '67',
        '68',
        '69',
        '70',
        '71',
        '72',
        '73', '173',
        '74', '174', '774',
        '75', '80',
        '76',
        '77', '97', '99', '177', '197', '777', '799', '797', '199',
        '78', '178', '98', '198',
        '79',
        '82',
        '83',
        '86', '186',
        '87',
        '89',
        '92',
        '94',
        '95',
        '80', '81', '84', '88'
    ],
          arrCity = [
              "Хельсинки",
              "Белград",
              'Таллин',"Тарту",
              "Вильнюс",
              "Бухарест",
              "Ташкент", "Наманган",
              "Баку",
              "Минск","Гомель","Гродно","Жодино","Речица","Борисов", "Могилев", "Витебск", "Бобруйск", "Брест", "Барановичи", "Орша", "Беларусь", "Солигорск", "Мозырь", "Слуцк", "Лида",
              "Кишинёв",
              "Рига", "Даугавпилс", "Лиепая", "Валмиера", "Вентспился", "Елгава",
              "Днепр","Запорожье","Киев","Кривой Рог","Львов","Николаев","Одесса","Харьков",
              "Армавирская область","Араратская область","Ванадзор","Горис","Гюмри","Ереван","Капан","Котайкская область",
              "Батуми","Кутаиси","Рустави","Тбилиси",
              "Бишкек","Ош",
              "Актау","Актобе","Алматы","Астана","Атырау","Караганда","Кокшетау","Костанай","Кызылорда","Павлодар","Петропавловск","Семей","Темиртау","Тараз","Туркестан","Уральск","Усть-Каменогорск","Шымкент","Экибастуз","Жезказган","Талдыкорган"
          ]

    let city = params.city;
    let carNumber = params.car;

    let patternNumberFull = /\((((?!\]).)*)\)$/,
        patternNumberCheck = /\d{0,3}$/,
        patternTaxi = /\d{0,2}$/,
        taxi = /^\W\W/,
        number = carNumber.match(patternNumberFull)[1],
        regions = number.match(patternNumberCheck)[0],
        checking = taxi.test(number)

    function setNumber(region) {
        if (arrRegion.includes(region)) {
            mark(number, 'transparent')
        } else {
            mark(number, 'red')
        }
    }

    if (arrCity.indexOf(city) < 0) {
        if (!checking) {
            console.log(regions)
            setNumber(regions)
        } else {
            console.log(number.match(patternTaxi)[0])
            setNumber(number.match(patternTaxi)[0])
        }
    }

	if(color === 'Белый'||color === 'White'){
		mark(color, '#ffffff')
	}else if(color === 'Черный'||color === 'Black'){
		mark(color, '#000')
	}else if(color === 'Красный'||color === 'Red'){
		mark(color, '#f00')
	}else if(color === 'Зеленый'||color === 'Green'){
		mark(color, '#09a90e')
	}else if(color === 'Желтый'||color === 'Yellow'){
		mark(color, '#ffe000')
    }else if(color === 'Темно-синий'||color === 'Dark blue'){
		mark(color, '#042da0')
	}else if(color === 'Синий'||color === 'Blue'){
		mark(color, '#214be4')
	}else if(color === 'Голубой'||color === 'Light blue'){
		mark(color, '#4abcff')
	}else if(color === 'Оранжевый'||color === 'Orange'){
		mark(color, '#ff9900')
	}else if(color === 'Бежевый'||color === 'Beige'){
		mark(color, '#fff5d6')
	}else if(color === 'Серый'||color === 'Gray'){
		mark(color, '#797979')
	}else if(color === 'Фиолетовый'||color === 'Purple'){
		mark(color, '#8e07b1')
	}else if(color === 'Коричневый'||color === 'Brown'){
		mark(color, '#753d2c')
	};

};

$(document).bind('item_info', setColor);