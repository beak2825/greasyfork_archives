// ==UserScript==
// @name Magnet Remove Tracker
// @namespace Violentmonkey Scripts
// @match https://btdb.eu/*
// @match https://1337x.to/*
// @match https://torrentz2.eu/*
// @grant none
// @version 0.0.1
// @description Removes trackers from magnet uri
// @downloadURL https://update.greasyfork.org/scripts/392314/Magnet%20Remove%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/392314/Magnet%20Remove%20Tracker.meta.js
// ==/UserScript==
// 
var fireOnHashChangesToo = true;
var pageURLCheckTimer = setInterval (
    function () {
        if (   this.lastPathStr  !== location.pathname
            || this.lastQueryStr !== location.search
            || (fireOnHashChangesToo && this.lastHashStr !== location.hash)
        ) {
            this.lastPathStr  = location.pathname;
            this.lastQueryStr = location.search;
            this.lastHashStr  = location.hash;
            fix_magnet_main();
        }
    }
    , 111
);
function fix_magnet_main() {
  var replace_urls = setInterval(function(){
    all_urls = document.querySelectorAll('a');
    if(all_urls.length > 0){
      clearInterval(replace_urls);
      all_urls.forEach(function(elem){
        var old_href = elem.getAttribute("href");
        if(typeof old_href !== "undefined" &&  old_href && old_href.indexOf('magnet:?') != -1){
          elem_clone = elem.cloneNode(true);
          new_href = old_href.split("&tr=");
          elem_clone.href=new_href[0];
          elem.parentNode.prepend(elem_clone);
          elem.parentNode.removeChild(elem);
        }
        if(typeof old_href !== "undefined" && old_href){
          var href_split =  old_href.split("/");
          if(href_split.length == 2 && href_split[1].length == 40){
            elem_clone = elem.cloneNode(true);
            new_href = "magnet:?xt=urn:btih:"+href_split[1];
            elem_clone.href=new_href;
            elem.parentNode.prepend(elem_clone);
            elem.parentNode.removeChild(elem);
          }
        }
      });
    }
  },300);
}

window.addEventListener('load', fix_magnet_main, false);
