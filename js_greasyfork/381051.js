// ==UserScript==
// @name         gonz x supreme checkout autofill
// @version      1.3.6
// @description  Autofills Billing, Select Size and Clicks thru to Cart
// @author       gonz
// @include      http://www.supremenewyork.com/*
// @include      https://www.supremenewyork.com/*
// @include      https://www.supremenewyork.com/checkout
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @require      http://code.jquery.com/jquery-latest.min.js
// @namespace    https://greasyfork.org/users/18630
// @downloadURL https://update.greasyfork.org/scripts/381051/gonz%20x%20supreme%20checkout%20autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/381051/gonz%20x%20supreme%20checkout%20autofill.meta.js
// ==/UserScript==

/* CHECKOUT PAGE */
if (window.location.toString() === "https://www.supremenewyork.com/checkout") {

    var c_name = "";
    var c_email = "";
    var c_addy = "";
    var c_addy2 = "";
    var c_phone = "";
    var c_zip = "";
    var c_city = "";
    var c_state = "";
    var c_country = "";
    var c_ccnum = "";
    var c_ccmonth = "";
    var c_ccyear = "";
    var c_ccccv = "";

    $('.iCheck-helper').click();
    //$('p input').click();

    GM_setValue("working", false);

    if ( $("#cart-address .errors").length) {
        $('#cart-address div:eq(1) input').val( c_name );
        $('#cart-address div:eq(2) input').val( c_email );
        $('#cart-address div:eq(3) input').val( c_phone );
    } else  {
        billing();
    }


    function billing() {
        $('#cart-address div:eq(0) input').val( c_name );
        $('#cart-address div:eq(1) input').val( c_email );
        $('#cart-address div:eq(2) input').val( c_phone );
        $('#cart-address div:eq(3) div:eq(0) input').val( c_addy );
        $('#cart-address div:eq(3) div:eq(1) input').val(  c_addy2 );
        $('#cart-address div:eq(6) div:eq(0) input').val( c_zip );
        $('#cart-address div:eq(6) div:eq(1) input').val( c_city );
        $('#cart-address div:eq(6) div:eq(2) select').val( c_state );
        $("#card_details input:eq(0)").focus();
        $("#card_details input:eq(0)").val( c_ccnum );
        $("#card_details input:eq(1)").val( c_ccccv );
        $('#card_details select:eq(0)').val( c_ccmonth );
        $('#card_details select:eq(1)').val( c_ccyear );
        $("#card_details input:eq(0)").focus();
        //$("#card_details input:eq(1)").focus();
    }
}