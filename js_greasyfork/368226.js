// ==UserScript==
// @name           Virtonomica:ShopWarehouse
// @namespace      virtonomica
// @version        1.05
// @description    Информация на вкладке "Сбыт" о ценах и доходах магазинов и заправок по товарам на складах и заводах, с которых эти товары закупаются для продажи. Требует для работы установленного скрипта Virtonomica:SaveShopInfo(ShopWarehouse)
// @author         UnclWish
// @include        http*://*virtonomic*.*/*/main/unit/view/*/sale*
// @downloadURL https://update.greasyfork.org/scripts/368226/Virtonomica%3AShopWarehouse.user.js
// @updateURL https://update.greasyfork.org/scripts/368226/Virtonomica%3AShopWarehouse.meta.js
// ==/UserScript==
var run = function()
{
   	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	var $ = win.$;

	//console.log("start");

	function getFromStorage(obj, id_shop, id_item, img_item){
		if (obj[id_shop] == null) return '';
		//if (obj[id_shop][id_item] == null) {
		//	if (obj[id_shop][img_item] == null) return ''};
		if (obj[id_shop][id_item] != null) return obj[id_shop][id_item];
		if (obj[id_shop][img_item] != null) return obj[id_shop][img_item];
		//return obj[id_shop][id_item][img_item];
	}

//----------------------------------------------------
// Данные из локального хранилища

// Закупочная цена в магазинах
var shop_transport = JSON.parse( window.localStorage.getItem('shop_transport') );
if ( shop_transport == null ) shop_transport = new Object();

//Цена продажи в магазинах
var shop_price = JSON.parse( window.localStorage.getItem('shop_price') );
if ( shop_price == null ) shop_price = new Object();

// Дата обновления данных по ценам в магазинах
var shop_time = JSON.parse( window.localStorage.getItem('shop_time') );
if ( shop_time == null ) shop_time = new Object();
//----------------------------------------------------

// Текущая дата
var d = new Date();
var today = d.getFullYear() + "." + d.getMonth() + "." +  d.getDate();


function add_info()
{
	var table = $("#consumerListDiv");
	//console.log(table.length);
	if (table.length == 0) return;

	var a_shop = $("a[href*='main/unit/view']", table);
	//console.log(a_shop.length);
	//console.log(a_shop);
	if (a_shop.length == 0) return;
	//var img1 = $("img.selectedImage");
	//console.log("Selected = " + img1.length);

	//var tr_r = $("tr[id*='row[']", table);
	//console.log("ROW = " + tr_r.length);
	//if (tr_r.length == 0 ) return;

	var th = $("th", table);
	//console.log("th = " + th.length);
	if (th.length > 0) {
		th.eq(4).after("<th><span title='Цена продажи в магазине'>Цена продажи</span><hr><span title='Разница между ценой продажи и закупочной ценой'>Прибыль</span>");
	}

	//var str = tr_r.eq(0).attr('id');

	var title=$('#wrapper > div.metro_header > div > div.picture').attr('class');

	if (title.search('unit-header-network') == -1) {
	for (var i=0; i< a_shop.length; i+=2) {
	//for(var i=0; i< a_shop.length-1; i++){
	var shop = a_shop.eq(i+1);
	var str = shop.parent().parent().attr('id');
	//var str = tr_r.eq(i).attr('id');
	//console.log("ITEM = " + str );
	//var img = $("img.selectedImage").eq(0).parent();
	//var id_item = /sale\/product\/(\d+)/.exec(img.attr('href'))[0];
	var id_item = /(\d+)/.exec( str )[0];
	var str2 = shop.parent().parent().prevAll(":has(.title)").first();
	//console.log(str2);
	str2 = $("img[src*='/img/products']", str2);
	//console.log(str2);
	var img_item = str2.attr('src');
	//console.log(img_item);
	//console.log("ITEM = " + id_item );

		var id_shop = /(\d+)/.exec(shop.attr('href'))[0];
		//console.log(id_shop);

		var color = "";
		var saveday = new Date();
		//var d = new Date(year, month, day, hours, minutes, seconds, milliseconds);
		if (shop_time[id_shop] != null){
			if ( today != shop_time[id_shop]) {
				color= "";
				var res = /(\d+)\.(\d+)\.(\d+)/.exec( shop_time[id_shop] );
				var year = res[1];
				var month = res[2];
				var day = res[3];
				if ( (year != null) && (month != null) && (day != null) ){
					saveday.setFullYear(year,month,day);
					var delta = Math.floor( (d.getTime() - saveday.getTime() )/1000/60/60/24);
					if (delta >2) {
						if (delta < 6) {
							color = "gray";
						} else if (delta <12) {
							color = "darkkhaki";
						} else if (delta <21) {
							color = "orange";
						} else if (delta <28) {
							color = "purple";
						} else if (delta <35) {
							color = "maroon";
						} else {
							color = "red";
						}
					}
				}

			}
		}

		var out = "&nbsp;";
		if (shop_price[id_shop] != null){
			//console.log(shop_price[id_shop]);
			if (shop_price[id_shop][id_item] != null){
				//console.log(shop_price[id_shop][id_item]);
				out += "<span title='" + saveday.toLocaleDateString() + "'>";
				if (color != "") {
					out += "<font color=" + color + ">";
				}
				out += shop_price[id_shop][id_item];
				if (color != "") {
					out += "</font>";
				}
				out += " </span>";
				//console.log("shop =  " + id_shop);
				//console.log("price =  " + shop_price[id_shop][id_item]);

				if (shop_transport[id_shop] != null){
					if (shop_transport[id_shop][id_item] != null){
						del = shop_price[id_shop][id_item] - shop_transport[id_shop][id_item];
						if (del >0) color = "green";
						else color = "red";
						var del = Math.round(del*100)/100;
						out += "<br><font color=" + color + ">" + del + "</font>" ;
					}
				}

			}
			if ((shop_price[id_shop][id_item] == null)&(shop_price[id_shop][img_item] != null)){
				//console.log(shop_price[id_shop][img_item]);
				out += "<span title='" + saveday.toLocaleDateString() + "'>";
				if (color != "") {
					out += "<font color=" + color + ">";
				}
				out += shop_price[id_shop][img_item];
				if (color != "") {
					out += "</font>";
				}
				out += " </span>";
				if (shop_transport[id_shop] != null){
					if (shop_transport[id_shop][img_item] != null){
						del = shop_price[id_shop][img_item] - shop_transport[id_shop][img_item];
						if (del >0) color = "green";
						else color = "red";
						del = Math.round(del*100)/100;
						out += "<br><font color=" + color + ">" + del + "</font>" ;
					}
				}
			}
		}

		shop.parent().after("<td align=center>" + out);
	}
	}
	else {
	for (i=0; i< a_shop.length; i+=2) {
	//for(var i=0; i< a_shop.length-1; i++){
	shop = a_shop.eq(i+1);
	//var str = shop.parent().parent().attr('id');
	//console.log(shop);
	id_item = "Трафик";

		id_shop = /(\d+)/.exec(shop.attr('href'))[0];

		color = "";
		saveday = new Date();
		//var d = new Date(year, month, day, hours, minutes, seconds, milliseconds);
		if (shop_time[id_shop] != null){
			if ( today != shop_time[id_shop]) {
				color= "";
				res = /(\d+)\.(\d+)\.(\d+)/.exec( shop_time[id_shop] );
				year = res[1];
				month = res[2];
				day = res[3];
				if ( (year != null) && (month != null) && (day != null) ){
					saveday.setFullYear(year,month,day);
					delta = Math.floor( (d.getTime() - saveday.getTime() )/1000/60/60/24);
					if (delta >2) {
						if (delta < 6) {
							color = "gray";
						} else if (delta <12) {
							color = "darkkhaki";
						} else if (delta <21) {
							color = "orange";
						} else if (delta <28) {
							color = "purple";
						} else if (delta <35) {
							color = "maroon";
						} else {
							color = "red";
						}
					}
				}

			}
		}

		out = "&nbsp;";
		if (shop_price[id_shop] != null){
			//console.log(shop_price[id_shop]);
			if (shop_price[id_shop][id_item] != null){
				//console.log(shop_price[id_shop][id_item]);
				out += "<span title='" + saveday.toLocaleDateString() + "'>";
				if (color != "") {
					out += "<font color=" + color + ">";
				}
				out += shop_price[id_shop][id_item];
				if (color != "") {
					out += "</font>";
				}
				out += " </span>";
				//console.log("shop =  " + id_shop);
				//console.log("price =  " + shop_price[id_shop][id_item]);

			}
		}

		shop.parent().after("<td align=center>" + out);
	}
	}

	// модифицирем стрелки вврех и вниз, что бы сохранить науш информацию
	var link = $("a[onclick*='return changeContractPosition']");
	link.click(function(){
		add_info();
	});

	// модифицирем перескоки сразу на заданную позиицю, что бы сохранить науш информацию
	var link2 = $("img[id*='posistionsave']");
	link2.click(function(){
		add_info();
	});

	// заменяем ссылки на магазины ссыдками на торговые залы магазинов
	// http://virtonomica.ru/vera/main/unit/view/4135337
	// http://virtonomica.ru/vera/main/unit/view/4135337/trading_hall
	var shop_link = $("a[href*='main/unit'][onclick='return doWindow(this.href)'] > img").parent().parent().next();
	var link_img = $("a[href*='main/unit'][onclick='return doWindow(this.href)'] > img");
	shop_link = $("a[href*='main/unit']", shop_link);
	//console.log(shop_link);
	//console.log(link_img);
	for (i=0; i< shop_link.length; i++){
		var alink = shop_link.eq(i);
		var ilink = link_img.eq(i);
		//if (ilink.attr('src') == "/img/1.gif")
		//	alink = shop_link.eq(i+1);
		//i = i + 1;
		//console.log(alink.attr('href'));
		//console.log(alink.attr('href'));
        //var llink = alink.attr('href');
        //var title = "";
        //if (llink.indexOf('product') ==-1)
        	//$.get(llink, function(data){
        	//var title2 = JSON.parse(title);
        	//$('#wrapper > div.metro_header > div > div.picture',data);
        	//var title = $("div > div > div", data).attr('class');
        	//title = $(data)});
        	//console.log(data);
        	//llink = alink.attr('href');
			//title = ""
        	//if ((data.indexOf('unit-header-shop')!=-1) || (data.indexOf('unit-header-fuel')!=-1))
        	//if (llink.indexOf('trading_hall') ==-1)
        	//title = "/trading_hall";
        	//console.log (title);
            //});
        //console.log (title);
        //alink.attr('href', alink.attr('href')+ '/trading_hall' );
		//if (title == "/trading_hall")
		if ((ilink.attr('src') == "/img/unit_types/24/shop.gif") || (ilink.attr('src') == "/img/unit_types/24/fuel.gif"))
		alink.attr('href', alink.attr('href')+ '/trading_hall' );
	}
}

add_info();

};

if (window.top == window) {
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);
}