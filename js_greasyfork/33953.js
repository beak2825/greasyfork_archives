// ==UserScript==
// @name seasonwar full-wdith
// @description Убирает пустое место слева , от рекламы, делая окно просмотра видео во всю ширину , удобно в оконном режиме .  
// @namespace andxbes
// @match http://seasonvar.ru/*
// @grant none
// @version 0.0.1.20180311181112
// @downloadURL https://update.greasyfork.org/scripts/33953/seasonwar%20full-wdith.user.js
// @updateURL https://update.greasyfork.org/scripts/33953/seasonwar%20full-wdith.meta.js
// ==/UserScript==

jQuery(document).ready(function($){
  
  var $container = $(".middle");
  if($container.hasClass("left")&& !$container.hasClass("right")){
    $container.removeClass("left");
  }
  setInterval(function(){
      $(".adv-banner , #player_wrap + div , *[class*='adv'], *[id*='adv']").remove();
  },2000);
});
