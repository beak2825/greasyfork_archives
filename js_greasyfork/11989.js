// ==UserScript==
// @name           Virtonomica:Снабжение
// @namespace      virtonomica
// @version        1.893
// @description    Добавление расширенной функциональности вкладки Снабжение
// @author         UnclWish
// @include        http*://*virtonomic*.*/*/main/unit/view/*
// @include        http*://*virtonomic*.*/*/main/unit/view/*/supply
// @downloadURL https://update.greasyfork.org/scripts/11989/Virtonomica%3A%D0%A1%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/11989/Virtonomica%3A%D0%A1%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5.meta.js
// ==/UserScript==

(function() {
	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	var $ = win.$;
	var timeout;
	var delay = 325;//задержка в милисекундах обновления показателей во время ввода
	var txt = [],
		ko = [],
		scl = [],
		txt1 = [],
		//prc = 0;
		i = 0,
		j = 0,
		closespan = '<span r="windkol" class="closeform" style="float:right;margin-right:10px;color:#f00;font-size:14pt;cursor:pointer;">&#215;</span>',
		p1 = -1,
		p2 = -1,
		form = false;

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

	// Проверяем, нужная ли страница
	//var title=$('#wrapper > div.metro_header > div > div.picture').attr('class');
    //var title=$('#wrapper > div.metro_header > div.headern.office > div.content > div.bg-image').attr('class');
    var title=$('#wrapper > div.metro_header > div.headern.office > div.picture').attr('class');
    //console.log (title);
	var a1=$('div.title').text().trim();
	var href = location.href;
    if ((href).slice(-1)=="#") href = (href).slice(0,-1);
    if ((href).slice(-3)=="old") href = (href).slice(0,-4);
	var a2=(href).slice(-4);

	//console.log(a1);
	if (a1.indexOf("Офис") == -1) return; //Выход если главная страница не нашей компании.
	//	if ((href.indexOf('sale') > 0) & (title.search('unit-header-warehouse') == -1)) return
	//	if ((href.indexOf('sale') == -1) & (title.search('unit-header-warehouse') == -1)) return};

	//console.log(a2);
	if (isNaN(a2) & a2 != "pply") return; //Выход если не главная страница или продажа

	$(document).ready(function() {

	var wc_info = $("<div id=v_info></div>");

	// Идентификатор подразделения
	var id_shop = /(\d+)/.exec(location.href)[0];
	// Ссылки
	var realm = href.replace('https://virtonomica.ru/','');
	realm = realm.substr(0,4);
	var vl_info_link = `https://virtonomica.ru/${realm}/main/industry/unit_type/info/2011/volume`;
	var tm_info_link = `https://virtonomica.ru/${realm}/window/globalreport/tm/info`;
	var link_api = `https://virtonomica.ru/api/${realm}/main/unit/summary?id=${id_shop}`;
	//console.log(link_api);

	//if ((title.search('unit-header-shop') != -1) || (title.search('unit-header-fuel') != -1))
	function getUnitSizeMain() {
		if (title.search('fuel')!=-1) {
		var size = parseInt($("td.title:contains('Размер') ~ td > div").text().replace(/ /g,'').replace('колонок',''));
		var sizename = $("td.title:contains('Размер') ~ td > div").text();}
		if (title.search('bgunit-shop')!=-1) {
		size = parseInt($("td:contains('Торговая площадь')").next().text().replace(/ /g,'').replace('м','').slice(0,-1));}
		//console.log(size);
		unit_sizes_array[id_shop] = new Object();
		unit_sizes_array[id_shop].size = size;
		//console.log(unit_sizes_array[id_shop].size);

		ToStorage('unit_sizes_array', unit_sizes_array);
		}

	if (!(isNaN(a2))) {
		if ((title.search('bgunit-shop') != -1) || (title.search('bgunit-fuel') != -1)) {
		//$.get(new_url, function (sizedata) {
		var unit_sizes_array = JSON.parse(window.localStorage.getItem('unit_sizes_array'));
	  	if (unit_sizes_array == null) unit_sizes_array = new Object();
		getUnitSizeMain();
		return;
		}}

	function getUnitSize() {
		$.ajax({
		url: link_api,
	    cache: false,
		async: false, //то самое плохое место с синхронными запросами. Зато работает без дополнительных проверок. Но лучше избегать, конечно.
		success: function(unitsummarydata) {
			unit_sizes_array[id_shop] = new Object();
			unit_sizes_array[id_shop].size = unitsummarydata.trading_square;

			ToStorage('unit_sizes_array', unit_sizes_array);
		},
		//ajaxError:
		//$("#v_info").append("<br>" + np + " - нет данных по объемам хранения. Если товар не ТМ, сохраните данные на странице по <a href=https://virtonomica.ru/"+realm+"/main/industry/unit_type/info/2011/volume>ссылке</a>").css('color', 'red')
		});
	}

	function getValsArray() {
		var vals_array = new Object();
		$.ajax({
		url: vl_info_link,
		async: false, //то самое плохое место с синхронными запросами. Зато работает без дополнительных проверок. Но лучше избегать, конечно.
		success: function(data){
			var table = $("tbody", data);
			//console.log('table = ' + table.length);
            //console.log(table);
			//alert ('table = ' + table.length);
			var tr = $("tr", table);
			//console.log('tr = ' + tr.length);
			for (var i=0; i<tr.length; i++){
				var th = $("td>span[class='item volume-cont']>button>span>i", tr.eq(i) );
                //console.log(th);
				var td = $("td>span[class='item volume-cont']>span", tr.eq(i) );
				//var img = $("a", tr.eq(i) );
				//var src = img.attr('href');
                var src = $("td>span[class='item volume-cont']>button", tr.eq(i) );
                //console.log(src);
				for(var j=0; j< td.length; j++){
                    //src.slice(0,src.lastIndexOf('&'));
                    var srca = src.eq(j).attr('data-link');
                    var srcb = srca.split('&');
					var code = srcb[0].replace('https://virtonomica.ru/api/'+realm+'/main/product/info?id=','');
					var name = th.eq(j).attr('data-content');
					var vals = td.eq(j).text();
					//vals = parseFloat(vals.replace('$', '').replace(' ', '').replace(' ', '').replace(' ', ''));
                    vals = parseFloat(vals.replace(/\u00A0/g, ''));
                    vals_array[name] = new Object();
					vals_array[code] = new Object();
					vals_array[name].name = name;
					vals_array[code].code = code;
					vals_array[name].vals = vals;
					vals_array[code].vals = vals;
				}
			}
			ToStorage('vals_array', vals_array);
		},
		//ajaxError:
		//$("#v_info").append("<br>" + np + " - нет данных по объемам хранения. Если товар не ТМ, сохраните данные на странице по <a href=https://virtonomica.ru/"+realm+"/main/industry/unit_type/info/2011/volume>ссылке</a>").css('color', 'red')
		});
	}

	function UpdateValsStorage() {
		// удаляем данные по объемам хранения и обновляем страницу
		window.localStorage.removeItem('vals_array');
		getValsArray();
		//location.reload();
	}

//----------------------------------------------------------------

	function num(num, x){
		num = num.toFixed(2);
		var parts = num.split('.');
		    parts[0] = parts[0].substr(0, parts[0].length%3)+parts[0].substr(parts[0].length%3).replace(/(\d{3})/g,' \$1');
            if (parts[0].length%4 === 0) parts[0] = parts[0].slice(1);
            if (x) return parts.join('.');
		else return parts[0];
		}
	function Calculate1(n){
		$('.divtemp').text('');
		var c = parseInt($('#sc').val()),
			c1 = parseInt($('#sc1').val()),
			x1 = 0,
			x2 = 0,
			k = parseFloat($('#sk').val()),
			k1 = parseFloat($('#sk1').val()),
			k2 = parseFloat($('#sk2').val()),
			k3 = parseFloat($('#sk3').val()),
			cn1 = 0,
			cn2 = parseFloat($('#scn2').val()),
			cn3 = parseFloat($('#scn3').val());
		x1 = Math.round(f1(c, c1, k, k1, k2, k3));
		x2 = Math.round(f1(c, c1, k, k1, k3, k2));
		cn1 = f3(c, c1, x1, x2, cn2, cn3).toFixed(2);

		if($('#svo').attr('checked')){
			if(x1 > txt[p1].max){
				x1 = txt[p1].max;
				c1 = Math.round(f2(c, x1, k, k1, k2, k3));
				x2 = Math.round(f1(c, c1, k, k1, k3, k2));
				cn1 = f3(c, c1, x1, x2, cn2, cn3).toFixed(2);
			}
			if(x2 > txt[p2].max){
				x2 = txt[p2].max;
				c1 = Math.round(f2(c, x2, k, k1, k3, k2));
				x1 = Math.round(f1(c, c1, k, k1, k2, k3));
				cn1 = f3(c, c1, x1, x2, cn2, cn3).toFixed(2);
			}
			$('#sc1').val(c1);
		}

		$('#sx1').val(x1);
		$('#sx2').val(x2);
		$('#scn1').val(cn1);

		$('#cenacach').text((cn1 / k1).toFixed(2));
		$('#cenacach1').text((cn2 / k2).toFixed(2));
		$('#cenacach2').text((cn3 / k3).toFixed(2));
		$('#divtemp'+p1).html('<a class="aaddsp1" href="#">_+_</a> <a class="aadds1" href="#">'+x1+'</a>');
		$('#divtemp'+p2).html('<a class="aaddsp2" href="#">_+_</a> <a class="aadds2" href="#">'+x2+'</a>');
		$('.aadds1').unbind('click').click(function(){
			var col = $(this).text();
            if (col > txt[p1].max) col = txt[p1].max;
            if ($(this).closest('tr').attr('class').substr(0,3)=="odd")
            var name = $(this).closest('tr').attr('class').substr(4,4);
            else
                if ($(this).closest('tr').attr('class').substr(0,3)=='eve')
					name = $(this).closest('tr').attr('class').substr(5,4);
			$(this).parent().next().val(col);
			if(n === 0) updatetable(8);
			if(n == 1) updatetablepr(7);
			if(n == 2) updatetablesk(name);
			return false;
		});
		$('.aadds2').unbind('click').click(function(){
			var col = $(this).text();
            if (col > txt[p2].max) col = txt[p2].max;
            if ($(this).closest('tr').attr('class').substr(0,3)=="odd")
            var name = $(this).closest('tr').attr('class').substr(4,4);
            else
                if ($(this).closest('tr').attr('class').substr(0,3)=='eve')
                name = $(this).closest('tr').attr('class').substr(5,4);
			$(this).parent().next().val(col);
			if(n === 0) updatetable(8);
			if(n == 1) updatetablepr(7);
			if(n == 2) updatetablesk(name);
			return false;
		});

		$('.aaddsp1').unbind('click').click(function(){
			var col = parseInt($(this).next().text());
			var col1 = parseInt($(this).parent().next().val());
			var colo = parseInt(col + col1);
            if (colo > txt[p1].max) colo = txt[p1].max;
            if ($(this).closest('tr').attr('class').substr(0,3)=="odd")
            var name = $(this).closest('tr').attr('class').substr(4,4);
            else
                if ($(this).closest('tr').attr('class').substr(0,3)=='eve')
                name = $(this).closest('tr').attr('class').substr(5,4);
			$(this).parent().next().val(colo);
			if(n === 0) updatetable(8);
			if(n == 1) updatetablepr(7);
			if(n == 2) updatetablesk(name);
			return false;
		});
		$('.aaddsp2').unbind('click').click(function(){
			var col = parseInt($(this).next().text());
			var col1 = parseInt($(this).parent().next().val());
			var colo = parseInt(col + col1);
            if (colo > txt[p2].max) colo = txt[p2].max;
            if ($(this).closest('tr').attr('class').substr(0,3)=="odd")
            var name = $(this).closest('tr').attr('class').substr(4,4);
            else
                if ($(this).closest('tr').attr('class').substr(0,3)=='eve')
                name = $(this).closest('tr').attr('class').substr(5,4);
			$(this).parent().next().val(colo);
			if(n === 0) updatetable(8);
			if(n == 1) updatetablepr(7);
			if(n == 2) updatetablesk(name);
			return false;
		});
	}
	function fillArray( summ, cach, max ) {
		this.summ = summ;
		this.cach = cach;
		this.max = max;
	}
	function add(id,prod,ar){
		if(prod==1){
			$('#sk2').val(ar[id].cach);
			$('#scn2').val(ar[id].summ);
			p1 = id;
		}
		if(prod==2){
			$('#sk3').val(ar[id].cach);
			$('#scn3').val(ar[id].summ);
			p2 = id;
		}
	}
	function print_r(arr, level) {
		var print_red_text = "";
		if(!level) level = 0;
		var level_padding = "";
		for(var j=0; j<level+1; j++) level_padding += "    ";
		if(typeof(arr) == 'object') {
			for(var item in arr) {
				var value = arr[item];
				if(typeof(value) == 'object') {
					print_red_text += level_padding + "'" + item + "' :\n";
					print_red_text += print_r(value,level+1);
			}
				else
					print_red_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}

		else  print_red_text = "===>"+arr+"<===("+typeof(arr)+")";
		return print_red_text;
	}
	function f1(c, c1, k, k1, k2, k3){
			var x1 = (c1 * (k1 - k3) - c * (k - k3)) / (k2 - k3);
		return x1;
	}
	function f2(c, x1, k, k1, k2, k3){
			var c1 = (x1 * (k2 - k3) + c * (k1 - k3)) / (k1 - k3);
		return c1;
	}
	function f3(c, c1, x1, x2, s1, s2){
			var s = (s1 * x1 + s2 * x2) / (c1 - c);
		return s;
	}
	function addar(col, summ, cach, brend, max, sc, name, id ) {
		this.col = col;
		this.summ = summ;
		this.cach = cach;
		this.brend = brend;
		this.max = max;
		this.ck = parseFloat((this.summ / this.cach).toFixed(2));
		this.sc = parseFloat(sc) || 0;
		this.name = name || '';
		this.id = id || 0;
	}
	function nullpr(x){
		if(isNaN(x)) x = 0;
		return x;
	}

	if (title.search('bgunit-shop')!=-1 || title.search('fuel')!=-1){
		//console.log(title);
		form = true;

		var addtablemax = function (ar, table, t){
			var cf=0, kf=0, cnf=0, cnkf=0, bf=0, b=false;
			for(i=0; i<ar.length; i++){
                if(ar[i].col > ar[i].max){
					cf += parseInt(ar[i].max);
                    if(ar[i].col>0) b = true;}
                else
					cf += parseInt(ar[i].col);
			}
			if(cf !== 0){
				for(i=0; i<ar.length; i++){
					if(ar[i].col > ar[i].max){
						kf += parseFloat(ar[i].cach * ( ar[i].max / cf ));
						cnf += parseFloat(ar[i].summ * ( ar[i].max / cf ));
						bf += parseFloat(ar[i].brend * ( ar[i].max / cf ));
						b = true;
					}else{
						kf += parseFloat(ar[i].cach * ( ar[i].col / cf ));
						cnf += parseFloat(ar[i].summ * ( ar[i].col / cf ));
						bf += parseFloat(ar[i].brend * ( ar[i].col / cf ));
					}
				}
                cnkf = cnf / kf;
				if(isNaN(kf)){
					kf = 0;
					cnf = 0;
					bf = 0;
					cnkf = 0;
					}
			}
            //if((kf===0) || (isNaN(kf))) kf=1;
            if(b){
				table.closest('td').css('background-color','#fee');
				var n = 0;
				$('tr', table).each( function() {
					var cels = $('td', this);
					//if(n == 0)	$(cels[1]).append(num(cf, false));
					//if(n == 1)	$(cels[1]).append(kf.toFixed(2)+'<span title="Цена за единицу качества (Ц/К) с учетом запасов">($'+cnkf.toFixed(2)+')</span>');
					//if(n == 2 && t == 0)	$(cels[1]).append(bf.toFixed(2));
					//if(n == 3 && t == 0)	$(cels[1]).append('$'+num(cnf, true));
					//if(n == 2 && t == 1)	$(cels[1]).append('$'+num(cnf, true));
                    switch (n) {
                        case 1:	$(cels[1]).append(kf.toFixed(2)+'<span title="Цена за единицу качества (Ц/К) с учетом запасов">(©'+cnkf.toFixed(2)+')</span>');
                        break;
                        case 2:	if(t === 0)	$(cels[1]).append(bf.toFixed(2));
                           else if(t == 1)	$(cels[1]).append('©'+num(cnf, true));
                        break;
                        case 3:	if(t === 0)	$(cels[1]).append('©'+num(cnf, true));
                        break;
                        default:$(cels[1]).append(num(cf, false));
                        break;
                    }
					n++;
				});
			}
		};
		var createtable = function (ar, i, t){
			if(ar.length>0){
				var cf=0, kf=0, cnf=0, cnkf=0, bf=0;
				for(i=0; i<ar.length; i++){
					cf += parseInt(ar[i].col);
				}
				if(cf > 0){
					for(i=0; i<ar.length; i++){
						kf += parseFloat(ar[i].cach * ( ar[i].col / cf ));
						cnf += parseFloat(ar[i].summ * ( ar[i].col / cf ));
						bf += parseFloat(ar[i].brend * ( ar[i].col / cf ));
					}
					if(kf!==0) cnkf = cnf / kf;
					if(isNaN(kf)){
						kf = 0;
						cnf = 0;
						bf = 0;
					    cnkf = 0;
					    }
				}else{
					kf = 0;
					cnf = 0;
					bf = 0;
					cnkf = 0;
					}
                if((kf===0) || (isNaN(kf))) kf=1;
				if(t === 0){
					var table = $('<table width="100%" style="margin-top:-17px;margin-bottom:60px;" class="noborder"><tr><td class="zcol" align="right">'+num(cf, false)+'</td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+kf.toFixed(2)+'<span title="Цена за единицу качества (Ц/К)">(©'+cnkf.toFixed(2)+')</span></td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+bf.toFixed(2)+'</td><td align="right" style="color:#f00;"></td></tr><td align="right">©'+num(cnf, true)+'</td><td align="right" style="color:#f00;"></td></tr></table>');
				//	var table = $('<table width="100%" style="margin-top:-17px" class="noborder"><tr><td class="zcol" align="right">'+cf.toFixed(0)+'</td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+kf.toFixed(2)+'('+cnkf.toFixed(2)+')</td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+bf.toFixed(2)+'</td><td align="right" style="color:#f00;"></td></tr><td align="right">$'+cnf.toFixed(2)+'</td><td align="right" style="color:#f00;"></td></tr></table>');
                    }
				if (t == 1) table = $('<table cellpadding="0" cellspacing="0" width="100%" class="noborder"><tr><td align="right">'+num(cf, false)+'</td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+kf.toFixed(2)+'<span title="Цена за единицу качества (Ц/К)">(©'+cnkf.toFixed(2)+')</span></td><td align="right" style="color:#f00;"></td></tr><td align="right">©'+num(cnf, true)+'</td><td align="right" style="color:#f00;"></td></tr></table>');
                //if(t == 1) var table = $('<table cellpadding="0" cellspacing="0" width="100%" class="noborder"><tr><td align="right">'+cf.toFixed(0)+'</td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+kf.toFixed(2)+'('+cnkf.toFixed(2)+')</td><td align="right" style="color:#f00;"></td></tr><td align="right">$'+cnf.toFixed(2)+'</td><td align="right" style="color:#f00;"></td></tr></table>');
                $(cel).html('').append(table).css('background-color','#efe');
				addtablemax(ar, table, t);
				return 0;
			}
			return i;
		};
		var updatetable = function (n){
			var ar = [], i=0, j=0;
			$(".list tr").each( function() {
				if($(this).hasClass('sub_row') || $(this).hasClass('product_row')){
					var cels = $('td', this),
						c = 0,
						k = 0,
						cn = 0,
						br = 0,
						sv = 0,
						max = 0,
						ck = 0;
					var but_1 = $('<input type="button" rel="'+j+'" value="+1п" />').unbind('click').click(function() { add($(this).attr('rel'),1,txt); });
					var but_2 = $('<input type="button" rel="'+j+'" value="+2п" />').unbind('click').click(function() { add($(this).attr('rel'),2,txt); });
					if($(this).hasClass('sub_row')){

						c = parseInt($('input', cels[1]).val().replace(/ /g, ''));
						cn = parseFloat($(cels[6]).text().replace('©', '').replace(/ /g, ''));
						k = parseFloat($(cels[8]).text().replace(/ /g, ''));
						br = parseFloat($(cels[10]).text().replace(/ /g, ''));
						sv = parseInt($(cels[17]).text().replace(/ /g, ''));
						max = parseInt($('span', cels[1]).text().replace('Max: ', '').replace(/ /g, ''));
					    if(k!==0) ck = cn / k;
                        if(isNaN(k)) ck = 0;
                        if((k===0) || (isNaN(k))) k =1;
						if(n===0){
							$(cels[3]).append('<span style="display:block;color:#f00;">$<span title="Цена за единицу качества (Ц/К)">'+ck.toFixed(2)+'</span></span>');
							$(cels[0]).prepend('<br />').prepend(but_2).prepend(but_1);
							$(cels[1]).prepend('<div class="divtemp" id="divtemp'+j+'" style="color:green"></div>');
                        }
                        $(cels[17]).unbind('click').click(function(){
                            var name = $(this).parent().parent().parent().parent().parent().attr('id').substr(16).split('-');
                            //alert (name[0]);
                            if(isNaN(max)) max = sv;
					        if(sv < max) max = sv;
                            $('input', cels[1]).val(max);
                            updatetable2(8, name[0]);
                            });
                            $(cels[16]).unbind('click').click(function(){
                            var name = $(this).parent().parent().parent().parent().parent().attr('id').substr(16).split('-');
                            if(isNaN(max)) max = sv;
					        if(sv < max) max = sv;
                            $('input', cels[1]).val(max);
                            updatetable2(8, name[0]);
                            });
                        $('span', cels[1]).unbind('click').click(function(){
                            var name = $(this).parent().parent().attr('id').substr(16).split('-');
                            //alert (name[0]);
                            if(isNaN(max)) max = sv;
					        if(sv < max) max = sv;
                            $('input', cels[1]).val(max);
                            updatetable2(8, name[0]);
                            });
                        k = nullpr(k);
						br = nullpr(br);
                    }
					if($(this).hasClass('product_row')){
						i = createtable(ar, i, 0);
						ar = [];
						cel = cels[14];
						c = parseInt($('input', cels[n+17]).val().replace(/ /g, ''));
						cn = parseFloat($(cels[n+22]).text().replace('©', '').replace(/ /g, ''));
						k = parseFloat($(cels[n+24]).text().replace(/ /g, ''));
						br = parseFloat($(cels[n+26]).text().replace(/ /g, ''));
						sv = parseInt($(cels[n+33]).text().replace(/ /g, ''));
						max = parseInt($('span', cels[n+17]).text().replace('Max: ', '').replace(/ /g, ''));
					    if(k!==0) ck = cn / k;
                        if(isNaN(k)) ck = 0;
                        if((k===0) || (isNaN(k))) k =1;
						if(n===0){
							$(cels[19]).append('<span style="display:block;color:#f00;"><span title="Цена за единицу качества (Ц/К)">©'+ck.toFixed(2)+'</span></span>');
					        $(cels[16]).prepend('<br />').prepend(but_2).prepend(but_1);
							$(cels[17]).prepend('<div class="divtemp" id="divtemp'+j+'" style="color:green"></div>');
						}
                        $(cels[n+33]).unbind('click').click(function(){
                            var name = $(this).parent().parent().parent().parent().parent().attr('id').substr(12).split('-');
                            //alert (name[0]);
                            if(isNaN(max)) max = sv;
					        if(sv < max) max = sv;
                            $('input', cels[n+17]).val(max);
                            updatetable2(8, name[0]);
                            });
                        $(cels[n+32]).unbind('click').click(function(){
                            var name = $(this).parent().parent().parent().parent().parent().attr('id').substr(12).split('-');
                            //alert (name[0]);
                            if(isNaN(max)) max = sv;
					        if(sv < max) max = sv;
                            $('input', cels[n+17]).val(max);
                            updatetable2(8, name[0]);
                            });
                        $('span', cels[n+17]).unbind('click').click(function(){
                            var name = $(this).parent().parent().attr('id').substr(12).split('-');
                            //alert (name[0]);
                            if(isNaN(max)) max = sv;
					        if(sv < max) max = sv;
                            $('input', cels[n+17]).val(max);
                            updatetable2(8, name[0]);
                            });
						k = nullpr(k);
						br = nullpr(br);
					}
					if(isNaN(max)) max = sv;
					if(sv < max) max = sv;
                    if(isNaN(c)) c = 0;
					ar[i] = new addar(c, cn, k, br, max);
					i++;
					if(n === 0){
						$(this).attr('ids',j);
						txt[j] = new fillArray( cn, k, max );
						j++;
					}
				}

				if(!$(this).hasClass('sub_row') || !$(this).hasClass('product_row') && i > 0){
					createtable(ar, i, 0);
				}
			});
		};
		var updatetable2 = function (n, name){
			var ar = [], i=0, j=0;
			$('.list tr[id*="'+name+'"]').each( function() {
				if($(this).hasClass('sub_row') || $(this).hasClass('product_row')){
					var cels = $('td', this),
						c = 0,
						k = 0,
						cn = 0,
						br = 0,
						sv = 0,
						max = 0,
						ck = 0;
					var but_1 = $('<input type="button" rel="'+j+'" value="+1п" />').unbind('click').click(function() { add($(this).attr('rel'),1,txt); });
					var but_2 = $('<input type="button" rel="'+j+'" value="+2п" />').unbind('click').click(function() { add($(this).attr('rel'),2,txt); });
					if($(this).hasClass('sub_row')){

						c = parseInt($('input', cels[1]).val().replace(/ /g, ''));
						cn = parseFloat($(cels[6]).text().replace('©', '').replace(/ /g, ''));
						k = parseFloat($(cels[8]).text().replace(/ /g, ''));
						br = parseFloat($(cels[10]).text().replace(/ /g, ''));
						sv = parseInt($(cels[17]).text().replace(/ /g, ''));
						max = parseInt($('span', cels[1]).text().replace('Max: ', '').replace(/ /g, ''));
					    if(k!==0) ck = cn / k;
                        if(isNaN(k)) ck = 0;
                        if((k===0) || (isNaN(k))) k =1;
						//if(n===0){
						//	$(cels[3]).append('<span style="display:block;color:#f00;">$<span title="Цена за единицу качества (Ц/К)">'+ck.toFixed(2)+'</span></span>');
						//	$(cels[0]).prepend('<br />').prepend(but_2).prepend(but_1);
						//	$(cels[1]).prepend('<div class="divtemp" id="divtemp'+j+'" style="color:green"></div>');
                        //}
                        k = nullpr(k);
						br = nullpr(br);
                    }
					if($(this).hasClass('product_row')){
						i = createtable(ar, i, 0);
						ar = [];
						cel = cels[14];
						c = parseInt($('input', cels[n+17]).val().replace(/ /g, ''));
						cn = parseFloat($(cels[n+22]).text().replace('©', '').replace(/ /g, ''));
						k = parseFloat($(cels[n+24]).text().replace(/ /g, ''));
						br = parseFloat($(cels[n+26]).text().replace(/ /g, ''));
						sv = parseInt($(cels[n+33]).text().replace(/ /g, ''));
						max = parseInt($('span', cels[n+17]).text().replace('Max: ', '').replace(/ /g, ''));
					    if(k!==0) ck = cn / k;
                        if(isNaN(k)) ck = 0;
                        if((k===0) || (isNaN(k))) k =1;
						//if(n===0){
						//	$(cels[19]).append('<span style="display:block;color:#f00;"><span title="Цена за единицу качества (Ц/К)">©'+ck.toFixed(2)+'</span></span>');
					    //    $(cels[16]).prepend('<br />').prepend(but_2).prepend(but_1);
						//	$(cels[17]).prepend('<div class="divtemp" id="divtemp'+j+'" style="color:green"></div>');
						//}
						k = nullpr(k);
						br = nullpr(br);
					}
					if(isNaN(max)) max = sv;
					if(sv < max) max = sv;
                    if(isNaN(c)) c = 0;
					ar[i] = new addar(c, cn, k, br, max);
					i++;
					//if(n === 0){
					//	$(this).attr('ids',j);
					//	txt[j] = new fillArray( cn, k, max );
					//	j++;
					//}
				}

				if(!$(this).hasClass('sub_row') || !$(this).hasClass('product_row') && i > 0){
					createtable(ar, i, 0);
				}
			});
		};
        var statusz = function (x,help){
			var x1 = x;
			var color = '#86EF75';
			if(x > 100){
				x1 = 100;
				color = '#F47981';
			}
			if(x < 0){
				x1 = 0;
			}
			var s = '<div title="'+help+'" style="margin-top:3px;border:solid 1px gray;height:15px;"><div style="background-color:'+color+';width:'+x1.toFixed(2)+'%;height:15px;"><span style="position:absolute;margin-left:10px;">'+x.toFixed(2)+'%</span></div></div>';
			return s;
		};

		//var new_url=(location.href).replace('/supply','');
		var size = null;
		var unit_sizes_array = JSON.parse(window.localStorage.getItem('unit_sizes_array'));
	  		if (unit_sizes_array == null) {
				var unit_sizes_array = new Object();
				getUnitSize();
				unit_sizes_array = JSON.parse(window.localStorage.getItem('unit_sizes_array'));
				}
			if (unit_sizes_array[id_shop] == null) {
		  		getUnitSize();
		  		unit_sizes_array = JSON.parse(window.localStorage.getItem('unit_sizes_array'));
				};
		size = unit_sizes_array[id_shop].size;

		var vals_array = JSON.parse(window.localStorage.getItem('vals_array'));
	    if (vals_array == null) {
			getValsArray();
			vals_array = JSON.parse(window.localStorage.getItem('vals_array'));
		}

		var scladr = function () {
	    $("table.infoblock").after(wc_info);
	    //$("#v_info").html("Не удалось получить значения объемов хренения из локального хранилища. Сохраните данные на странице по <a href=https://virtonomica.ru/"+realm+"/main/industry/unit_type/info/2011/volume>ссылке</a>").css('color', 'red');
	    var prc = 0;
		var prc1 = 0;
		var prc2 = 0;
		$(".list tr").each( function() {
			var cels = $('td', this);
			if($(this).hasClass('product_row')) {
				var cel1 = cels[3];
				$('.scl',cel1).remove();
				$('.scl1',cel1).remove();
				$('.scl2',cel1).remove();
				$(cel1).append('<div class="scl"></div>').append('<div class="scl1"></div>').append('<div class="scl2"></div>');
				var col = parseInt($('table td:contains(Количество)',cel1).next().text().replace(/ /g,''));
				var index = parseInt($(cel1).closest('tr').attr('id').replace(/product_row_/g,'').replace(/-([0-9]+)/g,''));
				var name = $('img', this).attr('alt');
                console.log (index);
			  	if (vals_array[index] == null) {
					  getValsArray();
					  vals_array = JSON.parse(window.localStorage.getItem('vals_array'));
		              $("#v_info").append("<br>" + name + " - нет данных по объемам хранения. Обновите страницу или нажмите кнопку обновления ниже. Просмотр объемов хранения <a href=https://virtonomica.ru/"+realm+"/main/industry/unit_type/info/2011/volume>ссылке</a>").css('color', 'red');
				}//index=2556}
				//$('.allsclad select') = size;
				//size = size * 1.05;
				//console.log ($('.allsclad select').val());
				//console.log (vals_array[370077]['vals']);
	                //else var proc=vp*1000/(vals_array[np]['vals']*vs);
				//var scl1 = (col * 100 / scl[index]) * 1000 / $('.list .allsclad select').val();
				//var scl1 = (col * 100 * $('.allsclad select').val()) / scl[index];
                //var scl1 = col / (vals_array[index]['vals'] / $('.allsclad select').val());
				var scl1 = col / vals_array[index].vals / ($('.allsclad select').val() / 1000) * 100;
				$('.scl',cel1).html(statusz(scl1,'В данный момент на складе.'));
				prc += scl1;

				var colprod = parseInt($('table td:contains(Продано)',cel1).next().text().replace(/ /g,''));
				var colzac = parseInt($('.zcol',$(cel1).next()).text().replace(/ /g,''));

				//var scl2 = ((colzac + col) * 100 / scl[index]) * 1000 / $('.list .allsclad select').val();
				//var scl2 = (colzac + col) / (vals_array[index]['vals'] / $('.allsclad select').val());
				var scl2 = (colzac + col) / vals_array[index].vals / ($('.allsclad select').val() / 1000) * 100;
				$('.scl1',cel1).html(statusz(scl2,'После закупки без продаж.'));
				prc1 += scl2;
				//var scl3 = ((colzac + col - colprod) * 100 / scl[index]) * 1000 / $('.list .allsclad select').val();
				//var scl3 = (colzac + col - colprod) / (vals_array[index]['vals'] / $('.allsclad select').val());
				var scl3 = (colzac + col - colprod) / vals_array[index].vals / ($('.allsclad select').val() / 1000) * 100;
				$('.scl2',cel1).html(statusz(scl3,'После закупки с такими же продажами.'));
				prc2 += scl3;
				}
			});
		if(prc > 0 || prc1 > 0 || prc2 > 0){
			$('.allsclad .cc').html(statusz(prc,'В данный момент на складе.')+statusz(prc1,'После закупки без продаж.')+statusz(prc2,'После закупки с такими же продажами.'));
			}
		};
		$('#menutop li ul').width(1100);
		$('#wrapper').width(1100);
		//var i = 0;
			//UpdateValsStorage();
			//});
		var valsinfo = $('.list tr:first').next().next();
				if (title.search('bgunit-shop')!=-1) $(valsinfo).before('<tr><td></td><td class="allsclad"><label>Размер склада магазина<select><option value="'+size/4+'">'+size/4+'</option><option value="'+size/2+'">'+size/2+'</option><option selected value="'+size+'">'+size+'</option><option value="'+size*2+'">'+size*2+'</option><option value="'+size*4+'">'+size*4+'</option></select> м<sup>2</sup></label> <a href="#">?</a></div><div class="cc"></div></td><td colspan="9"><div id=links style="color:blue">Просмотр <a href='+vl_info_link+'>объемов хранения</a> и <a href='+tm_info_link+'>списка ТМ</a>. Вы можете обновить значения объемов хренения, если они изменились </div><div class="helpsn" style="display:none;">Расчет заполняемости склада идет только по товару, находящемуся на данной страннице снабжения. (Если на складе присутствует товар, по которому в данный момент нет поставщика, то данный товар не считается)</div></td></tr>');
                else $(valsinfo).before('<tr><td></td><td class="allsclad"><label>Размер заправки<select><option value="'+size*500/4+'">'+size/4+'</option><option value="'+size*500/2+'">'+size/2+'</option><option selected value="'+size*500+'">'+size+'</option><option value="'+size*1000+'">'+size*2+'</option><option value="'+size*2000+'">'+size*4+'</option></select> колонок</label> <a href="#">?</a></div><div class="cc"></div></td><td colspan="9"><div id=links style="color:blue">Просмотр <a href='+vl_info_link+'>объемов хранения</a> и <a href='+tm_info_link+'>списка ТМ</a>. Вы можете обновить значения объемов хренения, если они изменились </div><div class="helpsn" style="display:none;">Расчет заполняемости склада идет только по товару, находящемуся на данной страннице снабжения. (Если на складе присутствует товар, по которому в данный момент нет поставщика, то данный товар не считается)</div></td></tr>');
				//$('#links').append(UpdateVals);

		// Неоптимальный перебор для нахождения всего одного объекта. Заменен простым селектором выше.
		/*$(".list tr").each( function() {
			var cels = $('td', this);
			if(i === 0 && $(cels[0]).hasClass('title')){
				//$(this).before('<tr><td></td><td class="allsclad"><label>Размер склада<select><option value="1050">100</option><option value="210">500</option><option selected value="105">1000</option><option value="10.5">10000</option><option value="1.05">100000</option></select></label> <a href="#">?</a></div><div class="cc"></div></td><td colspan="9"><div class="helpsn" style="display:none;">Расчет заполняемости склада идет только по товару находящимуся на данной страннице снабжения. (Если на складе присутствует товар по которому в данный момент нет поставщика, то данный товар не считается)</div></td></tr>');
				//if (title.search('shop')!=-1) $(this).before('<tr><td></td><td class="allsclad"><label>Размер склада магазина<select><option value="1050">100</option><option value="210">500</option><option selected value="'+size/952.4+'">'+sizename+'</option><option value="10.5">10000</option><option value="1.05">100000</option></select></label> <a href="#">?</a></div><div class="cc"></div></td><td colspan="9"><div class="helpsn" style="display:none;">Расчет заполняемости склада идет только по товару находящимуся на данной страннице снабжения. (Если на складе присутствует товар по которому в данный момент нет поставщика, то данный товар не считается)</div></td></tr>');
                //else $(this).before('<tr><td></td><td class="allsclad"><label>Размер заправки<select><option value="210">Малая городская АЗС</option><option value="70">Средняя городская АЗС</option><option selected value="'+size*13.1+'">'+sizename+'</option><option value="7">Пригородная сеть АЗС</option><option value="2.1">Областная сеть АЗС</option></select></label> <a href="#">?</a></div><div class="cc"></div></td><td colspan="9"><div class="helpsn" style="display:none;">Расчет заполняемости склада идет только по товару находящимуся на данной страннице снабжения. (Если на складе присутствует товар по которому в данный момент нет поставщика, то данный товар не считается)</div></td></tr>');
				if (title.search('unit-header-shop')!=-1) $(this).before('<tr><td></td><td class="allsclad"><label>Размер склада магазина<select><option value="'+size/4+'">'+size/4+'</option><option value="'+size/2+'">'+size/2+'</option><option selected value="'+size+'">'+size+'</option><option value="'+size*2+'">'+size*2+'</option><option value="'+size*4+'">'+size*4+'</option></select> м<sup>2</sup></label> <a href="#">?</a></div><div class="cc"></div></td><td colspan="9"><div id=links style="color:blue">Просмотр <a href='+vl_info_link+'>объемов хранения</a> и <a href='+tm_info_link+'>списка ТМ</a>. Вы можете обновить значения объемов хренения, если они изменились </div><div class="helpsn" style="display:none;">Расчет заполняемости склада идет только по товару, находящемуся на данной страннице снабжения. (Если на складе присутствует товар, по которому в данный момент нет поставщика, то данный товар не считается)</div></td></tr>');
                else $(this).before('<tr><td></td><td class="allsclad"><label>Размер заправки<select><option value="'+size*500/4+'">'+size/4+'</option><option value="'+size*500/2+'">'+size/2+'</option><option selected value="'+size*500+'">'+size+'</option><option value="'+size*1000+'">'+size*2+'</option><option value="'+size*2000+'">'+size*4+'</option></select> колонок</label> <a href="#">?</a></div><div class="cc"></div></td><td colspan="9"><div id=links style="color:blue">Просмотр <a href='+vl_info_link+'>объемов хранения</a> и <a href='+tm_info_link+'>списка ТМ</a>. Вы можете обновить значения объемов хренения, если они изменились </div><div class="helpsn" style="display:none;">Расчет заполняемости склада идет только по товару, находящемуся на данной страннице снабжения. (Если на складе присутствует товар, по которому в данный момент нет поставщика, то данный товар не считается)</div></td></tr>');
				$('#links').append(UpdateVals);
                i++;
			}
		});*/
		//$('.allsclad').after("Если размер подразделения не верен, то перейдите на его главную страницу ивернитесь обратно");
		$('.allsclad a').unbind('click').click(function() {
			if($('.helpsn').is(':visible'))
				$('.helpsn').hide();
			else
				$('.helpsn').show();
			return false;
		});

		$('input[name*=party_quantity]').unbind('keyup').keyup(function(e) {
			if (timeout) clearTimeout(timeout);
            if ($(this).parent().parent().attr('id').substr(8,3)=="sub")
                var name = $(this).parent().parent().attr('id').substr(16).split('-');
            else if ($(this).parent().parent().attr('id').substr(8,3)=="row")
                name = $(this).parent().parent().attr('id').substr(12).split('-');
			timeout = setTimeout(function() {
			updatetable2(8, name[0]);
			scladr();
			if (e.keyCode == 13) return;
			}, delay);});

		$('.allsclad select').change(function() {
			updatetable(8);
			scladr();
		});

		updatetable(0);
		scladr();
		//});

		var but_ras = $('<input type="button" value="Расчет" />').unbind('click').click(function() { Calculate1(0); });
		var UpdateVals = $('<input type="button" value="Обновить" />').unbind('click').click(function() {
			UpdateValsStorage();
			updatetable(8);
			scladr();
		});
		$('#links').append(UpdateVals);
		$('#links').prepend('<br><div id=links style="color:blue">Если размер подразделения определился неверно, то перейдите на главную вкладку и вернитесь обратно</div>');
	}

	if (title.search('repair')!=-1 || title.search('restaurant')!=-1 || title.search('medicine')!=-1 || title.search('educational')!=-1 || title.search('kindergarten')!=-1){
		form = true;
		//console.log(title);

		addtablemax = function (ar, table, t){
			var cf=0, kf=0, cnf=0, cnkf=0, bf=0, b=false;
			for(i=0; i<ar.length; i++){
                if(ar[i].col > ar[i].max){
					cf += parseInt(ar[i].max);
                    if(ar[i].col>0) b = true;}
                else
					cf += parseInt(ar[i].col);
			}
			if(cf !== 0){
				for(i=0; i<ar.length; i++){
					if(ar[i].col > ar[i].max){
						kf += parseFloat(ar[i].cach * ( ar[i].max / cf ));
						cnf += parseFloat(ar[i].summ * ( ar[i].max / cf ));
						bf += parseFloat(ar[i].brend * ( ar[i].max / cf ));
						b = true;
					}else{
						kf += parseFloat(ar[i].cach * ( ar[i].col / cf ));
						cnf += parseFloat(ar[i].summ * ( ar[i].col / cf ));
						bf += parseFloat(ar[i].brend * ( ar[i].col / cf ));
					}
				}
                cnkf = cnf / kf;
				if(isNaN(kf)){
					kf = 0;
					cnf = 0;
					bf = 0;
					cnkf = 0;
					}
			}
            //if((kf===0) || (isNaN(kf))) kf=1;
            if(b){
				table.closest('td').css('background-color','#fee');
				var n = 0;
				$('tr', table).each( function() {
					var cels = $('td', this);
					//if(n == 0)	$(cels[1]).append(num(cf, false));
					//if(n == 1)	$(cels[1]).append(kf.toFixed(2)+'<span title="Цена за единицу качества (Ц/К) с учетом запасов">($'+cnkf.toFixed(2)+')</span>');
					//if(n == 2 && t == 0)	$(cels[1]).append(bf.toFixed(2));
					//if(n == 3 && t == 0)	$(cels[1]).append('$'+num(cnf, true));
					//if(n == 2 && t == 1)	$(cels[1]).append('$'+num(cnf, true));
                    switch (n) {
                        case 1:	$(cels[1]).append(kf.toFixed(2)+'<span title="Цена за единицу качества (Ц/К) с учетом запасов">(©'+cnkf.toFixed(2)+')</span>');
                        break;
                        case 2:	if(t === 0)	$(cels[1]).append(bf.toFixed(2));
                           else if(t == 1)	$(cels[1]).append('©'+num(cnf, true));
                        break;
                        case 3:	if(t === 0)	$(cels[1]).append('©'+num(cnf, true));
                        break;
                        default:$(cels[1]).append(num(cf, false));
                        break;
                    }
					n++;
				});
			}
		};
		createtable = function (ar, i, t){
			if(ar.length>0){
				var cf=0, kf=0, cnf=0, cnkf=0, bf=0;
				for(i=0; i<ar.length; i++){
					cf += parseInt(ar[i].col);
				}
				if(cf > 0){
					for(i=0; i<ar.length; i++){
						kf += parseFloat(ar[i].cach * ( ar[i].col / cf ));
						cnf += parseFloat(ar[i].summ * ( ar[i].col / cf ));
						bf += parseFloat(ar[i].brend * ( ar[i].col / cf ));
					}
					if(kf!==0) cnkf = cnf / kf;
					if(isNaN(kf)){
						kf = 0;
						cnf = 0;
						bf = 0;
					    cnkf = 0;
					    }
				}else{
					kf = 0;
					cnf = 0;
					bf = 0;
					cnkf = 0;
					}
                //if((kf===0) || (isNaN(kf))) kf=1;
				if(t === 0){
					var table = $('<table width="100%" style="margin-top:-17px;margin-bottom:60px;" class="noborder"><tr><td class="zcol" align="right">'+num(cf, false)+'</td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+kf.toFixed(2)+'<span title="Цена за единицу качества (Ц/К)">(©'+cnkf.toFixed(2)+')</span></td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+bf.toFixed(2)+'</td><td align="right" style="color:#f00;"></td></tr><td align="right">©'+num(cnf, true)+'</td><td align="right" style="color:#f00;"></td></tr></table>');
				//	var table = $('<table width="100%" style="margin-top:-17px" class="noborder"><tr><td class="zcol" align="right">'+cf.toFixed(0)+'</td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+kf.toFixed(2)+'('+cnkf.toFixed(2)+')</td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+bf.toFixed(2)+'</td><td align="right" style="color:#f00;"></td></tr><td align="right">$'+cnf.toFixed(2)+'</td><td align="right" style="color:#f00;"></td></tr></table>');
                    }
				if(t == 1) table = $('<table cellpadding="0" cellspacing="0" width="100%" class="noborder"><tr><td align="right">'+num(cf, false)+'</td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+kf.toFixed(2)+'<span title="Цена за единицу качества (Ц/К)">(©'+cnkf.toFixed(2)+')</span></td><td align="right" style="color:#f00;"></td></tr><td align="right">©'+num(cnf, true)+'</td><td align="right" style="color:#f00;"></td></tr></table>');
                //if(t == 1) var table = $('<table cellpadding="0" cellspacing="0" width="100%" class="noborder"><tr><td align="right">'+cf.toFixed(0)+'</td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+kf.toFixed(2)+'('+cnkf.toFixed(2)+')</td><td align="right" style="color:#f00;"></td></tr><td align="right">$'+cnf.toFixed(2)+'</td><td align="right" style="color:#f00;"></td></tr></table>');
                $(cel).html('').append(table).css('background-color','#efe');
				addtablemax(ar, table, t);
				return 0;
			}
			return i;
		};
		var newtype = function (id, title, subrow){
			this.id = id;
			this.title = title;
			this.subrow = subrow;
		};
		var addarr = function (item,n,id){
			var ar = [],c = 0,k = 0,cn = 0,br = 0,sv = 0,max = 0;
			$(item).each( function() {
				var cels = $('td', this);
					c = parseInt($('input', cels[20+n]).val().replace(/ /g, ''));
					k = parseFloat($(cels[30+n]).text().replace(/ /g, ''));
					cn = parseFloat($(cels[25+n]).text().replace('©', '').replace(/ /g, ''));
					br = 0;
					sv = parseInt($(cels[38+n]).text().replace(/ /g, ''));
					max = parseInt($('span', cels[20+n]).text().replace('Max: ', '').replace(/ /g, ''));
					k = nullpr(k);
                $(cels[38+n]).unbind('click').click(function(){
                    if(isNaN(max)) max = sv;
				    if(sv < max) max = sv;
                    $('input', cels[20+n]).val(max);
                    updatetablepr(7);
                    });
                $(cels[37+n]).unbind('click').click(function(){
                    if(isNaN(max)) max = sv;
				    if(sv < max) max = sv;
                    $('input', cels[20+n]).val(max);
                    updatetablepr(7);
                    });
                if(!isNaN(max)) {$('span', cels[20+n]).unbind('click').click(function(){
                    if(isNaN(max)) max = sv;
				    if(sv < max) max = sv;
                    $('input', cels[20+n]).val(max);
                    updatetablepr(7);
                    });}
			});
			if(isNaN(max)) max = sv;
			if(sv < max) max = sv;
            if(isNaN(c)) c = 0;
			ar = new addar(c, cn, k, br, max);
			return ar;
		};
		var type=[], k=0;
		i = 0;
		$('.list th:contains(Поставки)').before('<th rowspan="2">Заказ</th>');
		var updatetablepr = function (m){
		//console.log(a2);
		if (a2 == "pply") {
			//if (typeof gaMaterialProduct !== "undefined") {
			for(var item in gaMaterialProduct) {
				var t = $('#product_row_'+item+' th [rowspan=2] img').attr('alt'),
					subrow = gaMaterialProduct[item].subRowCount,
					ar = [],
					n = 0;
				type[i] = new newtype(item,t,subrow);
				i++;

				ar[n] = addarr('#product_row_'+item,m,k);
				n++;

				if(m === 0){
					var kk = 0,cn = 0,ck = 0;
					$('#product_row_'+item).each( function() {
				    var cels = $('td', this);
					kk = parseFloat($(cels[30+m]).text().replace(/ /g, ''));
					cn = parseFloat($(cels[25+m]).text().replace('©', '').replace(/ /g, ''));
					if(kk!==0) ck = cn /kk;
                    if(isNaN(kk)) ck = 0;
					$('#product_row_'+item+' #name_'+item+'_0').next().next().append('<span style="display:block;color:#f00;"><span title="Цена за единицу качества (Ц/К)">©'+ck.toFixed(2)+'</span></span>');
                    var but_1 = $('<input type="button" rel="'+k+'" value="+1п" />').unbind('click').click(function() { add($(this).attr('rel'),1,txt); });
					var but_2 = $('<input type="button" rel="'+k+'" value="+2п" />').unbind('click').click(function() { add($(this).attr('rel'),2,txt); });
					$('#product_row_'+item+' #name_'+item+'_0').prepend('<br />').prepend(but_2).prepend(but_1);
					$('#product_row_'+item+' #name_'+item+'_0').next().prepend('<div class="divtemp" id="divtemp'+k+'" style="color:green"></div>');
                    });}
				txt[k] = addarr('#product_row_'+item,m,k);
				k++;

                for(j=1; j<subrow; j++){
					ar[n] = addarr('#product_sub_row_'+item+'_'+j,-19,k);
					n++;
					if(m === 0){
						kk = 0;
						cn = 0;
						ck = 0;
						$('#product_sub_row_'+item+'_'+j).each( function() {
				    	var cels = $('td', this);
						kk = parseFloat($(cels[11+m]).text().replace(/ /g, ''));
                    	cn = parseFloat($(cels[6+m]).text().replace('©', '').replace(/ /g, ''));
						if(kk!==0) ck = cn /kk;
                        if(isNaN(kk)) ck = 0;
						$('#product_sub_row_'+item+'_'+j+' #name_'+item+'_'+j).next().next().append('<span style="display:block;color:#f00;"><span title="Цена за единицу качества (Ц/К)">©'+ck.toFixed(2)+'</span></span>');
                        var but_1 = $('<input type="button" rel="'+k+'" value="+1п" />').unbind('click').click(function() { add($(this).attr('rel'),1,txt); });
						var but_2 = $('<input type="button" rel="'+k+'" value="+2п" />').unbind('click').click(function() { add($(this).attr('rel'),2,txt); });
						$('#product_sub_row_'+item+'_'+j+' #name_'+item+'_'+j).prepend('<br />').prepend(but_2).prepend(but_1);
						$('#product_sub_row_'+item+'_'+j+' #name_'+item+'_'+j).next().prepend('<div class="divtemp" id="divtemp'+k+'" style="color:green"></div>');
                    });}
					txt[k] = addarr('#product_sub_row_'+item+'_'+j,-19,k);
					k++;
				}

				if( m>0 )
					$('#product_row_'+item+' #name_'+item+'_0').prev().remove();

				cel = $('<td width="100" class="temp'+item+'" rowspan="'+subrow+'"></td>');
				$('#product_row_'+item+' #name_'+item+'_0').before(cel);

				if(ar.length>0){
					var cf=0, kf=0, cnf=0, cnkf=0;
					for(j=0; j<ar.length; j++){
						cf += parseInt(ar[j].col);
					}
					if(cf > 0){
						for(j=0; j<ar.length; j++){
                            if((ar[j].cach===0) || (isNaN(ar[j].cach))) ar[j].cach = 1;
							kf += parseFloat(ar[j].cach * ( ar[j].col / cf ));
							cnf += parseFloat(ar[j].summ * ( ar[j].col / cf ));
						}
					    if(kf!==0) cnkf = cnf / kf;
						if(isNaN(kf)){
							kf = 1;
							cnf = 0;
					        cnkf = 0;
						}
					}else{
						kf = 1;
						cnf = 0;
					    cnkf = 0;
					    var b = true;
					}
                    if((kf===0) || (isNaN(kf))) kf=1;
					var table = $('<table cellpadding="0" cellspacing="0" width="100%" class="noborder"><tr><td style="word-wrap:normal" align="right">'+num(cf, false)+'</td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+kf.toFixed(2)+'<span title="Цена за единицу качества (Ц/К)">(©'+cnkf.toFixed(2)+')</span></td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">©'+num(cnf, true)+'</td><td align="right" style="color:#f00;"></td></tr></table>');
					$(cel).html('').append(table).css('background-color','#efe');
					addtablemax(ar, table, 1);
				}
				$('temp'+item).remove();
				$('#product_row_'+item+' #name_'+item+'_0').before(cel);
			}
		};
		};
		updatetablepr(0);
		//};
		$('input[name*=supplyContractData]').unbind('keyup').keyup(function(e){
			if (timeout) clearTimeout(timeout);
			timeout = setTimeout(function() {
			updatetablepr(7);
			if (e.keyCode == 13) return;
			}, delay);});
		but_ras = $('<input type="button" value="Расчет" />').unbind('click').click(function() { Calculate1(1); });
	}

	if (title.search('animalfarm')!=-1 || title.search('power')!=-1 || title.search('mill')!=-1 || title.search('workshop')!=-1 || title.search('apiary')!=-1) {
		form = true;
		//console.log (title);
		//console.log ($('#mDestroy > input[type="hidden"]').length);
		var supinterface = $('#mDestroy > input[type="hidden"]').length;
		switch (supinterface){
		case 1:
		//break;
		addtablemax = function (ar, table, t){
			var cf=0, kf=0, cnf=0, cnkf=0, bf=0, b=false;
			for(i=0; i<ar.length; i++){
                if(ar[i].col > ar[i].max){
					cf += parseInt(ar[i].max);
                    if(ar[i].col>0) b = true;}
                else
					cf += parseInt(ar[i].col);
			}
			if(cf !== 0){
				for(i=0; i<ar.length; i++){
					if(ar[i].col > ar[i].max){
						kf += parseFloat(ar[i].cach * ( ar[i].max / cf ));
						cnf += parseFloat(ar[i].summ * ( ar[i].max / cf ));
						bf += parseFloat(ar[i].brend * ( ar[i].max / cf ));
						b = true;
					}else{
						kf += parseFloat(ar[i].cach * ( ar[i].col / cf ));
						cnf += parseFloat(ar[i].summ * ( ar[i].col / cf ));
						bf += parseFloat(ar[i].brend * ( ar[i].col / cf ));
					}
				}
                cnkf = cnf / kf;
				if(isNaN(kf)){
					kf = 0;
					cnf = 0;
					bf = 0;
					cnkf = 0;
					}
			}
            //if((kf === 0) || (isNaN(kf))) kf = 1;
            if(b){
				table.closest('td').css('background-color','#fee');
				var n = 0;
				$('tr', table).each( function() {
					var cels = $('td', this);
					//if(n == 0)	$(cels[1]).append(num(cf, false));
					//if(n == 1)	$(cels[1]).append(kf.toFixed(2)+'<span title="Цена за единицу качества (Ц/К) с учетом запасов">($'+cnkf.toFixed(2)+')</span>');
					//if(n == 2 && t == 0)	$(cels[1]).append(bf.toFixed(2));
					//if(n == 3 && t == 0)	$(cels[1]).append('$'+num(cnf, true));
					//if(n == 2 && t == 1)	$(cels[1]).append('$'+num(cnf, true));
                    switch (n) {
                        case 1:	$(cels[1]).append(kf.toFixed(2)+'<span title="Цена за единицу качества (Ц/К) с учетом запасов">(©'+cnkf.toFixed(2)+')</span>');
                        break;
                        case 2:	if(t === 0)	$(cels[1]).append(bf.toFixed(2));
                           else if(t == 1)	$(cels[1]).append('©'+num(cnf, true));
                        break;
                        case 3:	if(t === 0)	$(cels[1]).append('©'+num(cnf, true));
                        break;
                        default:$(cels[1]).append(num(cf, false));
                        break;
                    }
					n++;
				});
			}
		};
		createtable = function (ar, i, t){
			if(ar.length>0){
				var cf=0, kf=0, cnf=0, cnkf=0, bf=0;
				for(i=0; i<ar.length; i++){
					cf += parseInt(ar[i].col);
				}
				if(cf > 0){
					for(i=0; i<ar.length; i++){
						kf += parseFloat(ar[i].cach * ( ar[i].col / cf ));
						cnf += parseFloat(ar[i].summ * ( ar[i].col / cf ));
						bf += parseFloat(ar[i].brend * ( ar[i].col / cf ));
					}
					if(kf!==0) cnkf = cnf / kf;
					if(isNaN(kf)){
						kf = 0;
						cnf = 0;
						bf = 0;
					    cnkf = 0;
					    }
				}else{
					kf = 0;
					cnf = 0;
					bf = 0;
					cnkf = 0;
					}
                //if((kf===0) || (isNaN(kf))) kf=1;
                if(t === 0){
					var table = $('<table width="100%" style="margin-top:-17px;margin-bottom:60px;" class="noborder"><tr><td class="zcol" align="right">'+num(cf, false)+'</td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+kf.toFixed(2)+'<span title="Цена за единицу качества (Ц/К)">(©'+cnkf.toFixed(2)+')</span></td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+bf.toFixed(2)+'</td><td align="right" style="color:#f00;"></td></tr><td align="right">©'+num(cnf, true)+'</td><td align="right" style="color:#f00;"></td></tr></table>');
				//	var table = $('<table width="100%" style="margin-top:-17px" class="noborder"><tr><td class="zcol" align="right">'+cf.toFixed(0)+'</td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+kf.toFixed(2)+'('+cnkf.toFixed(2)+')</td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+bf.toFixed(2)+'</td><td align="right" style="color:#f00;"></td></tr><td align="right">$'+cnf.toFixed(2)+'</td><td align="right" style="color:#f00;"></td></tr></table>');
                    }
				if(t == 1) table = $('<table cellpadding="0" cellspacing="0" width="100%" class="noborder"><tr><td align="right">'+num(cf, false)+'</td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+kf.toFixed(2)+'<span title="Цена за единицу качества (Ц/К)">(©'+cnkf.toFixed(2)+')</span></td><td align="right" style="color:#f00;"></td></tr><td align="right">©'+num(cnf, true)+'</td><td align="right" style="color:#f00;"></td></tr></table>');
                //if(t == 1) var table = $('<table cellpadding="0" cellspacing="0" width="100%" class="noborder"><tr><td align="right">'+cf.toFixed(0)+'</td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+kf.toFixed(2)+'('+cnkf.toFixed(2)+')</td><td align="right" style="color:#f00;"></td></tr><td align="right">$'+cnf.toFixed(2)+'</td><td align="right" style="color:#f00;"></td></tr></table>');
                $(cel).html('').append(table).css('background-color','#efe');
				addtablemax(ar, table, t);
				return 0;
			}
			return i;
		};
		newtype = function (id, title, subrow){
			this.id = id;
			this.title = title;
			this.subrow = subrow;
		};
		addarr = function (item, n, id){
			var ar = [],c = 0,k = 0,cn = 0,br = 0,sv = 0,max = 0;
			//item = $(item).parent();
			//console.log(item, n);
			$(item).each( function() {
				var cels = $('td', this);
				//console.log($('input',cels[30+n]));
					c = parseInt($('input', cels[30+n]).val().replace(/ /g, ''));
					k = parseFloat($(cels[27+n]).text().replace(/ /g, ''));
					cn = parseFloat($(cels[24+n]).text().replace('©', '').replace(/ /g, ''));
					br = 0;
					sv = parseInt($(cels[29+n]).text().replace(/ /g, ''));
					max = parseInt($('span', cels[30+n]).text().replace('макс: ', '').replace(/ /g, ''));
					k = nullpr(k);
                $(cels[29+n]).unbind('click').click(function(){
                    if(isNaN(max)) max = sv;
				    if(sv < max) max = sv;
                    $('input', cels[30+n]).val(max);
                    updatetablepr(7);
                    });
                $(cels[29+n]).unbind('click').click(function(){
                    if(isNaN(max)) max = sv;
				    if(sv < max) max = sv;
                    $('input', cels[30+n]).val(max);
                    updatetablepr(7);
                    });
                if(!isNaN(max)) {$('span', cels[30+n]).unbind('click').click(function(){
                    if(isNaN(max)) max = sv;
				    if(sv < max) max = sv;
                    $('input', cels[30+n]).val(max);
                    updatetablepr(7);
                    });}
			});
			if(isNaN(max)) max = sv;
			if(sv < max) max = sv;
            if(isNaN(c)) c = 0;
			ar = new addar(c, cn, k, br, max);
			return ar;
		};
		type=[];
		i=0;
		k=0;
		var subrow = 0;
		document.querySelector('#mDestroy > table > thead > tr:nth-child(1) > th:nth-child(1)').setAttribute('colspan','5');
		$('.list th:contains(На складе)').after('<th>Заказ</th>');
		//console.log($('tr[id] td[valign=middle][title]').length);
				//var sel = $('tr[id] td[valign=middle][title="Медный колчедан"]').next();
				//console.log(sel.length);
				//for (var ii=0; ii<sel.length; ii++) {
						//console.log(sel[ii].textContent.length);
						//var sel2 = sel[ii].textContent.length;
						//if (sel2 == 0) {
						//console.log(sel[ii]);
						//var cels2 = $(sel[ii]).parent();
				    //var cels = $('td', cels2);
					//console.log(cels.length);
					//kk = parseFloat($(cels[10]).text().replace(/ /g, ''));
					//console.log(kk);
					//cn = parseFloat($(cels[7]).text().replace('$', '').replace(/ /g, ''));
					//console.log(cn);}}
					//console.log(cels2);}}
		for (var c_i in contracts) {
			if (contracts[c_i].length != -1) subrow = subrow + 1};

		updatetablepr = function (m){
					var ar = [],
					n = 0;
			for (var c_i in contracts) {
				var t = $('tr[id=r'+c_i+'] td[valign=middle][title]').attr('title');
					//subrow = gaMaterialProduct[item].subRowCount,
					//ar = [],
					//n = 0;
				var item = contracts[c_i].product_id;
				//console.log(t, item);
				type[i] = new newtype(item,t,subrow);
				i++;

				var sel = $('tr[id=r'+c_i+'] td[valign=middle][title="'+t+'"]').next();
				var cels2 = $(sel).parent();

				//if(m === 0){
					//var kk = 0,cn = 0,ck = 0;
					//console.log($('tr[id=r'+c_i+'] td[valign=middle][title="'+t+'"]').length);
					//console.log(sel.text())
					//for (var ii=0; ii<sel.length; ii++) {
				if (sel.text().length != 0) {
					$('tr[id=r'+c_i+'] td[valign=middle][title="'+t+'"]').attr('title',''+t+'_0');
					ar[n] = addarr(cels2,m,k);
					n++;
				if(m === 0){
					var kk = 0,cn = 0,ck = 0;
					var cels = $('td', cels2);
					kk = parseFloat($(cels[27+m]).text().replace(/ /g, ''));
					//console.log(kk);
					cn = parseFloat($(cels[24+m]).text().replace('©', '').replace(/ /g, ''));
					//console.log(cn);
					if(kk!==0) ck = cn /kk;
                    if(isNaN(kk)) ck = 0;
					$('tr[id=r'+c_i+'] > td:nth-child(6) > div:nth-child(4)').append('<span style="display:block;color:#f00;"><span title="Цена за единицу качества (Ц/К)">©'+ck.toFixed(2)+'</span></span>');
                    var but_1 = $('<input type="button" rel="'+k+'" value="+1п" />').unbind('click').click(function() { add($(this).attr('rel'),1,txt); });
					var but_2 = $('<input type="button" rel="'+k+'" value="+2п" />').unbind('click').click(function() { add($(this).attr('rel'),2,txt); });
					$('tr[id=r'+c_i+'] > td:nth-child(7)').append(but_1).append(but_2);
					$('tr[id=r'+c_i+'] > td:nth-child(6)').prepend('<div class="divtemp" id="divtemp'+k+'" style="color:green"></div>');
				}
				txt[k] = addarr(cels2,m,k);
				k++;
				}
				//var sel = $('tr[id] td[valign=middle][title="'+t+'"]').next();
				//console.log($(sel[1]).parent());
				//for(j=1; j<subrow; j++) {
				//var sel = $('tr[id=r'+c_i+'] td[valign=middle][title="'+t+'"]').next();
				//for (ii=0; ii<sel.length; ii++) {
				if (sel.text().length == 0) {
					ar[n] = addarr(cels2,-17,k);
					n++;
					if(m === 0){
						kk = 0;
						cn = 0;
						ck = 0;
						//$('tr[id='+c_i+'] td[valign=middle][title="'+item+'"]_'+j).each( function() {
					//console.log($('tr[id] td[valign=middle][title]').length);
						//for (var ii=0; ii<sel.length; ii++) {
						//$('tr[id=r'+c_i+'] td[valign=middle][title="'+t+'"]').attr('title',''+t+'_'+ii);
						//$(sel).prev().attr('title',''+t+'_'+j);
						var cels2 = $(sel).parent();
				    	var cels = $('td', cels2);
						kk = parseFloat($(cels[10+m]).text().replace(/ /g, ''));
						//console.log(kk);
                    	cn = parseFloat($(cels[7+m]).text().replace('©', '').replace(/ /g, ''));
						if(kk!==0) ck = cn /kk;
                        if(isNaN(kk)) ck = 0;
						$('tr[id=r'+c_i+'] > td:nth-child(5) > div:nth-child(4)').append('<span style="display:block;color:#f00;"><span title="Цена за единицу качества (Ц/К)">©'+ck.toFixed(2)+'</span></span>');
                        var but_1 = $('<input type="button" rel="'+k+'" value="+1п" />').unbind('click').click(function() { add($(this).attr('rel'),1,txt); });
						var but_2 = $('<input type="button" rel="'+k+'" value="+2п" />').unbind('click').click(function() { add($(this).attr('rel'),2,txt); });
						$('tr[id=r'+c_i+'] > td:nth-child(6)').append(but_1).append(but_2);
						$('tr[id=r'+c_i+'] > td:nth-child(5)').prepend('<div class="divtemp" id="divtemp'+k+'" style="color:green"></div>');
					}
					txt[k] = addarr(cels2,-17,k);
					k++;
				}

				if( m>0 )
					$('tr[id=r'+c_i+'] td[valign=middle][title="'+t+'_0"]').next().next().next().next().remove();
				//cel = $('<td width="100" class="temp'+t+'" rowspan="'+subrow+'"></td>');
				cel = $('<td width="100" class="temp'+t+'" rowspan="'+subrow+'"></td>');
				$('tr[id=r'+c_i+'] td[valign=middle][title="'+t+'_0"]').next().next().next().after(cel);

				if(ar.length>0){
					var cf=0, kf=0, cnf=0, cnkf=0;
					for(j=0; j<ar.length; j++){
						cf += parseInt(ar[j].col);
					}
					if(cf > 0){
						for(j=0; j<ar.length; j++){
							kf += parseFloat(ar[j].cach * ( ar[j].col / cf ));
							cnf += parseFloat(ar[j].summ * ( ar[j].col / cf ));
						}
					    if(kf!==0) cnkf = cnf / kf;
						if(isNaN(kf)){
							kf = 0;
							cnf = 0;
					        cnkf = 0;
						}
					}else{
						kf = 0;
						cnf = 0;
					    cnkf = 0;
					    var b = true;
					}
					var table = $('<table cellpadding="0" cellspacing="0" width="100%" class="noborder"><tr><td style="word-wrap:normal" align="right">'+num(cf, false)+'</td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+kf.toFixed(2)+'<span title="Цена за единицу качества (Ц/К)">(©'+cnkf.toFixed(2)+')</span></td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">©'+num(cnf, true)+'</td><td align="right" style="color:#f00;"></td></tr></table>');
					$(cel).html('').append(table).css('background-color','#efe');
					addtablemax(ar, table, 1);
				}
				$('temp'+t).remove();
				$('tr[id=r'+c_i+'] td[valign=middle][title="'+t+'_0"]').next().next().next().after(cel);
			}
		};
		updatetablepr(0);
		$('input[class*="quickchange"]').unbind('keyup').keyup(function(e){
			if (timeout) clearTimeout(timeout);
			timeout = setTimeout(function() {
			updatetablepr(7);
			if (e.keyCode == 13) return;
			}, delay);});
		but_ras = $('<input type="button" value="Расчет" />').unbind('click').click(function() { Calculate1(1); });

		break;

		case 0:
		addtablemax = function (ar, table, t){
			var cf=0, kf=0, cnf=0, cnkf=0, bf=0, b=false;
			for(i=0; i<ar.length; i++){
                if(ar[i].col > ar[i].max){
					cf += parseInt(ar[i].max);
                    if(ar[i].col>0) b = true;}
                else
					cf += parseInt(ar[i].col);
			}
			if(cf !== 0){
				for(i=0; i<ar.length; i++){
					if(ar[i].col > ar[i].max){
						kf += parseFloat(ar[i].cach * ( ar[i].max / cf ));
						cnf += parseFloat(ar[i].summ * ( ar[i].max / cf ));
                        //if((kf===0) || (isNaN(kf))) kf = 1;
						bf += parseFloat(ar[i].brend * ( ar[i].max / cf ));
						b = true;
					}else{
						kf += parseFloat(ar[i].cach * ( ar[i].col / cf ));
						cnf += parseFloat(ar[i].summ * ( ar[i].col / cf ));
                        //if((kf===0) || (isNaN(kf))) kf = 1;
						bf += parseFloat(ar[i].brend * ( ar[i].col / cf ));
					}
				}
                cnkf = cnf / kf;
				if(isNaN(kf)){
					kf = 0;
					cnf = 0;
					bf = 0;
					cnkf = 0;
					}
			}
            //if((kf===0) || (isNaN(kf))) kf = 1;
            if(b){
				table.closest('td').css('background-color','#fee');
				var n = 0;
				$('tr', table).each( function() {
					var cels = $('td', this);
					//if(n == 0)	$(cels[1]).append(num(cf, false));
					//if(n == 1)	$(cels[1]).append(kf.toFixed(2)+'<span title="Цена за единицу качества (Ц/К) с учетом запасов">($'+cnkf.toFixed(2)+')</span>');
					//if(n == 2 && t == 0)	$(cels[1]).append(bf.toFixed(2));
					//if(n == 3 && t == 0)	$(cels[1]).append('$'+num(cnf, true));
					//if(n == 2 && t == 1)	$(cels[1]).append('$'+num(cnf, true));
                    switch (n) {
                        case 1:	$(cels[1]).append(kf.toFixed(2)+'<span title="Цена за единицу качества (Ц/К) с учетом запасов">(©'+cnkf.toFixed(2)+')</span>');
                        break;
                        case 2:	if(t === 0)	$(cels[1]).append(bf.toFixed(2));
                           else if(t == 1)	$(cels[1]).append('©'+num(cnf, true));
                        break;
                        case 3:	if(t === 0)	$(cels[1]).append('©'+num(cnf, true));
                        break;
                        default:$(cels[1]).append(num(cf, false));
                        break;
                    }
					n++;
				});
			}
		};
		createtable = function (ar, i, t){
			if(ar.length>0){
				var cf=0, kf=0, cnf=0, cnkf=0, bf=0;
				for(i=0; i<ar.length; i++){
					cf += parseInt(ar[i].col);
				}
				if(cf > 0){
					for(i=0; i<ar.length; i++){
                        //if((kf===0) || (isNaN(kf))) kf = 1;
						kf += parseFloat(ar[i].cach * ( ar[i].col / cf ));
						cnf += parseFloat(ar[i].summ * ( ar[i].col / cf ));
						bf += parseFloat(ar[i].brend * ( ar[i].col / cf ));
					}
					if(kf!==0) cnkf = cnf / kf;
					if(isNaN(kf)){
						kf = 0;
						cnf = 0;
						bf = 0;
					    cnkf = 0;
					    }
				}else{
					kf = 0;
					cnf = 0;
					bf = 0;
					cnkf = 0;
					}
                if(t === 0){
					var table = $('<table width="100%" style="margin-top:-17px;margin-bottom:60px;" class="noborder"><tr><td class="zcol" align="right">'+num(cf, false)+'</td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+kf.toFixed(2)+'<span title="Цена за единицу качества (Ц/К)">(©'+cnkf.toFixed(2)+')</span></td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+bf.toFixed(2)+'</td><td align="right" style="color:#f00;"></td></tr><td align="right">©'+num(cnf, true)+'</td><td align="right" style="color:#f00;"></td></tr></table>');
				//	var table = $('<table width="100%" style="margin-top:-17px" class="noborder"><tr><td class="zcol" align="right">'+cf.toFixed(0)+'</td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+kf.toFixed(2)+'('+cnkf.toFixed(2)+')</td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+bf.toFixed(2)+'</td><td align="right" style="color:#f00;"></td></tr><td align="right">$'+cnf.toFixed(2)+'</td><td align="right" style="color:#f00;"></td></tr></table>');
                    }
				if(t == 1) table = $('<table cellpadding="0" cellspacing="0" width="100%" class="noborder"><tr><td align="right">'+num(cf, false)+'</td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+kf.toFixed(2)+'<span title="Цена за единицу качества (Ц/К)">(©'+cnkf.toFixed(2)+')</span></td><td align="right" style="color:#f00;"></td></tr><td align="right">©'+num(cnf, true)+'</td><td align="right" style="color:#f00;"></td></tr></table>');
                //if(t == 1) var table = $('<table cellpadding="0" cellspacing="0" width="100%" class="noborder"><tr><td align="right">'+cf.toFixed(0)+'</td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+kf.toFixed(2)+'('+cnkf.toFixed(2)+')</td><td align="right" style="color:#f00;"></td></tr><td align="right">$'+cnf.toFixed(2)+'</td><td align="right" style="color:#f00;"></td></tr></table>');
                $(cel).html('').append(table).css('background-color','#efe');
				addtablemax(ar, table, t);
				return 0;
			}
			return i;
		};
		newtype = function (id, title, subrow){
			this.id = id;
			this.title = title;
			this.subrow = subrow;
		};
		addarr = function (item, n, id){
			var ar = [],c = 0,k = 0,cn = 0,br = 0,sv = 0,max = 0;
			$(item).each( function() {
				var cels = $('td', this);
					c = parseInt($('input', cels[18+n]).val().replace(/ /g, ''));
					k = parseFloat($(cels[28+n]).text().replace(/ /g, ''));
					cn = parseFloat($(cels[23+n]).text().replace('©', '').replace(/ /g, ''));
					br = 0;
					sv = parseInt($(cels[36+n]).text().replace(/ /g, ''));
					max = parseInt($('span', cels[18+n]).text().replace('Max: ', '').replace(/ /g, ''));
					k = nullpr(k);
                $(cels[36+n]).unbind('click').click(function(){
                    if(isNaN(max)) max = sv;
				    if(sv < max) max = sv;
                    $('input', cels[18+n]).val(max);
                    updatetablepr(7);
                    });
                $(cels[35+n]).unbind('click').click(function(){
                    if(isNaN(max)) max = sv;
				    if(sv < max) max = sv;
                    $('input', cels[18+n]).val(max);
                    updatetablepr(7);
                    });
                if(!isNaN(max)) {$('span', cels[18+n]).unbind('click').click(function(){
                    if(isNaN(max)) max = sv;
				    if(sv < max) max = sv;
                    $('input', cels[18+n]).val(max);
                    updatetablepr(7);
                    });}
			});
			if(isNaN(max)) max = sv;
			if(sv < max) max = sv;
            if(isNaN(c)) c = 0;
			ar = new addar(c, cn, k, br, max);
			return ar;
		};
		type=[];
		i=0;
		k=0;
		$('.list th:contains(Поставки)').before('<th rowspan="2">Заказ</th>');
		//console.log (a2);
		//if (a2 == "pply") {
		//if (typeof gaMaterialProduct !== "undefined") {
		updatetablepr = function (m){
		if (a2 == "pply") {
		//if (typeof gaMaterialProduct !== "undefined") {
			for (var item in gaMaterialProduct) {
				var t = $('#product_row_'+item+' th [rowspan=2] img').attr('alt'),
					subrow = gaMaterialProduct[item].subRowCount,
					ar = [],
					n = 0;
				type[i] = new newtype(item,t,subrow);
				i++;

				ar[n] = addarr('#product_row_'+item,m,k);
				n++;

				if(m === 0){
					var kk = 0,cn = 0,ck = 0;
					$('#product_row_'+item).each( function() {
				    var cels = $('td', this);
					kk = parseFloat($(cels[28+m]).text().replace(/ /g, ''));
					cn = parseFloat($(cels[23+m]).text().replace('©', '').replace(/ /g, ''));
					if(kk!==0) ck = cn /kk;
                    if(isNaN(kk)) ck = 0;
					$('#product_row_'+item+' #name_'+item+'_0').next().next().append('<span style="display:block;color:#f00;"><span title="Цена за единицу качества (Ц/К)">©'+ck.toFixed(2)+'</span></span>');
                    var but_1 = $('<input type="button" rel="'+k+'" value="+1п" />').unbind('click').click(function() { add($(this).attr('rel'),1,txt); });
					var but_2 = $('<input type="button" rel="'+k+'" value="+2п" />').unbind('click').click(function() { add($(this).attr('rel'),2,txt); });
					$('#product_row_'+item+' #name_'+item+'_0').prepend('<br />').prepend(but_2).prepend(but_1);
					$('#product_row_'+item+' #name_'+item+'_0').next().prepend('<div class="divtemp" id="divtemp'+k+'" style="color:green"></div>');
                    });}
				txt[k] = addarr('#product_row_'+item,m,k);
				k++;

                for(j=1; j<subrow; j++){
					ar[n] = addarr('#product_sub_row_'+item+'_'+j,-17,k);
					n++;
					if(m === 0){
						kk = 0;
						cn = 0;
						ck = 0;
						$('#product_sub_row_'+item+'_'+j).each( function() {
				    	var cels = $('td', this);
						kk = parseFloat($(cels[11+m]).text().replace(/ /g, ''));
                    	cn = parseFloat($(cels[6+m]).text().replace('©', '').replace(/ /g, ''));
						if(kk!==0) ck = cn /kk;
                        if(isNaN(kk)) ck = 0;
						$('#product_sub_row_'+item+'_'+j+' #name_'+item+'_'+j).next().next().append('<span style="display:block;color:#f00;"><span title="Цена за единицу качества (Ц/К)">©'+ck.toFixed(2)+'</span></span>');
                        var but_1 = $('<input type="button" rel="'+k+'" value="+1п" />').unbind('click').click(function() { add($(this).attr('rel'),1,txt); });
						var but_2 = $('<input type="button" rel="'+k+'" value="+2п" />').unbind('click').click(function() { add($(this).attr('rel'),2,txt); });
						$('#product_sub_row_'+item+'_'+j+' #name_'+item+'_'+j).prepend('<br />').prepend(but_2).prepend(but_1);
						$('#product_sub_row_'+item+'_'+j+' #name_'+item+'_'+j).next().prepend('<div class="divtemp" id="divtemp'+k+'" style="color:green"></div>');
                    });}
					txt[k] = addarr('#product_sub_row_'+item+'_'+j,-17,k);
					k++;
				}

				if( m>0 )
					$('#product_row_'+item+' #name_'+item+'_0').prev().remove();

				cel = $('<td width="100" class="temp'+item+'" rowspan="'+subrow+'"></td>');
				$('#product_row_'+item+' #name_'+item+'_0').before(cel);

				if(ar.length>0){
					var cf=0, kf=0, cnf=0, cnkf=0;
					for(j=0; j<ar.length; j++){
						cf += parseInt(ar[j].col);
					}
					if(cf > 0){
						for(j=0; j<ar.length; j++){
                            if((ar[j].cach===0) || (isNaN(ar[j].cach))) ar[j].cach = 1;
							kf += parseFloat(ar[j].cach * ( ar[j].col / cf ));
                            //if((kf===0) || (isNaN(kf))) kf += 1;
                            //console.log(kf);
							cnf += parseFloat(ar[j].summ * ( ar[j].col / cf ));
						}
					    if(kf!==0) cnkf = cnf / kf;
						if(isNaN(kf)){
							kf = 0;
							cnf = 0;
					        cnkf = 0;
						}
					}else{
						kf = 0;
						cnf = 0;
					    cnkf = 0;
					    var b = true;
					}
                    //if((kf===0) || (isNaN(kf))) kf = 1;
                    var table = $('<table cellpadding="0" cellspacing="0" width="100%" class="noborder"><tr><td style="word-wrap:normal" align="right">'+num(cf, false)+'</td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">'+kf.toFixed(2)+'<span title="Цена за единицу качества (Ц/К)">(©'+cnkf.toFixed(2)+')</span></td><td align="right" style="color:#f00;"></td></tr><tr><td align="right">©'+num(cnf, true)+'</td><td align="right" style="color:#f00;"></td></tr></table>');
					$(cel).html('').append(table).css('background-color','#efe');
					addtablemax(ar, table, 1);
				}
				$('temp'+item).remove();
				$('#product_row_'+item+' #name_'+item+'_0').before(cel);
			}
		};
		};
		updatetablepr(0);
		//};
		$('input[name*=supplyContractData]').unbind('keyup').keyup(function(e){
			if (timeout) clearTimeout(timeout);
			timeout = setTimeout(function() {
			updatetablepr(7);
			if (e.keyCode == 13) return;
			}, delay);});
		but_ras = $('<input type="button" value="Расчет" />').unbind('click').click(function() { Calculate1(1); });
	}
	}

	if(title.search('warehouse')!=-1){
		//var nasklade = [];
		//console.log(title);

		var sortzak = function (){
			var i = 0, j = 0, n = 0;
			for(n = 0; n < txt1.length; n++){
				var ar1 = [], ar2 = [];
				for(i = 0; i < txt1[n].length; i++){
					if(txt1[n][i].sc > txt1[n][i].cach){
						ar1.push(txt1[n][i]);
					}else{
						ar2.push(txt1[n][i]);
					}
				}
				ar1.sort(function(obj1, obj2) {
					return obj2.ck - obj1.ck;
				});
				ar2.sort(function(obj1, obj2) {
					return obj1.ck - obj2.ck;
				});
				txt1[n] = [];
				txt1[n] = txt1[n].concat(ar1,ar2);
				var div = $('<div>');
				for(i = txt1[n].length-1; i >= 0; i--){
					//console.log(i);
					$('.'+txt1[n][i].name).after($('.'+txt1[n][i].name+txt1[n][i].id));
					//$('.'+txt1[n][i].name+txt1[n][i].id).hide()
				}
			}
		};
		var randWD = function (n){  // [ 2 ] random words and digits
			return Math.random().toString(36).slice(2, 2 + Math.max(1, Math.min(n, 10)) );
		};
		var ssred = function (cel,ar,t) {
			var cf=0, kf=0, cnf=0, cnkf=0, b = false;
			for(i=0; i<ar.length; i++){
				if(ar[i].col <= ar[i].max || t)
                    cf += parseInt(ar[i].col);
                else {
                    cf += parseInt(ar[i].max);
                    if(ar[i].col>0) b = true;}
			}
			if(cf > 0){
				for(i=0; i<ar.length; i++){
					if(ar[i].col <= ar[i].max || t){
						kf += parseFloat(ar[i].cach * ( ar[i].col / cf ));
						cnf += parseFloat(ar[i].summ * ( ar[i].col / cf ));
					}else{
						kf += parseFloat(ar[i].cach * ( ar[i].max / cf ));
						cnf += parseFloat(ar[i].summ * ( ar[i].max / cf ));
						b = true;
					}
				}
				if(kf !== 0) cnkf = cnf / kf;
				if(isNaN(kf)){
					kf = 0;
					cnf = 0;
					cnkf = 0;
				}
			} else {
				kf = 0;
				cnf = 0;
				cnkf = 0;
				}
            //if((kf===0) || (isNaN(kf))) kf = 1;
			if(t) {
				$('.cf',cel).text(num(cf, false)).unbind('click').click(function(){$('#sc').val(cf); $('#sk').val(kf.toFixed(2));});//updatetablesk(false,falsee);});
				$('.cnf',cel).text('©'+num(cnf, true));
				$('.kf',cel).text(kf.toFixed(2)+'(©'+cnkf.toFixed(2)+')');
				$(cel).css({'background-color':'#efe'});
				if(cf!==0) ssred(cel,ar,false);
			}
			if(b) {
				$(cel).css({'background-color':'#fee'});
				$('.cf',cel).append('<div style="color:#f00;">'+num(cf, false)+'</div>').unbind('click').click(function(){$('#sc').val(cf); $('#sk').val(kf.toFixed(2));});//updatetablesk(false,true);});
				$('.cnf',cel).append('<div style="color:#f00">©'+num(cnf, true)+'</div>');
				$('.kf',cel).append('<div style="color:#f00">'+kf.toFixed(2)+'(©'+cnkf.toFixed(2)+')</div>');
			}
		};

   var createtablesk = function (t, sort) {
			sort = sort || false;
			var ar = [], cel, n=0;
			var txt2 = [];
			var name = '';
			j = 0;
			form = true;
			$('table.list tr').each( function() {
				var cels = $('td',this);
                if($(this).hasClass('p_title')) {
   					name = 'q'+randWD(3);
					$(this).addClass(name);
					if(t) {
						ko[j] = parseFloat($(cels[4]).text());
						var skach = $('<input>', {'type':'text', 'class':'skach','style':'display:block;','ids':j}).val(ko[j]).unbind('keyup').keyup(function(e){
							if (timeout) clearTimeout(timeout);
							timeout = setTimeout(function() {
							createtablesk(false, true);
							if (e.keyCode == 13) return;
							}, delay);});
						$('.p_title_l', this).prepend(skach);

						if($('.p_title_l div table',$(this)).html().length < 25){
                            var cn = parseFloat($(cels[3]).text().replace(/\s+/g, '').replace(/\$/g, '')),
                                k = parseFloat($(cels[5]).text().replace(/ /g, '')),
                                cf = parseInt($(cels[1]).text().replace(/ /g, '')),
                                naskl = parseInt($('.'+name+' div table tr td:contains("На складе:")').next().text().replace(/ /g, '')),
                                nasklpp = parseInt($('.'+name+' div table tr td:contains("Отгрузки")').next().text().replace(/ /g, '')),
                                cnk = 0;
                            cnk = cn / k;
							if(isNaN(cnk)) cnk=0;
                            if((k===0) || (isNaN(k))) k=1;
							if (cf>0 || (!isNaN(naskl) && !isNaN(nasklpp) && (naskl > nasklpp)))
                            $('.p_title_l div table',$(this))
        							.after('<tr><td>Качество/Себестоимость:</td><td><strong style="display:block;" class="ccf1"></strong></td></tr>')
        							.after('<tr><td>На складе:</td><td><strong style="display:block;" class="ccf"></strong></td></tr>')
        							.after('<tr><td colspan="2"><strong>После пересчета</strong></td></tr>');
                            if(cf>0&&k>0) $(cels[1]).append('<strong style="display:block" class="cf"></strong>');
                            else $(cels[1]).html('').append('<strong style="display:block" class="cf"></strong>');
							$(cels[3]).append('<strong style="display:block" class="cnf"></strong>');
                            if(cnk!==0) $(cels[5]).html('<b>'+parseFloat($(cels[5]).text()).toFixed(2)+'</b>').append('<b>(©'+cnk.toFixed(2)+')</b><strong style="display:block" class="kf"></strong>');
                            else $(cels[5]).append('<strong style="display:block" class="kf"></strong>');
						}else{
						    if($('.p_title_l div table',$(this)).html().length < 128){
                                cn = parseFloat($(cels[5]).text().replace(/\s+/g, '').replace(/\$/g, ''));
                                k = parseFloat($(cels[7]).text().replace(/ /g, ''));
								cf = parseInt($(cels[3]).text().replace(/ /g, ''));
                                naskl = parseInt($('.'+name+' div table tr td:contains("На складе:")').next().text().replace(/ /g, ''));
                                nasklpp = parseInt($('.'+name+' div table tr td:contains("Отгрузки")').next().text().replace(/ /g, ''));
                                cnk = 0;
                            cnk = cn / k;
					        if(isNaN(cnk)) cnk=0;
                            if((k===0) || (isNaN(k))) k=1;
                            if (cf>0 || (!isNaN(naskl) && !isNaN(nasklpp) && (naskl > nasklpp)))
                            $('.p_title_l div table',$(this))
        						    .append('<tr><td colspan="2"><strong>После пересчета</strong></td></tr>')
                                    .append('<tr><td>На складе:</td><td><strong style="display:block;" class="ccf"></strong></td></tr>')
                                    .append('<tr><td>Качество/Себестоимость:</td><td><strong style="display:block;" class="ccf1"></strong></td></tr>');
                            if(cf>0&&k>0) $(cels[3]).append('<strong style="display:block" class="cf"></strong>');
                            else $(cels[3]).html('').append('<strong style="display:block" class="cf"></strong>');
							$(cels[5]).append('<strong style="display:block" class="cnf"></strong>');
                            if(cnk!==0) $(cels[7]).html('<b>'+parseFloat($(cels[7]).text()).toFixed(2)+'</b>').append('<b>(©'+cnk.toFixed(2)+')</b><strong style="display:block" class="kf"></strong>');
                            else $(cels[7]).append('<strong style="display:block" class="kf"></strong>');
                            }else{
       						    if($('.p_title_l div table',$(this)).html().length < 250){
					            cn = parseFloat($(cels[7]).text().replace(/\s+/g, '').replace(/\$/g, ''));
                                k = parseFloat($(cels[9]).text().replace(/ /g, ''));
								cf = parseInt($(cels[5]).text().replace(/ /g, ''));
                                naskl = parseInt($('.'+name+' div table tr td:contains("На складе:")').next().text().replace(/ /g, ''));
                                nasklpp = parseInt($('.'+name+' div table tr td:contains("Отгрузки")').next().text().replace(/ /g, ''));
                                cnk = 0;
                                cnk = cn / k;
					 			if(isNaN(cnk)) cnk=0;
                                if((k===0) || (isNaN(k))) k=1;
                                if (cf>0 || (!isNaN(naskl) && !isNaN(nasklpp) && (naskl > nasklpp)))
                                $('.p_title_l div table',$(this))
        							.after('<tr><td>Качество/Себестоимость:</td><td><strong style="display:block;" class="ccf1"></strong></td></tr>')
        							.after('<tr><td>На складе:</td><td><strong style="display:block;" class="ccf"></strong></td></tr>')
        							.after('<tr><td colspan="2"><strong>После пересчета</strong></td></tr>');
                                if(cf>0&&k>0) $(cels[5]).append('<strong style="display:block" class="cf"></strong>');
                                else $(cels[5]).html('').append('<strong style="display:block" class="cf"></strong>');
							    $(cels[7]).append('<strong style="display:block" class="cnf"></strong>');
                                if(cnk!==0) $(cels[9]).html('<b>'+parseFloat($(cels[9]).text()).toFixed(2)+'</b>').append('<b>(©'+cnk.toFixed(2)+')</b><strong style="display:block" class="kf"></strong>');
                                else $(cels[9]).append('<strong style="display:block" class="kf"></strong>');
                                }else{
                                    cn = parseFloat($(cels[9]).text().replace(/\s+/g, '').replace(/\$/g, ''));
                                    k = parseFloat($(cels[11]).text().replace(/ /g, ''));
									cf = parseInt($(cels[7]).text().replace(/ /g, ''));
                                    naskl = parseInt($('.'+name+' div table tr td:contains("На складе:")').next().text().replace(/ /g, ''));
                                    nasklpp = parseInt($('.'+name+' div table tr td:contains("Отгрузки")').next().text().replace(/ /g, ''));
                                    cnk = 0;
                                    cnk = cn / k;
									if(isNaN(cnk)) cnk=0;
                                    if((k===0) || (isNaN(k))) k=1;
                                    if (cf>0 || (!isNaN(naskl) && !isNaN(nasklpp) && (naskl > nasklpp)))
                                    $('.p_title_l div table',$(this))
                                    	.after('<tr><td>Качество/Себестоимость:</td><td><strong style="display:block;" class="ccf1"></strong></td></tr>')
        								.after('<tr><td>На складе:</td><td><strong style="display:block;" class="ccf"></strong></td></tr>')
        								.after('<tr><td colspan="2"><strong>После пересчета</strong></td></tr>');
        							if(cf>0&&k>0) $(cels[7]).append('<strong style="display:block" class="cf"></strong>');
                                    else $(cels[7]).html('').append('<strong style="display:block" class="cf"></strong>');
        							$(cels[9]).append('<strong style="display:block" class="cnf"></strong>');
                                    if(cnk!==0) $(cels[11]).html('<b>'+parseFloat($(cels[11]).text()).toFixed(2)+'</b>').append('<b>(©'+cnk.toFixed(2)+')</b><strong style="display:block" class="kf"></strong>');
                                    else $(cels[11]).append('<strong style="display:block" class="kf"></strong>');
                                    }
					            }
						     }
					     }

					//name = 'q'+randWD(3);
					//$(this).addClass(name);
                    //alert (name);
					if(txt2.length > 0){
						txt1[j-1] = [];
						txt1[j-1] = txt2;
					}

					j++;
					if(i > 0){
						ssred(cel,ar,true);
					}
					cel = this;
					ar = [];
					txt2 = [];
					i = 0;
                }
				if($(this).hasClass('odd') || $(this).hasClass('even')){
					var c = parseInt($('input[name*=supplyContractData]',cels[1]).val().replace(/ /g, '')),
						max = parseInt($(cels[8]).text().replace(/ /g, '')),
                        str = $(cels[8]).html(),
                        ck = 0,
                        sv = 0,
                        vsego = 0;
						cn = parseFloat($(cels[3]).text().replace('©', '').replace(/ /g, ''));
						k = parseFloat($(cels[5]).text().replace(/ /g, ''));

                        if(str.indexOf('из') > -1)
                        str = str.substring( (str.indexOf('из') + 2), str.length);
                        sv = parseInt(str.replace(/ /g, ''));
                        vsego = parseInt(str.substring( (str.indexOf('>') + 1), str.length).replace(/ /g, ''));
                        if(isNaN(max)) max = 10000000000000000;
                        if(sv < max)
                        max = sv;

                        if(k!==0) ck = cn / k;
                        if(isNaN(k)) ck = 0;
                        if(isNaN(c)) c = 0;
                        k = nullpr(k);
                        if((k===0) || (isNaN(k))) k = 1;

						txt2[i] = new addar(c, cn, k, 0, max, $('.skach[ids='+(j-1)+']').val(), name, i );

						if(c == max){
							$(cels[8]).css('background-color','#EFE');
							$('span', cels[8]).css('color','#000');
						}
						else {if(max===0&&k===0){
							 $(cels[8]).css('background-color','#EFE');
							 $('span', cels[8]).css('color','red');
						     }
                             else {if(c > max){
							      $(cels[8]).css('background-color','#FEE');
							      $('span', cels[8]).css('color','red');
                                  }
                                  else {if(c < max){
							           $(cels[8]).css('background-color','#EFE');
							           $('span', cels[8]).css('color','#000');
						               }}}}
						ar[i] = new addar(c, cn, k, 0, max );


						if($('.skach[ids='+(j-1)+']').val() < k)
							$(this).css('background-color','#E9E8FF');
						else
							$(this).css('background-color','#EAEAEA');
                        if(t){
						//	$(cels[8]).click(function(){
						//		var tr = $(this).closest('tr'),
						//			max = parseInt($(this).text().replace(/ /g, '')),
                        //          str = $(cels[8]).html(),
                        //            sv = 0;
                        //        if(str.indexOf('из') > -1)
                        //        str = str.substring( (str.indexOf('из') + 2), str.length);
                        //        sv = parseInt(str.replace(/ /g, ''));
                        //        if(isNaN(max)) max = 0;
                        //        if(sv < max)
                        //        max = sv;
						//		$('input[type=text]', tr).val(max);
						//		updatetablesk(false, name);
						//	});

							$(cels[5]).append('<span style="display:block;color:#f00;"><span title="Цена за единицу качества (Ц/К)">©'+ck.toFixed(2)+'</span>');
							var but_1 = $('<input type="button" rel="'+n+'" value="+1п" />').unbind('click').click(function() { add($(this).attr('rel'),1,txt); });
							var but_2 = $('<input type="button" rel="'+n+'" value="+2п" />').unbind('click').click(function() { add($(this).attr('rel'),2,txt); });
							$(cels[0]).prepend('<br />').prepend(but_2).prepend(but_1);
							$(cels[1]).prepend('<div class="divtemp" id="divtemp'+n+'"></div>');
							txt[n] = new addar(c, cn, k, 0, max );
							n++;
                        }
						$(this).addClass(name+i);
						i++;
				}
				if(!$(this).hasClass('odd') && !$(this).hasClass('even') && !$(this).hasClass('p_title') && i>0){
					if(txt2.length > 0){
						txt1[j-1] = [];
						txt1[j-1] = txt2;
					}
					ssred(cel,ar,true);
					if(sort) sortzak ();

					var nasklade = {};
					for(i = 0; i < txt1.length; i++){

						//if ($(" div table tr td:contains('На складе')").length) {
                        nasklade.nasklade = parseInt($('.'+ txt1[i][0].name +' div table tr td:contains("На складе")').next().text().replace(/ /g, ''));
                        //nasklade.nasklade = parseInt($('.p_title_l div table tr td:contains("На складе")').next().text().replace(/ /g, ''));
                        //nasklade.nasklade = parseInt(nasklade.nasklade.replace(/ /g, ''));
                        if(isNaN(nasklade.nasklade)) nasklade.nasklade = 0;
                        //alert (txt1[i][0].name);

						nasklade.naskladecach = $('.'+ txt1[i][0].name +' div table tr td:contains("Качество/Себестоимость")').next().text();
                        //nasklade.naskladecach = $('.p_title_l div table tr td:contains("Качество/Себестоимость")').next().text();
						nasklade.naskladecena = nasklade.naskladecach;
                        nasklade.naskladecach = parseFloat(nasklade.naskladecach.replace('©', '').replace(/ /g, ''));
                        if(isNaN(nasklade.naskladecach)) nasklade.naskladecach = 0;

						//nasklade.naskladecena = $('.'+ txt1[i][0].name +' div table tr td:contains("Качество/Себестоимость")').next().text();
						nasklade.naskladecena = parseFloat(nasklade.naskladecena.substr(nasklade.naskladecena.indexOf('©')).replace('©', '').replace(/ /g, ''));
                        if(isNaN(nasklade.naskladecena)) nasklade.naskladecena = 0;
                        // }else {
                        //if(isNaN(nasklade.nasklade)) nasklade.nasklade = 0;
                        //if(isNaN(nasklade.naskladecach)) nasklade.naskladecach = 0;
                        //if(isNaN(nasklade.naskladecena)) nasklade.naskladecena = 0;

						nasklade.otgruzki = parseInt($('.'+ txt1[i][0].name +' div table tr td:contains("Отгрузки")').next().text().replace(/ /g, ''));
						//nasklade.otgruzki = parseInt(nasklade.otgruzki.replace(/ /g, ''));
						if(isNaN(nasklade.otgruzki))
							nasklade.otgruzki = 0;

						var cf1 = nasklade.nasklade - nasklade.otgruzki;
						if(cf1 < 0)
						   cf1 = 0;

						cf = parseInt($('.'+ txt1[i][0].name +' .cf div').text().replace(/ /g, ''));
						if(isNaN(cf))
							cf = parseInt($('.'+ txt1[i][0].name +' .cf').text().replace(/ /g, ''));

						var col = nasklade.nasklade - nasklade.otgruzki;
						if(col < 0)
						   col = 0;
						if(isNaN(col)) col = 0;
						col += cf;
						if (col === 0) q1 = 0;
                        else var q1 = parseFloat( cf1 / col);
						if (col === 0) q2 = 0;
                        else var q2 = parseFloat( cf / col);

						var kf = parseFloat($('.'+ txt1[i][0].name +' .kf div').text().replace(/ /g, ''));
                        if(isNaN(kf))
							kf = parseFloat($('.'+ txt1[i][0].name +' .kf').text().replace(/ /g, ''));
						var cnf = parseFloat($('.'+ txt1[i][0].name +' .cnf div').text().replace('©', '').replace(/ /g, ''));
						if(isNaN(cnf))
							cnf = parseFloat($('.'+ txt1[i][0].name +' .cnf').text().replace('©', '').replace(/ /g, ''));
						var r1 = parseFloat(q1 * nasklade.naskladecach + q2 * kf);
                        var r2 = parseFloat(q1 * nasklade.naskladecena + q2 * cnf);

						$('.'+ txt1[i][0].name +' .ccf').text(num(col, false));
						$('.'+ txt1[i][0].name +' .ccf1').text(num(r1, true)+'/©'+num(r2, true));
                        //$('.p_title_l .ccf1').text(r1.toFixed(2)+'/$'+r2.toFixed(2));
                        //ssred(cel,ar,true);
					}}
                });

       			//if(sort)
				//   sortzak();
        //alert(n);
        //return txt1;
        };

    var updatetablesk = function (name) {
			//var sort = sort || false;
			var ar = [];
            var cel;
            var n=0;
			var txt2 = [];
            var txt1 = [];
            //alert (name);
            //name = name.substr(0,3);
			//j = 1;
			form = true;
			$('table.list tr[class*="'+name+'"]').each( function() {
            //$('table.list tr').each( function() {
                //$('table.list tr[class*="'+name+'"]').each( function() {
				var cels = $('td',this);
                if($(this).hasClass('p_title')){
                    //name = $(this).attr('class').substr(8);
   						//ko[j] = parseFloat($(cels[4]).text());
						//var skach = $('<input>', {'type':'text', 'class':'skach','style':'display:block;','ids':j}).val(ko[j]);//.unbind('keyup').keyup(function(){
						//	updatetablesk(true, name);
						//});
						//$('.p_title_l', this).prepend(skach);

                    //alert(name);
					//if(txt2.length > 0){
					//	txt1[j-1] = [];
					//	txt1[j-1] = txt2;
					//}
					//j++;
					//if(i > 0) {
					//	ssred(cel,ar,true);
					//}
					cel = this;
					//ar = [];
					//txt2 = [];
					i = 0;
                }

                if ($(this).hasClass('odd') || $(this).hasClass('even')) {
                    //alert ('2');
					var c = parseInt($('input[name*=supplyContractData]',cels[1]).val().replace(/ /g, '')),
						cn = parseFloat($(cels[3]).text().replace('©', '').replace(/ /g, '')),
						k = parseFloat($(cels[5]).text().replace(/ /g, '')),
						max = parseInt($(cels[8]).text().replace(/ /g, '')),
                        str = $(cels[8]).html(),
                        ck = 0,
                        sv = 0,
                        vsego = 0;

                        if(str.indexOf('из') > -1)
                        str = str.substring( (str.indexOf('из') + 2), str.length);
                        sv = parseInt(str.replace(/ /g, ''));
                        vsego = parseInt(str.substring( (str.indexOf('>') + 1), str.length).replace(/ /g, ''));
                        if(isNaN(max)) max = 10000000000000000;
                        if(sv < max) max = sv;

                        if(k!==0) ck = cn / k;
                        if(isNaN(k)) ck = 0;
                        if(isNaN(c)) c = 0;
                        k = nullpr(k);
                        if((k===0) || (isNaN(k))) k = 1;

						txt2[i] = new addar(c, cn, k, 0, max, name, i);

						if(c == max){
							$(cels[8]).css('background-color','#EFE');
							$('span', cels[8]).css('color','#000');
						}
						else {if(max===0&&k===0){
							 $(cels[8]).css('background-color','#EFE');
							 $('span', cels[8]).css('color','red');
						     }
                             else {if(c > max){
							      $(cels[8]).css('background-color','#FEE');
							      $('span', cels[8]).css('color','red');
                                  }
                                  else {if(c < max){
							           $(cels[8]).css('background-color','#EFE');
							           $('span', cels[8]).css('color','#000');
						               }}}}
						ar[i] = new addar (c, cn, k, 0, max );


						//if($('.skach[ids='+(j-1)+']').val() < k)
						//	$(this).css('background-color','#E9E8FF');
						//else
						//	$(this).css('background-color','#EAEAEA');

						//){
							//$(cels[5]).append('<span style="display:block;color:#f00;"><span title="Цена за единицу качества (Ц/К)">$'+ck.toFixed(2)+'</span>');
							var but_1 = $('<input type="button" rel="'+n+'" value="+1п" />').unbind('click').click(function() { add($(this).attr('rel'),1,txt);});
							var but_2 = $('<input type="button" rel="'+n+'" value="+2п" />').unbind('click').click(function() { add($(this).attr('rel'),2,txt);});
							//$(cels[0]).prepend('<br />').prepend(but_2).prepend(but_1);
							//$(cels[1]).prepend('<div class="divtemp" id="divtemp'+n+'"></div>');
							//txt[n] = new addar(c, cn, k, 0, max );
							//n++;
						//
						//$(this).addClass(name+i);
						i++;
                }});
				//if(!$(this).hasClass('odd') && !$(this).hasClass('even') && !$(this).hasClass('p_title') && i>0){
				    //if(txt2.length > 0){
                        //alert (txt2.length)
						//txt1[j-1] = [];
						//txt1 = txt2;
					//}
					ssred(cel,ar,true);
					//if(sort)
					//	sortzak();

					var nasklade = {};
					//for(i = 0; i < txt2.length; i++){
						//if ($(" div table tr td:contains('На складе')").length) {
                        if ($('.' + name +' div table tr td:contains("На складе")').parent().prev().text() == "После пересчета") nasklade.nasklade = 0;
                        else nasklade.nasklade = parseInt($('.' + name +' div table tr td:contains("На складе")').next().text().replace(/ /g, ''));
                        //nasklade.nasklade = parseInt($('.p_title_l div table tr td:contains("На складе")').next().text().replace(/ /g, ''));
                        //nasklade.nasklade = parseInt(nasklade.nasklade.replace(/ /g, ''));
                        if(isNaN(nasklade.nasklade)) nasklade.nasklade = 0;
                        //alert (txt1[i][0].name);

						nasklade.naskladecach = $('.' + name + ' div table tr td:contains("Качество/Себестоимость")').next().text();
						nasklade.naskladecena = nasklade.naskladecach;
                        nasklade.naskladecach = parseFloat(nasklade.naskladecach.replace('©', '').replace(/ /g, ''));
						if(isNaN(nasklade.naskladecach)) nasklade.naskladecach = 0;

						//nasklade.naskladecena = $('.'+ txt1[i][0].name +' div table tr td:contains("Качество/Себестоимость")').next().text();
						nasklade.naskladecena = parseFloat(nasklade.naskladecena.substr(nasklade.naskladecena.indexOf('©')).replace('©', '').replace(/ /g, ''));
                        if(isNaN(nasklade.naskladecena)) nasklade.naskladecena = 0;
                        // }else {
                        //if(isNaN(nasklade.nasklade)) nasklade.nasklade = 0;
                        //if(isNaN(nasklade.naskladecach)) nasklade.naskladecach = 0;
                        //if(isNaN(nasklade.naskladecena)) nasklade.naskladecena = 0;

						nasklade.otgruzki = parseInt($('.' + name +' div table tr td:contains("Отгрузки")').next().text().replace(/ /g, ''));
                        //nasklade.otgruzki = parseInt($('.p_title_l div table tr td:contains("Отгрузки")').next().text().replace(/ /g, ''));
						//nasklade.otgruzki = parseInt(nasklade.otgruzki.replace(/ /g, ''));
						if(isNaN(nasklade.otgruzki))
							nasklade.otgruzki = 0;

						var cf1 = nasklade.nasklade - nasklade.otgruzki;
						if(cf1 < 0)
						   cf1 = 0;

						var cf = parseInt($('.' + name +' .cf div').text().replace(/ /g, ''));
						if(isNaN(cf))
							cf = parseInt($('.' + name +' .cf').text().replace(/ /g, ''));

						var col = nasklade.nasklade - nasklade.otgruzki;
						if(col < 0)
						   col = 0;

						col += cf;
						if (col === 0) q1 = 0;
                        else var q1 = parseFloat( cf1 / col);
						if (col === 0) q2 = 0;
                        else var q2 = parseFloat(cf / col);

						var kf = parseFloat($('.' + name +' .kf div').text().replace(/ /g, ''));
						if(isNaN(kf))
							kf = parseFloat($('.' + name +' .kf').text().replace(/ /g, ''));
						var cnf = parseFloat($('.' + name +' .cnf div').text().replace('©', '').replace(/ /g, ''));
						if(isNaN(cnf))
							cnf = parseFloat($('.' + name +' .cnf').text().replace('©', '').replace(/ /g, ''));
						var r1 = parseFloat(q1 * nasklade.naskladecach + q2 * kf);
						var r2 = parseFloat(q1 * nasklade.naskladecena + q2 * cnf);

						$('.' + name +' .ccf').text(num(col, false));
						$('.' + name +' .ccf1').text(num(r1, true)+'/©'+num(r2, true));
                        //$('.p_title_l .ccf1').text(r1.toFixed(2)+'/$'+r2.toFixed(2));
                        //}
                //}
                //if($(this).hasClass('p_title') && !$(this).hasClass('p_title_l') && $(this).attr('class').substr(8) != name) {alert($(this).attr('class'));return false;};
           //}
        //);
				//if(sort)
				//   sortzak();
        //return ar;
        };

		//var ar =
        createtablesk(true, true);

        $('input[name*=supplyContractData]').unbind('keyup').keyup(function(){
			if (timeout) clearTimeout(timeout);
            //alert ($('tr:has(td):has(input)').prev().attr('class'));
            //var name = $('tr:has(td):has(input)').closest('tr').attr('class').substr(8);
            if ($(this).closest('tr').attr('class').substr(0,3)=="odd")
            var name = $(this).closest('tr').attr('class').substr(4,4);
            else
                if ($(this).closest('tr').attr('class').substr(0,3)=='eve')
                name = $(this).closest('tr').attr('class').substr(5,4);
            //alert (name);
			timeout = setTimeout(function() {
			updatetablesk(name);
        //createtablesk(false, false);
			if (e.keyCode == 13) return;
			}, delay);});
        $('table.list tr').each( function() {
            var cels = $('td',this);
		    if($(this).hasClass('odd')) {
                $(cels[8]).unbind('click').click(function(){
                    var name = $(this).closest('tr').attr('class').substr(4,4);
                    var tr = $(this).closest('tr'),
					max = parseInt($(this).text().replace(/ /g, '')),
                    str = $(cels[8]).html(),
                    sv = 0;
                    //alert (name);
                                if(str.indexOf('из') > -1)
                                str = str.substring( (str.indexOf('из') + 2), str.length);
                                sv = parseInt(str.replace(/ /g, ''));
                                if(isNaN(max)) max = 0;
                                if(sv < max) max = sv;
								$('input[type=text]', tr).val(max);
                    updatetablesk(name);});}
                    //createtablesk(false, false);});}
            if($(this).hasClass('even')) {
                $(cels[8]).unbind('click').click(function() {
                    var name = $(this).closest('tr').attr('class').substr(5,4);
                    var tr = $(this).closest('tr'),
					max = parseInt($(this).text().replace(/ /g, '')),
                    str = $(cels[8]).html(),
                    sv = 0;
                    //alert (name);
                                if(str.indexOf('из') > -1)
                                str = str.substring( (str.indexOf('из') + 2), str.length);
                                sv = parseInt(str.replace(/ /g, ''));
                                if(isNaN(max)) max = 0;
                                if(sv < max) max = sv;
								$('input[type=text]', tr).val(max);
                    updatetablesk(name);});}});
                    //createtablesk(false, false);});}});

  $('div#mainContent > form > table.list > tbody > tr:nth-child(1) > th:nth-child(1)').html('<div style="width:100%; text-align:center; color:blue; cursor:pointer"><strong name="showSeller"><span>Скрыть</span> поставщиков</strong></div>');
  $('strong[name=showSeller]').unbind('click').click(function() {
    var s = $(this).find('span');
    $('div#mainContent > form > table.list > tbody > tr[class]').each(function() {
      if( $(this).hasClass('odd') || $(this).hasClass('even') ) { // Строки покупки ресурсов
          if(s.html() == 'Скрыть') $(this).css('display', 'none');
          else $(this).removeAttr('style');
      }// end switch
    });
    var sButton = $('div#mainContent > form > table.list > tbody > tr > td[colspan=9] > input.button160').parent().parent();
    if( s.html() == 'Скрыть' ) {
      s.html('Показать');
      $(sButton).css('display', 'none');
    } else {
      s.html('Скрыть');
      $(sButton).removeAttr('style');
    }
  });

//		var hidep1 = true;
//		var hidep = $('<button>Скрыть поставщиков</button>').appendTo($('table.list th')[0]).unbind('click').click(function(){
//			if(hidep1){
//				$('table.list tr.odd, table.list tr.even').hide();
//				$(this).text('Показать поставщиков');
//			}else{
//				$('table.list tr.odd, table.list tr.even').show();
//				$(this).text('Скрыть поставщиков');
//			}
//			hidep1 = !hidep1;
//			return false;
//		});

		but_ras = $('<input type="button" value="Расчет" />').unbind('click').click(function() { Calculate1(2); });
	}

	if(form){
		$('#mainContent').after('<div id="mainformc" style="display:none; position:fixed; width:500px; background-color:#fff; border:solid 1px #000; z-index:1001; top:10px; left:10px;">'+closespan+'</div>');

		var but_show = $('<input type="button" value="Форма смеси" style="position:fixed; left:0px; top:0px;" />').unbind('click').click(function() { $('#mainformc').show(); });
		$('#mainContent').prepend(but_show);

		$('#mainformc').append('<table align="center" width="20%" border="0" class="grid"><tr class="odd" ><th></th><th >В наличии</th><th>Необходимо</th><th colspan=2 scope="col">Продукты</th></tr><tr align="right" class="odd"><th>Количество</th><td><input type=text id="sc" maxlength=11 value="0" size=10 tabindex=1></td><td><input type=text id="sc1" maxlength=11 value="0" size=10 tabindex=3></td><td><input style="background-color:#ddd;" readonly type=text id="sx1" maxlength=11 value="0" size=10></td><td><input style="background-color:#ddd;" readonly type=text id="sx2" maxlength=11 value="0" size=10></td></tr><tr align="right" class="even"><th>Качество</th><td><input type=text id="sk" maxlength=11 value="0" size=10 tabindex=2></td><td><input type=text id="sk1" maxlength=11 value="0" size=10 tabindex=4></td><td><input type=text id="sk2" maxlength=11 value="0" size=10 tabindex=5></td><td><input type=text id="sk3" maxlength=11 value="0" size=10 tabindex=7></td></tr><tr align="right" class="odd"><th>Цена</th><td></td><td ><div id="cenacach" style="color:#f00;"></div><input style="background-color:#ddd;" readonly type=text id="scn1" maxlength=11 value="0" size=10></td><td><div id="cenacach1" style="color:#f00;"></div><input type=text id="scn2" maxlength=11 value="0" size=10 tabindex=6></td><td><div id="cenacach2" style="color:#f00;"></div><input type=text id="scn3" maxlength=11 value="0" size=10 tabindex=8></td></tr></table>')
			.append(but_ras)
			.append('<label><input type="checkbox" id="svo" />Считать с кол-вом остатков</label>');

		$('#mainformc .closeform').unbind('click').click(function(){$('#mainformc').hide();});
	}
}
)})(window);

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
//script.textContent = '(' + run.toString() + ')();';
//script.textContent = '( )();';
document.documentElement.appendChild(script);