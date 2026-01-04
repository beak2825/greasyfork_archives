// ==UserScript==
// @name Remove doubleclick tracking
// @description Use original links instead of "ad.doubleclick.net" links in the Google Search means a little less tracking!
// @namespace Violentmonkey Scripts
// @match https://www.google.com/search
// @grant none
// @version 0.0.1.20190521130657
// @downloadURL https://update.greasyfork.org/scripts/383327/Remove%20doubleclick%20tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/383327/Remove%20doubleclick%20tracking.meta.js
// ==/UserScript==

  var oldOnload = window.onload;

  window.onload = function () {

      if (typeof oldOnload == 'function') {
        oldOnload();
      }

      var adClickElements = document.getElementsByClassName('pla-unit-container');
      var text = '';
      var i;
    
      text += 'Items to fix: ';
      text += adClickElements.length - 1;
      text += '\n'
    
      for (i = 0; i < adClickElements.length - 1; i++) {
        text += 'URL \'' + adClickElements[i].removeChild(adClickElements[i].childNodes[0]) + '\' removed. \n';
      }
    
      text += 'Done, enjoy Google Search with a little less tracking! :-)';

      console.log(text);
  }