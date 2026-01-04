// ==UserScript==
// @name         load_url_at_time
// @namespace    https://uhr.ptb.de/
// @version      2025-04-30
// @description  load url at specific time
// @author       Robin Bertram
// @license      GPLv3
// @match        https://uhr.ptb.de/*
// @icon         https://uhr.ptb.de/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534563/load_url_at_time.user.js
// @updateURL https://update.greasyfork.org/scripts/534563/load_url_at_time.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var time = "23:23:23"
    var url  = "https://www.ccc.de/de/hackerethik"

    // code copied from https://stackoverflow.com/a/61866345

    // identify an element to observe
    var elementToObserve = window.document.getElementById('ptbTime');

    // create a new instance of 'MutationObserver' named 'observer',
    // passing it a callback function
    var observer = new MutationObserver(function(mutationsList, observer) {
        if ( document.getElementById('ptbTime').innerHTML == time ) {
            window.location.href=url;
        }
        console.log(document.getElementById('ptbTime').innerHTML);
    });

    // call 'observe' on that MutationObserver instance,
    // passing it the element to observe, and the options object
    observer.observe(elementToObserve, {characterData: false, childList: true, attributes: false});
})();