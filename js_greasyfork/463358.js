// ==UserScript==
// @name        Redirect * twitter
// @description Redirect to tw.rijndael.cc
// @include     *://*twitter.com/*

// @version 0.1
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/463358/Redirect%20%2A%20twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/463358/Redirect%20%2A%20twitter.meta.js
// ==/UserScript==
const url = new URL(document.location.href);
window.open('https://tw.rijndael.cc' + url.pathname,"_self");
