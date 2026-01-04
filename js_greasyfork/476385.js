// ==UserScript==
// @name         Custom Filter for Ruten
// @namespace    https://github.com/rod24574575
// @description  Add additional custom front-end filters for ruten.com.tw.
// @version      0.2.4
// @license      MIT
// @author       rod24574575
// @homepage     https://github.com/rod24574575/ruten-filter
// @homepageURL  https://github.com/rod24574575/ruten-filter
// @supportURL   https://github.com/rod24574575/ruten-filter/issues
// @match        *://*.ruten.com.tw/find/*
// @match        *://*.ruten.com.tw/category/*
// @match        *://*.ruten.com.tw/item/*
// @run-at       document-idle
// @resource     preset_figure https://gist.githubusercontent.com/rod24574575/1f2276f895205e75964338235b751f80/raw/5961aef86dc3440d3950f6414c2aee7d1a73231c/figure.json
// @require      https://cdn.jsdelivr.net/npm/quicksettings@3.0.1/quicksettings.min.js
// @grant        GM.getResourceUrl
// @grant        GM.registerMenuCommand
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/476385/Custom%20Filter%20for%20Ruten.user.js
// @updateURL https://update.greasyfork.org/scripts/476385/Custom%20Filter%20for%20Ruten.meta.js
// ==/UserScript==

// @ts-check
'use strict';

(function () {
  /**
   * @typedef {object} Settings
   * @property {Record<string,boolean>} presets
   * @property {boolean} hideAD
   * @property {boolean} hideRecommender
   * @property {boolean} hideOversea
   * @property {Record<string,boolean>} hideProductKeywords
   * @property {Record<string,boolean>} hideSellers
   * @property {number} hideSellerCreditLessThan
   */

  /**
   * @typedef {object} ComputedSettings
   * @property {RegExp | null} hideProductKeywordMatcher
   * @property {Set<string> | null} hideSellerSet
   */

  /**
   * @typedef {Omit<Settings, 'presets'> & ComputedSettings} ParsedSettings
   */

  /**
   * @template {*} T
   * @param {Record<string,T>} dst
   * @param {Record<string,T>} src
   */
  function mergeRecords(dst, src) {
    for (const [key, value] of Object.entries(src)) {
      if (value !== undefined) {
        dst[key] = value;
      }
    }
  }

  /**
   * @param {Record<string,boolean>} enabledMap
   * @returns {string[]}
   */
  function getEnabledArray(enabledMap) {
    /** @type {string[]} */
    const results = [];
    for (let [key, value] of Object.entries(enabledMap)) {
      key = key.trim();
      if (key && value === true) {
        results.push(key);
      }
    }
    return results;
  }

  /**
   * @param {string[]} enabledArray
   * @returns {Record<string,boolean>}
   */
  function getEnabledMap(enabledArray) {
    /** @type {Record<string,boolean>} */
    const results = {};
    for (let key of enabledArray) {
      key = key.trim();
      if (key) {
        results[key] = true;
      }
    }
    return results;
  }

  /**
   * @param {string} str
   * @returns {string}
   */
  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

  /**
   * @returns {Promise<Settings>}
   */
  async function loadSettings() {
    /** @type {Settings} */
    const defaultSettings = {
      presets: {},
      hideAD: true,
      hideRecommender: true,
      hideOversea: false,
      hideProductKeywords: {},
      hideSellers: {},
      hideSellerCreditLessThan: 0,
    };

    const entries = await Promise.all(
      Object.entries(defaultSettings).map(async ([key, value]) => {
        try {
          value = await GM.getValue(key, value);
        } catch (e) {
          console.warn(e);
        }
        return /** @type {[string, any]} */ ([key, value]);
      }),
    );
    return /** @type {Settings} */ (Object.fromEntries(entries));
  }

  /**
   * @type {ParsedSettings | null}
   */
  let cachedSettings = null;

  /**
   * @param {boolean} [force]
   * @returns {Promise<ParsedSettings>}
   */
  async function ensureSettings(force = false) {
    if (!force && cachedSettings) {
      return cachedSettings;
    }

    const {
      presets,
      hideAD,
      hideRecommender,
      hideOversea,
      hideProductKeywords,
      hideSellers,
      hideSellerCreditLessThan,
    } = await loadSettings();

    const presetResults = await Promise.allSettled(
      getEnabledArray(presets).map(async (preset) => {
        const url = await GM.getResourceUrl(`preset_${preset}`);
        const resp = await fetch(url);
        return /** @type {Promise<Settings>} */ (resp.json());
      }),
    );
    for (const presetResult of presetResults) {
      if (presetResult.status === 'rejected') {
        console.warn(presetResult.reason);
        continue;
      }

      const preset = presetResult.value;
      if (preset.hideProductKeywords) {
        mergeRecords(hideProductKeywords, preset.hideProductKeywords);
      }
      if (preset.hideSellers) {
        mergeRecords(hideSellers, preset.hideSellers);
      }
    }

    /** @type {ParsedSettings['hideProductKeywordMatcher']} */
    let hideProductKeywordMatcher = null;
    const hideProductKeywordsArray = getEnabledArray(hideProductKeywords);
    if (hideProductKeywordsArray.length > 0) {
      try {
        hideProductKeywordMatcher = new RegExp(
          hideProductKeywordsArray.map(escapeRegExp).join('|'),
        );
      } catch (e) {
        console.warn(e);
      }
    }

    /** @type {ParsedSettings['hideSellerSet']} */
    let hideSellerSet = null;
    const hideSellersArray = getEnabledArray(hideSellers);
    if (hideSellersArray.length > 0) {
      hideSellerSet = hideSellersArray.reduce((set, store) => {
        set.add(store);
        return set;
      }, new Set());
    }

    return (cachedSettings = {
      hideAD,
      hideRecommender,
      hideOversea,
      hideProductKeywords,
      hideSellers,
      hideSellerCreditLessThan,
      hideProductKeywordMatcher,
      hideSellerSet,
    });
  }

  /**
   * @typedef {Element & ElementCSSInlineStyle} ElementWithStyle
   */

  /**
   * @param {Element} productCard
   * @returns {any}
   */
  function getProductVueProps(productCard) {
    return /** @type {Element & { __vue__?: any }} */ (productCard).__vue__?.$props;
  }

  /**
   * @param {Element} el
   * @param {boolean} visible
   */
  function setVisible(el, visible) {
    /** @type {ElementWithStyle} */
    (el).style.display = visible ? '' : 'none';
  }

  /**
   * @param {Element} productCard
   * @returns {boolean}
   */
  function isAd(productCard) {
    return !!productCard.querySelector('.rt-product-card-ad-tag');
  }

  /**
   * @param {Element} productCard
   * @returns {boolean}
   */
  function isOversea(productCard) {
    return !!getProductVueProps(productCard)?.item?.ifOversea;
  }

  /**
   * @param {Element} productCard
   * @param {RegExp} matcher
   * @returns {boolean}
   */
  function isProduceKeywordMatch(productCard, matcher) {
    const name = getProductVueProps(productCard)?.item?.name;
    if (!name) {
      return false;
    }
    return matcher.test(name);
  }

  /**
   * @param {Element} productCard
   * @param {Set<number|string>} storeSet
   * @returns {boolean}
   */
  function isSellers(productCard, storeSet) {
    const sellerInfo = getProductVueProps(productCard)?.item?.sellerInfo;
    if (!sellerInfo) {
      return false;
    }

    const { sellerId, sellerNick, sellerStoreName } = sellerInfo;

    /** @type {number|undefined} */
    let sellerIdNumber;
    /** @type {string|undefined} */
    let sellerIdString;
    if (typeof sellerId === 'string') {
      sellerIdNumber = parseInt(sellerId);
      sellerIdString = sellerId;
    } else if (typeof sellerId === 'number') {
      sellerIdNumber = sellerId;
      sellerIdString = String(sellerId);
    }

    return !!(
      (sellerIdNumber && storeSet.has(sellerIdNumber)) ||
      (sellerIdString && storeSet.has(sellerIdString)) ||
      (sellerNick && storeSet.has(sellerNick)) ||
      (sellerStoreName && storeSet.has(sellerStoreName))
    );
  }

  /**
   * @param {Element} productCard
   * @param {number} value
   * @returns {boolean}
   */
  function isSellerCreditLessThan(productCard, value) {
    /** @type {unknown} */
    const rawCredit = getProductVueProps(productCard)?.item?.sellerInfo?.sellerCredit;

    /** @type {number} */
    let credit;
    if (typeof rawCredit === 'number') {
      credit = rawCredit;
    } else if (typeof rawCredit === 'string') {
      credit = parseInt(rawCredit);
      if (isNaN(credit)) {
        return false;
      }
    } else {
      return false;
    }
    return credit < value;
  }

  /**
   * @param {Element} productCard
   * @param {boolean} visible
   */
  function setProductVisible(productCard, visible) {
    const wrapper = productCard.closest('.rt-slideshow-inner > *, .search-result-container > *');
    if (!wrapper) {
      return;
    }
    setVisible(wrapper, visible);
  }

  /**
   * @param {boolean} [force]
   */
  async function run(force = false) {
    const {
      hideAD,
      hideRecommender,
      hideOversea,
      hideProductKeywordMatcher,
      hideSellerSet,
      hideSellerCreditLessThan,
    } = await ensureSettings(force);

    const overseaContainers = document.querySelectorAll('.ebay-result-container');
    if (overseaContainers.length > 0) {
      for (const el of overseaContainers) {
        setVisible(el, !hideOversea);
      }
    }

    const recommenders = document.querySelectorAll('.recommender-keyword');
    if (recommenders.length > 0) {
      for (const el of recommenders) {
        setProductVisible(el, !hideRecommender);
      }
    }

    const productCards = document.querySelectorAll('.rt-product-card');
    if (productCards.length > 0) {
      const visibles = [...productCards].map((productCard) => {
        try {
          return !(
            (hideAD && isAd(productCard)) ||
            (hideOversea && isOversea(productCard)) ||
            (hideProductKeywordMatcher &&
              isProduceKeywordMatch(productCard, hideProductKeywordMatcher)) ||
            (hideSellerSet && isSellers(productCard, hideSellerSet)) ||
            (hideSellerCreditLessThan > 0 &&
              isSellerCreditLessThan(productCard, hideSellerCreditLessThan))
          );
        } catch (e) {
          console.warn(e);
          return true;
        }
      });
      for (let i = productCards.length - 1; i >= 0; --i) {
        setProductVisible(productCards[i], visibles[i]);
      }
    }
  }

  let running = false;
  const mutationObserver = new MutationObserver(async () => {
    if (running) {
      return;
    }
    running = true;
    await run();
    running = false;
  });
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
  run();

  /**
   * @typedef { typeof window & { QuickSettings?: import('quicksettings').default } } WindowWithQuickSettings
   */

  const QuickSettings = /** @type {WindowWithQuickSettings} */ (window).QuickSettings;

  /**
   * @returns {Promise<void>}
   */
  async function configure() {
    if (!QuickSettings) {
      return;
    }

    const settings = await loadSettings();

    return new Promise((resolve) => {
      /**
       * @template {keyof Settings} T
       * @param {T} key
       * @param {Settings[T]} value
       */
      function updateSettings(key, value) {
        settings[key] = value;
      }

      function destroy() {
        wrapper.remove();
        // HACK: workaround for qs js error bugs
        window.setTimeout(() => {
          panel.destroy();
        }, 0);
      }

      async function apply() {
        destroy();
        await Promise.allSettled(
          Object.entries(settings).map(async ([key, value]) => {
            return GM.setValue(key, value);
          }),
        );
        resolve();

        // Do not wait for running.
        run(true);
      }

      function cancel() {
        destroy();
        resolve();
      }

      const wrapper = document.body.appendChild(document.createElement('div'));
      Object.assign(wrapper.style, {
        position: 'fixed',
        left: '0',
        top: '0',
        width: '100vw',
        height: '100vh',
        'z-index': '10000',
        background: 'rgba(0,0,0,0.6)',
      });

      const panel = QuickSettings.create(0, 0, 'Configure', wrapper)
        .addBoolean('Use preset config: figure', settings.presets['figure'] ?? false, (value) => {
          updateSettings('presets', { ...settings.presets, figure: value });
        })
        .addBoolean('Hide AD', settings.hideAD, (value) => {
          updateSettings('hideAD', value);
        })
        .addBoolean('Hide recommender', settings.hideRecommender, (value) => {
          updateSettings('hideRecommender', value);
        })
        .addBoolean('Hide oversea', settings.hideOversea, (value) => {
          updateSettings('hideOversea', value);
        })
        .addText(
          'Hide products that match keywords (separated by comma)',
          getEnabledArray(settings.hideProductKeywords).join(','),
          (value) => {
            updateSettings('hideProductKeywords', getEnabledMap(value.split(',')));
          },
        )
        .addText(
          'Hide sellers by name/id (separated by comma)',
          getEnabledArray(settings.hideSellers).join(','),
          (value) => {
            updateSettings('hideSellers', getEnabledMap(value.split(',')));
          },
        )
        .addNumber(
          'Hide sellers with credit less than',
          0,
          Infinity,
          settings.hideSellerCreditLessThan,
          1,
          (value) => {
            updateSettings('hideSellerCreditLessThan', value);
          },
        )
        .addButton('Apply', apply)
        .addButton('Cancel', cancel);

      const { width: wrapperWidth, height: wrapperHeight } = wrapper.getBoundingClientRect();
      const { width, height } = /** @type {typeof panel & { _panel: Element } } */ (
        panel
      )._panel.getBoundingClientRect();
      panel.setPosition((wrapperWidth - width) / 2, (wrapperHeight - height) / 2);
    });
  }

  if (QuickSettings) {
    let configuring = false;
    GM.registerMenuCommand('Configure', async () => {
      if (configuring) {
        return;
      }
      configuring = true;
      await configure();
      configuring = false;
    });
  }
})();
