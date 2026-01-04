// ==UserScript==
// @name         Playcode.io popup block
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  8 lines is not enough...
// @author       mewen
// @match        https://playcode.io/new/
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/441223/Playcodeio%20popup%20block.user.js
// @updateURL https://update.greasyfork.org/scripts/441223/Playcodeio%20popup%20block.meta.js
// ==/UserScript==


(function() {
    console.log("playcode popup block active");
    playCodeCheck();
})();


function playCodeCheck() {
  const config = { attributes: true, childList: true, subtree: false };
  const toCheck = document.getElementsByClassName('content-wrapper')[0];

  const callback = function(mutationsList, observer) {
    const wall=document.getElementsByClassName('result-ads');
      if(wall.length>0){
        const close = wall[0].getElementsByTagName("BUTTON")[0];
        if(close) {
          console.log("blocking popup");
          close.disabled = false;
          close.click();
        }
      }
  };
  const bodyObserver = new MutationObserver(callback);
  bodyObserver.observe(toCheck, config);
}