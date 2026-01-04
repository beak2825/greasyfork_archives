// ==UserScript==
// @name           Счет товаров - 2
// @namespace      bizmania
// @description  считаем разные цифры в розничном магазине
// @version       1.4.4.2
// @match 	  https://bizmania.ru/units/shop/?id=*
// @match 	  https://bizmania.ru/units/shop/?id=*&tab=shop
// @match       https://bizmania.ru/user/messages/contacts/
// @match       https://bizmania.ru/units/shop/?id=*&tab=goods
// @match       https://bizmania.ru/units/shop/?id=*&tab=goods&product=*
// @match       https://bizmania.ru/units/shop?id=*&tab=goods
// @match       https://bizmania.ru/units/shop?id=*&tab=supply
// @match       https://bizmania.ru/units/shop/?id=*&tab=supply
// @match       https://bizmania.ru/units/shop/?id=*&tab=divisions
// @match       https://bizmania.ru/units/shop/?id=*&tab=divisions&sort=*
// @match       https://bizmania.ru/units/shop/?p=*&section=accountlog&id=*&sort=&tab=reports
// @match       https://bizmania.ru/units/factory/?p=*&section=accountlog&id=*&sort=&tab=reports
// @match       https://bizmania.ru/units/factory/?id=*&tab=supply
// @match       https://bizmania.ru/units/factory?id=*&tab=supply
// @match 	  https://bizmania.ru/units/factory/?id=*&tab=sale
// @match       https://bizmania.ru/units/warehouse/?id=*&tab=goods
// @match		  https://bizmania.ru/units/catering/?id=*&tab=goods
// @match https://bizmania.ru/corporation/?id=*&tab=quests&sub=active&questTypeParam=*
// @match       https://bizmania.ru/forum/shop/?id=*&tab=goods
// @match       https://bizmania.ru/forum/shop?id=*&tab=goods
// @match       https://bizmania.ru/forum/shop/?id=*&tab=supply
// @match       https://bizmania.ru/forum/shop?id=*&tab=supply
// @match       https://bizmania.ru/forum/factory/?id=*&tab=supply
// @match       https://bizmania.ru/forum/factory?id=*&tab=supply
// @match       https://bizmania.ru/units/vendor/select/?id=*
// @match       https://bizmania.ru/units/vendor/select/?id=*&product=*¶
// @match https://bizmania.ru/units/vendor/select?id=*&replace=*&product=*¶
// @match https://bizmania.ru/units/vendor/select/?replace=*&id=*¶
// @match       https://bizmania.ru/city/?id=*&tab=retailmarket&sub=retail&retailgroup=*
// @match       https://bizmania.ru/city/?p=*&sub=retail&id=*&sort=&tab=retailmarket&retailgroup=*
// @match    https://bizmania.ru/units/produce/qualityhelp/?id=*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476392/%D0%A1%D1%87%D0%B5%D1%82%20%D1%82%D0%BE%D0%B2%D0%B0%D1%80%D0%BE%D0%B2%20-%202.user.js
// @updateURL https://update.greasyfork.org/scripts/476392/%D0%A1%D1%87%D0%B5%D1%82%20%D1%82%D0%BE%D0%B2%D0%B0%D1%80%D0%BE%D0%B2%20-%202.meta.js
// ==/UserScript==
var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;
    let products = [];
    var sales = 0;
    var amountProduct = 0;
    var nameProduct = '';
    var x = 0
    var shopName = [];
    var purchaseSumm = 0;
    var productSolo = []

    var shopGoodsURLReg = /\w*bizmania.ru\/units\/shop\/{0,}\?id=\w*\&tab=goods/
    var shopGoodsProductURLReg = /\w*bizmania.ru\/units\/shop\/{0,}\?id=\w*\&tab=goods\&product=\w*/
    var shopSupplyURLReg = /\w*bizmania.ru\/units\/shop\/{0,}\?id=\w*\&tab=supply/
    var shopDivisionsURLReg = /\w*bizmania.ru\/units\/shop\/{0,}\?id=\w*\&tab=divisions/
    var shopDivisionsOtherURLReg = /\w*bizmania.ru\/units\/shop\/{0,}\?id=\w*\&tab=divisions\[a-z&=_]*/
    var shopAccountLogReportsURLReg = /\w*bizmania.ru\/units\/shop\/{0,}\?p=\w*\&section=accountlog\&id=\w*\&sort=\&tab=reports/
    var shopShopURLReg = /\w*bizmania.ru\/units\/shop\/{0,}\?id=\w*\&tab=shop/
    var shopURLReg = /\w*bizmania.ru\/units\/shop\/{0,}\?id=\w*/
    var factorySupplyURLReg = /\w*bizmania.ru\/units\/factory\/{0,}\?id=\w*\&tab=supply/
    var factoryAccountLogReportsURLReg = /\w*bizmania.ru\/units\/factory\/{0,}\?p=\w*\&section=accountlog\&id=\w*\&sort=\&tab=reports/
    var factorySaleURLReg = /\w*bizmania.ru\/units\/factory\/{0,}\?id=\w*\&tab=sale/
    var warehouseGoodsURLReg = /\w*bizmania.ru\/units\/warehouse\/{0,}\?id=\w*\&tab=goods/
    var cateringGoodsURLReg = /\w*bizmania.ru\/units\/catering\/{0,}\?id=\w*\&tab=goods/
    var corpLink = /\w*bizmania.ru\/corporation\/{0,}\?id=\w*\&tab=quests&sub=active&questTypeParam=\w*/
    var citySalesURLReg = /\w*bizmania.ru\/city\/{0,}\?id=\w*\&tab=retailmarket\&sub=retail\&retailgroup=\w*/
    var citySalesPageURLReg = /\w*bizmania.ru\/city\/{0,}\?p=\w*\&sub=retail\&id=\w*\&sort=\&tab=retailmarket\&retailgroup=\w*/
    var qualityURLReg = /\w*bizmania.ru\/units\/produce\/qualityhelp\/{0,}\?id=\w*/

    var regmagtest = /\w*test.bizmania.ru:8000\/units\/shop\/{0,}\?id=\w*\&tab=goods/;
    var regzavtest = /\w*test.bizmania.ru:8000\/units\/factory\/{0,}\?id=\w*\&tab=supply/;
    var regmagproducttest = /\w*test.bizmania.ru:8000\/units\/shop\/{0,}\?id=\w*\&tab=goods&product=\w*/;

    function toNumber(spSum) {
        return parseFloat(spSum.replace(' ', '').replace(/\s+/g, '').replace(/[аА-яЯ: %]*/g, ''), 10);
    }
    //Розничный магазин, вкладка товары
    function shopGoods() {
        localStorage.setItem("url", document.URL)
        if (shopGoodsURLReg.test(window.location) && !shopGoodsProductURLReg.test(window.location)) {
            var resultCookie = document.cookie.match(/idshop=(.+?)(;|$)/)[1];
            var strGET = window.location.search.replace('?', '').split('&')[0].split('=')[1];
            if (resultCookie == strGET) {
                localStorage.removeItem("productSolo")
                var gainCookie = toNumber(document.getElementById('goods').getElementsByTagName('tfoot')[0].getElementsByTagName('tr')[0].getElementsByTagName('td')[2].getElementsByTagName('span')[0].innerText);
                document.cookie = "gain=" + gainCookie;
                localStorage.setItem("clickIn", 0)
            }
        }
        products = [];
        var oldDocument = document;
        var incProduct = 0;
        var amount = 0;
        var newSell = [];
        //Массив со всеми закупками на пересчет +20% с учетом запасов
        var arrAllPer20 = [];
        //Закупки на пересчет +20%
        var arrAllDayPer20 = [];
        $('table#goods > tbody > tr:has(td)').each(function() {
            var row = $(this);
            if ($('> td', row).length >= 7) {
                //Наименование товара
                var tovarPatch = '> td:nth-child(2)';
                var tovarVal = $(tovarPatch, row);
                var tovarText = $(tovarPatch, row).text();
                //На складе
                var stockPatch = '> td:nth-child(6)';
                var stockVal = $(stockPatch, row);
                var stockText = toNumber($(stockPatch, row).text());
                //Кач на складе
                var kachPatch = '> td:nth-child(7)';
                var kachVal = $(kachPatch, row);
                var kachText = toNumber($(kachPatch, row).text());
                //Кач в городе
                var kachPatchCity = '> td:nth-child(11)';
                var kachTextCity = toNumber($(kachPatchCity, row).text());
                //Продажи за 7 дней
                var sellPatch = '> td:nth-child(13)';
                var sellVal = $(sellPatch, row);
                var sellText = toNumber($(sellPatch, row).text());
                //Себестоимость
                var pricePatch = '> td:nth-child(8)';
                var priceText = toNumber($(pricePatch, row).text());
                //Стоимость в городе
                var pricePatchCity = '> td:nth-child(12)';
                var priceValCity = $(pricePatchCity, row);
                var priceTextCity = toNumber($(pricePatchCity, row).text());
                //Текущая цена
                var currentSellPatch = '> td:nth-child(10)';
                var currentSellVal = $(currentSellPatch, row);

                let precent = toNumber(document.getElementById('autoPricePercent').textContent);
                var newPriceCity = Math.round((priceTextCity * kachText / kachTextCity) / 100 * (100 + precent));
                newSell.push(newPriceCity);
                priceValCity.append("  <a href=\"javascript:sliderSetValue('price[" + incProduct + "]'," + Math.round(newPriceCity) + ".0);showSubmit()\" title=\"Новая цена на товар\">" + Math.round(newPriceCity) + "</a>");

                products.push([tovarText, kachText, kachTextCity, stockText, Math.ceil(sellText / 7)]);

                var sellDay = Math.round(sellText / 7) - stockText;
                if (sellDay < 0) {
                    sellDay = 0;
                }

                var sellDay20percent = Math.round(sellText / 7 * 1.2) - stockText;
                if (sellDay20percent < 0) {
                    sellDay20percent = 0;
                }
                var sellStock7 = sellText - stockText;
                if (sellStock7 < 0) {
                    sellStock7 = 0;
                }

                //stockVal.append( " <br><b>("+Math.round(sellText / 7) + ")</b>");
                sellVal.append(" - <a href=\"javascript:sliderSetValue('purchaseQuantity[" + incProduct + "]'," + sellStock7 + ".0);showSubmit()\" title=\"Закупка на 7 дней с учетом запасов\">" + sellStock7 + "</a>");
                stockVal.append("<br><a href=\"javascript:sliderSetValue('purchaseQuantity[" + incProduct + "]'," + Math.round(sellText / 7) + ".0);showSubmit()\" title=\"Закупка на пересчет\">" + Math.round(sellText / 7) + "</a>");
                stockVal.append(" - <a href=\"javascript:sliderSetValue('purchaseQuantity[" + incProduct + "]'," + sellDay + ".0);showSubmit()\" title=\"Закупка на пересчет с учетом запасов\">" + sellDay + "</a>");
                stockVal.append(" - <a href=\"javascript:sliderSetValue('purchaseQuantity[" + incProduct + "]'," + sellDay20percent + ".0);showSubmit()\" title=\"Закупка на пересчет +20% с учетом запасов\">" + sellDay20percent + "</a>");

                arrAllPer20.push(sellDay20percent);
                arrAllDayPer20.push(Math.round(sellText / 7));
                //Если кач в магазине меньше чем кач в городе
                if (kachText < kachTextCity) {
                    kachVal.attr('style', 'background-color:Yellow');
                }
                //Если не хватает на продажу 2 дней
                if (stockText < sellText / 7 * 2) {
                    stockVal.attr('style', 'background-color:Yellow');
                }
                //Если не хватает на продажу дня
                if (stockText < sellText / 7) {
                    stockVal.attr('style', 'background-color:#ff6161');
                }

                //amount = amount + Math.round(sellText / 7) * priceText;
                incProduct++;

            }
        });
        localStorage.setItem("products", JSON.stringify(products))
        var containerSell = $('table.datatable > tfoot > tr > td:nth-child(1)');
        var input_11 = $('<button onclick="return false">Новая цена</button>').click(function() {
            let i = 0;
            while (i < incProduct) {
                var zzz = document.getElementsByName('price[' + i + ']');
                if (zzz[0].className == "blue edit bold" && toNumber(zzz[0].value) < newSell[i]) {
                    console.log(toNumber(zzz[0].value) + " " + newSell[i]);
                    zzz[0].value = newSell[i];
                } else if (zzz[0].className !== "blue edit bold") {
                    zzz[0].value = newSell[i];
                }
                var buttonSaveVisible = document.getElementById("submit");
                buttonSaveVisible.style.display = "block";
                i++;
            }
        });
        containerSell.append($(input_11));
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
                console.log(i);
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
                console.log(i);
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
                var zzz = document.getElementsByName('purchaseQuantity[' + i + ']');
                zzz[0].value = arrAllDayPer20[i];
                var buttonSaveVisible = document.getElementById("submit");
                buttonSaveVisible.style.display = "block";
                i++;
            }
        });
        //container.append( $('<td>').append(input_0).append(input_1).append('</td>'));

        //container.append($(input_0));
        //container.append($(input_1));
        //container.append($(input_arrAllPer20));
        //container.append($(input_arrAllDayPer20));

    }
    //END-------------
    function setNewSellAll(oldDocument) {
        let elem = oldDocument.getElementById('goods')[0].getElementsByTagName('tbody')[0];
        for (var i = 0; i < elem.rows.length; i++) {
            var newSell = toNumber(elem.rows[i].cells[12].textContent);
            sliderSetValue("'purchaseQuantity[" + incProduct + "]'", Math.round(newSell));
        }
        showSubmit();
    }

    function buying(text) {
        localStorage.setItem('clickIn', 1)
        //document.body.innerHTML = "";
        var tovarName = '';
        var tovarKach = '';
        var findTovar1 = [];
        var dokup3 = 0;
        var dokup7 = 0;
        var dokup2 = 0;
        var dokup1 = 0;
        var kolvo = 0;
        console.log("test")
        documentNew = window.frames[1].document
        let elem = documentNew.getElementsByName('purchaseForm')[0].getElementsByClassName('datatable')[0].getElementsByTagName('tbody')[0];
        products = JSON.parse(localStorage.getItem('products'))
        for (var i = 0; i < elem.rows.length; i++) {
            tovarName = elem.rows[i].cells[2].textContent;
            tovarKach = elem.rows[i].cells[4].textContent;
            console.log(tovarKach);
            if (text == 'zav') {
                var tcurrent = toNumber(elem.rows[i].cells[9].textContent);
            } else {
                var tcurrent = toNumber(elem.rows[i].cells[8].textContent);
            }
            console.log('tovarName ' + tovarName);
            for (var x = 0; x < products.length; x++) {
                if (products[x][0] == tovarName) {
                    findTovar1 = products[x];
                }
            }
            console.log('findTovar1 тест ' + findTovar1);
            if (text == 'zav') {
                dokup3 = findTovar1[1] * 3 - findTovar1[2];
                dokup7 = findTovar1[1] * 7 - findTovar1[2];
                dokup2 = findTovar1[1] * 2 - findTovar1[2];
                dokup1 = findTovar1[1] - findTovar1[2] + 1;
                if (dokup1 < 0) {
                    dokup1 = 0;
                }
                elem.rows[i].cells[9].innerHTML = '<a href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + tcurrent + ');updateSum(' + i + ')">' + tcurrent + '</a><br>7 дней <a href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + dokup7 + ');updateSum(' + i + ')">' + dokup7 + '</a>3 дня <a href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + dokup3 + ');updateSum(' + i + ')">' + dokup3 + '</a>  2 день <a href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + dokup2 + ');updateSum(' + i + ')">' + dokup2 + '</a>  1 день <a href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + dokup1 + ');updateSum(' + i + ')">' + dokup1 + '</a>';
            } else {
                var kolvo = Math.ceil((findTovar1[2] * findTovar1[3] - findTovar1[1] * findTovar1[3]) / (tovarKach - findTovar1[2]));
                dokup3 = findTovar1[4] * 3 - findTovar1[3];
                dokup7 = findTovar1[4] * 7 - findTovar1[3];
                dokup1 = findTovar1[4] - findTovar1[3];
                if (kolvo < 0) {
                    kolvo = 0;
                }
                if (dokup1 < 0) {
                    dokup1 = 0;
                }
                if (dokup7 < 0) {
                    dokup7 = 0;
                }
                if (dokup3 < 0) {
                    dokup3 = 0;
                }

                day1 = '1- <a id="1day' + i + '" href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + dokup1 + ');updateSum(' + i + ')">' + dokup1 + '</a> '
                day3 = '3- <a id="3day' + i + '" href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + dokup3 + ');updateSum(' + i + ')">' + dokup3 + '</a> '
                day7 = '7- <a id="7day' + i + '" href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + dokup7 + ');updateSum(' + i + ')">' + dokup7 + '</a>'

                let elemBuy = elem.rows[i].cells[8]
                p2 = documentNew.createElement("p")
                p2.innerHTML = 'Кач <a href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + kolvo + ');updateSum(' + i + ')">' + kolvo + '</a>'
                p3 = documentNew.createElement("p")
                p3.innerHTML = day1 + day3 + day7
                elemBuy.append(p2)
                elemBuy.append(p3)

                //elem.rows[i].cells[8].innerHTML = '<a href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + tcurrent + ');updateSum(' + i + ')">' + tcurrent + '</a><br>Кач <a href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + kolvo + ');updateSum(' + i + ')">' + kolvo + '</a><br>1- <a id="1day' + i + '" href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + dokup + ');updateSum(' + i + ')">' + dokup + '</a>  3- <a id="3day' + i + '" href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + dokup3 + ');updateSum(' + i + ')">' + dokup3 + '</a>  7- <a id="7day' + i + '"  href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + dokup7 + ');updateSum(' + i + ')">' + dokup7 + '</a>';
            }
        }
        let elemButtons = documentNew.getElementsByName('purchaseForm')[0].getElementsByClassName('datatable')[0].getElementsByTagName('tfoot')[0];
        var tr = documentNew.createElement("tr");
        var td1 = documentNew.createElement("td");
        td1.innerHTML = "<p title=" + documentNew.baseURI + ">Закупиться на 1 день<p>"
        var td3 = documentNew.createElement("td");
        td3.innerHTML = "<p title=" + documentNew.baseURI + ">Закупиться на 3 дня<p>"
        var td7 = documentNew.createElement("td");
        td7.innerHTML = "<p title=" + documentNew.baseURI + ">Закупиться на 7 дней<p>"
        tr.appendChild(td1)
        tr.appendChild(td3)
        tr.appendChild(td7)
        elemButtons.appendChild(tr)
    }

    function foo(i = 0, text) {
        i++;
        setTimeout(() => {
            if (document.getElementById('popupCaption').textContent == 'Выбор продуктов') {
                buying(text);
            } else {
                foo(i, text);
            }
        }, 1000)
    }

    //Розничный магазин, вкладка снабжение
    function shopSuply() {
        $('table#goods > tbody > tr:has(td)').each(function() {
            var row = $(this);
            if ($('> td', row).length >= 7) {
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
                if (stockVendorText < sellText) {
                    stockVendorVal.attr('style', 'background-color:#ff6161');
                }
                sellVal.append(" - <a href=\"javascript:sliderSetValue('purchaseQuantity[" + incProduct + "]'," + sellStock7 + ".0);showSubmit()\" title=\"Закупка на 7 дней с учетом запасов\">" + sellStock7 + "</a>");
            }
        });

    }

    function factorySuply() {
        localStorage.removeItem("products")
        let products = [];
        var incProduct = 0;
        $('table#supplytbl > tbody > tr:has(td)').each(function() {
            var row = $(this);
            if ($('> td', row).length >= 7) {
                var tovarPatch = '> td:nth-child(3)';
                var tovarVal = $(tovarPatch, row);
                var tovarText = $(tovarPatch, row).text();
                tovarText = tovarText.slice(0, -3).trim();
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
                products.push([tovarText, requiredDay, stockRequiredVendorText]);
                if (stockRequiredVendorText < requiredDay * 2) {
                    stockRequiredVendorVal.attr('style', 'background-color:Yellow');
                }

                if (stockRequiredVendorText < requiredDay) {
                    stockRequiredVendorVal.attr('style', 'background-color:#ff6161');
                }

                stockVendorVal.append(" - <a href=\"javascript:sliderSetValue('purchase[" + incProduct + "]'," + stockVendorText + ".0);showSubmit()\" title=\"Закупка на неделю\">Закупка</a>");
                stockRequiredVendorVal.append(" - <a href=\"javascript:sliderSetValue('purchase[" + incProduct + "]'," + requiredDay + ".0);showSubmit()\" title=\"Закупка на 1 день\">" + requiredDay + "</a>");
                incProduct++;

            }
        });
        localStorage.setItem("products", JSON.stringify(products))
    }

    function warehouseGoods() {
        let elem = document.getElementsByClassName('datatable')[1].getElementsByTagName('tbody')[0];
        for (var i = 0; i < elem.rows.length; i++) {
            if (elem.rows[i].cells[14].textContent.length > 1) {
                var oldValue = elem.rows[i].cells[14].textContent
                var price = toNumber(oldValue);
                price = Intl.NumberFormat('ru-RU').format((price / 100 * 70))
                elem.rows[i].cells[14].innerHTML += "<br><a name='addSale' title='" + i + "'>" + price + "</a> p."
            }
            var rent = elem.rows[i].cells[4].getElementsByTagName('span')[0].title;
            if (toNumber(rent) < 0) {
                rent = '<font class="red">' + rent + '</font>'
            }
            elem.rows[i].cells[4].getElementsByTagName('span')[0].innerHTML = elem.rows[i].cells[4].getElementsByTagName('span')[0].innerHTML + '<br>' + rent;
            var tCurrent = toNumber(elem.rows[i].cells[6].textContent);
            if (tCurrent > 0) {
                tovarName = elem.rows[i].cells[1].getElementsByTagName('a')[0].textContent;
                var tKach = toNumber(elem.rows[i].cells[7].textContent);
                var tKachGor = toNumber(elem.rows[i].cells[13].textContent);
                var tSellGor = toNumber(elem.rows[i].cells[14].textContent);
                var itogo = tSellGor / tKachGor * tKach;
            }
            var tCurrentKach = toNumber(elem.rows[i].cells[7].textContent);
            var tCurrentKachGor = toNumber(elem.rows[i].cells[13].textContent);
            if (tCurrentKach > 0 && tCurrentKachGor > 0) {
                if (tCurrentKach < tCurrentKachGor) {
                    elem.rows[i].cells[7].style.backgroundColor = 'yellow'
                }
            }
        }
        elem = document.getElementsByClassName('datatable')[2].getElementsByTagName('tfoot')[0];
        elem.rows[0].cells[6].innerHTML = "<a name='addAllSale'>Закупить все</a>";
    }

    function setValue(id, value) {
        let elem = document.getElementsByClassName('datatable')[1].getElementsByTagName('tbody')[0];
        console.log(elem.rows[id].cells[9].getElementsByTagName('input')[0])
        elem.rows[id].cells[9].getElementsByTagName('input')[0].value = value;
    }

    function setAllValue() {
        let elem = document.getElementsByClassName('datatable')[1].getElementsByTagName('tbody')[0];
        for (var i = 0; i < elem.rows.length; i++) {
            var name = elem.rows[i].cells[1].getElementsByTagName('a')[0].textContent
            console.log(name)
            if (elem.rows[i].cells[14].textContent.length > 1 && (name !== '1')) {
                var oldValue = elem.rows[i].cells[14].textContent
                var price = toNumber(oldValue);
                price = Intl.NumberFormat('ru-RU').format((price / 100 * 70))
                elem.rows[i].cells[9].getElementsByTagName('input')[0].value = toNumber(price);
            }
        }
    }

    function shopDivisions() {
        var tCurrent = [];
        var product = 0;
        var summIncome = [];
        var personalCurrent = 0;
        var personalMax = 0;
        let elem = document.getElementsByClassName('goods')[0].getElementsByTagName('tbody')[0];
        for (var i = 0; i < elem.rows.length; i++) {
            if (i % 2 === 0) {
                shopName.push([elem.rows[i].cells[1].getElementsByClassName('infotable')[0].getElementsByTagName('tbody')[0].rows[3].cells[1].getElementsByTagName('input')[0].attributes[0].textContent, toNumber(elem.rows[i].cells[1].getElementsByClassName('infotable')[0].getElementsByTagName('tbody')[0].rows[3].cells[1].getElementsByTagName('a')[1].textContent), elem.rows[i].cells[2].getElementsByClassName('infotable')[0].getElementsByTagName('tbody')[0].rows[4].cells[1]]);
                product += 1;
                personalCurrent += toNumber(elem.rows[i].cells[1].getElementsByClassName('infotable')[0].getElementsByTagName('tbody')[0].rows[3].cells[1].getElementsByTagName('input')[0].value)
                personalMax += toNumber(elem.rows[i].cells[1].getElementsByClassName('infotable')[0].getElementsByTagName('tbody')[0].rows[3].cells[1].getElementsByTagName('span')[0].getElementsByTagName('a')[1].textContent)
                summIncome.push(toNumber(elem.rows[i].cells[2].getElementsByClassName('infotable')[0].getElementsByTagName('tbody')[0].rows[4].cells[1].textContent));
            }
        }
        var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);

        $ = win.$;
        var container = $('table.goods');
        summIncome.sort(function(a, b) {
            return a - b
        });
        var diff = '';
        var y = 0;
        var difMin = 0;
        var difMax = 0;
        for (i = 0; i < shopName.length; i++) {
            if (toNumber(shopName[i][2].textContent) - parseInt(summIncome[parseInt(elem.rows.length / 2 / 2)]) < 0) {

                diff = '<font class="red">' + (toNumber(shopName[i][2].textContent) - parseInt(summIncome[parseInt(elem.rows.length / 2 / 2)])).toLocaleString('ru-RU') + '</font>'
            } else {
                diff = (toNumber(shopName[i][2].textContent) - parseInt(summIncome[parseInt(elem.rows.length / 2 / 2)])).toLocaleString('ru-RU')
            }
            if (toNumber(shopName[i][2].textContent) < 0) {
                console.log(shopName[i][2])
                shopName[i][2].innerHTML = '<font class="red">' + shopName[i][2].textContent + '</font> (' + diff + ')';
            } else {
                shopName[i][2].innerHTML = shopName[i][2].textContent + ' (' + diff + ')';
            }
            if (y < shopName.length / 2) {
                difMin += (toNumber(shopName[i][2].textContent) - parseInt(summIncome[parseInt(elem.rows.length / 2 / 2)]))
            } else {
                difMax += (toNumber(shopName[i][2].textContent) - parseInt(summIncome[parseInt(elem.rows.length / 2 / 2)]))
            }
            y += 1
        }
        console.log(difMax.toLocaleString('ru-RU'));
        console.log(difMin.toLocaleString('ru-RU'));
        var difDif = ''
        if ((difMax + difMin) < 0) {
            difDif = '<td nowrap><font class="red">Разница: ' + (difMax + difMin).toLocaleString('ru-RU') + '</font></td>'
        } else {
            difDif = '<td nowrap>Разница: ' + (difMax + difMin).toLocaleString('ru-RU') + '</td>'
        }
        var input_0 = $('<thead><tr><td nowrap><a style="cursor: hand;" onclick="return false">Максимум рабочих</a></td><td nowrap>Средняя медианная прибыль: ' + parseInt(summIncome[parseInt(elem.rows.length / 2 / 2)]).toLocaleString('ru-RU') + '</td></tr><tr><td nowrap>Текущее количество рабочих: ' + personalCurrent.toLocaleString('ru-RU') + '</td><td nowrap>Максимальное количество рабочих: ' + personalMax.toLocaleString('ru-RU') + '</td></tr><tr><td nowrap>Сумма выше: ' + difMax.toLocaleString('ru-RU') + '</td><td nowrap>Сумма ниже: ' + difMin.toLocaleString('ru-RU') + '</td>' + difDif + '</tr></thead>')
        container.append($(input_0));
    }

    function factorySales() {
        let elem = document.getElementById('goods').getElementsByTagName('tbody')[0];
        for (var i = 0; i < elem.rows.length; i++) {
            var kachCity = elem.rows[i].cells[13].getElementsByTagName('img')[0].title;
            if (kachCity.indexOf('Ср. качество в рознице:') >= 0) {
                var indexText = kachCity.indexOf('Ср. качество в рознице:') + 23
                var kach = kachCity.slice(indexText, indexText + 6).trim()
                console.log(elem.rows[i].cells[10]); //23
                if (elem.rows[i].cells[10].textContent < kach) {
                    elem.rows[i].cells[10].style = "background: rgb(240, 96, 96)"
                }
                elem.rows[i].cells[10].innerHTML = elem.rows[i].cells[10].textContent + " [" + kach + "]"
            }
            //elem.rows[i].cells[9].innerHTML = '<a href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + tcurrent + ');updateSum(' + i + ')">' + tcurrent + '</a><br>Док <a href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + dokup + ');updateSum(' + i + ')">' + dokup + '</a>'
        }
    }

    function cateringSales() {
        let elem = document.getElementById('goods').getElementsByTagName('tbody')[0];
        for (var i = 0; i < elem.rows.length; i++) {
            var kachCity = toNumber(elem.rows[i].cells[11].textContent);
            if (kachCity >= 0) {
                if (elem.rows[i].cells[3].textContent < kachCity) {
                    elem.rows[i].cells[3].style = "background: rgb(240, 96, 96)"
                }
                elem.rows[i].cells[3].innerHTML = elem.rows[i].cells[3].textContent + " [" + (toNumber(elem.rows[i].cells[3].textContent) - kachCity).toFixed(2) + "]"
            }
            //elem.rows[i].cells[9].innerHTML = '<a href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + tcurrent + ');updateSum(' + i + ')">' + tcurrent + '</a><br>Док <a href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + dokup + ');updateSum(' + i + ')">' + dokup + '</a>'
        }
    }

    function factorySales() {
        let elem = document.getElementById('goods').getElementsByTagName('tbody')[0];
        for (var i = 0; i < elem.rows.length; i++) {
            var kachCity = elem.rows[i].cells[13].getElementsByTagName('img')[0].title;
            if (kachCity.indexOf('Ср. качество в рознице:') >= 0) {
                var indexText = kachCity.indexOf('Ср. качество в рознице:') + 23
                var kach = kachCity.slice(indexText, indexText + 6).trim()
                console.log(elem.rows[i].cells[10]); //23
                if (elem.rows[i].cells[10].textContent < kach) {
                    elem.rows[i].cells[10].style = "background: rgb(240, 96, 96)"
                }
                elem.rows[i].cells[10].innerHTML = elem.rows[i].cells[10].textContent + " [" + kach + "]"
            }
            //elem.rows[i].cells[9].innerHTML = '<a href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + tcurrent + ');updateSum(' + i + ')">' + tcurrent + '</a><br>Док <a href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + dokup + ');updateSum(' + i + ')">' + dokup + '</a>'
        }
    }

    function shopGoodsProduct() {
        let elem = document.getElementsByClassName('datatable')[0];
        for (var i = 1; i < elem.rows.length; i++) {
            var sale = toNumber(elem.rows[i].cells[1].textContent);
            if (sales < sale) {
                sales = sale
            }
        }
        amountProduct = toNumber(document.getElementsByClassName('datatable')[1].rows[1].cells[1].textContent);
        nameProduct = document.getElementsByClassName('pad12')[0].getElementsByTagName('h4')[0].textContent;
        var x = 0
        productSolo = JSON.parse(localStorage.getItem("productSolo"))
        if (productSolo != null) {
            productSolo.forEach((product) => {
                if (product[0] == nameProduct) {
                    x = 1
                }
            })
        } else {
            productSolo = []
        }
        if (x == 0) {
            productSolo.push([nameProduct, amountProduct, sales])
        }
        localStorage.setItem("productSolo", JSON.stringify(productSolo))
    }


    function buyingProduct() {
        if (document.getElementById('popupCaption').textContent == 'Выбор продуктов') {
            let elem = document.getElementById('popupContent').contentWindow.document.getElementsByName('purchaseForm')[0].getElementsByClassName('datatable')[0].getElementsByTagName('tbody')[0];
            productSolo = JSON.parse(localStorage.getItem("productSolo"))

            let elemButtons = document.getElementById('popupContent').contentWindow.document.getElementsByName('purchaseForm')[0].getElementsByClassName('datatable')[0].getElementsByTagName('tfoot')[0];
            var tr = document.createElement("tr");
            var td1 = document.createElement("td");
            td1.innerHTML = "<p title=" + document.baseURI + ">Закупиться на 1 день<p>"
            var td3 = document.createElement("td");
            td3.innerHTML = "<p title=" + document.baseURI + ">Закупиться на 3 дня<p>"
            var td7 = document.createElement("td");
            td7.innerHTML = "<p title=" + document.baseURI + ">Закупиться на 7 дней<p>"
            tr.appendChild(td1)
            tr.appendChild(td3)
            tr.appendChild(td7)
            elemButtons.appendChild(tr)
            for (var i = 0; i < elem.rows.length; i++) {
                const test = productSolo.find((element) => element[0] == elem.rows[i].cells[2].textContent);
                console.log(test)
                if (test != undefined) {
                    var tcurrent = toNumber(elem.rows[i].cells[8].textContent);
                    var dokup5 = Math.ceil((test[2] * 5 / 100 * 110 - test[1]));
                    var dokup3 = Math.ceil((test[2] * 3 / 100 * 110 - test[1]));
                    var dokup2 = Math.ceil((test[2] * 2 / 100 * 110 - test[1]));
                    var dokup1 = Math.ceil((test[2] / 100 * 110 - test[1]));
                    elem.rows[i].cells[8].innerHTML = '<a href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + tcurrent + ');updateSum(' + i + ')">' + tcurrent + '</a><br>5 дня <a href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + dokup5 + ');updateSum(' + i + ')">' + dokup5 + '</a> 3 дня <a href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + dokup3 + ');updateSum(' + i + ')">' + dokup3 + '</a>  2 дня <a href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + dokup2 + ');updateSum(' + i + ')">' + dokup2 + '</a>  1 день <a href="javascript:activateProduct(' + i + ');sliderSetValue(\'purchase[' + i + ']\',' + dokup1 + ');updateSum(' + i + ')">' + dokup1 + '</a>';
                }
            }
        }
    }


    function buyPersonal() {
        for (var i = 0; i < shopName.length; i++) {
            var zzz = document.getElementsByName(shopName[i][0])[0];
            zzz.value = shopName[i][1];
            console.log(123)
            var buttonSaveVisible = document.getElementById("submit" + parseInt(shopName[i][0].match(/\d+/)));
            buttonSaveVisible.style.display = "block";
        }
        //console.log(shopName);
    }

    function messages() {

    }

    function sleeping() {
        setTimeout(() => {
            if (document.getElementById('popupCaption').textContent == 'Выбор продуктов') {
                console.log('popal')
                buyingProduct();
            } else {
                console.log('nepopal')
                sleeping();
            }
        }, 1000)
    }

    function check() {
        let now = new Date();
        let test = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        test = test.getTime() - 10200000
        //console.log(now);
        var elem = document.getElementsByClassName('datatable')[0].getElementsByTagName('tbody')[0];
        for (var i = 0; i < elem.rows.length; i++) {
            var date = elem.rows[i].cells[1].textContent;
            date = date.split(' ')[0].split('.')[2] + '-' + date.split(' ')[0].split('.')[1] + '-' + date.split(' ')[0].split('.')[0] + 'T' + date.split(' ')[1].split(':')[0] + ':' + date.split(' ')[1].split(':')[1] + ':00'
            date = Date.parse(date)
            if (date >= test) {
                purchaseSumm += toNumber(elem.rows[i].cells[8].textContent);
            }
        }
        if (shopAccountLogReportsURLReg.test(window.location)) {
            var resultCookie = document.cookie.match(/idshop=(.+?)(;|$)/)[1];
            var strGET = window.location.search.replace('?', '').split('&');
            if (resultCookie == strGET[2].split('=')[1]) {
                var costCookie = document.cookie.split('cost=')[1].split(';')[0]
                if (costCookie == '0') {
                    costCookie = '"' + strGET[0].split('=')[1] + ',' + purchaseSumm.toString() + '":'
                } else {
                    y = 0;
                    for (var i = 0; i < costCookie.split(":").length; i++) {
                        if (costCookie.split(":")[i].split(",")[0].replace('"', '') == strGET[0].split('=')[1]) {
                            y = 1;
                            break;
                        }
                    }
                    if (y == 0) {
                        costCookie += '"' + strGET[0].split('=')[1] + ',' + purchaseSumm.toString() + '":'
                        console.log(costCookie)
                    }
                }
                document.cookie = "cost=" + costCookie;
            }
        }
        var container = $('table.datatable');
        var input_0 = $('<thead><tr><td nowrap>Сумма закупок: ' + purchaseSumm.toLocaleString('ru-RU') + '</td></tr></thead>')
        container.append($(input_0));
    }

    function corpQuest() {
        percentSumm = 0
        percentUsers = []
        var elem = document.getElementsByClassName('tabbodyie')[0].getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].getElementsByTagName('form')[0].getElementsByTagName('tbody')[1].getElementsByTagName('div')[0].getElementsByClassName('goods');
        var strGET = window.location.search.replace('?', '').split('&')[3].split("=")[1];
        //console.log(elem)
        for (var i = 0; i < elem.length; i++) {
            var id = elem[i].getElementsByTagName('table')[0].getElementsByTagName('tr')[0].getElementsByTagName('td')[3].getElementsByTagName('a')[0];
            url = id.href.toString().replace('?', '').split('&')[3].split("=")[1]
            if (url == strGET) {
                kvala = toNumber(elem[i].getElementsByTagName('table')[0].getElementsByTagName('tr')[1].getElementsByTagName('td')[1].getElementsByTagName('span')[1].textContent)
                percent = document.getElementsByClassName('tabbodyie')[0].getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].getElementsByClassName('datatable')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr');
                for (var y = 0; y < percent.length; y++) {
                    percentValue = toNumber(percent[y].getElementsByTagName('td')[1].textContent)
                    percentUsers.push([percent[y].getElementsByTagName('td')[0].textContent, percentValue, [strGET]])
                    percentSumm = percentSumm + percentValue
                }
            }
        }
        for (var i = 0; i < percentUsers.length; i++) {
            percent = document.getElementsByClassName('tabbodyie')[0].getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].getElementsByClassName('datatable')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr')[i];
            var x = percent.insertCell(-1);
            x.innerHTML = "<td>" + kvala / percentSumm * percentUsers[i][1] + "</td>"
        }
        local = JSON.parse(localStorage.getItem("quests"))
        if (local != null) {
            for (var i = 0; i < local.length; i++) {
                if (local[i][2] != strGET) {
                    percentUsers.push(local[i])
                }
            }
        }
        localStorage.setItem("quests", JSON.stringify(percentUsers));
        str = ""
        localUsers = JSON.parse(localStorage.getItem("quests"))
        newLocalUsers = []
        over = 0
        for (var i = 0; i < localUsers.length; i++) {
            for (var x = 0; x < newLocalUsers.length; x++) {
                if ((newLocalUsers[x][0] == localUsers[i][0])) {
                    for (var y = 0; y < newLocalUsers[x][2].length; y++) {
                        if ((newLocalUsers[x][2][y] != localUsers[i][2][0])) {
                            over = 1
                            break
                        }
                    }
                }
            }
            //str+= localUsers[i][0]+" "+localUsers[i][1]+"\n"
        }
        alert(str)
    }

    function citySales() {
        var tr = document.getElementsByClassName('dualbox')[0].getElementsByClassName('datatable')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        var length = tr.length
        let i = 0;
        while (i < length) {
            var td = tr[i].getElementsByTagName('td')[6]
            var span = td.getElementsByTagName('span')[0]
            td.append(toNumber(span.title))
            console.log(toNumber(span.title))
            i++;
        }
    }

    function quality() {
        var tr = document.getElementsByClassName('datatable')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        console.log(tr)
        var length = tr.length
        let i = 0;
        let div = document.createElement('div');
        while (i < length) {
            var td = tr[i].getElementsByTagName('td')[1]
            let button = document.createElement('button');
            button.innerText=td.innerText
            button.id=i
            div.appendChild(button)
            console.log(button)
            i++;
        }
        //console.log(document.body.appendChild(div))
        document.body.appendChild(div);
    }

    function calculateQuality(resource){
        var tr = document.getElementsByClassName('datatable')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        console.log(tr)
        var length = tr.length
        let i = 0;
        var calculate = ""
        var quality = []
        var qualityPercent = []
        var qualityPercentCalc = 0
        var trMaxQuality = toNumber(document.getElementsByClassName('datatable')[1].getElementsByTagName('tbody')[0].getElementsByTagName('tr')[1].getElementsByTagName('td')[1].innerText);
        while (i < length) {
            var td = tr[i].getElementsByTagName('td')
            if (td[1].innerText == resource){
                calculate = td[2]
                qualityPercentCalc =toNumber(td[3].innerText)
            } else {
                trMaxQuality=trMaxQuality-toNumber(td[2].innerText)*toNumber(td[3].innerText)/100
            }
            i++;
        }
        trMaxQuality = trMaxQuality/qualityPercentCalc*100
        trMaxQuality = trMaxQuality.toFixed(2)
        calculate.append(" "+trMaxQuality)
        i=0
    }

    if (shopGoodsURLReg.test(window.location)) {
        shopGoods();
    } else if (warehouseGoodsURLReg.test(window.location)) {
        warehouseGoods();
    } else if (shopSupplyURLReg.test(window.location)) {
        shopSuply();
    } else if (factorySupplyURLReg.test(window.location)) {
        factorySuply();
    } else if (shopDivisionsURLReg.test(window.location) || shopDivisionsOtherURLReg.test(window.location)) {
        shopDivisions();
    } else if (factorySaleURLReg.test(window.location)) {
        factorySales();
    } else if (cateringGoodsURLReg.test(window.location)) {
        cateringSales();
    } else if (shopAccountLogReportsURLReg.test(window.location) || factoryAccountLogReportsURLReg.test(window.location)) {
        check();
    } else if (shopShopURLReg.test(window.location) || shopURLReg.test(window.location)) {
        calculateLosses();
    } else if (corpLink.test(window.location)) {
        corpQuest();
    } else if (citySalesURLReg.test(window.location) || citySalesPageURLReg.test(window.location)) {
        citySales();
    }

    function calculateLosses() {
        var idShopFromUrl = window.location.search.replace('?', '').split('&')[0].split('=')[1];
        if (document.getElementsByClassName('infotable')[1].getElementsByTagName('tbody')[0].getElementsByTagName('tr')[5]) {
            var losses = document.getElementsByClassName('infotable')[1].getElementsByTagName('tbody')[0].getElementsByTagName('tr')[5].getElementsByTagName('td');
            if (losses[0].innerText = 'Убытки прошл. периодов') {
                document.cookie = "losses=" + losses[1];
            }
        } else {
            losses = ["0", "0"]
            console.log(losses)
            document.cookie = "losses=0";
        }
        if (document.cookie.indexOf("idshop") != -1 && (toNumber(document.cookie.match(/idshop=(.+?)(;|$)/)[1]) == toNumber(idShopFromUrl))) {
            var gainCookie = toNumber(document.cookie.match(/gain=(.+?)(;|$)/)[1]);
            var costCookieSumm = 0;
            if (gainCookie != 0) {
                var costCookie = document.cookie.split('cost=')[1].split(';')[0]
                let elemButtons = document.getElementsByClassName('infotable')[1].getElementsByTagName('tbody')[0]
                var tr = document.createElement("tr");
                var td1 = document.createElement("td");
                td1.innerHTML = "Нужно на убытки: "
                var td2 = document.createElement("td");
                for (var i = 0; i < costCookie.split(":").length - 1; i++) {
                    costCookieSumm += toNumber(costCookie.split(":")[i].split(",")[1].replace('"', ''))
                }
                if (losses[1] == "0") {
                    lossesCost = 0
                } else {
                    lossesCost = toNumber(losses[1].innerText)
                }

                td2.innerHTML = (gainCookie - lossesCost + costCookieSumm).toLocaleString('ru-RU')
                tr.appendChild(td1)
                tr.appendChild(td2)
                elemButtons.appendChild(tr)
            }
        } else {
            localStorage.setItem("idShop", idShopFromUrl)
            localStorage.setItem('clickIn', 0)
            document.cookie = "idshop=" + idShopFromUrl;
            document.cookie = "cost=0";
            document.cookie = "gain=0";
        }
    }

    function clickBuy(td, a) {
        var tr = document.getElementsByName('purchaseForm')[0].getElementsByClassName('datatable')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        let i = 0;
        var length
        if (tr.length == 0) {
           length = 1
        } else {
           length = tr.length
        }
        while (i < length) {
            tr[i].getElementsByTagName('input')[1].checked = true;
            var button = tr[i].getElementsByTagName('td')[td].getElementsByTagName('a')[a].click()
            i++;
        }
    }

    document.addEventListener('click', function(e) {
        console.log(e.target.tagName)
        if (/\w*bizmania.ru\/units\/vendor\/select\/{0,}\?replace=\w*\&id=\w*/.exec(e.target.baseURI) && localStorage.getItem("clickIn") == 0) {
            buying('mag')
            console.log(document.getElementsByName('purchaseForm')[0].getElementsByClassName('datatable')[0].getElementsByTagName('tbody')[0])
        }
        if (qualityURLReg.exec(e.target.baseURI) && e.target.tagName == "BUTTON") {
            calculateQuality(e.target.innerText);
        } else if(qualityURLReg.exec(e.target.baseURI)){
        quality();
        }
        if ((shopGoodsURLReg.exec(e.target.baseURI) || regmagtest.exec(e.target.baseURI)) && (e.target.innerHTML === 'выбрать поставщика' || (e.target.tagName == "IMG" && e.target.title !== 'Добавить поставщика' && x != 1))) {
            console.log('123')
            foo(0, 'mag');
        } else if ((factorySupplyURLReg.exec(e.target.baseURI) || regzavtest.exec(e.target.baseURI)) && e.target.innerHTML === 'выбрать поставщика') {
            foo(0, 'zav');
        } else if ((shopGoodsProductURLReg.exec(e.target.baseURI) || regmagproducttest.exec(e.target.baseURI)) && e.target.title !== 'Добавить поставщика') {
            console.log(123)
            x = 1
            shopGoodsProduct()
        } else if (warehouseGoodsURLReg.exec(e.target.baseURI) && e.target.name == 'addSale') {
            setValue(e.target.title, e.target.textContent)
        } else if (warehouseGoodsURLReg.exec(e.target.baseURI) && e.target.name == 'addAllSale') {
            setAllValue()
        } else if (x == 1) {
            sleeping();
            x = 0
        } else if (e.target.innerHTML === 'Редактировать') {

        } else if (e.target.innerHTML === 'Максимум рабочих') {
            buyPersonal();
        } else if (e.target.innerHTML === 'Закупиться на 1 день') {
            if (shopGoodsURLReg.exec(localStorage.getItem("url")) || regmagtest.exec(e.target.title)) {
                clickBuy(8, 2)
            } else if (regzav.exec(e.target.title)) {
                clickBuy(9, 4)
            }
        } else if (e.target.innerHTML === 'Закупиться на 3 дня') {
            if (shopGoodsURLReg.exec(localStorage.getItem("url")) || regmagtest.exec(e.target.title)) {
                clickBuy(8, 3)
            } else if (regzav.exec(e.target.title)) {
                clickBuy(9, 2)
            }
        } else if (e.target.innerHTML === 'Закупиться на 7 дней') {
            if (shopGoodsURLReg.exec(localStorage.getItem("url")) || regmagtest.exec(e.target.title)) {
                clickBuy(8, 4)
            } else if (regzav.exec(e.target.title)) {
                clickBuy(9, 1)
            }
        }
    });

}

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);