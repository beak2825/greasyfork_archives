// ==UserScript==
// @name         twitter-block-premium
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  block twitter premium promotion
// @author       @amormaid
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arxiv.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489126/twitter-block-premium.user.js
// @updateURL https://update.greasyfork.org/scripts/489126/twitter-block-premium.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const body = document.querySelector("body");
    let time_stamp = 0
    body.addEventListener('touchstart', () => {
        console.log(time_stamp)
        if (new Date() - time_stamp < 1000 && window.location.href.includes('verified-get-verified')) {
            window.location.href = 'https://twitter.com'
        }
        time_stamp = new Date() - 0;
    })
    // window.addEventListener('popstate', () => console.log(1));
    // window.addEventListener('pushState', () => console.log(2));
    // window.addEventListener('replaceState', () => console.log(3));
    // navigation.addEventListener('navigate', () => {
    //     console.log('page changed');
    //     if (window.location.href.includes('verified-get-verified')) {
    //         const body = document.querySelector("body");

    //         const interval_id = setInterval(() => {
    //             const query_list = Array.from(document.getElementsByTagName('SPAN')).filter(i => i.innerHTML.includes('Maybe later'))
    //             console.log('get span ', query_list.length)
    //             if (query_list.length) {
    //                 query_list[0].click()
    //             }
    //         }, 5)
    //         setTimeout(() => clearInterval(interval_id), 5 * 1000)


    //         const observer = new MutationObserver(mutations => {
    //             const query_list = Array.from(document.getElementsByTagName('SPAN')).filter(i => i.innerHTML.includes('Maybe later'))
    //             console.log('get span ', query_list.length)
    //             if (query_list.length) {
    //                 query_list[0].click()
    //                 observer.disconnect()
    //             }
    //         });
    //         observer.observe(body, { childList: true, subtree: true });
    //     }
    // });

})();