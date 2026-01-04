// ==UserScript==
// @name Apaczka Integration
// @namespace http://tampermonkey.net/
// @version 0.1.48
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @description Connects to prestashop API to fill forms in Apaczka website
// @author Eryk Wróbel
// @match https://www.apaczka.pl/*
// @match https://panel.apaczka.pl/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/373568/Apaczka%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/373568/Apaczka%20Integration.meta.js
// ==/UserScript==

// usefull stuff


// Changelog
// v 0.1.48 - Fixed Package Content
// v 0.1.47 - zmiana formatu pobrania z przecinka i polskiego formatu na cywilizowany xxxx.xx,
// pierwsza wersja address splitera rozszczepiającego adres np "ulica sezamkowa 1" na osobną nazwę i ulicę
// poprawka usuwająca przedrostek 48 z numeru telefonu
// wybieranie odpowiedniego kuriera Pocztexu
// v 0.1.46 - fix new pointers
// v 0.1.45 - fix nowe dane do konta
// v 0.1.44 - fix dodawania listu do presty
// v 0.1.43 - fix fields to append button to send shipping number on confirmation page
// v 0.1.42 - account number fix
// v 0.1.41 - postcode fix
// v 0.1.40 - changes for new apaczka form, bug haunting
// v 0.1.36 - Fix for Allegro COD
// v 0.1.34 - moved functions to external file
// v 0.1.33 - minor fix
// v 0.1.3 - extra shipping number added
// v 0.1.2 - feature to be able add shipping number right after deploy
// v 0.1.02 - hot fix for being able quickly add shipping number
// v 0.1.01 - small fixes to target new containers and new adresses
// v 0.1.0 - small fix about CoD Allegro packages
// v 0.0.9 Added checks for paid in advance to display a warning
// v 0.0.8 Fix for Pocztex 48, it needs to be done again with feature that will find out automatically courier
// v 0.0.7 Check for close areas
// v 0.0.6 Add automaticaly fill package dimensions
// v 0.0.5 Fix some cookie issues
// v 0.0.4 Fix for customer and contact name
// v 0.0.3 Fix for sender City name
// v 0.0.2 added option to insert shipping number
// v 0.1 - basic start

$.getScript('https://meblujdom.pl/js/useful_functions.js?ver=0.034', function() {
    (function() {
        'use strict';

        let order_id = ''; // leave empty
        let api_url = 'https://meblujdom.pl/api/'; // paste Your API URL, have to be with https
        let apiKey = "AVDIT6KM4XNEH6GM565FXMRKIWMN5AE9"; // Your Api key from webservice
        let cod_id_order = [26, 41]; // it is ussualy 3 because order with Cash On Delivery is set default to have id 3
        //let allegro_cod_status_id = 41; // Id of status for COD Allegro imported order
        let awaiting_shipping_id = 29; // Id of status that is set when package is awaiting shipping
        let senderName = 'Bogusław Blat';
        let senderPhoneNumber = '669748899';
        let senderEmail = 'biuro@meblujdom.pl';
        let char_limit = 54; // Limit for description of products
        let package_in_preparation_status_id = 45; // id of status that has to be set when package was prepared but shipping number is not set because it is not printed
        let package_value = 1000; //package value declaration in PLN
        let account_number = '60102044050000210206248365';
        let textAreaSelector = '#formItemContent'; // order product content

        // Those are elements that needs to be filled - it will speed up integration in the future
        //var company_field = $('input[name="order[address][1][name]"]');
        //var first_name = $('input[name="order[address][1][name]"]');

        /***** CUSTOM STYLES ********/
        $('body').prepend('<style>.fieldo{color: #000;padding: 0 40px 0 10px;background: #e1e1e1;line-height: 39px;border: none;font-size: 14px;box-sizing: border-box; outline: none;}</style>');

// Add form in package submit
        if (window.location.href.indexOf("formularz?formVersion=3") > -1 || window.location.href.includes("formularz")) {
            $('.orderBanner').hide();

            $(".headerNumber:contains('1.')").parent().parent().prepend(
                '<div id="extra_content" class="formItem">\
                <input type="text" id="presta_order_id" name="presta_order_id" placeholder="Tutaj wklej ID zamówienia z PRESTY" style="width:40%">\
                <div class="fieldo" id="submit_order_id" style="width:40%; cursor: pointer; background-color: #666; float:right">Pobierz dane z Presty</div>\
                </div>\
                ');

            $('#formItemAddressSenderName').val('Salon "MeblujDom.pl"');
            $('#formItemAddressSenderStreet').val('Towarowa');
            $('#formItemAddressSenderHouseNumber').val('4');
            $('#formItemAddressSenderFlatNumber').val('');
            $('#formItemAddressSenderPostalCode, #formItemAddressSenderPostalCode2').val('36-100');
            $('#formItemAddressSenderCity').val('Kolbuszowa');
            $('#formItemAddressSenderContactPerson').val(senderName);
            $('#formItemAddressSenderEmail').val(senderEmail);
            $('#formItemAddressSenderPhone').val(senderPhoneNumber);
        }

        /* Function that is triggered after inserting order ID in preparing a new package */
        $('#submit_order_id').click(function () {
            //clear old fields
            $('#order_messages, .payment_type').remove();

            order_id = $('#presta_order_id').val();
            getOrderAndShippingInfo(order_id);

            $('#formItemShipment0Dimension1, #formItemShipment0Dimension2, #formItemShipment0Dimension3').val('83');
            $('#formItemShipment0Weight').val('23').click();
            setTimeout(function(){
                $('#formItemService60').click(); // select Pocztex at the begining
            }, 350);

        });


        /* Logic and connection to retrive information (int)id */
        function getOrderAndShippingInfo(order_id) {
            if (order_id !== '') {
                let orderRequest = new XMLHttpRequest();
                orderRequest.open('GET', api_url + 'orders/' + order_id + '?output_format=JSON', true, apiKey, "");
                orderRequest.onload = function(){
                    let orderData = JSON.parse(orderRequest.responseText);
                    console.log(orderData);

                    // @todo może kiedyś uda się namierzyć funkcję odpowiedzialną za rozwinięcie tego
                    $('#orderAddressSenderMap').click();
                    $('#orderAddressSenderMapInput').val('230822').change(); // próba wymuszenia punktu odbioru

                    $('#formItemShipmentValue').val(package_value); // wartość paczki do ubezpieczenia
                    $('#formItemComment').val(orderData.order.id + ' ' + orderData.order.reference); // Adding reference

                    // Adds a list of product to see what You need to send
                    // Does not automatically because sometimes You need change quantity of packages
                    $('.layoutSectionBackground').append(
                        '<div id="order_products" class="order_products" ' +
                        'style="background:#efefef;padding:13px;border-radius:5px;text-align:left;line-height:28px">' +
                        '</div>'
                    );

                    $('#order_products').html(''); // clear before adding if You made a wrong ID

// now let's get some products from order in this way because default version
// from only order not order_details is fucked up
                    $.ajax({
                        url: api_url + 'order_details/?display=[product_id,product_name,product_attribute_id,product_quantity,unit_price_tax_incl]&filter[id_order]=' + order_id + '&output_format=JSON',
                        type: "GET",
                        username: apiKey,
                        dataType: "json",
                        processData: false,
                        success: function (data) {
                            generateBoughtProductList(data, textAreaSelector, char_limit);
                        }
                    });

                    $("#order_products").before('<p class="payment_type" style="padding: 8px 0;">Płatność: <strong style="color: red">' + orderData.order.payment + '</strong></p>'); // add warning about current payment
                    $('.payment_type').after('<p id="order_value" style="padding: 8px 0;"><strong>Wartość zamówienia: </strong> ' + parseFloat(orderData.order.total_paid_tax_incl, 2) + ' zł</p>');

// retrieve order state histories
                    let orderHistoriesRequest = new XMLHttpRequest();
                    orderHistoriesRequest.open('GET', api_url + 'order_histories/?display=full&filter[id_order]=[' + orderData.order.id + ']&output_format=JSON&sort=[id_DESC]', true, apiKey, "");
                    orderHistoriesRequest.onload = function(){
                        let orderHistories = JSON.parse(orderHistoriesRequest.responseText);

                        $(orderHistories.order_histories).each(function(key, val){
                            $('#order_products').append('<p id="elem'+key+'"><span style="padding: 2px 5px; background: #fff;">' + val.date_add + ':</span></p>');

// connecting to receive information about current state addres
                            let currentStateRequest = new XMLHttpRequest();
                            currentStateRequest.open('GET', api_url + 'order_states/?display=[name,color]&filter[id]=[' + val.id_order_state + ']&output_format=JSON', true, apiKey, "");
                            currentStateRequest.onload = function(){
                                if(currentStateRequest.status == 200){
                                    let state = JSON.parse(currentStateRequest.responseText);
                                    let payment_type = $('.payment_type > strong').text();

                                    if (state.order_states[0].name == 'Dostarczone' && (payment_type == 'Płatność przy odbiorze')) {
                                        alert('Uwaga: Zamówienie jest już dostarczone, jednak jest ono zaznaczone za pobraniem! Odznacz pobranie jeśli wysyłasz REKLAMACJE lub zmień kwotę gdy dosyłasz tylko resztę produków! Odznaczono zamówienie za pobraniem.');
                                        setTimeout(function(){
                                            $('#elem_20').attr('selected', false).click().click(); // double click to prevent some weird behavior
                                        }, 100);
                                    }

                                    if (state.order_states[0].name == 'Przesyłka w przygotowaniu' || readCookie('order_state_set') == orderData.order.id) {
                                        $('#submit_id_order_state').css("background","lightgrey").attr("disabled", true).attr("title", "Już nadano taki status");
                                    }

                                    if (state.order_states[0].name == 'Zamówienie za pobraniem przyjęte' && (payment_type == 'przelew na konto' || payment_type == 'PayU') ){
                                        alert('Uwaga: wybrana płatność to: ' + payment_type + ' jednak w historii statusów widnieje status: ' + state.order_states[0].name +'. Sprawdź czy wszystko jest ok i zaznacz ręcznie przysyłkę COD jeśli jednak jest pobraniowa.')
                                    }

                                    if ((state.order_states[0].name == 'Zaliczka zaksięgowana' || state.order_states[0].name == 'Oczekiwanie na wpłatę zaliczki')){
                                        alert('Uwaga: gdzieś w historii jest wspomniana informacja o ZALICZCE. Sprawdź czy może pobranie ma być mniejsze.')
                                    }

                                    $('#elem'+key).append('<span style="padding:2px; border-radius:3px; background:' + state.order_states[0].color + '">' + state.order_states[0].name + '</span>');
                                }
                            };
                            currentStateRequest.send();
                        });
                    };
                    orderHistoriesRequest.send();

// now let's have customer shipping data
                    let id_address = orderData.order.id_address_delivery;
// Get all shipping data
                    if (id_address !== '') {
// connecting to receive information about shipping addres
                        let addressRequest = new XMLHttpRequest();
                        addressRequest.open('GET', api_url + 'addresses/' + id_address + '?output_format=JSON', true, apiKey, "");
                        addressRequest.onload = function(){
                            let addressData = JSON.parse(addressRequest.responseText);
                            console.log(addressData);

                            if (addressData.address.company !== ''){
                                $('#formItemAddressReceiverName').val(addressData.address.company); // Company
                                $('#formItemAddressReceiverContactPerson').val(
                                    ucwords(addressData.address.firstname + ' ' + addressData.address.lastname, true)
                                );
                            } else {
                                $('label[for="orderAddressReceiverTypeResidential"]').click();
                                $('#formItemAddressReceiverName, #formItemAddressReceiverContactPerson').val(ucwords(addressData.address.firstname + ' ' + addressData.address.lastname, true));
                            }

                            // @todo tutaj napisać funkcję o rozszczepieniu adresu
                            let full_address = ucwords(addressData.address.address1 + ' ' +addressData.address.address2, true);
                            let splitted_address = addressSplitter.split(full_address);

                            if (splitted_address.length == 1) {
                                $('#formItemAddressReceiverStreet').val(full_address); // Address
                            } else if (splitted_address.length == 2) {
                                $('#formItemAddressReceiverStreet').val(splitted_address[0]); // street name
                                $('#formItemAddressReceiverHouseNumber').val(splitted_address[1]); // local number
                            } else if (splitted_address.length == 3) {
                                $('#formItemAddressReceiverStreet').val(splitted_address[0]); // street name
                                $('#formItemAddressReceiverHouseNumber').val(splitted_address[1]); // local number
                                $('#formItemAddressReceiverFlatNumber').val(splitted_address[1]); // local number extra
                            } else {
                                $('#formItemAddressReceiverStreet').val(full_address); // Address
                            }

                            $('#formItemAddressReceiverCity').val(ucwords(addressData.address.city), true); // City
                            //$('#formItemAddressReceiverPostalCode').val(addressData.address.postcode.replace(/\D/g,'')).click().blur(); // Post Code
                            $('#formItemAddressReceiverPostalCode, #formItemAddressReceiverPostalCode2').val(addressData.address.postcode).click().blur(); // Post Code

                            // first 2 digits of postal codes
                            let nearby_areas = [35,36,37,38,39];
                            if (nearby_areas.includes(addressData.address.postcode.replace(/\D/g,'').substr(0,2)*1)) {
                                alert('WYSYŁKA BLISKO NAS!!! Sprawdź czy może się opłacać to zawieźć samemu.');
                            }

                            // If order is COD "Pay when received" or Cash on delivery then insert order value in specific fields
                            // They are loaded after checking if post code is OK

                            if (orderData.order.module == 'cashondelivery'
                                || orderData.order.payment == 'Płatność przy odbiorze'
                                || orderData.order.payment == 'Allegro: Płatność przy odbiorze (COD)'
                                || cod_id_order.includes(orderData.order.current_state*1)
                                || orderData.order.payment == 'Allegro: COD') {
                                if (readCookie(order_id)){
                                    if (confirm('Była już nadawana paczka z pobraniem na to zamówienie - wstawić kwotę pobrania ponownie?')) {
                                        setTimeout(function(){
                                            $('#formItemCodAmount').val((orderData.order.total_paid*1).toFixed(2)); // Value of COD, multiply string by 1 to get number instead of string
                                            $('#formRowBankAccount').show();
                                            $('#formItemCodBankAccount').val(account_number);
                                        }, 100);
                                    } else {
//
                                    }
                                } else {
                                    setTimeout(function(){
                                        $('#formItemCodAmount').val((orderData.order.total_paid*1).toFixed(2).toString()); // Value of COD, multiply string by 1 to get number instead of string
                                        $('#formRowBankAccount').show();
                                        $('#formItemCodBankAccount').val(account_number);
                                    }, 100);
                                }
                            }

                            let phone_number = addressData.address.phone.replace(/\D/g,'')
                            if (phone_number.slice(0,2) == '48') {
                                phone_number = phone_number.slice(2);
                            }

                            let phone_mobile_number = addressData.address.phone_mobile.replace(/\D/g,'')
                            if (phone_mobile_number.slice(0,2) == '48') {
                                phone_mobile_number = phone_mobile_number.slice(2);
                            }

                            $('#formItemAddressReceiverPhone').val(phone_number); // Telephone
                            if (addressData.address.phone == '' || addressData.address.phone == null && phone_mobile_number){
                                $('#formItemAddressReceiverPhone').val(phone_mobile_number); // Telephone Mobile
                            }
                        };
                        addressRequest.send();
                    }

// now let's have customer info
                    let id_customer = orderData.order.id_customer;
                    if (id_customer !== '') {
// connecting to receive information about shipping addres
                        let customerRequest = new XMLHttpRequest();
                        customerRequest.open('GET', api_url + 'customers/' + id_customer + '?output_format=JSON', true, apiKey, "");
                        customerRequest.onload = function(){
                            let customerData = JSON.parse(customerRequest.responseText);
                            $('#formItemAddressReceiverEmail').val(customerData.customer.email);
                        };
                        customerRequest.send();
                    }

                    if (orderRequest.status == 200) {
                        $('#extra_content').append('<p id="extra_address_info" style="font-weight:bold; color:green;">Załadowano dane adresowe Klienta</p>');

// get order messages
                        $.ajax({
// If You want to take particular element from request api/orders/?display=[shipping_number]&filter[id]=[3145]&output_format=JSON
                            url: api_url+'customer_threads/?display=full&filter[id_order]=[' + order_id + ']&output_format=JSON',
                            type: "GET",
                            success: function(data) {
                                if (typeof data.customer_threads != 'undefined'){
                                    $('#zlecenieOptions').append('<div id="order_messages" style="margin:10px 0; padding: 8px; background: #e0e0e0"></div>');
                                    $(data.customer_threads[0].associations.customer_messages).each(function (key, val) {
                                        $.ajax({
                                            url: api_url + 'customer_messages/' + val.id + '?&output_format=JSON',
                                            type: "GET",
                                            async: false, // use this to get them in right order
                                            success: function (data, xhr) {
                                                if (xhr == 'success') {
                                                    $(data.customer_message).each(function (key, val) {
                                                        if (val.private == '1') {
                                                            val.message = '<strong>Notatka: </strong>' + val.message;
                                                        }
                                                        if (val.id_employee == '0') {
                                                            let style = 'background: #dbe9ef; border-radius:3px; border:1px solid #c4dce6; padding: 8px; margin: 5px 0 5px 0';
                                                            $('#order_messages').append('<div style="' + style + '"><i>' + val.date_add + ':</i> [Klient]<br> ' + val.message.replace(/\n/g,"<br>") + '</div>');
                                                        } else {
                                                            let style = 'background: #fff; border-radius:3px; border:1px solid #dedede; padding: 8px; margin: 5px 0 5px 0';
                                                            $('#order_messages').append('<div style="' + style + '"><i>' + val.date_add + ':</i> [Pracownik]<br> ' + val.message.replace(/\n/g,"<br>") + '</div>');
                                                        }
                                                    });
                                                }
                                            },
                                        });
                                    });
                                }
                            },
                        });

                    } else {
                        $('#extra_content').append('<p id="extra_address_info" style="font-weight:bold; color:red;">Wystąpił jakiś problem, spróbuj jeszcze raz</p>');
                    }

                };
                orderRequest.send();
            }
        }


// Add Insert delivery number into presta button
        if (window.location.href == 'https://panel.apaczka.pl/zlecenia') {
            $('.orderStatus').on('click', function(){

                let _this = undefined;
                _this = $(this);

                let operator = _this.next().find('.tableDetale > tbody > tr:nth-child(2) > td:nth-child(2)').text();
                order_id = '';
                let shipping_number = '';

// oi u cheecky wanker
                setTimeout(function(){
// write if statement for different comapnies
                    if (operator == 'Poczta Kurier 48'){
                        order_id = _this.next().find('.tableDetale > tbody > tr:nth-child(7) > td:nth-child(2)').text().replace(/\D/g, '')*1;
                        shipping_number = _this.next().find('.tableDetale > tbody > tr:nth-child(3) > td:nth-child(2)').text().replace(/\s/g,'');
                    } else {
                        order_id = _this.next().find('.tableDetale > tbody > tr:nth-child(7) > td:nth-child(2)').text().replace(/\D/g, '')*1;
                        shipping_number = _this.next().find('.tableDetale > tbody > tr:nth-child(3) > td:nth-child(2)').text().replace(/\s/g,'');
                    }

                    if (order_id && shipping_number) {

                        if (!readCookie(order_id)){
                            _this.next().find('.buttonOrangeDownload').before('<a class="buttonOrange" style="background:#d73890" id="submit_shipping_number">Wstaw ' + shipping_number + ' do ' + order_id + '</a>');
                        } else {
                            _this.next().find('.buttonOrangeDownload').before('<a class="buttonOrange buttonOrangeAnuluj" style="background:#d73890" id="">Już wstawiono do ' + order_id + '</a>');
                        }

                        $('#submit_shipping_number').click(function(){
                            insertShippingNumber(order_id, shipping_number, $('#submit_shipping_number'));
                        });
                    }
                },1000);
            });
        }


        if (window.location.href.indexOf("formularz/zlecenia/") > -1) {
            let shipping_number = $(".title:contains('Numer przesyłki:')").next().text();
            let order_id = parseInt($(".title:contains('Dodatkowy komentarz:')").next().text().replace(/\D/g, ''));

            if (order_id && shipping_number) {

                if (!readCookie(order_id)){
                    $("a.button:contains('Pobierz list przewozowy')").before('<a href="#" class="button" id="submit_shipping">Wstaw '+ shipping_number +' do '+ order_id +'</a>');
                } else {
                    $("a.button:contains('Pobierz list przewozowy')").before('<a href="#" class="button" >Już wstawiono do '+ order_id +'</a>');
                    $("a.button:contains('Pobierz list przewozowy')").before('<a href="#" class="button" id="submit_shipping_extra">Wstaw dodatkowy '+ shipping_number +' do '+ order_id +'</a>');
                }

                $('#submit_shipping').click(function(e){
                    e.preventDefault();
                    insertShippingNumber(order_id, shipping_number, $('#submit_shipping'));
                });

                $('#submit_shipping_extra').click(function(e){
                    e.preventDefault();
                    insertExtraShippingNumber(order_id, shipping_number, $('#submit_shipping_extra'), 1);
                });
            }
        }

        function insertShippingNumber(order_id_to_submit_shipping_number, shipping_number, $node_object) {

// If parcel collection was send to DPD and we received shipping number
// After click on added button
            let courier_shipping_number = 'Pocztex: ' + shipping_number;

// send email
            $.ajax({
                url: 'https://meblujdom.pl/modules/dpdtracking/update_tracking_number.php?id_order=' + order_id_to_submit_shipping_number + '&security_token=Isu6AjdOsPeAXeoPa&shipping_number=' + courier_shipping_number,
                type: "GET",
                processData: false,
                success: function (data) {
                    createCookie(order_id_to_submit_shipping_number, shipping_number, 14);

                    console.log('Inserted ' + courier_shipping_number + ' shipping number to order ' + order_id_to_submit_shipping_number);
                    $($node_object).text(data);
                },
                error: function (xhr, ajaxOptions, thrownError) { // Add these parameters to display the required response
                    alert(xhr.status);
                    alert(xhr.responseText);
                },
            });
// KONIEC WYSYŁANIA NUMERU DO PRESTY
        }

        function insertExtraShippingNumber(order_id_to_submit_shipping_number, shipping_number, $node_object, extra) {
            let courier_shipping_number = 'Pocztex: ' + shipping_number;

            $.ajax({
                url: 'https://meblujdom.pl/modules/dpdtracking/update_tracking_number.php?id_order=' + order_id_to_submit_shipping_number + '&security_token=Isu6AjdOsPeAXeoPa&shipping_number=' + courier_shipping_number + '&extra='+ extra,
                type: "GET",
                processData: false,
                success: function (data) {
                    createCookie(order_id_to_submit_shipping_number, shipping_number, 14);

                    console.log('Inserted Extra ' + courier_shipping_number + ' shipping number to order ' + order_id_to_submit_shipping_number);
                    $($node_object).text(data);
                },
                error: function (xhr, ajaxOptions, thrownError) { // Add these parameters to display the required response
                    alert(xhr.status);
                    alert(xhr.responseText);
                },
            });
        }


    })();
});

