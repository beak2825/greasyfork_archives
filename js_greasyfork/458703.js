// ==UserScript==
// @name         巴哈姆特勇者福利社++
// @namespace    https://github.com/DonkeyBear
// @version      0.8.3
// @description  改進巴哈姆特的勇者福利社，動態載入全部商品、加入過濾隱藏功能、標示競標目前出價等。
// @author       DonkeyBear
// @match        https://fuli.gamer.com.tw/shop.php*
// @icon         https://fuli.gamer.com.tw/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458703/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%87%E8%80%85%E7%A6%8F%E5%88%A9%E7%A4%BE%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/458703/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%87%E8%80%85%E7%A6%8F%E5%88%A9%E7%A4%BE%2B%2B.meta.js
// ==/UserScript==

const $ = jQuery;
const isDarkMode = $(document.documentElement).data('theme') === 'dark';

const stylesheet = /* css */`
  #BH-wrapper {
    padding-top: 0;
  }

  .items-card {
    ${isDarkMode ? '' : 'z-index: -1;'}
  }

  #tabs-btn-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tabs-btn-box {
    margin-top: 0;
  }

  .fuli-enhance-btn-box {
    overflow: visible;
  }

  .btn-distance.fuli-enhance {
    width: auto;
  }

  .btn-distance.fuli-enhance > [type=checkbox] {
    margin-right: .35rem;
  }

  .filter-by-title,
  .filter-by-type,
  .filter-by-state,
  #BH-pagebtn {
    display: none;
  }

  .digital.unaffordable {
    color: #DF4747;
  }

  .fuli-enhance.btn-search {
    padding: 0 .65rem;
  }

  .fuli-enhance.btn-filter {
    cursor: pointer;
    padding-left: 1.5rem;
    padding-right: 1.2rem;
    position: relative;
    border-right: 1px solid;
    ${isDarkMode ? 'border-color: #444444;' : ''};
  }

  .fuli-enhance.btn-filter:hover {
    ${isDarkMode ? '' : 'opacity: 1;'}
  }

  .search-bar {
    display: flex;
    align-items: center;
    border: 1px solid;
    border-radius: 4px;
    background-color: white;
    padding: .2rem .3rem;
  }

  .search-bar > [type=text] {
    width: 9rem;
    border: 0;
  }

  .search-bar > [type=text]:focus-visible {
    outline: 0;
  }

  .icon {
    width: 1rem;
    height: 1rem;
  }

  .icon-search {
    border-left: 1px solid;
    padding-left: .35rem;
    margin-left: .2rem;
  }

  .icon-close {
    transform: translate(2px, 2px);
    cursor: pointer;
  }

  .icon-filter {
    margin-left: .3rem;
  }

  .btn-filter:hover > #filter-popup {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    width: max-content;
  }

  #filter-popup {
    padding: .5rem;
    position: absolute;
    transform: translateX(-50%);
    left: 50%;
    top: 100%;
    z-index: 1;
    display: none;
    cursor: default;
    overflow: visible;
    background-color: ${isDarkMode ? '#272728' : '#FBFBFB'};
    ${isDarkMode ? 'color: #C7C6CB;' : ''}
  }

  #filter-popup::before {
    content: '';
    width: 0;
    height: 0;
    border: .4rem solid transparent;
    border-bottom: .35rem solid currentColor !important;
    position: absolute;
    transform: translateX(-50%);
    left: 50%;
    bottom: 100%;
  }

  #filter-popup label {
    cursor: pointer;
  }

  #exchange-item-counter,
  #bid-item-counter,
  #lottery-item-counter {
    color: #11AAC1;
  }

  #exchange-item-counter,
  #bid-item-counter {
    margin-right: .75rem;
  }

  .digital.current-bid {
    margin-left: 8px;
  }
`;
$('<style>').text(stylesheet).appendTo('head');

// 依照 URL Param 判斷是否執行後續程式
const newUrl = new URL(window.location);
const getParam = (param) => newUrl.searchParams.get(param);
const isOnHistoryPage = getParam('history') !== null && getParam('history') !== '0';
const isOnFirstPage = getParam('page') === null || getParam('page') === '1';
if (isOnHistoryPage) { return }
if (!isOnFirstPage) { window.location.replace('https://fuli.gamer.com.tw/shop.php') }

// 持有的巴幣存款
const DEPOSIT = +$('.brave-assets').text().replaceAll(/\D/g, '');

// .items-card .type-tag 的內文
const TYPE_TAG = {
  exchange: '直購',
  bid: '競標',
  lottery: '抽抽樂'
};

const itemCounter = new Proxy({
  exchange: 0,
  bid: 0,
  lottery: 0
}, {
  set(target, prop, value) {
    target[prop] = +value;
    $(`#${prop}-item-counter`).text(target[prop]);
    return true;
  }
})

class ItemCard {
  /** @param {HTMLElement|jQuery|string} itemCard */
  constructor (itemCard) {
    this.itemCard = itemCard;
    this.$itemCard = $(itemCard);
    this.type = $(itemCard).find('.type-tag').text().trim();
  }

  fetchCurrentBid () {
    if (this.type !== TYPE_TAG.bid) { return this } // 若非競標品則結束函式
    const $priceElement = this.$itemCard.find('.price');
    $priceElement.text('正在讀取目前出價');
    fetch(this.$itemCard.attr('href'), { method: 'GET' })
      .then(res => res.text())
      .then(data => {
        const parser = new DOMParser();
        const virtualDoc = parser.parseFromString(data, 'text/html');


        let currentBid;
        $(virtualDoc).find('.pbox-content').each((idnex, item) => {
          if (!$(item).text().includes('目前出價')) { return }
          if (!Number.isNaN(+currentBid)) { return }
          currentBid = $(item).find('.pbox-content-r').text().match(/[\d|,]+/)[0];
        });
        const newTextHTML = /* html */`目前出價<p class="digital current-bid">${currentBid}</p>巴幣`;
        $priceElement.html(newTextHTML);
        this.colorPriceTag();
      })
      .catch((error) => {
        $priceElement.text('讀取出價失敗！');
        console.error(error);
      });
  }

  colorPriceTag () {
    const $priceNumberElement = this.$itemCard.find('.digital');
    const price = +$priceNumberElement.text().replaceAll(/\D/g, '');
    if (DEPOSIT < price) { $priceNumberElement.addClass('unaffordable') }
  }

  registerCard () {
    // 依照商品卡種類，增加計數和取得目前出價
    switch (this.type) {
      case TYPE_TAG.exchange:
        itemCounter.exchange++;
        break;
      case TYPE_TAG.bid:
        itemCounter.bid++;
        break;
      case TYPE_TAG.lottery:
        itemCounter.lottery++;
        break;
    }
  }
}

class ItemCardList {
  /** @param {HTMLElement|jQuery|string} [itemCardList=$('.item-list-box a.items-card')] */
  constructor (itemCardList = $('.item-list-box a.items-card')) {
    this.$itemCardList = $(itemCardList);
  }

  filterByTitle (filterTitle) {
    this.$itemCardList.each((i, itemCard) => {
      const title = $(itemCard).find('.items-title').text();
      const filterClassName = 'filter-by-title';
      title.includes(filterTitle) ? $(itemCard).removeClass(filterClassName) : $(itemCard).addClass(filterClassName);
    });
  }

  filterByType (filterType) {
    this.$itemCardList.each((i, itemCard) => {
      const type = new ItemCard(itemCard).type;
      if (!type.includes(filterType)) { return }
      const filterClassName = 'filter-by-type';
      $(itemCard).toggleClass(filterClassName);
    });
  }
}

// 放置商品類型計數區塊
$('#forum-lastBoard').after(/* html */`
  <div class="m-hidden">
    <h5>現有商品數量</h5>
    <div class="BH-rbox flex-center">
      <span>直購：</span>
      <span id="exchange-item-counter">0</span>
      <span>競標：</span>
      <span id="bid-item-counter">0</span>
      <span>抽抽樂：</span>
      <span id="lottery-item-counter">0</span>
    </div>
  </div>
`);

// 放置功能按鈕
const $firstTabsBtn = $('.tabs-btn-box');
$firstTabsBtn.wrap(/* html */`<div id="tabs-btn-group"></div>`);
const $tabsBtnGroup = $('#tabs-btn-group');
const $newTabsBtn = $('<div>', { class: 'tabs-btn-box fuli-enhance-btn-box' });
$newTabsBtn.html(/* html */`
  <a class="flex-center btn-distance fuli-enhance btn-filter">
    <span>篩選器</span>
    <svg class="icon icon-filter" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
      <path d="M18.85 1.1A1.99 1.99 0 0 0 17.063 0H2.937a2 2 0 0 0-1.566 3.242L6.99 9.868 7 14a1 1 0 0 0 .4.8l4 3A1 1 0 0 0 13 17l.01-7.134 5.66-6.676a1.99 1.99 0 0 0 .18-2.09Z"/>
    </svg>
    <div id="filter-popup" class="tabs-btn-box">
      <div class="flex-center btn-distance fuli-enhance">
        <input id="hide-exchange-items" type="checkbox" data-keyword="${TYPE_TAG.exchange}">
        <label for="hide-exchange-items">隱藏直購</label>
      </div>
      <div class="flex-center btn-distance fuli-enhance">
        <input id="hide-bid-items" type="checkbox" data-keyword="${TYPE_TAG.bid}">
        <label for="hide-bid-items">隱藏競標</label>
      </div>
      <div class="flex-center btn-distance fuli-enhance">
        <input id="hide-lottery-items" type="checkbox" data-keyword="${TYPE_TAG.lottery}">
        <label for="hide-lottery-items">隱藏抽抽樂</label>
      </div>
    </div>
  </a>
  <a class="flex-center btn-distance fuli-enhance btn-search">
    <div class="search-bar">
      <input type="text">
      <svg class="icon icon-close" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
      </svg>
      <svg class="icon icon-search" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"></path>
      </svg>
    </div>
  </a>
`);
$newTabsBtn.on('change', '[type=checkbox]', function() {
  const typeTag = $(this).data('keyword');
  const itemCardList = new ItemCardList();
  itemCardList.filterByType(typeTag);
});
const iconClose = $newTabsBtn.find('.icon-close');
iconClose.on('click', () => {
  searchBar.value = '';
  const itemCardList = new ItemCardList();
  itemCardList.filterByTitle('');
});
const searchBar = $newTabsBtn.find('.search-bar > [type=text]');
searchBar.on('input', function() {
  const searchText = $(this).val();
  const itemCardList = new ItemCardList();
  itemCardList.filterByTitle(searchText);
});
$tabsBtnGroup.append($newTabsBtn);

$('a.items-card').each((i, card) => {
  // 依照商品卡種類，增加計數和取得目前出價
  const itemCard = new ItemCard($(card));
  itemCard.registerCard();
  if (itemCard.type === TYPE_TAG.bid) { itemCard.fetchCurrentBid() }
});

// 動態載入全部商品
const $itemListBox = $('.item-list-box');
const maxPage = $('.BH-pagebtnA a:last-child').text();
if (maxPage === '1') { return } // 若僅一頁則不需讀取
const observer = new MutationObserver((records) => {
  // 建立觀測器，觀測新加入的商品卡
  records.forEach((record) => {
    record.addedNodes.forEach((newNode) => {
      if (!$(newNode).hasClass('items-card')) { return }
      // 依照商品卡種類，增加計數和取得目前出價
      const itemCard = new ItemCard($(newNode));
      itemCard.registerCard();
      if (itemCard.type === TYPE_TAG.bid) { itemCard.fetchCurrentBid() }
    })
  })
});
observer.observe(document.querySelector('.item-list-box'), { childList: true });

for (let page = 2; page <= maxPage; page++) {
  fetch(`https://fuli.gamer.com.tw/shop.php?page=${page}`, { method: 'GET' })
    .then(res => res.text())
    .then(data => {
      const parser = new DOMParser();
      const virtualDoc = parser.parseFromString(data, 'text/html');

      const $items = $(virtualDoc).find('.item-list-box a.items-card');
      $items.each((i, item) => { $itemListBox.append(item) });
    });
}
