// ==UserScript==
// @name         记录当前的Tab
// @namespace    https://liujiale.me
// @version      0.1.4
// @description Store Latest visited Tab into local HTTP server
// @author       nailuoGG
// @connect      localhost
// @match        https://*/*
// @grant          GM_xmlhttpRequest
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/458240/%E8%AE%B0%E5%BD%95%E5%BD%93%E5%89%8D%E7%9A%84Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/458240/%E8%AE%B0%E5%BD%95%E5%BD%93%E5%89%8D%E7%9A%84Tab.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var oldHref = location.href;
  var title = document.title;
  function track() {
    if (document.hidden) {
      return;
    }
    var requestDetails = {
      method: "POST",
      url: "http://localhost:8000/v1/echo",
      data: JSON.stringify({
        url: oldHref,
        title: title
      }),
      headers: {
        "Content-Type": "application/json"
      },
      onload: function (response) {

      },
      onerror: function (err) {
        console.log('报错啦', err)
      }
    }
    GM_xmlhttpRequest(requestDetails);
  };
  if (document.addEventListener) {
    document.addEventListener("visibilitychange", track)
  }
  track();
})();
