// ==UserScript==
// @name         Yandex Image Search Direct Link Patch
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.4
// @license      AGPL v3
// @author       jcunews
// @description  Make Yandex Image search result entry's image bottom panel as bottom-right image size information and link it to the direct image resource.
// @match        https://yandex.com/images/search*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/452709/Yandex%20Image%20Search%20Direct%20Link%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/452709/Yandex%20Image%20Search%20Direct%20Link%20Patch.meta.js
// ==/UserScript==

(() => {
  function updItem(node, a, b, c) {
    if (a = node.querySelector(".serp-item__plates")) {
      (b = document.querySelector("A")).className = a.className;
      b.href = decodeURIComponent((c = node.querySelector(".serp-item__link")).href.match(/img_url=([^&#]+)/)[1]).replace(/^http:/, "https:");
      b.rel = "noopener noreferrer";
      b.innerHTML = a.innerHTML;
      b.firstChild.style.cssText = "display:block";
      c.insertAdjacentHTML("afterend", b.outerHTML);
      a.style.display = "none"
    }
  }
  (new MutationObserver(recs => {
    recs.forEach(rec => {
      rec.addedNodes.forEach(node => {
        if (node.matches) {
          if (node.matches(".serp-item")) {
            updItem(node)
          } else if (node.matches(".serp-controller__content")) node.querySelectorAll(".serp-item").forEach(updItem)
        }
      })
    })
  })).observe(document, {childList: true, subtree: true})
})()
