// ==UserScript==
// @name         Miniflux detect deleted bluesky posts
// @namespace    https://reader.miniflux.app/
// @version      5
// @description  Makes the External Link unclickable if the bsky post was deleted because opening a deleted post is a waste of time.
// @author       Tehhund
// @match        *://*.miniflux.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=miniflux.app
// @run-at       document-end
// @grant        GM.xmlHttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525344/Miniflux%20detect%20deleted%20bluesky%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/525344/Miniflux%20detect%20deleted%20bluesky%20posts.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

const detect = async () => {
  if (window.location.href.includes(`/entry/`)) { // Only run when viewing a single entry. If this runs when viewing a list of entries it slams bsky with too many requests and triggers HTTP 429 errors.
    const links = [...document.getElementsByTagName(`a`)];
    for (const link of links) {
      if (link.href.includes(`bsky.app`) && link.getAttribute(`data-original-link`) === `true`) {
        const url = link.href;
        console.log(url);
        GM.xmlHttpRequest({
          method: "GET",
          url: url,
          headers: {
            "User-Agent": "Mozilla/5.0",
            "Accept": "text/xml"
          },
          onload: function (response) {
            console.log(response.responseText);
            if (response.responseText.includes`<title>Bluesky</title>`) { // This exact text only appears on deleted posts. Live posts have the user's handle here.
              const newSpan = document.createElement(`span`);
              newSpan.textContent = `No ${link.textContent}`;
              link.insertAdjacentElement(`beforebegin`, newSpan);
              link.remove();
            }
          }
        });
      }
    }
  }
}

detect();