// ==UserScript==
// @name    Disable Print Dialog in Stack Printer
// @namespace   com.stackprinter.www
// @include http://www.stackprinter.com/*
// @version 1.0
// @grant   none
// @description Disable print dialog in Stack Printer site
// @downloadURL https://update.greasyfork.org/scripts/12348/Disable%20Print%20Dialog%20in%20Stack%20Printer.user.js
// @updateURL https://update.greasyfork.org/scripts/12348/Disable%20Print%20Dialog%20in%20Stack%20Printer.meta.js
// ==/UserScript==

window.print = function(){};