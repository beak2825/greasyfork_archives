// ==UserScript==
// @name         Reddit media downloader with Cobalt
// @namespace    ViolentMonkey Scripts
// @version      1.0
// @description  Adds a button to download media via Cobalt.tools
// @author       Naviamold
// @license      MIT
// @match        http*://*.reddit.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require      https://greasyfork.org/scripts/476008-waitforkeyelements-gist-port/code/waitforkeyelements%20gist%20port+.js
// @downloadURL https://update.greasyfork.org/scripts/503901/Reddit%20media%20downloader%20with%20Cobalt.user.js
// @updateURL https://update.greasyfork.org/scripts/503901/Reddit%20media%20downloader%20with%20Cobalt.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const getCobalt = (link) => {
    let payload = {
      url: link,
      vQuality: "1080",
      filenamePattern: "basic",
    };

    GM_xmlhttpRequest({
      url: "https://api.cobalt.tools/api/json",
      headers: {
        accept: "application/json",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
      },
      responseType: "json",
      data: JSON.stringify(payload),
      method: "POST",
      onload: function (response) {
        console.log(response.response);
        GM_openInTab(response.response.url);
      },
    });
  };

  waitForKeyElements(
    "shreddit-post[post-type=video]",
    (e) => {
      e.parent().append(`<button id='cobaltDownload'>Cobalt</button>`);
      document
        .getElementById("cobaltDownload")
        .addEventListener("click", () =>
          getCobalt(`https://www.reddit.com${e.attr("permalink")}`)
        );
    },
    false
  );
})();
