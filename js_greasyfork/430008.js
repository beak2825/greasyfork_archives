// ==UserScript==
// @name         Amazon nurse practitioner
// @namespace    https://www.powerivq.com/
// @version      0.7
// @description  Paste Amazon tracking!
// @author       powerivq
// @match        https://www.amazon.com/*
// @icon         https://www.amazon.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430008/Amazon%20nurse%20practitioner.user.js
// @updateURL https://update.greasyfork.org/scripts/430008/Amazon%20nurse%20practitioner.meta.js
// ==/UserScript==

function addTrackingButtons() {
    const shippingContainer = document.querySelector('.pt-card.delivery-card');
    if (!shippingContainer) return;

    const trackingCt = document.querySelector('.carrierRelatedInfo-trackingId-text,.pt-delivery-card-trackingId')?.textContent;
    const parsedTracking = /^Tracking ID: ([0-9A-Z]+)$/.exec(trackingCt);
    if (!parsedTracking) return;
    const tracking = parsedTracking[1];

    const mapCard = document.querySelector('.pt-card.persistent-map-card div.map-attributes');
    if (!mapCard) return;
    const addressee = mapCard.getAttribute('data-name');

    const itemList = document.querySelectorAll('#promise-card-asin-image-carousel .a-link-normal');
    const quantityList = [...itemList].map(item => item.querySelector('.images-quantity-label')?.textContent.trim() ?? '1');
    const quantity = quantityList.length && quantityList.every(q => q == quantityList[0]) ? quantityList[0] : '';

    const trackingInfoForm = `${addressee},${tracking},${quantity}`;

    const formBtn = document.createElement('button');
    formBtn.innerText = 'Fill Form';
    formBtn.onclick = () => {
        window.open(`https://docs.google.com/forms/d/e/1FAIpQLSe6JLOv-tRvR0QehbX2rMz4vZBxTRnOoLefzMiQQiT1NNxw5Q/viewform?entry.198674846=${encodeURIComponent(quantity)}&entry.1174489780=${encodeURIComponent(trackingInfoForm)}`, '_blank');
    };

    const cpyBtn = document.createElement('button');
    cpyBtn.innerText = 'Copy Shipping';
    cpyBtn.onclick = () => {
        navigator.clipboard.writeText(trackingInfoForm)
            .then(() => {cpyBtn.innerText = 'Copied';}, () => {cpyBtn.innerText = 'Copy Failed';});
    };

    shippingContainer.appendChild(formBtn);
    shippingContainer.appendChild(cpyBtn);
}

function addSearchButtons() {
    document.querySelectorAll('.js-order-card .a-fixed-left-grid-col.a-col-right').forEach((item) => {
        const name = item.querySelector('a.a-link-normal')?.textContent?.trim();
        const keyWords = name.match(/[a-zA-Z0-9\-]+/g);
        const searchKey = keyWords.slice(0, 5).join('+');
        const span = document.createElement('span');
        span.classList.add('a-button');
        span.classList.add('a-spacing-mini');
        span.classList.add('a-button-base');

        const spanInner = document.createElement('span');
        spanInner.classList.add('a-button-inner');

        const searchA = document.createElement('a');
        searchA.href = `https://www.amazon.com/gp/your-account/order-history/ref=ppx_yo_dt_b_search?opt=ab&search=${searchKey}`;
        searchA.classList.add('a-button-text');
        searchA.innerText = 'Search This';
        span.insertBefore(spanInner, null);
        spanInner.insertBefore(searchA, null);
        (item.lastElementChild.querySelector('.a-row') ?? item.lastElementChild).insertBefore(span, null);
    });
}

function addOrderIdCopy() {
    document.querySelectorAll('.yohtmlc-order-id :nth-child(2)').forEach((item) => {
        const orderId = item.textContent.trim();
        const copyBtn = document.createElement('a');
        copyBtn.innerText = ' COPY';
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(orderId)
                .then(() => {copyBtn.innerText = ' Copied';}, () => {copyBtn.innerText = ' Copy Failed';});
        };
        item.insertBefore(copyBtn, null);
    });
}

function addTcbButton() {
    const tcb = document.createElement('a');
    tcb.href = 'https://www.topcashback.com/earncashback.aspx?mpurl=amazon&moid=86273';
    tcb.classList.add('nav-a');
    tcb.innerText = 'TCB';
    tcb.target = '_blank';
    document.querySelector('#nav-xshop')?.prepend(tcb);
}

(function() {
    'use strict';

    if (window.location.pathname.startsWith('/progress-tracker/package/')) {
        Promise.resolve().then(addTrackingButtons);
    }

    if (window.location.pathname.startsWith('/gp/css/order-history')
        || window.location.pathname.startsWith('/gp/your-account/order-history')
        || window.location.pathname.startsWith('/your-orders/orders')) {
        Promise.resolve().then(addSearchButtons);
        Promise.resolve().then(addOrderIdCopy);
    }

    Promise.resolve().then(addTcbButton);
})();