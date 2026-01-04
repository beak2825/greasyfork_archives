// ==UserScript==
// @name         NYTimes unpaywall
// @namespace    phocks
// @version      0.1.3
// @description  no subcribe popover to bother reader on nytimes.com
// @author       phocks
// @match        *://www.nytimes.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466193/NYTimes%20unpaywall.user.js
// @updateURL https://update.greasyfork.org/scripts/466193/NYTimes%20unpaywall.meta.js
// ==/UserScript==

GM_addStyle(`
  #site-content,
  .css-mcm29f {
    position: unset !important;
  }
  #gateway-content {
    display: none;
  }
  .css-gx5sib {
    display: none;
  }
`);

(function () {
  "use strict";

  const intervalId = setInterval(function () {
    const meteredContent = document.querySelector(".meteredContent");
    if (meteredContent !== null) {
      clearInterval(intervalId);

      let mutationsRemoved = [];
      let timeoutId;

      // Handle mutations to the metered content
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.removedNodes.length > 0) {
            mutationsRemoved.push(mutation);
            // Reset the timeout to delay the execution of the function
            console.log(mutationsRemoved);
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
              observer.disconnect();
              mutationsRemoved.forEach((mutation) => {
                mutation.target.appendChild(mutation.removedNodes[0]);
              });
            }, 3000);
          }
        });
      });

      // Start observing the metered content
      observer.observe(meteredContent, { childList: true, subtree: true });
    }
  }, 10);

  setTimeout(function () {
    clearInterval(intervalId);
  }, 5000);
})();
