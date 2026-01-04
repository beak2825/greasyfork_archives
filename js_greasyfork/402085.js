// ==UserScript==
// @name         Amazon Delivery Window Monitor
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically refresh until it finds the delivery windows available
// @author       Ning
// @match        https://www.amazon.com/alm/storefront?almBrandId=VUZHIFdob2xlIEZvb2Rz*
// @match        https://www.amazon.com/alm/storefront?almBrandId=QW1hem9uIEZyZXNo*
// @grant        none
// @require      https://unpkg.com/jquery@3.3.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/402085/Amazon%20Delivery%20Window%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/402085/Amazon%20Delivery%20Window%20Monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = jQuery;
    var notice;
    var refreshInterval = 5000;
    $(document).ready(function() {
        setTimeout(checkDelivery, refreshInterval);
    });

    function checkDelivery() {
        if(Notification.permission !== 'granted') {
            Notification.requestPermission((result) => {
                if(result !== 'granted'){
                    console.log('Please allow Chrome notification');
                    return;
                }
            })
        }
        const noTime = document.getElementsByClassName('a-size-medium naw-widget-banner-action-no-availability a-text-bold')[0];
        if (!noTime) {
            if(Notification.permission == 'granted') {
                notice = new Notification('Yay!', {
                    dir: 'ltr',
                    body: '\n Delivery available now!'
                });
            }
        } else {
            console.log('No delivery window available');
            window.location.reload();
        }
    }
})();

