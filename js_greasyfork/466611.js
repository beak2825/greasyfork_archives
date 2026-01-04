// ==UserScript==
// @name         Delete_Ignored_by_el9in
// @namespace    Delete_Ignored_by_el9in
// @version      0.3
// @description  Delete Ignored Observed
// @author       el9in
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @match        https://lolz.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @license      el9in
// @downloadURL https://update.greasyfork.org/scripts/466611/Delete_Ignored_by_el9in.user.js
// @updateURL https://update.greasyfork.org/scripts/466611/Delete_Ignored_by_el9in.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function init() {
        const elements = document.querySelectorAll('i.fas.fa-user-times.messageIngoredIcon');
    	elements.forEach(element => {
    		const listItem = element.closest('li');
    		if (listItem) listItem.remove();
    	});
    }
    const observer = new MutationObserver((mutationsList, observer) => {
    	for (const mutation of mutationsList) {
    		if (mutation.type === 'childList') {
    			setTimeout(function() {
    				init();
    			},1000);
    		}
    	}
    });
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
    init();
})();