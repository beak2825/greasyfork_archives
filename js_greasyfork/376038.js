// ==UserScript==
// @name         selecting district
// @namespace   https://onlinebooking.sand.telangana.gov.in/Order/CustomerOrders.aspx
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://onlinebooking.sand.telangana.gov.in/Order/CustomerOrders.aspx?*
// @grant        none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/376038/selecting%20district.user.js
// @updateURL https://update.greasyfork.org/scripts/376038/selecting%20district.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.Dropdown').val('27').change()
    setTimeout(function(){
        $("#lblstockpointid4").prop("checked", true).trigger('click')
        $('#ccMain_ddlsandpurpose').val('2').change();
        $(window).load(function() {
        $("html, body").animate({ scrollTop: $(document).height() }, 1000);
        });
        //$('#ccMain_txtVehzNo').val('AAH1455').trigger('change');
        //$('#ccMain_ddldeldistrict').val('16').change();


    },500)
})();