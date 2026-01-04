// ==UserScript==
// @name        Atlantis: Rest Name for KO
// @namespace   virtonomica
// @description Определяет компанию юнита и передает её на сервер
// @version  0.02
// @grant    none
// @include     https://virtonomica.ru/vera/main/unit/view/*
// @downloadURL https://update.greasyfork.org/scripts/391756/Atlantis%3A%20Rest%20Name%20for%20KO.user.js
// @updateURL https://update.greasyfork.org/scripts/391756/Atlantis%3A%20Rest%20Name%20for%20KO.meta.js
// ==/UserScript==
var run = function() {
  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;

  var KO_API_URL = "https://test.pbliga.com/virta/konkurs.php?";
  
  // Стили  
  var st = $("style");
  st.append(".my_info_btn{cursor:pointer;opacity:0.5;float:left;}");
  st.append(".my_info_btn:hover{opacity:1.0}");
	st.append(".my_info_btn img {width:32px;}");
	st.append(".my_info_name{font-weight:bold;border-bottom: solid 1px;border-right: solid 1px;border-left: solid 1px;padding-left: 12px;padding-right: 12px;padding-right: 12px;background: lightgray;width: 80%;}");

  var alt = "Передать компанию подразделения на сервер";
  var wc_name = $("<div id=name_img class=my_info_btn> <img title='" + alt +"' alt='" + alt +"' снабжения' src=https://cdn4.iconfinder.com/data/icons/free-large-boss-icon-set/512/King.png></div>");

  $("div.dainfo").after( wc_name );
  
  var wc_name_info = $("<div class=my_info_name id=name_info>????</div>");
  
	$("table.infoblock:eq(0)").before(wc_name_info);
  $("#childMenu").after(wc_name_info);

  $("#name_info").hide();
  
  $("#name_img").click( function(){
      var div = $("div.title");
      var link = $("a", div);
    
      //console.info( link );
     
    
      if (link.length != 2) {
  	      //хм... наверное, это я сам	
	      if (link.length != 3){
    			$("#name_info").text('найдено неверное число ссылок: ' + link.length ).show();
		      return;
    	    
      	}
      }
    
      $("#name_info").text('нажали...').show();
    
      console.info(  link.eq(0) );
    
      var src = link.eq(0).attr('href');
      if (link.length == 3){
        // попробуем проверить, что первая ссылка это не бета-интерфейс
        var el_text = link.eq(0).text();
        console.info( el_text );
        if ( el_text == 'beta') {
          // опс... это я сам
          src = link.eq(1).attr('href');        
        } else {
          // а это... чужйо юнит со ссылкой на странц и регион
          //src = link.eq(2).attr('href');        
        }
        
        //хм... наверное, это я сам, тогда первая ссылка это бета-интерфейс	
				//src = link.eq(1).attr('href');        
      }
    
      // Идентификатор подразделения
      var id = /(\d+)/.exec(location.href)[0];
      var comany_id = /(\d+)/.exec(src)[0];
      var name = link.eq(0).text();

      if ( src.indexOf("company") == -1 ) {
      
         $("#name_info").text( "Не нашли, проверь ссылку: " +src );
         // наверное это мы...
         comany_id = 66678;
         name = "Test";
         //return;
      }
    

      var out= "id=" + id + "<br>" + name;
    
      $("#name_info").html( out );
    
      // отсылаем на сервер

      $("#name_info").html( out + '<br>Отправка данных на сервер...' );  

      var WebURL= KO_API_URL +'&action=send_compnay';
      $.post(WebURL, {'id': id, 'company' : comany_id, 'name': name}, function(data){
          $("#name_info").html( 'Server return:' + data );
      });
    
      console.log("---name_img---click---end");
  });

  console.info("Atlantis: Rest Name for KO......end");
}
if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}