// ==UserScript==
// @name          CSS: google.com
// @description   Corrections to UI of google.com
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://www.google.com/*
// @match         *://google.com/*
// @version       0.1
// @license       MIT
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/463970/CSS%3A%20googlecom.user.js
// @updateURL https://update.greasyfork.org/scripts/463970/CSS%3A%20googlecom.meta.js
// ==/UserScript==

(function() {
  'use strict';

  /*Hide text in buttons to make cache button visible in mobile browsers*/
  const rootCallback = function (mutationsList, observer) {
    var button = $( "div.u0G9Kc > div > a > span > span:nth-child(2)" );
    if (button != null && button.length > 0) {
      for (var i = 0; i < button.length; i++) {
        if (button[i].innerHTML != " ") {
          button[i].innerHTML = " ";
        }
      }
    }
  }

  const rootNode = document.querySelector("body");
  if (rootNode != null) {
    const rootObserver = new MutationObserver(rootCallback);
    rootObserver.observe(rootNode, {childList: true, subtree: true});
  }
})();