// ==UserScript==
// @name         HLTV Wide
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove wasted space on the hltv forum pages.
// @author       You
// @match        https://www.hltv.org/forums/*
// @icon         https://www.google.com/s2/favicons?domain=hltv.org
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441142/HLTV%20Wide.user.js
// @updateURL https://update.greasyfork.org/scripts/441142/HLTV%20Wide.meta.js
// ==/UserScript==
var $ = window.jQuery;
$('.bgPadding').css("max-width", "100%");
$('.widthControl').css("max-width", "100%");