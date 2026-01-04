// ==UserScript==
// @name        Hide Reddit's promoted posts
// @namespace   HideRedditsPromotedPosts
// @author      dpk9
// @description Hide Reddit's promoted links so they don't bother you.
// @include     https://www.reddit.com/
// @include     https://www.reddit.com/r/*
// @version     2.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/382572/Hide%20Reddit%27s%20promoted%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/382572/Hide%20Reddit%27s%20promoted%20posts.meta.js
// ==/UserScript==

function hide_ads() {
    let promos = document.getElementsByTagName("shreddit-ad-post");
    for (let promo of promos) {
        promo.style.display = "none";
    }
}

function init() {
  hide_ads();
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeName === "SHREDDIT-AD-POST") {
          hide_ads();
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

hide_ads()
//Also rerun the code each time document change (i.e new posts are added when user scroll down)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
