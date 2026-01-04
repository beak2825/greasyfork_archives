// ==UserScript==
// @name                highlight-my-interest
// @name:zh-CN          不比价店铺关键词高亮
// @description         highlight keywords in my favorites
// @description:zh-CN   高亮特定网页中感兴趣的关键词
// @version             0.3.8
// @author              jferroal
// @license             GPL-3.0
// @grant               GM_xmlhttpRequest
// @require             https://greasyfork.org/scripts/31793-jmul/code/JMUL.js?version=209567
// @include             http://*
// @include             https://*
// @run-at              document-end
// @namespace           https://greasyfork.org/users/34556-jferroal
// @downloadURL https://update.greasyfork.org/scripts/456244/highlight-my-interest.user.js
// @updateURL https://update.greasyfork.org/scripts/456244/highlight-my-interest.meta.js
// ==/UserScript==

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
let JMUL = window.JMUL || {}

const Map = (list, fn) => {
  let result = []
  if (list && list.length) {
    for (let i = 0; i < list.length; i += 1) {
      result.push(fn(list[i]))
    }
  }
  return result
}

class TextElement {
  constructor(element) {
    this.element = new JMUL.Element(element)
    this.innerText = this.element.innerText
    this.shouldHighlight = false
  }

  highlight() {
    for (const keyword of TextElement.keywords) {
      const keywordPattern = new RegExp(keyword.str, 'gi')
      if (keywordPattern.test(this.innerText)) {
        this.shouldHighlight = true
        this.element.setCss(TextElement.highlightStyle[keyword.type || 'default'])
        this.element.setAttribute('title', keyword.title)
      }
    }
  }

  static init(setting) {
    TextElement.highlightStyle = {}
    Object.keys(setting.color).forEach((type) => {
      TextElement.highlightStyle[type] = {
        background: setting.color[type].bg,
        color: setting.color[type].text,
      }
    })
  }

  static setKeywords(keywords) {
    TextElement.keywords = keywords
  }

  static findAll() {
    return TextElement.targetTagNames.reduce((res, tagName) => {
      const tags = document.getElementsByTagName(tagName)
      return res.concat(Map(tags, (e) => new TextElement(e)))
    }, [])
  }
}

TextElement.targetTagNames = ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'a', 'pre', 'blockquote', 'summary']
module.exports = TextElement

},{}],2:[function(require,module,exports){
const KeywordService = require('./keyword.service');
const SettingService = require('./setting.service');
const TextElement = require('./element');

const Config = {loadUrl:'https://gist.githubusercontent.com/yuyehk/a9904a7e61d9f2762ce2fb9b053a3b5f/raw/61df4dc26e582bf60503ddc39fb65120f1615900/gistfile1.json'};

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
      elements.map((e) => e.highlight());
      highlightedCount = elements.length;
    });
  }
})();

},{"./element":1,"./keyword.service":3,"./setting.service":5}],3:[function(require,module,exports){
class KeywordService {
  static init (setting, href) {
    KeywordService.Setting = setting;
    KeywordService.keywords = [];
    const sites = Object.keys(KeywordService.Setting.sites);
    if (!sites || !sites.length) return;
    sites.forEach((site) => {
      const sitePattern = new RegExp(site, 'gi');
      if (sitePattern.test(href)) {
        KeywordService.keywords.push(...KeywordService.Setting.sites[ site ]);
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
const Setting = require('./setting').Setting
const {Request} = window.JMUL || {JMUL: {}}

const DefaultKeywords = [
  {
    "str": "react",
    "title": "react",
    "type": "programming"
  },
  {
    "str": "爬虫",
    "title": "爬虫",
    "type": "programming"
  },
  {
    "str": "数据",
    "title": "数据"
  },
  {
    'str': 'android',
    'title': 'android',
    'type': 'programming'
  },
  {
    'str': 'javascript',
    'title': 'javascript',
    'type': 'programming'
  },
  {
    'str': 'flask',
    'title': 'flask',
    'type': 'programming'
  },
  {
    'str': '框架',
    'title': '框架'
  },
  {
    'str': '限免',
    'title': '限免',
    'type': 'software'
  },
  {
    'str': '智能家居',
    'title': '智能家居'
  },
  {
    'str': '笔记',
    'title': '笔记'
  },
  {
    'str': '手账',
    'title': '手账'
  },
  {
    'str': 'google',
    'title': 'google'
  },
  {
    'str': '谷歌',
    'title': '谷歌'
  },
  {
    'str': '书籍',
    'title': '书籍'
  }
]

const DefaultResponseHandler = (_response) => {
  let response = _response
  if (typeof _response === 'object' && _response.responseText) {
    response = _response.responseText
  }
  return new Setting(JSON.parse(response))
}

class SettingService {
  static init(config) {
    SettingService.loadUrl = config.loadUrl
    SettingService.method = config.method || 'GET'
    SettingService.contentType = config.contentType || 'application/json'
    SettingService.data = config.data || {}
    SettingService.resHandler = config.resHandler || DefaultResponseHandler
  }

  static load() {
    if (!SettingService.loadUrl) return Promise.resolve(SettingService.DefaultSetting)
    const request = new Request({headers: {'content-type': SettingService.contentType}})
    request.setUrl(SettingService.loadUrl)
    request.setMethod(SettingService.method)
    request.setData(SettingService.data)
    return request.send().then((response) => {
      return SettingService.resHandler(response.responseText)
    })
  }
}

SettingService.DefaultSetting = {
  color: {
    default: {
      bg: '#FFDA5E',
      text: 'black'
    }
  },
  sites: {
    'https://sspai.com/*': DefaultKeywords,
    'https://toutiao.io/*': DefaultKeywords,
    'http://www.inoreader.com/*': DefaultKeywords,
  },
}

module.exports = SettingService

},{"./setting":4}]},{},[2]);
