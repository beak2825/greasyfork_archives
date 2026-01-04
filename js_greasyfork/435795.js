// ==UserScript==
// @name         Seasonvar tooltip
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Show the tooltip with info on history items and main page as like in sidebar
// @author       iDokki
// @match        *://seasonvar.ru/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435795/Seasonvar%20tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/435795/Seasonvar%20tooltip.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const { jQuery: $, svfunc: fns } = window;

  if (!($ && fns && fns.showSerialInfo)) {
    return;
  }

  const debounce = (func, wait) => {
    let timeout;
  
    return {
      run: ($el, dataId) => {
        const later = function() {
          timeout = null;
          func($el, dataId);
        };
    
        clearTimeout(timeout);
    
        timeout = setTimeout(later, wait);
      },
      clear: () => {
        clearTimeout(timeout);

        timeout = null;
      }
    }
  };
  const cache = {};
  const debounced = debounce(($el, dataId) => { fns.showSerialInfo($el); cache[dataId] = true; }, 650);
  const show = function() {
    const $this = $(this);
    const dataId = $this.data('id');

    !cache[dataId] && debounced.run($this, dataId);
  };
  const hide = function() {
    const dataId = $(this).data('id');

    !cache[dataId] && debounced.clear();
  };

  const attach = () => {
    const $body = $(document.body);
    const $lside = $('.lside-serial');
    const $sections = $('.news-wrap .news');
    const $marks = $('.pgs-marks');

    if ($body.length && $lside.length) {
      $body.off('mouseenter.tooltip', '[data-serial=list] a');

      $lside
        .on('mouseenter.tooltip', 'a[data-id]', show)
        .on('mouseleave.tooltip', 'a[data-id]', hide);
    }

    if ($sections.length) {
      $sections
        .on('mouseenter.tooltip', 'a[data-id]', show)
        .on('mouseleave.tooltip', 'a[data-id]', hide);
    }

    if ($marks.length) {
      const $tabs = $marks.find('.tabs-result');
  
      $tabs
        .find('.pgs-marks-el').each((index, el) => {
          if (el.dataset.marksel) {
            el.dataset.id = el.dataset.marksel;
          }
        })
        .end()
        .on('mouseenter.tooltip', '.pgs-marks-el[data-id]', show)
        .on('mouseleave.tooltip', '.pgs-marks-el[data-id]', hide);
    }
  };

  $(window).ready(attach);
})();
