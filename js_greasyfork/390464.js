// ==UserScript==
// @name         Interviewbit Academy Typeform remover
// @description  remove annoying typeform from interviewbit academy pages!
// @author       rishabhsingh971
// @namespace    https://github.com/rishabhsingh971
// @version      1.0.2
// @license      MIT
// @match        https://www.scaler.com/academy/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390464/Interviewbit%20Academy%20Typeform%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/390464/Interviewbit%20Academy%20Typeform%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = () => {
        window.$("#my-embedded-typeform-lesson-feedback").modal('hide');
    }

})();
