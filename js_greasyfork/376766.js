// ==UserScript==
// @name                优酷高亮关键词
// @description:zh-CN   高亮特定网页中感兴趣的关键词
// @version             3.7
// @author              HY清风
// @license             GPL-3.0
// @grant               GM_xmlhttpRequest
// @require             https://greasyfork.org/scripts/31793-jmul/code/JMUL.js?version=209567
// @include             http://*
// @include             https://*
// @run-at              document-end
// @namespace           none
// @description 高亮特定网页中感兴趣的关键词
// @downloadURL https://update.greasyfork.org/scripts/376766/%E4%BC%98%E9%85%B7%E9%AB%98%E4%BA%AE%E5%85%B3%E9%94%AE%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/376766/%E4%BC%98%E9%85%B7%E9%AB%98%E4%BA%AE%E5%85%B3%E9%94%AE%E8%AF%8D.meta.js
// ==/UserScript==

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
let JMUL = window.JMUL || {};

const Map = (list, fn) => {
  let result = [];
  if (list && list.length) {
    for (let i = 0; i < list.length; i += 1) {
      result.push(fn(list[ i ]));
    }
  }
  return result;
};

class TextElement {
  constructor (element) {
    this.element = new JMUL.Element(element);
    this.innerText = this.element.innerText;
    this.shouldHighlight = false;
  }

  detect () {
    for (const keyword of TextElement.keywords) {
      const keywordPattern = new RegExp(keyword, 'gi');
      if (keywordPattern.test(this.innerText)) {
        this.shouldHighlight = true;
        break;
      }
    }
    return this;
  }

  highlight () {
    if (this.shouldHighlight) {
      this.element.setCss(TextElement.highlightStyle);
    }
  }

  static init (setting) {
    TextElement.highlightStyle = {
      background: setting.highlightBgColor,
      color: setting.highlightTxtColor,
    };
  }

  static setKeywords (keywords) {
    TextElement.keywords = keywords;
  }

  static findAll () {
    return TextElement.targetTagNames.reduce((res, tagName) => {
      const tags = document.getElementsByTagName(tagName);
      return res.concat(Map(tags, (e) => new TextElement(e)));
    }, []);
  }
}

TextElement.targetTagNames = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'p', 'a', 'pre', 'blockquote', 'summary' ];
module.exports = TextElement;

},{}],2:[function(require,module,exports){
const KeywordService = require('./keyword.service');
const SettingService = require('./setting.service');
const TextElement = require('./element');

const Config = {};

(function () {
  let highlightedCount = 0;
  const href = window.location.href;
  loadSetting().then((setting) => {
    KeywordService.init(setting, href);
    TextElement.init(setting);
    highlight()
  });
  window.addEventListener('scroll', highlight);

  function loadSetting () {
    SettingService.init(Config);
    return SettingService.load();
  }

  function highlight () {
    const elements = TextElement.findAll();
    if (elements.length === highlightedCount) return;
    KeywordService.list().then((keywords) => {
      TextElement.setKeywords(keywords);
      elements.map((e) => e.detect().highlight());
      highlightedCount = elements.length;
    });
  }
})();

},{"./element":1,"./keyword.service":3,"./setting.service":5}],3:[function(require,module,exports){
class KeywordService {
  static init (setting, href) {
    KeywordService.Setting = setting;
    KeywordService.keywords = [];
    const sites = Object.keys(KeywordService.Setting.keywords);
    if (!sites || !sites.length) return;
    sites.forEach((site) => {
      const sitePattern = new RegExp(site, 'gi');
      if (sitePattern.test(href)) {
        KeywordService.keywords.push(...KeywordService.Setting.keywords[ site ]);
      }
    });
  }

  static list () {
    return Promise.resolve(KeywordService.keywords);
  }
}

module.exports = KeywordService;

},{}],4:[function(require,module,exports){
class Setting {
  constructor (jsonBody) {
    Object.assign(this, jsonBody);
  }
}

module.exports = { Setting };

},{}],5:[function(require,module,exports){
const Setting = require('./setting').Setting;
const { Request } = window.JMUL || { JMUL: {} };

const DefaultKeywords = [
  '一琳',
  'HY清风',  
  '免费',
  '限免',
  '韩语中字',
  '日语中字',
  '江英伟',
  '黄岩',
  '现金',
  '河南',
  '【201808】',
  '【201809.01】',
  '【201809.10】',
  '【201809.20】',
  '【201810.01】',
  '【201810.10】',
  '【201810.20】',
  '【201811.01】',
  '【201811.10】',
  '【201811.20】',
  '【201812.01】',
  '【201812.10】',
  '【201812.20】',
  '【201901.01】',
  '【201901.10】',
  '【201901.20】',
  '【201902.01】',
  '【201902.10】',
  '【201902.20】',
  '【201903.01】',
  '【201903.10】',
  '【201903.20】',
  '【201904.01】',
  '【201904.10】',
  '【201904.20】',
  '【201905.01】',
  '【201905.10】',
  '【201905.20】',
  '【201906.01】',
  '【201906.10】',
  '【201906.20】',
  '【201907.01】',
  '【201907.10】',
  '【201907.20】',
  '【201908.01】',
  '【201908.10】',
  '【201908.20】',
  '【201909.01】',
  '【201909.10】',
  '【201909.20】',
  '【201910.01】',
  '【201910.10】',
  '【201910.20】',
  '【201911.01】',
  '【201911.10】',
  '【201911.20】',
  '【201912.01】',
  '【201912.10】',
  '【201912.20】',
  '【202001.01】',
  '【202001.10】',
  '【202001.20】',
  '【202002.01】',
  '【202002.10】',
  '【202002.20】',
  '【202003.01】',
  '【202003.10】',
  '【202003.20】',
  '【202004.01】',
  '【202004.10】',
  '【202004.20】',
  '【202005.01】',
  '【202005.10】',
  '【202005.20】',
  '【202006.01】',
  '【202006.10】',
  '【202006.20】',
  '【202007.01】',
  '【202007.10】',
  '【202007.20】',
  '【202008.01】',
  '【202008.10】',
  '【202008.20】',
  '【202009.01】',
  '【202009.10】',
  '【202009.20】',
  '【202010.01】',
  '【202010.10】',
  '【202010.20】',
  '【202011.01】',
  '【202011.10】',
  '【202011.20】',
  '【202012.01】'
];

const DefaultResponseHandler = (_response) => {
  let response = _response;
  if (typeof _response === 'object' && _response.responseText) {
    response = _response.responseText;
  }
  return new Setting(JSON.parse(response));
};

class SettingService {
  static init (config) {
    SettingService.loadUrl = config.loadUrl;
    SettingService.method = config.method || 'GET';
    SettingService.contentType = config.contentType || 'application/json';
    SettingService.data = config.data || {};
    SettingService.resHandler = config.resHandler || DefaultResponseHandler;
  }

  static load () {
    if (!SettingService.loadUrl) return Promise.resolve(SettingService.DefaultSetting);
    const request = new Request({ headers: { 'content-type': SettingService.contentType } });
    request.setUrl(SettingService.loadUrl);
    request.setMethod(SettingService.method);
    request.setData(SettingService.data);
    return request.send().then((response) => {
      return SettingService.resHandler(response.responseText);
    });
  }
}

SettingService.DefaultSetting = {
  highlightBgColor: '#FFDA5E',
  highlightTxtColor: 'black',
  keywords: {
    'http://*': DefaultKeywords,
    'https://*': DefaultKeywords,
  },
};

module.exports = SettingService;

},{"./setting":4}]},{},[2]);
