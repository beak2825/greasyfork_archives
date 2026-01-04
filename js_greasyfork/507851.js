// ==UserScript==
// @name         DLsite 譯者工具 檢查作品翻譯狀態
// @namespace    https://github.com/SnowAgar25
// @version      3.3.1
// @author       SnowAgar25
// @description  當滑鼠對準任何含有RJ號href的物件時，將顯示一個預覽框，顯示翻譯報酬和申請情況
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dlsite.com
// @match        https://*.dlsite.com/*
// @match        https://github.com/SnowAgar25/dlsite-translator-tool
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/507851/DLsite%20%E8%AD%AF%E8%80%85%E5%B7%A5%E5%85%B7%20%E6%AA%A2%E6%9F%A5%E4%BD%9C%E5%93%81%E7%BF%BB%E8%AD%AF%E7%8B%80%E6%85%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/507851/DLsite%20%E8%AD%AF%E8%80%85%E5%B7%A5%E5%85%B7%20%E6%AA%A2%E6%9F%A5%E4%BD%9C%E5%93%81%E7%BF%BB%E8%AD%AF%E7%8B%80%E6%85%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  function createPreviewBox() {
    const box = document.createElement("div");
    box.style.cssText = `
    position: fixed;
    background: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 1000;
    font-size: 14px;
    line-height: 1.4;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  `;
    document.body.appendChild(box);
    return box;
  }
  function calculatePosition(x, y, boxWidth, boxHeight) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    let left = x + 15;
    let top = y + 15;
    if (left + boxWidth > viewportWidth) {
      left = x - boxWidth - 15;
    }
    if (top + boxHeight > viewportHeight) {
      top = y - boxHeight - 15;
    }
    left = Math.max(10, left);
    top = Math.max(10, top);
    return { left, top };
  }
  function addTranslationTableStyles() {
    _GM_addStyle(`
        .translation_table {
            border-collapse: separate;
            font-size: 12px;
            white-space: nowrap;
        }
        .translation_table th {
            padding: 8px;
            min-width: 70px;
            color: #536280;
            background: #e6eaf2;
            text-align: center;
            border: solid 1px #fff;
        }
        .translation_table td {
            padding: 5px 3px;
            text-align: center;
            vertical-align: middle;
        }
        .translation_table tr:not(:nth-child(-n+2)) td {
            border-top: solid 1px #e6eaf2;
        }
        .translation_table td strong {
            font-size: 1.2em;
            padding-right: 2px;
            color: #56c323;
        }
        .translation_table .date {
            font-size: 12px;
        }
    `);
  }
  async function fetchProductInfo(productId) {
    const url = `https://www.dlsite.com/maniax/product/info/ajax?product_id=${productId}&cdn_cache_min=1`;
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method: "GET",
        url,
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        onload: function(response) {
          if (response.status === 200) {
            const data = JSON.parse(response.responseText);
            const productInfo = data[productId];
            if (productInfo) {
              resolve(productInfo);
            } else {
              reject("Product info not found");
            }
          } else {
            reject(`Failed to fetch product info: ${response.status}`);
          }
        },
        onerror: function(error) {
          reject(`Error fetching product info: ${error}`);
        }
      });
    });
  }
  async function fetchTranslationTable(productId, subDomain) {
    const url = `https://www.dlsite.com/${subDomain}/works/translatable/ajax?keyword=${productId}`;
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method: "GET",
        url,
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        },
        onload: function(response) {
          if (response.status !== 200) {
            reject(`Failed to fetch translation table: ${response.status}`);
            return;
          }
          const data = JSON.parse(response.responseText);
          const searchResult = data.search_result;
          const parser = new DOMParser();
          const doc = parser.parseFromString(searchResult, "text/html");
          const targetDiv = doc.querySelector(`li.search_result_img_box_inner > div[data-product_id="${productId}"]`);
          if (!targetDiv) {
            reject(`Div with data-product_id="${productId}" not found`);
            return;
          }
          const parentElement = targetDiv.parentElement;
          if (!parentElement) {
            reject("Parent element of target div not found");
            return;
          }
          const table = parentElement.querySelector("table.translation_table");
          if (!table) {
            reject("Translation table not found in the parent element");
            return;
          }
          const tbody = table.querySelector("tbody");
          const rows = tbody == null ? void 0 : tbody.querySelectorAll("tr");
          if (rows) {
            for (let i = 5; i < rows.length; i++) {
              tbody == null ? void 0 : tbody.removeChild(rows[i]);
            }
          }
          resolve({ html: table.outerHTML });
        },
        onerror: function(error) {
          reject(`Error fetching translation table: ${error}`);
        }
      });
    });
  }
  const priceTable = [
    { 販売価格: 110, 卸価格: 53 },
    { 販売価格: 220, 卸価格: 107 },
    { 販売価格: 330, 卸価格: 161 },
    { 販売価格: 440, 卸価格: 215 },
    { 販売価格: 550, 卸価格: 269 },
    { 販売価格: 660, 卸価格: 323 },
    { 販売価格: 770, 卸価格: 431 },
    { 販売価格: 880, 卸価格: 485 },
    { 販売価格: 990, 卸価格: 539 },
    { 販売価格: 1100, 卸価格: 647 },
    { 販売価格: 1210, 卸価格: 754 },
    { 販売価格: 1320, 卸価格: 862 },
    { 販売価格: 1430, 卸価格: 970 },
    { 販売価格: 1540, 卸価格: 1024 },
    { 販売価格: 1650, 卸価格: 1078 },
    { 販売価格: 1760, 卸価格: 1186 },
    { 販売価格: 1870, 卸価格: 1294 },
    { 販売価格: 1980, 卸価格: 1401 },
    { 販売価格: 2090, 卸価格: 1509 },
    { 販売価格: 2200, 卸価格: 1563 },
    { 販売価格: 2310, 卸価格: 1617 },
    { 販売価格: 2420, 卸価格: 1725 },
    { 販売価格: 2530, 卸価格: 1833 },
    { 販売価格: 2640, 卸価格: 1941 },
    { 販売価格: 2750, 卸価格: 2049 },
    { 販売価格: 2860, 卸価格: 2102 },
    { 販売価格: 2970, 卸価格: 2156 },
    { 販売価格: 3080, 卸価格: 2264 },
    { 販売価格: 3190, 卸価格: 2372 },
    { 販売価格: 3300, 卸価格: 2480 },
    { 販売価格: 3410, 卸価格: 2588 },
    { 販売価格: 3520, 卸価格: 2642 },
    { 販売価格: 3630, 卸価格: 2696 },
    { 販売価格: 3740, 卸価格: 2803 },
    { 販売価格: 3850, 卸価格: 2911 },
    { 販売価格: 3960, 卸価格: 3019 },
    { 販売価格: 4070, 卸価格: 3127 },
    { 販売価格: 4180, 卸価格: 3235 },
    { 販売価格: 4290, 卸価格: 3343 }
  ];
  function getWholesalePrice(販売価格) {
    if (販売価格 >= 4400) {
      return Math.floor(販売価格 * 0.784);
    }
    const priceRow = priceTable.find((row) => row.販売価格 === 販売価格);
    if (priceRow) {
      return priceRow.卸価格;
    } else {
      throw new Error("沒有相應價格，又不超過4400，出Bug了？");
    }
  }
  let previewBox = null;
  let isVisible = false;
  let hideTimeout = null;
  let currentProductId = null;
  let isFetching = false;
  let fetchingProductId = null;
  const productCache = {};
  function showPreviewBox(x, y) {
    if (!previewBox) return;
    clearTimeout(hideTimeout);
    previewBox.style.width = "auto";
    previewBox.style.height = "auto";
    const boxRect = previewBox.getBoundingClientRect();
    const { left, top } = calculatePosition(x, y, boxRect.width, boxRect.height);
    previewBox.style.left = `${left}px`;
    previewBox.style.top = `${top}px`;
    if (!isVisible) {
      isVisible = true;
      previewBox.style.opacity = "1";
      previewBox.style.display = "block";
    }
  }
  function hidePreviewBox() {
    if (isVisible && previewBox) {
      isVisible = false;
      previewBox.style.opacity = "0";
      hideTimeout = window.setTimeout(() => {
        if (previewBox) previewBox.style.display = "none";
        currentProductId = null;
        fetchingProductId = null;
      }, 300);
    }
  }
  async function handleMouseEnter(event) {
    var _a, _b;
    const target = event.target;
    const link = target.closest('a[href*="product_id/RJ"]');
    if (link instanceof HTMLAnchorElement) {
      link.removeAttribute("title");
      const productId = (_a = link.href.match(/product_id\/(\w+)/)) == null ? void 0 : _a[1];
      const subDomain = (_b = link.href.match(/dlsite\.com\/([^/]+)/)) == null ? void 0 : _b[1];
      if (productId && subDomain) {
        await fetchAndDisplayProductInfo(productId, event.clientX, event.clientY, subDomain);
      }
    }
  }
  async function fetchAndDisplayProductInfo(productId, x, y, subDomain) {
    if (productId === currentProductId) {
      showPreviewBox(x, y);
      return;
    }
    if (isFetching && fetchingProductId === productId) {
      return;
    }
    currentProductId = productId;
    showPreviewBox(x, y);
    if (productCache[productId]) {
      displayProductInfo(productCache[productId], productId, x, y, subDomain);
      return;
    }
    if (previewBox) previewBox.innerHTML = "加載中...";
    try {
      isFetching = true;
      fetchingProductId = productId;
      const productInfo = await fetchProductInfo(productId);
      productCache[productId] = productInfo;
      if (currentProductId === productId) {
        displayProductInfo(productInfo, productId, x, y, subDomain);
      }
    } catch (error) {
      console.error("Error fetching product info:", error);
      if (previewBox && currentProductId === productId) previewBox.innerHTML = "加載失敗";
    } finally {
      isFetching = false;
      fetchingProductId = null;
    }
  }
  function displayProductInfo(info, productId, x, y, subDomain) {
    if (!previewBox || currentProductId !== productId) return;
    const translationInfo = info.translation_info;
    const content = [];
    if (translationInfo.is_translation_agree) {
      content.push(`<span style="color: green;">允許翻譯</span>`);
    }
    if (!translationInfo.is_translation_agree && !translationInfo.original_workno) {
      content.push(`<span style="color: red;">不允許翻譯</span>`);
    }
    if (translationInfo.original_workno) {
      content.push(`<span style="color: blue;">已是翻譯作品</span>`);
    }
    if (translationInfo.is_translation_agree) {
      const translatorRate = 100 - translationInfo.production_trade_price_rate;
      content.push(`譯者分成: ${translatorRate}%`);
      if (info.official_price) {
        const 卸価格 = getWholesalePrice(info.official_price);
        if (卸価格) {
          const predictedCompensation = Math.floor(卸価格 * (translatorRate / 100));
          content.push(`預測報酬: ${predictedCompensation} 日元 (基於卸価格 ${卸価格} 日元)`);
        } else {
          content.push(`無法計算預測報酬 (未找到對應的卸価格)`);
        }
      }
    }
    previewBox.innerHTML = content.join("<br>");
    showPreviewBox(x, y);
    if (translationInfo.is_translation_agree) {
      if (productCache[productId].translationTable) {
        previewBox.innerHTML += "<br>" + productCache[productId].translationTable;
        showPreviewBox(x, y);
      } else {
        fetchTranslationTable(productId, subDomain).then((table) => {
          if (previewBox && currentProductId === productId) {
            previewBox.innerHTML += "<br>" + table.html;
            productCache[productId].translationTable = table.html;
            showPreviewBox(x, y);
          }
        }).catch((error) => {
          console.error("Error fetching translation table:", error);
        });
      }
    }
  }
  function initPreviewBox() {
    addTranslationTableStyles();
    previewBox = createPreviewBox();
    document.body.addEventListener("mouseover", handleMouseEnter);
    document.body.addEventListener("mousemove", (e) => isVisible && showPreviewBox(e.clientX, e.clientY));
    document.body.addEventListener("mouseout", hidePreviewBox);
  }
  function addNavLink(href, text, iconClass, iconContent) {
    const addNavItem = () => {
      const navList = document.querySelector(".floorSubNav-item > ul.headerNav");
      if (!navList) return;
      const newNavItem = document.createElement("li");
      newNavItem.className = "headerNav-item";
      const newLink = document.createElement("a");
      newLink.href = href;
      newLink.textContent = text;
      newLink.className = iconClass;
      newNavItem.appendChild(newLink);
      navList.appendChild(newNavItem);
    };
    addNavItem();
    if (!document.querySelector(".floorSubNav-item > ul.headerNav")) {
      const observer = new MutationObserver((_, obs) => {
        if (document.querySelector(".floorSubNav-item > ul.headerNav")) {
          addNavItem();
          obs.disconnect();
        }
      });
      const observeDOM = () => {
        if (document.body) {
          observer.observe(document.body, { childList: true, subtree: true });
        } else {
          setTimeout(observeDOM, 10);
        }
      };
      observeDOM();
    }
    _GM_addStyle(`
    .headerNav .headerNav-item .${iconClass}::before {
      content: "${iconContent}";
    }
  `);
  }
  function initCustomNavLinks() {
    var _a;
    const subdomain = (_a = window.location.href.match(/dlsite\.com\/(\w+)/)) == null ? void 0 : _a[1];
    addNavLink(`https://www.dlsite.com/${subdomain}/works/translatable`, "翻訳許可作品", "magnifying-glass", "\\f002");
    addNavLink("https://www.dlsite.com/translator/work", "翻訳申請", "translate-icon", "\\f1ab");
  }
  const DB_NAME = "DLSiteCache";
  const STORE_NAME = "pages";
  const CACHE_KEY = "dlsite_translatable_cache";
  async function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onerror = () => reject("Error opening database");
      request.onsuccess = (event) => {
        const db = event.target.result;
        resolve(db);
      };
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      };
    });
  }
  async function saveToIndexedDB(key, data) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({ key, value: data });
      request.onerror = () => reject("Error saving to IndexedDB");
      request.onsuccess = () => resolve();
    });
  }
  async function getFromIndexedDB(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onerror = () => reject("Error getting from IndexedDB");
      request.onsuccess = () => resolve(request.result ? request.result.value : null);
    });
  }
  async function clearFromIndexedDB(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);
      request.onerror = () => reject("Error clearing from IndexedDB");
      request.onsuccess = () => resolve();
    });
  }
  function modifyPage(doc) {
    try {
      const styleElement = document.createElement("style");
      styleElement.textContent = `
            .custom-button {
                background-color: #4CAF50;
                border: none;
                color: white;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 14px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 4px;
                transition: background-color 0.3s;
            }
            .custom-button:hover {
                background-color: #45a049;
            }
            .clear-button {
                background-color: #f44336;
            }
            .clear-button:hover {
                background-color: #da190b;
            }
            #main_inner {
                margin: 1% 5%;
            }
        `;
      let head = doc.querySelector("head");
      if (!head) {
        head = doc.createElement("head");
        doc.insertBefore(head, doc.firstChild);
      }
      head.appendChild(styleElement);
      const main_inner = doc.querySelector("#main > #main_inner");
      if (main_inner) {
        main_inner.style.margin = "1% 5%";
      }
      const heading = doc.querySelector(".cp_overview_inner > .heading");
      if (heading) {
        heading.innerHTML = "關於追蹤列表";
      }
      const listItems = doc.querySelectorAll(".cp_overview_list_item");
      const newContents = [
        {
          heading: "添加追蹤",
          content: "只需點擊追蹤按鈕，即可將作品添加至您的個人追蹤列表。"
        },
        {
          heading: "自動更新",
          content: "Dlsite和插件開啟時，每30分鐘自動檢查並更新追蹤作品的翻譯狀態。<br>（尚未實現）"
        },
        {
          heading: "全類型支持",
          content: "支持多種類型作品，讓您輕鬆追蹤所有感興趣的可翻譯內容。"
        }
      ];
      listItems.forEach((item, index) => {
        if (index < newContents.length) {
          item.innerHTML = `
                    <h3 class="heading">${newContents[index].heading}</h3>
                    <p>${newContents[index].content}</p>
                `;
        }
      });
      const floorTabItems = doc.querySelectorAll(".floorTab-item");
      floorTabItems.forEach((item) => {
        item.classList.remove("is-active");
      });
      const btnBox = doc.querySelector(".cp_overview_btn_box");
      if (btnBox) {
        btnBox.remove();
      }
    } catch (error) {
      console.error("修改頁面時出錯:", error);
      throw error;
    }
  }
  async function search(subdomain, keywords) {
    try {
      const keywordString = keywords.join("|");
      const params = new URLSearchParams({ keyword: keywordString, page: "1" });
      const endpoint = `https://www.dlsite.com/${subdomain}/works/translatable/ajax`;
      const response = await fetch(`${endpoint}?${params}`);
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (error) {
      console.error(`搜索出錯 (${subdomain}, ${keywords.join(", ")}):`, error);
      return null;
    }
  }
  function processSearchResults(results, keywords) {
    const parser = new DOMParser();
    const processedResults = [];
    let totalCount = 0;
    const keywordSet = new Set(keywords.map((kw) => kw.toUpperCase()));
    results.forEach((result) => {
      if (result && result.search_result) {
        const doc = parser.parseFromString(result.search_result, "text/html");
        const items = doc.querySelectorAll("li.search_result_img_box_inner");
        items.forEach((item) => {
          const productIdElement = item.querySelector("div[data-product_id]");
          if (productIdElement) {
            const productId = productIdElement.dataset.product_id;
            if (keywordSet.has(productId.toUpperCase())) {
              processedResults.push(item.outerHTML);
              totalCount++;
            }
          }
        });
      }
    });
    return { processedResults, totalCount };
  }
  function updatePage(processedResults, totalCount) {
    const container = document.querySelector("#search_result_list");
    if (container) {
      container.className = "_search_result_list";
      const ul = document.createElement("ul");
      ul.id = "search_result_img_box";
      ul.className = "n_worklist";
      ul.innerHTML = processedResults.join("");
      container.innerHTML = "";
      container.appendChild(ul);
    } else {
      console.error("未找到搜索結果容器");
    }
    const headerContainer = document.querySelector("._scroll_position");
    if (headerContainer) {
      headerContainer.innerHTML = `
            <div class="cp_heading type_game type_result">
                <h2 class="cp_heading_inner">追蹤列表📂</h2>
                <div class="cp_result_count">
                    ${totalCount}<span>件中</span>
                    1～${totalCount}
                    <span>件目</span>
                </div>
            </div>
        `;
    }
    console.log("頁面已更新");
  }
  function createNavButtons() {
    var _a;
    const navList = document.querySelector("ul.floorTab");
    if (navList) {
      const cacheButtonLi = document.createElement("li");
      cacheButtonLi.className = "floorTab-item type-cache";
      cacheButtonLi.innerHTML = `<a href="https://www.dlsite.com/${((_a = window.location.href.match(/dlsite\.com\/(\w+)/)) == null ? void 0 : _a[1]) || "home"}/?tracklist=true">追蹤列表</a>`;
      const clearCacheButtonLi = document.createElement("li");
      clearCacheButtonLi.className = "floorTab-item type-clear-cache";
      clearCacheButtonLi.innerHTML = '<a href="#">清除緩存</a>';
      navList.appendChild(cacheButtonLi);
      navList.appendChild(clearCacheButtonLi);
    }
  }
  function toTracklist() {
    var _a;
    const newUrl = `https://www.dlsite.com/${((_a = window.location.href.match(/dlsite\.com\/(\w+)/)) == null ? void 0 : _a[1]) || "home"}/?tracklist=true`;
    window.location.href = newUrl;
  }
  function addNavButtonListeners() {
    const cacheButton = document.querySelector(".floorTab-item.type-cache a");
    const clearCacheButton = document.querySelector(".floorTab-item.type-clear-cache a");
    if (cacheButton) {
      cacheButton.addEventListener("click", function(e) {
        e.preventDefault();
        toTracklist();
      });
    }
    if (clearCacheButton) {
      clearCacheButton.addEventListener("click", function(e) {
        e.preventDefault();
        clearCache();
      });
    }
  }
  const TRACKED_WORKS_KEY = "dlsite_tracked_works";
  function injectTrackButtons() {
    const workItems = document.querySelectorAll("dt.search_img.work_thumb");
    workItems.forEach((item) => {
      const linkElement = item.querySelector('a[href*="product_id/RJ"]');
      if (linkElement) {
        const href = linkElement.getAttribute("href");
        const match = href == null ? void 0 : href.match(/\/(\w+)\/work\/=\/product_id\/(\w+)/);
        if (match) {
          const [, subdomain, productId] = match;
          const button = createTrackButton({ productId, subdomain });
          item.insertBefore(button, item.firstChild);
        }
      }
    });
    const style = document.createElement("style");
    style.textContent = `
        .track-button {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 40px;
            height: 40px;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 12px;
            cursor: pointer;
            z-index: 1;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: auto;
        }
        .track-button:hover {
            transform: scale(1.1);
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .track-button.tracked {
            background-color: #f44336;
        }
        .track-button.untracked {
            background-color: rgba(76, 175, 80, 0.8);
        }
        @keyframes trackSuccess {
            0% { background-color: rgba(76, 175, 80, 0.8); }
            100% { background-color: #f44336; }
        }
        .track-button.tracking {
            animation: trackSuccess 0.5s forwards;
        }
        .search_img.work_thumb {
            position: relative;
        }
        .search_img.work_thumb > a,
        .search_img.work_thumb > a > img {
            pointer-events: none;
        }
        .search_img.work_thumb:hover > a,
        .search_img.work_thumb:hover > a > img {
            pointer-events: auto;
        }
        .track-button-active .work_img_popover {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
  }
  function createTrackButton(data) {
    const button = document.createElement("button");
    const isTracked = isWorkTracked(data);
    button.className = `track-button ${isTracked ? "tracked" : "untracked"}`;
    button.textContent = isTracked ? "取消" : "追蹤";
    button.dataset.productId = data.productId;
    button.dataset.subdomain = data.subdomain;
    button.addEventListener("click", handleTrackButtonClick);
    button.addEventListener("mouseenter", handleButtonMouseEnter);
    button.addEventListener("mouseleave", handleButtonMouseLeave);
    return button;
  }
  function handleButtonMouseEnter(event) {
    event.stopPropagation();
    const button = event.currentTarget;
    const workThumb = button.closest(".search_img.work_thumb");
    if (workThumb) {
      workThumb.classList.add("track-button-active");
    }
  }
  function handleButtonMouseLeave(event) {
    const button = event.currentTarget;
    const workThumb = button.closest(".search_img.work_thumb");
    if (workThumb) {
      workThumb.classList.remove("track-button-active");
    }
  }
  function isWorkTracked(data) {
    const trackedWorks = getTrackedWorks$1();
    return Object.values(trackedWorks).some((list) => list.includes(data.productId));
  }
  function handleTrackButtonClick(event) {
    event.stopPropagation();
    const button = event.currentTarget;
    const { productId, subdomain } = button.dataset;
    if (productId && subdomain) {
      const isCurrentlyTracked = button.classList.contains("tracked");
      if (isCurrentlyTracked) {
        removeFromTrackedWorks(productId);
        button.textContent = "追蹤";
        button.classList.remove("tracked", "tracking");
        button.classList.add("untracked");
      } else {
        addToTrackedWorks(productId, subdomain);
        button.textContent = "取消";
        button.classList.remove("untracked");
        button.classList.add("tracking");
        setTimeout(() => {
          button.classList.remove("tracking");
          button.classList.add("tracked");
        }, 500);
      }
    }
  }
  function addToTrackedWorks(productId, subdomain) {
    const trackedWorks = getTrackedWorks$1();
    if (!trackedWorks[subdomain]) {
      trackedWorks[subdomain] = [];
    }
    if (!trackedWorks[subdomain].includes(productId)) {
      trackedWorks[subdomain].push(productId);
      localStorage.setItem(TRACKED_WORKS_KEY, JSON.stringify(trackedWorks));
    }
  }
  function removeFromTrackedWorks(productId) {
    const trackedWorks = getTrackedWorks$1();
    for (const subdomain in trackedWorks) {
      const index = trackedWorks[subdomain].indexOf(productId);
      if (index !== -1) {
        trackedWorks[subdomain].splice(index, 1);
        if (trackedWorks[subdomain].length === 0) {
          delete trackedWorks[subdomain];
        }
        localStorage.setItem(TRACKED_WORKS_KEY, JSON.stringify(trackedWorks));
        break;
      }
    }
  }
  function getTrackedWorks$1() {
    const trackedWorksJson = localStorage.getItem(TRACKED_WORKS_KEY);
    return trackedWorksJson ? JSON.parse(trackedWorksJson) : {};
  }
  function debounce(func, wait) {
    let timeout = null;
    return (...args) => {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => func(...args), wait);
    };
  }
  function initTrackButtonHandler() {
    console.log("初始化 DLsite 追蹤器");
    const debouncedInjectButtons = debounce(() => {
      console.log("搜索結果容器發生變化，注入追蹤按鈕");
      injectTrackButtons();
    }, 300);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          debouncedInjectButtons();
        }
      });
    });
    const config2 = { childList: true };
    function startObserving() {
      const targetNode = document.querySelector("._search_result_container");
      if (targetNode) {
        observer.observe(targetNode, config2);
        console.log("開始監視搜索結果容器");
      } else {
        console.log("未找到搜索結果容器，稍後重試");
        setTimeout(startObserving, 1e3);
      }
    }
    window.addEventListener("load", startObserving);
  }
  const defaultConfig = {
    debug: false,
    modules: {
      navLink: {
        enabled: true
      },
      previewBox: {
        enabled: true
      },
      tracker: {
        enabled: true
      }
    }
  };
  function loadConfig() {
    const savedConfig = _GM_getValue("userConfig", null);
    if (savedConfig) {
      return { ...defaultConfig, ...JSON.parse(savedConfig) };
    }
    return defaultConfig;
  }
  function saveConfig(config2) {
    _GM_setValue("userConfig", JSON.stringify(config2));
  }
  function getConfig() {
    return loadConfig();
  }
  function updateConfig(newConfig) {
    const currentConfig = loadConfig();
    const updatedConfig = { ...currentConfig, ...newConfig };
    saveConfig(updatedConfig);
  }
  const config = loadConfig();
  function refreshConfig() {
    Object.assign(config, loadConfig());
  }
  function registerSettingsMenu() {
    _GM_registerMenuCommand("設置", () => {
      const settingsUrl = "https://github.com/SnowAgar25/dlsite-translator-tool";
      window.open(settingsUrl, "_blank");
    });
  }
  const DLSITE_THEME = "girls";
  const BASE_URL = `https://www.dlsite.com/${DLSITE_THEME}/works/translatable`;
  const TARGET_URL = `${BASE_URL}?keyword=%F0%9F%A5%B0`;
  function cleanupExtraBodyElements() {
    var _a;
    const bodyElements = document.getElementsByTagName("body");
    if (bodyElements.length > 1) {
      for (let i = bodyElements.length - 1; i > 0; i--) {
        (_a = bodyElements[i].parentNode) == null ? void 0 : _a.removeChild(bodyElements[i]);
      }
    }
  }
  async function fetchAndCachePage() {
    try {
      const response = await fetch(TARGET_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      modifyPage(doc);
      const serializer = new XMLSerializer();
      const modifiedHtml = serializer.serializeToString(doc);
      await saveToIndexedDB(CACHE_KEY, modifiedHtml);
      return modifiedHtml;
    } catch (error) {
      console.error("獲取或緩存頁面時出錯:", error);
      return null;
    }
  }
  async function showCachedPage() {
    try {
      let cachedHtml = await getFromIndexedDB(CACHE_KEY);
      if (!cachedHtml) {
        cachedHtml = await fetchAndCachePage();
      }
      if (cachedHtml) {
        if (!document.body) {
          document.body = document.createElement("body");
        }
        document.body.innerHTML = cachedHtml;
        createNavButtons();
        addNavButtonListeners();
        await performSearchAndUpdate();
        initForCachedPage();
        setTimeout(() => {
          cleanupExtraBodyElements();
        }, 100);
      } else {
        throw new Error("無法顯示緩存頁面");
      }
    } catch (error) {
      console.error("顯示緩存頁面時出錯:", error);
      try {
        const newCachedHtml = await fetchAndCachePage();
        if (newCachedHtml) {
          showCachedPage();
        } else {
          throw new Error("無法獲取新的頁面內容");
        }
      } catch (fetchError) {
        console.error("重新獲取頁面失敗:", fetchError);
        alert("無法獲取或顯示頁面，請稍後再試。");
      }
    }
  }
  async function clearCache() {
    try {
      await clearFromIndexedDB(CACHE_KEY);
      alert(`緩存已清除`);
    } catch (error) {
      console.error("清除緩存時出錯:", error);
      alert("清除緩存失敗，請稍後再試。");
    }
  }
  function getTrackedWorks() {
    const trackedWorksJson = localStorage.getItem("dlsite_tracked_works");
    return trackedWorksJson ? JSON.parse(trackedWorksJson) : {};
  }
  async function performSearchAndUpdate() {
    const trackedWorks = getTrackedWorks();
    const searchPromises = Object.entries(trackedWorks).map(([subdomain, productIds]) => {
      console.log(`搜索 ${subdomain}: ${productIds.join(", ")} 中...`);
      return search(subdomain, productIds);
    });
    const results = await Promise.all(searchPromises);
    const validResults = results.filter((result) => result !== null);
    if (validResults.length > 0) {
      const allProductIds = Object.values(trackedWorks).flat();
      const { processedResults, totalCount } = processSearchResults(validResults, allProductIds);
      console.log("處理後的搜索結果數量:", processedResults.length);
      updatePage(processedResults, totalCount);
    } else {
      console.log("所有搜索均未找到結果");
      updatePage([], 0);
    }
  }
  const initForCachedPage = () => {
    if (config.modules.navLink.enabled) {
      initCustomNavLinks();
    }
    if (config.modules.previewBox.enabled) {
      initPreviewBox();
    }
    injectTrackButtons();
  };
  function initTracker() {
    createNavButtons();
    addNavButtonListeners();
    injectTrackButtons();
    initTrackButtonHandler();
  }
  const settingsStructure = {
    "設置": [
      {
        type: "checkbox",
        label: "Debug模式",
        key: "debug",
        html: (field) => `
        <div class="option">
          <label>
            <input type="checkbox" class="checkbox" id="${field.key}">
            <span>${field.label}</span>
          </label>
        </div>
      `
      },
      {
        type: "checkbox",
        label: "跳轉按鈕：「翻訳許可作品」&「翻訳申請」",
        key: "modules.navLink.enabled",
        html: (field) => `
        <div class="option">
          <label>
            <input type="checkbox" class="checkbox" id="${field.key}">
            <span>${field.label}</span>
          </label>
        </div>
      `
      },
      {
        type: "checkbox",
        label: "預覽框：顯示作品報酬和翻譯狀態",
        key: "modules.previewBox.enabled",
        html: (field) => `
        <div class="option">
          <label>
            <input type="checkbox" class="checkbox" id="${field.key}">
            <span>${field.label}</span>
          </label>
        </div>
      `
      },
      {
        type: "checkbox",
        label: "追蹤功能：作品翻譯狀態",
        key: "modules.tracker.enabled",
        html: (field) => `
        <div class="option">
          <label>
            <input type="checkbox" class="checkbox" id="${field.key}">
            <span>${field.label}</span>
          </label>
        </div>
      `
      }
    ]
  };
  const styles = `
  <style>
    .settings { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #6D92FF; }
    .settings h3 { font-size: 18px; margin-bottom: 10px; }
    .option { margin-bottom: 10px; }
    .option label { display: flex; align-items: center; cursor: pointer; }
    .option select { padding: 8px; border-radius: 5px; border: 1px solid #6D92FF; color: #6D92FF; background-color: white; font-size: 14px; margin-top: 5px; }
    hr { border: 0; height: 1px; background-color: #6D92FF; margin: 20px 0; opacity: 0.3; }
    button { background-color: #6D92FF; color: white; border: none; padding: 10px 20px; font-size: 16px; border-radius: 5px; cursor: pointer; transition: opacity 0.3s; }
    button:hover { opacity: 0.8; }
    .checkbox { -webkit-appearance: none; -moz-appearance: none; appearance: none; width: 20px; height: 20px; border: 2px solid #6D92FF; border-radius: 4px; outline: none; transition: all 0.3s; position: relative; cursor: pointer; margin-right: 10px; background-color: white; }
    .checkbox:checked { background-color: #6D92FF; }
    .checkbox:checked::after { content: ''; position: absolute; left: 50%; top: 50%; width: 25%; height: 50%; border: solid white; border-width: 0 2px 2px 0; transform: translate(-50%, -60%) rotate(45deg); }
    .checkbox:focus { box-shadow: 0 0 0 2px rgba(39, 94, 254, 0.3); }
  </style>
`;
  function generateSettingsHTML() {
    let html = styles + '<div class="settings">';
    for (const [section, fields] of Object.entries(settingsStructure)) {
      html += `<h2>${section}</h2>`;
      fields.forEach((field) => {
        html += field.html(field);
      });
      html += "<hr>";
    }
    html += `
      <button id="save-settings">Save Settings</button>
    </div>
  `;
    return html;
  }
  function injectSettingsUI() {
    const targetElement = document.querySelector(".markdown-heading");
    if (targetElement) {
      targetElement.insertAdjacentHTML("afterend", generateSettingsHTML());
      initializeSettings();
    }
    const markdownBody = document.querySelector(".markdown-body");
    if (markdownBody) {
      const windowHeight = window.innerHeight;
      const markdownBodyRect = markdownBody.getBoundingClientRect();
      const markdownBodyHeight = markdownBodyRect.height;
      const scrollToY = markdownBodyRect.top + window.pageYOffset - windowHeight / 2 + markdownBodyHeight / 2;
      window.scrollTo({
        top: scrollToY,
        behavior: "smooth"
      });
    }
  }
  function getNestedValue(obj, path) {
    return path.split(".").reduce((prev, curr) => prev && prev[curr], obj);
  }
  function setNestedValue(obj, path, value) {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const lastObj = keys.reduce((prev, curr) => prev[curr] = prev[curr] || {}, obj);
    lastObj[lastKey] = value;
  }
  function initializeSettings() {
    var _a;
    const config2 = getConfig();
    Object.values(settingsStructure).flat().forEach((field) => {
      const element = document.getElementById(field.key);
      if (element) {
        const value = getNestedValue(config2, field.key);
        if (field.type === "checkbox") {
          element.checked = value;
        } else if (field.type === "select") {
          element.value = value;
        }
      }
    });
    (_a = document.getElementById("save-settings")) == null ? void 0 : _a.addEventListener("click", saveSettings);
  }
  function saveSettings() {
    const newConfig = {};
    Object.values(settingsStructure).flat().forEach((field) => {
      const element = document.getElementById(field.key);
      if (element) {
        const value = field.type === "checkbox" ? element.checked : element.value;
        setNestedValue(newConfig, field.key, value);
      }
    });
    updateConfig(newConfig);
    refreshConfig();
    alert("Settings saved successfully!");
  }
  function initSettingsUI() {
    if (window.location.href.startsWith("https://github.com/SnowAgar25/dlsite-translator-tool")) {
      const observer = new MutationObserver((_mutations, obs) => {
        const targetElement = document.querySelector(".markdown-heading");
        if (targetElement) {
          injectSettingsUI();
          obs.disconnect();
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }
  function initMainFeatures() {
    if (config.modules.previewBox.enabled) {
      initPreviewBox();
    }
    if (config.modules.tracker.enabled) {
      initTracker();
    }
  }
  function init() {
    const currentUrl = window.location.href;
    if (currentUrl.includes("dlsite-translator-tool")) {
      initSettingsUI();
      return;
    }
    if (currentUrl.includes("?tracklist=true")) {
      if (config.modules.tracker.enabled) {
        showCachedPage();
      }
      return;
    }
    if (config.modules.navLink.enabled) {
      initCustomNavLinks();
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initMainFeatures);
    } else {
      initMainFeatures();
    }
  }
  registerSettingsMenu();
  init();
  if (config.debug) {
    console.log("Debug mode is enabled");
  }

})();