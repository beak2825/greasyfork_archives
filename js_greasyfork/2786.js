// ==UserScript==
// @name       	Virtonomica:UnitMarkets
// @namespace  	Virtonomica
// @version    	0.2
// @description	Отображение новых поступлений на рынок
// @include    	http://*virtonomic*.*/*/main/unit_market/list
// @downloadURL https://update.greasyfork.org/scripts/2786/Virtonomica%3AUnitMarkets.user.js
// @updateURL https://update.greasyfork.org/scripts/2786/Virtonomica%3AUnitMarkets.meta.js
// ==/UserScript==

var run = function() {
  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;

  /**
  * записать данные в локальнео хранилище, с проверкой ошибок
  */
  function ToStorage(name,  val)
  {
  	try {
      	window.localStorage.setItem( name,  JSON.stringify( val ) );
  	} catch(e) {
      	out = "Ошибка добавления в локальное хранилище";
      	//console.log(out);
  	}
  }

  function getFromStorage(obj, id_shop)
  {
  	if (obj[id_shop] == null) return '';
  	return JSON.stringify(obj[id_shop]);
  }

  var div_link = "<div id=unit_mark_link style='background: none repeat scroll 0% 0% rgb(223, 223, 223); z-index: 1003; position: absolute; color: black; border: 1px solid rgb(0, 0, 0); display: none;'>"
  + "<table>"
  + "<tr><td>&nbsp;<td>"
  + "<h3>Не помеченные подразделения</h3>"
  + "<span id=span_unit_mark_link>&nbsp;</span>"
  + "<td>&nbsp;"
  + "<tr><td colspan=3>&nbsp;"
  + "</table>"
  + "</div>";

  var wc_view = $("<img src=http://s4.hostingkartinok.com/uploads/images/2012/12/d9476aa38b33be7f50bb549409dcab2e.png title='Показать новые поступления'>").click( function() {
    console.log("view");
    if ($("#unit_mark_link").is(':visible') ){
   	 $("#unit_mark_link").toggle();
   	 return;
    }
    	// Маркировка
    	unit_mark = JSON.parse( window.localStorage.getItem('unit_mark') );
    	if ( unit_mark == null ) unit_mark = new Object();

    	// Формируем ссылку на торговый зал
    	var url = /^http:\/\/virtonomic[as]\.(\w+)\/\w+\//.exec(location.href)[0];
    	console.log(url);

    var out = "<OL>";
 		 var txt = $("#mainContent");
 		 var link = $("a[href*='main/unit/view']", txt);
 		 console.log("LINK="+ link.length);
    for(i=0; i<link.length; i+=2){
   	 var id = /(\d+)/.exec(link.eq(i).attr('href'))[0];
   	 //console.log( id + " = " + link.eq(i).attr('href') );
   	 if (unit_mark[id] != null) continue;

   	 var ee = link.eq(i).parent().next().next().next();
   	 console.log(ee.html());

   	 out += "<LI><a href=" + url + "main/unit/view/" + id +" style='color: blue;'>" + link.eq(i).html() +  link.eq(i+1).text() + "</a>" ;
   	 if ( ee.html() != '') out+= " " + ee.html();
    }
    out += "</OL>";
    $("#span_unit_mark_link").html( out );
    $("#unit_mark_link").toggle();

  });

  var wc = $("<img alt='Добавить Идентификаторы подразделений в локальное хранилище' src=http://s1.hostingkartinok.com/uploads/images/2012/12/230332ed516d0325e596e3558605af85.png title='Добавить Идентификаторы подразделений в локальное хранилище'>").click( function() {
    console.log("add");
    	// Маркировка
    	unit_mark = JSON.parse( window.localStorage.getItem('unit_mark') );
    	if ( unit_mark == null ) unit_mark = new Object();

 		 var txt = $("#mainContent");
 		 var link = $("a[href*='main/unit/view']", txt);
 		 console.log("LINK="+ link.length);
    for(i=0; i<link.length; i+=2){
   	 var id = /(\d+)/.exec(link.eq(i).attr('href'))[0];
   	 console.log( id + " = " + link.eq(i).attr('href') );
   	 unit_mark[id] = id;
    }
    ToStorage('unit_mark', unit_mark);
    $("#unit_mark_out").text("сохранили");
  });


  var container = $("#headerInfo");
  container.append( wc ).append( wc_view ).append("<br><span id=unit_mark_out>").append("<br>").append( div_link );

}

if(window.top == window) {
	var script = document.createElement("script");
	script.textContent = '(' + run.toString() + ')();';
	document.documentElement.appendChild(script);
}