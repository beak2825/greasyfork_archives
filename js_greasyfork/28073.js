// ==UserScript==
// @name No thanks Facebook~
// @version 2.1.0
// @description Removes the box saying you should register or login to view this page
// @namespace https://bitbucket.org/Greydus/no-thanks-facebook
// @match *://*.facebook.com/*
// @grant none
// @run-at document-end
// @require https://code.jquery.com/jquery-3.2.1.js
// @downloadURL https://update.greasyfork.org/scripts/28073/No%20thanks%20Facebook~.user.js
// @updateURL https://update.greasyfork.org/scripts/28073/No%20thanks%20Facebook~.meta.js
// ==/UserScript==
$('#pagelet_growth_expanding_cta').css('display','none');