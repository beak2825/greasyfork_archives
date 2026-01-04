// ==UserScript==
// @name         Remove Google Click-tracking (johanb)
// @description  Removes Google's click-tracking from result links
// @version      2.2.1
// @license      Public Domain
// @include      *://*.google.tld/*
// @include     *://*.google.com/*
// @include     *://*.google.co.za/*
// @grant        none
// @namespace https://greasyfork.org/users/126569
// @downloadURL https://update.greasyfork.org/scripts/407723/Remove%20Google%20Click-tracking%20%28johanb%29.user.js
// @updateURL https://update.greasyfork.org/scripts/407723/Remove%20Google%20Click-tracking%20%28johanb%29.meta.js
// ==/UserScript==

Object.defineProperty(unsafeWindow, 'rwt', {
    value: function() {},
    writable: false
});

/* Plain HTML, non-JavaScript version of Google search (new) */
if (document.querySelector('.cleanslate')) {
    let results = document.querySelectorAll('a[href^="/url"]');
    for (let i = 0; i < results.length; i++) {
      	let url = new URL(results[i].href);
        results[i].href = url.searchParams.get('q');
    }
}

/* Plain HTML, non-JavaScript version of Google search (old) */
else if (document.querySelector('#desktop-search')) {
    let results = document.querySelectorAll('.r a');
    for (let i = 0; i < results.length; i++) {
      	let url = new URL(results[i].href);
        results[i].href = url.searchParams.get('q');
    }
}