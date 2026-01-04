// ==UserScript==
// @name         IMDB to Simkl
// @namespace    https://www.imdb.com/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.imdb.com/title/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404884/IMDB%20to%20Simkl.user.js
// @updateURL https://update.greasyfork.org/scripts/404884/IMDB%20to%20Simkl.meta.js
// ==/UserScript==

(function () {
'use strict';

    var stateObj = {
    foo: "bar",
};

    var doStuff = function(){
     if(document.getElementsByClassName('subtext')[0].outerHTML.indexOf("TV Series") > -1){
          //history.pushState(stateObj, "page 2", "https://simkl.com/search/?type=tv&q="+window.location.href);
     window.location = "https://simkl.com/search/?type=tv&q="+window.location.href;
          } else {
          //history.pushState(stateObj, "page 2", "https://simkl.com/search/?type=movies&q="+window.location.href);
window.location = "https://simkl.com/search/?type=movies&q="+window.location.href;
          }
  //alert('click');
    }

    document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 83) {
        doStuff();
    }
};


   document.getElementsByClassName('titleBar')[0].onclick = function(e){
       doStuff()
}
})();



