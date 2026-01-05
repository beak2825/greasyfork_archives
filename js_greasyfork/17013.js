// ==UserScript==
// @name         Amazon Mobile to Desktop Redirect
// @namespace    dewa710.amazon
// @version      1.0
// @description  Redirects Amazon mobile links to the desktop version
// @author       dewa710
// @include      http://www.amazon.*/gp/aw/d/*
// @include      http://amazon.*/gp/aw/d/*
// @include      https://www.amazon.*/gp/aw/d/*
// @include      https://amazon.*/gp/aw/d/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/17013/Amazon%20Mobile%20to%20Desktop%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/17013/Amazon%20Mobile%20to%20Desktop%20Redirect.meta.js
// ==/UserScript==
window.location = window.location.toString().replace("/gp/aw/d/", "/dp/");