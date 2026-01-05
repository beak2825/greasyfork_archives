// ==UserScript==
// @name        salaryHelper
// @namespace   virtonomica
// @include     http*://virtonomic*/*/main/company/view/*/unit_list/employee*
// @version     1
// @grant       none
// @author      chippa
// @description        salary Helper
// @downloadURL https://update.greasyfork.org/scripts/28511/salaryHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/28511/salaryHelper.meta.js
// ==/UserScript==


$(document).ready(function()
{
  var $tbody = $("table.list:eq(0) > tbody:eq(0)");
	$tbody.children("tr").each(function() {
      var $tr = $(this);

    var $td9 = $tr.children("td:eq(8)"); // current
    var $td10 = $tr.children("td:eq(9)"); // need
    var current = $td9.text().trim() - 0;
    var need = $td10.text().trim() - 0;
    if(current > 0 || need > 0)
       {
         console.log('current: ' + current +'  need: ' + need);
         if(current < need && current > 0)
           {
             $td9.append('<span style="background-color:red;">&lt;&lt;</span>');
           }
       }

    });
});


