// ==UserScript==
// @name        SupplyOnUnitList
// @description shows direct link to supply from the unit list page
// @namespace   virtonomica
// @version     1.01
// @include     http*://*virtonomic*.*/*/main/company/view/*/unit_list
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2877/SupplyOnUnitList.user.js
// @updateURL https://update.greasyfork.org/scripts/2877/SupplyOnUnitList.meta.js
// ==/UserScript==

var run = function() {

	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	$ = win.$;
    var realm = readCookie('last_realm');

    $('.unit-list-2014>tbody td[class^=info]').each(function(){
        UnitType = $(this).prop('class');
        var showSupply = false;
        switch (UnitType){
			
            // рыболовная база
			case "info i-fishingbase":
			break;

			// лесопилка
			case "info i-sawmill":
			break;

			// шахта
			case "info i-mine":
			break;

			// Нефтевышка
			case "info i-oilpump":
			break;

			// магазин
			case "info i-shop":
			showSupply = true;
			break;

			// Медцентры
			case "info i-medicine":
			break;

			// мельницы
			case "info i-mill":
			showSupply = true;
			break;

			// Ресторан
			case "info i-restaurant":
			break;

			// Фитнес центр
			case "info i-fitness":
			break;

			// Парикмахерская
			case "info i-hairdressing":
			break;

			// Прачечная
			case "info i-laundry":
			break;
	
			// Фруктовая плантация
			case "info i-orchard":
			break;

			//Заводы
			case "info i-workshop":
			showSupply = true;
			break;

			//Склад
			case "info i-warehouse":
//			showSupply = true;
			break;

			// Животноводческая ферма
			case "info i-animalfarm":
			showSupply = true;
			break;

			// Офис
			case "info i-office":
			break;
        }
        
        if (showSupply == true) {
            var id = $(this).parent().find($('.unit_id')).text();
            if (id == "") return;
            var url = '/%realm%/main/unit/view/%id%/supply'.replace('%realm%', realm).replace('%id%',id);
            var b = $('<a href="'+url+'"><img width="16" height="16" title="Снабжение" src="/img/icon/buy.gif"></a>');
            $(this).next().append(b);
        }
    }) //each function
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}