// ==UserScript==
// @name         Youtube remove preview from history
// @namespace    Youtube
// @version      0.1
// @description  Stop video preview on Youtube before it goes to history record.
// @author       NightLancerX
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @license      MIT
// @grant        none
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/441227/Youtube%20remove%20preview%20from%20history.user.js
// @updateURL https://update.greasyfork.org/scripts/441227/Youtube%20remove%20preview%20from%20history.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var previewPauseInterval = setInterval(function(){
    if (document.querySelector('#inline-preview-player video')?.currentTime > 9){
      document.querySelector('#inline-preview-player video').pause();
    }
  }, 450);
})();