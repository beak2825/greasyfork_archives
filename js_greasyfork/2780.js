// ==UserScript==
// @name           Virtonomica: Снабжение, отметить нулевые
// @namespace      virtonomica
// @version        1.3
// @description    Отмечает нулевые позиции в снабжении
// @include        http://virtonomic*.*/*/main/unit/view/*/supply
// @downloadURL https://update.greasyfork.org/scripts/2780/Virtonomica%3A%20%D0%A1%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%2C%20%D0%BE%D1%82%D0%BC%D0%B5%D1%82%D0%B8%D1%82%D1%8C%20%D0%BD%D1%83%D0%BB%D0%B5%D0%B2%D1%8B%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/2780/Virtonomica%3A%20%D0%A1%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%2C%20%D0%BE%D1%82%D0%BC%D0%B5%D1%82%D0%B8%D1%82%D1%8C%20%D0%BD%D1%83%D0%BB%D0%B5%D0%B2%D1%8B%D0%B5.meta.js
// ==/UserScript==

var run = function() {
  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;
  
  var container = $("table.list tr:last > td:last");
  var obj = $("<span>").text("Отметить нулевые").css({color:'red',cursor:'pointer'});
  
  var type = $("ul.tabu > li:first").text().replace(/(\s)*/g,"");
  var list = $("table.list tr[id]:has(input.destroy)");
  
  obj.click(function(){
  switch (type) {
    case "Склад":{}
    case "Ферма":{}
    case "Завод":{}
    case "Магазин":{
      $.each(list, function(){
        if($("td > table tr:contains('Закупка') > td:last", this).text().replace(" ","") == 0){
          if($("td > table tr:contains('Свободно') > td:last",this).text().replace(" ","") == 0 ){ $(".destroy",this).attr({checked:'true'}); }
        }
      });
      break;
    }
  }//end switch
  }//end function
  );
  
  container.prepend(obj);
}

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);