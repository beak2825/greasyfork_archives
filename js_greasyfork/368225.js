// ==UserScript==
// @name           Virtonomica:SaveShopInfo(ShopWarehouse)
// @namespace      Virtonomica
// @description    Автосохранение данных о ценах магазинов и заправок в локальном хранилище для использования в скрипте ShopWarehouse
// @author         UnclWish
// @version        1.08
// @include        http*://*virtonomic*.*/*/main/unit/view/*/trading_hall
// @include        http*://*virtonomic*.*/*/main/unit/view/*/sale
// @include        http*://*virtonomic*.*/*/main/unit/view/*
// @downloadURL https://update.greasyfork.org/scripts/368225/Virtonomica%3ASaveShopInfo%28ShopWarehouse%29.user.js
// @updateURL https://update.greasyfork.org/scripts/368225/Virtonomica%3ASaveShopInfo%28ShopWarehouse%29.meta.js
// ==/UserScript==

var run = function() {
	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	var $ = win.$;

	/**
	* записать данные в локальнео хранилище, с проверкой ошибок
	*/

	// Если это не нужная страница - выходим
	var title=$('#wrapper > div.metro_header > div > div.picture').attr('class');
	var a1=$('div.title').text().trim();
	var a2=(location.href).slice(-4);
	var href = location.href;

	if (title.search('header-incinerator_power') != -1) return;
	if (title.search('unit-header-cellular') == -1) {
		if (a1.indexOf("Офис") != -1) {
			if (href.indexOf('trading_hall') == -1) {
			if (href.indexOf('sale') == -1) return};}}
	//	if ((href.indexOf('sale') > 0) & (title.search('unit-header-warehouse') == -1)) return
	//	if ((href.indexOf('sale') == -1) & (title.search('unit-header-warehouse') == -1)) return};

	//console.log(a2);
	  if (isNaN(a2) & a2 != "sale" & a2 != "hall") return; //Выход если не главная страница или продажа


	function ToStorage(name, val){
		try {
			window.localStorage.setItem(name, JSON.stringify(val));
		} catch(e) {
			out = "Ошибка добавления в локальное хранилище";
			//console.log(out);
		}
	}

	function getFromStorage(obj, id_shop){
		if (obj[id_shop] == null) return '';
		return JSON.stringify(obj[id_shop]);
	}

	function Save() {
		out = 'OK';
		//n = shop_time.length;

		var flag_save = false;

		if(title.search('unit-header-shop')!=-1 || title.search('fuel')!=-1){
		var inp_sale = $("input[name*='productData[price]']");
		//console.log(inp_sale.length);
		//var td_sale = $("td:contains('$')");
		var td_sale = $("input[name*='productData[price]']").parent().prev();
		for (var i=0; i<inp_sale.length; i++) {
			var inp = inp_sale.eq(i);
			var td_pr = td_sale.eq(i);
			var tr = inp.parent().parent();

			var href = $("a[href*='globalreport/marketing']", tr);
			if (href.attr('href') == null) continue;
			var id_item = /(\d+)/.exec( href.attr('href') )[0];
			var img = $("a[href*='globalreport/marketing'] > img", tr);
			var img_item = img.attr('src');
			//console.log (img_item);

			if (shop_price[id_shop] == null) shop_price[id_shop] = new Object();

			//console.log( "www " + td_pr.text() );
			//console.log (id_item, id_shop, img_item);
			shop_price[id_shop][ id_item ] = inp.attr('value');
			shop_price[id_shop][ img_item ] = inp.attr('value');

			if ( shop_transport[ id_shop ] == null ) shop_transport[id_shop] = new Object();

			//td_pr = $("td", tr).eq(8);
			//console.log("TD_PR = " + td_pr.text());
			shop_transport[id_shop][ id_item ] = parseFloat( td_pr.text().replace('$', '').replace(' ','').replace(' ','').replace(' ','') );
		}
		if (inp_sale.length>0) {
			ToStorage('shop_price', shop_price);
			ToStorage('shop_transport', shop_transport);
			flag_save = true;
		}
		// Видимо это не нашего магазина
		//if (flag_save == false) return false;
		if (flag_save == false) {
		inp_sale = $("td:contains('%')").prev();
		//var td_sale = $("input[name*='productData[price]']").parent().prev();
		for (i=0; i<inp_sale.length; i++) {
			inp = inp_sale.eq(i);
			//var td_pr = td_sale.eq(i);
			tr = inp.parent();

			//var href = $("a[href*='by_trade_at_cities']", tr);
			//if (href.attr('href') == null) continue;
			//var id_item = /(\d+)/.exec( href.attr('href') )[0];
			img = $("td > img", tr);
			img_item = img.attr('src');
			//console.log (id_item);

			if (shop_price[id_shop] == null) shop_price[id_shop] = new Object();

			//console.log( "www " + td_pr.text() );

			//shop_price[id_shop][ id_item ] = inp.attr('value');
			shop_price[id_shop][ img_item ] = inp.text().replace('$', '').replace(' ','').replace(' ','').replace(' ','');

			//if ( shop_transport[ id_shop ] == null ) shop_transport[id_shop] = new Object();

			//td_pr = $("td", tr).eq(8);
			//console.log("TD_PR = " + td_pr.text());
			//shop_transport[id_shop][ id_item ] = parseFloat( td_pr.text().replace('$', '').replace(' ','').replace(' ','').replace(' ','') );
		}
		}
		if (inp_sale.length>0) {
			ToStorage('shop_price', shop_price);
			ToStorage('shop_transport', shop_transport);
			flag_save = true;
		}

		var td = $("td[align='right'][class='nowrap']:contains('%')");
		for (i=0; i< td.length; i++) {
			td_pr = td.eq(i);
			tr = td_pr.parent();

			//href = $("a[href*='by_trade_at_cities']", tr);
			img = $("img[src*='/img/products']", tr);
			img_item = img.attr('src');
			//if (href.attr('href') == null) continue;
			//id_item = /(\d+)/.exec( href.attr('href') )[0];
			//console.log(id_item);
			//console.log(img_item);

			if (market[ id_shop ] == null) market[ id_shop ] = new Object();

			//market[ id_shop ][ id_item ] = parseFloat( td_pr.text().replace('%', '') );
			market[ id_shop ][ img_item ] = parseFloat( td_pr.text().replace('%', '') );
		}

		if (td.length > 0) {
			ToStorage('market', market);
			flag_save = true;
		}
		}

		if (title.search('unit-header-warehouse')!=-1 || title.search('animalfarm')!=-1 || title.search('mill')!=-1 || title.search('workshop')!=-1 || title.search('mine')!=-1) {
		inp_sale = $("input[name*='[price]']");
		//var td_sale = $("td:contains('$')");
		td_sale = $("input[name*='[price]']").parent().prev().prev().prev();
		//console.log(inp_sale);
		for (i=0; i<inp_sale.length; i++) {
			inp = inp_sale.eq(i);
			td_pr = td_sale.eq(i);
			tr = inp.parent().parent();

			//href = $("a[href*='by_trade_at_cities']", tr);
			//if (href.attr('href') == null) continue;
			//id_item = /(\d+)/.exec( href.attr('href') )[0];
			img = $("img[src*='/img/products']", tr);
			img_item = img.attr('src');
			//console.log (img_item);

			if (shop_price[id_shop] == null) shop_price[id_shop] = new Object();

			//console.log( "www " + td_pr.text() );

			//shop_price[id_shop][ id_item ] = inp.attr('value');
			shop_price[id_shop][ img_item ] = parseFloat(inp.attr('value')).toFixed(2);

			if ( shop_transport[ id_shop ] == null ) shop_transport[id_shop] = new Object();

			//td_pr = $("td", tr).eq(8);
			//console.log("TD_PR = " + td_pr.text());
			td_pr = $("td:contains('Себестоимость')",td_pr).next();
			//console.log (td_pr.text());
			shop_transport[id_shop][ img_item ] = parseFloat(td_pr.text().replace('$', '').replace(' ','').replace(' ','').replace(' ',''));
		}

			if (inp_sale.length>0) {
			ToStorage('shop_price', shop_price);
			ToStorage('shop_transport', shop_transport);
			flag_save = true;
		}
		// Видимо это не наше подразделение
		//if (flag_save == false) return false;
		if (flag_save == false) {
		inp_sale = $("td[align='right'][class='nowrap']:contains('$')");
		//var td_sale = $("input[name*='productData[price]']").parent().prev();
		for (i=0; i<inp_sale.length; i++) {
			inp = inp_sale.eq(i);
			//var td_pr = td_sale.eq(i);
			tr = inp.parent();

			//var href = $("a[href*='by_trade_at_cities']", tr);
			//if (href.attr('href') == null) continue;
			//var id_item = /(\d+)/.exec( href.attr('href') )[0];
			img = $("img[src*='/img/products']", tr);
			img_item = img.attr('src');
			//console.log (id_item);

			if (shop_price[id_shop] == null) shop_price[id_shop] = new Object();

			//console.log( "www " + td_pr.text() );

			//shop_price[id_shop][ id_item ] = inp.attr('value');
			shop_price[id_shop][ img_item ] = inp.text().replace('$', '').replace(' ','').replace(' ','').replace(' ','');

			//if ( shop_transport[ id_shop ] == null ) shop_transport[id_shop] = new Object();

			//td_pr = $("td", tr).eq(8);
			//console.log("TD_PR = " + td_pr.text());
			//shop_transport[id_shop][ id_item ] = parseFloat( td_pr.text().replace('$', '').replace(' ','').replace(' ','').replace(' ','') );
		}
		}
			if (inp_sale.length>0) {
			ToStorage('shop_price', shop_price);
			ToStorage('shop_transport', shop_transport);
			flag_save = true;
		}
		}

		if (title.search('unit-header-network')!=-1) {
		inp_sale = $("input[name*='[price]']");
		//var td_sale = $("td:contains('$')");
		//td_sale = $("input[name*='[price]']").parent().prev().prev().prev();
		//console.log(inp_sale);
		for (i=0; i<inp_sale.length; i++) {
			inp = inp_sale.eq(i);
			//td_pr = td_sale.eq(i);
			//tr = inp.parent().parent();

			//href = $("a[href*='by_trade_at_cities']", tr);
			//if (href.attr('href') == null) continue;
			//id_item = /(\d+)/.exec( href.attr('href') )[0];
			id_item = "Трафик";
			//img = $("img[src*='/img/products']", tr);
			//img_item = img.attr('src');
			//console.log (img_item);

			if (shop_price[id_shop] == null) shop_price[id_shop] = new Object();

			//console.log( "www " + td_pr.text() );

			shop_price[id_shop][ id_item ] = inp.attr('value');
			//shop_price[id_shop][ img_item ] = inp.attr('value');

			//if ( shop_transport[ id_shop ] == null ) shop_transport[id_shop] = new Object();

			//td_pr = $("td", tr).eq(8);
			//console.log("TD_PR = " + td_pr.text());
			//td_pr = $("td:contains('Себестоимость')",td_pr).next();
			//console.log (td_pr.text());
			//shop_transport[id_shop][ img_item ] = parseFloat(td_pr.text().replace('$', '').replace(' ','').replace(' ','').replace(' ',''));
		}
			if (inp_sale.length>0) {
			ToStorage('shop_price', shop_price);
			//ToStorage('shop_transport', shop_transport);
			flag_save = true;
		}
		}

		//if (flag_save == false) return false;
		if (title.search('unit-header-cellular')!=-1) {
		//inp_sale = $("input[name*='servicePrice']");
		inp_sale = $("a[href*='service_history']");
		//var td_sale = $("td:contains('$')");
		//td_sale = $("input[name*='[price]']").parent().prev().prev().prev();
		//console.log(inp_sale);
		for (i=0; i<inp_sale.length; i++) {
			inp = inp_sale.eq(i);
			//td_pr = td_sale.eq(i);
			//tr = inp.parent().parent();

			//href = $("a[href*='by_trade_at_cities']", tr);
			//if (href.attr('href') == null) continue;
			//id_item = /(\d+)/.exec( href.attr('href') )[0];
			id_item = "Трафик";
			//img = $("img[src*='/img/products']", tr);
			//img_item = img.attr('src');
			//console.log (img_item);

			if (shop_price[id_shop] == null) shop_price[id_shop] = new Object();

			//console.log( "www " + td_pr.text() );

			shop_price[id_shop][ id_item ] = inp.text().replace('$', '').replace(' ','').replace(' ','').replace(' ','');
			//shop_price[id_shop][ img_item ] = inp.attr('value');

			//if ( shop_transport[ id_shop ] == null ) shop_transport[id_shop] = new Object();

			//td_pr = $("td", tr).eq(8);
			//console.log("TD_PR = " + td_pr.text());
			//td_pr = $("td:contains('Себестоимость')",td_pr).next();
			//console.log (td_pr.text());
			//shop_transport[id_shop][ img_item ] = parseFloat(td_pr.text().replace('$', '').replace(' ','').replace(' ','').replace(' ',''));
		}
			if (inp_sale.length>0) {
			ToStorage('shop_price', shop_price);
			//ToStorage('shop_transport', shop_transport);
			flag_save = true;
		}

		// Видимо это не наше подразделение
		//if (flag_save == false) return false;
		if (flag_save == false) {
		inp_sale = $("td:contains('$')");
		//console.log(inp_sale);
		//var td_sale = $("input[name*='productData[price]']").parent().prev();
		for (i=0; i<inp_sale.length; i++) {
			inp = inp_sale.eq(i);
			//var td_pr = td_sale.eq(i);
			//tr = inp.parent();

			//var href = $("a[href*='by_trade_at_cities']", tr);
			//if (href.attr('href') == null) continue;
			//var id_item = /(\d+)/.exec( href.attr('href') )[0];
			id_item = "Трафик";
			//img = $("img[src*='/img/products']", tr);
			//img_item = img.attr('src');
			//console.log (id_item);

			if (shop_price[id_shop] == null) shop_price[id_shop] = new Object();

			//console.log( "www " + td_pr.text() );

			//shop_price[id_shop][ id_item ] = inp.attr('value');
			//inp = inp.text().replace(' за минуту разговора','').replace('$', '').replace(' ','').replace(' ','').replace(' ','');
			shop_price[id_shop][ id_item ] = inp.text().replace(' за минуту разговора','').replace('$', '').replace(' ','').replace(' ','').replace(' ','');

			//if ( shop_transport[ id_shop ] == null ) shop_transport[id_shop] = new Object();

			//td_pr = $("td", tr).eq(8);
			//console.log("TD_PR = " + td_pr.text());
			//shop_transport[id_shop][ id_item ] = parseFloat( td_pr.text().replace('$', '').replace(' ','').replace(' ','').replace(' ','') );
		}
			if (inp_sale.length>0) {
			ToStorage('shop_price', shop_price);
			//ToStorage('shop_transport', shop_transport);
			flag_save = true;
		}
		}
		}

		shop_time[ id_shop ] = today ;
		//console.log(flag_save);

		ToStorage('shop_time', shop_time);

		$("#jsinfo").html("Статус: " + out );
		return true;
	}

	function View() {
		out = "LocalStorage:<br>";

		// выводим все что было в локальном хранилище по данному магазину
		out += "id = " + id_shop + "<br>";
		out += "market = " + getFromStorage(market, id_shop) + "<br>";
		out += "shop_price = " + getFromStorage(shop_price, id_shop) + "<br>";
		out += "shop_transport =" + getFromStorage(shop_transport, id_shop) + "<br>";
		out += "shop_time =" + getFromStorage(shop_time, id_shop) ;

		$("#jsinfo").html( out );
	}

	function Clear() {
		out = "Локальное хранилище очищено";
		// выводим все что было в локальном хранилище
		for (var i=0; i<localStorage.length; i++) {
			localStorage.removeItem(localStorage[i]);
		//localStorage.removeItem('market');
		//localStorage.removeItem('shop_price');
		//localStorage.removeItem('shop_transport');
		//localStorage.removeItem('shop_time');
		}
		$("#jsinfo").html( out );
	}

	// Идентификатор подразделения
	var id_shop = /(\d+)/.exec(location.href)[0];

	// Время обнолвения данных о ценах
	var shop_time = JSON.parse( window.localStorage.getItem('shop_time') );
	if (shop_time == null) shop_time = new Object();

	var d = new Date();
	var today = d.getFullYear() + "." + d.getMonth() + "." + d.getDate();

	// Объем рынка
	var market = JSON.parse( window.localStorage.getItem('market') );
	if (market == null) market = new Object();

	// Цена продажи
	var shop_price = JSON.parse( window.localStorage.getItem('shop_price') );
	if (shop_price == null) shop_price =new Object();

	// Цена в магазине
	var shop_transport = JSON.parse( window.localStorage.getItem('shop_transport') );
	if ( shop_transport == null ) shop_transport = new Object();

	//console.log("End main");
	var rc = Save();
	// Если это не магазин, то и кнопки нам не нужны
	// а если и магазин без товара, то кнопки тоже не нужны
	// кнопки
	 var save = $('<button id=bsave>Сохранить</button>').click(function() {
		Save();
	});
	 var view = $('<button id=bview>Просмотр</button>').click(function() {
		View();
	});
	 var clear = $('<button id=bview>Очистка хранилища</button>').click(function() {
		Clear();
	});
	var out = '<td><span id=jsinfo style="color:yellow"></span>';
	//var container = $('#topblock');
	//var container = $('div.metro_header');
	//var container = $('#childMenu');
	//container.append( $('<table><tr><td>').append("<font color=white>Локальное хранилище: </font>").append(save) .append('<td>').append(view) .append('<td>').append(clear).append(out) );

	if (rc == true) return;
	Save();
	//alert("end");
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}