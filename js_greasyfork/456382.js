// ==UserScript==
// @name        Override HTML Standard Form Submission Result To Current Or New Tab
// @namespace   https://greasyfork.org/en/users/85671-jcunews
// @version     1.0.2
// @license     AGPL v3
// @author      jcunews
// @description Make HTML standard form submission result be loaded in either the current tab (SHIFT key held), or in a new window (CTRL key held), when submitting the form. This script won't work on forms which don't use HTML standard form submission. e.g. AJAX.
// @match       *://*/*
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/456382/Override%20HTML%20Standard%20Form%20Submission%20Result%20To%20Current%20Or%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/456382/Override%20HTML%20Standard%20Form%20Submission%20Result%20To%20Current%20Or%20New%20Tab.meta.js
// ==/UserScript==

(keys => {
  keys = {Shift: false, Control: false, Alt: false};
  function ovr(f, n) {
    f.dataset.tgt = f.target;
    f.target = n;
    setTimeout(() => {
      f.target = f.dataset.tgt;
      delete f.dataset.tgt
    }, 100)
  }
  function chk(f) {
    if ((f.dataset.tgt === undefined) && !keys.Alt) {
      if (keys.Shift && !keys.Control) {
        ovr(f, "")
      } else if (keys.Control && !keys.Shift) ovr(f, "_blank")
    }
  }
  function reset() {
    keys = {Shift: false, Control: false, Alt: false}
  }
  addEventListener("submit", ev => chk(ev.target), true);
  addEventListener("click", ev => ev.target?.form && chk(ev.target.form), true);
  addEventListener("keydown", ev => {
    if (ev.key === "Enter") {
      if (ev.target?.form) chk(ev.target.form)
    } else if (ev.key in keys) keys[ev.key] = true
  }, true);
  addEventListener("keyup", ev => (ev.key in keys) && (keys[ev.key] = false), true);
  addEventListener("blur", reset);
  addEventListener("focus", reset)
})()
