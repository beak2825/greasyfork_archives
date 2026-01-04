// ==UserScript==
// @name        MultiUp Link Display
// @namespace   abdrool
// @icon        https://multiup.io/favicon.png
// @match       https://multiup.io/*/mirror/*
// @grant       GM.setClipboard
// @version     1.1
// @author      abdrool
// @description Displays the links on multiup.org in a nice, convenient codeblock. Works best with Universal Bypass.
// @require     http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/428005/MultiUp%20Link%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/428005/MultiUp%20Link%20Display.meta.js
// ==/UserScript==

$(document).ready(function() {

  urls = $("a.host,button.host").map((i, btn) => {
    var link = btn.getAttribute("link");
    if (!link.startsWith("/")) {
      return link;
    }
  }).toArray().join("\n");

  $(".panel-heading").first().after("<code id='urls'/>");
  let code = $("#urls");
  code.append("<button id='copy'>&#128203;</button>");
  let button = $("#copy");
  code.append(urls);
  button.click(() => GM.setClipboard(urls));
  
  button.css("position", "absolute");
  button.css("right", "50px");
  
  code.css("white-space", "pre-wrap");
  code.css("display", "block");
  code.css("background-color", "#191b1c");
  code.css("padding", "15px"); 
});