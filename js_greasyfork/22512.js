// ==UserScript==
// @name        Bye-Bye KAT Ads
// @namespace   Keka_Umans
// @description Removes ads from KAT
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @include     *katcr.co/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22512/Bye-Bye%20KAT%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/22512/Bye-Bye%20KAT%20Ads.meta.js
// ==/UserScript==


$(window).load(function(){
  $('div.news:nth-child(2) > div:nth-child(3)').remove();
  $('#main_content_section > center:nth-child(1)').remove();
});