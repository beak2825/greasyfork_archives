
// ==UserScript==
// @name         Bypass Rojadirecta redirection
// @version      1.4
// @license      LGPLv3
// @homepage https://github.com/bahhax404/rojadirecta
// @description  Bypasses rojadirecta  redirection page  and load the stream  websites directly
// @include      *.rojadirecta.*
// @icon http://www.rojadirecta.me/static/roja.jpg
// @run-at       document-body
// @author       Bahha 
// @namespace https://greasyfork.org/users/186498
// @downloadURL https://update.greasyfork.org/scripts/368198/Bypass%20Rojadirecta%20redirection.user.js
// @updateURL https://update.greasyfork.org/scripts/368198/Bypass%20Rojadirecta%20redirection.meta.js
// ==/UserScript==

  
   
    var goto = "goto"
    //retreive all the urls on the page
    var links = document.getElementsByTagName("a");
    // retrieve urls with goto word and replace them with the actual stream link. 
   
    for (var i = 0; i < links.length; i++) {

      if (links[i].href.match(goto)) {
      link = links[i].href.slice(links[i].href.indexOf("goto/") + 5);
      links[i].href = "http://" + link;
    
      }

    }
    //fix agenda width
    var widthFix = document.getElementsByClassName("scrollagenda");
    widthFix[0].style.width = "520px";
//that's it :)