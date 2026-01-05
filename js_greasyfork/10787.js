// ==UserScript==
// @name         reddit legacy search feature
// @namespace    http://andytuba.com/
// @version      0.5
// @description  Add the ?feature=legacy_search flag to reddit searches
// @author       andytuba
// @match        *://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10787/reddit%20legacy%20search%20feature.user.js
// @updateURL https://update.greasyfork.org/scripts/10787/reddit%20legacy%20search%20feature.meta.js
// ==/UserScript==

var form = document.querySelector('form#search');
var option = document.createElement('input');
option.type = 'hidden';
option.name = 'feature';
option.value = 'legacy_search';

form.appendChild(option);


var searchRegex = /^https?:\/\/(?:[\-\w\.]+\.)?reddit\.com\/(?:[\-\w\.\/]*\/)?search/i;
if (searchRegex.test(document.location) && document.location.search && document.location.search.indexOf('feature=legacy_search') === -1) {
    document.location = document.location.protocol + '//' + document.location.hostname + '/' + document.location.pathname + (document.location.search ? document.location.search + '&' : '?') + 'feature=legacy_search';
}