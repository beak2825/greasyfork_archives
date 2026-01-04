// ==UserScript==
// @name        costHelper
// @namespace   virtonomica
// @include     http*://virtonomic*.*/*/main/unit/view/*/sale
// @include     http*://virtonomic*.*/*/main/unit/view/*/sale/offer
// @version     0.52
// @grant       none
// @author      chippa
// @description:en changes color
// @description changes color
// @downloadURL https://update.greasyfork.org/scripts/30428/costHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/30428/costHelper.meta.js
// ==/UserScript==
var run = function () {
$(document).ready(function()
{
  var $tbody4 = $("table.grid:eq(0) > tbody:eq(0)");
    $tbody4.children("tr").each(function() {
      var $tr4 = $(this);
    var $td9 = $tr4.children("td:eq(3)").children("table:eq(0)").text().split("Себестоимость"); // cost
      if(typeof $td9[1] === "undefined")
         {
         }else{
           var cost = parseFloat($td9[1].trim().replace("$", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "")) - 0;
           var sale = parseFloat($tr4.find("input.money").val()) - 0;
           if(cost > sale)
              {
                $tr4.find("input.money").css("color","#b22222");
              }else{
                $tr4.find("input.money").css("color","#117700");
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