// ==UserScript==
// @name         Image_In_Chat_by_el9in
// @namespace    Image_In_Chat_by_el9in
// @version      0.4
// @description  Image In Chat
// @author       el9in
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @match        https://lolz.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @license      el9in
// @downloadURL https://update.greasyfork.org/scripts/466747/Image_In_Chat_by_el9in.user.js
// @updateURL https://update.greasyfork.org/scripts/466747/Image_In_Chat_by_el9in.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const fileExtensionsRegex = /\.(jpg|webm|webp|jpeg|png|gif)$/i;
    function init() {
        const elements = document.getElementsByClassName("chat2-message-text-inner");
        for (var i = 0; i < elements.length; i++) {
            const element = elements[i];
            const linkElement = element.querySelector("a.externalLink");
            if (linkElement) {
                const href = linkElement.href;
                if (fileExtensionsRegex.test(href)) {
                    const imgElement = document.createElement("img");
                    imgElement.src = href;
                    imgElement.className = "bbCodeImage LbImage";
                    imgElement.alt = "[IMG]";
                    imgElement.dataset.url = href;
                    element.removeChild(linkElement);
                    element.appendChild(imgElement);
                }
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
    setTimeout(function() {
        init();
    },1000);
})();