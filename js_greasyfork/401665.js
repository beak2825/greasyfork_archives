// ==UserScript==
// @name         VK and Telegram.org: Make the 'Go up' clickable area narrower
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  Makes the clickable area of the 'Go up' feature on the left side of pages on VK and Telegram.org narrower (fitting the width of the highlighted section) rather than covering the entire left half of the page. It can be very annoying when you accidentally click anywhere to the left of page content and are suddenly taken to the top of the page.
// @author       SUM1
// @match        https://vk.com/*
// @match        https://*.telegram.org/*
// @downloadURL https://update.greasyfork.org/scripts/401665/VK%20and%20Telegramorg%3A%20Make%20the%20%27Go%20up%27%20clickable%20area%20narrower.user.js
// @updateURL https://update.greasyfork.org/scripts/401665/VK%20and%20Telegramorg%3A%20Make%20the%20%27Go%20up%27%20clickable%20area%20narrower.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Declaring the narrowing functions for each website.
    function makeNarrowVK() { //                                                                                    Define the function to be run on VK.
        // On VK, for some reason the clickable area is divided vertically into two elements.
        if (document.getElementById('stl_left')) { //                                                               Check if the first clickable area element exists on the page (to avoid console errors). If it does,
            document.getElementById('stl_left').style.width = '114px'; //                                           make it the same width as the 'Go up' highlighted area (which is 114px).
        }
        if (document.getElementById('stl_side')) { //                                                               Check if the second clickable area element exists on the page (to avoid console errors). If it does,
            document.getElementById('stl_side').style.width = '114px'; //                                           make it the same width as the 'Go up' highlighted area (which is 114px);
            document.getElementById('stl_side').style.left = '0px'; //                                              bring it in line with the first, i.e., to the left edge of the page.
        }
    }
    function makeNarrowTelegram() { //                                                                              Define the function to be run on Telegram.org.
        if (document.querySelector('.back_to_top_wrap')) { //                                                       Check if the clickable area element exists on the page (to avoid console errors). If it does,
            document.querySelector('.back_to_top_wrap').style.width = '120px'; //                                   make it the same width as the 'Go up' highlighted area (which is 120px on this website).
        }
    }
    if (/^https?:\/\/(.+.)?vk.com(\/.*)?/.test(document.URL)) { //                                                  Check if we are on VK.com or any of its subdomains or subpages. If we are,
        const VKObserver = new MutationObserver(function() { //                                                     set up an observer to watch for changes in VK's HTML elements (and label it 'VKObserver'). This was needed because entering and exiting the console restored the default HTML attributes for some reason.
            makeNarrowVK(); //                                                                                      If the observer is triggered, run the function for VK again.
        });
        makeNarrowVK(); //                                                                                          Run the function for VK.
        if (document.getElementById('stl_left')) { //                                                               Check if the first clickable area element exists on the page (to avoid console errors). If it does,
            VKObserver.observe(document.getElementById('stl_left'), {attributeFilter: ['style']}); //               let the observer for VK be triggered by changes to the style (including width) of the first clickable area element.
        }
        if (document.getElementById('stl_side')) { //                                                               Check if the second clickable area element exists on the page (to avoid console errors). If it does,
            VKObserver.observe(document.getElementById('stl_side'), {attributeFilter: ['style']}); //               let the observer for VK be triggered by changes to the style (including width) of the second clickable area element.
        }
        return; //                                                                                                  Leave the function (if we were on VK).
    }
    if (/^https?:\/\/(.+.)?telegram.org(\/.*)?/.test(document.URL)) { //                                            Check if we are on Telegram.org or any of its subdomains or subpages. If we are,
        const TelegramObserver = new MutationObserver(function() { //                                               set up an observer to watch for changes in Telegram.org's HTML elements. This one didn't need to be labelled, due to single use, but it is for the sake of visual simplicity.
            makeNarrowTelegram(); //                                                                                If the observer is triggered, run the function for Telegram.org again.
        });
        makeNarrowTelegram(); //                                                                                    Run the function for Telegram.org.
        if (document.querySelector('.back_to_top_wrap')) { //                                                       Check if the clickable area element exists on the page (to avoid console errors). If it does,
            TelegramObserver.observe(document.querySelector('.back_to_top_wrap'), {attributeFilter: ['style']}); // let the observer for Telegram.org be triggered by changes to the style (including width) of the clickable area element.
        }
    }
})();
