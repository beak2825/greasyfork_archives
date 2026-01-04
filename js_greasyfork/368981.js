// ==UserScript==
// @name        Hide On Search Hits
// @namespace   localhost
// @author      Hunter
// @description Hides instructions for Yeti hits
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @include     *
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/368981/Hide%20On%20Search%20Hits.user.js
// @updateURL https://update.greasyfork.org/scripts/368981/Hide%20On%20Search%20Hits.meta.js
// ==/UserScript==

if ($('li:contains("Local Needle Searches - US")').length) {
document.getElementsByClassName('item-response order-3')[0].style.display='none';
document.getElementsByClassName('item-response order-4')[0].style.display='none';
document.getElementsByClassName('item-response order-5')[0].style.display='none';
document.getElementsByClassName('instructions')[0].style.display='none';
}