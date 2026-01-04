// ==UserScript==
// @name         Yandex Image Search Readd Image Size Information
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.1
// @license      AGPL v3
// @author       jcunews
// @description  Readd image size information to Yandex Image search result entries if they're not already added.
// @match        https://yandex.com/images/search*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/502429/Yandex%20Image%20Search%20Readd%20Image%20Size%20Information.user.js
// @updateURL https://update.greasyfork.org/scripts/502429/Yandex%20Image%20Search%20Readd%20Image%20Size%20Information.meta.js
// ==/UserScript==

/*
Due to changes in Yandex site, this script requires that the one-sided Content Security Policy (CSP) is disabled for Yandex site.

TamperMonkey users can simply ensure that the `Modify existing content security policy (CSP) headers` security setting is set to `Auto` or anything other than `No`.

ViolentMonkey users must use a separate browser extension such as "Header Editor", "Man in the Middle", etc. to disable CSP on Yandex.

For privacy reason, it's highly recommended to block access to `csp.yandex.net` via adblocker if it's not yet blocked. Even if CSP is not disabled.
*/

(() => {
  var its = {}, jp = JSON.parse;
  window.its = its;
  JSON.parse = function() {
    var r = jp.apply(this, arguments), a, z;
    if (a = r?.initialState?.serpList?.items?.entities || r?.blocks?.[1]?.params?.adapterData?.serpList?.items?.entities) Object.assign(its, a);
    return r
  };
  function updItem2(node, a) {
    if (node.querySelector('.SerpItem-ThumbPlate')) return;
    a = its[node.id];
    node.querySelector('.SerpItem-ThumbPlates').insertAdjacentHTML("beforeend", `<div class="SerpItem-ThumbPlate">${a.origWidth}×${a.origHeight}</div>`)
  }
  function updItem(node) {
    if (!node.done) {
      node.done = true;
      (function check() {
        if (its[node.id]) {
          updItem2(node)
        } else setTimeout(check, 200)
      })()
    }
  }
  (new MutationObserver(recs => {
    recs.forEach(rec => {
      rec.addedNodes.forEach((node, a, b) => {
        if (node.matches) {
          if (node.matches(".SerpItem")) {
            updItem(node)
          } else node.querySelectorAll(".SerpItem").forEach(updItem)
        }
      })
    })
  })).observe(document, {childList: true, subtree: true})
})()
