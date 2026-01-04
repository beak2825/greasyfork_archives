// ==UserScript==
// @name           Virtonomica: редактирование приоритета сбыта с помощью перетаскивания мышкой
// @namespace      virtonomica
// @version 	   1.0
// @description    Позволяет менять приоритет сбыта на складе и заводе перетаскивая строки мышкой
// @include        http*://*virtonomic*.*/*/main/unit/view/*/sale
// @include        http*://*virtonomic*.*/*/main/unit/view/*/sale/product
// @include        http*://*virtonomic*.*/*/main/unit/view/*/sale/product/*/*
// @downloadURL https://update.greasyfork.org/scripts/394779/Virtonomica%3A%20%D1%80%D0%B5%D0%B4%D0%B0%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BF%D1%80%D0%B8%D0%BE%D1%80%D0%B8%D1%82%D0%B5%D1%82%D0%B0%20%D1%81%D0%B1%D1%8B%D1%82%D0%B0%20%D1%81%20%D0%BF%D0%BE%D0%BC%D0%BE%D1%89%D1%8C%D1%8E%20%D0%BF%D0%B5%D1%80%D0%B5%D1%82%D0%B0%D1%81%D0%BA%D0%B8%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%BC%D1%8B%D1%88%D0%BA%D0%BE%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/394779/Virtonomica%3A%20%D1%80%D0%B5%D0%B4%D0%B0%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BF%D1%80%D0%B8%D0%BE%D1%80%D0%B8%D1%82%D0%B5%D1%82%D0%B0%20%D1%81%D0%B1%D1%8B%D1%82%D0%B0%20%D1%81%20%D0%BF%D0%BE%D0%BC%D0%BE%D1%89%D1%8C%D1%8E%20%D0%BF%D0%B5%D1%80%D0%B5%D1%82%D0%B0%D1%81%D0%BA%D0%B8%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%BC%D1%8B%D1%88%D0%BA%D0%BE%D0%B9.meta.js
// ==/UserScript==

var run = function() {

  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;
  
  function makeSortable(){
    $("table.salelist > tbody").sortable({
        items: "> tr:not(:first, :lt(2))",
        appendTo: "parent",
        helper: "clone",
        stop: function( event, ui ) {
          $(this).find('tr > td > table.position > tbody > tr > td > input').each(function(i){
              $(this).val(i+1);
          });
          ui.item.find('td > table.position > tbody > tr > td > input').keypress();
          ui.item.find('td > table.position > tbody > tr > td > img').click();
          makeSortable();
        }
    }).disableSelection();
  }
  makeSortable();
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}