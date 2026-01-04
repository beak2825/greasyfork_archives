// ==UserScript==
// @name         Tumblr likes hotkey
// @version      1.0.0
// @description  Bind a hotkey to show a Tumblr user's likes page (alt+L)
// @author       salad: https://greasyfork.org/en/users/241444-salad
// @include      https://www.tumblr.com/dashboard/blog/*
// @include      https://*.tumblr.com*
// @include      http://*.tumblr.com*
// @namespace https://greasyfork.org/users/241444
// @downloadURL https://update.greasyfork.org/scripts/377024/Tumblr%20likes%20hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/377024/Tumblr%20likes%20hotkey.meta.js
// ==/UserScript==

(function() {

  const showLikes = () => {
    const m = (pattern) => window.location.href.match(pattern);

    const urlMatch = m(/^https:\/\/www.tumblr.com\/dashboard\/blog\/([^\/]+)/) || m(/^https?:\/\/([^\.]+)\.tumblr.com/);
    console.log(urlMatch);

    urlMatch && (window.location.href='https://www.tumblr.com/liked/by/'+urlMatch[1]);
  };

  document.addEventListener("keypress", function onPress(ev) {
      if (ev.key === "l" && ev.altKey) {
          showLikes();
      }
  });

})();