// ==UserScript==
// @name        emacs-china user blocker
// @namespace   https://liujiacai.net/
// @match       https://emacs-china.org/
// @grant       none
// @version     1.0
// @author      https://github.com/jiacai2050
// @description Emacs-China 论坛，屏蔽指定用户的帖子
// @icon        https://emacs-china.org/uploads/default/optimized/2X/d/dd05943671ee57856f9d7fa7ba6497f31bfcd332_2_180x180.png
// @downloadURL https://update.greasyfork.org/scripts/429688/emacs-china%20user%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/429688/emacs-china%20user%20blocker.meta.js
// ==/UserScript==


// users id your want to block
const blockedUsers = [];
const prefix = 'https://emacs-china.org/u/';

let seenPostCount = 0;

function removeBlockedPosts() {
  const allPosts = document.querySelectorAll('td.posters a');
  console.log(allPosts.length);
  if (seenPostCount >= allPosts.length) {
    // console.log('already removed, return directly');
    return;
  }
  const oldLength = seenPostCount;
  seenPostCount = allPosts.length;
  for (let i=oldLength;i<allPosts.length;i++) {
    const post = allPosts[i];
    const url = post.href;
    for (blocked of blockedUsers) {
      const userLink = prefix + blocked;
      if (url === userLink) {
        const tr = post.parentNode.parentNode;
        const titleLink = tr.firstElementChild.firstElementChild.firstElementChild;
        console.log(`remove post: ${titleLink.textContent}, url: ${titleLink.href}, by ${blocked}`);
        tr.remove();
      }
    }
  }
}

window.addEventListener('wheel', removeBlockedPosts);
window.addEventListener('load', removeBlockedPosts);