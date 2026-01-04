// ==UserScript==
// @name         SkebHelper
// @namespace    http://tampermonkey.net/
// @version      0.7.9
// @description  Get and sort the price(omakase/lowest) of works or creators on various pages of skeb. (Based on zappo's "Skeb Price Sorter")
// @author       A. A.
// @match        https://*.skeb.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skeb.jp
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474183/SkebHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/474183/SkebHelper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Setting Page
    function openSettings() {
        let container = document.createElement("div");
        container.style.position = "fixed";
        container.style.top = "50%";
        container.style.left = "50%";
        container.style.transform = "translate(-50%, -50%)";
        container.style.backgroundColor = "#fff";
        container.style.padding = "30px";
        container.style.border = "1px solid #ccc";
        container.style.zIndex = "9999";

        // var inputLabel = document.createElement("label");
        // inputLabel.textContent = "Skeb ID:";
        // container.appendChild(inputLabel);

        let input_ID = document.createElement("input");
        input_ID.type = "text";
        input_ID.placeholder = "Skeb ID";
        container.appendChild(input_ID);

        container.appendChild(document.createElement("br"));

        let checkbox_show_lowest = document.createElement("input");
        checkbox_show_lowest.type = "checkbox";
        checkbox_show_lowest.id = "checkbox_show_lowest";
        container.appendChild(checkbox_show_lowest);

        let label_show_lowest = document.createElement("label");
        label_show_lowest.htmlFor = "checkbox_show_lowest";
        label_show_lowest.textContent = "获取列表价格时获取最低价格";
        container.appendChild(label_show_lowest);

        container.appendChild(document.createElement("br"));

        let checkbox_auto_price = document.createElement("input");
        checkbox_auto_price.type = "checkbox";
        checkbox_auto_price.id = "checkbox_auto_price";
        container.appendChild(checkbox_auto_price);

        let label_auto_price = document.createElement("label");
        label_auto_price.htmlFor = "checkbox_auto_price";
        label_auto_price.textContent = "打开创作者主页时自动显示价格";
        container.appendChild(label_auto_price);


        let closeButton = document.createElement("span");
        closeButton.textContent = "×";
        closeButton.style.position = "absolute";
        closeButton.style.top = "5px";
        closeButton.style.right = "5px";
        closeButton.style.fontSize = "20px";
        closeButton.style.cursor = "pointer";
        closeButton.addEventListener("click", function () {
            document.body.removeChild(container);
        });
        container.appendChild(closeButton);

        checkbox_show_lowest.addEventListener("change", function () {
            localStorage.setItem("PriceSwitch", checkbox_show_lowest.checked);
        });

        checkbox_auto_price.addEventListener("change", function () {
            localStorage.setItem("AutoSwitch", checkbox_auto_price.checked);
        });

        input_ID.addEventListener("input", function () {
            localStorage.setItem("SkebID", input_ID.value);
        });

        let savedValue_lowest = localStorage.getItem("PriceSwitch");
        checkbox_show_lowest.checked = savedValue_lowest === "true";

        let savedValue_auto = localStorage.getItem("AutoSwitch");
        checkbox_auto_price.checked = savedValue_auto === "true";

        let savedInputValue = localStorage.getItem("SkebID");
        input_ID.value = savedInputValue || "";

        document.body.appendChild(container);
    }

    GM_registerMenuCommand('设置', openSettings);
    var price_switch = localStorage.getItem('PriceSwitch');
    var auto_switch = localStorage.getItem('AutoSwitch');
    var skeb_id = localStorage.getItem('SkebID');

    var token = localStorage.getItem('token');

    function has_price(element) {
        return element.querySelector('.sph-price');
    }

    async function get_price(user, element, callback) {
        if (has_price(element)) {
            return;
        }
        try {
            const response = await fetch('https://skeb.jp/api/users/' + user, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            const data = await response.json();
            const price = data.skills.filter(skill => skill.genre === 'art')[0].default_amount;
            if (price_switch == "true") {
                const uid = data.id;
                const pu = [price, uid];
                callback(pu);
            } else {
                callback(price);
            }
        } catch (error) {
            console.log('Fetch price error: ' + error);
        }
    }

    async function get_prices(pu, callback) {
        const uid = pu[1];
        const price = pu[0];
        try {
            const response = await fetch('https://skeb.jp/api/users/' + skeb_id + '/lookup?creator_id=' + uid, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            const data = await response.json();
            const lowest_price = data.calculated_minimum_amounts.art;
            const prices = [price, lowest_price];
            callback(prices);
        } catch (error) {
            console.log('Fetch lowest error: ' + error);
        }
    }

    function add_price_to_user_list(element, price, pagetype) {
        let price_element = document.createElement('div');
        price_element.textContent = price;
        price_element.classList.add('title', 'sph-price');
        price_element.style.color = 'red';
        price_element.style.fontWeight = 900;
        if (pagetype == 'w') {
            price_element.style['-webkit-text-stroke'] = '1.5px white';
            element.querySelector('.tags').append(price_element);
        } else {
            price_element.style['-webkit-text-stroke'] = '0.4px black';
            element.querySelector('.tag').parentElement.append(price_element);
        }
    }

    function handleElement(el, pagetype) {
        const user_name = el.href.substring(el.href.indexOf('@') + 1).split('/works')[0];
        if (price_switch == "true") {
            get_price(user_name, el, pu => get_prices(pu, prices => add_price_to_user_list(el, prices, pagetype)));
        } else {
            get_price(user_name, el, price => add_price_to_user_list(el, price, pagetype));
        }
    }

    function get_for_all(pagetype) {
        let slct;
        if (pagetype == 'w') {
            slct = "a[href^='/@'][href*='works']";
        } else {
            slct = "a[href^='/@'][aria-label]";
        }
        Array.from(document.querySelectorAll(slct))
            .filter(el => !has_price(el))
            .forEach(el => handleElement(el, pagetype));
    }

    function get_element_price_omakase(element) {
        if (price_switch == "true") {
            try {
                return parseInt(element.querySelector('.sph-price').textContent.split(',')[0]);
            } catch (error) {
                return Infinity;
            }
        } else {
            try {
                return parseInt(element.querySelector('.sph-price').textContent);
            } catch (error) {
                return Infinity;
            }
        }
    }

    function sort_users() {
        let element = document.querySelector('.columns.has-cards');
        if (!element) {
            return;
        }
        Array.from(element.children)
            .sort((a, b) => get_element_price_omakase(a) - get_element_price_omakase(b))
            .forEach((el, i) => (el.style.order = i));
    }

    function sort_userpage() {
        let elements = document.getElementsByClassName('columns has-cards');
        let element = elements[elements.length - 2];
        if (!element) {
            return;
        }
        Array.from(element.children)
            .sort((a, b) => get_element_price_omakase(a) - get_element_price_omakase(b))
            .forEach((el, i) => (el.style.order = i));
    }

    function get_element_price_lowest(element) {
        try {
            return parseInt(element.querySelector('.sph-price').textContent.split(',')[1]);
        } catch (error) {
            return Infinity;
        }
    }

    function sort_users_lowest_listpage() {
        let element = document.querySelector('.columns.has-cards');
        if (!element) {
            return;
        }
        Array.from(element.children)
            .sort((a, b) => get_element_price_lowest(a) - get_element_price_lowest(b))
            .forEach((el, i) => (el.style.order = i));
    }

    function sort_users_lowest_userpage() {
        let elements = document.getElementsByClassName('columns has-cards');
        let element = elements[elements.length - 2];
        if (!element) {
            return;
        }
        Array.from(element.children)
            .sort((a, b) => get_element_price_lowest(a) - get_element_price_lowest(b))
            .forEach((el, i) => (el.style.order = i));
    }

    function create_button(text, action) {
        let button = document.createElement('button');
        button.classList.add('button', 'is-primary', 'sph-button');
        button.style.marginLeft = '10px';
        // button.style.marginRight = '5px';
        button.textContent = text;
        button.onclick = action;
        return button;
    }

    function create_button_info_table(text, action, price_type) {
        let button = document.createElement('button');
        button.classList.add('button', 'is-primary', 'is-fullwidth', 'is-medium', 'is-m-b-7', 'sph-button');
        // button.textContent = text;
        button.onclick = () => action(price_type);

        let span = document.createElement('span');
        span.classList.add('is-size-6');

        let strong = document.createElement('strong');
        strong.textContent = text;

        span.append(strong);
        button.append(span);

        return button;
    }

    function add_sort_buttons_listpage() {
        let element = document.querySelector('.creatorSort');
        let pagetype;

        if (element) {
            pagetype = 'c';
        } else {
            element = document.querySelector('.worksGenre') || document.querySelector('.searchWorksFilter') || document.querySelector('.worksFilter');
            pagetype = 'w';
        }

        if (!element || element.parentElement.querySelector('.sph-button')) {
            return;
        }

        element.parentElement.append(create_button('Get Prices', () => get_for_all(pagetype)));
        element.parentElement.append(create_button('Sort Omakase', sort_users));
        if (price_switch == "true") {
            element.parentElement.append(create_button('Sort Lowest', sort_users_lowest_listpage));
        }
    }

    // Add price to infobox
    async function get_uid(user) {
        const response = await fetch('https://skeb.jp/api/users/' + user, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        const data = await response.json();
        return data.id;
    }

    async function get_lowest_price(uid) {
        const response = await fetch('https://skeb.jp/api/users/' + skeb_id + '/lookup?creator_id=' + uid, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        const data = await response.json();
        return data.calculated_minimum_amounts.art;
    }

    async function get_omakase_price(user) {
        const response = await fetch('https://skeb.jp/api/users/' + user, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        const data = await response.json();
        return data.skills.filter(skill => skill.genre === 'art')[0].default_amount;
    }

    function add_price_to_infobox(price, price_type) {
        let infobox = document.querySelector('small').parentElement.parentElement.parentElement.parentElement;
        let price_row = document.createElement('tr');
        price_row.classList.add('sph-price');
        let price_td1 = document.createElement('td');
        let price_small1 = document.createElement('small');
        if (price_type == 'lowest') {
            price_small1.textContent = '最低金額';
        } else {
            price_small1.textContent = 'おまかせ金額';
        }
        price_td1.append(price_small1);
        price_row.append(price_td1);
        let price_td2 = document.createElement('td');
        let price_small2 = document.createElement('small');
        price_small2.textContent = '￥' + parseFloat(price).toLocaleString();
        price_td2.append(price_small2);
        price_row.append(price_td2);
        infobox.querySelector('table tbody').prepend(price_row);
    }

    async function fetch_and_display_price(user, price_type) {
        let price;
        if (price_type == 'lowest') {
            let uid = await get_uid(user);
            price = await get_lowest_price(uid);
        } else {
            price = await get_omakase_price(user);
        }
        add_price_to_infobox(price, price_type);
    }

    function get_and_add_price_to_infobox(price_type) {
        let element = document.querySelector('small').parentElement.parentElement.parentElement.parentElement;
        if (!element || element.querySelector('.sph-price')) {
            return;
        }
        let creator_name = window.location.pathname.replace('/@', '');
        fetch_and_display_price(creator_name, price_type);
    }

    function test_keyword(text, keywords) {
        for (let i = 0; i < keywords.length; i++) {
            if (text.includes(keywords[i])) {
                return true;
            }
        }
        return false;
    }

    function get_title_element() {
        let title_keywords = ["作品", "送信したリクエスト", "ポートフォリオ", "例子", "发送的请求", "送出的案件請求", "Portfolio", "Works", "Sent requests", "포트폴리오", "작품", "전송한요청"];
        let ul = document.querySelector('ul');

        if (!ul) {
            return null;
        }

        if (test_keyword(ul.textContent, title_keywords)) {
            return ul;
        }
    }

    function add_sort_buttons_userpage() {
        // Add sort buttons to title
        let element = get_title_element();
        // let element = document.querySelector('a[data-v-4538188f]');s
        if (!element || element.querySelector('.sph-button')) {
            return;
        }
        element.append(create_button('Get Prices', () => get_for_all('w')));
        element.append(create_button('Sort Omakase', sort_userpage));
        if (price_switch == "true") {
            element.append(create_button('Sort Lowest', sort_users_lowest_userpage));
        }
    }

    function add_price_buttons_userpage() {
        // Add price to infobox
        let infobox = document.querySelector('small').parentElement.parentElement.parentElement.parentElement;
        let table_of_info = document.querySelector('table[class="table is-fullwidth is-narrow"]');
        if (table_of_info.parentElement.querySelector('.sph-button') || infobox.querySelector('.sph-price')) {
            return;
        }

        let request_button = document.querySelector('button[class="button is-primary is-fullwidth is-medium is-m-b-7"]');
        let infobox_keywords = ['作品', 'ジャンル', '型', 'Total', 'amount', '유형', '작품'];
        if (!test_keyword(infobox.textContent, infobox_keywords) && !request_button) {
            return;
        }

        let price_type = request_button ? 'lowest' : 'omakase';
        let price_button_label = request_button ? 'Get Lowest' : 'Get Omakase';
        if (auto_switch == "true") {
            get_and_add_price_to_infobox(price_type);
        } else {
            table_of_info.parentElement.prepend(create_button_info_table(price_button_label, get_and_add_price_to_infobox, price_type));
        }
    }

    function add_buttons() {
        add_sort_buttons_listpage();
        if (/skeb\.jp\/@[^\/]*\/?$/.test(window.location.href)) { // User page only
            add_sort_buttons_userpage();
            add_price_buttons_userpage();
        }
    }

    function add_observer() {
        let body = document.body;
        let observer = new MutationObserver(mutations => add_buttons());
        observer.observe(body, { childList: true, subtree: true });
    }

    add_observer();
})();