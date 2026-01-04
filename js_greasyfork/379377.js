// ==UserScript==
// @name        nnm-club.me
// @include     *://nnm-club.me/*
// @version     1.0
// @description Redirect from nnm-club.me to nnmclub.to
// @grant       none
// @namespace   nnm-club.me
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/379377/nnm-clubme.user.js
// @updateURL https://update.greasyfork.org/scripts/379377/nnm-clubme.meta.js
// ==/UserScript==

window.location.replace('https://nnmclub.to' + window.location.pathname + window.location.search);