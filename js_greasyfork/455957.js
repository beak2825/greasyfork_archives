// ==UserScript==
// @name         Readymag remove page confirmation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show confirmation before removing the page on Readymag
// @author       all-bear
// @match        https://my.readymag.com/edit/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455957/Readymag%20remove%20page%20confirmation.user.js
// @updateURL https://update.greasyfork.org/scripts/455957/Readymag%20remove%20page%20confirmation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const $ = window.$; // Readymag have global jQuery so we could use it
    const DELETE_PAGE_BUTTON_SELECTOR = "[data-testid=\"delete-page\"]";

    $("body").on("mousedown", DELETE_PAGE_BUTTON_SELECTOR, function (ev) {
        const isConfirmed = window.confirm("Are you sure?");

        ev.target.dispatchEvent(new MouseEvent("mouseup", { view: window, cancelable: true, bubbles: true }));

        ev.preventDefault();
        ev.stopPropagation();

        if (isConfirmed) {
            $(ev.target).closest(DELETE_PAGE_BUTTON_SELECTOR).click();
        }
    });
})();