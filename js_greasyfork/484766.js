// ==UserScript==
// @name         Google opacity back to normal
// @namespace    http://tampermonkey.net/
// @version      2024-01-13
// @description  my browser keeps turning my body attribute to 0 opacity so here is my solution
// @author       Forge
// @license      MIT
// @match        https://www.google.com.br/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com.br
// @grant        none
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/484766/Google%20opacity%20back%20to%20normal.user.js
// @updateURL https://update.greasyfork.org/scripts/484766/Google%20opacity%20back%20to%20normal.meta.js
// ==/UserScript==
/* globals $ */

var iT = 100;

setInterval(function(){ $('body').attr('style','opacity: 1');}, iT);