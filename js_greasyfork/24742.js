// ==UserScript==
// @name        Wykop 
// @description Zamienia śmieszny znaczek z belki
// @namespace   Wykop scripts
// @include     http://www.wykop.pl/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24742/Wykop.user.js
// @updateURL https://update.greasyfork.org/scripts/24742/Wykop.meta.js
// ==/UserScript==
 
 
 
  var ddl = document.getElementsByClassName('doodle');
  if(ddl.length>0)
  {
    ddl[0].style.background = "url(http://i.imgur.com/yuB1tIb.png) no-repeat 0 0";
    ddl[0].style.backgroundSize = "48 48";
    var ddla = ddl[0].getElementsByTagName('a')
    if(ddla.length>0)
      ddla[0].href = "https://pl.wikipedia.org/wiki/Izrael";
  }