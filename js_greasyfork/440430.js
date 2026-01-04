// ==UserScript==
// @name         biblehub.com change red letter text to black
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Makes the words of Christ appear in black color text rather than red.
// @author       Joshua Witt kynrek@gmail.com
// @match        https://biblehub.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=biblehub.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440430/biblehubcom%20change%20red%20letter%20text%20to%20black.user.js
// @updateURL https://update.greasyfork.org/scripts/440430/biblehubcom%20change%20red%20letter%20text%20to%20black.meta.js
// ==/UserScript==
/* globals $$, waitForKeyElements */
(function() {
    'use strict';
    //find all paragraphs that have red in the classname and change the text color to black.
    document.querySelectorAll('p,span').forEach(function(paragraph){paragraph.className.includes('red') ? paragraph.style.color='black' : Function.prototype(); } );
})();