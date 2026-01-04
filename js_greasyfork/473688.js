// ==UserScript==
// @name         Inquest - Attack Interceptor
// @description  Intercept attack data and save it to an invisible element on the page for use by other scripts.
// @version      1.1
// @author       PimpChu- [2259700] | Francois Robbertze
// @namespace    https://greasyfork.org/en/users/1156949
// @copyright    none
// @license      MIT
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/473688/Inquest%20-%20Attack%20Interceptor.user.js
// @updateURL https://update.greasyfork.org/scripts/473688/Inquest%20-%20Attack%20Interceptor.meta.js
// ==/UserScript==

(() => {
  "use strict";
  const originalFetch = window.fetch;
  window.fetch = function (input, _) {
    const url = typeof input === "string" ? input : input.url;

    return originalFetch.apply(this, arguments).then((res) => {
      fetchAttackData(url, res);
      return res;
    });
  };
  const fetchAttackData = (url, res) => {
    if (url.includes("sid=")) {
      const sid = url.match(/sid=([^&]*)/)?.[1];
      res
        .clone()
        .json()
        .then((data) => saveToInvisibleElement(data, sid));
      console.log(sid);
    }
  };
  const saveToInvisibleElement = (data, sid) => {
    let container = document.querySelector(`#${sid}`);
    if (!container) {
      container = document.createElement("div");
      container.id = sid;
      container.style.display = "none";
      document.documentElement.appendChild(container);
    }
    container.textContent = JSON.stringify(data);
  };
})();
