// ==UserScript==
// @name        ShopCostHelper
// @namespace   virtonomica
// @include     http*://virtonomic*/*/main/unit/view/*/trading_hall
// @version     0.02
// @grant       none
// @author      chippa
// @description        Shop Cost Helper
// @downloadURL https://update.greasyfork.org/scripts/30437/ShopCostHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/30437/ShopCostHelper.meta.js
// ==/UserScript==
var run = function () {
$(document).ready(function ()
{
  var $tbody = $('table.grid:eq(0) > tbody:eq(0)');
  $tbody.children('tr').each(function () {
    var $tr = $(this);
    if ($tr.children('td').length > 1) {
      var $td9 = $tr.children('td:eq(8)'); // current
      var $td10 = $tr.children('td:eq(9)'); // need
      var cost = parseFloat($td9.text().trim().replace('$', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '')) - 0;
      var sale = parseFloat($td10.find('input').val()) - 0;
      if (cost >= sale)
      {
          $td10.append('<span style="background-color:red;">&lt;&lt;</span>');
      }
    }
  });
});
};
if (window.top == window) {
  var script = document.createElement('script');
  script.textContent = '(' + run.toString() + ')();';
  document.documentElement.appendChild(script);
}