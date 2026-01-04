// ==UserScript==
// @name         Streamcheck bypass
// @version      0.2
// @description  Automatically bypass Streamcheck links
// @match        https://streamcheck.link/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @namespace d30f2n
// @downloadURL https://update.greasyfork.org/scripts/482981/Streamcheck%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/482981/Streamcheck%20bypass.meta.js
// ==/UserScript==

$(document).ready(function() {
    redirect.disabled = false;
    document.querySelector('#redirect').click();
});