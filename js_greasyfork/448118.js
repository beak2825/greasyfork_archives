// ==UserScript==
// @name         MomioEventListener
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Lets you collect gems while afk
// @author       zilascripts
// @match        https://momio.me/?/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448118/MomioEventListener.user.js
// @updateURL https://update.greasyfork.org/scripts/448118/MomioEventListener.meta.js
// ==/UserScript==

(function() {
  'use strict';

  /* global WebKitMutationObserver */
  // create an observer
  setTimeout(function() {

    // create an observer instance
    var observer = new WebKitMutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (document.getElementsByClassName('anivent_diamond anim_on')) {
          try {
            document.getElementsByClassName('anivent_bird')[0].click();
          } catch (err) {}
        }
      });
    });
    var config = {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    };

    observer.observe(document.querySelector("#aniventContainer"), config);
    observer.observe(document.querySelector("#frame"), config);
    //observer.disconnect(); - to stop observing

  }, 5000); //Two seconds will elapse and Code will execute.

})();
