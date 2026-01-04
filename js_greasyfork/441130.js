// ==UserScript==
// @name           Bizmania товары в рознице
// @namespace      bizmania
// @description  считаем разные цифры в розничном магазине
// @version       2.5
// @include       https://bizmania.ru/units/shop/?id=*&tab=goods
// @include       https://bizmania.ru/units/shop?id=*&tab=goods
// @include       https://bizmania.ru/units/shop?id=*&tab=supply
// @include       https://bizmania.ru/units/shop/?id=*&tab=supply
// @include       https://bizmania.ru/units/factory/?id=*&tab=supply
// @include       https://bizmania.ru/units/factory?id=*&tab=supply
// @include       https://bizmania.ru/forum/shop/?id=*&tab=goods
// @include       https://bizmania.ru/forum/shop?id=*&tab=goods
// @include       https://bizmania.ru/forum/shop/?id=*&tab=supply
// @include       https://bizmania.ru/forum/shop?id=*&tab=supply
// @include       https://bizmania.ru/forum/factory/?id=*&tab=supply
// @include       https://bizmania.ru/forum/factory?id=*&tab=supply
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441130/Bizmania%20%D1%82%D0%BE%D0%B2%D0%B0%D1%80%D1%8B%20%D0%B2%20%D1%80%D0%BE%D0%B7%D0%BD%D0%B8%D1%86%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/441130/Bizmania%20%D1%82%D0%BE%D0%B2%D0%B0%D1%80%D1%8B%20%D0%B2%20%D1%80%D0%BE%D0%B7%D0%BD%D0%B8%D1%86%D0%B5.meta.js
// ==/UserScript==
var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

    function toNumber(spSum){
        return parseFloat(spSum.replace(' ','').replace(/\s+/g,''),10);
    }
    //Розничный магазин, вкладка товары
    function shopGoods() {
        var incProduct = 0;
        var amount = 0;

        //Массив со всеми закупками на пересчет +20% с учетом запасов
        var arrAllPer20 = [];
        //Закупки на пересчет +20%
        var arrAllDayPer20 = [];
        $('table#goods > tbody > tr:has(td)').each(function() {
            var row = $(this);
            if($('> td', row).length >= 7) {
                //На складе
                var stockPatch = '> td:nth-child(6)';
                var stockVal = $(stockPatch, row);
                var stockText = toNumber($(stockPatch, row).text());
                //Кач на складе
                var kachPatch = '> td:nth-child(7)';
                var kachVal = $(kachPatch, row);
                var kachText = toNumber($(kachPatch, row).text());
                //Кач на в городе
                var kachPatchCity = '> td:nth-child(11)';
                var kachTextCity = toNumber($(kachPatchCity, row).text());
                //Продажи за 7 дней
                var sellPatch = '> td:nth-child(13)';
                var sellVal = $(sellPatch, row);
                var sellText = toNumber($(sellPatch, row).text());
                //Цена
                var pricePatch = '> td:nth-child(8)';
                var priceText = toNumber($(pricePatch, row).text());

                var sellDay = Math.round(sellText / 7) - stockText;
                if (sellDay < 0) {
                    sellDay = 0;
                }

                var sellDay20percent = Math.round(sellText / 7 * 1.2) - stockText;
                if (sellDay20percent < 0) {
                    sellDay20percent = 0;
                }
                var sellStock7 = sellText-stockText;
                if (sellStock7 < 0) {
                    sellStock7 = 0;
                }

                //stockVal.append( " <br><b>("+Math.round(sellText / 7) + ")</b>");
                sellVal.append( " - <a href=\"javascript:sliderSetValue('purchaseQuantity[" + incProduct + "]',"+ sellStock7 + ".0);showSubmit()\" title=\"Закупка на 7 дней с учетом запасов\">" + sellStock7 + "</a>");
                stockVal.append( "<br><a href=\"javascript:sliderSetValue('purchaseQuantity[" + incProduct + "]',"+ Math.round(sellText / 7) + ".0);showSubmit()\" title=\"Закупка на пересчет\">" + Math.round(sellText / 7) + "</a>");
                stockVal.append( " - <a href=\"javascript:sliderSetValue('purchaseQuantity[" + incProduct + "]',"+ sellDay + ".0);showSubmit()\" title=\"Закупка на пересчет с учетом запасов\">" + sellDay + "</a>");
                stockVal.append( " - <a href=\"javascript:sliderSetValue('purchaseQuantity[" + incProduct + "]',"+ sellDay20percent + ".0);showSubmit()\" title=\"Закупка на пересчет +20% с учетом запасов\">" + sellDay20percent + "</a>");

                arrAllPer20.push(sellDay20percent);
                arrAllDayPer20.push(Math.round(sellText / 7));
                //Если кач в магазине меньше чем кач в городе
                if (kachText < kachTextCity){
                    kachVal.attr('style', 'background-color:Yellow');
                }
                //Если не хватает на продажу 2 дней
                if (stockText < sellText / 7 * 2){
                    stockVal.attr('style', 'background-color:Yellow');
                }
                //Если не хватает на продажу дня
                if (stockText < sellText / 7){
                    stockVal.attr('style', 'background-color:#ff6161');
                }

                //amount = amount + Math.round(sellText / 7) * priceText;
                incProduct++;

            }
        });

        /*
            //На складе
            var amountDayPatch = 'table.datatable > tfoot > tr.tbltotal > td:nth-child(7)';
              var row = $(this);
            var amountDayVal = $(amountDayPatch, row);
            amountDayVal.append( "<b>("+Math.round(amountDayVal) + ")</b>");

*/


        /*
        var table = document.getElementsByClassName('datatable');
        var tableTrHead = document.getElementsByClassName('tblhr');

        console.log(111);
        console.log(tableTrHead);
        //var add = table[0].insertRow(-1);
        //add.insertCell(0);
        //var addTr = document.createElement("tr");
        var addTd = document.createElement("td");
        addTd.innerHTML="12345";
        addTd.setAttribute('id','');
        addTd.setAttribute('height','');
        addTd.setAttribute('class','tblh');
        addTd.setAttribute('rowspan','1');
        addTd.setAttribute('colspan','1');

        //addTr.appendChild(addTd);
        //table[0].appendChild(addTr);
        tableTrHead[1].appendChild(addTd);
        */


        //var container = $('table.datatable > thead > tr:nth-child(1) > td:nth-child(8)');
        var container = $('table.datatable > tfoot > tr > td:nth-child(8)');

        var input_0 = $('<button onclick="return false">Все 0</button>').click(function() {
            let i = 0;
            while (i < incProduct) {
                console.log( i );
                var zzz = document.getElementsByName('purchaseQuantity[' + i + ']');
                zzz[0].value = 0;
                var buttonSaveVisible = document.getElementById("submit");
                buttonSaveVisible.style.display = "block";
                i++;
            }
        });
        var input_1 = $('<button onclick="return false">Все 1</button>').click(function() {
            let i = 0;
            while (i < incProduct) {
                console.log( i );
                var zzz = document.getElementsByName('purchaseQuantity[' + i + ']');
                zzz[0].value = 1;
                var buttonSaveVisible = document.getElementById("submit");
                buttonSaveVisible.style.display = "block";
                i++;
            }
        });

        var input_arrAllPer20 = $('<button onclick="return false">День+20%-скл</button>').click(function() {
            let i = 0;
            while (i < incProduct) {
                console.log( i );
                var zzz = document.getElementsByName('purchaseQuantity[' + i + ']');
                zzz[0].value = arrAllPer20[i];
                var buttonSaveVisible = document.getElementById("submit");
                buttonSaveVisible.style.display = "block";
                i++;
            }
        });
        var input_arrAllDayPer20 = $('<button onclick="return false">День+20%</button>').click(function() {
            let i = 0;
            while (i < incProduct) {
                console.log( i );
                var zzz = document.getElementsByName('purchaseQuantity[' + i + ']');
                zzz[0].value = arrAllDayPer20[i];
                var buttonSaveVisible = document.getElementById("submit");
                buttonSaveVisible.style.display = "block";
                i++;
            }
        });
        //container.append( $('<td>').append(input_0).append(input_1).append('</td>'));

        container.append( $(input_0));
        container.append( $(input_1));
        container.append( $(input_arrAllPer20));
        container.append( $(input_arrAllDayPer20));

    };
    //END-------------


    //Розничный магазин, вкладка снабжение
    function shopSuply() {
        $('table#goods > tbody > tr:has(td)').each(function() {
            var row = $(this);
            if($('> td', row).length >= 7) {
                //На складе поставщика
                var stockVendorPatch = '> td:nth-child(6)';
                var stockVendorVal = $(stockVendorPatch, row);
                var stockVendorText = toNumber($(stockVendorPatch, row).text());
                //Сколько на складе
                //var stockPatch = '> td:nth-child(9)';
                //var stockVal = $(stockPatch, row);
                //var stockText = toNumber($(stockPatch, row).text());
                //Продажи за 7 дней
                var sellPatch = '> td:nth-child(12)';
                var sellVal = $(sellPatch, row);
                var sellText = toNumber($(sellPatch, row).text());
                //Цена
                //var pricePatch = '> td:nth-child(7)';
                //var priceText = toNumber($(pricePatch, row).text());

                //Если спрос за 7 дней меньше чем кол-во на складе поставщика, подсвечиваем красным
                if (stockVendorText < sellText){
                    stockVendorVal.attr('style', 'background-color:#ff6161');
                }
            }
        });

    };


     function factorySuply() {
        var incProduct = 0;

         $('table#supplytbl > tbody > tr:has(td)').each(function() {
            var row = $(this);
            if($('> td', row).length >= 7) {
                //На складе поставщика
                var stockRequiredVendorPatch = '> td:nth-child(6)';
                var stockRequiredVendorVal = $(stockRequiredVendorPatch, row);
                var stockRequiredVendorText = toNumber($(stockRequiredVendorPatch, row).text());

                var stockVendorPatch = '> td:nth-child(5)';
                var stockVendorVal = $(stockVendorPatch, row);
                var stockVendorText = toNumber($(stockVendorPatch, row).text());
                if (isNaN(stockVendorText)) {
                    return;
                }

                var requiredDay = Math.round(stockVendorText / 7);
                if (requiredDay < 0) {
                    requiredDay = 0;
                }
                if (stockRequiredVendorText < requiredDay * 2){
                    stockRequiredVendorVal.attr('style', 'background-color:Yellow');
                }

                if (stockRequiredVendorText < requiredDay){
                    stockRequiredVendorVal.attr('style', 'background-color:#ff6161');
                }

                stockVendorVal.append( " - <a href=\"javascript:sliderSetValue('purchase[" + incProduct + "]',"+ stockVendorText + ".0);showSubmit()\" title=\"Закупка на неделю\">Закупка</a>");
                stockRequiredVendorVal.append( " - <a href=\"javascript:sliderSetValue('purchase[" + incProduct + "]',"+ requiredDay + ".0);showSubmit()\" title=\"Закупка на 1 день\">" + requiredDay + "</a>");
                incProduct++;

            }
        });


     };


    if (/\w*bizmania.ru\/units\/shop\/{0,}\?id=\w*\&tab=goods/.test(window.location)
       ) {
        shopGoods();
    } else if (/\w*bizmania.ru\/units\/shop\/{0,}\?id=\w*\&tab=supply/.test(window.location)
              ) {
        shopSuply();
    } else if (/\w*bizmania.ru\/units\/factory\/{0,}\?id=\w*\&tab=supply/.test(window.location)
               ) {
        factorySuply();
    }


    //Для тестовой версии
    if (/\w*bizmania.ru\/forum\/shop\/{0,}\?id=\w*\&tab=goods/.test(window.location)
       ) {
        shopGoods();
    } else if (/\w*bizmania.ru\/forum\/shop\/{0,}\?id=\w*\&tab=supply/.test(window.location)
              ) {
        shopSuply();
            } else if (/\w*bizmania.ru\/forum\/factory\/{0,}\?id=\w*\&tab=supply/.test(window.location)
              ) {
        factorySuply();
    }

    //} else if (/\w*bizmania.ru\/units\/warehouse\/\?id=\w*\&tab=supply/.test(window.location)склад снабжение


}

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);