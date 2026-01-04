// ==UserScript==
// @name        tianya-lz-only
// @description Hide non-poster posts for tianya.
// @namespace   tz
// @include     http://bbs.tianya.cn/post-worldlook-223829-*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/400512/tianya-lz-only.user.js
// @updateURL https://update.greasyfork.org/scripts/400512/tianya-lz-only.meta.js
// ==/UserScript==

const lz_uid = document.querySelector('div#post_head .js-vip-check').getAttribute('uid');
const all_posts = document.querySelectorAll('#bd div.atl-main div.atl-item[_hostid]');
for (let post of all_posts) {
  if (post.getAttribute('_hostid') !== lz_uid) {
    post.style.display = 'none';
  }
}
