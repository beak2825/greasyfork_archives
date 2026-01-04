// ==UserScript==
// @name         Hax Emotion Avatars
// @version      0.6
// @description  Tap a button to show your emotion!
// @author       You
// @match        https://www.haxball.com/play*
// @grant        none
// @namespace https://greasyfork.org/users/307752
// @downloadURL https://update.greasyfork.org/scripts/384730/Hax%20Emotion%20Avatars.user.js
// @updateURL https://update.greasyfork.org/scripts/384730/Hax%20Emotion%20Avatars.meta.js
// ==/UserScript==

(function() {
  "use strict"; 
  // SET DURATION FOR AVATAR TO APPEAR
  var defaultDuration = 800;
  // SET DEFAULT AVATAR & change emojis - can be extended
  // and changed by following the same syntax.
  var avatars = {
    'default': "🤠",
    '5': "👏",
    '6': "👋",
    "7": "👀",
    "8": "🤬",
    "9": "😨"
  }

  function process(key) {
    var avatar = avatars[key];
    var duration = defaultDuration;
    if (avatar) {
      setAvatar(avatar);
      if (reset != undefined) {
        clearTimeout(reset);
      }
      reset = setTimeout(function() {
        setAvatar(avatars['default']);
      }, duration);
    }
  }

  var reset;

  // code to change the avatar
  function setAvatar(avatar) {
    console.log("avatar: " + avatar);
    iframe.body.querySelectorAll("[data-hook='input']")[0].value = "/avatar " + avatar;
    iframe.body.querySelectorAll("[data-hook='send']")[0].click();

    var notices = iframe.body.getElementsByClassName("notice");
    for (var i = 0; i < notices.length; i++) {
      var notice = notices[i];
      if (notice.innerHTML == "Avatar set") {
        notice.parentNode.removeChild(notice);
      }
    }
  }

  // listens to key presses.
  var listener = function(event) {
    if (iframe.activeElement != iframe.querySelectorAll("[data-hook='input']")[0]) {
      const key = event.key;
      process(key);
    }
  };

  //document.activeElement
  var iframe;
  setTimeout(function() {
    iframe = document.querySelector("iframe").contentWindow.document;
    iframe.body.addEventListener("keydown", listener, true);
    console.log("Setup complete");
  }, 3000);
})();
