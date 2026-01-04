// ==UserScript==
// @name         Stylus Shadow DOM Support
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.9
// @license      AGPLv3
// @author       jcunews
// @description  Make Stylus styles also be applied to Shadow DOM elements.
// @match        *://*/*
// @include      *:*
// @exclude      https://challenges.cloudflare.com/*
// @inject-into  page
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/424030/Stylus%20Shadow%20DOM%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/424030/Stylus%20Shadow%20DOM%20Support.meta.js
// ==/UserScript==

((updDelay, ass, eas, at) => {
  function chkNode(e) {
    return e && e.matches?.('html>style:is([class="stylus"],[id^="stylus-"])')
  }
  function applyStylus(ss) {
    ss = document.querySelectorAll('html>style:is([class="stylus"],[id^="stylus-"])');
    ass.forEach(e => {
      if (!e.shadowRoot) return;
      Array.from(e.shadowRoot.children).forEach(el => el.matches('style:is([class="stylus"],[id^="stylus-"])') && el.remove());
      ss.forEach(el => e.shadowRoot.append(el.cloneNode(true)))
    })
  }
  updDelay = 500;
  ass = [];
  if (!(eas = Element.prototype.attachShadow)) return;
  Element.prototype.attachShadow = function(opt) {
    if (!window._cf_chl_opt && !document.querySelector('script[src^="https://challenges.cloudflare.com/"]')) {
      if (opt) {
        opt.mode = "open"
      } else opt = {mode: "open"};
      !ass.includes(this) && ass.push(this);
      clearTimeout(at);
      at = setTimeout(applyStylus, updDelay)
    }
    return eas.apply(this, arguments)
  };
  at = 0;
  if (!document.documentElement) return;
  (new MutationObserver(function(recs, b) {
    recs.forEach(rec => {
      rec.addedNodes.forEach(e => {
        if (!chkNode(e)) return;
        (e.obs = new MutationObserver(function(recs, b) {
          clearTimeout(at);
          at = setTimeout(applyStylus, updDelay);
        })).observe(e, {characterData: true, subtree: true});
        b = true
      });
      rec.removedNodes.forEach(e => {
        if (!e.obs) return
        e.obs.disconnect();
        b = true
      })
    });
    if (b) {
      clearTimeout(at);
      at = setTimeout(applyStylus, updDelay)
    }
  })).observe(document.documentElement, {childList: true})
})()
