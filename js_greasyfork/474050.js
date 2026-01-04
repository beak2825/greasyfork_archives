// ==UserScript==
// @name         Youtube share url si parameter remover.
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Script for removing si parameter from share url.
// @author       m-pasik
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @license      GPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474050/Youtube%20share%20url%20si%20parameter%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/474050/Youtube%20share%20url%20si%20parameter%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutationsList) => {
        const filtered =
            mutationsList
                .filter(x =>
                    x.addedNodes[0] &&
				    x.addedNodes[0].tagName == "YT-COPY-LINK-RENDERER")
			    .map(x =>
				    x.addedNodes[0]);

        if (filtered.length) {
            const url_field = filtered[0].querySelector("input#share-url");
            
            let last_value = "";
            const update_url = () => {
                if (url_field.value != last_value) {
                    const split = url_field.value.split(/[?&]/).filter(x => !x.includes('si='));
                    url_field.value = split.length > 1 ?
                        `${split[0]}?${split.slice(1).join('&')}` :
                        split[0];
                    last_value = url_field.value;
                }
                window.requestAnimationFrame(update_url);
            }
            window.requestAnimationFrame(update_url);
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

})();