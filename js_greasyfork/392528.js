// ==UserScript==
// @name         Disable Video Popouts
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.3
// @license      AGPLv3
// @author       jcunews
// @description  Disable/remove non browser native video overlays on web pages. This script applies on all sites by default, and must be manually configured to exclude specific sites. Note: this is a somewhat aggresive blocker, where it may break site functionality.
// @match        *://*/*
// @exclude      *://dont-block.this.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392528/Disable%20Video%20Popouts.user.js
// @updateURL https://update.greasyfork.org/scripts/392528/Disable%20Video%20Popouts.meta.js
// ==/UserScript==

(() => {
  var ans = ["class", "style"];

  function getStyle(e, z) {
    try {
      return getComputedStyle(e)
    } catch(z) {
      return null
    }
  }

  function chkStyle(n, s) {
    return (s = getStyle(n)) && (s.position === "fixed") && (s.left !== "0px") && (s.top !== "0px") && (s.right !== "0px") && (s.bottom !== "0px");
  }

  function chkParentEle(n, s) {
    while (n = n.parentNode) {
      if (chkStyle(n)) {
        n.remove(n);
        break;
      }
    }
  }

  function chkEle(n, s) {
    if (n.tagName) {
      if (n.tagName !== "VIDEO") {
        if (n.querySelector('video')) {
          if (chkStyle(n)) {
            n.remove(n);
          } else chkParentEle(n);
        }
      } else chkParentEle(n);
    }
  }

  (new MutationObserver(recs => {
    recs.forEach((r, i) => {
      r.addedNodes.forEach((n) => chkEle(n));
      if (ans.includes(r.attributeName)) chkEle(r.target);
    });
  })).observe(document, {attributes: true, childList: true, subtree: true});
})();
