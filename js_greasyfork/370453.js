// ==UserScript==
// @name         Youtube stream chat remover
// @namespace    https://greasyfork.org/scripts/370453-youtube-stream-chat-remover
// @version      0.3
// @description  Removes chat from a stream page!
// @author       Vladimir Danilov
// @match        https://*.youtube.com/watch*
// @grant        none
// @license      Creative Commons; http://creativecommons.org/licenses/by/4.0/
// @downloadURL https://update.greasyfork.org/scripts/370453/Youtube%20stream%20chat%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/370453/Youtube%20stream%20chat%20remover.meta.js
// ==/UserScript==

(function() {
  var tryCount = 0;
  var loop;
  loop = setInterval(function(){
    try {
      tryCount++;
      document.getElementById("chat").outerHTML = "";
      clearInterval(loop);
      console.log('Chat removed');
    } catch (e) {
      console.error(e);
      if (tryCount > 30) {
        clearInterval(loop);
        console.log('Chat not removed');
      }
    }
  }, 1000);
})();
