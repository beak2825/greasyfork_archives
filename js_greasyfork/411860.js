// ==UserScript==
// @name         茉莉助手
// @name:en      moli-assistant
// @name:zh      茉莉助手
// @name:zh-CN   茉莉助手
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  直播眼 excel 导出
// @description:zh  直播眼 excel 导出
// @description:zh-CN  直播眼 excel 导出
// @author       vdorchan
// @match        http://new.zhiboyan.net/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/411860/%E8%8C%89%E8%8E%89%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/411860/%E8%8C%89%E8%8E%89%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  // 直播眼页面 api
  const zbyAPI = {
    ORIGIN: 'https://do.v-data.cn',
    // 找主播页面接口
    ANCHOR_LIST: '/caihui/findAnchor/matchAnchor',
    // 商品分析商品列表接口
    LIVE_ITEM_LIST: '/caihui/findAnchor/anchorLiveItemList',
    // 用户信息接口
    AUTHORIZE_RIZE: '/caihui/memberAuthorize/authorizeCoin',
  }

  const zbyPageHash = {
    // 找主播页面链接 hash
    ANCHOR_PAGE: '#/anchorSearch',
    // 主播详情页面链接 hash
    ANCHOR_DETAIL_PAGE: '#/anchorDetail',
  }

  const CRX_SERVER_ORIGIN = 'https://mas.baowenonline.com'

  const ANCHORS_EXCEL_API = `${CRX_SERVER_ORIGIN}/anchorsExcel`
  const LIVE_ITEMS_EXCEL_API = `${CRX_SERVER_ORIGIN}/liveItemsExcel`

  const exportTypes = {
    ANCHOR_LIST: 'ANCHOR_LIST',
    LIVE_ITEM_LIST: 'LIVE_ITEM_LIST',
    ANCHORS_AND_LIVE_ITEMS: 'ANCHORS_AND_LIVE_ITEMS',
  }

  const utils = {
    getPageHash() {
      return location.hash.replace(/\?\S+/, '')
    },

    listenLocationChange(cb) {
      console.log('listenLocationChange')
      /* These are the modifications: */
      history.pushState = ((f) =>
        function pushState() {
          var ret = f.apply(this, arguments)
          window.dispatchEvent(new Event('pushstate'))
          window.dispatchEvent(new Event('locationchange'))
          return ret
        })(history.pushState)

      history.replaceState = ((f) =>
        function replaceState() {
          var ret = f.apply(this, arguments)
          window.dispatchEvent(new Event('replacestate'))
          window.dispatchEvent(new Event('locationchange'))
          return ret
        })(history.replaceState)

      window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'))
      })

      window.addEventListener('locationchange', function () {
        cb()
      })
    },

    async post(url, data, options = {}) {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      })

      if (/^2\d+/.test(res.status)) {
        return options.blob
          ? {
              blob: await res.blob(),
              filename: decodeURIComponent(
                res.headers.get('content-disposition').split('filename=')[1]
              ),
            }
          : res.json()
      } else {
        throw new Error(`response error: ${res.status}`)
      }
    },

    async downloadFile(url, data) {
      const { blob, filename } = await this.post(url, data, { blob: true })

      const file = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = file
      link.download = filename
      link.click()
    },

    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
  }

  const exportFun = {
    moliAssistant: null,

    currentUser: null,

    exportAnchorList() {
      const { moliAssistant } = this
      const currentPage = document.querySelector('.el-pager .number.active')

      const { storeData } = moliAssistant

      moliAssistant.startLoad()

      const setResponseCallback = () => {
        moliAssistant.onResponseSuccess = ({ requestParams, res }) => {
          console.log('onResponseSuccess')
          if (requestParams.param.page.pageNum === 1) {
            storeData.anchorList = []
          }

          storeData.anchorList = [
            ...storeData.anchorList,
            ...res.preload.results,
          ]

          setTimeout(() => {
            moliAssistant.nextPage()
          }, 0)
        }

        moliAssistant.onResponseFail = async () => {
          console.log('onResponseFail')
          await this.exportExcel(storeData.anchorList)
          storeData.anchorList = []
          moliAssistant.onResponseSuccess = null
          moliAssistant.onResponseFail = null
          moliAssistant.finishLoad()
        }

        // start load from page 1
        document.querySelector('.el-pager .number').click()
      }

      if (Number(currentPage.textContent) === 1) {
        setResponseCallback()

        document.querySelector('.tag-container .hover').click()
      } else {
        setResponseCallback()
      }
    },

    /**
     *
     * @param {page} usePaging 是否分页加载
     */
    async exportAnchorListByApi(usePaging = false) {
      moliAssistant.startLoad()

      if (!this.moliAssistantrequestParams) {
        await utils.sleep(1000)
      }

      const { requestParams, responseBody, currentUser } = this.moliAssistant

      console.log({ responseBody })

      if (!requestParams) {
        return alert('请等待列表加载完成或刷新页面后尝试！')
      }

      const list = []

      if (usePaging) {
        let stop = false
        let pageNum = 1

        while (!stop) {
          try {
            requestParams.param.page.pageNum = pageNum++
            const res = await utils.post(
              zbyAPI.ORIGIN + zbyAPI.ANCHOR_LIST,
              requestParams
            )
            list.push(...res.preload.results)
          } catch (error) {
            stop = true
          }
        }
      } else {
        requestParams.param.page.pageNum = 1
        requestParams.param.page.pageSize = responseBody.preload.totalNum
        const res = await utils.post(
          zbyAPI.ORIGIN + zbyAPI.ANCHOR_LIST,
          requestParams
        )
        list.push(...res.preload.results)
      }

      await this.exportExcel(list)

      return list
    },

    async exportLiveItemListByApi() {
      moliAssistant.startLoad()

      if (!this.moliAssistantrequestParams) {
        await utils.sleep(1000)
      }

      const { requestParams } = this.moliAssistant

      if (!requestParams) {
        return alert('请等待列表加载完成或刷新页面后尝试！')
      }

      requestParams.param.page.pageSize = 99999
      const res = await utils.post(
        zbyAPI.ORIGIN + zbyAPI.LIVE_ITEM_LIST,
        requestParams
      )

      const anchorName = document.querySelector('.anchor-title').textContent

      await this.exportExcel(
        res.preload.results.map((r) => ({ ...r, anchorName }))
      )
    },

    async exportExcel(data) {
      console.log('exportExcel', data)
      const hash = utils.getPageHash()

      try {
        switch (hash) {
          case zbyPageHash.ANCHOR_PAGE:
            await utils.downloadFile(ANCHORS_EXCEL_API, data)
            return
          case zbyPageHash.ANCHOR_DETAIL_PAGE:
            await utils.downloadFile(LIVE_ITEMS_EXCEL_API, data)
            return
        }
      } catch (error) {
        alert(`导出失败：${error.message}`)
        console.log({ error })
      }
    },

    exportAnchorsAndLiveItems(anchorList) {
      console.log({ anchorList })
      const stop = false
      const anchorIds = anchorList.map((a) => a.anchorId)
      while (!stop) {
        location.href = `http://new.zhiboyan.net/#/anchorDetail?anchorId=${anchorIds.pop()}`
      }
    },

    init(moliAssistant) {
      this.moliAssistant = moliAssistant
    },

    async run(type) {
      const { currentUser } = this.moliAssistant
      switch (type) {
        case exportTypes.ANCHOR_LIST:
          await (currentUser.authorizeName === 'VIP3'
            ? this.exportAnchorListByApi()
            : this.exportAnchorList())
          break
        case exportTypes.LIVE_ITEM_LIST:
          await this.exportLiveItemListByApi()
          break
        case exportTypes.ANCHORS_AND_LIVE_ITEMS:
          const anchorList = await this.exportAnchorListByApi()
          this.exportAnchorsAndLiveItems(anchorList)
          break
      }
      moliAssistant.finishLoad()
    },
  }

  const moliAssistant = {
    storeData: {
      anchorList: [],
    },

    isOngoing: false,

    // button to export
    btnExport: null,

    /**
     * @type {Object} cache the last request parameters
     */
    requestParams: null,
    responseBody: null,

    setAjaxProxy() {
      ah.proxy({
        //请求发起前进入
        onRequest: (config, handler) => {
          console.log('onRequest', config.url)
          handler.next(config)
        },
        //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
        onError: (err, handler) => {
          console.log('error', err.type)
          handler.next(err)
        },
        //请求成功后进入
        onResponse: async (response, handler) => {
          console.log(response)
          const { config } = response
          const { pathname } = new URL(config.url)
          const res = JSON.parse(response.response)

          if ([zbyAPI.ANCHOR_LIST, zbyAPI.LIVE_ITEM_LIST].includes(pathname)) {
            this.responseBody = res
            this.requestParams = JSON.parse(config.body)
            this.onApiResponse({
              requestParams: { ...this.requestParams },
              res,
            })
          }

          if (pathname === zbyAPI.AUTHORIZE_RIZE) {
            this.currentUser = res.preload.result
          }

          handler.next(response)
        },
      })
    },

    async onApiResponse({ requestParams, res }) {
      // 成功返回数据
      if (res.code === 0 && res.preload.code === '0') {
        setTimeout(() => {
          this.onResponseSuccess &&
            this.onResponseSuccess({ requestParams, res })
        }, 0)
      } else {
        console.log('finish all pages')
        this.onResponseFail && this.onResponseFail()
      }

      console.log('onResponse', { res })
    },

    createButton(text, onclick) {
      const btn = document.createElement('button')
      btn.className = 'el-button el-button--primary el-button--small'
      btn.onclick = onclick
      btn.style.background = 'linear-gradient(90deg,#3b26ad,#a75dcf)'
      btn.style.border = 'none'
      btn.style.padding = '12px 15px'
      btn.innerHTML = `<i class="el-icon-document"></i><span>${text}</span>`

      return btn
    },

    insertExportButton() {
      const hash = utils.getPageHash()
      if (
        ![zbyPageHash.ANCHOR_PAGE, zbyPageHash.ANCHOR_DETAIL_PAGE].includes(
          hash
        ) ||
        this.btnExport
      ) {
        return
      }

      const _button = document.querySelector('.export-report')
      if (!_button) {
        setTimeout(() => this.insertExportButton(), 100)
        return
      }

      const btnWrapper = document.querySelector('.export-report').parentNode

      this.btnExport = this.createButton(
        '导出 Excel by moli',
        this.onExport.bind(
          this,
          zbyPageHash.ANCHOR_PAGE === hash
            ? exportTypes.ANCHOR_LIST
            : exportTypes.LIVE_ITEM_LIST
        )
      )

      btnWrapper.append(this.btnExport)

      // if (zbyPageHash.ANCHOR_PAGE === hash) {
      //   this.btnExportAnchorsAndLiveItems = this.createButton(
      //     '导出达人商品分析',
      //     this.onExport.bind(this, exportTypes.ANCHORS_AND_LIVE_ITEMS)
      //   )
      //   btnWrapper.appendChild(this.btnExportAnchorsAndLiveItems)
      // }
    },

    nextPage() {
      const btnNext = document.querySelector('.el-pagination .btn-next')
      if (btnNext) {
        btnNext.click()
      } else {
        setTimeout(() => {
          this.nextPage()
        }, 100)
      }
    },

    startLoad() {
      console.log('startLoad')
      this.isOngoing = true
      if (!this.loadingDiv) {
        this.loadingDiv = document.createElement('div')
        document.body.appendChild(this.loadingDiv)
        this.loadingDiv.innerHTML = `<div class="el-loading-mask is-fullscreen" style="background-color: rgba(0, 0, 0, 0.4); z-index: 2001;"><div class="el-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><p class="el-loading-text">loading...</p></div></div>`
        document.body.classList.add(
          'el-loading-parent--relative',
          'el-loading-parent--hidden'
        )
      }

      this.loadingDiv.style.display = 'block'
    },

    finishLoad() {
      console.log('finishLoad')
      this.isOngoing = false
      if (this.loadingDiv) {
        this.loadingDiv.style.display = 'none'
        document.body.classList.remove(
          'el-loading-parent--relative',
          'el-loading-parent--hidden'
        )
      }
    },

    async onExport(type) {
      console.log('onExport', type)

      exportFun.run(type)
    },

    async onExportAnchorsAndLiveItems() {
      location.href =
        'http://new.zhiboyan.net/#/anchorDetail?anchorId=2206456752131'
    },

    onLocationChange() {
      console.log('onLocationChange')
      if (this.btnExport) {
        this.btnExport.parentNode.removeChild(this.btnExport)
        this.btnExport = null
      }

      setTimeout(() => {
        this.insertExportButton()
      }, 0)
    },

    init() {
      console.log('init moli-assistant', this)
      initAjaxHook()
      this.setAjaxProxy()
      this.insertExportButton()
      utils.listenLocationChange(this.onLocationChange.bind(this))

      exportFun.init(this)
    },
  }

  moliAssistant.init()

  function initAjaxHook() {
    !(function (t, e) {
      for (var n in e) t[n] = e[n]
    })(
      window,
      (function (t) {
        function e(r) {
          if (n[r]) return n[r].exports
          var o = (n[r] = { i: r, l: !1, exports: {} })
          return t[r].call(o.exports, o, o.exports, e), (o.l = !0), o.exports
        }
        var n = {}
        return (
          (e.m = t),
          (e.c = n),
          (e.i = function (t) {
            return t
          }),
          (e.d = function (t, n, r) {
            e.o(t, n) ||
              Object.defineProperty(t, n, {
                configurable: !1,
                enumerable: !0,
                get: r,
              })
          }),
          (e.n = function (t) {
            var n =
              t && t.__esModule
                ? function () {
                    return t.default
                  }
                : function () {
                    return t
                  }
            return e.d(n, 'a', n), n
          }),
          (e.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
          }),
          (e.p = ''),
          e((e.s = 3))
        )
      })([
        function (t, e, n) {
          'use strict'
          function r(t, e) {
            var n = {}
            for (var r in t) n[r] = t[r]
            return (n.target = n.currentTarget = e), n
          }
          function o(t) {
            function e(e) {
              return function () {
                var n = this.hasOwnProperty(e + '_')
                    ? this[e + '_']
                    : this.xhr[e],
                  r = (t[e] || {}).getter
                return (r && r(n, this)) || n
              }
            }
            function n(e) {
              return function (n) {
                var o = this.xhr,
                  i = this,
                  u = t[e]
                if ('on' === e.substring(0, 2))
                  (i[e + '_'] = n),
                    (o[e] = function (u) {
                      ;(u = r(u, i)),
                        (t[e] && t[e].call(i, o, u)) || n.call(i, u)
                    })
                else {
                  var s = (u || {}).setter
                  ;(n = (s && s(n, i)) || n), (this[e + '_'] = n)
                  try {
                    o[e] = n
                  } catch (t) {}
                }
              }
            }
            function o(e) {
              return function () {
                var n = [].slice.call(arguments)
                if (t[e]) {
                  var r = t[e].call(this, n, this.xhr)
                  if (r) return r
                }
                return this.xhr[e].apply(this.xhr, n)
              }
            }
            return (
              (window[s] = window[s] || XMLHttpRequest),
              (XMLHttpRequest = function () {
                var t = new window[s]()
                for (var r in t) {
                  var i = ''
                  try {
                    i = u(t[r])
                  } catch (t) {}
                  'function' === i
                    ? (this[r] = o(r))
                    : Object.defineProperty(this, r, {
                        get: e(r),
                        set: n(r),
                        enumerable: !0,
                      })
                }
                var a = this
                ;(t.getProxy = function () {
                  return a
                }),
                  (this.xhr = t)
              }),
              window[s]
            )
          }
          function i() {
            window[s] && (XMLHttpRequest = window[s]), (window[s] = void 0)
          }
          Object.defineProperty(e, '__esModule', { value: !0 })
          var u =
            'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
              ? function (t) {
                  return typeof t
                }
              : function (t) {
                  return t &&
                    'function' == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? 'symbol'
                    : typeof t
                }
          ;(e.configEvent = r), (e.hook = o), (e.unHook = i)
          var s = '_rxhr'
        },
        function (t, e, n) {
          'use strict'
          function r(t) {
            if (h) throw 'Proxy already exists'
            return (h = new f(t))
          }
          function o() {
            ;(h = null), (0, d.unHook)()
          }
          function i(t) {
            return t.replace(/^\s+|\s+$/g, '')
          }
          function u(t) {
            return t.watcher || (t.watcher = document.createElement('a'))
          }
          function s(t, e) {
            var n = t.getProxy(),
              r = 'on' + e + '_',
              o = (0, d.configEvent)({ type: e }, n)
            n[r] && n[r](o)
            var i
            'function' == typeof Event
              ? (i = new Event(e, { bubbles: !1 }))
              : ((i = document.createEvent('Event')), i.initEvent(e, !1, !0)),
              u(t).dispatchEvent(i)
          }
          function a(t) {
            ;(this.xhr = t), (this.xhrProxy = t.getProxy())
          }
          function c(t) {
            function e(t) {
              a.call(this, t)
            }
            return (e[b] = Object.create(a[b])), (e[b].next = t), e
          }
          function f(t) {
            function e(t, e) {
              var n = new P(t)
              if (!f) return n.resolve()
              var r = {
                response: e.response,
                status: e.status,
                statusText: e.statusText,
                config: t.config,
                headers:
                  t.resHeader ||
                  t
                    .getAllResponseHeaders()
                    .split('\r\n')
                    .reduce(function (t, e) {
                      if ('' === e) return t
                      var n = e.split(':')
                      return (t[n.shift()] = i(n.join(':'))), t
                    }, {}),
              }
              f(r, n)
            }
            function n(t, e, n) {
              var r = new H(t),
                o = { config: t.config, error: n }
              h ? h(o, r) : r.next(o)
            }
            function r() {
              return !0
            }
            function o(t, e) {
              return n(t, this, e), !0
            }
            function a(t, n) {
              return (
                4 === t.readyState && 0 !== t.status
                  ? e(t, n)
                  : 4 !== t.readyState && s(t, w),
                !0
              )
            }
            var c = t.onRequest,
              f = t.onResponse,
              h = t.onError
            return (0, d.hook)({
              onload: r,
              onloadend: r,
              onerror: o,
              ontimeout: o,
              onabort: o,
              onreadystatechange: function (t) {
                return a(t, this)
              },
              open: function (t, e) {
                var r = this,
                  o = (e.config = { headers: {} })
                ;(o.method = t[0]),
                  (o.url = t[1]),
                  (o.async = t[2]),
                  (o.user = t[3]),
                  (o.password = t[4]),
                  (o.xhr = e)
                var i = 'on' + w
                e[i] ||
                  (e[i] = function () {
                    return a(e, r)
                  })
                var u = function (t) {
                  n(e, r, (0, d.configEvent)(t, r))
                }
                if (
                  ([x, y, g].forEach(function (t) {
                    var n = 'on' + t
                    e[n] || (e[n] = u)
                  }),
                  c)
                )
                  return !0
              },
              send: function (t, e) {
                var n = e.config
                if (
                  ((n.withCredentials = e.withCredentials), (n.body = t[0]), c)
                ) {
                  var r = function () {
                    c(n, new m(e))
                  }
                  return !1 === n.async ? r() : setTimeout(r), !0
                }
              },
              setRequestHeader: function (t, e) {
                return (e.config.headers[t[0].toLowerCase()] = t[1]), !0
              },
              addEventListener: function (t, e) {
                var n = this
                if (-1 !== l.indexOf(t[0])) {
                  var r = t[1]
                  return (
                    u(e).addEventListener(t[0], function (e) {
                      var o = (0, d.configEvent)(e, n)
                      ;(o.type = t[0]), (o.isTrusted = !0), r.call(n, o)
                    }),
                    !0
                  )
                }
              },
              getAllResponseHeaders: function (t, e) {
                var n = e.resHeader
                if (n) {
                  var r = ''
                  for (var o in n) r += o + ': ' + n[o] + '\r\n'
                  return r
                }
              },
              getResponseHeader: function (t, e) {
                var n = e.resHeader
                if (n) return n[(t[0] || '').toLowerCase()]
              },
            })
          }
          Object.defineProperty(e, '__esModule', { value: !0 }),
            (e.proxy = r),
            (e.unProxy = o)
          var h,
            d = n(0),
            l = [
              'load',
              'loadend',
              'timeout',
              'error',
              'readystatechange',
              'abort',
            ],
            v = l[0],
            p = l[1],
            y = l[2],
            x = l[3],
            w = l[4],
            g = l[5],
            b = 'prototype'
          a[b] = Object.create({
            resolve: function (t) {
              var e = this.xhrProxy,
                n = this.xhr
              ;(e.readyState = 4),
                (n.resHeader = t.headers),
                (e.response = e.responseText = t.response),
                (e.statusText = t.statusText),
                (e.status = t.status),
                s(n, w),
                s(n, v),
                s(n, p)
            },
            reject: function (t) {
              ;(this.xhrProxy.status = 0), s(this.xhr, t.type), s(this.xhr, p)
            },
          })
          var m = c(function (t) {
              var e = this.xhr
              ;(t = t || e.config),
                (e.withCredentials = t.withCredentials),
                e.open(t.method, t.url, !1 !== t.async, t.user, t.password)
              for (var n in t.headers) e.setRequestHeader(n, t.headers[n])
              e.send(t.body)
            }),
            P = c(function (t) {
              this.resolve(t)
            }),
            H = c(function (t) {
              this.reject(t)
            })
        },
        ,
        function (t, e, n) {
          'use strict'
          Object.defineProperty(e, '__esModule', { value: !0 }), (e.ah = void 0)
          var r = n(0),
            o = n(1)
          e.ah = {
            proxy: o.proxy,
            unProxy: o.unProxy,
            hook: r.hook,
            unHook: r.unHook,
          }
        },
      ])
    )
  }
})()
