// ==UserScript==
// @name         Remove notification dot from slack
// @namespace    http://tampermonkey.net/
// @version      2024-09-16
// @description  Remove notification dot from slack favicon
// @author       You
// @match        https://app.slack.com/client/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slack.com
// @grant        none
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/508740/Remove%20notification%20dot%20from%20slack.user.js
// @updateURL https://update.greasyfork.org/scripts/508740/Remove%20notification%20dot%20from%20slack.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(() => {
    const link = document.querySelector("link[rel~='icon']");
    link.href = "data:image/png;base64,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";
    
}, 500);

})();