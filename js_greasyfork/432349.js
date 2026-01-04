// ==UserScript==
// @name         StashToVLC
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Opens scene in VLC player from within the browser. Requires additional registry editing, read instructions.
// @author       Inspired by github.com/Belleyy, fixed and simplified by zulucommander.
// @match        *localhost:9999/*
// @icon         https://www.google.com/s2/favicons?domain=undefined.localhost
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/432349/StashToVLC.user.js
// @updateURL https://update.greasyfork.org/scripts/432349/StashToVLC.meta.js
// ==/UserScript==

(function() {
    'use strict';

function waitForElementClass(elementId, callBack, time) {
  time = (typeof time !== 'undefined') ? time : 100;
  window.setTimeout(function () {
    let element = document.getElementsByClassName(elementId);
    if (element.length > 0) {
      callBack(elementId, element);
    } else {
      waitForElementClass(elementId, callBack);
    }
  }, time);
}


let urlCheckerInterval = setInterval(() => {
  if (window.location.href.match(/localhost:9999\/scenes\/\d*/)) {
    waitForElementClass("jw-preview", function () {
      if (!document.getElementById("userscript_vlc")) {
        let jwplayer_div = document.getElementById('main-jwplayer');
        let vlc_div = document.createElement('div');
        vlc_div.innerHTML = '<a class="minimal settings-button btn btn-primary" id="userscript_vlc" style="z-index: 1;position: relative;float: left;border-radius: 50px;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-btn" viewBox="0 0 16 16"><path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"></path><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"></path></svg></a>';
        jwplayer_div.insertBefore(vlc_div, document.getElementsByClassName('jw-aspect jw-reset')[0]);
        document.getElementById("userscript_vlc").addEventListener("click", function () {
          let path_text = document.querySelector("a[href*='file://']").href;
          if (path_text) {
            document.location.href = 'vlcs:' + path_text;
          } else {
            console.error("Error getting the path.")
          }
        }, false);

      }
    });
    console.log("looping...");
   }
}, 500);


})();