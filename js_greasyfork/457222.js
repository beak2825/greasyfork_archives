// ==UserScript==
// @name Cytube Suppress Referrer
// @namespace Cytube
// @match https://cytu.be/r/*
// @grant none
// @version     1.0
// @author      x0x7
// @description 12/27/2022, 10:39:02 AM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457222/Cytube%20Suppress%20Referrer.user.js
// @updateURL https://update.greasyfork.org/scripts/457222/Cytube%20Suppress%20Referrer.meta.js
// ==/UserScript==

// Modify the referer header to an empty string

function makenoreferermeta() {
  var meta= document.createElement('meta');
  meta.name='referrer';
  meta.content='no-referrer';
  return meta;
}

function insertintohead(element) {
  document.head.append(element);
}

function main() {
  insertintohead(makenoreferermeta());
}

setTimeout(main,200);
