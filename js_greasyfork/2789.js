// ==UserScript==
// @name           Virtonomica: Unit List v2.25
// @namespace      virtonomica
// @description    Добавляет иконки для быстрого доступа к управлению предприятиями. Снабжение, сбыт, технология, реклама, исследования, ремонту. 
// @version        2.26
// @include        http://*virtonomic*.*/*/main/company/view/*/unit_list
// @downloadURL https://update.greasyfork.org/scripts/2789/Virtonomica%3A%20Unit%20List%20v225.user.js
// @updateURL https://update.greasyfork.org/scripts/2789/Virtonomica%3A%20Unit%20List%20v225.meta.js
// ==/UserScript==

var run = function() {

	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	$ = win.$;

	table = $("table.unit-top").next();
	el = $("td:has(a[href*='main/unit/view'])", table);
	for( i=0; i<el.length; i++){
		type =  el.eq(i).prop('class');
		add_produce = false;
		add_supply = false;
		add_consume = false;
		add_sale = false;
                add_technology = false;
                add_virtasement = false;
                add_investigation = false;
                add_equipment = false;
                add_closed = false;
		switch (type) {
			// рыболовная база
			case "info i-fishingbase":
			add_sale = true;
                        add_technology = true;
                        add_equipment = true;
                        break;
            // угольная электростанция
            case "info i-coal_power":
                add_sale = true;
                add_technology = true;
                break;
			// магазин
			case "info i-shop":
			add_supply = true;
			break;

			// Медцентры
			case "info i-medicine":
			add_supply = true;
			add_consume = true;
			break;

			// мельницы
			case "info i-mill":
			add_supply = true;
                        add_sale = true;
			break;

			// Ресторан
			case "info i-restaurant":
			add_supply = true;
			add_consume = true;
			break;
	
			// Фруктовая плантация
			case "info i-orchard":
			add_sale = true;
                        add_technology = true;
			break;

			//Заводы
			case "info i-workshop":
			add_supply = true;
                        add_sale = true;
                        add_technology = true;
			break;

			//Склад
			case "info i-warehouse":
			add_supply = true;
			add_sale = true;
			break;

			// Животноводческая ферма
			case "info i-animalfarm":
			add_supply = true;
                        add_sale = true;
                        add_technology = true;
			break;

                        // Офисы
			case "info i-office":
                        add_virtasement = true;
			break;
                        
                        // Шахты
			case "info i-mine":
                        add_sale = true;
                        add_technology = true;
			break;
                        
                        // Земледельческая ферма
			case "info i-farm":
                        add_sale = true;
                        add_technology = true;
			break;  

                        // Лаборатории
			case "info i-lab":
                        add_investigation = true;
			break;

                        // Лесопилки
			case "info i-sawmill":
                        add_sale = true;
                        add_technology = true;
			break;
                        
		}
		
		href = $("a", el.eq(i)).prop('href');
			console.log(href);
		if ( add_produce == true ) {
			console.log(href);
			el.eq(i).next().append(" <a target='blank' href=" + href +"/manufacture>" + "<img width=16 height=16 title='Производство' src=/img/icon/produce.gif></a> ");
		}
        if ( add_closed == true ) {
			console.log(href);href1 = href.replace("main/unit/view","window/unit/close");
			el.eq(i).next().append(" <a target='blank' href=" + href1 +  /*" onclick='return doWindow(this, 900, 600);'*/ "window/unit/close>" + "<img width=16 height=16 title='Закрыть' src='http://www.pro-lazers.ru/virta_img/cross.png'></a> ");
		}
		if ( add_consume == true ) {
			console.log(href);
			el.eq(i).next().append(" <a target='blank' href=" + href +"/consume>" + "<img width=16 height=16 title='Расходники' src=/img/icon/shopboard.gif></a> ");
		}
		if ( add_supply == true ) {
			console.log(href);
			el.eq(i).next().append(" <a target='blank' href=" + href +"/supply>" + "<img width=16 height=16 title='Снабжение' src=/img/unit_types/warehouse.gif></a> ");
		}
		if ( add_sale == true ) {
			console.log(href);
			el.eq(i).next().append(" <a target='blank' href=" + href +"/sale>" + "<img width=16 height=16 title='Сбыт' src='http://www.pro-lazers.ru/virta_img/sales.png'></a> ");
		}
                if ( add_technology == true ) {
			console.log(href);
			el.eq(i).next().append(" <a target='blank' href=" + href +"/technology>" + "<img width=16 height=16 title='Технология' src='http://www.pro-lazers.ru/virta_img/idea.png'></a> ");
		}
                if ( add_virtasement == true ) {
			console.log(href);
			el.eq(i).next().append(" <a target='blank' href=" + href +"/virtasement>" + "<img width=16 height=16 title='Реклама' src='http://www.pro-lazers.ru/virta_img/pr.png'></a> ");
		}
                if ( add_investigation == true ) {
			console.log(href);
			el.eq(i).next().append(" <a target='blank' href=" + href +"/investigation>" + "<img width=16 height=16 title='Исследования' src='http://www.pro-lazers.ru/virta_img/lab.png'></a> ");
		}
                if ( add_equipment == true ) {
			console.log(href);
            href1 = href.replace("main/unit/view","window/unit/equipment");
			el.eq(i).next().append(" <a target='blank' href=" + href1 +  /*" onclick='return doWindow(this, 900, 600);'*/ "window/unit/equipment>" + "<img width=16 height=16 title='Ремонт' src='http://www.pro-lazers.ru/virta_img/applications-engineering.png'></a> ");
		}
                 
		// если ссылка уже с иконкой, то не добавлять редактирвоание имени подразделения
		if ( $("img", el.eq(i)).length > 0 ) continue;
                console.log(href);
		href = href.replace("main/unit/view","window/unit/changename");
		el.eq(i).append("<a href="+href+ " onclick='return doWindow(this, 800, 320);'><img width=16 height=16 title='Переименовать' src='http://www.pro-lazers.ru/virta_img/pencil.png'/>");

	}
	
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}
