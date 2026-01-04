// ==UserScript==
// @name        Larger, wider and taller default WYSIWYG description area in the XML item editor - Archive.org
// @description By default the description area is tiny, and resizing it every time is a bit of a pain.
// @namespace   Violentmonkey Scripts
// @match       https://archive.org/editxml/*
// @grant       none
// @run-at      document-start
// @version     2020.03.27
// @author      Swyter
// @downloadURL https://update.greasyfork.org/scripts/398785/Larger%2C%20wider%20and%20taller%20default%20WYSIWYG%20description%20area%20in%20the%20XML%20item%20editor%20-%20Archiveorg.user.js
// @updateURL https://update.greasyfork.org/scripts/398785/Larger%2C%20wider%20and%20taller%20default%20WYSIWYG%20description%20area%20in%20the%20XML%20item%20editor%20-%20Archiveorg.meta.js
// ==/UserScript==

/* swy: quick and dirty override; but it seems to work */
window.addEventListener('DOMContentLoaded', function(e)
{
  document.querySelector("textarea#id_description").style="width: 905px; height: 406px; display:none;";
  document.querySelector("div.wysiwyg").style="width: 910px; height: 500px;";
  document.querySelector("div.resizer.ui-resizable").style="height: 473px; width: 910px;";
})