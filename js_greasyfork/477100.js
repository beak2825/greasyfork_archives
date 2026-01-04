// ==UserScript==
// @name         Smaller Amazon EMI Text
// @name:hi      छोटा अमेज़न ई.एम.आई. नंबर
// @namespace    https://github.com/xanthisafk/smaller-amazon-india-emi-text-userscript
// @version      1.0
// @description  Makes the EMI amount smaller so that you see the real price first.
// @description:hi  एमआई नंबर को छोटा बना दे ताकि आप असली कीमत पहले देखें
// @author       Abhinav Shrivastava
// @match        https://www.amazon.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.in
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477100/Smaller%20Amazon%20EMI%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/477100/Smaller%20Amazon%20EMI%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove all classes from an element
    function removeAllClasses(element) {
        if (element && element.classList) {
            element.classList = [];
        }
    }

    // Find all elements with class "inemi-amount" and remove their classes
    const elements = document.querySelectorAll('.inemi-amount');
    elements.forEach(element => {
        removeAllClasses(element);
    });
})();
