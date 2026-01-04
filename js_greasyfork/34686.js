// ==UserScript==
// @name DPD Manual Integration
// @namespace http://tampermonkey.net/
// @version 0.5.11
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @description Connects to prestashop API to fill forms in DPD website
// @author Eryk Wróbel
// @match https://online.dpd.com.pl/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/34686/DPD%20Manual%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/34686/DPD%20Manual%20Integration.meta.js
// ==/UserScript==

// Changelog

// v 0.5.11 - fix for Firefox appending element, changed to prepending inside a form
// v 0.5.10 - function names changes
// v 0.5.09 - Fix & safe getPackagesQuantityFromDb function
// v 0.5.08 - Fix cod value
// v 0.5.07 - BETA, poprawki do wcześniej wersji również do przetestowania, zmiana adresu odbioru
// v 0.5.06 - BETA, potrójne zabezpiecznie przed brakiem oznaczenia pobrania - do przetestowania na żywo.
// v 0.5.05 - przeniesienie changeValueJs do codValue functions, fix doklejania
// v 0.5.04 - fix wstawianie numerów do presty
// v 0.5.03 - fix dla przycisku wstawiania statusu nadania przesyłki + waga pierwszej przesyłki
// v 0.5.02 - fix dla przycisku wstawiania statusu nadania przesyłki
// v 0.5.01 - różne poprawki wstawiania, wskaźników, utworzenie funkcji changeValueJs() i aktywowania pól, zmiana bibliotek js i css growl na meblujdom, wymagane dalsze testy, dodanie podmiany miasta jeśli inne niż podał Klient
// v 0.5.00 - ładowanie jquery jako wymaganej biblioteki, zmiany adresów wykrywania określonych funkcji, bardzo dużo zmienionych ID pól, growl, oczekiwania itp
// v 0.4.99 - inne dane do wstawienienia przez nadającego
// v 0.4.98 - nadawanie palet fix
// v 0.4.97 - allegro COD Fix
// v 0.4.96 - minor fix
// v 0.4.95 - minor features like checking packages quantity from warehouse
// v 0.4.94 - moved external functions to separate file
// v 0.4.93 - minor fix
// v 0.4.9 - added Submitting shipping numbers from history of packages page
// v 0.4.81 - small fix about CoD Allegro packages
// v 0.4.71 - small fixes
// v 0.4.7 - Added feature to warn about paid in advance
// v 0.4.61 - fixed issue with COD orders and total_paid_real
// v 0.4.6 - fixed issue with COD orders
// v 0.4.5 - moved commonly used functions to external file and some minor tweaks, well not quite, because greasefork don't allow me to do this :/
// v 0.4.4 - small fix for url and mass update and inserting
// v 0.4.3 - Detect if package is to sent To some nearby areas
// v 0.4.2 - Fixed Adress data if putted in second field
// v 0.4.1 - Fix error when total paid real was different then total_paid_tax_incl
// v 0.4.0 - Added option to change delivery point to Unique (automatic and manual)
// v 0.3.5 - Removed REST API XML update because of some issues after update. Moved logic to PHP file.
// v 0.3.4 - Add 1x when only 1 product per quantity
// v 0.3.3 - Added some small replacing in product name
// v 0.3.2 - Fix for orders with broken products in it and some minor tweaks.
// v 0.3.0 - added bulk insert submit shipping number into shop by button
// v 0.2.8 - Some little improvements about inserting preparation in progress status and cookies.
// v 0.2.7 - Added a button to set Package in preparation status (usefull to see if package was already prepared but You didn't print lists to get shipping number)
// v 0.2.6 - Added checking if package was delivered and if there is COD package. Usefull when resending a package with complaints or something. Additional checkinf if packge is for saturday.
// v 0.2.4 - Added check if payment was via wire or payu but in status there is COD status. Displays alert. Additional, minor tweeks.
// v 0.2.3 - Minor tweeks
// v 0.2.2 - added cookie set for already checked order to improve performance and cut down api requests
// v 0.2.1 - changed fonts, because default one from DPD is ugly and hard to read
// v 0.2 - added feature to check if shipping number was already sent.
// v 0.1 - basic start

let content_loaded = false;

if (!content_loaded) {

    let observer = setInterval(function () {
        if ($('.content__form').length == 1
            || $('#packagesTable').length == 1
            || $('#packages').length == 1) {
            content_loaded = true;
            clearInterval(observer);
            console.log('Loaded Form');

            let is_cod_order = false;

            // Modification starts here.
            // contains a package of usefull functions used across many integrations
            $.getScript('https://meblujdom.pl/js/useful_functions.js?ver=0.034', function () {
                console.log('Loaded useful_functions');
            }, true);

            $.getScript('https://meblujdom.pl/js/jquery/plugins/growl/jquery.growl.js', function () {
                console.log('Loaded Growl.js');
                $("<link/>", {
                    rel: "stylesheet",
                    type: "text/css",
                    href: "https://meblujdom.pl/js/jquery/plugins/growl/jquery.growl.css"
                }).appendTo("head");
            }, true);

            $(document).ready(function () {
                console.log('Loaded document ready');
                let order_id = ''; // leave empty
                let api_url = 'https://meblujdom.pl/api/'; // paste Your API URL, have to be with https
                let magazyn_api_url = 'https://meblujdom.pl/magazyn/api.php'; // paste Your API URL, have to be with https
                let apiKey = "AVDIT6KM4XNEH6GM565FXMRKIWMN5AE9"; // Your Api key from webservice
                let magazyn_api_token = 'kau923uuanv03458psakfg392jtkd847593i6kd8348fj';
                let statuses_of_cod_orders = [26, 41];
                let senderName = 'Bogusław Blat';
                let senderPostCode = '36100';
                let senderCity = 'Kolbuszowa';
                let senderStreet = 'Towarowa 4';
                let senderPhoneNumber = '669748899';
                let senderEmail = 'biuro@meblujdom.pl';

                let package_in_preparation_status_id = 45; // id of status that has to be set when package was prepared but shipping number is not set because it is not printed

                // ujednolicone wskaźniki określonych pól
                let senderCompanyNameField = '#sender-company__input';
                let senderNameField = '#sender-name__input';
                let senderStreetField = '#sender-street__input';
                let senderPostalCodeField = '#sender-postal-code__input';
                let senderCityField = '#sender-city__input';
                let senderPhoneField = '#sender-telephone__input';
                let senderEmailField = '#sender-email__input';

                let receiverCompanyNameField = '#receiver-company__input';
                let receiverNameField = '#receiver-name__input';
                let receiverStreetField = '#receiver-street__input';
                let receiverPostalCodeField = '#receiver-postal-code__input';
                let receiverCityField = '#receiver-city__input';
                let receiverPhoneField = '#receiver-telephone__input';
                let receiverEmailField = '#receiver-email__input';

                let referenceCodeField = '#ref-1__input';
                let textArea = '#contents__input';
                let char_limit = $(textArea).attr('maxlength'); // Limit for description of products

                /***** CUSTOM STYLES ********/
                $('body').after('<style>.submit_shipping_number{display: inline-block; padding: 4px 6px; background: #208931; #color:#fff !important; border-radius: 5px} .submitted_already{display: inline-block; padding: 4px 6px; background: #d4d4d4; #color:#fff !important; border-radius: 5px}</style>');
                console.log('Injecting code');

                // Add form in package submit
                if (window.location.href.indexOf("shipment/editPackagePrepare.do") > -1 || window.location.href == 'https://online.dpd.com.pl/shipment/editPackagePrepare.do?serial=false') {

                    $(".service-list").prepend(
                        '<div id="extra_content" style="padding: 8px 0; border-bottom:1px solid #ccc">\
                        <p>Wklej ID Zamówienia z Presty tutaj</p>\
                        <input type="number" id="presta_order_id" name="presta_order_id">\
                        <input type="submit" class="button" id="submit_order_id" name="submit_id">\
                        </div>\
                    ');

                    $('div.sender-section.form-section.ng-untouched.ng-pristine.ng-valid > div.button-row').prepend(
                        '<input type="button" value="UNIQUE" id="unique_warehouse" class="button">'
                    );

                    $('#unique_warehouse').on('click', function () {
                        insertUniqueWarehouse();
                    });

                    console.log('Prepended buttons');
                }

                // Add Insert delivery number into presta button

                if (window.location.href.indexOf("packages-confirmed-manage.go") > -1 ||
                    window.location.href.indexOf("packages-history.go") > -1) {

                    let items_on_page = $('select[name="maxRows"]');
                    addOrderShippingInfo();
                    bulkInsertShippingNumbers();

                    items_on_page.change(function () {
                        addOrderShippingInfo();
                        bulkInsertShippingNumbers();
                    });

                    $('.submit_shipping_number').on('click', function (e) {
                        e.stopImmediatePropagation();
                        insertShippingNumber($(this).data('order-id'), $(this).data('shipping-number'), $(this));
                    });
                }

                function insertUniqueWarehouse() {
                    changeValueJs(senderCompanyNameField, 'UNIQUE Magazyn');
                    changeValueJs(senderNameField, 'Anna Araśniewiecz');
                    changeValueJs(senderStreetField, 'ul. Kolejowa 29');
                    changeValueJs(senderPostalCodeField, '05300');
                    changeValueJs(senderCityField, 'Mińsk Mazowiecki');
                    changeValueJs(senderPhoneField, '25 758 78 11');
                    changeValueJs(senderEmailField, 'andrzej@meblujdom.pl');
                }

                function addOrderShippingInfo() {
                    if (window.location.href == 'https://online.dpd.com.pl/packages-confirmed-manage.go') {
                        let order_ids = $('#packages tr.even td:nth-child(10), #packages tr.odd td:nth-child(10)');
                    } else if (window.location.href == 'https://online.dpd.com.pl/packages-history.go') {
                        let order_ids = $('#packages tr.even td:nth-child(11), #packages tr.odd td:nth-child(11)');
                    } else {
                        return false;
                    }

                    order_ids.each(function () {
                        if ($(this).text() != '') {
                            if (window.location.href == 'https://online.dpd.com.pl/packages-confirmed-manage.go') {
                                let shipping_number = $(this).closest('tr.even, tr.odd').find('td:nth-child(2)').text(); // return shipping number, hu hu so lame but it works
                            } else if (window.location.href == 'https://online.dpd.com.pl/packages-history.go') {
                                let shipping_number = $(this).closest('tr.even, tr.odd').find('td:nth-child(1)').text(); // return shipping number, hu hu so lame but it works
                            }

                            order_id = $(this).text().replace(/\D/g, ''); // return (int)order id

                            if (order_id == 'undefined' || !order_id) {
                                console.log('Coś poszło nie tak');
                                return;
                            }

                            let self = $(this); // assign this object to different value to be able to use it success query

                            let cookie_shipping_number = readCookie(order_id);
                            /* Function is testing if this order was checked with api response.
                             * If was then just simply set as already check to increse performance */
                            if (cookie_shipping_number != shipping_number) {
                                // If order was checked and there was no shipping number
                                if (cookie_shipping_number === 'not_filled') {
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
                    });
                }

                function bulkInsertShippingNumbers() {
                    let to_submit = $('.submit_shipping_number');
                    let counted = to_submit.length;

                    if (counted > 1) {
                        $('#PKGS\\.UNIQUE\\.FLAG').after('<input value="wstaw masowo do presty" type="button" id="bulk_update">');
                    }

                    $('#bulk_update').on('click', function () {
                        to_submit.each(function (index) {
                            let that = this;
                            let t = setTimeout(function () {
                                insertShippingNumber($(that).data('order-id'), $(that).data('shipping-number'), $(that));
                            }, 4000 * index);
                        });
                    });
                }

                function insertShippingNumber(order_id_to_submit_shipping_number, shipping_number, $node_object) {

                    // If parcel collection was sent to DPD, and we received shipping number
                    // After click on added button

                    shipping_number = 'DPD: ' + shipping_number;

                    // send email
                    $.ajax({
                        url: 'https://meblujdom.pl/modules/dpdtracking/update_tracking_number.php?id_order=' + order_id_to_submit_shipping_number + '&security_token=Isu6AjdOsPeAXeoPa&shipping_number=' + shipping_number,
                        type: "GET",
                        processData: false,
                        success: function (data) {
                            createCookie(order_id_to_submit_shipping_number, '', -1); // remove previous cookie if had it
                            console.log('Inserted ' + shipping_number + ' shipping number to order ' + order_id_to_submit_shipping_number);
                            $($node_object).text(data);
                        },
                        error: function (xhr, ajaxOptions, thrownError) { // Add these parameters to display the required response
                            alert(xhr.status);
                            alert(xhr.responseText);
                        },
                    });
                }

                /* Function that is triggered after inserting order ID in preparing a new package */

                $('#submit_order_id').click(function () {
                    // clearing old info
                    $('#order_messages, #extra_address_info, .payment_type, #order_value, #warehouse_information, #countContainer').remove();

                    if ($('#presta_order_id').val() != '') {

                        // add button to prepare status "awaiting for collect" in Prestashop
                        if ($('#submit_id_order_state').length != 1) {
                            $('.button-row_parcel').append('' +
                                '<input type="button" class="button" style="background: orange" id="submit_id_order_state" value="Wstaw status nadania do zamówienia">' +
                                '');

                            $('#submit_id_order_state').click(function (e) {
                                let order_id = $('#presta_order_id').val();

                                // If You want to get id on different page like when package was prepared and it wasn't specified by input
                                if (!order_id) {
                                    order_id = referenceCodeField.val().replace(/\D/g, '') * 1;
                                }

                                if (readCookie('order_state_set') != order_id) {
                                    setOrderStatus(order_id, package_in_preparation_status_id, $(this));
                                } else {
                                    $(this).val('Ustawiłeś już tutaj status').css('background', 'grey').attr('disabled', true);
                                }
                            });

                        }

                        order_id = $('#presta_order_id').val();
                        getOrderAndShippingInfo(order_id);


                    } else {
                        $.growl.error({title: '', message: 'Podaj ID zamówienia'})
                    }
                });


                /**
                 * Set status in order
                 * @param order_id (int)
                 * @param id_status (int)
                 * @param $node_object
                 */
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


                /* Logic and connection to retrive information (int)id */
                function getOrderAndShippingInfo(order_id) {

                    if (order_id !== '') {
                        let orderRequest = new XMLHttpRequest();
                        orderRequest.open('GET', api_url + 'orders/' + order_id + '?output_format=JSON', true, apiKey, "");
                        orderRequest.onload = function () {
                            let orderData = JSON.parse(orderRequest.responseText);

                            changeValueJs(referenceCodeField, orderData.order.id + ' ' + orderData.order.reference); // Adding reference
                            changeValueJs(senderNameField, senderName);
                            changeValueJs(senderPhoneField, senderPhoneNumber);
                            changeValueJs(senderEmailField, senderEmail);
                            changeValueJs(senderPostalCodeField, senderPostCode);
                            changeValueJs(senderCityField, senderCity);
                            changeValueJs(senderStreetField, senderStreet);

                            // Adds a list of product to see what You need to send
                            // Does not automatically because sometimes You need change quantity of packages
                            $('.package-info-section').append('<div id="order_products" class="order_products" style="background:#efefef;padding:3px;border-radius:5px;"></div>');
                            $('.order_products').html(''); // clear before adding if You made a wrong ID

                            $('.package-info-section').after
                            ('<p class="payment_type" style="font-size:14px">' +
                                'Płatność: <strong id="payment_name" style="color: red">' + orderData.order.payment + '</strong></p>'
                            ).after
                            ('<p id="order_value" style="font-size: 1.4em">' +
                                '<strong>Wartość zamówienia: </strong> ' +
                                '<span style="color: seagreen">' + parseFloat(orderData.order.total_paid_tax_incl, 2) + ' zł</span></p>'
                            );

                            // now let's get some products from order in this way because default version
                            // from only order not order_details is fucked up
                            $.ajax({
                                url: api_url + 'order_details/?display=[product_name,product_quantity,unit_price_tax_incl]&filter[id_order]=' + order_id + '&output_format=JSON',
                                type: "GET",
                                username: apiKey,
                                password: "",
                                dataType: "json",
                                processData: false,
                                success: function (data) {
                                    $(data.order_details).each(function (key, val) {
                                        let quantities = 'x' + val.product_quantity + ' ';
                                        val.product_name = shorterProductName(val.product_name);
                                        $('#order_products').append('<p><span class="bought_products" id="product_name' + key + '" style="padding: 5px 8px; background: #fff; cursor:pointer; font-weight:bold;border-radius:5px" title="Kliknij by skopiować do schowka"><strong>' + quantities + '</strong>' + shorterProductName(val.product_name) + '</span></p>');
                                        $('#product_name' + key).click(function () {
                                            copyToClipboard('#product_name' + key);
                                        });
                                    });

                                    //If there is only item bought it will add name of product with quantity to adnotation to easly find this info on label
                                    let boughtProducts = '';
                                    $('.bought_products').each(function () {

                                        // If there is saturday delivery bought by customer
                                        if ($(this).text().indexOf("Dostawa mebli na sobotę") >= 0) {
                                            $('#elem_16').click().attr('selected', true); // @todo fix clicking after a period of time
                                            $('#servicesDiv').before('<marquee><p style="color: red">Uwaga: dostawa na sobotę</p></marquee>');
                                            $.growl.error({title: 'Dostawa na sobotę'});
                                        }

                                        boughtProducts += $(this).text() + ' \n';
                                    });
                                    $(textArea).val(boughtProducts);

                                    let content_field_chars = $(textArea).val().length;
                                    let count_container = $('.package-info-section > .title');
                                    count_container.after('<div id="countContainer"></div>');
                                    let count_container_field = $('#countContainer');
                                    $(textArea).on('change keyup paste click', function () {
                                        content_field_chars = $(textArea).val().length;
                                        count_container_field.text(content_field_chars + ' znaków, LIMIT: ' + $(textArea).attr('maxlength') + ' znaki/ów');

                                        if (content_field_chars >= char_limit) {
                                            count_container_field.css('color', 'red')
                                        } else {
                                            count_container_field.css('color', '')
                                        }
                                    });
                                    $(textArea).click();

                                    // get messages from Warehouse
                                    let orderPackagesInfo = getPackageInfoFromWarehouse(magazyn_api_url, order_id, 'get_packages', magazyn_api_token);
                                    if (orderPackagesInfo && orderPackagesInfo.message) {
                                        let style = 'background: #ffebeb; border-radius:3px; border:1px solid #dedede; padding: 8px; margin: 5px 0 5px 0';
                                        $('#order_products').after('<div id="warehouse_information" style="' + style + '">[Notka magazynowa]<br> ' + orderPackagesInfo.message + '</div>');
                                    }
                                }
                            });


                            // retrieve order state histories
                            let orderHistoriesRequest = new XMLHttpRequest();
                            orderHistoriesRequest.open('GET', api_url + 'order_histories/?display=full&filter[id_order]=[' + orderData.order.id + ']&output_format=JSON&sort=[id_DESC]', true, apiKey, "");
                            orderHistoriesRequest.onload = function () {
                                let orderHistories = JSON.parse(orderHistoriesRequest.responseText);

                                $(orderHistories.order_histories).each(function (key, val) {
                                    $('#order_products').append('<p id="elem' + key + '"><span style="padding: 2px 5px; background: #fff;">' + val.date_add + ':</span></p>');

                                    // connecting to receive information about current state addres
                                    let currentStateRequest = new XMLHttpRequest();
                                    currentStateRequest.open('GET', api_url + 'order_states/?display=[name,color]&filter[id]=[' + val.id_order_state + ']&output_format=JSON', true, apiKey, "");
                                    currentStateRequest.onload = function () {
                                        if (currentStateRequest.status == 200) {
                                            let state = JSON.parse(currentStateRequest.responseText);
                                            let payment_type = $('.payment_type > strong').text();

                                            if (state.order_states[0].name == 'Dostarczone' && (payment_type == 'Płatność przy odbiorze')) {
                                                alert('Uwaga: Zamówienie jest już dostarczone, jednak jest ono zaznaczone za pobraniem! Odznacz pobranie jeśli wysyłasz REKLAMACJE lub zmień kwotę gdy dosyłasz tylko resztę produków! Odznaczono zamówienie za pobraniem.');
                                                setTimeout(function () {
                                                    $('.optional-attributes__list > div:nth-child(2) > span > input').click().click();
                                                }, 100);
                                            }

                                            if (state.order_states[0].name == 'Przesyłka w przygotowaniu' || readCookie('order_state_set') == orderData.order.id) {
                                                $('#submit_id_order_state').css("background", "lightgrey").attr("disabled", true).attr("title", "Już nadano status przesyłki w przygotowaniu");
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
                            let id_address = orderData.order.id_address_delivery;
                            // Get all shipping data
                            if (id_address !== '') {
                                // connecting to receive information about shipping addres
                                let addressRequest = new XMLHttpRequest();
                                addressRequest.open('GET', api_url + 'addresses/' + id_address + '?output_format=JSON', true, apiKey, "");
                                addressRequest.onload = function () {

                                    // now let's have customer email
                                    let id_customer = orderData.order.id_customer;
                                    if (id_customer !== '') {
                                        // connecting to receive information about shipping addres
                                        let customerRequest = new XMLHttpRequest();
                                        customerRequest.open('GET', api_url + 'customers/' + id_customer + '?output_format=JSON', true, apiKey, "");
                                        customerRequest.onload = function () {
                                            let customerData = JSON.parse(customerRequest.responseText);
                                            changeValueJs(receiverEmailField, customerData.customer.email);
                                            $(receiverPostalCodeField).focus(); //
                                        };
                                        customerRequest.send();
                                    }
                                    let addressData = JSON.parse(addressRequest.responseText);

                                    if (addressData.address.company !== '') {
                                        addressData.address.company = addressData.address.company + ' ';
                                        changeValueJs(receiverCompanyNameField, addressData.address.company); // Company

                                    }
                                    //receiverNameField.val(ucwords(addressData.address.firstname + ' ' + addressData.address.lastname, true)).trigger('change').trigger('change').click(); // Contact person
                                    changeValueJs(receiverNameField, ucwords(addressData.address.firstname + ' ' + addressData.address.lastname));
                                    changeValueJs(receiverStreetField, ucwords(addressData.address.address1 + ' ' + addressData.address.address2));

                                    changeValueJs(receiverCityField, ucwords(addressData.address.city)); // City
                                    let citySubmittedByClient = $(receiverCityField).val();

                                    changeValueJs(receiverPhoneField, addressData.address.phone.replace(/\D/g, '')); // Telephone
                                    if (addressData.address.phone == '' || addressData.address.phone == null && addressData.address.phone_mobile) {
                                        changeValueJs(receiverPhoneField, addressData.address.phone_mobile.replace(/\D/g, '')); // Telephone Mobile
                                    }

                                    $.growl.warning({
                                        title: "Wymagana akcja",
                                        message: "Teraz naciśnij spację i kliknij gdziekolwiek. Ewentualnie wybierz pole kodu pocztowego odbiorcy, wciśnij spację i kliknij poza.",
                                        duration: 5000
                                    });

                                    changeValueJs(receiverPostalCodeField, addressData.address.postcode.replace(/\D/g, '')); // postal code

                                    // bardzo brzydki hak w którym po utworzeniu klasy wykonamy dalsza część kodu
                                    // w tym przypadku będzie to załadowanie bocznej sekcji z wyborem cech przesyłki
                                    // jak najszybciej odkryć jak wyzwolić zawartość przez kod zamiast tego obejścia
                                    // @todo
                                    $(document).on('DOMNodeInserted', function (e) {
                                        if ($(e.target).hasClass('poa')) {
                                            // first 2 digits of postal codes
                                            let nearby_areas = [35, 36, 37, 38, 39];
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
                                                    if ($('.optional-attribute:contains("Pobranie COD")').length == 1) {
                                                        $('.optional-attribute:contains("Pobranie COD")').find('input').click();
                                                    } else if ($('.optional-attributes__list > div:nth-child(2) > span > input').length > 0) {
                                                        $('.optional-attributes__list > div:nth-child(2) > span > input').click();
                                                    } else if ($('.optional-attributes__list > div:nth-child(2) > label > input').length > 0) {
                                                        $('.optional-attributes__list > div:nth-child(2) > label > input').click();
                                                    } else {
                                                        $.growl.error({
                                                            title: "Błąd pobrania!",
                                                            message: "Hej! Nie mogę zaznaczyć pobrania. DPD coś musiało zmienić. " +
                                                                "Daj znać Erykowi ale póki co zaznacz ręcznie",
                                                            duration: 10000,
                                                        });
                                                    }

                                                    is_cod_order = true;

                                                    setTimeout(function () {
                                                        let cod_field = $('.service-attribute__input > input');
                                                        $.growl.error({
                                                            title: "Zamówienie za pobraniem",
                                                            message: "Pobranie " + (orderData.order.total_paid_tax_incl * 1).toFixed(2),
                                                            duration: 12000
                                                        });
                                                        cod_field.attr('id', 'codValue');
                                                        $('.service-attribute__input > input').val((orderData.order.total_paid_tax_incl * 1).toFixed(2), true).trigger('change').select().click(); // Value of COD, multiply string by 1 to get number instead of string
                                                        changeValueJs('.service-attribute__input > input', (orderData.order.total_paid_tax_incl * 1).toFixed(2));
                                                        console.log('Pobranie: ' + (orderData.order.total_paid_tax_incl * 1).toFixed(2));



                                                        if (cod_field.length == 0) {
                                                            alert('Nie mogę odnaleźć pola do Pobrania - sprawdź czy pobranie zostało zaznaczone.');
                                                        }

                                                    });
                                                }, 300);

                                                setTimeout(function () {
                                                    if ((orderData.order.total_paid * 1) != (orderData.order.total_paid_tax_incl * 1)) {
                                                        alert('UWAGA! UWAGA!!! Cena za pobranie jest inna niż cena zamówienia - sprawdź czy wynikło to ze zdublowania płatności i wpisz dobrą wartość pobrania!')
                                                    }
                                                }, 50);
                                            }

                                            $('.parcel-cell_number').next().children().val('25', true).attr('id', 'firstPackageWeight').trigger('change'); // input package weights
                                            changeValueJs('#firstPackageWeight', 25);


                                            // insert packages quantity to the field
                                            let packagesQnt = getPackageInfoFromWarehouse(magazyn_api_url, order_id, 'get_packages', magazyn_api_token);

                                            setTimeout(function () {
                                                if (typeof packagesQnt.packages_quantity === 'undefined') {
                                                    $.growl.error({
                                                        title: "",
                                                        message: "Nie mogę pobrać danych o ilości paczek"
                                                    });
                                                    return false;
                                                }
                                                // set paleta 100kg
                                                if (packagesQnt == 999) {
                                                    $('.parcel-cell_number:contains("1")').next().children().val('100').trigger('change');
                                                    $.growl.error({
                                                        title: "",
                                                        message: "Paleta! Sprawdź czy jest wpisane 100 kg w paczce."
                                                    });
                                                } else {
                                                    // click "Add package" multiple times
                                                    for (i = 1; i < packagesQnt; i++) {
                                                        $('input[value="Dodaj paczkę"]').click();
                                                    }
                                                    if (packagesQnt > 1) {
                                                        $.growl({
                                                            title: "",
                                                            message: "Ilość paczek: <strong style='color:darkred'>" + packagesQnt + "</strong>.<br> Upewnij się, że wpisałeś wagę.",
                                                            duration: 6000
                                                        });
                                                    }
                                                }
                                            }, 500);


                                            if ($(receiverCityField).val() != citySubmittedByClient.toUpperCase()) {
                                                $.growl({
                                                    title: "Podmiana miasta",
                                                    message: "Podmieniam miasto zasugerowane przez DPD z: <br> <b style='color:darkred'>" + $(receiverCityField).val() + "</b><br> na to które podał Klient w zamówieniu czyli:<br> <strong style='color:forestgreen'>" + citySubmittedByClient + "</strong>",
                                                    duration: 8000
                                                });
                                                changeValueJs(receiverCityField, citySubmittedByClient);
                                            }
                                        }
                                    });
                                };
                                addressRequest.send();
                            }


                            if (orderRequest.status == 200) {
                                //$.growl.notice({title: "", message: "Poprawnie załadowano dane Klienta"});

                                // get order messages
                                $.ajax({
                                    // If You want to take particular element from request api/orders/?display=[shipping_number]&filter[id]=[3145]&output_format=JSON
                                    url: api_url + 'customer_threads/?display=full&filter[id_order]=[' + order_id + ']&output_format=JSON',
                                    type: "GET",
                                    success: function (data) {
                                        if (data.customer_threads && typeof data.customer_threads[0] != 'undefined') {
                                            $('.package-info-section').append(
                                                '<div id="order_messages" style="margin:10px 0; padding: 8px; background: #e0e0e0"></div>'
                                            );
                                            $(data.customer_threads[0].associations.customer_messages).each(function (key, val) {
                                                $.ajax({
                                                    url: api_url + 'customer_messages/' + val.id + '?&output_format=JSON',
                                                    type: "GET",
                                                    async: false, // use this to get them in right order
                                                    success: function (data, xhr) {
                                                        console.log('Loaded Customer Messages');

                                                        if (xhr == 'success') {
                                                            $(data.customer_message).each(function (key, val) {
                                                                if (val.private == '1') {
                                                                    val.message = '<strong>Notatka: </strong>' + val.message;
                                                                }
                                                                if (val.id_employee == '0') {
                                                                    let style = 'background: #dbe9ef; border-radius:3px; border:1px solid #c4dce6; padding: 8px; margin: 5px 0 5px 0';
                                                                    $('#order_messages').append('<div style="' + style + '"><i>' + val.date_add + ':</i> [Klient]<br> ' + val.message.replace(/\n/g, "<br>") + '</div>');
                                                                } else {
                                                                    let style = 'background: #fff; border-radius:3px; border:1px solid #dedede; padding: 8px; margin: 5px 0 5px 0';
                                                                    $('#order_messages').append('<div style="' + style + '"><i>' + val.date_add + ':</i> [Pracownik]<br> ' + val.message.replace(/\n/g, "<br>") + '</div>');
                                                                }
                                                            });
                                                        }
                                                    },
                                                });
                                            })
                                        }
                                    },
                                });
                            } else {
                                $.growl.error({title: "", message: "Coś poszło nie tak"});
                            }
                        };
                        orderRequest.send();
                    }
                }

                let cod_payments_texts = [
                    'Płatność przy odbiorze',
                    'Allegro: Płatność przy odbiorze (COD)',
                    'Allegro: COD'
                ];

                $('#save-package-button, #submit_id_order_state').on('click', function(e) {
                    if (cod_payments_texts.includes($('#payment_name').text())
                        && ($('#codValue').val() == '' || typeof $('#codValue') == 'undefined')
                    ) {
                        if (confirm("Zamówienie prawdopodbnie jest za pobraniem ale nie ma wpisanej kwoty pobrania!" +
                            "\n Kontynuować zapisanie czy anulować i wpisać ręcznie?") == true) {
                            return true;
                        } else {
                            e.preventDefault();
                        }
                    }
                });
            });
        }
    }, 500);
}