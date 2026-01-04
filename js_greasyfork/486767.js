// ==UserScript==
// @name TikTok Following Livestreams
// @description Extracts live TikTokers that you follow
// @version 0.1.0
// @license GNU GPLv3
// @author Skojaren
// @supportURL https://t.me/skojaren
// @namespace https://greasyfork.org/users/980311
// @match https://www.tiktok.com/live
// @grant GM_notification
// @grant GM_setClipboard
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/486767/TikTok%20Following%20Livestreams.user.js
// @updateURL https://update.greasyfork.org/scripts/486767/TikTok%20Following%20Livestreams.meta.js
// ==/UserScript==

const fragments = [
  'https://webcast.tiktok.com/webcast/feed/',
  '&content_type=1',
];
const refreshInMinutes = 20;
const serverUrl = 'http://localhost:3000';

(setTimeout(() => {
  location.reload();
}, refreshInMinutes*60*1000));

((fetch) => {
  unsafeWindow.fetch = async (...args) => {
    const response = await fetch(...args);
    if (!response) return;
    if (!response.url.includes(fragments[0])) return response;
    if (!response.url.includes(fragments[1])) return response;
    await response
    .clone()
    .json()
    .then(body => {
      if (!body) return;
      if (!body.data) return;
      let data = body.data;
      if (!data.length) return;

      let rooms = [];
      data.forEach((item) => {
        if (!item) return;
        if (!item.data) return;
        let stream = item.data;
        if (!stream) return;

        let avatars = stream.owner.avatar_large.url_list;
        let avatar = avatars[avatars.length - 1];

        rooms.unshift({
          'id': stream.id_str,
          'owner': {
            'avatar': avatar,
            'description': stream.owner.bio_description,
            'followers': stream.owner.follow_info.follower_count,
            'following': stream.owner.follow_info.following_count,
            'id': stream.owner.id_str,
            'nick': stream.owner.nickname,
            'sec_uid': stream.owner.sec_uid,
            'username': stream.owner.display_id,
          },
          'title': stream.title,
          'url': stream.stream_url.rtmp_pull_url,
          'viewers': stream.user_count,
        });
      });

      GM_xmlhttpRequest({
        method: 'POST',
        url: serverUrl,
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ 'rooms': rooms }),
        onload: (res) => {
          console.log(JSON.parse(res.responseText));
        },
      });
    })
    .catch(err => console.error(err));
    return response;
  };
})(unsafeWindow.fetch);
