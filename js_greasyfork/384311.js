// ==UserScript==
// @name     Virtonomica:Polytics Units Id
// @include     https://virtonomica.ru/vera/main/politics/mayor/*/units
// @version  1.1
// @description Идентификаторы предприятий, отображаемых в мэрии. Выводятся в консоль браузера
// @grant    none
// @namespace https://greasyfork.org/users/2055
// @downloadURL https://update.greasyfork.org/scripts/384311/Virtonomica%3APolytics%20Units%20Id.user.js
// @updateURL https://update.greasyfork.org/scripts/384311/Virtonomica%3APolytics%20Units%20Id.meta.js
// ==/UserScript==
var run = function() {

var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	$ = win.$;

  function numberFormat (number) {
          number += '';
          var parts = number.split('.');
          var int = parts[0];
          var dec = parts.length > 1 ? '.' + parts[1] : '';
          var regexp = /(\d+)(\d{3}(\s|$))/;
          while (regexp.test(int)) {
          int = int.replace(regexp, '$1 $2');
          }
          return int + dec;
  }

	// Стили  
  var st = $("style");
	//if ( $(".my_btn", st).length == 0 ) {
		st.append(".cntrl_id{cursor:pointer;opacity:0.5;width:24px;}");
		st.append(".cntrl_id:hover{opacity:1.0}");
	//}

  
  var wc = $("<div class=cntrl_id>ID</div>");
  
  $("table.tabsub").before( wc );
  
  wc.click( function(){
  
    var table = $("table.unit-list");
    
    var str = '';
    
    var tr = $("tr", table);
    for(var r=0; r< tr.length; r++){
    	var td = $("td", tr.eq(r) );
      
      var el = td.eq(0);
      //console.log( el.text() );
      
      var number = parseInt( el.text() );
      
      if ( isNaN( number ) ) continue;
      console.info( number );
      
      str+= number + ", ";
    
    }
    console.info( str );
    
  });
  
  
	console.log("End");
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
} 