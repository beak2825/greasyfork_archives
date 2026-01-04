// ==UserScript==
// @name altadefinizione
// @namespace Violentmonkey Scripts
// @include *
// @run-at document-start
// @grant none
// @description altadefinizione fake intro skip
// @version 0.0.1.20190425194134
// @downloadURL https://update.greasyfork.org/scripts/382236/altadefinizione.user.js
// @updateURL https://update.greasyfork.org/scripts/382236/altadefinizione.meta.js
// ==/UserScript==




function zIndex_filter(node){
    var childs = node.getElementsByTagName("*");

    for (var c=0; c<childs.length; c++){

        var css = getComputedStyle(childs[c]);
        if (childs[c].style.zIndex>1000 || css.zIndex>1000){
            childs[c].remove();
            c--;
        }
    }

}



window.onContextMenu = function(){
  return true;
}



var url = window.location.href;

if (url.indexOf("https://hdpass.")>=0){

  fhd = (url.indexOf("res")>=0);

  window.onload=function(){
    document.getElementsByClassName("wrapBgOpenload")[0].remove();

    //set max resolution
    var res = document.getElementById("listRes").getElementsByTagName("a");
    var nr = res.length;
    if (!fhd) window.location.href = res[nr-1].href;

  }

}



if (url.indexOf("oload")>=0){
  window.onload=function(){
    


    setTimeout(function(){
      
      zIndex_filter(document.body);

      document.getElementsByClassName("videocontainer")[0].getElementsByTagName("span")[0].click();
      //document.getElementsByClassName("vjs-poster vjs-hidden")[0].click();
      
      //not working because firefox has blocked video autoplay
      document.getElementsByClassName("vjs-control-text")[0].click();
      
      
      

    },1000);

  }
}


