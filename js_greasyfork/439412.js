// ==UserScript==
// @name         GitHub Gist apply dark theme on secret Gists
// @namespace    https://github.com/benok/
// @description  Apply dark theme to your secret Gists on GitHub Gist
// @include      https://gist.github.com/*
// @version      2022.01.31.0
// @homepage     https://gist.github.com/benok/69b98fc38aa5884234fe50326ef014ae
// @author       benok
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439412/GitHub%20Gist%20apply%20dark%20theme%20on%20secret%20Gists.user.js
// @updateURL https://update.greasyfork.org/scripts/439412/GitHub%20Gist%20apply%20dark%20theme%20on%20secret%20Gists.meta.js
// ==/UserScript==

(function() {
    'use strict';
     if ( (document.querySelector('span.Label.v-align-middle')||
           document.querySelector('span.Label.Label--secondary')/* Editing page */).textContent.includes('Secret')) {
         document.querySelector('html').setAttribute('data-color-mode', 'dark');
    }
})();