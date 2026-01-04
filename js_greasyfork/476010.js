// ==UserScript==
// @name         Fix Post Right Click
// @namespace    https://github.com/naviamold1
// @version      0.2.1
// @homepage     https://greasyfork.org/en/scripts/476010-fix-image-copy
// @description  A simple userscript that remove's blocking elements to allow copying the image on Instagram and adds video controls
// @author       Naviamold
// @license      MIT
// @match        *://*.instagram.com/*
// @icon         https://static.cdninstagram.com/rsrc.php/y4/r/QaBlI0OZiks.ico
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require      https://greasyfork.org/scripts/476008-waitforkeyelements-gist-port/code/waitforkeyelements%20gist%20port+.js
// @downloadURL https://update.greasyfork.org/scripts/476010/Fix%20Post%20Right%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/476010/Fix%20Post%20Right%20Click.meta.js
// ==/UserScript==

(function () {
  "use strict";

  waitForKeyElements(
    "._aagw",
    () => {
      document.querySelector("._aagw").remove();
    },
    false
  );
  setInterval(() => {
    document
      .querySelectorAll("div[data-instancekey]")
      .forEach((val) => val.remove());
    document
      .querySelectorAll("video")
      .forEach((val) => val.setAttribute("controls", "true"));
  }, 500);
})();
