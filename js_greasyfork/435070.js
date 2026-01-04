// ==UserScript==
// @name         FAHASA
// @version      1.3.2
// @description  For FAHASA coupons
// @author       duongoku
// @match        https://www.fahasa.com/ma-giam-gia*
// @namespace https://greasyfork.org/users/832690
// @downloadURL https://update.greasyfork.org/scripts/435070/FAHASA.user.js
// @updateURL https://update.greasyfork.org/scripts/435070/FAHASA.meta.js
// ==/UserScript==

function apply_coupon(coupon) {
    let url = "https://www.fahasa.com/onestepcheckout/index/couponCode";

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);

    let data = `{"sessionId":"${SESSION_ID}","couponCode":"${coupon}","apply":"1"}`

    xhr.send(data);

    let message = `Message: ${JSON.parse(xhr.responseText).message}`;
    let noti = document.createElement('p');
    let text = document.createTextNode(message);
    noti.appendChild(text);
    document.getElementsByClassName('fhs-header_desktop')[0].appendChild(noti);
    console.log(message);
}

function create_checkout_button() {
    let btn = document.createElement('button');
    btn.innerHTML = 'CHECKOUT';
    btn.onclick = checkout;
    document.getElementsByClassName('fhs-header_desktop')[0].appendChild(btn);
}

function checkout() {
    create_checkout_button();
    window.open('https://www.fahasa.com/onestepcheckout/index#fhs_checkout_coupon', '_blank');
}

async function fetch_coupons(ids) {
    let url = '/node_api/fhsrule/event_couponsshow';
    let coupons = [];
    let count = 0;

    ids.forEach((id) => {
        $jq.ajax({
            url: url,
            data: { 'id': id, 'limit': 99 },
            method: 'POST',
            success: function (data) {
                if (data.result) {
                    for (let i = 0; i < data.periods.length; i++) {
                        if (data.periods[i].coupon_code) {
                            if (!data.periods[i].coupon_code.includes('?')) {
                                coupons.push(data.periods[i].coupon_code);
                            }
                        }
                    }
                }
                count += 1;
            }
        });
    });

    while (count < ids.length) {
        await new Promise(r => setTimeout(r, 50));
    }

    return coupons;
}

async function wait4coupons() {
    // Yes, these are hard-coded coupons ids
    let ids = [676, 677, 659, 673, 674, 657];
    let coupons = await fetch_coupons(ids);

    while (coupons.length < 1) {
        await new Promise(r => setTimeout(r, 500));
        coupons = await fetch_coupons(ids);
    }

    coupons.forEach((coupon) => {
        apply_coupon(coupon);
    });

    checkout();
}

window.onload = wait4coupons;