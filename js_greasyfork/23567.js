// ==UserScript==
// @name           Virtonomica: калькулятор производства
// @namespace      virtonomica
// @version 	   0.03
// @description    Добавляет калькулятор производства в справочные данные игры и в юнит/производство. За основу был взят Открытый помощник для Виртономики (http://virtonomica.ru/olga/forum/forum_new/15/topic/122999/view).
// @include        http*://*virtonomic*.*/*/main/industry/unit_type/info/*
// @include        http*://*virtonomic*.*/*/main/unit/view/*/manufacture*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23567/Virtonomica%3A%20%D0%BA%D0%B0%D0%BB%D1%8C%D0%BA%D1%83%D0%BB%D1%8F%D1%82%D0%BE%D1%80%20%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/23567/Virtonomica%3A%20%D0%BA%D0%B0%D0%BB%D1%8C%D0%BA%D1%83%D0%BB%D1%8F%D1%82%D0%BE%D1%80%20%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0.meta.js
// ==/UserScript==


var calcFunc = function calcProd(editor, productID, productIdx, productionSpec, unitType, ing_id_array) {
    console.log('productionSpec = ' + productionSpec);
    editor.size = ( editor.value.length > 4 ) ? editor.value.length : 3;
    //console.log(editor.id + ' = ' + editor.value);
    setVal(productID+'_'+editor.id, editor.value)
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
    function calcByRecipe(recipe){
        var tech = $('#tech_prod_'+productIdx).val();
        if(tech == null || tech == '' || tech <= 0) return;
        var ingQual = [],
            ingPrice = [],
            ingBaseQty = [],
            ingTotalPrice = [],
            IngTotalCost = 0,
            prodbase_quan = [],
            resultQty     = [],
            Prod_Quantity = [];

        var eff = 1;
        for(var i = 0, len = recipe.rp.length; i < len; ++i){
            //количество товаров производимых 1 человеком
            prodbase_quan[i] = recipe.rp[i].pbq;
            console.log('prodbase_quan'+ i +' = ' + prodbase_quan[i]);
            //итоговое количество товара за единицу производства
            resultQty[i] = recipe.rp[i].rq;
            console.log('resultQty'+ i +' = ' + resultQty[i]);
        }

        recipe.ip.forEach(function(ingredient) {
            ingBaseQty.push(parseFloat(ingredient.q,10));
            console.log('ingBaseQty = ' + parseFloat(ingredient.q,10) );
        });
        var ingCnt = ingBaseQty.length;
        for(var ingIdx = 0; ingIdx < ingCnt; ++ingIdx){
            ingQual.push(parseFloat($('#quality_prod_'+productIdx+'_ing_'+ingIdx).val().replace(',', '.'),10) || 0);
            ingPrice.push(parseFloat($('#price_prod_'+productIdx+'_ing_'+ingIdx).val().replace(',', '.'),10) || 0);
        }

        var unit_quant	= parseFloat($('#unit_qty_prod_'+productIdx).val(),10) || 1;
        var work_quant	= parseFloat($('#worker_qty_prod_'+productIdx).val(),10) * unit_quant;
        var work_salary	= $('#worker_salary_prod_'+productIdx).val().replace(',', '.');
        //квалификация работников
        var PersonalQual = Math.pow(tech, 0.8) ;
        $('#worker_quality_prod_'+productIdx).text(PersonalQual.toFixed(2));

        //качество станков
        var EquipQuan = Math.pow(tech, 1.2) ;
        $('#equip_quality_prod_'+productIdx).text(EquipQuan.toFixed(2));

        var ingQuantity = [];
        var animalQuanPerWorker = recipe.epw;
        console.log('equipPerWorker = ' + animalQuanPerWorker);
        console.log('unitType = ' + unitType);

        //количество ингридиентов
        for (var ingIdx = 0; ingIdx < ingCnt; ingIdx++) {
            //ферма
            if ( unitType === 'farm' ) {
                ingQuantity[ingIdx] = ingBaseQty[ingIdx] * animalQuanPerWorker * work_quant;
            } else {
                ingQuantity[ingIdx] = ingBaseQty[ingIdx] / resultQty[0] * prodbase_quan[0] * work_quant * Math.pow(1.05, tech-1 ) * eff;
            }
            $('#qty_prod_'+productIdx+'_ing_'+ingIdx).text(commaSeparateNumber( Math.ceil( ingQuantity[ingIdx].toFixed(2)) ) + " ед.");
        };

        //цена ингридиентов
        for (var ingIdx = 0; ingIdx < ingCnt; ingIdx++) {
            if (ingPrice[ingIdx] > 0) {
                ingTotalPrice[ingIdx] = ingQuantity[ingIdx] * ingPrice[ingIdx];
            } else {
                ingTotalPrice[ingIdx] = 0;
            }
            $('#total_price_prod_'+productIdx+'_ing_'+ingIdx).text("$" + commaSeparateNumber(ingTotalPrice[ingIdx].toFixed(2)));
        };

        //общая цена ингридиентов
        for (var ingIdx = 0; ingIdx < ingCnt; ingIdx++) {
            IngTotalCost += ingTotalPrice[ingIdx];
        };
        //$("#IngTotalPrice", this).text("$" + commaSeparateNumber(IngTotalCost.toFixed(2)));

        //объем выпускаемой продукции
        for(var i = 0, len = recipe.rp.length; i < len; ++i){
            Prod_Quantity[i] = work_quant * prodbase_quan[i] * Math.pow(1.05, tech-1) *  eff;
            $('#qty_prod_'+productIdx+'_result_' + i).text( commaSeparateNumber( Math.round (Prod_Quantity[i]) ) + " ед." );
        }

        //итоговое качество ингридиентов
        var IngTotalQual = 0;
        var IngTotalQty = 0;
        for (var ingIdx = 0; ingIdx < ingCnt; ingIdx++) {
            IngTotalQual+= ingQual[ingIdx] * ingBaseQty[ingIdx];
            IngTotalQty += ingBaseQty[ingIdx];
        };
        IngTotalQual = IngTotalQual / IngTotalQty * eff;
        //ферма
        if ( unitType === 'farm' ) {
            var animal_Qual = parseFloat($('#animal_qual_prod_'+productIdx).val(),10) || 1;
            IngTotalQual = ( ingQual[0] * 0.3 + animal_Qual * 0.7 ) * eff;
        }

        //качество товара
        var ProdQual = Math.pow(IngTotalQual, 0.5) * Math.pow(tech, 0.65);
        var bonus = parseFloat($('#bonus_prod_'+productIdx+'_result').val().replace('%', ''),10) || 0;
        ProdQual = ProdQual * ( 1 + bonus / 100 );
      
        //ограничение качества (по технологии)
        if (ProdQual > Math.pow(tech, 1.3) ) {ProdQual = Math.pow(tech, 1.3)}
        if ( ProdQual < 1 ) { ProdQual = 1 }

        //бонус к качеству
        ProdQual = ProdQual * ( 1 + recipe.rp[0].qbp / 100 );
        $('#quality_prod_'+productIdx+'_result_0').text( ProdQual.toFixed(2) ) ;
        //если есть второй продукт производства
        for(var i = 1, len = recipe.rp.length; i < len; ++i){
            var ProdQual2 = Math.pow(IngTotalQual, 0.5) * Math.pow(tech, 0.65)  * ( 1 + recipe.rp[i].qbp / 100 );
        	ProdQual2 = ProdQual2 * ( 1 + bonus / 100 );
            if (ProdQual2 > Math.pow(tech, 1.3) ) {ProdQual2 = Math.pow(tech, 1.3)}
            if ( ProdQual2 < 1 ) { ProdQual2 = 1 }
            $('#quality_prod_'+productIdx+'_result_' + i).text( ProdQual2.toFixed(2) ) ;
        }

        //себестоимость
        var zp = work_salary * work_quant;
        var exps = IngTotalCost + zp + zp * 0.1 ;

		if (recipe.rp.length == 3) { 
			//Нефтеперегонка
			//Бензин Нормаль-80 - 35%
			$('#price_prod_'+productIdx+'_result_0').text( "$" + commaSeparateNumber((exps / Prod_Quantity[0] * 0.35 ).toFixed(2)) );
			//Дизельное топливо - 30%
			$('#price_prod_'+productIdx+'_result_1').text( "$" + commaSeparateNumber((exps / Prod_Quantity[1] * 0.30 ).toFixed(2)) );
			//Мазут             - 35%
			$('#price_prod_'+productIdx+'_result_2').text( "$" + commaSeparateNumber((exps / Prod_Quantity[2] * 0.35 ).toFixed(2)) );
		} else if (recipe.rp.length == 4) { 
			//Ректификация нефти
			//Бензин Нормаль-80 - 35%
			$('#price_prod_'+productIdx+'_result_0').text( "$" + commaSeparateNumber((exps / Prod_Quantity[0] * 0.35 ).toFixed(2)) );
			//Бензин Регуляр-92 - 32%
			$('#price_prod_'+productIdx+'_result_1').text( "$" + commaSeparateNumber((exps / Prod_Quantity[1] * 0.32 ).toFixed(2)) );
			//Дизельное топливо - 23%
			$('#price_prod_'+productIdx+'_result_2').text( "$" + commaSeparateNumber((exps / Prod_Quantity[2] * 0.23 ).toFixed(2)) );
			//Мазут             - 10%
			$('#price_prod_'+productIdx+'_result_3').text( "$" + commaSeparateNumber((exps / Prod_Quantity[3] * 0.10 ).toFixed(2)) );
		} else if (recipe.rp.length == 5) { 
			//Каталитический крекинг нефти
			//Бензин Нормаль-80 - 7%
			$('#price_prod_'+productIdx+'_result_0').text( "$" + commaSeparateNumber((exps / Prod_Quantity[0] * 0.07 ).toFixed(2)) );
			//Бензин Премиум-95 - 35%
			$('#price_prod_'+productIdx+'_result_1').text( "$" + commaSeparateNumber((exps / Prod_Quantity[1] * 0.35 ).toFixed(2)) );
			//Бензин Регуляр-92 - 51%
			$('#price_prod_'+productIdx+'_result_2').text( "$" + commaSeparateNumber((exps / Prod_Quantity[2] * 0.51 ).toFixed(2)) );
			//Дизельное топливо - 6%
			$('#price_prod_'+productIdx+'_result_3').text( "$" + commaSeparateNumber((exps / Prod_Quantity[3] * 0.06 ).toFixed(2)) );
			//Мазут             - 1%
			$('#price_prod_'+productIdx+'_result_4').text( "$" + commaSeparateNumber((exps / Prod_Quantity[4] * 0.01 ).toFixed(2)) );
		} else {
			for(var i = 0, len = recipe.rp.length; i < len; ++i){
				$('#price_prod_'+productIdx+'_result_' + i).text( "$" + commaSeparateNumber((exps / Prod_Quantity[i] / len ).toFixed(2)) );
			}
		}

        //прибыль
        var profit = -exps;
        for(var i = 0, len = recipe.rp.length; i < len; ++i){
            var sellPrice = parseFloat($('#sell_price_prod_'+productIdx+'_result_' + i).val(),10) || 0;
            profit +=  sellPrice * Prod_Quantity[i];
        }
        $('#profit_prod_'+productIdx).text( "$" + commaSeparateNumber(profit.toFixed(2)) );
    }
    var locale = getLocale();
    var realm = getRealm();
    var suffix = (locale === 'en') ? '_en' : '';
    var recipe_exist = 0;
	var svRecipeUrl = 'http://cobr123.github.io/industry/'+ realm +'/recipe_'+ productID + suffix +'.json';
    $.getJSON(svRecipeUrl, function (data) {
		console.log(svRecipeUrl);
        $.each(data, function (key, val) {
            if(recipe_exist === 0){
                if(productionSpec === val.s){
                    recipe_exist = 1;
                    calcByRecipe(val);
                } else if (ing_id_array != null && val.ip.length == ing_id_array.length) {
                    recipe_exist = 1;
                    $.each(val.ip, function (key2, val2) {
                        if(!$.inArray( val2.pi, ing_id_array )) {
                            recipe_exist = 0;
                        }
                    });
                    if (recipe_exist === 1) {
                        calcByRecipe(val);
                    }
                }
            }
        });
        if (recipe_exist === 0) {
            console.log('Не найден рецепт для специализации "'+productionSpec+'"');
        }
    })
        .fail(function() {
            console.log('Не найден рецепт для продукта с id "'+productID+'"');
        });
}

var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

    function getLocale() {
        return (document.location.hostname === 'virtonomica.ru') ? 'ru' : 'en';
    }
    function getRealm(){
        var svHref = window.location.href;
        var matches = svHref.match(/\/(\w+)\/main\//);
        return matches[1];
    }
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
    function getUnitType() {
        var img = '', imgSrc = '',
            url = window.location.pathname;
        if(url.indexOf('main/industry/unit_type') + 1) {
            img = $('#headerInfo > img').attr('src').replace('\/img\/unit_types\/', '');
            imgSrc = img.substr(0,img.length-4);
        } else {
            img = $('div#unitImage > img').attr('src').replace('\/img\/v2\/units\/', '');
            imgSrc = img.substr(0,img.length-6);
        }
        switch (imgSrc) {
            case 'apiary':
            case 'animalfarm':
                return 'farm';
                break;
            case 'tractor':
                return 'plant';
                break;
            default:
                return 'factory';
                break;
        };
    }
    function addCalcFormToUnitInfo() {
        //table[3]/tbody/tr[2]
        var productIdx = 0;
        $('table[class="grid"]:nth-child(4) > tbody > tr').each(function(){
            var row = $(this);
            var svHref = window.location.href;
            var productNameCell = $('td:nth-child(1) > b', row);
            if(productNameCell != null && productNameCell.text() != '') {
                var productionSpec = productNameCell.text();
                var unitType = getUnitType();
                var productID = getLast($('> td:nth-child(4) > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(1) > td > a:nth-child(1) > img', row).parent().attr('href'));
                var calcFuncCallStr = 'calcProd(this, '+productID+', '+productIdx+', \''+productionSpec+'\', \''+unitType+'\')';

                $('>td:nth-child(2) > a > img', row).each(function(){
                    var machineImg = $(this);
                    //http://virtonomica.ru/olga/main/industry/unit_type/info/422160
                    //http://virtonomica.ru/olga/main/globalreport/technology/422160/13/target_market_summary/03-05-2015/bid
                    var svDate = new Date().toISOString().slice(0, 10);
                    var svBidHref = svHref.replace('/industry/unit_type/info/','/globalreport/technology/') + '/2/target_market_summary/'+svDate+'/bid';
                    var defValTech = getVal(productID+'_tech_prod_'+productIdx) || 1;
                    var inputTech = '<br><a href="'+svBidHref+'" onclick="return doWindow(this, 1000, 700);">Техна</a> <input onKeyUp="'+calcFuncCallStr+'" type="text" size="3" id="tech_prod_'+productIdx+'" value="'+defValTech+'">';

                    var equipMarketLink = machineImg.parent().attr('href').replace('/product/info/','/globalreport/marketing/by_products/');
                    var equipMarketLinkOpt = ' href="'+equipMarketLink+'" onclick="return doWindow(this, 1000, 800);"';
                    var inputAnimalQual = '';
                    var labelEquipQual = '';
                    if (unitType === 'farm') {
                        var defValAnimalQual = getVal(productID+'_animal_qual_prod_'+productIdx) || 1;
                        inputAnimalQual = '<br><a'+equipMarketLinkOpt+'>Кач.</a> <input onKeyUp="'+calcFuncCallStr+'" type="text" size="3" id="animal_qual_prod_'+productIdx+'" value="'+defValAnimalQual+'">';
                    } else {
                        labelEquipQual = '<br><a'+equipMarketLinkOpt+'>Станки</a> <b id="equip_quality_prod_'+productIdx+'">0</b>';
                    }
                    machineImg.parent().after(inputTech + inputAnimalQual + labelEquipQual);
                });
                var ingIdx = 0;
                $('>td:nth-child(3) > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td', row).each(function(){
                    var qtyCell = $(this);
                    var minQuality = $('> div.resultmessageerror > nobr > b', qtyCell);
                    var minQualityStr = '';
                    if(minQuality.length > 0){
                        minQualityStr = '<font color="red">Мин. кач. <b>' + minQuality.text() + '</b></font><br>';
                    }

                    var labelTotalPrice = '<tr><td align="center" id="total_price_prod_'+productIdx+'_ing_'+ingIdx+'">0.00</td></tr>';
                    //http://virtonomica.ru/olga/main/product/info/422132
                    //http://virtonomica.ru/olga/main/globalreport/marketing/by_products/422714/
                    var tmp = qtyCell.parent().parent().children().first().children().first().children().first();
                    //console.log(tmp.attr('href'));
                    var productMarketLink = tmp.attr('href').replace('/product/info/','/globalreport/marketing/by_products/');
                    var productMarketLinkOpt = ' href="'+productMarketLink+'" onclick="return doWindow(this, 1000, 800);"';
                    //http://virtonomica.ru/olga/main/globalreport/product_history/1462
                    var productHistoryLink = tmp.attr('href').replace('/product/info/','/globalreport/product_history/');
                    var productHistoryLinkOpt = ' href="'+productHistoryLink+'" onclick="return doWindow(this, 1000, 800);"';

                    var defValQual = getVal(productID+'_quality_prod_'+productIdx+'_ing_'+ingIdx) || 1;
                    var inputQualityRow = '<tr><td align="left">'+ minQualityStr +'<a'+productHistoryLinkOpt+'>Кач.</a> <input onKeyUp="'+calcFuncCallStr+'" type="text" size="3" id="quality_prod_'+productIdx+'_ing_'+ingIdx+'" value="'+defValQual+'"></td></tr>';

                    var defValPrc = getVal(productID+'_price_prod_'+productIdx+'_ing_'+ingIdx) || 1;
                    var inputPriceRow = '<tr><td align="left"><a'+productMarketLinkOpt+'>Цена</a><input onKeyUp="'+calcFuncCallStr+'" type="text" size="3" id="price_prod_'+productIdx+'_ing_'+ingIdx+'" value="'+defValPrc+'"></td></tr>';
                    qtyCell.attr('id','qty_prod_'+productIdx+'_ing_'+ingIdx);
                    qtyCell.parent().after(labelTotalPrice + inputQualityRow + inputPriceRow);
                    ++ingIdx;
                });
                var resultIdx = 0;
                var resultQtyCell = null;
                $('>td:nth-child(4) > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td', row).each(function(){
                    resultQtyCell = $(this);
                    var tmp = resultQtyCell.parent().parent().children().first().children().first().children().first();
                    //console.log(tmp.attr('href'));
                    var productMarketLink = tmp.attr('href').replace('/product/info/','/globalreport/marketing/by_products/');
                    var productMarketLinkOpt = ' href="'+productMarketLink+'" onclick="return doWindow(this, 1000, 800);"';
                    //http://virtonomica.ru/olga/main/globalreport/product_history/1462
                    var productHistoryLink = tmp.attr('href').replace('/product/info/','/globalreport/product_history/');
                    var productHistoryLinkOpt = ' href="'+productHistoryLink+'" onclick="return doWindow(this, 1000, 800);"';
                    //var productBaseQty = clearQtyNumber(resultQtyCell.text());
                    //console.log(productBaseQty);
                    var resultQualityRow = '<tr><td align="left"><a'+productHistoryLinkOpt+'>Кач.:</a> <b id="quality_prod_'+productIdx+'_result_'+resultIdx+'">1</b></td></tr>';
                    var resultPriceRow = '<tr><td align="left">C/c: <b id="price_prod_'+productIdx+'_result_'+resultIdx+'">0</b></td></tr>';
                    //var resultQtyRow = '<tr><td align="left">Кол-во: <b id="qty_prod_'+productIdx+'_result_'+resultIdx+'">0</b></td></tr>';
                    //
                    var defValSellPrc = getVal(productID+'_sell_price_prod_'+productIdx+'_result_'+resultIdx) || 0;
                    var resultSellPriceRow = '<tr><td align="left"><a'+productMarketLinkOpt+'>Цена</a> <input onKeyUp="'+calcFuncCallStr+'" type="text" size="4" id="sell_price_prod_'+productIdx+'_result_'+resultIdx+'" value="'+defValSellPrc+'"></td></tr>';
                    //alert(resultQtyRow);
                    resultQtyCell.attr('id','qty_prod_'+productIdx+'_result_'+resultIdx);
                    resultQtyCell.parent().after(resultQualityRow + /*resultQtyRow +*/ resultPriceRow + resultSellPriceRow);
                    ++resultIdx;
                });
                var defBonus = getVal(productID+'_bonus_prod_'+productIdx+'_result') || 0;
                var inputBonus = '<tr><td align="left" colspan="'+resultIdx+'">Бонус к качеству <input onKeyUp="'+calcFuncCallStr+'" type="text" size="3" id="bonus_prod_'+productIdx+'_result" value="'+defBonus+'"></td></tr>';
              
                var resultProfitRow = '<tr><td align="left" colspan="'+resultIdx+'">Прибыль: <b id="profit_prod_'+productIdx+'">0</b></td></tr>';
                resultQtyCell.parent().parent().parent().parent().parent().after(inputBonus).after(resultProfitRow);

                var defValUnitQty = getVal(productID+'_unit_qty_prod_'+productIdx) || 1;
                var inputUnitQty = '<br>Кол-во юнитов <input onKeyUp="'+calcFuncCallStr+'" type="text" size="3" id="unit_qty_prod_'+productIdx+'" value="'+defValUnitQty+'">';

                var defValWorkerQty = getVal(productID+'_worker_qty_prod_'+productIdx) || 50;
                var inputWorkerQty = '<br>Кол-во рабочих <input onKeyUp="'+calcFuncCallStr+'" type="text" size="3" id="worker_qty_prod_'+productIdx+'" value="'+defValWorkerQty+'">';

                var defValWorkerSal = getVal(productID+'_worker_salary_prod_'+productIdx) || 300;
                var inputWorkerSalary = '<br>Зп. <input onKeyUp="'+calcFuncCallStr+'" type="text" size="3" id="worker_salary_prod_'+productIdx+'" value="'+defValWorkerSal+'">';

                var workerQuality = '<br>Квалификация <b id="worker_quality_prod_'+productIdx+'">0</b>';
                var inputIngQty = '<input type="hidden" value="'+ingIdx+'" id="ing_qty_prod_'+productIdx+'">';
                var inputResultQty = '<input type="hidden" value="'+resultIdx+'" id="result_qty_prod_'+productIdx+'">';
                var resultQualBonus = $('>td:nth-child(5)', row).text().replace(/[\s+\-%]+/g,'') || 0;
                //console.log(resultQualBonus);
                productNameCell.after(inputUnitQty + inputWorkerQty + inputWorkerSalary + workerQuality + inputIngQty + inputResultQty);
                $('input#worker_qty_prod_'+productIdx).keyup();

                ++productIdx;
            }
        });
    }
  
  var sagMaterialImg = null;
  function loadProductImgs(callback) {
    var realm = getRealm();
    var locale = getLocale();
    var suffix = (locale === 'en') ? '_en' : '';
    var svUrl = 'http://cobr123.github.io/industry/'+ realm +'/materials'+ suffix +'.json';
    $.getJSON(svUrl, function (data) {
      sagMaterialImg = [];
      $.each(data, function (key, val) {
        sagMaterialImg[val.i] = val.s;
      });
      if(typeof(callback) === 'function') callback();
    });
    return false;
  }
  var productIdx = 0;
  function addFormByRecipe(productID, productLink, opRecipe) {
    var calc_table_content = '';
    var calc_table_row = '';
    var productionSpec = opRecipe.s;
    var unitType = getUnitType();
    var calcFuncCallStr = 'calcProd(this, '+productID+', '+productIdx+', \''+productionSpec+'\', \''+unitType+'\', '+ '[]'+')';

    var defValUnitQty = getVal(productID+'_unit_qty_prod_'+productIdx) || 1;
    var inputUnitQty = '<br>Кол-во юнитов <input onKeyUp="'+calcFuncCallStr+'" type="text" size="3" id="unit_qty_prod_'+productIdx+'" value="'+defValUnitQty+'">';

    var defValWorkerQty = getVal(productID+'_worker_qty_prod_'+productIdx) || 50;
    var inputWorkerQty = '<br>Кол-во рабочих <input onKeyUp="'+calcFuncCallStr+'" type="text" size="3" id="worker_qty_prod_'+productIdx+'" value="'+defValWorkerQty+'">';

    var defValWorkerSal = getVal(productID+'_worker_salary_prod_'+productIdx) || 300;
    var inputWorkerSalary = '<br>Зп. <input onKeyUp="'+calcFuncCallStr+'" type="text" size="3" id="worker_salary_prod_'+productIdx+'" value="'+defValWorkerSal+'">';

    var workerQuality = '<br>Квалификация <b id="worker_quality_prod_'+productIdx+'">0</b>';

    var defValTech = getVal(productID+'_tech_prod_'+productIdx) || 1;
    var inputTech = '<br>Техна <input onKeyUp="'+calcFuncCallStr+'" type="text" size="3" id="tech_prod_'+productIdx+'" value="'+defValTech+'">';

    //http://virtonomica.ru/olga/main/globalreport/marketing/by_products/301320
    //http://virtonomica.ru/olga/main/product/info/301320
    var productInfoLink = productLink.attr('href').replace('/globalreport/marketing/by_products/','/product/info/');
    var labelEquipQual = '<br>Станки <b id="equip_quality_prod_'+productIdx+'">0</b>';
    calc_table_row += '<td><a target="blank" href="'+productInfoLink+'"><b>'+ productionSpec+'</b></a>' +inputUnitQty + inputWorkerQty + inputWorkerSalary + workerQuality+ '</td>';
    calc_table_row += '<td>'+ inputTech + labelEquipQual + '</td>';

    var ingIdx = 0;
    var ingCell = '';
    opRecipe.ip.forEach(function(ingredient) {
      var defValQual = getVal(productID+'_quality_prod_'+productIdx+'_ing_'+ingIdx) || 1;
      var inputQualityRow = '<tr><td align="left">Кач. <input onKeyUp="'+calcFuncCallStr+'" type="text" size="3" id="quality_prod_'+productIdx+'_ing_'+ingIdx+'" value="'+defValQual+'"></td></tr>';

      var defValPrc = getVal(productID+'_price_prod_'+productIdx+'_ing_'+ingIdx) || 1;
      var inputPriceRow = '<tr><td align="left">Цена <input onKeyUp="'+calcFuncCallStr+'" type="text" size="3" id="price_prod_'+productIdx+'_ing_'+ingIdx+'" value="'+defValPrc+'"></td></tr>';

      var imgSrc = sagMaterialImg[ingredient.pi].replace('/img/products/','/img/products/16/');
      var ingImg = '<tr><td align="center"><img src="'+ imgSrc +'" align="middle"></td></tr>'
      var labelTotalQty = '<tr><td align="center" id="qty_prod_'+productIdx+'_ing_'+ingIdx+'">0</td></tr>';
      var labelTotalPrice = '<tr><td align="center" id="total_price_prod_'+productIdx+'_ing_'+ingIdx+'">0.00</td></tr>';

      ingCell += '<td><table>' + ingImg + labelTotalQty + inputQualityRow + inputPriceRow + labelTotalPrice +'</table></td>';
      ++ingIdx;
    });
    calc_table_row += '<td><table><tr>'+ ingCell + '</tr></table></td>';
    var resultIdx = 0;
    var resultQtyCell = null;
    var resultCell = '';

    var resultQtyRow = '<tr><td align="left">Кол-во: <b id="qty_prod_'+productIdx+'_result_'+resultIdx+'">0</b></td></tr>';
    var resultQualityRow = '<tr><td align="left">Кач.: <b id="quality_prod_'+productIdx+'_result_'+resultIdx+'">1</b></td></tr>';
    var resultPriceRow = '<tr><td align="left">C/c: <b id="price_prod_'+productIdx+'_result_'+resultIdx+'">0</b></td></tr>';
    //
    var defValSellPrc = getVal(productID+'_sell_price_prod_'+productIdx+'_result_'+resultIdx) || 0;
    var resultSellPriceRow = '<tr><td align="left">Цена <input onKeyUp="'+calcFuncCallStr+'" type="text" size="4" id="sell_price_prod_'+productIdx+'_result_'+resultIdx+'" value="'+defValSellPrc+'"></td></tr>';

    resultCell = '<table>' + resultQtyRow + resultQualityRow + resultPriceRow + resultSellPriceRow +'</table>';
    ++resultIdx;

    var defBonus = getVal(productID+'_bonus_prod_'+productIdx+'_result') || 0;
    var inputBonus = '<br>Бонус к качеству <input onKeyUp="'+calcFuncCallStr+'" type="text" size="3" id="bonus_prod_'+productIdx+'_result" value="'+defBonus+'">';
    var resultProfitRow = '<br>Прибыль: <b id="profit_prod_'+productIdx+'">0</b>';
    //
    calc_table_row += '<td>'+ resultCell + resultProfitRow + inputBonus + '</td>';
    //
    var svRowClass = ((productIdx+1) % 2) ? 'class="even"' : 'class="odd"';
    calc_table_content += '<tr '+svRowClass+'>'+ calc_table_row + '</tr>';

    $('table#calc_panel > tbody > tr').last().after(calc_table_content);
    $('input[id=worker_qty_prod_'+ productIdx +']').keyup();
    ++productIdx;
  }
  
  function addCalcFormToOldUnitInfo() {
    //table[3]/tbody/tr[2]
    var productIdx = 0;
    var ing_id_array = [];
    $('form > table.list > tbody > tr > td:nth-child(2) > input[type="checkbox"]').each(function(){
      var matches = $(this).attr('name').match(/\[(\d+)\]$/);
      ing_id_array.push(matches[1]);
    });
    var locale = getLocale();
    var realm = getRealm();
    var suffix = (locale === 'en') ? '_en' : '';

    var calc_table = '<table width="100%" class="list" id="calc_panel"><tbody><tr><th>Специализация</th><th>Оборудование</th><th>Сырьё</th><th>Продукция</th></tr></tbody></table>';
    $('table.buttonset').after(calc_table);
    //
    $('table.grid > tbody > tr > td[title] > a:has(img)').each(function(){
      var productLink = $(this);
      var row = productLink.parent();
      var productNameCell = productLink;
      if(productNameCell != null && productNameCell.text() != '') {
        var productID = getLast(productLink.attr('href'));
        //
        var svRecipeUrl = 'http://cobr123.github.io/industry/'+ realm +'/recipe_'+ productID + suffix +'.json';
        $.getJSON(svRecipeUrl, function (data) {
          console.log(svRecipeUrl);
          $.each(data, function (key, val) {
            addFormByRecipe(productID, productLink, val);
          });
        })
          .fail(function() {
          console.log('Не найден рецепт для продукта с id "'+productID+'"');
        });
      }
    });
  }
  //если страница информации о заводе
  //http://virtonomica.ru/olga/main/industry/unit_type/info/423170
  if (/http:\/\/\w*virtonomic\w+.\w+\/\w+\/main\/industry\/unit_type\/info\/\d+/.test(window.location)) {
    addCalcFormToUnitInfo();
  }
  //если страница информации о производстве продукта и того что из него производят
  //http://virtonomica.ru/olga/main/product/info/423151
  if (/http:\/\/\w*virtonomic\w+.\w+\/\w+\/main\/product\/info\/\d+/.test(window.location)) {
  }
  //добавляем калькулятор на закладке "производство" в подразделении
  //http://virtonomica.ru/olga/main/unit/view/5452988/manufacture
  if (/http:\/\/\w*virtonomic\w+.\w+\/\w+\/main\/unit\/view\/\d+\/manufacture/.test(window.location)) {
    if($('table.list').length >= 2) {
      //старый интерфейс
      loadProductImgs(addCalcFormToOldUnitInfo);
    } else {
      //новый интерфейс
      //addCalcFormToNewUnitInfo();
    }
  }
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = calcFunc.toString() + '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}