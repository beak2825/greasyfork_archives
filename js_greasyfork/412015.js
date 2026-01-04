// ==UserScript==
// @name              Force HTTPS
// @namespace     ghostrider47
// @version            0.2
// @description     Force HTTP to HTTPS
// @author            ghostrider47
// @match             http://*
// @include           http://*
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/412015/Force%20HTTPS.user.js
// @updateURL https://update.greasyfork.org/scripts/412015/Force%20HTTPS.meta.js
// ==/UserScript==
// @run-at            document-start
// @run-at            document-end
// @run-at            document-idle

document.location = document.URL.replace('http://','https://');