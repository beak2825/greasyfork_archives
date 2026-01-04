// ==UserScript==
// @namespace    vimcaw
// @name         Github disable turbolinks
// @version      1.0.0
// @description  Speed up github access!
// @author       vimcaw
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460001/Github%20disable%20turbolinks.user.js
// @updateURL https://update.greasyfork.org/scripts/460001/Github%20disable%20turbolinks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function disable() { document.body.dataset.turbo = 'false' };
    setTimeout(() => { disable() }, 5 * 1e3);
    disable();
})();