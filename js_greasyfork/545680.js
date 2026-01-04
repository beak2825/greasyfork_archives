// ==UserScript==
// @name         RenderZRefined
// @namespace    TuxFUT-scripts
// @description  Tweaks RenderZ by hiding ads, removing side rails to show more player stats, and more.
// @version      0.0.1
// @author       TuxFUT
// @license      MIT
// @match        https://renderz.app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545680/RenderZRefined.user.js
// @updateURL https://update.greasyfork.org/scripts/545680/RenderZRefined.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const removeAds = () =>
    document.querySelectorAll('.venatus-ad-wrapper').forEach(el => el.remove());

  const widenTable = () => {
    const grid = document.querySelector(
      '.main .inner-container .grid,' +
      '.main .inner-container [style*="overflow-x-scroll"]'
    );
    if (grid) grid.style.minWidth = '100%';
  };

  const injectWideCSS = (() => {
    const STYLE_ID = 'rz-fullwidth-style';
    const CSS = `
      nav.fixed.left-0,
      aside.fixed.left-0,
      nav[class*="sidebar"],
      aside[class*="sidebar"],
      div[class*="sidebar"],
      [class*="right-rail"],
      [class*="left-rail"]{display:none!important}

      .container,
      .mx-auto,
      .inner-container{
        max-width:none!important;
        width:100%!important;
        margin-left:0!important;
        margin-right:0!important
      }

      .main .inner-container .grid,
      .main .inner-container [style*="display: grid"]{
        gap:.5rem!important;
        column-gap:.5rem!important
      }

      .main .inner-container .grid>*{
        padding-left:.25rem!important;
        padding-right:.25rem!important
      }

      main,
      [class*="content-wrapper"]{margin-left:0!important}
    `;
    return () => {
      if (document.getElementById(STYLE_ID)) return;
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = CSS;
      document.head.append(style);
    };
  })();

  injectWideCSS();
  removeAds();
  widenTable();

  new MutationObserver(() => {
    injectWideCSS();
    removeAds();
    widenTable();
  }).observe(document.body, { childList: true, subtree: true });
})();