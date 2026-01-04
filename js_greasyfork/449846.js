// ==UserScript==
// @name         MINUSY gry-online.pl
// @namespace    Hejterzy i frustraci
// @version      0.12
// @description  Minusy dla wszystkich
// @author       Losiu
// @match        *://*.gry-online.pl/newsroom/*/*
// @match        *://*.gry-online.pl/komiksy/*/*
// @match        *://*.gry-online.pl/hardware/*/*
// @match        *://*.gry-online.pl/S018.asp*
// @match        *://*.gry-online.pl/S020.asp*
// @license MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABRCAYAAACqj0o2AAAACXBIWXMAAAsSAAALEgHS3X78AAAESklEQVR42u2cy28bVRTGv7me8bxQCaGt0gWpK4RUi6DGoguC0kgICVp23QIbFqyRWPIHdAtsg9Rdwi5ZoXRXCQtViLqGTT1iQVKLNoZYjWni8fU8WUCiRkmpPdfk3nHOtxx7LM9vzjn3nHMf2szMTIqnZGsJXjdDvGZEOFuI4bIDH59IdRMNf8YF/BrouB8Y6KXswOfa0xDfsvp42+rDInDPFE80/NAz8WPf3L+mA8BUIcIHLseUHhOl58hiKd51Od4wA3zXtbEZ62AAUDFDAjikzuoJZs0QAMBeYjEumQFRyaBLZoBJFoPNmgGYRkCyiGn/gGQlg9xYRCUjBptkCZEQ0CRLwExKZ4RkshSMMIwgNhICgkgQCSKJII5S+rg+2AtzV+HMvQd94sxA3096PrhXQ2d1kSxxT6eufTQwQABgtgOncgVW+TJBFJUxNU0Qcx8Ti6UyzNLFY38I7t1D2HqQb4ia5eLlDz9DsVSW8hDu3FX88eXnSHk3vynOqXeuSwO4Nygwy8l3nmicOy89LsWdLUq2T3zFEm1vEURR7dxeRdhqEkQRmaWL0Cyb8sSsevHax3Dn3id3zl4inT/xAIUhMtsBiVIc+RCDzSYS7hNEkZtT3sWTtSWCKPoDvUYNfr16oiEKpThOZQET1z8lS8x6Y2HiDAEUhehUrhA9UYgy+3djA5FSmxFAPOkj8kggxp0tZXJE2W04oTxx984tPP72a+kQU8mhRQiiZrmwZ+fHyjWzvBAhiKc/+QJ2+U3pD37U9EQWF0+4j16jdnwVi1NZgHFuWgnrCTa8Q9faN2+gOOT/i7bbmWYNM0MsTJxWxgXDzQdHuGUX/fWG2jHRvFBWAmDCfalLSIQgHvX2ZYhniGHKQOReTQmIvZ+r+YXYX29Ir1qiTvvY4t7/MrAAQGd1Edy7B7syj4LlZsgznUyLKveT/durSniD8Lwzb9wFb9zNfH/Wxm7UacOvf5/v2nlUcirzubZC6RDNC+VM6xp7Xk0ZK5QO0Z4dvjsetprorHyjVL0tDaJmuUNPMSTcR2dlUdqyYuUguhnmaJ6sLUmvTpSCOKwr+/WqUnFQOkTNcofqAPn1aqbtYmMNcZjmRdhq4i/Fl6pIgTholRK2mmjfvKHcQKIExEHmrPMCUJ4lDrDvRcVURimI8XPgBBuekqmMUhCjzfHariHHEjttgigqFRqpY2CJW2O1A0ta2df7j6mFOCejsnSI3XoV0TNiY7juEcRBlPIutpe/OgQy2PCwe+dWriBqywuvSD/7b6/DHWw0cjnoKHG4UH+9kesRm/UTOlBWyAASDexxQtv7RLSbamC/RwUiIaBmqIPd7xtEQkC/BAbYw1hHnReJRgbVeRGPon+PzV/zbTwMya2H0aOwgDXfPphsL++48AJy7UHkBQaWdtzDeWIIDSu7Dqb1CJetAK8aEQyNzuDe55Nq+C3U8RMvohkdTK//BmAQjFzYYXciAAAAAElFTkSuQmCC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449846/MINUSY%20gry-onlinepl.user.js
// @updateURL https://update.greasyfork.org/scripts/449846/MINUSY%20gry-onlinepl.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let minusyGOL = {
        init: function(){
            console.info('Init MINUSY GOL');
            let el_minus = document.querySelector('.dbLapDown');
            let el_akm = document.querySelector('#ajax-komentarze-mobile');
            if(el_akm == null){
                console.info('Nope');
                return;
            }
            let topicID = el_akm.getAttribute('data-waypoint-a');

            if(el_minus!=null && topicID!=null){
                fetch(this.consts.forumUrl + topicID)
                    .then(response => {
                    if (!response.ok) {
                        console.info('MINUSY nie bangla');
                    }
                    return response.text();
                })
                    .then(text => {
                    const parser = new DOMParser();
                    const htmlDocument = parser.parseFromString(text, "text/html");
                    const bt = htmlDocument.documentElement.querySelector(".sfo-but-down");
                    if(bt!=null){
                        el_minus.textContent = bt.textContent;
                        console.info('MINUSY teleportowane :-)');
                    }else{
                        console.info('Za szybko chcesz hejtować xD');
                    }

                }).catch((error) => {
                    console.error('MINUSY nie bangla najgorzej', error);
                });
            }
        },
        consts:{
            forumUrl: 'https://www.gry-online.pl/S043.asp?ID='
        }
    };
    minusyGOL.init();
})();
