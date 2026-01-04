// ==UserScript==
// @name         Ward
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  try to take over the world!
// @author       You
// @match        https://www.parahumans.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38245/Ward.user.js
// @updateURL https://update.greasyfork.org/scripts/38245/Ward.meta.js
// ==/UserScript==
var d=document,s=d.createElement('style');
s.appendChild(d.createTextNode('*{}p{font-size:1.5em}'));
//s.appendChild(d.createTextNode('*{color:black!important;background:white!important}p{font-size:1.5em}'));
document.body.appendChild(s);