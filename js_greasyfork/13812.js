// ==UserScript==
// @name        ReadableCodeFont
// @namespace   www.mynamespace.com/what/
// @description Increases font size for code-snippets on iPhoneDevWiki.net
// @include     http://iphonedevwiki.net/*
// @version     20151116
// @grant       none
// @author wolfposd
// @downloadURL https://update.greasyfork.org/scripts/13812/ReadableCodeFont.user.js
// @updateURL https://update.greasyfork.org/scripts/13812/ReadableCodeFont.meta.js
// ==/UserScript==

// iphonedevwiki has jquery 1.8.3 already loaded
$(document).ready(function()
{
   $("div .source-text,div .source-objc,div .source-logos,div .source-bash,div .source-c")
   .each(function(index,value) {
            $(value).css("font-size", "1.2em");
         });
  }
);

