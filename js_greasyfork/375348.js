// ==UserScript==
// @name         Cleanup Youtube Search results
// @namespace    https:/github.com/abdullahoguk/related-results-remover-youtube
// @version      0.7
// @description  Remove related videos and search suggestions in youtube search results.
// @author       Abdullah Öğük
// @license CC-BY-SA-3.0; http://creativecommons.org/licenses/by-sa/3.0/
// @license MIT
// @match        *.youtube.com/results*
// @include      *youtube.com/results*
// @include      *.youtube.com/results*
// @run-at document-end


// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375348/Cleanup%20Youtube%20Search%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/375348/Cleanup%20Youtube%20Search%20results.meta.js
// ==/UserScript==

(function() {
    'use strict';
  //to track changes on DOM for new UI(SPA) 
    var mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          main();
        });
      });
      
      mutationObserver.observe(document.body, {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true
      });
      
      function main(){
      
      //Remove related video in new UI
      [...document.querySelectorAll("ytd-badge-supported-renderer")]
          .filter(function(e){return /Related|İlgili video/.test(e.innerText)})
          .forEach(function(e){e.closest("#dismissable").remove()});
      
      //Remove related video in old UI
      [...document.querySelectorAll(".yt-badge")]
          .filter(function(e){return /Related|İlgili video/.test(e.innerText)})
          .forEach(function(e){e.closest("li").remove()});
      
      //Remove Search Suggestions
      var suggestions = document.querySelectorAll("#dismissible.ytd-shelf-renderer");
      if(suggestions){suggestions.forEach(function(item){item.remove()})};

      //Remove new class
      var dismissable = document.querySelector("div.feed-item-dismissable");
      if(dismissable){dismissable.remove()};
      var dismissable2 = document.querySelector("ytd-shelf-renderer #dismissable")
      if(dismissable2){dismissable2.remove()};

       };
      
})();