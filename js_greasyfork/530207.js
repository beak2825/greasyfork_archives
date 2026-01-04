/*
//////////////////////////////////////////////////
//                                              //
//        Photon Ultra by nocommas              //
//        Twitter: twitter.com/n0commas         //
//                                              //
//  START TRADING ON PHOTON NOW                 //
//                                              //
//  https://photon-sol.tinyastro.io/@nocommas   //
//                                              //
//////////////////////////////////////////////////
*/
// ==UserScript==
// @name         Photon Ultra
// @namespace    https://violentmonkey.github.io/
// @version      1.0
// @description  Integrates Trading Bot, Bundle Analysis, Pump & Fun Dupe Checker, X Tweet Hover Preview, and URL Highlighting scripts
// @author       nocommas
// @match        https://photon-sol.tinyastro.io/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      twitter.com
// @connect      x.com
// @downloadURL https://update.greasyfork.org/scripts/530207/Photon%20Ultra.user.js
// @updateURL https://update.greasyfork.org/scripts/530207/Photon%20Ultra.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /****************************************************************
   *   Helpers for loading/saving toggles and building the UI
   ****************************************************************/
  const DEFAULT_SETTINGS = {
    enableTradingBot: true,
    enableBundleAnalysis: true,
    enablePumpFunDupeChecker: true,
    enableTweetHoverPreview: true,
    enableUrlHighlighting: true, // Added for URL highlighting
    panelCollapsed: false,
    debugMode: false
  };

  function loadSettings() {
    try {
      const stored = JSON.parse(localStorage.getItem('photonAllInOneSettings'));
      return stored ? Object.assign({}, DEFAULT_SETTINGS, stored) : { ...DEFAULT_SETTINGS };
    } catch (e) {
      return { ...DEFAULT_SETTINGS };
    }
  }

  function saveSettings(settings) {
    localStorage.setItem('photonAllInOneSettings', JSON.stringify(settings));
  }

  const scriptSettings = loadSettings();

  function logDebug(message) {
    if (scriptSettings.debugMode) {
      console.log(`[Debug]: ${message}`);
    }
  }

  function createTogglesUI() {
    if (document.getElementById('photon-all-in-one-toggles')) return;

    const container = document.createElement('div');
    container.id = 'photon-all-in-one-toggles';

    const collapseBtn = document.createElement('button');
    collapseBtn.id = 'photonPanelCollapseBtn';
    collapseBtn.textContent = scriptSettings.panelCollapsed ? '+' : '−';
    container.appendChild(collapseBtn);

    const body = document.createElement('div');
    body.id = 'photon-all-in-one-toggles-body';
    body.innerHTML = `
      <label>
        <input type="checkbox" id="toggleTradingBot" />
        Calculate Trading Bot % as of Total Holders
      </label>
      <label>
        <input type="checkbox" id="toggleBundleAnalysis" />
        Analyze Bundles
      </label>
      <label>
        <input type="checkbox" id="togglePumpFunDupeChecker" />
        Check Dupes on PumpFun
      </label>
      <label>
        <input type="checkbox" id="toggleTweetHoverPreview" />
        Enable Tweet Hover Preview
      </label>
      <label>
        <input type="checkbox" id="toggleUrlHighlighting" />
        Enable URL Highlighting
      </label>
      <label>
        <input type="checkbox" id="toggleDebugMode" />
        Enable Debug Mode
      </label>
      <small>Changes take effect on next page load/navigation.</small>
    `;
    container.appendChild(body);

    document.body.appendChild(container);

    body.querySelector('#toggleTradingBot').checked = scriptSettings.enableTradingBot;
    body.querySelector('#toggleBundleAnalysis').checked = scriptSettings.enableBundleAnalysis;
    body.querySelector('#togglePumpFunDupeChecker').checked = scriptSettings.enablePumpFunDupeChecker;
    body.querySelector('#toggleTweetHoverPreview').checked = scriptSettings.enableTweetHoverPreview;
    body.querySelector('#toggleUrlHighlighting').checked = scriptSettings.enableUrlHighlighting;
    body.querySelector('#toggleDebugMode').checked = scriptSettings.debugMode;

    body.querySelector('#toggleTradingBot').addEventListener('change', (e) => {
      scriptSettings.enableTradingBot = e.target.checked;
      saveSettings(scriptSettings);
    });
    body.querySelector('#toggleBundleAnalysis').addEventListener('change', (e) => {
      scriptSettings.enableBundleAnalysis = e.target.checked;
      saveSettings(scriptSettings);
    });
    body.querySelector('#togglePumpFunDupeChecker').addEventListener('change', (e) => {
      scriptSettings.enablePumpFunDupeChecker = e.target.checked;
      saveSettings(scriptSettings);
    });
    body.querySelector('#toggleTweetHoverPreview').addEventListener('change', (e) => {
      scriptSettings.enableTweetHoverPreview = e.target.checked;
      saveSettings(scriptSettings);
    });
    body.querySelector('#toggleUrlHighlighting').addEventListener('change', (e) => {
      scriptSettings.enableUrlHighlighting = e.target.checked;
      saveSettings(scriptSettings);
    });
    body.querySelector('#toggleDebugMode').addEventListener('change', (e) => {
      scriptSettings.debugMode = e.target.checked;
      saveSettings(scriptSettings);
    });

    if (scriptSettings.panelCollapsed) {
      body.style.display = 'none';
    } else {
      body.style.display = 'block';
    }

    collapseBtn.addEventListener('click', () => {
      scriptSettings.panelCollapsed = !scriptSettings.panelCollapsed;
      saveSettings(scriptSettings);
      body.style.display = scriptSettings.panelCollapsed ? 'none' : 'block';
      collapseBtn.textContent = scriptSettings.panelCollapsed ? '+' : '−';
    });

    GM_addStyle(`
      #photon-all-in-one-toggles {
        position: fixed;
        top: 20px;
        right: 10px;
        background: rgba(0, 0, 0, 0.85);
        color: #fff;
        font-family: Arial, sans-serif;
        font-size: 12px;
        border-radius: 5px;
        z-index: 99999;
        padding: 5px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
      #photonPanelCollapseBtn {
        background: #333;
        color: #fff;
        border: none;
        font-weight: bold;
        font-size: 14px;
        line-height: 1;
        width: 24px;
        height: 24px;
        cursor: pointer;
        border-radius: 3px;
        margin: 0;
        padding: 0;
      }
      #photonPanelCollapseBtn:hover {
        background: #444;
      }
      #photon-all-in-one-toggles-body {
        margin-top: 8px;
      }
      #photon-all-in-one-toggles-body label {
        display: block;
        margin-bottom: 6px;
        cursor: pointer;
      }
      #photon-all-in-one-toggles-body label input[type="checkbox"] {
        vertical-align: middle;
        margin-right: 4px;
      }
      #photon-all-in-one-toggles-body small {
        display: block;
        margin-top: 8px;
        opacity: 0.7;
      }
    `);
  }

  /****************************************************************
   *    New Feature: URL Highlighting (extracted from Feature #1)
   *    (Runs only on /en/memescope if enabled)
   ****************************************************************/
  function initUrlHighlighting() {
    if (!window.location.href.includes('/en/memescope')) return;

    function startObserver() {
      const parentSelector = '.IkXVawB0ALMCnMdJvOFY.sZGsa8iyXO7CgxH57jwf.l-col-12.l-col-xl-4';
      const parent = document.querySelector(parentSelector);
      if (!parent) {
        setTimeout(startObserver, 100);
        return;
      }
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length) {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1 && node.classList.contains('sBVBv2HePq7qYTpGDmRM')) {
                processCard(node);
              }
            });
          }
        });
      });
      observer.observe(parent, { childList: true, subtree: true });
      logDebug('MutationObserver for URL Highlighting started.');
    }

    async function processCard(card) {
      if (card.dataset.processed) return;
      card.dataset.processed = 'true';

      await new Promise((resolve) => setTimeout(resolve, 1));

      const urlContainer = card.querySelector('div.D05u1bw1k0YiV6GK94gQ');
      if (!urlContainer) return;
      const urls = Array.from(urlContainer.querySelectorAll('a[href]'))
        .map((a) => {
          const dataIcon = a.querySelector('span[data-icon]')?.getAttribute('data-icon');
          if (dataIcon === 'pump-grey') return null;
          return { type: dataIcon, url: a.getAttribute('href') };
        })
        .filter(Boolean);
      logDebug(`Extracted ${urls.length} URL(s) from card.`);

      for (const { type, url } of urls) {
        if (!url) continue;

        if ((type === 'website' || type === 'twitter') && url.includes('status')) {
          card.style.border = '2px solid lime';
        }
        if (type === 'website' && url.includes('reddit.com')) {
          card.style.border = '2px solid orange';
        }
        if (type === 'website' && (url.includes('vm.tiktok.com') || url.includes('tiktok.com'))) {
          card.style.border = '2px solid cyan';
        }
        if (type === 'website' && (url.includes('kick.tv') || url.includes('twitch.tv'))) {
          card.style.border = '2px solid purple';
        }
      }
    }

    startObserver();
  }

  /****************************************************************
   *    Feature #2: Photon MemeScope Trading Bot Holders Comparison
   ****************************************************************/
  function initTradingBotHoldersComparison() {
    if (!window.location.href.includes('/en/memescope')) return;

    (function () {
      function getTradingBotHolders(div) {
        const el = div.querySelector('.t2JBH0X8tBwr1QlvoIbT.u-color-dark.u-font-light-semibold.u-d-flex.u-align-items-center');
        return el ? parseInt(el.textContent.trim(), 10) : null;
      }

      function getTotalHolders(div) {
        const el = div.querySelector('.t2JBH0X8tBwr1QlvoIbT.u-d-flex.u-align-items-center .u-font-semibold');
        return el ? parseInt(el.textContent.trim(), 10) : null;
      }

      function getNeonColorForPercentage(percentage) {
        if (percentage < 10) return '#FF355E';
        if (percentage >= 75) return '#39FF14';
        const normalized = (percentage - 10) / 65;
        const red = Math.round(255 - (255 - 53) * normalized);
        const green = Math.round(53 + (255 - 53) * normalized);
        return `rgb(${red}, ${green}, 20)`;
      }

      function displayPercentage(div, tradingBotHolders, totalHolders) {
        if (tradingBotHolders !== null && totalHolders !== null && totalHolders > 0) {
          const percentage = ((tradingBotHolders / totalHolders) * 100).toFixed(0);
          let percentageElement = div.querySelector('.trading-bot-percentage');
          if (!percentageElement) {
            percentageElement = document.createElement('div');
            percentageElement.className = 'trading-bot-percentage';
            percentageElement.style.fontWeight = 'bold';
            percentageElement.style.marginLeft = '8px';
            const holderContainer = div.querySelector('.t2JBH0X8tBwr1QlvoIbT.u-d-flex.u-align-items-center');
            if (holderContainer) holderContainer.appendChild(percentageElement);
          }
          percentageElement.textContent = `${percentage}%`;
          percentageElement.style.color = getNeonColorForPercentage(parseFloat(percentage));
        }
      }

      function processCard(card) {
        const tradingBotHolders = getTradingBotHolders(card);
        const totalHolders = getTotalHolders(card);
        displayPercentage(card, tradingBotHolders, totalHolders);
      }

      function observeCards() {
        const cards = document.querySelectorAll('.sBVBv2HePq7qYTpGDmRM.VTmpJ0jdbJuSJQ4HKGlN');
        cards.forEach(processCard);
      }

      const observer = new MutationObserver(() => observeCards());
      observer.observe(document.body, { childList: true, subtree: true });
      observeCards();
      setInterval(observeCards, 1000);
    })();
  }

  function extractTokenDetails() {
    const tokenAddressElement = document.querySelector('div[data-show-token-address]');
    const tokenAddress = tokenAddressElement?.getAttribute('data-show-token-address');
    const tokenNameElement = document.querySelector('.p-show__bar__title span[data-tippy-content]');
    const tokenName = tokenNameElement?.getAttribute('data-tippy-content')?.trim();
    return tokenAddress && tokenName ? { tokenName, tokenAddress } : null;
  }

  /****************************************************************
   *    Feature #3: Photon Bundle Analysis
   ****************************************************************/
  function initBundleAnalysis() {
    if (!window.location.href.includes('/en/lp')) return;
    (function () {
      let currentAddress = null;
      let refreshInterval = null;

      function analyzeBundles(bundles) {
        let countBelow5 = 0, countBetween5And10 = 0, countAbove10 = 0;
        if (!bundles || typeof bundles !== 'object') {
          console.error('Bundles data is invalid or missing:', bundles);
          return { countBelow5, countBetween5And10, countAbove10 };
        }
        Object.values(bundles).forEach(bundle => {
          const holdingPercentage = bundle.holding_percentage || 0;
          if (holdingPercentage < 5) countBelow5++;
          else if (holdingPercentage >= 5 && holdingPercentage < 10) countBetween5And10++;
          else if (holdingPercentage >= 10) countAbove10++;
        });
        return { countBelow5, countBetween5And10, countAbove10 };
      }

      function getColorForPercentage(percentage) {
        if (percentage >= 20) return 'red';
        if (percentage >= 10) return 'yellow';
        return 'green';
      }

      function createOrUpdateUI(data, bundleCounts, timestamp) {
        const { countBelow5, countBetween5And10, countAbove10 } = bundleCounts;
        const holdingPercentageColor = getColorForPercentage(data.total_holding_percentage);
        const fadedFeedDiv = document.querySelector('#faded-feed');
        let container = fadedFeedDiv.querySelector('#custom-bundle-analysis-container');
        if (!container) {
          container = document.createElement('div');
          container.id = 'custom-bundle-analysis-container';
          container.className = 'p-show__widget p-show__info u-p-0 u-mb-xs u-mb-0-lg custom-bundle-analysis';
          fadedFeedDiv.insertBefore(container, fadedFeedDiv.firstChild);
        } else if (fadedFeedDiv.firstChild !== container) {
          fadedFeedDiv.insertBefore(container, fadedFeedDiv.firstChild);
        }

        const content = `
          <div class="c-info js-info">
            <div class="c-info__content js-info__content">
              <div class="l-row l-row-gap--l u-mt-s">
                <div class="l-col-auto c-info__col">
                  <div class="c-info__left">
                    <div class="c-info__cell u-font-size-zh-3xs">
                      Held
                      <div class="c-info__cell__value" style="color: ${holdingPercentageColor};">${data.total_holding_percentage.toFixed(2)}%</div>
                    </div>
                  </div>
                </div>
                <div class="l-col">
                  <div class="l-row u-justify-content-between">
                    <div class="l-col-auto">
                      <div class="c-info__cell u-font-size-zh-3xs">
                        Last Updated
                        <div class="c-info__cell__value">${timestamp}</div>
                      </div>
                    </div>
                    <div class="l-col-auto">
                      <div class="c-info__cell u-font-size-zh-3xs">
                        Total % Bundled
                        <div class="c-info__cell__value">${data.total_percentage_bundled.toFixed(2)}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="l-row l-row-gap--l u-mt-s">
                <div class="l-col-auto c-info__col">
                  <div class="c-info__left">
                    <div class="c-info__cell u-font-size-zh-3xs">
                      Total Bundles
                      <div class="c-info__cell__value">${data.total_bundles}</div>
                    </div>
                  </div>
                </div>
                <div class="l-col">
                  <div class="l-row u-justify-content-between">
                    <div class="l-col-auto">
                      <div class="c-info__cell u-font-size-zh-3xs">
                        < 5%
                        <div class="c-info__cell__value">${countBelow5}</div>
                      </div>
                    </div>
                    <div class="l-col-auto">
                      <div class="c-info__cell u-font-size-zh-3xs ">
                        5%-10%
                        <div class="c-info__cell__value">${countBetween5And10}</div>
                      </div>
                    </div>
                    <div class="l-col-auto">
                      <div class="c-info__cell u-font-size-zh-3xs">
                        > 10%
                        <div class="c-info__cell__value">${countAbove10}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="l-row l-row-gap--l u-mt-s">
                <div class="l-col-auto c-info__col">
                  <div class="c-info__left">
                    <div class="c-info__cell u-font-size-zh-3xs">
                      Dev Holding
                      <div class="c-info__cell__value">${data.creator_analysis.holding_percentage.toFixed(2)}%</div>
                    </div>
                  </div>
                </div>
                <div class="l-col">
                  <div class="l-row u-justify-content-between">
                    <div class="l-col-auto">
                      <div class="c-info__cell u-font-size-zh-3xs">
                        Dev Risk
                        <div class="c-info__cell__value">${data.creator_analysis.high_risk ? 'Yes' : 'No'}</div>
                      </div>
                    </div>
                    <div class="l-col-auto">
                      <div class="c-info__cell u-font-size-zh-3xs">
                        Tokens Created
                        <div class="c-info__cell__value">${data.creator_analysis.history.total_coins_created}</div>
                      </div>
                    </div>
                    <div class="l-col-auto">
                      <div class="c-info__cell u-font-size-zh-3xs">
                        Rug Count
                        <div class="c-info__cell__value">${data.creator_analysis.history.rug_count}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;

        if (container.innerHTML !== content) container.innerHTML = content;
      }

      function fetchBundleData(address) {
        if (address) {
          GM_xmlhttpRequest({
            method: "GET",
            url: `https://trench.bot/api/bundle/bundle_advanced/${address}`,
            onload: function (response) {
              try {
                const data = JSON.parse(response.responseText);
                if (!data || typeof data !== 'object') throw new Error('Invalid response data');
                const bundleCounts = analyzeBundles(data.bundles);
                const timestamp = new Date().toLocaleTimeString();
                createOrUpdateUI(data, bundleCounts, timestamp);
              } catch (error) {
                console.error('Error processing bundle data:', error);
              }
            },
            onerror: function (error) {
              console.error('Failed to fetch bundle data:', error);
            }
          });
        }
      }

      function handleNavigation() {
        const tokenDetails = extractTokenDetails();
        const address = tokenDetails?.tokenAddress;
        if (address && address !== currentAddress) {
          currentAddress = address;
          if (refreshInterval) clearInterval(refreshInterval);
          fetchBundleData(address);
          refreshInterval = setInterval(() => fetchBundleData(address), 15000);
        } else if (!address) {
          currentAddress = null;
          if (refreshInterval) {
            clearInterval(refreshInterval);
            refreshInterval = null;
          }
        }
      }

      function observeDOMChanges() {
        const observer = new MutationObserver(() => handleNavigation());
        observer.observe(document.body, { childList: true, subtree: true });
      }

      observeDOMChanges();
      handleNavigation();
    })();
  }

  /****************************************************************
   *    Feature #4: Photon PumpFun Dupe Checker
   ****************************************************************/
  function initPumpFunDupeChecker() {
    if (!window.location.href.includes('/en/lp')) return;
    (function () {
      const API_URL = 'https://frontend-api-v3.pump.fun/coins?offset=0&limit=50&sort=market_cap&includeNsfw=false&order=DESC&searchTerm=';
      let fetchInterval = null;
      let currentTokenName = null;
      let currentTokenAddress = null;

      function getFormattedTimestamp() {
        return new Date().toLocaleTimeString();
      }

      function formatTimestamp(timestamp) {
        const secondsAgo = Math.floor(Date.now() / 1000) - Math.floor(timestamp / 1000);
        if (secondsAgo < 60) return `${secondsAgo}s ago`;
        const minutesAgo = Math.floor(secondsAgo / 60);
        if (minutesAgo < 60) return `${minutesAgo}m ago`;
        const hoursAgo = Math.floor(minutesAgo / 60);
        if (hoursAgo < 24) return `${hoursAgo}h ago`;
        return `${Math.floor(hoursAgo / 24)}d ago`;
      }

      function fetchSecondData(searchTerm, tokenAddress) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: `${API_URL}${encodeURIComponent(searchTerm)}`,
          onload: function (response) {
            try {
              const coins = JSON.parse(response.responseText);
              if (coins && coins.length > 0) {
                const timestamp = getFormattedTimestamp();
                createDupeCheckUI(coins, timestamp, tokenAddress);
              } else {
                logDebug('No tokens found in the PumpFun API response.');
              }
            } catch (error) {
              console.error('Failed to parse PumpFun API response:', error);
            }
          },
          onerror: function (error) {
            console.error('PumpFun API request failed:', error);
          },
        });
      }

      function createDupeCheckUI(data, timestamp, tokenAddress) {
        const fadedFeedDiv = document.querySelector('#faded-feed');
        let viewer = document.getElementById('pumpfun-token-viewer');
        if (!viewer) {
          viewer = document.createElement('div');
          viewer.id = 'pumpfun-token-viewer';
          viewer.className = 'p-show__widget p-show__pair u-py-s-lg';
          fadedFeedDiv.appendChild(viewer);
        }

        const counts = data.reduce((acc, item) => {
          acc[item.symbol] = (acc[item.symbol] || 0) + 1;
          return acc;
        }, {});
        const duplicates = Object.values(counts).filter(count => count > 1).length;

        const summary = `
          <div class="u-d-flex u-flex-lg-column u-align-items-start">
            <div class="l-row u-justify-content-between">
              <div class="l-col-auto">
                <div class="c-info__cell u-font-size-zh-3xs">
                    Last Updated
                    <div class="c-info__cell__value">${timestamp}</div>
                </div>
              </div>
              <div class="l-col-auto">
                <div class="c-info__cell u-font-size-zh-3xs">
                    Tokens
                    <div class="c-info__cell__value">${data.length}</div>
                </div>
              </div>
              <div class="l-col-auto">
                <div class="c-info__cell u-font-size-zh-3xs">
                    Dupes
                    <div class="c-info__cell__value">${duplicates}</div>
                </div>
              </div>
            </div>
          </div>
          <hr class="u-mb-xs-lg u-mb-xs u-mt-xs-lg u-mt-xxs"></hr>
        `;

        viewer.innerHTML =
          summary +
          data
            .map((item) => {
              const color = item.mint === tokenAddress ? '#4caf50' : '#ffffff';
              const shortMint = item.mint.substring(0, 7);
              return `
                <div class="token-item p-show__widget__list__item">
                  <strong>${item.name}</strong> (${item.symbol})<br>
                  <a href="https://photon-sol.tinyastro.io/en/lp/${item.mint}"
                     target="_blank" style="color: ${color};">
                    <span style="word-wrap: break-word;">${shortMint}</span>
                  </a><br>
                  $${Math.round(item.usd_market_cap).toLocaleString()}<br>
                  ${formatTimestamp(item.created_timestamp)}<br>
                </div>`;
            })
            .join('');

        GM_addStyle(`
          #pumpfun-token-viewer {
            color: white;
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.5;
            padding: 15px;
            border-radius: 10px;
            overflow-y: auto;
            z-index: 10002;
            max-height: 600px;
          }
          .token-item {
            margin-bottom: 10px;
          }
          .token-item a {
            text-decoration: none;
          }
          .token-item a:hover {
            text-decoration: underline;
          }
        `);
      }

      function observePageChanges() {
        const observer = new MutationObserver(() => {
          const tokenDetails = extractTokenDetails();
          if (tokenDetails) {
            const { tokenName, tokenAddress } = tokenDetails;
            if (currentTokenName !== tokenName || currentTokenAddress !== tokenAddress) {
              currentTokenName = tokenName;
              currentTokenAddress = tokenAddress;
              clearInterval(fetchInterval);
              fetchSecondData(currentTokenName, currentTokenAddress);
              fetchInterval = setInterval(() => fetchSecondData(currentTokenName, currentTokenAddress), 15000);
            }
          } else {
            clearInterval(fetchInterval);
            currentTokenName = null;
            currentTokenAddress = null;
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }

      observePageChanges();
    })();
  }

  /****************************************************************
   *    Feature #5: X Tweet Hover Preview
   ****************************************************************/
  function initTweetHoverPreview() {
    if (!window.location.href.includes('/en/memescope')) return;

    GM_addStyle(`
      .tweet-preview {
        position: absolute;
        z-index: 9999;
      }
    `);

    let preview;

    document.body.addEventListener('mouseover', function(event) {
      let target = event.target.closest('a[href*="twitter.com"], a[href*="x.com"]');
      if (target) fetchTweet(target.href, target);
    });

    function fetchTweet(url, anchor) {
      let match = url.match(/status\/(\d+)/);
      if (!match) return;
      let tweetId = match[1];
      showPreview(anchor, tweetId);
    }

    function showPreview(anchor, tweetId) {
      if (preview) preview.remove();
      preview = document.createElement('div');
      preview.className = 'tweet-preview';
      preview.innerHTML = `<iframe src="https://platform.twitter.com/embed/Tweet.html?dnt=false&embedId=twitter-widget-0&frame=false&hideCard=false&hideThread=false&id=${tweetId}&lang=en&theme=dark&widgetsVersion=2615f7e52b7e0%3A1702314776716" style="width: 300px; height: 1000px;" frameborder="0" scrolling="no"></iframe>`;
      document.body.appendChild(preview);

      let rect = anchor.getBoundingClientRect();
      preview.style.top = `${window.scrollY + rect.bottom + 5}px`;
      preview.style.left = `${window.scrollX + rect.left}px`;

      anchor.addEventListener('mouseout', () => {
        if (preview) preview.remove();
      }, { once: true });
    }
  }

  /****************************************************************
   *    Create Faded Feed
   ****************************************************************/
  function ensureFadedFeedDiv() {
    if (!window.location.href.includes('/en/lp')) return;
    let outerWrapper = document.querySelector('.l-col-12.l-col-lg-auto#faded-feed-wrapper');
    if (!outerWrapper) {
      outerWrapper = document.createElement('div');
      outerWrapper.className = 'l-col-12 l-col-lg-auto';
      outerWrapper.id = 'faded-feed-wrapper';
      const parentRow = document.querySelector('.l-row.l-row-gap--xxs.u-flex-lg-row-reverse');
      if (parentRow) parentRow.appendChild(outerWrapper);
    }

    const footer = `
      <div class="c-w-form__footer u-mt-xs js-show__snipe__el u-font-size-zh-xxs" style="text-align: right;">
        Coded by
        <b>nocommas</b>
      </div>
    `;

    let fadedFeedDiv = outerWrapper.querySelector('#faded-feed');
    if (!fadedFeedDiv) {
      fadedFeedDiv = document.createElement('div');
      fadedFeedDiv.id = 'faded-feed';
      fadedFeedDiv.className = 'p-show__sb u-px-0-lg u-px-s';
      outerWrapper.appendChild(fadedFeedDiv);
    }

    fadedFeedDiv.insertAdjacentHTML('afterend', footer);
  }

  /****************************************************************
   *   Running only what is enabled & building the Toggle UI
   ****************************************************************/
  function runAllFeatures() {
    createTogglesUI();

    if (scriptSettings.enableBundleAnalysis || scriptSettings.enablePumpFunDupeChecker) {
      ensureFadedFeedDiv();
    }

    if (scriptSettings.enableTradingBot) {
      initTradingBotHoldersComparison();
    }

    if (scriptSettings.enableBundleAnalysis) {
      initBundleAnalysis();
    }

    if (scriptSettings.enablePumpFunDupeChecker) {
      initPumpFunDupeChecker();
    }

    if (scriptSettings.enableTweetHoverPreview) {
      initTweetHoverPreview();
    }

    if (scriptSettings.enableUrlHighlighting) {
      initUrlHighlighting();
    }
  }

  runAllFeatures();
})();