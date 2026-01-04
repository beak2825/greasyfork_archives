// ==UserScript==
// @name        weidian
// @namespace   WeidianOrders
// @resource    toastr https://cdn.staticfile.org/toastr.js/2.1.4/toastr.min.css
// @require     https://cdn.staticfile.org/jquery/3.4.0/jquery.min.js
// @require     https://cdn.staticfile.org/toastr.js/2.1.4/toastr.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM_download
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @match       *://d.weidian.com/*
// @version     1.0.7
// @author      lluvio
// @run-at      document-end
// @license MIT
// @description 2020/12/30 下午6:17:20
// @downloadURL https://update.greasyfork.org/scripts/444851/weidian.user.js
// @updateURL https://update.greasyfork.org/scripts/444851/weidian.meta.js
// ==/UserScript==
/* eslint-disable camelcase */
/* eslint-disable camelcase */
(function () {
  'use strict'

  console.log('load in scripts')

  /**
   * 拦截并修改ajax请求
   */
  // window.beforeXMLHttpRequestOpen = function (xhr, options) {
  // console.log('before open', xhr);
  // 修改url
  // options.url = options.url.replace('wd=123', 'wd=456');
  // 修改method
  // options.method = 'POST';
  // };
  /**
   * 拦截并修改ajax请求
   */
  // window.beforeXMLHttpRequestSend = function (xhr, body) {
  // console.log('before send', xhr);
  // 修改请求头
  // xhr.setRequestHeader('key1', 'value1');
  // };

  /**
   * 重写open方法
   * https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/open
   */
  XMLHttpRequest.prototype.myOpen = XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
    // 用对象便于修改参数
    const options = {
      method,
      url,
      async,
      user,
      password
    }
    if (typeof window.beforeXMLHttpRequestOpen === 'function') {
      window.beforeXMLHttpRequestOpen(this, options)
    }
    this.myOpen(options.method, options.url, options.async)
  }

  /**
   * 重写send方法
   * https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/send
   */
  XMLHttpRequest.prototype.mySend = XMLHttpRequest.prototype.send
  XMLHttpRequest.prototype.send = function (body) {
    const originReady = this.onreadystatechange
    if (typeof window.beforeXMLHttpRequestSend === 'function') {
      window.beforeXMLHttpRequestSend(this, body)
    }
    this.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        injectMain(this.responseURL, this.response)
      }
      // extend parent onreadystatechange
      if (originReady) {
        originReady()
      }
    }
    this.mySend(body)
  }

  function request (url, options) {
    const { type, callback } = options
    $.ajax({
      url,
      type: type || 'get',
      crossDomain: true, // 设置跨域为true
      xhrFields: {
        withCredentials: true // 默认情况下，标准的跨域请求是不会发送cookie的
      },
      success (data) {
        if (callback) {
          callback(data)
        }
      }
    })
  }

  function timer (num) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true)
      }, num * 1000)
    })
  }

  /**
   * Main
   */

  console.log('plugin page once start')

  const _WeidianURL = {
    orderList: 'https://thor.weidian.com/tradeview/seller.getOrderListForPC/1.0',
    refundList: 'https://thor.weidian.com/refundplatform/seller.refundSearchList/1.0',
    refundUrl: (refundNo) => `https://thor.weidian.com/refundplatform/seller.getRefundDetailForPC/1.0?param=%7B%22refundNo%22%3A%22${refundNo}%22%2C%22roleType%22%3A2%7D&wdtoken=e3a99fb2&_=1652262995906`,
    expressInfo: (orderId) => `https://thor.weidian.com/tradeview/seller.orderLogisticsForPC/1.0?param=%7B%22channel%22%3A%22pc%22%2C%22orderId%22%3A%22${orderId}%22%7D&wdtoken=e3a99fb2&_=1653455311796`,
    refundExpressInfo: (expressId, expressNo) => `https://thor.weidian.com/vexpress/kuaidi.getExpressStepInfo/1.1?param=%7B%22expressId%22%3A${expressId}%2C%22expressNo%22%3A%22${expressNo}%22%7D&wdtoken=ecd008ac&_=1666157481911`,
    markOrder: (orderId, content) => `https://thor.weidian.com/tradeview/seller.updateNote/1.0?param=%7B%22from%22%3A%22pc%22%2C%22orderId%22%3A%22${orderId}%22%2C%22note%22%3A%22${content}%22%7D&wdtoken=6a894de2&_=1669080826928`
  }

  function initToastr () {
    GM_addStyle(GM_getResourceText('toastr'))
    toastr.options.timeOut = 800
    toastr.options.positionClass = 'toast-top-center'
  }

  document.head.insertAdjacentHTML('beforeend', '<style> #toast-container .toast{left:0}</style>')
  initToastr()

  function checkRefund (order, index) {
    const items = []
    for (const [index, item] of order.itemList.entries()) {
      if (item.refundStatusStr === '待商家处理退货') {
        items.push({ index, no: item.refundNo })
      }
    }

    if (items.length) {
      return { index, order, items }
    }
  }

  // 退款管理页面中新增
  function appendRefundForPage (refundOrders, ordersDom) {
    console.log('进入退款列表页面')
    console.log(refundOrders, ordersDom)
    for (const [index, order] of refundOrders.entries()) {
      console.log(index, 'here')
      console.log(ordersDom)
      const parent = ordersDom[index].querySelectorAll('.refund-type')
      console.log('refund type', parent, index)
      const refundUlr = _WeidianURL.refundUrl(order.refundNo)

      // 隐藏退款列表备注，防止和订单管理里的评论冲突
      // const commentDom = ordersDom[index].querySelectorAll('.color-section')
      // commentDom[0].style.display = 'none'

      request(refundUlr, {
        callback: (data) => {
          const result = data.result
          console.log('refund_no result', result)
          // const refundInfo = result.refundInfo
          const refundProgress = result.refundProgress
          const { expressNo, expressType } = refundProgress.refundBasicInfo
          if (expressNo && expressType) {
            request(_WeidianURL.refundExpressInfo(expressType, expressNo), {
              callback: (data) => {
                console.log(data)
                const refundExpressList = data.result.data_json
                appendText(parent[0], `${refundExpressList[0].context}`)
              }
            })
          }

          appendButton(parent[0], [
               `订单编号: ${order.orderId}`,
               `退货信息: ${expressNo || '暂无'}`
          ])
        }
      })
    }
  }

  // 生成退款按钮
  function appendRefundButton (orderAPIList, ordersDom) {
    // 从订单列表筛选存在退款的订单
    const refundOrders = orderAPIList.map(checkRefund).filter(v => v) // remove undefined
    console.log('退货列表', refundOrders)
    for (const order of refundOrders) {
      const root = ordersDom[order.index].querySelectorAll('.item-status')
      const markDom = ordersDom[order.index].querySelectorAll('.note-detail')[0]

      for (const refund of order.items) {
        const refundUlr = _WeidianURL.refundUrl(refund.no)
        request(refundUlr, {
          callback: (data) => {
            const result = data.result
            // const refundInfo = result.refundInfo
            const refundProgress = result.refundProgress
            const { expressNo, expressType } = refundProgress.refundBasicInfo
            if (expressNo && expressType) {
              request(_WeidianURL.refundExpressInfo(expressType, expressNo), {
                callback: (data) => {
                  const refundExpressList = data.result.data_json
                  const { express_company, express_no } = data.result
                  console.log('refund 物流明细', data)
                  const rootDom = root[refund.index]
                  appendText(rootDom, `退件信息: ${refundExpressList[0].context}`)
                  appendButton(rootDom, [
                    `退货信息: ${express_no || '暂无'}`,
                    express_company
                  ])
                  appendActionButton(rootDom, {
                    text: '添加到备注',
                    callbackFn: () => {
                      const originOrder = order.order
                      const orderId = originOrder.orderId
                      const originNote = originOrder.receiver.sellerNote
                      markOrder(orderId, originNote + ' 退货物流: ' + express_no + ' ' + express_company, markDom)
                      // alert('添加成功')
                    }
                  })
                }
              })
            }
            // console.log('refund 明细: ', data)
          }
        })
      }
    }
  }

  function checkIfExpress (order, index) {
    const items = []
    for (const [index, item] of order.itemList.entries()) {
      if (item.deliverStatusDesc === '已发货') {
        items.push({ index })
      }
    }

    if (items.length) {
      return { index, order, items }
    }
  }

  async function appendExpressInfo (orderAPIList, ordersDom) {
    // 从订单列表筛选存在退款的订单
    const filters = orderAPIList.map(checkIfExpress).filter(v => v) // remove undefined
    console.log('已发货', filters)
    for (const filter of filters) {
      const root = ordersDom[filter.index].querySelectorAll('.delivery-mode-detail')
      for (const item of filter.items) {
        await timer(0.3)
        const refundUlr = _WeidianURL.expressInfo(filter.order.orderId)
        request(refundUlr, {
          callback: (data) => {
            const result = data.result
            const expressInfo = result.deliverInfoList[0]
            if (expressInfo.dataList) {
              const lastExpress = expressInfo.dataList[0].context
              const lastExpressDate = expressInfo.dataList[0].time
              const status = expressInfo.expressStatus
              const color = status === '未签收' ? 'red' : 'green'
              appendText(root[item.index], `${status}
              ${lastExpress} ${lastExpressDate}
              `, color)
            }
          }
        })
      }
    }
  }

  let preventMultRender = false
  let preventRefundTwice = false
  /**
   *
   * @param {string} url
   */
  function injectMain (url, res) {
    // 退款列表
    if (url.startsWith(_WeidianURL.refundList)) {
      if (preventRefundTwice) {
        return
      }
      const dataList = res.result.list
      // 给 Vue 300ms 的 渲染时间，很够了吧
      const mainTimer = setTimeout(async () => {
        const ordersDom = document.querySelectorAll('.order')
        appendRefundForPage(dataList, ordersDom)
        clearTimeout(mainTimer)
      }, 300)
      preventRefundTwice = true
      const preventTimer = setTimeout(() => {
        preventRefundTwice = false
        clearTimeout(preventTimer)
      }, 200)
    }

    // 订单列表
    if (url.startsWith(_WeidianURL.orderList)) {
      if (preventMultRender) {
        return
      }
      const orderAPIList = res.result.orderList

      // 给 Vue 300ms 的 渲染时间，很够了吧
      const mainTimer = setTimeout(async () => {
        const ordersDom = document.querySelectorAll('.order-card')
        appendRefundButton(orderAPIList, ordersDom)
        await appendExpressInfo(orderAPIList, ordersDom)
        clearTimeout(mainTimer)
      }, 300)

      // 微店 tabs 切换，同一个接口会请求两次，这里防止内部逻辑执行两次
      preventMultRender = true
      const preventTimer = setTimeout(() => {
        preventMultRender = false
        clearTimeout(preventTimer)
      }, 100)
    }
  }

  function generaLineText (array) {
    let text = ''
    for (const line of array) {
      text = text + line + '\n'
    }
    return text
  }

  function markOrder (orderId, content, targetDom) {
    request(_WeidianURL.markOrder(orderId, content), {
      callback: (data) => {
        if (data.status.code === 0) {
          toastr.success('备注成功')
          targetDom.innerText = content
        } else {
          toastr.error('备注失败')
        }
      }
    })
  }

  function appendActionButton (rootDom, { callbackFn, text }) {
    if (rootDom) {
      if (!rootDom.querySelector('.action-button')) {
        const button = document.createElement('button')
        button.classList.add('.action-button')
        button.innerHTML = text
        button.style.cssText = `
        position: absolute;
        z-index:9999;
        top: 0;
        right: 0;
        padding: 4px 6px;
        font-size: 12px;
        `
        button.onclick = callbackFn
        rootDom.append(button)
      }
    }
  }

  function appendButton (rootDom, infoArray = []) {
    if (rootDom) {
      if (!rootDom.querySelector('button')) {
        const button = document.createElement('button')
        button.dataset.add = true
        const copyBody = generaLineText(infoArray)
        button.innerHTML = '复制信息'
        button.style.cssText = `
          position: relative;
          z-index:9999;
          top: 0;
          right: 0;
          padding: 4px 6px;
          font-size: 12px;
          `
        button.onclick = () => {
          navigator.clipboard.writeText(copyBody).then(() => {
            toastr.success('复制成功')
          })
        }

        rootDom.style.position = 'relative'
        rootDom.append(button)
      }
    }
  }

  function appendText (rootDom, template, color = 'red') {
    if (rootDom) {
      const text = document.createElement('div')
      text.innerText = template
      text.style.cssText = `
        color: ${color}
      `
      rootDom.style.position = 'relative'
      rootDom.append(text)
    }
  }
})()
