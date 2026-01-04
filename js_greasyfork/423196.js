// ==UserScript==
// @name         Columbiaコピー
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://columbia-xxx.com/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/423196/Columbia%E3%82%B3%E3%83%94%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/423196/Columbia%E3%82%B3%E3%83%94%E3%83%BC.meta.js
// ==/UserScript==


$(function(){

  $('.entry-content').each(function(){
      let links = "";
      $(this).find("a").each(function(){
          if ($(this).attr('href').match(/rapidgator.net/)) {
            links = links + $(this).attr('href') + "\n";
          }
      });
      $(this).after($('<button type="button" name="autoCopy">📝Copy</button> <textarea class="links">' +links+ '</textarea>'));
  });

  $('button[name="autoCopy"]').click(function(){
    let link = $(this).next(".links").val();
     alert(link);
     $(this).next(".links").select();
    document.execCommand('copy');
  })

})(jQuery);