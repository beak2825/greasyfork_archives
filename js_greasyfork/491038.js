// ==UserScript==
// @name         Profile Pictures in Friend List (Geoguessr)
// @namespace    alienperfect
// @version      1.0
// @description  Shows profile pictures in friend list
// @author       Alien Perfect
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=32&domain=geoguessr.com
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/491038/Profile%20Pictures%20in%20Friend%20List%20%28Geoguessr%29.user.js
// @updateURL https://update.greasyfork.org/scripts/491038/Profile%20Pictures%20in%20Friend%20List%20%28Geoguessr%29.meta.js
// ==/UserScript==

"use strict";

const FRIENDS_API = "https://www.geoguessr.com/api/v3/social/friends/summary";

function main() {
  interceptFetch();
}

function interceptFetch() {
  const _fetch = unsafeWindow.fetch;

  unsafeWindow.fetch = async (resource, options) => {
    const response = await _fetch(resource, options);
    const url = typeof resource === "string" ? resource : resource.url;

    if (url.includes(FRIENDS_API)) {
      try {
        const resp = await response.clone().json();

        for (const friend of resp.friends) {
          const pinPath = friend.pin.url;
          friend.avatar.fullBodyPath = pinPath;
        }

        return new Response(JSON.stringify(resp));
      } catch (e) {
        //
      }
    }

    return response;
  };
}

main();

GM_addStyle(`
	[class*="transparent-avatar_imageWrapper__"],
	[class*="transparent-avatar_background__"] img {
		transform: none !important;
	}
`);
