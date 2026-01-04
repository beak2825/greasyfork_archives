// ==UserScript==
// @name         Anti_Robot_by_el9in
// @namespace    Anti_Robot_by_el9in
// @version      0.6
// @description  AutoClick "I'm not a robot"
// @author       el9in
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @match        https://lzt.market
// @match        https://lolz.market
// @match        https://lolz.market/*
// @match        https://lolz.guru
// @match        https://lolz.guru/*
// @match        https://lolz.live
// @match        https://lolz.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @license      el9in
// @downloadURL https://update.greasyfork.org/scripts/466263/Anti_Robot_by_el9in.user.js
// @updateURL https://update.greasyfork.org/scripts/466263/Anti_Robot_by_el9in.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const e = document.querySelector("button.btn");
    if (e) e.click();
    function check_error() {
        const errorElement = document.querySelector('.jsErrorText');
        const errorText = "Uncaught TypeError: Cannot read properties of undefined (reading 'split')";
        if (errorElement && errorElement.textContent.trim() === errorText) {
            location.reload();
        }
    }
    const observer = new MutationObserver((mutationsList, observer) => {
    	for (const mutation of mutationsList) {
    		if (mutation.type === 'childList') {
    			check_error();
    		}
    	}
    });
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
    check_error();
})();