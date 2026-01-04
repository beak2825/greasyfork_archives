// ==UserScript==
// @name         Hotpot.ai Unlimited v3
// @namespace    https://leaked.wiki
// @version      0.1
// @description  Removes the local cooldowns for Hotpot.ai allowing you to generate multiple images at once! + ratio 
// @author       woltdb
// @match        *://hotpot.ai/art-generator
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hotpot.ai
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472076/Hotpotai%20Unlimited%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/472076/Hotpotai%20Unlimited%20v3.meta.js
// ==/UserScript==
 
 (function() {
    'use strict';
    var css = ".disabled { pointer-events: all; opacity: 1; }";
    var js = "localStorage.setItem('ai.hotpot.helpers.requestCounter.8', '{\"lastRequestTime\":\"2023-03-12T03:24:37.586Z\",\"numRequests\":-69420}');";

    const style = document.createElement('style');
    style.textContent = css;
    document.head.append(style);
    
    
  function didChangeAspectRatio(selectElement) {
    // Set premium box.
    ControlBox.find('.premiumBox .switch').prop('checked', true);
    setPrice();
  }
})();