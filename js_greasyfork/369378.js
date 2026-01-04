// ==UserScript==
// @name         ppshipin anti fuckyou
// @namespace    org.ppshipin.anti-fuckyou
// @version      0.1
// @description  try to take over the world!
// @author       moeote
// @include      http://ppshipin.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/369378/ppshipin%20anti%20fuckyou.user.js
// @updateURL https://update.greasyfork.org/scripts/369378/ppshipin%20anti%20fuckyou.meta.js
// ==/UserScript==

(function (patcher) {
    document.addEventListener('readystatechange', patcher, false);
  })(function () {
    document.onselectstart = null;
    document.oncontextmenu = null;
    window.onresize = null;
    fuckyou = function () {};
  });