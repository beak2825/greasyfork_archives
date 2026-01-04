// ==UserScript==
// @name     Virtonomica:price collect
// @namespace   virtonomica
// @description Данные о ценах на товары
// @include     https://*virtonomic*.*/*/main/unit/view/*/trading_hall
// @include			https://*virtonomic*.*/*/main/unit/view/*/sale/product*
// @version  0.06
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/374270/Virtonomica%3Aprice%20collect.user.js
// @updateURL https://update.greasyfork.org/scripts/374270/Virtonomica%3Aprice%20collect.meta.js
// ==/UserScript==
var run = function() {

	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	$ = win.$;

  var url_report = "https://virtonomica.ru/vera/main/globalreport/marketing/";
  var url_base = "https://test.pbliga.com/virta/price.php";

	var LS_NAME = 'shop_time_v2';
  var STR_BTN = 'Обновить цены в облако';
  
  function LS_save(val)
	{
    console.info('---LS_save---');
    console.info(val[id]);
		try {
			window.localStorage.setItem( LS_NAME,  JSON.stringify( val ) );
    } catch(e) {
			out = "Ошибка добавления в локальное хранилище";
			console.log(out);
      $("#price_out").html( out );
		}
	};
	function LS_load()
  {
		obj = JSON.parse( window.localStorage.getItem(LS_NAME) );
		if ( obj == null ) obj = new Object();
		return obj;
  }
  
  var LS = LS_load();
    
  function get_shop_product_id( str )
  {
    var prod_reg = /\b(product_id=)\d+\b/;
    if ( !prod_reg.test(str) ) return false;
    
    var temp = prod_reg.exec( str )[0].replace('product_id=','');
        
    return parseInt( temp );
  }
  
  function get_server_date()
  {
    var virta_data = $.trim( $("div.date_time").text().replace('00:00:00', '').replace('00:00:00', '') );
    console.info(virta_data);
  
    return virta_data;
  }
  
  // Идентификатор подразделения
  var id = /(\d+)/.exec(location.href)[0];
  
  var server_price =  new Object();
  var server_time =  new Object();
    
  function collect_price()
  {
  	var main = $("#mainContent");
    var goods = $("a[href^='" + url_report +"'] img[src^='/img/products/']", main);
    
    var dat = new Object();
    dat.unit_id = id;
    dat.goods = new Object();

    for(var i=0; i< goods.length; i++){
      var link = goods.eq(i).parent().attr('href');
    	console.log( "next = " +goods.eq(i).parent().attr('href') );
      
      var prod_id = get_shop_product_id( link );
      console.log( prod_id );
      
      var tr = goods.eq(i).parent().parent().parent();
      // name="productData[price][{65537274}]"
      var inp = $("input[name*='price']", tr);
      
      var price = parseFloat( inp.val() );
      
      console.log( price );
      
      var market = parseFloat( inp.parent().next().text().replace('%','') );
      //.text().replace(' %'.'');
      console.info( market );
      
      dat.goods[i] = new Object();
      dat.goods[i].product_id = prod_id;
      dat.goods[i].price = price;
      dat.goods[i].market = market;
    
    }
    console.info( dat );
    
    send_shop( dat );
  }
  
  function send_shop( dat )
  {
    
    $("#price_out").html( 'Отправляем цены на сервер...' );
    $.post(url_base, {'action' : 'send_shop','data': JSON.stringify( dat )}, function(data){
			console.log( data );
      $("#price_out").html( data );
      LS_save( LS );
    
    });
    
  }
  
  function get_warehouse_info()
  {
    var table = $("#consumerListDiv");
		if (table.length == 0) return;
    
    var a_shop = $("a[href*='main/unit/view']", table);
		if (a_shop.length == 0) return;
    
    var tr_r = $("tr[id*='row[']", table);
		if (tr_r.length == 0 ) return;
    
    var str = tr_r.eq(0).attr('id');
    var id_item = /(\d+)/.exec( str )[0];
    
    var data = new Object();
    data['prod_id'] = id_item;
    data['units'] = new Array();
    
    for(i=0; i< a_shop.length; i+=2){
			var shop = a_shop.eq(i+1);

			var id_shop = /(\d+)/.exec(shop.attr('href'))[0];
      
      data['units'].push( id_shop );
    }

    
    console.info( data );
    
    // заменяем ссылки на магазины ссыдками на торговые залы магазинов
		// http://virtonomica.ru/vera/main/unit/view/4135337
		// http://virtonomica.ru/vera/main/unit/view/4135337/trading_hall
		var shop_link = $("a[onclick='return doWindow(this.href)']");
		//console.log(shop_link.length);
		for(i=0; i< shop_link.length; i++){
			var alink = shop_link.eq(i);
			//console.log(alink.attr('href'));
			alink.attr('href', alink.attr('href')+ '/trading_hall' );
		}
  
    $.get(url_base, {'action' : 'get_price','data': JSON.stringify( data )}, function( unit_data ){
    	console.info( unit_data );
      try {
      	unit_data = JSON.parse( unit_data );
      }catch(e){
      	$("#price_out").html( 'No Object: ' +unit_data );
        return;
      }
      console.info( typeof(unit_data) );
      if ( unit_data['error'] == null ) {
      	$("#price_out").html( 'No error field: ' +unit_data );
      	return;
      }
      if ( unit_data['error'] != '') {
      	$("#price_out").html( unit_data['error'] );
        return;
      }
      
      $("#price_out").html( 'from server' );
      // как бы оторажаем, то что получили
      server_price = unit_data['price'];
      server_time = unit_data['time'];
      
      add_warehouse_info();
      
    });
  }
  
  function add_warehouse_info() 
  {
    var table = $("#consumerListDiv");
		//console.log(table.length);
		if (table.length == 0) return;
    
    var a_shop = $("a[href*='main/unit/view']", table);
		//console.log(a_shop.length);
		if (a_shop.length == 0) return;
    
    var tr_r = $("tr[id*='row[']", table);
		//console.log("ROW = " + tr_r.length);
		if (tr_r.length == 0 ) return;
    
    var str = tr_r.eq(0).attr('id');
		//console.log("ITEM = " + str );
    var id_item = /(\d+)/.exec( str )[0];
    
    var th = $("th", table);
		//console.log("th = " + th.length);
		if (th.length > 0) {
			th.eq(4).after("<th><span title='Цена продажи в магазине'>Цена продажи</span><hr><span title='разница между ценой продажи и закупочной ценой'>прибыль</span>");
		}
    for(i=0; i< a_shop.length; i+=2){
			var shop = a_shop.eq(i+1);

			var id_shop = /(\d+)/.exec(shop.attr('href'))[0];
			//console.log(id_shop);
      price = parseFloat(server_price[id_shop]);
      out = "&nbsp;";
      if (price > 0 ) {
      	out += (price).toLocaleString('ru');
      }

      shop.parent().after("<td> " + out);
    }
    // модифицирем стрелки вврех и вниз, что бы сохранить науш информацию
		var link = $("a[onclick*='return changeContractPosition']");
		link.click(function(){
			add_warehouse_info();
		});

		// модифицирем перескоки сразу на заданную позиицю, что бы сохранить науш информацию
		var link2 = $("img[id*='posistionsave']");
		link2.click(function(){
			add_warehouse_info();
		});
  } // end of add_warehouse_info()
  
  var st = $("style");
	if ( $("#price_out", st).length == 0 ) {
		st.append("#price_out{clear: both;color: yellow;padding: 8px;}");
	}
  
  var wc_send = $("<li class=my_btn id=price_cloud><img alt='"+STR_BTN+"' src=https://cdn4.iconfinder.com/data/icons/flat-circle-content/800/circle-content-upload-cloud-32.png title='"+STR_BTN+"'> </li>");
  
  $("#mainContent").before("<div id=price_out></div>");
 
  console.log( "---&&&---" );
  // проверим. А не склад ли это?
  var name = $.trim( $("ul.tabu li").eq(1).text() );
  //console.info( name );
  if ( name == "Склад" || name == "Завод" || name == "Рыболовная база" ) {
    //add_warehouse_info();
    get_warehouse_info();
    return;
  } 
  
  
  var container = $('ul.tabu');
	container = $("li:last", container).prev().parent();
  container.append(wc_send) ;
  
  $("#price_cloud").click(function(){
  	collect_price();
  });
  
  var virta_data = get_server_date();
    
  if ( LS[id] == null) {
    LS[id] = virta_data;
    console.log('---collect price, LS[id] null');
  } else {
    if ( LS[id] == virta_data ) {
      $("#price_out").html( 'Цены на сервере сегодня уже обновляли: ' + LS[id] );
      return;
    }
     console.log('---collect price, LS[id] <> virta_data, LS= (' + LS[id] + ')');
    LS[id] = virta_data
  }
  
  collect_price();
  
}
if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}