// ==UserScript==
// @name           Download Video as MP4 [video.sibnet.ru+myvi.ru]
// @name:en        Download Video as MP4 [video.sibnet.ru+myvi.ru]
// @namespace      http://video.sibnet.ru
// @version        3.0.0
// @description    Скачать видео с myvi.ru, video.sibnet.ru одним кликом, правильные названия видео при скачивании
// @description:en Download video from myvi.ru and video.sibnet.ru by a simple click, true filenames of downloaded videos
// @author         EisenStein
// @include        https://video.sibnet.ru/*
// @include        https://cv*.sibnet.ru/*
// @include        https://dv*.sibnet.ru/*
// @include        https://myvi.ru/*
// @include        https://www.myvi.ru/*
// @include        https://fs*.myvi.ru*
// @include        https://myvi.tv/*
// @include        https://www.myvi.tv/*
// @include        https://fs*.myvi.tv*
// @include        https://fs.mikadox.com*
// @connect        sibnet.ru
// @connect        myvi.tv
// @connect        myvi.ru
// @connect        mikadox.com
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_addStyle
// @grant          GM_info
// @grant          GM_download
// @grant          GM_xmlhttpRequest
// @grant          GM.getValue
// @grant          GM.setValue
// @grant          GM.deleteValue
// @grant          GM.addStyle
// @grant          GM.info
// @grant          GM.download
// @grant          GM.xmlHttpRequest
// @grant          unsafeWindow
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/30954/Download%20Video%20as%20MP4%20%5Bvideosibnetru%2Bmyviru%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/30954/Download%20Video%20as%20MP4%20%5Bvideosibnetru%2Bmyviru%5D.meta.js
// ==/UserScript==

(function(window, WINDOW) {
  (function(e, a) { for(var i in a) e[i] = a[i]; }(exports,  (function(modules) { // webpackBootstrap
 	// The module cache
 	var installedModules = {};

 	// The require function
 	function __webpack_require__(moduleId) {

 		// Check if module is in cache
 		if(installedModules[moduleId]) {
 			return installedModules[moduleId].exports;
 		}
 		// Create a new module (and put it into the cache)
 		var module = installedModules[moduleId] = {
 			i: moduleId,
 			l: false,
 			exports: {}
 		};

 		// Execute the module function
 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

 		// Flag the module as loaded
 		module.l = true;

 		// Return the exports of the module
 		return module.exports;
 	}


 	// expose the modules object (__webpack_modules__)
 	__webpack_require__.m = modules;

 	// expose the module cache
 	__webpack_require__.c = installedModules;

 	// define getter function for harmony exports
 	__webpack_require__.d = function(exports, name, getter) {
 		if(!__webpack_require__.o(exports, name)) {
 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
 		}
 	};

 	// define __esModule on exports
 	__webpack_require__.r = function(exports) {
 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
 		}
 		Object.defineProperty(exports, '__esModule', { value: true });
 	};

 	// create a fake namespace object
 	// mode & 1: value is a module id, require it
 	// mode & 2: merge all properties of value into the ns
 	// mode & 4: return value when already ns object
 	// mode & 8|1: behave like require
 	__webpack_require__.t = function(value, mode) {
 		if(mode & 1) value = __webpack_require__(value);
 		if(mode & 8) return value;
 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
 		var ns = Object.create(null);
 		__webpack_require__.r(ns);
 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
 		return ns;
 	};

 	// getDefaultExport function for compatibility with non-harmony modules
 	__webpack_require__.n = function(module) {
 		var getter = module && module.__esModule ?
 			function getDefault() { return module['default']; } :
 			function getModuleExports() { return module; };
 		__webpack_require__.d(getter, 'a', getter);
 		return getter;
 	};

 	// Object.prototype.hasOwnProperty.call
 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

 	// __webpack_public_path__
 	__webpack_require__.p = "";


 	// Load entry module and return exports
 	return __webpack_require__(__webpack_require__.s = 14);
 })

 ([
/* 0 */
 (function(module, exports, __webpack_require__) {

var eventEmitter = __webpack_require__(8)

var LOGGER = {
  log: window.console.log.bind(window.console),
  info: window.console.info.bind(window.console),
  warn: window.console.warn.bind(window.console),
  error: window.console.error.bind(window.console),
  debug: window.console.debug.bind(window.console),
}

var noop = function () {}

function Logger(logger) {
  this.logger = Object.assign({}, LOGGER, logger, { debug: noop })
  var _this = this
  eventEmitter.on('logger', function (options) {
    try {
      _this.update(options)
    } catch (e) {
      console.error(e)
    }
  })
}

/**
 * @param {{ [x: string]: boolean | (...args: any[]) => void}} logger
 */
Logger.prototype.update = function (logger) {
  var keys = Object.keys(logger)
  for (var key of keys) {
    if (logger[key] === true) {
      this.logger[key] = LOGGER[key] || noop
    } else if (typeof logger[key] === 'function') {
      this.logger[key] = logger[key]
    }
  }
}

Logger.prototype.log = function () {
  return this.logger.log.apply(this.logger, arguments)
}
Logger.prototype.debug = function () {
  return this.logger.debug.apply(this.logger, arguments)
}
Logger.prototype.info = function () {
  return this.logger.info.apply(this.logger, arguments)
}
Logger.prototype.warn = function () {
  return this.logger.warn .apply(this.logger, arguments)
}
Logger.prototype.error = function () {
  return this.logger.error.apply(this.logger, arguments)
}

module.exports = Logger

 }),
/* 1 */
 (function(module, exports) {

const time = function() {
  return '[' + new Date().toISOString() + ']'
}

module.exports = time

 }),
/* 2 */
 (function(module, exports, __webpack_require__) {

var Logger = __webpack_require__(0)
var time = __webpack_require__(1)
var parseAJAXHeaders = __webpack_require__(17)
var parseAJAXResponse = __webpack_require__(18)

/**
 * @typedef {{
   method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH';
   url: string;
   headers?: { [x: string]: (string | number) };
   responseType?: string;
   data?: any;
   onprogress?: (loaded: number, total: number) => void;
 }} IRequestDetails
 * @typedef {{
   ok: boolean;
   status: number;
   headers: { [x: string]: string };
   problem?: string;
   data?: T;
 }} IResponse<T = any>
 */

/**
 * @param {IRequestDetails} details
 * @return {XMLHttpRequest | ActiveXObject} details
 */
function __XMLHttpRequest(details) {
  var xhr;
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest()
  } else if (window.ActiveXObject) {
    xhr = new ActiveXObject('Msxml2.XMLHTTP.6.0')
  } else {
    return null
  }
  xhr.open(details.method, details.url, true)
  Object.keys(details.headers).forEach(function (key) {
    xhr.setRequestHeader(key, details.headers[key])
  })
  if (details.responseType) {
    xhr.responseType = details.responseType
  }
  if (details.timeout) {
    xhr.timeout = details.timeout
  }
  return xhr
}

/**
 * @param {string | IRequestDetails} details
 * @param {boolean} [useGM]
 * @return {Promise<IResponse>}
 */
function makeRequest(options, useGM = false) {
  var logger = new Logger()
  logger.debug(time(), 'makeRequest options', options, { useGM: useGM })
  var details = {
    method: 'GET',
    headers: {},
  }
  if (typeof details === 'string') {
    details = Object.assign(details, { url: options })
  } else {
    details = Object.assign(details, options)
  }
  // Response
  var response = {
    ok: false,
    problem: undefined,
    headers: {},
    status: 0,
    data: undefined,
    finalUrl: details.url,
  }
  var resolve
  var promise = new Promise(function (r) {
    resolve = r
  })
  var onLoad = function (e) {
    var isGM = !e.target
    var req = isGM ? e : e.target
    response.status = req.status
    response.headers = parseAJAXHeaders(isGM ? req.responseHeaders : req.getAllResponseHeaders())
    response.ok = req.status >= 200 && req.status < 300
    response.problem = response.ok ? undefined : response.problem
    var isText = !req.responseType || req.responseType.toLowerCase() === 'text'
    response.data = parseAJAXResponse(isText && !isGM ? req.responseText : req.response, response.headers, req.responseType)
    response.finalUrl = req.finalUrl || req.responseURL || response.finalUrl
    logger.debug(time(), 'makeRequest response: ', response, details)
    return response
  }
  var onTimeout = function (e) {
    var isGM = !e.target
    var req = isGM ? e : e.target
    logger.error(time(), 'makeRequest timeout', req.status, req.readyState)
    response.status = req.status
    response.ok = false
    response.problem = 'TIMEOUT'
    return response
  }
  var onError = function (e) {
    var isGM = !e.target
    var req = isGM ? e : e.target
    
    logger.error(time(), 'makeRequest error', req.status, req.readyState)
    response.status = req.status
    response.problem = req.status.toString()
    response.ok = false
    return response
  }
  var onProgress = function (e) {
    if (typeof details.onprogress === 'function') {
      details.onprogress(e.loaded, e.total)
    }
  }
  
  if (!useGM || typeof GM === 'undefined' || typeof GM.xmlHttpRequest === 'undefined') {
    var xhr = new __XMLHttpRequest(details)
    xhr.addEventListener('load', function (e) {
      onLoad(e)
    })
    xhr.addEventListener('timeout', function (e) {
      onTimeout(e)
    })
    xhr.addEventListener('error', function (e) {
      onError(e)
    })
    xhr.addEventListener('loadend', function (e) {
      resolve(response)
    })
    xhr.addEventListener('progress', function (e) {
      onProgress(e)
    })
    xhr.send(details.data)
  } else {
    GM.xmlHttpRequest(Object.assign({}, details, {
      onload: function (req) {
        var r = onLoad(req)
        resolve(r)
      },
      onerror: function (req) {
        var r = onError(req)
        resolve(r)
      },
      ontimeout: function (req) {
        var r = onTimeout(req)
        resolve(r)
      },
      onprogress: function (req) {
        onProgress(req)
      },
    }))
  }
  return promise
}

module.exports = makeRequest

 }),
/* 3 */
 (function(module, exports) {

/**
 * @param {number} timeout
 * @return {Promise<void>}
 */
function delay(timeout) {
  return new Promise(function (resolve) {
    setTimeout(resolve, timeout)
  })
}

module.exports = delay

 }),
/* 4 */
 (function(module, exports) {

const noop = function(){}

/**
 * @param {() => void} [callback]
 * @return {Promise<void>}
 */
function DOMReady(callback) {
  callback = typeof callback === 'function' ? callback : noop
  if (document.readyState === 'loading') {
    var resolve
    var promise = new Promise(function(r){
      resolve = r
    })
    document.addEventListener('DOMContentLoaded', function(){
      callback()
      resolve()
    })
    return promise
  }
  callback()
  return Promise.resolve()
}

module.exports = DOMReady

 }),
/* 5 */
 (function(module, exports) {

var link
/**
 * @param {string} url
 * @return {HTMLElement}
 */
function URLParse(url) {
  link = link || document.createElement('a')
  link.href = url
  return link.cloneNode()
}

module.exports = URLParse

 }),
/* 6 */
 (function(module, exports, __webpack_require__) {

var eventEmitter = __webpack_require__(8)
var Logger = __webpack_require__(0)
var time = __webpack_require__(1)

/**
 * @param {{
   videoId: string;
   url: string;
   filename: string;
   name: string;
   ext: string;
   event: string;
 }} IEventData
 */

var iframeChannel = {
  logger: new Logger(),
  init: function () {
    window.addEventListener('message', iframeChannel.onMessage)
  },
  /** @param {IEventData} data */
  getEventName: function (data) {
    return data && data.videoId && data.event ? (data.videoId + '-' + data.event) : ''
  },
  /** @param {IEventData} data */
  request: function (data) {
    var event = iframeChannel.getEventName(data)
    var logger = iframeChannel.logger;
    logger.debug(time(), 'iframeChannel event = ', event, data)
    if (!event) {
      logger.error(time(), 'iframeChannel request: invalid data', data)
      return Promise.reject(new Error('invalid data'))
    }
    var resolve
    var promise = new Promise(function (res) {
      resolve = res
    })
    eventEmitter.once(event, function (response) {
      logger.debug(time(), 'iframeChannel response ', event, response)
      resolve(response)
    })
    
    iframeChannel.send(data)
    return promise
  },
  /** @param {IEventData} data */
  send: function (data) {
    var videoId = data.videoId
    var id = 'video_iframe_' + videoId
    var iframe = document.querySelector('#' + id)
    var link = document.createElement('a')
    link.href = data.url
    if (!iframe) {
      iframe = document.createElement('iframe')
      iframe.id = id
      iframe.src = link.href + '#DM:' + encodeURIComponent(JSON.stringify(data))
      iframe.style.width = '1px'
      iframe.style.height = '1px'
      iframe.style.visibility = 'hidden'
      document.body.appendChild(iframe)
    } else {
      iframe.contentWindow.postMessage(data, '*')
    }
    return iframe
  },
  onMessage: function (e) {
    var event = iframeChannel.getEventName(e.data)
    if (event) {
      eventEmitter.emit(event, e.data)
    }
  },
}

module.exports = iframeChannel

 }),
/* 7 */
 (function(module, exports) {

var has_gm_info = function () {
  return typeof GM !== 'undefined' && typeof GM.info !== 'undefined'
}

function getScriptName() {
  if (has_gm_info()) {
    return GM.info.script.name
  }
  return 'Video Download Manager'
}

function getScriptVersion() {
  if (has_gm_info()) {
    return GM.info.script.version
  }
  return '1.0.0';
}

function getScriptAuthor() {
  if (has_gm_info()) {
    return GM.info.script.author
  }
  return 'eisen-stein'
}

function getScriptHandler() {
  if (has_gm_info()) {
    return GM.info.scriptHandler
  }
  return 'none'
}

module.exports = {
  script_name: getScriptName() || 'Video Download Manager',
  script_version: getScriptVersion() ? ('v' + getScriptVersion()) : 'v3.0.0',
  script_author: getScriptAuthor() || 'eisen-stein',
  script_handler: getScriptHandler() || 'none',
}


 }),
/* 8 */
 (function(module, exports, __webpack_require__) {

var EventEmitter = __webpack_require__(15)

module.exports = new EventEmitter()

 }),
/* 9 */
 (function(module, exports, __webpack_require__) {

var URLParse = __webpack_require__(5)
var time = __webpack_require__(1)
var Logger = __webpack_require__(0)
var downloadFile = __webpack_require__(16)
var makeRequest = __webpack_require__(2)
var DOMReady = __webpack_require__(4)
var delay = __webpack_require__(3)

var iframeController = {
  logger: new Logger(),
  start: function () {
    var logger = this.logger
    var _this = this
    
    var onData = function (data) {
      if (data && data.videoId && data.event === 'url') {
        logger.debug(time(), 'iframe getUrl', location.href)
        return _this.getUrl(data)
      }
      if (data && data.videoId && data.event === 'size') {
        logger.debug(time(), 'iframe getSize', location.href)
        return _this.getSize(data)
      }
      if (data && data.videoId && data.event === 'download') {
        logger.debug(time(), 'iframe download', location.href)
        return _this.download(data)
      }
      return Promise.resolve()
    }
    
    window.addEventListener('message', function (e) {
      logger.debug(time(), 'iframe onmessage: ', e.origin, e.data)
      onData(e.data)
    })
    
    return Promise.all([
      _this.removeVideo().catch(function() {}),
      onData(_this.getData()),
    ]).then(function () {
      logger.debug(time(), 'iframe started')
    }).catch(function (e) {
      logger.error(time(), 'iframe error: ', e)
    })
  },
  download: function (dt) {
    var data = dt || this.getData()
    var link = URLParse(location.href)
    var _this = this
    link.hash = ''
    return downloadFile(link.href, data.filename, function onProgress(loaded, total) {
      _this.onProgress(loaded, total, data)
    }).then(function () {
      _this.sendMessage(Object.assign({}, data, { event: 'download' }))
    })
  },
  getUrl: function (dt) {
    var data = dt || this.getData()
    
    var response = {
      ok: true,
      finalUrl: location.href,
      status: 200,
      readyState: 4,
      headers: {},
      
      event: 'url',
      videoId: data.videoId,
    }
    this.sendMessage(response)
  },
  getSize: function (dt) {
    var data = dt || this.getData()
    var _this = this
    
    return makeRequest({
      method: 'HEAD',
      url: location.href,
      headers: {
        range: 'bytes=0-10',
      },
    }).then(function (response) {
      _this.sendMessage(
        Object.assign(
          {},
          response,
          {
            event: 'size',
            videoId: data.videoId,
          },
        )
      )
    })
  },
  /** @param {number} [timeout] */
  removeVideo: function (timeout) {
    if (!location.hash || !location.hash.match(/^#DM\:/)) {
      return Promise.resolve()
    }
    return DOMReady().then(function () {
      var video = document.querySelector('video')
      video.removeAttribute('autoplay')
      video.setAttribute('preload', 'none')
      video.pause(0)
      video.src = ''
      video.parentNode.removeChild(video)
      return video
    })
  },
  sendMessage: function (message) {
    this.logger.debug(time(), 'iframe sending.. ', message)
    if (window.parent) {
      this.logger.debug(time(), 'iframe send window', window.parent)
      window.parent.postMessage(message, '*')
    }
  },
  onProgress: function (loaded, total, dt) {
    var data = dt || this.getData()
    this.sendMessage(Object.assign(data, {
      event: 'progress',
      loaded: loaded,
      total: total,
    }))
  },
  /**
   * @return {{
     url: string;
     name: string;
     filename: string;
     videoId: string;
     ext: string;
     event: string;
   }}
   */
  getData: function () {
    if (this._data) {
      return Object.assign({}, this._data)
    }
    if (location.hash && location.hash.match(/^#DM\:/)) {
      this._data = JSON.parse(decodeURIComponent(location.hash.slice(4)))
      location.hash = '';
      this._data.url = location.href
      return Object.assign({}, this._data)
    }
  },
}

module.exports = iframeController

 }),
/* 10 */
 (function(module, exports, __webpack_require__) {

var Logger = __webpack_require__(0)
var time = __webpack_require__(1)
var smartSize = __webpack_require__(21)
__webpack_require__(22)

/**
 * @typedef {{
   id?: string | number;
   visible?: boolean;
   title: string;
   onDownload?: (onProgress?: (loaded: number, total: number) => void) => void;
   getSize?: () => void;
   getUrl?: () => void;
   videoId?: number;
   filename?: string;
   filesize?: number | string;
   fileurl?: string;
   progress?: number;
   disabled?: boolean;
   icon?: { width?: number; height?: number; color?: string };
 }} IMainViewProps
 */

var baseView = {
  logger: new Logger(),
  /** @param {IMainViewProps} props */
  create: function (props) {
    /** @type {IMainViewProps} */
    this.props = props
    this._createDOM()
    this.onDownload = this.onDownload.bind(this)
    this.onClose = this.onClose.bind(this)
    this.getSize = this.getSize.bind(this)
    this.getUrl = this.getUrl.bind(this)
    this.getId = this.getId.bind(this)
    this.init = this.init.bind(this)
    document.body.insertBefore(this._root, document.body.firstElementChild)
    this.render()
    
    this.init()
  },
  init: function () {
    var _this = this
    this.getId()
    return this.getUrl().then(function () {
      return _this.getSize()
    })
  },
  _createDOM: function () {
    var div = document.createElement('div')
    this.id = this.props.id || ('vdm-' + Math.floor(Math.random() * 1e5))
    div.innerHTML = [
    '<div id="' + this.id + '" class="vdm-root">',
      '<div class="vdm-container">',
        '<div class="vdm-header">',
          '<span class="vdm-title">',
            (this.props.title || ''),
          '</span>',
          '<div class="vdm-close-btn">',
            '<div></div>',
          '</div>',
        '</div>',
        '<div class="vdm-content">',
          '<div class="vdm-item vdm-filename">',
            '<span>Название: <span>{filename}</span></span>',
          '</div>',
          '<div class="vdm-item vdm-filesize">',
            '<span>Размер: <span>{filesize}</span></span>',
          '</div>',
          '<div class="vdm-item vdm-fileurl">',
            '<span>',
              '<input type="checkbox" style="display:none" id="video_href" ></input>',
              '<span>',
                '<label class="show_link" for="video_href">Показать ссылку</label>',
                '<label class="video_link" for="video_href">Ссылка: </label>',
                '<a target="_blank">{fileurl}</a>',
              '</span>',
            '</span>',
          '</div>',
          '<div class="vdm-controllers">',
            '<div class="vdm-progress">',
            '</div>',
            '<div class="vdm-button vdm-download">',
              '<span>Скачать</span>',
            '</div>',
          '</div>',
        '</div>',
      '</div>',
    '</div>'].join('');
    
    this._root = div.firstElementChild
    return this._root
  },
  onDownload: function (e) {
    var logger = this.logger
    if (this.props.onDownload && !this.props.disabled && !this.props.isFetching) {
      this.update({ isFetching: true })
      var _this = this
      logger.debug(time(), 'downloading..')
      return this.props.onDownload(function onProgress(loaded, total) {
        _this.update({ progress: loaded / total })
      }).then(function () {
        _this.update({ isFetching: false, progress: 0 })
        logger.debug(time(), 'download complete')
        return true
      })
    }
    return Promise.resolve()
  },
  getSize: function () {
    var logger = this.logger
    if (this.props.getSize && !this.props.isFetching) {
      this.update({ isFetching: true })
      var _this = this
      return this.props.getSize().then(function (size) {
        logger.debug(time(), 'size: ', size)
        var filesize = smartSize(size)
        logger.info(time(), 'filesize: ', filesize)
        _this.update({ filesize: filesize, isFetching: false })
        return size
      })
    }
    return Promise.resolve()
  },
  getUrl: function () {
    var logger = this.logger;
    if (this.props.getUrl && !this.props.isFetching) {
      var _this = this
      this.update({ isFetching: true })
      return this.props.getUrl().then(function (fileurl) {
        logger.info(time(), 'fileurl: ', fileurl)
        _this.update({ fileurl: fileurl, isFetching: false })
        return fileurl
      })
    }
    return Promise.resolve()
  },
  getId: function () {
    var videoId = this.props.getId()
    this.update({ videoId: videoId, visible: Boolean(videoId) && this.props.visible })
  },
  onClose: function (e) {
    if (this.props.onClose) {
      this.props.onClose()
    }
    this.update({ visible: false })
  },
  loadingImage: function () {
    var icon = this.props.icon
    return `<svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xmlns:svgjs="http://svgjs.com/svgjs"
      width="${icon && icon.width || '512'}"
      height="${icon && icon.height || '512'}"
      x="0"
      y="0"
      viewBox="0 0 16 16"
      style="enable-background:new 0 0 512 512"
      xml:space="preserve"
      class="loading"
    >
      <g>
        <path
          xmlns="http://www.w3.org/2000/svg"
          fill="${icon && icon.color || '#ffffff'}"
          d="M9.9 0.2l-0.2 1c3 0.8 5.3 3.5 5.3 6.8 0 3.9-3.1 7-7 7s-7-3.1-7-7c0-3.3 2.3-6 5.3-6.8l-0.2-1c-3.5 0.9-6.1 4.1-6.1 7.8 0 4.4 3.6 8 8 8s8-3.6 8-8c0-3.7-2.6-6.9-6.1-7.8z"
          style=""
          class=""
        >
        </path>
      </g>
    </svg>`;
  },
  render: function () {
    var visible = this.props.visible
    var root = this._root = this._root || this._createDOM()
    root.style.visibility = visible ? 'initial' : 'hidden'
    root.querySelector('.vdm-title').innerHTML = this.props.title
    if (this.props.filename) {
      root.querySelector('.vdm-filename span span').innerHTML = this.props.filename
    }
    if (this.props.filesize) {
      root.querySelector('.vdm-filesize span span').innerHTML = this.props.filesize
    }
    var link = root.querySelector('.vdm-fileurl span a')
    link.href = this.props.fileurl || '#'
    if (this.props.fileurl) {
      link.innerHTML = this.props.fileurl
    }
    root.querySelector('.vdm-close-btn').addEventListener('click', this.onClose)
    root.querySelector('.vdm-download').addEventListener('click', this.onDownload)
    if (!this.props.isFetching) {
      root.querySelector('.vdm-download').innerHTML = '<span>Скачать</span>'
    } else if (!root.querySelector('.vdm-download .loading')) {
      root.querySelector('.vdm-download').innerHTML = this.loadingImage()
    }
    if (!this.props.progress) {
      root.querySelector('.vdm-progress').style.display = 'none'
    } else {
      var progress = root.querySelector('.vdm-progress')
      progress.style.display = ''
      progress.style.width = Math.floor(this.props.progress * 100) + '%';
    }
    return root
  },
  /** @param {IMainViewProps} props */
  update: function (props) {
    this.props = Object.assign(this.props, props)
    this.render()
  },
}

module.exports = baseView

 }),
/* 11 */
 (function(module, exports) {

/**
 * @param {string} url
 * @return {string}
 */
function getExtension(url) {
  var link = document.createElement('a')
  link.href = url
  var match = link.pathname.match(/\.([^.]+)$/)
  return match ? match[1] : '';
}

module.exports = getExtension

 }),
/* 12 */
 (function(module, exports) {

module.exports = {}

 }),
/* 13 */
 (function(module, exports, __webpack_require__) {

var URLParse = __webpack_require__(5)
var makeRequest = __webpack_require__(2)
var delay = __webpack_require__(3)
var time = __webpack_require__(1)
var Logger = __webpack_require__(0)
var iframeChannel = __webpack_require__(6)
var eventEmitter = __webpack_require__(8)
var info = __webpack_require__(7)

/**
 * @typedef {{
    url: string;
    videoId: string;
    name?: string;
    filename?: string;
    size?: number;
    ext?: string;
    saveAs?: boolean;
    headers?: { [x: string]: string };
    onProgress?: (loaded: number, total: number) => void;
 * }} IDownloadDetails
 * @typedef {{
    url: string;
    name: string;
    filename: string;
    videoId: string;
    ext: string;
    event: string;
 * }} IVideoData
 */

var downloadManager = {
  __DEBUG__: false,
  logger: new Logger(),
  /**
   * @param {IDownloadDetails} details
   * @return {Promise<IVideoData>}
   */
  download: function (details) {
    var _this = this
    var logger = this.logger
    
    if (details.debug) {
      return this.DEBUG_download(details)
    }
    var promise = Promise.reject()
    if (
      (
        (typeof GM !== 'undefined' && typeof GM.download !== 'undefined')
        || typeof GM_download !== 'undefined'
      )
      && info.script_handler.toLowerCase() !== 'violentmonkey'
    ) {
      promise = this.GM_download(details)
    }
    return promise.catch(function (e) {
      if (e) {
        logger.error(time(), 'GM_download error: ', e)
      }
      var link = URLParse(details.url)
      if (location.origin === link.origin) {
        return _this.URL_download(details)
      }
      var p = Promise.reject()
      if (
        (
          (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest !== 'undefined')
          || typeof GM_xmlhttpRequest !== 'undefined'
        ) && (typeof details.size === 'undefined' || details.size < (16 * 1024 * 1024))
      ) {
        p = _this.XHR_download(details)
      }
      return p.catch(function (e) {
        if (e) {
          logger.error(time(), 'XHR_download error: ', e)
        }
        return _this.IFrame_download(details)
      })
    }).then(function (response) {
      logger.info(time(), 'downloaded', details.url)
      return response
    }).catch(function (e) {
      logger.error(time(), 'failed to download', details.url, e)
    })
  },
  /**
   * @param {IDownloadDetails} details
   * @return {IVideoData}
   */
  getData: function (details) {
    var link = URLParse(details.url)
    return {
      url: link.href,
      name: details.name,
      filename: details.filename,
      videoId: details.videoId,
      ext: details.ext,
      event: 'download',
    }
  },
  /**
   * @param {IDownloadDetails} details
   * @return {Promise<IVideoData>}
   */
  GM_download: function (details) {
    var logger = this.logger
    logger.info(time(), 'GM_download', details.url)
    
    var data = this.getData(details)
    var resolve
    var reject
    var promise = new Promise(function (res, rej) {
      resolve = res
      reject = rej
    })
    GM_download({
      url: details.url,
      name: details.filename,
      saveAs: Boolean(details.saveAs),
      onerror: function (r) {
        reject(r)
      },
      onload: function () {
        resolve(data)
      },
      onprogress: function (e) {
        if (details.onProgress) {
          details.onProgress(e.loaded, e.total)
        }
      },
      ontimeout: function () {
        reject({ error: 'timeout' })
      },
    })
    return promise
  },
  /**
   * @param {IDownloadDetails} details
   * @return {Promise<IVideoData>}
   */
  XHR_download: function (details) {
    var logger = this.logger
    logger.info(time(), 'XHR_download', details.url)
    
    var data = this.getData(details)
    var _this = this
    return makeRequest({
      method: 'GET',
      url: data.url,
      headers: details.headers,
      responseType: 'blob',
      onprogress: details.onProgress,
    }, true).then(function (response) {
      if (!response.ok) {
        return Promise.reject(response)
      }
      var URL = window.URL || window.webkitURL
      var resource = URL.createObjectURL(response.data);
      return _this.URL_download(
        Object.assign({}, details, { url: resource })
      ).then(function () {
        URL.revokeObjectURL(resource)
      })
    }).then(function () {
      return data;
    })
  },
  /**
   * @param {IDownloadDetails} details
   * @return {Promise<IVideoData>}
   */
  IFrame_download: function (details) {
    var logger = this.logger
    logger.info(time(), 'IFrame_download', details.url)
    
    var data = this.getData(details)
    var onProgress = details.onProgress
    
    var progressEvent = iframeChannel.getEventName(
      Object.assign({}, data, { event: 'progress' })
    );
    eventEmitter.on(progressEvent, function (e) {
      onProgress && onProgress(e.loaded, e.total)
    })
    
    var promise = iframeChannel.request(
      Object.assign(
        {},
        data,
        {
          event: 'download',
        },
      )
    ).then(function (response) {
      eventEmitter.off(progressEvent)
      return response;
    });
    
    return promise
  },
  /**
   * @param {IDownloadDetails} details
   * @return {Promise<IVideoData>}
   */
  URL_download: function (details) {
    var logger = this.logger
    logger.info(time(), 'URL_download', details.url)
    
    var data = this.getData(details)
    var link = URLParse(data.url)
    link.download = data.filename || ('video' + details.videoId + '.mp4')
    link.innerHTML = data.filename
    document.body.appendChild(link)
    link.click()
    return delay(300).then(function () {
      document.body.removeChild(link)
      return data
    })
  },
  DEBUG_download: function (details) {
    var logger = this.logger
    logger.info(time(), 'DEBUG_download', details.url)
    
    var data = this.getData(details)
    return new Promise(function (resolve) {
      var _onProgress = details.onProgress || function (){}
      var total = 200 * 1024 * 1024
      var size = Math.floor(5000 / 300)
      var step = 1 / size
      var _progress = 0
      var interval = setInterval(function () {
        _progress += step
        _onProgress(_progress * total, total)
      }, 300)
      setTimeout(function () {
        _onProgress(total, total)
        clearInterval(interval)
        resolve(data)
      }, 5000)
    })
  },
}

module.exports = downloadManager

 }),
/* 14 */
 (function(module, exports, __webpack_require__) {

var DOMReady = __webpack_require__(4)
var Logger = __webpack_require__(0)

var iframeController = __webpack_require__(9)
var iframeChannel = __webpack_require__(6)
var sibnetView = __webpack_require__(20)
var myviView = __webpack_require__(24)
var time = __webpack_require__(1)
var info = __webpack_require__(7)

var logger = new Logger()

function app() {
	if(/^(cv|dv|fs)[a-z\d]+\.(sibnet|myvi)\.(ru|tv)/.test(location.hostname)) {
    logger.debug(time(), '(iframe)', location.href)
    return Promise.resolve().then(function () {
      return iframeController.start()
    })
  } else {
    logger.info(time(), info.script_name, info.script_version, '(c) ' + info.script_author)
    logger.debug(time(), '(top)', location.href)
    iframeChannel.init()
    return DOMReady(function () {
      if (location.origin.indexOf('sibnet') > -1) {
        sibnetView()
      } else {
        myviView()
      }
    })
  }
  return Promise.reject()
}

app().catch(function (e) {
  logger.error(time(), 'error', e)
})

module.exports = app


 }),
/* 15 */
 (function(module, exports) {

function EventEmitter() {
  this._listenerMap = {}
}
/**
 * @param {string} event
 * @param {(...args: any[]) => void} callback
 */
EventEmitter.prototype.addListener = function addListener(event, callback) {
  var listeners = this._listenerMap[event] 
  listeners = Array.isArray(listeners) ? listeners : []
  var index = listeners.indexOf(callback)
  if (index === -1) {
    listeners.push(callback)
  }
  this._listenerMap[event] = listeners
}

/**
 * @param {string} [event]
 * @param {(...args: any[]) => void} [callback]
 */
EventEmitter.prototype.removeListener = function removeListener(event, callback) {
  if (!event) {
    var events = Object.keys(this._listenerMap)
    for (var ev of events) {
      this._listenerMap[ev].length = 0
      delete this._listenerMap[ev]
    }
    return
  }
  if (!callback && Array.isArray(this._listenerMap[event])) {
    this._listenerMap[event].length = 0
    delete this._listenerMap[event]
    return
  }
  if (Array.isArray(this._listenerMap[event])) {
    var index = this._listenerMap[event].indexOf(callback)
    if (index !== -1) {
      this._listenerMap[event].splice(index, 1)
    }
    if (!this._listenerMap[event].length) {
      delete this._listenerMap[event]
    }
  }
}

/**
 * @param {string} event
 */
EventEmitter.prototype.emit = function emit(event) {
  var listeners = this._listenerMap[event]
  if (Array.isArray(listeners) && listeners.length) {
    var args = Array.prototype.slice.call(arguments, 1)
    for (var callback of listeners) {
      callback.apply(null, args)
    }
  }
}

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

/**
 * @param {string} event
 * @param {(...args: any[]) => void} callback
 */
EventEmitter.prototype.once = function once(event, callback) {
  var _this = this
  var listener = function () {
    callback.apply(null, arguments)
    _this.off(event, listener)
  }
  this.on(event, listener)
}

module.exports = EventEmitter

 }),
/* 16 */
 (function(module, exports, __webpack_require__) {

var makeRequest = __webpack_require__(2)
var delay = __webpack_require__(3)
var Logger = __webpack_require__(0)
var time = __webpack_require__(1)

var logger = new Logger()

/**
 * @param {any} resource
 * @param {string} [name]
 * @param {(loaded: number, total: number) => void} [onprogress]
 */
function downloadFile(source, name, onprogress) {
  var link = document.createElement('a')
  link.href = source
  if (link.origin === location.origin) {
    link.download = name || 'download'
    link.innerHTML = name || 'download'
    document.body.appendChild(link)
    link.click()
    logger.info(time(), 'downloadFile URL_download', link.href)
    return delay(300).then(function () {
      onprogress && onprogress(1, 1)
    })
  }
  logger.info(time(), 'downloadFile XHR_download', link.href)
  return makeRequest({
    method: 'GET',
    url: link.href,
    responseType: 'blob',
    onprogress: onprogress,
  }, true).then(function (response) {
    if (!response.ok) {
      return response
    }
    var URL = window.URL || window.webkitURL
    var resource = URL.createObjectURL(response.data);
    return downloadFile(resource, name).then(function () {
      URL.revokeObjectURL(resource)
      return response
    })
  })
}

module.exports = downloadFile

 }),
/* 17 */
 (function(module, exports) {

/**
 * @param {string} headersString
 * @return {{ [x: string]: string }}
 */
function parseAJAXHeaders(headersString) {
  if (typeof headersString !== 'string') {
    return headersString
  }
  return headersString.split(/\r?\n/g)
    .map(function (s) { return s.trim() })
    .filter(Boolean)
    .reduce(function (acc, cur) {
      var res = cur.split(':')
      var key, val
      if (res[0]) {
        key = res[0].trim().toLowerCase()
        val = res.slice(1).join('').trim()
        acc[key] = val
      }
      return acc
    }, {})
}

module.exports = parseAJAXHeaders

 }),
/* 18 */
 (function(module, exports, __webpack_require__) {

var createDocument = __webpack_require__(19)

/**
 * @param {string} responseText
 * @param {{ [x: string]: string }} headers
 * @param {string} [responseType]
 */
function parseAJAXResponse(responseText, headers, responseType) {
  var isText = !responseType || responseType.toLowerCase() === 'text'
  var contentType = headers['content-type']
  if (
    isText
    && contentType.indexOf('application/json') > -1
  ) {
    return JSON.parse(responseText)
  }
  if (
    isText &&
    (
      contentType.indexOf('text/html') > -1
      || contentType.indexOf('text/xml') > -1
    )
  ) {
    return createDocument(responseText)
  }
  return responseText
}

module.exports = parseAJAXResponse

 }),
/* 19 */
 (function(module, exports) {

/**
 * @param {string} text
 * @param {string} [title]
 * @return {Document}
 */
function createDocument(text, title) {
  title = title || ''
  var doc = document.implementation.createHTMLDocument(title);
	doc.documentElement.innerHTML = text
  return doc
}

module.exports = createDocument

 }),
/* 20 */
 (function(module, exports, __webpack_require__) {

var DOMReady = __webpack_require__(4)
var Logger = __webpack_require__(0)

var baseView = __webpack_require__(10)
var sibnetController = __webpack_require__(23)
var iframeController = __webpack_require__(9)
var time = __webpack_require__(1)
var info = __webpack_require__(7)

function sibnetView() {
  sibnetController.logger.info(time(), 'name:', sibnetController.getVideoName())
  baseView.create({
    title: info.script_name + ' ' + info.script_version,
    filename: sibnetController.getVideoName(),
    visible: true,
    icon: { width: 20, height: 20, color: '#ffffff' },
    onDownload: function (onProgress) {
      return sibnetController.downloadVideoFile(onProgress)
    },
    getId: function () {
      return sibnetController.getVideoId()
    },
    getUrl: function () {
      return sibnetController.getVideoUrl()
    },
    getSize: function () {
      return sibnetController.getVideoSize()
    },
  })
  return baseView
}

module.exports = sibnetView


 }),
/* 21 */
 (function(module, exports) {

/**
 * @param {number} size
 * @return {string}
 */
function smartSize(size) {
  var rest = size
  var mib = Math.floor(rest / (1024 * 1024))
  rest -= mib * 1024 * 1024
  var kib = Math.floor(rest / 1024)
  rest -= kib * 1024
  var bytes = rest
  var filesize;
  if (mib) {
    filesize = (size / (1024 * 1024)).toFixed(1) + ' MiB'
  } else if (kib) {
    filesize = (size / 1024).toFixed(1) + ' KiB'
  } else if (bytes) {
    filesize = bytes + ' bytes'
  } else {
    filesize = 'unknown'
  }
  return filesize
}

module.exports = smartSize

 }),
/* 22 */
 (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

 }),
/* 23 */
 (function(module, exports, __webpack_require__) {

var Logger = __webpack_require__(0)
var URLParse = __webpack_require__(5)
var makeRequest = __webpack_require__(2)
var getExtension = __webpack_require__(11)
var VIDEOS = __webpack_require__(12)
var delay = __webpack_require__(3)
var time = __webpack_require__(1)
var downloadManager = __webpack_require__(13)
var iframeChannel = __webpack_require__(6)

var sibnetVideoController = {
  logger: new Logger(),
  document: document,
  location: location,
  /**
   * @param {(size: number) => void} [onLoad]
   */
  getVideoSize: function (onLoad) {
    var videoId = this.getVideoId()
    var logger = this.logger
    
    logger.debug(time(), 'getVideoSize..', videoId)
    if (VIDEOS[videoId] && VIDEOS[videoId].size) {
      logger.debug(time(), 'getVideoSize', VIDEOS[videoId].size)
      return Promise.resolve(VIDEOS[videoId].size)
    }
    var self = this
    return this.getVideoUrl().then(function (url) {
      if (VIDEOS[videoId] && VIDEOS[videoId].size) {
        var size = VIDEOS[videoId].size
        logger.debug(time(), 'getVideoSize', size)
        onLoad && onLoad(size)
        return size;
      }
      return makeRequest({
        method: 'HEAD',
        url: url,
        headers: {
          referer: self.location.href,
          range: 'bytes=0-10',
        },
      }, true).then(function (response) {
        if (response.ok) {
          return response
        }
        return iframeChannel.request({
          event: 'size',
          videoId: videoId,
          url: url,
        })
      }).then(function (response) {
        var size = 0
        var contentRange = response.headers['content-range']
        if (contentRange) {
          size = parseInt(contentRange.split('/')[1], 10)
        }
        VIDEOS[videoId].size = size
        logger.debug(time(), 'getVideoSize', size)
        onLoad && onLoad(size)
        return size
      })
    }).catch(function (e) {
      logger.error(time(), 'getVideoSize error: ', e)
      return 0
    })
  },
  /**
   * @return {Promise<string>}
   */
  getVideoUrl: function () {
    var videoId = this.getVideoId()
    var logger = this.logger
    
    logger.debug(time(), 'getVideoUrl..', videoId)
    
    var finalUrl = VIDEOS[videoId] && VIDEOS[videoId].finalUrl
    if (finalUrl) {
      logger.debug(time(), 'getVideoUrl', finalUrl)
      return Promise.resolve(finalUrl)
    }
    var url = this.getVideoPath()
    return makeRequest({
      method: 'HEAD',
      url: url,
      headers: {
        range: 'bytes=0-',
        referer: this.location.href,
      },
    }, true).then(function (response) {
      if (response.ok) {
        return response
      }
      return iframeChannel.request({
        event: 'url',
        videoId: videoId,
        url: url,
      })
    }).then(function (response) {
      VIDEOS[videoId].finalUrl = response.finalUrl
      var contentRange = response.headers['content-range']
      var contentLength = response.headers['content-length']
      if (contentRange) {
        VIDEOS[videoId].size = parseInt(contentRange.split('/')[1], 10)
      } else if (contentLength) {
        VIDEOS[videoId].size = parseInt(contentLength, 10)
      }
      logger.debug(time(), 'getVideoUrl', response.finalUrl)
      return response.finalUrl
    }).catch(function (e) {
      logger.error(time(), 'getVideoUrl error: ', e)
      return url;
    })
  },
  /**
   * @param {(loaded: number, total: number) => void} [onProgress]
   */
  downloadVideoFile: function (onProgress) {
    var logger = this.logger
    var _this = this
    
    logger.debug(time(), 'downloadVideoFile...')
    return this.getVideoUrl().then(function (url) {
      if (!url) {
        logger.error(time(), 'downloadVideoFile', new Error('video url not found, url = ' + url))
        return
      }
      var ext = getExtension(url)
      if (!ext) {
        logger.warn(time(), 'downloadVideoFile: can not get extension from url = ', url)
        logger.warn(time(), 'downloadVideoFile: mp4 will be used as defualt extension')
      
        ext = 'mp4'
      }
      var name = _this.getVideoName()
      var filename = name + '.' + ext
    
      var videoId = _this.getVideoId()
      var data = {
        url: url,
        name: name,
        filename: filename,
        ext: ext,
        size: VIDEOS[videoId].size,
        videoId: videoId,
        event: 'download',
      }
      return downloadManager.download(
        Object.assign(
          {},
          data,
          {
            onProgress: onProgress,
            headers: {
              referer: _this.location.href,
              range: 'bytes=0-',
            },
            saveAs: false,
          },
          {
            debug: Boolean(downloadManager.__DEBUG__),
          },
        )
      );
    }).catch(function (e) {
      logger.error(time(), 'downloadVideoFile error: ', e)
    })
  },
  /** @return {string | undefined} */
  getVideoPath: function () {
    var document = this.document
    var logger = this.logger
    
    var videoId = this.getVideoId()
    VIDEOS[videoId] = VIDEOS[videoId] || {}
    if (VIDEOS[videoId].url) {
      return VIDEOS[videoId].url
    }
    var video = document.querySelector('video')
    if (video && video.src) {
      var link = URLParse(video.src)
      if (link.pathname.match(/\.mp4$/)) {
        VIDEOS[videoId].url = link.href
        return link.href
      }
    }
    // backward compatibility
    video = document.querySelector('#video')
    var html = video ? video.innerHTML : document.body.innerHTML
    html = html.split(/player\.src\(\s?\[\s?\{\s?src\s?\:\s?\"/)[1];
    var match = html ? html.match(/(\/v\/.*\.(mpd|mp4))/) : null
    if(html && match) {
      var link = URLParse(match[0])
      VIDEOS[videoId].url = link.href
      return link.href
    }
    logger.error(time(), 'url not found')
  },
  /** @return {string | undefined} */
  getVideoId: function () {
    var link = URLParse(this.location.href)
    var match = link.href.match(/video(id\s?\=\s?|)(\d+)/)
    var videoId = match ? match[2] : null
    if (videoId && !VIDEOS[videoId]) {
      VIDEOS[videoId] = { videoId: videoId }
    }
    return videoId
  },
  /** @return {string} */
  getVideoName: function () {
    var document = this.document
    var logger = this.logger
    
    var meta = document.querySelector('meta[property="og:title"]')
    var title = meta && meta.getAttribute('content')
    if (title) {
      return title
    }
    var h1 = document.querySelector('td.video_name > h1')
    var name = h1 && h1.innerHTML.replace(/\.mp4$/, '')
    if (name) {
      title = name + '_' + this.getVideoId()
      return title
    }
    title = 'sibnet_video_' + this.getVideoId()
    return title
  },
  updateVideoId: function (videoId, isForce) {
    this.logger.debug(time(), 'updateVideoId..', { videoId: videoId, isForce: isForce })
    if (videoId !== this.getVideoId()) {
      var pageUrl = 'https://video.sibnet.ru/shell.php?videoid=' + videoId
      var link = URLParse(pageUrl)
      var useGM = link.origin !== location.origin
      var _this = this
      return makeRequest({
        url: pageUrl,
        headers: {
          referer: pageUrl,
        },
      }, useGM).then(function (response) {
        if (response.ok) {
          _this.document = response.data
          _this.location = link
        }
        return response.ok
      })
    }
    return Promise.resolve()
  },
  clone: function () {
    return Object.assign({}, this)
  },
  /** @param {Logger} logger */
  setLogger: function (logger) {
    this.logger = logger
  },
  /** @param {HTMLDocument} document */
  setDocument: function(document) {
    this.document = document
  },
  /** @param {any} location */
  setLocation: function(location) {
    this.location = location;
  },
}

module.exports = sibnetVideoController

 }),
/* 24 */
 (function(module, exports, __webpack_require__) {

var DOMReady = __webpack_require__(4)
var Logger = __webpack_require__(0)

var baseView = __webpack_require__(10)
var myviController = __webpack_require__(25)
var iframeController = __webpack_require__(9)
var time = __webpack_require__(1)
var info = __webpack_require__(7)

function myviView() {
  myviController.logger.info(time(), 'name:', myviController.getVideoName())
  baseView.create({
    title: info.script_name + ' ' + info.script_version,
    filename: myviController.getVideoName(),
    visible: true,
    icon: { width: 20, height: 20, color: '#ffffff' },
    onDownload: function (onProgress) {
      return myviController.downloadVideoFile(onProgress)
    },
    getId: function () {
      return myviController.getVideoId()
    },
    getUrl: function () {
      return myviController.getVideoUrl()
    },
    getSize: function () {
      return myviController.getVideoSize()
    },
  })
  return baseView
}

module.exports = myviView


 }),
/* 25 */
 (function(module, exports, __webpack_require__) {

var Logger = __webpack_require__(0)
var URLParse = __webpack_require__(5)
var makeRequest = __webpack_require__(2)
var getExtension = __webpack_require__(11)
var VIDEOS = __webpack_require__(12)
var delay = __webpack_require__(3)
var time = __webpack_require__(1)
var downloadManager = __webpack_require__(13)
var iframeChannel = __webpack_require__(6)

var myviVideoController = {
  logger: new Logger(),
  document: document,
  location: location,
  /**
   * @param {(size: number) => void} [onLoad]
   */
  getVideoSize: function (onLoad) {
    var videoId = this.getVideoId()
    var logger = this.logger
    
    if (VIDEOS[videoId] && VIDEOS[videoId].size) {
      return Promise.resolve(VIDEOS[videoId].size)
    }
    var self = this
    logger.debug(time(), 'getVideoSize..', videoId)
    return this.getVideoUrl().then(function (url) {
      if (VIDEOS[videoId] && VIDEOS[videoId].size) {
        var size = VIDEOS[videoId].size
        onLoad && onLoad(size)
        return size;
      }
      return makeRequest({
        method: 'GET',
        url: url,
        headers: {
          referer: self.location.origin,
          range: 'bytes=0-10',
        },
      }, true).then(function (response) {
        if (response.ok) {
          return response
        }
        return iframeChannel.request({
          event: 'size',
          url: url,
          videoId: videoId,
        })
      }).then(function (response) {
        var contentRange = response.headers['content-range']
        var size = 0
        if (contentRange && response.ok) {
          size = parseInt(contentRange.split('/')[1], 10)
        }
        VIDEOS[videoId].size = size
        logger.debug(time(), 'getVideoSize', size)
        onLoad && onLoad(size)
        return size
      })
    }).catch(function (e) {
      logger.error(time(), 'getVideoSize error: ', e)
      return 0
    })
  },
  /**
   * @return {Promise<string>}
   */
  getVideoUrl: function () {
    var videoId = this.getVideoId()
    var logger = this.logger
    
    logger.debug(time(), 'getVideoUrl..', videoId)
    
    var finalUrl = VIDEOS[videoId] && VIDEOS[videoId].finalUrl
    if (finalUrl) {
      logger.debug(time(), 'getVideoUrl', finalUrl)
      return Promise.resolve(finalUrl)
    }
    var url = this.getVideoPath()
    var promise = Promise.resolve()
    var _this = this
    if (!url) {
      return _this.updateVideoId(videoId, true).then(function (ok) {
        if (ok) {
          return _this.getVideoUrl()
        }
        logger.error(time(), 'getVideoUrl failed')
      })
    }
    return makeRequest({
      method: 'GET',
      url: url,
      headers: {
        range: 'bytes=0-10',
        referer: location.origin,
      },
    }, true).then(function (response) {
      if (response.ok) {
        return response
      }
      return iframeChannel.request({
        event: 'url',
        videoId: videoId,
        url: url,
      })
    }).then(function (response) {
      VIDEOS[videoId].finalUrl = response.finalUrl
      var contentRange = response.headers['content-range']
      if (contentRange) {
        VIDEOS[videoId].size = parseInt(contentRange.split('/')[1], 10)
      }
      logger.debug(time(), 'getVideoUrl', response.finalUrl)
      return response.finalUrl
    }).catch(function (e) {
      logger.error(time(), 'getVideoUrl error: ', e)
      return url
    })
  },
  /**
   * @param {(loaded: number, total: number) => void} [onProgress]
   */
  downloadVideoFile: function (onProgress) {
    var logger = this.logger
    var _this = this
    
    logger.info(time(), 'downloadVideoFile...')
    return this.getVideoUrl().then(function (url) {
      if (!url) {
        logger.error(time(), 'downloadVideoFile', new Error('video url not found, url = ' + url))
        return
      }
      var ext = getExtension(url)
      if (!ext) {
        logger.warn(time(), 'downloadVideoFile: can not get extension from url = ', url)
        logger.warn(time(), 'downloadVideoFile: mp4 will be used as defualt extension')
      
        ext = 'mp4'
      }
      var name = _this.getVideoName()
      var filename = name + '.' + ext
    
      var videoId = _this.getVideoId()
      var data = {
        url: url,
        name: name,
        filename: filename,
        ext: ext,
        size: VIDEOS[videoId].size,
        videoId: videoId,
        event: 'download',
      }
      
      return downloadManager.download(
        Object.assign(
          {},
          data,
          {
            onProgress: onProgress,
            headers: {
              referer: _this.location.href,
              range: 'bytes=0-',
            },
            saveAs: false,
          },
          {
            debug: Boolean(downloadManager.__DEBUG__),
          },
        )
      );
    }).catch(function (e) {
      logger.error(time(), 'downloadVideoFile error: ', e)
    })
  },
  /** @return {string | undefined} */
  getVideoPath: function () {
    var document = this.document
    var logger = this.logger
    
    var videoId = this.getVideoId()
    VIDEOS[videoId] = VIDEOS[videoId] || {}
    if (VIDEOS[videoId].url) {
      return VIDEOS[videoId].url
    }
    var scripts = Array.prototype.slice.call(document.querySelectorAll('script'))
    var textarea = document.createElement('textarea')
    var html, match, urlencoded,
      regex = /PlayerLoader\.CreatePlayer\s?\(\s?(?:\"|\')([^"']+)/i
    for (var script of scripts) {
      html = script.innerHTML
      if (!html) {
        continue
      }
      textarea.innerHTML = html
      match = textarea.value.match(regex)
      if (match) {
        urlencoded = match[1]
        break
      }
    }
    if (urlencoded) {
      var obj = urlencoded.split(/\u0026/g).reduce(function (acc, cur){
        var arr = cur.split('=')
        var key = arr[0], val = arr[1]
        if (key) {
          acc[key] = val
        }
        return acc
      }, {})
      var v = decodeURIComponent(obj.v)
      v = v.split(/\\u0026/g)[0]
      var link = URLParse(v)
      VIDEOS[videoId].url = link.href
      return link.href
    }
    
    var video = document.querySelector('video')
    if (video && video.src) {
      var link = URLParse(video.src)
      if (link.pathname.match(/\.mp4$/)) {
        VIDEOS[videoId].url = link.href
        return link.href
      }
    }
    logger.error(time(), 'url not found')
  },
  /** @return {string | undefined} */
  getVideoId: function () {
    var link = URLParse(this.location.href)
    var match = link.pathname.match(/(?:embed\/(.+))/) || link.search.match(/v\=([^?&#=]+)/)
    var videoId = match ? match[1] : null;
    if (videoId && !VIDEOS[videoId]) {
      VIDEOS[videoId] = { videoId: videoId }
    }
    return videoId
  },
  /** @return {string} */
  getVideoName: function () {
    var document = this.document
    var logger = this.logger
    
    var title = document.querySelector('title')
    if (title) {
      title = title.innerHTML
      return title
    }
    title = 'myvi_video_' + this.getVideoId()
    return title
  },
  clone: function () {
    return Object.assign({}, this)
  },
  /** @param {Logger} logger */
  setLogger: function (logger) {
    this.logger = logger
  },
  /** @param {HTMLDocument} document */
  setDocument: function(document) {
    this.document = document
  },
  /** @param {any} location */
  setLocation: function(location) {
    this.location = location;
  },
  updateVideoId: function (videoId, isForce) {
    this.logger.debug(time(), 'updateVideoId..', { videoId: videoId, isForce: isForce })
    if (videoId !== this.getVideoId() || isForce) {
      var pageUrl = 'https://www.myvi.tv/embed/' + videoId
      var link = URLParse(pageUrl)
      var useGM = link.origin !== location.origin
      var _this = this
      return makeRequest({
        url: pageUrl,
        headers: {
          referer: pageUrl,
        },
      }, useGM).then(function (response) {
        if (response.ok) {
          _this.document = response.data
          _this.location = link
        }
        return response.ok
      })
    }
    return Promise.resolve()
  },
}

module.exports = myviVideoController

 })
 ])));
})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window, window);

(function () {
  const style = `
.vdm-root {
  margin: 0;
  padding: 0;
  background-color: #1e1a1a;
  z-index: 9999;
  bottom: 10px;
  right: 10px;
  border-radius: 5px;
  overflow: hidden;
  min-width: 400px;
  position: fixed;
  color: white;
  font-family: sans-serif;
  font-size: 14px;
  max-width: 600px;
}
.vdm-root span {
  word-break: break-all;
}
.vdm-container {
  display: flex;
  margin: 0;
  padding: 0;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-left: 24px;
  margin-right: 24px;
}

.vdm-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 10px;
}
.vdm-title {
  flex: 1;
  text-align: center;
}
.vdm-close-btn {
  z-index: 12;
  cursor: pointer;
}
.vdm-close-btn div {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.vdm-close-btn,
.vdm-close-btn div,
.vdm-close-btn div:after,
.vdm-close-btn div:before {
  height: 16px;
}
.vdm-close-btn,
.vdm-close-btn div {
  width: 16px;
}
.vdm-close-btn div:after,
.vdm-close-btn div:before {
  content: "";
  position: absolute;
  background: #fff;
  width: 1.5px;
  display: block;
  transform: rotate(45deg);
}
.vdm-close-btn div:before {
  transform: rotate(-45deg);
}
.vdm-controllers {
  width: 100%;
  margin-top: 10px;
}
.vdm-button {
	cursor: pointer;
	background-color: green;
	border-radius: 5px;
  margin: 10px 0;
	text-align: center;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 20px;
}
.vdm-button:active {
  background-color: blue;
}
.vdm-button:hover {
  opacity: 0.95;
}
.vdm-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}
.vdm-filesize {
  margin-top: 5px;
  margin-bottom: 5px;
}
.vdm-item {
  align-self: flex-start;
}
.vdm-item a {
  color: #666;
}
.vdm-item a:hover {
  opacity: 0.8;
}
.vdm-item span label {
  cursor: pointer;
}
.vdm-item label:hover {
  opacity: 0.8;
}
.vdm-item label.show_link {
  color: #666;
}
.vdm-item input[type=checkbox] + span label.show_link,
.vdm-item input[type=checkbox]:checked + span label.video_link,
.vdm-item input[type=checkbox]:checked + span a {
  display: initial;
}

.vdm-item input[type=checkbox]:checked + span label.show_link,
.vdm-item input[type=checkbox] + span label.video_link,
.vdm-item input[type=checkbox] + span a {
  display: none;
}
.vdm-progress {
  height: 10px;
  background-color: #3838ea;
  border-radius: 2px;
}
.vdm-download .loading {
  -webkit-animation: spin 2s linear infinite;
  -moz-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}
.vdm-button > * {
  padding: 10px;
  line-height: 20px;
}
@-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
@-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
@keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }
`;
  if (typeof GM !== 'undefined' && typeof GM.addStyle !== 'undefined') {
    GM.addStyle(style)
  } else {
    var _addStyle = function (textCss) {
      var el = document.createElement('style')
      el.setAttribute('type', 'text/css')
      el.innerHTML = textCss
      return document.head.appendChild(el)
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        _addStyle(style)
      })
    } else {
      _addStyle(style)
    }
  }
})();
