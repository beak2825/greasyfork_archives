// ==UserScript==
// @name         Instagram Keyboard Shortcuts for Power User
// @namespace    http://tampermonkey.net/
// @version      2.6.1
// @description  Scroll through posts with J/K keys, like with L, save with O, control videos with U/I/M/Space.
// @author       French Bond
// @license      MIT
// @match        https://www.instagram.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/395616/Instagram%20Keyboard%20Shortcuts%20for%20Power%20User.user.js
// @updateURL https://update.greasyfork.org/scripts/395616/Instagram%20Keyboard%20Shortcuts%20for%20Power%20User.meta.js
// ==/UserScript==

// Credits:
// Thanks to Med X for improvements to input field focus tracking

/* globals jQuery, $ */
/* jshint esversion: 6 */

$(function () {
  'use strict';

  let seeAll = true;
  let currentArticle = null;
  let searchFocused = false;
  let scrolling = false;
  let slideshowInterval;
  let isSlideshow = false;

  const fastForward = 2;
  const rewind = 1;
  const headerHeight = 10;
  const scrollSpeed = 200;

  // ----------------------------
  // Helper Functions
  // ----------------------------

  function startSlideshow() {
    isSlideshow = true;
    slideshowInterval = setInterval(() => {
      findAndClickButton('Next');
    }, 5000);
  }

  function stopSlideshow() {
    isSlideshow = false;
    clearInterval(slideshowInterval);
  }

  // Track focus on input fields to avoid interfering with typing
  $(document).on(
    'focus',
    'input, textarea, [contenteditable="true"], [role="textbox"]',
    () => {
      searchFocused = true;
    }
  );
  $(document).on(
    'blur',
    'input, textarea, [contenteditable="true"], [role="textbox"]',
    () => {
      searchFocused = false;
    }
  );

  // Function to determine the current page
  function getCurrentPage() {
    const url = window.location.href;
    if (url === 'https://www.instagram.com/') return 'home';
    if (url.includes('?variant=favorites')) return 'favorites';
    if (url.includes('?variant=following')) return 'following';
    if (url.includes('/reels/')) return 'reels';
    if (url.includes('/p/')) return 'post';
    if (url.includes('/saved/')) return 'saved';
    if (url.includes('/explore/')) return 'explore';
    if (url.includes('/accounts/')) return 'profile';
    if (url.includes('/explore/tags/')) return 'tag';
    if (url.includes('/explore/locations/')) return 'location';
    if (url.includes('/tv/')) return 'igtv';
    return 'unknown';
  }

  // Function to check if an element is visible
  function isVisible(element) {
    if (!element) return false;

    const style = window.getComputedStyle(element);

    // Check if the element has zero size
    const hasSize = !!(
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );

    // Check visibility-related CSS properties
    const isNotHidden =
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0';

    return hasSize && isNotHidden;
  }

  // Function to find and control video
  function findAndControlVideo(action) {
    const video = $(currentArticle).find('video')[0];
    if (video) {
      switch (action) {
        case 'playPause':
          video.paused ? video.play() : video.pause();
          break;
        case 'rewind':
          video.currentTime -= rewind;
          break;
        case 'fastForward':
          video.currentTime += fastForward;
          break;
        case 'muteUnmute':
          const muteButton = $(currentArticle).find(
            '[aria-label="Toggle audio"]'
          );
          if (muteButton.length) muteButton.click();
          break;
      }
    }
  }

  function findTopVideo() {
    let closestVideo = null;
    let closestDistance = Infinity;
    $('video').each(function () {
      const rect = this.getBoundingClientRect();
      const distance = Math.abs(rect.top);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestVideo = this;
      }
    });
    return closestVideo;
  }

  function scrollTo(pageY) {
    scrolling = true;
    $('html, body').animate(
      { scrollTop: pageY },
      {
        duration: scrollSpeed,
        done: () => {
          scrolling = false;
        },
      }
    );
  }

  // Function to find and click a button
  function findAndClickButton(ariaLabel) {
    const button =
      document.querySelector(`article button[aria-label="${ariaLabel}"]`) ||
      document.querySelector(`button:has(svg[aria-label="${ariaLabel}"])`) ||
      document.querySelector(`div.html-div button[aria-label="${ariaLabel}"]`);

    button?.click();
  }

  // ----------------------------
  // Keyboard Shortcuts
  // ----------------------------

  function homeKeyboardShortcuts(e) {
    switch (e.keyCode) {
      case 65: // A - Toggle see all
        seeAll = !seeAll;
        break;
      case 74: // J - Scroll down or next post
        if (seeAll && $(currentArticle).find('[aria-label="Next"]').length) {
          $(currentArticle).find('[aria-label="Next"]').click();
        } else {
          $('article').each(function (index, article) {
            const top = $(article).offset().top - headerHeight;
            if (isVisible(article) && top > $(window).scrollTop() + 1) {
              scrollTo(top);
              currentArticle = article;
              return false;
            }
          });
        }
        break;
      case 75: // K - Scroll up
        if (seeAll && $(currentArticle).find('[aria-label="Go Back"]').length) {
          $(currentArticle).find('[aria-label="Go Back"]').click();
        } else {
          let previousArticle = null;
          $('article').each(function (index, article) {
            const top = $(article).offset().top - headerHeight;
            if (
              isVisible(article) &&
              top > $(window).scrollTop() - headerHeight - 20
            ) {
              if (previousArticle) {
                scrollTo($(previousArticle).offset().top - headerHeight);
                currentArticle = previousArticle;
              }
              return false;
            }
            previousArticle = article;
          });
        }
        break;
      case 76: // L - Like
        $('[aria-label="Like"],[aria-label="Unlike"]', currentArticle)
          .parent()
          .click();
        break;
      case 79: // O - Save
        const firstElement = $(
          '[aria-label="Save"],[aria-label="Remove"]',
          currentArticle
        )[0];
        $(firstElement).parent().click();
        break;
      case 32: // Space - Play/pause video
        findAndControlVideo('playPause');
        break;
      case 85: // U - Rewind
        findAndControlVideo('rewind');
        break;
      case 73: // I - Fast forward
        findAndControlVideo('fastForward');
        break;
      case 77: // M - Mute/unmute video
        findAndControlVideo('muteUnmute');
        break;
    }
  }

  function postKeyboardShortcuts(e) {
    switch (e.keyCode) {
      case 74: // J - Next
        findAndClickButton('Next');
        break;
      case 75: // K - Previous
        findAndClickButton('Go back');
        break;
      case 32: // Space - Toggle slideshow
        isSlideshow ? stopSlideshow() : startSlideshow();
        break;
    }
  }

  // Keyboard shortcuts for Reels page
  function reelsKeyboardShortcuts(e) {
    switch (e.keyCode) {
      case 39: // Right arrow - Fast forward
        const videoFF = findTopVideo();
        if (videoFF) videoFF.currentTime += fastForward;
        break;
      case 37: // Left arrow - Rewind
        const videoRW = findTopVideo();
        if (videoRW) videoRW.currentTime -= rewind;
        break;
    }
  }

  // ----------------------------
  // Main Keydown Handler
  // ----------------------------
  $('body').keydown(function (e) {
    // Disable if searchFocused, scrolling, or focus is in a contenteditable element (or its parent)
    if (
      searchFocused ||
      scrolling ||
      $(e.target).closest(
        '[contenteditable="true"], input, textarea, [role="textbox"]'
      ).length > 0
    )
      return;

    // Ignore browser/system shortcuts
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    const handledKeys = [65, 74, 75, 76, 79, 32, 85, 73, 77, 37, 39]; // A, J, K, L, O, Space, U, I, M, Left, Right
    if (handledKeys.includes(e.keyCode)) {
      e.preventDefault();
      document.activeElement.blur();
    }

    const currentPage = getCurrentPage();
    console.log('Current page:', currentPage);

    switch (currentPage) {
      case 'home':
      case 'favorites':
      case 'following':
        homeKeyboardShortcuts(e);
        break;
      case 'reels':
        reelsKeyboardShortcuts(e);
        break;
      case 'post':
        postKeyboardShortcuts(e);
        break;
    }
  });
});
