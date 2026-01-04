// ==UserScript==
// @name         Coingecko Search
// @namespace    https://ryansproule.com
// @version      0.2
// @description  No mouse search focus
// @author       Ryan Sproule
// @match        https://www.coingecko.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coingecko.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459342/Coingecko%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/459342/Coingecko%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.onkeydown = function(evt) {
        evt = evt || window.event;
        if ((evt.metaKey || evt.ctrlKey) && evt.keyCode == 75) {
            document.getElementsByClassName("tw-inline-flex tw-items-center tw-w-full 2lg:tw-w-36 tw-px-3 tw-py-2.5 tw-border tw-border-transparent tw-text-sm tw-rounded-md tw-text-gray-400 tw-bg-gray-100 hover:tw-text-gray-500 focus:tw-outline-none dark:tw-bg-white dark:tw-bg-opacity-12 dark:tw-text-white dark:tw-text-opacity-60 dark:hover:tw-text-opacity-87")[0].click()
        }
    };
})();