// ==UserScript==
// @name         crackedresourceHack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove page mask
// @author       jiangwy
// @match        *://crackedresource.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crackedresource.com
// @grant        none
// @run-at       document-body
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/473637/crackedresourceHack.user.js
// @updateURL https://update.greasyfork.org/scripts/473637/crackedresourceHack.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const TAGS = ['kbd', 'ins'];

    function main() {
        const observe = new MutationObserver(mutationsList => {
            TAGS.forEach(tag => removeTags(tag));

            const maskPreElement = document.querySelector('#elementor-webpack-runtime-js');
            let maskElement = null;
            if (maskPreElement) {
                maskElement = maskPreElement.nextElementSibling;

                maskElement && maskElement.remove();
            }
        });

        observe.observe(document.body, {
            childList: true
        });
    }

    function removeTags(tag) {
        const nodes = document.getElementsByTagName(tag);
        const elements = Array.from(nodes);
        elements.forEach(el => el.remove());
    }

    main();
})();