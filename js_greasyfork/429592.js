// ==UserScript==
// @name         Amazon Smile Redirect
// @namespace    https://schoenenborn.info/
// @version      1.0.1
// @description  A simple but universal tapermonkey script to redirect to Amazon Smile
// @author       Daniel Schönenborn
// @include      https://www.amazon.*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @license      CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/legalcode)
// @downloadURL https://update.greasyfork.org/scripts/429592/Amazon%20Smile%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/429592/Amazon%20Smile%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let url = window.location.href;
    window.location.href = "https://smile." + url.substr(12);
})();
