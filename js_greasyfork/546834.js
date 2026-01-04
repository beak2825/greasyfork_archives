// ==UserScript==
// @name         PFsense Content Table Width Override
// @namespace    https://greasyfork.org/users/77886
// @version      1.0
// @license      GNU GPL-3
// @description  Changes the container width in bootstrap.min.css 100% so you can fully utilize your broswer window
// @author       muchtall
// @match        https://change.to.your.firewall.hostname.and.port:8443/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546834/PFsense%20Content%20Table%20Width%20Override.user.js
// @updateURL https://update.greasyfork.org/scripts/546834/PFsense%20Content%20Table%20Width%20Override.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Create a <style> element to inject custom CSS
    const style = document.createElement('style');
    style.textContent = `
        @media (min-width: 1200px) {
            .container {
                width: 100% !important;
            }
        }
    `;
    // Append the style element to the document head
    document.head.appendChild(style);
})();