// ==UserScript==
// @name         "Tabelka" helper & e-mail zamówieniowy
// @version      1.1.2
// @namespace    https://meblujdom.pl/
// @description  Creates a button at order page in Prestashop to easily copy perfect row to Tabelka. Also generates e-mail to order products.
// @author       Eryk Wróbel
// @match        https://meblujdom.pl/*/index.php?tab=AdminOrders&id_order=*
// @match        https://meblujdom.pl/*/index.php?controller=AdminOrders&id_order=*
// @match        https://meblujdom.test/*/index.php?controller=AdminOrders&id_order=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35799/%22Tabelka%22%20helper%20%20e-mail%20zam%C3%B3wieniowy.user.js
// @updateURL https://update.greasyfork.org/scripts/35799/%22Tabelka%22%20helper%20%20e-mail%20zam%C3%B3wieniowy.meta.js
// ==/UserScript==

// Changelog
// v 1.1.2 - Przelewy24 order payment source
// v 1.1.1 - fix [object] product name at email title,
//         - escaping " character to prevent pasting data into the sheet
// v 1.1.0 - completely rewritten from ground, now copying from objects instead of text and multiple other improvements
// v 1.0.91 - admin fix
// v 1.0.9 - small fixes for date and such
// v 1.0.8 - removed some of the text
// v 1.0.7 - added button to create email to order something from Unique, Mados or Sitplus
// v 1.0.6 - fix for additional info in delivery address and remove <hr> and prevent to double copy.
// v 1.0.5 - fix for company address or invoice when having double quotes in it (it was braking the row) and fixed clearing manufacturer name
// v 1.0.3 - added functionality to check if a bankwire was already paid. If not then attach (oczekiwanie na płatność!) in message
// v 1.0.1 - little improvements in usability
// v 1.0 - Start
// @todo add Product manufacturer check. If all products from orders are from the same then do nothing, but split decission about how to copy when different manufacturers
// @todo add check button to copy price of products


let content = '';
const source = 'internet';
const count_products = Object.keys(order_products).length;
$(document).ready(() => {
    $.getScript('https://meblujdom.pl/js/useful_functions.js?ver=1.6', () => {
        function createAddressLine(address) {
            let output = '';

            if (address.firstname !== '' || address.lastname !== '') {
                output += address.firstname.trim() + ' '+ address.lastname.trim() + '\n';
            }

            if (['Pan', 'Pani'].includes(address.company)) {
                address.company = '';
            }

            if (address.company !== '') {
                output += address.company.trim() + '\n';
                if (address.vat_number !== '') {
                    output += address.vat_number + '\n';
                }
            }

            output += address.address1 + '\n';
            if (address.address2 !== '' ) {
                output += address.address2.trim() + '\n';
            }

            output += address.postcode.trim() + ' ' + address.city.trim() + '\n';

            if (address.country !== 'Polska') {
                output += address.country + ' ' + address.city + '\n';
            }

            output += address.phone_mobile +'\n';

            if (address.phone !== '' && address.phone_mobile != address.phone) {
                output += address.phone + '\n'
            }

            output += customer.email;

            if (address.other !== '') {
                output += '\n' + address.other;
            }

            // replace " symbol with ' to prevent incorrect pasting to sheet
            output = output.replaceAll('"', '\'');

            return output;
        }

        let delivery_address_string = createAddressLine(addresses.delivery);

        // Main idea
        if (window.location.href.indexOf("AdminOrders&id_order") >= 0) {
            createContainer();
            $('#order_condensed').on("click",function(e) {
                saveCopyChoices();
                content = content + order.date_add + '\t'
                    + id_order + '\t'
                    + '"' + delivery_address_string + '"\t'
                    + '"' + getProductsFromOrder() + '"\t' // dunno why commas are inserting with .toString('')
                    + getProductsPrice() + '\t'
                    + getDeliveryPrice() + '\t'
                    + getTotalOrderPrice() + '\t'
                    + getPaymentType() + '\t'
                    + getEmployeeName() + '\t'
                    + source;

                copyQ(content);
                $.growl({message: 'Skopiowano dane zamówienia do schowka 😊 Wklej je do tabelki.', style: 'success', duration: 6000, title: ''});
                $(this).removeClass('btn-info').addClass('btn-default');
            });


            // przycisk do tworzenia wiadomości z zamówieniem mailowym
            $('#order_email').on('click', function(e) {
                saveCopyChoices();

                let customer_name = '';
                if (addresses.delivery.firstname !== '') {
                    customer_name = addresses.delivery.firstname[0].toUpperCase() + '. ' + addresses.delivery.lastname;
                } else if (addresses.delivery.company !== '') {
                    customer_name = addresses.delivery.company;
                } else {
                    alert ('Nie mogę pobrać danych Klienta do dostawy oraz treści maila');
                }

                let email_title = '';
                if (count_products === 1) {
                    let product_name = shorterProductName(order_products[Object.keys(order_products)]['product_name']);
                    email_title = customer_name + ' - ' + product_name;
                } else if (count_products > 1) {
                    let polish_end = (count_products >= 5) ? 'produktów' : 'produkty';
                    email_title = customer_name + ' ('+ count_products + ' ' + polish_end + ')';
                }

                let content = '';
                content += '[!] Zamówienie dla ' + email_title + ' od Meblujdom\n\n\n';

                content += 'Dzień Dobry,   \n\n';
                content += 'Składam zamówienie na: \n\n';
                content += getProductsFromOrder( '\n\n', '• ') + '\n\n\n';

                if ($('#with_delivery_address').is(':checked')) {
                    content += 'Przesyłkę proszę wysłać pod podany poniżej adres:\n';
                    content += '-----------------------------------------------\n';
                    content += delivery_address_string + '\n';
                    content += '-----------------------------------------------\n\n';
                }

                if ($('#with_tracking_link').is(':checked')) {
                    content += '*** Bardzo proszę o wstawienie numeru listu przewozowego tutaj:\n';
                    content += 'https://meblujdom.pl/modules/dpdtracking/insert_shipping_number.php?id_order=' + id_order + '&contrahent_code=s1ii63eo6i913u98u51ma2m4g0g\n\n';
                    content += 'Dzięki temu Klienci wiedzą kiedy paczka została nadana, otrzymują maila z numerem,'
                        + ' a jednocześnie my wiemy, że paczka już wyszła bądź jest dostarczona.\n\n';
                }

                content += 'Dziękuje bardzo za współpracę :)';

                copyQ(content);
                $.growl({message: 'Skopiowano treść do wklejenia w emailu z zamówieniem 😉', style: 'success', duration: 9000, title: ''});
                $(this).removeClass('btn-info').addClass('btn-default');
            });
        }

        // @todo tutaj skończyłeś, to już działa tylko dowiedz się o co chodzi z manufacturer_name
        function getProductsFromOrder(line_separator = '\n --- \n', product_prefix = '') {
            let products = '';
            let i = 0;

            $.each(order_products, (id_order_detail, detail) => {
                i++;
                let product_string = '';

                product_string = product_prefix + detail.product_quantity + 'x ' + detail.product_name;

                if ($('#with_reference').is(':checked') && detail.product_reference !== '') {
                    product_string += ' ( ' + detail.product_reference + ' )';
                }

                if (i < Object.keys(order_products).length) {
                    product_string += line_separator;
                }

                if ($('#manufacturer_name_in_product').is(':checked') === false) {
                    product_string = product_string.replace(detail.manufacturer_name, '').replace('  ', ' ').trim();
                }

                products += shorterProductName(product_string);
            });

            return products; // wrap for pasting with respecting new lines
        }

        function getDiscounts() {
            return parseFloat(order.total_discounts).toFixed(2).replace('.', ',');
        }

        function getProductsPrice() {
            let products_value = parseFloat(order.total_products_wt);
            let discounts = parseFloat(order.total_discounts);

            return (products_value - discounts).toFixed(2).replace('.', ',');
        }

        function getTotalOrderPrice() {
            return parseFloat(order.total_paid).toFixed(2).replace('.', ',');
        }

        function getDeliveryPrice() {
            return parseFloat(order.total_shipping).toFixed(2).replace('.', ',');
        }

        function getPaymentType() {
            let payment_accepted = false;
            $.each(payment_history, (k, state) => {
                if (parseInt(state.id_order_state) === 2) {
                    payment_accepted = true;
                }
            });

            let payment = '';

            $.each(payment_history, (k, state) => {
                let id_order_state = state.id_order_state * 1;

                if ([1, 10].includes(id_order_state)) {
                    payment = 'Przelew';
                }

                if ([19, 20].includes(id_order_state)) {
                    payment = 'PayU';
                }

                if ([14, 26, 41].includes(id_order_state)) {
                    payment = 'Pobranie';
                }

                if ([38, 48, 49, 59].includes(id_order_state)) {
                    payment = 'Raty';
                }

                if ([36].includes(id_order_state)) {
                    payment = 'Faktura terminowa';
                }

                if ([11, 21, 61, 71].includes(id_order_state)) {
                    payment = 'PayPal';
                }

                if ([38, 39, 40, 41, 42, 43, 52, 53, 54, 55, 56, 57, 68].includes(id_order_state)) {
                    payment = 'Allegro';
                }

                if ([73, 74].includes(id_order_state)) {
                    payment = 'Przelewy24';
                }
            });

            if (!payment) {
                payment = 'Ceneo';
            }

            if (payment === 'Przelew' && payment_accepted === false){
                payment = payment + ' (oczekiwanie na płatność!)';
            }

            return payment;
        }

        function getEmployeeName() {
            if ($('#employee_full_name').length) {
                return $('#employee_full_name').text();
            } else {
                return $('#employee_infos .string-long').text();
            }
        }

        function saveCopyChoices() {
            localStorage.setItem('delivery_checkbox', $('#with_delivery_address').is(':checked'));
            localStorage.setItem('tracking_checkbox', $('#with_tracking_link').is(':checked'));
            localStorage.setItem('reference_checkbox', $('#with_reference').is(':checked'));
            localStorage.setItem('manufacturer_checkbox', $('#manufacturer_name_in_product').is(':checked'));
            localStorage.setItem('checkbox_saved_for_the_1st_time', 'yes');
        }

        function getCopyChoice(localStorageKey) {
            // Jeśli po raz pierwszy uruchomiono to zaznacz wszystkie
            if (localStorage.getItem('checkbox_saved_for_the_1st_time') !== 'yes') {
                return 'checked';
            }

            return (localStorage.getItem(localStorageKey) === 'true') ? 'checked' : '';
        }

        function createContainer() {
            if ( $('#order_condensed').length !== 1) {
                let input_span_style = 'margin-right: 5px; cursor: help; opacity:0.75';
                let label_style = 'cursor: pointer; transform: translateY(-2px); margin: 0 12px 0 3px; font-weight: normal;';

                $('#addressShipping > div > div').append('' +
                    '<span title="Kliknij aby skopiować wiadomość do wklejenia w mailu zamówieniowym do producenta" class="btn btn-info" style="display:none;cursor:pointer" id="order_email">' +
                    '<i class="icon-envelope-alt" style="margin-right: 5px"></i> Zamów emailem</span>' +
                    ' <span title="Skopiuj zamówienie tak by tylko wkleić je do tabelki z zamówieniami" class="btn btn-info" style="display:none;cursor:pointer" id="order_condensed">' +
                    'Skopiuj do tabelki</span><br>' +
                    '<div style="margin-top:8px; margin-left:2px">' +
                    '<span style="' + input_span_style + '" title="Dane adresowe Klienta do wysyłki (tylko w zamówieniowym)">' +
                    '<input type="checkbox" id="with_delivery_address" ' + getCopyChoice('delivery_checkbox') +'>' +
                    '<label style="' + label_style + '" for="with_delivery_address">Dostawa</label>' +
                    '</span>' +
                    '<span style="' + input_span_style + '" title="Link do wstawienia numeru śledzenia (tylko w zamówieniowym)">' +
                    '<input type="checkbox" id="with_tracking_link" ' + getCopyChoice('tracking_checkbox') +'>' +
                    '<label style="' + label_style + '" for="with_tracking_link">Śledzenie</label>' +
                    '</span>' +
                    '<span style="' + input_span_style + '" title="Kody referencyjne przy nazwach produktów produktach?">' +
                    '<input type="checkbox" id="with_reference" ' + getCopyChoice('reference_checkbox') +'>' +
                    '<label style="' + label_style + '" for="with_reference">Kody</label>' +
                    '</span>' +
                    '<span style="' + input_span_style + '" title="Zostawia nazwę producenta w nazwie produktu jeśli takowa istnieje. Jeśli odznaczone to np. KRIS Signal = KRIS">' +
                    '<input type="checkbox" id="manufacturer_name_in_product" ' + getCopyChoice('manufacturer_checkbox') +'>' +
                    '<label style="' + label_style + '" for="manufacturer_name_in_product">Producent</label>' +
                    '</span>' +
                    '</div>'
                );

                $('#order_condensed, #order_email').show();
            }
        }

        function copyQ(letiable) {
            let container = document.getElementById("order_condensed");
            let inp = document.createElement("textarea");
            inp.type = "text";
            container.appendChild(inp);
            inp.value = letiable;
            inp.select();
            document.execCommand("Copy");
            container.removeChild(container.lastChild);
        }
    })
});