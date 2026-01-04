// ==UserScript==
// @name         Amazon Fresh Time Slot Poller
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Wanna get some food during the Corona Time?
// @author       Y2Nk4
// @match        https://www.amazon.com/gp/buy/*
// @grant        none
// @require      https://unpkg.com/jquery@3.3.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/400806/Amazon%20Fresh%20Time%20Slot%20Poller.user.js
// @updateURL https://update.greasyfork.org/scripts/400806/Amazon%20Fresh%20Time%20Slot%20Poller.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || jQuery;

    var cart_icon = 'data:image/png;base64,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';

    $(document).ready(() => {
        setTimeout(() => {
            if(Notification.permission !== 'granted') {
                Notification.requestPermission((result) => {
                    if(result !== 'granted'){
                        console.log('Please allow Chrome notification')
                    }
                })
            }
            // Check if the page needs to continue, due to an item become out-stock or other reason.
            // If need, there is no need to do anything else beside to click that button
            // After clicking the button, the page will be automaticlly refreshed

            if(window.location.href.indexOf('spc/handlers') !== -1){
                // In Checkout Page
                if($('[name="placeYourOrder1"]').length > 0){
                    new Notification('Good News!', {
                        dir: 'ltr',
                        body: '\n Time Slot is ALAILABLE!!! \n Go Check it Out!!!',
                        icon: cart_icon
                    });
                }
            }
            if(window.location.href.indexOf('shipoptionselect') !== -1){
                // In Reserve Time Slot Page
                if($('input[name=continue-bottom]').length > 0){
                    $('input[name=continue-bottom]').click();
                }else{
                    $('.ss-carousel-items > li').each((i, el) => {
                        // Only Detect the first 5 Date
                        if (i <= 5) {
                            setTimeout(() => {
                                $(el).find('.a-button-text').click();
                                $('.Date-slot-container').each((i, el) => {
                                    if($(el).attr('style').indexOf('block') !== -1){
                                        $(el).find('.a-box.spanOutsideSlotButton').each((i, el) => {
                                            new Notification('Good News!', {
                                                dir: 'ltr',
                                                body: '\n Time Slot is ALAILABLE!!! \n Go Check it Out!!!',
                                                icon: cart_icon
                                            });
                                        })
                                        if(!!$(el).find('span.a-size-base-plus').text() && !!$(el).find('span.a-size-base-plus').text().replace(/(^\s*)|(\s*$)/g, "") && $(el).find('span.a-size-base-plus').text().indexOf('No attended delivery') !== -1){
                                            console.log('No time slot yet')
                                        }else{
                                            if(Notification.permission !== 'granted') {
                                                new Notification('Good News!', {
                                                    dir: 'ltr',
                                                    body: '\n Time Slot is ALAILABLE!!! \n Go Check it Out!!!',
                                                    icon: cart_icon
                                                });
                                            }
                                        }
                                    }
                                });
                            }, i * 500)
                        }
                    })
            }
            }
            // refresh every 55 sec
            setTimeout(() => {
                history.go(0);
            }, 55 * 1000);
        }, 3000);
    })
    // Your code here...
})();