// ==UserScript==
// @name         Quizlet embed redirector
// @namespace    https://quizlet.com
// @version      1.0
// @description  Quizlet redirect to embed
// @match        https://quizlet.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487855/Quizlet%20embed%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/487855/Quizlet%20embed%20redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var currentURL = window.location.href;
    var match = currentURL.match(/quizlet\.com\/(\d+)/i);

    if (match && currentURL.indexOf('/embed') === -1) {
        var number = match[1];
        var newURL = 'https://quizlet.com/' + number + '/learn/embed';

        document.location.href = newURL;
    }
})();