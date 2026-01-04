// ==UserScript==
// @name         Fandom press ESC for search + tweaks
// @namespace    https://github.com/Alistair1231/my-userscripts/
// @version      0.2.5
// @description  when you press esc on a fandom wiki it will now open and select the search bar, also makes the page wider and disables highlight actions
// @author       Alistair1231
// @match        *://*.fandom.com/wiki/*
// @grant      GM.addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454358/Fandom%20press%20ESC%20for%20search%20%2B%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/454358/Fandom%20press%20ESC%20for%20search%20%2B%20tweaks.meta.js
// ==/UserScript==
// https://greasyfork.org/en/scripts/454358-fandom-press-esc-for-search-widescreen
// https://openuserjs.org/scripts/Alistair1231/Fandom_press_ESC_for_search_+_widescreen
// https://github.com/Alistair1231/my-userscripts/raw/master/fandom-press-esc-for-search.user.js

(function () {
    'use strict';

    GM.addStyle(`
    #highlight__main-container {
        display: none;
    }
    `);

    const qS = (x) => document.querySelector(x);
    // const qSA = (x) => document.querySelectorAll(x);

    function resizeContainer() {
        var resizableContainer = qS(".resizable-container");
        if (resizableContainer && resizableContainer.offsetLeft > 200) {
            resizableContainer.style.maxWidth = "80%";
        }else{
            resizableContainer.style.maxWidth = "100%";
        }
    }


    // observe for changes in the document body (this is for when a new page is clicked)
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            // check if the mutation is a node insertion
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    resizeContainer();
                }
            }
        });
    });

    // resize the container on window resize
    window.addEventListener('resize', function () {
        resizeContainer();
    });

    // resize the container if already present on the page
    resizeContainer();



    observer.observe(document.body, { childList: true, subtree: true });

    var active = false;


    window.addEventListener('keydown', function (e) {
        if (e.key === "Escape") {
            e.preventDefault();
            console.log(active);
            // close search if it is open
            if (active) {
                document.getElementById('firstHeading').click();
                active = false;
            }
            // open search
            else {
                const searchButton = document.querySelector("header.fandom-community-header a.wiki-tools__search[title='Search']");
                if (searchButton) {
                    searchButton.click();
                    active = true;
                }
            }
        }
    });




})();