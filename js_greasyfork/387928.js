// ==UserScript==
// @name         Twitter Images Origin Retriever
// @version      0.0.1
// @description  Retrieves the original image file from a Tweet or an image hosted by Twitter
// @author       Metal-Mighty
// @match        https://twitter.com/*/status/*
// @match        https://pbs.twimg.com/media/*
// @grant        none
// @namespace    https://github.com/Metal-Mighty/Twitter-Images-Origin-Retriever
// @downloadURL https://update.greasyfork.org/scripts/387928/Twitter%20Images%20Origin%20Retriever.user.js
// @updateURL https://update.greasyfork.org/scripts/387928/Twitter%20Images%20Origin%20Retriever.meta.js
// ==/UserScript==
(function () {
  "use strict";
  var queryVars = function(str) {
    return str.replace(/^\?/, '').split('&').map(x => x.split('=')).reduce((a, [k, v]) => { a[k] = v; return a; }, {});
  };
  // Check if this page contains a single image whose source is also the location.
  var image = document.getElementsByTagName('img')[0];
  var imgSet;
  var config = { attributes: true, childList: true, subtree: true };
  
  const callback = function(mutationsList, observer) {
    for (let mutation of mutationsList){
      if (mutation.target.className.includes("css-1dbjc4n")) {
        imgSet = mutation.target.getElementsByTagName('img');
        
        var i;
        for (i = 0; i < imgSet.length; i++) {
          var imgSrc = imgSet[i].src;
          if (imgSrc.includes("https://pbs.twimg.com/media/")
          && !imgSrc.match(/name=orig/)) {
            imgSet[i].src = imgSrc.replace(/name=(\w+)/g, 'name=orig');
          }
        } 
      }
    }
  }
  
  const observer = new MutationObserver(callback);
  
  // Start observing the target node for configured mutations
  observer.observe(document.body, config);
  
  if (image && image.getAttribute('src') == location.href) {
    var imgHref = location.href;
    var pathname = location.pathname;
    // Check if we already have the orig modifier
    if (!imgHref.match(/:orig$/) && !imgHref.match(/name=orig/)) {
      // Trim modifiers.
      var idx = pathname.lastIndexOf(':');
      if (idx >= 0)
      pathname = pathname.substr(0, idx);
      // Check if we need to append the file type.
      var format = queryVars(location.search).format;
      if (format && !location.pathname.endsWith(format))
      pathname += '.' + format;
      // Add the modifier.
      pathname += ':orig';
      window.location = pathname;
    }
  }
})();