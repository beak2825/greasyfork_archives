// ==UserScript==
// @name          Akankha Embed
// @namespace     raiyansarker
// @version       1.0
// @description   Get rid of the annoying embed and open the actual page in a new tab
// @author        raiyansarker
// @match         *://anamhasan.web.app/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant         GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/479085/Akankha%20Embed.user.js
// @updateURL https://update.greasyfork.org/scripts/479085/Akankha%20Embed.meta.js
// ==/UserScript==

(function () {
  "use strict";
  window.addEventListener("load", () => {
    const observer = new MutationObserver(function (mutationsList, observer) {
      const targetElement = document.querySelector("iframe");
      if (targetElement) {
        const url = new URL(targetElement.src);
        const redirectUrl = `${url.origin}/watch?v=${
          url.pathname.split("/")[2]
        }`;
        GM_setClipboard(redirectUrl, "text");
        alert("Link copied to clipboard");
        observer.disconnect();
      }
    });

    observer.observe(document, {
      childList: true,
      subtree: true,
    });
  });
})();
