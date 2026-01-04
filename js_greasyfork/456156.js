// ==UserScript==
// @name         Webtoon image no space
// @version      1.2
// @description  Webtoon image no spaces
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @include      https://leveling-solo.org/*
// @run-at       document-end
// @namespace https://greasyfork.org/users/224715
// @downloadURL https://update.greasyfork.org/scripts/456156/Webtoon%20image%20no%20space.user.js
// @updateURL https://update.greasyfork.org/scripts/456156/Webtoon%20image%20no%20space.meta.js
// ==/UserScript==
$(document).ready(function(){
  $('img.aligncenter').attr('style', 'border: none; margin-bottom: 0; margin-top: 0; border-radius: 0');
  $('.code-block').remove();
})