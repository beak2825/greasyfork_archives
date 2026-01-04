// ==UserScript==
// @name         Bypass Glassdoor Login
// @version      0.1
// @description  Remove gd-hardsell elements on Glassdoor
// @author       Petros Dhespollari
// @match        *://*.glassdoor.com/*
// @grant        GM_xmlhttpRequest
// @license      Creative Commons Attribution-ShareAlike 4.0 International License
// @namespace https://greasyfork.org/users/1280675
// @downloadURL https://update.greasyfork.org/scripts/491103/Bypass%20Glassdoor%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/491103/Bypass%20Glassdoor%20Login.meta.js
// ==/UserScript==

(function() {
  // Create an object URL to bypass CORS restrictions
  const blockedResponse = URL.createObjectURL(new Blob([""], { type: "text/plain" }));

  // Intercept all requests from the page
  const originalXmlHttpRequestOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    this._url = url;
    return originalXmlHttpRequestOpen.apply(this, arguments);
  };

  const originalXmlHttpRequestSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function() {
    const requestUrl = this._url;

    // Check if the request URL matches the custom filter pattern
    if (/^\https?:\/\/[^/]+\.glassdoor\.com\/.+?\/gd-hardsell/.test(requestUrl)) {
      // Block the request and return an empty response
      this.addEventListener("load", function() {
        this.responseText = "";
      });

      GM_xmlhttpRequest({
        method: this.method,
        url: blockedResponse,
        onload: function(response) {
          const event = new ProgressEvent("load");
          this.dispatchEvent(event);
        }.bind(this),
      });

      return;
    }

    return originalXmlHttpRequestSend.apply(this, arguments);
  };

})();