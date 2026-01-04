// ==UserScript==
// @name         V3rmillion Anti Rainbow
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Originally called something that was more, vulgar lets say, V3rm Anti Rainbow reverts all V3rmillion logos to the original one (no rainbow logos).
// @author       Cy
// @match        https://v3rmillion.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v3rmillion.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467253/V3rmillion%20Anti%20Rainbow.user.js
// @updateURL https://update.greasyfork.org/scripts/467253/V3rmillion%20Anti%20Rainbow.meta.js
// ==/UserScript==

(function() {
    const original_favicon = document.createElement('link');

    original_favicon.setAttribute('type', 'image/x-icon');
    original_favicon.setAttribute('rel', 'icon');
    original_favicon.setAttribute('href', 'https://v3rmillion.net/favicon.ico');

    document.getElementsByTagName('head')[0].appendChild(original_favicon);
    document.getElementById('logo').children[0].children[0].src='https://v3rmillion.net/images/logo.png';
})();