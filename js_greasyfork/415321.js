// ==UserScript==
// @name        Blogger Desktop Version
// @namespace   K.D.
// @run-at      document-start
// @match       *://*.blogspot.com/*
// @grant       none
// @version     1.1
// @author      -
// @description Reloads web/desktop version of a blog
// @downloadURL https://update.greasyfork.org/scripts/415321/Blogger%20Desktop%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/415321/Blogger%20Desktop%20Version.meta.js
// ==/UserScript==

let a= window.location.href;

let b= a.split('?m=');

let c= b[1];

if (c==1) {

window.location= a.replace('?m=1','?m=0');

}
