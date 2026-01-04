// ==UserScript==
// @name         nespresso_fast_order
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Converting XML to a ready-made nespresso order
// @author       CleverMan
// @include      *://dostavista.ru/order
// @icon         https://www.google.com/s2/favicons?domain=dostavista.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441688/nespresso_fast_order.user.js
// @updateURL https://update.greasyfork.org/scripts/441688/nespresso_fast_order.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {

        var sameday = document.querySelector('.unique-order-form__forms-switcher-tab-sameday');
        var asap = document.querySelector('.unique-order-form__forms-switcher-tab-asap');
        var standard = document.querySelector('.unique-order-form__forms-switcher-tab-standard');
        var switcher = document.querySelector('.unique-order-form__forms-switcher');

        var file;
        const reader = new FileReader();
        const parser = new DOMParser();

        var region = document.querySelector('.dv-region-select__region-black'); // Регион

        var start_menu = document.querySelector('.dv-desktop-menu');
        var account_section = start_menu.getElementsByTagName('div');
        var check_client = account_section[1].getElementsByClassName('Button_Content_2MgbS')[0].innerText;

        var div_file = document.createElement('div');
        div_file.className = 'dv-desktop-menu__item dv-desktop-menu__item--buttone';

        var input_file = document.createElement('input');
        input_file.type = 'file';
        input_file.accept = '.xml';

        if (check_client == '*Неспрессо') {
            start_menu.appendChild(div_file);
            account_section[2].appendChild(input_file);
            file = document.querySelector('input[type=file]');

            if (sameday) sameday.click();
            else if (asap) asap.click();
            else standard.click();

            getLocalData();
        }

        file.addEventListener('change', function() {
            if (this.value) {
                let xml_file = file.files[0];
                if (xml_file.type == 'text/xml') {
                    file.style.color = 'gray';
                    reader.readAsText(xml_file);
                    reader.onload = function() {
                        let xml_text = reader.result;
                        let xml_date = parser.parseFromString(xml_text, "text/xml");

                        XmlData(xml_date);
                    };
                    reader.onerror = function() {
                        console.error(reader.error);
                    };
                } else file.style.color = 'red';
            }
        });

        function XmlData(xml_date) {
            try {
                let order_data = {
                    "first_address": xml_date.getElementsByTagName("address")[0].childNodes[0].nodeValue.replace('RU,', ''),
                    "second_address": xml_date.getElementsByTagName("ADRESScustomer")[0].childNodes[0].nodeValue.replace('RU,', ''),
                    "client_phone": xml_date.getElementsByTagName("CONTACTcustomer")[0].childNodes[0].nodeValue.replace('+7', ''),
                    "client_name": xml_date.getElementsByTagName("client")[0].attributes.Name.value,
                    "internal_order_number": xml_date.getElementsByTagName("ORDER")[0].attributes.NUMBERORDER.value
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
            } catch (error) {
                alert(`Не удалось получить данные из файла.\nОшибка: ${error.message}\nВыберите другой файл.`);
            }
            
        }

        function Distributor(order_data) {
            setTimeout(() => {
                HintAdderss(order_data.first_address, order_data.second_address);
                FirstAdderss(order_data.first_address);
                SecondAdderss(order_data.second_address);
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

        function SecondAdderss(second_address) {
            let input = document.querySelector('.unique-order-form__point-address-1');

            input.addEventListener('keypress', () => {
                input.value = second_address;
            });
        }

        function ClientPhone(client_phone) {
            let input = document.querySelector('.unique-order-form__point-phone-1');
            input.addEventListener('keypress', () => {
                input.value = client_phone;
            });
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