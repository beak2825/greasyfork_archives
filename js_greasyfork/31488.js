// ==UserScript==
// @name        steam卡牌利润最大化
// @namespace   https://github.com/lzghzr/GreasemonkeyJS
// @version     0.2.26
// @author      lzghzr
// @description 按照美元区出价, 最大化steam卡牌卖出的利润
// @supportURL  https://github.com/lzghzr/GreasemonkeyJS/issues
// @match       http://steamcommunity.com/*/inventory/
// @match       https://steamcommunity.com/*/inventory/
// @connect     finance.pae.baidu.com
// @license     MIT
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/31488/steam%E5%8D%A1%E7%89%8C%E5%88%A9%E6%B6%A6%E6%9C%80%E5%A4%A7%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/31488/steam%E5%8D%A1%E7%89%8C%E5%88%A9%E6%B6%A6%E6%9C%80%E5%A4%A7%E5%8C%96.meta.js
// ==/UserScript==
const W = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;
let gInputUSDCNY;
let gDivLastChecked;
let gInputAddCent;
let gSpanQuickSurplus;
let gSpanQuickError;
const gDivItems = [];
const gQuickSells = [];
addCSS();
addUI();
doLoop();
const elmDivActiveInventoryPage = document.querySelector('#inventories');
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    const rt = mutation.target;
    if (rt.classList.contains('inventory_page')) {
      const itemHolders = rt.querySelectorAll('.itemHolder');
      itemHolders.forEach(itemHolder => {
        const rgItem = itemHolder.rgItem;
        if (rgItem !== undefined && !gDivItems.includes(rgItem.element) && rgItem.description.marketable === 1) {
          gDivItems.push(rgItem.element);
          const elmDiv = document.createElement('div');
          elmDiv.classList.add('scmpItemCheckbox');
          rgItem.element.appendChild(elmDiv);
        }
      });
    }
  });
});
observer.observe(elmDivActiveInventoryPage, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
async function addUI() {
  const elmDivInventoryPageRight = document.querySelector('.inventory_page_right');
  const elmDiv = document.createElement('div');
  elmDiv.innerHTML = `
<div class="scmpQuickSell">快速以此价格出售:
  <span class="btn_green_white_innerfade" id="scmpQuickSellItem">null</span>
  <span>
  加价: $
  <input class="filter_search_box" id="scmpAddCent" type="number" value="0.00" step="0.01">
  </span>
</div>
<div>
  汇率:
  <input class="filter_search_box" id="scmpExch" type="number" value="6.50">
  <span class="btn_green_white_innerfade" id="scmpQuickAllItem">快速出售</span>
  剩余:
  <span id="scmpQuickSurplus">0</span>
  失败:
  <span id="scmpQuickError">0</span>
</div>`;
  elmDivInventoryPageRight.appendChild(elmDiv);
  const elmSpanQuickSellItem = elmDiv.querySelector('#scmpQuickSellItem');
  const elmSpanQuickAllItem = document.querySelector('#scmpQuickAllItem');
  gInputAddCent = elmDiv.querySelector('#scmpAddCent');
  gSpanQuickSurplus = elmDiv.querySelector('#scmpQuickSurplus');
  gSpanQuickError = elmDiv.querySelector('#scmpQuickError');
  document.addEventListener('click', async (ev) => {
    const evt = ev.target;
    if (evt.className === 'inventory_item_link') {
      elmSpanQuickSellItem.innerText = 'null';
      const rgItem = evt.parentNode.rgItem;
      const itemInfo = new ItemInfo(rgItem);
      const priceOverview = await getPriceOverview(itemInfo);
      if (priceOverview !== 'error')
        elmSpanQuickSellItem.innerText = priceOverview.formatPrice;
    }
    else if (evt.classList.contains('scmpItemCheckbox')) {
      const rgItem = evt.parentNode.rgItem;
      const select = evt.classList.contains('scmpItemSelect');
      const changeClass = (elmDiv) => {
        const elmCheckbox = elmDiv.querySelector('.scmpItemCheckbox');
        if (elmDiv.parentNode.style.display !== 'none' && !elmCheckbox.classList.contains('scmpItemSuccess')) {
          elmCheckbox.classList.remove('scmpItemError');
          elmCheckbox.classList.toggle('scmpItemSelect', !select);
        }
      };
      if (gDivLastChecked !== undefined && ev.shiftKey) {
        const start = gDivItems.indexOf(gDivLastChecked);
        const end = gDivItems.indexOf(rgItem.element);
        const someDivItems = gDivItems.slice(Math.min(start, end), Math.max(start, end) + 1);
        for (const y of someDivItems)
          changeClass(y);
      }
      else
        changeClass(rgItem.element);
      gDivLastChecked = rgItem.element;
    }
  });
  elmSpanQuickSellItem.addEventListener('click', (ev) => {
    const evt = ev.target;
    const elmDivActiveInfo = document.querySelector('.activeInfo');
    const rgItem = elmDivActiveInfo.rgItem;
    const elmDivitemCheck = rgItem.element.querySelector('.scmpItemCheckbox');
    if (!elmDivitemCheck.classList.contains('scmpItemSuccess') && evt.innerText !== 'null') {
      const price = W.GetPriceValueAsInt(evt.innerText);
      const itemInfo = new ItemInfo(rgItem, price);
      quickSellItem(itemInfo);
    }
  });
  elmSpanQuickAllItem.addEventListener('click', () => {
    const elmDivItemInfos = document.querySelectorAll('.scmpItemSelect');
    elmDivItemInfos.forEach(elmDivItemInfo => {
      const rgItem = elmDivItemInfo.parentNode.rgItem;
      const itemInfo = new ItemInfo(rgItem);
      if (rgItem.description.marketable === 1)
        gQuickSells.push(itemInfo);
    });
  });
  gInputAddCent.addEventListener('input', () => {
    const activeInfo = document.querySelector('.activeInfo > .inventory_item_link');
    activeInfo.click();
  });
  gInputUSDCNY = elmDiv.querySelector('#scmpExch');
  const baiduExch = await XHR({
    GM: true,
    method: 'GET',
    url: 'https://finance.pae.baidu.com/vapi/v1/getquotation?group=huilv_minute&need_reverse_real=1&code=USDCNY',
    responseType: 'json',
  });
  if (baiduExch?.body?.Result !== undefined && baiduExch.response.status === 200) {
    baiduExch.body.Result.pankouinfos.list.forEach(list => {
      if (list.ename === 'preClose')
        gInputUSDCNY.value = list.value;
    });
  }
}
async function getPriceOverview(itemInfo) {
  const priceoverview = await XHR({
    method: 'GET',
    url: `/market/priceoverview/?country=US&currency=1&appid=${itemInfo.rgItem.description.appid}\
&market_hash_name=${encodeURIComponent(W.GetMarketHashName(itemInfo.rgItem.description))}`,
    responseType: 'json'
  });
  const stop = () => itemInfo.status = 'error';
  if (priceoverview !== undefined && priceoverview.response.status === 200
    && priceoverview.body.success && priceoverview.body.lowest_price) {
    itemInfo.lowestPrice = priceoverview.body.lowest_price.replace('$', '');
    return calculatePrice(itemInfo);
  }
  else {
    const marketListings = await XHR({
      method: 'GET',
      url: `/market/listings/${itemInfo.rgItem.description.appid}\
/${encodeURIComponent(W.GetMarketHashName(itemInfo.rgItem.description))}`
    });
    if (marketListings === undefined || marketListings.response.status !== 200)
      return stop();
    const marketLoadOrderSpread = marketListings.body.match(/Market_LoadOrderSpread\( (\d+)/);
    if (marketLoadOrderSpread === null)
      return stop();
    const itemordershistogram = await XHR({
      method: 'GET',
      url: `/market/itemordershistogram/?country=US&language=english&currency=1&item_nameid=${marketLoadOrderSpread[1]}&two_factor=0`,
      responseType: 'json'
    });
    if (itemordershistogram?.body?.sell_order_graph[0] === undefined || itemordershistogram.response.status !== 200
      || itemordershistogram.body.success !== 1)
      return stop();
    itemInfo.lowestPrice = ' ' + itemordershistogram.body.sell_order_graph[0][0];
    return calculatePrice(itemInfo);
  }
}
function calculatePrice(itemInfo) {
  let price = W.GetPriceValueAsInt(itemInfo.lowestPrice);
  const addCent = parseFloat(gInputAddCent.value) * 100;
  const exchangeRate = parseFloat(gInputUSDCNY.value);
  const publisherFee = itemInfo.rgItem.description.market_fee || W.g_rgWalletInfo.wallet_publisher_fee_percent_default;
  const feeInfo = W.CalculateFeeAmount(price, publisherFee);
  price = price - feeInfo.fees;
  itemInfo.price = Math.floor((price + addCent) * exchangeRate);
  itemInfo.formatPrice = W.v_currencyformat(itemInfo.price, W.GetCurrencyCode(W.g_rgWalletInfo.wallet_currency));
  return itemInfo;
}
async function quickSellItem(itemInfo) {
  itemInfo.status = 'run';
  const sellitem = await XHR({
    method: 'POST',
    url: 'https://steamcommunity.com/market/sellitem/',
    data: `sessionid=${W.g_sessionID}&appid=${itemInfo.rgItem.description.appid}\
&contextid=${itemInfo.rgItem.contextid}&assetid=${itemInfo.rgItem.assetid}&amount=1&price=${itemInfo.price}`,
    responseType: 'json',
    withCredentials: true
  });
  if (sellitem === undefined || sellitem.response.status !== 200 || !sellitem.body.success)
    itemInfo.status = 'error';
  else
    itemInfo.status = 'success';
}
async function doLoop() {
  const itemInfo = gQuickSells.shift();
  const loop = () => {
    setTimeout(() => {
      doLoop();
    }, 500);
  };
  if (itemInfo !== undefined) {
    const priceOverview = await getPriceOverview(itemInfo);
    if (priceOverview !== 'error') {
      await quickSellItem(priceOverview);
      doLoop();
    }
    else
      loop();
  }
  else
    loop();
}
function addCSS() {
  GM_addStyle(`
.scmpItemSelect {
  background: yellow;
}
.scmpItemRun {
  background: blue;
}
.scmpItemSuccess {
  background: green;
}
.scmpItemError {
  background: red;
}
.scmpItemCheckbox {
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  border: 2px solid yellow;
  opacity: 0.7;
  cursor: default;
}
.scmpItemCheckbox:hover {
  opacity: 1;
}
#scmpExch {
  width: 3.3em;
  -moz-appearance: textfield;
}
#scmpExch::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
#scmpAddCent {
  width: 3.9em;
}`);
}
function XHR(XHROptions) {
  return new Promise(resolve => {
    const onerror = (error) => {
      console.error(error);
      resolve(undefined);
    };
    if (XHROptions.GM) {
      if (XHROptions.method === 'POST') {
        if (XHROptions.headers === undefined)
          XHROptions.headers = {};
        if (XHROptions.headers['Content-Type'] === undefined)
          XHROptions.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
      }
      XHROptions.timeout = 30 * 1000;
      XHROptions.onload = res => resolve({ response: res, body: res.response });
      XHROptions.onerror = onerror;
      XHROptions.ontimeout = onerror;
      GM_xmlhttpRequest(XHROptions);
    }
    else {
      const xhr = new XMLHttpRequest();
      xhr.open(XHROptions.method, XHROptions.url);
      if (XHROptions.method === 'POST' && xhr.getResponseHeader('Content-Type') === null)
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
      if (XHROptions.withCredentials)
        xhr.withCredentials = true;
      if (XHROptions.responseType !== undefined)
        xhr.responseType = XHROptions.responseType;
      xhr.timeout = 30 * 1000;
      xhr.onload = ev => {
        const res = ev.target;
        resolve({ response: res, body: res.response });
      };
      xhr.onerror = onerror;
      xhr.ontimeout = onerror;
      xhr.send(XHROptions.data);
    }
  });
}
class ItemInfo {
  constructor(rgItem, price) {
    this.rgItem = rgItem;
    if (price !== undefined)
      this.price = price;
  }
  rgItem;
  price;
  formatPrice;
  _status = '';
  get status() {
    return this._status;
  }
  set status(valve) {
    this._status = valve;
    const elmCheckbox = this.rgItem.element.querySelector('.scmpItemCheckbox');
    if (elmCheckbox === null)
      return;
    switch (valve) {
      case 'run':
        elmCheckbox.classList.remove('scmpItemError');
        elmCheckbox.classList.remove('scmpItemSelect');
        elmCheckbox.classList.add('scmpItemRun');
        break;
      case 'success':
        gSpanQuickSurplus.innerText = gQuickSells.length.toString();
        elmCheckbox.classList.remove('scmpItemError');
        elmCheckbox.classList.remove('scmpItemRun');
        elmCheckbox.classList.add('scmpItemSuccess');
        break;
      case 'error':
        gSpanQuickSurplus.innerText = gQuickSells.length.toString();
        gSpanQuickError.innerText = (parseInt(gSpanQuickError.innerText) + 1).toString();
        elmCheckbox.classList.remove('scmpItemRun');
        elmCheckbox.classList.add('scmpItemError');
        elmCheckbox.classList.add('scmpItemSelect');
        break;
      default:
        break;
    }
  }
  lowestPrice;
}