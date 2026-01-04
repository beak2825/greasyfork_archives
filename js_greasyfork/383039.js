// ==UserScript==
// @name         [MTURK] Hide Goal Bar
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hides the upper goal bar on MTurk.
// @author       Trickydude24
// @match        https://worker.mturk.com/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/383039/%5BMTURK%5D%20Hide%20Goal%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/383039/%5BMTURK%5D%20Hide%20Goal%20Bar.meta.js
// ==/UserScript==

$('.container-fluid.me-bar>.row.h4.text-muted.m-b-0.p-y-xs>.col-md-6.hidden-sm-down.text-xs-center').css('visibility', 'hidden');