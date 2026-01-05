// ==UserScript==
// @name        Vostálovač
// @namespace   www.vault.cz
// @description skrytí Vostála + toggle
// @include     http://stoky.urza.cz/*
// @version     1
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/27559/Vost%C3%A1lova%C4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/27559/Vost%C3%A1lova%C4%8D.meta.js
// ==/UserScript==

$(document).ready(function(){
  $('span.commentHeaderItem').each(function(){
  if($(this).text() == 'Autor: Vostál Petr'){
   $(this).css({
      'color' : 'rgb(255, 0, 0)',
      'cursor' : 'pointer'
    });
    $(this).addClass('vostalek');
    $(this).parents('.commentHeader').next('.commentBody').toggle();
   }
  });
});

$(document).on('click','.vostalek',function(){
  if($(this).css('color') == 'rgb(255, 0, 0)'){
    $(this).css('color', 'rgb(255, 255, 0)');
  }
  else {
    $(this).css('color', 'rgb(255, 0, 0)');
  }
  $(this).parents('.commentHeader').next('.commentBody').toggle();
});