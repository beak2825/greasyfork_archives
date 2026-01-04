// ==UserScript==
// @name     Zhongwen zhuyin only & font change
// @description Modifies the look of the Zhongwen pop-up
// @version  0.5
// @grant    none
// @match    <all_urls>
// @namespace https://greasyfork.org/users/683917
// @downloadURL https://update.greasyfork.org/scripts/429193/Zhongwen%20zhuyin%20only%20%20font%20change.user.js
// @updateURL https://update.greasyfork.org/scripts/429193/Zhongwen%20zhuyin%20only%20%20font%20change.meta.js
// ==/UserScript==


(function () {
  'use strict';
  function addGlobalStyle(css) {
    console.log(css);
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
      console.log('ERROR: No <head> found; Unable to add global style.');
      return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  }
	window.addEventListener('load', function() {
    addGlobalStyle(`
      #zhongwen-window .w-zhuyin {
        font-family: Tahoma, Geneva, sans-serif !important;
        font-size: 18px;
      }

      #zhongwen-window .w-pinyin {
        display:none;
      }
		`);
  });
    
})();
