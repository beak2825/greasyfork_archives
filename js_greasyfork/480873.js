// ==UserScript==
// @name        Accented letters workaround for WhatsApp on Firefox Linux
// @namespace   Violentmonkey Scripts
// @match       https://web.whatsapp.com/
// @grant       none
// @version     1.0
// @author      André Kugland
// @license     MIT
// @description 11/27/2023, 6:47:56 AM
// @downloadURL https://update.greasyfork.org/scripts/480873/Accented%20letters%20workaround%20for%20WhatsApp%20on%20Firefox%20Linux.user.js
// @updateURL https://update.greasyfork.org/scripts/480873/Accented%20letters%20workaround%20for%20WhatsApp%20on%20Firefox%20Linux.meta.js
// ==/UserScript==

// https://forum.manjaro.org/t/whatsapp-web-deleting-letter-that-starts-with-accent/119772

// This script was created through trial and error. I don’t know why it works, but it does
// work, at least for me in my particular configuration.
(() => {
  const eatevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
  for (const evtype of ["compositionstart", "compositionend"]) {
    document.addEventListener(evtype, (e) => {
      eatevent(e);
      if (evtype == "compositionstart") {
        document.addEventListener("input", eatevent, true);
      }
      if (evtype == "compositionend") {
        document.removeEventListener("input", eatevent, true);
      }
    }, true);
  }
})();