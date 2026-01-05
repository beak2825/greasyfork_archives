// ==UserScript==
// @name           Victory: поставки
// @version        2.00
// @namespace      Victory
// @description    Заказ различного объёма рынка
// @include        http*://*virtonomic*.*/*/main/unit/view/*/supply
// @require        https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/29780/Victory%3A%20%D0%BF%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/29780/Victory%3A%20%D0%BF%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let unit_id = window.location.href.match(/\d+/)[0],
        realm_name = window.location.href.match(/\/(\w+)\/main\//)[1];

    //Получение типа предприятия
    function getType(){
		let type = $("div.title script").text().split('\n')['4'];
		type = type.substring(type.indexOf('bgunit-')+7, type.length-5);
		return type;
	}


	//Проверка на магазинность. Не в магазинах и заправках не запускаем
    let type = getType();
    if (type != ('shop' || 'fuel')) { return; }


    //Функция берёт страничку торгового зала - нужно для формирования запросов к апи. Потом запускает процесс дальше
    //Подсчитывается число товаров в магазине, после чего запускается рекурсивная функция на обработку каждого товара
    let trade_hall,//сохраняем страницу торгового зала
        volume;//сюда каждая кнопка записывает желаемый объём рынка в штуках
    function step_1() {
        $.ajax({
            url: 'https://virtonomica.ru/' + realm_name + '/main/unit/view/' + unit_id + '/trading_hall',
            type: 'get',
            success: function (data) {
                trade_hall = $(data);

                let product_counter_max = $('.product_row > th > table > tbody > tr > td > img[src*="/img/products/"]').length;//Подсчитываем, сколько товаров имеется в заказах. Вычитаем 1 для верной работы с DOM

                step_2(0, product_counter_max);
            },
            error: function () {
                setTimeout(function() { step_1(); }, 5000);
            }
        })
    }


    //Основная функция. Проходит по всем нужным товарам, получает по апи данные об объёме рынка
    function step_2(current_product_counter, product_counter_max) {
        if (current_product_counter == product_counter_max) { $('input[value="Изменить"]').click(); }//когда дошли до конца - кликаем на кнопку сохранения результатов
        else {
            let product_id = $('.product_row > th > table > tbody > tr > td > img[src*="/img/products/"]').eq(current_product_counter).attr('src'),//каждый из товаров определяем по картинке
                market_size,//объём рынка города
                market_report_id = trade_hall.find('img[src="' + product_id + '"]').parent().attr('href').match(/\?.*/)[0];//параметры для запроса к апи
            
            $.ajax({
                url: 'https://virtonomica.ru/api/' + realm_name + '/main/marketing/report/retail/metrics' + market_report_id,
                type: 'get',
                success: function (data) {
                    market_size = data.local_market_size;
                    
                    $('input[name*="supplyContractData[party_quantity]"]').eq(current_product_counter).attr('value', parseInt((market_size * (volume / 100)).toFixed(0)));//в соответствии с данными от кнопки выставляем числа в заказ
                    
                    current_product_counter++;
                    
                    step_2(current_product_counter, product_counter_max);
                },
                error: function() {
                    setTimeout(function() { step_2(current_product_counter, product_counter_max); }, 1000);
                }
            })
        }
    }
    
    
    //Размещаем все кнопки в интерфейсе
    let btnx095 = $('<button>').append('95%').on('click', function() {
        volume = 95;
        step_1();
    });

    let btnx050 = $('<button>').append('50%').on('click', function() {
        volume = 50;
        step_1();
    });
    let btnx040 = $('<button>').append('40%').on('click', function() {
        volume = 40;
        step_1();
    });
    let btnx025 = $('<button>').append('25%').on('click', function() {
        volume = 25;
        step_1();
    });

    let btnx020 = $('<button>').append('20%').on('click', function() {
        volume = 20;
        step_1();
    });

    let btnx010 = $('<button>').append('10%').on('click', function() {
        volume = 10;
        step_1();
    });

    let btnx005 = $('<button>').append('5%').on('click', function() {
        volume = 5;
        step_1();
    });

    let btnx000 = $('<button>').append('0%').on('click', function() {
        $('.product_row > th > table > tbody > tr > td > img[src*="/img/products/"]').each(function() {
            $('input[name*="supplyContractData[party_quantity]"]', $(this).closest('.product_row')).attr('value', 0);
        });
        $('input[value="Изменить"]').click();
    });

    let myInput = $('<input id="myInput" type="text" size="4">');
    let btnT = $('<button>').append('Тыц').on('click', function() {
        volume = +($('#myInput').attr('value'));
        step_1();
    });

    $("#childMenu").after(btnT,myInput,btnx095,btnx050,btnx040,btnx025,btnx020,btnx010,btnx005,btnx000);
    
    
    //Старый код. Надо доработать в новом коде раздел с заказом каждого товара по собственным процентам
    
	/*$( document ).ready(function() {
		//Считываем тип предприятия
		var img =  $('.bg-image').attr('class');
		img = img.substring(16,img.length-16);

		function main(k){
			var tradingHallPageUrl = $('.tabu > li:nth-child(5) > a:nth-child(1)').attr('href');
			var tradingHall;
			$.ajax({
				  url: tradingHallPageUrl,
				  async: false,
				  success: function(html){
					tradingHall = $(html);
				  }
			});

			var marketReport;
			var marketReportPage;
			var product;
			$('.product_row > th > table > tbody > tr > td > img[src*="/img/products/"]').each(function() {
				product = $(this).attr('src');
				marketReportPage = tradingHall.find('img[src="' + product + '"]').parent().attr('href');
				$.ajax({
					url: marketReportPage,
					async: false,
					success: function(html){
						marketReport = $(html);
						volume = +marketReport.find('td:contains("Объем рынка")').eq(0).next().text().replace(/[^0-9]/g, "");

					}
				});
				$('input[name*="supplyContractData[party_quantity]"]', $(this).closest('.product_row')).attr('value', parseInt((volume*(k)).toFixed(2)));
			});
			$('input[value="Изменить"]').click();
		}

		function main2(){
			var tradingHallPageUrl = $('.tabu > li:nth-child(5) > a:nth-child(1)').attr('href');
			var tradingHall;
			$.ajax({
				  url: tradingHallPageUrl,
				  async: false,
				  success: function(html){
					tradingHall = $(html);
				  }
			});

			var marketReport;
			var marketReportPage;
			var product;
			$('.product_row > th > table > tbody > tr > td > img[src*="/img/products/"]').each(function() {
				if (+($(this).closest('.product_row').find('.myInput2').val()) != 0) {
					product = $(this).attr('src');
					marketReportPage = tradingHall.find('img[src="' + product + '"]').parent().attr('href');
					$.ajax({
						url: marketReportPage,
						async: false,
						success: function(html){
							marketReport = $(html);
							volume = +marketReport.find('td:contains("Объем рынка")').eq(0).next().text().replace(/[^0-9]/g, "");

						}
					});
					var k = (+$(this).closest('.product_row').find('.myInput2').val())/100;
					$('input[name*="supplyContractData[party_quantity]"]', $(this).closest('.product_row')).attr('value', parseInt((volume*(k)).toFixed(2)));
				}
			});
			$('input[value="Изменить"]').click();
		}

		//Запускаем только в магазинах и АЗС
		if(img == 'shop' || img == 'fuel') {
			var k;

			var btnx095 = $('<button>').append('95%').click(function() {
				k = 0.95;
				main(k);
			});

			var btnx050 = $('<button>').append('50%').click(function() {
				k = 0.50;
				main(k);
			});
			var btnx040 = $('<button>').append('40%').click(function() {
				k = 0.40;
				main(k);
			});
			var btnx025 = $('<button>').append('25%').click(function() {
				k = 0.25;
				main(k);
			});

			var btnx020 = $('<button>').append('20%').click(function() {
				k = 0.20;
				main(k);
			});

			var btnx010 = $('<button>').append('10%').click(function() {
				k = 0.10;
				main(k);
			});

			var btnx005 = $('<button>').append('5%').click(function() {
				k = 0.05;
				main(k);
			});

			var btnx000 = $('<button>').append('0%').click(function() {
				$('.product_row > th > table > tbody > tr > td > img[src*="/img/products/"]').each(function() {
				$('input[name*="supplyContractData[party_quantity]"]', $(this).closest('.product_row')).attr('value', 0);
			});
			$('input[value="Изменить"]').click();
			});

			var myInput = $('<input id="myInput" type="text" size="4">');
			var btnT = $('<button>').append('Тыц').click(function() {
				k = +($('#myInput').attr('value'))/100;
				main(k);
			});

			var myInput2 = $('<input class="myInput2" type="text" size="4">');
			var btnT2 = $('<button>').append('ТыцШпыц').click(function() {
				main2();
			});

			$('input[name^="supplyContractData[party_quantity]"]').after(myInput2).after('<br></br>');

			$("#childMenu").after(btnT2).after(btnT).after(myInput).after(btnx095).after(btnx050).after(btnx040).after(btnx025).after(btnx020).after(btnx010).after(btnx005).after(btnx000);
		}
	});*/
})();