// ==UserScript==
// @name         GitHub apply dark theme on private repo
// @namespace    https://github.com/benok/
// @description  Apply dark theme to your private repository pages on Github
// @include      https://github.com/*
// @version      2022.01.31.0
// @homepage     https://gist.github.com/benok/301f7a9667a598202f10111af054ae77
// @author       benok
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439413/GitHub%20apply%20dark%20theme%20on%20private%20repo.user.js
// @updateURL https://update.greasyfork.org/scripts/439413/GitHub%20apply%20dark%20theme%20on%20private%20repo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.querySelector('span.Label.Label--secondary').textContent == "Private") {
        document.querySelector('html').setAttribute('data-color-mode', 'dark');
    }
})();