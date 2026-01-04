// ==UserScript==
// @name           Reddit Fix RTL
// @version        1.0
// @description    Script that fixes Arabic language in Reddit
// @author         me
// @match          https://*.reddit.com/*
// @namespace https://greasyfork.org/users/1348053
// @downloadURL https://update.greasyfork.org/scripts/503045/Reddit%20Fix%20RTL.user.js
// @updateURL https://update.greasyfork.org/scripts/503045/Reddit%20Fix%20RTL.meta.js
// ==/UserScript==

(function () {
  function logger(text) {
    console.log(`Arabic Reddit: ${text}`);
  }

  function addStyle(styleString) {
    const style = document.createElement("style");
    style.textContent = styleString;
    document.head.append(style);
  }

  function fixDir() {
    logger(`fixing dir`);

    // Fix direction in CSS
    addStyle(`
          p, h1, a, .title.may-blank,h2  {
            unicode-bidi: plaintext;
            text-align: start;
          }`);
  }

  function fixArabic() {
    fixDir();
  }

  fixArabic();
})();
