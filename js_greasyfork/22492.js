// ==UserScript==
// @name        Subkink Editor Linker
// @namespace   https://greasyfork.org/en/users/60633-xbl
// @version     0.1
// @description Provide convenient link to the subkink editor.
// @author      XBL
// @match       https://www.f-list.net/c/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22492/Subkink%20Editor%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/22492/Subkink%20Editor%20Linker.meta.js
// ==/UserScript==

(function addsubkinks() {
'use strict';

if (jQuery(".charactionmenu .edit").length === 0)
  return;//not your own character

var escapedname = jQuery(".charname")[0].innerText.toLowerCase().replace(/ /g,"%20");
var base = "/experimental/subfetish.php?c=";

jQuery(".charactionmenu").append('<a href="' + base + escapedname + '" class="edit">Edit Subkinks</a>');

})();

