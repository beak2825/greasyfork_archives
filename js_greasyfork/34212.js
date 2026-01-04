// ==UserScript==
// @name          dx_autofill_usps
// @namespace     ClaremontDesign
// @description	  Pass Magento's order shipping address to USPS Click-N-Ship
// @author        Dennes B Abing <dennes.b.abing@gmail.com>
// @homepage      http://claremontdesign.com
// @include       https://cns.usps.com/labelInformation.shtml*
// @include       https://cns.usps.com/labelInformation.shtml*
// @match         https://cns.usps.com/labelInformation.shtml*
// @match         https://cns.usps.com/labelInformation.shtml*
// @version       0.0.3
// @downloadURL https://update.greasyfork.org/scripts/34212/dx_autofill_usps.user.js
// @updateURL https://update.greasyfork.org/scripts/34212/dx_autofill_usps.meta.js
// ==/UserScript==

var GM_JQ = document.createElement('script');
GM_JQ.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.js';
GM_JQ.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(GM_JQ);
function GM_wait() {
    if(typeof unsafeWindow.jQuery == 'undefined') {
        window.setTimeout(GM_wait,100);
    } else {
        $ = unsafeWindow.jQuery;
    }
}
GM_wait();
function uspsChecker()
{
    if(jQuery('#deliveryAddressFirstName').length > 0)
    {
        autoFillUSPSClickNShip();
    }
}
var uspsCheckerInterval = setInterval(uspsChecker, 4000);
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function autoFillUSPSClickNShip() {
    $('#deliveryAddressState').val(getParameterByName('deliveryAddressStateCode'));jQuery("#deliveryAddressState").selectmenu("refresh");
    $('#deliveryAddressCountryId').val(getParameterByName('deliveryAddressCountryId'));jQuery("#deliveryAddressCountryId").selectmenu("refresh");
    $('#deliveryAddressFirstName').val(getParameterByName('deliveryAddressFirstName'));
    $('#deliveryAddressMiddleInit').val(getParameterByName('deliveryAddressMiddleInit'));
    $('#deliveryAddressLastName').val(getParameterByName('deliveryAddressLastName'));
    $('#deliveryAddressCompany').val(getParameterByName('deliveryAddressCompany'));
    $('#deliveryAddressLine1Addr').val(getParameterByName('deliveryAddressLine1Addr'));
    $('#deliveryAddressLine2Addr').val(getParameterByName('deliveryAddressLine2Addr'));
    $('#deliveryAddressCityName').val(getParameterByName('deliveryAddressCityName'));
    $('#deliveryAddressPostalCode').val(getParameterByName('deliveryAddressPostalCode'));
    $('#pounds').val(getParameterByName('pounds'));
    $('#ounces').val(getParameterByName('ounces'));
    $('#pkgValueAmt').val(getParameterByName('pkgValueAmt'));
    clearInterval(uspsCheckerInterval);
}