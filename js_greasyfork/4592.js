// ==UserScript==
// @name         Highlight waffleimages links
// @namespace    http://mathemaniac.org
// @version      1.0.1
// @description  Highlights WaffleImages links on SA
// @match        *://forums.somethingawful.com/*
// @copyright    2013, Sebastian Paaske Tørholm
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/4592/Highlight%20waffleimages%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/4592/Highlight%20waffleimages%20links.meta.js
// ==/UserScript==

$("img[src*='img.waffleimages.com']").css( { "border": "3px solid orange" } ).after("<div style='color: orange'>(WaffleImages)</div>");
