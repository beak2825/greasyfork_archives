// ==UserScript==
// @name        My-Page_seasonvar.ru
// @description Скрипт для СизонВара
// @namespace   http://seasonvar.ru
// @include     http://seasonvar.ru/serial*
// require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant    GM_addStyle
// @version     1.02
// @downloadURL https://update.greasyfork.org/scripts/384535/My-Page_seasonvarru.user.js
// @updateURL https://update.greasyfork.org/scripts/384535/My-Page_seasonvarru.meta.js
// ==/UserScript==
// document.body.style.padding



(function (){
//document.body.children[3].remove() ;
//взять все елементы с котент врапом
  arr = document.querySelectorAll(".content-wrap")
  scriptvar = document.body.querySelectorAll("script[src]")
  comments = document.querySelector(".tabs-result.pgs-afterplay")
//document.getElementsByClassName("sidebar lside")[0].remove();  
  $("body").empty()
  arr[1].children[0].querySelector("[align='center']").remove()
  document.body.appendChild(arr[1])
  document.body.appendChild(arr[0])
  document.body.appendChild(comments)
  scriptvar.forEach(function(script){document.head.appendChild(script)})
  setTimeout(function(){
      document.body.scrollIntoView();
  },10000);
/*
  setTimeout(function(){
      document.getElementsByClassName("tabs-result")[0].scrollIntoView();
  },4000);
  */
})()