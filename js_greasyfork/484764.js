// ==UserScript==
// @name         Scribd Bypass
// @namespace    http://github.com/DemonDucky/
// @version      1.0.1
// @description  Scribd Remover!
// @author       DemonDucky
// @match        https://www.scribd.com/document/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scribd.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484764/Scribd%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/484764/Scribd%20Bypass.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const css = `
  .removefilter {
    color: black !important;
    text-shadow: none !important;
  }
`;

  const config = { attributes: true, childList: true, subTree: true, characterData: true };

  const obsHandler = (mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        removePromoBanner(mutation.target);
        removeBlurText(mutation.target);
        selectable(mutation.target);
      }
    }
  };

  const mutationObserver = new MutationObserver(obsHandler);

  const removePromoBanner = (target = document) => {
    const promoBanners = target.querySelectorAll('.promo_div');
    promoBanners.forEach((banner) => banner.remove());
  };

  const removeBlurText = (target = document) => {
    const textNodes = target.querySelectorAll('.outer_page_container .outer_page .text_layer .ie_fix');

    textNodes.forEach((textNode) => {
      textNode.parentElement.classList.add('removefilter');
      Array.from(textNode.getElementsByTagName('*')).forEach((text) => {
        text.classList.add('removefilter');
      });
    });
  };

  const selectable = (target = document) => {
    Array.from(target.getElementsByTagName('[unselectable]')).forEach((element) =>
      element.removeAttribute('unselectable')
    );
  };

  const loadHandler = () => {
    GM_addStyle(css);
    const pages = document.querySelectorAll('.outer_page');
    removePromoBanner();
    removeBlurText();
    selectable();

    pages.forEach((page) => {
      mutationObserver.observe(page, config);
      page.classList.remove('blurred_page');
    });
  };

  window.addEventListener('load', loadHandler);
})();
