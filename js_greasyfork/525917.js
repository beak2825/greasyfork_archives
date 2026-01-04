// ==UserScript==
// @name         Remove google tracking link redirect
// @namespace    http://tampermonkey.net/
// @version      2025-02-04.1
// @description  Remove google tracking link redirect from all links on the page
// @author       Blake
// @match        https://mail.google.com/*
// @match        https://calendar.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525917/Remove%20google%20tracking%20link%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/525917/Remove%20google%20tracking%20link%20redirect.meta.js
// ==/UserScript==

(function () {
  "use strict";
  
  var process = () => {
    var links = document.querySelectorAll(
      "[href^='https://www.google.com/url?q=']"
    );
    links.forEach((link) => {
      var href = link.href;
      if (href?.startsWith("https://www.google.com/url?q=")) {
        var url = new URL(href);
        var newUrl = url.searchParams.get("q");
        link.href = newUrl.replace(
          /^https?:\/\/www\.google\.com\/url\?q\=/,
          ""
        );
      }
    });
  };

  setInterval(process, 1000);
})();
