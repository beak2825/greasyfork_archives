// ==UserScript==
// @name         YouTube Image Fix
// @namespace    *
// @version      1.0.0
// @description  Fixes display of avatars, channel art, and video previews on YouTube for users in Russia.
// @author       Your Name
// @match        *://*.youtube.com/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/514329/YouTube%20Image%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/514329/YouTube%20Image%20Fix.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const rules = [
    {
      id: 1,
      priority: 1,
      action: {
        type: 'redirect',
        redirect: {
          regexSubstitution: 'https://lh3.ggpht.com/$1'
        }
      },
      condition: {
        regexFilter: 'https://yt3.ggpht.com/(.*)',
        resourceTypes: ['image']
      }
    }
  ];

  function applyRules() {
    rules.forEach(rule => {
      const images = document.querySelectorAll(`img[src^="${rule.condition.regexFilter.replace('(.*)', '')}"]`);
      images.forEach(image => {
        image.src = image.src.replace(new RegExp(rule.condition.regexFilter), rule.action.redirect.regexSubstitution);
      });
    });
  }

  // Apply rules initially and on DOM changes
  applyRules();
  const observer = new MutationObserver(applyRules);
  observer.observe(document.body, { childList: true, subtree: true });
})();