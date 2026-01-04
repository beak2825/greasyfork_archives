// ==UserScript==
// @name         Bilibili 哔哩哔哩查看原图
// @icon         https://www.bilibili.com/favicon.ico
// @namespace    https://lolico.moe/
// @version      3.1.1
// @description  方便在B站内查看各种图片的原图，支持动态、专栏
// @author       Jindai Kirin
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/opus/*
// @match        https://www.bilibili.com/read/*
// @license      GPL-3.0
// @grant        GM_addStyle
// @grant        GM_download
// @run-at       document-end
// @require      https://code.bdstatic.com/npm/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/372289/Bilibili%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%9F%A5%E7%9C%8B%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/372289/Bilibili%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%9F%A5%E7%9C%8B%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DOWNLOAD_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style="width: 16px; height: 16px; transform: none !important;" fill="currentColor"><path d="M5,20h14v-2H5V20z M19,9h-4V3H9v6H5l7,7L19,9z"/></svg>';

  const css = ([style]) => GM_addStyle(style);
  const last = arr => arr[arr.length - 1];

  if (
    location.hostname === 't.bilibili.com' ||
    location.hostname === 'space.bilibili.com' ||
    (location.hostname === 'www.bilibili.com' && location.pathname.startsWith('/opus/'))
  ) {
    css`
      .bili-album__watch__control__option.ccw-rotation svg {
        transform: scaleX(-1);
      }
      @media screen and (max-width: 1319px) {
        .bili-album__watch__control__option {
          padding: 0 12px !important;
        }
      }
    `;
    // 添加下载原图按钮
    document.addEventListener(
      'click',
      async ({ target }) => {
        const $target = $(target);
        if (
          $target.hasClass('bili-album__preview__picture__img') ||
          $target.parent().hasClass('b-img__inner')
        ) {
          const $album = $target.parents('.bili-album');
          const $btn = await waitBtn(
            $album,
            '.bili-album__watch__control__option.full-screen',
            '.bili-album__watch'
          );
          if ($btn.length > 1) return;
          const $newBtn = $($btn.prop('outerHTML').replace('查看大图', '下载原图'));
          $newBtn.find('svg').replaceWith(DOWNLOAD_ICON);
          $newBtn.on('click', () => {
            const url = $album
              .find('.bili-album__watch__content img')
              .attr('src')
              .replace(/@.*$/, '')
              .replace(/^\/*/, 'https://');
            if (!url) {
              alert('找不到图片地址');
              return;
            }
            const name = last(url.split('/'));
            GM_download(url, name);
          });
          $btn.after($newBtn);
        }
      },
      { capture: true }
    );
  } else if (location.hostname === 'www.bilibili.com' && location.pathname.startsWith('/read/')) {
    css`
      img.normal-img,
      .card-image__image {
        cursor: pointer;
      }
    `;
    // 专栏图片点击打开原图
    $(document.body).on('click', 'img.normal-img', function () {
      window.open($(this).attr('src').replace(/@.*?$/, ''));
    });
    // 专栏头图点击打开原图
    $(document.body).on('click', '.card-image__image', function () {
      window.open(
        $(this)
          .css('background-image')
          .replace(/^url\(["']?/, '')
          .replace(/["']?\)$/, '')
          .replace(/@.*?$/, ''),
        '_blank'
      );
    });
  }

  /**
   * 等待查看大图按钮出现
   * @param {JQuery<HTMLElement>} $el
   * @param {string} btnSelector
   * @param {string} waitNodeSelector
   * @returns {JQuery<HTMLElement>}
   */
  function waitBtn($el, btnSelector, waitNodeSelector) {
    return new Promise(resolve => {
      const $btn = $el.find(btnSelector);
      if ($btn.length > 0) {
        resolve($btn);
        return;
      }
      new MutationObserver((mutations, self) => {
        mutations.forEach(({ addedNodes }) => {
          if (addedNodes.length && $(addedNodes[0]).is(waitNodeSelector)) {
            self.disconnect();
            resolve($el.find(btnSelector));
          }
        });
      }).observe($el[0], { childList: true });
    });
  }
})();
