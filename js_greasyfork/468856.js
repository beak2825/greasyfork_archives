// ==UserScript==
// @namespace   aydym.com free
// @name        aydym.com
// @locale      en-En
// @description free aydym.com
// @match         *://aydym.com/*
// @grant       none
// @version     1.0
// @author      -
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aydym.com
// @run-at      document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468856/aydymcom.user.js
// @updateURL https://update.greasyfork.org/scripts/468856/aydymcom.meta.js
// ==/UserScript==

class myXMLHttpRequest extends XMLHttpRequest {
  constructor() {
    super();
    this.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.responseURL.startsWith("https://aydym.com/api/v1/app/settings")) {
          const response = JSON.parse(this.responseText);
          if ("premiumEnabled" in response) {
            response.premiumEnabled = true;
          }
          Object.defineProperty(this, "responseText", {
            value: JSON.stringify(response),
          });
        }
        if (this.responseURL.startsWith("https://aydym.com/api/v1/profile")) {
          const response = JSON.parse(this.responseText);
          if ("profileType" in response) {
            response.profileType = "PREMIUM";
          }
          Object.defineProperty(this, "responseText", {
            value: JSON.stringify(response),
          });
        }
      }
    };
  }
}

XMLHttpRequest = myXMLHttpRequest;
