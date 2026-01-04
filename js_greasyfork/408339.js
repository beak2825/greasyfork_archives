// ==UserScript==
// @name        Wanikani Common Vocab Indicator
// @namespace   kevinta893
// @author      kevinta893
// @description Show whether the vocabulary word is common or not according to Jisho.org . Original Script by dtwigs
// @run-at      document-end
// @include     https://www.wanikani.com/review/session
// @include     https://www.wanikani.com/lesson/session
// @version     0.0.5
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @connect     jisho.org
// @homepage    https://github.com/kevinta893/wanikani-common-vocab-indicator
// @homepageURL https://github.com/kevinta893/wanikani-common-vocab-indicator
// @downloadURL https://update.greasyfork.org/scripts/408339/Wanikani%20Common%20Vocab%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/408339/Wanikani%20Common%20Vocab%20Indicator.meta.js
// ==/UserScript==


function init() {
  const CACHE_TTL_MILLIS = 1000 * 60 * 60 * 24 * 28;            //28 day cache expiry
  const IS_COMMON_NAMESPACE = 'IsCommonCache';

  var isCommonCache = new IsCommonCacher(IS_COMMON_NAMESPACE, CACHE_TTL_MILLIS);
  var isCommonRequester = new JishoIsCommonRequester();
  var isCommonRepository = new IsCommonRepository(isCommonRequester);

  var commonIndicatorUi = new CommonIndicatorUi();
  var commonIndicatorController = new CommonIndicatorController(commonIndicatorUi, isCommonRepository, isCommonCache);

  console.log('WK Common Vocab Indicator started');

  // To clear the cache in Tampermonkey, 
  // use Developer > Factory Reset in the script editor
}

//====================================================
//UI

class CommonIndicatorUi {

  constructor() {
    this.css = `
    .common-indicator-item {
      position: absolute;
      padding: 0px 5px 2px;
      top: 40px;
      right: 20px;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      border-radius: 3px;
      z-index: 99;
      letter-spacing: 0;
      opacity: 0.8;
      text-decoration: none;
    }
  
    .common-indicator-item.hide {
      background-color: transparent;
      color: transparent;
    }
  
    .common-indicator-item.fetching {
      background-color: white;
      opacity: 0.4;
      color: #a100f1;
    }
  
    .common-indicator-item.common {
      background-color: white;
      color: #a100f1;
    }
  
    .common-indicator-item.uncommon {
      background-color: transparent;
      color: white;
      opacity: 0.5;
      visibility: hidden;
    }
    `;

    this.indicatorClasses = {
      hide: {
        klass: 'hide',
        text: '',
      },
      fetching: {
        klass: 'fetching',
        text: '...',
      },
      common: {
        klass: 'common',
        text: 'common'
      },
      uncommon: {
        klass: 'uncommon',
        text: 'not common',
      }
    };

    this.questionIndicatorHtml = `
      <div id="common-indicator" class="common-indicator-item"></div>
    `;
    this.lessonIndicatorHtml = `
      <div id="common-indicator" class="common-indicator-item"></div>
    `;

    //Add indicator UI
    this.addStyle(this.css);
    $('#question').append(this.questionIndicatorHtml);
    $('#lessons').append(this.lessonIndicatorHtml);

    this.commonIndicator = $('#common-indicator');
  }

  /**
   * Binds handler to event when the wanikani app changes item
   * @param {function} handler Calls back the handler, with the current 
   * WaniKani item displayed
   */
  bindItemChangedEvent(handler) {
    var itemChangedHandler = function (key) {
      var wanikaniItem = $.jStorage.get(key);
      handler(wanikaniItem);
    };

    $.jStorage.listenKeyChange('currentItem', itemChangedHandler);
    $.jStorage.listenKeyChange('l/currentLesson', itemChangedHandler);
  }

  hideIndicator() {
    this.setClassAndText(this.indicatorClasses.hide);
  }

  setFetchingIndicator() {
    this.setClassAndText(this.indicatorClasses.fetching);
  }

  setCommonIndicator(isCommon) {
    if (isCommon) {
      this.setClassAndText(this.indicatorClasses.common);
    } else {
      this.setClassAndText(this.indicatorClasses.uncommon);
    }
  }

  setClassAndText(aObj) {
    for (var klass in this.indicatorClasses) {
      this.commonIndicator.removeClass(klass);
    }

    this.commonIndicator.text(aObj.text).addClass(aObj.klass);
  }

  addStyle(aCss) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (head) {
      style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.textContent = aCss;
      head.appendChild(style);
    }
  }
}

//====================================================
// Common indicator Controller

class CommonIndicatorController {

  constructor(commonIndicatorView, isCommonRepository, isCommonCache) {
    this.commonIndicatorView = commonIndicatorView;
    this.isCommonRepository = isCommonRepository;
    this.isCommonCache = isCommonCache;

    this.commonIndicatorView.bindItemChangedEvent((key) => {
      this.itemChangedEvent(key);
    });
  }

  itemChangedEvent(currentItem) {
    // Item not vocab, hide indicator
    if (!currentItem.hasOwnProperty('voc')) {
      this.commonIndicatorView.hideIndicator();
      return;
    }

    // Is vocab, lookup is common
    var vocab = currentItem.voc;

    // Check the cache if we already have data
    var cacheValue = this.isCommonCache.get(vocab);
    if (cacheValue != null) {
      this.commonIndicatorView.setCommonIndicator(cacheValue);
      return;
    }

    // No data, lookup in repository
    this.commonIndicatorView.setFetchingIndicator();

    this.isCommonRepository.getIsCommon(vocab).then((isCommon) => {
      this.isCommonCache.put(vocab, isCommon);
      this.commonIndicatorView.setCommonIndicator(isCommon);
    });
  }
}

//====================================================
// Jisho repository

class IsCommonRepository {

  constructor(isCommonRequester) {
    this.isCommonRequester = isCommonRequester;
  }

  async getIsCommon(requestedVocab, callback) {
    try {
      var isCommon = await this.isCommonRequester.getJishoIsCommon(requestedVocab);

      //Unknown, assign default
      if (isCommon == null) {
        var defaultCommon = false;
        console.log('Vocab not found, defaulting to is_common=false for: ' + requestedVocab);
        return defaultCommon;
      }

      //Has isCommon data
      return isCommon;
    }
    catch (error) {
      console.error(error);
    }
  }
}

//====================================================
//Jisho API requester

class JishoIsCommonRequester {

  constructor() {
    this.jishoApiUrl = "https://jisho.org/api/v1/search/words?keyword=";
  }

  /**
   * Determines if a vocab work is common or not using the Jisho API
   * @param {*} vocab The vocab to lookup the is_common data for
   * Promise is called back with (string vocab, nullable<bool> isCommon). 
   * isCommon is True if common, false otherwise.
   * If no data (unknown word), then undefined is returned.
   */
  getJishoIsCommon(vocab) {

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'get',
        url: this.jishoApiUrl + vocab,
        responseType: 'json',

        onload: function (response) {
          //No jisho data
          var hasNoData = response.response.data.length == 0 ||
            response.response.data[0] == null;
          if (hasNoData) {
            resolve(null);
          }

          var isCommon = response.response.data[0].is_common;
          resolve(isCommon);
        },

        onerror: function (error) {
          console.error('Jisho error: ', error);
          reject(error);
        },
        ontimeout: function (error) {
          console.error('Jisho timeout error: ', error);
          reject(error);
        }
      });
    });
  }
}


//====================================================
// Cacher

class IsCommonCacher {

  constructor(namespaceKey, cacheTtlMillis) {
    this.namespaceKey = namespaceKey == null ? "" : namespaceKey;
    this.cacheTtlMillis = cacheTtlMillis;
  }

  put(key, val) {
    //expiry time is in milliseconds
    var storageKey = this.generateStorageKey(key);
    GM_setValue(storageKey, { val: val, exp: this.cacheTtlMillis, time: new Date().getTime() })
  }

  get(key) {
    var storageKey = this.generateStorageKey(key);
    var info = GM_getValue(storageKey);
    if (!info) {
      //Not cached
      return null;
    }
    if (new Date().getTime() - info.time > info.exp) {
      //Cache expired
      return null;
    }
    //Cached value
    return info.val;
  }

  generateStorageKey(key) {
    return `${this.namespaceKey}/${key}`;
  }
}

//====================================================
init();
