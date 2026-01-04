// ==UserScript==
// @name        wallhaven.cc - fullscreen on f key
// @namespace   Violentmonkey Scripts
// @include     https://wallhaven.cc/w/*
// @grant       none
// @version     1.0
// @author      WarpMaster
// @description Toggles fullscreen on f keyup
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/451145/wallhavencc%20-%20fullscreen%20on%20f%20key.user.js
// @updateURL https://update.greasyfork.org/scripts/451145/wallhavencc%20-%20fullscreen%20on%20f%20key.meta.js
// ==/UserScript==

(function (window, undefined) {
  var w;
  if (typeof unsafeWindow != undefined) {
      w = unsafeWindow
  } else {
      w = window
  }

  if (w.self != w.top) {
      return
  }

  if (/^https:\/\/wallhaven.cc\/w\/*/.test(w.location.href)) {
    var elem = document.querySelector(".showcase-fullscreen-toggle")

    document.onkeyup = function (e) {
      if (e.code == 'KeyF' && !e.ctrlKey && !window.fullScreen) {
        elem.click()
      }
    }
  }
})(window);
