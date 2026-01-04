// ==UserScript==
// @name         Fritzing without Donation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Download Fritzing without donation.
// @author       DickyT
// @match        https://fritzing.org/download/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392220/Fritzing%20without%20Donation.user.js
// @updateURL https://update.greasyfork.org/scripts/392220/Fritzing%20without%20Donation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const data = {
        "payer_email": "thankyou@fritzing.org",
        "payer_id": "UNKNOWN",
        "payer_status": "UNKNOWN",
        "first_name": "DID NOT",
        "last_name": "DONATE USER",
        "txn_id": "UNKNOWN",
        "mc_currency": "USD",
        "mc_gross": "0",
        "protection_eligibility": "UNKNOWN",
        "payment_gross": "0",
        "payment_status": "UNKNOWN",
        "pending_reason": "multi_currency",
        "payment_type": "instant",
        "handling_amount": "0",
        "shipping": "0",
        "item_name": "Download Fritzing",
        "quantity": "1",
        "txn_type": "web_accept",
        "payment_date": "2019-11-10T7:12:12Z",
        "business": "download@fritzing.org",
        "receiver_id": "UNKNOWN",
        "notify_version": "UNKNOWN",
        "verify_sign": "UNKNOWN",
    };

    const form = document.createElement('form');
    form.style.display = 'none';

    Object.keys(data).forEach((k) => {
        const input = document.createElement('input');
        input.name = k;
        input.value = data[k];
        form.append(input);
    });

    form.action = "https://fritzing.org/download/?d7547=1";
    form.method = "POST";

    document.body.append(form);

    document.querySelector('#donateForm').append(document.createElement('br'));

    const downloadBtn = document.createElement('button');
    downloadBtn.type = 'button';
    downloadBtn.textContent = 'Download without donation';
    downloadBtn.addEventListener('click', () => {
        form.submit();
    });

    document.querySelector('#donateForm').append(downloadBtn);
})();