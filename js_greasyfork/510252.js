// ==UserScript==
// @name           Full Width Tweets for Twitter
// @namespace      Violentmonkey Scripts
// @match          https://x.com/*
// @match          https://twitter.com/*
// @grant          none
// @version        1.01
// @author         Yukiteru
// @description    Display Tweets in Full-Width
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/510252/Full%20Width%20Tweets%20for%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/510252/Full%20Width%20Tweets%20for%20Twitter.meta.js
// ==/UserScript==


(function() {
  'use strict';

  function applyLayoutStyles() {
    const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
    const primaryColumn = document.querySelector('[data-testid="primaryColumn"]');
    const innerContainer = document.querySelector('main section[role="region"]')?.parentNode;

    sidebar.style.display = 'none';
    primaryColumn.style.maxWidth = 'none';

    if (innerContainer) {
      innerContainer.style.maxWidth = 'none';
      innerContainer.style.marginRight = '0';
    }
  }

  let oldPostCount = 0;
  let postsChecked = false;

  function getPostList() {
    const postList = document.querySelectorAll('main section article');
    return postList;
  }

  function applyButtonStyles() {
    const postList = getPostList();
    postList.forEach(post => {
      const buttonGroup = post.querySelector('div[role="group"]');
      buttonGroup.style.minWidth = '100%';
    })
  }

  function updatePosts() {
    const postCount = getPostList().length;
    if (postCount === oldPostCount) return;
    oldPostCount = postCount;
    applyButtonStyles();
  }

  const observer = new MutationObserver((mutationsList, observer) => {
    const primaryColumn = document.querySelector('[data-testid="primaryColumn"]');
    if (primaryColumn) applyLayoutStyles()
    if (!postsChecked && document.querySelector('main section article')) {
      updatePosts();
      postsChecked = true;
    }
  });

  document.addEventListener('scroll', () => updatePosts());
  observer.observe(document.body, { childList: true, subtree: true });
})();
