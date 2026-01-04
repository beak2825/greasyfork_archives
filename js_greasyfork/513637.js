// ==UserScript==
// @name         Rlog按time重排
// @namespace    aizigao
// @version      1.6
// @description  Rlog 展示的顺序不对，用上传的time 重排，要求上传的内容是JSON, 并且有 time 字段，time 可以被 new Date(time) 处理，就会重新覆盖默认的时间
// @author       aizigao
// @match        https://log-search-docker.zuoyebang.cc/explore*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513637/Rlog%E6%8C%89time%E9%87%8D%E6%8E%92.user.js
// @updateURL https://update.greasyfork.org/scripts/513637/Rlog%E6%8C%89time%E9%87%8D%E6%8E%92.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const originalFetch = window.fetch
  const log = (...args) => console.log('😜', ...args)
  function get(obj, path, defaultValue = undefined) {
    const keys = Array.isArray(path) ? path : path.split('.')
    let result = obj
    for (const key of keys) {
      result = result ? result[key] : undefined
      if (result === undefined) {
        return defaultValue
      }
    }
    return result
  }
  function set(obj, path, value) {
    const keys = Array.isArray(path) ? path : path.split('.')
    let current = obj
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = value
      } else {
        current[key] = current[key] || {}
        current = current[key]
      }
    })
    return obj
  }

  const TARGET_APP_AUTH = ['zphybrid-log-debug', 'zphybrid-log']
  const authKey = (() => {
    // const search = window.location.search;
    const deCodeQuery = decodeURIComponent(window.location.search)
    const m = deCodeQuery.match(/app=\\"(.*?)\\"/)
    return m ? m[1] : ''
  })()

  log('authKey', authKey)

  const SafeJsonParse = (str) => {
    try {
      return JSON.parse(str)
    } catch (e) {
      return str
    }
  }

  const transformTime = (list) => {
    log('transformTime', list)
    return list.map((i) => {
      const { values, ...others } = i
      const newValues = values
        .map(([_oldTs, objStr]) => {
          const obj = SafeJsonParse(objStr)
          const time = new Date(obj.time).getTime()
          if (typeof obj === 'string') {
            log('错误：数据不是JSON')
          }
          if (!time || Number.isNaN(time)) {
            log('没有time 字段')
          }
          if (!time || Number.isNaN(time) || typeof obj === 'string') {
            return [_oldTs, objStr]
          }
          if (TARGET_APP_AUTH.includes(authKey)) {
            const content = JSON.parse(obj.content)
            delete obj.content
            const {p: pageKey, q: pageSearchPartical,atcxt,att, ...others} = content
            return [
              String(time * 1e6),
              JSON.stringify({
                att,
                atcxt,
                ...others,
                ...obj,
                AT_RLOG_RE_TIMING___: 'Rlog time 重置OK',
                pageKey: '/static/pad-InkLearn/' + pageKey + '.html',
                pageSearchPartical,
                z_RLOG_RE_TIMING___old_time: new Date(_oldTs / 1e6),
              }),
            ]
          }
          return [
            String(time * 1e6),
            JSON.stringify({
             
              ...obj,
               AT_RLOG_RE_TIMING___: 'Rlog time 重置OK',
              z_RLOG_RE_TIMING___old_time: new Date(_oldTs / 1e6),
            }),
          ]
        })
        .sort((a, b) => Number(a[0]) > Number(b[0]))
      return {
        values: newValues,
        ...others,
      }
    })
  }

  window.fetch = async function (resource, init) {
    // Check if the request URL matches the target API endpoint
    if (
      typeof resource === 'string' &&
      resource.includes('/loki/api/v1/query_range')
    ) {
      log('Intercepted fetch request:', resource)

      // Call the original fetch
      const response = await originalFetch(resource, init)

      if(response.status>300){
        return response
      }
      // Clone the response so we can modify it
      const clonedResponse = response.clone()

      const data = await clonedResponse.json()

      if(typeof data === 'string'){
        return response
      }


      // Modify the response data
      log('Original response data:', data)

      const originList = get(data, ['data', 'result'], [])
      // Example modification: add a custom field to the response

      data.customField = 'Modified content'
      if (originList.length) {
        try {
          const rstList = transformTime(originList)
          log('rstList', rstList)
          set(data, ['data', 'result'], rstList)
        } catch (e) {
          log('修改失败', e)
          window.alert('RLog 修改失败')
        }
      }
      // Create a new response with the modified data
      const modifiedResponse = new Response(JSON.stringify(data), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      })

      log('Modified response data:', data)

      return modifiedResponse
    }

    // If not our target URL, just proceed with the normal fetch
    return originalFetch(resource, init)
  }
})()
