// ==UserScript==
// @name         Costco Robot
// @description  Costco 刷单
// @icon         https://www.costco.com/wcsstore/CostcoGLOBALSAS/images/favicon.ico
// @version      0.1.0
// @author       foomango
// @match        https://www.costco.com/estee-lauder-advanced-night-repair-eye-supercharged-complex%2c-0.5-fl-oz.product.100473338.html
// @match        https://www.costco.com/.product.1299897.html
// @match        https://www.costco.com/.product.1471594.html
// @grant        none
// @namespace    https://greasyfork.org/users/705411-foomango2
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/418298/Costco%20Robot.user.js
// @updateURL https://update.greasyfork.org/scripts/418298/Costco%20Robot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function notifyMe(message) {
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }

        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var notification = new Notification(message);
        }

        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    var notification = new Notification(message);
                }
            });
        }
    }

    function playSound() {
        open('https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3')
    }

    const addToCartBtn = $('#add-to-cart-btn')
    const name = $('.product-h1-container-v2 h1').text()
    if (!addToCartBtn.attr('disabled')) {
        //addToCartBtn.click()
        setInterval(() => notifyMe(`In Stock: ${name}`), 3000);
        playSound()

    } else {
        const timeoutID = setTimeout(() => {
            clearTimeout(timeoutID)
            location.reload()
        }, 8000);
    }

})();