// ==UserScript==
// @name          Remove overlay messages on Youtube
// @description   Remove Youtube message about inappropriate or offensive content
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://*.youtube.com/*
// @match         *://*.youtu.be/*
// @icon          https://cdn.icon-icons.com/icons2/1488/PNG/512/5295-youtube-i_102568.png
// @version       1.2
// @license       MIT
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant         none
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/445870/Remove%20overlay%20messages%20on%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/445870/Remove%20overlay%20messages%20on%20Youtube.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var urlAtLastCheck = "";
  var divButtons = null;
  var divPlayer = null;
  var i;

  //Check URL changes
  const rootCallback = function (mutationsList, observer) {
    var pathArray = window.location.pathname.split('/');
    var firstPath = pathArray[1];
    if (firstPath === "watch") {
      var urlNew = window.location.href.split("v=")[1].split("&")[0]; //Check whether it is new video
      if (urlAtLastCheck != urlNew) {
        urlAtLastCheck = urlNew;
        procErrorMessage();
      }
    }
  }

  const rootNode = document.querySelector("body");
  if (rootNode != null) {
    const rootObserver = new MutationObserver(rootCallback);
    rootObserver.observe(rootNode, {childList: true, subtree: true});
  }

  function procErrorMessage() {
    let waitError = setInterval(function() {
      divButtons = $( "yt-player-error-message-renderer div#button.yt-player-error-message-renderer > yt-button-renderer  button" ); //New youtube design
      if (divButtons != null && divButtons.length > 0) {
        clearInterval(waitError);
        //console.log("new error button clicked");
        divButtons[0].click();
      }

      divButtons = $( "div#button.style-scope.yt-player-error-message-renderer > yt-button-renderer > a[tabindex='-1'] > tp-yt-paper-button[aria-label][aria-disabled='false']" ); //Old youtube design
      if (divButtons != null && divButtons.length > 0) {
        clearInterval(waitError);
        //console.log("old error button clicked");
        divButtons[0].click();
      }

      divPlayer = $( "ytd-player video" );
      if (divPlayer != null && divPlayer.length > 0) {
        for (i = 0; i < divPlayer.length; i++) {
          if (!divPlayer[i].paused) {
            //console.log("video is playing");
            clearInterval(waitError); //Stop waiting for error if video is playing
            break;
          }
        }
      }
    }, 100);
  }

})();
