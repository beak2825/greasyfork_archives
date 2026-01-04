// ==UserScript==
// @name         samokat_fast_order
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Converting CSV to a ready-made samokat order
// @author       CleverMan  
// @include      *://dostavista.ru/order
// @require      https://cdn.jsdelivr.net/npm/papaparse@5.3.2/papaparse.min.js
// @require      https://cdn.jsdelivr.net/npm/moment@2.29.2/moment.min.js
// @icon         https://www.google.com/s2/favicons?domain=dostavista.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442980/samokat_fast_order.user.js
// @updateURL https://update.greasyfork.org/scripts/442980/samokat_fast_order.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {

        var sameday = document.querySelector('.unique-order-form__forms-switcher-tab-sameday');
        var asap = document.querySelector('.unique-order-form__forms-switcher-tab-asap');
        var standard = document.querySelector('.unique-order-form__forms-switcher-tab-standard');
        var switcher = document.querySelector('.unique-order-form__forms-switcher');

        var file;

        var region = document.querySelector('.dv-region-select__region-black');

        var start_menu = document.querySelector('.dv-desktop-menu');
        var account_section = start_menu.getElementsByTagName('div');
        var check_client = account_section[1].getElementsByClassName('Button_Content_2MgbS')[0].innerText;

        var select_order = document.createElement('select');
        select_order.id = 'orders';
        var default_option = document.createElement('option');
        default_option.text = 'Не выбран';

        var div_file = document.createElement('div');
        div_file.className = 'dv-desktop-menu__item dv-desktop-menu__item--buttone';

        var input_file = document.createElement('input');
        input_file.type = 'file';
        input_file.accept = '.csv';

        if (check_client == '*Неспрессо') {
            start_menu.appendChild(div_file);
            account_section[2].appendChild(input_file);
            file = document.querySelector('input[type=file]');
            file.addEventListener('change', function() {
                if (this.value) {
                    let csv_file = file.files[0];
                    file.style.color = 'gray';

                    Papa.parse(csv_file, {
                        download: true,
                        header: true,
                        skipEmptyLines: true,
                        complete: function(results) {
                            deleteDuplicates(results.data);
                        }
                    })
                } else if (!this.value) {
                    let del_options = document.querySelectorAll('#orders > option');
                    for (let index = 1; index < del_options.length; index++) {
                        let element = del_options[index];
                        element.remove();
                    }
                }

            });

            start_menu.append(select_order);
            select_order.append(default_option);

            if (sameday) sameday.click();
            else if (asap) asap.click();
            else standard.click();

            getLocalData();
        }

        function deleteDuplicates(data) {
            let correct_date = [];
            try {
                for (let index_data = 0; index_data < data.length; index_data++) {
                    let order_data = data[index_data];
                    if (index_data != 0) {
                        for (let index_correct_date = 0; index_correct_date < correct_date.length; index_correct_date++) {
                            let order_correct_data = correct_date[index_correct_date];

                            if (order_correct_data['pickup.address'] === order_data['pickup.address'] &&
                                order_correct_data['pickup.contact_phone'] === order_data['pickup.contact_phone'] &&
                                order_correct_data['destination.address'] === order_data['destination.address'] &&
                                order_correct_data['dropoff.contact_phone'] === order_data['dropoff.contact_phone'] &&
                                order_correct_data['display_identifier'] === order_data['display_identifier']) {
                                if (order_correct_data['samokat_order_number'] != order_data['samokat_order_number'])
                                    order_correct_data['samokat_order_number'] = order_correct_data['samokat_order_number'] + ', ' + order_data['samokat_order_number'];
                                break;
                            }
                            if (index_correct_date == correct_date.length - 1) correct_date.push(order_data);
                        }
                    } else correct_date.push(order_data);
                }
                createListOrder(correct_date);
            } catch (error) {
                alert(`Не удалось получить данные из файла.\nОшибка: ${error.message}\nВыберите другой файл.`);
            }
        }

        function createListOrder(data) {
            for (let index = 0; index < data.length; index++) {
                let id_order = document.createElement('option');
                id_order.text = index + 1;
                id_order.value = index + 1;

                select_order.append(id_order);
            }
            select_order.addEventListener('change', function() {
                orderСonfiguration(data[this.value - 1])
            })
        }

        function orderСonfiguration(data) {
            let order_data = {
                "first_address": data['pickup.address'],
                "customer_phone": data['pickup.contact_phone'].replace('+7', ''),
                "customer_instruction": data['pickup.special_instructions'],
                "second_address": data['destination.address'],
                "client_name": data['dropoff.contact_name'],
                "client_phone": data['dropoff.contact_phone'].replace('+7', ''),
                "client_instruction": data['display_identifier'],
                "internal_order_number": data['samokat_order_number'],
                "start_datetime": data['deliver_from'],
                "finish_datetime": data['deliver_until'],
            };

            if (order_data.first_address.includes(region.innerText)) {
                Distributor(order_data);
            } else {
                SwitchRegion(order_data.first_address, order_data);
                Distributor(order_data);
            }

            switcher.addEventListener('click', () => {
                Distributor(order_data);
            });

        }

        function Distributor(order_data) {
            setTimeout(() => {
                HintAdderss(order_data.first_address, order_data.second_address);
                DeliveryInterval(order_data.start_datetime, order_data.finish_datetime)
                FirstAdderss(order_data.first_address);
                CustomerInstruction(order_data.customer_instruction);
                СustomerPhone(order_data.customer_phone);
                SecondAdderss(order_data.second_address);
                ClientInstruction(order_data.client_instruction);
                ClientPhone(order_data.client_phone);
                ClientName(order_data.client_name);
                InternalOrderNumber(order_data.internal_order_number);
            }, 1000);
        }

        function SwitchRegion(address, order_data) {
            region.click();
            document.addEventListener('DOMNodeInserted', function handler() {
                let list_region = document.querySelectorAll('.RegionDesktop_Region_xbi8A');
                let count_region = list_region.length;
                let close = document.querySelector('.Modal_CloseButton_1ebrY');
                if (count_region !== 0) {
                    for (element of list_region) {
                        if (address.includes(element.innerText)) {
                            setLocalData(order_data);
                            setTimeout(() => {
                                element.click();
                            }, 0);
                            break;
                        }
                        if (!--count_region) {
                            this.removeEventListener('DOMNodeInserted', handler);
                            setTimeout(() => {
                                close.click();
                            }, 0);
                            region.style.color = 'red';
                            console.error('Region not found');
                        }
                    }
                }
            });
        }

        function setLocalData(order_data) {
            localStorage.setItem('order_data', JSON.stringify(order_data));
        }

        function getLocalData() {
            let order_data = JSON.parse(localStorage.getItem('order_data'));
            if (order_data) {
                Distributor(order_data);
                localStorage.clear();
            } else return;
        }

        function HintAdderss(first_address, second_address) {
            let extension_block = document.querySelectorAll('.OrderAccordion_Root_38qja');
            let show_extension = document.querySelectorAll('.OrderAccordion_Label_2IXpO');

            let address_section = document.querySelectorAll('.OrderInputError_Root_2MXiK');
            let raw_first_point = document.createElement('div');
            let raw_second_point = document.createElement('div');

            let style_raw_address =
                `background-color: rgb(255, 61, 129);
				color: white;
				padding: 4px 8px;
				font-size: 12px;
				border-radius: 3px 3px 0 0;
				font-weight: 400;
				line-height: 16px;
				letter-spacing: normal;`;

            raw_first_point.style.cssText = style_raw_address;
            raw_second_point.style.cssText = style_raw_address;

            raw_first_point.className = 'hint_adderss';
            raw_second_point.className = 'hint_adderss';

            raw_first_point.innerText = first_address;
            raw_second_point.innerText = second_address;

            let clear_hint = document.querySelectorAll('.hint_adderss');
            if (clear_hint) {
                for (element of clear_hint) element.remove();
            }

            address_section[0].prepend(raw_first_point);
            address_section[1].prepend(raw_second_point);

            if (extension_block[extension_block.length - 1].classList.contains('OrderAccordion_open_Kl3gt') == false) {
                show_extension[show_extension.length - 1].click();
            }
        }

        function FirstAdderss(first_address) {
            let input = document.querySelector('.unique-order-form__point-address-0');

            input.focus();
            input.addEventListener('keypress', () => {
                input.value = first_address;
            });
        }

        function CustomerInstruction(customer_instruction) {
            let input = document.querySelector('.unique-order-form__point-instruction-0');
            input.addEventListener('keypress', () => {
                input.value = customer_instruction;
            });
        }

        function СustomerPhone(customer_phone) {
            let input = document.querySelector('.unique-order-form__point-phone-0');
            input.addEventListener('keypress', () => {
                input.value = customer_phone;
            });
        }

        function SecondAdderss(second_address) {
            let input = document.querySelector('.unique-order-form__point-address-1');
            input.addEventListener('keypress', () => {
                input.value = second_address;
            });
        }

        function ClientInstruction(client_instruction) {
            let suggestion = document.querySelector('.unique-order-form__point-suggestion-list-1');
            suggestion.addEventListener('click', () => {
                setTimeout(() => {
                    let input = document.querySelector('.unique-order-form__point-instruction-1');
                    input.addEventListener('keypress', () => {
                        input.value = client_instruction;
                    });
                }, 0);
            })
        }

        function ClientPhone(client_phone) {
            let input = document.querySelector('.unique-order-form__point-phone-1');
            input.addEventListener('keypress', () => {
                input.value = client_phone;
            });
        }

        function DeliveryInterval(start_datetime, finish_datetime) {
            let intervals = [];
            let input = document.querySelector('.DeliveryPointTemplate_TimeSelect_PI8u6 > .with-error > .OrderSelect_Root_2bUCM > .unique-order-form__point-date-1');
            input.title = `${start_datetime} - ${finish_datetime}`;
            input.click();
            setTimeout(() => {
                intervals = document.querySelectorAll('.OrderSelect_Select_2J0MY > .OrderSelect_Option_2aCmc');
                let start_time_client = {
                    'hour': start_datetime.match(/^[0-2][0-9]/)[0],
                    'minute': start_datetime.match(/[0-5][0-9]$/)[0],
                };
                for (let index = 0; index < intervals.length; index++) {
                    let element = intervals[index];
                    let element_text = element.innerText.match(/^[0-2][0-9]:[0-5][0-9]/)[0];
                    let start_time_site = {
                        'hour': element_text.match(/^[0-2][0-9]/)[0],
                        'minute': element_text.match(/[0-5][0-9]$/)[0],
                    };
                    if (index == 0 && moment(start_time_client).format('HH:mm') < moment(start_time_site).format('HH:mm')) {
                        element.click();
                        break;
                    } else if (moment(start_time_client).format('HH:mm') < moment(start_time_site).format('HH:mm')) {
                        intervals[index - 1].click();
                        break;
                    } else if (moment(start_time_client).format('HH:mm') == moment(start_time_site).format('HH:mm')) {
                        element.click();
                        break;
                    }
                }
            }, 0);
        }

        function ClientName(client_name) {
            let input = document.querySelector('.unique-order-form__point-contact-person-1');
            input.value = client_name.split(/\s+/).map(word => word[0].toUpperCase() + word.substring(1)).join(' ');
        }

        function InternalOrderNumber(internal_order_number) {
            let input = document.querySelector('.unique-order-form__point-internal-order-1');
            input.value = internal_order_number;
        }

    };

})();