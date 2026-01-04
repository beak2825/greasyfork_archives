// ==UserScript==
// @name         add view button for DLSite Short Review
// @description  DLSite の作品評価のページに直接「ブラウザ視聴」ボタンを置きます。
// @namespace    https://htsign.hateblo.jp
// @version      0.4.1
// @author       htsign
// @match        https://www.dlsite.com/*/mypage/short-review
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489567/add%20view%20button%20for%20DLSite%20Short%20Review.user.js
// @updateURL https://update.greasyfork.org/scripts/489567/add%20view%20button%20for%20DLSite%20Short%20Review.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const VIEW_BTN_CLASS = 'list_rating_btn btn_st';
  const VIEW_TEXT = 'ブラウザ視聴';

  const wrapper = [...document.getElementById('rating_wrap').children].at(-1);

  /**
   * @param {HTMLUListElement} ul
   */
  const main = ul => {
    const parent = ul.parentElement;

    const df = document.createDocumentFragment();
    df.append(ul);

    for (const item of ul.getElementsByTagName('li')) {
      const [, productId] = /** @type {Element & {href: string}} */ (item.querySelector('.work_name > [href]'))?.href.match(/\/product_id\/([^.]+)/) ?? [];

      if (productId != null) {
        const workOperationButton = item.querySelector('.work_operation_btn');
        if (workOperationButton == null) continue;

        // skip if anchor is already exists
        if (workOperationButton.querySelector(`a[class="${VIEW_BTN_CLASS}"]`)) continue;

        const href = `https://play.dlsite.com/?workno=${productId}`;

        const props = {
          className: VIEW_BTN_CLASS,
          title: VIEW_TEXT,
          textContent: VIEW_TEXT,
          target: '_blank',
          href,
          style: 'margin-left: 4%;',
        };
        const anchor = Object.assign(document.createElement('a'), props);

        workOperationButton.append(anchor);
      }
    }

    parent.append(df);
  };

  const mo = new MutationObserver((records, observer) => {
    const ul = records
      .flatMap(({ target }) => target instanceof Element ? [...target.children] : [])
      .map(el => /** @type {HTMLUListElement | null} */ (el.closest('#rate_list_work ul')))
      .find(ul => ul);

    if (ul != null) {
      observer.observe(ul, { childList: true });
      main(ul);
    }
  });
  mo.observe(wrapper, { attributes: true, attributeFilter: ['id', 'class'] });

  const ul = document.querySelector('#rate_list_work ul');
  if (ul != null) {
    mo.observe(ul, { childList: true });
    main(ul);
  }
})();
