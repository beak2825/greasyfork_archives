// ==UserScript==
// @name        Virtonomica: убирает из списка предприятия в отпуске
// @description Убирает из списка предприятия в отпуске на странице Управление - Персонал
// @author 		cobra3125
// @namespace   virtonomica
// @version 	1.0
// @include 	http*://*virtonomica.*/*/main/company/view/*/unit_list/employee
// @downloadURL https://update.greasyfork.org/scripts/24946/Virtonomica%3A%20%D1%83%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D1%82%20%D0%B8%D0%B7%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%B0%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BF%D1%80%D0%B8%D1%8F%D1%82%D0%B8%D1%8F%20%D0%B2%20%D0%BE%D1%82%D0%BF%D1%83%D1%81%D0%BA%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/24946/Virtonomica%3A%20%D1%83%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D1%82%20%D0%B8%D0%B7%20%D1%81%D0%BF%D0%B8%D1%81%D0%BA%D0%B0%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BF%D1%80%D0%B8%D1%8F%D1%82%D0%B8%D1%8F%20%D0%B2%20%D0%BE%D1%82%D0%BF%D1%83%D1%81%D0%BA%D0%B5.meta.js
// ==/UserScript==

var run = function() {

  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;


  var svBtn = '<input id="removeRowInHoliday" type="button" value="Убрать из списка предприятия в отпуске">';
  $('table.list').first().before(svBtn);

  $('#removeRowInHoliday').click( function(){
    $('table.list > tbody > tr:has(td):has(td):has(a):has(div[class="in-holiday"])').remove();
  });
}

if(window.top == window) {
  var script = document.createElement("script");
  script.textContent = '(' + run.toString() + ')();';
  document.documentElement.appendChild(script);
}