// ==UserScript==
// @name         GithubWhitespace
// @description  Remove whitespace in Github pull requests and compares
// @version      0.1
// @namespace    https://github.dev.xero.com
// @include      https://github.dev.xero.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/19366/GithubWhitespace.user.js
// @updateURL https://update.greasyfork.org/scripts/19366/GithubWhitespace.meta.js
// ==/UserScript==

$(document).ready(function() {
    var w = window.location;

    if (w.toString().indexOf('?w=') < 0 && (w.toString().indexOf('/pull/') >= 0 || w.toString().indexOf('compare') >= 0)) {
        window.location = w.protocol + '//' + w.hostname + w.pathname + '?w=0';
    }
});