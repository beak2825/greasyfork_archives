// ==UserScript==
// @name        0day coub
// @namespace   https://0day.kiev.ua/
// @include     https://forum.0day.kiev.ua/*showtopic=382284*
// @version     1
// @description     Исправляет ссылки на COUB-ы для использования без Adobe Flash Player на сайте 0day.kiev.ua
// @description:en  Corrects links to COUBs for using without Adobe Flash Player on site 0day.kiev.ua
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32897/0day%20coub.user.js
// @updateURL https://update.greasyfork.org/scripts/32897/0day%20coub.meta.js
// ==/UserScript==
(function() {
    var instr1 = "";
    var instr2 = "";
    var instr3 = "";
    var instr4 = "";
    var res = "";
    var res2 = "";
    var new1 = "";
    var new2 = "";
    var new3 = "";
    var clss = document.getElementsByClassName('spoilermain');
    for(var i=0; i<clss.length; i++) { 
      var n = clss[i].innerHTML.includes("fb-player.swf?coubID=");
      if (n) {
        instr1 = clss[i].innerHTML.indexOf('fb-player.swf?coubID=');
        instr2 = clss[i].innerHTML.indexOf(' type=', instr1);
        res = clss[i].innerHTML.substr(instr1 + 21, instr2 - instr1 - 22);
        // res - coub identifier from site
        instr3 = clss[i].innerHTML.indexOf('</center><br><center>');
        instr4 = clss[i].innerHTML.indexOf('</center><!--SPOILER DIV-->', instr3);
        res2 = clss[i].innerHTML.substr(instr3 + 21, instr4 - instr3 - 21);
        // res2 - coub title from site
        new1 = '<!--SPOILER END--><center><embed src="//coub.com/embed/';
        new2 = '?muted=false&autostart=false&originalSize=false&startWithHD=true" allowfullscreen="true" wmode="transparent" align="middle" height="360" width="640"></center><br><center>';
        new3 =  '</center><!--SPOILER DIV-->';
        clss[i].innerHTML = new1 + res + new2 + res2 + new3;
      }
   }
})();
