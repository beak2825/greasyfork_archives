// ==UserScript==
// @name        Disable NYTimes Blog Smooth-Scrolling
// @namespace   DisableNYTimesBlogSmoothScrolling
// @description Disables the smooth scrolling done by site's script
// @author      jcunews
// @match       *://*.nytimes.com/*
// @version     1.0.1
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/25521/Disable%20NYTimes%20Blog%20Smooth-Scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/25521/Disable%20NYTimes%20Blog%20Smooth-Scrolling.meta.js
// ==/UserScript==

(function() {
  var ele = document.createElement("SCRIPT");

  ele.text = "(" + (function() {

    var orgKeyDownHandler;
    
    //save original document's addEventListener function
    var docAddEventListener = document.addEventListener;

    //our keydown handler
    function newKeyDownHandler(ev) {
      //check key pressed
      switch (ev.key) {
        case "PageDown":
        case "PageUp":
        case " ": //spacebar
          //don't call original handler for these keys
          break;
        default:
          //call original handler for other keys
          return orgKeyDownHandler.apply(this, arguments);
      }
    }

    //hook document's addEventListener function
    document.addEventListener = function(name, func, capture) {
      if ((name === "keydown") && !orgKeyDownHandler) {
        //use our handler for keydown event
        orgKeyDownHandler = func; //save original handler
        func = newKeyDownHandler; //replace it with our handler
      }
      return docAddEventListener.apply(this, arguments);
    };

  }).toString() + ")()";

  document.head.appendChild(ele);
})();
