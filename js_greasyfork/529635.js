// ==UserScript==
// @name        DuckDuckGo: Shorten Page Title
// @namespace   Violentmonkey Scripts
// @match       https://*.duckduckgo.com/*
// @grant       none
// @version     1.0
// @author      GreasyBastard
// @license     AGPLv3
// @description Simply sets and updates page title to search terms.
// @downloadURL https://update.greasyfork.org/scripts/529635/DuckDuckGo%3A%20Shorten%20Page%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/529635/DuckDuckGo%3A%20Shorten%20Page%20Title.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function removeDuckDuckGo() {
    var currentTitle = document.title;
    var newTitle = currentTitle.replace(/\s*at DuckDuckGo\s*$/, '');
    if (newTitle !== currentTitle) {
      document.title = newTitle;
    }
  }
  removeDuckDuckGo();
  var titleObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        removeDuckDuckGo();
      }
    });
  });
  var titleElement = document.querySelector('title');
  if (titleElement) {
    titleObserver.observe(titleElement, { childList: true });
  }

  function modifyFormMethod() {
    var form = document.querySelector('form[action="/lite/"][method="post"]');
    if (form) {
      form.method = 'get';
    }
  }
  modifyFormMethod();
  var formObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' || mutation.type === 'attributes') {
        modifyFormMethod();
      }
    });
  });
  formObserver.observe(document.body, { childList: true, subtree: true, attributes: true });
})();
