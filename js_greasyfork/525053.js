// ==UserScript==
// @name        Copy title
// @namespace   https://defaultcf.github.io
// @match       https://*/*
// @grant       none
// @version     0.2
// @author      defaultcf
// @description Add copy title keyboard shortcut, ctrl + ]
// @license     MIT
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @downloadURL https://update.greasyfork.org/scripts/525053/Copy%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/525053/Copy%20title.meta.js
// ==/UserScript==

(() => {
  const { register } = VM.shortcut;

  const copyTitle = async () => {
    const text = `${document.title} ${location.href}`;
    await navigator.clipboard.writeText(text);
    alert("copied!");
  }

  VM.shortcut.register("c-]", copyTitle);
})();
