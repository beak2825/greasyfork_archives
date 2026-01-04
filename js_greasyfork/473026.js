// ==UserScript==
// @name         erogamescape-compare-sale-tables
// @namespace    http://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/
// @version      1.0.1
// @description  「ErogameScape -エロゲー批評空間-」のセール表同士を比較して差分を出す
// @author       ame-chan
// @match        http://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/*
// @match        https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/*
// @match        http://erogamescape.org/~ap2/ero/toukei_kaiseki/*
// @match        https://erogamescape.org/~ap2/ero/toukei_kaiseki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=erogamescape.dyndns.org
// @require      https://greasyfork.org/scripts/473024-tablesort-library/code/tablesort-library.js?version=1234866
// @require      https://greasyfork.org/scripts/473022-erogamescape-table-sorter/code/erogamescape-table-sorter.user.js?version=1.0.1
// @grant        unsafeWindow
// @license      MIT
// @run-at       document-idle
// @connect      erogamescape.dyndns.org
// @downloadURL https://update.greasyfork.org/scripts/473026/erogamescape-compare-sale-tables.user.js
// @updateURL https://update.greasyfork.org/scripts/473026/erogamescape-compare-sale-tables.meta.js
// ==/UserScript==
(async () => {
  'use strict';
  const addStyle = `<style id="compareSaleTables-userjs-style">
  body.is-loading::before {
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    width: 100vw;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 1000;
  }
  body.is-loading::after {
    position: absolute;
    top: calc(50vh - 125px);
    left: calc(50vw - 125px);
    content: "";
    display: block;
    width: 250px;
    height: 250px;
    background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' style='margin: auto; background: none; display: block; shape-rendering: auto; animation-play-state: running; animation-delay: 0s;' width='250px' height='250px' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid'%3E%3Cg transform='rotate(0 50 50)' style='animation-play-state: running; animation-delay: 0s;'%3E%3Crect x='47.5' y='27' rx='2.5' ry='2.9' width='5' height='10' fill='%23202020' style='animation-play-state: running; animation-delay: 0s;'%3E%3Canimate attributeName='opacity' values='1;0' keyTimes='0;1' dur='1s' begin='-0.9166666666666666s' repeatCount='indefinite' style='animation-play-state: running; animation-delay: 0s;'%3E%3C/animate%3E%3C/rect%3E%3C/g%3E%3Cg transform='rotate(30 50 50)' style='animation-play-state: running; animation-delay: 0s;'%3E%3Crect x='47.5' y='27' rx='2.5' ry='2.9' width='5' height='10' fill='%23202020' style='animation-play-state: running; animation-delay: 0s;'%3E%3Canimate attributeName='opacity' values='1;0' keyTimes='0;1' dur='1s' begin='-0.8333333333333334s' repeatCount='indefinite' style='animation-play-state: running; animation-delay: 0s;'%3E%3C/animate%3E%3C/rect%3E%3C/g%3E%3Cg transform='rotate(60 50 50)' style='animation-play-state: running; animation-delay: 0s;'%3E%3Crect x='47.5' y='27' rx='2.5' ry='2.9' width='5' height='10' fill='%23202020' style='animation-play-state: running; animation-delay: 0s;'%3E%3Canimate attributeName='opacity' values='1;0' keyTimes='0;1' dur='1s' begin='-0.75s' repeatCount='indefinite' style='animation-play-state: running; animation-delay: 0s;'%3E%3C/animate%3E%3C/rect%3E%3C/g%3E%3Cg transform='rotate(90 50 50)' style='animation-play-state: running; animation-delay: 0s;'%3E%3Crect x='47.5' y='27' rx='2.5' ry='2.9' width='5' height='10' fill='%23202020' style='animation-play-state: running; animation-delay: 0s;'%3E%3Canimate attributeName='opacity' values='1;0' keyTimes='0;1' dur='1s' begin='-0.6666666666666666s' repeatCount='indefinite' style='animation-play-state: running; animation-delay: 0s;'%3E%3C/animate%3E%3C/rect%3E%3C/g%3E%3Cg transform='rotate(120 50 50)' style='animation-play-state: running; animation-delay: 0s;'%3E%3Crect x='47.5' y='27' rx='2.5' ry='2.9' width='5' height='10' fill='%23202020' style='animation-play-state: running; animation-delay: 0s;'%3E%3Canimate attributeName='opacity' values='1;0' keyTimes='0;1' dur='1s' begin='-0.5833333333333334s' repeatCount='indefinite' style='animation-play-state: running; animation-delay: 0s;'%3E%3C/animate%3E%3C/rect%3E%3C/g%3E%3Cg transform='rotate(150 50 50)' style='animation-play-state: running; animation-delay: 0s;'%3E%3Crect x='47.5' y='27' rx='2.5' ry='2.9' width='5' height='10' fill='%23202020' style='animation-play-state: running; animation-delay: 0s;'%3E%3Canimate attributeName='opacity' values='1;0' keyTimes='0;1' dur='1s' begin='-0.5s' repeatCount='indefinite' style='animation-play-state: running; animation-delay: 0s;'%3E%3C/animate%3E%3C/rect%3E%3C/g%3E%3Cg transform='rotate(180 50 50)' style='animation-play-state: running; animation-delay: 0s;'%3E%3Crect x='47.5' y='27' rx='2.5' ry='2.9' width='5' height='10' fill='%23202020' style='animation-play-state: running; animation-delay: 0s;'%3E%3Canimate attributeName='opacity' values='1;0' keyTimes='0;1' dur='1s' begin='-0.4166666666666667s' repeatCount='indefinite' style='animation-play-state: running; animation-delay: 0s;'%3E%3C/animate%3E%3C/rect%3E%3C/g%3E%3Cg transform='rotate(210 50 50)' style='animation-play-state: running; animation-delay: 0s;'%3E%3Crect x='47.5' y='27' rx='2.5' ry='2.9' width='5' height='10' fill='%23202020' style='animation-play-state: running; animation-delay: 0s;'%3E%3Canimate attributeName='opacity' values='1;0' keyTimes='0;1' dur='1s' begin='-0.3333333333333333s' repeatCount='indefinite' style='animation-play-state: running; animation-delay: 0s;'%3E%3C/animate%3E%3C/rect%3E%3C/g%3E%3Cg transform='rotate(240 50 50)' style='animation-play-state: running; animation-delay: 0s;'%3E%3Crect x='47.5' y='27' rx='2.5' ry='2.9' width='5' height='10' fill='%23202020' style='animation-play-state: running; animation-delay: 0s;'%3E%3Canimate attributeName='opacity' values='1;0' keyTimes='0;1' dur='1s' begin='-0.25s' repeatCount='indefinite' style='animation-play-state: running; animation-delay: 0s;'%3E%3C/animate%3E%3C/rect%3E%3C/g%3E%3Cg transform='rotate(270 50 50)' style='animation-play-state: running; animation-delay: 0s;'%3E%3Crect x='47.5' y='27' rx='2.5' ry='2.9' width='5' height='10' fill='%23202020' style='animation-play-state: running; animation-delay: 0s;'%3E%3Canimate attributeName='opacity' values='1;0' keyTimes='0;1' dur='1s' begin='-0.16666666666666666s' repeatCount='indefinite' style='animation-play-state: running; animation-delay: 0s;'%3E%3C/animate%3E%3C/rect%3E%3C/g%3E%3Cg transform='rotate(300 50 50)' style='animation-play-state: running; animation-delay: 0s;'%3E%3Crect x='47.5' y='27' rx='2.5' ry='2.9' width='5' height='10' fill='%23202020' style='animation-play-state: running; animation-delay: 0s;'%3E%3Canimate attributeName='opacity' values='1;0' keyTimes='0;1' dur='1s' begin='-0.08333333333333333s' repeatCount='indefinite' style='animation-play-state: running; animation-delay: 0s;'%3E%3C/animate%3E%3C/rect%3E%3C/g%3E%3Cg transform='rotate(330 50 50)' style='animation-play-state: running; animation-delay: 0s;'%3E%3Crect x='47.5' y='27' rx='2.5' ry='2.9' width='5' height='10' fill='%23202020' style='animation-play-state: running; animation-delay: 0s;'%3E%3Canimate attributeName='opacity' values='1;0' keyTimes='0;1' dur='1s' begin='0s' repeatCount='indefinite' style='animation-play-state: running; animation-delay: 0s;'%3E%3C/animate%3E%3C/rect%3E%3C/g%3E%3C/svg%3E");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    z-index: 1001;
  }
  #extension-wrapper {
    position: fixed;
    top: 8px;
    right: 8px;
    padding: 8px;
    width: 300px;
    height: auto;
    text-align: left;
    background-color: #fff;
    border: 1px solid #202020;
    border-radius: 6px;
    z-index: 99999;
  }
  #extension-diffNotes {
    position: relative;
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
    user-select: none;
    cursor: pointer;
  }
  #extension-diffNotes::-webkit-details-marker {
    display: none;
  }
  #extension-diffNotes > span {
    padding-left: 8px;
    width: calc(100% - 24px);
  }
  #extension-diffNotes::before {
    display: block;
    content: "";
    width: 24px;
    height: 24px;
    background-image: url("data:image/svg+xml,%3Csvg width='800px' height='800px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.1018 16.9814C5.02785 16.9814 4.45387 15.7165 5.16108 14.9083L10.6829 8.59762C11.3801 7.80079 12.6197 7.80079 13.3169 8.59762L18.8388 14.9083C19.5459 15.7165 18.972 16.9814 17.898 16.9814H6.1018Z' fill='%23212121'/%3E%3C/svg%3E");
    background-size: contain;
  }
  #extension-wrapper[open] #extension-diffNotes::before {
    transform: rotate(180deg);
  }
  #extension-diffLists {
    overflow: hidden;
    position: relative;
    display: flex;
    margin: 4px 0 0;
    padding: 0;
    flex-wrap: wrap;
    gap: 4px;
  }
  #extension-diffLists.is-loading::before {
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.75);
  }
  #extension-diffLists.is-loading label,
  #extension-diffLists.is-loading label input {
    pointer-events: none;
  }
  #extension-diffLists label {
    display: flex;
    margin: 0;
    padding: 4px 8px;
    color: #202020;
    background: #bff;
    list-style-type: none;
    text-decoration: none;
    border: 1px solid #202020;
    border-radius: 4px;
    cursor: pointer;
  }
  #extension-diffLists label.is-hidden {
    display: none;
  }
  #extension-diffLists label:focus {
    outline: 0;
  }
  #extension-diffLists label:hover {
    background: #ffb;
  }
  #extension-diffLists label input {
    margin-right: 8px;
  }
  #extension-diffLists label input:focus {
    outline: 0;
  }
  .toukei_table.is-changed td {
    position: relative;
  }
  .toukei_table.is-changed div.tooltip {
    top: 0;
    left: -162px;
    align-items: center;
    justify-content: center;
    background-image: none;
    box-shadow: none;
    border: 1px solid #202020;
  }
  </style>`;
  const replacer = (str) => str.replace(/[\n\t\s]+/g, '');
  const getFileName = (path) => (path.split('/').pop() || '').replace('.php', '');
  const selector = '.toukei_table a[href*="game.php"]';
  const tableWrapperElm = document.querySelector('.recently_game_list');
  const toukeiTableElm = document.querySelector('.toukei_table');
  const targetElms = document.querySelectorAll(selector);
  const hasSaleInfo = (() => {
    const text = document.querySelector('.toukei_table td[style*="white-space"]')?.textContent ?? '';
    return /OFF|[0-9]+本で/.test(text);
  })();
  const fullPath = '/~ap2/ero/toukei_kaiseki/';
  if (toukeiTableElm === null || tableWrapperElm === null || !targetElms.length || !hasSaleInfo) {
    return;
  }
  if (document.querySelector('#compareSaleTables-userjs-style') === null) {
    document.head.insertAdjacentHTML('beforeend', addStyle);
  }
  const GLOBAL = {
    /** 比較済みならtrue */ isChangedTable: false,
    /** ローディング監視 */ isLoading: false,
  };
  const viewPageData = (() => {
    const result = {
      hasFanza: false,
      hasDlsite: false,
      fileName: '',
    };
    const titleElm = document.querySelector('#main_data_title');
    if (titleElm === null) return result;
    const title = replacer(titleElm.textContent || '');
    if (title === '') return result;
    result.hasFanza = (title.match(/FANZA/i) || []).length > 0;
    result.hasDlsite = (title.match(/DLSite/i) || []).length > 0;
    result.fileName = getFileName(location.pathname);
    return result;
  })();
  const fetchHTML = async (url) => {
    let topPageHtml = '';
    try {
      const res = await fetch(url);
      if (res.ok) {
        topPageHtml = await res.text();
      } else {
        throw new Error(res.statusText);
      }
    } catch (e) {
      throw new Error(String(e));
    }
    if (topPageHtml !== '') {
      const parser = new DOMParser();
      return parser.parseFromString(topPageHtml, 'text/html');
    }
    return false;
  };
  const getCampaignList = async () => {
    const topPageHTML = await fetchHTML(fullPath);
    if (topPageHTML === false) return {};
    const campaignLinks = topPageHTML.querySelectorAll('#campaignlist a[href*="half_price"]');
    const campaignList = {};
    for (const campaignLinkElm of campaignLinks) {
      const campaignName = replacer(campaignLinkElm.closest('dd')?.previousElementSibling?.textContent ?? '');
      if (campaignName === '') continue;
      const hasOriginalUrl = campaignLinkElm.href.includes(`${viewPageData.fileName}.php`);
      // 一方のセール表見てたらもう一方のセール表は除外したい
      const isDLSite = viewPageData.hasDlsite && /FANZA/i.test(campaignName);
      const isFanza = viewPageData.hasFanza && /DLSite/i.test(campaignName);
      // 今見てるセール表は除外する
      const isOriginalUrl = viewPageData.fileName.length > 0 && hasOriginalUrl;
      if (isDLSite || isFanza || isOriginalUrl) continue;
      campaignList[campaignName] = getFileName(campaignLinkElm.href);
    }
    return campaignList;
  };
  // セール表の先頭に他のセール表へのリンクと比較用ラジオボタンをセットする
  const createCampaignDiffList = async () => {
    const campaignList = await getCampaignList();
    const campaignListKeys = Object.keys(campaignList);
    if (!campaignListKeys.length) {
      console.error('キャンペーン取得失敗');
      return false;
    }
    let campaignListHTML = `<details id="extension-wrapper">
    <summary id="extension-diffNotes">
      <span>現在表示しているセール表と比較し、以下のセール表のみにあるセールを抜き出します</span>
    </summary>
    <div id="extension-diffLists">`;
    for (const key of campaignListKeys) {
      const fileName = campaignList[key];
      campaignListHTML += `<label for="${fileName}">
        <input type="radio" id="${fileName}" name="extension-diffListName" value="${fileName}">
        <p>
          ${key}（<a href="${fileName}.php">リンク</a>）
        </p>
      </label>`;
    }
    campaignListHTML += `<label for="${viewPageData.fileName}" class="is-hidden">
      <input type="radio" id="${viewPageData.fileName}" name="extension-diffListName" value="${viewPageData.fileName}">
      <p>現在の表を元に戻す</p>
    </label>`;
    campaignListHTML += '</div></details>';
    document.body.insertAdjacentHTML('afterbegin', campaignListHTML);
    return true;
  };
  const getTableData = (tableAnchorElms) => {
    const table = {};
    for (const tableAnchorElm of tableAnchorElms) {
      const url = new URL(tableAnchorElm.href);
      const param = new URLSearchParams(url.search);
      const key = param.get('game');
      const value = tableAnchorElm.closest('tr')?.outerHTML || null;
      if (key && value) {
        table[key] = value;
      }
    }
    return table;
  };
  const observeLoading = () => {
    const diffListElm = document.querySelector('#extension-diffLists');
    if (diffListElm === null) return;
    let isLoading = GLOBAL.isLoading;
    Object.defineProperty(GLOBAL, 'isLoading', {
      get: () => isLoading,
      set: (newValue) => {
        isLoading = newValue;
        if (isLoading) {
          document.body.classList.add('is-loading');
          diffListElm.classList.add('is-loading');
        } else {
          document.body.classList.remove('is-loading');
          diffListElm.classList.remove('is-loading');
        }
      },
    });
  };
  const observeTable = () => {
    const viewPageLabelElm = document.querySelector(`label[for="${viewPageData.fileName}"]`);
    if (viewPageLabelElm === null) return;
    let isChangedTable = GLOBAL.isChangedTable;
    Object.defineProperty(GLOBAL, 'isChangedTable', {
      get: () => isChangedTable,
      set: (newValue) => {
        isChangedTable = newValue;
        if (isChangedTable) {
          viewPageLabelElm.classList.remove('is-hidden');
        } else {
          viewPageLabelElm.classList.add('is-hidden');
        }
      },
    });
  };
  const restoreTooltipEvent = () => {
    const tooltipElms = document.querySelectorAll('a.tooltip');
    const hoverEventHandler = (e, isEnter) => {
      const self = e.currentTarget;
      const tooltipElm = self.querySelector('div.tooltip');
      if (tooltipElm !== null) {
        tooltipElm.style.display = isEnter ? 'flex' : 'none';
      }
    };
    toukeiTableElm.classList.add('is-changed');
    for (const tooltipElm of tooltipElms) {
      const parentTd = tooltipElm.closest('td');
      if (parentTd !== null) {
        parentTd.addEventListener('mouseover', (e) => hoverEventHandler(e, true));
        parentTd.addEventListener('mouseleave', (e) => hoverEventHandler(e, false));
      }
    }
  };
  const setDiffEvent = (originalTable) => {
    const radioElms = document.querySelectorAll('[name="extension-diffListName"]');
    const changeEventHandler = async (e) => {
      GLOBAL.isLoading = true;
      const toukeiTableElm = document.querySelector('.toukei_table tbody');
      const self = e.currentTarget;
      const isOriginalTable = self.value === viewPageData.fileName;
      const firstTrHTML =
        '<tr data-sort-method="none"><th>ゲーム名</th><th class="th_brand">ブランド名</th><th class="th_price">価格</th><th class="th_value">中央値</th><th class="th_value">標準偏差</th><th class="th_value">データ数</th></tr>';
      const createDiffTable = async () => {
        const campaignHTML = await fetchHTML(`${fullPath}${self.value}.php`);
        if (campaignHTML === false) return '';
        const targetElms = campaignHTML.querySelectorAll(selector);
        if (!targetElms.length) return '';
        const diffTable = getTableData(targetElms);
        const originalKeys = Object.keys(originalTable);
        const diffKeys = Object.keys(diffTable);
        const mergeTable = {
          ...originalTable,
          ...diffTable,
        };
        // 現在のセール表と比較し、対象のセール表のみにあるセールを抜き出す
        const diff = diffKeys.filter((key) => !originalKeys.includes(key));
        let html = '';
        for (const key of diff) {
          const trHTML = mergeTable[key];
          if (typeof trHTML !== 'undefined') {
            html += trHTML;
          }
        }
        return html;
      };
      const restoreOriginalTable = () => {
        const keys = Object.keys(originalTable);
        let html = '';
        for (const key of keys) {
          const trHTML = originalTable[key];
          html += trHTML;
        }
        return html;
      };
      if (toukeiTableElm !== null) {
        let newHTML = firstTrHTML;
        if (isOriginalTable) {
          newHTML += restoreOriginalTable();
        } else {
          newHTML += await createDiffTable();
          GLOBAL.isChangedTable = true;
        }
        toukeiTableElm.innerHTML = newHTML;
        if (typeof unsafeWindow.setTableSort === 'function') {
          unsafeWindow.setTableSort();
        }
        restoreTooltipEvent();
        const medianValue = document.querySelector('.toukei_table th.th_value[role="columnheader"]');
        // 中央値を降順にする
        if (medianValue !== null) {
          medianValue.click();
          medianValue.click();
        }
      }
      GLOBAL.isLoading = false;
    };
    if (!radioElms.length) return;
    observeLoading();
    observeTable();
    for (const radioElm of radioElms) {
      radioElm.addEventListener('change', changeEventHandler);
    }
  };
  const originalTable = getTableData(targetElms);
  const isCreateDiffList = await createCampaignDiffList();
  if (isCreateDiffList) {
    setDiffEvent(originalTable);
    setTimeout(() => {
      document.querySelector('#extension-diffNotes')?.click();
    }, 500);
  }
})();
