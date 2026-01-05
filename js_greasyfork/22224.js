// ==UserScript==
// @name         Suggest Me Not
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Block ads disguised as content on Facebook.
// @author       Ravenstine
// @match        https://www.facebook.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/22224/Suggest%20Me%20Not.user.js
// @updateURL https://update.greasyfork.org/scripts/22224/Suggest%20Me%20Not.meta.js
// ==/UserScript==

$('body').on('DOMNodeInserted', "[id^=hyperfeed_story_id_]", function (e) {
  var element = $(e.currentTarget)
  if(element.find("span:contains('Suggested Post')").length){
    element.remove()
  }
})