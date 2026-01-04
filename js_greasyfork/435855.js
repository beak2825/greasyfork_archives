// ==UserScript==
// @name         IPM_AUTO
// @version      0.4
// @description  Script for ipm.vn
// @run-at       document-start
// @author       duongoku
// @namespace    http://duongoku.github.io/
// @include      /https://ipm.vn/
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/435855/IPM_AUTO.user.js
// @updateURL https://update.greasyfork.org/scripts/435855/IPM_AUTO.meta.js
// ==/UserScript==

function get_cart() {
    let req = new XMLHttpRequest();
    req.open('GET', 'https://ipm.vn/cart.js', false);
    req.send();
    return JSON.parse(req.responseText);
}

function add_book(book_id) {
    let req = new XMLHttpRequest();
    let formdata = `quantity=1&id=${book_id}`;

    req.open('POST', 'https://ipm.vn/cart/add.js');
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    req.addEventListener('load', () => {
        let cart_id = get_cart().token;
        window.location = `https://ipm.vn/checkouts/${cart_id}?step=1`;
    });
    req.send(formdata);
}

function get_book(need) {
    let books = Array.from(document.getElementsByClassName('pro-name'));
    need = need.normalize();

    for (let i = 0; i < books.length; i++) {
        let name = books[i].firstChild.title.toLowerCase().normalize();
        if (name.includes(need)) {
            console.log(`Found ${books[i].firstChild.title}!`);
            let elem = books[i].parentElement.parentElement;
            elem.getElementsByClassName('btn-buynow')[0].click();
        }
    }
}

function finish_order() {
    while (true) {
        document.getElementsByClassName('step-footer-continue-btn')[0].click();
        console.log('Clicked!');
    }
}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

function add_observer() {
    let observer = new MutationObserver((mutations, obs) => {
        let elem = document.getElementById('cart-modal');
        if (elem.attributes['aria-hidden'].value == 'false') {
            let btn = document.getElementById('checkout');
            btn.click();
            console.log('Clicked!');
            obs.disconnect();
            return;
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });
}

async function wait_loading() {
    while ($('.order-checkout__loading--box').attr('class').includes('show')) {
        await new Promise(r => setTimeout(r, 500));
    }
}


async function change_address(province_id, district_id, ward_id) {
    funcFormOnSubmit('#form_update_location_customer_shipping');
    await wait_loading();
    customer_shipping_province.selectedIndex = province_id;
    funcFormOnSubmit('#form_update_location_customer_shipping');
    
    await wait_loading();
    customer_shipping_district.selectedIndex = district_id;
    funcFormOnSubmit('#form_update_location_customer_shipping');

    await wait_loading();
    customer_shipping_ward.selectedIndex = ward_id;
    funcFormOnSubmit('#form_update_location_customer_shipping');

    await wait_loading();
    await continue_checkout();
}

async function continue_checkout() {
    while (true) {
        let btn = document.getElementsByClassName('step-footer-continue-btn')[0];
        if (btn) {
            btn.click();
            console.log('Clicked!');
        }
        await new Promise(r => setTimeout(r, 500));
        console.log('Waiting . . .');
    }
}

async function start() {
    add_observer();
    let need = findGetParameter('need');
    if (need) {
        get_book(need);
    }
    // This is the prefilled address
    await change_address(2, 19, 1);
}

window.onload = start