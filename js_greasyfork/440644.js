// ==UserScript==
// @name tele5 mediathek view 2024
// @namespace Violentmonkey Scripts!!!!!!!!!!!!!!!!!!!
// @match https://tele5.de/mediathek
// @grant none
// @version 0.0.1.20240322184953
// @description makes the page usable again
// @downloadURL https://update.greasyfork.org/scripts/440644/tele5%20mediathek%20view%202024.user.js
// @updateURL https://update.greasyfork.org/scripts/440644/tele5%20mediathek%20view%202024.meta.js
// ==/UserScript==

var $i = "getElementById";
var $c = "getElementsByClassName";
var $t = "getElementsByTagName";
var ih = "innerHTML";
var it = "innerText";
var ga = "getAttribute";

document[$t]("body")[0].style.visibility = "hidden";

window.addEventListener('load',
  function() {
  
    
  document.getElementsByTagName("body")[0].onclick = function () {
 

    document[$c]("cta__text")[1].click();
    document[$c]("category-link__header")[0].style.display = "none";
    
    var filmstate;

    for (var i = 0, len = document[$c]("image__source").length; i < len; ++i) {
      
      // filmstate = window.getComputedStyle(document[$c]("link")[i], null).getPropertyValue('visibility');

        var imgor = document[$c]("image__source")[i][ih];
        var title = document[$c]("image__source")[i][$t]("img")[0][ga]("aria-label");

        var myregex = new RegExp(" - .*", "gi");
        title = title.replace(myregex, "");
        myregex = new RegExp(": .*", "gi");
        title = title.replace(myregex, "");

        document[$c]("image__source")[i][ih] = title + imgor;
      
    }
    
    document.getElementsByTagName('body')[0].style.visibility = "visible";
    document.title = "tele5 mediathek";
    document.getElementsByTagName("body")[0].onclick = function () {}
    
  }

  },
  false);

setTimeout('document.getElementsByTagName("body")[0].click()', 1000);