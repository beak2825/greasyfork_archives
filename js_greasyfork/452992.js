// ==UserScript==
// @name        SV Remove Search bar
// @description here's a quick and dirty userscript to remove the search sidebar on sufficientvelocity and try to make it look like it did before
// @license MIT
// @namespace   Violentmonkey Scripts
// @match       *://forums.sufficientvelocity.com/forums/*
// @noframes
// @require  https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
 // @require https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @grant       GM_addStyle
// @grant       GM.getValue
// @version     1.0
// @author      fame
// @description 10/13/2022, 6:27:41 PM
/* global $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/452992/SV%20Remove%20Search%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/452992/SV%20Remove%20Search%20bar.meta.js
// ==/UserScript==

waitForKeyElements(".p-body-sidebar", removeNode);
waitForKeyElements(".p-body-sidebarCol", removeNode);
waitForKeyElements(".p-body-main--withSidebar ", changeNode);

function removeNode (jNode) {
  jNode.remove ();
}

function changeNode (jNode) {
  jNode.attr ("class", "p-body-main")
}