// ==UserScript==
// @name         Right-to-Left Paragraph Fixer
// @namespace    tampermonkey
// @version      1.0
// @description  Fixes mixed-direction paragraphs on old.reddit.com by adding the dir="rtl" attribute
// @match        https://old.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479641/Right-to-Left%20Paragraph%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/479641/Right-to-Left%20Paragraph%20Fixer.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Identify paragraphs based on their text content
  const paragraphs = document.querySelectorAll('div.md');

  // Check if the paragraph contains mixed direction text patterns
  for (const paragraph of paragraphs) {
    if (
      paragraph.textContent.match(/[\u0590-\u07FF]|[\u200E-\u200F]|[\u202A-\u202E]|[\uFB51-\uFD3F]|[\uFD3F-\uFD8F]/g) &&
      paragraph.textContent.match(/[\u0000-\u007F]|\u0080-\u04FF]|[\u0500-\u058F]|[\u0700-\u07FF]|[\u0900-\u0D7F]|[\u1200-\u137F]|[\u1400-\u197F]|[\u2000-\u206F]|[\u2070-\u2BFF]|[\u2C00-\u2D7F]|[\u2E00-\u2FFF]|[\u3000-\u30FF]|[\u3400-\u4D7F]|[\u4E00-\u9FFF]|[\uA000-\uA4FF]|[\uA600-\uA9FF]|[\uAC00-\uD7FF]|[\uD800-\uDB7F]|[\uDB80-\uDBFF]|[\uDC00-\uDFFF]|[\uE000-\uE8FF]|[\uEE00-\uEEFF]|[\uEF00-\uFE0F]|[\uFE10-\uFE19]|[\uFE20-\uFE2F]|[\uFE30-\uFE4F]|[\uFE50-\uFE6F]|[\uFE70-\uFEFF]|[\uFF00-\uFFEF]/g)
    ) {
      // Add the dir="rtl" attribute to the paragraph
      paragraph.setAttribute('dir', 'rtl');
    }
  }
})();
