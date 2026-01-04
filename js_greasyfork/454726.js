// ==UserScript==
// @name         missav disable pop window
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hello world
// @author       ayasetan
// @match        https://missav.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/454726/missav%20disable%20pop%20window.user.js
// @updateURL https://update.greasyfork.org/scripts/454726/missav%20disable%20pop%20window.meta.js
// ==/UserScript==

(() => {
  const w = unsafeWindow || window;
  const main = () => {
    for (const div of Array.from(document.querySelectorAll('div'))){
      if (div.outerHTML.includes('pop()')) {
        div.removeAttribute('@click.once')
        
      }

    }

  };
  main();
})();