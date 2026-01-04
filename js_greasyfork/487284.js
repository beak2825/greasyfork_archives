// ==UserScript==
// @name         BOOTH Library Beautifier
// @description  BOOTHのライブラリ/ギフト一覧の情報量を増やし見やすくします（簡易実装）
// @version      0.5
// @author       amamamaou
// @namespace    https://misskey.niri.la/@amamamaou
// @match        https://accounts.booth.pm/library*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487284/BOOTH%20Library%20Beautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/487284/BOOTH%20Library%20Beautifier.meta.js
// ==/UserScript==

{
  /** @type {HTMLElement} リストコンテナー */
  const container = document.querySelector('.ui-segmented-tablet-nav').nextElementSibling;
  container.className = 'container grid gap-16 grid-cols-5 u-pb-600';

  /** ページャーオブザーバー */
  const pagerObserver = new IntersectionObserver(([entry], observer) => {
    if (entry.isIntersecting) {
      const next = entry.target.querySelector('.current')?.nextElementSibling;

      if (next?.matches(':not([class])')) {
        /** @type {HTMLAnchorElement} */
        const anchor = next.firstElementChild;

        loadNextPage(anchor.href);
      }

      observer.unobserve(entry.target);
      entry.target.remove();
    }
  }, {
    rootMargin: '-50% 0% 0%',
  });

  /**
   * 次のページを読み込む
   * @param {string} url 読み込むURL
   */
  const loadNextPage = async (url) => {
    const responce = await fetch(url);

    if (!responce.ok) {
      console.error('ページを読み込めませんでした');
      return;
    }

    // HTMLパース
    const text = await responce.text();
    const parser = new DOMParser();
    const dom = parser.parseFromString(text, 'text/html');

    /** @type {HTMLElement} リストコンテナー */
    const newContainer = dom.querySelector('.ui-segmented-tablet-nav').nextElementSibling;

    /** @type {HTMLCollectionOf<HTMLElement>} */
    const items = newContainer.children;

    setNewStyle(items);
    container.append(...items);
  };

  /**
   * 詳細モーダルを表示する
   * @param {HTMLElement} item アイテム要素
   */
  const showDetailModal = (item) => {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[10000] flex justify-center items-center cursor-pointer';
    overlay.style.backgroundColor = 'var(--charcoal-surface4)';

    const content = document.createElement('div');
    content.className = 'cursor-default';
    content.style.width = '800px';

    overlay.addEventListener('click', () => overlay.remove());
    content.addEventListener('click', event => event.stopPropagation());

    content.append(item.cloneNode(true));
    overlay.append(content);

    document.body.append(overlay);
  };

  /**
   * 新しいスタイルにする
   * @param {HTMLCollectionOf<HTMLElement>} items アイテム要素郡
   */
  const setNewStyle = (items) => {
    for (const item of items) {
      // ページャーなら監視させる
      if (item.classList.contains('pager')) {
        item.style.gridColumn = '1 / 6';
        pagerObserver.observe(item);
        continue;
      }

      /** @type {HTMLElement} 複製要素 */
      const clonedItem = item.cloneNode(true);

      /** @type {HTMLElement} ダウンロードリスト */
      const dlList = clonedItem.lastElementChild;
      dlList.style.overflow = 'auto';
      dlList.style.overscrollBehavior = 'contain';
      dlList.style.maxHeight = '50vh';

      for (const dlItem of dlList.children) {
        const btn = dlItem.querySelector('.js-download-button');

        if (btn.firstElementChild) continue;

        const wrapper = document.createElement('div');
        const button = document.createElement('a');

        wrapper.className = 'relative w-fit';
        button.className = 'charcoal-button focus-visible:!shadow-secondary-focus !text-text-default hover:enabled:!text-[#0B1628] active:enabled:!text-[#0B1628] !w-fit';
        button.textContent = 'ダウンロード';
        button.href = btn.dataset.href;

        wrapper.append(button);
        btn.append(wrapper);
      }

      item.className = 'p-8 bg-white rounded-8';

      // ダウンロードリンク箇所を削除
      item.lastElementChild.remove();

      /** @type {HTMLElement} */
      const infoBlock = item.firstElementChild;
      infoBlock.className = 'item-card__summary h-full flex flex-col';

      // サムネイル
      const thumbnail = infoBlock.querySelector('img');
      thumbnail.style.width = '100%';
      thumbnail.style.height = 'auto';

      // タイトル
      const title = infoBlock.querySelector('.text-text-default');
      title.className = 'item-card__title item-card__title-anchor--multiline !min-h-[auto]';

      // ショップ名リンク
      const shopAnchor = title.parentElement.nextElementSibling;
      shopAnchor.className = 'item-card__shop-name-anchor nav';

      // ショップブロック
      const shopBlock = shopAnchor.firstElementChild;
      shopBlock.className = 'u-d-flex u-align-items-center';

      // ショップアイコン
      shopBlock.firstElementChild.className = 'user-avatar at-item-footer';

      // ショップ名
      shopBlock.lastElementChild.className = 'item-card__shop-name mb-8';

      // 詳細ボタン
      const detailTrigger = document.createElement('a');
      detailTrigger.className = 'block text-center font-bold cursor-pointer';
      detailTrigger.style.margin = 'auto 0 0';
      detailTrigger.textContent = '詳細を見る';

      detailTrigger.addEventListener('click', () => showDetailModal(clonedItem));

      infoBlock.append(detailTrigger);
    }
  };

  /** @type {HTMLCollectionOf<HTMLElement>} */
  const items = container.children;
  setNewStyle(items);
}
