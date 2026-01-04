// ==UserScript==
// @name                Alt Click Copy
// @namespace           http://tampermonkey.net/
// @version             0.1.0
// @description         Alt click an HTML element on the page to copy it to your clipboard. Check the following resource to determine if you need to enable browser permissions for clipboard writing https://caniuse.com/mdn-api_clipboard_writetext
// @author              mchpatr
// @match               *://*/*
// @icon                https://github.com/prmichaelsen/alt-click-copy/releases/download/alt-click-copy/save.icon.png
// @run-at              document-start
// @downloadURL https://update.greasyfork.org/scripts/504021/Alt%20Click%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/504021/Alt%20Click%20Copy.meta.js
// ==/UserScript==
(() => {
  document.addEventListener("click", function(event){
    const clickedEl = event.target
    if (event.altKey && clickedEl && clickedEl.textContent) {
      event.preventDefault();
      event.stopPropagation();
      navigator.clipboard.writeText(clickedEl.textContent);
      return false;
    }
  });
})()