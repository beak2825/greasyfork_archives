// ==UserScript==
// @name         中兴商旅轮询小助手
// @namespace    super_page_agent
// @version      0.6
// @description  添加各种轮询任务的处理
// @author       LVPlum
// @match        https://mobilerma.zte.com.cn/UILoader/Index_Internal.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zte.com.cn
// @include      https://mobilerma.zte.com.cn/
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @connect	     qyapi.weixin.qq.com
// @connect      https://mobilerma.zte.com.cn
// @connect      cdn.jsdelivr.net
// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM.getValue
// @grant             GM_setValue
// @grant             GM.setValue
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant             GM_registerMenuCommand
// @original-script   https://greasyfork.org/zh-CN/scripts/390952
// @run-at            document-idle
// @license           AGPL License
// @downloadURL https://update.greasyfork.org/scripts/453419/%E4%B8%AD%E5%85%B4%E5%95%86%E6%97%85%E8%BD%AE%E8%AF%A2%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/453419/%E4%B8%AD%E5%85%B4%E5%95%86%E6%97%85%E8%BD%AE%E8%AF%A2%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  var cssText = `
        @keyframes loadingCircle{
          to { transform:rotate(360deg) }
        }
        .anticon-spin {
          animation: loadingCircle 1s infinite linear;
          margin-left: 2px;
          display: none;
        }
        `
  var cssModule = {
    container: `color: #fff; position: absolute; top: 30px; right: 20px; padding: 20px; background: #00000099; border-radius: 4px; text-align: center;`,
    header: `margin-bottom: 20px; font-size: 14px; font-weight: bold;`,
    btn: `cursor: pointer; display: inline-block; padding: 4px; font-size: 14px; border-radius: 4px; color: white; background: #1890ff; width: 80px; text-align: center;border: none;`,
  }
  var htmlMould = `<div id='tampermonkey_container' style="${cssModule.container}">
                       <div style="${cssModule.header}">轮询工具插件：目前报价每60s轮询一次，其他轮询为30min</div>
                       <button style="${cssModule.btn}" id="query_btn">轮询报价<svg viewBox="0 0 1024 1024" focusable="false" fill="currentColor" width="1em" height="1em" data-icon="loading" aria-hidden="true" class="anticon-spin"><path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path></svg></button>
                       <button style="${cssModule.btn}" id="payed_btn">已付款<svg viewBox="0 0 1024 1024" focusable="false" fill="currentColor" width="1em" height="1em" data-icon="loading" aria-hidden="true" class="anticon-spin"><path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path></svg></button>
                       <button style="${cssModule.btn}" id="refund_btn">轮询退票<svg viewBox="0 0 1024 1024" focusable="false" fill="currentColor" width="1em" height="1em" data-icon="loading" aria-hidden="true" class="anticon-spin"><path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path></svg></button>
                       <button style="${cssModule.btn}" id="change_btn">轮询改期<svg viewBox="0 0 1024 1024" focusable="false" fill="currentColor" width="1em" height="1em" data-icon="loading" aria-hidden="true" class="anticon-spin"><path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path></svg></button>
                       <button style="${cssModule.btn}" id="reset_btn">重置</button>
                    </div>`
  // 轮询间隔待报价轮询为 60s 其他轮询为30min
  var interval = {
    waiting: 60000,
    payed: 1800000,
    refund: 1800000,
    change: 1800000,
  }
  var intervalQuery // 轮询任务
  var times = 1 // 查询次数
  var preSet = new Set()
  var pageMode = 'waiting' // 默认为订单待报价的页面查询
  var pagesOrientationOpt = {
    waiting: [1, 3], // 票务处理=>订单报价
    payed: [1, 4], // 票务处理=>订单处理
    refund: [8, 10], // 机票结算=>退票处理
    change: [8, 11], // 机票结算=>改期处理
  }
  var pagesModeOps = {
    waiting: '待报价',
    payed: '已付款订单',
    refund: '退票处理',
    change: '改期处理',
  }

  init()

  function init() {
    $('html').prepend('<style>' + cssText + '</style>')
    $('html').append(htmlMould)

    // 轮询待报价列表
    $('#tampermonkey_container').on('click', '#query_btn', function () {
      pageMode = 'waiting'
      times = 1
      preSet.clear()
      toTargetPage('waiting')

      // 1s 定时延迟，保证跳转的页面已经加载完成
      setTimeout(() => {
        resetWaitingQueryForm() // 重置待报价列表表单
        clearInterval(intervalQuery)
        setIntervalQuery() // 开始轮询
      }, 1000)

      disabledBtn() // 点击触发后，调整按钮状态
    })

    $('#tampermonkey_container').on('click', '#payed_btn', function () {
      pageMode = 'payed'
      times = 1
      preSet.clear()
      toTargetPage()

      // 1s 定时延迟，保证跳转的页面已经加载完成
      setTimeout(() => {
        clearInterval(intervalQuery)
        setIntervalQuery() // 开始轮询
      }, 1000)

      disabledBtn() // 点击触发后，调整按钮状态
    })

    $('#tampermonkey_container').on('click', '#refund_btn', function () {
      pageMode = 'refund'
      times = 1
      preSet.clear()
      toTargetPage()

      // 1s 定时延迟，保证跳转的页面已经加载完成
      setTimeout(() => {
        clearInterval(intervalQuery)
        setIntervalQuery() // 开始轮询
      }, 1000)

      disabledBtn() // 点击触发后，调整按钮状态
    })

    $('#tampermonkey_container').on('click', '#change_btn', function () {
      pageMode = 'change'
      times = 1
      preSet.clear()
      toTargetPage()

      // 1s 定时延迟，保证跳转的页面已经加载完成
      setTimeout(() => {
        clearInterval(intervalQuery)
        setIntervalQuery() // 开始轮询
      }, 1000)

      disabledBtn() // 点击触发后，调整按钮状态
    })

    // 清除定时查询任务
    $('#tampermonkey_container').on('click', '#reset_btn', function () {
      cleanInterval()
      resetBtn()
    })
  }

  function resetBtn() {
    const btns = [
      $('#tampermonkey_container #query_btn'),
      $('#tampermonkey_container #payed_btn'),
      $('#tampermonkey_container #refund_btn'),
      $('#tampermonkey_container #change_btn'),
    ]
    btns.forEach((btn) => {
      btn.removeAttr('disabled')
      btn.css('opacity', 1)
      btn.find('svg')[0].style.display = 'none'
    })
  }

  function disabledBtn() {
    const index = ['waiting', 'payed', 'refund', 'change'].indexOf(pageMode)
    const btns = [
      $('#tampermonkey_container #query_btn'),
      $('#tampermonkey_container #payed_btn'),
      $('#tampermonkey_container #refund_btn'),
      $('#tampermonkey_container #change_btn'),
    ]
    btns.forEach((btn) => {
      btn.attr('disabled', 'disabled')
      btn.css('opacity', 0.7)
    })
    btns[index].find('svg')[0].style.display = 'inherit'
  }

  /** 跳转目标页面 */
  function toTargetPage() {
    const currentPageOpt = pagesOrientationOpt[pageMode]
    const leftAside = getLeftNavigationFrame()
    // 暂时注释，可以不展开一级菜单直接点击二级菜单
    // const firstBtn = leftAside
    //   .querySelectorAll('table')
    //   [currentPageOpt[0]].querySelectorAll('tr')[0]
    // firstBtn.click()
    const secondBtn = leftAside.querySelectorAll('table')[currentPageOpt[1]]
    secondBtn.click()
  }

  function cleanInterval() {
    clearInterval(intervalQuery)
  }

  function setTimeOutQuery() {
    setTimeout(() => {
      getTableData()
    }, 5000)
  }

  function getTableData() {
    switch (pageMode) {
      case 'waiting':
        getWaitingTableData()
        break
      case 'payed':
        getPayedTableData()
        break
      case 'refund':
        getRefundTableData()
        break
      case 'change':
        getChangeTableData()
        break
      default:
        getWaitingTableData()
    }
  }

  function setIntervalQuery() {
    // 如果是非轮询报价，则先请求一次，在轮询
    if (pageMode !== 'waiting') {
      // 每次点击都会重新打开并创建新的dom节点，所以不能用变量赋值，只能每次点击更新页面后，重新从根frame 查找到事件Dom
      const btnQuery = getRightQueryParamFrame().querySelector('#btnQuery')
      btnQuery.click()
      setTimeOutQuery()
    }
    intervalQuery = setInterval(() => {
      console.log(`第${times++}次`)
      // 每次点击都会重新打开并创建新的dom节点，所以不能用变量赋值，只能每次点击更新页面后，重新从根frame 查找到事件Dom
      const btnQuery = getRightQueryParamFrame().querySelector('#btnQuery')
      btnQuery.click()
      setTimeOutQuery()
    }, interval[pageMode])
  }

  /** 重置待报价订单查询条件 */
  function resetWaitingQueryForm() {
    var frameDocument = getRightQueryParamFrame()
    var txtRequCode = frameDocument.querySelector('#txtRequCode') // 单据号
    var txtCrStartDate = frameDocument.querySelector('#txtCrStartDate')
    var txtCrEndDate = frameDocument.querySelector('#txtCrEndDate')
    var ddlRequState = frameDocument.querySelector('#ddlRequState') // 订单状态
    var ddlFlight_Type = frameDocument.querySelector('#ddlFlight_Type')
    var txtDeStartDate = frameDocument.querySelector('#txtDeStartDate')
    var txtDeEndDate = frameDocument.querySelector('#txtDeEndDate')
    var txtHomeCity = frameDocument.querySelector('#txtHomeCity')
    var txtDestCity = frameDocument.querySelector('#txtDestCity')
    var hiHomeCityCode = frameDocument.querySelector('#hiHomeCityCode')
    var hiDestCityCode = frameDocument.querySelector('#hiDestCityCode')
    var ddlBooking = frameDocument.querySelector('#ddlBooking')

    txtRequCode.value = ''
    txtCrStartDate.value = ''
    txtCrEndDate.value = ''
    ddlRequState.value = '001_WaitToQuote' // 订单状态设置为待报价
    ddlFlight_Type.value = ''
    txtDeStartDate.value = ''
    txtDeEndDate.value = ''
    txtHomeCity.value = ''
    txtDestCity.value = ''
    hiHomeCityCode.value = ''
    hiDestCityCode.value = ''
    ddlBooking.value = ''
  }

  function getWaitingTableData() {
    console.log('开始查询「待报价」数据')
    const frameDocument = getRightQueryParamFrame()
    const tableEle = frameDocument.querySelectorAll('#viewData tr')
    const result = []
    for (let i = 1; i < tableEle.length; i++) {
      result.push(getWaitingTableItem(tableEle[i]))
    }
    const filterList = result.filter((item) => {
      // 如果是第⼀轮，则返回所有结果，后续返回⼀分钟内的
      console.log(Number(item.quotedTime[0]))
      return Number(item.quotedTime[0]) <= (times === 1 ? 2 : 1)
    })
    const pLen = preSet.size
    let res = []
    if (filterList.length) {
      // 如果上⼀次记录与本次记录不同则缓存最新的记录
      if (!pLen) {
        res = filterList
      } else {
        res = filterList.filter((item) => !preSet.has(item.orderNo))
      }
      res.forEach((item) => {
        preSet.add(item.orderNo)
      })
      if (!res.length) {
        return
      }
      console.log(res)
      sendMessageByWeCom(res)
    } else {
      console.log('暂⽆剩余时间⼩于2分的数据')
    }
  }

  function getWaitingTableItem(eleItem) {
    const orderNo = eleItem.children[1].innerText // 订单号
    const type = eleItem.children[2].innerText
    const city = eleItem.children[3].innerText
    const txtCrStart = eleItem.children[4].innerText // 提单时间
    const startDate = eleItem.children[5].innerText // 出发日期
    const quotedRecord = eleItem.children[6].innerText // 报价记录
    const quotedTime = eleItem.children[7].innerText // 报价时间
    const time = eleItem.children[8].innerText // 剩余时间
    const status = eleItem.children[9].innerText // 订单状态
    return {
      orderNo,
      type,
      city,
      txtCrStart,
      startDate,
      quotedRecord,
      quotedTime,
      time,
      status,
    }
  }

  function getPayedTableData() {
    console.log('开始查询「已支付」数据')
    const frameDocument = getRightQueryParamFrame()
    const tableEle = frameDocument.querySelectorAll('#gvFlight tr')
    const result = []
    for (let i = 1; i < tableEle.length; i++) {
      result.push(getPayedTableItem(tableEle[i]))
    }
    console.log(result)
    const filterList = result.filter((item) => {
      return item.payedStatus === '已付款' // 筛选出已付款的
    })
    sendMessageByWeCom(filterList) // 直接通知全部
    return
    const pLen = preSet.size
    let res = []
    if (filterList.length) {
      // 如果上⼀次记录与本次记录不同则缓存最新的记录
      if (!pLen) {
        res = filterList
      } else {
        res = filterList.filter((item) => !preSet.has(item.orderNo))
      }
      res.forEach((item) => {
        preSet.add(item.orderNo)
      })
      if (!res.length) {
        return
      }
      console.log(res)
      sendMessageByWeCom(res)
    } else {
      console.log('暂无新增数据')
    }
  }

  function getPayedTableItem(eleItem) {
    const orderNo = eleItem.children[0].innerText // 订单号
    const type = eleItem.children[1].innerText // 航程类型
    const route = eleItem.children[2].innerText // 行程
    const seatNo = eleItem.children[3].innerText // 订座编号
    const bookingDate = eleItem.children[4].innerText // 预定日期
    const startDate = eleItem.children[5].innerText // 出发日期
    const passenger = eleItem.children[6].innerText // 登机人
    const docNo = eleItem.children[7].innerText // 证件号码
    const amount = eleItem.children[8].innerText // 全程票价
    const status = eleItem.children[9].innerText // 订单状态
    const payedStatus = eleItem.children[10].innerText // 付款状态
    const staff = eleItem.children[11].innerText // 跟单员
    return {
      orderNo,
      type,
      route,
      seatNo,
      bookingDate,
      startDate,
      passenger,
      docNo,
      amount,
      status,
      payedStatus,
      staff,
    }
  }

  function getRefundTableData() {
    console.log('开始查询「退票」数据')
    const frameDocument = getRightQueryParamFrame()
    const tableEle = frameDocument.querySelectorAll('#GridView1 tr')
    const result = []
    for (let i = 1; i < tableEle.length; i++) {
      result.push(getRefundTableItem(tableEle[i]))
    }
    console.log(result)
    const filterList = result
    sendMessageByWeCom(filterList) // 直接通知全部
    return
    const pLen = preSet.size
    let res = []
    if (filterList.length) {
      // 如果上⼀次记录与本次记录不同则缓存最新的记录
      if (!pLen) {
        res = filterList
      } else {
        res = filterList.filter((item) => !preSet.has(item.orderNo))
      }
      res.forEach((item) => {
        preSet.add(item.orderNo)
      })
      if (!res.length) {
        return
      }
      console.log(res)
      sendMessageByWeCom(res)
    } else {
      console.log('暂无新增数据')
    }
  }

  function getRefundTableItem(eleItem) {
    const orderNo = eleItem.children[0].innerText // 订单号
    const createDate = eleItem.children[1].innerText // 申请日期
    const startDate = eleItem.children[2].innerText // 出发日期
    const city = eleItem.children[3].innerText // 行程
    const passenger = eleItem.children[4].innerText // 乘客
    const amount = eleItem.children[5].innerText // 全程票价
    const refundReason = eleItem.children[6].innerText // 退票原因
    const unit = eleItem.children[7].innerText // 出票单位
    const status = eleItem.children[8].innerText // 退票状态
    const staff = eleItem.children[9].innerText // 跟单员
    return {
      orderNo,
      createDate,
      startDate,
      city,
      passenger,
      amount,
      refundReason,
      unit,
      status,
      staff,
    }
  }

  function getChangeTableData() {
    console.log('开始查询「改期」数据')
    const frameDocument = getRightQueryParamFrame()
    const tableEle = frameDocument.querySelectorAll('#GridView1 tr')
    const result = []
    for (let i = 1; i < tableEle.length; i++) {
      result.push(getChangeTableItem(tableEle[i]))
    }
    console.log(result)
    const filterList = result
    sendMessageByWeCom(filterList) // 直接通知全部
    return
    const pLen = preSet.size
    let res = []
    if (filterList.length) {
      // 如果上⼀次记录与本次记录不同则缓存最新的记录
      if (!pLen) {
        res = filterList
      } else {
        res = filterList.filter((item) => !preSet.has(item.orderNo))
      }
      res.forEach((item) => {
        preSet.add(item.orderNo)
      })
      if (!res.length) {
        return
      }
      console.log(res)
      sendMessageByWeCom(res)
    } else {
      console.log('暂无新增数据')
    }
  }

  function getChangeTableItem(eleItem) {
    const orderNo = eleItem.children[0].innerText // 订单号
    const createDate = eleItem.children[1].innerText // 申请日期
    const startDate = eleItem.children[2].innerText // 出发日期
    const city = eleItem.children[3].innerText // 行程
    const passenger = eleItem.children[4].innerText // 乘客
    const amount = eleItem.children[5].innerText // 全程票价
    const changeReason = eleItem.children[6].innerText // 改期意向
    const unit = eleItem.children[7].innerText // 出票单位
    const staff = eleItem.children[8].innerText // 跟单员
    return {
      orderNo,
      createDate,
      startDate,
      city,
      passenger,
      amount,
      changeReason,
      unit,
      staff,
    }
  }

  /** 页面左侧导航栏Frame */
  function getLeftNavigationFrame() {
    let frameEle = $(
      '#topFrameSet #mainFrameSet #bottomFrameSet frame[name="leftup"]',
      top.document
    )[0].contentDocument.children[0]
    return frameEle
  }

  /** 页面右侧主题内容Frame的查询表单 */
  function getRightQueryParamFrame() {
    let frameEle = ''
    try {
      frameEle = $(
        '#topFrameSet #mainFrameSet #bottomFrameSet frame[name="right"]',
        top.document
      )[0].contentDocument.children[0].children[1].children[0].contentDocument
        .children[0]
    } catch (error) {
      console.log(error)
    }
    if (!frameEle) {
      frameEle = $(
        '#topFrameSet #mainFrameSet #bottomFrameSet frame[name="right"]',
        top.document
      )[0].contentDocument.children[0].children[2].children[0].contentDocument
        .children[0]
    }
    return frameEle
  }

  function getNowTime() {
    const date = new Date()
    return `${date.getHours()}:${date.getMinutes()}`
  }

  function sendMessageByWeCom(result) {
    var str = `${
      pagesModeOps[pageMode]
    } 第${times}轮询 当前时间${getNowTime()}\n `
    if (result.length) {
      result.forEach((item) => {
        str += getMessageStr(item)
      })
    } else {
      str += `暂无数据`
    }
    const params = {
      msgtype: 'markdown',
      markdown: {
        content: str,
      },
    }
    console.log(params)
    const url =
      pageMode === 'waiting'
        ? 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=eede41bf-61ef-478d-8401-98f624d0cca7'
        : 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=aaaa9471-eb1c-4335-ae91-1f5fa2ffb961'
    GM_xmlhttpRequest({
      url: url,
      method: 'post',
      data: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
      onload: function (response) {
        console.log(response)
      },
    })
  }

  function getMessageStr(item) {
    let str = ''
    switch (pageMode) {
      case 'waiting':
        str = `${item.orderNo} ${item.type} ${item.city} ${item.txtCrStart} ${item.startDate} ${item.quotedRecord}【报价已过：${item.quotedTime}】 【剩余时间：${item.time}】 ${item.status} \n`
        break
      case 'payed':
        str = `${item.orderNo} ${item.type} ${item.route} ${item.seatNo} ${item.bookingDate} ${item.startDate} ${item.status} ${item.payedStatus} ${item.staff} \n`
        break
      case 'refund':
        str = `${item.orderNo} ${item.createDate} ${item.startDate} ${item.city} ${item.passenger} ${item.amount} ${item.refundReason} ${item.status} ${item.staff} \n`
        break
      case 'change':
        str = `${item.orderNo} ${item.createDate} ${item.startDate} ${item.city} ${item.passenger} ${item.amount} ${item.changeReason} ${item.staff} \n`
        break
    }
    return str
  }
})()
