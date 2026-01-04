// ==UserScript==
// @name         MT OrderAutoFill
// @namespace    https://greasyfork.org/en/users/370170
// @version      0.4
// @description  Script for fast fill inputs in new order
// @author       Radoslaw Rusek
// @match        https://beta.app.mediatask.pl/orders/new
// @match        https://app.mediatask.pl/orders/new
// @match        http://localhost/orders/new
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/393402/MT%20OrderAutoFill.user.js
// @updateURL https://update.greasyfork.org/scripts/393402/MT%20OrderAutoFill.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("body").on('DOMSubtreeModified', ".attributes_inputs", function() {
        var selects = $(".attributes_inputs .form-control.select");
        selects.each(function(){
            $(this).find("option").eq(1).prop('selected', true);
        })
    });
    $(".form-control.string").val("test");
    $("#order_agency_id option").eq(1).prop('selected', true);
    $("#order_product_id option").eq(2).prop('selected', true).trigger('change');

})();