// ==UserScript==
// @name         Primary Contact Link
// @namespace    PXgamer
// @version      0.1
// @description  Add Primary Contact link to Order Edits
// @author       PXgamer
// @match        *caramel/orderitems/*/edit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18608/Primary%20Contact%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/18608/Primary%20Contact%20Link.meta.js
// ==/UserScript==

var contactID  = "";
var contactURL = "";

function main () {
    'use strict';

    contactID  = $('#primaryContact').val();
    contactURL = "http://caramel/contacts/" + contactID + "/edit";
    if (contactID !== '') {
        $('#primaryContact').css('width', '94.6%');
        $('#primaryContact').css('display', 'inline-block');
        $('#primaryContact').after(
        '<a class="btn iconOnly urlInputLink" id="contactLink" href="' +
        contactURL +
        '" target="_blank" style="margin-bottom: 2px; margin-left: 0.2%;"><i class="icon-share"></i></a>'
    );
    }
    else {
        $('#contactLink').removeAttr("href");
        $('#contactLink').addClass("disabled");
    }
}

document.ready = main();
$('#primaryContact').change(
    function () {
    'use strict';

    contactID  = $('#primaryContact').val();
    if (contactID !== '') {
        contactID  = $('#primaryContact').val();
        contactURL = "http://caramel/contacts/" + contactID + "/edit";
        $('#contactLink').removeClass("disabled");
        $('#contactLink').attr("href", contactURL);
    }
    else {
        $('#contactLink').removeAttr("href");
        $('#contactLink').addClass("disabled");
    }
}
);