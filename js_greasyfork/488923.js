// ==UserScript==
// @name         YouTube Avatars Fix
// @version      0.2
// @description  Исправляет отображение аватарок на YouTube.
// @author       Maksovich
// @run-at       document-start
// @namespace    https://greasyfork.org/users/681286
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        https://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488923/YouTube%20Avatars%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/488923/YouTube%20Avatars%20Fix.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const obs = new MutationObserver(mutations => {
    for(const m of mutations) {
      if(m.target.tagName === "IMG" && m.target.src) {
        if(~m.target.src.indexOf("yt3.ggpht.com")) {
          m.target.src = m.target.src.replace("yt3.ggpht.com","yt4.ggpht.com");
        }
      }
    }
  });

  obs.observe(document.documentElement, {
    subtree: true,
    attributes: true,
    attributeFilter: ["src"]
  });

}());