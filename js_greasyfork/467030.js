// ==UserScript==
// @name         Change_Names_by_el9in
// @namespace    Change_Names_by_el9in
// @version      0.5
// @description  Change Names
// @author       el9in
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        unsafeWindow
// @license      el9in
// @downloadURL https://update.greasyfork.org/scripts/467030/Change_Names_by_el9in.user.js
// @updateURL https://update.greasyfork.org/scripts/467030/Change_Names_by_el9in.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function init() {
        const header = document.querySelector('h1[title="Акки с балансом, бонусами"]');
        if(header) {
            header.textContent = 'Аккаунты с балансом, бонусами';
            document.title = "Аккаунты с балансом, бонусами";
        }
    }
    const observer = new MutationObserver((mutationsList, observer) => {
    	for (const mutation of mutationsList) {
    		if (mutation.type === 'childList') {
    			init();
    		}
    	}
    });
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
    init();
    const linkElements = document.querySelectorAll('a[href="forums/806/"]');
    if (linkElements.length > 0) {
        linkElements.forEach(function(linkElement) {
            linkElement.textContent = 'Аккаунты с балансом, бонусами';
        });
    }
})();