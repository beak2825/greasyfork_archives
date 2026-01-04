// ==UserScript==
// @name         Progress Bar
// @namespace    http://tampermonkey.net/
// @version      2024-01-24
// @description  Show reading progress bar on mdn pages
// @author       You
// @match        https://developer.mozilla.org/en-US/docs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485557/Progress%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/485557/Progress%20Bar.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var div = document.createElement("div");

//   div.id = "progressBar";
  div.style.position = "fixed";
  div.style.top = "0px";
  div.style.height = "4px";
  div.style.background =
    "linear-gradient(90deg, rgba(240,240,240,1) 0%, rgba(240,240,240,1) 85%, rgba(0,0,0,0.7) 100%)";
  div.style.setProperty("--scrollAmount", "0%");
  div.style.width = "var(--scrollAmount)";
  div.style.zIndex = "999";

  document.body.appendChild(div);

  document.addEventListener("scroll", () => {
    let docElem = document.documentElement,
      docBody = document.body,
      scrollTop = docElem.scrollTop || docBody.scrollTop,
      scrollHeight =
        (docElem.scrollHeight || docBody.scrollHeight) - window.innerHeight,
      scrollPercent = (scrollTop / scrollHeight) * 100 + "%";

    console.log(scrollPercent);

    div.style.setProperty("--scrollAmount", scrollPercent);
  });
})();






