// ==UserScript==
// @name         创作中心广告管理自动屏蔽米哈游相关的广告
// @namespace    http://853lab.com/
// @version      1.2
// @description  自动屏蔽在“创作中心”→“创作激励”→“广告管理”中与米哈游相关的广告。So FUCK YOU, miHoYo!
// @author       Sonic853
// @match        https://member.bilibili.com/*
// @match        https://cm.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451470/%E5%88%9B%E4%BD%9C%E4%B8%AD%E5%BF%83%E5%B9%BF%E5%91%8A%E7%AE%A1%E7%90%86%E8%87%AA%E5%8A%A8%E5%B1%8F%E8%94%BD%E7%B1%B3%E5%93%88%E6%B8%B8%E7%9B%B8%E5%85%B3%E7%9A%84%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/451470/%E5%88%9B%E4%BD%9C%E4%B8%AD%E5%BF%83%E5%B9%BF%E5%91%8A%E7%AE%A1%E7%90%86%E8%87%AA%E5%8A%A8%E5%B1%8F%E8%94%BD%E7%B1%B3%E5%93%88%E6%B8%B8%E7%9B%B8%E5%85%B3%E7%9A%84%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

// 如何超越米哈游公司？

// ChatGPT：米哈游公司是一家拥有极高知名度和成功游戏产品的公司，要超越它需要做出一些艰苦的工作和采取正确的策略。以下是几个可能有用的建议：

// 注重产品质量：米哈游公司之所以能够取得成功，是因为他们推出了高质量、受玩家欢迎的游戏。要超越米哈游公司，您需要注重产品质量，确保游戏具有高水准的游戏体验和优秀的画面效果。

// 创新：在游戏行业，创新是非常重要的。米哈游公司之所以能够在市场上脱颖而出，是因为他们不断尝试新的玩法和元素。如果您想要超越米哈游公司，需要不断探索新的玩法和游戏元素，推出具有创新性的产品。

// 建立强大的社区：米哈游公司拥有一个庞大的社区，这个社区不仅可以帮助他们推广游戏，还可以为游戏提供反馈和建议。要超越米哈游公司，您需要建立一个强大的社区，与玩家建立良好的互动关系，并且倾听他们的反馈和建议。

// 投入足够的资源：游戏开发需要大量的资源，包括人力、物力、资金等。如果您想要超越米哈游公司，需要投入足够的资源，包括聘请优秀的开发团队、研发创新技术、开展广告宣传等。

// 扩大市场：米哈游公司的成功，与其在全球市场上的表现密不可分。如果您想要超越米哈游公司，需要扩大市场，将游戏推向更广泛的受众，特别是在海外市场上建立自己的品牌和口碑。

// 请注意，要超越米哈游公司是一个艰难的任务，需要付出大量的努力和资源。同时，市场竞争也是不断变化的，需要时刻保持敏锐的洞察力和灵活性，随时调整自己的策略。


// phind：从所提供的上下文来看，如何超越米哈游公司的问题并不完全清楚。在全球范围内大受欢迎。

// 值得注意的是，米哈游已将其投资组合从游戏扩展到能源领域，通过投资聚变能源公司能量奇点，此举表明米哈游并不局限于游戏，而是愿意探索其他增长和投资途径。

// 要回答如何超越米哈游的问题，我们需要了解是什么让米哈游成功，以及其他公司如何复制这种成功。促成米哈游成功的一些因素是：

// - 聚焦核心人群：米哈游清楚了解目标人群，迎合他们的需求和喜好。忠实的粉丝群。
// - 始终如一的质量和创新：miHoYo 以提供创新和引人入胜的高质量游戏而闻名。“Genshin Impact”就是一个很好的例子，因为它引入了新的游戏机制和功能，让玩家保持参与。
// - 社区参与：米哈游围绕其游戏培养了一个强大的社区，这有助于提升其品牌和扩大影响力。公司定期与粉丝互动，并将他们的反馈纳入其游戏中。

// 为了超越米哈游，其他公司需要关注这些因素并围绕其产品建立强大的品牌和社区。此外，他们还需要创新并提供满足目标受众需求和偏好的高质量产品。

// 不过，值得注意的是，米哈游的成功并不仅仅是因为专注于游戏，公司还涉足其他领域，比如能源，这表明它愿意探索新的增长和投资途径，超越米哈游，公司需要具有灵活性和适应性，并愿意探索核心业务以外的新机会。

// bing：超越米哈游公司是一个很有挑战性的目标，因为米哈游是一家成立于2012年的中国游戏公司，拥有多款高品质人气产品，如《崩坏3》和《原神》12。在2021年2月，米哈游的收入超越了Supercell，成为全球第六大游戏公司3。如果你想超越米哈游公司，你可能需要考虑以下几个方面：

// 你的产品定位和目标用户是什么？
// 你的产品有什么独特的创意和优势？
// 你的产品如何在全球市场上进行推广和运营？
// 你的产品如何与其他竞争对手进行区分和竞争？
// 你的产品如何保持持续的更新和创新？
// 这些问题并不容易回答，但也不是不可能实现。我希望你能找到自己的答案，并取得成功。


(async function () {
  'use strict'
  const DEV_Log = Boolean(localStorage.getItem("Dev-853"))
  const localItem = "BlockmiHoYoAds"
  const NAME = "Block miHoYo Ads"
  const D = () => {
    return new Date().toLocaleTimeString()
  }

  const snooze = ms => new Promise(resolve => setTimeout(resolve, ms))

  const RList = class {
    static time = 200
    static #list = -1
    static async Push() {
      this.#list++
      await snooze(this.#list * this.time)
      Promise.resolve().finally(() => {
        setTimeout(() => { this.#list-- }, (this.#list + 1) * this.time)
      })
    }
  }

  if (typeof GM_xmlhttpRequest === 'undefined'
    && typeof GM_registerMenuCommand === 'undefined'
    && typeof GM_setValue === 'undefined'
    && typeof GM_getValue === 'undefined') {
    console.error(`[${NAME}][${D()}]: `, "GM is no Ready.")
  } else {
    console.log(`[${NAME}][${D()}]: `, "GM is Ready.")
  }

  const BLab8A = class {
    /**
     * @type {Object.<string, string>} data
     */
    static data = this.load()
    // constructor() {
    //   this.data = this.load()
    // }
    static load() {
      console.log(`[${NAME}][${D()}]: `, "正在加载数据")
      const defaultData = "{}"
      if (typeof GM_getValue !== 'undefined') {
        let gdata = GM_getValue(localItem, JSON.parse(defaultData))
        return gdata
      } else {
        let ldata = JSON.parse(localStorage.getItem(localItem) === null ? defaultData : localStorage.getItem(localItem))
        return ldata
      }
    }
    static save(d) {
      console.log(`[${NAME}][${D()}]: `, "正在保存数据")
      d === undefined ? (d = this.data) : (this.data = d)
      typeof GM_getValue != 'undefined' ? GM_setValue(localItem, d) : localStorage.setItem(localItem, JSON.stringify(d))
      return this
    }
  }

  class HSRequest {
    /**
     * Default: "GM"
     * @type {"GM"|"XHR"|"FETCH"|undefined}
     */
    mode = 'GM'
    /**
     * ["GM"|"XHR"|"FETCH"] Required. The URL to make the request to. Must be an absolute URL, beginning with the scheme. May be relative to the current page.
     * @type {string}
     */
    url = ''
    /**
     * ["GM"|"XHR"|"FETCH"] Required. Type of HTTP request to make (E.G. "GET", "POST")
     * @type {"GET"|"POST"|"PUT"|"DELETE"|"HEAD"|"OPTIONS"|"PATCH"}
     */
    method = 'GET'
    /**
     * ["GM"|"XHR"|"FETCH"] Optional. A set of headers to include in the request.
     * XHR and FETCH modes may not work.
     * @type {{
     * [key: string]: any
     * }}
     */
    headers = {}
    /**
     * ["GM"|"XHR"] Optional. Decode the response as specified type. Accepted values are "", "arraybuffer", "blob", "document", "json", "text", "ms-stream". Default value is "text". See XMLHttpRequest responseType.
     * @type {XMLHttpRequestResponseType}
     */
    responseType
    /**
     * ["GM"|"XHR"] Optional. Data to send in the request body. Usually for POST method requests.
     * like "username=johndoe&password=xyz123"
     * @type {string|undefined}
     */
    data
    /**
     * ["XHR"] Initiates the request. The body argument provides the request body, if any, and is ignored if the request method is GET or HEAD.
     * @type {Document | XMLHttpRequestBodyInit | null}
     */
    body
    /**
     * ["GM"] Optional, default false. When true, the data is sent as a Blob.
     * @type {boolean}
     */
    binary
    /**
     * ["GM"] (Compatibility: 1.10+) Optional, any object. This object will also be the context property of the #Response Object.
     * The same object passed into the original request.
     * @type {{
     * [key: string]: any
     * }}
     */
    context
    /**
     * ["GM"|"XHR"] Optional. A MIME type to specify with the request (E.G. "text/html; charset=ISO-8859-1").
     * @type {string}
     */
    overrideMimeType
    /**
     * ["GM"] Optional. User name to use for authentication purposes.
     * @type {string}
     */
    user
    /**
     * ["GM"] Optional. Password to use for authentication purposes.
     * @type {string}
     */
    password
    /**
     * ["GM"|"XHR"] Defaults to false. When true, this is a synchronous request. Be careful: The entire Firefox UI will be locked and frozen until the request completes. In this mode, more data will be available in the return value.
     * @type {boolean}
     * @deprecated
     */
    synchronous
    /**
     * ["GM"|"XHR"] The number of milliseconds to wait before terminating the call; zero (the default) means wait forever.
     * @type {number}
     */
    timeout
    /**
     * ["GM"] Optional. Object containing optional function callbacks (onabort, onerror, onload, onprogress) to monitor the upload of data. Each is passed one argument, the #Response Object.
    * @type {{
     *  onabort?: Function | undefined;
     *  onerror?: Function | undefined;
     *  onload?: Function | undefined;
     *  onprogress?: Function | undefined;
     * }}
     */
    upload
    /**
     * ["XHR"|"FETCH"] A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials.
     * @type {RequestCredentials}
     */
    credentials
    /**
     * ["FETCH"] RequestInit
     * @type {RequestInit}
     */
    requestInit
    /**
     * ["XHR"|"FETCH"] True when credentials are to be included in a cross-origin request. False when they are to be excluded in a cross-origin request and when cookies are to be ignored in its response. Initially false.
     * @type {boolean}
     */
    withCredentials
    /**
     * Debug mode. Defaults to false.
     * @type {boolean}
     */
    debug = false
    /**
     * Optional. Will be called when the request is aborted. Passed one argument, the #Response Object.
     * @type {Function}
     */
    onabort
    /**
     * Optional. Will be called if an error occurs while processing the request. Passed one argument, the #Response Object.
     * @type {Function}
     */
    onerror
    /**
     * Optional. Will be called when the request has completed successfully. Passed one argument, the #Response Object.
     * @type {Function}
     */
    onload
    /**
     * Optional. Will be called when the request progress changes. Passed one argument, the #Response Object.
     * @type {Function}
     */
    onprogress
    /**
     * Optional. Will be called repeatedly while the request is in progress. Passed one argument, the #Response Object.
     * @type {Function}
     */
    onreadystatechange
    /**
     * Optional. Will be called if/when the request times out. Passed one argument, the #Response Object.
     * @type {Function}
     */
    ontimeout
    /**
     * @param {Function} handler
     */
    set successHandler(handler) {
      this.onload = handler
    }
    get successHandler() {
      return this.onload
    }
    /**
     * @param {Function} handler
     */
    set errorHandler(handler) {
      this.onerror = handler
    }
    get errorHandler() {
      return this.onerror
    }
    /**
     * 
     * @param {{
     * mode?: "GM"|"XHR"|"FETCH"|undefined
     * url?: string
     * method?: "GET"|"POST"|"PUT"|"DELETE"|"HEAD"|"OPTIONS"|"PATCH"
     * headers?: {
     *  [key: string]: any
     * }
     * responseType?: XMLHttpRequestResponseType
     * data?: string|undefined
     * body?: Document | XMLHttpRequestBodyInit | null
     * binary?: boolean
     * context?: {
     *  [key: string]: any
     * }
     * overrideMimeType?: string
     * user?: string
     * password?: string
     * synchronous?: boolean
     * timeout?: number
     * upload?: {
     *  onabort?: Function | undefined;
     *  onerror?: Function | undefined;
     *  onload?: Function | undefined;
     *  onprogress?: Function | undefined;
     * }
     * credentials?: RequestCredentials
     * requestInit?: RequestInit
     * withCredentials?: boolean
     * debug?: boolean
     * onabort?: Function
     * onerror?: Function
     * onload?: Function
     * onprogress?: Function
     * onreadystatechange?: Function
     * ontimeout?: Function
     * }} [options] 
     */
    constructor({
      mode,
      url,
      method,
      headers,
      responseType,
      data,
      body,
      binary,
      context,
      overrideMimeType,
      user,
      password,
      synchronous,
      timeout,
      upload,
      credentials,
      requestInit,
      withCredentials,
      debug,
      onabort,
      onerror,
      onload,
      onprogress,
      onreadystatechange,
      ontimeout
    } = {}) {
      this.mode = mode
      this.url = url
      this.method = method
      this.headers = headers
      this.responseType = responseType
      this.data = data
      this.body = body
      this.binary = binary
      this.context = context
      this.overrideMimeType = overrideMimeType
      this.user = user
      this.password = password
      this.synchronous = synchronous
      this.timeout = timeout
      this.upload = upload
      this.debug = debug
      this.onabort = onabort
      this.onerror = onerror
      this.onload = onload
      this.credentials = credentials
      this.requestInit = requestInit
      this.withCredentials = withCredentials
      this.onprogress = onprogress
      this.onreadystatechange = onreadystatechange
      this.ontimeout = ontimeout
    }
  }
  /**
   * 
   * @param {HSRequest} hsRequest 
   * @param {boolean} stringOnly
   * @returns {Promise<string>|Promise<XMLHttpRequest>|Promise<Response>|Promise<Tampermonkey.Request>}
   */
  let HTTPSendPro = (hsRequest, stringOnly = false) => {
    hsRequest.mode = hsRequest.mode ?? 'GM'
    if (hsRequest.mode.toUpperCase() === 'GM' && typeof GM_xmlhttpRequest === 'undefined') {
      console.log('HTTPSendPro: GM_xmlhttpRequest not found, using XHR')
      hsRequest.mode = 'XHR'
    }
    hsRequest.method = hsRequest.method ?? 'GET'
    return new Promise((rl, rj) => {
      switch (hsRequest.mode.toUpperCase()) {
        default:
        case 'GM':
          {
            if (hsRequest.debug) console.log(`HTTPSendPro: GM mode - ${hsRequest.method} ${hsRequest.url}`)
            try {
              /**
               * @type {{
               * [key: string]: any
               * }}
               */
              const hsr = {
                method: hsRequest.method,
                url: hsRequest.url,
              }
              if (hsRequest.binary !== undefined) {
                hsr.binary = hsRequest.binary
              }
              if (hsRequest.context !== undefined) {
                hsr.context = hsRequest.context
              }
              if (hsRequest.data !== undefined) {
                hsr.data = hsRequest.data
              }
              if (hsRequest.headers !== undefined) {
                hsr.headers = hsRequest.headers
              }
              if (hsRequest.overrideMimeType !== undefined) {
                hsr.overrideMimeType = hsRequest.overrideMimeType
              }
              if (hsRequest.user !== undefined) {
                hsr.user = hsRequest.user
              }
              if (hsRequest.password !== undefined) {
                hsr.password = hsRequest.password
              }
              if (hsRequest.responseType !== undefined) {
                hsr.responseType = hsRequest.responseType
              }
              if (hsRequest.synchronous !== undefined) {
                hsr.synchronous = hsRequest.synchronous
              }
              if (hsRequest.timeout !== undefined) {
                hsr.timeout = hsRequest.timeout
              }
              if (hsRequest.upload !== undefined) {
                hsr.upload = hsRequest.upload
              }
              hsr.onabort = (response) => {
                if (hsRequest.onabort) hsRequest.onabort(response)
                rj(response)
              }
              hsr.onerror = (response) => {
                if (hsRequest.onerror) hsRequest.onerror(response)
                rj(response)
              }
              hsr.onload = (response) => {
                /**
                 * @type {number}
                 */
                let status
                if (response.readyState == 4) { // `DONE`
                  status = response.status
                  if (status == 200) {
                    if (hsRequest.onload) {
                      hsRequest.onload(stringOnly ? response.response : response)
                    }
                    rl(stringOnly ? response.response : response)
                  } else {
                    if (hsRequest.onerror) hsRequest.onerror(response)
                    rj(response)
                  }
                }
              }
              hsr.onprogress = (response) => {
                if (hsRequest.onprogress) hsRequest.onprogress(response)
              }
              hsr.onreadystatechange = (response) => {
                if (hsRequest.onreadystatechange) hsRequest.onreadystatechange(response)
              }
              hsr.ontimeout = (response) => {
                if (hsRequest.ontimeout) hsRequest.ontimeout(response)
                rj(response)
              }
              GM_xmlhttpRequest(hsr)
            } catch (error) {
              rj(error)
            }
          }
          break;
        case 'XHR':
          {
            if (hsRequest.debug) console.log(`HTTPSendPro: XHR mode - ${hsRequest.method} ${hsRequest.url}`)
            try {
              const xhr = new XMLHttpRequest()
              const _async = hsRequest.synchronous === undefined ? true : !hsRequest.synchronous
              if (hsRequest.user !== undefined
                || hsRequest.password !== undefined) {
                xhr.open(hsRequest.method, hsRequest.url, _async, hsRequest.user, hsRequest.password)
              }
              else {
                xhr.open(hsRequest.method, hsRequest.url, _async)
              }
              if (hsRequest.withCredentials !== undefined) {
                xhr.withCredentials = hsRequest.withCredentials
              }
              else if (hsRequest.credentials !== undefined) {
                switch (hsRequest.credentials) {
                  case 'omit':
                  case 'same-origin':
                    xhr.withCredentials = false
                    break;
                  case 'include':
                    xhr.withCredentials = true
                    break;
                }
              }
              if (hsRequest.responseType !== undefined) {
                xhr.responseType = hsRequest.responseType
              }
              if (hsRequest.timeout !== undefined) {
                xhr.timeout = hsRequest.timeout
              }
              if (hsRequest.overrideMimeType !== undefined) {
                xhr.overrideMimeType(hsRequest.overrideMimeType)
              }
              if (hsRequest.headers !== undefined) {
                for (const key in hsRequest.headers) {
                  xhr.setRequestHeader(key, hsRequest.headers[key])
                }
              }
              xhr.onabort = (event) => {
                if (hsRequest.onabort) hsRequest.onabort(xhr, event)
                rj(event)
              }
              let errored = false
              xhr.onerror = (event) => {
                if (!errored) {
                  errored = true
                  if (hsRequest.onerror) {
                    hsRequest.onerror(xhr, event)
                  }
                  rj(xhr, event)
                }
              }
              let loaded = false
              xhr.onload = (event) => {
                if (!loaded) {
                  loaded = true
                  if (hsRequest.onload) {
                    if (stringOnly) {
                      hsRequest.onload(xhr.response)
                    }
                    else {
                      hsRequest.onload(xhr, event)
                    }
                  }
                  if (stringOnly) {
                    rl(xhr.response)
                  }
                  else {
                    rl(xhr)
                  }
                }
              }
              xhr.onprogress = (event) => {
                if (hsRequest.onprogress) hsRequest.onprogress(xhr, event)
              }
              xhr.onreadystatechange = (event) => {
                if (hsRequest.onreadystatechange) hsRequest.onreadystatechange(xhr, event)
                else {
                  if (xhr.readyState == 4) { // `DONE`
                    if (xhr.status == 200) {
                      if (!loaded) {
                        loaded = true
                        if (hsRequest.onload) {
                          if (stringOnly) {
                            hsRequest.onload(xhr.response)
                          }
                          else {
                            hsRequest.onload(xhr, event)
                          }
                        }
                        if (stringOnly) {
                          rl(xhr.response)
                        }
                        else {
                          rl(xhr)
                        }
                      }
                    } else {
                      if (!errored) {
                        errored = true
                        if (hsRequest.onerror) hsRequest.onerror(xhr, event)
                        rj(xhr)
                      }
                    }
                  }
                }
              }
              xhr.ontimeout = (event) => {
                if (hsRequest.ontimeout) hsRequest.ontimeout(event)
                rj(event)
              }
              if (hsRequest.data !== undefined) {
                xhr.send(hsRequest.data)
              }
              else if (hsRequest.body !== undefined) {
                xhr.send(hsRequest.body)
              }
              else {
                xhr.send()
              }
            } catch (error) {
              rj(error)
            }
          }
          break;
        case 'FETCH':
          {
            if (hsRequest.debug) console.log(`HTTPSendPro: FETCH mode - ${hsRequest.method} ${hsRequest.url}`)
            try {
              let url = new URL(hsRequest.url)
              if (hsRequest.user !== undefined) {
                url.username = hsRequest.user
              }
              if (hsRequest.password !== undefined) {
                url.password = hsRequest.password
              }
              /**
               * @type {RequestInit}
               */
              const _init = hsRequest.requestInit || {
                method: hsRequest.method,
              }
              if (hsRequest.headers !== undefined) {
                _init.headers = hsRequest.headers
              }
              if (hsRequest.credentials !== undefined) {
                _init.credentials = hsRequest.credentials
              }
              else if (hsRequest.withCredentials !== undefined) {
                _init.credentials = hsRequest.withCredentials ? 'include' : 'omit'
              }
              fetch(url, _init).then((response) => {
                if (response.status == 200) {
                  if (hsRequest.onload) {
                    if (stringOnly) {
                      response.text().then((text) => {
                        hsRequest.onload(text)
                      })
                    }
                    else {
                      hsRequest.onload(response)
                    }
                  }
                  if (stringOnly) {
                    response.text().then((text) => {
                      rl(text)
                    })
                  }
                  else {
                    rl(response)
                  }
                }
                else {
                  if (hsRequest.onerror) hsRequest.onerror(response)
                  rj(response)
                }
              }).catch((error) => {
                if (hsRequest.onerror) hsRequest.onerror(error)
                rj(error)
              })
            } catch (error) {
              rj(error)
            }
          }
          break;
      }
    })
  }

  class BV2AV {
    static table = "fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF"
    /**
     * @type {[key: string]: number}
     */
    static tr = {}
    static s = [11, 10, 3, 8, 4, 6]
    static xor = 177451812
    static add = 8728348608
    // constructor() {
    //   for (let i = 0; i < 58; ++i) {
    //     this.tr[this.table[i]] = i
    //   }
    // }
    /**
     * BV2AV
     * @param {string} x 
     * @returns {string}
     */
    static dec(x) {
      let r = 0
      for (let i = 0; i < 6; ++i) {
        r += this.tr[x[this.s[i]]] * 58 ** i
      }
      return "av" + String((r - this.add) ^ this.xor)
    }
  }
  for (let i = 0; i < 58; ++i) {
    BV2AV.tr[BV2AV.table[i]] = i
  }

  class AdsManager {
    static filter_ads_by_pageUrl = "https://cm.bilibili.com/meet/api/open_api/v1/up/web/trust_ad/filter_ads_by_page"
    static filter_adsUrl = "https://cm.bilibili.com/meet/api/open_api/v1/up/web/trust_ad/filter_ads"
    // https://www.bilibili.com/video/av546869571/?t=21
    static keywords = [
      "米哈游",
      "miHoYo",
      "HoYoverse",
      "HoYoLAB",
      "崩坏学园",
      "崩坏学院",
      "崩坏3",
      "崩坏三",
      // "女武神",
      // "律者",
      "原神",
      "提瓦特大陆",
      // "好耶，是大冒险！",
      // "为世界上所有的美好而战！",
      "星穹铁道",
      "绝区零",
      "未定事件簿",
      "米游社",
    ]
    static PPC_keywords = [
      "bilibili://game_center/detail?id=103496&",
      "bilibili://game_center/detail?id=94&",
      "bilibili://game_center/detail?id=108434&",
      "bilibili://game_center/detail?id=107800&",
      "bilibili://game_center/detail?id=12&",
    ]
    static PPC_keywords_includes = [
      "id1523037824",
      "id1517783697",
      "id1143402987",
      "id737651307",
    ]
    /**
     * @type {string[]}
     */
    static isAdsByAid = []
    /**
     * @type {string[]}
     */
    static notAdsByAid = []
    static get runningTime() {
      /**
       * @type {{
       * runningTime: number,
       * }}
       */
      let data = BLab8A.load()
      return data.runningTime === undefined ? 0 : data.runningTime
    }
    /** @param {number} v */
    static set runningTime(v) {
      /**
       * @type {{
       * runningTime: number,
       * }}
       */
      let data = BLab8A.load()
      data.runningTime = v
      BLab8A.save(data)
    }
    static async getAdsList(page = 1, size = 10, ad_title = "", trust_status = "") {
      console.log(`[${NAME}][${D()}]: `, `正在获取广告列表第${page}页`)
      let url = `${this.filter_ads_by_pageUrl}?page=${page}&size=${size}&ad_title=${ad_title}&trust_status=${trust_status}`
      /**
       * @type {{
       *  status: "success",
       *  current_time: number,
       *  result: {
       *   banned_num: number,
       *   data: {
       *    app_name: string,
       *    button_copy: string,
       *    creative_desc: string,
       *    creative_id: number,
       *    creative_title: string,
       *    grade: number,
       *    image_url: string,
       *    mtime: number,
       *    promotion_purpose_content: string,
       *    trust_status: number,
       *   }[],
       *   page: number,
       *   showed_num: number,
       *   total_count: number,
       *  }
       * }}
       */
      let data = JSON.parse(await HTTPSendPro({
        url,
        method: "GET",
        headers: {
          accept: "application/json, text/plain, */*",
          referer: "https://cm.bilibili.com/divide/",
        }
      }, true))
      if (data.status == "success") {
        return {
          page: data.result.page,
          total_count: data.result.total_count,
          data: data.result.data
        }
      }
      console.error(data)
      return null
    }
    static async getAdsAllList() {
      const _runningTime = Date.now()
      this.runningTime = _runningTime
      let page = 1
      let size = 10
      let ad_title = ""
      let trust_status = "1"
      let data = await this.getAdsList(page, size, ad_title, trust_status)
      let total_count = data.total_count
      let list = data.data
      while (page < total_count / size) {
        if (this.runningTime > _runningTime) {
          console.log(`[${NAME}][${D()}]: `, "其它相同脚本正在运行")
          return []
        }
        page++
        await RList.Push()
        data = await this.getAdsList(page, size, ad_title, trust_status)
        list = list.concat(data.data)
      }
      return list
    }
    /**
     *
     * @param {number} creative_ids
     * @param {number} trust_status
     */
    static async setAdsTrustStatus(creative_ids, trust_status) {
      let url = this.filter_adsUrl
      let data = {
        creative_ids,
        trust_status
      }
      /**
       * @type {{
       *  status: "success",
       *  current_time: number,
       * }}
       */
      let result = JSON.parse(await HTTPSendPro({
        url,
        method: "POST",
        headers: {
          "content-type": "application/json",
          referer: "https://cm.bilibili.com/divide/",
          origin: "https://cm.bilibili.com"
        },
        data: JSON.stringify(data)
      }, true))
      let isSuccess = result.status == "success"
      if (!isSuccess) console.error(result)
      return isSuccess
    }
    /**
     * 
     * @param {string} aid 
     */
    static async getTagsFromAid(aid) {
      await RList.Push()
      console.log(`[${NAME}][${D()}]: `, `正在获取视频 av${aid} 的 Tag`)
      let url = `https://api.bilibili.com/x/tag/archive/tags?aid=${aid}&_=${Math.round(new Date() / 1000)}`
      /**
       * @type {{
       *  code: number,
       *  message: string,
       *  ttl: number,
       *  data: {
       *   tag_id: number,
       *   tag_name: string,
       *  }[],
       * }}
       */
      let result = JSON.parse(await HTTPSendPro({
        url,
        method: "GET"
      }, true))
      if (result.code == 0) {
        return result.data.map((item) => item.tag_name)
      }
      console.error(result)
      return []
    }
    /**
     * 
     * @param {string} bvid 
     */
    static async getTagsFromBvid(bvid) {
      return await this.getTagsFromAid(BV2AV.dec(bvid).slice(2))
    }
    /**
     * 
     * @param {string} aid 
     */
    static async getDetailFromAid(aid) {
      await RList.Push()
      console.log(`[${NAME}][${D()}]: `, `正在获取视频 av${aid} 的详细信息`)
      let url = `https://api.bilibili.com/x/web-interface/view/detail?aid=${aid}`
      /**
       * @type {{
       * code: number,
       * message: string,
       * ttl: number,
       * data: {
       *  Tags: {
       *   tag_name: string,
       *   tag_id: number,
       *  }[],
       *  View: {
       *   aid: number,
       *   bvid: string,
       *   desc: string,
       *   title: string,
       *  }
       * }
       * }}
       */
      let result = JSON.parse(await HTTPSendPro({
        url,
        method: "GET"
      }, true))
      if (result.code == 0) {
        return {
          tags: result.data.Tags.map((item) => item.tag_name),
          title: result.data.View.title,
          desc: result.data.View.desc,
          aid: result.data.View.aid,
          bvid: result.data.View.bvid,
        }
      }
      return null
    }
    /**
     * 
     * @param {string} bvid 
     */
    static async getDetailFromBvid(bvid) {
      return await this.getDetailFromAid(BV2AV.dec(bvid).slice(2))
    }
  }

  // 判断浏览器 url 是否为 https://cm.bilibili.com 开头
  if (location.href.startsWith("https://cm.bilibili.com")) {
  }
  else {
    // let adsManager = new AdsManager()
    const startBlock = async () => {
      console.log(`[${NAME}][${D()}]: `, "获取广告列表")
      let list = await AdsManager.getAdsAllList()
      /**
       * @type {{
       *  app_name: string;
       *  button_copy: string;
       *  creative_desc: string;
       *  creative_id: number;
       *  creative_title: string;
       *  grade: number;
       *  image_url: string;
       *  mtime: number;
       *  promotion_purpose_content: string;
       *  trust_status: number;
       * }[]}
       */
      let ads = []
      for (let item of list) {
        let isAds = false
        for (const keyword of AdsManager.keywords) {
          if (item.creative_title.includes(keyword)) {
            isAds = true
            break
          }
        }
        if (!isAds) for (const keyword of AdsManager.PPC_keywords) {
          if (item.promotion_purpose_content.startsWith(keyword)) {
            isAds = true
            break
          }
        }
        if (!isAds) for (const keyword of AdsManager.PPC_keywords_includes) {
          if (item.promotion_purpose_content.includes(keyword)) {
            isAds = true
            break
          }
        }
        if (!isAds && (item.promotion_purpose_content.toLocaleLowerCase().startsWith('https://www.bilibili.com/video/')
          || item.promotion_purpose_content.toLocaleLowerCase().startsWith('http://www.bilibili.com/video/')
          || item.promotion_purpose_content.toLocaleLowerCase().startsWith('bilibili://video/')
        )) {
          /**
           * @type {string}
           */
          let vid
          // bilibili://video/615778550?source_id=__SOURCEID__&resource_id=__RESOURCEID__&creative_id=__CREATIVEID__&linked_creative_id=110656445&track_id=__TRACKID__&from_spmid=__FROMSPMID__&trackid=__FROMTRACKID__&request_id=__REQUESTID__&caid=__CAID__&biz_extra=%7B%22ad_play_page%22%3A1%7D
          if (item.promotion_purpose_content.toLocaleLowerCase().startsWith('bilibili://video/')) {
            vid = item.promotion_purpose_content.split('/')[3].split('?')[0]
            if (!vid.startsWith("BV")) {
              vid = `av${vid}`
            }
          }
          else {
            vid = item.promotion_purpose_content.split('/')[4].split('?')[0]
          }
          /**
           * @type {{
           *  tags: string[];
           *  title: string;
           *  desc: string;
           *  aid: number;
           *  bvid: string;
           *}}
           */
          let detail = null
          if (vid.startsWith("BV")) {
            const aid = BV2AV.dec(vid).slice(2)
            if (AdsManager.notAdsByAid.includes(aid)) continue
            // detail = await AdsManager.getDetailFromBvid(vid)
            if (AdsManager.isAdsByAid.includes(aid))
              isAds = true
            else
              detail = await AdsManager.getDetailFromAid(aid)
          }
          if (vid.toLowerCase().startsWith("av")) {
            if (AdsManager.notAdsByAid.includes(vid.slice(2))) continue
            if (AdsManager.isAdsByAid.includes(vid.slice(2)))
              isAds = true
            else
              detail = await AdsManager.getDetailFromAid(vid.slice(2))
          }
          if (detail) {
            for (const keyword of AdsManager.keywords) {
              if (isAds) break
              if (detail.title.includes(keyword)) {
                isAds = true
                AdsManager.isAdsByAid.push(detail.aid.toString())
                break
              }
              if (detail.desc.includes(keyword)) {
                isAds = true
                AdsManager.isAdsByAid.push(detail.aid.toString())
                break
              }
              for (const tag of detail.tags) {
                if (tag.includes(keyword)) {
                  isAds = true
                  AdsManager.isAdsByAid.push(detail.aid.toString())
                  break
                }
              }
            }
            if (!isAds) {
              AdsManager.notAdsByAid.push(detail.aid.toString())
            }
          }
        }
        if (isAds) ads.push(item)
      }
      if (ads.length == 0) return console.log(`[${NAME}][${D()}]: `, "没有 miHoYo 相关的广告")
      let blocked = 0
      for (let item of ads) {
        console.log(`[${NAME}][${D()}]: `, `正在屏蔽广告：${item.creative_title}`)
        await RList.Push()
        let r = await AdsManager.setAdsTrustStatus(item.creative_id, 0)
        console.log(`[${NAME}][${D()}]: `, r ? "屏蔽成功" : "屏蔽失败")
        if (r) blocked++
      }
      console.log(`[${NAME}][${D()}]: `, `已屏蔽 ${blocked} 条广告`)
    }
    GM_registerMenuCommand("Block miHoYo Ads", startBlock)
    try {
      await startBlock()
    } catch (error) {
      console.error(error)
    }
  }
})()
