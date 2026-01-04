// ==UserScript==
// @name     Virtonomica: Остановка рекламы
// @namespace Virtonomica
// @version  0.01
// @grant    none
// @description    Добавление кнопки остановки рекламы (в маназинах с Q*)
// @include        https://*virtonomic*.*/*/main/company/view/*/unit_list
// @downloadURL https://update.greasyfork.org/scripts/39974/Virtonomica%3A%20%D0%9E%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/39974/Virtonomica%3A%20%D0%9E%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B.meta.js
// ==/UserScript==

var run = function() {

  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;
  
  var td = $("td.info");
  //console.log( 'len = ' + el.length );
  
  var def_name = ['QA', 'QB', 'QC', 'QD', 'QE', 'QF', 'QX', 'QW'];
  
  // Стили  
  var st = $("style");
	st.append(".stop_btn{cursor:pointer;opacity:0.5;}");
	st.append(".stop_btn:hover{opacity:1.0;background-color: red;}");
	st.append(".stop_btn img {width:20px;}");
  
  // добавляем кнопку к нужным названиям
  for(var i=0; i<td.length; i++ ){
  	var shop = td.eq(i);
    
    var shop_name = $("a", shop).text();
    
    var fs = def_name.filter( s => s.indexOf( shop_name ) === 0);
    if ( fs.length == 0 )  continue;
  
    //console.info( def_name.filter( s => s.indexOf( shop_name ) === 0) );
    shop.append('<span class=stop_btn title="Остановить рекламу"><img src=https://cdn2.iconfinder.com/data/icons/oxygen/48x48/apps/kblogger.png></span>');
  }
  
  // клик по добавленной кнопке
  $(".stop_btn").click(function(){
  		var tds = $(this).parent();
    
      var link = $("a", tds).attr('href');
       
      //console.info( link );
    
      // Идентификатор подразделения
      var id = /(\d+)/.exec(link)[0];
      //console.info( id );
      
      var WebURL= 'https://virtonomica.ru/vera/main/unit/view/' + id +'/virtasement';
    
			$.post(WebURL, {'cancel': 'Остановить рекламную кампанию'}, function(data){
        console.info( data );
        
				//$('#text_ret').html( "<br><font color=maroon><b>Ответ сервера</b></font>:" + data + "<br>" );
			});    
    
    
  });
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}