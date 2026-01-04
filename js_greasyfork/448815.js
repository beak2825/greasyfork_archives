// ==UserScript==
// @name         Imagestwist Bypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto click "Continue to image..." button.
// @author       You
// @match        http://imagestwist.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448815/Imagestwist%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/448815/Imagestwist%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("[type=submit]").click();
})();