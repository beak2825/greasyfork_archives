// ==UserScript==
// @name         userscript-clean-wikiwand
// @namespace    http://tampermonkey.net/
// @version      0.0.0
// @description  Clean Wikiwand
// @author       kvoon
// @match        https://www.wikiwand.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikiwand.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527743/userscript-clean-wikiwand.user.js
// @updateURL https://update.greasyfork.org/scripts/527743/userscript-clean-wikiwand.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // TODO: use better way to detect el
  const timer = setInterval(() => {
   const el =  document.querySelector('.intro_wrapper__bEjtR')
   if(el) {
    el.remove()
    clearInterval(timer)
   }
  }, 100)
})();
