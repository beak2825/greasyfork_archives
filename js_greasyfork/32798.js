// ==UserScript==
// @name        Bing Image Direct Link Patch
// @namespace   BingImageDirectLinkPatch
// @version     1.2.4
// @license     AGPLv3
// @author      jcunews
// @description Make search result entries' image dimension information as link which points to the direct image resource.
// @website     https://greasyfork.org/en/users/85671-jcunews
// @include     https://www.bing.com/images/search*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32798/Bing%20Image%20Direct%20Link%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/32798/Bing%20Image%20Direct%20Link%20Patch.meta.js
// ==/UserScript==

(() => {
  addEventListener("mouseenter", (ev, a, b, c, z) => {
    if (ev.target.matches(".imgpt:not(.linked_bidlp)") && (a = ev.target.querySelector(".img_info>span")) && (b = ev.target.querySelector(".iusc"))) {
      ev.target.classList.add("linked_bidlp");
      (c = document.createElement("A")).textContent = a.textContent;
      c.className = a.className;
      c.style.cssText = a.style.cssText;
      c.rel = "nofollow noopener noreferrer";
      try {
        if (!(c.href = JSON.parse(b.getAttribute("m")).murl)) throw 0;
      } catch(z) {
        c.href = 'javascript.void("Error getting image URL")';
      }
      a.parentNode.replaceChild(c, a);
    }
  }, true);
})();
