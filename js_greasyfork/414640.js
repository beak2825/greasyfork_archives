// ==UserScript==
// @name         YouTube MediaKeys integration
// @namespace    https://atalgaba.com
// @version      0.1.0
// @description  Add missing keyboard media keys integration to YouTube.
// @author       ATAlgaba
// @match        https://*.youtube.com/watch?v=*
// @connect      googlevideo.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/414640/YouTube%20MediaKeys%20integration.user.js
// @updateURL https://update.greasyfork.org/scripts/414640/YouTube%20MediaKeys%20integration.meta.js
// ==/UserScript==

;(function() {
  "use strict";
  
  function jumpToNextTrack() {
    var nextSongButton = document.querySelector(".ytp-next-button.ytp-button");
	if(nextSongButton) {
	  var evObj = document.createEvent('Events');
	  evObj.initEvent('click', true, false);
      nextSongButton.dispatchEvent(evObj);
	}
  }
 
  
  var setHandlerInterval = setInterval(function() {
    if ('mediaSession' in navigator) {	   
       // next-track mediakey handler
       navigator.mediaSession.setActionHandler('nexttrack', jumpToNextTrack);
    }
  }, 1000)
})();
