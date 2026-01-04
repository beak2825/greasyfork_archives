// ==UserScript==
// @name         test gm_xhr
// @namespace    https://hust.cc/
// @version      1.3
// @description  test gm_xhr test gm_xhr
// @author       hust.cc
// @grant        GM.xmlHttpRequest
// @include      *://*/*
// @connect 	  com
// @downloadURL https://update.greasyfork.org/scripts/431212/test%20gm_xhr.user.js
// @updateURL https://update.greasyfork.org/scripts/431212/test%20gm_xhr.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

  GM.xmlHttpRequest({
  method: "GET",
  url: "https://sa.alibaba-inc.com/user/home.jsx",
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
})();

