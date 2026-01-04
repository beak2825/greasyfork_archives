// ==UserScript==
// @name         Fan Yi
// @namespace    derjoker
// @version      0.3.2
// @description  Recite.
// @description:en  Recite.
// @author       Feng Ya
// @match        https://github.com/derjoker/drafts/blob/master/deutsch/fanyi.md
// @match        https://github.com/derjoker/900/blob/master/Deutsch.md
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/40785/Fan%20Yi.user.js
// @updateURL https://update.greasyfork.org/scripts/40785/Fan%20Yi.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...
  GM_addStyle(`
  .highlight {
    background: rgba(255, 242, 51, 0.298);
  }
  .mask {
    color: rgba(255, 242, 51, 0.298);
  }
  `);

  const regex = /[\wäöüß]+/gi;

  function replace(node, percent) {
    if (node.nodeType === 1) percent = 0.6;
    const html = node.textContent.replace(regex, match => {
      return Math.random() > percent
        ? match
        : `<span class="highlight mask">${match}</span>`;
    });
    // ELEMENT_NODE
    if (node.nodeType === 1) {
      node.innerHTML = html;
      return node.outerHTML;
    }
    // TEXT_NODE
    if (node.nodeType === 3) return html;

    return '';
  }

  function transform(el, percent) {
    // const clone = el.cloneNode(true);
    // console.log(clone.childNodes);

    const childNodes = [];
    el.childNodes.forEach(child => {
      childNodes.push(replace(child, percent));
    });
    el.innerHTML = childNodes.join('');
  }

  if (
    location.href ===
    'https://github.com/derjoker/drafts/blob/master/deutsch/fanyi.md'
  ) {
    document.querySelectorAll('article > h2').forEach(h2 => {
      const p = h2.nextSibling.nextSibling;
      transform(p, 0.6);
    });
  }

  if (
    location.href === 'https://github.com/derjoker/900/blob/master/Deutsch.md'
  ) {
    document.querySelectorAll('li > p').forEach(p => {
      transform(p, 0.2);
    });
  }

  document.body.addEventListener('click', event => {
    document.querySelectorAll('.highlight').forEach(highlight => {
      highlight.classList.toggle('mask');
    });
  });
})();
