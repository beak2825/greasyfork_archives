// @name            cross-origin-storage
// @name:zh         跨域本地存储
// @namespace       https://github.com/pansong291/
// @version         1.0.4
// @author          paso
// @license         Apache-2.0

;(function() {
  'use strict'

  const __msgType = 'cross-origin-storage'

  /**
   * 生成随机ID
   * @returns {string}
   */
  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  /**
   * @param {WindowProxy} win
   * @param {*} msg
   */
  function sendMsgTo(win, msg) {
    win.postMessage(msg, '*')
  }

  /**
   * @param {(e: MessageEvent) => void} handler
   */
  function onReceive(handler) {
    window.addEventListener('message', handler)
  }

  /**
   * @param {string} serverUrl
   */
  function createStorageClient(serverUrl) {
    const serverIframe = document.createElement('iframe')
    serverIframe.src = serverUrl
    serverIframe.setAttribute('style', 'display: none !important;')
    window.document.body.appendChild(serverIframe)
    return startStorageClient(serverIframe.contentWindow, 10_000)
  }

  /**
   * @param {WindowProxy} serverWindow
   * @param {number} [timeout]
   */
  function startStorageClient(serverWindow, timeout) {
    // 所有请求消息数据映射
    const _requests = {}
    const _cache = {
      // 开始建立连接的时间
      startTime: 0,
      // 与 Server 的连接是否已建立完成
      connected: false,
      // 连接是否超时
      timeout: false,
      // 缓存的请求队列
      queue: []
    }
    // 监听 Server 发来的消息
    onReceive((e) => {
      if (e?.data?.__msgType !== __msgType) return
      if (e.data.connected) {
        // 连接已建立完成, 发送队列中的全部请求
        _cache.connected = true
        while (_cache.queue.length) {
          sendMsgTo(serverWindow, _cache.queue.shift())
        }
        return
      }
      const { id, response } = e.data
      // 找到消息对应的回调函数，调用并传递数据
      _requests[id]?.resolve(response)
      delete _requests[id]
    })

    // 请求与 Server 建立连接
    const loopId = setInterval(() => {
      if (_cache.connected) {
        clearInterval(loopId)
        return
      }
      if (!_cache.startTime) {
        _cache.startTime = Date.now()
      } else if (timeout && timeout > 0) {
        if (Date.now() - _cache.startTime > timeout) {
          _cache.timeout = true
          clearInterval(loopId)
          while (_cache.queue.length) {
            const reqId = _cache.queue.shift().id
            _requests[reqId]?.reject('connection timeout')
            delete _requests[reqId]
          }
          return
        }
      }
      sendMsgTo(serverWindow, { connect: 1, __msgType })
    }, 500)

    /**
     * 发起请求函数
     * @param method 请求方式
     * @param key
     * @param value
     */
    function _requestFn(method, key, value) {
      return new Promise((resolve, reject) => {
        const req = {
          id: uuid(),
          method,
          key,
          value,
          __msgType
        }

        // 请求唯一标识 id 和回调函数的映射
        _requests[req.id] = { resolve, reject }

        if (_cache.connected) {
          // 连接建立完成时直接发请求
          sendMsgTo(serverWindow, req)
        } else if (_cache.timeout) {
          // 连接超时拒绝请求
          reject('connection timeout')
        } else {
          // 连接未建立则把请求放入队列
          _cache.queue.push(req)
        }
      })
    }

    return {
      /**
       * 获取存储数据
       * @param {Iterable | Object | string} key
       */
      getItem(key) {
        return _requestFn('get', key)
      },
      /**
       * 更新存储数据
       * @param {Object | string} key
       * @param {Object | string} [value = undefined]
       */
      setItem(key, value = void 0) {
        return _requestFn('set', key, value)
      },
      /**
       * 删除数据
       * @param {Iterable | Object | string} key
       */
      delItem(key) {
        return _requestFn('delete', key)
      },
      /**
       * 清除数据
       */
      clear() {
        return _requestFn('clear')
      }
    }
  }

  function startStorageServer() {
    const functionMap = {
      /**
       * 设置数据
       * @param {Object | string} key
       * @param {?Object | ?string} value
       */
      setStore(key, value = void 0) {
        if (!key) return
        if (typeof key === 'string') {
          return localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value)
        }
        Object.keys(key).forEach((dataKey) => {
          let dataValue = typeof key[dataKey] === 'object' ? JSON.stringify(key[dataKey]) : key[dataKey]
          localStorage.setItem(dataKey, dataValue)
        })
      },

      /**
       * 获取数据
       * @param {Iterable | Object | string} key
       */
      getStore(key) {
        if (!key) return
        if (typeof key === 'string') return localStorage.getItem(key)
        let dataRes = {}
        const keys = key[Symbol.iterator] ? key : Object.keys(key)
        for (const dataKey of keys) {
          dataRes[dataKey] = localStorage.getItem(dataKey) || null
        }
        return dataRes
      },

      /**
       * 删除数据
       * @param {Iterable | Object | string} key
       */
      deleteStore(key) {
        if (!key) return
        if (typeof key === 'string') return localStorage.removeItem(key)
        const keys = key[Symbol.iterator] ? key : Object.keys(key)
        for (const dataKey of keys) {
          localStorage.removeItem(dataKey)
        }
      },

      /**
       * 清空
       */
      clearStore() {
        localStorage.clear()
      }
    }
    const clients = new Set()

    // 监听 Client 消息
    onReceive((e) => {
      if (e?.data?.__msgType !== __msgType) return
      if (e.data.connect) {
        clients.add(e.source)
        // 通知 Client, 连接建立完成
        sendMsgTo(e.source, { connected: true, __msgType })
        return
      }
      const { method, key, value, id = 'default' } = e.data

      // 获取方法
      const func = functionMap[`${method}Store`]

      // 取出本地的数据
      const response = {
        data: func?.(key, value)
      }
      if (!func) response.errorMsg = 'Request method error!'

      // 发送给 Client
      const resultMsg = { id, request: e.data, response, __msgType }
      clients.forEach((c) => sendMsgTo(c, resultMsg))
    })
  }

  if (!window.paso || !(window.paso instanceof Object)) window.paso = {}
  window.paso.crossOriginStorage = {
    startStorageServer,
    startStorageClient,
    createStorageClient
  }
})()
