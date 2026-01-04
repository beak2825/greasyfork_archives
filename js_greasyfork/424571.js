// ==UserScript==
// @name         Track aliexpress parcel
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  Opens parcelsapp with the tracking code of your order
// @author       Nikolai Tsvetkov
// @match        https://trade.aliexpress.com/order_detail.htm*
// @match        https://*.aliexpress.com/store/*
// @match        https://*.aliexpress.com/p/order/index.html*
// @match        https://*.aliexpress.com/p/order/detail.html*
// @match        https://*.aliexpress.com/p/tracking/index.html*
// @match        https://track.aliexpress.com/logisticsdetail.htm*
// @icon         https://www.google.com/s2/favicons?domain=aliexpress.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/424571/Track%20aliexpress%20parcel.user.js
// @updateURL https://update.greasyfork.org/scripts/424571/Track%20aliexpress%20parcel.meta.js
// ==/UserScript==

let popoverTimer = 0;
let divToObserve = '.comet-popover-wrap';

let observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        track();
        observer.unobserve(entry.target); // Stop observing this element
    });
}, {
    threshold: 0.1 // Adjust if needed. 0.1 means 10% of the element is visible
});

let existingDivs = document.querySelectorAll(divToObserve);
existingDivs.forEach(div => {
    observer.observe(div);
});

const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.matches(divToObserve)) {
                    observer.observe(node);
                }
                if (node.querySelector(divToObserve)) {
                    node.querySelectorAll(divToObserve).forEach(div => {
                        observer.observe(div);
                    });
                }
            }
        });
    });
});

mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
});

function insertTrackingLink (trackingDiv) {
    clearInterval(popoverTimer);
    if (trackingDiv && !trackingDiv.innerText.includes('🔗')) {
        let trackingCode = trackingDiv.innerText;
        var linkParcelapp = "https://parcelsapp.com/tracking/" + trackingCode;
        var link17Track = "https://t.17track.net/en#nums=" + trackingCode;
        var linkOrdertracker = "https://www.ordertracker.com/track/" + trackingCode;
        trackingDiv.innerHTML = "<span>" + trackingCode +
            " <a href='" + linkParcelapp + "' target='_blank' readonly> Track 1 🔗</a>" +
            " <a href='" + link17Track + "' target='_blank'> Track 2 🔗</a>" +
            " <a href='" + linkOrdertracker + "' target='_blank'> Track 3 🔗</a>" +
            "</span>";
    }
}

function trackNewStyle () {
    let trackingDivs = document.querySelectorAll('.order-track-popover-title p:nth-of-type(2) span');
    trackingDivs.forEach(trackingDiv => {
        insertTrackingLink(trackingDiv);
    });
}

function track () {
    let trackingDivSelectors = [
        '.tracking-no span',
        'div.tracking-wrap div:nth-of-type(2) span'
    ];

    let trackingDiv = document.querySelector('.tracking-wrap:nth-of-type(3) span:nth-of-type(2)');
    trackingDiv && insertTrackingLink(trackingDiv);

    let trackButtons = document.querySelectorAll("a.comet-btn.comet-btn-block.order-item-btn");
    trackButtons.forEach(trackButton => {
        trackButton.addEventListener('mouseenter', () => {
            popoverTimer = setInterval(trackNewStyle, 0.5e3);
        })
    });
}

function changeTarget() {
    var links = document.querySelectorAll('a[ae_button_type="productList_click"]');
    for (var i = 0; i < links.length; i++) {
        var $el = links[i];
//        $el.href = $el.dataset.href;
        $el.setAttribute('target', '_blank');
    }
    links = document.querySelectorAll('a[ae_object_type="product"]');
    var a;
    for (i = 0; i < links.length; i++) {
        $el = links[i];
//        $el.href = $el.dataset.href;
        $el.setAttribute('target', '_blank');
    }
    var div;
    links = document.querySelectorAll('div[ae_object_type="product"]');
    for (i = 0; i < links.length; i++) {
        $el = links[i];
        div = document.createElement('a');
//        div.href = $el.dataset.href;
        div.innerHTML = 'new tab link';
        div.setAttribute('target', '_blank');
        $el.parentNode.insertBefore( div, $el.nextSibling );
    }
}

(function() {
    'use strict';
    setTimeout(track, 5e3);
    setTimeout(changeTarget, 5e3);
})();