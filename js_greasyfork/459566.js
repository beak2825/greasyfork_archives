// ==UserScript==
// @name        Clean up wuxiaworld.site
// @namespace   Violentmonkey Scripts
// @match       https://wuxiaworld.site/novel/*
// @grant       none
// @version     1.0
// @author      -
// @description 12/11/2022, 11:52:29 PM
// @downloadURL https://update.greasyfork.org/scripts/459566/Clean%20up%20wuxiaworldsite.user.js
// @updateURL https://update.greasyfork.org/scripts/459566/Clean%20up%20wuxiaworldsite.meta.js
// ==/UserScript==
(function(window, document) {

  const styles = `
.c-blog-post .entry-content .entry-content_wrap {
  line-height: 1.4;
}
.select-pagination {
  float: none !important;
  position: relative !important;
}
.select-pagination .nav-links,
.select-pagination .nav-links > *,
.select-pagination .nav-links a,
.select-pagination .nav-links a {
  display: block !important;
  width: 100% !important;
  margin-top: 10px !important;
}
h1, .h1 {
  font-size: 24px;
}
h2, .h2 {
  font-size: 20px;
}
  `;

  const removeElementsArray = [
    '#manga-discussion',
    '.wp-manga-tags-wrapper',
  ];

  function insertStyles() {
    const style = document.createElement('style');
    style.innerText = styles;
    document.head.appendChild(style);
  }

  function removeElements() {
    removeElementsArray.forEach(el => {
      const $el = document.querySelectorAll(el);
      Array.from($el).forEach(del => {
        del.remove();
      })
    })


    Array.from(document.querySelectorAll('p')).forEach((el, i) => {
      if (/(read).*(wuxia).*(world)?.*(site)?/ig.test(el.textContent)) {
        el.remove();
      }
      if(el.textContent.trim().length === 0) {
        el.remove();
      }
    })
  }

  function init() {
    insertStyles();

    removeElements();
  }

  init();
})(window, document)