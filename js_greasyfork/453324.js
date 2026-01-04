// ==UserScript==
// @name         中兴商旅填单助手
// @namespace    super_page_fill_order
// @version      0.8
// @description  中兴商旅自动填单小助手，仅限内部人员使用
// @author       LVPlum
// @match        https://mobilerma.zte.com.cn/UILoader/Index_Internal.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zte.com.cn
// @include      https://mobilerma.zte.com.cn/
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @connect	     qyapi.weixin.qq.com
// @connect      https://mobilerma.zte.com.cn
// @connect      cdn.jsdelivr.net
// @connect      teyixing.com
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
// @downloadURL https://update.greasyfork.org/scripts/453324/%E4%B8%AD%E5%85%B4%E5%95%86%E6%97%85%E5%A1%AB%E5%8D%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/453324/%E4%B8%AD%E5%85%B4%E5%95%86%E6%97%85%E5%A1%AB%E5%8D%95%E5%8A%A9%E6%89%8B.meta.js
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
        .container {
          color: #fff;
          position: absolute;
          top: 10px;
          right: 30px;
          padding: 10px 20px;
          background: #00000099;
          border-radius: 4px;
          text-align: center;
        }
        .header {
          margin-top: 5px;
          margin-bottom: 5px;
          font-size: 14px;
          font-weight: bold;
          display: flex;
          justify-content: space-between;
        }
        .m-b-10 {margin-bottom: 10px;}
        .m-t-10 {margin-top: 10px;}
        .m-r-10 {margin-right: 10px;}
        .btn {
          cursor: pointer;
          display: inline-block;
          padding: 4px;
          font-size: 14px;
          border-radius: 4px;
          color: white;
          background: #1890ff;
          width: 65px;
          text-align: center;
          border: none;
        }
        .link {
          cursor: pointer;
          color: #1890ff;
          font-weight: bold;
          font-size: 14px;
        }
        input, textarea {padding: 4px;  width: 160px}
        textarea {width: 400px; height:60px}
        .nav-item {
          cursor: pointer;
          flex:1;
        }
        #segments_query {
          display: none
        }
        .hide {display: none}
        `
  var htmlMould = `<div id='tampermonkey_container' class="container">
                       <div class="link" id="location">跳转订单报价列表</div>
                       <div class="header">
                         <div class="nav-item" id="pnr_btn">PNR查询</div>
                         <div class="nav-item" id="segments_btn">原文解析</div>
                       </div>
                       <div class="query-content" id="pnr_query">
                         <div class="m-b-10"><input type="text" id="pnr" name="pnr" placeholder="请输入PNR" required></div>
                         <button type="button" class="btn m-r-10" id="query_btn">去程<svg viewBox="0 0 1024 1024" focusable="false" fill="currentColor" width="1em" height="1em" data-icon="loading" aria-hidden="true" class="anticon-spin"><path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path></svg></button>
                         <button type="button" class="btn m-r-10" id="query_btn_back">返程<svg viewBox="0 0 1024 1024" focusable="false" fill="currentColor" width="1em" height="1em" data-icon="loading" aria-hidden="true" class="anticon-spin"><path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path></svg></button>
                         <button type="button" class="btn hide" id="reset">重置</button>
                         <button type="button" class="btn" id="hide">折叠</button>
                       </div>
                       <div class="query-content" id="segments_query">
                         <div class="m-b-10"><textarea type="text" id="segments_input" name="segments_input" placeholder="请输入航段原文解析" required></textarea></div>
                         <button type="button" class="btn m-r-10" id="segments_query_btn">去程<svg viewBox="0 0 1024 1024" focusable="false" fill="currentColor" width="1em" height="1em" data-icon="loading" aria-hidden="true" class="anticon-spin"><path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path></svg></button>
                         <button type="button" class="btn m-r-10" id="segments_query_btn_back">返程<svg viewBox="0 0 1024 1024" focusable="false" fill="currentColor" width="1em" height="1em" data-icon="loading" aria-hidden="true" class="anticon-spin"><path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path></svg></button>
                         <button type="button" class="btn hide" id="segments_reset">重置</button>
                         <button type="button" class="btn" id="segments_hide">折叠</button>
                       </div>
                      </div>`
  var showInput = true

  init()

  function init() {
    $('html').prepend('<style>' + cssText + '</style>')
    $('html').append(htmlMould)

    $('#tampermonkey_container').on('click', '#location', function (e) {
      toPage()
    })

    $('#tampermonkey_container').on('click', '#pnr_btn', function (e) {
      $('#tampermonkey_container #pnr_query').css({ display: 'block' })
      $('#tampermonkey_container #segments_query').css('display', 'none')
    })

    $('#tampermonkey_container').on('click', '#segments_btn', function (e) {
      $('#tampermonkey_container #segments_query').css('display', 'block')
      $('#tampermonkey_container #pnr_query').css('display', 'none')
    })

    $('#tampermonkey_container').on('click', '#query_btn', function (e) {
      checkInputPnr(false, true)
    })

    $('#tampermonkey_container').on('click', '#query_btn_back', function (e) {
      checkInputPnr(true, true)
    })

    $('#tampermonkey_container').on(
      'click',
      '#segments_query_btn',
      function (e) {
        checkInputPnr(false, false)
      }
    )

    $('#tampermonkey_container').on(
      'click',
      '#segments_query_btn_back',
      function (e) {
        checkInputPnr(true, false)
      }
    )

    $('#tampermonkey_container').on(
      'click',
      '#hide, #segments_hide',
      function () {
        toggleInput()
      }
    )

    $('#tampermonkey_container').on(
      'click',
      '#reset, #segments_reset',
      function () {
        const btns = [
          $('#tampermonkey_container #query_btn'),
          $('#tampermonkey_container #query_btn_back'),
          $('#tampermonkey_container #segments_query_btn'),
          $('#tampermonkey_container #segments_query_btn_back'),
        ]
        btns.forEach((btn) => {
          btn.removeAttr('disabled')
          btn.css('opacity', 1)
          btn.find('svg')[0].style.display = 'none'
        })
      }
    )
  }

  function toggleInput() {
    showInput = !showInput
    const inputs = [
      $('#tampermonkey_container #pnr'),
      $('#tampermonkey_container #segments_input'),
    ]
    const btns = [
      $('#tampermonkey_container #hide'),
      $('#tampermonkey_container #segments_hide'),
    ]
    inputs.forEach((input) => {
      input.css('display', showInput ? 'inline-block' : 'none')
    })
    btns.forEach((btn) => {
      btn.text(`${showInput ? '折叠' : '展开'}`)
    })
  }

  function toPage() {
    const leftAside = $(
      '#topFrameSet #mainFrameSet #bottomFrameSet frame[name="leftup"]',
      top.document
    )[0].contentDocument.children[0]
    const btn1 = leftAside
      .querySelectorAll('table')[1]
      .querySelectorAll('tr')[0]
    btn1.click() // 点击票务处理
    const btn2 = leftAside.querySelectorAll('table')[3]
    btn2.click() // 点击订单报价

    setTimeout(() => {
      queryList() // 查询待报价订单
    }, 1000)
  }

  function checkInputPnr(isBack, isPnr) {
    const frameDocument = getFrameDocument()
    const hasRound =
      frameDocument.querySelector('#trToBack').style.display === 'none' // 往返程切换是否展示
    if (isBack) {
      // 点击返程PNR查询时，页面是单程弹窗提示
      if (hasRound) {
        alert('该航段为单程，暂无返程')
        return
      }
      const hasSegmentBack = frameDocument.querySelector('#tabbody2')
      hasSegmentBack.click() // 点击页面返程按钮，确保页面在返程
    } else {
      if (!hasRound) {
        const toBtn = frameDocument.querySelector('#tabbody1')
        toBtn.click() // 点击页面去程按钮，确保页面在去程
      }
    }
    const params = isPnr ? getPnrRequestParams() : getSegmentsRequestParams()
    if ((isPnr && !params.pnr) || (!isPnr && !params.segmentsContent)) {
      alert(`请输入${isPnr ? 'PNR' : '航段原文'}`)
      return
    }
    const url = isPnr
      ? 'https://staff-api-gateway.teyixing.com/front/v1/intFlight/extract/extractPnrInfo'
      : 'https://staff-api-gateway.teyixing.com/front/v1/intFlight/extract/extractSegmentsContent'
    disabledBtn(isPnr) // 发起请求前disabled 按钮
    GM_xmlhttpRequest({
      url: url,
      method: 'post',
      data: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
      onload: function (res) {
        console.log(JSON.stringify(params), res)
        console.log(res.response, JSON.parse(res.response))
        const result = JSON.parse(res.response)
        if (result.code === 0) {
          // 判断填入去程/返程信息
          try {
            if (isBack) {
              resetSegmentBackForm(result.data)
            } else {
              restSegmentForm(result.data)
            }
          } catch (error) {
            console.log(error)
            alert(`解析返回出现异常：${res.response}，请检查输入格式是否正确`)
          }
        } else {
          alert(result.message)
        }
        resetBtn(isPnr)
      },
      onerror: function (err) {
        console.log(err)
        alert('服务异常')
        resetBtn(isPnr)
      },
    })
  }

  function disabledBtn(isPnr) {
    const btns = isPnr
      ? [
          $('#tampermonkey_container #query_btn'),
          $('#tampermonkey_container #query_btn_back'),
        ]
      : [
          $('#tampermonkey_container #segments_query_btn'),
          $('#tampermonkey_container #segments_query_btn_back'),
        ]
    btns.forEach((btn) => {
      btn.attr('disabled', 'disabled')
      btn.css('opacity', 0.7)
      btn.find('svg')[0].style.display = 'inherit'
    })
  }

  function resetBtn(isPnr) {
    const btns = isPnr
      ? [
          $('#tampermonkey_container #query_btn'),
          $('#tampermonkey_container #query_btn_back'),
        ]
      : [
          $('#tampermonkey_container #segments_query_btn'),
          $('#tampermonkey_container #segments_query_btn_back'),
        ]
    btns.forEach((btn) => {
      btn.removeAttr('disabled')
      btn.css('opacity', 1)
      btn.find('svg')[0].style.display = 'none'
    })
  }

  function restSegmentForm(obj) {
    const frameDocument = getFrameDocument()
    const idPrefix = 'gvLine1__ctl' // 返程数据id前缀
    const addSegmentBtn = frameDocument.querySelector('#add1')
    const segmentsEle = frameDocument.querySelectorAll('#table1 .item')
    if (obj.segments.length > segmentsEle.length) {
      const count = obj.segments.length - segmentsEle.length
      for (let i = 0; i < count; i++) {
        addSegmentBtn.click()
      }
    }
    // 仅考虑单程，返程的id头应该是 gvLine2
    frameDocument.querySelectorAll('#table1 .item').forEach((ele, index) => {
      const segment = obj.segments[index]
      // 机场
      const txtHomeCity = ele.querySelector(
        `#${idPrefix}${index + 2}_txtHomeCity`
      )
      const txtDestCity = ele.querySelector(
        `#${idPrefix}${index + 2}_txtDestCity`
      )
      txtHomeCity.value = segment.departure.airportCode
      txtDestCity.value = segment.arrival.airportCode

      // 航程信息
      const ddlAirCompany = ele.querySelector(
        `#${idPrefix}${index + 2}_ddlAirCompany`
      ) // 航空公司
      const txtAirCompany = ele.querySelector(
        `#${idPrefix}${index + 2}_txtAirCompany`
      ) // 航班号
      const ddlStartDate_Order1 = ele.querySelector(
        `#${idPrefix}${index + 2}_ddlStartDate_Order1`
      ) // 出发日期
      const ddlEndDate_Order1 = ele.querySelector(
        `#${idPrefix}${index + 2}_ddlEndDate_Order1`
      ) // 到达日期
      const txtStartTime = ele.querySelector(
        `#${idPrefix}${index + 2}_txtStartTime`
      ) // 出发时间
      const txtEndTime = ele.querySelector(
        `#${idPrefix}${index + 2}_txtEndTime`
      ) // 到达时间
      ddlAirCompany.value = getAirCompany(segment.airlineCode)
      txtAirCompany.value = segment.flightNo
      ddlStartDate_Order1.value = segment.departure.date
      ddlEndDate_Order1.value = segment.arrival.date
      txtStartTime.value = segment.departure.time
      txtEndTime.value = segment.arrival.time
    })

    // 其他信息
    // 乘机人的订座编号
    const trEle = frameDocument.querySelectorAll('#viewData1 tr')
    const passengerEleList = [].slice.call(trEle) // nodeList 转数组
    passengerEleList.shift() // 将第一个首部移除，余下元素才为乘机人
    passengerEleList.forEach((ele, index) => {
      const txtSeetCode = ele.querySelector(
        `#viewData1__ctl${index + 2}_txtSeetCode`
      )
      txtSeetCode.value = obj.pnr
    })
    // 币种：设置成人民币
    const txtCurrencyCode = frameDocument.querySelector('#txtCurrencyCode')
    const hiCurrencyCode = frameDocument.querySelector('#hiCurrencyCode')
    txtCurrencyCode.value = 'CNY'
    hiCurrencyCode.value = 'CNY'
    // 舱位等级：默认为经济舱
    const ddlBunk = frameDocument.querySelector('#ddlBunk')
    ddlBunk.value = 'TouristClass'
    // 舱位说明：用/拼接起来
    const txtBunkMemo = frameDocument.querySelector('#txtBunkMemo')
    const bunkInfo = obj.segments.map((item) => item.bunkCode).join('/')
    txtBunkMemo.value = bunkInfo
    // 直飞/中转
    const isSingle =
      frameDocument.querySelector('#trToBack').style.display === 'none' // 是否是单程，根据页面是否存在返程标签按钮
    const rdoOneWay = frameDocument.querySelector('#rdoOneWay') // 直飞radio
    const rdoTransfer = frameDocument.querySelector('#rdoTransfer') // 中转radio
    if (
      (isSingle && obj.segments.length > 1) ||
      (!isSingle && obj.segments.length > 2)
    ) {
      rdoTransfer.click() // 点击中转
    } else {
      rdoOneWay.click() // 点击直飞
    }
    // 其他费用：设置为0
    const txtOtherFee = frameDocument.querySelector('#txtOtherFee') // 其他费用
    txtOtherFee.value = 0
    // 退改签选择默认填充
    const rdoIsCanChangeY = frameDocument.querySelector('#rdoIsCanChangeY') // 是否可以改期：是
    rdoIsCanChangeY.click()
    const rdoIsCanReturnY = frameDocument.querySelector('#rdoIsCanReturnY') // 是否可以退票：是
    rdoIsCanReturnY.click()
    const rdoIsCanReturnAfterGoN = frameDocument.querySelector(
      '#rdoIsCanReturnAfterGoN'
    ) // 是否可以半程退票：否
    rdoIsCanReturnAfterGoN.click()
  }

  // todo 返程方法，后续优化整理
  function resetSegmentBackForm(obj) {
    const frameDocument = getFrameDocument()
    const idPrefix = 'gvLine2__ctl' // 返程数据id前缀
    const addSegmentBtn = frameDocument.querySelector('#add2')
    const segmentsEle = frameDocument.querySelectorAll('#table3 .item')
    if (obj.segments.length > segmentsEle.length) {
      const count = obj.segments.length - segmentsEle.length
      for (let i = 0; i < count; i++) {
        addSegmentBtn.click()
      }
    }
    frameDocument.querySelectorAll('#table3 .item').forEach((ele, index) => {
      const segment = obj.segments[index]
      // 机场
      const txtHomeCity = ele.querySelector(
        `#${idPrefix}${index + 2}_txtHomeCity`
      )
      const txtDestCity = ele.querySelector(
        `#${idPrefix}${index + 2}_txtDestCity`
      )
      txtHomeCity.value = segment.departure.airportCode
      txtDestCity.value = segment.arrival.airportCode

      // 航程信息
      const ddlAirCompany = ele.querySelector(
        `#${idPrefix}${index + 2}_ddlAirCompany`
      ) // 航空公司
      const txtAirCompany = ele.querySelector(
        `#${idPrefix}${index + 2}_txtAirCompany`
      ) // 航班号
      const ddlStartDate_Order1 = ele.querySelector(
        `#${idPrefix}${index + 2}_ddlStartDate_Order1`
      ) // 出发日期
      const ddlEndDate_Order1 = ele.querySelector(
        `#${idPrefix}${index + 2}_ddlEndDate_Order1`
      ) // 到达日期
      const txtStartTime = ele.querySelector(
        `#${idPrefix}${index + 2}_txtStartTime`
      ) // 出发时间
      const txtEndTime = ele.querySelector(
        `#${idPrefix}${index + 2}_txtEndTime`
      ) // 到达时间
      ddlAirCompany.value = getAirCompany(segment.airlineCode)
      txtAirCompany.value = segment.flightNo
      ddlStartDate_Order1.value = segment.departure.date
      ddlEndDate_Order1.value = segment.arrival.date
      txtStartTime.value = segment.departure.time
      txtEndTime.value = segment.arrival.time
    })

    // 其他信息
    // 乘机人的订座编号
    const trEle = frameDocument.querySelectorAll('#viewData2 tr')
    const passengerEleList = [].slice.call(trEle) // nodeList 转数组
    passengerEleList.shift() // 将第一个首部移除，余下元素才为乘机人
    passengerEleList.forEach((ele, index) => {
      const txtSeetCode = ele.querySelector(
        `#viewData2__ctl${index + 2}_txtSeetCode`
      )
      txtSeetCode.value = obj.pnr
    })
    // 币种
    const txtCurrencyCode = frameDocument.querySelector('#txtCurrencyCode2')
    const hitxtCurrencyCode2 = frameDocument.querySelector(
      '#hitxtCurrencyCode2'
    )
    txtCurrencyCode.value = 'CNY' // 设置成人民币
    hitxtCurrencyCode2.value = 'CNY'
    // 舱位等级
    const ddlBunk2 = frameDocument.querySelector('#ddlBunk2')
    ddlBunk2.value = 'TouristClass' // 舱位等级默认为经济舱
    // 舱位说明：用/拼接起来
    const txtBunkMemo2 = frameDocument.querySelector('#txtBunkMemo2')
    const bunkInfo = obj.segments.map((item) => item.bunkCode).join('/')
    txtBunkMemo2.value = bunkInfo
    // 直飞/中转
    const isSingle =
      frameDocument.querySelector('#trToBack').style.display === 'none' // 是否是单程，根据页面是否存在返程标签按钮
    const rdoOneWay2 = frameDocument.querySelector('#rdoOneWay2') // 直飞radio
    const rdoTransfer2 = frameDocument.querySelector('#rdoTransfer2') // 中转radio
    if (
      (isSingle && obj.segments.length > 1) ||
      (!isSingle && obj.segments.length > 2)
    ) {
      rdoTransfer2.click() // 点击中转
    } else {
      rdoOneWay2.click() // 点击直飞
    }
    // 其他费用：设置为0
    const txtOtherFee2 = frameDocument.querySelector('#txtOtherFee2') // 其他费用
    txtOtherFee2.value = 0
    // 退改签选择默认填充
    const rdoIsCanChangeY2 = frameDocument.querySelector('#rdoIsCanChangeY2') // 是否可以改期：是
    rdoIsCanChangeY2.click()
    const rdoIsCanReturnY2 = frameDocument.querySelector('#rdoIsCanReturnY2') // 是否可以退票：是
    rdoIsCanReturnY2.click()
    const rdoIsCanReturnAfterGoN2 = frameDocument.querySelector(
      '#rdoIsCanReturnAfterGoN2'
    ) // 是否可以半程退票：否
    rdoIsCanReturnAfterGoN2.click()
  }

  // 查询待报价订单
  function queryList() {
    resetElement()
    queryFormFrameDocument().querySelector('#btnQuery').click()
    setTimeout(() => {
      const pageSizeEle = queryFormFrameDocument().querySelector(
        '#ZteWebPager_PageSize'
      )
      if (pageSizeEle) {
        pageSizeEle.value = 5000
        pageSizeEle.onchange()
      }
    }, 1000)
  }

  // 定位到查询页时，重置查询表单
  function resetElement() {
    var frameDocument = queryFormFrameDocument()
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
    txtCrStartDate.value = getTodayDate()
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

  function getTodayDate() {
    const nowDate = new Date()
    const year = nowDate.getFullYear()
    const month = nowDate.getMonth() + 1
    const day = nowDate.getDate()
    return `${year}-${month > 9 ? month : '0' + month}-${
      day > 9 ? day : '0' + day
    }`
  }

  function getPnrRequestParams() {
    const inputEle = $('#tampermonkey_container #pnr').val().trim()
    return {
      username: 'TeHang',
      password: 'th@88889999',
      pnr: inputEle,
    }
  }

  function getSegmentsRequestParams() {
    const segmentsContent = $('#tampermonkey_container #segments_input').val()
    return {
      username: 'TeHang',
      password: 'th@88889999',
      segmentsContent: segmentsContent,
    }
  }

  // 订单填充页面表单Frame
  function getFrameDocument() {
    let frameEle = ''
    try {
      frameEle = $(
        '#topFrameSet #mainFrameSet #bottomFrameSet frame[name="right"]',
        top.document
      )[0].contentDocument.children[0].children[1].children[1].contentDocument
    } catch (error) {
      console.log(error)
    }
    console.log(frameEle)
    if (!frameEle) {
      frameEle = $(
        '#topFrameSet #mainFrameSet #bottomFrameSet frame[name="right"]',
        top.document
      )[0].contentDocument.children[0].children[2].children[1].contentDocument
    }
    return frameEle
  }

  // 列表查询页表单Frame
  function queryFormFrameDocument() {
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
    console.log(frameEle)
    if (!frameEle) {
      frameEle = $(
        '#topFrameSet #mainFrameSet #bottomFrameSet frame[name="right"]',
        top.document
      )[0].contentDocument.children[0].children[2].children[0].contentDocument
        .children[0]
    }
    return frameEle
  }

  // 设置其他元素值，PNR 解析暂无数据，暂留如需增加其他值时填充
  function setElement() {
    var frameDocument = getFrameDocument()
    var txtChangeFee = frameDocument.querySelector('#txtChangeFee') // 改期费
    var txtAirTicketFee = frameDocument.querySelector('#txtAirTicketFee') // 机票单价
    var txtAirTaxFee = frameDocument.querySelector('#txtAirTaxFee') // 机票税
    // var txtAgentFee = frameDocument.querySelector('#txtAgentFee') // 代理费 页面隐藏默认设置为0
    var txtOtherFee = frameDocument.querySelector('#txtOtherFee') // 其他费用
    // 往返程时，返程元素
    var txtChangeFee2 = frameDocument.querySelector('#txtChangeFee2') // 返程改期费
    var txtAirTicketFee2 = frameDocument.querySelector('#txtAirTicketFee2') // 返程机票单价
    var txtAirTaxFee2 = frameDocument.querySelector('#txtAirTaxFee2') // 返程机票税
    // var txtAgentFee2 = frameDocument.querySelector('#txtAgentFee2') // 返程代理费 页面隐藏默认设置为0
    var txtOtherFee2 = frameDocument.querySelector('#txtOtherFee2') // 返程其他费用

    const segmentsEle = frameDocument.querySelectorAll('#table1 .item')

    txtChangeFee.value = '100'
    txtAirTicketFee.value = '100'
    txtAirTaxFee.value = '100'
    txtOtherFee.value = '100'

    txtChangeFee2.value = '100'
    txtAirTicketFee2.value = '100'
    txtAirTaxFee2.value = '100'
    txtOtherFee2.value = '100'

    txtAirTicketFee.onchange()
  }

  function getAirCompany(code) {
    const airCompany = {
      '3K': '10071',
      '3U': '1',
      '4O': '10242',
      '4U': '10067',
      '5J': '200',
      '6E': '10204',
      '6U': '65',
      '7Y': '10211',
      '8C': '3',
      '8L': '4',
      '8M': '66',
      '9C': '10245',
      '9D': '10247',
      '9H': '10223',
      '9W': '67',
      A3: '10073',
      A6: '10221',
      A9: '10235',
      AA: '68',
      AB: '69',
      AC: '70',
      AE: '71',
      AF: '72',
      AH: '207',
      AI: '73',
      AK: '209',
      AM: '74',
      AQ: '10246',
      AR: '75',
      AT: '312',
      AV: '10065',
      AY: '76',
      AZ: '77',
      B2: '10238',
      B6: '10214',
      B7: '78',
      BA: '79',
      BD: '214',
      BG: '215',
      BI: '80',
      BK: '12',
      BL: '10076',
      BR: '81',
      BU: '218',
      BW: '10227',
      CA: '13',
      CI: '82',
      CM: '83',
      CN: '-25',
      CO: '84',
      CP: '223',
      CU: '224',
      CX: '85',
      CZ: '17',
      D7: '10079',
      DD: '10061',
      DE: '10213',
      DJ: '86',
      DL: '87',
      DR: '10005',
      DT: '228',
      DZ: '10004',
      EK: '88',
      ET: '89',
      EU: '19',
      EW: '10243',
      EY: '90',
      FD: '10072',
      FI: '91',
      FJ: '232',
      FM: '21',
      FT: '92',
      FU: '10042',
      FV: '93',
      FZ: '10210',
      G5: '23',
      G8: '10207',
      GA: '94',
      GE: '95',
      GF: '96',
      GJ: '313',
      GS: '25',
      GT: '10222',
      GX: '10041',
      GY: '10230',
      HA: '236',
      HI: '10070',
      HM: '237',
      HO: '26',
      HP: '238',
      HU: '27',
      HX: '97',
      HY: '98',
      I5: '10236',
      IB: '240',
      IC: '241',
      ID: '10229',
      IR: '99',
      IT: '100',
      J2: '10064',
      JD: '10001',
      JK: '243',
      JL: '101',
      JR: '311',
      JS: '102',
      JT: '10232',
      JU: '10074',
      JY: '10225',
      KA: '103',
      KC: '104',
      KE: '105',
      KL: '106',
      KM: '107',
      KN: '35',
      KQ: '108',
      KU: '251',
      KY: '10002',
      LA: '252',
      LB: '10208',
      LG: '253',
      LH: '109',
      LI: '10226',
      LO: '255',
      LT: '10231',
      LX: '110',
      LY: '111',
      MA: '112',
      MD: '113',
      MF: '40',
      MH: '114',
      MI: '115',
      MK: '116',
      MS: '117',
      MU: '43',
      MX: '261',
      NH: '118',
      NK: '10224',
      NS: '45',
      NW: '119',
      NX: '120',
      NZ: '121',
      OA: '122',
      OD: '10237',
      OK: '268',
      OM: '123',
      OS: '125',
      OU: '124',
      OX: '10077',
      OZ: '126',
      PG: '127',
      PH: '273',
      PK: '128',
      PN: '52',
      PR: '129',
      PS: '10063',
      PX: '130',
      PY: '277',
      QF: '131',
      QG: '10212',
      QM: '279',
      QR: '132',
      QV: '281',
      QW: '10003',
      QZ: '10075',
      RA: '282',
      RG: '133',
      RJ: '284',
      RO: '134',
      RY: '10085',
      S7: '135',
      SA: '136',
      SB: '286',
      SC: '55',
      SD: '287',
      SG: '10205',
      SJ: '10241',
      SK: '137',
      SL: '10080',
      SN: '289',
      SQ: '138',
      SU: '139',
      SV: '140',
      SW: '293',
      TE: '294',
      TG: '141',
      TK: '142',
      TM: '297',
      TN: '143',
      TP: '144',
      TR: '10078',
      TU: '299',
      TV: '1207',
      TZ: '10069',
      U2: '10209',
      U6: '10239',
      UA: '145',
      UB: '10062',
      UK: '10206',
      UL: '146',
      UM: '147',
      UN: '148',
      UO: '149',
      UQ: '10006',
      US: '304',
      UU: '305',
      UX: '306',
      VD: '62',
      VJ: '10083',
      VN: '150',
      VS: '151',
      VV: '152',
      VY: '10234',
      W5: '10215',
      W6: '10233',
      WB: '10244',
      WE: '10081',
      WM: '10228',
      WN: '10066',
      WS: '10068',
      XF: '153',
      XW: '10216',
      Y8: '10084',
      YX: '310',
      Z2: '10240',
      ZH: '64',
    }
    return airCompany[code] || 0
  }

  // 判断浏览器
  function userAgent() {
    const ua = window.navigator.userAgent.toLowerCase()
    const testUa = (regexp) => regexp.test(ua)
    console.log(ua)
    let supporter = ''
    if (testUa(/edg/g)) {
      return 'edge'
    } else if (testUa(/chrome/g)) {
      return 'chrome'
    }
    return supporter
  }

  // mock数据，暂留
  function getMockData() {
    return {
      pnr: '',
      airlinePnr: '',
      segments: [
        {
          index: '1',
          departure: {
            airportCode: 'SZX',
            date: '2022-10-17',
            time: '12:00',
          },
          arrival: {
            airportCode: 'HKG',
            date: '2022-10-17',
            time: '12:30',
          },
          airlineCode: 'CX',
          flightNo: 'CX9808',
          bunkCode: 'Y1',
          status: 'HK',
          codeShare: true,
          opFlightNo: '3A000',
        },
      ],
      passengers: [],
    }
  }
  // Your code here...
})()
