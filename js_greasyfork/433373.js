// ==UserScript==
// @namespace      virtonomica
// @name           Virtonomica: Quick supply
// @include        https://virtonomic*.*/*/main/unit/view/*/supply
// @version        4.06.20211002
// @description Quick supply.
// @downloadURL https://update.greasyfork.org/scripts/433373/Virtonomica%3A%20Quick%20supply.user.js
// @updateURL https://update.greasyfork.org/scripts/433373/Virtonomica%3A%20Quick%20supply.meta.js
// ==/UserScript==

(function(window) {
	let run = function() {

	    let type = getType();

      	function getType(){
	    	var img = $('.bg-image').attr('class');
		    if(img==='') return 'unknown';
		    img = img.substring(16,img.length-16);
            console.log (img);
            if (img==="service_light") img="service";
            return img;
	    }//end getType()



        let unitNumberArr= /(.*)main(.*)view(.*)supply/.exec(window.location.href);
        let unitNumber = unitNumberArr[3];
        unitNumber = unitNumber.substring(0, unitNumber.length - 1);
        let unitNumberX = parseInt(unitNumber.replace( /\D/g, ''));
        var unitNumberX_api = "https://virtonomica.ru/api/olga/main/unit/summary?id=" + unitNumberX;
        console.log('unitNumberX_api',unitNumberX_api);

        function getDataFromApi() {
		    $.ajax({
		    url: unitNumberX_api,
	        cache: false,
		    success: function(unitsummarydata) {
			    //unit_sizes_array[unitNumberX] = new Object();
				console.log(unitsummarydata);
			    var onHoliday = unitsummarydata.on_holiday;
			    var unitTypeProduceName = unitsummarydata.unit_type_produce_name;
			    var unitName = unitsummarydata.name;
			    var salesMax = unitsummarydata.sales_max;
			    var upgradeEmployeeMax = unitsummarydata.upgrade_unit_type_employee_max;
			    var upgradeTimeFinish = unitsummarydata.upgrade_time_to_finish;
			    var employeeMax = unitsummarydata.employee_max;

                mainProcess(onHoliday,unitTypeProduceName,unitName,salesMax,upgradeEmployeeMax,upgradeTimeFinish,employeeMax);
			    //ToStorage('unit_sizes_array', unit_sizes_array);
		    },
            timeout: 5000,
		    ajaxError:
		        console.log('error')
		    });
	    }

        getDataFromApi();

        function mainProcess(onHoliday,unitTypeProduceName,unitName,salesMax,upgradeEmployeeMax,upgradeTimeFinish,employeeMax) {
            console.log('Подразделение в отпуске (f - нет, t - да)',onHoliday);
            let QuantityInputNormal = 1;
            console.log('QuantityInputNormal',QuantityInputNormal);
            if(type == 'educational' || type == 'repair' || type == 'medicine' || type == 'restaurant' || type == 'workshop' || type == 'mill'){
                if (type == 'educational') {
                    QuantityInputNormal = 480;
                }
                if (type == 'repair') {
                    QuantityInputNormal = 11250;
                }
                let unitNumberSpec = unitNumber + '_spec';
                let spec = localStorage.getItem(unitNumberSpec);

                if (spec == 'Диагностический центр') {
                    QuantityInputNormal = 4500;
                }
                if (spec == 'Косметологический центр') {
                    QuantityInputNormal = 4500;
                }
                if (spec == 'Стоматологическая клиника') {
                    QuantityInputNormal = 450;
                }
                if (spec == 'Центр иммунологии') {
                    QuantityInputNormal = 900;
                }
                if (spec == 'Центр народной медицины') {
                    QuantityInputNormal = 900;
                }
                if (spec == 'Кардиологическая клиника') {
                    QuantityInputNormal = 900;
                }
                if (spec == 'Блинная') {
                    QuantityInputNormal = 38000;
                }
                if (spec == 'Кафе-мороженое') {
                    QuantityInputNormal = 38000;
                }
                if (spec == 'Fish and chips') {
                    QuantityInputNormal = 38000;
                }
                if (spec == 'Кофейня') {
                    QuantityInputNormal = 38000;
                }
                if (spec == 'Пивной ресторан') {
                    QuantityInputNormal = 28500;
                }
                if (spec == 'Ресторан греческой кухни') {
                    QuantityInputNormal = 28500;
                }
                if (spec == 'Ресторан итальянской кухни') {
                    QuantityInputNormal = 28500;
                }
                if (spec == 'Сырный ресторан') {
                    QuantityInputNormal = 20000;
                }
                if (spec == 'Стейк ресторан') {
                    QuantityInputNormal = 23750;
                }
                if (spec == 'Рыбный ресторан') {
                    QuantityInputNormal = 14250;
                }
                if (type == 'restaurant') {
                    QuantityInputNormal = salesMax * 0.95;
                }
                if (type == 'medicine') {
                    QuantityInputNormal = salesMax * 0.9;
                }
				if (type == 'repair') {
                    QuantityInputNormal = salesMax * 0.225;
                }
				if (type == 'educational') {
                    QuantityInputNormal = salesMax * 0.64;
                }
                if (onHoliday == "t") QuantityInputNormal = 0;

				// $tbody таблица с загрузкой склада
				let $lbody = $("table.list:eq(0) > tbody:eq(0)");
				let $unit_load = $lbody.children("tr:eq(1)").children("td:eq(0)")[0].outerText;
				console.log($unit_load);
				let unit_load = parseInt($unit_load.replace(/\s+/g, ''),10);
				let unitVolumeK = 1;
				if (unit_load > 400) unitVolumeK = unit_load/100;
				console.log(unit_load,unitVolumeK);


				// $tbody таблица с поставщиками
                let $tbody = $("table.list:eq(1) > tbody:eq(0)");

                // срабатывает при загрузке страницы
                let subsValueSave = localStorage.getItem(unitNumber);
                if (subsValueSave === null) subsValueSave = 1;
                console.log(unitNumber);
                console.log('Коэффициент субсидии: ', subsValueSave);

                let quantityChanged = false;
                console.log('Необходимо изменить количество закупаемых товаров? ', quantityChanged);
                let group = -1, item = -1;
                let groupId = 0, itemId = 0, groupType = "";
                $tbody.children("tr").each(function() {
                    let $tr = $(this);
                    if ($tr.children("td").length === 1) {
                    } else if ($tr.children("td").length > 1) {
                        itemId++;
                        if ((group === -1 || group === groupId) && (item === -1 || item === itemId)) {
                            let $quantityTdInput = $tr.children("td:eq(3)");
                            let $temp2 = $tr.find("tr:contains('Количество')").text();
                            let QuantityInStock = parseInt($temp2.replace( /\D/g, ''));
                            console.log('Количество товара № ',itemId, ' на складе', QuantityInStock);
                            let $temp3 = $tr.find("tr:contains('Расх. на клиента')").text();
                            let ConsumptionPerCustomer = parseInt($temp3.replace( /\D/g, ''));
                            console.log('Расход товара № ',itemId, ' на одного посетителя', ConsumptionPerCustomer);
                            let $quantityInput = $quantityTdInput.children("input:eq(0)");
                            console.log('Сейчас установленная закупка товара № ', itemId, ' - ',$quantityInput.val());
                            let QuantityInputTemp = (QuantityInputNormal*subsValueSave*ConsumptionPerCustomer);
                            let $temp4 = $tr.find("tr:contains('Требуется')").text();
                            if (type == 'workshop' || type == 'mill') {
                                QuantityInputTemp = parseInt($temp4.replace( /\D/g, '')*QuantityInputNormal);
                            }
                            let QuantityInput = (QuantityInputTemp-((QuantityInStock-QuantityInputTemp)*0.05));
                            console.log('Предварительная расчетная закупка товара № ', itemId, ' - ', QuantityInput);
                            if (type == 'educational' || type == 'repair' || type == 'medicine' || type == 'restaurant') {
                                if (QuantityInStock > QuantityInput * 2) QuantityInput = QuantityInput/unitVolumeK;
                            }
							if ((QuantityInStock/QuantityInputTemp)>20) QuantityInput = 0;
                            //if (unitTypeProduceName == 'Бумага' || unitTypeProduceName == 'Кожаная обувь') QuantityInput = $quantityInput.val()-0;
                            if (unitTypeProduceName == 'Бумага') QuantityInput = $quantityInput.val()-0;
                            if (unitName == '00 Конкурс Олигархов' || unitName == '10 Пивоваренный завод № 200') QuantityInput = $quantityInput.val()-0;
							if (upgradeTimeFinish == 1) QuantityInput = QuantityInput * upgradeEmployeeMax / employeeMax;
                            QuantityInput = QuantityInput.toFixed(0);
                            console.log('Расчетная закупка товара № ', itemId, ' - ', QuantityInput);
                            if ((typeof $quantityInput.val() !== 'undefined') && ($quantityInput.val() !== QuantityInput)) {
                                quantityChanged = true;
                                console.log('Необходимо изменить количество закупаемых товаров? ', quantityChanged);
                                $quantityInput.val(QuantityInput);
                            }
                        }
                    }
                });
                if (quantityChanged == true) {
                    $("input[name='applyChanges']").click();
                };
            };
        };
    };

	let script = document.createElement("script");
	script.textContent = '(' + run.toString() + ')();';
	document.documentElement.appendChild(script);
})(window);
