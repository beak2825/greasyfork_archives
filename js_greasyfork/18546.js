// ==UserScript==
// @name           Virtonomica: калькулятор сферы услуг
// @namespace      virtonomica
// @version 	   1.7
// @description    Добавляет калькулятор сферы услуг в справочные данные игры.
// @include        http*://*virtonomic*.*/*/main/industry/unit_type/info/*
// @include        http*://*virtonomic*.*/*/main/product/info/*
// @downloadURL https://update.greasyfork.org/scripts/18546/Virtonomica%3A%20%D0%BA%D0%B0%D0%BB%D1%8C%D0%BA%D1%83%D0%BB%D1%8F%D1%82%D0%BE%D1%80%20%D1%81%D1%84%D0%B5%D1%80%D1%8B%20%D1%83%D1%81%D0%BB%D1%83%D0%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/18546/Virtonomica%3A%20%D0%BA%D0%B0%D0%BB%D1%8C%D0%BA%D1%83%D0%BB%D1%8F%D1%82%D0%BE%D1%80%20%D1%81%D1%84%D0%B5%D1%80%D1%8B%20%D1%83%D1%81%D0%BB%D1%83%D0%B3.meta.js
// ==/UserScript==

var calcFunc = function calcService(editor, unitTypeID, productIdx, productionSpec) {
	//console.log('productionSpec = ' + productionSpec);
	editor.size = ( editor.value.length > 4 ) ? editor.value.length : 3;
	//console.log(editor.id + ' = ' + editor.value);
	setVal(unitTypeID+'_'+editor.id, editor.value)
	//резделитель разрядов
	function commaSeparateNumber(val){
		while (/(\d+)(\d{3})/.test(val.toString())){
			val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		}
		return val;
	}
	function setVal(spName, pValue){
		window.localStorage.setItem(spName, JSON.stringify(pValue));
	}
	function getLocale() {
		return (document.location.hostname === 'virtonomica.ru') ? 'ru' : 'en';
	}
	function getRealm(){
		var svHref = window.location.href;
        var matches = svHref.match(/\/(\w+)\/main\//);
		return matches[1];
	}	
	function calcBySpec(spec){
		var rawMaterialQty = [];
		var rawMaterialPrice = [];
		var eff = 1;
		
		spec.rm.forEach(function(rawMaterial) {
			rawMaterialQty.push(rawMaterial.q || 0);
			//console.log('rawMaterial.qty = ' + parseFloat(rawMaterial.q,10) );
		});
		var ingCnt = rawMaterialQty.length;
		for(var ingIdx = 0; ingIdx < ingCnt; ++ingIdx){
			rawMaterialPrice.push(parseFloat($('#price_prod_'+productIdx+'_ing_'+ingIdx).val().replace(',', '.'),10) || 0);
		}
		var unit_quant	= parseFloat($('#unit_qty_prod_'+productIdx).val(),10) || 1;

		//количество ингридиентов
		var ingQuantity = [];
		var visitorQuantity = parseFloat($('#visitor_qty_prod_'+productIdx).val(),10) || 0;
		for (var ingIdx = 0; ingIdx < ingCnt; ingIdx++) {
			ingQuantity[ingIdx] = rawMaterialQty[ingIdx] * eff * visitorQuantity;
			$('#qty_prod_'+productIdx+'_ing_'+ingIdx).text(commaSeparateNumber( Math.ceil( ingQuantity[ingIdx].toFixed(2)) ) + " ед.");
		};

		//цена ингридиентов
		var ingTotalPrice = [];
		for (var ingIdx = 0; ingIdx < ingCnt; ingIdx++) {
			if (rawMaterialPrice[ingIdx] > 0) {
				ingTotalPrice[ingIdx] = ingQuantity[ingIdx] * rawMaterialPrice[ingIdx];
			} else {
				ingTotalPrice[ingIdx] = 0;
			}
			$('#total_price_prod_'+productIdx+'_ing_'+ingIdx).text("$" + commaSeparateNumber(ingTotalPrice[ingIdx].toFixed(2)));
		};

		//общая цена ингридиентов
		var IngTotalCost = 0;
		//console.log('visitorQuantityy = ' + visitorQuantity );
		for (var ingIdx = 0; ingIdx < ingCnt; ingIdx++) {
			IngTotalCost += ingTotalPrice[ingIdx];
		};

		//себестоимость
		var work_quant	= parseFloat($('#worker_qty_prod_'+productIdx).val(),10) * unit_quant;
		var work_salary	= $('#worker_salary_prod_'+productIdx).val().replace(',', '.');
		var zp = work_salary * work_quant;
		var exps = IngTotalCost + zp + zp * 0.1 ;
		console.log('IngTotalCost = ' + IngTotalCost );
		console.log('exps = ' + exps );
		$('#price_prod_'+productIdx).text( "$" + commaSeparateNumber((exps / visitorQuantity).toFixed(2)) );
		
		//прибыль
		var sellPrice = parseFloat($('#sell_price_prod_'+productIdx).val(),10) || 0;
		var profit = ( sellPrice * visitorQuantity ) - exps;
		console.log('( sellPrice * visitorQuantity ) = ' + ( sellPrice * visitorQuantity ) );
		$('#profit_prod_'+productIdx).text( "$" + commaSeparateNumber(profit.toFixed(2)) );
	}
	var locale = getLocale();
	var realm = getRealm();
	var suffix = (locale === 'en') ? '_en' : '';
	var spec_exist = 0;
	$.getJSON('https://cobr123.github.io/by_service/'+ realm +'/service_unit_types' + suffix +'.json', function (data) {
		$.each(data, function (key, val) {
			if(unitTypeID == val.i){
			    //console.log('Тип предприятия с id "'+unitTypeID+'" найден');
				val.s.forEach(function(spec) {
					if(productionSpec === spec.c){
						spec_exist = 1;
						calcBySpec(spec);
					}
				});
			}
		});
		if (spec_exist === 0) {
			console.log('Не найден рецепт для специализации "'+productionSpec+'" для типа предприятия с id "'+unitTypeID+'"');
		}
	});
}

var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

	function getVal(spName){
		return JSON.parse(window.localStorage.getItem(spName));
	}
	function setVal(spName, pValue){
		window.localStorage.setItem(spName, JSON.stringify(pValue));
	}
    function trim(str) {
        return str.replace(/^\s+|\s+$/g,'');
    }
    function clearBaseQtyNumber(str) {
        var str = trim(str.replace('ед.',''));
        var matches = str.match(/(\d+)\/?(\d+)?/);
		var qty = matches[1] / (matches[2]||1);
		return qty;
    }
	function getLast(str){
		var matches = str.match(/\/(\d+)$/);
		return matches[1];
	}
	function getUnitType(imgSrc) {
		 return 'services';
	}
	function addCalcFormToUnitInfo() {
		//#mainContent > table:nth-child(4) > tbody > tr:nth-child(2) > td:nth-child(1) > b
		var productIdx = 0;
		var svHref = window.location.href;
		var unitTypeID = getLast(svHref);
		$('table[class="grid"]:nth-child(4) > tbody > tr:has(td)').first().prev().append('<th>Профит</th>')
		$('table[class="grid"]:nth-child(4) > tbody > tr:has(td)').each(function(){
			var row = $(this);
			var productNameCell = $('td:nth-child(1) > b', row);
			if(productNameCell != null && productNameCell.text() != '') {
				var productionSpec = productNameCell.text();
				var calcFuncCallStr = 'calcService(this, '+unitTypeID+', '+productIdx+', \''+productionSpec+'\')';
				
				$('>td:nth-child(2) > a > img', row).each(function(){
					var machineImg = $(this);
					//https://virtonomica.ru/olga/main/industry/unit_type/info/422160
					var equipMarketLink = machineImg.parent().attr('href').replace('/product/info/','/globalreport/marketing/by_products/');
					var equipMarketLinkOpt = ' href="'+equipMarketLink+'" onclick="return doWindow(this, 1000, 800);"';
					var labelEquipQual = '<br><a'+equipMarketLinkOpt+'>Оборудование на складе</a>';
					machineImg.parent().after(labelEquipQual);
				});
				var ingIdx = 0;
				$('>td:nth-child(3) > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > a > img', row).each(function(){
					var img = $(this);
					var qtyCell = img.parent().parent();
					var labelTotalPrice = '<tr><td align="center" id="total_price_prod_'+productIdx+'_ing_'+ingIdx+'">0.00</td></tr>';
					//https://virtonomica.ru/olga/main/product/info/422132
					//https://virtonomica.ru/olga/main/globalreport/marketing/by_products/422714/
					var productMarketLink = img.parent().attr('href').replace('/product/info/','/globalreport/marketing/by_products/');
					var productMarketLinkOpt = ' href="'+productMarketLink+'" onclick="return doWindow(this, 1000, 800);"';
					
					var defValPrc = getVal(unitTypeID+'_price_prod_'+productIdx+'_ing_'+ingIdx) || 1;
					var inputPriceRow = '<tr><td align="left"><a'+productMarketLinkOpt+'>Цена</a><input onKeyUp="'+calcFuncCallStr+'" type="text" size="3" id="price_prod_'+productIdx+'_ing_'+ingIdx+'" value="'+defValPrc+'"></td></tr>';
					$('>td', qtyCell.parent().next()).attr('id','qty_prod_'+productIdx+'_ing_'+ingIdx);
					qtyCell.parent().next().after(inputPriceRow + labelTotalPrice);
					++ingIdx;
				});
				var resultCostRow = '<br>Себестоимость: <b id="price_prod_'+productIdx+'">0</b>';
				var resultProfitRow = '<br>Прибыль: <b id="profit_prod_'+productIdx+'">0</b>';
				
				var defValUnitQty = getVal(unitTypeID+'_unit_qty_prod_'+productIdx) || 1;
				var inputUnitQty = '<br>Кол-во юнитов <input onKeyUp="'+calcFuncCallStr+'" type="text" size="3" id="unit_qty_prod_'+productIdx+'" value="'+defValUnitQty+'">';
				
				var defValVisitorQty = getVal(unitTypeID+'_visitor_qty_prod_'+productIdx) || 2500;
				var inputVisitorQty = '<br>Кол-во посетителей <input onKeyUp="'+calcFuncCallStr+'" type="text" size="3" id="visitor_qty_prod_'+productIdx+'" value="'+defValVisitorQty+'">';
				
				var defValWorkerQty = getVal(unitTypeID+'_worker_qty_prod_'+productIdx) || 50;
				var inputWorkerQty = '<br>Кол-во рабочих <input onKeyUp="'+calcFuncCallStr+'" type="text" size="3" id="worker_qty_prod_'+productIdx+'" value="'+defValWorkerQty+'">';
				
				var defValWorkerSal = getVal(unitTypeID+'_worker_salary_prod_'+productIdx) || 300;
				var inputWorkerSalary = '<br>Зп. <input onKeyUp="'+calcFuncCallStr+'" type="text" size="3" id="worker_salary_prod_'+productIdx+'" value="'+defValWorkerSal+'">';
				
				var defValPrice = getVal(unitTypeID+'_sell_price_prod_'+productIdx) || 10000;
				var inputPrice = '<br>Цена <input onKeyUp="'+calcFuncCallStr+'" type="text" size="3" id="sell_price_prod_'+productIdx+'" value="'+defValPrice+'">';
				productNameCell.after(inputUnitQty + inputVisitorQty + inputWorkerQty + inputWorkerSalary);
				row.append('<td>'+ inputPrice + resultCostRow + resultProfitRow +'</td>');
				$('input#worker_qty_prod_'+productIdx).keyup();
				
				++productIdx;
			}
		});
	}
	//если страница информации о сфере услуг
	//https://virtonomica.ru/olga/main/industry/unit_type/info/423170
    if (/\w*virtonomic\w+.\w+\/\w+\/main\/industry\/unit_type\/info\/\d+/.test(window.location)) {
		if($('table.grid > tbody > tr[class]:first > td').length === 3) {
			addCalcFormToUnitInfo();	
		}
	}
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = calcFunc.toString() + '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}