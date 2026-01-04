// ==UserScript==
// @name         Imgur Mirror By El9in
// @namespace    Imgur Mirror By El9in
// @include http://*/*
// @include https://*/*
// @version      0.1
// @description  Imgur Mirror
// @author       You
// @match        *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @license      el9in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466740/Imgur%20Mirror%20By%20El9in.user.js
// @updateURL https://update.greasyfork.org/scripts/466740/Imgur%20Mirror%20By%20El9in.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function init() {
        const images = document.getElementsByTagName('img');
        for (var i = 0; i < images.length; i++) {
            const img = images[i];
            const src = img.getAttribute('src');
            if (src && src.includes('i.imgur.com')) {
                const newSrc = src.replace('i.imgur.com', 'i.imgurp.com');
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