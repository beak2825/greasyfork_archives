// ==UserScript==
// @name        Virtomomica: IC
// @namespace   virtonomica
// @description Индикативные цены - автопарсинг и отображение на вкладке "Сбыт"
// @match       http*://virtonomica.ru/*/main/unit/view/*/sale*
// @version     2.2
// @author      UnclWish
// @downloadURL https://update.greasyfork.org/scripts/25648/Virtomomica%3A%20IC.user.js
// @updateURL https://update.greasyfork.org/scripts/25648/Virtomomica%3A%20IC.meta.js
// ==/UserScript==
var run = function() {
	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	var $ = win.$;
	//---------------------------------------------------------------------
	// работа с локальным хранилищем
	//---------------------------------------------------------------------
	/**
	* записать данные в локальнео хранилище, с проверкой ошибок
	*/
	function ToStorage(name, val)
	{
	    try {
	       window.localStorage.setItem(name, JSON.stringify(val));
	    } catch(e) {
	       var out = "Ошибка добавления в локальное хранилище";
	       console.log(out);
	    }
	}

	//---------------------------------------------------------------------
	// end of работа с локальным хранилищем
	//---------------------------------------------------------------------
	var wc_info = $("<div id=p_info></div>");
	var ic_info = $("<div id=ic_info></div>");

	// Проверим ссылку что это игровое поле
	var href = location.href;
	var realm = href.replace('https://virtonomica.ru/','');
	realm = realm.substr(0,4);
	var country = $("div.title a[href*='/main/geo/regionlist/']").attr('href');
	country = /(\d+)/.exec(country)[0];
	var tm_info_link = `https://virtonomica.ru/${realm}/window/globalreport/tm/info`;
    var tm_api_link = `https://virtonomica.ru/api/${realm}/main/brandname/browse?pagesize=10000`;
	var ic_info_link = `https://virtonomica.ru/api/${realm}/main/geo/country/duty?app=adapter_vrt&format=html&country_id=423475&sort=category_name%2Fasc%2Cproduct_name%2Fasc&tpl=geo%2Fcountry%2Fduty`;
	var ic_api_link = `https://virtonomica.ru/api/${realm}/main/geo/country/duty?country_id=${country}`;

	var a1=$('div.title').text().trim();
	if (a1.indexOf("Офис") == -1 ) return; //Выход если главная страница не нашей компании

	var title=$('#wrapper > div.metro_header > div > div.picture').attr('class');
	if (title.search('unit-header-network') != -1) return; // Выход если Сеть коммуникационных вышек

	//console.log( href );
	/*if (href.indexOf('countrydutylist') > 0) {
		//console.log('parsing....');
		var wc_parsing = $("<li><div id=parsing style='float:left;cursor:pointer; color: white;'> <img title='Запомнить ИЦ' alt='Запомнить ИЦ' src='http://www.iconsearch.ru/uploads/icons/snowish/32x32/document-save-as.png'> </div>");

		//var container = $('#topblock').next();
        var container = $('li.la').parent();
		//container = $("li:last", container).prev().parent();
        container.append( wc_parsing ) ;

		$("table.list").before( wc_info );

		$("#parsing").click( function() {
			var ic_array = new Object();

			var table = $("table.list");
			//console.log('table = ' + table.length);
			var tr = $("tr.odd, tr.even", table);
			//console.log('tr = ' + tr.length);
			for (var i=0; i<tr.length; i++){
				var td = $("td > img", tr.eq(i) );
				//console.log('td = ' + td.length);
				for(var j=0; j< td.length; j++){
					var src = td.eq(j).attr('src');
					//console.log( src );
					var name = td.eq(j).parent().next().text();
					//alert (name);
                    //console.log( name );
					var ic = td.eq(j).parent().next().next().next().next().text();
					ic = parseFloat( ic.replace('$', '').replace(' ', '').replace(' ', '').replace(' ', '') );
					//console.log( ic );
					ic_array[ src ] = new Object();
					ic_array[ src ].name = name;
					ic_array[ src ].ic = ic;
				}

			}

			//console.log( JSON.stringify( ic_array ) );
			ToStorage('ic_array', ic_array );
			$("#p_info").html("Запомнили значения ИЦ").css('color', 'green');

		});
	}*/

	function num(num, x){
		num = num.toFixed(2);
		var parts = num.split('.');
		parts[0] = parts[0].substr(0, parts[0].length%3)+parts[0].substr(parts[0].length%3).replace(/(\d{3})/g,' \$1');
        if (parts[0].length%4 == 0) parts[0] = parts[0].slice(1);
        if (x) return parts.join('.');
		else return parts[0];
	}

	function getICArray() {
		var ic_array = new Object();
		$.ajax({
		url: ic_api_link,
		async: false, //то самое плохое место с синхронными запросами. Зато работает без дополнительных проверок. Но лучше избегать, конечно.
		success: function(IC){
					var ICdata = IC.data;
					for (var key in ICdata) {
					var name = ICdata[key].product_name;
					var ic = ICdata[key].min_cost;
					ic_array[name] = new Object();
					//ic_array[code] = new Object();
					ic_array[name].name = name;
					//ic_array[code].code = code;
					ic_array[name].ic = ic;
					//ic_array[code].vals = ic;
				}
			ToStorage('ic_array', ic_array);
		},
		//ajaxError:
		//$("#v_info").append("<br>" + np + " - нет данных по объемам хранения. Если товар не ТМ, сохраните данные на странице по <a href=https://virtonomica.ru/"+realm+"/main/industry/unit_type/info/2011/volume>ссылке</a>").css('color', 'red')
		});
	}

	function getICArray2() {
		var ic_array = new Object();
		$.ajax({
		url: ic_info_link,
		async: false, //то самое плохое место с синхронными запросами. Зато работает без дополнительных проверок. Но лучше избегать, конечно.
		success: function(data){
			var table = $('.table', data);
			//console.log('table = ' + table.length);
			//alert ('table = ' + table.length);
			var tr = $("td", table);
			//console.log('tr = ' + tr.length);
			for (var i=1; i<tr.length; i+=5){
				var th = $(tr.eq(i));
				var td = $(tr.eq(i+3));
				//var img = $("a", tr.eq(i) );
				//var src = img.attr('href');
				//for(var j=0; j< td.length; j++){
					//var code = src.replace('https://virtonomica.ru/'+realm+'/main/product/info/','');
					var name = th.text();
					var ic = td.text();
					var icm = 1;
					if (ic.search('K')>0) icm = 1000;
					if (ic.search('M')>0) icm = 1000000;
					ic = parseFloat(ic.replace('©', '').replace(' ','').replace(' ','').replace(/\u00A0/g, '')) * icm;
					ic = num (ic, false);
					ic_array[name] = new Object();
					//ic_array[code] = new Object();
					ic_array[name].name = name;
					//ic_array[code].code = code;
					ic_array[name].ic = ic;
					//ic_array[code].vals = ic;
				//}
			}
			ToStorage('ic_array', ic_array);
		},
		//ajaxError:
		//$("#v_info").append("<br>" + np + " - нет данных по объемам хранения. Если товар не ТМ, сохраните данные на странице по <a href=https://virtonomica.ru/"+realm+"/main/industry/unit_type/info/2011/volume>ссылке</a>").css('color', 'red')
		});
	}

	function getArrayTM() {
		var arrayTM = new Object();
		$.ajax({
		url: tm_api_link,
		async: false, //то самое плохое место с синхронными запросами. Зато работает без дополнительных проверок. Но лучше избегать, конечно.
		success: function(TM){
				var TMdata = TM.data;
                //console.log(TMdata);
                for (var key in TMdata) {
                var symbolTM = TMdata[key].symbol;
				var nameTM = TMdata[key].name;
                var name = TMdata[key].product_name;
				arrayTM[symbolTM] = new Object();
				//ic_array[code] = new Object();
				arrayTM[symbolTM].name = name;
				//ic_array[code].code = code;
				arrayTM[symbolTM].nameTM = nameTM;
				//ic_array[code].vals = ic;
				}
			ToStorage('arrayTM', arrayTM );
		},
		//ajaxError:
		//$("#v_info").append("<br>" + np + " - нет данных по объемам хранения. Если товар не ТМ, сохраните данные на странице по <a href=https://virtonomica.ru/"+realm+"/main/industry/unit_type/info/2011/volume>ссылке</a>").css('color', 'red')
		});
	}

    function getArrayTMold() {
		var arrayTM = new Object();
		$.ajax({
		url: tm_info_link,
		async: false, //то самое плохое место с синхронными запросами. Зато работает без дополнительных проверок. Но лучше избегать, конечно.
		success: function(data){
	  		//var tmimg_data = $("td>img[src*='/img/products']",data);
            var table = $('#tm-list-browse > div.tm-listing > div:nth-child(1)',data);
            //console.log (table);
            var tmimg_data = $("div[class='item']",data);
			//console.log (tmimg_data);
			//var tm_data = $("td>img[src*='/img/products']",data).parent().next();
			for (var i=0; i<tmimg_data.length; i++) {
				var tm_data = tmimg_data.eq(i).parent().next();
				var code = tmimg_data.eq(i).attr('src');
				//console.log(code);
				var tm_name = tm_data.text();
				tm_name = tm_name.split('\n');
				tm_name = tm_name[2].trim();
				//np = tm_name;
				var name = tm_name;
				//console.log(name);
				arrayTM[name] = new Object();
				arrayTM[code] = new Object();
				arrayTM[name].name = name;
				arrayTM[name].code = code;
				arrayTM[code].name = name;
				}
			ToStorage('arrayTM', arrayTM );
		},
		//ajaxError:
		//$("#v_info").append("<br>" + np + " - нет данных по объемам хранения. Если товар не ТМ, сохраните данные на странице по <a href=https://virtonomica.ru/"+realm+"/main/industry/unit_type/info/2011/volume>ссылке</a>").css('color', 'red')
		});
	}

	function UpdateICStorage() {
		// удаляем данные по объемам хранения и обновляем страницу
		window.localStorage.removeItem('ic_array');
		getICArray();
		location.reload();
	}

	//console.log('start IC');

	var UpdateIC = $('<button id=bsave>Обновить</button>').unbind('click').click(function() {
		UpdateICStorage();
	});

	$("table.grid").before(wc_info);

	$("#p_info").html("Вы можете обновить Индикативные цены, возможно они изменились ").css('color', 'blue').css('font-size', '10pt').append(UpdateIC);

	//  Все остальные страницы
	var ic_array = JSON.parse(window.localStorage.getItem('ic_array'));
	if (ic_array == null ) {
		getICArray();
		ic_array = JSON.parse(window.localStorage.getItem('ic_array'));
	}

	//console.log(arrayTM);
	//console.log(ic_array['Молоко'].ic);


		//$("#p_info").html("Не удалось получить значения ИЦ из локального хранилища").css('color', 'red');
	//} else{
		//$("#p_info").html( JSON.stringify( ic_array ) );
	//}

	// сбыт
	if (href.indexOf('sale') > 0) {

		var table = $("table.grid");

		//var tr = $("tr[class*='even'], tr[class*='odd'], tr[class*='selected']", table);
		var tr = $("tr[class]", table);
		//console.log('tr = ' + tr.length);
		for (var i=0; i<tr.length; i++){
			var td = $("td > a > img", tr.eq(i));
			//console.log (td.length);
            switch (td.length) {
                case 3: td = td.eq(2); break;
                case 2: td = td.eq(1); break;
                default: td = td.eq(0); break;
                }
            //if ( td.length == 2) td = td.eq(1);
			//else td = td.eq(0);

			//console.log("td= " + td.parent().html() );
			var src = td.attr('src');
            var symbol = src.replace('/img/products/','');
            symbol = symbol.replace('.gif','');
			//var id_item = td.parent();
			//var id = /(\d+)/.exec(id_item.attr('href'))[0];
			var name = td.attr('alt');
                //if ((name).slice(-8) == "(устар.)") {name = name.replace(' (устар.)','')};
			//console.log(id, id_item);
            //console.log(name, src, symbol);
            //Брендовые товары
            /*switch (src) {
                case "/img/products/vera/brand/lambardy.gif": src = "/img/products/showercubicle.gif"; break;
                case "/img/products/brand/krakow.gif": src = "/img/products/sausages.gif"; break;
                case "/img/products/vera/brand/abibas.gif": src = "/img/products/shoes.gif"; break;
                case "/img/products/vera/brand/v-times.gif": src = "/img/products/press.gif"; break;
                case "/img/products/vera/brand/0909/pbp.gif": src = "/img/products/instant.gif"; break;
                case "/img/products/vera/brand/vaz2106.gif": src = "/img/products/car.gif"; break;
                case "/img/products/brand/car_sedan_fr1.gif": src = "/img/products/car_sedan.gif"; break;
                case "/img/products/vera/brand/1466876.gif": src = "/img/products/car.gif"; break;
                case "/img/products/vera/brand/1916457.gif": src = "/img/products/sweet.gif"; break;
            }*/
            //console.log (src);
			//console.log(ic_array);
			if (ic_array[name] == null) {
				//console.log('Похоже, ТМ', name);
				var arrayTM = JSON.parse(window.localStorage.getItem('arrayTM'));
				if (arrayTM == null ) {
					//console.log('Обновляем ТМ');
					getArrayTM();
					arrayTM = JSON.parse(window.localStorage.getItem('arrayTM'));
				}
				if (arrayTM[symbol] == null) {
					$("#p_info").append('<br>ИЦ товара "'+name+'" не найдена, возможно новый товар. Обновляем базу ИЦ...').css('color', 'red').css('font-size', '8pt');
					//console.log('А нет, не ТМ', name);
					getICArray();
					ic_array = JSON.parse(window.localStorage.getItem('ic_array'));
					if (ic_array[name] == null) {
						$("#p_info").append('<br>ИЦ товара "'+name+'" не найдена, возможно новый товар с ТМ. Обновляем базу ИЦ ТМ...').css('color', 'red').css('font-size', '8pt');
						//console.log('Обновляем ИЦ', name);
						getArrayTM();
						arrayTM = JSON.parse(window.localStorage.getItem('arrayTM'));
                        name = arrayTM[symbol].name;
                        //console.log(src, name);
					}
				}
				else name = arrayTM[symbol].name;
				//console.log(src, name);
				//$("#p_info").append("<br>" + td.attr('alt') + " - нет данных по ИЦ").css('color', 'red');
				//continue;
			}
			var inp = $("input[name*='[price]']", tr.eq(i));
			//if (inp.length == 3) inp = inp.eq(1);

			//console.log("inp = " + inp.length);
			inp.before( "ИЦ: " + ic_array[name].ic + "©<br>" );
			//td.parent().next().next().next().next().next().before( "ИЦ: " + ic_array[src]['ic'] + "$<br>" );
		}
	}

	//console.log('end IC');
};
if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}