// ==UserScript==
// @name         LZT_DocsApiAuthAutocomplateOn
// @namespace    MeloniuM/LZT
// @version      0.1
// @description  docs.api.zelenka.guru auth form autocomplete on
// @author       MeloniuM
// @license      MIT
// @match        http*://docs.api.zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472557/LZT_DocsApiAuthAutocomplateOn.user.js
// @updateURL https://update.greasyfork.org/scripts/472557/LZT_DocsApiAuthAutocomplateOn.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function update(){
        let input = document.querySelector('.auth-wrapper .auth-container form .wrapper input');
        if (input){
            if (!input.hasAttribute('autocomplete')){
                input.setAttribute('autocomplete', 'on');
                input.setAttribute('id', 'autocomplete')//идентификатор
            }
        }
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
})();