// ==UserScript==
// @name         Physics and Maths Tutor PDF Redirect
// @namespace    http://www.physicsandmathstutor.com/
// @version      2024-01-04
// @description  Redirects you to the actual PDF page, so you dont need to listen to the crappy adverts.
// @author       Calum H.
// @license      MIT
// @match        https://www.physicsandmathstutor.com/pdf-pages/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=physicsandmathstutor.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483898/Physics%20and%20Maths%20Tutor%20PDF%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/483898/Physics%20and%20Maths%20Tutor%20PDF%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        const iframeElement = document.querySelector('#pdf-content > iframe');

        if (iframeElement) {
            const pdfUrl = iframeElement.src;
            console.log('PDF URL:', pdfUrl);
            window.location.href = pdfUrl;
        } else {
            console.log('The iframe element was not found.');
        }
    }, false);
})();