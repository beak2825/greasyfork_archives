// ==UserScript==
// @name          XHR without barriers -- test
// @description   Scripting is fun
// @include       *
// @grant         GM_xmlhttpRequest
// @version 0.0.1.20140828150027
// @namespace https://greasyfork.org/users/4813
// @downloadURL https://update.greasyfork.org/scripts/4644/XHR%20without%20barriers%20--%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/4644/XHR%20without%20barriers%20--%20test.meta.js
// ==/UserScript==


GM_xmlhttpRequest({
  method: "GET",
  url: "http://www.example.net/",
  headers: {
    "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
    "Accept": "text/xml"            // If not specified, browser defaults will be used.
  },
  onload: function(response) {
    var responseXML = null;
    // Inject responseXML into existing Object (only appropriate for XML content).
    if (!response.responseXML) {
      responseXML = new DOMParser()
        .parseFromString(response.responseText, "text/xml");
    }

    console.log([
      response.status,
      response.statusText,
      response.readyState,
      response.responseHeaders,
      response.responseText,
      response.finalUrl,
      responseXML
    ].join("\n"));
  }
});