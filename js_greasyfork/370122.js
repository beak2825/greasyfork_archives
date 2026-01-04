// ==UserScript==
// @name         DrFilter
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Mini filtre d'indésirables
// @author       DrManhattant
// @match        http://www.jeuxvideo.com/forums/0-51-0-1-0-1-0-blabla-18-25-ans.htm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370122/DrFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/370122/DrFilter.meta.js
// ==/UserScript==

(function() {
	"use strict";
  var url = "http://www.jeuxvideo.com/";
  var blackLi = [];

  var container =document.getElementsByClassName('bloc-pagi-default')[0];	
  var t0 = performance.now();
  var containerSujets = document.getElementsByClassName("topic-list topic-list-admin")[0];
  var listeSujets = containerSujets.childNodes;
  
  var containerWhite = containerSujets.cloneNode(true);
  var liSujetsWhite = containerWhite.childNodes;
  containerSujets.parentNode.insertBefore(containerWhite,containerSujets.parentNode.firstChild);
  
  
  for (var i = 3; i < liSujetsWhite.length; i++) {
		containerWhite.removeChild(liSujetsWhite[i]);
  }
  function reloadSujets() {
    httpGet("http://www.jeuxvideo.com/forums/0-51-0-1-0-1-0-blabla-18-25-ans.htm",cbHttpGet);
    function cbHttpGet(xhr) {

     while(listeSujets.length >2) {
        containerSujets.removeChild(containerSujets.lastChild); 
     }
      
      
     var containerSujetsXhr = xhr.response.getElementsByClassName("topic-list topic-list-admin")[0];
     var listeSujetsXhr = containerSujetsXhr.childNodes;
     for (var i = 2; i < listeSujetsXhr.length && i<50; i++) {
        if (listeSujetsXhr[i].tagName == "LI") {
           let dataId = listeSujetsXhr[i].getAttribute("data-id");
           if (dataId && blackLi.indexOf(dataId) <= -1 ) {
              containerSujets.appendChild(listeSujetsXhr[i]);
           } 
        }
   	 }
     if(containerSujets.childNodes.length==2)reloadSujets();
       
  		}
  }

    function addToFilter(sbjId,strict,addWhite) {
      var t1 = performance.now();
      
      if(strict || t1-t0>=200) {
        blackLi.push(sbjId);
        var dataId = 0;
        var i=1;
        while(i<listeSujets.length && dataId!=sbjId){
            if(listeSujets[i].tagName == 'LI'){
                dataId = listeSujets[i].getAttribute('data-id');
            }
            i++;
        }
        if(addWhite)
          containerWhite.appendChild(listeSujets[i-1]);
        else
       		containerSujets.removeChild(listeSujets[i-1]);
        
        
        if(!strict)
          t0=t1;
      }
      if(listeSujets.length==29)reloadSujets();
    }
    function httpGet(url, cbGetHtml) {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
      xhr.responseType = "document";
        xhr.onload = function() {cbGetHtml(xhr);};
        xhr.send();

    }
  window.addEventListener('keypress', function(event) {
    if(event.charCode == 101) {
           	reloadSujets();
    }
    var i=0;
    var sbjId ="";
    while(i<listeSujets.length && !sbjId){
      if (listeSujets[i].tagName == "LI") {
      	sbjId=listeSujets[i].getAttribute('data-id');
      }
      i++;
    }
      if(sbjId) {
        if(event.charCode == 97) {
            addToFilter(sbjId,true,false);
        }
        else if(event.charCode == 122) {
            addToFilter(sbjId,true,true);
          
        }
    	}
	});
})();