// ==UserScript==
// @name     Show only belgium deals
// @namespace tomv.io.dagaanbieding-net-belgium-deals-only
// @match  https://www.dagaanbieding.net/*
// @run-at   document-end
// @icon https://www.dagaanbieding.net/img/favicon.ico
// @grant       none
// @version     1.0
// @author      Tom Vervoort
// @description show only belgium deals on dagaanbieding.net
// @downloadURL https://update.greasyfork.org/scripts/422774/Show%20only%20belgium%20deals.user.js
// @updateURL https://update.greasyfork.org/scripts/422774/Show%20only%20belgium%20deals.meta.js
// ==/UserScript==


var node = document.createElement('style');
node.textContent = 'div.deal-container:not(.filter-belgium) { display: none; }';
var target = (document.getElementsByTagName ('head')[0] || document.body || document.documentElement);
target.appendChild(node);