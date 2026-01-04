// ==UserScript==
// @name         Skeb Price Sorter
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  Adds a option to sort skeb users by price.
// @author       Zappo
// @match        https://*.skeb.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skeb.jp
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_listValues
// @grant        GM.listValues
// @grant        GM_deleteValue
// @grant        GM.deleteValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460083/Skeb%20Price%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/460083/Skeb%20Price%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var token = localStorage.getItem('token');

    function has_price(element) {
        return element.querySelector('.sph-price');
    }

    function get_price_uncached(user, callback) {
        GM.xmlHttpRequest({
            url: 'https://skeb.jp/api/users/' + user,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            onload: function(response) {
                try {
                    var data = JSON.parse(response.responseText);
                    var price = data.skills.filter(skill => skill.genre === 'art')[0].default_amount;
                    response.context(price);
                    GM.setValue(user, price).then(() => console.log("saving price for " + user), () => console.log("failed to save price for " + user));
                } catch (error) {
                    console.log('Fetch price error: ' + error);
                    console.log(response.responseText);
                }
            },
            context: callback
        });
    }

    function get_price(user, element, callback) {
        if (has_price(element)) {
            return;
        }
        GM.getValue(user).then(value => {
          if (value !== null && value !== undefined) {
              console.log("using cached price " + value + " for " + user);
              callback(value);
          } else {
              get_price_uncached(user, callback);
          }
        }, () => {
            get_price_uncached(user, callback);
        });
    }

    function add_price_to_user_list(element, price) {
        var price_element = document.createElement('div');
        price_element.textContent = price;
        price_element.classList.add('title', 'is-7', 'sph-price');
        price_element.style.color = 'red';
        element.querySelector('.title').parentElement.querySelector('.image').append(price_element);
    }

    function add_price_to_profile_table(element, price) {
        var price_row = document.createElement('tr');
        price_row.classList.add('sph-price');
        var price_td1 = document.createElement('td');
        price_td1.textContent = 'Artwork (past price)';
        price_row.append(price_td1);
        var price_td2 = document.createElement('td');
        price_td2.textContent = price;
        price_row.append(price_td2);
        element.querySelector('table tbody').prepend(price_row);
    }

    function get_for_all() {
        Array.from(document.querySelectorAll("a[href^='/@'][aria-label]"))
            .filter(el => !has_price(el))
            .forEach(el => get_price(el.href.substring(el.href.indexOf('@') + 1), el, price => add_price_to_user_list(el, price)));
    }

    function get_current_user_price(table) {
        var user_name = window.location.pathname.replace('/@', '');
        get_price(user_name, table, price => add_price_to_profile_table(table, price));
    }

    function get_element_price(element) {
        try {
            return parseInt(element.querySelector('.sph-price').textContent);
        } catch (error) {
            return Infinity;
        }
    }

    function sort_users() {
        var element = document.querySelector('.columns.has-cards');
        if (!element) {
            return;
        }
        Array.from(element.children)
            .sort((a, b) => get_element_price(a) - get_element_price(b))
            .forEach((el, i) => (el.style.order = i));
    }

    function create_button(text, action) {
        var button = document.createElement('button');
        button.classList.add('button', 'is-primary', 'is-fullwidth', 'sph-buttom');
        button.textContent = text;
        button.onclick = action;
        return button;
    }

    function clear_cache() {
        GM.listValues().then(keys => {
            console.log(keys);
            keys.forEach(key => GM.deleteValue(key));
        });
    }

    function add_sort_buttons() {
        var element = document.querySelector('.creatorSort');
        if (!element || element.parentElement.querySelector('.sph-buttom')) {
            return;
        }
        element.parentElement.append(create_button('Get prices', get_for_all));
        element.parentElement.append(create_button('Sort users', sort_users));
        element.parentElement.append(create_button('Clear cache', clear_cache));
    }

    function add_past_price_button() {
        if (!window.location.pathname.startsWith('/@')) {
            return;
        }
        var button = Array.from(document.querySelectorAll('.button'))
            .filter(el => el.textContent === 'Notify on seeking started' || el.textContent === 'Notification reserved')
            .filter(el => !el.parentElement.querySelector('.sph-buttom'));
        if (!button.length) {
            return;
        }
        button = button[0];
        button.parentElement.append(create_button('Get past price', () => get_current_user_price(button.parentElement.parentElement.parentElement)));
    }

    function add_button() {
        add_sort_buttons();
        add_past_price_button();
    }

    function add_observer() {
        var body = document.body;
        var observer = new MutationObserver(mutations => add_button());
        observer.observe(body, {childList: true, subtree: true});
    }

    add_observer();
})();
