// ==UserScript==
// @name         Revert "Charts" Update
// @namespace    http://tampermonkey.net/
// @version      3.141592653589793238462643383279502884197169399375105820974944592307816406286
// @description  Killing Charts on Roblox
// @match        https://www.roblox.com/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500486/Revert%20%22Charts%22%20Update.user.js
// @updateURL https://update.greasyfork.org/scripts/500486/Revert%20%22Charts%22%20Update.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function transform() {

        if (document.title.includes('Charts - Roblox')) {
            document.title = document.title.replace('Charts - Roblox', 'Discover - Roblox');
        }
// 0.4!! js a lil extra! manipulates the browser history 😈😈 ooo and takes all your cookies cause big scary words "manipulate"!!!
                if (window.location.pathname.startsWith('/charts')) {
            const newUrl = window.location.href.replace('/charts', '/discover');
            window.history.replaceState(null, '', newUrl);
        }
// transform is just, yk, the transforming part

        function updatedoc() {
            const navMenuItem = document.querySelector('a.nav-menu-title[href="/charts"]');
            if (navMenuItem) {
                navMenuItem.textContent = 'Discover';
            }
            // update doc is js updating the DOM (document object model)

            const h1Element = document.querySelector('h1');
            if (h1Element && h1Element.textContent === 'Charts') {
                h1Element.textContent = 'Discover';
            }
        }


        updatedoc();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', updatedoc);
        }
    }
// bam!
    transform();

console.log(":steamhappy:")
    //observer shit for faster script load! (totally not ripped from stackoverflow because i searched how to make a script run before a webpage!)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                transform();
            }
        });
    });

    function onpageload() {
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['title'] });
        } else {
            setTimeout(onpageload, 10);
        }
    }
    onpageload();
    // makes the code load as soon as the page runs so there isnt any split second "Charts" around, uses observer shit to get the document asap basically idk how else to explain it
})();