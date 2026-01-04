// ==UserScript==
// @description Unlike other scripts this one actually works!
// @include http://www.youtube.com/
// @include http://youtube.com/
// @include https://youtube.com/
// @include https://www.youtube.com/
// @name Remove Recommended channels from YouTube homepage (WORKING!)
// @namespace enumag
// @version 1.1.0
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/40634/Remove%20Recommended%20channels%20from%20YouTube%20homepage%20%28WORKING%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/40634/Remove%20Recommended%20channels%20from%20YouTube%20homepage%20%28WORKING%21%29.meta.js
// ==/UserScript==


'use strict';

(function main() {
    var removeRecommended = function () {
        var buttons = document.querySelectorAll('[id=subscribe-button].ytd-shelf-renderer .ytd-shelf-renderer');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
          	var close = buttons[i].parentNode.parentNode.querySelectorAll('#menu .yt-simple-endpoint');
          	for (var j = 0; j < close.length; j++) {
              	close[j].click();
            }
        }
    };
  
    removeRecommended();
    
    for (var k = 1; k <= 20; k++) {
        setTimeout(removeRecommended, k * 100);
    }
}());