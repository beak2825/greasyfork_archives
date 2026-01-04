// ==UserScript==
// @name         YEEZY SUPPLY
// @version      1.1.1
// @description  cook
// @author       heygonz
// @include      *yeezysupply.com/*
// @include      *checkout.shopifycs.com/*
// @include      *checkout.shopify.com/*
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant        GM_log
// @namespace https://greasyfork.org/users/18630
// @downloadURL https://update.greasyfork.org/scripts/35335/YEEZY%20SUPPLY.user.js
// @updateURL https://update.greasyfork.org/scripts/35335/YEEZY%20SUPPLY.meta.js
// ==/UserScript==


$(document).ready(function() {

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ENTER YOUR INFORMATION BELOW
    //
    // SET THE ORDER OF SIZES YOU WANT TO TRY AND CART. SIZES ON THE LEFT ARE ATTEMPTED FIRST AND CONTINUE
    // RIGHT UNTIL AN AVAILABLE SIZE IS CARTED OR STOCK IS SOLD OUT. IF YOU DO NOT WANT TO PURCHASE A CERTAIN SIZE(S),
    // REMOVE THEM FROM THE LIST.
    //
    var size = [ "11", "10", "9", "8", "7" ];
    //
    // ENTER SHIPPING INFO.
    //
    var email = "youremail@here.com";
    var firstName = "first_name";
    var lastName = "last_name";
    var address1 = "address";
    var address2 = "";
    var city = "Sacramento";
    var zip = "55555";
    var phone = "5555555555";
    //
    // ALL ITEMS WITH cc ARE CREDIT CARD VALUES. ccVeri IS SECURITY CODE.
    //
    var ccNumber = "1111222233334444";
    var ccName = "Firstname LastName";
    var ccExpir = "04/20";
    var ccVeri = "666";
    //
    // IF YOU WOULD LIKE TO USE A DIFFERENT BILLING ADDRESS, CHANGE false TO true BELOW AND ENTER INFO HERE. OTHERWISE LEAVE BLANK.
    //
    var billingAddress = false;
    var b_firstName = "";
    var b_lastName = "";
    var b_address1 = "";
    var b_address2 = "";
    var b_city = "";
    var b_zip = "";
    var b_phone = "";
    //
    // AUTO SUBMITS ORDER. DEFAULT SET TO OFF, REQUIRING YOU TO CLICK TO COMPLETE PURCHASE. ENABLE AT YOUR OWN RISK. CHANGE false TO true.
    //
    var submit = false;
    //
    // DO NOT CHANGE ANYTHING BELOW
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var cont1 = $('.K__button');
    var contButton = $('.step__footer__continue-btn.btn');
    var paymentPage = $('.section__title:contains("Billing Address")');
    var refresh = 5000;

    if ( $('.ProductGrid.js-product-grid').length || window.location.href == "https://yeezysupply.com" )
        search();

    if ( $('.PI__wrap.js-insert-select-sizes').length )
        sizeSelect();

    if ( cont1.length )
        $('.K__button').click();

    if ( $('#checkout_email').length )
        shipping();

    if ( contButton.text().trim() == "Continue to payment method" )
        contButton.click();

    if ( $('#number').length )
        billing();

    if ( contButton.text().trim() == "Complete order" ) {
        if ( billingAddress )
            billing2();
        if ( submit )
            contButton.click();
    }

        if ( $('.section:contains("A CONFIRMATION EMAIL")').length)
        $(location).attr('href', 'https://yeezysupply.com');

    // SEARCHES THE PRODUCT PAGE FOR YEEZY LINK. IF NO LINK IS FOUND, PAGE WILL REFRESH.
    // IF FOUND, WINDOW WILL REDIRECT TO LINK.
    function search() {
        var link = [];
        var i = 0;

        link[0] = $('a[href*="frozen"]').attr("href");
        link[1] = $('a[href*="FROZEN"]').attr("href");
        link[2] = $('a[href*="v2"]').attr("href");
        link[3] = $('a[href*="V2"]').attr("href");
        link[4] = $('a[href*="YEEZY"]').attr("href");
        link[5] = $('a[href*="yeezy"]').attr("href");
        link[6] = $('a[href*="boost"]').attr("href");
        link[7] = $('a[href*="BOOST"]').attr("href");
        link[8] = $('a[href*="350"]').attr("href");

        while (link[i] === undefined && i<9)
            i++;
        if (i == 9)
            setTimeout(function() {location.reload();}, refresh);
        else
            window.location.href = link[i];
    }

    // SELECTS SIZE OF SHOE AND CONTINUES. IF SIZE IS SOLD OUT, WILL CONTINUE TO NEXT SIZE
    // UNTIL ONE IS AVAILABLE. IF NO SIZES ARE AVAILABLE, THAT MEANS THE SHOE IS SOLD OUT.
    function sizeSelect() {
        var i = 0;
        cartSize(size, i);

        while ( ( $('select :selected').attr('class') == "sold-out" || $('select :selected').text() == "SIZE" ) && i < size.length) {
            cartSize(size, i);
            i++;
        }

        if ($('select :selected').attr('class') == "sold-out" || $('select :selected').text() == "SIZE")
            alert("Your selected sizes are not available.");

        function cartSize( size, i) {
            $('.PI__select.PI__input.js-select.js-select-SIZE.js-select-SIZE-static option').filter(function() {
                return $.trim( $(this).text() ) == size[i];
            }).attr('selected','selected');
        }
    }

    // SHIPPING INFO
    function shipping() {
        $('#checkout_email').val( email );
        $('#checkout_shipping_address_first_name').val( firstName );
        $('#checkout_shipping_address_last_name').val( lastName );
        $('#checkout_shipping_address_address1').val( address1 );
        $('#checkout_shipping_address_address2').val( address2 );
        $('#checkout_shipping_address_city').val( city );
        $('#checkout_shipping_address_zip').val( zip );
        $('#checkout_shipping_address_phone').val( phone );

        if ( ! $('p:contains("Captcha validation failed. Please try again.")').length) {
            contButton.click();
        }
    }

    // BILLING INFO
    function billing() {
        $('#number').val( ccNumber );
        $('#name').val( ccName );
        $('#expiry').val( ccExpir );
        $('#verification_value').val( ccVeri );
    }

    // BILLING ADDRESS INFO
    function billing2() {
        $('input[value="true"]').click();
        $('#checkout_billing_address_first_name').val( b_firstName );
        $('#checkout_billing_address_last_name').val( b_lastName );
        $('#checkout_billing_address_address1').val( b_address1 );
        $('#checkout_billing_address_address2').val( b_address2 );
        $('#checkout_billing_address_city').val( b_city );
        $('#checkout_billing_address_zip').val( b_zip );
        $('#checkout_billing_address_phone').val( b_phone );
    }



});