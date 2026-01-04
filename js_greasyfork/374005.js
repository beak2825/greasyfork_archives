// ==UserScript==
// @name         AV&Co.
// @author       Tehapollo
// @version      1.0
// @include      *mturkcontent.com*
// @include      *s3.amazonaws.com*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  1 click search for Spectrum may not work ???
// @downloadURL https://update.greasyfork.org/scripts/374005/AVCo.user.js
// @updateURL https://update.greasyfork.org/scripts/374005/AVCo.meta.js
// ==/UserScript==

(function() {
    'use strict';
 if ($("li:contains('https://www.spectrum.com/internet.html')").length){
    var address = $("td:contains('Street Address:')").next().html();
    var zip = $("td:contains('Zip Code:')").next().html();
    var trim1 = address.replace(/\s+/g, '+').toLowerCase();


   $("td:contains('Street Address:')").next().html("<a href='https://buy.spectrum.com/buyflow/buyflow-localization?zip=" + zip + "&a="+ trim1 + "&serviceVendorName=none&v=ORG&omnitureId=cbb5eedd-f224-467f-8da4-6193b106399d" + "' target='_blank'>" + address + "</a>")
 }
})();