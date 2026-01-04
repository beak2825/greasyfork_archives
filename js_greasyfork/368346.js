// ==UserScript==
// @name         Eastbay / Footlocker.com Routing Helper
// @namespace    https://greasyfork.org/users/4756
// @version      0.2
// @author       saibotshamtul (Michael Cimino)
// @description  auto-fills some fields
// @match		 https://vrt.eastbay.com/VendorRoutingInterface/Vendor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368346/Eastbay%20%20Footlockercom%20Routing%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/368346/Eastbay%20%20Footlockercom%20Routing%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.match("RoutingRequest[/]New[?]PurchaseOrderNumber=")){
        //choose Statco Warehouse
        ShipFromAddressId.children[1].selected=true;
        CubicFeet.value="";
        CubicFeet.focus();
    }

    if (window.location.href.match("Vendor$") || window.location.href.match("Vendor[?]")){
        setTimeout(function(){PurchaseOrderNumber.focus();}, 1000);
    }

})();