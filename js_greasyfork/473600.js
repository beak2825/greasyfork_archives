// ==UserScript==
// @name TikTok Livestream Url
// @version 0.1.0
// @license GNU GPLv3
// @description Get current TikTok livestream url
// @author Skojaren
// @supportURL https://t.me/skojaren
// @namespace https://greasyfork.org/users/980311
// @match https://www.tiktok.com/live
// @match https://www.tiktok.com/@*/live
// @grant GM_notification
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/473600/TikTok%20Livestream%20Url.user.js
// @updateURL https://update.greasyfork.org/scripts/473600/TikTok%20Livestream%20Url.meta.js
// ==/UserScript==

const fragments = [
  'https://webcast.tiktok.com/webcast/room/enter/',
];

((fetch) => {
  unsafeWindow.fetch = async (...args) => {
    const response = await fetch(...args);
    if (!response) return;
    if (!response.url.includes(fragments[0])) return response;
    await response
      .clone()
      .json()
      .then(body => {
        GM_notification({
          text: body.data.stream_url.rtmp_pull_url,
          title: `@${body.data.owner.display_id} (${body.data.owner.id})`,
          onclick: () => GM_setClipboard(body.data.stream_url.rtmp_pull_url, 'text/plain')
        });
      })
      .catch(err => console.error(err));
    return response;
  };
})(unsafeWindow.fetch);
