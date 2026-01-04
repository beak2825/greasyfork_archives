// ==UserScript==
// @name        Facebook J.K. Scrolling
// @namespace   dutzi.party
// @match       https://www.facebook.com/
// @grant       none
// @version     1.2
// @author      dutzi
// @description 4/17/2020, 2:32:33 AM
// @downloadURL https://update.greasyfork.org/scripts/401114/Facebook%20JK%20Scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/401114/Facebook%20JK%20Scrolling.meta.js
// ==/UserScript==

(() => {
  let focusedPost = -1;

  function getPostFromFeedUnit(feedUnit) {
    return feedUnit.querySelector('[role="article"]').parentElement;
  }

  function getPostAtIndex(index) {
    const feedUnits = document.querySelectorAll('[data-pagelet^="FeedUnit"]');

    if (!feedUnits) {
      return;
    }

    const feedUnit = feedUnits[focusedPost];

    if (!feedUnit) {
      return;
    }

    return getPostFromFeedUnit(feedUnit);
  }

  function highlightFocusedPost({ isScrollingDown }) {
    const post = getPostAtIndex(focusedPost);

    if (!post) {
      return;
    }

    post.style.boxShadow = '0px 0px 0px 3px #03A9F4';
    post.style.borderRadius = '10px';

    post.scrollIntoView({
      behavior: 'smooth',
      block: isScrollingDown ? 'end' : 'start',
    });
  }

  function concealFocusedPost() {
    const post = getPostAtIndex(focusedPost);

    if (!post) {
      return;
    }

    post.style.boxShadow = '';
    post.style.borderRadius = '';
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'j') {
      concealFocusedPost();
      focusedPost++;
      highlightFocusedPost({ isScrollingDown: true });
    }

    if (e.key === 'k') {
      concealFocusedPost();
      focusedPost = Math.max(focusedPost - 1, 0);
      highlightFocusedPost({ isScrollingDown: false });
    }
  });

  document.addEventListener('click', (e) => {
    const feedUnit = e.target.closest('[data-pagelet^="FeedUnit"]');

    if (!feedUnit) {
      return;
    }

    concealFocusedPost();

    focusedPost =
      Array.from(feedUnit.parentElement.children).indexOf(feedUnit) - 1;
  });
})();
