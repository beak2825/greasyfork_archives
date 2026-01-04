// ==UserScript==
// @name         Hide IP Address
// @namespace    https://greasyfork.org/users/831955
// @version      0.1
// @description  Hide your IP Address on speedtest.net!
// @author       DanPlayz0
// @match        https://www.speedtest.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=speedtest.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466260/Hide%20IP%20Address.user.js
// @updateURL https://update.greasyfork.org/scripts/466260/Hide%20IP%20Address.meta.js
// ==/UserScript==

(async function () {
  'use strict';
  function waitForElm(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(mutations => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
  await waitForElm(".ispComponent .result-data");
  let ipAddress = document.querySelector(".ispComponent .result-data").innerText;

  document.addEventListener('click', (e) => {
    if (e.srcElement.id == "ip-reveal-btn") {
      e.srcElement.parentNode.className += " ip-revealed";
      e.srcElement.parentNode.innerHTML = ipAddress;
    }
  });

  setInterval(() => {
    const ispComponentIP = document.querySelector(".ispComponent .result-data");
    if (ispComponentIP && !ispComponentIP.className.includes("ip-revealed") && ispComponentIP.innerText.includes(ipAddress)) {
      ispComponentIP.innerHTML = '<a id="ip-reveal-btn">Click to reveal</a>';
    }

    const resultDataIP = document.querySelector(".js-data-ip");
    if (resultDataIP && !resultDataIP.className.includes("ip-revealed") && resultDataIP.innerText.includes(ipAddress)) {
      resultDataIP.innerHTML = '<a id="ip-reveal-btn">Click to reveal</a>';
    }
  }, 10);
})();