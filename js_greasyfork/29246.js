// ==UserScript==
// @name         sitename-google translate fix
// @version      0.1
// @description  Replace line breaks with divs so google translate wont screw up the format
// @author       Fordask
// @match        http://*.syosetu.com/*
// @grant        none
// @namespace https://greasyfork.org/users/5126
// @downloadURL https://update.greasyfork.org/scripts/29246/sitename-google%20translate%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/29246/sitename-google%20translate%20fix.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
var orignalstring = document.getElementsByTagName('body')[0].innerHTML;
var newstring = orignalstring.replace(new RegExp("<br>", "g"), '<div style="margin-bottom:1rem;"></div>');
document.getElementsByTagName("body")[0].innerHTML = newstring;