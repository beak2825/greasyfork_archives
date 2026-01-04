// ==UserScript==
// @name        Block Adblocker Blocker on Bikeradar
// @namespace   http://www.bikeradar.com/*
// @include     http://www.bikeradar.com/*
// @description Blocks the Adblocker blocker on Bikeradar
// @version     1
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/36347/Block%20Adblocker%20Blocker%20on%20Bikeradar.user.js
// @updateURL https://update.greasyfork.org/scripts/36347/Block%20Adblocker%20Blocker%20on%20Bikeradar.meta.js
// ==/UserScript==

var checkForAdblockerBlockerInterval = setInterval(function() { checkForAdblockerBlocker(); }, 500);

function checkForAdblockerBlocker() {
   var blockerBox = $('button[data-choice-type]');
  if(blockerBox.length > 0) {
		if(blockerBox.html() == 'Disable Adblocker') {
      var parents = blockerBox.parents();
      $.each(parents,function(k,v) {
				var elementType = $(v).prop('nodeName');
        if(elementType == 'BODY') {
        	ancestorNum = k-1;
					$(parents[ancestorNum]).prev().remove();
          $(parents[ancestorNum]).remove();
          $('html, body').css('overflow-y','visible');
          $('html, body').css('height','auto');
          $('p').css('color','#333');          
          clearInterval(checkForAdblockerBlockerInterval);
        }
      });
    }
  }
  
  
  
}