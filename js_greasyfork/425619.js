// ==UserScript==
// @name         </> Kurt & Java Haxball Avatar Değiştirici
// @namespace    http://tampermonkey.net/
// @version      89.4
// @description  Kurt & Java
// @icon         https://cdn.discordapp.com/emojis/823517965362266122.png?v=1
// @author       Kurt
// @match        https://www.haxball.com/play
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/425619/%3C%3E%20Kurt%20%20Java%20Haxball%20Avatar%20De%C4%9Fi%C5%9Ftirici.user.js
// @updateURL https://update.greasyfork.org/scripts/425619/%3C%3E%20Kurt%20%20Java%20Haxball%20Avatar%20De%C4%9Fi%C5%9Ftirici.meta.js
// ==/UserScript==

(function() {
  "use strict"; 
  // Hız
  var defaultDuration = 800;
  // Buradan Değiştirebilirsiniz
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

  // Listeli Anaktar
  var listener = function(event) {
    if (iframe.activeElement != iframe.querySelectorAll("[data-hook='input']")[0]) {
      const key = event.key;
      process(key);
    }
  };

  // document.activeElement
  var iframe;
  setTimeout(function() {
    iframe = document.querySelector("iframe").contentWindow.document;
    iframe.body.addEventListener("keydown", listener, true);
    console.log("Setup complete");
  }, 3000);
})();
