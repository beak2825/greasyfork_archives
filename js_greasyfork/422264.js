// ==UserScript==
// @name         anserver only sever
// @namespace    http://anset.net/
// @version      1.1
// @description  this quora default original answers only
// @author       ClaoDD
// @match        https://www.quora.com/*
// @exclude      https://www.quora.com/q/*
// @exclude      https://www.quora.com/*/answer/*
// @exclude      https://www.quora.com/profile/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422264/anserver%20only%20sever.user.js
// @updateURL https://update.greasyfork.org/scripts/422264/anserver%20only%20sever.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
[...document.getElementsByClassName("bOdGzB")].map( e => e.click() );[...document.getElementsByClassName("q-flex qu-px--medium qu-py--small qu-cursor--pointer qu-bg--raised qu-alignItems--center qu-justifyContent--space-between qu-hover--bg--darken puppeteer_test_popover_item")].map( e => e.click() );
})();