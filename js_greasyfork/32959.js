// ==UserScript==
// @name        Max Screen
// @author      hotrods20 & A Meaty Alt
// @namespace   MaxDFScreen
// @description Max DF Screen Size
// @match       https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=21&webplayer=1
// @version     3.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32959/Max%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/32959/Max%20Screen.meta.js
// ==/UserScript==

(function(){
  var titleinfo = document.getElementsByTagName("title")[0].innerHTML;
  var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = 'body * {padding: 0px !important; margin: 0px !important;}';
  document.getElementsByTagName('head')[0].appendChild(style);
  document.getElementsByTagName("title")[0].innerHTML = "Script Working...";
  setTimeout(function(){1
    var elements = document.body.getElementsByTagName("*");
    document.body.style.overflow = "hidden";
    for(var i = 0; i < elements.length; i++)
    {
      elements[i].style.padding = "0px";
      elements[i].style.margin = "0px";
      elements[i].style.border = "0px none transparent";
    }
    var webplayer = document.getElementById("unityPlayer");
    webplayer.style.width = parseInt(width)*0.8+ "px";
    webplayer.style.height = parseInt(height)*0.8 + "px";
    document.getElementsByTagName("title")[0].innerHTML = titleinfo;
  }, 10000);
})();