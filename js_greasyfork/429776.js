// ==UserScript==
// @name Spedimex Integration
// @namespace http://tampermonkey.net/
// @version 0.1.2
// @description Connects to prestashop API to fill forms in Spedimex website
// @author Eryk Wróbel
// @match https://trace.spedimex.pl/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/429776/Spedimex%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/429776/Spedimex%20Integration.meta.js
// ==/UserScript==

// usefull stuff

// http://meblujdom.pl/api/order_details/?display=[product_name,product_quantity]&filter[id_order]=4286&output_format=JSON
// http://meblujdom.pl/api/order_details/4286?output_format=JSON
// v 0.1.2 - Zakomentowanie zaznaczania ubezpieczenia
// v 0.1.1 - Dodana funkcja wstawienia do presty, nietestowana
// v 0.1 - basic start

// contains a package of usefull functions used across many integrations
$.getScript('https://meblujdom.pl/js/useful_functions.js', function() {
    (function () {
        'use strict';

        var order_id = ''; // leave empty
        var telephone = '669748899';
        var contact_person = 'Andrzej Dragan';
        var api_url = 'https://meblujdom.pl/api/'; // paste Your API URL, have to be with https
        var apiKey = "AVDIT6KM4XNEH6GM565FXMRKIWMN5AE9"; // Your Api key from webservice
        var statuses_of_cod_orders = [26, 41];
        var package_in_preparation_status_id = 45; // id of status that has to be set when package was prepared but shipping number is not set because it is not printed
        var char_limit = 248; // Limit for description of products
        var service_name = 'Spedimex';

        /***** CUSTOM STYLES ********/
        $('body').after('<style>.form-group {margin-bottom: 0.1rem;} .form-control {font-size:11px} .submit_shipping_number{display: inline-block; padding: 4px 6px; background: #208931; color:#fff !important; border-radius: 5px; cursor:pointer} .submitted_already{display: inline-block; padding: 4px 6px; background: #d4d4d4; #color:#fff !important; border-radius: 5px}</style>');


        // Pola odbiorcy
        //var nam

        $(document).ready(function () {
            // Add form in package submit
            if (window.location.href.indexOf("Order/Edit") > -1) {
                $("#Order").before(
                    '<div id="extra_content" style="padding: 0 0 8px 0;">\
                    <p><strong>Wpisz  ID Zamówienia z Presty poniżej:</strong></p>\
                        <div class="row">\
                            <div class="col-xs-8 col-lg-2"> \
                                <input class="form-control" type="number" id="presta_order_id" name="presta_order_id">\
                            </div>\
                            <div class="col-xs-4 col-lg-2">\
                                <span class="btn btn-primary" id="submit_order_id">Pobierz dane</span>\
                            </div>    \
                        </div>\
                    </div>\
                    ');

                /* Function that is triggered after inserting order ID in preparing a new package */
                $('#submit_order_id').click(function (e) {
                    e.preventDefault();
                    // zanaczenie zgody
                    $('#Messages_PRZESYLKI_ZgodaAdr').click();

                    // remove everything from previous data collection, just wipe any container that was previously created.
                    $('#order_messages, .order_value, #order_value, .payment_type, #extra_address_info').remove();

                    var order_id = $('#presta_order_id').val();
                    if (!order_id) {
                        $('#extra_content p').css('color', 'red');
                    } else {
                        getOrderAndShippingInfo(order_id);
                    }

                });
            }

            // add button to prepare status "awaiting for collect" in Prestashop
            if ($('#submit_id_order_state').length != 1) {
                $('.btn.btn-danger.btn-lg').after('' +
                    '<span class="btn btn-primary btn-warning btn-lg" style="margin-left:15px" id="submit_id_order_state">Wstaw status nadania do zamówienia</span>' +
                    '');
            }

            $('#submit_id_order_state').click(function () {
                var order_id = $('#presta_order_id').val();

                // If You want to get id on different page like when package was prepared and it wasn't specified by input
                if (!order_id) {
                    order_id = $('#KLIENT_ODB_SYMBOL').val().replace(/\D/g, '') * 1;
                }

                if (readCookie('order_state_set') != order_id) {
                    setOrderStatus(order_id, package_in_preparation_status_id, $(this));
                } else {
                    $(this).val('Ustawiłeś już tutaj status').css('background', 'grey').attr('disabled', true);
                }
            });

            // picparc_browse = strona z wydrukowanymi statusami
            // cnsgprep_browse = strona przygotowania przesyłek
            function addOrderShippingInfo() {

                var order_ids = $('#table_Przesylki tr td:nth-child(8)');

                if (order_ids) {
                    order_ids.each(function () {
                        if ($(this).text() != '') {

                            var order_id = $(this).text();
                            var shipping_number = $(this).closest('tr').find('td:nth-child(3)').text(); // return 1 shipping number


                            if (order_id && typeof order_id != 'undefined') {
                                order_id = order_id * 1;
                            }

                            if (order_id == 'undefined' || !order_id || !shipping_number) {
                                console.log('Coś poszło nie tak z przesyłką ' + shipping_number);
                                return;
                            }

                            var self = $(this); // assign this object to different value to be able to use it success query

                            var cookie_shipping_number = readCookie(order_id);
                            if (cookie_shipping_number != shipping_number) {
                                if (cookie_shipping_number == 'not_filled') {
                                    $(self).append('<br><span class="submit_shipping_number" data-order-id="' + order_id + '" data-shipping-number="' + shipping_number + '">Wstaw</span>');
                                } else {
                                    $.ajax({
                                        url: api_url + 'orders/?display=[shipping_number]&filter[id]=[' + order_id + ']&output_format=JSON',
                                        type: "GET",
                                        username: apiKey,
                                        password: "",
                                        dataType: "json",
                                        processData: false,
                                        success: function (data, xhr) {
                                            if (data.orders[0].shipping_number == '') {
                                                createCookie(order_id, 'not_filled', 7);
                                                $(self).append('<br><span class="submit_shipping_number" data-order-id="' + order_id + '" data-shipping-number="' + shipping_number + '">Wstaw</span>');
                                            } else {
                                                createCookie(order_id, shipping_number, 7);
                                                $(self).append('<br><span class="submitted_already">Wstawione</span>');
                                            }
                                        }
                                    });
                                }
                            } else {
                                // when cookie was set and package was already checked and shipping number is set
                                $(self).append('<br><span class="submitted_already">Wstawione</span>');
                            }
                        }
                    })
                }
                ;
            }

            // Add Insert delivery number into presta button
            if (window.location.href.indexOf('https://trace.spedimex.pl/Order') > -1) {
                var items_on_page = $('#table_Przesylki tr td:nth-child(8)');

                addOrderShippingInfo();

                items_on_page.change(function () {
                    addOrderShippingInfo();
                });

                $('#table_Przesylki').on('click', '.submit_shipping_number', function (e) {
                    e.stopImmediatePropagation();
                    insertShippingNumber($(this).data('order-id'), $(this).data('shipping-number'), $(this));
                });
            }
        }); // end ready


        /* Logic and connection to retrive information (int)id */
        function getOrderAndShippingInfo(order_id) {

            if (order_id !== '') {
                var orderRequest = new XMLHttpRequest();
                orderRequest.open('GET', api_url + 'orders/' + order_id + '?output_format=JSON', true, apiKey, "");
                orderRequest.onload = function () {
                    var orderData = JSON.parse(orderRequest.responseText);

                    $('#ZlecajacyNadawca').click(); // oznaczenie, że to zlecający jest nadawcą
                    $('#aktualizujZaladunek, #aktualizujOdbiorce').click(); // odblokowanie edycji nadawcy by wstawić numer
                    //$('#MIEJSCE_ZA_TEL').val(telephone);
                    //$('#MIEJSCE_ZA_KONT').val(contact_person);
                    //$('#zapiszZaladunek').click();

                    // Adds a list of product to see what You need to send
                    $('#panel-nadawca-odbiorca').after('<div id="order_products" class="order_products panel panel-default"></div>');
                    $('.order_products').html(''); // clear before adding if You made a wrong ID


                    var textArea = $('#UWAGI');
                    $.ajax({
                        url: api_url + 'order_details/?display=[product_name,product_quantity,unit_price_tax_incl]&filter[id_order]=' + order_id + '&output_format=JSON',
                        type: "GET",
                        username: apiKey,
                        password: "",
                        dataType: "json",
                        processData: false,
                        success: function (data) {
                            $(data.order_details).each(function (key, val) {
                                var quantities = 'x' + val.product_quantity + ' ';
                                val.product_name = shorterProductName(val.product_name);
                                $('#order_products').append('<p><span class="bought_products" id="product_name' + key + '" style="padding: 5px 8px; background: #fff; cursor:pointer; font-weight:bold;border-radius:5px" title="Kliknij by skopiować do schowka"><strong>' + quantities + '</strong>' + shorterProductName(val.product_name) + '</span></p>');
                                $('#product_name' + key).click(function () {
                                    copyToClipboard('#product_name' + key);
                                });
                            });
                            var boughtProducts = '';

                            $('.bought_products').each(function (key, val) {
                                // If there is saturday delivery bought by customer
                                if ($(this).text().indexOf("Dostawa mebli na sobotę") >= 0) {
                                    $('input[name="chbxSrvSAT"]').click().attr('selected', true)
                                }
                                boughtProducts += $(this).text() + ' \n';
                            });
                            textArea.val(boughtProducts);
                        }
                    });

                    var textAreaToCount = textArea;
                    var content_field_chars = textAreaToCount.val().length;
                    textAreaToCount.after('<span id="char_count_container"></span>');
                    var count_container = $('#char_count_container');
                    textAreaToCount.on('change keyup paste click', function () {
                        content_field_chars = textAreaToCount.val().length;
                        count_container.text('Zawartość: ' + content_field_chars + ' znaków, LIMIT: ' + char_limit);

                        if (content_field_chars > char_limit) {
                            count_container.css('color', 'red')
                        } else {
                            count_container.css('color', '')
                        }
                    });

                    textArea.click().change();

                    $('#panel-zaladunek-rozladunek').before('<p class="payment_type panel panel-default" style="font-size:14px">Płatność: <strong style="color: red">' + orderData.order.payment + '</strong></p>'); // add warning about current payment
                    $('.payment_type').after('<p id="order_value" class="panel panel-default"><strong>Wartość zamówienia: </strong> <span>' + parseFloat(orderData.order.total_paid_tax_incl, 2) + '</span> zł</p>');

                    // retrieve order state histories
                    var orderHistoriesRequest = new XMLHttpRequest();
                    orderHistoriesRequest.open('GET', api_url + 'order_histories/?display=full&filter[id_order]=[' + orderData.order.id + ']&output_format=JSON&sort=[id_DESC]', true, apiKey, "");
                    orderHistoriesRequest.onload = function () {
                        var orderHistories = JSON.parse(orderHistoriesRequest.responseText);

                        $(orderHistories.order_histories).each(function (key, val) {
                            $('#order_products').append('<p id="elem' + key + '"><span style="padding: 2px 5px; background: #fff;">' + val.date_add + ':</span></p>');

                            // connecting to receive information about current state addres
                            var currentStateRequest = new XMLHttpRequest();
                            currentStateRequest.open('GET', api_url + 'order_states/?display=[name,color]&filter[id]=[' + val.id_order_state + ']&output_format=JSON', true, apiKey, "");
                            currentStateRequest.onload = function () {
                                if (currentStateRequest.status == 200) {
                                    var state = JSON.parse(currentStateRequest.responseText);
                                    var payment_type = $('.payment_type > strong').text();

                                    if (state.order_states[0].name == 'Dostarczone' && (payment_type == 'Płatność przy odbiorze')) {
                                        alert('Uwaga: Zamówienie jest już dostarczone, jednak jest ono zaznaczone za pobraniem! Odznacz pobranie jeśli wysyłasz REKLAMACJE lub zmień kwotę gdy dosyłasz tylko resztę produków! Odznaczono zamówienie za pobraniem.');
                                    }

                                    if (state.order_states[0].name == 'Przesyłka w przygotowaniu' || readCookie('order_state_set') == orderData.order.id) {
                                        $('#submit_id_order_state').css("background", "lightgrey").attr("disabled", true).attr("title", "Już nadano taki status");
                                    }

                                    if (state.order_states[0].name == 'Zamówienie za pobraniem przyjęte' && (payment_type == 'przelew na konto' || payment_type == 'PayU')) {
                                        alert('Uwaga: wybrana płatność to: ' + payment_type + ' jednak w historii statusów widnieje status: ' + state.order_states[0].name + '. Sprawdź czy wszystko jest ok i zaznacz ręcznie przysyłkę COD jeśli jednak jest pobraniowa.')
                                    }

                                    if ((state.order_states[0].name == 'Zaliczka zaksięgowana' || state.order_states[0].name == 'Oczekiwanie na wpłatę zaliczki')) {
                                        alert('Uwaga: gdzieś w historii jest wspomniana informacja o ZALICZCE. Sprawdź czy może pobranie ma być mniejsze.')
                                    }
                                    $('#elem' + key).append('<span style="padding:2px; border-radius:3px; background:' + state.order_states[0].color + '">' + state.order_states[0].name + '</span>');
                                }
                            };
                            currentStateRequest.send();
                        });
                    };
                    orderHistoriesRequest.send();

                    // now let's have customer shipping data
                    var id_address = orderData.order.id_address_delivery;
                    // Get all shipping data
                    if (id_address !== '') {
                        // connecting to receive information about shipping addres
                        var addressRequest = new XMLHttpRequest();
                        addressRequest.open('GET', api_url + 'addresses/' + id_address + '?output_format=JSON', true, apiKey, "");
                        addressRequest.onload = function () {
                            var addressData = JSON.parse(addressRequest.responseText);
                            console.log(addressData);

                            $('#KLIENT_ODB_SYMBOL').val(order_id);

                            if (addressData.address.company !== '') {
                                addressData.address.company = addressData.address.company + ' ';
                                $('#KLIENT_ODB_NAZWA').val(addressData.address.company); // Company
                            } else {
                                $('#KLIENT_ODB_NAZWA').val(ucwords(addressData.address.firstname + ' ' + addressData.address.lastname, true));
                            }
                            $('#KLIENT_ODB_KONT').val(ucwords(addressData.address.firstname + ' ' + addressData.address.lastname, true)); // Contact person
                            $('#KLIENT_ODB_ADRES').val(ucwords(addressData.address.address1 + ' ' + addressData.address.address2, true)); // Address

                            if (addressData.address.id_country == "14") { // jeśli Polska
                                $('#KLIENT_ODB_KRAJ').val('PL');
                            }

                            $('#KLIENT_ODB_KOD').val(addressData.address.postcode.replace(' ', '')); // Post Code
                            $('#KLIENT_ODB_MIASTO').val(addressData.address.city); // City

                            // first 2 digits of postal codes
                            var nearby_areas = [35, 36, 37, 38, 39];
                            if (nearby_areas.includes(addressData.address.postcode.replace(/\D/g, '').substr(0, 2) * 1)) {
                                alert('WYSYŁKA BLISKO NAS!!! Sprawdź czy może się opłacać to zawieźć samemu.');
                            }

                            // If order is COD "Pay when received" or Cash on delivery then insert order value in specific fields
                            // They are loaded after checking if post code is OK
                            console.log(orderData);

                           /* if (orderData.order.module == 'cashondelivery'
                                || orderData.order.payment == 'Płatność przy odbiorze'
                                || orderData.order.payment == 'Allegro: Płatność przy odbiorze (COD)'
                                || orderData.order.payment == 'Allegro: COD'
                                || statuses_of_cod_orders.includes(orderData.order.current_state * 1)) {
                                setTimeout(function () {
                                    $('input[name="chbxSrvCOD"]').click();
                                }, 100, setTimeout(function () {
                                    if ((orderData.order.total_paid * 1) != (orderData.order.total_paid_tax_incl * 1)) {
                                        alert('UWAGA! UWAGA!!! Cena za pobranie jest inna niż cena zamówienia - sprawdź czy wynikło to ze zdublowania płatności i wpisz dobrą wartość pobrania!')
                                    }
                                    $('input[name="edAmount"]').val((orderData.order.total_paid_tax_incl * 1).toFixed(2)); // Value of COD, multiply string by 1 to get number instead of string
                                }, 100));
                            }*/

                            //$('input[name="edWeight"]').val('25'); // input package weights

                            $('#KLIENT_ODB_TEL').val(addressData.address.phone.replace(/\D/g, '')); // Telephone
                            if (addressData.address.phone == '' || addressData.address.phone == null && addressData.address.phone_mobile) {
                                $('#KLIENT_ODB_TEL').val(addressData.address.phone_mobile.replace(/\D/g, '')); // Telephone Mobile
                            }

                            // zatwierdzenie
                            $('#zapiszOdbiorce').click();
                            setTimeout(function(){
                                $('#RozladunekOdbiorca').click();
                            },500);

                        };

                        ///////////////////// POBRANIE DODATKOWYCH DANYCH O KLIENCIE ////////////////////////////////
                        // now let's have customer info
                        var id_customer = orderData.order.id_customer;
                        if (id_customer !== '') {
                            // connecting to receive information about shipping addres
                            var customerRequest = new XMLHttpRequest();
                            customerRequest.open('GET', api_url + 'customers/' + id_customer + '?output_format=JSON', true, apiKey, "");
                            customerRequest.onload = function () {
                                var customerData = JSON.parse(customerRequest.responseText);
                                console.log(customerData);
                                $('#cb_PrzesylkiUslugi_NOTIFICATION_SMS').click(); // zaznaczenie telefonu
                                $('#cb_PrzesylkiUslugi_CONFIRMATION_MAIL').click(); // zaznaczenie telefonu
                                $('#cb_PrzesylkiUslugi_NOTIFICATION_MAIL').click(); // zaznaczenie chęcie doręczenia na maila
                                $('#cb_PrzesylkiUslugi_CONFIRMATION_SMS').click(); // zaznaczenie telefonu
                                $('#PrzesylkiUslugi_NOTIFICATION_MAIL, #PrzesylkiUslugi_CONFIRMATION_MAIL').val(customerData.customer.email); // wprowadzenie maila
                                $('#PrzesylkiUslugi_NOTIFICATION_SMS, #PrzesylkiUslugi_CONFIRMATION_SMS').val($('#KLIENT_ODB_TEL').val());


                                //$('#cb_PrzesylkiUslugi_DELIVERY_INSURANCE').click();// zaznaczenie ubezpieczenia
                                //var insurance_value = $('#order_value span').text() > 1000 ? $('#order_value span').text() : 1000; // wartość ubezpieczenia
                                //$('#PrzesylkiUslugi_DELIVERY_INSURANCE').val(insurance_value);

                            };
                            customerRequest.send();
                        }


                        addressRequest.send();
                    }


                    if (orderRequest.status == 200) {
                        $('#extra_content').append('<p id="extra_address_info" style="font-weight:bold; color:green;">Załadowano dane adresowe Klienta</p>');

                        // get order messages
                        $.ajax({
                            // If You want to take particular element from request api/orders/?display=[shipping_number]&filter[id]=[3145]&output_format=JSON
                            url: api_url + 'customer_threads/?display=full&filter[id_order]=[' + order_id + ']&output_format=JSON',
                            type: "GET",
                            success: function (data) {
                                $('h4:contains("Referencje")').after('<div id="order_messages" style="margin:10px 0; padding: 8px;"></div>');
                                if (data.customer_threads && typeof data.customer_threads[0] != 'undefined') {
                                    $(data.customer_threads[0].associations.customer_messages).each(function (key, val) {
                                        $.ajax({
                                            url: api_url + 'customer_messages/' + val.id + '?&output_format=JSON',
                                            type: "GET",
                                            async: false, // use this to get them in right order
                                            success: function (data, xhr) {

                                                if (xhr == 'success') {
                                                    if (data.customer_message) {
                                                        $(data.customer_message).each(function (key, val) {
                                                            if (val.private == '1') {
                                                                val.message = '<strong>Notatka: </strong>' + val.message;
                                                            }
                                                            if (val.id_employee == '0') {
                                                                var style = 'background: #dbe9ef; border-radius:3px; border:1px solid #c4dce6; padding: 8px; margin: 5px 0 5px 0';
                                                                $('#order_messages').append('<div style="' + style + '"><i>' + val.date_add + ':</i> [Klient]<br> ' + val.message.replace(/\n/g, "<br>") + '</div>');
                                                            } else {
                                                                var style = 'background: #fff; border-radius:3px; border:1px solid #dedede; padding: 8px; margin: 5px 0 5px 0';
                                                                $('#order_messages').append('<div style="' + style + '"><i>' + val.date_add + ':</i> [Pracownik]<br> ' + val.message.replace(/\n/g, "<br>") + '</div>');
                                                            }

                                                        })
                                                    }
                                                }
                                            },
                                        });
                                    })
                                }
                            },
                        });
                    } else {
                        $('#extra_content').append('<p id="extra_address_info" style="font-weight:bold; color:red;">Wystąpił jakiś problem, spróbuj jeszcze raz</p>');
                    }

                };
                orderRequest.send();
                // todo tu skończyłeś - zostało napisanie kliknięcie na dodanie paczki i wpisanie PAL w opisie
                // waga 200, wybranie paleta 120x80, zwrotne NIZE, 1,20 0,80, 2,20


                $('#dodaj-paczke').click();
                setTimeout(function(){
                    $('body').on('DOMNodeInserted', 'tr', function () {
                        var session_key = $(this).attr('id');
                        $('#PACZKI_'+session_key+'__OPIS').val('PAL');
                        $('select[name="PACZKI['+session_key+'].KOD_OPAK"]').val('PAL').change();
                        $('select[name="PACZKI['+session_key+'].OPAK_WYM"]').val('PAL').change();
                        $('#PACZKI_'+session_key+'__WYSOKOSC_DEKL').val('2,2').change();
                    });
                }, 250);

                $('#REF_1').val(order_id);


                // get messages from Warehouse
                var orderPackagesInfo = getOrderPackageInfo(order_id);
                if (orderPackagesInfo && orderPackagesInfo.message) {
                    var style = 'background: #ffebeb; border-radius:3px; border:1px solid #dedede; padding: 8px; margin: 5px 0 5px 0';
                    $('#order_messages').append('<div style="' + style + '">[Notka]<br> ' + orderPackagesInfo.message + '</div>');
                }

            }
        }



        function insertShippingNumber(order_id_to_submit_shipping_number, shipping_number, $node_object, extra = false) {

            shipping_number = service_name + ': ' + shipping_number;

            $.ajax({
                url: 'https://meblujdom.pl/modules/dpdtracking/update_tracking_number.php?id_order=' + order_id_to_submit_shipping_number + '&security_token=Isu6AjdOsPeAXeoPa&shipping_number=' + courier_shipping_number + '&extra='+ extra,
                type: "GET",
                processData: false,
                success: function (data) {
                    createCookie(order_id_to_submit_shipping_number, '', -1); // remove previous cookie if had it
                    console.log('Inserted ' + shipphpping_number + ' shipping number to order ' + order_id_to_submit_shipping_number);
                    $($node_object).text(data);
                },
                error: function (xhr, ajaxOptions, thrownError) { // Add these parameters to display the required response
                    alert(xhr.status);
                    alert(xhr.responseText);
                },
            });
        }

        function setOrderStatus(order_id, id_status, $node_object) {

            id_status = id_status || package_in_preparation_status_id;

            $.ajax({
                url: 'https://meblujdom.pl/modules/dpdtracking/update_tracking_number.php?id_order=' + order_id + '&security_token=Isu6AjdOsPeAXeoPa&order_status_id=' + id_status,
                type: "GET",
                processData: false,
                success: function (data) {
                    createCookie('order_state_set', order_id, 14);
                    $($node_object).val(data).css('background-color', 'green').attr('disabled', true);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(xhr.status);
                    alert(xhr.responseText);
                },
            });
        }




    })();

});