// ==UserScript==
// @name        Mastodon Trending posts 辅助脚本
// @namespace   https://blog.bgme.me/
// @icon        https://bgme.me/favicon.ico
// @match       https://bgme.me/admin/trends/statuses
// @match       https://bgme.bid/admin/trends/statuses
// @grant       GM_xmlhttpRequest
// @version     1.0
// @author      bgme
// @description 在待审查流行嘟文条目下标注该用户注册时间、嘟文数、正在关注数、关注者数
// @inject-into content
// @license     AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/444429/Mastodon%20Trending%20posts%20%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/444429/Mastodon%20Trending%20posts%20%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

Array.from(document.querySelectorAll('.batch-table__row--attention .pending-account__header a.name-tag')).map((a) => {
  const id = a.href.split('/').slice(-1)[0];
  const account__header = a.parentElement.parentElement;

  GM_xmlhttpRequest({
    url: `${document.location.origin}/api/v1/accounts/${id}`,
    responseType: 'json',
    onload: (raw) => {
      const data = raw.response;
      const detail = `${data.created_at.split('T')[0]} • ${data.statuses_count} Posts • ${data.following_count} Following • ${data.followers_count} Followers`;
      account__header.appendChild(document.createElement('br'));
      account__header.appendChild(document.createTextNode(detail));
    }
  })
})