// ==UserScript==
// @name         simplified_control_of_delays
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Order with lateness optimization
// @author       CleverMan
// @match        *://dispatcher.dostavista.ru/dispatcher/order-with-lateness*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dostavista.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442244/simplified_control_of_delays.user.js
// @updateURL https://update.greasyfork.org/scripts/442244/simplified_control_of_delays.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        var audio = new Audio('https://zvukogram.com/mp3/cats/906/new_message_tone.mp3');
        var list = document.querySelectorAll('.main-list > tbody > tr');

        var form_input = document.querySelector('.filter');
        var muted_sound_notification = 'muted_sound_notification';

        var regions = ['Москва', 'Московская обл'];
        var switcher_regions = null;

        if (localStorage.getItem('switcher_regions') !== null) {
            switcher_regions = localStorage.getItem('switcher_regions');
        }

        let bg_btn_green = 'rgb(204, 255, 204)';
        let bg_btn_yellow = 'rgb(255, 255, 204)';

        var orders;
        var key_orders;

        var active_pages = document.querySelector('.pager > .navigation > .pages > .active > a');

        if (active_pages) key_orders = `${active_pages.innerHTML}_orders`;
        else if (!active_pages) key_orders = `1_orders`;

        preparing();
        main();

        function preparing() {
            SoudndNotification();
            selectRegions();
            for (let element = 1; element < list.length; element++) {
                let order_number = list[element].querySelectorAll('td')[0].innerText;

                if (element == 1) setSpecialButton(list[element], order_number);
                else setSpecialButton(list[element], order_number, list[element - 1]);

                validateRegion(list[element], order_number);
            }
        }

        function main() {
            setTimeout(() => {
                let processing = document.querySelectorAll('.processing');

                changeButton();

                for (let button of processing) {
                    button.addEventListener('click', (e) => {
                        if (button.style.backgroundColor == bg_btn_green) {
                            button.innerHTML = 'Ожидание';
                            button.style.backgroundColor = bg_btn_yellow;
                            removeStorage(button.id);
                        } else {
                            button.style.backgroundColor = bg_btn_green;
                            button.innerHTML = 'Обработано';
                            setStorage(button);
                        }

                    });
                }
            }, 0);
        }

        function setStorage(button) {
            try {
                orders = JSON.parse(localStorage.getItem(key_orders));
                orders.push(button.id)
                localStorage.setItem(key_orders, JSON.stringify(orders));
            } catch {
                orders = [button.id];
                localStorage.setItem(key_orders, JSON.stringify(orders));
            }
        }

        function removeStorage(order) {
            orders = JSON.parse(localStorage.getItem(key_orders));
            orders = orders.filter((data) => { return data !== order })
            localStorage.setItem(key_orders, JSON.stringify(orders));
        }

        function changeButton() {
            try {
                orders = JSON.parse(localStorage.getItem(key_orders));
                for (let order of orders) {
                    let btn = document.getElementById(`${order}`);
                    if (btn) {
                        btn.style.backgroundColor = bg_btn_green;
                        btn.innerHTML = 'Обработано';
                    } else {
                        removeStorage(order);
                    }
                }
            } catch {
                return;
            }

        }

        function validateRegion(address, order_number) {
            let validation;
            if (switcher_regions == 'other_regions') validation = true;
            else if (switcher_regions == 'main_regions' || switcher_regions === null) validation = false;
            let address_text = address.querySelectorAll('td')[3].innerText;
            for (let number = 0; number < regions.length; number++) {
                let region = regions[number]
                if (switcher_regions == 'other_regions'){
                    if (address_text.includes(region)) validation = validation ? false : false;
                    else if (!address_text.includes(region)) validation = validation ? true : false;
                }
                else if (switcher_regions == 'main_regions' || switcher_regions === null){
                    if (address_text.includes(region)) validation = validation ? true : true;
                    else if (!address_text.includes(region)) validation = validation ? true : false;
                }
                else if (switcher_regions == 'all_regions') validation = true;

                if (number == regions.length - 1) setNotificationAndFiltr(address, validation, order_number);
            }
        }

        function setSpecialButton(address, order_number, past_address = null) {
            let btn_processing_style = `
            display: inline-block;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 2px;
            margin-bottom: 2px;
            width: 100%;
            height: 29px;`;
            let btn_processing = document.createElement('button');
            btn_processing.innerHTML = 'Ожидание';
            btn_processing.style.cssText = btn_processing_style;
            btn_processing.id = order_number;
            btn_processing.style.backgroundColor = bg_btn_yellow;
            btn_processing.className = 'processing'

            let first_color = "rgb(255, 255, 255)";
            let second_color = "rgb(230, 230, 230)";

            setTimeout(() => {
                let verify_order_number = document.getElementById(`${order_number}`);
                if (!verify_order_number) {
                    address.append(btn_processing);

                    if (past_address == null) address.style.background = first_color;
                    else if (past_address !== null) {
                        let past_address_color = past_address.style.backgroundColor;
                        if (past_address_color == first_color) address.style.backgroundColor = second_color;
                        else if (past_address_color == second_color) address.style.backgroundColor = first_color;
                    }

                } else if (verify_order_number) {
                    address.style.backgroundColor = past_address.style.backgroundColor;
                }
            }, 0);

        }

        function SoudndNotification() {
            let sound_notification = document.createElement('button');
            sound_notification.type = 'button';
            sound_notification.style.cssText = `
            padding: 2px 10px;
            margin-right: 10px;
            font-family: inherit;
            font-weight: inherit;
            font-size: 100%;`;
            form_input.append(sound_notification);

            if (localStorage.getItem(muted_sound_notification) === null) {
                audio.muted = true;
                sound_notification.id = 'notification_on';
                sound_notification.innerHTML = 'Вкл. звук';
            } else {
                audio.muted = Boolean(JSON.parse(localStorage.getItem(muted_sound_notification)));
                if (audio.muted == true) {
                    sound_notification.id = 'notification_on';
                    sound_notification.innerHTML = 'Вкл. звук';
                } else if (audio.muted == false) {
                    sound_notification.id = 'notification_off';
                    sound_notification.innerHTML = 'Выкл. звук';
                }
            }
            
            sound_notification.addEventListener('click', () => {
                if (sound_notification.id == 'notification_off') {
                    sound_notification.id = 'notification_on';
                    sound_notification.innerHTML = 'Вкл. звук';
                    audio.muted = true;
                    localStorage.setItem(muted_sound_notification, JSON.stringify(true));
                } else if (sound_notification.id == 'notification_on') {
                    sound_notification.id = 'notification_off';
                    sound_notification.innerHTML = 'Выкл. звук';
                    audio.muted = false;
                    localStorage.setItem(muted_sound_notification, JSON.stringify(false));
                }
            })
        }

        function selectRegions(){
            let select_regions = document.createElement('select');
            select_regions.id = 'regions';

            let main_regions = document.createElement('option');
            main_regions.text = 'Москва и Московская область';
            main_regions.value = 'main_regions';

            let other_regions = document.createElement('option');
            other_regions.text = 'СПб и регионы';
            other_regions.value = 'other_regions';

            let all_regions = document.createElement('option');
            all_regions.text = 'Все';
            all_regions.value = 'all_regions';

            form_input.append(select_regions);
            select_regions.append(main_regions, other_regions, all_regions);

            if (switcher_regions !== null) document.querySelector(`option[value='${switcher_regions}']`).setAttribute("selected", "selected");

            select_regions.addEventListener('change', () => {
                switcher_regions = select_regions.value;
                localStorage.setItem('switcher_regions', switcher_regions);
                window.location.reload();
            })
        }


        function setNotificationAndFiltr(address, validation, order_number) {
            if (validation) {
                try {
                    orders = JSON.parse(localStorage.getItem(key_orders));
                    let existence = orders.includes(order_number);

                    if (!existence) audio.play();

                } catch {
                    audio.play();
                }
            } else if (!validation) {
                address.style.color = 'rgb(159, 159, 159)';
            }
        }

        this.setTimeout(() => {
            this.location.reload();
        }, 60000);
    }

})();