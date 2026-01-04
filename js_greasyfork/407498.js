// ==UserScript==
// @name GLS Manual Integration
// @namespace http://tampermonkey.net/
// @version 0.1.32
// @description Connects to prestashop API to fill forms in GLS website
// @author Eryk Wróbel
// @match https://adeplus.gls-poland.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/407498/GLS%20Manual%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/407498/GLS%20Manual%20Integration.meta.js
// ==/UserScript==

// usefull stuff

// http://meblujdom.pl/api/order_details/?display=[product_name,product_quantity]&filter[id_order]=4286&output_format=JSON
// http://meblujdom.pl/api/order_details/4286?output_format=JSON

// v 0.1.32 - function names changes
// v 0.1.31 - disabling button after inserting
// v 0.1.30 - still beta, waiting for proper new fetching function
// v 0.1.20 - moved functions to useful_function.js
// v 0.1.19 - Still beta testing previous changes
// v 0.1.18 - FAST FIX order credentials BETA VERSION TO FURTHERS TESTS
// v 0.1.17 - fix for packages
// v 0.1.16 - Fix for packages quantity
// v 0.1.15 - small fixes
// v 0.1.13 - fixed inserting shipping numbers from Preparing packages form
// v 0.1.12 - first iteration of new version and some styling issues
// v 0.1.11 - fix to adapt this script to new version of gls
// v 0.1.04 - allegro COD fix
// v 0.1.3 - basic fixes
// v 0.1 - basic start

// contains a package of usefull functions used across many integrations
$.getScript('https://meblujdom.pl/js/useful_functions.js?ver=0.034', function() {
    (function () {
        'use strict';

        let service_name = 'GLS';
        let order_id = ''; // leave empty
        let api_url = 'https://meblujdom.pl/api/'; // paste Your API URL, have to be with https
        let apiKey = "AVDIT6KM4XNEH6GM565FXMRKIWMN5AE9"; // Your Api key from webservice
        let magazyn_api_url = 'https://meblujdom.pl/magazyn/api.php'; // paste Your API URL, have to be with https
        let magazyn_api_token = 'kau923uuanv03458psakfg392jtkd847593i6kd8348fj';
        let statuses_of_cod_orders = [26, 41];
        let package_in_preparation_status_id = 45; // id of status that has to be set when package was prepared but shipping number is not set because it is not printed
        let char_limit = 40; // Limit for description of products
        let nearby_areas = [35, 36, 37, 38, 39]; // first 2 digits of postal codes

        let headers = {
            type: "GET",
            username: apiKey,
            password: "",
            dataType: "json"
        };

        /***** CUSTOM STYLES ********/
        $('body').after('' +
            '<style>body, input{padding: 6px; font-size:9pt} .form-group {margin-bottom: 0.1rem;} .form-control {font-size:11px} .submit_shipping_number, .submit_shipping_extra_number{display: inline-block; padding: 3px 5px 1px; background: #208931; color:#fff !important; border-radius: 5px; cursor:pointer;font-size:11px} .submitted_already, .submitted_extra_already {display: inline-block; padding: 3px 5px 1px; background: #c1c1c1; color:#fff !important; border-radius: 5px; font-size: 11px;} .submit_shipping_extra {    margin-top: 2px;display: inline-block;padding: 3px 5px 1px;background: #17a2b8;color: #fff !important;border-radius: 5px;cursor: pointer;font-size: 10px;}</style>');


        $(document).ready(function () {
            // Add form in package submit
            if (window.location.href.indexOf("cnsgprep_new") > -1) {
                $("#hReceiverHeader").after(
                    '<div id="extra_content" style="padding: 0 0 8px 0;">\
                    <p><strong>Wpisz  ID Zamówienia z Presty poniżej:</strong></p>\
                        <div class="row">\
                            <div class="col-lg-8"> \
                                <input class="form-control" type="number" id="presta_order_id" name="presta_order_id">\
                            </div>\
                            <div class="col-lg-4">\
                                <span class="btn btn-primary" id="submit_order_id">Pobierz dane</span>\
                            </div>    \
                        </div>\
                    </div>\
                    ');

                /* Function that is triggered after inserting order ID in preparing a new package */
                $('#submit_order_id').click(function (e) {
                    e.preventDefault();

                    $('#order_messages, .order_value, #order_value, .payment_type, #extra_address_info').remove();
                    $('input[name="edRName1"], input[name="edRName2"], input[name="edRName3"]').val('');
                    $('input[name="chbxSrvCOD"]').attr('selected', false);

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
                $('input[name="btnInsert"]').after('' +
                    '<span class="tb-md-btn-block btn btn-primary" style="background: orange; margin-left:15px" id="submit_id_order_state">' +
                    'Wstaw status nadania do zamówienia' +
                    '</span>');
            }

            $('#submit_id_order_state').click(function () {
                let order_id = $('#presta_order_id').val();

                // If You want to get id on different page like when package was prepared and it wasn't specified by input
                if (!order_id) {
                    order_id = $('input[name="edContent"]').val().replace(/\D/g, '') * 1;
                }

                if (readCookie('order_state_set') != order_id) {
                    setOrderStatus(
                        order_id,
                        package_in_preparation_status_id,
                        $(this),
                        'https://meblujdom.pl/modules/dpdtracking/update_tracking_number.php',
                        'Isu6AjdOsPeAXeoPa'
                    );
                } else {
                    $(this).val('Ustawiłeś już tutaj status').css('background', 'grey').attr('disabled', true);
                }
            });

            // picparc_browse = strona z wydrukowanymi statusami paczek
            // piccons_browse = strona z podsumowaniem przesyłek (tu jest order ID)
            // cnsgprep_browse = strona przygotowania przesyłek
            function addOrderShippingInfo() {
                let order_ids = false;
                let current_url = window.location.href;

                if (current_url == 'https://adeplus.gls-poland.com/adeplus/pm1/index.php?cmd=cnsgprep_browse') {
                    // Paczki > Przygotowania przesyłek (lista)
                    order_ids = $('#data-table tr td:nth-child(14)');
                } else if (current_url.includes('https://adeplus.gls-poland.com/adeplus/pm1/index.php?cmd=picparc_browse&brw=pickups_browse')
                    || current_url == 'https://adeplus.gls-poland.com/adeplus/pm1/index.php?cmd=picparc_browse') {
                    // Archiwum > Potwierdzenie nadania > Kliknięcie na opis
                    order_ids = $('#data-table tr td:nth-child(10)');
                } else if (current_url.includes('cmd=consg2BrwsViewConsignCId&brw=piccons_browse')
                    || current_url.includes('cmd=parc2BrwsViewConsignPNum&brw=picparc_browse')
                    || current_url.includes('cmd=consg2BrwsViewConsignCId&brw=consign_browse')
                    || current_url.includes('cmd=consgprep2BrwsViewConsignCId&brw=cnsgprep_browse')
                ) {
                    // widok szczegółówy pojedynczej paczki
                    order_ids = $('#to_hide_parcels td:nth-child(3)');
                } else {
                    return;
                }

                if (order_ids) {
                    order_ids.each(function () {
                        if ($(this).text() != '') {

                            let shipping_number = '';
                            // localizations
                            if (current_url.includes('cmd=consg2BrwsViewConsignCId&brw=piccons_browse')
                                || current_url.includes('cmd=parc2BrwsViewConsignPNum&brw=picparc_browse')
                                || current_url.includes('cmd=consg2BrwsViewConsignCId&brw=consign_browse')
                                || current_url.includes('cmd=consgprep2BrwsViewConsignCId&brw=cnsgprep_browse')
                            ) {
                                // podstrona szczegółów zamówienia i paczek
                                shipping_number = $(this).closest('tr').find('td:nth-child(2)').text();
                            } else if (current_url == 'https://adeplus.gls-poland.com/adeplus/pm1/index.php?cmd=cnsgprep_browse') {
                                // Paczki > Przygotowywanie przesyłek (lista)
                                shipping_number = $(this).closest('tr').find('td:nth-child(2)').html().split('<br>');

                                if (typeof shipping_number[0] !== 'undefined' && shipping_number[0]) {
                                    shipping_number = shipping_number[0];
                                }
                            } else if (current_url.includes('https://adeplus.gls-poland.com/adeplus/pm1/index.php?cmd=picparc_browse&brw=pickups_browse')
                                || current_url == 'https://adeplus.gls-poland.com/adeplus/pm1/index.php?cmd=picparc_browse') {
                                // Archiwum > Potwierdzenie nadania > Kliknięcie na dniowe ID
                                shipping_number = $(this).closest('tr').find('td:nth-child(2)').text();
                            } else {
                                console.log('Nie mogę ustalić zależności do numerów śledzenia dla tej strony');
                                return;
                            }

                            let order_id = prepareOnlyOrderIdFromString($(this).text());
                            if (!order_id) return;

                            if (shipping_number == 'Brak' || shipping_number == '') {
                                console.log('Jeszcze nie wydrukowano listu dla zamówienia '+ $(this).text() + ' lub nie posiada numeru śledzenia paczki dostępnego do wklejenia');
                                return;
                            }

                            let self = $(this);
                            let tracking_to_submit = service_name + ': ' + shipping_number;
                            let buttons = renderSubmitButtons(shipping_number, order_id);

                            let get_shipping_numbers_endpoint = 'https://meblujdom.pl/modules/dpdtracking/update_tracking_number.php?get_tracking_numbers=1&id_order='+order_id+'&security_token=Isu6AjdOsPeAXeoPa';
                            fetch(get_shipping_numbers_endpoint)
                                .then(res => res.json())
                                .then(data => {
                                    if (!data.main_number || typeof data.main_number == 'undefined') {
                                        console.log('Brak informacji o zamówieniu w odpowiedzi API dla: ' + order_id + '. Możliwe, że podano błędne ID');
                                        return;
                                    }

                                    let main_number = data.main_number.tracking_number;
                                    // extra, additional tracking numbers area
                                    let extra_shipping_numbers = array_column(
                                        data.extra_shipping_numbers,
                                        'tracking_number'
                                    );

                                    if (main_number == '' && shipping_number != '' )
                                    {
                                        if ($('.submit_shipping_number.'+order_id).length < 1 ){
                                            self.append(buttons.submit_btn);
                                        } else {
                                            self.append(buttons.submit_as_extra_btn);
                                        }
                                    }
                                    else if (main_number == tracking_to_submit)
                                    {
                                        self.append(buttons.submitted_btn);
                                    }
                                    else if (extra_shipping_numbers.length > 0)
                                    {
                                        extra_shipping_numbers.forEach(extra_number => {
                                            if ($('.'+shipping_number).length > 0)
                                            {
                                                return;
                                            }
                                            else if (!extra_shipping_numbers.includes(tracking_to_submit))
                                            {
                                                self.append(buttons.submit_as_extra_btn);
                                                $('.submit_shipping_extra.'+order_id).attr('title', 'Wstaw dodatkowy numer '+ tracking_to_submit+'\n\nGłówny numer to '+data.main_number.tracking_number+'\nktóry wstawiono '+ data.main_number.date_add)
                                            }
                                            else
                                            {
                                                self.append(buttons.extra_submitted_btn);
                                            }
                                        });
                                    }
                                    else if (main_number != tracking_to_submit)
                                    {
                                        self.append(buttons.submit_as_extra_btn);
                                        $('.submit_shipping_extra.'+order_id).attr('title', 'Wstaw dodatkowy numer '+ tracking_to_submit+'\n\nGłówny numer to '+data.main_number.tracking_number+'\nktóry wstawiono '+ data.main_number.date_add)
                                    }
                                });
                        }
                    });
                }
            }

            // Add Insert delivery number into presta button and init them

            if (window.location.href.indexOf('picparc_browse') > -1 || window.location.href.indexOf('cnsgprep_browse')) {
                let items_on_page = $('tr td:nth-child(2)');

                addOrderShippingInfo();
                setTimeout(function() {
                    createBulkInsertShippingNumbers(
                        $('#data-table').parent(),
                        'https://meblujdom.pl/modules/dpdtracking/update_tracking_number.php',
                        'Isu6AjdOsPeAXeoPa',
                        service_name
                    )
                }, 1500);

                $('#data-table, #to_hide_parcels').on('click', '.submit_shipping_number, .submit_shipping_extra', function (e) {
                    e.stopImmediatePropagation();
                    submitShippingNumber(
                        $(this).data('order-id'),
                        $(this).data('shipping-number'),
                        $(this),
                        'https://meblujdom.pl/modules/dpdtracking/update_tracking_number.php',
                        'Isu6AjdOsPeAXeoPa',
                        service_name,
                        $(this).data('extra')
                    );
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
                    $('input[name="edContent"]').val(orderData.order.id + ' ' + orderData.order.reference); // Adding reference

                    // Adds a list of product to see what You need to send
                    $('h4:contains("Referencje")').after('<div id="order_products" class="order_products bg-light text-dark"></div>');
                    $('.order_products').html(''); // clear before adding if You made a wrong ID

// now let's get some products from order in this way because default version
// from only order not order_details is fucked up
                    var textArea = $('input[name="edRNotes"]');
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

                    var textAreaToCount = $('input[name="edRNotes"]');
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

                    textArea.click();


                    $('h4:contains("Referencje")').before('<p class="payment_type" style="font-size:14px">Płatność: <strong style="color: red">' + orderData.order.payment + '</strong></p>'); // add warning about current payment
                    $('.payment_type').after('<p id="order_value"><strong>Wartość zamówienia: </strong> ' + parseFloat(orderData.order.total_paid_tax_incl, 2) + ' zł</p>');

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
                                        setTimeout(function () {
                                            $('input[name="chbxSrvCOD"]').attr('selected', false).click().click(); // double click to prevent some weird behavior
                                        }, 100);
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

                            if (addressData.address.company !== '') {
                                addressData.address.company = addressData.address.company + ' ';
                                $('input[name="edRName2"]').val(addressData.address.company); // Company
                            }
                            $('input[name="edRName1"]').val(ucwords(addressData.address.firstname + ' ' + addressData.address.lastname, true)); // Contact person
                            $('input[name="edRStreet"]').val(ucwords(addressData.address.address1 + ' ' + addressData.address.address2, true)); // Address

                            $('input[name="edRZipCode"]').val(addressData.address.postcode.replace(' ', '')).click().blur(); // Post Code
                            $('input[name="edRCity"]').val(addressData.address.city).click().blur(); // City

                            if (nearby_areas.includes(addressData.address.postcode.replace(/\D/g, '').substr(0, 2) * 1)) {
                                alert('WYSYŁKA BLISKO NAS!!! Sprawdź czy może się opłacać to zawieźć samemu.');
                            }

                            // If order is COD "Pay when received" or Cash on delivery then insert order value in specific fields
                            // They are loaded after checking if post code is OK
                            console.log(orderData);

                            if (orderData.order.module == 'cashondelivery'
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
                            }

                            $('input[name="edWeight"]').val('25'); // input package weights

                            $('input[name="edRPhone"]').val(addressData.address.phone.replace(/\D/g, '')); // Telephone
                            if (addressData.address.phone == '' || addressData.address.phone == null && addressData.address.phone_mobile) {
                                $('input[name="edRPhone"]').val(addressData.address.phone_mobile.replace(/\D/g, '')); // Telephone Mobile
                            }
                        };
                        addressRequest.send();
                    }

                    //If there is only item bought it will add name of product with quantity to adnotation to easly find this info on label


                    // now let's have customer info
                    var id_customer = orderData.order.id_customer;
                    if (id_customer !== '') {
                        // connecting to receive information about shipping addres
                        var customerRequest = new XMLHttpRequest();
                        customerRequest.open('GET', api_url + 'customers/' + id_customer + '?output_format=JSON', true, apiKey, "");
                        customerRequest.onload = function () {
                            var customerData = JSON.parse(customerRequest.responseText);
                            $('input[name="edRPersons"]').val(customerData.customer.email);
                        };
                        customerRequest.send();
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

                // get messages from Warehouse
                let orderPackagesInfo = getPackageInfoFromWarehouse(magazyn_api_url, order_id, 'get_packages', magazyn_api_token);
                if (orderPackagesInfo && orderPackagesInfo.message) {
                    let style = 'background: #ffebeb; border-radius:3px; border:1px solid #dedede; padding: 8px; margin: 5px 0 5px 0';
                    $('#order_messages').append('<div style="' + style + '">[Notka]<br> ' + orderPackagesInfo.message + '</div>');
                }

                // insert packages quantity to the field
                let packagesQuantityFromDb = orderPackagesInfo.packages_quantity;
                if (packagesQuantityFromDb !== 999){
                    $('input[name="edQuantity"]').val(packagesQuantityFromDb);
                }
            }
        }
    })();

});