// ==UserScript==
// @name     Whatsapp AntiScroll
// @version  2
// @grant    none
// @match https://web.whatsapp.com/*
// @namespace https://greasyfork.org/users/679126
// @description Не допускает скроллинг при отправке сообщения
// @downloadURL https://update.greasyfork.org/scripts/408918/Whatsapp%20AntiScroll.user.js
// @updateURL https://update.greasyfork.org/scripts/408918/Whatsapp%20AntiScroll.meta.js
// ==/UserScript==

Main();

function Main() 
{
  var side = document.getElementById("side");
  if(side==null) {
    setTimeout(function() {
      Main();
    }, 1000);
    return;
  }
  
  console.log("WhatsApp AntiScroll запущен");
  
  var canScroll = false;
  var timerId = -1;
  
  var paneSide = document.getElementById("pane-side"); 
  
  var lastY = paneSide.scrollTop;
  
  paneSide.addEventListener('scroll', function(e) {
    if(canScroll)
    {
      if(timerId != -1) 
      {
        clearTimeout(timerId);
        timerId = setTimeout(function() {canScroll = false; timerId = -1;}, 200);
      }
      lastY = paneSide.scrollTop;
    }
    else
    {
      paneSide.scrollTo(0, lastY);
      canScroll = true;
      timerId = setTimeout(function() {canScroll = false; timerId = -1;}, 200);
    }
  });
  
}