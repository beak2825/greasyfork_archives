// ==UserScript==
// @name         studi.fr input with full width
// @namespace    http://tampermonkey.net/
// @description  input with full width  ;-)
// @author       michael@cadot.info
// @match        https://app.studi.fr/*
// @version      0.1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418857/studifr%20input%20with%20full%20width.user.js
// @updateURL https://update.greasyfork.org/scripts/418857/studifr%20input%20with%20full%20width.meta.js
// ==/UserScript==


var checkExist = setInterval(function() {
    var $ = window.jQuery;
    if ($('.exoInput').length) {
        $('.exoInput').width('100%');
        clearInterval(checkExist);
    }
}, 100); // check every 100ms