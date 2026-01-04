// ==UserScript==
// @name         Remove sidebar in Sci-Hub
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically redirects Sci-Hub pages to direct PDF links
// @author       Bui Quoc Dung
// @match        https://sci-hub.*/*
// @match        https://www.tesble.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525168/Remove%20sidebar%20in%20Sci-Hub.user.js
// @updateURL https://update.greasyfork.org/scripts/525168/Remove%20sidebar%20in%20Sci-Hub.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const checkPDF = setInterval(() => {
        const pdf = document.querySelector('embed[type="application/pdf"]');
        if (pdf) {
            clearInterval(checkPDF);
            window.location.href = pdf.src;
        }
    }, 500);

    setTimeout(() => clearInterval(checkPDF), 5000);
})();
