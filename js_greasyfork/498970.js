// ==UserScript==
// @name             MWI Market Price History Viewer
// @namespace        http://tampermonkey.net/
// @version          0.3
// @description      This script integrates historical price charts of items directly into the market pages of MWI.
// @author           mwinoob
// @license          MIT
// @match            https://www.milkywayidle.com/*
// @grant            GM_addStyle
// @grant            GM_getResourceURL
// @require          https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js
// @require          https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3.0.0/dist/chartjs-adapter-date-fns.bundle.min.js
// @require          https://cdn.jsdelivr.net/npm/chartjs-plugin-crosshair@2.0.0/dist/chartjs-plugin-crosshair.min.js
// @require          https://cdn.jsdelivr.net/npm/sql.js-httpvfs@0.8.12/dist/index.js
// @resource wasm    https://cdn.jsdelivr.net/npm/sql.js-httpvfs@0.8.12/dist/sql-wasm.wasm
// @resource worker  https://cdn.jsdelivr.net/npm/sql.js-httpvfs@0.8.12/dist/sqlite.worker.js
// @downloadURL https://update.greasyfork.org/scripts/498970/MWI%20Market%20Price%20History%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/498970/MWI%20Market%20Price%20History%20Viewer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const MWI_DATA_ASK = 'MWI_DATA_ASK'
  const MWI_DATA_BID = 'MWI_DATA_BID'
  const SpecialItemNames = {
    "large_artisans_crate": "Large Artisan's Crate",
    "medium_artisans_crate": "Medium Artisan's Crate",
    "sorcerers_sole": "Sorcerer's Sole",
    "small_artisans_crate": "Small Artisan's Crate",
    "purples_gift": "Purple's Gift",
    "collectors_boots": "Collector's Boots",
    "natures_veil": "Nature's Veil",
    "red_chefs_hat": "Red Chef's Hat",
    "acrobats_ribbon": "Acrobat's Ribbon",
    "bishops_codex": "Bishop's Codex",
    "bishops_scroll": "Bishop's Scroll",
    "knights_aegis": "Knight's Aegis",
    "knights_ingot": "Knight's Ingot",
    "magicians_cloth": "Magician's Cloth",
    "magicians_hat": "Magician's Hat"
  }
  function getColumn(itemName, row) {
    const filters = [
      (itemName) => itemName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      (itemName) => SpecialItemNames[itemName]
    ]
    for (const filter of filters) {
      const column = filter(itemName)
      if (row.hasOwnProperty(column)) {
        return column
      }
    }
  }
  const en = {
    "show_btn_title": "Price History",
    "update_btn_title": "Update Data",
    "update_btn_title_downloading": "Update Data (downloading...)",
    "update_btn_title_succeeded": "Update Data (succeeded)",
    "update_btn_title_failed": "Update Data (failed)",
  };
  const zh = {
    "show_btn_title": "显示历史价格",
    "update_btn_title": "更新市场数据",
    "update_btn_title_downloading": "更新市场数据 (下载中...)",
    "update_btn_title_succeeded": "更新市场数据 (成功)",
    "update_btn_title_failed": "更新市场数据 (失败)",
  };
  function loadTranslations() {
    const lang = (navigator.language || navigator.userLanguage).substring(0, 2);
    switch (lang) {
      case 'zh':
        return zh;
      default:
        return en;
    }
  };
  const Strings = loadTranslations();

  class LargeLocalStorage {
    constructor() {
      this.db = null;
      this.dbName = 'LargeLocalStorage';
      this.storeName = 'data';
    }

    open() {
      return new Promise((resolve, reject) => {
        const dbName = this.dbName;
        const storeName = this.storeName;

        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = function (event) {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName);
          }
        };

        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve(this.db)
        };

        request.onerror = function (error) {
          console.error('Error opening IndexedDB:', error);
          reject(error);
        };
      });
    }

    close() {
      if (this.db) {
        this.db.close();
      }
    }

    async setItem(key, value) {
      if (!this.db) {
        await this.open()
      }
      return new Promise((resolve, reject) => {
        const storeName = this.storeName;
        const transaction = this.db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        store.put(value, key);
        transaction.oncomplete = function () {
          resolve();
        };
        transaction.onerror = function (error) {
          console.error('Error storing to IndexedDB:', error);
          reject(error);
        };
      });
    }

    async getItem(key) {
      if (!this.db) {
        await this.open()
      }
      return new Promise((resolve, reject) => {
        const storeName = this.storeName;
        const transaction = this.db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const getRequest = store.get(key);

        getRequest.onsuccess = function (event) {
          resolve(event.target.result);
        };

        getRequest.onerror = function (error) {
          console.error('Error getting from IndexedDB:', error);
          reject(error);
        };
      });
    }
  }
  const storage = new LargeLocalStorage()

  const dbUrl = 'https://raw.githubusercontent.com/holychikenz/MWIApi/main/market.db';
  let worker = null;
  let itemName = null;
  let myChart = null;

  function extractItemName(href) {
    const match = href.match(/#(.+)$/);
    return match ? match[1] : null;
  }

  async function showPopup() {
    if (!itemName) {
      alert('No itemName');
      return;
    }

    try {
      const ask = await storage.getItem(MWI_DATA_ASK)
      const bid = await storage.getItem(MWI_DATA_BID)
      const column = getColumn(itemName, ask[0])
      if (!column) {
        alert('Invalid itemName');
        return
      }
      const data = ask.map((askRow) => {
        const bidRow = bid.find(bidRow => bidRow.time === askRow.time);
        return { time: askRow.time, ask_price: askRow[column], bid_price: bidRow[column] }
      })
      showChart(data)
    } catch (error) {
      console.error('Error querying DB:', error);
      alert('No data available');
    }
  }

  function addCss() {
    const modalStyles = `
.modal {
  display: none;
  position: fixed;
  z-index: 99;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
  align-items: center;
  justify-content: center;
}
.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 60%;
}
`;

    GM_addStyle(modalStyles);
  }

  function createModal() {
    const modal = document.createElement('div');
    modal.id = 'myModal';
    modal.className = 'modal';
    modal.style.display = 'none';
    modal.onclick = function () {
      modal.style.display = 'none';
      destroyChart();
    };

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const chartCanvas = document.createElement('canvas');
    chartCanvas.id = 'myChart';
    modalContent.appendChild(chartCanvas);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    return modal;
  }

  function destroyChart() {
    if (myChart) {
      myChart.destroy();
    }
  }

  function showChart(data, timeRange) {
    if (!document.getElementById('myModal')) {
      addCss();
      createModal();
    }

    const modal = document.getElementById('myModal');
    modal.style.display = 'flex';

    const times = data.map(row => new Date(row.time * 1000));
    const askPrices = data.map(row => row.ask_price);
    const bidPrices = data.map(row => row.bid_price);

    const ctx = document.getElementById('myChart').getContext('2d');
    const timeUnit = timeRange === '7days' ? 'day' : 'hour';
    const timeFormat = timeRange === '7days' ? 'MM/dd' : 'HH:mm';

    myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: times,
        datasets: [
          {
            label: 'Ask Price',
            data: askPrices
          },
          {
            label: 'Bid Price',
            data: bidPrices
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: timeUnit,
              tooltipFormat: timeFormat,
              displayFormats: {
                hour: 'HH:mm',
                day: 'MM/dd'
              }
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Price'
            }
          }
        },
        plugins: {
          tooltip: {
            mode: 'interpolate',
            intersect: false
          },
          crosshair: {
            line: {
              color: '#ff6666',
              width: 1
            }
          }
        }
      }
    });
  }

  function handleCurrentItemNode(mutationsList) {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.className && node.className.startsWith('MarketplacePanel_currentItem')) {
            console.debug('MarketplacePanel_currentItem found')
            const useElement = node.querySelector('use');
            itemName = extractItemName(useElement.getAttribute('href'));
            console.debug('itemName:', itemName)
          }
        });
      }
    }
  }

  function handleMarketNavButtonContainerNode(mutationsList) {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.className && node.className.startsWith('MarketplacePanel_marketNavButtonContainer')) {
            console.debug('MarketplacePanel_marketNavButtonContainer found')
            const buttons = node.querySelectorAll('div');
            console.debug('buttons', buttons)
            if (buttons.length > 0) {
              const lastButton = buttons[buttons.length - 1];
              // showButton
              const showButton = lastButton.cloneNode(false);
              showButton.textContent = Strings.show_btn_title;
              showButton.onclick = showPopup;
              node.appendChild(showButton);
              // updateButton
              const updateButton = lastButton.cloneNode(false);
              updateButton.textContent = Strings.update_btn_title;
              updateButton.onclick = async function () {
                await updateDb(updateButton)
              };
              node.appendChild(updateButton);
            }
          }
        });
      }
    }
  }

  async function createWorker() {
    const workerUrl = GM_getResourceURL("worker");
    const wasmUrl = GM_getResourceURL("wasm");
    const config = {
      from: "inline",
      config: {
        serverMode: "full",
        url: dbUrl,
        requestChunkSize: 4096,
      },
    }
    worker = await createDbWorker(
      [config],
      workerUrl,
      wasmUrl
    );
  }

  async function updateDb(button) {
    console.log('updateDb start')
    if (!worker) {
      console.error('worker not initialized')
      return
    }
    button.disabled = true;
    button.textContent = Strings.update_btn_title_downloading;

    const timeFilter = Math.floor(Date.now() / 1000) - (24 * 60 * 60);
    const query1 = `
      SELECT *
      FROM ask a
      WHERE a.time >= ?
    `;
    const ask = await worker.db.query(query1, [timeFilter])
    storage.setItem(MWI_DATA_ASK, ask)

    const query2 = `
      SELECT *
      FROM bid b
      WHERE b.time >= ?
    `;
    const bid = await worker.db.query(query2, [timeFilter])
    storage.setItem(MWI_DATA_BID, bid)

    button.textContent = Strings.update_btn_title_succeeded
    console.log('updateDb finish')
  }

  function initializeObservers() {
    const targetNode = document.querySelector('div[class^="MarketplacePanel_marketListings"]');
    if (targetNode) {
      const observerCurrentItem = new MutationObserver(handleCurrentItemNode);
      const observerMarketNavButtonContainer = new MutationObserver(handleMarketNavButtonContainerNode);
      observerCurrentItem.observe(targetNode, { childList: true, subtree: true });
      observerMarketNavButtonContainer.observe(targetNode, { childList: true, subtree: true });
      console.log('Observers attached');
    } else {
      console.log('Target node not found, retrying...');
      setTimeout(initializeObservers, 1000);
    }
  }

  initializeObservers();
  createWorker();
})();
