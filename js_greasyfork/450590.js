// ==UserScript==
// @name         Hitomi.la - Spacebar/Enter to go next panel
// @version      1.1
// @description  Enables clicking `spacebar` (or `enter`) to go to next panel, and shift+spacebar (of shift+enter) to go to previous
// @namespace    wierd4life
// @author       wierd4life
// @license      public
// @grant        none
// @match        *://hitomi.la/reader/*
// @downloadURL https://update.greasyfork.org/scripts/450590/Hitomila%20-%20SpacebarEnter%20to%20go%20next%20panel.user.js
// @updateURL https://update.greasyfork.org/scripts/450590/Hitomila%20-%20SpacebarEnter%20to%20go%20next%20panel.meta.js
// ==/UserScript==
(function(){
  window.addEventListener('keydown', function (e) {
     if(e.keyCode == 32 || e.keyCode == 13) {
       e.shiftKey ? unsafeWindow.prevPanel?.() : unsafeWindow.nextPanel?.();
     }
  }, false);
})();