// ==UserScript==
// @name         RevertGrayStyleWebsites
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Revert Gray Style Websites.
// @match        *://*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455679/RevertGrayStyleWebsites.user.js
// @updateURL https://update.greasyfork.org/scripts/455679/RevertGrayStyleWebsites.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const observer = new MutationObserver(() => {
    window.onload = (event) => {
      document.querySelector("html").style.filter = "none";
      document.querySelector("body").style.filter = "none";
      let all = document.querySelectorAll("body > *");
      console.log(typeof all, all);
      for (const key in all) {
        const element = all[key];
        element.style.filter = "none";
      }
    };
  });
  const config = { subtree: true, childList: true };
  observer.observe(document, config);
})();
