// ==UserScript==
// @name        Auto-Udemy
// @namespace   Violentmonkey Scripts
// @match       https://ua.udemy.com/course/*
// @icon        https://cdn2.steamgriddb.com/icon_thumb/a7be1228195896ae985f9c015fbe7af8.png
// @grant       none
// @version     2.1
// @author      Some ukranon 🇺🇦
// @license MIT
// @description Allows you to automatically skip videos and articles
// @downloadURL https://update.greasyfork.org/scripts/490136/Auto-Udemy.user.js
// @updateURL https://update.greasyfork.org/scripts/490136/Auto-Udemy.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Constants
  const SKIP_VIDEO = true; // Set to false to not skip videos
  const SKIP_ARTICLE = true; // Set to false to not skip documents
  const VIDEO_OFFSET_SECONDS = 3; // Time to skip before the end of the video
  const ARTICLE_OFFSET_TIME = 15000;

  const waitForElement = (selector) => {
    return new Promise(resolve => {
      const observer = new MutationObserver(mutations => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  };

  const skipVideoBeforeEnd = () => {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      if (video.src.startsWith('blob:https://ua.udemy.com/') && video.readyState >= 2) {
        const targetTime = video.duration - VIDEO_OFFSET_SECONDS;
        if (targetTime > 0 && video.currentTime < targetTime) {
          video.currentTime = targetTime;
        }
      }
    });
  };

  const videoObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        skipVideoBeforeEnd();
      }
    });
  });

  videoObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  skipVideoBeforeEnd();


  const button = document.createElement('button');
  button.innerText = 'AWAKEN!';
  button.style.position = 'absolute';
  button.style.top = '0';
  button.style.left = '0';
  button.style.zIndex = '1000';
  button.style.backgroundColor = 'black';
  button.style.color = 'red';
  button.style.fontSize = '20px';
  button.style.padding = '10px';

  document.body.appendChild(button);

  button.addEventListener('click', async function() {
    const curriculumItems = document.querySelectorAll('li[class*="curriculum-item-link--curriculum-item--"]');


    for (let item of curriculumItems) {
      const svgElement = item.querySelector('.ud-btn.ud-btn-large.ud-btn-link.ud-heading-md');
      // SKIP VIDEO
      if (SKIP_VIDEO && svgElement && svgElement.outerHTML.includes('xlink:href="#icon-video"')) {
        const clickableDiv = item.querySelector('.item-link[class*="item-link--common--"][class*="ud-custom-focus-visible"]');
        if (clickableDiv) {
          clickableDiv.click();

          await waitForElement('[data-purpose="go-to-next-button"]');
        }
      }

      // SKIP Doccuments
      if (SKIP_ARTICLE && svgElement && svgElement.outerHTML.includes('xlink:href="#icon-article"')) {
        const clickableDiv = item.querySelector('.item-link[class*="item-link--common--"][class*="ud-custom-focus-visible"]');
        if (clickableDiv) {
          clickableDiv.click();

          await new Promise(resolve => setTimeout(resolve, ARTICLE_OFFSET_TIME));
        }
      }
    }
  });
})();
