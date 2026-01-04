// ==UserScript==
// @name         FilterComments
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  xhs
// @author       fbjyet
// @license      MIT
// @match        https://www.xiaohongshu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaohongshu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478604/FilterComments.user.js
// @updateURL https://update.greasyfork.org/scripts/478604/FilterComments.meta.js
// ==/UserScript==

var FILTER_LOCATION = '广东';

function runInWaitRender(callback) {
  setTimeout(() => {
    callback();
  }, 1500);
}

function createObserver(options) {
  const { observedSelector, targetSelector, onMounted, onUnmount } = options;

  const wrappedCallback = function (mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.addedNodes && onMounted) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const addedNode = mutation.addedNodes[i];
          if (addedNode.matches && addedNode.matches(targetSelector)) {
            onMounted?.(addedNode);
          }
        }
      }

      if (mutation.removedNodes && onUnmount) {
        for (var i = 0; i < mutation.removedNodes.length; i++) {
          var removedNode = mutation.removedNodes[i];
          if (removedNode.matches && removedNode.matches(targetSelector)) {
            onUnmount?.(removedNode);
          }
        }
      }
    }
  };

  const observer = new MutationObserver(wrappedCallback);
  const observedElement = document.querySelector(observedSelector);
  observer.observe(observedElement, { childList: true, subtree: true });
  return observer;
}

function filterComments(parentElement) {
  const comments = parentElement.querySelectorAll('.comment-inner-container');

  comments.forEach(function (comment) {
    const locationElement = comment.querySelector('.location');

    if (locationElement.textContent.trim() !== FILTER_LOCATION) {
      comment.style.display = 'none';
    }
  });
}

function main() {
  const parentCommentObservers = [];

  const disconnectObservers = () => {
    if (parentCommentObservers?.length) {
      for (var i = 0; i < parentCommentObservers.length; i++) {
        parentCommentObservers[i]?.disconnect();
      }
    }
    parentCommentObservers = [];
  };

  createObserver({
    observedSelector: '.with-side-bar.main-content',
    targetSelector: '.note-detail-mask',
    onMounted: (noteDetailElement) => {
      runInWaitRender(() => {
        // first time render
        filterComments(noteDetailElement);

        // monitoring loading more comments
        const parentCommentObserver = createObserver({
          observedSelector: '.comments-container > .list-container',
          targetSelector: '.parent-comment',
          onMounted: (parentCommentElement) => {
            filterComments(parentCommentElement);
          },
        });
        parentCommentObservers.push(parentCommentObserver);
      });
    },
    onUnmount: () => {
      disconnectObservers();
    },
  });
}

(function () {
  'use strict';
  runInWaitRender(() => {
    main();
  });
})();
