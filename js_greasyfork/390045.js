// ==UserScript==
// @name         Giphy - add Markdown format
// @namespace    http://splintor.wordpress.com/
// @version      0.3
// @description  Enable to paste the GIF directly in a GitHub comment or anywhere else that requires a Markdown syntax
// @author       splintor@gmail.com
// @updateUrl    https://gist.github.com/splintor/d17771cf706a5d874222651577be7e8a/raw
// @match        https://giphy.com/*
// @downloadURL https://update.greasyfork.org/scripts/390045/Giphy%20-%20add%20Markdown%20format.user.js
// @updateURL https://update.greasyfork.org/scripts/390045/Giphy%20-%20add%20Markdown%20format.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const __markdownTagId = '__markdownTag'
  function addMarkdownTag() {
    const existing = document.getElementById(__markdownTagId);
    const gifLink = Array.from(document.querySelectorAll('input')).find(i => i.value.endsWith('giphy.gif'));
    if (!gifLink) {
      if (existing) {
        existing.remove();
      }
      return;
    }

    if (existing) return;

    let gifLinkParent = gifLink.parentNode;
    if (gifLinkParent.firstChild === gifLink) {
      gifLinkParent = gifLinkParent.parentNode;
    }
    const markdownTag = gifLinkParent.cloneNode(true);
    markdownTag.id = __markdownTagId;
    markdownTag.firstChild.innerText = 'Markdown Tag';
    let labelElement = markdownTag.lastChild.firstChild;
    if (labelElement.tagName === 'INPUT') {
      labelElement = markdownTag.lastChild.lastChild.firstChild;
    }
    labelElement.innerText = 'A Markdown tag to be used in sites like GitHub';
    const input = markdownTag.querySelector('input');
    input.value = `![image](${input.value})`;
    input.addEventListener('focus', e => e.target.select());
    gifLinkParent.after(markdownTag);
  }

  setInterval(addMarkdownTag, 500);
  addMarkdownTag();
})();