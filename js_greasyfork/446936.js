// ==UserScript==
// @name         Open Source Shadow DOM
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.1.4
// @license      AGPLv3
// @author       jcunews
// @description  Ensure all Shadow DOM nodes are open. Includes workarounds for broken functionality due to Shadow DOM restriction. Intented for research use.
// @match        *://*/*
// @exclude      https://challenges.cloudflare.com/*
// @grant        none
// @inject-into  page
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/446936/Open%20Source%20Shadow%20DOM.user.js
// @updateURL https://update.greasyfork.org/scripts/446936/Open%20Source%20Shadow%20DOM.meta.js
// ==/UserScript==

(d => {
  //fix document.activeElement not able to get element in Shadow DOM
  var dac = (d = Object.getOwnPropertyDescriptor(Document.prototype, "activeElement")).get;
  d.get = function() {
    var p = dac.call(this), n;
    while (n = p.shadowRoot?.activeElement) p = n;
    return p
  };
  Object.defineProperty(Document.prototype, "activeElement", d);

  //make sure Shadow DOMs are open
  var as = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function(opts) {
    if (!window._cf_chl_opt && !document.querySelector('script[src^="https://challenges.cloudflare.com/"]')) {
      var o = {}, m = opts?.mode, r;
      Array.from(Object.entries(opts)).forEach(a => o[a[0]] = a[1]);
      o.mode = "open";
      opts = o;
      r = as.apply(this, arguments);
      if (m === "closed") {
        Object.defineProperty(r, "realMode", {value: "open"});
        Object.defineProperty(r, "mode", {
          get: () => "closed",
          set: v => v
        })
      }
    } else r = as.apply(this, arguments);
    return r
  };

  //fix event not dispatching if it came from element in Shadow DOM
  var dael = Document.addEventListener;
  Document.addEventListener = function(typ, fn) {
    function f(e) {
      if (e.shadowRoot) {
        e.shadowRoot.addEventListener.apply(e.shadowRoot, arguments);
        e.shadowRoot.querySelectorAll('*').forEach(f)
      }
    }
    document.querySelectorAll('body,body *').forEach(f);
    return dael.apply(this, arguments)
  };
})()