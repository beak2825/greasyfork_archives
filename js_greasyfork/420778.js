// ==UserScript==
// @name               Wikipedia
// @namespace          https://greasyfork.org/en/users/728780-turbo-cafe-clovermail-net
// @description        Always redirects to mobile wikipedia.
// @include            *://*.wikipedia.org/*
// @exclude            *://www.wikipedia.org/*
// @exclude            *://*.m.wikipedia.org/*
// @version            1.02
// @run-at             document-start
// @author             turbo.cafe@clovermail.net
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/420778/Wikipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/420778/Wikipedia.meta.js
// ==/UserScript==

window.location.replace(window.location.href.replace('wikipedia.org', 'm.wikipedia.org'));