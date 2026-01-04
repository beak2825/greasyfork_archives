// ==UserScript==
// @name         Google toplinks shortcut
// @namespace    https://arsh.zip
// @version      2024-05-18
// @description  press 1, 2 or 3 to open links on google and yt serp
// @author       arsh.zip
// @match        https://www.google.com/search*
// @match        https://www.youtube.com/results*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495268/Google%20toplinks%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/495268/Google%20toplinks%20shortcut.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function isVisible(parent) {
    while (parent) {
      if (getComputedStyle(parent).display === "none") return false;
      parent = parent.parentElement;
    }
    return true;
  }

  function getLink(element) {
    while (element) {
      if (element.href) return element.href;
      element = element.parentElement;
    }
    return "";
  }
  function isDigit(e) {
    return e.code === "Digit1" || e.code === "Digit2" || e.code === "Digit3";
  }
  function getDigit(e) {
    return e.code.slice(-1) - "0" - 1;
  }

  document.addEventListener("keypress", (e) => {
    if (
      e.target.localName === "input" ||
      e.target.localName === "textarea" ||
      !isDigit(e)
    ) {
      return;
    }
    let c;
    if (window.location.hostname.includes("youtube.com")) {
      c = Array.from(document.querySelectorAll("a#video-title, span#video-title")).map((elem) => getLink(elem));
    } else if (window.location.hostname.includes("google.com")) {
      c = Array.from(document.querySelectorAll(".notranslate"))
        .filter((elem) => isVisible(elem))
        .map((elem) => getLink(elem));
    }
    let url = c[getDigit(e)];
    if (e.shiftKey) {
      window.open(url);
    } else {
      location.href = url;
    }
  });
})();
