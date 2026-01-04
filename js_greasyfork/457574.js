// ==UserScript==
// @name        Event Control
// @namespace   https://greasyfork.org/en/users/85671-jcunews
// @version     1.0.2
// @license     AGPL v3
// @author      jcunews
// @description Provides ability to enable/disable specific events (accessible from GM menu) on a site page which are specifically listened by the site and browser extensions. When an event is disabled, event handlers including the web browser's, will be disabled.
// @match       *://*/*
// @include     *:*
// @grant       GM_registerMenuCommand
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/457574/Event%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/457574/Event%20Control.meta.js
// ==/UserScript==

//Note: Since web browsers do not provide an execution order or load order for browser extensions,
//      event handlers from browser extensions can not be disabled if their code is run before this script.

((evs, ael) => {
  evs = {};
  function eventGate(ev) {
    if ((!ev.target || !ev.target.closest || !ev.target.closest("#selc_ujs")) && (ev.type in evs) && !evs[ev.type]) {
      ev.stopImmediatePropagation();
      ev.stopPropagation();
      ev.preventDefault()
    }
  }
  ael = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(typ, fn, opts) {
    let s = String(typ);
    if (s && !(s in evs)) ael.call(this, typ, eventGate, {capture: evs[s] = true, passive: false});
    return ael.apply(this, arguments)
  };
  GM_registerMenuCommand("Event List", () => {
    document.documentElement.insertAdjacentHTML("beforeend", `
  <div id="selc_ujs"><style>
  #selc_ujs, #selc_ujs *{all:revert;box-sizing:border-box;font-family:sans-serif}
  #selc_ujs{position:fixed;left:0;top:0;width:100vw;height:100vh;background:#0007;cursor:pointer}
  #selc_pop{position:absolute;right:2em;border:.2em solid #007;border-radius:.3em;padding:.3em;max-height:75vh;overflow-y:scroll;background:#fff;cursor:auto}
  #selc_pop label{display:block;padding-right:.3em}
  #selc_pop label:hover{background:#ddf}
  </style><div id="selc_pop">${
  Object.keys(evs).sort().map(k => `<label><input ${evs[k] ? "checked" : ""} type="checkbox" data-key="${k}"/> ${k}</label>`).join("")
  }</div>`);
    selc_ujs.onclick = ev => {
      (ev.target === selc_ujs) && selc_ujs.remove()
    };
    selc_ujs.addEventListener("input", ev => {
      evs[ev.target.dataset.key] = ev.target.checked
    });
    document.activeElement && document.activeElement.blur()
  })
})()
