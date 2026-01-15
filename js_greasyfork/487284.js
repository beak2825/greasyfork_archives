// ==UserScript==
// @name         BOOTH Library Beautifier
// @description  BOOTHのライブラリ/ギフト一覧の情報量を増やし見やすくします（簡易実装）
// @version      0.7.0
// @author       amamamaou
// @namespace    https://misskey.niri.la/@amamamaou
// @match        https://accounts.booth.pm/library*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487284/BOOTH%20Library%20Beautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/487284/BOOTH%20Library%20Beautifier.meta.js
// ==/UserScript==

{
  // スタイル挿入
  const style = document.createElement('style');
  style.textContent = `
.am-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  overflow: auto;
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: var(--charcoal-surface4);
  backdrop-filter: blur(5px);
  cursor: pointer;

  &::before,
  &::after {
    content: '';
    flex-shrink: 0;
    height: 100px;
  }
}

.am-list > div {
  padding-block: 4px;
  border-bottom-width: 1px;
  borer-style: solid;
}
`;
  document.head.append(style);

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
  async function loadNextPage(url) {
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

    const items = [...newContainer.children];

    container.append(...items);
    setNewStyle(items, true);
  }

  /**
   * 詳細モーダルを表示する
   * @param {HTMLElement} item アイテム要素
   * @param {HTMLElement} clonedItem リスト用要素
   */
  function showDetailModal(item, clonedItem) {
    const overlay = document.createElement('div');
    overlay.className = 'am-overlay';
    overlay.style.backgroundColor = 'var(--charcoal-surface4)';

    const content = document.createElement('div');
    content.className = 'cursor-default';
    content.style.width = '800px';

    overlay.addEventListener('click', () => {
      item.hidden = true;
      clonedItem.before(item);
      overlay.remove();
    });
    content.addEventListener('click', event => event.stopPropagation());

    content.append(item);
    overlay.append(content);

    item.hidden = false;

    document.body.append(overlay);
  }

  /**
   * 新しいスタイルにする
   * @param {HTMLElement[]} items アイテム要素郡
   * @param {boolean} isAppend 後から追加した要素フラグ
   */
  function setNewStyle(items, isAppend) {
    for (const item of items) {
      // ページャーなら監視させる
      if (item.classList.contains('pager')) {
        item.style.gridColumn = '1 / 6';
        pagerObserver.observe(item);
        continue;
      }

      // リスト用要素生成
      /** @type {HTMLElement} 複製要素 */
      const clonedItem = item.cloneNode(true);
      clonedItem.className = 'p-8 bg-white rounded-8';
      clonedItem.lastElementChild.remove();

      /** @type {HTMLElement} */
      const infoBlock = clonedItem.firstElementChild;
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

      detailTrigger.addEventListener('click', () => showDetailModal(item, clonedItem));

      infoBlock.append(detailTrigger);

      // オリジナルは隠しておく
      item.hidden = true;

      /** @type {HTMLElement} ダウンロードリスト */
      const dlList = item.lastElementChild;

      dlList.classList.remove('mt-16');
      dlList.classList.add('am-list');

      for (const dlItem of dlList.children) {
        dlItem.classList.remove('mt-16');
        dlItem.classList.add('border-border300');
        if (isAppend) setDlButton(dlItem);
      }

      item.after(clonedItem);
    }
  }

  /**
   * ボタン生成
   * @param {boolean} isDropdown 
   * @return {HTMLButtonElement}
   */
  function createButton(isDropdown) {
    const pixivIconDl = document.querySelector('pixiv-icon[name="16/Download"]');

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'charcoal-button focus-visible:!shadow-secondary-focus !text-text-default hover:enabled:!text-[#0B1628] active:enabled:!text-[#0B1628] !w-fit';
    button.dataset.variant = 'Default';
    button.dataset.size = 'S';

    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-center gap-4';
    wrapper.append(pixivIconDl.cloneNode(true), isDropdown ? 'その他のDL方法' : 'ダウンロード');

    if (isDropdown) {
      const pixivIconArrow = document.querySelector('pixiv-icon[name="24/ArrowOpenDown"]');
      wrapper.append(pixivIconArrow.cloneNode(true));
    }

    button.append(wrapper);

    return button;
  }

  /**
   * その他のDL方法ボタン生成
   * @param {{ deeplinkDownloadableUrl: string, fallbackMessage: string, fallbackUrl: string, text: string }[]} data 
   * @return {DocumentFragment}
   */
  function createExtraButton(data) {
    const pixivIconDl = document.querySelector('pixiv-icon[name="16/Download"]');
    const pixivIconArrow = document.querySelector('pixiv-icon[name="24/ArrowOpenRight"]');
    const fragment = document.createDocumentFragment();

    for (const item of data) {
      const button = document.createElement('div');
      button.className = 'text-14 text-text-default font-normal py-4 px-6 hover:bg-surface-2 flex items-center gap-8 px-16 py-8 text-16 no-underline hover:bg-surface3-hover focus-visible:bg-surface3-press cursor-pointer';
      
      button.addEventListener('click', () => {
        const timer = window.setTimeout(() => {
          if (window.confirm(item.fallbackMessage)) {
            location.assign(item.fallbackUrl);
          } else {
            window.clearTimeout(timer);
          }
        }, 1500);

        const canceller = () => {
          window.clearTimeout(timer);
          window.removeEventListener('blur', canceller, true);
          window.removeEventListener('pagehide', canceller, true);
        }

        window.addEventListener('blur', canceller, true);
        window.addEventListener('pagehide', canceller, true);
        location.assign(item.deeplinkDownloadableUrl);
      });
      
      button.append(pixivIconDl.cloneNode(true), item.text, pixivIconArrow.cloneNode(true));
      fragment.append(button);
    }

    return fragment;
  }

  /**
   * ダウンロードボタン設定
   * @param {HTMLElement} dlItem 
   */
  function setDlButton(dlItem) {
    /** @type {NodeListOf<HTMLElement>} */
    const dlButtons = dlItem.querySelectorAll('.js-download-button');
    for (const buttonBlock of dlButtons) {
      const wrapper = document.createElement('div');
      wrapper.className = 'relative w-fit';
      buttonBlock.append(wrapper);

      if (buttonBlock.dataset.href) {
        const button = createButton(false);
        button.addEventListener('click', (event) => {
          event.preventDefault();
          location.assign(buttonBlock.dataset.href);
        });
        wrapper.append(button);
      } else {
        const dropdownWrapper = document.createElement('div');
        dropdownWrapper.hidden = true;

        const overlay = document.createElement('div');
        overlay.className = 'fixed top-0 left-0 bottom-0 right-0 w-full h-full opacity-100 z-10 cursor-default';
        overlay.addEventListener('click', () => {
          dropdownWrapper.hidden = true;
        });

        const button = createButton(true);
        button.addEventListener('click', (event) => {
          event.preventDefault();
          dropdownWrapper.hidden = !dropdownWrapper.hidden;
        });

        const dropdown = document.createElement('div');
        dropdown.className = 'absolute top-full w-[288px] bg-surface-1 px-0 py-8 bg-white border border-border500 rounded-8 list-none my-4 z-20 right-0';
        
        const fragment = createExtraButton(JSON.parse(buttonBlock.dataset.dropdownItems));
        
        dropdown.append(fragment);
        dropdownWrapper.append(dropdown, overlay);
        wrapper.append(button, dropdownWrapper);
      }
    }
  }

  setNewStyle([...container.children]);
}
