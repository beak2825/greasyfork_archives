// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://anketa.rosminzdrav.ru/staticogvjustank/26/2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392070/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/392070/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var token = setInterval(function(){
       var frame = document.getElementsByTagName("iframe")[0].contentWindow.document;
       if(frame.readyState == "complete")
       {
           // question one

           //frame.getElementsByClassName("empty")[0].checked = true;
            frame.getElementsByClassName("empty")[0].parentElement.click();

            frame.getElementsByClassName("empty")[9].parentElement.click();

           frame.getElementsByClassName("empty")[11].parentElement.click();

           frame.getElementsByClassName("empty")[15].parentElement.click();

           frame.getElementsByClassName("empty")[18].parentElement.click();    // 3.1.1

           frame.getElementsByClassName("empty")[43].parentElement.click();

           frame.getElementsByClassName("empty")[45].parentElement.click();

           frame.getElementsByClassName("empty")[47].parentElement.click();

           frame.getElementsByClassName("empty")[49].parentElement.click();

           frame.getElementsByClassName("empty")[51].parentElement.click();

           frame.getElementsByClassName("empty")[53].parentElement.click();

           frame.getElementsByClassName("empty")[56].parentElement.click();

           frame.getElementsByClassName("empty")[60].parentElement.click();

           frame.getElementsByClassName("empty")[66].parentElement.click();

           frame.getElementsByClassName("empty")[84].parentElement.click();

           frame.getElementsByClassName("empty")[95].parentElement.click();

           frame.getElementsByClassName("empty")[101].parentElement.click();

           frame.getElementsByClassName("empty")[102].parentElement.click();

           frame.getElementsByClassName("empty")[113].parentElement.click();

           frame.getElementsByClassName("empty")[115].parentElement.click();

           frame.getElementsByClassName("empty")[117].parentElement.click();

           frame.getElementsByClassName("empty")[119].parentElement.click();

           //frame.getElementsByClassName("empty")[121].parentElement.click();



       }

       clearInterval(token);
       }, 5000);
     // Установить значение на Дмит. больницу
   
    // Your code here...
})();