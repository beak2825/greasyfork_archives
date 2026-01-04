// ==UserScript==
// @name        equipmentHelper
// @namespace   virtonomica
// @include     http*://virtonomic*/*/main/company/view/*/unit_list/equipment
// @version     1
// @grant       none
// @description:en wah!
// @description wah!
// @downloadURL https://update.greasyfork.org/scripts/30379/equipmentHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/30379/equipmentHelper.meta.js
// ==/UserScript==


$(document).ready(function()
{
  var $tbody = $("table.list:eq(0) > tbody:eq(0)");
    $tbody.children("tr").each(function() {
      var $tr = $(this);

    var $td9 = $tr.children("td:eq(5)"); // current
    var $td10 = $tr.children("td:eq(6)"); // need
    var current = $td9.text().trim() - 0;
    var need = $td10.text().trim() - 0;
    if(current > 0 || need > 0)
       {
         console.log('current: ' + current +'  need: ' + need);
         if(current < need)
           {
             $td9.append('<span style="background-color:red;">&lt;&lt;</span>');
           }
       }

    });
});

