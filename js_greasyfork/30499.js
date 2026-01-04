// ==UserScript==
// @name         Alexa Font Fix
// @namespace    tech.myip.jess.alexafix
// @version      0.1
// @description  Make the font on the Alexa app site more readable
// @author       J. Jones
// @match        http://alexa.amazon.com/*
// @match        http://pitangui.amazon.com/*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30499/Alexa%20Font%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/30499/Alexa%20Font%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var styleSheet = document.styleSheets[document.styleSheets.length - 1];
    styleSheet.insertRule('* { ' +
                          'font-family: Arial, sans-serif !important; ' +
                          'font-weight: bold; ' +
                          '}', styleSheet.cssRules.length);
    // Your code here...
})();