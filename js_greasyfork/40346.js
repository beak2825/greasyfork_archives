// ==UserScript==
// @name     [Leetcode]Classic Leetcode Problems
// @author   wenoptk
// @description     Highlight leetcode problem id < 300
// @include  http://leetcode.com/problemset*
// @include  https://leetcode.com/problemset*
// @include-todo  http://leetcode.com/tag/*
// @include-todo  https://leetcode.com/tag/*
// @version  1
// @grant    none
// @namespace https://greasyfork.org/users/178464
// @downloadURL https://update.greasyfork.org/scripts/40346/%5BLeetcode%5DClassic%20Leetcode%20Problems.user.js
// @updateURL https://update.greasyfork.org/scripts/40346/%5BLeetcode%5DClassic%20Leetcode%20Problems.meta.js
// ==/UserScript==

(function () {
  
  var cfg = {
  	"use_wait": false
  }
  
  var observeDOM = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback){
      if( MutationObserver ){
        // define a new observer
        var obs = new MutationObserver(function(mutations, observer){
          if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
            callback();
        });
        // have the observer observe foo for changes in children
        obs.observe( obj, { childList:true, subtree:true });
      }
      else if( eventListenerSupported ){
        obj.addEventListener('DOMNodeInserted', callback, false);
        obj.addEventListener('DOMNodeRemoved', callback, false);
      }
    };
  })();
  
  function waitForElement(elementQuery, callBack){
    window.setTimeout(function(){
      var element = document.querySelector(elementQuery);
      if(element){
        callBack(elementQuery, element);
        // Continue to find DOM changes
        waitForElement(elementQuery, callBack);
      }else{
        waitForElement(elementQuery, callBack);
      }
    },500)
  }
  
  function setStyle() {
    var e_list_tr = document.querySelectorAll("div.table-responsive.question-list-table .reactable-data tr")
    for (var i=0; i<e_list_tr.length; i++) {
      var e_id = e_list_tr[i].querySelectorAll("td")[1];
      var int_id = parseInt(e_id.innerHTML);
      if (int_id && int_id <= 300) {
      	e_id.style.backgroundColor = "#ffffd7";
      }
    }
    console.log("len=="+e_list_tr.length);
  }
  
  if (cfg.use_wait) {
    // This is deprecated.
    waitForElement("div.table-responsive.question-list-table .reactable-data tr", function(_, __){
			setStyle();
  	}); 
  } else {
    console.log("Start observing: "+document.getElementById("question-app"));
    observeDOM(document.getElementById("question-app"), function() {
      console.log("changed: " + document.getElementById("question-app"));
  		setStyle();
    });
  }
 
}());