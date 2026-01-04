// ==UserScript==
// @name         GC - Virtupets Data Collector
// @namespace    https://greasyfork.org/en/users/1278031-crystalflame
// @match        *://*.grundos.cafe/island/tradingpost/browse/
// @match        *://*.grundos.cafe/island/tradingpost/lot/user/*
// @match        *://*.grundos.cafe/island/tradingpost/lot/*
// @match        *://*.grundos.cafe/island/tradingpost/quickbuy/*
// @match        *://*.grundos.cafe/island/tradingpost/acceptoffer/*
// @match        *://*.grundos.cafe/island/tradingpost/viewoffers/*
// @match        *://*.grundos.cafe/island/tradingpost/
// @match        *://*.grundos.cafe/market/wizard/*
// @match        *://*.grundos.cafe/allevents/
// @match        *://*.grundos.cafe/help/*/
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @require      https://update.greasyfork.org/scripts/514423/1554918/GC%20-%20Universal%20Userscripts%20Settings.js
// @grant        GM.info
// @grant        GM.getValue
// @grant        GM.setValue
// @license      MIT
// @version      0.24
// @author       CrystalFlame
// @description Collects shop wizard and trading post history for Virtupets.net
// @downloadURL https://update.greasyfork.org/scripts/490596/GC%20-%20Virtupets%20Data%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/490596/GC%20-%20Virtupets%20Data%20Collector.meta.js
// ==/UserScript==
'use strict';

(async function () {
  const DEBUG = false;
  function extractTradeInformation(yourLots = false) {
    const tradeObjects = [];
    try {
      const lotElements = document.querySelectorAll('.trade-lot');
      lotElements.forEach((lotElement) => {
        const tradeObject = {};

        const lotNumberMatch = lotElement.querySelector(yourLots ? '.flex.space-between strong' : 'span strong').innerText.trim().match(/Lot #(\d+)/);
        tradeObject.id = parseInt(lotNumberMatch[1]);

        const username = yourLots ? document.querySelector('#userinfo a[href^="/userlookup/?user="]').innerText.trim() : lotElement.querySelector('span strong + a').innerText.trim();
        tradeObject.username = username;

        const listedOnElement = lotElement.querySelector(yourLots ? 'span:nth-of-type(3)' : 'span:nth-child(2)');
        tradeObject.time = createTimestamp(listedOnElement.innerText.trim().replace(/Listed On\s*:\s*/, ''));

        const itemElements = lotElement.querySelectorAll('.trade-item');
        tradeObject.items = [];

        itemElements.forEach((itemElement) => {
          tradeObject.items.push(
            itemElement.querySelector('.item-info span:nth-child(1)').innerText.trim()
          );
        });

        const wishlist = lotElement.querySelector('span[id^="wishlist-text"]');
        tradeObject.wishlist = wishlist.innerText.trim();

        const quicksale = lotElement.querySelector('span[id^="quicksale-text"]');
        if (quicksale) {
          tradeObject.quicksale = parseInt(quicksale.innerText.trim().replace(/\D/g, ''), 10);
        }

        tradeObjects.push(tradeObject);
      });
      log(tradeObjects);
    } catch (error) {
      const message = "Unable to read the TP, there might be a conflicting script or an update to the layout.";
      logError(error, message, "extractTradeInformation");
      throw new Error(message);
    }
    return tradeObjects.length > 0 ? tradeObjects : undefined;
  }

  function constructMessage(message, type) {
    const errorMessage = `<b>Failed to upload data to <a href="${formatUrl()}">Virtupets</a>. </b>`;
    const updateMessage = `Always make sure your <a href=\"https://greasyfork.org/en/scripts/490596-gc-virtupets-data-collector\">script</a> is the latest version.`
    const bugReport = ` Submit a <a href="${formatUrl('/help/report')}">bug report</a> for support.`;
    return `<span>${type == 'error' ? errorMessage : ""}${message} ${type == 'warning' ? updateMessage : ""}${type == 'error' ? bugReport : ""}</span>`;
  }

  async function displayMessage(message, type = 'error') {
    message = message.replace(/^Error:\s*/, '');
    let showMessage = true;
    try {
      showMessage = await shouldDisplayMessage(message);
    } catch (error) {
      logError(error, "Failed to get displayMessage setting.");
    }

    if (showMessage) {
      try {
        const element = document.getElementById('page_content').querySelector('h1') || document.getElementById('page_content').querySelector('p');
        if (element) {
          const messageElement = document.createElement('div');
          messageElement.innerHTML = constructMessage(message, type);
          messageElement.style.cssText = `
            display: flex;
            align-items: center;
            margin-block-end: 7px;
            margin-block-start: 7px;
            background-color: ${type == 'error' ? "#ffe5e5" : "#f9ff8f"};
            border: 2px solid #000;
            border-radius: 5px;
            padding: 10px;
            color: #000;
          `;

          const linkElement = document.createElement('a');
          linkElement.href = formatUrl();
          linkElement.target = '_blank';

          const imgElement = document.createElement('img');
          imgElement.src = formatUrl('/assets/images/vp.png');
          imgElement.alt = 'Icon';
          imgElement.style.cssText = `width: 40px; height: 40px; margin-right: 10px;`;

          linkElement.appendChild(imgElement);
          messageElement.insertAdjacentElement('afterbegin', linkElement);
          element.insertAdjacentElement('afterend', messageElement);

          if (type == 'error' || type == 'warning') {
            const dismissElement = document.createElement('a');
            dismissElement.href = "#";
            dismissElement.textContent = "[Dismiss]";
            dismissElement.addEventListener('click', () => dismissMessage(messageElement, message));
            messageElement.appendChild(dismissElement);
          }
        }
      }
      catch (error) {
        logError(error, `Failed to display message: ${message}.`, "displayMessage");
      }
    }
  }

  async function dismissMessage(element, message) {
    await GM.setValue(message, new Date().getTime());
    element.remove();
  }

  async function shouldDisplayMessage(message) {
    try {
      const lastDismissed = await GM.getValue(message);
      if (!lastDismissed || new Date().getTime() - lastDismissed > 24 * 60 * 60 * 1000) {
        return true;
      }
      return false;
    }
    catch (error) {
      logError(error, "Failed to check if message should display.", "shouldDisplayMessage");
      return true;
    }
  }

  async function logError(error, message, operation, statusCode = undefined) {
    try {
      log(message);
      const errorBody = {
        message: `${message}. Error: ${error.message.replace(/^Error:\s*/, '')}`,
        status_code: statusCode,
        route: `collector::${operation}`
      };
      const options = await createPostRequest("0.1", GM.info.script.version, errorBody);
      fetch(formatUrl('/errors'), options);
    } catch (error) {
      console.error('Error sending error report:', error);
    }
  }

  function validateTable() {
    const header = document.querySelectorAll('.market_grid .header');
    const check = ['owner', 'item', 'stock', 'price'];
    if (check.length != header.length) return false;
    for (let i = 0; i < header.length; i += 1) {
      const title = header[i].querySelector('strong').textContent.toLowerCase();
      if (check[i] != title) {
        const message = `Unknown header named "${title}" in position ${i + 1}, expected "${check[i]}".`;
        const error = new Error(message);
        logError(error, "Validation Error.", "validateTable");
        throw error;
      }
    }
    return true;
  }

  function validateSearchRange() {
    if (document.querySelector('main .center .mt-1 span')?.textContent?.toLowerCase() == '(searching between 1 and 99,999 np)') {
      return true;
    }
    return false;
  }

  function validateUnbuyable() {
    const notFoundMsg = "i did not find anything. :( please try again, and i will search elsewhere!";
    const wrongHeaders = document.querySelectorAll('.market_grid .header').length > 0;
    const wrongMessage = document.querySelector('main p.center').textContent.toLowerCase() != notFoundMsg;
    if (wrongHeaders || wrongMessage) {
      return false;
    }
    return true;
  }

  function log(message) {
    if ((DEBUG) == true) {
      console.log(message);
    }
  }

  function extractShopPrices() {
    try {
      const tokens = document?.querySelector('.mt-1 strong')?.textContent?.split(" ... ");
      let body;
      const itemName = tokens?.length >= 2 ? tokens[1]?.trim() : undefined;
      if (!validateSearchRange() || !itemName) {
        log("Not a valid search!");
        return body;
      }
      else if (validateTable()) {
        log("Valid search");
        const dataElements = document.querySelectorAll('.market_grid .data');
        const i32Max = 2147483647;
        let lowestPrice = i32Max;
        let totalStock = 0;
        let totalShops = 0;
        let includesOwnUnpricedItem = false;

        for (let i = 0; i < dataElements.length; i += 4) {
          //const owner = dataElements[i].querySelector('a').textContent;
          //const item = dataElements[i + 1].querySelector('span').textContent;
          const stock = parseInt(dataElements[i + 2].querySelector('span').textContent);
          const price = parseInt(dataElements[i + 3].querySelector('strong').textContent.replace(/[^0-9]/g, ''));

          if (price > 0) {
            lowestPrice = Math.min(price, lowestPrice);
            totalStock += stock;
            totalShops += 1;
          } else {
            includesOwnUnpricedItem = true;
          }
        }
        if (lowestPrice < i32Max && totalStock > 0 && dataElements.length > 0) {
          body = {
            item_name: itemName,
            price: lowestPrice,
            total_stock: totalStock,
            total_shops: totalShops
          }
          return body;
        } else if (includesOwnUnpricedItem && totalStock == 0 && dataElements.length == 4) {
          body = {
            item_name: itemName,
            total_stock: 0,
            total_shops: 0
          }
          return body;
        }
      }
      else if (validateUnbuyable()) {
        log("Valid unbuyable");
        body = {
          item_name: itemName,
          total_stock: 0,
          total_shops: 0
        }
      }
      return body;
    }
    catch (error) {
      const message = "Unable to read the SW, there might be a conflicting script or an update to the layout.";
      logError(error, message, "extractShopPrices");
      throw new Error(message);
    }
  }

  const monthMap = { jan: "1", feb: "2", mar: "3", apr: "4", may: "5", jun: "6", jul: "7", aug: "8", sep: "9", oct: "10", nov: "11", dec: "12" };
  function createTimestamp(str) {
    try {
      const parts = str.split(" ");
      const month = monthMap[parts[0].slice(0, 3).toLowerCase()].padStart(2, '0');
      const day = parts[1].replace(/\D/g, '').trim().padStart(2, '0');
      let year = parts[2].replace(/\D/g, '').trim();
      const yearCheck = year.match(/\d{4}/);
      const time = parts[3].split(':');
      const ampm = parts[4].replace(/[^a-zA-Z]/g, '').trim().toLowerCase();
      let hour = parseInt(time[0]);
      if (ampm === "pm" && hour < 12) {
        hour += 12;
      } else if (ampm === "am" && hour === 12) {
        hour = 0;
      }
      const convertedHour = String(hour).padStart(2, '0');
      const minutes = time[1]?.padStart(2, '0') ?? "00";
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      if (!yearCheck) {
        year = month == "12" && currentMonth == 0 ? currentYear - 1 : currentYear;
      }
      return `${year}-${month}-${day}T${convertedHour}:${minutes}:00`;
    } catch (error) {
      const message = "Failed to create timestamp.";
      logError(error, message, "createTimestamp");
      throw new Error(message);
    }
  }

  function formatUrl(route = '') {
    return `https://virtupets.net${route}`;
  }

  async function sendData(route, fetchOptions = {}, delay = 1000, tries = 4) {
    const url = formatUrl(route);

    async function onError(error) {
      if (tries > 0 && error.cause != 500) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(sendData(route, fetchOptions, delay, tries - 1));
          }, delay * 2 ** (5 - tries));
        });
      } else {
        throw error;
      }
    }

    try {
      const response = await fetch(url, fetchOptions);
      if (response.status == 500) {
        const body = await response.text();
        console.error(`Data upload error: ${body}`);
        throw new Error(body, { cause: response.status });
      } else if (!response.ok) {
        const body = await response.text();
        if (route != 'health') {
          console.error(`Data upload error (retry ${5 - tries}/5): ${body}`);

          const healthCheck = await fetch(formatUrl('/health'), { method: 'GET' });
          if (!healthCheck.ok) {
            console.log(`${formatUrl()} may be down for maintenance or you are experiencing connectivity issues, no data was sent.`);
            return { ok: true, body: '', down: true };
          }
        }

        throw new Error(body, { cause: response.status });
      }
      const body = await response.text();
      return { ok: true, body };
    } catch (error) {
      return onError(error);
    }
  }

  async function setupClientID() {
    let clientID;
    try {
      clientID = await GM.getValue('ClientID');
      if (!clientID) {
        const id = crypto.randomUUID();
        await GM.setValue('ClientID', crypto.randomUUID());
        clientID = id;
      }
    } catch (error) {
      logError(error, "Failed to setup client ID.", "setupClientID");
      clientID = "";
    }
    return clientID
  }

  async function createPostRequest(apiVersion, clientVersion, body) {
    const clientID = await setupClientID();
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Version": apiVersion,
        "ClientVersion": clientVersion,
        "ClientID": clientID
      },
      body: JSON.stringify(body),
    }
  }

  function extractTradeLotIDFromUrl(url) {
    const match = url.match(/tradingpost\/.*\/(\d+)\//);
    if (match) {
      const trade_lot = parseInt(match[1]);
      return trade_lot;
    }
  }

  function setupQuickBuyListeners(route, apiVersion, clientVersion) {
    const forms = document.querySelectorAll('form[action*="/island/tradingpost/quickbuy"]');
    for (let form of forms) {
      const originalOnSubmit = form.onsubmit;
      // form's onsubmit is null on Safari + userscripts plugin, return.
      if (!originalOnSubmit) {
        return;
      }
      form.onsubmit = undefined;
      form.addEventListener('submit', async function (event) {
        event.preventDefault();
        if (originalOnSubmit) {
          const confirmed = originalOnSubmit.call(form, event);
          if (!confirmed) {
            return;
          }
        } else {
          const message = `Unrecognized TP layout, action was prevented as a safeguard.`;
          logError(new Error(message), "Failed to setup quickbuy.", "setupQuickBuyListeners");
          displayMessage(`${message}.Disable the script if needed until there is an update.`);
          return;
        }

        try {
          const actionUrl = form.getAttribute('action');
          const match = actionUrl.trim().match(/\/island\/tradingpost\/quickbuy\/(\d+)\//);
          const formData = new FormData(this);
          if (match) {
            const trade_lot_id = parseInt(match[1]);
            const neopoints = parseInt(formData.get('price'), 10);

            if (!isNaN(trade_lot_id) && !isNaN(neopoints)) {
              const body = { id: trade_lot_id, neopoints };
              await sendRequest(route, apiVersion, clientVersion, body);
            }
          }
        } catch (e) {
          logError(e, "Failed to setup quickbuy listeners.", "setupQuickBuyListeners");
        }

        this.submit();
      });
    }
  }

  async function setupAcceptOfferListeners(route, apiVersion, clientVersion) {
    const forms = document.querySelectorAll('form[action*="/island/tradingpost/acceptoffer"]');
    const trade_lot_id = extractTradeLotIDFromUrl(window.location.href);
    let addedCheckbox = false;
    for (let form of forms) {
      const originalOnSubmit = form.onsubmit;
      // form's onsubmit is null on Safari + userscripts plugin, return.
      if (!originalOnSubmit) {
        return;
      }
      if (!addedCheckbox) {
        const header = document.querySelector('.trading_post .header');
        const defaultChecked = await getSettingOrDefault('verifyTradesChecked');
        let checked = defaultChecked ? ' checked' : '';

        // Uncheck if wishlist contains certain phrases
        const skipVerificationPhrases = await getSettingOrDefault('skipVerificationPhrases');
        const wishlist = document.querySelector('.lot .flex-column span strong')?.parentElement?.textContent?.toLowerCase().replace('wishlist : ', '');
        const skipVerificationPhrasesArray = skipVerificationPhrases.split(',');
        for (let i = 0; i < skipVerificationPhrasesArray.length; i++) {
          const phrase = skipVerificationPhrasesArray[i].trim().toLowerCase();
          if (wishlist?.includes(phrase)) {
            checked = '';
            displayMessage(`Wishlist phrase '${phrase}' detected! Virtupets.net verification automatically unchecked. Please only re-check verify if this is a complete and accurate trade for the item(s).`, 'message');
            break;
          }
        }

        // Uncheck if trade has 10+ items or 10m+ neopoints
        if (checked != '') {
          const offers = document.querySelectorAll('.offer');
          for (let i = 0; i < offers.length; i++) {
            const offer = offers[i];
            const tradeItems = offer.querySelectorAll('.trade-item');
            const neopointsElement = offer.querySelector('.item-info strong');
            let neopoints = 0;
            if (neopointsElement) {
              const match = neopointsElement.textContent.trim().match(/[\d,]+/);
              if (match) {
                neopoints = parseInt(match[0].replace(/,/g, ''), 10);
              }
            }
            if (tradeItems.length >= 10 || neopoints >= 10000000) {
              checked = '';
              displayMessage(`Large transfer detected! Virtupets.net verification automatically unchecked. Please only re-check verify if this is a complete and accurate trade for the item(s).`, 'message');
              break;
            }
          }
        }

        const largeCheckbox = await getSettingOrDefault('largeVerifyTradesCheckbox');
        const headerStyle = `"text-align: right; display: inline-block; position: relative; float: right;${largeCheckbox ? ' font-size: 24px;' : ''}"`;
        const headerImgStyle = `"width: ${largeCheckbox ? '2rem' : '19px'}; height: ${largeCheckbox ? '2rem' : '19px'}; vertical-align: middle; position: relative; float: left; left: -4px;"`;
        const labelStyle = `"margin-right: 5px; font-weight:bold; cursor:pointer; transform: scale(${largeCheckbox ? '2' : '1.5'}) !important;${largeCheckbox ? ' position: relative;' : ''}"`;
        const checkboxStyle = `"${largeCheckbox ? 'top: -3px; right: 4px; position: relative; transform: scale(2) !important;' : 'transform: scale(1.5) !important;'}"`;
        if (header) {
          header.insertAdjacentHTML('beforeend', `
                  <div id="virtupets-header" style=${headerStyle}>
                  <a href="${formatUrl()}"><img src="${formatUrl('/assets/images/vp_crop.png')}" alt="VP" style=${headerImgStyle}></a>
                  <label for="virtupets-verify-trade" style=${labelStyle} title="If checked, the accepted offer will be displayed on virtupets.net trade history. Avoid verifying trades that are item lends, junk transfers, or require additional context to upkeep the trade history.">Verify trade?</label>
                  <input type="checkbox" style=${checkboxStyle} id="virtupets-verify-trade"${checked}>
                  </div>
                  `);
        }
        addedCheckbox = true;
      }
      form.onsubmit = undefined;
      form.addEventListener('submit', async function (event) {
        event.preventDefault();
        if (originalOnSubmit) {
          const confirmed = originalOnSubmit.call(form, event);
          if (!confirmed) {
            return;
          }
        } else {
          const message = `Unrecognized TP layout, action was prevented as a safeguard.`;
          logError(new Error(message), "Failed to setup accept offers.", "setupAcceptOfferListeners");
          displayMessage(`${message}. Disable the script if needed until there is an update.`);
          return;
        }

        try {
          if (document.getElementById('virtupets-verify-trade')?.checked) {
            const offer = this.parentElement.previousElementSibling.querySelector('.offer');
            const tradeItems = offer.querySelectorAll('.trade-item');
            const offer_id = parseInt(this.parentElement.parentElement.querySelector('strong > a').textContent.trim());

            let items = [];
            let neopoints;
            tradeItems.forEach(tradeItem => {
              const itemInfo = tradeItem.querySelector('.item-info');

              if (itemInfo) {
                const span = itemInfo.querySelector('span');
                if (span) {
                  items.push(span.textContent);
                } else {
                  const strong = itemInfo.querySelector('strong');
                  if (strong) {
                    const match = strong.textContent.trim().match(/[\d,]+/);
                    if (match) {
                      neopoints = parseInt(match[0].replace(/,/g, ''), 10);
                    }
                  }
                }
              }
            });
            if (!isNaN(trade_lot_id) && (neopoints || items.length > 0)) {
              const body = { id: trade_lot_id, neopoints, items, offer_id };
              await sendRequest(route, apiVersion, clientVersion, body);
            }
          }
        } catch (e) {
          logError(e, "Failed to setup accept offer listeners.", "setupAcceptOfferListeners");
        }

        this.submit();
      });
    }
  }

  function quickSaleNotifications() {
    try {
      const tradeDetails = [];
      const rows = document.querySelectorAll('table tr');

      for (const row of rows) {
        const timeCell = row.cells[1];
        const descriptionCell = row.cells[2];
        if (descriptionCell && timeCell) {
          const descriptionText = descriptionCell.innerText.toLowerCase();
          const saleRegex = /bought your trade #(\d+)/;

          if (saleRegex.test(descriptionText)) {
            const tradeLotMatch = descriptionText.match(/trade #(\d+)/);
            const priceMatch = descriptionText.match(/for ([\d,]+) np/);
            const timeText = timeCell.innerText.toLowerCase();

            if (tradeLotMatch && priceMatch && timeText) {
              const id = parseInt(tradeLotMatch[1]);
              const neopoints = parseInt(priceMatch[1].replace(/,/g, ''), 10);
              const timeSold = timeText.trim();
              const time = createTimestamp(timeSold);
              tradeDetails.push({ id, neopoints, time });
            }
          }
        }
      }
      log(tradeDetails);
      return tradeDetails.length > 0 ? tradeDetails : undefined;
    } catch (e) {
      console.error(e, "Failed to read event inbox.");
      logError(e, "Failed to read event inbox.", "quickSaleNotifications");
    }
  }

  async function sendRequest(route, apiVersion, clientVersion, body) {
    return new Promise(async (resolve, reject) => {
      let promises = [];
      if (Array.isArray(body)) {
        if (body.length == 0) return;
        const size = 100;
        const numBatches = Math.ceil(body.length / size);

        for (let i = 0; i < numBatches; i++) {
          const startIndex = i * size;
          const endIndex = Math.min((i + 1) * size, body.length);
          const batchObjects = body.slice(startIndex, endIndex);
          const options = await createPostRequest(apiVersion, clientVersion, batchObjects);
          promises.push(sendData(route, options));
        }
      }
      else {
        const options = await createPostRequest(apiVersion, clientVersion, body);
        promises.push(sendData(route, options));
      }
      Promise.all(promises.map(p => p.catch(error => ({ ok: false, body: error })))).then(responses => {
        const warningResponses = responses.filter(response => response.ok && response.body.trim() != '');
        const successfulResponses = responses.filter(response => response.ok);
        const offlineResponses = responses.filter(response => response.down);
        const errors = responses.filter(response => !response.ok);

        if (errors.length > 0) {
          reject(new Error(errors[0].body));
        } else if (warningResponses.length > 0) {
          displayMessage(warningResponses[0].body, 'warning');
        }
        if (successfulResponses.length > 0 && offlineResponses.length == 0) {
          console.log(`Data uploaded to ${formatUrl()}`);
        }
        resolve();
      });
    });
  }

  async function addSettings() {
    try {
      const categoryName = 'Virtupets.net Data Collector';
      let promises = [];
      const imgPath = formatUrl('/assets/images');
      const imgStyle = `style="max-width: 100%; margin-top: 1rem;`;
      let labelTooltip = `When purchasing a trade lot using an autosale, verify the purchase on Virtupets.net.<img src="${imgPath}/buy_autosale.png" ${imgStyle}">`;
      promises.push(addCheckboxInput({ categoryName, labelText: 'Verify your Autosale Purchases', labelTooltip: labelTooltip, settingName: 'verifyAutoSalePurchases', defaultSetting: true }));
      labelTooltip = `When viewing your <a href="/allevents/">event inbox</a>, any autosale purchases will be verified on Virtupets.net.<img src="${imgPath}//event_inbox.png" ${imgStyle}">`;
      promises.push(addCheckboxInput({ categoryName, labelText: 'Verify your Autosale Sales from Event Inbox', labelTooltip: labelTooltip, settingName: 'verifyAutoSalesEventInbox', defaultSetting: true }));
      labelTooltip = `When viewing offers on one of your trade lots, automatically check the "Verify Trade" checkbox that will verify the trade on Virtupets.net.<img src="${imgPath}//default_checked.png" ${imgStyle}">`;
      promises.push(addCheckboxInput({ categoryName, labelText: 'Verify Trade Checked by Default', labelTooltip: labelTooltip, settingName: 'verifyTradesChecked', defaultSetting: true }));
      labelTooltip = `When viewing offers on one of your trade lots, display a larger "Verify trade?" checkbox and label.<img src="${imgPath}//large_checkbox.png" ${imgStyle}">`;
      promises.push(addCheckboxInput({ categoryName, labelText: 'Enlarge Trade Verification Checkbox', labelTooltip: labelTooltip, settingName: 'largeVerifyTradesCheckbox', defaultSetting: false }));
      labelTooltip = `When accepting offers, uncheck the verification box if the listed text is present in the wishlist. Enter words/phrases as a comma separated list. Capitilization is ignored.<img src="${imgPath}//wishlist_skip_verify.png" ${imgStyle}">`;
      promises.push(addTextInput({ categoryName, labelText: 'Wishlist Phrases to Uncheck Verify', labelTooltip: labelTooltip, settingName: 'skipVerificationPhrases', defaultSetting: 'lend,lending' }));
      await Promise.all(promises);
    } catch (error) {
      await logError(error, "Failed to add settings.", "addSettings");
      console.error("Failed to add settings.", error);
    }
  }

  async function getSettingOrDefault(settingName) {
    const defaultMap = {
      verifyAutoSalePurchases: true,
      verifyAutoSalesEventInbox: true,
      verifyTradesChecked: true,
      largeVerifyTradesCheckbox: false,
      skipVerificationPhrases: 'lend,lending'
    };
    return await GM.getValue(settingName) ?? defaultMap[settingName];
  }

  async function main() {
    if (typeof GM === 'undefined' || typeof GM.setValue !== 'function' || typeof GM.getValue !== 'function') {
      displayMessage('Minimum requirements to run the Virtupets.net script were not met.');
      console.logError('Minimum requirements to run the Virtupets.net script were not met.');
      return;
    }

    let route;
    let body;
    let apiVersion;
    const sw = /market\/wizard/.test(window.location.href);
    const tp_qb_error = /tradingpost\/quickbuy/.test(window.location.href);
    const tp_ao_error = /tradingpost\/acceptoffer/.test(window.location.href);
    const tp_om = /tradingpost\/viewoffers\//.test(window.location.href);
    const tp_vo = /tradingpost\/viewoffers\/\d+/.test(window.location.href);
    const tp_yl = /\/island\/tradingpost\/(?:#.*)?$/.test(window.location.href);
    const settings = window.location.href.includes('/help/userscripts/');
    const ei = /allevents/.test(window.location.href);
    const clientVersion = GM.info.script.version;
    try {
      if (sw) {
        route = "/shop-prices";
        body = extractShopPrices();
        apiVersion = "0.11";
      } else if (tp_qb_error) {
        if (!await getSettingOrDefault('verifyAutoSalePurchases')) return;
        route = "/trade-lots/confirmations";
        body = { id: extractTradeLotIDFromUrl(window.location.href), error: true };
        apiVersion = "0.1";
      } else if (tp_ao_error) {
        if (!await getSettingOrDefault('verifyAutoSalePurchases')) return;
        route = "/trade-lots/confirmations";
        body = { offer_id: extractTradeLotIDFromUrl(window.location.href), error: true };
        apiVersion = "0.1";
      } else if (tp_vo) {
        await setupAcceptOfferListeners("/trade-lots/confirmations", "0.1", clientVersion);
        return;
      } else if (tp_om) {
        return;
      } else if (ei) {
        if (!await getSettingOrDefault('verifyAutoSalesEventInbox')) return;
        route = "/trade-lots/confirmations/bulk";
        body = quickSaleNotifications();
        apiVersion = "0.1";
      } else if (settings) {
        await addSettings();
        return;
      } else {
        route = "/trade-lots";
        body = extractTradeInformation(tp_yl);
        apiVersion = "0.11";
        if (!tp_yl && await getSettingOrDefault('verifyAutoSalePurchases')) setupQuickBuyListeners("/trade-lots/confirmations", "0.1", clientVersion);
      }
      if (route && body && apiVersion && clientVersion) {
        await sendRequest(route, apiVersion, clientVersion, body);
      }
    }
    catch (error) {
      displayMessage(error.message);
    }
  };
  main();
})();