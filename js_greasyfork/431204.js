// ==UserScript==
// @name         Monitor Zelda Low Price
// @description  Tool to help monitor zelda low price
// @icon         https://freepngimg.com/download/the_legend_of_zelda/21441-2-zelda-link-file.png
// @version      0.2.0
// @author       foomango
// @match        https://www.nintendo.com/games/detail/the-legend-of-zelda-breath-of-the-wild-switch*
// @grant        none
// @namespace    https://greasyfork.org/users/705411-foomango2
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/431204/Monitor%20Zelda%20Low%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/431204/Monitor%20Zelda%20Low%20Price.meta.js
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

    const matchPrice = () => {
        setTimeout(() => {
            const price = parseFloat($('.h2.msrp').text().replace(/[^1-9.]/g, ''))
            if (price <= 50) {
                setInterval(() => notifyMe(`Zelda Low Price: ${price}`), 3000)
                playSound()
            } else {
                location.reload()
            }
        }, 10000)

    }

    matchPrice()


})();