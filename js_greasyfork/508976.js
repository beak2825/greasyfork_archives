// ==UserScript==
// @name         Fandango - Highlight best seats
// @namespace    https://www.kanna.in/
// @version      1.0
// @license      MIT
// @description  Highlight best seats of a theatre
// @author       You
// @match        https://tickets.fandango.com/mobileexpress/seatselection*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fandango.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508976/Fandango%20-%20Highlight%20best%20seats.user.js
// @updateURL https://update.greasyfork.org/scripts/508976/Fandango%20-%20Highlight%20best%20seats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations)
        {
            const element = document.querySelector('.seat-map__seat'); // replace with your element selector
            if (element) {
                var seats = document.getElementsByClassName("seat-map__seat");
                for (var i = 0; i < seats.length; i++) {
                    if (seats[i].style.left < "65" && seats[i].style.left > "35" && seats[i].style.top < "80" && seats[i].style.top > "55") {
                        seats[i].style.border = "2px solid yellow";
                        seats[i].style.borderRadius = "6px";
                    }
                }
                $(".showtime-info__theater").append(" - " + $(".seat-guide-modal__auditorium").text());
                observer.disconnect(); // Stop observing when the element is found
                break;
            }
        }
    });

    observer.observe(document.querySelector('div#SeatPicker'), { childList: true, subtree: true });
})();