// ==UserScript==
// @name         Twitter image viewing enhancement
// @name:zh-CN   Twitter 图片查看增强
// @name:zh-TW   Twitter 圖像查看增強
// @icon         https://twitter.com/favicon.ico
// @namespace    https://moe.best/
// @version      1.4.0
// @description        Make Twitter photo viewing more humane
// @description:zh-CN  让推特图片浏览更加人性化
// @description:zh-TW  讓 Twitter 照片瀏覽更人性化
// @author       Jindai Kirin
// @include      https://x.com/*
// @include      https://twitter.com/*
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/387918/Twitter%20image%20viewing%20enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/387918/Twitter%20image%20viewing%20enhancement.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // 滑动切换图片
  let enableDragToSwitch = GM_getValue('enableDragToSwitch', false);
  GM_registerMenuCommand('Drag to switch images', () => {
    enableDragToSwitch = confirm(`Do you want to enable drag to switch images?
Current: ${enableDragToSwitch ? 'Enabled' : 'Disabled'}

Please refresh to take effect after modification.`);
    GM_setValue('enableDragToSwitch', enableDragToSwitch);
  });

  if (enableDragToSwitch) GM_addStyle('img{-webkit-user-drag:none}');

  const labels = {};

  const setLabels = labelsStr => {
    const list = (labelsStr || '').split(',');
    if (list.length !== 3) return;
    labels.close = list[0];
    labels.prev = list[1];
    labels.next = list[2];
  };

  setLabels(GM_getValue('labels_v1', ''));

  // 手动设置 aria-label
  GM_registerMenuCommand('Set aria-label', () => {
    let input, list;
    let error = false;
    do {
      const current = GM_getValue('labels_v1', '');
      input = prompt(
        `Please input the aria-label of Close, Previous, Next button and join them by commas(,). Submit an empty string will disable it.${
          error ? '\n\nINPUT ERROR' : ''
        }`,
        input || current
      );
      if (input === null) return;
      input = input.trim();
      if (input.length === 0) {
        GM_setValue('labels_v1', '');
        return;
      } else list = input.split(',').map(label => label.trim());
      error = list.length !== 3;
    } while (error);
    const value = list.join(',');
    setLabels(value);
    GM_setValue('labels_v1', value);
  });

  if (!Object.values(labels).length) {
    try {
      const kv = {
        af8fa2ad: 'close',
        af8fa2ae: 'close',
        c4d53ba2: 'prev',
        d70740d9: 'next',
        d70740da: 'next',
      };
      const i18nModule = webpackChunk_twitter_responsive_web.find(([[name]]) =>
        name.startsWith('i18n')
      );
      Object.values(i18nModule[1]).forEach(fn => {
        if (fn.length < 3) return;
        try {
          fn(undefined, undefined, () => ({
            _register: () => (k, v) => {
              if (k in kv) labels[kv[k]] = v;
            },
          }));
        } catch (e) {}
      });
    } catch (error) {
      console.error(error);
    }
  }

  const getBtnByLabel = label => document.querySelector(`[aria-label="${label}"]`);
  const clickBtn = name => {
    const $btn = getBtnByLabel(labels[name]);
    if ($btn) {
      $btn.click();
      return true;
    }
    return false;
  };

  const closeImgView = () => clickBtn('close');
  const prevImg = () => clickBtn('prev');
  const nextImg = () => clickBtn('next');

  /**
   * @param {HTMLElement} el
   */
  const isTwitterImg = el => el.tagName == 'IMG' && el.baseURI.includes('/photo/');

  window.addEventListener(
    'wheel',
    ({ deltaY, target }) => {
      if (isTwitterImg(target) || target.dataset.testid === 'swipe-to-dismiss') {
        if (deltaY < 0) prevImg();
        else if (deltaY > 0) nextImg();
      }
    },
    { passive: true }
  );

  if (enableDragToSwitch) {
    let x = 0;
    let y = 0;
    window.addEventListener('mousedown', ({ clientX, clientY }) => {
      x = clientX;
      y = clientY;
    });
    window.addEventListener(
      'mouseup',
      ({ button, clientX, clientY, target }) => {
        if (button !== 0 || !isTwitterImg(target)) return;
        const [sx, sy] = [clientX - x, clientY - y].map(Math.abs);
        const mx = clientX - x;
        if (sx <= 10 && sy <= 10) closeImgView();
        if (sy <= sx) {
          if (mx > 0) prevImg();
          else if (mx < 0) nextImg();
        }
      },
      { passive: true }
    );
  } else {
    document.addEventListener(
      'click',
      e => {
        if (!isTwitterImg(e.target)) return;
        closeImgView();
        e.stopPropagation();
      },
      { capture: true, passive: true }
    );
  }
})();
