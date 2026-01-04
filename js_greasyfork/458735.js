// ==UserScript==
// @name         officialboypalak Link Skipper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Wait time skipper for officialboypalak
// @author       You
// @match        https://blog.officialboypalak.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=officialboypalak.in
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458735/officialboypalak%20Link%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/458735/officialboypalak%20Link%20Skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let html = $('html').html();
    let searchStr = 'https://blog.officialboypalak.in/?go=';
    let index = html.indexOf(searchStr);
    if (index >= 0) {
        html = html.substring(index);
        index = html.indexOf('")');
        if (index > 0) {
            html = html.substring(0, index);
            window.stop();
            window.location.href = html;
        }
    }
})();