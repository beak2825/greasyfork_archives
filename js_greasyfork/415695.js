// ==UserScript==
// @name        Reload Urban Dictionary
// @namespace   Nameless
// @run-at      document-start
// @match       *://www.urbandictionary.*/*
// @grant       none
// @version     1.1
// @author      -
// @description Removes ? from URL
// @downloadURL https://update.greasyfork.org/scripts/415695/Reload%20Urban%20Dictionary.user.js
// @updateURL https://update.greasyfork.org/scripts/415695/Reload%20Urban%20Dictionary.meta.js
// ==/UserScript==

let a= window.location.href;

let b= a.split('?term=');

let c= b[0];

let d= b[1];

if (d.includes('?')) {

d= d.replace('?','');

location.replace(c+'?term='+d);

}