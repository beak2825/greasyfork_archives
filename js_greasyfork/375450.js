// ==UserScript==
// @name         Audible Notification API
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @license      GNU AGPLv3
// @description  Plays an audio when a browser notification is shown. This script should be applied only for specific sites, since some sites may already have an audible notification. So, once the script is installed, change the @match metadata.
// @author       jcunews
// @match        *://thesite.com/*
// @match        *://othersite.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/375450/Audible%20Notification%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/375450/Audible%20Notification%20API.meta.js
// ==/UserScript==

(function(ntf, aud) {

  //== CONFIGURATION BEGIN ===

  var audioUrl = "https://soundbible.com/grab.php?id=1952&type=mp3";

  //== CONFIGURATION BEGIN ===

  ntf = window.Notification;
  Notification = function(title, options) {
    aud.pause();
    aud.autoplay = false;
    aud.muted = false;
    if (aud.fastSeek) {
      aud.fastSeek(0);
    } else aud.currentTime = 0;
    aud.play();
    return new ntf(title, options);
  };
  Notification.prototype = {
    onclick: {
      get: function() {
        return ntf.onclick;
      },
      set: function(f) {
        return ntf.onclick = f;
      }
    },
    onclose: {
      get: function() {
        return ntf.onclose;
      },
      set: function(f) {
        return ntf.onclose = f;
      }
    },
    onerror: {
      get: function() {
        return ntf.onerror;
      },
      set: function(f) {
        return ntf.onerror = f;
      }
    },
    onshow: {
      get: function() {
        return ntf.onshow;
      },
      set: function(f) {
        return ntf.onshow = f;
      }
    }
  };
  Notification.requestPermission = function() {
    return ntf.requestPermission.apply(ntf, arguments);
  };

  aud = new Audio(audioUrl);
  aud.autoplay = true;
  aud.muted = true;
  aud.style.display = "none!important";
  addEventListener("load", function() {
    document.body.appendChild(aud);
  });
})();
