// ==UserScript==
// @name         LZTCDN Mirror
// @namespace    LZTCDN Mirror
// @version      0.2
// @description  LZTCDN Mirror 02.10.23
// @author       Toil
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://lzt.market/*
// @match        https://lolz.market/*
// @match        https://zelenka.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476560/LZTCDN%20Mirror.user.js
// @updateURL https://update.greasyfork.org/scripts/476560/LZTCDN%20Mirror.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function init() {
        const images = document.getElementsByTagName('img');
        for (var i = 0; i < images.length; i++) {
            const img = images[i];
            const src = img.getAttribute('src');
            if (src && src.includes('lztcdn.com')) {
                const newSrc = src.replace('lztcdn.com', 'nztcdn.com');
                img.setAttribute('src', newSrc);
            }
        }
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