// ==UserScript==
// @name            http-on-pages
// @namespace       https://github.com/pansong291/
// @version         0.1.11
// @description     Initiate an XHR request on the page
// @description:zh  在页面上发起 XHR 请求
// @author          paso
// @license         Apache-2.0
// @match           *://*/*
// @icon            data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%201024%201024%22%20fill%3D%22black%22%3E%3Cpath%20d%3D%22M474.937%20387.054c0-20.275%2016.638-36.403%2036.913-36.403h53.035L362.632%20148.402%20160.377%20350.65h53.297c20.275%200%2036.652%2016.128%2036.652%2036.403v259.959c0%2020.276-16.377%2036.914-36.652%2036.914-20.021%200-36.919-16.638-36.919-36.914V423.967H71.732c-20.015%200-36.137-17.159-36.137-36.914%200-9.883%203.644-19.244%2010.138-25.999l291.42-291.16c13.781-13.521%2037.435-13.521%2051.217%200l291.421%20291.161c13.776%2014.552%2013.776%2037.956%200%2051.987-7.282%206.766-16.898%2010.925-25.999%2010.925H548.247v223.045c0%2020.276-16.377%2036.914-36.398%2036.914h-53.291l202.509%20202.26%20201.994-202.26H809.77c-20.276%200-36.398-16.638-36.398-36.914V387.054c0-20.275%2016.122-36.403%2036.398-36.403s36.914%2016.128%2036.914%2036.403v223.567h104.768c9.617%200%2018.717%203.116%2026.254%2010.393a37.359%2037.359%200%200%201%200%2051.999L687.328%20962.609l-0.261%201.043c-14.558%2014.563-37.957%2014.563-51.993%200l-291.16-290.639c-6.239-6.755-10.659-16.117-10.659-26%200-20.275%2016.898-36.392%2036.397-36.392h105.285V387.054z%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E
// @grant           none
// @noframes
// @run-at          context-menu
// @require         https://update.greasyfork.org/scripts/473443/1690999/popup-inject.js
// @downloadURL https://update.greasyfork.org/scripts/485221/http-on-pages.user.js
// @updateURL https://update.greasyfork.org/scripts/485221/http-on-pages.meta.js
// ==/UserScript==

/**
 * @typedef {object} ReqObj
 * @property {string} method
 * @property {string} url
 * @property {string} code
 * @property {number} timestamp
 */
/**
 * @typedef {object} ProxiedReqExtension
 * @property {(i: number, v: ReqObj) => void} insert
 * @property {(i: number) => ReqObj} remove
 * @property {ReqObj} selected
 */
/**
 * @typedef {ReqObj[] & ProxiedReqExtension} ProxiedReqArray
 */
;(function () {
  'use strict'
  const namespace = 'paso-http-on-pages'
  const injectHint = 'const data = { headers: {}, params: {}, body: void 0, withCredentials: true }'
  const injectHtml = `
    <div class="tip-box info">${injectHint}</div>
    <div class="flex gap-4">
      <select id="ipt-req-sel" class="input"></select>
      <button id="btn-req-rem" type="button" class="button square">
        <svg width="16" height="16" fill="currentcolor">
          <path d="M2 7h12v2H2Z"></path>
        </svg>
      </button>
      <button id="btn-req-add" type="button" class="button square">
        <svg width="16" height="16" fill="currentcolor">
          <path d="M2 7H7V2H9V7H14V9H9V14H7V9H2Z"></path>
        </svg>
      </button>
    </div>
    <div class="flex gap-4">
      <select id="ipt-method" class="input"></select>
      <input type="text" id="ipt-url" class="input" autocomplete="off">
      <button type="button" id="btn-submit" class="button">Submit</button>
    </div>
    <textarea id="ipt-code" class="input" spellcheck="false"></textarea>
    <div id="error-tip-box"></div>`
  const injectStyle = `
<style>
  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
  }
  .popup {
    gap: 4px;
  }
  .gap-4 {
    gap: 4px;
  }
  .tip-box.info {
    background: #d3dff7;
    border-left: 6px solid #3d7fff;
    border-radius: 4px;
    padding: 16px;
  }
  .button.square {
    width: 32px;
    padding: 0;
  }
  #ipt-method {
    width: 90px;
  }
  #ipt-url {
    width: 300px;
    flex-grow: 1;
  }
  #btn-submit {
    width: 100px;
  }
  #ipt-code {
    height: 400px;
  }
  #error-tip-box {
    background: #fdd;
    border-left: 6px solid #f66;
    border-radius: 4px;
    padding: 16px;
  }
  #error-tip-box:empty {
    display: none;
  }
</style>`
  window.paso.injectPopup({
    namespace,
    actionName: 'Http Request',
    collapse: '70%',
    content: injectHtml,
    style: injectStyle
  }).then((result) => {
    const { popup } = result.elem
    const { createElement } = result.func
    popup.classList.add('monospace')
    const element = {
      ipt_req_sel: popup.querySelector('#ipt-req-sel'),
      btn_req_rem: popup.querySelector('#btn-req-rem'),
      btn_req_add: popup.querySelector('#btn-req-add'),
      ipt_method: popup.querySelector('#ipt-method'),
      ipt_url: popup.querySelector('#ipt-url'),
      ipt_code: popup.querySelector('#ipt-code'),
      btn_submit: popup.querySelector('#btn-submit'),
      error_tip: popup.querySelector('#error-tip-box')
    }
    const method_options = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH']
    element.ipt_method.innerHTML = method_options.map(op => `<option value="${op}">${op}</option>`).join('')
    /**
     * @type {ProxiedReqArray}
     */
    const reactiveRequests = new Proxy([], {
      get(target, prop, receiver) {
        if (prop === 'insert') {
          return (index, value) => {
            checkIndex(index, target.length + 1)
            const opt = createElement('option', { value: value.timestamp }, [formatDate(value.timestamp)])
            if (target.length === 0 || index === target.length)
              element.ipt_req_sel.append(opt)
            else
              element.ipt_req_sel.children[index].before(opt)
            target.splice(index, 0, value)
          }
        } else if (prop === 'remove') {
          return (index) => {
            checkIndex(index, target.length)
            if (receiver.selected === target[index])
              receiver.selected = target[index > 0 ? index - 1 : 1]
            element.ipt_req_sel.children[index].remove()
            return target.splice(index, 1)[0]
          }
        } else if (prop === 'push') {
          return (value) => receiver.insert(target.length, value)
        } else if (prop === 'selected') {
          if (!target.selected) {
            const v = String(element.ipt_req_sel.value)
            target.selected = target.find((r) => String(r.timestamp) === v)
          }
        }
        return target[prop]
      },
      set(target, prop, newValue, receiver) {
        if (prop === 'selected') {
          target.selected = newValue
          element.ipt_req_sel.value = newValue?.timestamp || ''
          element.ipt_method.value = newValue?.method || ''
          element.ipt_url.value = newValue?.url || ''
          element.ipt_code.value = newValue?.code || ''
        }
        return true
      }
    })
    /**
     * @param {string|number} ts
     * @returns {ReqObj}
     */
    const getReqByTimestamp = (ts) => {
      ts = String(ts)
      return reactiveRequests.find((r) => String(r.timestamp) === ts)
    }

    const cache = getCache()
    if (cache?.requests && Array.isArray(cache.requests)) {
      for (const req of cache.requests) {
        reactiveRequests.push(createRequestObj(req))
      }
    }
    if (!reactiveRequests.length) reactiveRequests.push(createRequestObj())
    reactiveRequests.selected = getReqByTimestamp(cache?.selected) || reactiveRequests[0]

    element.ipt_req_sel.addEventListener('change', (e) => reactiveRequests.selected = getReqByTimestamp(e.currentTarget.value))
    element.btn_req_rem.addEventListener('click', () => {
      if (reactiveRequests.length <= 1) return
      reactiveRequests.remove(reactiveRequests.indexOf(reactiveRequests.selected))
    })
    element.btn_req_add.addEventListener('click', () => {
      const obj = createRequestObj()
      reactiveRequests.push(obj)
      reactiveRequests.selected = obj
    })
    element.ipt_method.addEventListener('change', (e) => reactiveRequests.selected.method = e.currentTarget.value)
    element.ipt_url.addEventListener('change', (e) => reactiveRequests.selected.url = e.currentTarget.value)
    element.ipt_code.addEventListener('change', (e) => reactiveRequests.selected.code = e.currentTarget.value)
    element.btn_submit.addEventListener('click', tryTo(() => {
      const selReq = reactiveRequests.selected
      if (!selReq.url) throw 'Url is required'
      const isGet = selReq.method === 'GET'
      // 预备数据
      const data = {
        headers: { 'Content-Type': isGet ? 'application/x-www-form-urlencoded' : 'application/json' },
        params: {},
        body: void 0,
        withCredentials: true
      }
      // 处理数据
      const handleData = new Function('data', selReq.code)
      handleData.call(data, data)
      const isForm = data.body instanceof FormData
      if (isForm) {
        // 使用表单时不填充 Content-Type
        delete data.headers['Content-Type']
      }

      const xhr = new XMLHttpRequest()
      // 链接
      xhr.open(selReq.method, selReq.url + serializeQueryParam(data.params))
      // 使用凭证
      xhr.withCredentials = !!data.withCredentials
      // 请求头
      Object.entries(data.headers).forEach(([n, v]) => {
        if (v !== null && v !== undefined) xhr.setRequestHeader(n, v)
      })
      // 请求体
      xhr.send(isGet ? void 0 : isForm ? data.body : serializeHttpBody(data.body))
      saveCache({ requests: reactiveRequests, selected: selReq.timestamp })
      element.error_tip.innerText = ''
    }, e => element.error_tip.innerText = String(e)))
  })

  /**
   * @param {function} fn
   * @param {function} [errorCallback]
   * @returns {function}
   */
  function tryTo(fn, errorCallback) {
    return function (...args) {
      try {
        fn.apply(this, args)
      } catch (e) {
        console.error(e)
        errorCallback?.(e)
      }
    }
  }

  /**
   * @param {string | Record<string, string>} [param]
   * @param {string} [prefix='?']
   * @returns {string}
   */
  function serializeQueryParam(param, prefix = '?') {
    if (!param) return ''
    if (typeof param === 'string') return prefix + param
    const str = Object.entries(flatten(param)).flatMap(([k, v]) => {
      if (v === null || v === void 0) return []
      return [k + '=' + encodeURIComponent(String(v))]
    }).join('&')
    if (str) return prefix + str
    return str
  }

  /**
   * @param {*} obj
   * @param {string} [name='']
   * @returns {Record<string, *>}
   */
  function flatten(obj, name = '') {
    const result = {}
    if (!obj || typeof obj !== 'object') {
      if (!name) return [obj]
      result[name] = obj
    } else {
      const isArr = Array.isArray(obj)
      Object.entries(obj).forEach(([k, v]) => {
        Object.entries(flatten(v, !name ? k : isArr ? `${name}[${k}]` : `${name}.${k}`)).forEach(([k2, v2]) => {
          result[k2] = v2
        })
      })
    }
    return result
  }

  /**
   * @param {?ReqObj} [base]
   * @returns {ReqObj}
   */
  function createRequestObj(base) {
    return {
      method: base?.method || 'GET',
      url: base?.url || '',
      code: base?.code || '',
      timestamp: base?.timestamp || Date.now()
    }
  }

  /**
   * @param {number} index
   * @param {number} length
   */
  function checkIndex(index, length) {
    if (index < 0 || index >= length) throw new RangeError(`Index out of bounds error.\nindex: ${index}\nlength: ${length}`)
  }

  /**
   * @param {*} [date]
   * @returns {string}
   */
  function formatDate(date) {
    date = new Date(date || null)
    const year = formatNumber(date.getFullYear(), 4)
    const month = formatNumber(date.getMonth())
    const day = formatNumber(date.getDate())
    const hour = formatNumber(date.getHours())
    const minute = formatNumber(date.getMinutes())
    const second = formatNumber(date.getSeconds())
    const mill = formatNumber(date.getMilliseconds(), 3)
    return `${year}-${month}-${day} ${hour}:${minute}:${second}.${mill}`
  }

  /**
   * @param {number} num
   * @param {number} [count=2]
   * @returns {string}
   */
  function formatNumber(num, count = 2) {
    return String(num).padStart(count, '0')
  }

  /**
   * @param {*} obj
   * @returns {string}
   */
  function serializeHttpBody(obj) {
    if (typeof obj === 'string') return obj
    return JSON.stringify(obj)
  }

  /**
   * @param {*} obj
   */
  function saveCache(obj) {
    localStorage.setItem(namespace, JSON.stringify(obj))
  }

  /**
   * @returns {{requests: ReqObj[], selected: string} | undefined}
   */
  function getCache() {
    const str = localStorage.getItem(namespace)
    try {
      if (str) return JSON.parse(str)
    } catch (e) {
      console.error(e)
    }
  }
})()
