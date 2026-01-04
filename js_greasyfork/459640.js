// ==UserScript==
// @name         Pure Bing Addon
// @name:en      Pure Bing Addon
// @namespace    
// @version      1.0.2
// @license      AGPLv3
// @author       jcunews
// @description     使 Stylus 样式也可应用于 Shadow DOM 元素。
// @description:en  Make Stylus styles also be applied to Shadow DOM elements.
// @match        *://*.bing.com/search?*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/459640/Pure%20Bing%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/459640/Pure%20Bing%20Addon.meta.js
// ==/UserScript==

var style = document.createElement('style');
style.setAttribute("id","stylus-62");
style.textContent = `
cib-see-more-container, #waitListDefault {
    background: var(--bg2);
}
cib-feedback, .ac-container a.tooltip-target.hover, .ac-container span.tooltip-target.hover,
.container {
    background: var(--bg3);
}

#waitListDefault {
    color: var(--fg1);
}
.content .ac-container .ac-textBlock *, div[aria-label="Learn more:"] span {
    color: var(--fg2) !important;
}

#waitListDefault.containerWidth .actionContainer .link.secondary {
    color: var(--blue);
}

.fade {
    background: linear-gradient(rgba(249, 249, 249, 0) 0%, var(--bg2) calc(100% - 28px)) !important;
}
body {
    --cib-color-brand-gradient-core: linear-gradient(81.62deg, var(--blue) 8.72%, var(--green) 85.01%);
    --cib-color-brand-solid-denim: var(--blue);
}
#waitListDefault .actionContainer .link.primary {
    background: var(--cib-color-brand-gradient-core);
}`;
// document.body.appendChild(style);


((updDelay, ass, eas, at) => {
  function chkNode(e) {
    return (e.tagName === "STYLE") && /^stylus-/.test(e.id)
  }
  function applyStylus(ss) {
    ss = document.querySelectorAll('html>style[id^="stylus-"]');
    ass.forEach(e => {
      if (!e.shadowRoot) return;
      Array.from(e.shadowRoot.children).forEach(el => chkNode(el) && el.remove());
      // ss.forEach(el => e.shadowRoot.append(el.cloneNode(true)))
      e.shadowRoot.append(style.cloneNode(true))
    })
  }
  updDelay = 500;
  ass = [];
  eas = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function() {
    !ass.includes(this) && ass.push(this);
    clearTimeout(at);
    at = setTimeout(applyStylus, updDelay);
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
      });
    });
    if (b) {
      clearTimeout(at);
      at = setTimeout(applyStylus, updDelay);
    }
  })).observe(document.documentElement, {childList: true});
})();
