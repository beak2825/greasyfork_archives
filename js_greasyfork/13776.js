// ==UserScript==
// @name        Wykop doodle - flaga PL
// @description Podmienia rogalowe doodle na Wykopie w dniu Święta Niepodległości (11 listopada) na grafikę z flagą PL.
// @namespace   Wykop scripts
// @include     https://www.wykop.pl/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13776/Wykop%20doodle%20-%20flaga%20PL.user.js
// @updateURL https://update.greasyfork.org/scripts/13776/Wykop%20doodle%20-%20flaga%20PL.meta.js
// ==/UserScript==


var dt = new Date();
if(dt.getMonth()==10 && dt.getDate()==11)
{
  var ddl = document.getElementsByClassName('woodle');
  if(ddl.length>0)
  {
    ddl[0].style.background = "url(https://www.wykop.pl/cdn/c3201142/comment_Wcb37aseM2on2yDToYiMJ1JbB6VRiARF,w400.jpg) no-repeat 0 0";
    ddl[0].style.backgroundSize = "100% 100%";
    var ddla = ddl[0].getElementsByTagName('a')
    if(ddla.length>0)
      ddla[0].href = "https://pl.wikipedia.org/wiki/Narodowe_%C5%9Awi%C4%99to_Niepodleg%C5%82o%C5%9Bci";
  }
  
}