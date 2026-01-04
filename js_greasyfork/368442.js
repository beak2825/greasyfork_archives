// ==UserScript==
// @name Geis PreHistoric Integration
// @namespace http://tampermonkey.net/
// @version 0.4.7
// @description Connects to prestashop API to fill forms in Geis website
// @author Eryk Wróbel
// @match https://geis.pl/*
// @match https://gclient.geis.pl/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/368442/Geis%20PreHistoric%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/368442/Geis%20PreHistoric%20Integration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var order_id = ''; // leave empty
    var api_url = 'https://meblujdom.pl/api/'; // paste Your API URL, have to be with https
    var packageInsuranceValue = 1000; // your insurance per package value from agreement
    var apiKey = "AVDIT6KM4XNEH6GM565FXMRKIWMN5AE9"; // Your Api key from webservice
    var cod_id_order = 26; // it is ussualy 3 because order with Cash On Delivery is set default to have id 3

// If parcel collection was send to Geis and we received shipping number
// After click on added button
    if( $('#ctl00_ContentPH_ctl00_packNumber').length ) {

        var order_id_to_submit_shipping_number = $('#ctl00_ContentPH_ctl00_customerReference').val().replace(/\D/g,'');
        var shipping_number = $('#ctl00_ContentPH_ctl00_packNumber').val();

        $('#ctl00_ContentPH_ctl00_packNumber').after('<a class="btnRepeat" id="submit_shipping_number">Wstaw numer śledzenia ' + shipping_number + ' do zamówienia ' + order_id_to_submit_shipping_number + '</a>');
        $('#submit_shipping_number').click(function(){

            insertShippingNumber(order_id_to_submit_shipping_number, shipping_number, $('#submit_shipping_number'));


// stara wersja
            /*var $xml = '';
             var $xml_shipping_number = '';
             var $xml_current_state = '';
             var $xml_valid = '';

             $.ajax({
             url: api_url + 'orders/' + order_id_to_submit_shipping_number,
             type: "GET", //This is what you should chage
             dataType: "xml",
             username: apiKey,
             password: "",
             processData: false,
             contentType: "xml",
             success: function (data) {

             $xml = $(data),

             /!* Add tracking number *!/
             $xml_shipping_number = $xml.find( "shipping_number" );
             $xml_shipping_number.text(shipping_number);

             /!* Change Status to Awaiting shipping *!/
             $xml_current_state = $xml.find( "current_state" );
             $xml_current_state.text(29); // id od current state for Awaiting shipping

             $xml_valid = $xml.find( "valid" );
             $xml_valid.text(1);


             // now let's send this to API
             $.ajax({
             url: api_url + 'orders/' + order_id_to_submit_shipping_number,
             type: "PUT", //This is what you should chage
             dataType: "xml",
             username: apiKey,
             password: "",
             data: data,
             processData: false,
             success: function () {
             // dodaj tutaj, że wysłano i zapisano
             console.log('Inserted shipping number ' + + ' to order '+ order_id_to_submit_shipping_number);
             },
             error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
             alert(xhr.status);
             alert(xhr.responseText);
             },
             });

             },
             error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
             alert(xhr.status);
             alert(xhr.responseText);
             },
             });*/


// send email
        });
    }

    $("body").after(
        '<div id="extra_content" style="position:fixed; right: 15px; top: 120px; font: bold 12px Arial, Tahoma; background: #ecf0f1; border-radius:5px; padding: 8px;">\
        <p>Wklej ID Zamówienia z Presty tutaj</p>\
        <input type="number" id="presta_order_id" name="presta_order_id">\
        <input type="submit" id="submit_order_id" name="submit_id">\
        </div>\
        <style>.colorPack input[type="text"], .colorPack input[type="password"], .colorPack textarea, .colorPack select, input.colorPack[type="text"], input.colorPack[type="password"], textarea.colorPack, select.colorPack{background-color: #c3daf9;padding: 3px;border-radius: 3px;}</style>\
        ');

    if ($('#submit_order_id') !== '') {
        $('#submit_order_id').click(function(){
            var order_id = $('#presta_order_id').val();
            getOrderAndShippingInfo(order_id);
        });
    } else {
        $('#extra_content p').css('color','red');
    }

    /* Logic and connection to retrive information (int)id */
    function getOrderAndShippingInfo(order_id) {

        if (order_id !== '') {

            var orderRequest = new XMLHttpRequest();
            orderRequest.open('GET', api_url + 'orders/' + order_id + '?output_format=JSON', true, apiKey, "");
            orderRequest.onload = function(){
                var orderData = JSON.parse(orderRequest.responseText);

                $('#ctl00_ContentPH_ctl00_customerReference').val(orderData.order.id + ' ' + orderData.order.reference); // Adding reference

// Adds a list of product to see what You need to send
// Does not automatically because sometimes You need change quantity of packages
                $('#ctl00_ContentPH_ctl00_packRowsParcelDt_ctl00').prepend('<div id="order_products" class="order_products" style="background:#efefef;padding:3px;border-radius:5px;"></div>');
                $('.order_products').html(''); // clear before adding if You made a wrong ID

// now let's get some products from order in this way because default version
// from only order not order_details is fucked up
                var boughtProducts = [];
                $.ajax({
                    url: api_url + 'order_details/?display=[product_name,product_quantity,unit_price_tax_incl]&filter[id_order]=' + order_id + '&output_format=JSON',
                    type: "GET",
                    username: apiKey,
                    password: "",
                    dataType: "json",
                    processData: false,
                    success: function (data) {
                        $(data.order_details).each(function(key, val){
//var quantities = (val.product_quantity > 1) ? 'x' + val.product_quantity + ' ' : '';
                            var quantities = 'x' + val.product_quantity + ' ';
                            val.product_name = shorterProductName(val.product_name);
                            $('#order_products').append('<p><span class="bought_products" id="product_name'+key+'" style="padding: 5px 8px; background: #fff; cursor:pointer; font-weight:bold;border-radius:5px" title="Kliknij by skopiować do schowka"><strong>' + quantities + '</strong>' + shorterProductName(val.product_name) + '</span></p>');
                            $('#product_name'+key).click(function(){
                                copyToClipboard('#product_name'+key);
                            });
                            boughtProducts.push(quantities + val.product_name );
                        });

//If there is only item bought it will add name of product with quantity to adnotation to easly find this info on label
                        if (boughtProducts.length == 1) {
                            $('#ctl00_ContentPH_ctl00_recNote, #ctl00_ContentPH_ctl00_packRowsParcelDt_ctl00_row0_note').val(boughtProducts[0]);
                            $('#ctl00_ContentPH_ctl00_packRowsParcelDt_ctl00_row0_count').val(1);
                            $('#ctl00_ContentPH_ctl00_packRowsParcelDt_ctl00_row0_weight').val(30);
                        } else {
                            $('#ctl00_ContentPH_ctl00_recNote, #ctl00_ContentPH_ctl00_packRowsParcelDt_ctl00_row0_note').val('');
                            $('#ctl00_ContentPH_ctl00_packRowsParcelDt_ctl00_row0_count').val('');
                            $('#ctl00_ContentPH_ctl00_packRowsParcelDt_ctl00_row0_weight').val('');
                        }
                    }
                });

                $("#order_products").append('<p style="font-size:14px" class="payment_type">Płatność: <strong style="color: red">' + orderData.order.payment + '</strong></p>'); // add warning about current payment

// retrieve order state histories
                var orderHistoriesRequest = new XMLHttpRequest();
                orderHistoriesRequest.open('GET', api_url + 'order_histories/?display=full&filter[id_order]=[' + orderData.order.id + ']&output_format=JSON&sort=[id_DESC]', true, apiKey, "");
                orderHistoriesRequest.onload = function(){
                    var orderHistories = JSON.parse(orderHistoriesRequest.responseText);

                    $(orderHistories.order_histories).each(function(key, val){
                        $('#order_products').append('<p id="elem'+key+'"><span style="padding: 2px 5px; background: #fff;">' + val.date_add + ':</span></p>');

// connecting to receive information about current state addres
                        var currentStateRequest = new XMLHttpRequest();
                        currentStateRequest.open('GET', api_url + 'order_states/?display=[name,color]&filter[id]=[' + val.id_order_state + ']&output_format=JSON', true, apiKey, "");
                        currentStateRequest.onload = function(){
                            if(currentStateRequest.status == 200){
                                var state = JSON.parse(currentStateRequest.responseText);
                                var payment_type = $('.payment_type > strong').text();

                                if (state.order_states[0].name == 'Dostarczone' && (payment_type == 'Płatność przy odbiorze' || payment_type == 'Allegro: Płatność przy odbiorze (COD)')) {
                                    alert('Uwaga: Zamówienie jest już dostarczone, jednak jest ono zaznaczone za pobraniem! Odznacz pobranie jeśli wysyłasz REKLAMACJE lub zmień kwotę gdy dosyłasz tylko resztę produków! Odznaczono zamówienie za pobraniem.');
                                    setTimeout(function(){
                                        $('#elem_20').attr('selected', false).click().click(); // double click to prevent some weird behavior
                                    }, 100);
                                }

                                if (state.order_states[0].name == 'Zamówienie za pobraniem przyjęte' && (payment_type == 'przelew na konto' || payment_type == 'PayU') ){
                                    alert('Uwaga: wybrana płatność to: ' + payment_type + ' jednak w historii statusów widnieje status: ' + state.order_states[0].name +'. Sprawdź czy wszystko jest ok i zaznacz ręcznie przysyłkę COD jeśli jednak jest pobraniowa.')
                                }

                                $('#elem'+key).append('<span style="padding:2px; border-radius:3px; background:' + state.order_states[0].color + '">' + state.order_states[0].name + '</span>');
                            }
                        };
                        currentStateRequest.send();
                    });
                };
                orderHistoriesRequest.send();

//console.log(orderData.order);
// If order is COD "Pay when received" or Cash on delivery then insert order value in specific fields
                if (orderData.order.module == 'cashondelivery' || orderData.order.payment == 'Płatność przy odbiorze' || orderData.order.current_state == cod_id_order || orderData.order.payment == 'Allegro: Płatność przy odbiorze (COD)') {

                    if ((orderData.order.total_paid_real*1) != (orderData.order.total_paid_tax_incl*1)) {
                        alert('UWAGA! UWAGA!!! Cena za pobranie jest inna niż cena zamówienia - sprawdź czy wynikło to ze zdublowania płatności i wpisz dobrą wartość pobrania!')
                    }

                    $('#ctl00_ContentPH_ctl00_tServicePackage_srvTxtPrice_2_-2').val((orderData.order.total_paid_real*1).toFixed(2)); // Value of COD, multiply string by 1 to get number instead of string
                    $('#ctl00_ContentPH_ctl00_tServicePackage_srvChbChoise_2').prop('checked', true); // enable COD
                } else {
                    $('#ctl00_ContentPH_ctl00_tServicePackage_srvTxtPrice_2_-2').val(''); // reset COD
                    $('#ctl00_ContentPH_ctl00_tServicePackage_srvChbChoise_2').prop('checked', false); // disable COD
                }

// now let's have customer info
                var id_customer = orderData.order.id_customer;
                if (id_customer !== '') {
// connecting to receive information about shipping addres
                    var customerRequest = new XMLHttpRequest();
                    customerRequest.open('GET', api_url + 'customers/' + id_customer + '?output_format=JSON', true, apiKey, "");
                    customerRequest.onload = function(){
                        var customerData = JSON.parse(customerRequest.responseText);

                        $('#ctl00_ContentPH_ctl00_recContactEmail').val(customerData.customer.email); // enable Insurance checkbox
                    };
                    customerRequest.send();
                }

// now let's have customer shipping data
                var id_address = orderData.order.id_address_delivery;
// Get all shipping data
                if (id_address !== '') {
// connecting to receive information about shipping addres
                    var addressRequest = new XMLHttpRequest();
                    addressRequest.open('GET', api_url + 'addresses/' + id_address + '?output_format=JSON', true, apiKey, "");
                    addressRequest.onload = function(){
                        var addressData = JSON.parse(addressRequest.responseText);

                        $('#ctl00_ContentPH_ctl00_tServicePackage_srvTxtPrice_3_-2').val(packageInsuranceValue); // Insurance for package
                        $('#ctl00_ContentPH_ctl00_tServicePackage_srvChbChoise_3').prop('checked', true); // enable Insurance checkbox

                        if (addressData.address.company !== '')
                            addressData.address.company = addressData.address.company + ' ';
                        $('#ctl00_ContentPH_ctl00_recName').val(addressData.address.company+ucwords(addressData.address.firstname, true) + ' ' + ucwords(addressData.address.lastname, true)); // Company

                        $('#ctl00_ContentPH_ctl00_recContactName').val(ucwords(addressData.address.firstname + ' ' + addressData.address.lastname, true)); // Contact person

//if (addressData.address.address2 !== '')
// addressData.address.address2 = addressData.address.address1 + ' ';

                        $('#ctl00_ContentPH_ctl00_recStreet').val(ucwords(addressData.address.address1+' '+addressData.address.address2, true)); // Address
                        $('#ctl00_ContentPH_ctl00_recCity').val(ucwords(addressData.address.city), true); // City
                        $('#ctl00_ContentPH_ctl00_recZipCode').val(addressData.address.postcode.replace(/\D/g,'')); // Post Code
                        
                        // first 2 digits of postal codes
                        var nearby_areas = [35,36,37,39];
                        if (nearby_areas.includes(addressData.address.postcode.replace(/\D/g,'').substr(0,2)*1)) {
                            alert('WYSYŁKA BLISKO NAS!!! Sprawdź czy może się opłacać to zawieźć samemu.');
                        }
                        
                        if (addressData.address.phone.includes('+48')){
                            $('#ctl00_ContentPH_ctl00_recContactPhone').val('+' + addressData.address.phone.replace(/\D/g,'')); // Telephone with added +48
                        } else {
                            $('#ctl00_ContentPH_ctl00_recContactPhone').val('+48' + addressData.address.phone.replace(/\D/g,'')); // Telephone
                        }

                        $('#ctl00_ContentPH_ctl00_tServicePackage_srvTxt_31_1').val('+48' + addressData.address.phone.replace(/\D/g,'')); // Telephone
                        if (addressData.address.phone == '' || addressData.address.phone == null && addressData.address.phone_mobile){
                            $('#ctl00_ContentPH_ctl00_tServicePackage_srvTxt_31_1').val('+48' + addressData.address.phone_mobile.replace(/\D/g,'')); // Telephone Mobile
                            $('#ctl00_ContentPH_ctl00_recContactPhone').val('+48' + addressData.address.phone_mobile.replace(/\D/g,'')); // Telephone Mobile
                        }

                        $('#ctl00_ContentPH_ctl00_tServicePackage_srvChbChoise_31').prop('checked', true); // enable B2C
                    };
                    addressRequest.send();
                }

                if (orderRequest.status == 200){
                    $('#extra_content').append('<p id="extra_address_info" style="font-weight:bold; color:green;">Załadowano dane adresowe Klienta</p>');

// get order messages
                    $.ajax({
                        url: api_url+'customer_threads/?display=full&filter[id_order]=[' + order_id + ']&output_format=JSON',
                        type: "GET",
                        success: function(data) {
                            $('#ctl00_ContentPH_ctl00_packRowsParcelDt_ctl00').prepend('<div id="order_messages" style="margin:10px 0; padding: 8px; background: #e0e0e0"></div>');
                            if (data.length != 0) {
                                $(data.customer_threads[0].associations.customer_messages).each(function (key, val) {
                                    $.ajax({
                                        url: api_url + 'customer_messages/' + val.id + '?&output_format=JSON',
                                        type: "GET",
                                        async: false, // use this to get them in right order
                                        success: function (data, xhr) {

                                            if (xhr == 'success') {
                                                $(data.customer_message).each(function (key, val) {
                                                    if (val.id_employee == '0') {
                                                        var style = 'background: #dbe9ef; border-radius:3px; border:1px solid #c4dce6; padding: 8px; margin: 5px 0 5px 0';
                                                    } else {
                                                        var style = 'background: #fff; border-radius:3px; border:1px solid #dedede; padding: 8px; margin: 5px 0 5px 0';
                                                    }

                                                    if (val.private == '1') {
                                                        val.message = '<strong>Notatka: </strong>' + val.message;
                                                    }

                                                    $('#order_messages').append('<div style="' + style + '"><i>' + val.date_add + ':</i><br> ' + val.message.replace(/\n/g,"<br>") + '</div>');
                                                });
                                            }
                                        },
                                    });
                                })
                            }
                            ;
                        },
                    });


                } else {
                    $('#extra_content').append('<p id="extra_address_info" style="font-weight:bold; color:red;">Wystąpił jakiś problem, spróbuj jeszcze raz</p>');
                }

            };
            orderRequest.send();
        }
    }

    function insertShippingNumber(order_id_to_submit_shipping_number, shipping_number, $node_object) {

// If parcel collection was send to DPD and we received shipping number
// After click on added button

        /* Removed due to some API problems */

        shipping_number = 'Geis: ' + shipping_number;

// send email
        $.ajax({
            url: 'https://meblujdom.pl/modules/dpdtracking/update_tracking_number.php?id_order=' + order_id_to_submit_shipping_number + '&security_token=Isu6AjdOsPeAXeoPa&shipping_number=' + shipping_number,
            type: "GET",
            processData: false,
            success: function (data) {
//console.log(data);
                createCookie(order_id_to_submit_shipping_number, '', -1); // remove previous cookie if had it
                console.log('Inserted ' + shipping_number + ' shipping number to order ' + order_id_to_submit_shipping_number);
                $($node_object).text(data);
            },
            error: function (xhr, ajaxOptions, thrownError) { // Add these parameters to display the required response
                alert(xhr.status);
                alert(xhr.responseText);
            },
        });
// KONIEC WYSYŁANIA NUMERU DO PRESTY
    }


// thanks to https://stackoverflow.com/questions/11145464/how-to-modify-the-first-letter-of-each-word-in-a-string-using-javascript-while-k
    function ucwords(text) {
        var split = text.split(" "),
            res = [],
            i,
            len,
            component;

        $(split).each(function (index, element) {

            component = (element + "").trim();
            var first = component.substring(0, 1).toUpperCase();
            var remain = component.substring(1).toLowerCase();

            res.push(first);
            res.push(remain);
            res.push(" ");

        });

        return res.join("").trim();
    }

//https://stackoverflow.com/questions/22581345/click-button-copy-to-clipboard-using-jquery
    function copyToClipboard(element) {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(element).text()).select();
        document.execCommand("copy");
        $temp.remove();
    }

    function shorterProductName(product_name) {
        var shorter = product_name.replace(/, Wymiar do wyboru :|, Powierzchnia spania :| - Kolorystyka produktu :| gamingowy| obrotowy| - Kolorystyka foteli i mebli wypoczynkowych :| nóżki Signal|/gi, '');

        return shorter;
    }

// https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
    function createCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function eraseCookie(name) {
        createCookie(name,"",-1);
    }

})();