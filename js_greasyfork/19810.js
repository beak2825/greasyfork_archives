// ==UserScript==
// @name         EH to ExH
// @namespace    http://fabulous.cupcake.jp.net
// @version      1
// @description  Redirects to ExH if EH gallery is unavailable
// @author       FabulousCupcake
// @match        http://g.e-hentai.org/g/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19810/EH%20to%20ExH.user.js
// @updateURL https://update.greasyfork.org/scripts/19810/EH%20to%20ExH.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Detect gallery not available message
    try {
        var el = document.querySelector('body > .d > p:first-child').textContent;
        if (el !== 'This gallery has been removed, and is unavailable.') {
            throw('`body > .d > p:first-child` exists but is not Gallery Removed notification message.');
        }
    } catch(e) {
        console.log(e);
        return;
    }
    
    // Redirect to exh
    var curURL = location.href.toString();
    var exhURL = curURL.replace('//g.e-', '//ex');
    location.href = exhURL;
    
})();