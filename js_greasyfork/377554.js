// ==UserScript==
// @name           Vk Media Downloader dev
// @name:ru        Vk Media Downloader dev
// @namespace      https://greasyfork.org/users/136230
// @version        3.10.0
// @description    Download music, video from vk.com (Vkontakte) without any external service
// @description:ru Скачать музыку, видео с vk.com (ВКонтакте) без использования внешних сервисов
// @author         EisenStein
// @icon           https://www.google.com/s2/favicons?sz=64&domain=vk.com
// @match          *://vk.com/*
// @match          *://vk.ru/*
// @match          *://*.vk.com/*
// @match          *://*.vk.ru/*
// @match          *://*.vk-cdn.com/*
// @match          *://*.vk-cdn.net/*
// @match          *://*.mycdn.me/*
// @match          *://*.userapi.com/*
// @match          *://*.youtube.com/vk_media_downloader*
// @match          *://*.vkuseraudio.net/*
// @match          *://*.vkuseraudio.ru/*
// @match          *://*.vkuservideo.net/*
// @match          *://*.vkuser.net/*
// @match          *://*.pladform.ru/*
// @connect        vk.com
// @connect        vk.ru
// @connect        vk-cdn.com
// @connect        vk-cdn.net
// @connect        userapi.com
// @connect        vkuseraudio.net
// @connect        vkuseraudio.ru
// @connect        vkuservideo.net
// @connect        vkuser.net
// @connect        jsdelivr.net
// @connect        unpkg.com
// @connect        mycdn.me
// @connect        greasyfork.org
// @connect        pladform.ru
// @connect        rutube.ru
// @grant          GM.xmlHttpRequest
// @grant          GM_xmlhttpRequest
// @grant          GM_download
// @grant          GM_info
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant          GM_addValueChangeListener
// @grant          GM_notification
// @grant          GM.setValue
// @grant          GM.getValue
// @grant          GM.deleteValue
// @grant          GM.listValues
// @grant          unsafeWindow
// @grant          GM_registerMenuCommand
// @grant          GM.addValueChangeListener
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require        https://cdn.jsdelivr.net/npm/@e1sen-stein/jquery@0.1/index.min.js
// @require        https://cdn.jsdelivr.net/npm/url-toolkit@2
// @require        https://cdn.jsdelivr.net/npm/hls.js@0.14.16
// @require        https://unpkg.com/@ffmpeg/ffmpeg@0.6.1/dist/ffmpeg.min.js
// @require        https://unpkg.com/localforage@1.9.0/dist/localforage.min.js
// @require        https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js
// @run-at         document-start
// @allFrames      true
// @downloadURL https://update.greasyfork.org/scripts/377554/Vk%20Media%20Downloader%20dev.user.js
// @updateURL https://update.greasyfork.org/scripts/377554/Vk%20Media%20Downloader%20dev.meta.js
// ==/UserScript==

/**
 * > v3.10.0 - 2023.10.20
 *   feat: enable audio downloader on mobile vk
 * > v3.9.0 - 2023.10.16
 *   feat: add audio playlist download button
 *   fix: update sponsor link
 * > v3.8.2 - 2023.10.13
 *   fix: add icon
 * > v3.8.1 - 2023.10.12
 *   fix: settings modal inputs css
 * > v3.8.0 - 2023.10.08
 *   fix: video download button
 *   feat: run script on vk.ru
 *   feat: register menu command
 *   feat: add activity indicator on ffmpeg/zip operations
 * > v3.7.4 - 2022.07.30
 *   fix: logger for tampermonkey beta
 * > v3.7.3 - 2022.03.19
 *   fix: resolve font blurring issue
 * > v3.7.2 - 2022.02.22
 *   feat: add 'hide-audio-meta-data-on-hover' setting
 *   fix: hasClass() method
 * > v3.7.1 - 2022.02.20
 *   fix: require missed function hasClass()
 * > v3.7.0 - 2022.02.19
 *   feat: add apple script (thanks to https://greasyfork.org/ru/users/870190)
 *       1) Copy and paste the text of "apple.script.txt" into Script Editor app.
 *       2) Export as app.
 *       3) Drag the app to the dock for easy drag and drop.
 *       4) Extract downloaded zip and drop the folder on to the app.
 *       The app will export the mp3 and move it into the parent directory of the zip file. It will then move the zip file into the extracted folder and send the folder to the trash.
 *   feat: update file size limits up to 2 GiB. Warning! It's hardly not recommended to run ffmpeg.js on big files.
 *   feat: add metadata to audio row
 *   feat: add new setting option: 'show-audio-meta-data-on-row'
 *   fix: fix promises handling
 * > v3.6.0 - 2022.01.16
 *   feat: display audio track duration
 *   feat: add new options to settings: Misc -> audio-track-duration
 * > v3.5.8 - 2021.08.09
 *   fix: jquery
 * > v3.5.7 - 2021.04.06
 *   fix: hls.js version
 * > v3.5.6 - 2021.04.05
 *   fix: audo size fetching
 * > v3.5.5 - 2021.03.08
 *   fix: video downloader
 * > v3.5.4 - 2021.03.07
 *   fix: jquery 3.3.1 & downloader for qutebrowser
 * > v3.5.3 - 2021.01.19
 *   fix: make workable on FireMonkey
 * > v3.5.2 - 2021.01.17
 *   fix: ffmpeg.js downloader, add cache timeout for audio
 * > v3.5.1 - 2020.11.28
 *   fix: "copy url to clipboard" feature
 * > v3.5.0 - 2020.11.28
 *   feature: add ID3 metadata to audio files (optional, see Settings -> General -> Metadata of audio files)
 * > v3.4.2 - 2020.11.26
 *   fix: sort hls fragments
 * > v3.4.1 - 2020.11.21
 *   try to handle mp3 hack failure
 * > v3.4.0 - 2020.11.14
 *   add hotkey to save last audio url to clipboard
 * > v3.3.4 - 2020.11.01
 *   fix audio url parser
 * > v3.3.3 - 2020.10.27
 *   fix version controller
 * > v3.3.2 - 2020.10.22
 *   make ffmpeg more stable
 * > v3.3.1 - 2020.10.21
 *   fix for Greasemonkey on Pale Moon
 * > v3.3.0 - 2020.10.18
 *   add ffmpeg.js
 * > v3.2.1 - 2020.10.17
 *   fix audio url parser
 * > v3.2.0 - 2020.10.17
 *   add logger settings
 * > v3.1.0 - 2020.10.16
 *   add `Alt+L` hotkey to save log file
 *   shorten debug instructions
 * > v3.0.4 - 2020.10.15
 *   fix ajax response parser
 * > v3.0.3 - 2020.10.14
 *   fix video_box observer
 * > v3.0.2 - 2020.10.12
 *   minor fixes
 * > v3.0.1 - 2020.10.11
 *   fixes for Greasemonkey
 * > v3.0.0 - 2020.10.11
 *   refactor code
 *   fix video observer
 *   new settings options
 *   sync settings between tabs
 *   extended video downloader
 *   custom filename
 *   custom tooltip
 * > v2.3.12 - 2020.07.01
 *   fix encoding
 * > v2.3.11 - 2020.06.22
 *   handle new response format for videos
 * > v2.3.10 - 2020.06.12
 *   handle size request error
 * > v2.3.9 - 2020.06.12
 *   simplify batch scripts
 *   disable addToDomainList method
 * > v2.3.8 - 2020.05.23
 *   fallback to m3u8 downloading if mp3 size does not match m3u8 size
 * > v2.3.7 - 2020.05.13
 *   new hack for mp3 downloading - convert m3u8 link to mp3 link (thanks askornot, https://greasyfork.org/ru/users/320573)
 *   update max duration for hls to 10 hours
 *   update max size for hls to 2 GiB
 *   add new user option "try mp3 from m3u8" - create mp3 link from m3u8 link
 * > v2.3.6 - 2020.04.29
 *   filename for some cases
 * > v2.3.5 - 2020.04.08
 *   add media filename into "filename.txt"
 * > v2.3.4 - 2019.11.25
 *   download audio on audio tooltip click
 * > v2.3.3 - 2019.11.19
 *   fix audio hash extractor
 * > v2.3.2 - 2019.11.17
 *   add support for mobile version of vk.com
 *   fix menu animation
 *   add vkmd button to left side bar
 * > v2.3.1 - 2019.11.03
 *   disable cache for checking updates request
 * > v2.3.0 - 2019.10.30
 *   add Pladform videos downloader
 * > v2.2.5 - 2019.10.29
 *   better style for user settings modal
 * > v2.2.4 - 2019.10.27
 *   add referer header for gm request api
 *   update version checker
 * > v2.2.3 - 2019.10.26
 *   add notifications of new versions
 *   add 'disable noisy notifications' option
 * > v2.2.2 - 2019.10.22
 *   handle "network error" at queue loader - repeat request 3-5 times untill successfull request
 *   fix live update of global variables (HLS_MAX_DURATION, HLS_MAX_SIZE, DOWNLOAD_TS, etc.)
 * > v2.2.1 - 2019.10.18
 *   add new option: 'hide vkmd from top left'
 *   add VkMD button to top-right profile menu
 * > v2.2.0 - 2019.10.15
 *   add User Settings modal
 * > v2.1.29 - 2019.10.14
 *   update global variables
 * > v2.1.28 - 2019.10.13
 *   fix responseType issue
 * > v2.1.27 - 2019.10.05
 *   replace $ with jQuery
 *   fix logger's serializer
 * > v2.1.26 - 2019.10.03
 *   fix logger for binary data
 * > v2.1.25 - 2019.09.30
 *   fix video API handler
 *   fix audio id parser
 * > v2.1.24 - 2019.09.29
 *   fix mp4 generator batch script
 * > v2.1.23 - 2019.09.28
 *   avoid usage of GM_xmlhttpRequest for Violentmonkey users,
 *     the reason is that VM does not allow to set custom User-Agent header,
 *     even if documentation says opposite
 *     P.S. I hardly recommend not to use VM, use GM or TM instead
 *   update logger - press Shift+S to save logs
 *   handle progress for GM_download
 *   fix race condition on audio request
 * > v2.1.22 - 2019.09.27
 *   handle new Vk API
 *   enable GM4 polyfill
 * > v2.1.21 - 2019.09.25
 *   fix function context
 *   handle buggy GM API
 * > v2.1.20 - 2019.05.17
 *   fix video id getting
 *   handle GM_download error
 * > v2.1.19 - 2019.05.14
 *   improved mutation observer for videos
 *   make script faster by using GreaseMonkey API
 * > v2.1.18 - 2019.05.12
 *   fix css for video tooltip
 *   fix hls source url
 *   add logger for keydown (32)
 *   minor changes
 * > v2.1.17 - 2019.05.11
 *   toggle debug mode off
 * > v2.1.16 - 2019.05.11
 *   added magic user-agent header =D
 * > v2.1.15 - 2019.05.10
 *   load inline scripts
 * > v2.1.14 - 2019.05.10
 *   make audio data load before tooltip open
 * > v2.1.13 - 2019.05.01
 *   try to fix audio tooltip activation for some browser configurations
 *   added extra logger to tooltip
 * > v2.1.12 - 2019.04.28
 *   added logger for audio tooltip
 * > v2.1.11
 *   minor changes in logger
 * > v2.1.10
 *   fix jquery-ui-css loader
 * > v2.1.9
 *   update *.ts concatenation scripts (UPD. HLS_MAX_DURATION = 3 hours, HLS_MAX_SIZE = 1 GB)
 * > v2.1.8
 *   handle errors on audio fetching
 * > v2.1.7
 *   HLS_MAX_DURATION = 40 mins
 *   maximum active queues = 10
 *   reduced *.ts filenames
 *   additional logger instances (.audio - 4, .ajax - 8)
 * > v2.1.6
 *   hotfix: shorten *.ts source folder name and file names, reason: "generate.mpN.bat" script can't handle long strings
 *   insert carriage return (CR) character before line feed (LF) to README.txt file for Windows users
 * > v2.1.5
 *   fixed ms edge error
 * > v2.1.4
 *   enabled hls video downloading as *ts fragments
 * > v2.1.3
 *   fixed mp3 audio filename generator
 * > v2.1.2
 *   changed audio filename format to "%artist% - %name%"
 * > v2.1.1
 *   added README.txt
 * > v2.1.0
 * Important updates:
 * + added downloader of *.ts files archived into *.zip file:
 *   - source/
 *     - stream.001.ts
 *     - stream.002.ts
 *     - ...
 *   - generate.mp3.bat
 *   - generate.mp3.sh
 * + Why is this update needed?
 *   you may have noticed that some *.mp3 media contain sound distortions,
 *     so in a new version v2.1.0 I have added *.ts downloader for further concatenation of the *.ts files into a single *.mp3 file by using ffmpeg,
 *     such *.mp3 files have clear sound without distortions
 * + How to concatenate *.ts files into a single *.mp3
 *   install ffmpeg (google helps you)
 *   run generate.mp3.[bat|sh] (bat - Windows, sh - Linux, MacOs) script
 * + to disable *.zip downloader feature just set "DOWNLOAD_TS = false" - and you will directly download *.mp3 files,
 *     but be aware that such *.mp3 files may contain sound distortions
 */


;(function(window, WINDOW) {
  const exports = {};
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
 	return __webpack_require__(__webpack_require__.s = 44);
 })

 ([
/* 0 */
 (function(module, exports, __webpack_require__) {

var Logger = __webpack_require__(13)
var logger = new Logger()

module.exports = logger

 }),
/* 1 */
 (function(module, exports) {

var time = function () {
  return '[' + new Date().toISOString() + ']'
}

module.exports = time

 }),
/* 2 */
 (function(module, exports, __webpack_require__) {

var EventEmitter = __webpack_require__(53)

module.exports = new EventEmitter()

 }),
/* 3 */
 (function(module, exports, __webpack_require__) {

var locales = __webpack_require__(46)

var i18n = {
  /** @type {keyof import('../locales')} */
  lang: 'ru',
  /** @param {keyof import('../locales')} lang */
  setLang: function (lang) {
    i18n.lang = lang
  },
  getLang: function () {
    return i18n.lang || 'ru'
  },
  /**
   * @param {keyof import('../locales')['ru']} key 
   * @param {{ [x: string]: string | number }} [options]
   * @return {string}
   */
  text: function (key, options) {
    var lang = i18n.getLang()
    var locale = locales[lang] || locales.en
    var val = locale[key] || locales.en[key] || key
    if (!options) {
      return val
    }
    return val.replace(/\{([^{}]+)\}/g, function (match, p1) {
      return options[p1] !== undefined ? options[p1] : match
    })
  },
}

module.exports = i18n

 }),
/* 4 */
 (function(module, exports, __webpack_require__) {

var logger = __webpack_require__(0)
var time = __webpack_require__(1)
var parseAJAXHeaders = __webpack_require__(66)
var parseAJAXResponse = __webpack_require__(67);
var isQuteBrowser = __webpack_require__(31);

/**
 * @typedef {{
 *  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH';
 *  url: string;
 *  headers?: { [x: string]: (string | number) };
 *  responseType?: string;
 *  data?: any;
 *  onprogress?: (loaded: number, total: number) => void;
 * }} IRequestDetails
 * @typedef {{
 *  ok: boolean;
 *  status: number;
 *  headers: { [x: string]: string };
 *  problem?: string;
 *  data?: T;
 *  finalUrl: string;
 * }} IResponse
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
    xhr = new window.ActiveXObject('Msxml2.XMLHTTP.6.0')
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
 * @param {string | IRequestDetails} options
 * @param {boolean} [useGM]
 * @return {Promise<IResponse>}
 */
function makeRequest(options, useGM = false) {
  logger.debug(time(), 'makeRequest options', options, { useGM: useGM, isQuteBrowser: isQuteBrowser() }, navigator.userAgent)
  var details = {
    method: 'GET',
    headers: {},
  }
  if (typeof options === 'string') {
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
    if (!e.target && e instanceof XMLHttpRequest) {
      isQuteBrowser._is_qute_browser = true
    }
    var req = e.target || e
    response.status = req.status
    response.headers = parseAJAXHeaders((typeof req.getAllResponseHeaders == 'function' ? req.getAllResponseHeaders() : req.responseHeaders) || {})
    response.ok = req.status >= 200 && req.status < 300
    response.problem = response.ok ? undefined : response.problem
    var isText = !req.responseType || req.responseType.toLowerCase() === 'text'
    try {
      response.data = parseAJAXResponse({
        responseText: isText && (req instanceof XMLHttpRequest) ? req.responseText : req.response,
        headers: response.headers,
        responseType: req.responseType,
      })
    } catch (error) {
      logger.error(time(), 'makeRequest error parsing response', error, response)
      response.data = isText && (req instanceof XMLHttpRequest) ? req.responseText : req.response
    }
    response.rawData = req.response
    response.finalUrl = req.finalUrl || req.responseURL || response.finalUrl
    logger.debug(time(), 'makeRequest response: ', response, details)
    return response
  }
  var onTimeout = function (e) {
    var req = e.target || e
    logger.error(time(), 'makeRequest timeout', req.status, req.readyState)
    response.status = req.status
    response.ok = false
    response.problem = 'TIMEOUT'
    return response
  }
  var onError = function (e) {
    var req = e.target || e

    logger.error(time(), 'makeRequest error', details.method, details.url, req.status, req.readyState, !e.target, useGM)
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

  if (!useGM || typeof GM === 'undefined' || typeof GM.xmlHttpRequest === 'undefined' || isQuteBrowser()) {
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
/* 5 */
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
/* 6 */
 (function(module, exports) {

function deepCopy(target) {
  if (target === null || typeof target !== 'object') {
    return target
  }
  var retval = Array.isArray(target) ? [] : {}
  for (var key of Object.keys(target)) {
    retval[key] = deepCopy(target[key])
  }
  return retval
}

module.exports = deepCopy

 }),
/* 7 */
 (function(module, exports, __webpack_require__) {

var settingsOptions = __webpack_require__(63)
var settingsTabs = __webpack_require__(65)
var eventEmitter = __webpack_require__(2)
var storage = __webpack_require__(14)
var i18n = __webpack_require__(3)
var info = __webpack_require__(10)
var logger = __webpack_require__(0)
var time = __webpack_require__(1)

var settingsModel = {
  /** @type {import('../views/settingsView')} */
  view: null,
  storage: storage,
  options: settingsOptions,
  tabs: settingsTabs.map(function (tab) {
    tab.options = settingsOptions.filter(function (option) {
      return option.tab == tab.key
    })
    return tab
  }),
  /**
   * @param {{
   *  view: import('../views/settingsView')
   * }} options 
   */
  init: function (options) {
    settingsModel.setView(options.view)
    storage.addListener(settingsModel.onSettingsChange)
  },
  /** @return {import('../views/settingsView').ISettingsViewProps} */
  getSettingsViewProps: function () {
    return {
      title: info.script_name + ' ' + info.script_version,
      tabs: settingsModel.tabs,
      options: settingsModel.options,
      onChange: function (key, val) {
        settingsModel.onChange(key, val)
      },
      onChangeLang: function (lang) {
        i18n.setLang(lang)
        settingsModel.updateLang(lang)
      },
      onDelete: function () {
        return settingsModel.storage.removeItem('settings')
      },
      onReset: function () {
        var defaultValues = settingsModel.getDefaultValues()
        return settingsModel.updateValues(defaultValues)
      },
      onSave: function () {
        return settingsModel.saveValues()
      },
    }
  },
  /** @param {import('../utils/storage').IStorageEvent} details  */
  onSettingsChange: function (details) {
    if (!details.remote || details.key !== 'settings') {
      return Promise.resolve()
    }
    return settingsModel.updateValues(details.newValue)
  },
  /** @param {{ [x: string]: any }} settings */
  updateValues: function (settings) {
    settingsModel.setValues(settings)
    for (var option of settingsModel.options) {
      settingsModel.onChange(option.key, option.getValue(true))
    }
    i18n.setLang(settingsModel.getValue('vkmd-lang'))
    settingsModel.updateLang(i18n.getLang())
    return settingsModel.saveValues()
  },
  /**
   * @param {string} key
   * @param {any} val
   * @param {boolean} [parse]
   */
  setValue: function (key, val, parse = false) {
    var option = settingsModel.options.find(function (option) {
      return option.key == key
    })
    option && option.setValue(val, parse)
    return option
  },
  /**
   * @param {string} key
   * @param {boolean} [format]
   */
  getValue: function (key, format = false) {
    var option = settingsModel.options.find(function (option) {
      return option.key == key
    })
    return option && option.getValue(format)
  },
  /**
   * @param {{ [x: string]: any }} settings
   * @param {boolean} [parse]
   */
  setValues: function (settings, parse = false) {
    var keys = Object.keys(settings)
    for (var key of keys) {
      settingsModel.setValue(key, settings[key], parse)
    }
  },
  /**
   * @param {boolean} [format]
   * @return {{ [x: string]: any }}
   */
  getValues: function (format = false) {
    var settings = {}
    for (var option of settingsModel.options) {
      var key = option.key
      settings[key] = option.getValue(format)
    }
    return settings
  },
  /**
   * @return {{ [x: string]: any }}
   */
  getDefaultValues: function () {
    var settings = {}
    for (var option of settingsModel.options) {
      var key = option.key
      settings[key] = option.defaultValue !== undefined ? option.defaultValue : option.getValue()
    }
    return settings
  },
  saveValues: function () {
    var settings = settingsModel.getValues()
    var storage = settingsModel.storage
    return storage.setItem('settings', settings)
  },
  fetchValues: function () {
    var storage = settingsModel.storage
    return storage.getItem('settings').then(function (settings) {
      settings && settingsModel.setValues(settings)
      settingsModel.updateLogger()
      return settings
    })
  },
  onChange: function (key, val) {
    logger.debug(time(), key, val)
    var option = settingsModel.setValue(key, val, true)
    var view = settingsModel.view
    view && view.updateOption(option)
    if (key.indexOf('log-level-') === 0) {
      var logkey = key.replace('log-level-', '')
      var options = {}
      options[logkey] = val
      eventEmitter.emit('logger', options)
    }
    eventEmitter.emit('settings-change', key, val)
    return settingsModel.saveValues()
  },
  updateLogger: function () {
    var options = settingsModel.options.filter(function (option) {
      return option.key.indexOf('log-level-') === 0
    })
    var loggerOptions = {}
    for (var option of options) {
      var key = option.key.replace('log-level-', '')
      loggerOptions[key] = option.value
    }
    eventEmitter.emit('logger', loggerOptions)
    return loggerOptions
  },
  /** @param {keyof import('../locales')} lang */
  updateLang: function (lang) {
    var options = settingsModel.options
    var view = settingsModel.view
    for (var option of options) {
      view && view.updateLang(option)
    }
    var tabs = settingsModel.tabs
    for (var tab of tabs) {
      view && view.updateTab(tab)
    }
    view && view.updateFooter()
  },
  /**
   * @param {string} key
   * @return {boolean}
   */
  isDefault: function (key) {
    var option = settingsModel.options.find(function (option) {
      return option.key == key
    })
    return option && option.isDefault()
  },
  setView: function (view) {
    settingsModel.view = view
  },
  registerMenuCommand: function () {
    try {
      if (typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand('settings', (event) => {
          const checkbox = document.querySelector('#modal-checkbox')
          if (checkbox) {
            checkbox.checked = !checkbox.checked
          }
        })
      }
    } catch (e) {
      logger.error(e)
    }
  },
  toString: function () {
    return typeof this === 'string' ? this : JSON.stringify(this.getValues())
  },
}

module.exports = settingsModel


 }),
/* 8 */
 (function(module, exports) {

module.exports = jQuery

 }),
/* 9 */
 (function(module, exports) {

/**
 * @param {number} size
 * @return {string}
 */
function smartSize(size) {
  if (!size) {
    return '-- MiB'
  }
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
/* 10 */
 (function(module, exports) {

var defaultInfo = {
  script_name: 'Vk Media Downloader',
  script_version: '3.10.0',
  script_author: 'eisen-stein',
  script_handler: 'none',
}

var has_gm_info = function () {
  return typeof GM !== 'undefined' && typeof GM.info !== 'undefined'
}

function getScriptName() {
  if (has_gm_info()) {
    return GM.info.script.name
  }
  defaultInfo.script_name
}

function getScriptVersion() {
  if (has_gm_info()) {
    return GM.info.script.version
  }
  return defaultInfo.script_version
}

function getScriptAuthor() {
  if (has_gm_info()) {
    return GM.info.script.author
  }
  return defaultInfo.script_author
}

function getScriptHandler() {
  if (has_gm_info()) {
    return GM.info.scriptHandler
  }
  return defaultInfo.script_handler
}

module.exports = {
  script_name: getScriptName() || defaultInfo.script_name,
  script_version: 'v' + (getScriptVersion() || defaultInfo.script_version),
  script_author: getScriptAuthor() || defaultInfo.script_author,
  script_handler: getScriptHandler() || defaultInfo.script_handler,
}


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
 (function(module, exports, __webpack_require__) {

var eventEmitter = __webpack_require__(2)
var logger = __webpack_require__(0)
var time = __webpack_require__(1)
var random = __webpack_require__(21)
var URLParse = __webpack_require__(22)
var deepCopy = __webpack_require__(6)

/**
 * @typedef {{
   id: string;
   url: string;
   filename: string;
   name: string;
   ext: string;
   event: string;
 }} IEventData
 */

var iframeChannel = {
  init: function () {
    window.addEventListener('message', iframeChannel.onMessage)
    eventEmitter.on('iframe-ready', iframeChannel.onIFrameReady)
  },
  createRoot: function () {
    iframeChannel.id = iframeChannel.id || `iframe-root-${random()}`
    var root = document.querySelector('#' + iframeChannel.id)
    if (root) {
      return root
    }
    root = document.createElement('div')
    root.id = iframeChannel.id
    root.classList.add('vkmd-iframe-channel')
    iframeChannel.root = root
    return document.body.appendChild(root)
  },
  /** @param {IEventData} data */
  getEventName: function (data) {
    return data && data.id && data.event ? (data.id + '-' + data.event) : ''
  },
  /** @param {IEventData} data */
  request: function (data) {
    var event = iframeChannel.getEventName(data)
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
    var link = document.createElement('a')
    link.href = data.url
    var id = 'iframe_' + link.hostname.replace(/\./g, '_') + (link.port ? ('_' + link.port) : '')

    var iframe = document.querySelector('#' + id)
    if (!iframe) {
      iframe = iframeChannel.createIFrame(id, data, link.href)
    } else if (iframe.classList.contains('iframe-ready')) {
      iframe.contentWindow.postMessage(data, '*')
    } else {
      eventEmitter.once('iframe-' + iframe.id, function () {
        iframe.contentWindow.postMessage(data, '*')
      })
    }
    return iframe
  },
  /** @param {string} id */
  onIFrameReady: function (id) {
    var iframe = document.body.querySelector('iframe#' + id)
    if (iframe) {
      iframe.classList.add('iframe-ready')
      eventEmitter.emit('iframe-' + id)
    }
  },
  /**
   * @param {string} id 
   * @param {IEventData} data 
   */
  createIFrame: function (id, data, url) {
    var iframe = document.createElement('iframe')
    iframe.id = id
    iframe.style.width = '1px'
    iframe.style.height = '1px'
    iframe.style.visibility = 'hidden'
    data = deepCopy(data)
    data.iframeId = iframe.id
    var root = iframeChannel.createRoot()
    root.appendChild(iframe)
    iframe.src = iframeChannel.getIFrameURL(data, url)
    return iframe
  },
  getIFrameURL: function (data, url) {
    var link = URLParse(url)
    link.pathname = link.pathname + '.html'
    link.hash = 'VKMD:' + encodeURIComponent(JSON.stringify(data))
    return link.href
  },
  onMessage: function (e) {
    var event = iframeChannel.getEventName(e.data)
    if (event) {
      eventEmitter.emit(event, e.data)
    }
    if (e.data && e.data.event === 'iframe-ready') {
      eventEmitter.emit('iframe-ready', e.data.iframeId)
    }
  },
}

module.exports = iframeChannel

 }),
/* 13 */
 (function(module, exports, __webpack_require__) {

var eventEmitter = __webpack_require__(2)
var serialize = __webpack_require__(54)
const delay = __webpack_require__(5)

var BUFFER = []
BUFFER.log = true
BUFFER.info = true
BUFFER.warn = true
BUFFER.error = true
BUFFER.debug = true

var LOGGER = ['log', 'info', 'warn', 'error', 'debug'].reduce(function (acc, key) {
  acc[key] = function () {
    if (BUFFER[key]) {
      window.console[key].apply(window.console, arguments)
    }
    BUFFER.push([key, Array.prototype.slice.call(arguments).map(serialize.object)])
    Logger.autosave()
  }
  return acc
}, {})

// var LOGGER = {
//   log: window.console.log.bind(window.console),
//   info: window.console.info.bind(window.console),
//   warn: window.console.warn.bind(window.console),
//   error: window.console.error.bind(window.console),
//   debug: window.console.debug.bind(window.console),
// }

var noop = function () { }

function Logger(logger) {
  this.logger = Object.assign({}, LOGGER)//, logger)//, { debug: noop })
  var _this = this
  eventEmitter.on('logger', function (options) {
    try {
      _this.update(options)
    } catch (e) {
      console.error(e)
    }
  })
}

/** @type {import('../model/settingsModel')} */
Logger.settingsModel

/**
 * @param {{ [x: string]: boolean | (...args: any[]) => void}} logger
 */
Logger.prototype.update = function (logger) {
  var keys = Object.keys(logger)
  for (var key of keys) {
    if (logger[key] === true) {
      BUFFER[key] = true
      // this.logger[key] = LOGGER[key] || noop
    } else if (typeof logger[key] === 'function') {
      this.logger[key] = logger[key]
    } else {
      BUFFER[key] = false
      // this.logger[key] = noop
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
  return this.logger.warn.apply(this.logger, arguments)
}
Logger.prototype.error = function () {
  return this.logger.error.apply(this.logger, arguments)
}
Logger.flush = Logger.prototype.flush = function () {
  BUFFER.length = 0
}
Logger.autosave = function () {
  var bufSize = Logger.settingsModel ? Logger.settingsModel.getValue('log-buffer-size') : 100
  if (BUFFER.length < bufSize || Logger.saving) {
    return
  }
  if (Logger.settingsModel && Logger.settingsModel.getValue('log-autosave')) {
    return Logger.save()
  }
  BUFFER.length = 0
}
Logger.save = Logger.prototype.save = function () {
  if (BUFFER.length === 0 || Logger.saving) {
    return Promise.resolve()
  }
  Logger.saving = true
  var buf = BUFFER.slice()
  BUFFER.length = 0
  var text = buf.map(function (m) {
    return `${(m[0] + '  ').slice(0, 5)}: ${m[1].join(' ')}`
  }).join('\n')
  var blob = new Blob([text], { type: 'text/plain' })
  var resource = URL.createObjectURL(blob)
  var link = document.createElement('a')
  link.href = resource
  link.download = `logs-${new Date().toISOString()}.txt`
  document.body.appendChild(link)
  link.click()
  return delay(200).then(function () {
    Logger.saving = false
    URL.revokeObjectURL(resource)
  })
}

module.exports = Logger

 }),
/* 14 */
 (function(module, exports, __webpack_require__) {

var info = __webpack_require__(10)
var eventEmitter = __webpack_require__(2)
var isEqual = __webpack_require__(30)
var logger = __webpack_require__(0)
var time = __webpack_require__(1)

/**
 * @typedef {{
 *  key: string;
 *  newValue: any;
 *  oldValue: any;
 *  remote: boolean;
 * }} IStorageEvent
 */
/** @type {(key: string; value: any) => Promise<void>} */
var setItem
/** @type {(key: string) => Promise<any>} */
var getItem
/** @type {(key: string) => Promise<void>} */
var removeItem
/** @type {() => Promise<string[]>} */
var listItems
/** @type {(callback: (e: IStorageEvent) => void) => void} */
var addListener
/** @type {(callback?: (e: IStorageEvent) => void) => void} */
var removeListener
/** @type {'gm' | 'local'} */
var type

var parseStorageData = function (v) {
  if (info.script_handler.toLowerCase() != 'firemonkey') {
    return v
  }
  try {
    return JSON.parse(v)
  } catch (e) {
    return v
  }
}

var serializeStorageData = function (v) {
  if (info.script_handler.toLowerCase() != 'firemonkey') {
    return v
  }
  try {
    return JSON.stringify(v);
  } catch (e) {
    return v
  }
}

if (
  typeof GM !== 'undefined'
  && typeof GM.setValue !== 'undefined'
  && typeof GM.getValue !== 'undefined'
  && typeof GM.deleteValue !== 'undefined'
  && typeof GM.listValues !== 'undefined'
  && typeof GM.addValueChangeListener !== 'undefined'
) {
  type = 'gm'
  getItem = function (key) {
    return GM.getValue(key).then(parseStorageData)
  }
  setItem = function (key, val) {
    return getItem(key).then(function (v) {
      return !isEqual(v, val) && GM.setValue(key, serializeStorageData(val))
    })
  }
  removeItem = function (key) {
    return getItem(key).then(function (v) {
      if (v) {
        return GM.deleteValue(key)
      }
    })
  }
  listItems = function () {
    return GM.listValues()
  }
  addListener = function (callback) {
    eventEmitter.on('storage-change', callback)
  }
  removeListener = function (callback) {
    eventEmitter.off('storage-change', callback)
  }
  var onStorageChange = function (key, oldValue, newValue, remote) {
    logger.debug(time(), 'on storage change', [].slice.call(arguments))
    eventEmitter.emit('storage-change', {
      key: key,
      newValue: newValue,
      oldValue: oldValue,
      remote: remote,
    })
  }
  var addValueChangeListener = typeof GM_addValueChangeListener !== 'undefined' ? GM_addValueChangeListener : GM.addValueChangeListener
  addValueChangeListener && addValueChangeListener('settings', onStorageChange)
} else {
  type = 'local'
  getItem = function (key) {
    var val = localStorage.getItem(key)
    try {
      val = JSON.parse(val)
    } catch (e) { }
    return Promise.resolve(val)
  }
  setItem = function (key, val) {
    return getItem(key).then(function (v) {
      var equal = isEqual(v, val)
      val = typeof val !== 'string' ? JSON.stringify(val) : val
      !equal && localStorage.setItem(key, val)
      return Promise.resolve()
    })
  }
  removeItem = function (key) {
    localStorage.removeItem(key)
    return Promise.resolve()
  }
  listItems = function () {
    var keys = []
    for (var i = 0; i < localStorage.length; ++i) {
      keys[i] = localStorage.key(i)
    }
    return Promise.resolve(keys)
  }
  addListener = function (callback) {
    eventEmitter.on('storage-change', callback)
  }
  removeListener = function (callback) {
    eventEmitter.off('storage-change', callback)
  }
  /** @param {StorageEvent} e */
  var onStorageChange = function (e) {
    if (e.key !== 'settings') {
      return
    }
    logger.debug(time(), 'on storage change', e)
    var newValue = e.newValue
    try {
      newValue = JSON.parse(e.newValue)
    } catch (err) { }
    var oldValue = e.oldValue
    try {
      oldValue = JSON.parse(e.oldValue)
    } catch (err) { }

    eventEmitter.emit('storage-change', {
      key: e.key,
      newValue: newValue,
      oldValue: oldValue,
      remote: true,
    })
  }
  window.addEventListener('storage', onStorageChange)
}

var storage = {
  setItem: setItem,
  getItem: getItem,
  removeItem: removeItem,
  listItems: listItems,
  addListener: addListener,
  removeListener: removeListener,
  type: type,
}

module.exports = storage

 }),
/* 15 */
 (function(module, exports, __webpack_require__) {

var jQuery = __webpack_require__(8)
var makeRequest = __webpack_require__(4)
var toUrlEncoded = __webpack_require__(32)
var logger = __webpack_require__(0)
var time = __webpack_require__(1)
var getExtension = __webpack_require__(11)
var eventEmitter = __webpack_require__(2)
var iframeChannel = __webpack_require__(12)
var random = __webpack_require__(21)
var getTextAreaValue = __webpack_require__(69)
var hlsController = __webpack_require__(33)
var downloadManager = __webpack_require__(38)
var smartSize = __webpack_require__(9)
var deepCopy = __webpack_require__(6)
var normalizeFilename = __webpack_require__(39)
var copyTextToClipboard = __webpack_require__(84)
var Logger = __webpack_require__(13)
var delay = __webpack_require__(5)
const smartBitrate = __webpack_require__(26)
const { mainOrigin } = __webpack_require__(40)
__webpack_require__(85)

/**
 * @typedef {import('../utils/makeRequest').IResponse} IResponse
 * 
 * @typedef {{
 *  title: string;
 *  subTitle?: string;
 *  artists: string[];
 *  cover_p: string;
 *  cover_s: string;
 *  performer: string;
 * }} IAudioMetaData
 * 
 * @typedef {{
 *  aid: string;
 *  oid: string;
 *  url: string;
 *  name: string;
 *  artist: string;
 *  full_id: string;
 *  duration: number;
 *  src: string;
 *  mp3Url?: string;
 *  mp3Size?: number;
 *  media_id: string;
 *  filename: string;
 *  ext: string;
 *  hash_id?: string;
 *  size?: number;
 *  fetching?: boolean;
 *  error?: string;
 *  size_fetching?: boolean;
 *  size_error?: string;
 *  downloading?: boolean;
 *  download_error?: string;
 *  noMP3?: boolean;
 *  metadata?: IAudioMetaData;
 *  inserted_at: number;
 * }} IAudioData
 * 
 */

var audioController = {
  vk_id: null,
  /** @type {IAudioData} */
  lastAudio: null,
  /** @type {import('../views/audioTooltip')} */
  tooltip: null,
  setTooltip: function (tooltip) {
    audioController.tooltip = tooltip
  },
  /** @type {import('../model/settingsModel')} */
  settingsModel: null,
  setSettingsModel: function (model) {
    audioController.settingsModel = model
  },
  /** @type {{ [x: string]: IAudioData }} */
  cache: {},
  cacheTimeout: 10 * 60 * 1000,
  /** @return {IAudioData} */
  getCache: function (full_id) {
    return audioController.cache[full_id] || { full_id: full_id, inserted_at: Date.now() }
  },
  isExpiredCache: function (full_id) {
    var cache = audioController.cache[full_id]
    if (cache && cache.inserted_at) {
      var diff = Date.now() - cache.inserted_at
      return diff > audioController.cacheTimeout
    }
    return true
  },
  updateCache: function (full_id) {
    var cache = audioController.cache[full_id] || { full_id: full_id, inserted_at: Date.now() }
    if (!cache.inserted_at) {
      cache.inserted_at = Date.now()
    }
    var data = Array.prototype.slice.call(arguments, 1)
    var args = [cache]
    args.push.apply(args, data)
    audioController.cache[full_id] = Object.assign.apply(Object, args)
  },
  setLastAudio: function (full_id) {
    /** @type {IAudioData} */
    var audio = audioController.getCache(full_id)
    audioController.lastAudio = Object.assign({ full_id: full_id }, audio)
  },
  updateLastAudio: function (full_id) {
    if (audioController.lastAudio && audioController.lastAudio.full_id == full_id) {
      /** @type {IAudioData} */
      var audio = audioController.getCache(full_id)
      audioController.lastAudio = Object.assign({}, audio)
    }
  },
  saveAudioToClipboard: function () {
    /** @type {IAudioData} */
    var lastAudio = audioController.lastAudio
    if (lastAudio && lastAudio.mp3Url) {
      copyTextToClipboard(lastAudio.mp3Url)
    }
    if (lastAudio && !lastAudio.mp3Url && lastAudio.src) {
      Logger.error(time(), '[copy to clipboard] audio does not have mp3 url', lastAudio)
    }
  },
  renderMeta: function (full_id) {
    const data = audioController.getCache(full_id)
    if (!data.size || !data.duration) {
      return;
    }
    var audio_row = document.querySelector('.audio_row[data-full-id="' + full_id + '"]')
    if (!audio_row) {
      return;
    }
    if (!audio_row.querySelector('.audio_meta_data')) {
      var info = audio_row.querySelector('.audio_row__info')
      if (!info) {
        return;
      }
      jQuery(`<div class="audio_meta_data" data-id="${full_id}">
        <div>${smartBitrate(data.size, data.duration, true)}</div>
        <div>${smartSize(data.size)}</div>
      </div>`).insertBefore(info)
    }
    if (
      (
        jQuery(`.audio_row__actions[data-id="${full_id}"]`).length
        && audioController.settingsModel.getValue('hide-audio-meta-data-on-hover')
      ) || !audioController.settingsModel.getValue('show-audio-meta-data-on-row')
    ) {
      audioController.hideMeta(full_id)
    } else {
      audioController.showMeta(full_id)
    }
  },
  hideMeta: function (full_id) {
    if (!full_id) {
      jQuery('.audio_meta_data').hide()
    } else {
      jQuery(`.audio_meta_data[data-id="${full_id}"]`).hide()
    }
  },
  showMeta: function (full_id) {
    if (!full_id) {
      jQuery('.audio_meta_data').show()
    } else {
      jQuery(`.audio_meta_data[data-id="${full_id}"]`).show()
    }
  },
  /**
   * @param {string[]} ids
   * @param {(id: string, cache?: IAudioData) => boolean} callback
   * @return {string[]}
   */
  filterIds: function (ids, callback) {
    var cache = audioController.cache
    return ids.filter(function (id) {
      return callback(id, cache[id] || {})
    })
  },
  /**
   * @param {string} full_id 
   * @return {string}
   */
  getHashId: function (full_id) {
    var isMobile = mainOrigin().indexOf('://m.vk.') !== -1
    if (isMobile) {
      var hash_id = full_id + '_'
      audioController.updateCache(full_id, { hash_id: hash_id })
      return hash_id
    }
    var audio_row = document.querySelector('.audio_row[data-full-id="' + full_id + '"]')
    var data_audio_json = audio_row.getAttribute('data-audio')
    var data_audio = JSON.parse(data_audio_json)
    var match = data_audio[13].match(/[0-9a-zA-Z]+/g);
    var hash = (match.length <= 3 ? match.slice(match.length - 2) : match.slice(-3, -1)).join('_')
    var hash_id = [full_id, hash].join('_')
    audioController.updateCache(full_id, { hash_id: hash_id })
    return hash_id;
  },
  register: function () {
    // data
    eventEmitter.on('audio_data_request', function (full_id) {
      audioController.updateCache(full_id, { fetching: true })
    })
    eventEmitter.on('audio_data_success', function (full_id, data) {
      audioController.updateCache(full_id, data, { fetching: false })
      audioController.updateLastAudio(full_id)
    })
    eventEmitter.on('audio_data_failure', function (full_id, error) {
      audioController.updateCache(full_id, { fetching: false, error: error && (error.message || error.problem) })
    })
    // size
    eventEmitter.on('audio_size_request', function (full_id) {
      audioController.updateCache(full_id, { size_fetching: true, size_error: '' })
    })
    eventEmitter.on('audio_size_success', function (full_id, size) {
      audioController.updateCache(full_id, { size: size, size_fetching: false, size_error: '' })
    })
    eventEmitter.on('audio_size_failure', function (full_id, error) {
      audioController.updateCache(full_id, { size_fetching: false, size_error: error && (error.message || error.problem) })
    })
    // download
    eventEmitter.on('audio_download_request', function (full_id) {
      audioController.updateCache(full_id, { downloading: true, download_error: '' })
    })
    eventEmitter.on('audio_download_success', function (full_id) {
      audioController.updateCache(full_id, { downloading: false, download_error: '' })
    })
    eventEmitter.on('audio_download_failure', function (full_id, error) {
      audioController.updateCache(full_id, { downloading: false, download_error: error })
    })
    eventEmitter.on('settings-change', function (key, val) {
      if (key !== 'show-audio-meta-data-on-row') {
        return;
      }
      logger.debug(time(), 'audio metadata show', { val })
      if (val) {
        audioController.showMeta()
      } else {
        audioController.hideMeta()
      }
    })
  },
  /**
   * @param {string} full_id
   * @param {(loaded: number, total: number) => void} [onprogress]
   */
  download: function (full_id, onprogress) {
    logger.debug(time(), 'download audio', full_id)
    var onProgressEvent = function (loaded, total) {
      eventEmitter.emit('audio_download_progress', full_id, (loaded || 0) / (total || 0))
      onprogress && onprogress(loaded, total)
    }
    return audioController.fetchData([full_id]).then(function () {
      /** @type {IAudioData} */
      var data = audioController.cache[full_id]
      eventEmitter.emit('audio_download_request', full_id)
      var name = audioController.getName(data)
      if (data.ext === 'm3u' || data.ext === 'm3u8') {
        return audioController.downloadHls(Object.assign({}, data, { name: name }), onProgressEvent)
      }
      var details = audioController.getDownloadDetails(Object.assign({}, data, { name: name }), onProgressEvent)
      var options = audioController.getDownloadOptions()
      return downloadManager.download(details, options)
    }).then(function () {
      eventEmitter.emit('audio_download_success', full_id)
    }).catch(function (e) {
      logger.error(time(), 'audio download error', full_id, e)
      eventEmitter.emit('audio_download_failure', full_id, e.message || e.problem)
    })
  },
  /**
   * @param {IAudioData} data 
   * @return {string}
   */
  getName: function (data) {
    var options = audioController.settingsModel.options.reduce(function (acc, option) {
      if (option.name && option.name.length === 1) {
        acc[option.name] = option.getValue()
      }
      return acc
    }, {})
    var name = normalizeFilename(data.name, options)
    return name
  },
  /**
   * @param {string} full_id
   * @return {Promise<number>}
   */
  fetchSize: function (full_id) {
    logger.debug(time(), 'fetch audio size', full_id)
    var data = audioController.cache[full_id]
    if (data && data.size) {
      return Promise.resolve(data.size)
    }
    eventEmitter.emit('audio_size_request', full_id)
    return audioController.fetchData([full_id]).then(function () {
      var data = audioController.cache[full_id]
      if (data.mp3Size) {
        return Promise.resolve(data.mp3Size)
      }
      logger.info(time(), 'fetch audio size: ', deepCopy(data))
      if (data.ext !== 'm3u' && data.ext !== 'm3u8') {
        return audioController.fetchSizeMP3(data.src, full_id)
      }
      return audioController.fetchSizeM3U(data.src, full_id)
    }).then(function (size) {
      eventEmitter.emit('audio_size_success', full_id, size)
      logger.info(time(), 'size: ', smartSize(size))
      audioController.renderMeta(full_id)
      return size
    }).catch(function (e) {
      eventEmitter.emit('audio_size_failure', full_id, e.message || e.problem)
      logger.error(time(), 'failed to fetch audio size, error = ', e, ', full_id = ', full_id)
      return -1
    })
  },
  /**
   * @param {string[]} full_ids
   * @return {Promise<IAudioData[]>}
   */
  fetchData: function (full_ids) {
    full_ids = audioController.filterIds(full_ids, function (full_id, cache) {
      var hash_id = audioController.getCache(full_id).hash_id || audioController.getHashId(full_id)
      return (!cache.src || audioController.isExpiredCache(full_id)) && hash_id
    })
    if (!full_ids.length) {
      return Promise.resolve([])
    }
    var hash_ids = full_ids.map(function (full_id) {
      eventEmitter.emit('audio_data_request', full_id)
      return audioController.getCache(full_id).hash_id
    })
    logger.debug(time(), 'fetch audio data', full_ids, hash_ids)
    return audioController.requestData(full_ids, hash_ids).then(function (data) {
      data.forEach(function (item) {
        eventEmitter.emit('audio_data_success', item.full_id, item)
      })
      return data
    }).catch(function (e) {
      logger.error(time(), 'failed to fetch audio data, error = ', e, ', ids = ', full_ids)
      full_ids.forEach(function (full_id) {
        eventEmitter.emit('audio_data_failure', full_id, e.message || e.problem)
      })
      return []
    })
  },
  /**
   * @param {string[]} full_ids
   * @param {string[]} hash_ids 
   */
  requestData: function (full_ids, hash_ids) {
    var isMobile = mainOrigin().indexOf('://m.vk.') !== -1
    var win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window
    var req = isMobile ? makeRequest({
      method: 'POST',
      url: mainOrigin() + '/audio?act=reload_audios',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
      },
      data: toUrlEncoded({
        audio_ids: hash_ids.join(','),
        staticVersion: win.al && win.al.ver,
      }),
    }) : makeRequest({
      method: 'POST',
      url: mainOrigin() + '/al_audio.php', // https://vk.com/al_audio.php
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
      },
      data: toUrlEncoded({
        al: 1,
        act: 'reload_audio',
        ids: hash_ids.join(','),
      }),
    })
    return req.then(function (response) {
      if (!response.ok) {
        throw response
      }
      var data = audioController.parseData(response)
      var promises = data.map(function (item, index) {
        item.full_id = full_ids[index]
        return audioController.tryFetchMP3(item)
      })
      return Promise.all(promises)
    })
  },
  /**
   * @param {number} [begin]
   * @param {number} [end]
   */
  fetchDataAll: function (begin, end) {
    begin = begin || 0
    end = end || undefined
    var audios = jQuery('.audio_row').slice(begin, end)
    var full_ids_all = audios.map(function (_, element) {
      return jQuery(element).attr('data-full-id')
    }).get()
    logger.debug(time(), 'fetch audio data all', full_ids_all)
    var ids = []
    for (var i = 0; i < full_ids_all.length; i += 10) {
      ids.push(full_ids_all.slice(i, i + 10))
    }
    return ids.reduce(function (promise, full_ids) {
      return promise.then(function () {
        return audioController.fetchData(full_ids);
      }).then(function (data) {
        return Promise.all(data.map(audioController.tryFetchMP3))
      })
    }, Promise.resolve())
  },
  /**
   * @param {IAudioData} data 
   * @return {Promise<IAudioData>}
   */
  tryFetchMP3: function (data) {
    if (data.mp3Url || getExtension(data.src).indexOf('m3u') === -1 || data.noMP3) {
      return Promise.resolve(data)
    }
    var mp3Url = data.src.replace(/\/index\.m3u8?/, '.mp3').split('/')
      .filter(function (_, idx, arr) {
        return idx !== arr.length - 2;
      }).join('/');
    var hlsSize
    logger.debug(time(), 'tryFetchMP3', data)
    var promise = data.size && data.size !== -1 ? Promise.resolve(data.size) : audioController.fetchSizeM3U(data.src)
    return promise.then(function (size) {
      hlsSize = size
      return Promise.race([
        audioController.fetchSizeMP3(mp3Url),
        delay(10 * 1000).then(function () { return -1 }),
      ])
    }).then(function (mp3Size) {
      var ratio = hlsSize / mp3Size
      var result = deepCopy(data)
      if (ratio >= 0.9 && ratio <= 1.1 || hlsSize == -1 || !hlsSize) {
        logger.info(time(), 'size: ', smartSize(mp3Size))
        result = Object.assign(result, { mp3Size: mp3Size, mp3Url: mp3Url, size: mp3Size, noMP3: false })
      } else {
        logger.info(time(), 'size (hls): ', smartSize(hlsSize))
        result = Object.assign(result, { noMP3: true })
      }
      return Promise.resolve(result)
    })
  },
  /**
   * @param {IAudioData} data
   * @param {(loaded: number, total: number) => void} [onProgress]
   * @return {import('../utils/downloadManager').IDownloadDetails}
   */
  getDownloadDetails: function (data, onProgress) {
    return {
      id: data.full_id,
      filename: data.name + '.mp3',
      name: data.name,
      url: data.src,
      size: data.size,
      ext: data.ext,
      metadata: data.metadata,
      onProgress: onProgress,
    }
  },
  /**
   * @return {{
   *  blobMaxSize: number;
   *  withMetadata: boolean;
   * }}
   */
  getDownloadOptions: function () {
    var options = {
      blobMaxSize: audioController.settingsModel.getValue('blob-max-size'),
      withMetadata: audioController.settingsModel.getValue('audio-with-metadata'),
      ffmpegEnabled: audioController.settingsModel.getValue('ffmpeg-enable'),
    }
    return options
  },
  /**
   * @param {IAudioData} _data 
   * @param {(loaded: number, total: number) => void} [onProgress]
   */
  downloadHls: function (_data, onProgress) {
    return audioController.tryFetchMP3(_data).then(function (data) {
      if (!data.mp3Url) {
        return hlsController.download({ url: data.src, name: data.name, media: 'audio', metadata: data.metadata }, onProgress)
      }
      var options = audioController.getDownloadOptions()
      return downloadManager.download({
        id: data.full_id,
        url: data.mp3Url,
        onProgress: onProgress,
        filename: data.name + '.mp3',
        name: data.name,
        size: data.mp3Size,
        metadata: data.metadata,
        ext: 'mp3',
      }, options)
    })
  },
  /**
   * @param {IAudioData} _data 
   * @param {(loaded: number, total: number) => void} [onProgress]
   */
  _downloadHls_: function (data, onProgress) {
    var mp3Url = data.src.replace(/\/index\.m3u8?/, '.mp3').split('/')
      .filter(function (_, idx, arr) {
        return idx !== arr.length - 2;
      }).join('/');
    var promise = data.size && data.size !== -1 ? Promise.resolve(data.size) : audioController.fetchSizeM3U(data.src)
    var hlsSize
    return promise.then(function (size) {
      hlsSize = size
      return audioController.fetchSizeMP3(mp3Url)
    }).then(function (mp3Size) {
      var ratio = hlsSize / mp3Size
      if (ratio < 0.9 || ratio > 1.1) {
        return hlsController.download({ url: data.src, name: data.name, media: 'audio' }, onProgress)
      }
      eventEmitter.emit('audio_size_success', data.full_id, mp3Size)
      eventEmitter.emit('audio_data_success', data.full_id, { mp3Url: mp3Url })
      var options = audioController.getDownloadOptions()
      return downloadManager.download({
        id: data.full_id,
        url: mp3Url,
        onProgress: onProgress,
        filename: data.name + '.mp3',
        name: data.name,
        size: mp3Size,
        ext: 'mp3',
      }, options)
    })
  },
  /**
   * @param {string} url
   * @param {string} [full_id]
   * @return {Promise<number>}
   */
  fetchSizeMP3: function (url, full_id) {
    return makeRequest({
      method: 'HEAD',
      url: url,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': location.href,
      },
    }, true).then(function (response) {
      return response.ok ? response : iframeChannel.request({
        event: 'audio_size',
        url: url,
        id: full_id || random(),
      })
    }).then(function (response) {
      var size = audioController.parseSize(response)
      logger.debug(time(), 'fetchSizeMP3', { url, size })
      return size
    })
  },
  /**
   * @param {string} url
   * @param {string} [full_id]
   * @return {Promise<number>}
   */
  fetchSizeM3U: function (url, full_id) {
    return hlsController.fetchSize(url).then(function (data) {
      if (data.duration && full_id) {
        audioController.updateCache(full_id, { duration: data.duration })
      }
      logger.debug(time(), 'fetchSizeM3U', { url, size: data.size })
      return data.size
    })
  },
  parseSize: function (response) {
    if (response.ok) {
      var contentLength = response.headers['content-length']
      return contentLength ? parseInt(contentLength, 10) : -1
    }
    return -1
  },
  /**
   * @param {IResponse} response
   * @return {IAudioData[]}
   */
  parseData: function (response) {
    var headers = response.headers
    if (headers['content-type'] && headers['content-type'].indexOf('application/json') !== -1) {
      response = audioController.parseJSON(response)
    } else {
      response = audioController.parseXML(response)
    }
    if (!response.ok) {
      throw response
    }
    if (Array.isArray(response.data) && typeof response.data[1] === 'object') {
      audioController.vk_id = Object.keys(response.data[1])[0] || audioController.vk_id
    }
    return response.data[0].map(function (item) {
      return audioController.parseAudioData(item)
    })
  },
  /**
   * @param {IResponse} response
   */
  parseJSON: function (response) {
    var rawData = response.rawData
    // json
    var payload
    var res = JSON.parse(rawData, function (key, val) {
      if (key === 'payload') {
        payload = val
      }
      return val
    })
    payload = Array.isArray(payload) ? payload : res.payload
    if (Array.isArray(payload)) {
      return Object.assign({}, response, { data: payload[1] })
    } else if (Array.isArray(res.data) && Array.isArray(res.data[0])) {
      return Object.assign({}, response, { data: res.data })
    } else {
      return Object.assign({}, response, { ok: false, problem: 'Response is not iterable' })
    }
  },
  /**
   * @param {IResponse} response
   */
  parseXML: function (response) {
    var rawData = response.rawData
    // xml
    var results = [];
    var idx = rawData.indexOf('<!json>');
    var idx2 = idx === -1 ? -1 : rawData.indexOf('<!>', idx + 7)
    while (idx !== -1 && idx2 !== -1) {
      results.push(JSON.parse(rawData.slice(idx + 7, idx2)));
      idx = rawData.indexOf('<!json>', idx2);
      idx2 = idx === -1 ? -1 : rawData.indexOf('<!>', idx + 7)
    }
    return Object.assign({}, response, { data: results })
  },
  /**
   * @param {string[]} data 
   * @return {IAudioMetaData}
   */
  parseMetaData: function (data) {
    var covers = data[14].split(',')
    var cover_s = covers[0]
    var cover_p = covers[1]
    var artists = Array.isArray(data[17]) ? data[17].map(function (d) {
      return d.name
    }) : []
    var title = data[3]
    var subTitle = data[16]
    var performer = data[4]
    var album = data[19]
    return {
      cover_p: cover_p,
      cover_s: cover_s,
      artists: artists,
      title: title,
      subTitle: subTitle,
      performer: performer,
    }
  },
  /**
   * @param {string[]} data 
   * @param {string} [full_id]
   * @return {IAudioData}
   */
  parseAudioData: function (data, full_id) {
    var keys = ['aid', 'oid', 'url', 'name', 'artist', 'duration'];
    var result = {};
    for (var k = 0, key; k < keys.length; ++k) {
      key = keys[k];
      result[key] = getTextAreaValue(k === 3 && data[16] ? (data[k] + ' (' + data[16] + ')') : data[k])
    }
    var win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window
    audioController.vk_id = audioController.vk_id || (win.vk && win.vk.id) || (data[15] && data[15].vk_id) || parseInt(result.oid, 10)
    result = Object.assign({}, result, {
      duration: +result.duration,
      src: audioController.unmask(result.url),
      vk_id: audioController.vk_id,
      media_id: result.oid + '_' + result.aid,
      full_id: full_id,
      name: result.artist + ' - ' + result.name,
      metadata: audioController.parseMetaData(data),
    })
    if (!audioController.vk_id) {
      logger.error(time(), 'vk id not found')
    }
    if (result.src.indexOf('audio_api_unavailable.mp3') !== -1) {
      logger.error(time(), 'failed to parse audio data', audioController.vk_id, data)
      delete result.src
    }
    result.ext = getExtension(result.src);
    result.filename = `${result.name}${result.ext ? ('.' + result.ext) : ''}`
    logger.info(time(), 'name: ', result.name)
    return result
  },
  /**
   * @param {string} url
   * @return {string}
   */
  unmask: (function () {
    function i() {
      return window.wbopen && ~(window.open + "").indexOf("wbopen")
    }
    function o(t) {
      if (!i() && ~t.indexOf("audio_api_unavailable")) {
        var e = t.split("?extra=")[1].split("#"),
          o = "" === e[1] ? "" : a(e[1]);
        if (e = a(e[0]), "string" != typeof o || !e) return t;
        o = o ? o.split(String.fromCharCode(9)) : [];
        for (var s, r, n = o.length; n--;) {
          if (r = o[n].split(String.fromCharCode(11)), s = r.splice(0, 1, e)[0], !l[s]) return t;
          e = l[s].apply(null, r)
        }
        if (e && "http" === e.substr(0, 4)) return e
      }
      return t
    }
    function a(t) {
      if (!t || t.length % 4 == 1) return !1;
      for (var e, i, o = 0, a = 0, s = ""; i = t.charAt(a++);) i = r.indexOf(i), ~i && (e = o % 4 ? 64 * e + i : i, o++ % 4) && (s += String.fromCharCode(
        255 & e >> (-2 * o & 6)));
      return s
    }
    function s(t, e) {
      var i = t.length,
        o = [];
      if (i) {
        var a = i;
        for (e = Math.abs(e); a--;) e = (i * (a + 1) ^ e + a) % i, o[a] = e
      }
      return o
    }
    var r = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN0PQRSTUVWXYZO123456789+/="
    var l = {
      v: function (t) {
        return t.split("").reverse().join("")
      },
      r: function (t, e) {
        t = t.split("");
        for (var i, o = r + r, a = t.length; a--;) i = o.indexOf(t[a]), ~i && (t[a] = o.substr(i - e, 1));
        return t.join("")
      },
      s: function (t, e) {
        var i = t.length;
        if (i) {
          var o = s(t, e),
            a = 0;
          for (t = t.split(""); ++a < i;) t[a] = t.splice(o[i - 1 - a], 1, t[a])[0];
          t = t.join("")
        }
        return t
      },
      i: function (t, e) {
        return l.s(t, e ^ audioController.vk_id)
      },
      x: function (t, e) {
        var i = [];
        return e = e.charCodeAt(0), each(t.split(""), function (t, o) {
          i.push(String.fromCharCode(o.charCodeAt(0) ^ e))
        }), i.join("")
      }
    }
    return o
  })(),
  /** @param {HTMLElement} node */
  createTip: function (node) {
    var target = node.querySelector('.audio_row__download')
    var full_id = node.getAttribute('data-full-id')
    var props = audioController.getCache(full_id)
    audioController.tooltip.createTip(target, full_id, props)
  },
}

module.exports = audioController

 }),
/* 16 */
 (function(module, exports, __webpack_require__) {

var makeRequest = __webpack_require__(4)
var delay = __webpack_require__(5)
var logger = __webpack_require__(0)
var time = __webpack_require__(1)

/**
 * @param {any} resource
 * @param {string} [name]
 * @param {(loaded: number, total: number) => void} [onprogress]
 * @return {Promise<void | import('./makeRequest').IResponse>}
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
      document.body.removeChild(link)
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

var noop = function () { }

/**
 * @param {() => void} [callback]
 * @return {Promise<void>}
 */
function DOMReady(callback) {
  callback = typeof callback === 'function' ? callback : noop
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    var r = callback()
    return Promise.resolve(r)
  }
  var resolve
  var promise = new Promise(function (res) {
    resolve = res
  })
  document.addEventListener('DOMContentLoaded', function () {
    var r = callback()
    resolve(r)
  })
  return promise
}

module.exports = DOMReady

 }),
/* 18 */
 (function(module, exports, __webpack_require__) {

const jQuery = __webpack_require__(8)
const createElement = __webpack_require__(19);
const { getElementStyle } = __webpack_require__(27);
const { hasClass } = __webpack_require__(28);
__webpack_require__(55)

const ProgressBar = {
  /** @param {HTMLElement | string} elementOrSelector */
  create: function (elementOrSelector) {
    /** @type {HTMLElement} */
    var element = typeof elementOrSelector === 'string' ? document.querySelector(elementOrSelector) : elementOrSelector
    element.style.position = getElementStyle(element).position || 'relative';
    if (!hasClass(element, ['progress-bar'])) {
      element.classList.add('progress-bar')
    }
    /** @type {HTMLElement} */
    var bar = element.querySelector('.progress-bar-animated')
    if (!bar) {
      bar = createElement(`<div class="progress-bar-animated"></div>`)
      element.appendChild(bar)
    }
    return ProgressBar
  },
  /**
   * @param {HTMLElement | string} barOrContainer
   * @param {number} progress
   */
  progress: function (barOrContainer, progress) {
    var container = ProgressBar.findContainer(barOrContainer)
    if (!container) {
      throw new Error('bar container not found')
    }
    container.style.visibility = 'visible'
    container.style.position = getElementStyle(container).position || 'relative';
    container.style.display = 'block'
    container.style.width = parseInt(progress * 100) + '%'
    return ProgressBar
  },
  /**
   * @param {HTMLElement | string} barOrContainer
   * @param {number} [progress]
   */
  show: function (barOrContainer, progress) {
    var container = ProgressBar.findContainer(barOrContainer)
    if (!container) {
      throw new Error('bar container not found')
    }
    container.style.visibility = 'visible'
    container.style.display = 'block'
    if (typeof progress === 'number') {
      container.style.width = parseInt(100 * progress) + '%'
    }
    return ProgressBar
  },
  /**
   * @param {HTMLElement | string} barOrContainer
   */
  hide: function (barOrContainer) {
    var container = ProgressBar.findContainer(barOrContainer)
    if (!container) {
      throw new Error('bar container not found')
    }
    container.style.visibility = 'hidden'
    container.style.display = 'none'
    return ProgressBar
  },
  /**
   * @param {HTMLElement | string} barOrContainer
   * @param {number} [durationMs]
   */
  animate: function (barOrContainer, durationMs) {
    var container = ProgressBar.findContainer(barOrContainer)
    if (!container) {
      throw new Error('bar container not found')
    }
    /** @type {HTMLElement} */
    var bar = container.querySelector('.progress-bar-animated')
    if (!bar) {
      throw new Error('bar not found')
    }
    var stop = () => {
      bar.isAnimating = false
      done = true;
    }
    if (bar.isAnimating) {
      return { stop }
    }
    if (typeof bar.stopAnimation === 'function') {
      try {
        bar.stopAnimation()
      } catch (e) { }
    }
    bar.style.display = 'initial'
    bar.isAnimating
    durationMs = durationMs || 2000
    var startMs
    var durationHalfMs = durationMs / 2
    var done
    var step = (timestampMs) => {
      var isRemoved = !Boolean(jQuery(bar).parents('body')[0])
      if (isRemoved) {
        done = true
        return
      }
      startMs = startMs || timestampMs
      var elapsedMs = timestampMs - startMs
      var position = elapsedMs / durationHalfMs
      var width = container.getBoundingClientRect().width;
      var widthEl = bar.getBoundingClientRect().width;
      var xMax = width - widthEl;
      var x
      if (elapsedMs < durationHalfMs) {
        x = Math.min(xMax, xMax * position)
      } else {
        x = Math.max(0, xMax * (2 - position))
      }
      bar.style.transform = `translateX(${x}px)`
      if (done) {
        return
      }
      if (elapsedMs < durationMs) {
        window.requestAnimationFrame(step)
      } else {
        startMs = timestampMs
        window.requestAnimationFrame(step)
      }
    }
    bar.isAnimating = true
    window.requestAnimationFrame(step)
    bar.stopAnimation = stop
    return { stop }
  },
  /**
   * @param {HTMLElement | string} barOrContainer
   */
  stop: function (barOrContainer) {
    var bar = ProgressBar.findBar(barOrContainer)
    if (!bar) {
      throw new Error('bar not found')
    }
    bar.style.display = 'none'
    if (typeof bar.stopAnimation === 'function') {
      try {
        bar.stopAnimation()
      } catch (e) { }
    }
    return ProgressBar
  },
  /**
   * @param {HTMLElement | string} barOrContainer
   */
  findContainer: function (barOrContainer) {
    barOrContainer = typeof barOrContainer === 'string' ? document.querySelector(barOrContainer) : barOrContainer
    /** @type {HTMLElement} */
    var container = hasClass(barOrContainer, ['progress-bar']) ? barOrContainer : jQuery(barOrContainer).parent('.progress-bar')[0]
    return container
  },
  /**
   * @param {HTMLElement | string} barOrContainer
   */
  findBar: function (barOrContainer) {
    var container = ProgressBar.findContainer(barOrContainer)
    /** @type {HTMLElement | null} */
    var bar = container ? container.querySelector('.progress-bar-animated') : null
    return bar
  },
}

module.exports = { ProgressBar }


 }),
/* 19 */
 (function(module, exports) {

/** @param {string} html */
function createElement(html) {
  var div = document.createElement('div')
  div.innerHTML = (html || '').replace(/\s+/g, ' ').replace(/\r?\n/g, ' ').trim()
  return div.firstElementChild.cloneNode(true)
}

module.exports = createElement

 }),
/* 20 */
 (function(module, exports, __webpack_require__) {

__webpack_require__(56)

var tooltip = {
  /** @type {HTMLElement} */
  target: null,
  /**
   * 
   * @param {HTMLElement} node
   * @param {HTMLElement} content
   * @param {{ left?: boolean, top?: boolean }} [options]
   */
  createTip: function (node, content, options) {
    clearTimeout(tooltip.timerId)
    tooltip.cancelTip()
    tooltip.target = node

    var tooltipWrap = document.createElement('div')
    tooltipWrap.className = 'vkmd-tooltip'
    tooltipWrap.appendChild(content)
    document.body.insertBefore(tooltipWrap, document.body.firstChild)
    tooltip.target.classList.add('tooltip-target-element')

    tooltipWrap.addEventListener('mouseover', tooltip.onMouseOver)
    tooltipWrap.addEventListener('mouseout', tooltip.onMouseOut)

    tooltip.setPosition(options)
    return tooltipWrap
  },
  setPosition: function (options) {
    var tooltipWrap = tooltip.getWrapper()
    var node = tooltip.target
    if (!tooltipWrap || !node) {
      return
    }
    var nodeProps = node.getBoundingClientRect()
    var tooltipProps = tooltipWrap.getBoundingClientRect()
    var top = nodeProps.top - (tooltipProps.height + 10)
    if ((options && options.top) || top < 0) {
      top += (nodeProps.height + tooltipProps.height + 2 * 10)
      top = Math.max(top, 0)
      tooltipWrap.classList.add('vkmd-tooltip-bottom')
    } else {
      tooltipWrap.classList.remove('vkmd-tooltip-bottom')
    }
    tooltipWrap.style.top = top + 'px'
    if (options && options.left) {
      tooltipWrap.classList.add('vkmd-tooltip-left')
      tooltipWrap.style.left = (nodeProps.left - 15 + Math.floor(nodeProps.width / 2)) + 'px'
    } else {
      tooltipWrap.classList.remove('vkmd-tooltip-left')
      tooltipWrap.style.left = (nodeProps.left - tooltipProps.width + 15 + Math.floor(nodeProps.width / 2)) + 'px'
    }
  },
  cancelTip: function (timeout) {
    if (!timeout) {
      return tooltip._cancelTip()
    }
    clearTimeout(tooltip.timerId)
    tooltip.timerId = setTimeout(function () {
      tooltip._cancelTip()
    }, timeout)
  },
  _cancelTip: function () {
    var tooltipWrap = tooltip.getWrapper()
    return tooltipWrap && tooltipWrap.remove()
  },
  isVisible: function () {
    return Boolean(tooltip.getWrapper())
  },
  getWrapper: function () {
    return document.querySelector('.vkmd-tooltip')
  },
  onMouseOver: function (e) {
    clearTimeout(tooltip.timerId)
  },
  onMouseOut: function (e) {
    tooltip.cancelTip(300)
  },
}

module.exports = tooltip

 }),
/* 21 */
 (function(module, exports) {

/** @param {number} size */
var random = function (size = 6) {
  return Math.floor(Math.random() * Math.pow(10, size))
}

module.exports = random

 }),
/* 22 */
 (function(module, exports) {

var link
/**
 * @param {string} url
 * @return {HTMLAnchorElement}
 */
function URLParse(url) {
  link = link || document.createElement('a')
  link.href = url
  return link.cloneNode()
}

module.exports = URLParse

 }),
/* 23 */
 (function(module, exports, __webpack_require__) {

/**
 * @typedef {import("../controllers/videoController").IVideoData} IVideoData
 */

var deepCopy = __webpack_require__(6)

var videoModel = {
  /** @type {{ [x: string]: IVideoData }} */
  state: {},
  /**
   * @param {string} id 
   * @param {IVideoData} data 
   * @return {IVideoData}
   */
  setData: function (id, data) {
    videoModel.state[id] = Object.assign({}, videoModel.state[id], data)
    return videoModel.state[id]
  },
  /**
   * @param {string} id 
   * @return {IVideoData}
   */
  getData: function (id) {
    return videoModel.state[id] || {}
  },
  /**
   * @param {string} id
   * @param {number} q
   * @param {import("../controllers/videoController").IVideoSource} item
   */
  setDataItem: function (id, q, item) {
    var data = videoModel.getData(id)
    data.sources = data.sources || {}
    data.sources[q] = Object.assign({}, data.sources[q], item)
    videoModel.setData(id, deepCopy(data))
  },
  /** @return {import("../controllers/videoController").IVideoSource} */
  getDataItem: function (id, q) {
    var data = videoModel.getData(id)
    return data.sources && data.sources[q] ? data.sources[q] : {}
  },
}

module.exports = videoModel

 }),
/* 24 */
 (function(module, exports, __webpack_require__) {

var time = __webpack_require__(1)
var logger = __webpack_require__(0)
var downloadFile = __webpack_require__(16)
var makeRequest = __webpack_require__(4)
var delay = __webpack_require__(5)
var FFmpeg = __webpack_require__(77)
var Queue = __webpack_require__(35)
var localforage = __webpack_require__(78)
var requestWorker = __webpack_require__(79)
var createWorker = __webpack_require__(80)
var workerFunc = __webpack_require__(81)
var path = __webpack_require__(82)
var fetchImage = __webpack_require__(83)
var base64ToUint8Array = __webpack_require__(36)

var getWindow = function () {
  return typeof unsafeWindow !== 'undefined' ? unsafeWindow : window
}

/**
 * @typedef {{
 *  title?: string;
 *  artist?: string;
 *  album?: string;
 *  comment?: string;
 *  TIT3?: string;
 * }} Metadata
 */

var ffmpegController = {
  worker: createWorker(workerFunc),
  queue: new Queue({ workers: 1, autorun: true }),
  /**
   * @param {string} key
   * @param {Blob} blob
   * @return {Promise<Blob>}
   */
  save: function (key, blob) {
    return localforage.setItem(key, blob).then(function () {
      return localforage.getItem(key)
    })
  },
  fetch: function (url) {
    switch (location.hostname) {
      case 'vk.com':
      case 'm.vk.com':
      case 'vk.ru':
      case 'm.vk.ru':
        return makeRequest({
          method: 'GET',
          url: url,
          responseType: 'blob',
        }, true)
      default:
        return requestWorker(ffmpegController.worker, {
          url: url,
          type: 'blob',
        })
    }
  },
  /**
   * @param {string} key
   * @param {string} url
   * @return {Promise<Blob>}
   */
  request: function (key, url) {
    return localforage.getItem(key).then(function (result) {
      if (result) {
        return result
      }
      return ffmpegController.fetch(url).then(function (response) {
        if (!response.data) {
          throw new Error('failed to fetch resource', key, url, response.problem || response.message, response)
        }
        return ffmpegController.save(key, response.data)
      })
    })
  },
  create: function () {
    if (ffmpegController.ffmpeg) {
      return Promise.resolve(ffmpegController.ffmpeg)
    }
    return Promise.all([
      ffmpegController.request('ffmpeg-core.js', 'https://unpkg.com/@ffmpeg/core@v0.6.0/ffmpeg-core.js'),
      ffmpegController.request('ffmpeg-worker.js', 'https://unpkg.com/@ffmpeg/ffmpeg@v0.6.1/dist/worker.min.js'),
    ]).then(function (blobs) {
      return blobs.map(function (blob) {
        return blob instanceof Blob ? blob : new Blob([blob], { type: 'application/javascript' })
      })
    }).then(function (blobs) {
      var coreUrl = URL.createObjectURL(blobs[0])
      var workerUrl = URL.createObjectURL(blobs[1])
      ffmpegController.ffmpeg = FFmpeg.createWorker({
        logger: function (m) { logger.debug(time(), 'ffmpeg:', m.message) },
        log: true,
        corePath: coreUrl,
        workerPath: workerUrl,
      })
      return ffmpegController.ffmpeg
    }).catch(function (e) {
      logger.error(time(), 'failed to create ffmpeg', e)
      return Promise.reject(e)
    })
  },
  load: function () {
    return ffmpegController.create().then(function (ffmpeg) {
      return ffmpegController.ffmpegLoaded ? Promise.resolve() : ffmpeg.load()
    }).then(function () {
      ffmpegController.ffmpegLoaded = true
      return ffmpegController.ffmpeg
    })
  },
  writeText: function (file, text) {
    return ffmpegController.ffmpeg.writeText(file, text)
  },
  write: function (file, data) {
    return ffmpegController.ffmpeg.write(file, data)
  },
  readText: function (file) {
    return ffmpegController.read(file).then(function (res) {
      return String.fromCharCode.apply(null, new Uint8Array(res.data))
    })
  },
  read: function (file) {
    return ffmpegController.ffmpeg.read(file)
  },
  /**
   * @param {{ name: string; data: Buffer; }[]} files 
   * @param {string} [dir]
   */
  writeFiles: function (files, dir) {
    var ffmpeg = ffmpegController.ffmpeg
    return files.reduce(function (p, f) {
      return p.then(function () {
        logger.debug(time(), 'ffmpeg: write', path.join(dir, f.name))
        return ffmpeg.write(path.join(dir, f.name), new Uint8Array(f.data))
      })
    }, Promise.resolve())
  },
  /**
   * @param {Array<{ name: string } | string>} files 
   * @param {string} [dir]
   */
  removeFiles: function (files, dir) {
    var ffmpeg = ffmpegController.ffmpeg
    return files.reduce(function (p, f) {
      return p.then(function () {
        var name = typeof f == 'string' ? f : f.name
        logger.debug(time(), 'ffmpeg: remove', path.join(dir, name))
        return name ? ffmpeg.remove(path.join(dir, name)) : Promise.resolve()
      })
    }, Promise.resolve())
  },
  removeFilesAll: function () {
    var ffmpeg = ffmpegController.ffmpeg
    return ffmpeg.ls('./').then(function (result) {
      var files = result.data.filter(function (name) {
        return name.match(/[^.]+\.[^.]+$/)
      })
      return ffmpegController.removeFiles(files)
    })
  },
  /**
   * @param {string[]} fileNames
   * @param {string} outputFile
   * @param {string} [options]
   */
  concatFiles: function (fileNames, outputFile, options) {
    var ffmpeg = ffmpegController.ffmpeg
    getWindow().ffmpeg = ffmpeg
    return Promise.race([
      ffmpeg.concatDemuxer(fileNames, outputFile, options),
      delay(45 * 1000).then(function () {
        logger.debug(time(), 'ffmpeg concat error (concat timeout)')
        throw new Error('ffmpeg concat timeout')
      }),
    ])
  },
  /**
   * @param {import('./audioController').IAudioMetaData} metadata
   * @param {string} artistsSep
   */
  formatMetadata: function (metadata, artistsSep = ',') {
    var options = {
      title: metadata.title || '',
      artist: metadata.artists.join(artistsSep),
      TIT3: metadata.subTitle || '',
    }
    return Object.keys(options).reduce(function (acc, cur) {
      if (options[cur].trim()) {
        acc[cur] = options[cur].trim()
      }
      return acc
    }, {})
  },
  addCover: function (inputFile, url, outputFile) {
    var ffmpeg = ffmpegController.ffmpeg
    var metadataFile = 'v_metadata.txt', coverFile
    if (!url) {
      return ffmpeg.run(`-i ${inputFile} -c copy ${outputFile}`)
    }
    return fetchImage(url).then(function (image) {
      coverFile = 'cover.' + image.mime.split('/')[1]
      return ffmpeg.write(coverFile, base64ToUint8Array(image.base64))
    }).then(function () {
      return ffmpeg.writeText(metadataFile, `;FFMETADATA1\ncomment=Cover (front)\n`)
    }).then(function () {
      return ffmpeg.run(`-i ${inputFile} -i ${coverFile} -i ${metadataFile} -c copy -map 0:0 -map 1:0 -id3v2_version 3 -map_metadata:s:1 2 ${outputFile}`)
    }).catch(function (e) {
      logger.debug(time(), 'ffmpeg: addCover error', e)
      return ffmpeg.run(`-i ${inputFile} -c copy ${outputFile}`)
    })
  },
  /**
   * @param {string} inputFile 
   * @param {Metadata} metadata 
   * @param {string} outputFile 
   */
  addMetadata: function (inputFile, metadata, outputFile) {
    var ffmpeg = ffmpegController.ffmpeg
    var metadataFile = `metadata_${Math.floor(Math.random() * 1e4)}.txt`
    return ffmpeg.run(`-i ${inputFile} -f ffmetadata ${metadataFile}`).then(function () {
      return ffmpegController.readText(metadataFile)
    }).then(function (text) {
      for (var key of Object.keys(metadata)) {
        text = `${text}${key}=${metadata[key]}\n`
      }
      return ffmpeg.writeText(metadataFile, text)
    }).then(function () {
      return ffmpeg.run(`-i ${inputFile} -i ${metadataFile} -map_metadata 1 -c copy ${outputFile}`)
    })
  },
  download: function (inputFile, filename) {
    var ffmpeg = ffmpegController.ffmpeg
    var url
    return ffmpeg.read(inputFile).then(function (res) {
      url = URL.createObjectURL(new Blob([res.data]))
      return downloadFile(url, filename)
    }).then(function () {
      URL.revokeObjectURL(url)
    })
  },
  /**
   * @param {{
   *  filename: string;
   *  ext: string;
   *  fragments: {
   *    name: string;
   *    data: Buffer;
   *  }[];
   *  metadata: import('./audioController').IAudioMetaData;
   * }} data 
   */
  concat: function (data) {
    var fragmentNames = data.fragments.map(function (f) { return f.name })
    var files = data.fragments.map(function (f) { return { name: f.name, data: f.data }; })
    return ffmpegController.load().then(function () {
      return ffmpegController.writeFiles(files)
    }).then(function () {
      return ffmpegController.concatFiles(fragmentNames, `output.${data.ext}`, '-c copy')
    }).then(function () {
      return data.metadata ? ffmpegController.addMetadata(`output.${data.ext}`, ffmpegController.formatMetadata(data.metadata), `output_a.${data.ext}`) : null
    }).then(function () {
      return data.metadata ? ffmpegController.addCover(`output_a.${data.ext}`, data.metadata.cover_p || data.metadata.cover_s, `output_b.${data.ext}`) : null
    }).then(function () {
      return ffmpegController.download(`output${data.metadata ? '_b' : ''}.${data.ext}`, data.filename)
    }).then(function () {
      return ffmpegController.removeFilesAll()
    })
  },
  /**
   * @param {{
   *  filename?: string;
   *  payload: Buffer;
   *  ext: string;
   *  metadata: import('./audioController').IAudioMetaData
   * }} data
   * @return {Promise<Buffer>}
   */
  metadata: function (data) {
    var result
    return ffmpegController.load().then(function () {
      return ffmpegController.write(`input.${data.ext}`, data.payload)
    }).then(function () {
      return ffmpegController.addMetadata(`input.${data.ext}`, ffmpegController.formatMetadata(data.metadata), `output.${data.ext}`)
    }).then(function () {
      return ffmpegController.addCover(`output.${data.ext}`, data.metadata.cover_p || data.metadata.cover_s, `output_b.${data.ext}`)
    }).then(function () {
      if (!data.filename) return Promise.resolve()
      return ffmpegController.download(`output_b.${data.ext}`, data.filename)
    }).then(function () {
      return ffmpegController.read(`output_b.${data.ext}`)
    }).then(function (res) {
      result = res
      return ffmpegController.removeFilesAll()
    }).then(function () {
      return result.data
    })
  },
  /**
   * @param {{
   *  payload: Buffer;
   *  ext: string;
   *  metadata: import('./audioController').IAudioMetaData
   * }} data
   */
  queueMetadata: function (data) {
    var resolve, reject;
    var promise = new Promise(function (res, rej) { resolve = res; reject = rej; })
    ffmpegController.queue.add({
      onSuccess: function (buffer) {
        resolve(Object.assign({}, data, { payloadWithMetadata: buffer }))
      },
      onError: function (e) {
        reject(Object.assign({ error: e }, data))
      },
      run: function () {
        return ffmpegController.metadata(data)
      },
    })
    return promise;
  },
  /**
   * @param {{
   *  filename: string;
   *  ext: string;
   *  fragments: {
   *    name: string;
   *    data: Buffer;
   *  }[];
   *  metadata: import('./audioController').IAudioMetaData;
   * }} data 
   */
  queueConcat: function (data) {
    var resolve, reject;
    var promise = new Promise(function (res, rej) { resolve = res; reject = rej; })
    ffmpegController.queue.add({
      onSuccess: function () {
        resolve(Object.assign({}, data, { fragments: null }))
      },
      onError: function (e) {
        reject(Object.assign({ error: e }, data, { fragments: null }))
      },
      run: function () {
        return ffmpegController.concat(data)
      },
    })
    return promise;
  },
}

module.exports = ffmpegController

 }),
/* 25 */
 (function(module, exports, __webpack_require__) {

var jQuery = __webpack_require__(8)
var UTLToolkit = __webpack_require__(34)
var getExtension = __webpack_require__(11)
var logger = __webpack_require__(0)
var makeRequest = __webpack_require__(4)
var smartSize = __webpack_require__(9)
var time = __webpack_require__(1)
var toUrlEncoded = __webpack_require__(32)
var hlsController = __webpack_require__(33)
var videoModel = __webpack_require__(23)
var eventEmitter = __webpack_require__(2)
var downloadManager = __webpack_require__(38)
var settingsModel = __webpack_require__(7)
var deepCopy = __webpack_require__(6)
var videoTooltip = __webpack_require__(29)
var delay = __webpack_require__(5)
var iframeChannel = __webpack_require__(12)
var normalizeFilename = __webpack_require__(39)
var random = __webpack_require__(21)
const { mainOrigin } = __webpack_require__(40)

/**
 * @typedef {import('../utils/makeRequest').IResponse} IResponse
 * 
 * @typedef {{
 *  full_id: string;
 *  name: string;
 *  author: string;
 *  hls?: string;
 *  hls_raw?: string;
 *  duration: number;
 *  qualities: number[];
 *  sources: { [x: string]: IVideoSource }
 *  levels?: { [x: string]: import('./hlsController').IVideoLevel}
 *  data_fetching?: boolean;
 *  data_error?: any;
 *  size_fetching?: boolean;
 *  size_error?: any;
 * }} IVideoData
 * 
 * @typedef {{
 *  url: string;
 *  q: number;
 *  ext: string;
 *  hls?: string;
 *  hls_size?: number;
 *  size?: number;
 *  bitrate?: number;
 *  downloading?: boolean;
 *  download_error?: any;
 * }} IVideoSource
 */

var videoController = {
  model: videoModel,
  register: function () {
    eventEmitter.on('video_data_request', function (id) {
      videoModel.setData(id, { data_fetching: true, data_error: null })
    })
    eventEmitter.on('video_size_request', function (id) {
      videoModel.setData(id, { size_fetching: true, size_error: null })
    })
    eventEmitter.on('video_data_success', function (id, data) {
      videoModel.setData(id, Object.assign({}, data, { data_fetching: false, data_error: null }))
    })
    eventEmitter.on('video_data_failure', function (id, error) {
      videoModel.setData(id, { data_fetching: false, data_error: error })
    })
    eventEmitter.on('video_size_success', function (id, data) {
      videoModel.setData(id, Object.assign({}, data, { size_fetching: false, size_error: null }))
    })
    eventEmitter.on('video_size_failure', function (id, error) {
      videoModel.setData(id, { size_fetching: false, size_error: error })
    })
    eventEmitter.on('video_download_request', function (id, q) {
      videoModel.setDataItem(id, q, { downloading: true, download_error: null })
    })
    eventEmitter.on('video_download_success', function (id, q) {
      videoModel.setDataItem(id, q, { downloading: false, download_error: null })
    })
    eventEmitter.on('video_download_failure', function (id, q, error) {
      videoModel.setDataItem(id, q, { downloading: false, download_error: error })
    })
  },
  /**
   * @param {string} id
   */
  fetchData: function (id) {
    var vd = videoModel.getData(id)
    if (vd.name) {
      return Promise.resolve(vd)
    }
    if (vd.data_fetching) {
      return Promise.reject('data already fetching')
    }
    logger.debug(time(), 'video fetch data', id)
    eventEmitter.emit('video_data_request', id)
    return videoController.requestData(id).then(function (data) {
      eventEmitter.emit('video_data_success', id, data)
      logger.info(time(), 'name:', data.name)
      return data
    }).catch(function (error) {
      logger.error(time(), 'video fetch data error', id, error)
      eventEmitter.emit('video_data_failure', id, error)
      return videoModel.getData(id)
    })
  },
  /**
   * @param {string} id 
   * @return {Promise<IVideoData>}
   */
  requestData: function (id) {
    return makeRequest({
      method: 'POST',
      url: mainOrigin() + '/al_video.php', // https://vk.com/al_video.php
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
      },
      data: toUrlEncoded({
        act: 'show', al: 1, al_d: 0, autoplay: 0, list: '', module: '', video: id || '',
      }),
    })
      .then(videoController.parseResponse)
      .then(videoController.fetchHLSPlaylist)
      .then(function (response) { return response.data })
  },
  /** @param {{ size: number; duration: number }} res */
  extractSize: function (res) {
    return res.size
  },
  fetchSize: function (id) {
    var vdata = videoModel.getData(id)
    if (
      vdata.name
      && vdata.sources
      && Object.keys(vdata.sources).every(function (q) {
        return vdata.sources[q].size
      })
    ) {
      return Promise.resolve(vdata)
    }
    if (vdata.size_fetching) {
      return Promise.reject('size is already fetching')
    }
    logger.debug(time(), 'video fetch size', id, vdata)
    eventEmitter.emit('video_size_request', id)
    return videoController.fetchData(id).then(function (data) {
      var promises = data.qualities.map(function (q) {
        var source = data.sources[q]
        return !source.url && source.hls ? hlsController.fetchSize(source.hls).then(videoController.extractSize) : videoController.fetchSizeMP4(source.url, id, q)
      })
      return Promise.all(promises)
    }).then(function (sizes) {
      var data = videoModel.getData(id)
      data.qualities.forEach(function (q, i) {
        data.sources[q].size = sizes[i]
      })
      logger.info(time(), 'size: ', data.qualities.reduce(function (acc, q) {
        acc[q] = data.sources[q].size
        return acc
      }, {}))
      eventEmitter.emit('video_size_success', id, data)
      return data
    }).catch(function (error) {
      logger.error(time(), 'video fetch size error', id, error)
      eventEmitter.emit('video_size_failure', id, error)
      return videoModel.getData(id)
    })
  },
  /**
   * 
   * @param {number} [begin]
   * @param {number} [end]
   */
  fetchDataAll: function (begin, end) {
    begin = begin || 0
    end = end || undefined
    var selectors = ['.video_box_wrap', '.video_item', '.mv_playlist', '.mv_info_narrow_column']
    var videos = jQuery(selectors.join(', ')).slice(begin, end)
    var full_ids_all = videos.map(function (_, element) {
      return jQuery(element).attr('data-id')
    })
    var delay300 = function () { return delay(300) }
    logger.debug(time(), 'fetch video data all', full_ids_all)
    var ids = []
    for (var i = 0; i < full_ids_all.length; i += 10) {
      ids.push(full_ids_all.slice(i, i + 10))
    }
    return ids.reduce(function (promise, full_ids) {
      return promise.then(function () {
        var promises = full_ids.map(function (full_id) {
          return videoController.fetchData(full_id).catch(function () { })
        })
        return Promise.all(promises).then(delay300)
      })
    }, Promise.resolve());
  },
  /**
   * 
   * @param {string} id
   * @param {number} q
   * @param {(loaded: number, total: number) => void} [onprogress]
   */
  download: function (id, q, onprogress) {
    var data = videoModel.getData(id)
    var item = videoModel.getDataItem(id, q)
    if (item.downloading) {
      return Promise.reject('already downloading')
    }
    logger.debug(time(), 'video download', id, q, item)
    eventEmitter.emit('video_download_request', id, q)
    var onProgressEvent = function (loaded, total) {
      eventEmitter.emit('video_download_progress', id, q, (loaded || 0) / (total || 1))
      onprogress && onprogress(loaded, total)
    }
    var promise = Promise.reject()
    var name = videoController.getName(data.name, item.q)
    if (!item.url && item.hls) {
      promise = hlsController.download({ url: item.hls, name: name, media: 'video' }, onProgressEvent)
    }
    if (item.url) {
      var options = { blobMaxSize: settingsModel.getValue('blob-max-size') }
      var details = videoController.getDownloadDetails(Object.assign({}, item, data, { name: name }), onProgressEvent)
      promise = downloadManager.download(details, options)
    }
    return promise.then(function () {
      eventEmitter.emit('video_download_success', id, q)
    }).catch(function (error) {
      logger.error(time(), 'video download error', id, error)
      eventEmitter.emit('video_download_failure', id, q, error)
    })
  },
  /**
   * @param {string} name
   * @param {number} q
   * @return {string}
   */
  getName: function (name, q) {
    var add_res = settingsModel.getValue('video-resolution-add')
    var options = settingsModel.options.reduce(function (acc, option) {
      if (option.name && option.name.length === 1) {
        acc[option.name] = option.getValue()
      }
      return acc
    }, {})
    var norm_name = normalizeFilename(name, options)
    return add_res ? `${norm_name}.${q}p` : norm_name
  },
  /**
   * @param {IVideoSource} item
   * @param {(loaded: number, total: number) => void} [onprogress]
   */
  getDownloadDetails: function (item, onprogress) {
    return {
      url: item.url,
      id: item.full_id,
      name: item.name,
      filename: `${item.name}.${item.ext || 'mp4'}`,
      ext: item.ext || 'mp4',
      size: item.size,
      onProgress: onprogress,
    }
  },
  /**
   * @param {string} url
   * @param {string} [full_id]
   * @param {number} [q]
   * @return {Promise<number>}
   */
  fetchSizeMP4: function (url, full_id, q) {
    return makeRequest({
      method: 'HEAD',
      url: url,
      headers: {
        'Referer': location.href,
      },
    }, true).then(function (response) {
      return response.ok ? response : iframeChannel.request({
        event: 'video_size',
        url: url,
        id: full_id && q ? `${full_id}-${q}` : random(),
      })
    }).then(function (response) {
      var size = videoController.parseSize(response)
      logger.debug(time(), 'size: ', smartSize(size), full_id, q)
      return size
    })
  },
  parseSize: function (response) {
    if (response.ok) {
      var contentLength = response.headers['content-length']
      return contentLength ? parseInt(contentLength, 10) : -1
    }
    return -1
  },
  /** @return {IResponse & { data: IVideoData }} */
  parseResponse: function (response) {
    var headers = response.headers
    if (headers['content-type'] && headers['content-type'].indexOf('application/json') !== -1) {
      response = videoController.parseJSON(response)
    } else {
      response = videoController.parseXML(response)
    }
    if (response.ok) {
      response = videoController.parseVideoData(response)
    }
    if (!response.ok) {
      throw response
    }
    return response
  },
  parseJSON: function (response) {
    var rawData = response.rawData
    // json
    var payload
    var res = JSON.parse(rawData, function (key, val) {
      if (key === 'payload') {
        payload = val
      }
      return val
    })
    payload = Array.isArray(payload) ? payload : res.payload
    if (Array.isArray(payload)) {
      return Object.assign({}, response, { data: payload[1] })
    } else {
      return Object.assign({}, response, { ok: false, problem: 'Response is not iterable' })
    }
  },
  parseXML: function (response) {
    var rawData = response.rawData
    // xml
    var results = [];
    var idx = rawData.indexOf('<!json>');
    var idx2 = idx === -1 ? -1 : rawData.indexOf('<!>', idx + 7)
    while (idx !== -1 && idx2 !== -1) {
      results.push(JSON.parse(rawData.slice(idx + 7, idx2)));
      idx = rawData.indexOf('<!json>', idx2);
      idx2 = idx === -1 ? -1 : rawData.indexOf('<!>', idx + 7)
    }
    return Object.assign({}, response, { data: results })
  },
  parseVideoData: function (response) {
    var data = response.data.find(function (item) {
      return item && item.is_vk_player !== undefined
    })
    if (!data) {
      return Object.assign({}, response, { ok: false, problem: 'video data not found' })
    }
    if ((data.player && data.player.type != 'vk') || !data.is_vk_player) {
      return Object.assign({}, response, { ok: false, problem: 'not vk video' })
    }
    var video = videoController.parsePlayer(data.player)
    video = videoController.parseURLs(video)
    video = videoController.parseHLS(video)
    return Object.assign({}, response, { data: video })
  },
  /** @return {IVideoData} */
  parsePlayer: function (player) {
    var params = player.params[0]
    var keys = Object.keys(params).filter(function (key) {
      return key.match(/url(\d+)/) || key.match(/cache(\d+)/)
    })
    keys.push('duration', 'hls', 'hls_raw')
    var data = {
      full_id: params.oid + '_' + params.vid,
      name: params.md_title,
      author: params.md_author,
      vk_id: params.viewer_id,
    }
    for (var key of keys) {
      data[key] = params[key];
    }
    return data
  },
  /**
   * @param {IVideoData} data
   * @return {IVideoData}
   */
  parseURLs: function (data) {
    data.qualities = []
    for (var key of Object.keys(data)) {
      var match = key.match(/url(\d+)/) || key.match(/cache(\d+)/)
      match && data.qualities.push(+match[1])
    }
    data.qualities = data.qualities.filter(function (qu, idx, arr) {
      return arr.indexOf(qu) === idx
    }).sort(function (a, b) {
      return a - b
    })
    data.sources = data.qualities.reduce(function (acc, q) {
      var url = data['cache' + q] || data['url' + q]
      acc[q] = { url: url, q: q, ext: getExtension(url) }
      return acc
    }, {})
    return data
  },
  /**
   * @param {IResponse} response
   * @return {Promise<IResponse & { data: IVideoData }>}
   */
  fetchHLSPlaylist: function (response) {
    if (!response.ok) {
      return Promise.resolve(response)
    }
    /** @type {IVideoData} */
    var data = response.data
    if (!data.hls || data.hls_raw) {
      return Promise.resolve(response)
    }
    return hlsController.fetchPlaylist(data.hls).then(function (hls_raw) {
      data.hls_raw = hls_raw
      data = videoController.parseHLS(data)
      return Object.assign({}, response, { data: data })
    }).catch(function (error) {
      logger.warn(time(), 'fetch hls playlist error', error)
      return response
    })
  },
  /**
   * @param {IVideoData} data
   * @return {IVideoData}
   */
  parseHLS: function (data) {
    if (!data.hls_raw) {
      logger.debug(time(), 'parseHLS: hls_raw not found')
      return data
    }
    data.levels = hlsController.parseMasterPlaylist(data.hls_raw)
    var bitrates = Object.keys(data.levels).map(Number)
    bitrates.forEach(function (bitrate) {
      var level = data.levels[bitrate]
      var q = data.qualities.reduce(function (acc, cur) {
        return Math.abs(acc - level.height) > Math.abs(cur - level.height) ? cur : acc
      }, -1e9)
      q = q && q > 0 && Math.abs(q - level.height) < level.height * 0.34 ? q : level.height
      data.sources[q] = data.sources[q] || { q: q }
      data.sources[q].hls = UTLToolkit.buildAbsoluteURL(data.hls, level.url)
      data.sources[q].bitrate = bitrate
      data.sources[q].hls_size = Math.floor(bitrate * data.duration / 8)
    })
    data.qualities = Object.keys(data.sources).map(Number).sort(function (a, b) {
      return b - a
    })
    return data
  },
  /**
   * 
   * @param {string} id
   * @param {HTMLElement} target
   * @param {{ left?: boolean }} [options]
   */
  onOpenTooltip: function (id, target, options) {
    return videoController.fetchData(id).then(function () {
      return videoController.fetchSize(id)
    }).then(function (data) {
      videoTooltip.createTip(target, data, options)
    })
  },
  onDownload: function (id) {
    return videoController.fetchData(id).then(function (data) {
      return videoController.download(data.full_id, Math.max.apply(Math.max, data.qualities))
    })
  },
}

module.exports = videoController

 }),
/* 26 */
 (function(module, exports) {

function smartBitrate(size, duration, minimize = false) {
  if (!duration || !size) {
    return '-- kbps'
  }
  var rate = size / duration
  var bitrate = rate * 8 / (1024)
  if (minimize) {
    return `${Math.floor(bitrate)} kbps`
  }
  return `~${Math.floor(bitrate)} kbps ${bitrate > 300 ? 'HD' : ''}`.trim()
}

module.exports = smartBitrate

 }),
/* 27 */
 (function(module, exports) {

/**
 * @param {HTMLElement} element
 * @returns {null | ReturnType<typeof window['getComputedStyle']>}
 */
function getElementStyle(element) {
  if (!element) {
    return null
  }
  if (typeof window.getComputedStyle === 'function') {
    return window.getComputedStyle(element)
  }
  return element.currentStyle
}

module.exports = { getElementStyle }


 }),
/* 28 */
 (function(module, exports) {

/**
 * @param {HTMLElement} element 
 * @param {string[]} classes 
 */
function hasClass(element, classes) {
  var retval = 0
  for (var c of classes) {
    retval += Boolean(element && element.nodeType === 1 && element.classList.contains(c))
  }
  return Boolean(retval)
}

module.exports = { hasClass }


 }),
/* 29 */
 (function(module, exports, __webpack_require__) {

var jQuery = __webpack_require__(8)
var deepCopy = __webpack_require__(6)
var eventEmitter = __webpack_require__(2)
var i18n = __webpack_require__(3)
var logger = __webpack_require__(0)
var smartSize = __webpack_require__(9)
var time = __webpack_require__(1)
const { ProgressBar } = __webpack_require__(18)
var tooltip = __webpack_require__(20)

__webpack_require__(58)

/**
 * @typedef {{
 *  full_id: string;
 *  content?: JQuery<HTMLElement>;
 *  onDownload?: (q: number) => void;
 * }} IVideoTip
 * 
 * @typedef {import('../model/videoModel').IVideoData} IVideoData
 */

var videoTooltip = {
  /** @type {{ [x: string]: IVideoTip }} */
  tips: {},
  /** @type {import('../controllers/videoController')} */
  controller: null,
  /** @type {import('../model/videoModel')} */
  model: null,
  /** @param {import('../model/videoModel')} model */
  setModel: function (model) {
    videoTooltip.model = model
  },
  /** @type {import('../model/settingsModel')} */
  settings: null,
  setSettingsModel: function (settings) {
    videoTooltip.settings = settings
  },
  /**
   * @param {{
   *  controller: import('../controllers/videoController');
   *  model: import('../model/videoModel');
   *  settings: import('../model/settingsModel');
   * }} options 
   */
  init: function (options) {
    videoTooltip.setController(options.controller)
    videoTooltip.setModel(options.model)
    videoTooltip.setSettingsModel(options.settings)
    videoTooltip.register()
  },
  /** @param {import('../controllers/videoController')} controller */
  setController: function (controller) {
    videoTooltip.controller = controller
  },
  register: function () {
    eventEmitter.on('video_data_success', videoTooltip.updateTip)
    eventEmitter.on('video_size_success', videoTooltip.onSize)
    eventEmitter.on('video_download_progress', videoTooltip.onProgress)
    eventEmitter.on('video_download_success', videoTooltip.onDownloadSuccess)
  },
  /** @param {string} full_id */
  getTip: function (full_id) {
    var tip = videoTooltip.tips[full_id] || { full_id: full_id }
    videoTooltip.tips[full_id] = videoTooltip.tips[full_id] || tip
    return tip
  },
  /**
   * @param {string} full_id
   * @param {IVideoData} props
   */
  updateTip: function (full_id, props) {
    var tip = videoTooltip.getTip(full_id)
    if (tip.content) {
      jQuery('.vkmd-video-name', tip.content).text(props.name || '--- -------- --- ------ --')
      videoTooltip.updateSize(full_id, props)
      tooltip.setPosition()
      var show_name = videoTooltip.settings.getValue('video-tooltip-name')
      videoTooltip.show(tip, '.vkmd-video-name', show_name)
    }
  },
  /**
   * @param {string} full_id
   * @param {IVideoData} props
   */
  updateSize: function (full_id, props) {
    var tip = videoTooltip.getTip(full_id)
    if (!tip.content) {
      return
    }
    jQuery('.vkmd-video-source', tip.content).each(function (_, element) {
      var q = jQuery(element).attr('data-quality')
      jQuery(element).attr('title', props.name)
      var source = props.sources[q]
      jQuery(element).attr('data-size', source.size || '0')
      jQuery('.vkmd-video-size', element).text(source.size ? smartSize(source.size) : '-- MiB')
    })
  },
  /**
   * @param {sting} full_id 
   * @param {number[]} [sizes]
   */
  onSize: function (full_id, sizes) {
    var data = videoTooltip.model.getData(full_id)
    videoTooltip.updateTip(full_id, data)
  },
  /**
   * @param {HTMLElement} target
   * @param {IVideoData} props
   * @param {{ left?: boolean }} [options]
   * @return {HTMLElement}
   */
  createTip: function (target, props, options) {
    var show_video = videoTooltip.settings.getValue('video-tooltip-show')
    if (!show_video) {
      return
    }
    var full_id = props.full_id
    var tip = videoTooltip.getTip(full_id)
    tip.onDownload = tip.onDownload || function (e) {
      videoTooltip.onDownload(e, full_id)
    }
    tip.content = tip.content || jQuery(videoTooltip.createTipHTML(props))
    jQuery('.vkmd-video-name', tip.content).on('click', tip.onDownload)
    jQuery('.vkmd-video-source', tip.content).on('click', tip.onDownload)
    videoTooltip.updateTip(full_id, props)
    return tooltip.createTip(target, tip.content[0], options)
  },
  /**
   * @param {Event} e
   * @param {string} [full_id]
   */
  onDownload: function (e, full_id) {
    full_id = full_id || jQuery(e.currentTarget).parent('[data-full-id]').attr('data-full-id')
    if (!full_id) {
      logger.error(time(), 'on video download: can not find full_id', e.currentTarget)
      return
    }
    var q = jQuery(e.currentTarget).attr('data-quality')
    var data = videoTooltip.model.getData(full_id)
    q = q ? Number(q) : Math.max.apply(Math.max, data.qualities)
    if (!q) {
      logger.error(time(), 'on video download: can not find video quality', data)
      return
    }
    videoTooltip.controller.download(full_id, q)
  },
  onProgress: function (full_id, q, progress) {
    var tip = videoTooltip.getTip(full_id)
    if (!tip || !tip.content) {
      return
    }
    var bar = jQuery('.vkmd-video-progress[data-q="' + q + '"]', tip.content)
    ProgressBar.create(bar[0]).progress(bar[0], progress)
    if (progress >= 0.95) {
      ProgressBar.create(bar[0]).animate(bar[0])
    }
  },
  onDownloadSuccess: function (full_id, q) {
    var tip = videoTooltip.getTip(full_id)
    if (tip && tip.content) {
      var bar = jQuery('.vkmd-video-progress[data-q="' + q + '"]', tip.content)
      ProgressBar.create(bar[0]).hide(bar[0]).stop(bar[0])
    }
  },
  /**
   * @param {IVideoData} data 
   */
  createTipHTML: function (data) {
    return `
    <div class="vkmd-video-tooltip" data-full-id="${data.full_id}">
      <div class="vkmd-video-name" title="${i18n.text('DOWNLOAD')}"></div>
      <div class="vkmd-video-items">
        ${data.qualities.map(function (q) { return videoTooltip.createTipItemHTML(data, q) }).join('')}
      </div>
    </div>`
  },
  /**
   * 
   * @param {IVideoData} data
   * @param {number} q
   */
  createTipItemHTML: function (data, q) {
    var source = data.sources[q]
    return `
    <div class="vkmd-video-source" data-quality="${q}" data-size="${source.size || '0'}">
      <span class="vkmd-video-content">
        <span class="vkmd-video-quality">${q}p</span>
        <span class="vkmd-video-size-container">
          <span class="vkmd-video-separator">/</span>
          <span class="vkmd-video-size">${source.size ? smartSize(source.size) : '-- MiB'}</span>
        </span>
      </span>
      <div class="vkmd-video-progress" data-q="${q}" data-id="${data.full_id}"></div>
    </div>
    `
  },
  /** 
   * @param {IAudioTip} tip
   * @param {string} selector
   * @param {boolean} show
   */
  show: function (tip, selector, show) {
    var element = tip.content[0].querySelector(selector)
    if (show) {
      element.classList.remove('removed')
    } else {
      element.classList.add('removed')
    }
  },
  /** @param {number} [timeout] */
  cancelTip: function (timeout) {
    return tooltip.cancelTip(timeout)
  },
}

module.exports = videoTooltip

 }),
/* 30 */
 (function(module, exports) {

function isEqual(value, other) {
  if (value === other) {
    return true
  }
  var type = Object.prototype.toString.call(value)
  if (type !== Object.prototype.toString.call(other)) {
    return false
  }
  if (type === '[object Function]') {
    return value.toString() === value.toString()
  }
  if (['[object Array]', '[object Object]'].indexOf(type) < 0) {
    return false
  }
  var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length
  var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length
  if (valueLen !== otherLen) {
    return false
  }
  for (var key of Object.keys(value)) {
    if (!isEqual(value[key], other[key])) {
      return false
    }
  }
  return true
}

module.exports = isEqual

 }),
/* 31 */
 (function(module, exports) {

/**
 * @return {boolean | undefined}
 */
function isQuteBrowser() {
  if (typeof window._qute_gm_window_proxy != 'undefined') {
    return true
  }
  return isQuteBrowser._is_qute_browser
}
isQuteBrowser._is_qute_browser = undefined

module.exports = isQuteBrowser

 }),
/* 32 */
 (function(module, exports) {

var toUrlEncoded = function (data) {
  return typeof data === 'string' ? data : Object.keys(data).reduce(function (acc, key) {
    if (data[key] !== undefined) {
      acc.push(key + '=' + encodeURIComponent(data[key]))
    }
    return acc
  }, []).join('&')
}

module.exports = toUrlEncoded

 }),
/* 33 */
 (function(module, exports, __webpack_require__) {

var Hls = __webpack_require__(70)
var URLToolkit = __webpack_require__(34)
var logger = __webpack_require__(0)
var makeRequest = __webpack_require__(4)
var time = __webpack_require__(1)
var smartSize = __webpack_require__(9)
var Queue = __webpack_require__(35)
var crypto = __webpack_require__(73)
var alphanum = __webpack_require__(74)
var getExtension = __webpack_require__(11)
var JSZip = __webpack_require__(75)
var platform = __webpack_require__(76)
var downloadFile = __webpack_require__(16)
var base64ToUint8Array = __webpack_require__(36)
var pad = __webpack_require__(37)
var iframeChannel = __webpack_require__(12)
var delay = __webpack_require__(5)
var settingsModel = __webpack_require__(7)
var info = __webpack_require__(10)
var ffmpegController = __webpack_require__(24)

function noop() { }

/**
 * @typedef {{
 *  url: string;
 *  name: string;
 *  width: number;
 *  height: number;
 * }} IVideoLevel
 */

var hlsController = {
  MP2T_SIZE_FACTOR: 0.915,
  MASTER_PLAYLIST_REGEX: /#EXT-X-STREAM-INF:([^\n\r]*)[\r\n]+([^\r\n]+)/g,
  DECIMAL_RESOLUTION_REGEX: /^(\d+)x(\d+)$/,
  ATTR_LIST_REGEX: /\s*(.+?)\s*=((?:\".*?\")|.*?)(?:,|$)/g,
  SOURCE_EXTENSION_REGEX: /\.([a-z\-0-9]+)$/,
  /**
   * 
   * @param {{
   *  url: string;
   *  media: 'audio' | 'video';
   *  name: string;
   *  metadata?: import('./audioController').IAudioMetaData
   * }} data
   * @param {(loaded: number, total: number) => void} [onprogress]
   */
  download: function (data, onprogress = noop) {
    var hls = new Hls()
    hls.loadSource(data.url)
    return hlsController.levelLoaded(hls).then(function () {
      var details = hlsController.getDetails(hls)
      var results = []
      var tasks = hlsController.createDownloadTasks(details.fragments, results, onprogress)
      var queue = new Queue({ retry: 5, workers: 10 })
      queue.add(tasks)
      return queue.run().then(function () {
        var promises = results.map(function (fragment) {
          return hlsController.decryptFragment(fragment)
        })
        return Promise.all(promises)
      }).then(function (fragments) {
        fragments = fragments.sort(function (a, b) { return a.segmentNumber - b.segmentNumber })
        var ext = data.media == 'audio' ? 'mp3' : 'mp4'
        return hlsController.saveFragments({ fragments: fragments, name: data.name, ext: ext, metadata: data.metadata })
      }).catch(function (error) {
        logger.error(time(), 'failed to download hls, error = ', error)
        return Promise.reject(error.error || error)
      })
    })
  },
  saveFragments: function (data) {
    var fragments = data.fragments,
      name = data.name
    var ffmpegEnabled = settingsModel.getValue('ffmpeg-enable')
    var ffmpegMaxSize = settingsModel.getValue('ffmpeg-max-size')
    var size = fragments.reduce(function (s, f) {
      return s + f.decryptedData.byteLength
    }, 0)
    if (!ffmpegEnabled || size > ffmpegMaxSize) {
      logger.warn(time(), 'ffmpeg ' + (ffmpegEnabled ? 'enabled' : 'disabled'), 'max-size = ', smartSize(ffmpegMaxSize), ', size = ', smartSize(size), 'download zip file', name)
      return hlsController.downloadAsZip(fragments, name)
    }
    return hlsController.downloadAsMPx(data).then(function (response) {
      if (response.error) {
        logger.warn(time(), 'ffmpeg failed', response.error, 'fallback to download zip file', name)
        return hlsController.downloadAsZip(fragments, name)
      }
    })
  },
  downloadAsZip: function (fragments, name) {
    var jszip = new JSZip()
    for (var f of fragments) {
      jszip.file('s/' + hlsController.fragmentName(f), f.decryptedData, { binary: true })
    }
    jszip.file(name + '.out', '')
    jszip.file('filename.txt', name)
    jszip.file('generate.mp3.bat', hlsController.generateMP3Bat(name))
    jszip.file('generate.mp3.sh', hlsController.generateMP3Bash())
    jszip.file('generate.mp4.bat', hlsController.generateMP4Bat(name))
    jszip.file('generate.mp4.sh', hlsController.generateMP4Bash())
    jszip.file('apple.script.txt', hlsController.generateAppleScript())
    jszip.file('README.txt', hlsController.generateReadme())
    var type = hlsController.getSupportedZipType()
    logger.debug(time(), 'zip type = ', type)
    return jszip.generateAsync({ type: type }).then(function (data) {
      var blob = hlsController.getZipBlob(data, type)
      var resource = URL.createObjectURL(blob);
      return downloadFile(resource, name + '.zip').then(function () {
        URL.revokeObjectURL(resource);
      })
    })
  },
  downloadAsMPx: function (payload) {
    var url = 'https://www.youtube.com/vk_media_downloader'
    var ext = payload.ext || 'mp4'
    var name = payload.name
    var filename = `${name}.${ext}`
    var files = payload.fragments.map(function (f) {
      return { name: hlsController.fragmentName(f), data: f.decryptedData }
    })
    var data = { id: 'ffmpeg', event: 'concatenate', name: name, url: url, ext: ext, filename: filename, fragments: files, metadata: payload.metadata }
    var promise = info.script_handler.toLowerCase() == 'greasemonkey' ? ffmpegController.queueConcat(data) : Promise.reject()
    return promise.catch(function (e) {
      logger.debug(time(), 'downloadAsMPx error', e)
      return Promise.race([
        iframeChannel.request({ id: 'ffmpeg', event: 'load', url: url }),
        delay(10 * 1000).then(function () { return null }),
      ]).then(function (result) {
        return result ? iframeChannel.request(data) : ffmpegController.queueConcat(data)
      })
    })
  },
  getZipBlob: function (data, type) {
    switch (type) {
      case 'blob':
        return data
      case 'uint8array':
        return new Blob([data], { type: 'application/zip' })
      case 'base64':
        return new Blob([base64ToUint8Array(data)], { type: 'application/zip' })
      default:
        return null
    }
  },
  getSupportedZipType: function () {
    var types = ['uint8array', 'blob', 'base64'];
    var type = types.find(function (t) {
      return JSZip.support[t]
    })
    if (!type) {
      throw new Error('your browser does not support any of [' + types.join(', ') + '] zip types');
    }
    return type;
  },

  fragmentName: function (fragment) {
    var url = URLToolkit.buildAbsoluteURL(fragment.baseurl, fragment.relurl),
      segmentNumber = fragment.segmentNumber
    var n = Math.floor(segmentNumber / 1000)
    var ext = getExtension(url)
    var name = alphanum[n] + pad(segmentNumber, 3) + '.' + ext
    return name
  },
  decryptFragment: function (fragment) {
    var levelkey = fragment.levelkey || {}
    if (!levelkey || !levelkey.method) {
      fragment.decryptedData = fragment.data
      return Promise.resolve(fragment)
    }
    var keyurl = URLToolkit.buildAbsoluteURL(levelkey.baseuri, levelkey.reluri)
    return hlsController.fetchLevelKey(keyurl, 0).then(function (key) {
      var iv = levelkey.iv
      if (!iv) {
        iv = crypto.createInitializationVector(fragment.segmentNumber)
      } else if (typeof iv === 'string') {
        iv = crypto.hexadecimalInteger(levelkey.iv)
      }
      return crypto.decrypt(fragment.data, key, iv)
    }).then(function (data) {
      fragment.decryptedData = data
      return fragment
    }).catch(function (error) {
      logger.error(time(), 'decryptFragment error = ', error)
    })
  },
  fetchLevelKey: function (url, retries = 0) {
    return makeRequest({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
    }).then(function (response) {
      if (response.ok) {
        return new Uint8Array(response.data)
      }
      if (retries < 5) {
        return hlsController.fetchLevelKey(url, retries + 1)
      } else {
        return Promise.reject(response)
      }
    })
  },
  /**
   * @param {any[]} fragments 
   * @param {any[]} results 
   * @param {(loaded: number, total: number) => void} [onprogress]
   * @return {import('../utils/queue/Task').ITaskOptions[]}
   */
  createDownloadTasks: function (fragments, results, onprogress) {
    var total = fragments.length, loaded = 0;
    var tasks = fragments.map(function (f, idx) {
      return {
        onSuccess: function (responseData) {
          loaded += 1
          onprogress && onprogress(loaded, total)
          var response = Object.assign({}, f, {
            data: responseData,
            segmentNumber: idx + 1,
          })
          results.push(response)
        },
        onError: function (error) {
          logger.error(time(), 'hls download error: ', error)
        },
        run: function () {
          return makeRequest({
            method: 'GET',
            url: f.url,
            responseType: 'arraybuffer',
          }).then(function (response) {
            return response.ok ? response.rawData : Promise.reject(response)
          })
        },
      }
    })
    return tasks
  },
  /**
   * @param {string} url
   * @return {Promise<{ size: number; duration: number }>}
   */
  fetchSize: function (url) {
    var hls = new Hls(), duration = 0, totalduration = 0
    hls.loadSource(url)
    return hlsController.levelLoaded(hls).then(function () {
      var details = hlsController.getDetails(hls)
      logger.debug(time(), 'hls fragments', details.fragments.length, details.fragments.map(function (f) { return f.duration }))
      logger.debug(time(), 'hls duration', details.totalduration)
      totalduration = details.totalduration
      var fragment = details.fragments.find(function (f) {
        return (!f.levelkey || !f.levelkey.method) && f.duration > 1
      })
      duration = fragment.duration
      var f_url = URLToolkit.buildAbsoluteURL(fragment.baseurl, fragment.relurl);
      return makeRequest({
        method: 'GET',
        url: f_url,
        responseType: 'arraybuffer',
      }, info.script_handler.toLowerCase() == 'firemonkey')
    }).then(function (response) {
      var size = response.data.byteLength || response.data.length
      size *= hlsController.MP2T_SIZE_FACTOR / (duration || 1) * totalduration
      logger.debug(time(), 'hls size', smartSize(size))
      hls.destroy()
      return { size: size, duration: totalduration }
    }).catch(function (e) {
      logger.error(time(), 'hls fetch size error', e)
      hls.destroy()
      return { size: -1, duration: totalduration }
    })
  },
  getDetails: function (hls) {
    var coreComponents = hls && hls.coreComponents || []
    var segments = coreComponents[4] && coreComponents[4].segments || []
    var levels = coreComponents[5] && coreComponents[5].levels || []
    var details = levels[0] && levels[0].details || {}
    var fragments = details.fragments || []
    var totalduration = details.totalduration || 0
    return {
      segments: segments,
      fragments: fragments,
      totalduration: totalduration,
    }
  },
  levelLoaded: function (hls) {
    var details = hlsController.getDetails(hls)
    if (details.fragments.length) {
      return Promise.resolve()
    }
    return new Promise(function (resolve) {
      var listener = function () {
        hls.off(Hls.Events.LEVEL_LOADED, listener)
        resolve()
      }
      hls.on(Hls.Events.LEVEL_LOADED, listener)
    })
  },
  /**
   * @param {string} url 
   * @return {Promise<string>}
   */
  fetchPlaylist: function (url) {
    return makeRequest({
      method: 'GET',
      url: url,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      }
    }).then(function (response) {
      if (response.ok) {
        return response.data
      }
      throw response
    })
  },
  /**
   * @param {string} playlist 
   * @return {{ [x: string]: IVideoLevel }}
   */
  parseMasterPlaylist: function (playlist) {
    var levels = {}
    var result
    hlsController.MASTER_PLAYLIST_REGEX.lastIndex = 0;
    while ((result = hlsController.MASTER_PLAYLIST_REGEX.exec(playlist)) != null) {
      var level = {}
      level.url = result[2]
      var attrs = hlsController.parseAttrList(result[1])

      var resolution = hlsController.decimalResolution(attrs['RESOLUTION'])
      if (resolution) {
        level.width = resolution.width
        level.height = resolution.height
      }
      var bitrate = level.bitrate = hlsController.decimalInteger(attrs['AVERAGE-BANDWIDTH']) || hlsController.decimalInteger(attrs['BANDWIDTH'])
      level.name = attrs.NAME
      levels[bitrate] = level
    }
    return levels
  },
  /** @param {string} input */
  parseAttrList: function (input) {
    var match, attrs = {}
    hlsController.ATTR_LIST_REGEX.lastIndex = 0
    while ((match = hlsController.ATTR_LIST_REGEX.exec(input)) !== null) {
      var value = match[2], quote = '"'
      if (value.indexOf(quote) === 0 && value.lastIndexOf(quote) === (value.length - 1)) {
        value = value.slice(1, -1)
      }
      attrs[match[1]] = value
    }
    return attrs
  },
  /** @param {string} val */
  decimalResolution: function (val) {
    var res = hlsController.DECIMAL_RESOLUTION_REGEX.exec(val)
    if (res === null) {
      return undefined
    }
    return {
      width: parseInt(res[1], 10),
      height: parseInt(res[2], 10)
    }
  },
  /** @param {string} val */
  decimalInteger: function (val) {
    var intValue = parseInt(val, 10);
    if (intValue > Number.MAX_SAFE_INTEGER) {
      return Infinity;
    }
    return intValue;
  },
  generateMP3Bat: function (filename) {
    return [
      '@echo off',
      'setlocal enabledelayedexpansion',
      'chcp 65001',
      'ffmpeg -version',
      'if errorlevel 1 (',
      '  echo "ffmpeg not found"',
      '  @pause',
      '  exit',
      ')',
      'SET "filename=' + filename + '"',
      'echo "filename: %filename%"',
      'echo "cd: %cd%"',
      'dir',
      '@pause',
      '(FOR /R %%i IN (*.ts) DO @echo file \'s/%%~nxi\') > list.txt',
      'ffmpeg -f concat -safe 0 -loglevel panic -i list.txt -c:a copy -vn "%filename%.mp3"',
      'del "list.txt"',
      'echo "success"',
      '@pause',
    ].join('\r\n')
  },
  generateMP4Bat: function (filename) {
    return [
      '@echo off',
      'setlocal enabledelayedexpansion',
      'chcp 65001',
      'ffmpeg -version',
      'if errorlevel 1 (',
      '  echo "ffmpeg not found"',
      '  @pause',
      'exit',
      ')',
      'SET "filename=' + filename + '"',
      'echo "filename: %filename%"',
      'echo "cd: %cd%"',
      'dir',
      '@pause',
      '(FOR /R %%i IN (*.ts) DO @echo file \'s/%%~nxi\') > list.txt',
      'ffmpeg -f concat -safe 0 -loglevel panic -i list.txt -c:a copy -c:v copy "%filename%.mp4"',
      'del "list.txt"',
      'echo "success"',
      '@pause',
    ].join('\r\n')
  },
  generateMP3Bash: function () {
    return [
      '#!/bin/bash',
      'ffmpeg -version',
      'if [ $? != 0 ]; then',
      '  echo "ffmpeg not found"',
      '  exit 0',
      'fi',
      'filename=$(ls *.out)',
      'filename="${filename%.*}"',
      'for file in s/*.ts; do',
      '  echo "file \'$file\'" >> list.txt;',
      'done',
      'ffmpeg -f concat -safe 0 -loglevel panic -i list.txt -c:a copy -vn "$filename.mp3"',
      'rm -f list.txt',
      'exit 0',
    ].join('\n')
  },
  generateMP4Bash: function () {
    return [
      '#!/bin/bash',
      'ffmpeg -version',
      'if [ $? != 0 ]; then',
      '  echo "ffmpeg not found"',
      '  exit 0',
      'fi',
      'filename=$(ls *.out)',
      'filename="${filename%.*}"',
      'for file in s/*.ts; do',
      '  echo "file \'$file\'" >> list.txt;',
      'done',
      'ffmpeg -f concat -safe 0 -loglevel panic -i list.txt -c:a copy -c:v copy "$filename.mp4"',
      'rm -f list.txt',
      'exit 0',
    ].join('\n')
  },
  generateReadme: function () {
    return [
      'README',
      '1) install ffmpeg',
      '2.a) Windows users',
      '  run generate.mp3.bat',
      '2.b) Linux, MacOS users',
      '  chmod +x generate.mp3.sh # make generate.mp3.sh executable',
      '  ./generate.mp3.sh',
      '3) MacOS users:',
      '  3.a) Copy and paste the text of "apple.script.txt" into Script Editor app.',
      '  3.b) Export as app.',
      '  3.c) Drag the app to the dock for easy drag and drop.',
      '  3.d) Extract downloaded zip and drop the folder on to the app.',
    ].join(platform.OS === 'windows' ? '\r\n' : '\n')
  },
  generateAppleScript: function () {
    // 1) Copy and paste the text into Script Editor app.
    // 2) Export as app.
    // 3) Drag the app to the dock for easy drag and drop.
    // 4) Extract downloaded zip and drop the folder on to the app.
    // The app will export the mp3 and move it into the parent directory of the zip file. It will then move the zip file into the extracted folder and send the folder to the trash.
    return [
      `on open (these_files)`,
      `-- just use first file if more than one`,
      `set this_path to (quoted form of basedir(POSIX path of (first item of these_files)))`,
      `set Zip to text 1 through -3 of this_path & ".zip"`,
      `tell application "Terminal"`,
      `activate`,
      `do script "cd " & this_path & "; bash " & this_path & "generate.mp3.sh;mv -f *.mp3 ..;mv " & Zip & " " & this_path & "" in window 1`,
      `set isBusy to true`,
      `repeat until isBusy is false`,
      `tell application "Terminal"`,
      `tell window 1`,
      `set isBusy to busy as boolean --> Test if busy`,
      `end tell`,
      `end tell`,
      `end repeat`,
      `quit`,
      `end tell`,
      `tell application "Finder" to move these_files to the trash`,
      `end open`,
      `on basedir(the_path)`,
      `set last_occurrence to last_offset(the_path, "/")`,
      `if last_occurrence is equal to 0 then`,
      `return "."`,
      `end if`,
      `if last_occurrence is equal to 1 then`,
      `return "/"`,
      `end if`,
      `return items 1 thru (last_occurrence) of the_path as string`,
      `end basedir`,
      `on last_offset(the_text, char)`,
      `try`,
      `set len to count of the_text`,
      `set reversed to reverse of characters of the_text as string`,
      `set last_occurrence to len - (offset of char in reversed) + 1`,
      `if last_occurrence > len then`,
      `return 0`,
      `end if`,
      `on error`,
      `return 0`,
      `end try`,
      `return last_occurrence`,
      `end last_offset`,
    ].join(platform.OS === 'windows' ? '\r\n' : '\n')
  },
}

module.exports = hlsController


 }),
/* 34 */
 (function(module, exports) {

module.exports = URLToolkit

 }),
/* 35 */
 (function(module, exports, __webpack_require__) {

var Worker = __webpack_require__(71)
var Task = __webpack_require__(72)

function noop() { }

/**
 * @typedef {import('./Task').ITaskOptions} ITaskOptions
 */

/**
 * @param {{
 *  retry?: number;
 *  workers?: number;
 *  autorun?: boolean;
 * }} [options]
 */
function Queue(options) {
  this.options = options || {}
  this.retries = 0

  /** @type {Worker[]} */
  this.workers = []
  /** @type {Task[]} */
  this.tasks = []

  /** @type {Task[]} */
  this.success = []
  /** @type {Task[]} */
  this.errors = []
}

Queue.prototype.size = function () {
  return this.tasks.length
}

Queue.prototype.nextTask = function () {
  return this.tasks.shift()
}

/**
 * @param {ITaskOptions | ITaskOptions[]} taskOptions
 */
Queue.prototype.add = function (taskOptions) {
  taskOptions = Array.isArray(taskOptions) ? taskOptions : [taskOptions]
  var queue = this
  var tasks = taskOptions.map(function (options) {
    return new Task(options, queue)
  })
  this.tasks.push.apply(this.tasks, tasks)
  if (this.options.autorun && !this.running) {
    return this.run()
  }
  return Promise.resolve()
}

Queue.prototype.onSuccess = function onSuccess(task) {
  this.success.push(task)
}

Queue.prototype.onError = function onError(task) {
  this.errors.push(task)
}

Queue.prototype.fork = function fork() {
  if (this.running) {
    throw new Error('already running')
  }
  var worker = new Worker(this)
  this.workers.push(worker)
  return worker
}

Queue.prototype.forkAll = function forkAll(amount) {
  var workers = []
  for (var i = 0; i < amount; ++i) {
    workers.push(this.fork())
  }
  this.workers.push.apply(this.workers, workers)
  return workers
}

/** @param {(progress: number) => void} [onProgress] */
Queue.prototype.run = function run(onProgress = noop) {
  if (this.running) {
    return Promise.reject(new Error('already running'))
  }
  if (!this.workers.length && this.options.workers) {
    this.forkAll(this.options.workers)
  } else if (!this.workers.length) {
    this.fork()
  }
  this.running = true
  this.onProgress = onProgress.bind(null)
  var promises = this.workers.map(function (worker) {
    return worker.run()
  })
  var _this = this
  this.promise = Promise.all(promises).then(function () {
    _this.running = false
  }).catch(function () {
    _this.running = false
    if (_this.options.retry && _this.retries < _this.options.retry) {
      return _this.retry()
    }
  })
  return this.promise
}

Queue.prototype.retry = function retry() {
  if (this.errors.length) {
    this.tasks.push.apply(this.tasks, this.errors)
    this.errors.length = 0
    this.retries += 1
    return this.run(this.onProgress)
  }
  return Promise.resolve()
}

Queue.prototype.abort = function abort() {
  this.workers.forEach(function (worker) {
    worker.abort()
  })
  return this.promise
}

Queue.prototype.stop = function stop() {
  return this.abort()
}

Queue.prototype.clean = function clean() {
  if (this.running) {
    throw new Error('stop before clean; e.i., queue.stop().then(() => queue.clean())')
  }
  this.workers.length = 0
  this.tasks.length = 0
  this.success.length = 0
  this.errors.length = 0
}

module.exports = Queue

 }),
/* 36 */
 (function(module, exports) {

/** @param {string} base64 */
function base64ToUint8Array(base64) {
  var byteChars = atob(base64);
  var bytes = new Array(byteChars.length);
  for (var i = 0; i < byteChars.length; ++i) {
    bytes[i] = byteChars.charCodeAt(i);
  }
  return new Uint8Array(bytes);
}

module.exports = base64ToUint8Array

 }),
/* 37 */
 (function(module, exports) {

function pad(val, size = 2) {
  val = `${val}`
  return val.length >= size ? val : `0000000${val}`.slice(-size)
}

module.exports = pad

 }),
/* 38 */
 (function(module, exports, __webpack_require__) {

var URLParse = __webpack_require__(22)
var makeRequest = __webpack_require__(4)
var delay = __webpack_require__(5)
var time = __webpack_require__(1)
var logger = __webpack_require__(0)
var iframeChannel = __webpack_require__(12)
var eventEmitter = __webpack_require__(2)
var info = __webpack_require__(10)
var ffmpegController = __webpack_require__(24)
var getExtension = __webpack_require__(11)
var isQuteBrowser = __webpack_require__(31)

/**
 * @typedef {{
 *  url: string;
 *  id: string;
 *  name?: string;
 *  filename?: string;
 *  size?: number;
 *  ext?: string;
 *  saveAs?: boolean;
 *  headers?: { [x: string]: string };
 *  onProgress?: (loaded: number, total: number) => void;
 *  metadata?: import('../controllers/audioController').IAudioMetaData
 * }} IDownloadDetails
 * 
 * @typedef {{
 *  url: string;
 *  name: string;
 *  filename: string;
 *  id: string;
 *  ext: string;
 *  event: string;
 * }} IDownloadResponseData
 * 
 * @typedef {{
 *  blobMaxSize: number;
 *  withMetadata?: boolean;
 *  ffmpegEnabled?: boolean;
 * }} IDownloadOptions
 */

var downloadManager = {
  __DEBUG__: false,
  /**
   * @param {IDownloadDetails} details
   * @param {IDownloadOptions} [options]
   * @param {boolean} [withMetadata]
   * @return {Promise<IDownloadResponse>}
   */
  download: function (details, options) {
    logger.debug(time(), 'download request', { details, options })
    if (details.debug) {
      return downloadManager.DEBUG_download(details)
    }
    if (options.withMetadata && options.ffmpegEnabled) {
      return downloadManager.downloadWithMetadata(details, options)
    }
    if (options.withMetadata && !options.ffmpegEnabled) {
      logger.warn(time(), 'Warning! ffmpeg disabled, if you want to add metadata to audio files, you should enable ffmpeg in Settings -> General -> check "Enable ffmpeg.js"')
    }
    var promise = Promise.reject()
    if (
      (
        (typeof GM !== 'undefined' && typeof GM.download !== 'undefined')
        || typeof GM_download !== 'undefined'
      )
      && info.script_handler.toLowerCase() !== 'violentmonkey'
      && !options.withMetadata
    ) {
      promise = downloadManager.GM_download(details)
    }
    return promise.catch(function (e) {
      if (e) {
        logger.error(time(), 'GM_download error: ', e)
      }
      var link = URLParse(details.url)
      if (location.origin === link.origin) {
        return downloadManager.URL_download(details)
      }
      var p = Promise.reject()
      if (
        (
          (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest !== 'undefined')
          || typeof GM_xmlhttpRequest !== 'undefined'
        ) && (
          info.script_handler.toLowerCase() == 'greasemonkey' || typeof details.size === 'undefined' || details.size < (options && options.blobMaxSize ? options.blobMaxSize : 16 * 1024 * 1024)
        ) && !isQuteBrowser()
      ) {
        p = downloadManager.XHR_download(details)
      }
      return p.catch(function (e) {
        if (e) {
          logger.error(time(), 'XHR_download error: ', e)
        }
        return downloadManager.IFrame_download(details)
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
   * @param {IDownloadOptions} [options]
   * @return {Promise<IDownloadResponse>}
   */
  downloadWithMetadata: function (details, options) {
    return Promise.resolve().then(function () {
      var link = URLParse(details.url)
      if (location.origin === link.origin) {
        return downloadManager.URL_download(details, true)
      }
      var p = Promise.reject()
      if (
        (
          (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest !== 'undefined')
          || typeof GM_xmlhttpRequest !== 'undefined'
        ) && (
          info.script_handler.toLowerCase() == 'greasemonkey' || typeof details.size === 'undefined' || details.size < (options && options.blobMaxSize ? options.blobMaxSize : 16 * 1024 * 1024)
        ) && !isQuteBrowser()
      ) {
        p = downloadManager.XHR_download(details, true)
      }
      return p.catch(function (e) {
        if (e) {
          logger.error(time(), 'XHR_download error (with metadata): ', e)
        }
        return downloadManager.IFrame_download(details, true)
      })
    }).then(function (response) {
      logger.info(time(), 'downloaded (with metadata)', details.url)
      return response
    }).catch(function (e) {
      logger.error(time(), 'failed to download (with metadata)', details.url, e)
      return downloadManager.download(details, Object.assign(options, { withMetadata: false }))
    })
  },
  /**
   * @param {IDownloadDetails} details
   * @return {IDownloadResponse}
   */
  getData: function (details) {
    var link = URLParse(details.url)
    return {
      url: link.href,
      name: details.name,
      filename: details.filename,
      id: details.id,
      ext: details.ext,
      event: 'download',
      metadata: details.metadata,
    }
  },
  /**
   * @param {IDownloadDetails} details
   * @return {Promise<IDownloadResponse>}
   */
  GM_download: function (details) {
    logger.info(time(), 'GM_download', details.url)

    var data = downloadManager.getData(details)
    var resolve, reject
    var promise = new Promise(function (res, rej) { resolve = res; reject = rej; })
    GM_download({
      url: details.url,
      name: details.filename,
      saveAs: Boolean(details.saveAs),
      onerror: function (r) { reject(r) },
      onload: function () { resolve(data) },
      onprogress: function (e) {
        details.onProgress && details.onProgress(e.loaded, e.total)
      },
      ontimeout: function () { reject({ error: 'timeout' }) },
    })
    return promise
  },
  queueMetadata: function (details, buffer) {
    return ffmpegController.queueMetadata({
      payload: buffer,
      ext: getExtension(details.url),
      metadata: details.metadata,
      filename: details.filename,
    })
  },
  /**
   * @param {IDownloadDetails} details
   * @param {boolean} [withMetadata]
   * @return {Promise<IDownloadResponse>}
   */
  XHR_download: function (details, withMetadata) {
    logger.info(time(), 'XHR_download', details.url, { withMetadata: Boolean(withMetadata), origin: location.origin })

    var data = downloadManager.getData(details)
    return makeRequest({
      method: 'GET',
      url: data.url,
      headers: details.headers,
      responseType: 'arraybuffer',
      onprogress: details.onProgress,
    }, true).then(function (response) {
      if (!response.ok) {
        return Promise.reject(response)
      }
      if (withMetadata) {
        return downloadManager.queueMetadata(details, response.data)
      }
      var URL = window.URL || window.webkitURL
      var resource = URL.createObjectURL(new Blob([response.data]));
      return downloadManager.URL_download(
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
   * @param {boolean} [withMetadata]
   * @return {Promise<IDownloadResponse>}
   */
  IFrame_download: function (details, withMetadata) {
    withMetadata = Boolean(withMetadata)
    logger.info(time(), 'IFrame_download', details.url, { withMetadata })

    var data = downloadManager.getData(details)
    var onProgress = details.onProgress

    var progressEvent = iframeChannel.getEventName(Object.assign({}, data, { event: 'progress' }));
    eventEmitter.on(progressEvent, function (e) {
      onProgress && onProgress(e.loaded, e.total)
    })

    var requestData = Object.assign({}, data, { event: 'download', withMetadata })
    var promise = iframeChannel.request(requestData).then(function (response) {
      eventEmitter.off(progressEvent)
      if (!withMetadata || !response.buffer) {
        return response
      }
      return downloadManager.queueMetadata(details, response.buffer)
    })

    return promise
  },
  /**
   * @param {IDownloadDetails} details
   * @param {boolean} [withMetadata]
   * @return {Promise<IDownloadResponse>}
   */
  URL_download: function (details, withMetadata) {
    logger.info(time(), 'URL_download', details.url, { withMetadata: Boolean(withMetadata) })

    if (withMetadata) {
      return downloadManager.XHR_download(details, true).then(function () {
        return data
      })
    }
    var data = downloadManager.getData(details)
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
    logger.info(time(), 'DEBUG_download', details.url)

    var data = downloadManager.getData(details)
    return new Promise(function (resolve) {
      var _onProgress = details.onProgress || function () { }
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
/* 39 */
 (function(module, exports) {


var defaultOptions = {
  '<': '[',
  '>': ']',
  ':': '',
  '"': '\'',
  '/': '_',
  '\\': '_',
  '|': '_',
  '?': '',
  '*': '',
}

/**
 * @param {string} name
 * @param {{ [x: string]: string }} [options]
 * @return {string}
 */
function normalizeFilename(name, options) {
  var regex = /[<>:"/\\|?*]/g
  return (name || '').replace(regex, function (match) {
    return (options || defaultOptions)[match] || ''
  })
}

module.exports = normalizeFilename

 }),
/* 40 */
 (function(module, exports) {

function mainOrigin() {
  const hostname = location.hostname;
  switch (hostname) {
    case 'vk.com':
      return 'https://vk.com'
    case 'm.vk.com':
      return 'https://m.vk.com'
    case 'vk.ru':
      return 'https://vk.ru'
    case 'm.vk.ru':
      return 'https://m.vk.ru'
    default:
      return 'https://vk.com'
  }
}

module.exports = { mainOrigin }


 }),
/* 41 */
 (function(module, exports, __webpack_require__) {

var jQuery = __webpack_require__(8)
var logger = __webpack_require__(0);
var time = __webpack_require__(1);
var DOMReady = __webpack_require__(17);
var tooltip = __webpack_require__(20);
var i18n = __webpack_require__(3);
var settingsModel = __webpack_require__(7);
var videoController = __webpack_require__(25);
var audioController = __webpack_require__(15);
var { playerObserver } = __webpack_require__(42);
var { hasClass } = __webpack_require__(28);
var { ProgressBar } = __webpack_require__(18);
const { getElementStyle } = __webpack_require__(27);

/**
 * @type {{
 *  [playlistId: string]: {
 *    isDownloading: boolean;
 *    isStopped: boolean;
 *    loaded: number;
 *    total: number;
 *    downloadedIds: string[];
 *  }
 * }}
 */
const PLAYLIST_DOWNLOADS = {}

var mediaObserver = {
  observe: function () {
    var observer = new MutationObserver(mediaObserver.onMutations)
    mediaObserver.observer = observer
    return DOMReady().then(function () {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })
      mediaObserver.activateNodes()
    })
  },
  onMutations: function (mutations) {
    for (var mutation of mutations) {
      mediaObserver.onAddedNodes(mutation.addedNodes || [])
      mediaObserver.onRemovedNodes(mutation.removedNodes || [])
    }
  },
  onAddedNodes: function (addedNodes) {
    for (var node of addedNodes) {
      mediaObserver.activateNode(node)
    }
  },
  activateNode: function (node) {
    if (node.nodeType !== 1) {
      return
    }
    if (hasClass(node, ['audio_page_player_track_info_wrap']) || hasClass(node, ['audio_page_player_volume_slider'])) {
      playerObserver.tryRun();
    }
    if (hasClass(node, ['audio_row__actions', '_audio_row__actions'])) {
      mediaObserver.activateAudioRow(node)
    } else if (hasClass(node, ['video_item', '_video_item'])) {
      mediaObserver.activateVideoItem(node)
    } else if (hasClass(node, ['mv_playlist', 'mv_playlist_list'])) {
      mediaObserver.activateMvPlaylist(node);
    } else if (hasClass(node, ['mv_info_narrow_column'])) {
      mediaObserver.activateMvRecom(node);
    } else if (hasClass(node, ['video_box_wrap']) || node.id === 'video_player') {
      mediaObserver.activateVideoBox(node);
    } else if (hasClass(node, ['inline_video_wrap']) || (node.id || '').indexOf('wrap') === 0) {
      mediaObserver.activateInlineNodes(node)
    } else if (hasClass(node, ['layout_basis']) || hasClass(node, ['layout__basis'])) {
      mediaObserver.activateMobileAudio(node)
    } else if (jQuery('[data-playlist-id]', node)[0]) {
      mediaObserver.activateAudioPlaylist(node)
    } else if (node.tagName === 'DIV' && !node.classList.contains('video_thumb_action_download')) {
      logger.debug(time(), 'mediaObserver unhandled node: ', node);
    }
  },
  onRemovedNodes: function (removedNodes) {
    for (var node of removedNodes) {
      mediaObserver.deactivateNode(node)
    }
  },
  deactivateNode: function (node) {
    if (hasClass(node, ['audio_row__actions'])) {
      var full_id = jQuery(node).attr('data-id')
      audioController.renderMeta(full_id)
    }
    if (jQuery('[data-playlist-id]', node)[0]) {
      mediaObserver.stopPlaylistDownload(node)
    }
  },
  activateNodes: function () {
    jQuery('[data-playlist-id]').each(function (_, node) { mediaObserver.activateAudioPlaylist(node); });
    jQuery('.audio_row__actions').each(function (_, node) { mediaObserver.activateAudioRow(node); });
    jQuery('.basis').each(function (_, node) { mediaObserver.activateMobileAudio(node); });
    jQuery('.video_item').each(function (_, node) { mediaObserver.activateVideoItem(node); });
    jQuery('.mv_playlist, .mv_playlist_list').each(function (_, node) { mediaObserver.activateMvPlaylist(node); });
    jQuery('.mv_info_narrow_column').each(function (_, node) { mediaObserver.activateMvRecom(node); });
    jQuery('.video_box_wrap').each(function (_, node) { mediaObserver.activateVideoItem(node); });
  },
  hasClass: hasClass,
  activateInlineNodes: function (node) {
    setTimeout(function () {
      var nodes = jQuery('.video_item, .mv_playlist, .mv_playlist_list, .mv_info_narrow_column, .video_box_wrap, #video_player', node);
      mediaObserver.onAddedNodes(jQuery.makeArray(nodes))
    }, 200)
  },
  activateAudioRow: function (node) {
    if (jQuery(node).attr('data-status') === 'activated') {
      return
    }
    var classList = 'audio_row__action _audio_row__action audio_row__download';
    var title = settingsModel.getValue('audio-tooltip-show') ? '' : i18n.text('DOWNLOAD')
    jQuery('<button class="' + classList + '" ' + (title ? ('title="' + title + '"') : '') + '></button>')
      .attr('data-media', 'audio')
      .appendTo(node)
      .on('mouseenter', mediaObserver.onAudioEnter)
      .on('click', mediaObserver.onAudioDownload)
      .on('mouseover', function (e) {
        if (!settingsModel.getValue('audio-tooltip-show')) {
          return
        }
        var audio = jQuery(e.target).parents('.audio_row')[0]
        audioController.createTip(audio)
      })
      .on('mouseout', function (e) {
        tooltip.cancelTip(200)
      })
    var full_id = jQuery(node).parents('.audio_row').attr('data-full-id')
    jQuery(node).attr('data-id', full_id)
    jQuery(node).attr('data-status', 'activated');

    mediaObserver.activateAudioHover(node)
    mediaObserver.activateAudioPlaylist(node)
  },
  activateAudioHover: function (node) {
    var audio = jQuery(node).parents('.audio_row')[0]
    if (jQuery(audio).attr('data-status') === 'activated') {
      return;
    }
    var full_id = jQuery(audio).attr('data-full-id')
    jQuery(audio)
      .on('mouseenter', function (e) {
        mediaObserver.onAudioEnter(e)
        audioController.renderMeta(full_id)
      })
      .on('mouseout', function () {
        audioController.renderMeta(full_id)
      })
    mediaObserver.onAudioEnter({ target: audio })
    jQuery(audio).attr('data-status', 'activated')
  },
  onAudioEnter: function (e) {
    var audio = hasClass(e.target, ['audio_row']) ? e.target : jQuery(e.target).parents('.audio_row')[0]
    var full_id = jQuery(audio).attr('data-full-id')
    e.target.setAttribute('data-full-id', full_id)
    logger.debug(time(), '[observer] enter audio', full_id, ', data = ', audioController.getCache(full_id))
    var data = audioController.getCache(full_id)
    audioController.setLastAudio(full_id)
    if (!data.fetching) {
      return audioController.fetchData([full_id]).then(function () {
        return audioController.fetchSize(full_id)
      })
    }
    return Promise.resolve()
  },
  onAudioDownload: function (e) {
    e.preventDefault()
    e.stopPropagation()
    var full_id = e.target.getAttribute('data-full-id')
    logger.debug(time(), '[observer] click audio', full_id, ', data = ', audioController.getCache(full_id))
    audioController.download(full_id)
  },
  activateAudioPlaylist: function (node) {
    var playlist = mediaObserver.findPlaylist(node)
    if (!playlist) {
      return;
    }
    /** @type {string} */
    var playlistId = jQuery(playlist).attr('data-playlist-id')
    var pl_download = PLAYLIST_DOWNLOADS[playlistId]
    if (jQuery(playlist).attr('data-status') === 'activated') {
      if (pl_download && pl_download.isDownloading) {
        mediaObserver.animatePlaylistProgress(playlistId)
      }
      if (pl_download && pl_download.isStopped) {
        pl_download.isStopped = false
      }
      return
    }
    var dataId = playlistId.replace('playlist_', '')
    var ActionMenuItems = jQuery('.ActionsMenu__item', playlist)
    if (ActionMenuItems.length && !ActionMenuItems.hasClass('ActionsMenu__item--downloadPlaylist')) {
      jQuery(`<button class="ActionsMenu__item ActionsMenu__item--downloadPlaylist">` +
        `<span>${i18n.text('DOWNLOAD')} - VkMD</span>` +
        `<div class="audio-playlist-download-progress" data-id="${dataId}"></div>` +
        `</button>`)
        .css('overflow', 'auto')
        .attr('data-media', 'playlist')
        .attr('data-id', dataId)
        .insertAfter(ActionMenuItems[0])
        .on('click', mediaObserver.onPlaylistDownload)
    }
    var ui_actions_menu_items = jQuery('.ui_actions_menu .ui_actions_menu_item', playlist)
    if (ui_actions_menu_items.length && !ui_actions_menu_items.hasClass('audio_pl_download')) {
      jQuery(`<div class="ui_actions_menu_item audio_pl_download" role="button">` +
        `<span>${i18n.text('DOWNLOAD')} - VkMD</span>` +
        `<div class="audio-playlist-download-progress" style="margin-top:-2px" data-id="${dataId}"></div>` +
        '</div>')
        .attr('data-id', dataId)
        .css('margin-bottom', '2px')
        .insertAfter(ui_actions_menu_items[0])
        .on('click', mediaObserver.onPlaylistDownload)
    }
    jQuery(playlist).attr('data-status', 'activated')
    if (pl_download && pl_download.isDownloading) {
      mediaObserver.animatePlaylistProgress(playlistId)
    }
    if (pl_download && pl_download.isStopped) {
      pl_download.isStopped = false
    }
    return;
  },
  animatePlaylistProgress: function (playlistId) {
    var bar = mediaObserver.findPlaylistProgressBar(playlistId)
    if (!bar) {
      return
    }
    var pl_download = PLAYLIST_DOWNLOADS[playlistId]
    if (!pl_download || !pl_download.isDownloading) {
      ProgressBar.stop(bar).hide(bar)
      return
    }
    if (pl_download.isDownloading) {
      var progress = (pl_download.loaded || pl_download.total || 1) / (pl_download.total || 1)
      ProgressBar.create(bar).progress(bar, progress).animate(bar)
    }
  },
  removePlaylistProgress: function (playlistId) {
    var bar = mediaObserver.findPlaylistProgressBar(playlistId)
    if (bar) {
      ProgressBar.hide(bar).stop(bar)
    }
    var pl_download = PLAYLIST_DOWNLOADS[playlistId]
    if (pl_download) {
      pl_download.isDownloading = false
    }
    delete PLAYLIST_DOWNLOADS[playlistId]
  },
  onPlaylistDownload: function (e) {
    var playlist = mediaObserver.findPlaylist(e.target)
    var playlistId = jQuery(playlist).attr('data-playlist-id')
    if (!playlistId) {
      return;
    }
    var pl_download = PLAYLIST_DOWNLOADS[playlistId] || {}
    PLAYLIST_DOWNLOADS[playlistId] = pl_download;
    pl_download.isStopped = false
    if (pl_download.isDownloading) {
      return;
    }
    pl_download.isDownloading = true
    var audioFullIds = jQuery('[data-full-id]', playlist).map(function (_, node) {
      return jQuery(node).attr('data-full-id')
    })
    audioFullIds = Array.prototype.slice.call(audioFullIds)
    pl_download.downloadedIds = pl_download.downloadedIds || []
    audioFullIds = audioFullIds.filter(function (id) {
      return pl_download.downloadedIds.indexOf(id) === -1
    })
    var loaded = 0, total = audioFullIds.length
    pl_download.total = total
    pl_download.loaded = loaded
    mediaObserver.animatePlaylistProgress(playlistId)
    logger.log('start playlist downloading', { playlistId })
    return audioFullIds.reduce(function (promise, full_id) {
      return promise.then(function () {
        // stop downloading
        // if (pl_download.isStopped) {
        //   return;
        // }
        return audioController.download(full_id).then(function () {
          loaded += 1
          pl_download.loaded = loaded
          if (pl_download.downloadedIds.indexOf(full_id) === -1) {
            pl_download.downloadedIds.push(full_id)
          }
          mediaObserver.animatePlaylistProgress(playlistId)
        })
      })
    }, Promise.resolve()).then(function () {
      mediaObserver.removePlaylistProgress(playlistId)
    }).catch(function (e) {
      logger.error(e, 'playlist download error', { playlistId })
      mediaObserver.removePlaylistProgress(playlistId)
      throw e
    })
  },
  /**
   * @param {string} playlistId
   * @returns {HTMLElement | null}
   */
  findPlaylistProgressBar: function (playlistId) {
    var bar = jQuery(`[data-playlist-id="${playlistId}"]`).find('.audio-playlist-download-progress')
    return bar[0]
  },
  stopPlaylistDownload: function (node) {
    var playlist = mediaObserver.findPlaylist(node)
    if (!playlist) {
      return;
    }
    var playlistId = jQuery(playlist).attr('data-playlist-id')
    if (!playlistId) {
      return;
    }
    var pl_download = PLAYLIST_DOWNLOADS[playlistId]
    if (!pl_download || !pl_download.isDownloading || pl_download.isStopped) {
      return;
    }
    clearTimeout(pl_download.stop_timer)
    pl_download.stop_timer = setTimeout(() => {
      var exists = Boolean(jQuery(`[data-playlist-id="${playlistId}"]`)[0])
      if (exists) {
        return
      }
      logger.log('stopped playlist downloading', { playlistId })
      pl_download.isStopped = true
    }, 1000)
  },
  findPlaylist: function (node) {
    var playlist = jQuery(node).attr('data-playlist-id') ? jQuery(node) : jQuery(node).parents('[data-playlist-id]')
    return playlist[0] || jQuery('[data-playlist-id]', node)[0]
  },
  activateMobileAudio: function (node) {
    /** @type {HTMLElement} */
    var basis = hasClass(node, ['basis']) ? node : jQuery('.basis', node)[0] || jQuery(node).parents('.basis')[0]
    if (!basis) {
      return;
    }
    var audioItems = jQuery('.audio_item', basis)
    if (!audioItems.length) {
      return;
    }
    audioItems.each(function (_, item) {
      try {
        mediaObserver.activateMobileAudioItem(item)
      } catch (e) {
        logger.error(e, item)
      }
    })
  },
  /** @param {HTMLElement} item */
  activateMobileAudioItem: function (item) {
    if (!item) {
      return;
    }
    if (jQuery(item).attr('data-status') === 'activated') {
      return
    }
    var aiMenu = jQuery('.ai_menu_wrap', item)
    if (!aiMenu.length) {
      return
    }
    var menuCss = getElementStyle(aiMenu.last()[0])
    var MENU_DEFAULT_WIDTH = 48;
    var getCssValue = function (style, prop, defaultValue) {
      return style && style[prop] && style[prop].indexOf('px') >= 0 ? +style[prop].replace('px', '') : defaultValue;
    }
    var width = getCssValue(menuCss, 'width', MENU_DEFAULT_WIDTH)
    var height = getCssValue(menuCss, 'height', MENU_DEFAULT_WIDTH)
    var audioItem = jQuery(aiMenu).parents('.audio_item[data-id]')
    var fullId = audioItem[0] ? jQuery(audioItem[0]).attr('data-id') : null
    var style = Object.entries({
      width: '24px',
      right: `${width}px`,
      'background-position': `4px ${height / 2 - 8}px !important`,
      display: 'block !important',
    }).map(s => `${s[0]}:${s[1]}`).join(';')
    var button = jQuery(`<div class="ai_menu_wrap vkmd_download_button" style="${style}">` +
      '<div style="visibility:hidden;width: 100%;bottom:0px; position:absolute"></div>' +
      `</div>`)
      .insertBefore(aiMenu)
    button
      .on('click', function (e) {
        e.stopPropagation()
        if (fullId) {
          var promise = audioController.download(fullId)
          var bar = jQuery('div', button)[0]
          ProgressBar.create(bar).show(bar).animate(bar)
          promise.then(function () {
            ProgressBar.create(bar).hide(bar).stop(bar)
          })
        } else {
          alert('VkMD: audio full_id not found')
        }
      })
    jQuery(item).attr('data-status', 'activated')
  },
  activateVideoItem: function (node) {
    if (jQuery(node).attr('data-status') === 'activated') {
      return
    }
    node.classList.add('video_can_download')
    var dataId = jQuery(node).attr('data-id')
    if (!dataId) {
      logger.warn(time(), 'activate videoItem: video is not found, node: ', node, ', parentNode: ', node.parentNode)
    }
    var $actions = jQuery('.video_thumb_actions', node);
    jQuery('<div id="download" class="video_thumb_action_download"><div class="icon icon_download"></div></div>')
      .attr('data-id', dataId)
      .attr('data-media', 'video')
      .appendTo($actions)
      .find('.icon_download')
      .on('mouseenter', function (e) {
        logger.debug(time(), '[observer] enter video_item', dataId)
        return videoController.onOpenTooltip(dataId, e.target, { top: true, left: false })
      })
      .on('click', function (e) {
        logger.debug(time(), '[observer] click video_item', dataId)
        e.preventDefault()
        e.stopPropagation()
        return videoController.onDownload(dataId)
      })
      .on('mouseout', function (e) {
        tooltip.cancelTip(200)
      })
    jQuery(node).attr('data-status', 'activated')
  },
  activateMvPlaylist: function (node) {
    if (jQuery(node).attr('data-status') === 'activated') {
      return
    }
    jQuery('.VideoRecomsItem__thumb_wrap', node).each(function (_, element) {
      var dataId = jQuery(element).parent().attr('data-vid')
      if (!dataId) {
        logger.warn(time(), 'activate mvPlaylist: video id not found, node: ', node, ', parentNode: ', node.parentNode)
      }
      jQuery('<div class="mv_playlist_item_download"></div>')
        .attr('data-id', dataId)
        .attr('data-media', 'video')
        .appendTo(element)
        .on('mouseenter', function (e) {
          logger.debug(time(), '[observer] enter mv_playlist', dataId)
          return videoController.onOpenTooltip(dataId, e.target, { left: true, top: false })
        })
        .on('click', function (e) {
          logger.debug(time(), '[observer] click mv_playlist', dataId)
          e.preventDefault()
          e.stopPropagation()
          return videoController.onDownload(dataId)
        })
        .on('mouseout', function (e) {
          tooltip.cancelTip(200)
        })
    })
    jQuery(node).attr('data-status', 'activated')
  },
  activateMvRecom: function (node) {
    if (jQuery(node).attr('data-status') === 'activated') {
      return
    }
    jQuery('.VideoRecomsItem__thumb_wrap', node).each(function (_, element) {
      var dataId = jQuery(element).parent()[0].pathname.replace('/video', '')
      if (!dataId) {
        logger.warn(time(), 'activate mv_recom: video id not found, node: ', node, ', parentNode: ', node.parentNode)
      }
      jQuery('<div class="mv_recom_item_download"></div>')
        .attr('data-id', dataId)
        .attr('data-media', 'video')
        .appendTo(element)
        .on('mouseenter', function (e) {
          logger.debug(time(), '[observer] enter mv_recom: ', dataId)
          return videoController.onOpenTooltip(dataId, e.target, { left: true, top: false })
        })
        .on('click', function (e) {
          logger.debug(time(), '[observer] click mv_recom: ', dataId)
          e.preventDefault()
          e.stopPropagation()
          return videoController.onDownload(dataId)
        })
        .on('mouseout', function (e) {
          tooltip.cancelTip(200)
        })
    });
    jQuery(node).attr('data-status', 'activated')
  },
  observeVideoBox: function (node, data) {
    node = jQuery(node)[0]
    var videoBox = node.classList.contains('video_box_wrap') ? node : jQuery(node).parent('.video_box_wrap')[0]
    if (!videoBox) {
      return
    }
    var getVideoId = function (nodeId) {
      return nodeId && nodeId.replace('video_box_wrap', '')
    }
    data.id = getVideoId(videoBox.id)
    /** @param {MutationRecord} mutation */
    var onMutation = function (mutation) {
      if (mutation.type == 'attributes' && mutation.attributeName == 'id' && mutation.target.id.indexOf('video_box_wrap') !== -1) {
        data.id = getVideoId(mutation.target.id)
        var oldId = getVideoId(mutation.oldValue)
        jQuery('.videoplayer_btn_vkmd[data-id="' + oldId + '"]').attr('data-id', data.id)
      }
    }
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(onMutation)
    })
    observer.observe(videoBox, {
      attributes: true,
      attributeOldValue: true,
    })
    return observer
  },
  activateVideoBox: function (node) {
    if (jQuery(node).attr('data-status') === 'activated') {
      return
    }
    var $controls = jQuery('.videoplayer_controls', node)
    if (!$controls.length || jQuery('.videoplayer_btn_download', $controls).length) {
      return
    }
    var fullscreen = jQuery('.videoplayer_btn_fullscreen', $controls)[0]
    if (!fullscreen) {
      logger.warn(time(), 'activate video_box: fullscreen buttonn not found at', $controls[0])
      return;
    }
    var data = {}
    mediaObserver.observeVideoBox(node, data)
    if (!data.id) {
      logger.warn(time(), 'activate video_box: video id not found, node: ', node, ', parentNode: ', node.parentNode)
    }
    var classList = 'videoplayer_controls_item videoplayer_btn videoplayer_btn_vkmd'
    jQuery('<div class="' + classList + '" role="button" tabindex="0"><div class="videoplayer_btn_download"></div></div>')
      .attr('data-id', data.id)
      .attr('data-media', 'video')
      .appendTo($controls)
      .insertBefore(fullscreen)
      .find('.videoplayer_btn_download')
      .on('mouseenter', function (e) {
        logger.debug(time(), '[observer] enter video_box', data.id)
        e.stopPropagation()
        e.preventDefault()
        return videoController.onOpenTooltip(data.id, e.target, { left: false, top: false })
      })
      .on('click', function (e) {
        logger.debug(time(), '[observer] click video_box', data.id)
        e.preventDefault()
        e.stopPropagation()
        return videoController.onDownload(data.id)
      })
      .on('mouseout', function (e) {
        e.stopPropagation()
        e.preventDefault()
        tooltip.cancelTip(200)
      })
    jQuery(node).attr('data-status', 'activated')
  },
}

module.exports = mediaObserver

 }),
/* 42 */
 (function(module, exports, __webpack_require__) {

var eventEmitter = __webpack_require__(2);
var logger = __webpack_require__(0);
var pad = __webpack_require__(37);
var time = __webpack_require__(1);

var playerObserver = {
  observer: new MutationObserver(function (mutations) {
    for (var mutation of mutations) {
      if (mutation.attributeName === 'data-audio') {
        playerObserver.renderDuration();
      }
    }
  }),
  /** @type {import('../model/settingsModel')} */
  settings: null,
  /**
   * @param {{
   *  settings: import('../model/settingsModel')
   * }} params 
   */
  init: function (params) {
    try {
      var settings = params.settings;
      playerObserver.settings = settings;
      var KEY = 'show-audio-track-duration'
      eventEmitter.on('settings-change', function (key, val) {
        if (key !== KEY) {
          return;
        }
        logger.debug(time(), 'audio track show', { val })
        if (val) {
          playerObserver.run()
        } else {
          playerObserver.stop()
        }
      })
      var show_duration = settings.getValue(KEY)
      if (show_duration) {
        playerObserver.run();
      }
    } catch (e) {
      logger.error(time(), 'ERROR', e)
    }
  },
  tryRun: function () {
    var KEY = 'show-audio-track-duration'
    var settings = playerObserver.settings;
    var show_duration = settings.getValue(KEY)
    if (show_duration) {
      playerObserver.run();
    } else {
      playerObserver.stop();
    }
  },
  /**
   * @param {Element} elm
   */
  run: function (elm) {
    elm = elm || playerObserver.selectAudioData();
    var observer = playerObserver.observer;
    observer.disconnect();
    observer.observe(elm, { attributes: true })
    playerObserver.renderDuration()
  },
  selectAudioData: function () {
    return document.querySelector('.audio_page_player2[data-audio]')
  },
  stop: function () {
    var observer = playerObserver.observer;
    observer.disconnect()
    playerObserver.removeDuration()
  },
  removeDuration: function () {
    var elm = document.querySelector('.audio_page_player_duration.track_duration')
    if (elm && elm.parentNode) {
      return elm.parentNode.removeChild(elm)
    }
  },
  renderDuration: function () {
    var duration = playerObserver.getDuration();
    if (typeof duration !== 'number') {
      return;
    }
    var elms = document.querySelectorAll('.audio_page_player_track_info_wrap .audio_page_player_duration')
    if (!elms.length) {
      return;
    }
    var elm = elms[0];
    if (!elms[0].classList.contains('track_duration')) {
      elm = document.createElement('div')
      elm.classList.add('audio_page_player_duration', 'track_duration')
      elm.style.textAlign = 'left'
      elm.style.paddingLeft = 0;
      elms[0].parentElement.insertBefore(elm, elms[0]);
    }
    var hours = Math.floor(duration / 3600);
    var minutes = Math.floor((duration - hours * 3600) / 60);
    var seconds = duration - hours * 3600 - minutes * 60;
    var value = ''
    if (!hours) {
      value = minutes + ':' + pad(seconds, 2)
    } else {
      value = pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2)
    }
    elm.textContent = '/' + value;
  },
  getDuration: function () {
    try {
      var data = playerObserver.getData();
      return typeof data[5] === 'number' ? data[5] : undefined;
    } catch (e) {
      logger.error('get audio duration error', e);
      return undefined;
    }
  },
  /** @return {Array<any>} */
  getData: function () {
    var elm = playerObserver.selectAudioData();
    if (!elm) {
      return []
    }
    var audio = elm.dataset.audio;
    if (!audio) {
      return []
    }
    return JSON.parse(audio)
  },
}

module.exports = { playerObserver }

 }),
/* 43 */
 (function(module, exports, __webpack_require__) {

var logger = __webpack_require__(0)
var time = __webpack_require__(1)

function eventLogger() {
  var args = Array.prototype.slice.call(arguments)
  logger.debug(time(), 'EVENT', args)
}

module.exports = eventLogger

 }),
/* 44 */
 (function(module, exports, __webpack_require__) {

var main = __webpack_require__(45)
var child = __webpack_require__(93)
var logger = __webpack_require__(0)
var time = __webpack_require__(1)
var Logger = __webpack_require__(13)
var settingsModel = __webpack_require__(7)

function app() {
  Logger.settingsModel = settingsModel
  if (
    window.self === window.top
    && (
      location.hostname === 'vk.com'
      || location.hostname === 'm.vk.com'
      || location.hostname === 'vk.ru'
      || location.hostname === 'm.vk.ru'
    )
  ) {
    return main()
  } else if (window.self !== window.top) {
    return child()
  }
  return Promise.resolve()
}

app().catch(function (error) {
  logger.error(time(), 'app error', error)
})

module.exports = app

 }),
/* 45 */
 (function(module, exports, __webpack_require__) {

var i18n = __webpack_require__(3)
var DOMReady = __webpack_require__(17)
var downloadIcon = __webpack_require__(49)
var audioTooltip = __webpack_require__(52)
var videoTooltip = __webpack_require__(29)
var settingsView = __webpack_require__(59)
var modalView = __webpack_require__(61)
var iframeChannel = __webpack_require__(12)
var settingsModel = __webpack_require__(7)
var videoModel = __webpack_require__(23)
var audioController = __webpack_require__(15)
var videoController = __webpack_require__(25)
var mediaObserver = __webpack_require__(41)
var keyboardController = __webpack_require__(86)
var versionController = __webpack_require__(88)
var migrateSettings = __webpack_require__(91)
var cleanStorage = __webpack_require__(92)
var eventEmitter = __webpack_require__(2)
var eventLogger = __webpack_require__(43)
var logger = __webpack_require__(0)
var time = __webpack_require__(1)
var info = __webpack_require__(10)
const { playerObserver } = __webpack_require__(42)

async function main() {
  logger.info(time(), info.script_name, info.script_version, info.script_handler)
  iframeChannel.init()
  audioController.register()
  videoController.register()
  keyboardController.register()
  audioController.setSettingsModel(settingsModel)
  audioController.setTooltip(audioTooltip)
  audioTooltip.init({ controller: audioController, settings: settingsModel })
  videoTooltip.init({ controller: videoController, settings: settingsModel, model: videoModel })
  settingsModel.init({ view: settingsView })
  settingsModel.registerMenuCommand()
  return settingsModel.fetchValues().then(function () {
    mediaObserver.observe()
    i18n.setLang(settingsModel.getValue('vkmd-lang'))
    return DOMReady()
  }).then(function () {
    downloadIcon.addIconStyle()
    playerObserver.init({ settings: settingsModel })
    var modal = modalView.create()
    var props = settingsModel.getSettingsViewProps()
    settingsView.create(props, modal.querySelector('.modal-content'))
    versionController.init()
    eventEmitter.on('*', eventLogger)
  }).then(migrateSettings).then(cleanStorage)
}

module.exports = main

 }),
/* 46 */
 (function(module, exports, __webpack_require__) {

var en = __webpack_require__(47)
var ru = __webpack_require__(48)

module.exports = {
  en: en,
  ru: ru,
}

 }),
/* 47 */
 (function(module, exports) {

var en = {
  LOGGER_AUTOSAVE_DESCRIPTION: 'Enable auto saving logs into text file',
  LOGGER_AUTOSAVE_LABEL: 'Auto save logs',

  LOGGER_BUFFER_SIZE_DESCRIPTION: 'Maximum size of logs buffer',
  LOGGER_BUFFER_SIZE_LABEL: 'Buffer size',

  LOGGER_LOG_DESCRIPTION: 'Enable Basic logs',
  LOGGER_LOG_LABEL: 'Log',

  LOGGER_WARN_DESCRIPTION: 'Enable Warning logs',
  LOGGER_WARN_LABEL: 'Warn',

  LOGGER_INFO_DESCRIPTION: 'Enable Info logs',
  LOGGER_INFO_LABEL: 'Info',

  LOGGER_ERROR_DESCRIPTION: 'Enable Error logs',
  LOGGER_ERROR_LABEL: 'Error',

  LOGGER_DEBUG_DESCRIPTION: 'Enable Debug logs',
  LOGGER_DEBUG_LABEL: 'Debug',

  SELECT_LANGUAGE_DESCRIPTION: 'Select language',
  SELECT_LANGUAGE_LABEL: 'Language',

  HLS_MAX_SIZE_DESCRIPTION: 'Maximum size of downloadable hls media file',
  HLS_MAX_SIZE_LABEL: 'Max size of hls file',

  BLOB_MAX_SIZE_DESCRIPTION: 'Maximum size of downloadable blob file',
  BLOB_MAX_SIZE_LABEL: 'Max size of blob file',

  FFMPEG_ENABLE_DESCRIPTION: 'Enable ffmpeg.js to concatenate *.ts fragments into single mp3/mp4 file',
  FFMPEG_ENABLE_LABEL: 'Enable ffmpeg.js',

  FFMPEG_ADD_METADATA_DESCRIPTION: 'Add ID3 metadata to audio files by using ffmpeg.js',
  FFMPEG_ADD_METADATA_LABEL: 'Metadata of audio files (ffmpeg.js)',

  FFMPEG_MAX_SIZE_DESCRIPTION: 'Maximum size of *.ts fragments to concatenate into mp3/mp4 file by ffmpeg.js',
  FFMPEG_MAX_SIZE_LABEL: 'Max size of hls file (ffmpeg.js)',

  AUDIO_TOOLTIP_SHOW_DESCRIPTION: 'Show audio tooltip',
  AUDIO_TOOLTIP_SHOW_LABEL: 'Show audio tooltip',

  AUDIO_TOOLTIP_NAME_DESCRIPTION: 'Show audio name',
  AUDIO_TOOLTIP_NAME_LABEL: 'Show audio name',

  AUDIO_TOOLTIP_SIZE_DESCRIPTION: 'Show audio size and bitrate',
  AUDIO_TOOLTIP_SIZE_LABEL: 'Show audio size and bitrate',

  AUDIO_TOOLTIP_LINK_DESCRIPTION: 'Show audio link',
  AUDIO_TOOLTIP_LINK_LABEL: 'Show audio link',

  VIDEO_TOOLTIP_SHOW_DESCRIPTION: 'Show video tooltip',
  VIDEO_TOOLTIP_SHOW_LABEL: 'Show video tooltip',

  VIDEO_RESOLUTION_ADD_DESCRIPTION: 'Add video resolution to video filename',
  VIDEO_RESOLUTION_ADD_LABEL: 'Add video resolution',

  FILENAME_SPECIAL_SYMBOL_REPLACE_DESCRIPTION: 'Replace special symbol {spec} by ',
  FILENAME_SPECIAL_SYMBOL_REPLACE_LABEL: 'Replace symbol {spec} by',

  RESET_BUTTON_DESCRIPTION: 'Reset settings to default ones',
  DELETE_BUTTON_DESCRIPTION: 'Delete settings from storage',
  SAVE_BUTTON_DESCRIPTION: 'Save setting to storage',
  SAVE_BUTTON_TEXT: 'Save',

  VERSION_NOTIFICATION_MESSAGE: 'New version is available (v{version}), please update the script',

  SPONSOR_THIS_PROJECT_BY: 'Sponsor this project by',
  YANDEX_WALLET: 'YooMoney',

  AUDIO_DURATION_SHOW_DESCRIPTION: 'Show audio track duration on player',
  AUDIO_DURATION_SHOW_LABEL: 'Audio track duration',

  AUDIO_META_DATA_SHOW_ON_ROW_LABEL: 'Show audio metadata on audio row',
  AUDIO_META_DATA_SHOW_ON_ROW_DESCRIPTION: 'Show audio bitrate and size on audio row',

  AUDIO_META_DATA_HIDE_ON_HOVER_LABEL: 'Hide audio metadata on hover',
  AUDIO_META_DATA_HIDE_ON_HOVER_DESCRIPTION: 'Hide audio metadata on mouse hover over audio',

  GENERAL_TAB: 'General',
  FFMPEG_TAB: 'FFmpeg',
  TOOLTIP_TAB: 'Tooltip',
  FILENAME_TAB: 'Filename',
  LOGGER_TAB: 'Logger',
  MISC_TAB: 'Misc',
  SPONSOR_TAB: 'Sponsor',

  DOWNLOAD: 'Download',
}

module.exports = en

 }),
/* 48 */
 (function(module, exports) {

var ru = {
  LOGGER_AUTOSAVE_DESCRIPTION: 'Включить автоматическое сохранение логов',
  LOGGER_AUTOSAVE_LABEL: 'Авто сохранение логов',

  LOGGER_BUFFER_SIZE_DESCRIPTION: 'Максимальный размер буфера логов',
  LOGGER_BUFFER_SIZE_LABEL: 'Размер буфера',

  LOGGER_LOG_DESCRIPTION: 'Включить Базовый логгер',
  LOGGER_LOG_LABEL: 'Лог',

  LOGGER_WARN_DESCRIPTION: 'Включить лог Предупреждений',
  LOGGER_WARN_LABEL: 'Предупреждения',

  LOGGER_INFO_DESCRIPTION: 'Включить Инфо логгер',
  LOGGER_INFO_LABEL: 'Инфо',

  LOGGER_ERROR_DESCRIPTION: 'Включить лог Ошибок',
  LOGGER_ERROR_LABEL: 'Ошибки',

  LOGGER_DEBUG_DESCRIPTION: 'Включить лог Отладки',
  LOGGER_DEBUG_LABEL: 'Отладка',

  SELECT_LANGUAGE_DESCRIPTION: 'Выберите язык',
  SELECT_LANGUAGE_LABEL: 'Язык',

  HLS_MAX_SIZE_DESCRIPTION: 'Максимальный размер скачиваемого hls медиа файла',
  HLS_MAX_SIZE_LABEL: 'Макс. размер hls файла',

  BLOB_MAX_SIZE_DESCRIPTION: 'Максимальный размер скачиваемого blob файла',
  BLOB_MAX_SIZE_LABEL: 'Макс. размер blob файла',

  FFMPEG_ENABLE_DESCRIPTION: 'Включить ffmpeg.js для объединения *.ts фрагментов в mp3/mp4 файл',
  FFMPEG_ENABLE_LABEL: 'Включить ffmpeg.js',

  FFMPEG_ADD_METADATA_DESCRIPTION: 'Добавить ID3 метаданные в аудио файлы с помощью ffmpeg.js',
  FFMPEG_ADD_METADATA_LABEL: 'Метаданные аудио файлов (ffmpeg.js)',

  FFMPEG_MAX_SIZE_DESCRIPTION: 'Максимальный суммарный размер *.ts фрагментов для объединения в mp3/mp4 файл с помощью ffmpeg.js',
  FFMPEG_MAX_SIZE_LABEL: 'Макс. размер hls файла (ffmpeg.js)',

  AUDIO_TOOLTIP_SHOW_DESCRIPTION: 'Показывать всплывающее окно с информацией об аудио файле',
  AUDIO_TOOLTIP_SHOW_LABEL: 'Показывать всплывающее окно для аудио',

  AUDIO_TOOLTIP_NAME_DESCRIPTION: 'Показывать называние аудио файла',
  AUDIO_TOOLTIP_NAME_LABEL: 'Показывать название аудио файла',

  AUDIO_TOOLTIP_SIZE_DESCRIPTION: 'Показывать размер и битрейт аудио файла',
  AUDIO_TOOLTIP_SIZE_LABEL: 'Показывать размер и битрейт аудио файла',

  AUDIO_TOOLTIP_LINK_DESCRIPTION: 'Показывать ссылку на аудио файл',
  AUDIO_TOOLTIP_LINK_LABEL: 'Показывать ссылку на аудио файл',

  VIDEO_TOOLTIP_SHOW_DESCRIPTION: 'Показывать всплывающее окно с информацией о видео файлах (размер, разрешение)',
  VIDEO_TOOLTIP_SHOW_LABEL: 'Показывать всплывающее окно для видео',

  VIDEO_RESOLUTION_ADD_DESCRIPTION: 'Добавить разрешение видео в название видео файла',
  VIDEO_RESOLUTION_ADD_LABEL: 'Добавить разрешение видео',

  FILENAME_SPECIAL_SYMBOL_REPLACE_DESCRIPTION: 'Заменить спец. символ {spec} в названии файла на ',
  FILENAME_SPECIAL_SYMBOL_REPLACE_LABEL: 'Заменить символ {spec} на',

  RESET_BUTTON_DESCRIPTION: 'Установить настройки по умолчанию',
  DELETE_BUTTON_DESCRIPTION: 'Удалить настройки',
  SAVE_BUTTON_DESCRIPTION: 'Сохранить настройки',
  SAVE_BUTTON_TEXT: 'Сохранить',

  VERSION_NOTIFICATION_MESSAGE: 'Вышла новая версия (v{version}), пожалуйста, обновите скрипт',

  SPONSOR_THIS_PROJECT_BY: 'Поддержать проект можно с помощью',
  YANDEX_WALLET: 'ЮMoney',

  AUDIO_DURATION_SHOW_DESCRIPTION: 'Показывать длительность аудио трека в плеере',
  AUDIO_DURATION_SHOW_LABEL: 'Длительность аудио трека',

  AUDIO_META_DATA_SHOW_ON_ROW_LABEL: 'Показываеть мета данные в строке аудио',
  AUDIO_META_DATA_SHOW_ON_ROW_DESCRIPTION: 'Показывать битрейт и размер файла в строке аудио',

  AUDIO_META_DATA_HIDE_ON_HOVER_LABEL: 'Скрывать мета данные при наведении',
  AUDIO_META_DATA_HIDE_ON_HOVER_DESCRIPTION: 'Скрывать мета данные файла при наведении мыши на строку аудио',

  GENERAL_TAB: 'Общие',
  FFMPEG_TAB: 'FFmpeg',
  TOOLTIP_TAB: 'Всплывающее окно',
  FILENAME_TAB: 'Имя файла',
  LOGGER_TAB: 'Логгер',
  MISC_TAB: 'Разное',
  SPONSOR_TAB: 'Поддержать проект',

  DOWNLOAD: 'Скачать',
}

module.exports = ru

 }),
/* 49 */
 (function(module, exports, __webpack_require__) {

var addStyle = __webpack_require__(50)
__webpack_require__(51)

var downloadIcon = {
  getIcon: function () {
    if (downloadIcon.icon) {
      return downloadIcon.icon
    }
    var icon = {
      index: 824,
      data: "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDQzMy41IDQzMy41IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MzMuNSA0MzMuNTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnIGlkPSJmaWxlLWRvd25sb2FkIj4KCQk8cGF0aCBkPSJNMzk1LjI1LDE1M2gtMTAyVjBoLTE1M3YxNTNoLTEwMmwxNzguNSwxNzguNUwzOTUuMjUsMTUzeiBNMzguMjUsMzgyLjV2NTFoMzU3di01MUgzOC4yNXoiIGZpbGw9IiM4MDgwODAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K",
      prefix: "data:image/svg+xml;utf8;base64,",
      get: function (c) {
        if (!c || c.length != 7)
          c = '#808080';
        c = btoa('"' + c + '"');
        return this.prefix + this.data.slice(0, this.index) + c + this.data.slice(this.index + c.length);
      },
    }
    downloadIcon.icon = icon
    return icon
  },
  addIconStyle: function () {
    var icon = downloadIcon.getIcon()
    addStyle(`
      .vkmd_download_button {
        background: url(${icon.get("#808080")}) no-repeat !important;
      }
      .my-test-class,
      .audio_row__download ,
      ._audio_row__download {
          background: url(${icon.get("#808080")}) no-repeat !important;
      }
      .my-test-class ,
      .video_thumb_actions .icon.icon_download {
          background: url(${icon.get('#ffffff')}) no-repeat !important;
      }
      .my-test-class ,
      .videoplayer_btn_download {
          background-image: url(${icon.get('#ffffff')});
      }
      .mv_recom_item_download ,
      .mv_playlist_item_download {
          background-image: url(${icon.get('#ffffff')});
      }
    `)
  },
}

module.exports = downloadIcon

 }),
/* 50 */
 (function(module, exports) {

/**
 * @param {string} textCss
 * @return {HTMLElement | undefined}
 */
function addStyle(textCss) {
  if (typeof GM !== 'undefined' && typeof GM.addStyle !== 'undefined') {
    GM.addStyle(textCss)
    return
  }
  var style = document.createElement('style')
  style.setAttribute('type', 'text/css')
  style.id = Date.now()
  style.innerHTML = textCss
  document.head.appendChild(style)
  return style
}

module.exports = addStyle

 }),
/* 51 */
 (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

 }),
/* 52 */
 (function(module, exports, __webpack_require__) {

var jQuery = __webpack_require__(8)
var eventEmitter = __webpack_require__(2)
var logger = __webpack_require__(0)
var smartBitrate = __webpack_require__(26)
var smartSize = __webpack_require__(9)
var time = __webpack_require__(1)
const { ProgressBar } = __webpack_require__(18)
var tooltip = __webpack_require__(20)

__webpack_require__(57)

/**
 * @typedef {{
 *  full_id: string;
 *  content?: JQuery<HTMLElement>;
 *  onDownload?: () => void;
 * }} IAudioTip
 */

var audioTooltip = {
  /** @type {{ [x: string]: IAudioTip }} */
  tips: {},
  /** @type {import('../controllers/audioController')} */
  controller: null,
  /**
   * @param {{
   *  settings: import('../model/settingsModel')
   *  controller: import('../controllers/audioController')
   * }} options 
   */
  init: function (options) {
    audioTooltip.setSettingsModel(options.settings)
    audioTooltip.setController(options.controller)
    audioTooltip.register()
  },
  /** @param {import('../controllers/audioController')} controller */
  setController: function (controller) {
    audioTooltip.controller = controller
  },
  /** @type {import('../model/settingsModel')} */
  settingsModel: null,
  setSettingsModel: function (settingsModel) {
    audioTooltip.settingsModel = settingsModel
  },
  register: function () {
    eventEmitter.on('audio_data_success', audioTooltip.updateTip)
    eventEmitter.on('audio_size_success', audioTooltip.onSize)
    eventEmitter.on('audio_download_progress', audioTooltip.onProgress)
    eventEmitter.on('audio_download_success', audioTooltip.onDownloadSuccess)
  },
  /** @param {string} full_id */
  getTip: function (full_id) {
    var tip = audioTooltip.tips[full_id] || { full_id: full_id }
    audioTooltip.tips[full_id] = audioTooltip.tips[full_id] || tip
    return tip
  },
  updateTip: function (full_id, props) {
    var tip = audioTooltip.getTip(full_id)
    if (tip.content) {
      jQuery('.audio-name', tip.content).text(props.name || '--- -------- --- ------ --')
      jQuery('.audio-size', tip.content).text(smartSize(props.size))
      jQuery('.audio-bitrate', tip.content).text(smartBitrate(props.size, props.duration))
      tooltip.setPosition()
    }
  },
  onProgress: function (full_id, progress) {
    var tip = audioTooltip.getTip(full_id)
    if (tip.content) {
      var bar = jQuery('.vkmd-audio-progress', tip.content)
      if (progress >= 0.95) {
        ProgressBar.create(bar[0]).animate(bar[0])
      }
      ProgressBar.create(bar[0]).progress(bar[0], progress)
    }
  },
  onDownloadSuccess: function (full_id) {
    var tip = audioTooltip.getTip(full_id)
    if (tip.content) {
      var bar = jQuery('.vkmd-audio-progress', tip.content)
      ProgressBar.create(bar[0]).stop(bar[0]).hide(bar[0])
    }
  },
  /**
   * @param {sting} full_id 
   * @param {number} size 
   */
  onSize: function (full_id, size) {
    var data = audioTooltip.controller.getCache(full_id)
    audioTooltip.updateTip(full_id, data)
  },
  /**
   * @param {HTMLElement} target
   * @param {string} full_id
   * @param {any} props
   * @return {HTMLElement}
   */
  createTip: function (target, full_id, props) {
    var tip = audioTooltip.getTip(full_id)
    if (!tip.content) {
      tip.onDownload = function () {
        audioTooltip.controller && audioTooltip.controller.download(full_id)
      }
      tip.content = jQuery(`
      <div class="vkmd-audio-tooltip" data-full-id="${full_id}">
        <div class="audio-name" title="${'Скачать'}"></div>
        <span class="audio-size-container">
          <span class="audio-size"></span>
          <span class="audio-separator">|</span>
          <span class="audio-bitrate"></span>
        </span>
        <div class="vkmd-audio-progress"></div>
      </div>`)
    }
    audioTooltip.show(tip, '.audio-name', audioTooltip.settingsModel.getValue('audio-tooltip-name'))
    audioTooltip.show(tip, '.audio-size-container', audioTooltip.settingsModel.getValue('audio-tooltip-size'))
    var element = jQuery('.audio-name', tip.content)[0]
    element.addEventListener('click', tip.onDownload)
    logger.debug(time(), 'createTip', full_id, props)
    audioTooltip.updateTip(full_id, props)
    return tooltip.createTip(target, tip.content[0])
  },
  /**
   * 
   * @param {IAudioTip} tip
   * @param {string} selector
   * @param {boolean} show
   */
  show: function (tip, selector, show) {
    var element = tip.content[0].querySelector(selector)
    if (show) {
      element.classList.remove('removed')
    } else {
      element.classList.add('removed')
    }
  },
  /** @param {number} [timeout] */
  cancelTip: function (timeout) {
    return tooltip.cancelTip(timeout)
  },
}

module.exports = audioTooltip

 }),
/* 53 */
 (function(module, exports) {

function EventEmitter() {
  this._listenerMap = {}
  this._wildcardListeners = []
}
/**
 * @param {string} event
 * @param {(...args: any[]) => void} callback
 */
EventEmitter.prototype.addListener = function addListener(event, callback) {
  var listeners = event === '*' ? this._wildcardListeners : this._listenerMap[event]
  listeners = Array.isArray(listeners) ? listeners : []
  var index = listeners.indexOf(callback)
  if (index === -1) {
    listeners.push(callback)
  }
  if (event !== '*') {
    this._listenerMap[event] = listeners
  }
}

/**
 * @param {string} [event]
 * @param {(...args: any[]) => void} [callback]
 */
EventEmitter.prototype.removeListener = function removeListener(event, callback) {
  if (!event) {
    var events = Object.keys(this._listenerMap)
    for (var ev of events) {
      if (Array.isArray(this._listenerMap[ev])) {
        this._listenerMap[ev].length = 0
      }
      delete this._listenerMap[ev]
    }
    return
  }
  var listeners = event === '*' ? this._wildcardListeners : this._listenerMap[event]
  if (!callback && Array.isArray(listeners)) {
    listeners.length = 0
    delete this._listenerMap[event]
    return
  }
  if (Array.isArray(listeners)) {
    var index = listeners.indexOf(callback)
    if (index !== -1) {
      listeners.splice(index, 1)
    }
    if (!listeners.length) {
      delete this._listenerMap[event]
    }
  }
}

/**
 * @param {string} event
 */
EventEmitter.prototype.emit = function emit(event) {
  var wildcards = this._wildcardListeners
  for (var callback of wildcards) {
    callback.apply(null, arguments)
  }
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
/* 54 */
 (function(module, exports) {


var _globals_ = []
if (typeof unsafeWindow !== 'undefined') {
  _globals_.push(unsafeWindow)
}
if (typeof window !== 'undefined') {
  _globals_.push(window)
}

_globals_.forEach(function (g) {
  g.HTMLElement = g.HTMLElement || function () { }
  g.HTMLElement.prototype.toJSON = function () {
    return serialize.html(this)
  }
  /*
  g.Map.prototype.toJSON = function () {
    return serialize.map(this)
  }
  g.Set.prototype.toJSON = function () {
    return serialize.set(this)
  }
  */
  g.Function.prototype.toJSON = function () {
    return serialize.function(this)
  }
  var a = ['ArrayBuffer', 'Uint8Array', 'Int8Array', 'Uint16Array', 'Int16Array', 'Uint32Array', 'Int32Array']
  a.forEach(function (name) {
    if (g[name] && g[name].prototype) {
      g[name].prototype.toJSON = function () {
        return serialize.typedArray(this)
      }
    }
  })
})

var serialize = {
  getType: function (target) {
    return Object.prototype.toString.call(target).replace('[object ', '').slice(0, -1)
  },
  /** @param {HTMLElement} element */
  html: function (element) {
    var tag = element.tagName.toLowerCase()
    var s = []
    for (var attr of element.getAttributeNames()) {
      s.push(`${attr}="${element.getAttribute(attr)}"`)
    }
    return `[HTMLElement: <${tag} ${s.join(' ')} />]`
  },
  /** @param {any[]} array */
  typedArray: function (array) {
    var type = Object.getPrototypeOf(array).constructor.name
    try {
      var data = array.length < 20 ? array.toString() : `bytes:${array.byteLength}`
      return `[${type}: [${data}]]`
    } catch (e) {
      return `[${type}: [${e.message}]]`
    }
  },
  /** @param {Map} map */
  map: function (map) {
    var entries = Array.from(map.entries())
    return `[Map: ${serialize.object(entries)}]`
  },
  set: function (set) {
    var array = Array.from(set)
    return `[Set: ${serialize.object(array)}]`
  },
  function: function (func) {
    return `[Function: [${func.name}: ${func.toString()}]]`
  },
  /** @param {Window} win */
  window: function (win) {
    try {
      return `[Window: ${win.location}]`
    } catch (e) {
      return `[Window: cross-origin]`
    }
  },
  /** @param {HTMLDocument} doc */
  document: function (doc) {
    return `[Document: ${doc.title}]`
  },
  /** @param {Error} err */
  error: function (err) {
    return `[Error: ${err.message}]`
  },
  object: function (object) {
    try {
      return serialize._object(object)
    } catch (e) {
      console.log(e, object)
      return Object.prototype.toString.call(object)
    }
  },
  _object: function (object) {
    var s = []
    if (object instanceof HTMLElement) {
      return serialize.html(object)
    }
    if (object && typeof object.byteLength !== 'undefined') {
      return serialize.typedArray(object)
    }
    if (object instanceof Error) {
      return serialize.error(object)
    }
    var type = serialize.getType(object)
    switch (type) {
      case 'Map':
        return serialize.map(object)
      case 'Set':
        return serialize.set(object)
      case 'Window':
        return serialize.window(object)
      case 'Document':
        return serialize.document(object)
      case 'RegExp':
        return `[${type}: ${object.toString()}]`
      case 'Function':
        return `[${type}: ${object.name}]`
      case 'Null':
      case 'Undefined':
      case 'Number':
      case 'String':
        return `${object}`
      case 'Object':
      case 'Array':
        return JSON.stringify(object, function (_, val) {
          if (typeof val == 'object' && val !== null && s.indexOf(val) !== -1) {
            return '[Cyclic: ]'
          }
          s.push(val)
          return val
        })
      case 'Arguments':
        return serialize.object(Array.prototype.slice.call(object))
      default:
        return `[${type}: ${object && object.toString && object.toString()}]`
    }
  },
}

module.exports = serialize


 }),
/* 55 */
 (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

 }),
/* 56 */
 (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

 }),
/* 57 */
 (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

 }),
/* 58 */
 (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

 }),
/* 59 */
 (function(module, exports, __webpack_require__) {

var deepCopy = __webpack_require__(6)
var createElement = __webpack_require__(19)
var eventEmitter = __webpack_require__(2)
var i18n = __webpack_require__(3)

__webpack_require__(60)

/**
 * @typedef {import("../settings/settingsOptions").ISettingsOption} ISettingsOption
 * @typedef {import("../settings/settingsTabs").ISettingsTab} ISettingsTab
 * 
 * @typedef {{
 *  title: string;
 *  deleteTitle?: string;
 *  resetTitle?: string;
 *  saveTitle?: string;
 *  tabs: ISettingsTab[];
 *  options: ISettingsOption[];
 *  onDelete?: () => void;
 *  onReset?: () => void;
 *  onSave?: () => void;
 *  onChange? (key: string, value: string | boolean) => void;
 *  onChangeLang?: (lang: string) => void;
 * }} ISettingsViewProps
 */

var settingsView = {
  /**
   * @param {ISettingsViewProps} props
   * @param {HTMLElement} [root]
   * @return {HTMLElement}
   */
  create: function (props, root) {
    settingsView.props = deepCopy(props)

    root = root || document.body
    var element = settingsView.getElement()
    if (!element.parentNode) {
      root.appendChild(element)
    }
    settingsView.registerListeners()
    settingsView.insertButtons()
    return element
  },
  registerListeners: function () {
    var element = settingsView.getElement()
    var ui = element.querySelector('.ui-contents')
    ui.addEventListener('change', settingsView.onChange)
    ui.addEventListener('change', settingsView.onChangeTab)
    eventEmitter.addListener('option', settingsView.updateOption)
    element.querySelector('.ui-delete').addEventListener('click', settingsView.onDelete)
    element.querySelector('.ui-reset').addEventListener('click', settingsView.onReset)
    element.querySelector('.ui-save').addEventListener('click', settingsView.onSave)
    settingsView.onChangeTab({ target: ui.querySelector('input') })
  },
  /** @return {HTMLElement} */
  getElement: function () {
    if (settingsView.element) {
      return settingsView.element
    }
    var title = this.props.title || 'head'
    var buttons = {
      del: i18n.text('DELETE_BUTTON_DESCRIPTION'),
      reset: i18n.text('RESET_BUTTON_DESCRIPTION'),
      save: i18n.text('SAVE_BUTTON_DESCRIPTION'),
    }
    var logoUrl = 'https://vk.com/images/svg_icons/ic_head_logo.svg';
    var tabs = this.props.tabs
    var element = settingsView.element = createElement(`
    <div class="ui-container">
      <div class="ui-head modal-header">
        <div class="ui-head-title">${title}</div>
        <label for="modal-checkbox" title="close" class="modal-close-x"><div></div></label>
        <div class="ui-flash-message hidden"></div>
      </div>
      <div class="ui-body">
        <div class="ui-vklogo-container">
          <img class="ui-vklogo" src="${logoUrl}" />
        </div>
        <div class="ui-tabs">
          ${tabs.map(settingsView.createTab).join('')}
        </div>
        <div class="ui-contents">
          ${tabs.map(settingsView.createContent).join('')}
        </div>
      </div>
      <div class="ui-foot">
        <div class="ui-button-vkmd ui-delete touchable" title="${buttons.del}">
          <svg version="1.1" id="recycle-t2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 465.311 465.311" style="enable-background:new 0 0 465.311 465.311;" xml:space="preserve" width="24" height="24"><g><g>
            <path d="M372.811,51.002h-59.908V36.566C312.902,16.404,296.499,0,276.335,0h-87.356c-20.163,0-36.567,16.404-36.567,36.566v14.436   H92.5c-20.726,0-37.587,16.861-37.587,37.587v38.91c0,8.284,6.716,15,15,15h7.728v307.812c0,8.284,6.716,15,15,15H372.67   c8.284,0,15-6.716,15-15V142.499h7.728c8.284,0,15-6.716,15-15v-38.91C410.397,67.863,393.536,51.002,372.811,51.002z    M182.412,36.566c0-3.621,2.946-6.566,6.567-6.566h87.356c3.621,0,6.567,2.946,6.567,6.566v14.436h-100.49V36.566z M84.914,88.589   c0-4.184,3.403-7.587,7.587-7.587h280.31c4.184,0,7.587,3.403,7.587,7.587v23.91H84.914V88.589z M357.67,435.311H107.641V142.499   H357.67V435.311z" data-original="#000000" class="active-path" data-old_color="#000000" style="fill:#FFFFFF"></path>
            <path d="M137.41,413.485c5.523,0,10-4.477,10-10V166.497c0-5.523-4.477-10-10-10s-10,4.477-10,10v236.988   C127.41,409.008,131.887,413.485,137.41,413.485z" data-original="#000000" class="active-path" data-old_color="#000000" style="fill:#FFFFFF"></path>
            <path d="M200.907,413.485c5.523,0,10-4.477,10-10V166.497c0-5.523-4.477-10-10-10s-10,4.477-10,10v236.988   C190.907,409.008,195.384,413.485,200.907,413.485z" data-original="#000000" class="active-path" data-old_color="#000000" style="fill:#FFFFFF"></path>
            <path d="M264.404,413.485c5.523,0,10-4.477,10-10V166.497c0-5.523-4.477-10-10-10s-10,4.477-10,10v236.988   C254.404,409.008,258.881,413.485,264.404,413.485z" data-original="#000000" class="active-path" data-old_color="#000000" style="fill:#FFFFFF"></path>
            <path d="M327.901,413.485c5.523,0,10-4.477,10-10V166.497c0-5.523-4.477-10-10-10s-10,4.477-10,10v236.988   C317.901,409.008,322.378,413.485,327.901,413.485z" data-original="#000000" class="active-path" data-old_color="#000000" style="fill:#FFFFFF"></path>
            </g></g>
          </svg>
        </div>
        <div class="ui-button-vkmd ui-reset touchable" title="${buttons.reset}">
          <svg version="1.1" id="recycle-c1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 383.631 383.631" style="enable-background:new 0 0 383.631 383.631;" xml:space="preserve" width="24" height="24" class="">
            <g><path d="M47.331,210.289c-1.408,1.375-3.273,2.296-5.374,2.508c-0.116,0.012-0.232,0.021-0.349,0.029  c-0.006,0-0.013,0.001-0.02,0.001c-0.185,0.011-0.367,0.017-0.549,0.017c-2.109,0-4.073-0.737-5.624-1.982  c-0.001,0-0.001,0-0.001-0.001c-0.007-0.005-0.013-0.01-0.019-0.015c-0.002-0.001-0.004-0.003-0.006-0.004  c-0.004-0.003-0.009-0.007-0.013-0.011c-0.003-0.002-0.007-0.005-0.01-0.008s-0.006-0.005-0.009-0.007  c-0.004-0.003-0.009-0.007-0.013-0.01c-0.002-0.001-0.004-0.003-0.006-0.005c-0.005-0.004-0.011-0.008-0.016-0.013  c-0.046-0.038-0.092-0.077-0.138-0.116c-0.006-0.005-0.012-0.01-0.018-0.015c-0.001-0.001-0.002-0.002-0.003-0.002  c-0.005-0.004-0.01-0.009-0.016-0.013c-0.001-0.002-0.004-0.004-0.006-0.005c-0.004-0.004-0.008-0.007-0.013-0.011  c-0.003-0.002-0.006-0.005-0.009-0.007c-0.003-0.003-0.006-0.006-0.01-0.009c-0.004-0.004-0.009-0.008-0.014-0.012  c-0.001-0.002-0.003-0.003-0.005-0.005c-0.207-0.183-0.405-0.375-0.595-0.575L2.505,176.658c-3.44-3.587-3.322-9.285,0.266-12.725  c3.587-3.44,9.284-3.322,12.725,0.265l16.426,17.125c3.887-58.736,40.101-111.535,95.123-135.771  c39.08-17.212,82.524-18.177,122.331-2.714c39.805,15.462,71.206,45.501,88.417,84.582c2.004,4.549-0.06,9.861-4.608,11.864  c-4.55,2.003-9.862-0.061-11.864-4.609c-15.273-34.68-43.139-61.336-78.462-75.058c-35.322-13.721-73.875-12.867-108.558,2.409  C85.342,83.591,53.163,130.64,49.854,182.927l18.381-17.632c3.589-3.44,9.285-3.322,12.726,0.265s3.322,9.284-0.265,12.725  L47.331,210.289z M381.087,207.409l-32.648-33.615c-1.759-1.838-4.291-2.921-7-2.769c-0.005,0-0.01,0-0.017,0.001  c-0.143,0.008-0.285,0.02-0.428,0.034c-2.123,0.221-4.005,1.169-5.415,2.575l-32.732,32.273c-3.54,3.49-3.58,9.188-0.091,12.728  c3.491,3.54,9.189,3.58,12.728,0.09l17.594-17.346c-3.513,52.052-35.643,98.837-84.405,120.314  c-18.545,8.168-37.91,12.033-56.982,12.032c-54.556-0.002-106.675-31.636-130.038-84.682c-2.003-4.548-7.314-6.612-11.864-4.609  c-4.549,2.003-6.612,7.315-4.608,11.864c26.329,59.781,85.053,95.43,146.536,95.426c21.487-0.001,43.319-4.357,64.213-13.559  c55.03-24.239,91.261-77.082,95.127-135.845l17.12,17.627c3.463,3.565,9.16,3.649,12.727,0.186  C384.467,216.673,384.55,210.975,381.087,207.409z" data-original="#000000" class="active-path" data-old_color="#000000" style="fill:#FFFFFF"></path></g>
          </svg>
        </div>
        <div class="ui-button-vkmd ui-save touchable hidden" title="${buttons.save}">
          ${i18n.text('SAVE_BUTTON_TEXT')}
        </div>
      </div>
    </div>
    `)
    return element
  },
  /**
   * @param {ISettingsTab} tab
   * @param {number} index
   * @return {string}
   */
  createContent: function (tab, index) {
    return `
    <input id="${tab.inputId}" style="display: none" type="radio" name="ui-tab" ${index === 0 ? 'checked' : ''} />
    <div class="ui-content">
      <div class="ui-content-title">${tab.title}</div>
      <div class="ui-content-options">${tab.options.map(settingsView.createOption).join('')}</div>
    </div>`
  },
  /**
   * @param {ISettingsTab} tab 
   * @return {string}
   */
  createTab: function (tab) {
    return `
    <label class="ui-tab touchable" for="${tab.inputId}" title="${tab.title}">
      <span>${tab.title}</span>
    </label>`
  },
  /**
   * @param {ISettingsOption} option
   * @return {string}
   */
  createOption: function (option) {
    if (option.type == 'select') {
      return settingsView.createSelect(option)
    }
    if (option.tab == 'sponsor') {
      return settingsView.createLink(option)
    }
    return settingsView.createInput(option)
  },
  /**
   * @param {ISettingsOption} option
   * @return {string}
   */
  createLink: function (option) {
    var span = `<span id="${option.key}" data-type="link">${option.html}</span>`
    return `
    <div class="ui-option ui-link ${option.hidden ? 'hidden' : ''}">
      ${span}
    </div>`
  },
  /**
   * @param {ISettingsOption} option
   * @return {string}
   */
  createInput: function (option) {
    var input = `
    <input
      type="${option.type}"
      id="${option.key}"
      ${option.type === 'checkbox' ? (option.getValue() ? 'checked' : '') : ('value="' + option.getValue(true) + '"')}
      ${option.min !== undefined ? ('min="' + option.min + '"') : ''}
      ${option.max !== undefined ? ('max="' + option.max + '"') : ''}
      ${option.size !== undefined ? ('size="' + option.size + '"') : ''}
      ${option.disabled ? 'disabled' : ''}
      data-type="${option.dataType}"
    >
    </input>`
    var label = `<label for="${option.key}" title="${option.description}">${option.label}</label>`
    var style = option.offsetLeft !== undefined ? `style="margin-left:${option.offsetLeft}px;"` : ''
    return `
    <div class="ui-option ${option.hidden ? 'hidden' : ''}" ${style}>
      ${option.reverse ? label : input}
      ${option.reverse ? input : label}
    </div>`
  },
  /**
   * @param {ISettingsOption} option
   * @return {string}
   */
  createSelect: function (option) {
    var label = `<label for="${option.key}" title="${option.description}">${option.label}</label>`
    var select = `
    <select id="${option.key}">
      ${option.options.map(settingsView.createSOption, option).join('')}
    </select>
    `
    var style = option.offsetLeft !== undefined ? `style="margin-left:${option.offsetLeft}px;"` : ''
    return `
    <div class="ui-option ${option.hidden ? 'hidden' : ''}" ${style}>
      ${option.reverse ? label : select}
      ${option.reverse ? select : label}
    </div>`
  },
  /**
   * @this ISettingsOption
   * @param {string} value
   */
  createSOption: function (value) {
    var option = this
    return `
    <div class="ui-select-option">
      <option value="${value}" ${value === option.getValue() ? 'selected' : ''}>
        ${value}
      </option>
    </div>
    `
  },
  insertButtons: function () {
    settingsView.insertButtonTopProfile()
    settingsView.insertButtonMobile()
    settingsView.insertButtonMobileMenu()
    settingsView.insertButtonLeftMenu()
    settingsView.insertButtonPopupSettings()
  },
  /**
   * @param {ISettingsOption} option
   */
  updateOption: function (option) {
    var input = settingsView.getElement().querySelector('#' + option.key)
    if (!input) {
      return
    }
    if (input.getAttribute('data-type') == 'link') {
      input.innerHTML = option.html
      return
    }
    settingsView.setItemValue(input, option.getValue(true))
    settingsView.setItemHidden(input.parentNode, option.hidden)
    settingsView.setItemDisabled(input, option.disabled)
    var label = input.parentNode.querySelector('label')
    label.textContent = option.label
    label.title = option.description
  },
  /**
   * @param {ISettingsTab} tab
   */
  updateTab: function (tab) {
    var title = settingsView.getElement().querySelector('#' + tab.inputId + ' + .ui-content .ui-content-title')
    if (!title) {
      return
    }
    title.textContent = tab.title
    var elm = settingsView.getElement().querySelector('.ui-tab[for="' + tab.inputId + '"]')
    if (elm) {
      elm.setAttribute('title', tab.title)
      elm.querySelector('span').textContent = tab.title
    }
  },
  updateFooter: function () {
    var reset = settingsView.getElement().querySelector('.ui-reset')
    var del = settingsView.getElement().querySelector('.ui-delete')
    var save = settingsView.getElement().querySelector('.ui-save')
    reset.setAttribute('title', i18n.text('RESET_BUTTON_DESCRIPTION'))
    del.setAttribute('title', i18n.text('DELETE_BUTTON_DESCRIPTION'))
    save.setAttribute('title', i18n.text('SAVE_BUTTON_DESCRIPTION'))
    save.textContent = i18n.text('SAVE_BUTTON_TEXT')
  },
  /**
   * @param {HTMLElement} input
   * @param {any} value
   */
  setItemValue: function (input, value) {
    if (input.type == 'checkbox' || input.type == 'radio') {
      input.checked = value
    } else {
      input.value = value
    }
  },
  /**
   * @param {HTMLElement} element
   * @param {boolean} [hidden]
   */
  setItemHidden: function (element, hidden) {
    if (hidden) {
      element.classList.add('hidden')
    } else {
      element.classList.remove('hidden')
    }
  },
  /**
   * @param {HTMLElement} input
   * @param {boolean} [hidden]
   */
  setItemDisabled: function (input, disabled) {
    if (disabled) {
      input.setAttribute('disabled')
    } else {
      input.removeAttribute('disabled')
    }
  },
  /**
   * @param {ISettingsOption} option
   */
  updateLink: function (option) {
    var span = settingsView.getElement().querySelector('#' + option.key, + '[data-type="link"]')
    if (span) {
      span.innerHTML = option.html
    }
  },
  /**
   * @param {ISettingsOption} option
   */
  updateLang: function (option) {
    if (option.type == 'link') {
      return settingsView.updateLink(option)
    }
    var label = settingsView.getElement().querySelector('label[for="' + option.key + '"]')
    if (!label) {
      return
    }
    label.title = option.description
    label.textContent = option.label
  },
  /** @param {Event} e */
  onChange: function (e) {
    var name = e.target.getAttribute('name')
    if (!e.isTrusted || name == 'ui-tab') {
      return
    }
    var type = e.target.type
    var key = e.target.id
    var value = e.target.value
    if (type == 'checkbox' || type == 'radio') {
      value = e.target.checked
    }
    var props = settingsView.props
    props.onChange && props.onChange(key, value)
    if (key === 'vkmd-lang') {
      settingsView.onChangeLang(value)
    }
  },
  /** @param {Event} e */
  onChangeTab: function (e) {
    if (!e.target) {
      return
    }
    var tab = document.querySelector(`label.ui-tab[for="${e.target.id}"]`)
    if (!tab) {
      return
    }
    tab.classList.add('checked')
    var tabs = document.querySelectorAll(`label.ui-tab:not([for="${e.target.id}"])`)
    tabs.forEach(function (t) {
      t.classList.remove('checked')
    })
  },
  onChangeLang: function (lang) {
    var props = settingsView.props
    props.onChangeLang && props.onChangeLang(lang)
  },
  onDelete: function () {
    var props = settingsView.props
    props.onDelete && props.onDelete()
  },
  onReset: function () {
    var props = settingsView.props
    props.onReset && props.onReset()
  },
  onSave: function () {
    var props = settingsView.props
    props.onSave && props.onSave()
  },
  /** @param {import('../controllers/settingsController')} controller */
  setController: function (controller) {
    settingsView.controller = controller
  },
  insertButtonTopProfile: function () {
    var top_profile = settingsView.createButtonTopProfile()
    var supportLink = document.querySelector('#top_support_link');
    var button = document.querySelector('.top_profile_mrow[for="modal-checkbox"]')
    if (supportLink && !button) {
      supportLink.parentNode.insertBefore(top_profile, supportLink.nextSibling);
    }
    var sep = document.querySelector('.top_profile_sep');
    if (sep && supportLink && !button) {
      supportLink.parentNode.insertBefore(sep.cloneNode(true), supportLink.nextSibling);
    }
    return top_profile
  },
  createButtonTopProfile: function () {
    var top_profile = createElement('<label for="modal-checkbox" class="top_profile_mrow ui-vkmd-right" style="cursor:pointer">VkMD</label>')
    return top_profile
  },
  insertButtonMobile: function () {
    var mobile = settingsView.createButtonMobile()
    var button = document.querySelector('.MainMenu__menuItem Icon_menu_vkmd')
    var mainMenuItems = document.querySelectorAll('.MainMenu__menuItem');
    if (!button && mainMenuItems.length) {
      mainMenuItems[0].parentNode.insertBefore(mobile, mainMenuItems[mainMenuItems.length - 1])
    }
    return mobile
  },
  createButtonMobile: function () {
    var mobile = createElement(`
    <label for="modal-checkbox" class="MainMenu__menuItem al_menu Row" href="/vkmd" data-skiponclick="1" style="cursor: pointer;">
      <div class="MainMenu__menuItemIcon Icon Icon_menu_vkmd"></div>
      <div class="MainMenu__menuItemTitle">Vk Media Downloader</div>
    </label>`)
    return mobile
  },
  insertButtonMobileMenu: function () {
    var mobile_menu = settingsView.createButtonMobileMenu()
    var button = document.querySelector('.main_menu mmi_vkmd')
    var mainMenuLi = document.querySelectorAll('.main_menu > li');
    if (!button && mainMenuLi.length) {
      mainMenuLi[0].parentNode.insertBefore(mobile_menu, mainMenuLi[mainMenuLi.length - 1]);
    }
    return mobile_menu
  },
  createButtonMobileMenu: function () {
    var mobile_menu = createElement(`
    <li class="mmi_vkmd">
      <label for="modal-checkbox" style="cursor: pointer" href="/vkmd" data-skiponclick="1" class="mm_item al_menu" data-header="Vk Media Downloader">
        <i class="i_icon"></i>
        <span class="mmi_wrap">
          <span class="mm_label">Vk Media Downloader</span>
        </span>
      </label>
    </li>`)
    return mobile_menu
  },
  insertButtonLeftMenu: function () {
    var left_menu = settingsView.createButtonLeftMenu()
    var button = document.querySelector('#side_bar .side_bar_inner #l_vkmd')
    var sideBarInner = document.querySelector('#side_bar .side_bar_inner nav ol')
    if (!button && sideBarInner) {
      sideBarInner.appendChild(left_menu)
    }
    return left_menu
  },
  createButtonLeftMenu: function () {
    var left_menu = createElement(`
    <li id="l_vkmd">
      <label for="modal-checkbox" href="/apps?act=vkmd" class="left_row" style="cursor: pointer">
        <span class="left_fixer" style="cursor: pointer;">
          <span class="left_count_wrap fl_r left_void" style="opacity: 1; display: block;">
            <span class="inl_bl left_count_sign"></span>
          </span>
          <span class="left_icon fl_l"></span>
          <span class="left_label inl_bl">VkMD</span>
        </span>
      </label>
      <div class="left_settings" onclick="menuSettings(0)">
        <div class="left_settings_inner"></div>
      </div>
    </li>`)
    return left_menu
  },
  insertButtonPopupSettings: function () {
    var popup_settings = settingsView.createButtonPopupSettings()
    var section = document.querySelector('.settings_menu_rows .olist_section')
    var button = section && section.querySelector('.olist_item_vkmd')
    if (section && !button) {
      section.appendChild(popup_settings)
    }
    return popup_settings
  },
  createButtonPopupSettings: function () {
    var popup_settings = createElement(`
    <a onclick="return Settings.toggleMenuBoxRow(this, 0, 'no_apps_manage')" class="olist_item_wrap olist_item_menu olist_item_vkmd olist_item_wrap_on">
      <div class="olist_item clear_fix">
        <span class="olist_checkbox fl_r"></span>
        <span class="olist_item_photo fl_l"></span>
        <span class="olist_item_name fl_l">Vk Media Downloader</span>
      </div>
    </a>`)
    return popup_settings
  },
}

module.exports = settingsView

 }),
/* 60 */
 (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

 }),
/* 61 */
 (function(module, exports, __webpack_require__) {

var createElement = __webpack_require__(19)
var logger = __webpack_require__(0)
var time = __webpack_require__(1)
__webpack_require__(62)

var modalView = {
  create: function () {
    var element = modalView.getElement()
    if (!element.parentNode) {
      document.body.appendChild(element)
    }
    logger.debug(time(), 'modal', element)
    return element
  },
  /** @return {HTMLElement} */
  getElement: function () {
    if (modalView.element) {
      return modalView.element
    }
    var element = modalView.element = createElement(`
    <div class="modal-wrapper">
      <input type="checkbox" style="display: none; z-index: 1000; position: fixed; top: 10px; left: 10px;" id="modal-checkbox" />
      <div class="modal-container">
          <label for="modal-checkbox" class="modal-close-background" ></label>
          <div class="modal-content">
              ${'' && false}
              <div class="modal-body"></div>
              <div class="modal-footer"></div>
          </div>
      </div>
    </div>
    `)
    return element
  },
}

module.exports = modalView

 }),
/* 62 */
 (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

 }),
/* 63 */
 (function(module, exports, __webpack_require__) {

var isEqual = __webpack_require__(30)
var logger = __webpack_require__(0)
var smartSize = __webpack_require__(9)
var parseSize = __webpack_require__(64)
var time = __webpack_require__(1)
var i18n = __webpack_require__(3)

var _1GiB = 1 * 1024 * 1024 * 1024
var _1MiB = 1 * 1024 * 1024

function noop() { }

/**
 * @this ISettingsOption
 * @param {boolean} [format]
 */
function getValue(format = false) {
  var val = this.value === undefined ? this.defaultValue : this.value
  return format && this.formatValue ? this.formatValue(val) : val
}

/**
 * @this ISettingsOption
 * @param {any} val
 * @param {boolean} [parse]
 */
function setValue(val, parse = false) {
  var value = parse && this.parseValue ? this.parseValue(val) : val
  if (!this.validateValue || this.validateValue(value)) {
    this.value = value
  } else {
    logger.warn(time(), 'setValue validation failed, key = ', this.key, ', val = ', val)
  }
}

/**
 * @this ISettingsOption
 */
function setDefaultValue() {
  var value = this.defaultValue !== undefined ? this.defaultValue : this.getValue()
  this.value = value
}

/** @param {number} val */
function formatSizeValue(val) {
  return smartSize(val)
}

/**
 * @this ISettingsOption
 * @param {string} val
 * @return {number}
 */
function parseSizeValue(val) {
  try {
    return parseSize(val)
  } catch (e) {
    logger.error(time(), this.key, ', invalid parse value = ', val)
    return this.getValue()
  }
}

function filenameValidator(symbol) {
  var regex = /[<>:"/\\|?*]/g
  return !regex.test(symbol)
}

/**
 * @this ISettingsOption
 */
function isDefault() {
  return isEqual(this.getValue(), this.defaultValue)
}

/** 
 * @typedef {{
 *  key: string;
 *  value: any;
 *  defaultValue: any;
 *  type: string;
 *  tab: string;
 *  offsetLeft?: number;
 *  hidden?: boolean;
 *  min?: number;
 *  max?: number;
 *  size?: number;
 *  reverse?: boolean;
 *  description: string;
 *  label?: string;
 *  options?: string[];
 *  parseValue?: (val: string) => any;
 *  formatValue?: (val: any) => string;
 *  validateValue?: (val: any) => boolean;
 *  getValue: (format: boolean) => any;
 *  setValue: (val: any, parse: boolean) => void;
 *  setDefaultValue: () => void;
 * }} ISettingsOption
 */

/** @type {ISettingsOption[]} */
var settingsOptions = [{
  type: 'checkbox',
  key: 'log-autosave',
  tab: 'logger',
  defaultValue: false,
  dataType: 'boolean',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  get description() { return i18n.text('LOGGER_AUTOSAVE_DESCRIPTION') },
  get label() { return i18n.text('LOGGER_AUTOSAVE_LABEL') },
}, {
  type: 'number',
  key: 'log-buffer-size',
  tab: 'logger',
  defaultValue: 500,
  dataType: 'number',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  reverse: true,
  get description() { return i18n.text('LOGGER_BUFFER_SIZE_DESCRIPTION') },
  get label() { return i18n.text('LOGGER_BUFFER_SIZE_LABEL') },
  validateValue: function (val) {
    return val > 100 && val < (100 * 1000)
  },
}, {
  type: 'checkbox',
  key: 'log-level-log',
  tab: 'logger',
  defaultValue: true,
  dataType: 'boolean',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  get description() { return i18n.text('LOGGER_LOG_DESCRIPTION') },
  get label() { return i18n.text('LOGGER_LOG_LABEL') },
}, {
  type: 'checkbox',
  key: 'log-level-debug',
  tab: 'logger',
  defaultValue: false,
  dataType: 'boolean',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  get description() { return i18n.text('LOGGER_DEBUG_DESCRIPTION') },
  get label() { return i18n.text('LOGGER_DEBUG_LABEL') },
}, {
  type: 'checkbox',
  dataType: 'boolean',
  key: 'log-level-warn',
  tab: 'logger',
  defaultValue: true,
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  get description() { return i18n.text('LOGGER_WARN_DESCRIPTION') },
  get label() { return i18n.text('LOGGER_WARN_LABEL') },
}, {
  type: 'checkbox',
  key: 'log-level-info',
  tab: 'logger',
  defaultValue: true,
  dataType: 'boolean',
  getValue: getValue,
  setValue: setValue,
  setDefaultValue: setDefaultValue,
  isDefault: isDefault,
  get description() { return i18n.text('LOGGER_INFO_DESCRIPTION') },
  get label() { return i18n.text('LOGGER_INFO_LABEL') },
}, {
  type: 'checkbox',
  key: 'log-level-error',
  tab: 'logger',
  defaultValue: true,
  dataType: 'boolean',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  get description() { return i18n.text('LOGGER_ERROR_DESCRIPTION') },
  get label() { return i18n.text('LOGGER_ERROR_LABEL') },
}, {
  type: 'select',
  key: 'vkmd-lang',
  tab: 'general',
  options: ['ru', 'en'],
  get defaultValue() {
    var languages = (navigator.languages || [navigator.language || navigator.userLanguage]).map(function (lang) {
      return lang.match(/^[a-zA-Z]+/)[0]
    }).filter(function (lang, index, array) {
      return array.indexOf(lang) === index
    }).filter(Boolean)
    var lang = languages[0]
    return this.options.indexOf(lang) > -1 ? lang : 'en'
  },
  dataType: 'string',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  validateValue: function (val) {
    val = (val || '').toLowerCase()
    return this.options.indexOf(val) > -1
  },
  get description() { return i18n.text('SELECT_LANGUAGE_DESCRIPTION') },
  get label() { return i18n.text('SELECT_LANGUAGE_LABEL') },
}, {
  type: 'text',
  key: 'hls-max-size',
  tab: 'general',
  defaultValue: 200 * 1024 * 1024, // 200 MiB
  dataType: 'number',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  reverse: true,
  get description() { return i18n.text('HLS_MAX_SIZE_DESCRIPTION') },
  get label() { return i18n.text('HLS_MAX_SIZE_LABEL') },
  validateValue: function (val) {
    return val > 0 && val < (2 * _1GiB)
  },
  formatValue: formatSizeValue,
  parseValue: parseSizeValue,
}, {
  type: 'text',
  key: 'blob-max-size',
  tab: 'general',
  defaultValue: 8 * 1024 * 1024,
  dataType: 'number',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  reverse: true,
  get description() { return i18n.text('BLOB_MAX_SIZE_DESCRIPTION') },
  get label() { return i18n.text('BLOB_MAX_SIZE_LABEL') },
  validateValue: function (val) {
    return val > 0 && val < (2 * _1GiB)
  },
  formatValue: formatSizeValue,
  parseValue: parseSizeValue,
}, {
  type: 'checkbox',
  key: 'ffmpeg-enable',
  tab: 'general',
  defaultValue: true,
  dataType: 'boolean',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  get description() { return i18n.text('FFMPEG_ENABLE_DESCRIPTION') },
  get label() { return i18n.text('FFMPEG_ENABLE_LABEL') },
}, {
  type: 'checkbox',
  key: 'audio-with-metadata',
  tab: 'general',
  defaultValue: true,
  dataType: 'boolean',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  get description() { return i18n.text('FFMPEG_ADD_METADATA_DESCRIPTION') },
  get label() { return i18n.text('FFMPEG_ADD_METADATA_LABEL') },
}, {
  type: 'text',
  key: 'ffmpeg-max-size',
  tab: 'general',
  defaultValue: 16 * 1024 * 1024,
  dataType: 'number',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  reverse: true,
  get description() { return i18n.text('FFMPEG_MAX_SIZE_DESCRIPTION') },
  get label() { return i18n.text('FFMPEG_MAX_SIZE_LABEL') },
  validateValue: function (val) {
    return val > 0 && val < (2 * _1GiB)
  },
  formatValue: formatSizeValue,
  parseValue: parseSizeValue,
}, {
  type: 'checkbox',
  key: 'audio-tooltip-show',
  tab: 'tooltip',
  defaultValue: true,
  dataType: 'boolean',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  get description() { return i18n.text('AUDIO_TOOLTIP_SHOW_DESCRIPTION') },
  get label() { return i18n.text('AUDIO_TOOLTIP_SHOW_LABEL') },
}, {
  type: 'checkbox',
  key: 'audio-tooltip-name',
  tab: 'tooltip',
  offsetLeft: 10,
  defaultValue: true,
  dataType: 'boolean',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  get description() { return i18n.text('AUDIO_TOOLTIP_NAME_DESCRIPTION') },
  get label() { return i18n.text('AUDIO_TOOLTIP_NAME_LABEL') },
}, {
  type: 'checkbox',
  key: 'audio-tooltip-size',
  tab: 'tooltip',
  offsetLeft: 10,
  defaultValue: true,
  dataType: 'boolean',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  get description() { return i18n.text('AUDIO_TOOLTIP_SIZE_DESCRIPTION') },
  get label() { return i18n.text('AUDIO_TOOLTIP_SIZE_LABEL') },
}, {
  type: 'checkbox',
  key: 'audio-tooltip-link',
  tab: 'tooltip',
  hidden: true,
  defaultValue: false,
  dataType: 'boolean',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  get description() { return i18n.text('AUDIO_TOOLTIP_LINK_DESCRIPTION') },
  get label() { return i18n.text('AUDIO_TOOLTIP_LINK_LABEL') },
}, {
  type: 'checkbox',
  key: 'video-tooltip-show',
  tab: 'tooltip',
  hidden: false,
  defaultValue: true,
  dataType: 'boolean',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  get description() { return i18n.text('VIDEO_TOOLTIP_SHOW_DESCRIPTION') },
  get label() { return i18n.text('VIDEO_TOOLTIP_SHOW_LABEL') },
}, {
  type: 'checkbox',
  key: 'video-resolution-add',
  tab: 'filename',
  hidden: false,
  defaultValue: true,
  dataType: 'boolean',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  get description() { return i18n.text('VIDEO_RESOLUTION_ADD_DESCRIPTION') },
  get label() { return i18n.text('VIDEO_RESOLUTION_ADD_LABEL') },
}, {
  type: 'text',
  key: 'symbol-less-than',
  name: '<',
  tab: 'filename',
  hidden: false,
  reverse: true,
  defaultValue: '[',
  dataType: 'string',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  validateValue: filenameValidator,
  get description() { return i18n.text('FILENAME_SPECIAL_SYMBOL_REPLACE_DESCRIPTION', { spec: this.name }) },
  get label() { return i18n.text('FILENAME_SPECIAL_SYMBOL_REPLACE_LABEL', { spec: this.name }) },
}, {
  type: 'text',
  key: 'symbol-greater-than',
  name: '>',
  tab: 'filename',
  hidden: false,
  reverse: true,
  defaultValue: ']',
  dataType: 'string',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  validateValue: filenameValidator,
  get description() { return i18n.text('FILENAME_SPECIAL_SYMBOL_REPLACE_DESCRIPTION', { spec: this.name }) },
  get label() { return i18n.text('FILENAME_SPECIAL_SYMBOL_REPLACE_LABEL', { spec: this.name }) },
}, {
  type: 'text',
  key: 'symbol-colon',
  name: ':',
  tab: 'filename',
  hidden: false,
  reverse: true,
  defaultValue: '',
  dataType: 'string',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  validateValue: filenameValidator,
  get description() { return i18n.text('FILENAME_SPECIAL_SYMBOL_REPLACE_DESCRIPTION', { spec: this.name }) },
  get label() { return i18n.text('FILENAME_SPECIAL_SYMBOL_REPLACE_LABEL', { spec: this.name }) },
}, {
  type: 'text',
  key: 'symbol-double-quote',
  name: '"',
  tab: 'filename',
  hidden: false,
  reverse: true,
  defaultValue: '\'',
  dataType: 'string',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  validateValue: filenameValidator,
  get description() { return i18n.text('FILENAME_SPECIAL_SYMBOL_REPLACE_DESCRIPTION', { spec: this.name }) },
  get label() { return i18n.text('FILENAME_SPECIAL_SYMBOL_REPLACE_LABEL', { spec: this.name }) },
}, {
  type: 'text',
  key: 'symbol-forward-slash',
  name: '/',
  tab: 'filename',
  hidden: false,
  reverse: true,
  defaultValue: '_',
  dataType: 'string',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  validateValue: filenameValidator,
  get description() { return i18n.text('FILENAME_SPECIAL_SYMBOL_REPLACE_DESCRIPTION', { spec: this.name }) },
  get label() { return i18n.text('FILENAME_SPECIAL_SYMBOL_REPLACE_LABEL', { spec: this.name }) },
}, {
  type: 'text',
  key: 'symbol-backslash',
  name: '\\',
  tab: 'filename',
  hidden: false,
  reverse: true,
  defaultValue: '_',
  dataType: 'string',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  validateValue: filenameValidator,
  get description() { return i18n.text('FILENAME_SPECIAL_SYMBOL_REPLACE_DESCRIPTION', { spec: this.name }) },
  get label() { return i18n.text('FILENAME_SPECIAL_SYMBOL_REPLACE_LABEL', { spec: this.name }) },
}, {
  type: 'text',
  key: 'symbol-pipe',
  name: '|',
  tab: 'filename',
  hidden: false,
  reverse: true,
  defaultValue: '_',
  dataType: 'string',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  validateValue: filenameValidator,
  get description() { return i18n.text('FILENAME_SPECIAL_SYMBOL_REPLACE_DESCRIPTION', { spec: this.name }) },
  get label() { return i18n.text('FILENAME_SPECIAL_SYMBOL_REPLACE_LABEL', { spec: this.name }) },
}, {
  type: 'text',
  key: 'symbol-question-mark',
  name: '?',
  tab: 'filename',
  hidden: false,
  reverse: true,
  defaultValue: '',
  dataType: 'string',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  validateValue: filenameValidator,
  get description() { return i18n.text('FILENAME_SPECIAL_SYMBOL_REPLACE_DESCRIPTION', { spec: this.name }) },
  get label() { return i18n.text('FILENAME_SPECIAL_SYMBOL_REPLACE_LABEL', { spec: this.name }) },
}, {
  type: 'text',
  key: 'symbol-asterisk',
  name: '*',
  tab: 'filename',
  hidden: false,
  reverse: true,
  defaultValue: '',
  dataType: 'string',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  validateValue: filenameValidator,
  get description() { return i18n.text('FILENAME_SPECIAL_SYMBOL_REPLACE_DESCRIPTION', { spec: this.name }) },
  get label() { return i18n.text('FILENAME_SPECIAL_SYMBOL_REPLACE_LABEL', { spec: this.name }) },
}, {
  type: 'checkbox',
  key: 'show-audio-track-duration',
  tab: 'misc',
  hidden: false,
  defaultValue: false,
  dataType: 'boolean',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  get description() { return i18n.text('AUDIO_DURATION_SHOW_DESCRIPTION') },
  get label() { return i18n.text('AUDIO_DURATION_SHOW_LABEL') },
}, {
  type: 'checkbox',
  key: 'show-audio-meta-data-on-row',
  tab: 'misc',
  hidden: false,
  defaultValue: false,
  dataType: 'boolean',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  get description() { return i18n.text('AUDIO_META_DATA_SHOW_ON_ROW_DESCRIPTION') },
  get label() { return i18n.text('AUDIO_META_DATA_SHOW_ON_ROW_LABEL') },
}, {
  type: 'checkbox',
  key: 'hide-audio-meta-data-on-hover',
  tab: 'misc',
  offsetLeft: 10,
  hidden: false,
  defaultValue: false,
  dataType: 'boolean',
  getValue: getValue,
  setValue: setValue,
  isDefault: isDefault,
  setDefaultValue: setDefaultValue,
  get description() { return i18n.text('AUDIO_META_DATA_HIDE_ON_HOVER_DESCRIPTION') },
  get label() { return i18n.text('AUDIO_META_DATA_HIDE_ON_HOVER_LABEL') },
}, {
  type: 'link',
  key: 'yandex-money',
  tab: 'sponsor',
  defaultValue: 'https://yoomoney.ru/to/4100111768491956',
  getValue: getValue,
  setValue: noop,
  get description() { return `${i18n.text('SPONSOR_THIS_PROJECT')} ${i18n.text('YANDEX_WALLET')}` },
  get label() { return `${i18n.text('SPONSOR_THIS_PROJECT')} ${i18n.text('YANDEX_WALLET')}` },
  get html() {
    return `<span>${i18n.text('SPONSOR_THIS_PROJECT_BY')} </span><br><a class="yandex-wallet link" target="_blank" href="${this.getValue()}">${i18n.text('YANDEX_WALLET')}</a>`
  },
}]

module.exports = settingsOptions


 }),
/* 64 */
 (function(module, exports) {

/**
 * @param {string} val
 * @return {number}
 */
function parseSize(val) {
  var regex = /^(\d+\.?\d*|\.?\d+)\s*([gmkbiGMKB]+|[bB]ytes)?/
  var match = (val || '').trim().match(regex)
  if (!match) {
    throw new Error('invalid parse value = ' + val)
  }
  var measure = (match[2] || '').toLowerCase()
  var value = +match[1]
  switch (measure) {
    case 'g':
    case 'gb':
    case 'gib':
      return Math.round(value * 1024 * 1024 * 1024)
    case 'm':
    case 'mb':
    case 'mib':
      return Math.round(value * 1024 * 1024)
    case 'k':
    case 'kb':
    case 'kib':
      return Math.round(value * 1024)
    default:
      return Math.round(value)
  }
}

module.exports = parseSize

 }),
/* 65 */
 (function(module, exports, __webpack_require__) {

var i18n = __webpack_require__(3)

/** 
 * @typedef {import("./settingsOptions").ISettingsOption} ISettingsOption
 * 
 * @typedef {{
 *  title: string;
 *  inputId: string;
 *  options: ISettingsOption[];
 * }} ISettingsTab
 */


/** @type {ISettingsTab[]} */
var settingsTabs = [{
  key: 'general',
  get title() {
    return i18n.text('GENERAL_TAB')
  },
  inputId: 'vkmd-general-tab',
}, {
  key: 'tooltip',
  get title() {
    return i18n.text('TOOLTIP_TAB')
  },
  inputId: 'vkmd-tooltip-tab',
}, {
  key: 'filename',
  get title() {
    return i18n.text('FILENAME_TAB')
  },
  inputId: 'vkmd-filename-tab',
}, {
  key: 'logger',
  get title() {
    return i18n.text('LOGGER_TAB')
  },
  inputId: 'vkmd-logger-tab',
}, {
  key: 'misc',
  get title() {
    return i18n.text('MISC_TAB')
  },
  inputId: 'vkmd-misc-tab',
}, {
  key: 'sponsor',
  get title() {
    return i18n.text('SPONSOR_TAB')
  },
  inputId: 'vkmd-sponsor-tab',
}]

module.exports = settingsTabs

 }),
/* 66 */
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
/* 67 */
 (function(module, exports, __webpack_require__) {

var createDocument = __webpack_require__(68)

/**
 * @param {{
 *  responseText: string;
 *  headers: { [x: string]: string };
 *  ignoreXML?: boolean;
 *  responseType?: string;
 * }} params
 */
function parseAJAXResponse(params) {
  var responseText = params.responseText,
    headers = params.headers,
    responseType = params.responseType;
  var isText = !responseType || responseType.toLowerCase() === 'text'
  var contentType = headers['content-type'] || ''
  var ignoreXML = params.ignoreXML === undefined ? true : false;
  if (
    isText
    && contentType.indexOf('application/json') > -1
  ) {
    return JSON.parse(responseText)
  }
  if (
    !ignoreXML
    && isText
    && (
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
/* 68 */
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
/* 69 */
 (function(module, exports) {

var textarea = document.createElement('textarea')

/** @param {string} text */
var getTextAreaValue = function (text) {
  textarea.innerHTML = text
  return textarea.value
}

module.exports = getTextAreaValue

 }),
/* 70 */
 (function(module, exports) {

module.exports = Hls

 }),
/* 71 */
 (function(module, exports) {

/** @typedef {import('./Queue')} Queue */

/** @param {Queue} queue */
function Worker(queue) {
  this.queue = queue
}

Worker.prototype.run = function run() {
  if (this.aborted || this.running || !this.queue.size()) {
    return Promise.resolve()
  }
  var task = this.queue.nextTask()
  var _this = this

  this.running = true
  return task.run().then(function (response) {
    task.onSuccess(response)
    _this.running = false
  }).catch(function (error) {
    task.onError(error)
    _this.running = false
  }).then(function () {
    return _this.run()
  })
}

Worker.prototype.abort = function abort() {
  this.aborted = true
}

Worker.prototype.stop = function stop() {
  this.abort()
}

module.exports = Worker

 }),
/* 72 */
 (function(module, exports) {

/**
 * @typedef {import('./Queue')} Queue
 * 
 * @typedef {{
 *  onSuccess: (response: any) => void;
 *  onError: (error: any) => void;
 *  run: () => Promise;
 * }} ITaskOptions
 */

/**
 * @param {ITaskOptions} options 
 * @param {Queue} queue
 */
function Task(options, queue) {
  this.options = options
  this.queue = queue
}

Task.prototype.run = function run() {
  return this.options.run()
}

Task.prototype.onSuccess = function onSuccess(response) {
  this.queue.onSuccess(this)
  return this.options.onSuccess(response)
}

Task.prototype.onError = function onError(error) {
  this.queue.onError(this)
  return this.options.onError(error)
}

module.exports = Task

 }),
/* 73 */
 (function(module, exports) {

var crypto = {
  createInitializationVector: function (segmentNumber) {
    var view = new Uint8Array(16);
    for (let i = 12; i < 16; ++i) {
      view[i] = (segmentNumber >> (8 * (15 - i))) & 0xff;
    }
    return view
  },
  hexadecimalInteger: function (hex) {
    if (!hex) {
      return null
    }
    var stringValue = (hex || '0x').slice(2);
    stringValue = ((stringValue.length & 1) ? '0' : '') + stringValue;
    var view = new Uint8Array(stringValue.length / 2);
    for (let i = 0; i < stringValue.length / 2; i++) {
      view[i] = parseInt(stringValue.slice(i * 2, i * 2 + 2), 16);
    }
    return view;
  },
  decrypt: function (data, key, iv) {
    var subtle = window.crypto.subtle || window.crypto.webkitSubtle
    if (!subtle) {
      throw new Error('Web crypto not supported')
    }
    return subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['encrypt', 'decrypt']).then(function (aesKey) {
      return subtle.decrypt({ name: 'AES-CBC', iv: iv }, aesKey, data);
    });
  },
}

module.exports = crypto

 }),
/* 74 */
 (function(module, exports) {

module.exports = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

 }),
/* 75 */
 (function(module, exports) {

module.exports = JSZip

 }),
/* 76 */
 (function(module, exports) {

var platform = {
  get OS() {
    var os = window.navigator.platform
    var ua = window.navigator.userAgent
    if (/(Macintosh|MacIntel|MacPPC|Mac68K)/i.test(os)) {
      return 'osx';
    }
    if (/(iPhone|iPad|iPod|iPhone Simulator|iPad Simulator|iPod Simulator)/i.test(os)) {
      return 'ios';
    }
    if (/(Win32|Win64|Windows|WinCE)/i.test(os)) {
      return 'windows';
    }
    if (/Linux/i.test(os)) {
      return 'linux';
    }
    if (/Android/i.test(ua)) {
      return 'android';
    }
    return os.toLowerCase();
  },
}

module.exports = platform

 }),
/* 77 */
 (function(module, exports) {

module.exports = window.FFmpeg

 }),
/* 78 */
 (function(module, exports) {

module.exports = localforage

 }),
/* 79 */
 (function(module, exports) {

/**
 * @param {Worker} worker
 * @param {any} data
 */
function requestWorker(worker, data) {
  var resolve
  var promise = new Promise(function (res) {
    resolve = res
  })
  var onMessage = function (e) {
    resolve(e.data)
    worker.removeEventListener('message', onMessage)
  }
  worker.addEventListener('message', onMessage)
  worker.postMessage(data)
  return promise
}

module.exports = requestWorker

 }),
/* 80 */
 (function(module, exports) {

/** @param {() => void} func */
function createWorker(func) {
  var blob = new Blob([`;(${func.toString()})()`])
  var worker = new Worker(URL.createObjectURL(blob))
  return worker
}

module.exports = createWorker

 }),
/* 81 */
 (function(module, exports) {

function workerFunc() {
  var time = function () { return `[${new Date().toISOString()}]` }
  var onFetch = function (e) {
    return fetch(e.data.url, {
      method: e.data.method || 'GET',
      headers: e.data.headers || {},
    }).then(function (response) {
      if (response.ok) {
        return response[e.data.type || 'text']()
      }
      console.error(time(), 'failed to fetch', e.data.url, response)
      throw new Error('failed to fetch resource = ' + e.data.url + ', status = ' + response.status)
    }).then(function (result) {
      self.postMessage({ url: e.data.url, data: result, type: e.data.type || 'text' })
    }).catch(function (e) {
      self.postMessage({ error: e.message, url: e.data.url })
    })
  }
  var onMessage = function (e) {
    if (e.data.url) {
      onFetch(e)
    }
  }
  self.onmessage = onMessage
}

module.exports = workerFunc

 }),
/* 82 */
 (function(module, exports) {

var path = {
  join: function () {
    var args = Array.prototype.slice.call(arguments)
    return args.filter(Boolean).map(function (arg, idx, arr) {
      var ret = arg.trim()
      return idx < (arr.length - 1) ? ret.replace(/\/$/, '') : ret
    }).join('/')
  },
}

module.exports = path

 }),
/* 83 */
 (function(module, exports, __webpack_require__) {

var getExtension = __webpack_require__(11);
var logger = __webpack_require__(0);
var time = __webpack_require__(1);

/**
 * @param {string} url 
 */
function fetchImage(url) {
  var image = new Image()
  image.crossOrigin = 'Anonymous'
  var resolve, reject
  /** @type {Promise<string>} */
  var promise = new Promise(function (res, rej) { resolve = res; reject = rej; })
  image.addEventListener('load', function () {
    try {
      var data = getDataURL(image)
      logger.debug(time(), 'fetchImage ', data.length, data, url)
      resolve(data)
    } catch (e) {
      logger.error(time(), 'fetchImage error', e)
      reject(e)
    }
  }, false)
  image.addEventListener('error', function () {
    reject(new Error('failed to fetch image (url = ' + url + ')'))
  }, false)
  image.src = url
  return promise.then(function (dataURL) {
    var ext = getExtension(image.src) || 'jpg'
    var data = dataURL.split(';base64,')
    return {
      mime: 'image/' + ext,
      base64: data[1],
    }
  })
}

/**
 * 
 * @param {HTMLImageElement} image
 */
function getDataURL(image) {
  var canvas = document.createElement('canvas')
  var context = canvas.getContext('2d')
  canvas.width = image.width
  canvas.height = image.height
  context.drawImage(image, 0, 0)
  var imageBox = getImageBox()
  imageBox.appendChild(canvas)
  var ext = getExtension(image.src) || 'jpg'
  logger.debug(time(), 'ext', ext, image.src)
  setTimeout(function () {
    imageBox.removeChild(canvas)
  }, 1000)
  return canvas.toDataURL('image/' + ext)
}

function getImageBox() {
  var imageBox = document.querySelector('.vkmd-image-box')
  if (imageBox) {
    return imageBox
  }
  imageBox = document.createElement('div')
  imageBox.classList.add('vkmd-image-box')
  imageBox.style.display = 'none'
  return document.body.appendChild(imageBox)
}

module.exports = fetchImage

 }),
/* 84 */
 (function(module, exports, __webpack_require__) {

var logger = __webpack_require__(0)
var time = __webpack_require__(1)

/** @param {string} text */
function copyTextToClipboard(text) {
  logger.debug(time(), 'copy text to clipboard..', text)
  var input = document.querySelector('#vkmd-text-to-copy')
  if (!input) {
    logger.debug(time(), 'create input')
    input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.style.opacity = 0
    input.style.position = 'absolute'
    input.style.zIndex = -100
    document.body.appendChild(input)
  }
  logger.debug(time(), 'input', input)
  input.value = text
  input.select()
  document.execCommand('copy')
}

module.exports = copyTextToClipboard

 }),
/* 85 */
 (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

 }),
/* 86 */
 (function(module, exports, __webpack_require__) {

var logger = __webpack_require__(0);
var time = __webpack_require__(1);
var mediaObserver = __webpack_require__(41);
var ariaController = __webpack_require__(87);
var audioController = __webpack_require__(15)
var Logger = __webpack_require__(13);

var keyboardController = {
  register: function () {
    window.addEventListener('keydown', keyboardController.onKey)
  },
  /** @param {KeyboardEvent} e */
  getKey: function (e) {
    return {
      altKey: e.altKey,
      code: e.which || e.keyCode,
      symbol: String.fromCharCode(e.which || e.keyCode).toUpperCase(),
    }
  },
  /** @param {KeyboardEvent} e */
  onKey: function (e) {
    logger.debug(time(), 'keydown', keyboardController.getKey(e))
    if (!e.altKey) {
      return;
    }
    var charCode = e.which || e.keyCode;
    var key = String.fromCharCode(charCode).toUpperCase();
    switch (key) {
      case 'A':
        ariaController.fetchData()
        break;
      case 'S':
        ariaController.saveData()
        break;
      case 'R':
        mediaObserver.activateNodes()
        break;
      case 'L':
        Logger.save()
        break;
      case 'U':
        audioController.saveAudioToClipboard()
        break;
      default:
    }
  },
}

module.exports = keyboardController

 }),
/* 87 */
 (function(module, exports, __webpack_require__) {

var logger = __webpack_require__(0);
var time = __webpack_require__(1);
var videoModel = __webpack_require__(23);
var getExtension = __webpack_require__(11);
var downloadFile = __webpack_require__(16);
var audioController = __webpack_require__(15);
var videoController = __webpack_require__(25)

var ariaController = {
  fetching: false,
  saved_ids: [],
  fetchData: function () {
    if (ariaController.fetching) {
      return Promise.reject('aria: already fetching')
    }
    ariaController.fetching = true
    return Promise.all([
      audioController.fetchDataAll(),
      videoController.fetchDataAll(),
    ]).then(function (response) {
      ariaController.fetching = false
      return response
    }).catch(function (error) {
      ariaController.fetching = false
      logger.error(time(), 'aria fetch data error', error)
    })
  },
  saveData: function () {
    var audio_ids_all = Object.keys(audioController.cache)
    var video_ids_all = Object.keys(videoModel.state)
    var saved_ids = ariaController.saved_ids
    var audio_ids = audio_ids_all.filter(function (full_id) {
      return saved_ids.indexOf(full_id) === -1
    })
    var video_ids = video_ids_all.filter(function (full_id) {
      return saved_ids.indexOf(full_id) === -1
    })
    var audios = audio_ids.map(audioController.getCache)
    var text = audios.map(ariaController.getAudioText)
    var videos = video_ids.map(videoModel.getData)
    text.push.apply(text, videos.map(ariaController.getVideoText))
    return ariaController.download(text).then(function () {
      saved_ids.push.apply(saved_ids, audio_ids)
      saved_ids.push.apply(saved_ids, video_ids)
    })
  },
  /**
   * @param {string[]} text 
   */
  download: function (text) {
    text = text.join('\r\n') + '\r\n'
    var blob = new Blob([text], { type: 'text/plain' })
    var resource = URL.createObjectURL(blob)
    var filename = 'vkmd.urls.' + (new Date().toISOString()) + '.txt'
    return downloadFile(resource, filename).then(function () {
      URL.revokeObjectURL(resource)
    })
  },
  /** @param {import('./audioController').IAudioData} audio */
  getAudioText: function (audio) {
    var url = audio.mp3Url || audio.src
    var ext = getExtension(url)
    var filename = `${audio.name.replace(/[\/]+/g, '-')}.${ext}`
    return url + ' --out="' + filename + '"'
  },
  /** @param {import('../model/videoModel').IVideoData} video */
  getVideoText: function (video) {
    var q = Math.max.apply(Math.max, video.qualities)
    var url = video.sources[q].url || video.sources[q].hls
    var ext = getExtension(url) || 'mp4'
    var filename = `${video.name.replace(/[\/]+/g, '-')}.${q}p.${ext}`
    return url + ' --out="' + filename + '"'
  },
}

module.exports = ariaController

 }),
/* 88 */
 (function(module, exports, __webpack_require__) {

var info = __webpack_require__(10)
var deepCopy = __webpack_require__(6)
var i18n = __webpack_require__(3)
var logger = __webpack_require__(0)
var makeRequest = __webpack_require__(4)
var notificationManager = __webpack_require__(89)
var parseVersion = __webpack_require__(90)
var storage = __webpack_require__(14)
var time = __webpack_require__(1)

/**
 * @typedef {{ [x: string]: string | string[] }} IMetaData
 * @typedef {{ data: IMetaData; update_timestamp: number; notify_timestamp: number; }} IMMetaData
 * @typedef {import('../utils/parseVersion').ISVersion} ISVersion
 */

var versionController = {
  META_DATA_REGEXP: /\@([^\s]+)\s+(\S.+)$/,
  DAY: 24 * 3600 * 1000,
  HOUR: 3600 * 1000,
  MINUTE: 60 * 1000,
  SECOND: 1000,
  get currentVersion() {
    return info.script_version.replace(/^v/, '')
  },
  init: function () {
    return versionController.checkVersion().then(versionController.tryNotify)
  },
  checkVersion: function () {
    return versionController.getMetaData().then(function (mMetaData) {
      var diff = Date.now() - mMetaData.update_timestamp
      if (diff < versionController.DAY) {
        return versionController.compareVersion(versionController.currentVersion, mMetaData.data.version)
      }
      return versionController.fetchMeta('38614').then(versionController.updateMetaData).then(function (mMetaData) {
        var diff = Date.now() - mMetaData.update_timestamp
        if (diff < versionController.DAY) {
          return versionController.compareVersion(versionController.currentVersion, mMetaData.data.version)
        }
        return 0
      })
    }).catch(function (e) {
      logger.error(time(), 'check version error', e)
      return 0
    })
  },
  /**
   * @param {number} res
   */
  tryNotify: function (res) {
    if (res >= 0) {
      return Promise.resolve()
    }
    return versionController.getMetaData().then(function (mMetaData) {
      var diff = Date.now() - (mMetaData.notify_timestamp || 0)
      if (diff > versionController.HOUR) {
        var version = versionController.getVersion(mMetaData)
        return versionController.notify(version)
      }
    })
  },
  /** @param {IMMetaData} mMetaData */
  getVersion: function (mMetaData) {
    return mMetaData.data.version
  },
  /** @param {string} version */
  notify: function (version) {
    return Promise.all([
      versionController.updateMetaData({ notify_timestamp: Date.now() }),
      notificationManager.notify({
        title: info.script_name + ' ' + info.script_version,
        text: i18n.text('VERSION_NOTIFICATION_MESSAGE', { version: version }),
      })
    ])
  },
  /**
   * @param {IMMetaData} mMetaData 
   * @return {Promise<IMMetaData>}
   */
  setMetaData: function (mMetaData) {
    return storage.setItem('meta', mMetaData).then(function () {
      return deepCopy(mMetaData)
    })
  },
  /**
   * @return {Promise<IMMetaData>}
   */
  getMetaData: function () {
    return storage.getItem('meta').then(function (mMetaData) {
      return mMetaData ? mMetaData : versionController.fetchMeta('38614')
    }).then(versionController.setMetaData)
  },
  /**
   * @param {IMMetaData} mMetaData 
   * @return {Promise<IMMetaData>}
   */
  updateMetaData: function (mMetaData) {
    return versionController.getMetaData().then(function (mmd) {
      return Object.assign({}, mmd, mMetaData)
    }).then(versionController.setMetaData)
  },
  /**
   * @param {string} version
   * @return {ISVersion}
   */
  parseVersion: function (version) {
    return parseVersion(version)
  },
  /**
   * @param {string} v1
   * @param {string} v2
   */
  compareVersion: function (v1, v2) {
    var lhs = parseVersion(v1)
    var rhs = parseVersion(v2)
    var com = {
      major: lhs.major - rhs.major,
      minor: lhs.minor - rhs.minor,
      patch: lhs.patch - rhs.patch,
    }
    if (com.major) {
      return com.major
    }
    if (com.minor) {
      return com.minor
    }
    if (com.patch) {
      return com.patch
    }
    return 0
  },
  /**
   * @param {string} scriptId
   */
  fetchMeta: function (scriptId) {
    var url = versionController.getMetaUrl(scriptId)
    return makeRequest({
      method: 'GET',
      url: url,
    }, true).then(function (response) {
      if (response.ok) {
        return {
          data: versionController.parseMeta(response.data),
          update_timestamp: Date.now()
        }
      }
      throw response
    })
  },
  /**
   * @param {string} metaData 
   * @return {IMetaData}
   */
  parseMeta: function (rawMetaData) {
    var data = rawMetaData.split('\n').filter(function (line) {
      return line.trim()
    }).reduce(function (acc, line) {
      var match = line.trim().match(versionController.META_DATA_REGEXP);
      if (!match) {
        return acc;
      }
      var m = match[0], key = match[1], val = match[2]
      if (typeof acc[key] === 'undefined') {
        acc[key] = val;
      } else {
        acc[key] = Array.isArray(acc[key]) ? acc[key] : [acc[key]];
        acc[key].push(val);
      }
      return acc
    }, {});
    return data
  },
  getMetaUrl: function (scriptId) {
    return `https://greasyfork.org/scripts/${scriptId}/code/script.meta.js?_=${Date.now()}`;
  },
  getScriptUrl: function (scriptId) {
    return `https://greasyfork.org/ru/scripts/${scriptId}`
  },
}

module.exports = versionController

 }),
/* 89 */
 (function(module, exports, __webpack_require__) {

var i18n = __webpack_require__(3);
var logger = __webpack_require__(0);
var time = __webpack_require__(1);

/**
 * @typedef {{
 *  title: string;
 *  text: string;
 *  image?: string;
 *  onclick?: () => void;
 *  ondone?: () => void;
 * }} INotificationOptions
 */

var notificationManager = {
  vkLogoUrl: 'https://i.imgur.com/1XdOj9z.png',
  /** @param {INotificationOptions} details */
  notify: function (details) {
    var promise = Promise.reject()
    if (typeof GM_notification !== 'undefined'
      || (typeof GM !== 'undefined' && typeof GM.notification !== 'undefined')
    ) {
      promise = notificationManager.gmNotify(details)
    } else {
      promise = notificationManager.nativeNotify(details)
    }
    return promise.catch(function (e) {
      if (e) {
        logger.error(time(), 'notify error:', e)
      }
      return notificationManager.domNotify(details)
    }).catch(function (e) {
      if (e) {
        logger.error(time(), 'dom notify error', e)
      }
      return notificationManager.alertNotify(details)
    })
  },
  /** @param {INotificationOptions} details */
  gmNotify: function (details) {
    var resolve
    var promise = new Promise(function (res, rej) {
      resolve = res
    })
    var ondone = function () {
      details.ondone && details.ondone()
      resolve()
    }
    var onclick = function () {
      details.onclick && details.onclick()
    }
    GM_notification({
      title: details.title,
      text: details.text,
      image: details.image || notificationManager.vkLogoUrl,
      onclick: onclick,
      ondone: ondone,
    })
    return promise
  },
  /** @param {INotificationOptions} details */
  nativeNotify: function (details) {
    if (Notification.permission === 'granted') {
      return notificationManager.nativeShow(details)
    }
    return Notification.requestPermission().then(function (permission) {
      if (permission === 'granted') {
        return notificationManager.nativeShow(details)
      }
      logger.error(time(), 'notification not granted:', permission)
      return Promise.reject()
    })
  },
  /** @param {INotificationOptions} details */
  domNotify: function (details) {
    return Promise.reject()
    // TODO
  },
  /** @param {INotificationOptions} details */
  alertNotify: function (details) {
    var text = `${details.title}\n${details.text}`
    alert(text)
    return Promise.resolve()
  },
  /** @param {INotificationOptions} details */
  nativeShow: function (details) {
    /** @type {NotificationOptions} */
    var options = {
      body: details.text,
      lang: i18n.getLang(),
      image: details.image || notificationManager.vkLogoUrl,
      requireInteraction: true,
    }
    var resolve
    var promise = new Promise(function (res) { resolve = res })
    var ondone = function () {
      details.ondone && details.ondone()
      resolve()
    }
    var onclick = function () {
      details.onclick && details.onclick()
      resolve()
    }
    var notification = new Notification(details.title, options)
    notification.addEventListener('close', ondone)
    notification.addEventListener('click', onclick)
    return promise
  },
}

module.exports = notificationManager

 }),
/* 90 */
 (function(module, exports) {

var VERSION_REGEXP = /^(\d+)\.(\d+)\.(\d+)\-?([\w.]+)?/

/**
 * @typedef {{
 *  v: [number, number, number, ?string];
 *  major: number;
 *  minor: number;
 *  patch: number;
 *  other: ?string;
 * }} ISVersion
 */

/**
  * @param {string} version
  * @return {ISVersion}
  */
var parseVersion = function (version) {
  var match = version.match(VERSION_REGEXP);
  var v = [+match[1], +match[2], +match[3], match[4]]
  return {
    v: v,
    major: v[0],
    minor: v[1],
    patch: v[2],
    other: v[3],
  }
}

module.exports = parseVersion

 }),
/* 91 */
 (function(module, exports, __webpack_require__) {

var settingsModel = __webpack_require__(7)
var logger = __webpack_require__(0)
var storage = __webpack_require__(14)
var time = __webpack_require__(1)

var tryJSONParse = function (v) {
  try {
    return JSON.parse(v)
  } catch (e) {
    return v
  }
}

function migrateSettings() {
  return storage.getItem('user-options').then(tryJSONParse).then(function (v) {
    if (!v) {
      return
    }
    var settings = settingsModel.getValues()
    settings['hls-max-size'] = v['hls-max-size'] || settings['hls-max-size']
    var logkeys = v['enable-all-logs'] ? ['log', 'warn', 'error', 'info', 'debug'] : []
    logkeys.forEach(function (key) {
      settings['log-level-' + key] = true
    })
    return settingsModel.updateValues(settings)
  }).catch(function (e) {
    logger.error(time(), 'migrateSettings error', e)
    return Promise.reject(e)
  })
}

module.exports = migrateSettings

 }),
/* 92 */
 (function(module, exports, __webpack_require__) {

var logger = __webpack_require__(0)
var storage = __webpack_require__(14)
var time = __webpack_require__(1)

function cleanStorage() {
  localStorage.removeItem('info')
  localStorage.removeItem('user-options')
  localStorage.removeItem('vk-domains')
  if (storage.type !== 'gm') {
    return Promise.resolve()
  }
  return Promise.all([
    storage.removeItem('info'),
    storage.removeItem('user-options'),
    storage.removeItem('vk-domains'),
  ]).catch(function (e) {
    logger.error(time(), 'cleanStorage error', e)
    return Promise.reject(e)
  })
}

module.exports = cleanStorage

 }),
/* 93 */
 (function(module, exports, __webpack_require__) {

var iframeController = __webpack_require__(94)
var eventLogger = __webpack_require__(43)
var settingsModel = __webpack_require__(7)
var eventEmitter = __webpack_require__(2)
var logger = __webpack_require__(0)
var time = __webpack_require__(1)

async function child() {
  logger.debug(time(), 'child: ', location.href)
  return settingsModel.fetchValues().then(function () {
    eventEmitter.on('*', eventLogger)
    return iframeController.start()
  })
}

module.exports = child

 }),
/* 94 */
 (function(module, exports, __webpack_require__) {

var URLParse = __webpack_require__(22)
var time = __webpack_require__(1)
var logger = __webpack_require__(0)
var downloadFile = __webpack_require__(16)
var makeRequest = __webpack_require__(4)
var DOMReady = __webpack_require__(17)
var ffmpegController = __webpack_require__(24)

var iframeController = {
  activate: function () {
    return DOMReady().then(function () {
      var data = iframeController.getData()
      if (data.iframeId) {
        iframeController.sendMessage({ iframeId: data.iframeId, event: 'iframe-ready' })
      }
    }).catch(function (e) {

    })
  },
  start: function () {
    var onData = function (data) {
      if (data && data.id && data.event.indexOf('url') !== -1) {
        logger.debug(time(), 'iframe getUrl', location.href)
        return iframeController.getUrl(data)
      }
      if (data && data.id && data.event.indexOf('size') !== -1) {
        logger.debug(time(), 'iframe getSize', location.href)
        return iframeController.getSize(data)
      }
      if (data && data.id && data.event.indexOf('download') !== -1) {
        logger.debug(time(), 'iframe download', location.href)
        return iframeController.download(data)
      }
      if (data && data.id == 'ffmpeg' && data.event == 'load') {
        logger.debug(time(), 'iframe: ffmpeg load', location.href)
        return iframeController.ffmpegLoad(data)
      }
      if (data && data.id == 'ffmpeg' && data.event == 'concatenate') {
        logger.debug(time(), 'iframe: ffmpeg concatenate')
        return iframeController.ffmpegConcat(data).then(function () {
          iframeController.sendMessage(Object.assign({}, data, { fragments: null }))
        }).catch(function (e) {
          iframeController.sendMessage(Object.assign({ error: e }, data, { fragments: null }))
        })
      }
      if (data && data.id == 'ffmpeg' && data.event == 'metadata') {
        logger.debug(time(), 'iframe: ffmpeg metadata')
        return iframeController.ffmpegMetadata(data).then(function (payload) {
          iframeController.sendMessage(Object.assign({}, data, { payloadWithMetadata: payload, payload: null }))
        }).catch(function (e) {
          iframeController.sendMessage(Object.assign({ error: e }, data, { payload: null }))
        })
      }
      return Promise.resolve()
    }

    window.addEventListener('message', function (e) {
      logger.debug(time(), 'iframe onmessage: ', e.origin, e.data)
      onData(e.data)
    })

    return Promise.all([
      iframeController.activate(),
      iframeController.removeMedia().catch(function () { }),
      onData(iframeController.getData()),
    ]).then(function () {
      logger.debug(time(), 'iframe started')
    }).catch(function (e) {
      logger.error(time(), 'iframe error: ', e)
    })
  },
  download: function (dt) {
    var data = dt || this.getData()
    var link = URLParse(data.url)
    link.hash = ''
    var onProgress = function onProgress(loaded, total) {
      iframeController.onProgress(loaded, total, data)
    }
    if (!dt.withMetadata || !dt.metadata) {
      return downloadFile(link.href, data.filename, onProgress).then(function () {
        iframeController.sendMessage(Object.assign({}, data, { event: 'download' }))
      })
    }
    return iframeController.fetchBuffer(link.href, onProgress).then(function (buffer) {
      iframeController.sendMessage(Object.assign({}, data, { event: 'download', buffer: buffer }))
    })
  },
  /**
   * @param {string} url
   * @param {(loaded: number, total: number) => void} [onProgress]
   * @return {Promise<ArrayBuffer>}
   */
  fetchBuffer: function (url, onProgress) {
    return makeRequest({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
      onprogress: onProgress,
    }, false).then(function (response) {
      if (!response.ok) {
        return Promise.reject()
      }
      return response.data
    })
  },
  getUrl: function (dt) {
    var data = dt || this.getData()

    var response = {
      ok: true,
      finalUrl: data.url,
      status: 200,
      readyState: 4,
      headers: {},

      event: data.event || 'url',
      id: data.id,
    }
    iframeController.sendMessage(response)
  },
  getSize: function (dt) {
    var data = dt || this.getData()

    return makeRequest({
      method: 'HEAD',
      url: data.url,
    }).then(function (response) {
      iframeController.sendMessage(
        Object.assign(
          {},
          response,
          {
            event: data.event,
            id: data.id,
          },
        )
      )
    })
  },
  removeMedia: function () {
    if (!location.hash || !location.hash.match(/^#VKMD\:/)) {
      return Promise.resolve()
    }
    return DOMReady().then(function () {
      var media = document.querySelector('video, audio')
      if (!media) {
        return
      }
      media.removeAttribute('autoplay')
      media.setAttribute('preload', 'none')
      media.pause(0)
      media.src = ''
      media.parentNode.removeChild(media)
      return media
    })
  },
  sendMessage: function (message) {
    logger.debug(time(), 'iframe sending.. ', message)
    if (window.parent) {
      logger.debug(time(), 'iframe send window')
      window.parent.postMessage(message, '*')
    }
  },
  onProgress: function (loaded, total, dt) {
    var data = dt || this.getData()
    iframeController.sendMessage(Object.assign(data, {
      event: 'progress',
      loaded: loaded,
      total: total,
    }))
  },
  /**
   * @return {{
   *  url: string;
   *  name: string;
   *  filename: string;
   *  videoId: string;
   *  ext: string;
   *  event: string;
   *  withMetadata: boolean;
   *  metadata?: import('./audioController').IAudioMetaData
   * }}
   */
  getData: function () {
    if (iframeController._data) {
      return Object.assign({}, iframeController._data)
    }
    if (location.hash && location.hash.match(/^#VKMD\:/)) {
      iframeController._data = JSON.parse(decodeURIComponent(location.hash.slice(6)))
      location.hash = '';
      return Object.assign({}, iframeController._data)
    }
    return {}
  },
  ffmpegLoad: function (data) {
    return ffmpegController.load().then(function () {
      iframeController.sendMessage(data)
    }).catch(function (e) {
      logger.error(time(), 'failed to load ffmpeg (iframe)', e)
    })
  },
  ffmpegConcat: function (data) {
    return ffmpegController.queueConcat(data)
  },
  ffmpegMetadata: function (data) {
    return ffmpegController.queueMetadata(data)
  },
}

module.exports = iframeController

 })
 ])));
})(window, window);

;(function () {
  const style = `.ui-widget-content {
  background: #000 !important;
  opacity: 0.8 !important;
}
.ui-corner-all {
  border-radius: 4px !important;
}
.my-test-class,
.audio_row__download,
._audio_row__download {
  position: relative;
  width: 16px !important;
  height: 16px !important;
  top: 0;
}
.video_item.video_can_download #download {
  display: inline-block;
}
div.video_thumb_action_download {
  display: inline-block;
  position: relative;
}
.my-test-class,
.videoplayer_btn_download {
  background-repeat: no-repeat;
  background-position: 3px;
  border-radius: 3px;
  left: 0;
  bottom: 0;
  z-index: 10;
  width: 18px;
  height: 18px;
  padding: 2px;
  transform: scale(1.1);
}
.mv_recom_item_download,
.mv_playlist_item_download {
  background-repeat: no-repeat;
  background-color: #000;
  background-position: 3px;
  border-radius: 3px;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 10;
  width: 18px;
  height: 18px;
  padding: 2px;
  opacity: 0.7;
}
.mv_recom_item_download:hover,
.mv_playlist_item_download:hover {
  opacity: 1 !important;
}
.media-hd:after {
  content: "HD";
  padding-left: 3px;
  opacity: 0.7;
}
.ui-tooltip {
  z-index: 999999 !important;
}
.vkmd-tooltip-section {
  cursor: pointer;
  padding: 5px;
  opacity: 0.8;
  color: #fff;
}
.vkmd-tooltip-section:hover {
  opacity: 1;
  border-style: solid;
  border-width: 1px;
  padding: 4px;
}
.vkmd-tooltip-section[data-media="audio"] {
  opacity: 1;
}

.progress-bar {
  position: relative;
  background: rgba(90, 147, 255, 0.8) !important;
}
.progress-bar, .progress-bar > div {
  width: 100%;
  height: 2px;
  margin-top: 2px;
  border-radius: 2px;
  background: rgba(90, 147, 255, 0.8) !important;
}
.progress-bar > div {
  position: absolute;
  width: 25%;
  background: rgba(42, 90, 255, 1) !important;
  top: -2px;
  display: none;
}
.vkmd-tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.72);
  border-radius: 4px;
  padding: 4px 7px 5px;
  font-weight: 400;
  font-size: 12px;
  font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", Geneva, "Noto Sans Armenian", "Noto Sans Bengali", "Noto Sans Cherokee",
    "Noto Sans Devanagari", "Noto Sans Ethiopic", "Noto Sans Georgian", "Noto Sans Hebrew", "Noto Sans Kannada", "Noto Sans Khmer", "Noto Sans Lao",
    "Noto Sans Osmanya", "Noto Sans Tamil", "Noto Sans Telugu", "Noto Sans Thai", sans-serif, arial, Tahoma, verdana;
  text-shadow: 0px 1px 1px #000;
  color: #ffffff;
  min-width: 100px;
  z-index: 100500;
}
.vkmd-tooltip::before {
  content: " ";
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid rgba(0, 0, 0, 0.72);
  position: absolute;
  bottom: -5px;
  right: 10px;
}
.vkmd-tooltip.vkmd-tooltip-left::before {
  left: 10px;
  right: unset;
}
.vkmd-tooltip.vkmd-tooltip-bottom::before {
  bottom: unset;
  top: -5px;
  transform: rotate(180deg);
}

.vkmd-audio-tooltip {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}
.vkmd-audio-tooltip,
.vkmd-audio-tooltip > * {
  margin: 3px;
}
.vkmd-audio-tooltip .audio-name {
  cursor: pointer;
}
.vkmd-audio-tooltip .audio-separator {
  margin-left: 5px;
  margin-right: 5px;
}
.vkmd-audio-tooltip .audio-name,
.vkmd-audio-tooltip .audio-size,
.vkmd-audio-tooltip .audio-bitrate {
  color: #fff;
}
.vkmd-audio-tooltip .audio-size-title {
  color: rgba(255, 255, 255, 0.75);
}
.removed {
  display: none;
}
.vkmd-audio-progress {
  width: 100%;
  height: 2px;
  margin-top: 2px;
  border-radius: 2px;
  background: #5a93ff;
  visibility: hidden;
  display: none;
}
.audio-playlist-download-progress {
  margin-left: -15px;
  width: 100%;
  height: 2px;
  visibility: hidden;
  background: #5a93ff;
  position: absolute;
}
.vkmd-video-items {
  /*margin: 5px 2px;*/
  /*border: 1px solid rgba(255, 255, 255, 0.5);*/
  /*padding: 0px 10px;*/
  padding: 0px 5px;
  border-radius: 3px;
}
.vkmd-video-source {
  margin-top: 8px;
  font-size: 14px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
}
.vkmd-video-source:hover {
  color: #fff;
}
.vkmd-video-source:last-child {
  margin-bottom: 8px;
}
.vkmd-video-separator {
  margin-left: 1px;
  margin-right: 3px;
}
.vkmd-video-progress {
  width: 100%;
  height: 2px;
  margin-top: 2px;
  border-radius: 2px;
  background: #5a93ff;
  visibility: hidden;
}

.ui-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  width: 100%;
  overflow: auto;
  font-family: consolas;
  background-color: #edeef0;
}
/*.ui-head:before {
  content: "";
  margin-left: 10px;
}*/
.ui-head {
  position: relative;
  background-color: #4a76a8;
  font-size: 20px;
  flex: 0;
  justify-content: space-between;
  color: #fff;
}
.ui-body {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 100%;
  overflow: auto;
  color: #285473;
  position: relative;
  opacity: 0.99;
  background-color: #edeef0;
  z-index: 11;
}
.ui-foot {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex: 0;
  width: 100%;
  background-color: #4a76a8;
  height: 40px;
}
.ui-flash-message.hidden {
  display: block;
  opacity: 0;
  z-index: -1;
  bottom: -100%;
}
.ui-flash-message {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: #1ed00e;
  text-align: center;
  text-transform: capitalize;
  opacity: 1;
  transition: all 0.2s;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ui-head-title {
  margin-left: 10px;
}
.ui-tabs {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  flex: 1;
  /*margin-left: 10px;*/
  /*padding-right: 5px;*/
  overflow-y: auto;
}
.ui-contents {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  flex: 2;
  border-left: 1px #4a76a8 solid;
  overflow: auto;
  /*scrollbar-color: #4a76a8 #edeef0;*/
  opacity: 0.99;
  position: relative;
}
/*
.ui-contents::-webkit-scrollbar-thumb {
  background-color: #4a76a8;
}
.ui-contents::-webkit-scrollbar-track-piece{
  background-color: #edeef0;
}
*/
.ui-button-vkmd {
  margin: 5px 10px;
  padding: 0 10px;
  cursor: pointer;
  height: 100%;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ui-button-vkmd:hover {
  background-color: #3d6898;
}
.ui-button-vkmd.ui-delete,
.ui-button-vkmd.ui-reset {
  width: 24px;
}
.ui-button-vkmd.ui-save {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}
.ui-save.hidden {
  display: none;
}
.ui-tab {
  width: calc(100% - 15px);
  text-transform: capitalize;
  padding-left: 10px;
  padding-right: 5px;
  line-height: 30px;
  cursor: pointer;
}
.ui-tabs .ui-tab:hover {
  background-color: #e1e5eb;
}
.ui-option.hidden {
  display: none;
}
.ui-option:hover {
  background-color: rgba(225, 229, 235, 0.5);
}
.ui-tab.checked {
  background-color: #e1e5eb;
  text-decoration: underline;
}
input[name="ui-tab"]:checked + .ui-content {
  display: flex;
  opacity: 1;
  transition: all 0.25s;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  flex: 1;
  width: 100%;
}
.ui-vklogo-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  z-index: -1;
}
.ui-vklogo {
  position: absolute;
  z-index: -1;
  opacity: 0.75;
  width: 50%;
  margin-right: 10%;
}
.ui-content {
  display: none;
  opacity: 0;
  overflow-y: auto;
}
.ui-content-title {
  display: flex;
  align-self: center;
  text-transform: uppercase;
  line-height: 30px;
  font-weight: 700;
  font-size: 20px;
}
.ui-content-options {
  overflow: auto;
  width: 100%;
}
.ui-option {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  line-height: 30px;
  padding-right: 5px;
}
.ui-option > input {
  margin-left: 5px;
  font-family: consolas;
  border: 1px solid #d3d9de;
  background: rgba(255, 255, 255, 0.6);
  color: inherit;
}
.ui-option > input[type="checkbox"] {
  accent-color: rgba(40, 84, 155, 0.8);
}
.ui-option > input[type="checkbox"] {
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 3px;
}
.ui-option > input[type="checkbox"]:checked {
  cursor: pointer;
  -webkit-appearance: checkbox;
  -moz-appearance: checkbox;
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

.ui-option > * {
  margin-left: 5px;
}
.ui-option label {
  width: 100%;
  cursor: pointer;
  white-space: nowrap;
}
.ui-option label + input {
  margin-left: 5px;
}
.ui-option > input[type="number"] + label,
.ui-option > input[type="text"][data-type="number"] + label {
  margin-left: 5px;
}
.ui-option > input[type="number"],
.ui-option > input[type="text"][data-type="number"] {
  max-width: 11ch;
  min-width: 7ch;
  padding: 0 5px;
  height: 25px;
}
.ui-option > input[id^="symbol-"] {
  max-width: 11ch;
  min-width: 7ch;
}
.ui-option > input[type="text"][data-type="number"]::-webkit-inner-spin-button,
.ui-option > input[type="text"][data-type="number"]::-webkit-outer-spin-button,
.ui-option input[type="number"]::-webkit-inner-spin-button,
.ui-option input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 0;
}
.ui-option input[type="number"],
.ui-option input[type="text"][data-type="number"] {
  -moz-appearance: textfield;
}
.ui-option.ui-link {
  cursor: unset;
}
.ui-option a.link {
  text-decoration: underline;
}
.ui-option select {
  -webkit-appearance: none;
  -moz-appearance: none;
  text-indent: 1px;
  text-overflow: "";
  color: inherit;
  background-color: inherit;
  min-width: 30px;
  border: 1px solid rgba(40, 84, 155, 0.8);
}
.ui-vkmd {
  position: absolute;
  color: #fff;
  line-height: 42px;
  top: 0;
  left: 80px;
  font-weight: 700;
  cursor: pointer;
}
.ui-vkmd.hidden {
  display: none;
}
.MainMenu__menuItemIcon.Icon_menu_vkmd:before {
  background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDQzMy41IDQzMy41IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MzMuNSA0MzMuNTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnIGlkPSJmaWxlLWRvd25sb2FkIj4KCQk8cGF0aCBkPSJNMzk1LjI1LDE1M2gtMTAyVjBoLTE1M3YxNTNoLTEwMmwxNzguNSwxNzguNUwzOTUuMjUsMTUzeiBNMzguMjUsMzgyLjV2NTFoMzU3di01MUgzOC4yNXoiIGZpbGw9IiM4MDgwODAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K);
  width: 24px;
  height: 24px;
  opacity: 0.65;
}
.mmi_vkmd .i_icon {
  background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDQzMy41IDQzMy41IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MzMuNSA0MzMuNTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnIGlkPSJmaWxlLWRvd25sb2FkIj4KCQk8cGF0aCBkPSJNMzk1LjI1LDE1M2gtMTAyVjBoLTE1M3YxNTNoLTEwMmwxNzguNSwxNzguNUwzOTUuMjUsMTUzeiBNMzguMjUsMzgyLjV2NTFoMzU3di01MUgzOC4yNXoiIGZpbGw9IiM5ZGE4YmMiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K);
}
#l_vkmd .left_icon.fl_l {
  background: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDQzMy41IDQzMy41IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MzMuNSA0MzMuNTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnIGlkPSJmaWxlLWRvd25sb2FkIj4KCQk8cGF0aCBkPSJNMzk1LjI1LDE1M2gtMTAyVjBoLTE1M3YxNTNoLTEwMmwxNzguNSwxNzguNUwzOTUuMjUsMTUzeiBNMzguMjUsMzgyLjV2NTFoMzU3di01MUgzOC4yNXoiIGZpbGw9IiM3ZDljYjgiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K)
    no-repeat 7px;
}
.settings_menu_rows .olist_item_menu.olist_item_vkmd .olist_item_photo {
  background: #e6edf4
    url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDQzMy41IDQzMy41IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MzMuNSA0MzMuNTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnIGlkPSJmaWxlLWRvd25sb2FkIj4KCQk8cGF0aCBkPSJNMzk1LjI1LDE1M2gtMTAyVjBoLTE1M3YxNTNoLTEwMmwxNzguNSwxNzguNUwzOTUuMjUsMTUzeiBNMzguMjUsMzgyLjV2NTFoMzU3di01MUgzOC4yNXoiIGZpbGw9IiM3ZDljYjgiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K)
    no-repeat 8px;
}

.modal-container {
  position: fixed;
  opacity: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: all 0.25s;
  z-index: -1000;
}
#modal-checkbox {
  top: 20px;
  left: 20px;
  position: fixed;
  z-index: 9999999999999;
  display: block;
}
.modal-container {
  visibility: hidden;
}
#modal-checkbox:checked + .modal-container {
  z-index: 9999999;
  opacity: 1;
  visibility: visible;
}
#modal-checkbox:checked + .modal-container label {
  display: block;
}
#modal-checkbox:checked + .modal-container .modal-content {
  bottom: 0;
  transition: all 0.25s;
  display: flex;
}
.modal-content {
  position: absolute;
  background-color: gray;
  min-width: 400px;
  min-height: 225px;
  max-width: 500px;
  max-height: 280px;
  width: 40%;
  height: 40%;
  opacity: 1;
  flex-direction: column;
  align-items: center;
  right: 0;
  bottom: -20%;
  transition: all 0.25s;
}
.modal-header {
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: center;
  width: 100%;
}
.modal-close-x {
  margin: 5px 10px 5px 0;
  z-index: 12;
  cursor: pointer;
}
.modal-close-x div {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.modal-close-x,
.modal-close-x div {
  width: 24px;
  height: 24px;
}
.modal-close-x div:after,
.modal-close-x div:before {
  content: '';
  position: absolute;
  background: #fff;
  width: 2.5px;
  height: 24px;
  display: block;
  transform: rotate(45deg);
}
.modal-close-x div:before {
  transform: rotate(-45deg);
}
.modal-close-background {
  position: absolute;
  background-color: black;
  width: 100%;
  height: 100%;
  opacity: 0.4;
  cursor: pointer;
  display: none;
}

.audio_meta_data {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  color: var(--text_secondary);
  margin-left: 10px;
  white-space: nowrap;
}

`;
  var _addStyle = function (textCss) {
    if (typeof GM !== 'undefined' && typeof GM.addStyle !== 'undefined') {
      return GM.addStyle(textCss)
    }
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
})();
