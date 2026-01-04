/**
 * UserscriptAPIWeb
 *
 * 依赖于 `UserscriptAPI`。
 *
 * 需要通过 `@grant` 引入 `GM_xmlhttpRequest` 或 `GM_download`。
 * @version 1.4.0.20240522
 * @author Laster2800
 * @see {@link https://gitee.com/liangjiancang/userscript/tree/master/lib/UserscriptAPI UserscriptAPI}
 */
class UserscriptAPIWeb {
  /**
   * @param {UserscriptAPI} api `UserscriptAPI`
   * @param {(xhr: GM_XHR) => void} [api.options.web.preproc] 请求预处理
   */
  constructor(api) {
    this.api = api
    api.options.web ??= { preproc: null }
  }

  /**
   * @typedef {XMLHttpRequest} GM_XHR GM 定义的类 `XMLHttpRequest` 对象
   */
  /**
   * 发起网络请求，获取 `GM_XHR`
   * @param {Object} details 定义及细节类似于 `GM_xmlhttpRequest` `details`
   * @param {'GET' | 'HEAD' | 'POST'} [details.method='GET'] `METHOD`
   * @param {string} [details.url] `URL`
   * @param {number} [details.timeout] 超时时间
   * @param {(xhr: GM_XHR) => void} [details.ontimeout] 超时回调
   * @param {(xhr: GM_XHR) => void} [details.onerror] 错误回调
   * @param {(xhr: GM_XHR) => void} [details.onload] 加载回调
   * @param {string | URLSearchParams | FormData} [details.data] `DATA`
   * @param {Object} [options] 选项
   * @param {(xhr: GM_XHR) => boolean} [options.check] 检查 `GM_XHR` 是否符合条件
   * @param {boolean} [options.throwOnFailed = true] 失败时是否抛出异常，否则打印错误信息
   * @returns {Promise<GM_XHR>} `GM_XHR`
   * @throws 等待超时、达成终止条件、等待错误时抛出
   * @see {@link https://www.tampermonkey.net/documentation.php#GM_xmlhttpRequest GM_xmlhttpRequest}
   */
  requestXHR(details, options) {
    if (details) {
      const { api } = this
      const { check, throwOnFailed = true } = options ?? {}
      return new Promise((resolve, reject) => {
        if (details.data && details.data instanceof URLSearchParams) {
          details.data = details.data.toString()
          details.headers = {
            'content-type': 'application/x-www-form-urlencoded',
            ...details.headers,
          }
          if (GM_info.scriptHandler === 'Violentmonkey' && !details.headers.origin) {
            details.headers.origin = ''
          }
        }
        details.ontimeout ??= xhr => fail('request: TIMEOUT', details, xhr)
        details.onerror ??= xhr => fail('request: ERROR', details, xhr)
        details.onload ??= xhr => {
          if (check && !check(xhr)) {
            fail('request: CHECK-FAIL', details, check, xhr)
            if (throwOnFailed) return
          }
          resolve(xhr)
        }
        GM_xmlhttpRequest(details)

        function fail(msg, ...cause) {
          if (throwOnFailed) {
            reject(new Error(msg, cause.length > 0 ? { cause } : undefined))
          } else {
            api.logger.error(msg, ...cause)
          }
        }
      })
    }
  }

  /**
   * 发起网络请求，获取解析结果
   * @param {Object} details 定义及细节类似于 `GM_xmlhttpRequest` `details`
   * @param {'GET' | 'HEAD' | 'POST'} [details.method='GET'] `METHOD`
   * @param {string} [details.url] `URL`
   * @param {number} [details.timeout] 超时时间
   * @param {(xhr: GM_XHR) => void} [details.ontimeout] 超时回调
   * @param {(xhr: GM_XHR) => void} [details.onerror] 错误回调
   * @param {(xhr: GM_XHR) => void} [details.onload] 加载回调
   * @param {string | URLSearchParams | FormData} [details.data] `DATA`
   * @param {Object} [options] 选项
   * @param {'json' | 'check' | 'silentCheck'} [options.parser='json'] ```text
   *    json: 返回 JSON.parse(resp)
   *    check: 返回 check(resp, xhr)，检查失败时打印信息
   *    silentCheck: 返回 check(resp, xhr)，检查失败时不打印信息
   * ```
   * @param {(resp: Object, xhr: GM_XHR) => boolean} [options.check] 检查 `GM_XHR` 是否符合条件
   * @param {boolean} [options.throwOnFailed=true] 失败时是否抛出异常，否则打印错误信息
   * @returns {Promise<Object>} 解析结果
   * @see {@link https://www.tampermonkey.net/documentation.php#GM_xmlhttpRequest GM_xmlhttpRequest}
   */
  async request(details, options) {
    const { api } = this
    const { parser = 'json', check, throwOnFailed = true } = options ?? {}
    try {
      try {
        await api.options.web.preproc?.(details)
      } catch {
        fail('request: PREPROC', api.options.web.preproc, details)
      }
      const xhr = await this.requestXHR(details)
      let resp = null
      try {
        resp = JSON.parse(xhr.response)
      } catch {
        fail('request: PARSE', details, xhr)
        return null
      }
      const checkResult = !check || check(resp, xhr)
      if (parser === 'silentCheck') {
        return checkResult
      } else if (parser === 'check') {
        if (!checkResult) {
          api.logger.error('request: CHECK-FAIL', details, check, resp, xhr)
        }
        return checkResult
      } else {
        if (!checkResult) {
          fail('request: CHECK-FAIL', details, check, resp, xhr)
        }
        return resp
      }
    } catch (e) {
      if (throwOnFailed) {
        throw e
      } else {
        api.logger.error(e)
      }
    }

    function fail(msg, ...cause) {
      if (throwOnFailed) {
        throw new Error(msg, cause.length > 0 ? { cause } : undefined)
      } else {
        api.logger.error(msg, ...cause)
      }
    }
  }

  /**
   * 下载资源
   * @param {Object} details 定义及细节同 `GM_download` `details`
   * @returns {() => void} 用于终止下载的方法
   * @see {@link https://www.tampermonkey.net/documentation.php#GM_download GM_download}
   */
  download(details) {
    if (details) {
      const { api } = this
      try {
        let { name } = details
        if (name.includes('.')) {
          // name「.」后内容会被误认为后缀导致一系列问题，从 URL 找出真正的后缀名以修复之
          let parts = details.url.split('/')
          const last = parts.at(-1).split('?')[0]
          if (last.includes('.')) {
            parts = last.split('.')
            name = `${name}.${parts.at(-1)}`
          } else {
            name = name.replaceAll('.', '_') // 实在找不到后缀时才用这种消极的方案
          }
          details.name = name
        }
        details.onerror ??= (error, details) => api.logger.error('download: ERROR', error, details)
        details.ontimeout ??= () => api.logger.error('download: TIMEOUT')
        GM_download(details)
      } catch (e) {
        api.logger.error('download: ERROR', e)
      }
    }
    return () => {}
  }
}

/* global UserscriptAPI */
// eslint-disable-next-line no-lone-blocks
{ UserscriptAPI.registerModule('web', UserscriptAPIWeb) }
