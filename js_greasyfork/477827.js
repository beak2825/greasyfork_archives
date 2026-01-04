// ==UserScript==
// @name         千川计划监控助手
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  内部使用
// @author       You
// @match        *://qianchuan.jinritemai.com/promotion?aavid=*
// @match        *://qianchuan.jinritemai.com/promotion-v2/standard?aavid=*
// @match        *://qianchuan.jinritemai.com/promotion-v2/campaign/detail?aavid=*
// @match        *://qianchuan.jinritemai.com/data-report/evaluation/today-live?aavid=*
// @match        *://qianchuan.jinritemai.com/data-report/live-analysis?aavid=*
// @match        *://qianchuan.jinritemai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/477827/%E5%8D%83%E5%B7%9D%E8%AE%A1%E5%88%92%E7%9B%91%E6%8E%A7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/477827/%E5%8D%83%E5%B7%9D%E8%AE%A1%E5%88%92%E7%9B%91%E6%8E%A7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

; (function () {
  'use strict'
  initUI()
  window.addEventListener('load', function () {
    // 页面加载完成后执行的代码
    console.log('Page has finished loading. Now you can execute your script here.')
    setTimeout(main, 2000)
  })

  //main function end
})()//油猴匿名函数结尾
function main() {
  var intervalID, intervalID2
  if (window.location.pathname == '/promotion-v2/standard') {
    //开始计划监控
    //initPlanguard() 废弃方法

    plan()
    var id
    //监控local计划状态
    intervalID = setInterval(() => {
      plan()
      var jkStatus = localStorage.getItem("jiankong")
      if (jkStatus == "监控中") {

        if (!id) {
          console.log("开启自动刷新")
          //startCountdown()
          id = setTimeout(() => {
            location.reload(true)

          }, 60 * 1000)
        }

      } else {
        if (id) {
          clearTimeout(id)
          id = null
        }

      }



    }, 500)
  }
  if (window.location.pathname == '/data-report/live-analysis' && window.location.search.split('&')[0] == '?aavid=1722376054715406') {
    //2户今日直播
    intervalID = setInterval(todayRoi, 1000)
    localStorage.setItem('lastCost', '初始化')
    speed()
    intervalID2 = setInterval(speed, 1000 * 60)
  }
  if (window.location.pathname == '/data-report/live-analysis' && window.location.search.split('&')[0] == '?aavid=1766218845797383') {
    //蛋壳今日直播
    intervalID = setInterval(setLocal, 1000)
  }
  if (window.location.pathname == '/createV2/feed-live-auto' && window.location.search.includes('create')) {
    //新建-托管
    intervalID = setInterval(autoTuoguanPlanName, 1000)
    addrandomtltlebtnTuoguan()
    //点击计划名停止循环识别计划名
    document.querySelector('#baseInfo > div:nth-child(2) > div > div.limit-input > div > div > input').addEventListener('click', () => {
      clearInterval(intervalID)
    })
  }
  if (window.location.pathname == '/createV2/feed-live-standard' && window.location.search.includes('create')) {
    //新建-自定义

    //监听点击类目事件
    addlistener()
    //添加按钮
    addbtn()
    var id
    // id = '#yijianbtn'
    // addlistenerbyselec(id, autoVideo)
    id = '#addOnetitle'
    addlistenerbyselec(id, addonetitlefun)
    intervalID = setInterval(autoZidingyiPlanName, 1000)
    intervalID2 = setInterval(() => {
      try {
        //点击计划名停止循环识别计划名
        document.querySelector('#baseInfo > div.container > div:nth-child(2) > div.bui-tabs-content > div > div:nth-child(1) > div > div.limit-input > div > div > input').addEventListener('click', () => {
          clearInterval(intervalID)
        })
        clearInterval(intervalID2)
      } catch { }
    }, 1000)
  }
}

function plan() {
  //获取list对象

  let buget, cost, percent, bugetElement, percentInt,roi,ctr,cvr
  percent = 0
  var listElement = document.querySelector(
    '.ovui-table__body-wrapper .ovui-table tbody'
  )
  var percentElement

  for (let i = 0; i < listElement.childElementCount; i++) {
    var planName = listElement.children[i].children[2].children[0].children[0].textContent
    try {
      var cpmElement = document.querySelector(
    '.ovui-table__body-wrapper .ovui-table tbody tr:nth-child('+(i+1)+') td:nth-child(10)'
      ).textContent

      //#app > div > div.app-content > div.content-body > div.right-content > div > div:nth-child(3) > div.content > div:nth-child(3) > div > div.table-container > div > div > div.ovui-table__container.ovui-table__container--sticky.qc-table-inner-ui-table > div.ovui-table__body-wrapper > table > tbody > tr:nth-child(2) > td:nth-child(10)
      var cpmValue = parseFloat(cpmElement.textContent.replace(/,/g, ''))

      if (cpmValue > 290 || (cpmValue < 100 && cpmValue > 0)) {
        cpmElement.style.color = 'red'
      } else {
        cpmElement.style.color = 'black'
      }
    } catch { }
    ctr = Number(document.querySelector('div.ovui-table__body-wrapper table tr:nth-child('+(i+1)+') td:nth-child(13)').textContent.split("%")[0])
    cvr = Number(document.querySelector('div.ovui-table__body-wrapper table tr:nth-child('+(i+1)+') td:nth-child(14)').textContent.split("%")[0])





    buget = Number(listElement.children[i].children[4].children[0].children[0].children[0].children[0].children[0].children[0].children[1].textContent.replace(/,/g, ''))

    cost = Number(listElement.children[i].children[7].textContent.replace(/,/g, ''))
    roi = parseFloat(listElement.children[i].children[8].textContent)

    percentElement = document.querySelector(".ovui-table__body-wrapper .ovui-table tbody tr:nth-child("+(i+1)+") td:nth-child(5) .oc-space.oc-space-horizontal.oc-space-align-center.oc-item-group-description.oc-flex.oc-flex-right")

    percent = (cost / buget).toFixed(2)

    percentInt = (percent * 100).toFixed(0)

    if (percentInt > 75) {
      //消耗大于75%
      percentElement.style.color = 'red'
    } else {
      percentElement.style.color = '#999'
    }
    percentElement.textContent = '已消耗：' + percentInt.toString() + '%'
    //关停计划
    if (localStorage.getItem("jiankong") == '监控中') {
      costGoal = parseFloat(document.querySelector("#costInput1").value.trim())
      roiGoal = parseFloat(document.querySelector("#roiInput1").value.trim())
      var costGoal2, roiGoal2
      costGoal2 = parseFloat(document.querySelector("#costInput2").value.trim())
      roiGoal2 = parseFloat(document.querySelector("#roiInput2").value.trim())
      if ((roi <= roiGoal && cost > costGoal) || (roi <= roiGoal2 && cost > costGoal2)) {
        if (listElement.children[i].querySelector(".ovui-switch--checked")) {
          listElement.children[i].querySelector(".ovui-switch--checked").click()
          var id = document.querySelector("tbody tr:nth-child("+(i+1)+") .ad-id").textContent
          appendLog(id,cost,roi)



      }

      }
    }
    //标红计划名
    if ((roi < 1.25 && cost > 1000) || (roi == 0 && cost > 300)) {
      //【ROI不达标】【不出单】

      //关停计划
      var roiGoal, costGoal, eleCb



      listElement.children[i].children[2].children[0].children[0].style.color = 'red'

      console.log(cost, roi, '不达标')
      if (planName.split('【注意！！】').length > 1) {
      } else {
        listElement.children[i].children[2].children[0].children[0].textContent = '【注意！！】' + planName
      }
    } else {
      listElement.children[i].children[2].children[0].children[0].style.color = 'black'
      if (planName.split('【注意！！】').length > 1) {
        listElement.children[i].children[2].children[0].children[0].textContent = planName.split('【注意！！】')[1]
      }
    }
    //标红ROI
    if ((roi > 0 && roi < 1.3) || (cost > 350 && roi == 0)) {
      //ROI标记

      listElement.children[i].children[8].style.color = 'red'
    } else {
      listElement.children[i].children[8].style.color = 'black'
    }
  } //for 列表结尾
}

function todayRoi() {
  var gmv, coupon, cost
  gmv = Number(
    document
      .querySelector('#qc-pro-data-fe-app-wrapper > div > div > div > div.page-layout-content.byted-layout-content > div > div.today-live-home > div:nth-child(1) > div > div.container > div:nth-child(1) > div.metrics__body > div:nth-child(2) > div > div.metric-value')
      .textContent.replace(/,/g, '')
  )
  coupon = Number(
    document
      .querySelector('#qc-pro-data-fe-app-wrapper > div > div > div > div.page-layout-content.byted-layout-content > div > div.today-live-home > div:nth-child(1) > div > div.container > div:nth-child(2) > div.metrics__body > div:nth-child(1) > div > div.metric-value')
      .textContent.replace(/,/g, '')
  )
  cost = Number(
    document
      .querySelector('#qc-pro-data-fe-app-wrapper > div > div > div > div.page-layout-content.byted-layout-content > div > div.today-live-home > div:nth-child(1) > div > div.container > div:nth-child(2) > div.metrics__body > div:nth-child(2) > div > div.metric-value')
      .textContent.replace(/,/g, '')
  )

  var data = localStorage.getItem('item')
  console.log('蛋壳消耗：' + JSON.parse(data).cost + '智能优惠券：' + JSON.parse(data).coupon)
  cost = JSON.parse(data).cost + parseInt(cost)
  coupon = JSON.parse(data).coupon + parseInt(coupon)

  var realRoi = ((gmv + coupon) / cost).toFixed(2)
  document.querySelector('#qc-pro-data-fe-app-wrapper > div > div > div > div.page-layout-content.byted-layout-content > div > div.today-live-home > div:nth-child(1) > div > div.container > div:nth-child(2) > div.metrics__body > div:nth-child(3) > div > div.metric-value').textContent =
    realRoi.toString()
  var totalroiele = document.querySelector('#qc-pro-data-fe-app-wrapper > div > div > div > div.page-layout-content.byted-layout-content > div > div.today-live-home > div:nth-child(1) > div > div.container > div:nth-child(2) > div.metrics__body > div:nth-child(3) > div > div.metric-name > span')
  totalroiele.style.color = 'red'
  totalroiele.textContent = '今日整体总ROI'
}

function setLocal() {
  var cost = document
    .querySelector('#qc-pro-data-fe-app-wrapper > div > div > div > div.page-layout-content.byted-layout-content > div > div.today-live-home > div:nth-child(1) > div > div.container > div:nth-child(2) > div.metrics__body > div:nth-child(2) > div > div.metric-value')
    .textContent.replace(/,/g, '')
  var coupon = document
    .querySelector('#qc-pro-data-fe-app-wrapper > div > div > div > div.page-layout-content.byted-layout-content > div > div.today-live-home > div:nth-child(1) > div > div.container > div:nth-child(2) > div.metrics__body > div:nth-child(1) > div > div.metric-value')
    .textContent.replace(/,/g, '')

  localStorage.setItem('item', '{"cost":' + cost + ',"coupon":' + coupon + '}')
}

function speed() {
  var cost, lastCost, costPerMin
  cost = Number(
    document
      .querySelector('#qc-pro-data-fe-app-wrapper > div > div > div > div.page-layout-content.byted-layout-content > div > div.today-live-home > div:nth-child(1) > div > div.container > div:nth-child(2) > div.metrics__body > div:nth-child(2) > div > div.metric-value')
      .textContent.replace(/,/g, '')
  )
  if (localStorage.getItem('lastCost') != '初始化') {
    lastCost = parseInt(localStorage.getItem('lastCost'))

    costPerMin = cost - lastCost
    document.querySelector('#qc-pro-data-fe-app-wrapper > div > div > div > div.page-layout-content.byted-layout-content > div > div.today-live-home > div:nth-child(1) > div > div.container > div:nth-child(2) > div.metrics__body > div:nth-child(5) > div > div.metric-name > span').textContent =
      '分钟流速'
    document.querySelector('#qc-pro-data-fe-app-wrapper > div > div > div > div.page-layout-content.byted-layout-content > div > div.today-live-home > div:nth-child(1) > div > div.container > div:nth-child(2) > div.metrics__body > div:nth-child(5) > div > div.metric-value').textContent = costPerMin
      .toFixed(2)
      .toString()
    localStorage.setItem('lastCost', cost.toString())
  } else {
    document.querySelector('#qc-pro-data-fe-app-wrapper > div > div > div > div.page-layout-content.byted-layout-content > div > div.today-live-home > div:nth-child(1) > div > div.container > div:nth-child(2) > div.metrics__body > div:nth-child(5) > div > div.metric-name > span').textContent =
      '分钟流速'
    document.querySelector('#qc-pro-data-fe-app-wrapper > div > div > div > div.page-layout-content.byted-layout-content > div > div.today-live-home > div:nth-child(1) > div > div.container > div:nth-child(2) > div.metrics__body > div:nth-child(5) > div > div.metric-value').textContent = '计算中...'
    if (parseInt(cost) > 0) {
      localStorage.setItem('lastCost', cost.toString())
    }
  }
}
function autoName() {
  //大类 托管/自定义
  var category = document.querySelector('#create-app > div.byted-layout > div > div > div > div > div.middle-part > div > div > div > div:nth-child(4) > span.content').textContent
  if (category == '托管') {
    autoTuoguan()
  } else {
    autoZidingyiPlanName()
  }
}
function autoTuoguanPlanName() {
  var sex, age, action
  var dingxiang = ''
  var date = new Date()
  var today = date.getFullYear().toString().slice(-2) + '.' + (date.getMonth() + 1).toString() + '.' + date.getDate().toString()
  var priceOffer = ''
  //控制成本投放 or 放量投放
  var model = document.querySelector('#deliveryStrategyCmd > div.tab-content-wrapper > div:nth-child(2) > div > div.container.normal > div:nth-child(1) > div > div.biz-radio-items.selected').textContent
  //ROI or 成交
  var type = document.querySelector('#deliveryStrategyCmd > div.tab-wrapper > div.tab.active > div > span').textContent
  var liveor
  //判断模式
  if (type == '支付ROI ') {
    if (model == ' 控成本投放 ') {
      model = '控成本'
      type = 'ROI'
      priceOffer = document.querySelector('#deliveryStrategyCmd > div.tab-content-wrapper > div:nth-child(4) > div > div.bid-wrapper > div > div.input-box.bid-input > div.byted-input.byted-input-md.byted-input-filled > input').value
    } else {
      //放量，无ROI设置
      model = '放量'
      type = 'ROI'
      priceOffer = ''
    }
  } else {
    //直播间成交
    if (model == ' 控成本投放 ') {
      model = '控成本'
      type = '成交'
      priceOffer = document.querySelector('#deliveryStrategyCmd > div.tab-content-wrapper > div:nth-child(5) > div > div.bid-wrapper > div > div.input-box.bid-input > div.byted-input.byted-input-md.byted-input-suffix.byted-input-filled > input').value
    } else {
      //放量，无出价设置
      model = '放量'
      type = '成交'
      priceOffer = ''
    }
  }

  //不限 男 女
  try {
    sex = document.querySelector('#audience > div.demo-form-grid > div:nth-child(2) > div:nth-child(1) > div.c-audience-gender-select > div > div:nth-child(1) > div > div.biz-radio-items.selected').textContent.trim()
  } catch {
    sex = '不限'
  }
  if (sex == '不限') {
    sex = ''
  }
  //不限 18-23 24-30 31-40 41-49 50+
  try {
    age = document.querySelectorAll('.card.cardChosen.checkbox.normal')[0].textContent.trim()
  } catch {
    age = '不限'
  }

  if (age == '不限') {
    age = ''
  } else {
    var len = document.querySelectorAll('.card.cardChosen.checkbox.normal').length
    age = document.querySelectorAll('.card.cardChosen.checkbox.normal')[0].textContent.trim().slice(0, 2) + document.querySelectorAll('.card.cardChosen.checkbox.normal')[len - 1].textContent.trim().slice(-2)
  }

  //不限 系统推荐
  try {
    action = document.querySelector('#audience > div.demo-form-grid > div:nth-child(4) > div:nth-child(1) > div.c-common-action-interest > div > div:nth-child(1) > div > div.biz-radio-items.selected').textContent.trim()
  } catch {
    action = '不限'
  }

  if (action == '不限') {
    action = ''
  }

  if (sex == '' && age == '' && action == '') {
    dingxiang = '不限'
  } else {
    dingxiang = action + sex + age
  }

  console.log(dingxiang)
  if (priceOffer == '') {
    priceOffer = '*'
  }
  liveor = liveOrvideo()

  var planName = today + '-' + (model + type) + '-' + priceOffer + '-' + dingxiang + '-' + liveor
  document.querySelector('#baseInfo > div:nth-child(2) > div > div.limit-input > div > div > input').value = planName
  document.querySelector('#baseInfo > div:nth-child(2) > div > div.limit-input > div > div > input').dispatchEvent(new Event('input'))
}

function autoZidingyiPlanName() {
  var area = ''
  var sex = ''
  var age = ''
  var action = ''
  var dingxiang = ''
  var date = new Date()
  var today = date.getFullYear().toString().slice(-2) + '.' + (date.getMonth() + 1).toString() + '.' + date.getDate().toString()
  var priceOffer = ''
  //控制成本投放 or 放量投放 ' 控成本投放 '  ' 支付ROI        '   ' 放量投放 '
  var model = document.querySelector('#deliveryStrategyCmd > div:nth-child(2) > div > div.smart-bid-type-wrapper > div > div.radio.smart-bid-type-radio-button.checked').textContent
  //ROI or 成交
  var type = document.querySelector('#deliveryStrategyCmd > div:nth-child(3) > div > div.external-action-wrapper > div > div:nth-child(1) > div.row > div.radio.external-action-radio-button.checked').textContent

  if (type == ' 支付ROI        ') {
    type = 'ROI'
  } else {
    type = '成交'
  }

  if (model == ' 放量投放 ') {
    model = '放量'
    priceOffer = '*'
  } else {
    model = '控成本'
    if (type == 'ROI') {
      priceOffer = document.querySelector('#deliveryStrategyCmd > div:nth-child(11) > div > div.bid-wrapper > div > div.input-box.bid-input > div.byted-input.byted-input-md.byted-input-filled > input').value
    } else {
      //成交出价
      priceOffer = document.querySelector('#deliveryStrategyCmd > div:nth-child(10) > div > div.bid-wrapper > div > div.input-box.bid-input > div.byted-input.byted-input-md.byted-input-suffix.byted-input-filled > input').value
    }
  }

  dingxiang = document.querySelector('#audience > div.tab-container > div:nth-child(2) > div.bui-tabs-content > div > div > div > div.container > div > div:nth-child(1) > div > div.biz-radio-items.selected').textContent.trim()
  if (dingxiang == '自定义定向') {
    area = document
      .querySelector('#audience > div.tab-container > div:nth-child(2) > div.bui-tabs-content > div > div.demo-form-grid > div:nth-child(1) > div:nth-child(1) > div.c-audience-area-select > div > div.container.interval.normal > div:nth-child(1) > div > div.biz-radio-items.selected')
      .textContent.trim()
    if (area != '不限') {
      area = '地域'
    } else {
      area = ''
    }

    sex = document.querySelector('#audience > div.tab-container > div:nth-child(2) > div.bui-tabs-content > div > div.demo-form-grid > div:nth-child(2) > div:nth-child(1) > div.c-audience-gender-select > div > div:nth-child(1) > div > div.biz-radio-items.selected').textContent.trim()
    if (sex == '不限') {
      sex = ''
    }
    //不限 18-23 24-30 31-40 41-49 50+
    try {
      age = document.querySelectorAll('#audience > div.tab-container > div:nth-child(2) > div.bui-tabs-content > div > div.demo-form-grid > div:nth-child(3) > div:nth-child(1) > div.list-checkbox-wrapper > div > div > .cardChosen')[0].textContent.trim()
    } catch {
      age = '不限'
    }

    if (age == '不限') {
      age = ''
    } else {
      var len = document.querySelectorAll('#audience > div.tab-container > div:nth-child(2) > div.bui-tabs-content > div > div.demo-form-grid > div:nth-child(3) > div:nth-child(1) > div.list-checkbox-wrapper > div > div > .cardChosen').length
      age =
        document.querySelectorAll('#audience > div.tab-container > div:nth-child(2) > div.bui-tabs-content > div > div.demo-form-grid > div:nth-child(3) > div:nth-child(1) > div.list-checkbox-wrapper > div > div > .cardChosen')[0].textContent.trim().slice(0, 2) +
        document.querySelectorAll('#audience > div.tab-container > div:nth-child(2) > div.bui-tabs-content > div > div.demo-form-grid > div:nth-child(3) > div:nth-child(1) > div.list-checkbox-wrapper > div > div > .cardChosen')[len - 1].textContent.trim().slice(-2)
    }

    action = document.querySelector('#audience > div.tab-container > div:nth-child(2) > div.bui-tabs-content > div > div.demo-form-grid > div:nth-child(4) > div:nth-child(1) > div.c-common-action-interest > div > div:nth-child(1) > div > div.biz-radio-items.selected').textContent.trim()
    if (action == '不限') {
      action = ''
    } else if (action.includes('自定义')) {
      action = '莱卡'
    } else {
      action = '系统推荐'
    }
    dingxiang = action + sex + age + area
  }

  var planName = today + '-' + model + type + '-' + priceOffer + '-' + dingxiang
  document.querySelector('#baseInfo > div.container > div:nth-child(2) > div.bui-tabs-content > div > div:nth-child(1) > div > div.limit-input > div > div > input').value = planName
  document.querySelector('#baseInfo > div.container > div:nth-child(2) > div.bui-tabs-content > div > div:nth-child(1) > div > div.limit-input > div > div > input').dispatchEvent(new Event('input'))
}

function categoryClick() {
  var ele
  //settimeout实现自循环，直到三个都成功点击
  try {
    ele = document.querySelectorAll('.bui-cascader-menu-list')[0].children[27]
    ele.click()
    ele = document.querySelectorAll('.bui-cascader-menu-list')[1].children[1]
    ele.click()
    ele = document.querySelectorAll('.bui-cascader-menu-list')[2].children[2]
    ele.click()
  } catch {
    setTimeout(categoryClick, 500)
  }

  document.querySelector('#creative > div.collapse-more.byted-collapse.is-expand.is-custom > div.collapse-content > div:nth-child(1) > div > div.selector > div > div.bui-select-wrapper > input').removeEventListener('click', categoryClick, true)
}

function addlistener() {
  addlistenerbyselec('#creative > div.collapse-more.byted-collapse.is-expand.is-custom > div.collapse-content > div:nth-child(1) > div > div.selector > div > div.bui-select-wrapper > input', categoryClick)
  addlistenerbyselec('#creative > div.collapse-more.byted-collapse.is-expand.is-custom > div.collapse-content > div:nth-child(2) > div > div.creative-tags > div > div.input-area > div > input', ideaWord)
}

function ideaWord() {
  var wordinput = document.querySelector('#creative > div.collapse-more.byted-collapse.is-expand.is-custom > div.collapse-content > div:nth-child(2) > div > div.creative-tags > div > div.input-area > div > input')
  wordinput.click()
  wordinput.value = '美白 淡斑 果酸水 大白瓶 hfp HFP 美妆 护肤'
  wordinput.dispatchEvent(new Event('input'))
  document.querySelector('#creative > div.collapse-more.byted-collapse.is-expand.is-custom > div.collapse-content > div:nth-child(2) > div > div.creative-tags > div > div.input-area > div > input').removeEventListener('click', ideaWord, true)
}

function autoVideo() {
  //控成本
  clickbyele('#deliveryStrategyCmd > div:nth-child(2) > div > div.smart-bid-type-wrapper > div > div:nth-child(1)')
  //直播间成交
  clickbyele('#deliveryStrategyCmd > div:nth-child(3) > div > div.external-action-wrapper > div > div:nth-child(1) > div.row > div:nth-child(3)')
  //设置预算
  inputbyele('#deliveryStrategyCmd > div:nth-child(9) > div > div.budget-wrapper > div > div > div.byted-input.byted-input-md.byted-input-suffix.byted-input-filled > input', 800)
  //设置出价
  inputbyele('#deliveryStrategyCmd > div:nth-child(10) > div > div.bid-wrapper > div > div.input-box.bid-input > div.byted-input.byted-input-md.byted-input-suffix.byted-input-filled > input', 240)
  //点击视频
  window.scrollTo(0, 1500)
  clickbyele('#creative > div.form-item-container._formily.vertical > div > div.tab-change-wrapper > div > div.tab-change > div:nth-child(2)')
  //点击程序化创意
  clickbyele('#creative > div:nth-child(3) > div > div.tab-change-wrapper > div > div.tab-change > div:nth-child(2)')
  //点击添加视频
  clickbyele('#creative > div:nth-child(5) > div > div.procedure-creative > div > div > div.material-container > div.drawer-select-box > div.left-box > div > button > div > span')
  //选择视频来源框
  clickbyele(
    'body > div.drawer-selector.byted-drawer.byted-drawer-right.byted-drawer-no-header.v-transfer-dom > div > div > div.drawer-body > div > div.bui-tabs-content > div.bui-tab-pane.active > div > div.tab-search-container > div.byted-select.byted-select-md.byted-select-md.byted-select-filled.video-select-common.source-select > div.bui-select-wrapper > input'
  )
  //本地上传
  clickbyele('body > div.bui-popper.bui-select-popper > div > div > div:nth-child(2) > div > div')
  //输入3.0（好大儿）
  inputbyele(
    'body > div.drawer-selector.byted-drawer.byted-drawer-right.byted-drawer-no-header.v-transfer-dom > div > div > div.drawer-body > div > div.bui-tabs-content > div.bui-tab-pane.active > div > div.tab-search-container > div.byted-popover-wrapper > div:nth-child(2) > div > input',
    '7263300332045615164'
  )
  //选择好大儿
  //clickbyele('body > div.drawer-selector.byted-drawer.byted-drawer-right.byted-drawer-no-header.v-transfer-dom > div > div > div.drawer-body > div > div.bui-tabs-content > div.bui-tab-pane.active > div > div.material-virtual-list > div.material-virtual-viewport > div > div.material-row > div')
  //add58()
  addvideo('7263300332045615164').then(() => {
    addvideo('7275922874421313575').then(() => {
      addvideo('7284092663909122108').then(() => {
        addvideo('7280820331912740918').then(() => {
          addvideo('7291170281821585465').then(() => {
            addvideo('7280420241095508025').then(() => {
              addvideo('7248943196816982053').then(() => {
                addvideo('7281191927297998907').then(() => {
                  addvideo('7290796693129314360').then(() => {
                    //9素材完成，点击确认
                    document.querySelector('body > div.drawer-selector.byted-drawer.byted-drawer-right.byted-drawer-no-header.v-transfer-dom > div > div > footer > div.drawer-footer-btns > button.bui-btn.bui-btn-primary.byted-button.bui-btn-md').click()
                    waitVideo().then(() => {
                      clicktitle().then(() => {
                        clickaddtitle().then(() => {
                          inputTitle()
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })
}
function addlistenerbyselec(sele, func) {

  var id = setInterval(() => {
    try {
      document.querySelector(sele).addEventListener('click', func, true)
      clearInterval(id)
    } catch {
      console.log(sele, "添加监听事件失败！")

    }

  }, 1000);



}
function addbtn() {


  var id = setInterval(() => {
    try {
      /*if(!document.querySelector('#deliveryStrategyCmd > div:nth-child(2) > div > div.smart-bid-type-wrapper > div').children[2]){
          document.querySelector('#deliveryStrategyCmd > div:nth-child(2) > div > div.smart-bid-type-wrapper > div > div:nth-child(2)').insertAdjacentHTML('afterend', '<button id="yijianbtn" class="smart-bid-type-radio-button">一键计划</button>')
      }*/
      if (!document.querySelector("#creative > div.form-item-container._formily.vertical > div > div.tab-change-wrapper > div > div.tab-change").children[2]) {
        document.querySelector("#creative > div:nth-child(2) > div > div.tab-change-wrapper > div > div.tab-change > div:nth-child(2)").insertAdjacentHTML("afterend", "<button id='addOnetitle'>添加3个随机标题</button>")
      }
      clearInterval(id)
    } catch {
      console.log('添加按钮失败')

    }
  }, 1000);


}
function clickbyele(sele) {
  var interid = setInterval(() => {
    if (document.querySelector(sele)) {
      document.querySelector(sele).click()
      clearInterval(interid)
    }
  }, 1000)
}
function inputbyele(sele, val) {
  var interid = setInterval(() => {
    if (document.querySelector(sele)) {
      document.querySelector(sele).value = val
      document.querySelector(sele).dispatchEvent(new Event('input'))
      clearInterval(interid)
    }
  }, 1000)
}

function addvideo(id) {
  return new Promise(function (resolve, reject) {
    var interid = setInterval(() => {
      //输入
      //判断输入框此时的内容，不等于本次ID才输入
      var inputval = document.querySelector(
        'body > div.drawer-selector.byted-drawer.byted-drawer-right.byted-drawer-no-header.v-transfer-dom > div > div > div.drawer-body > div > div.bui-tabs-content > div.bui-tab-pane.active > div > div.tab-search-container > div.byted-popover-wrapper > div:nth-child(2) > div > input'
      ).value
      if (inputval != id) {
        document.querySelector(
          'body > div.drawer-selector.byted-drawer.byted-drawer-right.byted-drawer-no-header.v-transfer-dom > div > div > div.drawer-body > div > div.bui-tabs-content > div.bui-tab-pane.active > div > div.tab-search-container > div.byted-popover-wrapper > div:nth-child(2) > div > input'
        ).value = id
        document
          .querySelector(
            'body > div.drawer-selector.byted-drawer.byted-drawer-right.byted-drawer-no-header.v-transfer-dom > div > div > div.drawer-body > div > div.bui-tabs-content > div.bui-tab-pane.active > div > div.tab-search-container > div.byted-popover-wrapper > div:nth-child(2) > div > input'
          )
          .dispatchEvent(new Event('input'))
      }

      //等待加载
      console.log('等待searchbox只有一个元素再点击')

      var ele = document.querySelector(
        'body > div.drawer-selector.byted-drawer.byted-drawer-right.byted-drawer-no-header.v-transfer-dom > div > div > div.drawer-body > div > div.bui-tabs-content > div.bui-tab-pane.active > div > div.material-virtual-list > div.material-virtual-viewport > div > div.material-row > div > div.selected-con'
      )
      var flag
      if (ele) {
        flag = false
      } else {
        flag = true
      }

      if (
        document.querySelector(
          'body > div.drawer-selector.byted-drawer.byted-drawer-right.byted-drawer-no-header.v-transfer-dom > div > div > div.drawer-body > div > div.bui-tabs-content > div.bui-tab-pane.active > div > div.material-virtual-list > div.material-virtual-viewport > div > div.material-row'
        ).childElementCount == 1 &&
        flag
      ) {
        //点击
        console.log('点击视频')

        document
          .querySelector(
            'body > div.drawer-selector.byted-drawer.byted-drawer-right.byted-drawer-no-header.v-transfer-dom > div > div > div.drawer-body > div > div.bui-tabs-content > div.bui-tab-pane.active > div > div.material-virtual-list > div.material-virtual-viewport > div > div.material-row > div'
          )
          .click()
        flag = false
      }

      if (ele.textContent == '') {
        console.log('素材选择完毕')

        clearInterval(interid)
        resolve()
      }
    }, 500)
  })
}
function clicktitle() {
  return new Promise((resolve, reject) => {
    var id = setInterval(() => {
      if (
        document.querySelector('#creative > div:nth-child(5) > div > div.procedure-creative > div > div > div.side-tabs > div.side-tab-item.selected-tab').textContent.includes('创意素材') &&
        document.querySelector('#creative > div:nth-child(5) > div > div.procedure-creative > div > div > div.side-tabs > div:nth-child(1) > div.title-num > span.curNum').textContent != '0'
      ) {
        document.querySelector('#creative > div:nth-child(5) > div > div.procedure-creative > div > div > div.side-tabs > div:nth-child(2) > div.title-text').click()
      }
      if (document.querySelector('#creative > div:nth-child(5) > div > div.procedure-creative > div > div > div.side-tabs > div.side-tab-item.selected-tab').textContent.includes('创意标题')) {
        resolve()
        clearInterval(id)
        console.log('点击创意标题完毕')
      }
    }, 500)
  })

  //此方法可以随机从标题库中获取3个标题
  //
}
function clickaddtitle() {
  //右侧添加标题按钮
  return new Promise((resolve, reject) => {
    var id = setInterval(() => {
      if (parseInt(document.querySelector('#creative > div:nth-child(5) > div > div.procedure-creative > div > div > div.side-tabs > div.side-tab-item.selected-tab > div.title-num > span.curNum').textContent) < 3) {
        document.querySelector('#creative > div:nth-child(5) > div > div.procedure-creative > div > div > div.titles-box > button:nth-child(1) > div > span').click()
      } else {
        resolve()
        clearInterval(id)
      }
    }, 500)
  })
}

function inputTitle() {
  let titleNames = [
    '磨皮美白的果酸水乳正在抢购中！',
    '【美白嫩肤】福利仅剩：2',
    'HFP官方直播间，11.11提前购，错过后悔！',
    '【双十一大狂欢】遇见美好，自带滤镜#HFP白得快CP，养出素颜好气色',
    '【双十一提前购】福利仅剩：2!',
    '【美白嫩肤】水+乳，特惠中！',
    '【双11提前购】福利仅剩：3',
    '磨皮美白，福利剩余：3',
    '【双十一提前购】福利仅剩：1!'
  ]
  var names = titleNames.sort(() => Math.random() - 0.5).slice(0, 3)
  for (let i = 0; i < 3; i++) {
    if (document.querySelector('#creative > div:nth-child(5) > div > div.procedure-creative > div > div > div.titles-box > div').childNodes[i].querySelector('input').value == '') {
      document.querySelector('#creative > div:nth-child(5) > div > div.procedure-creative > div > div > div.titles-box > div').childNodes[i].querySelector('input').value = names[i]
      document.querySelector('#creative > div:nth-child(5) > div > div.procedure-creative > div > div > div.titles-box > div').childNodes[i].querySelector('input').dispatchEvent(new Event('input'))
    }
  }
}
function waitVideo() {
  return new Promise((resolve, reject) => {
    var id = setInterval(() => {
      if (
        document.querySelector('#creative > div:nth-child(5) > div > div.procedure-creative > div > div > div.side-tabs > div.side-tab-item.selected-tab').textContent.includes('创意素材') &&
        document.querySelector('#creative > div:nth-child(5) > div > div.procedure-creative > div > div > div.side-tabs > div:nth-child(1) > div.title-num > span.curNum').textContent != '0'
      ) {
        resolve()
        clearInterval(id)
      }
    }, 500)
  })
}

async function addonetitlefun() {
  console.log('add title click')
  await clickaddtitle()
  inputTitle()

}

function addrandomtltlebtnTuoguan() {
  var id = setInterval(() => {
    if (document.querySelector("#creative > div:nth-child(2) > div > div.list-checkbox > div:nth-child(2)")) {
      //在这里写判断条件和执行操作
      document.querySelector("#creative > div:nth-child(2) > div > div.list-checkbox > div:nth-child(2)").insertAdjacentHTML("afterend", "<button id='tgttbtn'>添加三个标题</button>")
      document.querySelector("#tgttbtn").addEventListener('click', tgaddtitle)


      clearInterval(id)
    }
  }, 500)
}
async function tgaddtitle() {
  //点击左侧标题
  document.querySelector("#creative .side-tab-item:nth-child(2)").click()
  //点击添加标题
  await clicktgaddtitle()
  //input标题
  inputTitleTuoguan()

}
function clicktgaddtitle() {
  //右侧添加标题按钮
  return new Promise((resolve, reject) => {
    var id = setInterval(() => {
      if (parseInt(document.querySelector(".side-tab-item:nth-child(2) .curNum").textContent) < 3) {
        document.querySelector("#creative > div:nth-child(4) > div > div.procedure-creative.procedure-creative-margin > div > div > div.titles-box > button:nth-child(1) > div > span").click()
      } else {
        resolve()
        clearInterval(id)
      }
    }, 500)
  })
}

function inputTitleTuoguan() {
  let titleNames = [
    '磨皮美白的果酸水乳正在抢购中！',
    '【美白嫩肤】福利仅剩：2',
    'HFP官方直播间，11.11提前购，错过后悔！',
    '【双十一大狂欢】遇见美好，自带滤镜#HFP白得快CP，养出素颜好气色',
    '【双十一提前购】福利仅剩：2!',
    '【美白嫩肤】水+乳，特惠中！',
    '【双11提前购】福利仅剩：3',
    '磨皮美白，福利剩余：3',
    '【双十一提前购】福利仅剩：1!',

  ]
  var names = titleNames.sort(() => Math.random() - 0.5).slice(0, 3)
  for (let i = 0; i < 3; i++) {
    if (document.querySelector('#creative > div:nth-child(4) > div > div.procedure-creative.procedure-creative-margin > div > div > div.titles-box > div').childNodes[i].querySelector('input').value == '') {
      console.log(names[i], "添加标题")
      document.querySelector('#creative > div:nth-child(4) > div > div.procedure-creative.procedure-creative-margin > div > div > div.titles-box > div').childNodes[i].querySelector('input').value = names[i]
      document.querySelector('#creative > div:nth-child(4) > div > div.procedure-creative.procedure-creative-margin > div > div > div.titles-box > div').childNodes[i].querySelector('input').dispatchEvent(new Event('input'))
    }
  }
}

//取选中视频的名字
//document.querySelector("div.selected-con").parentElement.querySelector(".video-player-file-name").textContent.trim()

function liveOrvideo() {
  var ele = document.querySelectorAll("#creative .content.chosenText")
  if (ele) {
    var text = ''
    for (var i = 0; i < ele.length; i++) {
      text += ele[i].textContent.trim();

    }

  } else {
    text = ''
  }

  if (text.includes("直播间画面") && text.includes("视频")) {
    text = "混投"
  } else if (text == "直播间画面") {
    text = "直投"
  } else if (text == "视频") {
    text = ""
  }

  return text
}


async function addcity() {
  var citys = `成都
  武汉
  温州
  南宁
  哈尔滨
  遵义
  盐城
  汕头
  沧州
  洛阳
  银川
  周口
  阿克苏
  宿迁
  江门
  喀什
  开封
  伊犁
  泰州
  新乡
  珠海
  驻马店
  滁州
  毕节
  亳州
  西宁
  六安
  宜春
  运城
  曲靖
  包头
  德阳
  凉山
  黄冈
  许昌
  邵阳
  安庆
  襄阳
  `.split('\n')

  for (let i = 0; i < citys.length; i++) {
    var city = citys[i];
    document.querySelector("body > div:nth-child(13) > div > div > div.content > div.search-frame.area-container > div.city-search.byted-auto-complete > div > input").value = city
    document.querySelector("body > div:nth-child(13) > div > div > div.content > div.search-frame.area-container > div.city-search.byted-auto-complete > div > input").dispatchEvent(new Event('input'))
    await sleep(500)
    document.querySelector("body > div.bui-popper.byted-auto-complete-popper > div > div > div > div > div").click()

  }
}

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time);
  })
}


function initPlanguard() {
  return new Promise((resolve) => {
    var id = setInterval(() => {


      //获取节点
      var ele = document.querySelector("#app > div > div.app-content > div.content-body > div.right-content > div > div:nth-child(3) > div.content > div:nth-child(3) > div > div.table-header-container > div.header-slot > div > div.oc-space.oc-space-horizontal.oc-space-align-center.left > div:nth-child(2) > div > div:nth-child(3) > div > span > div > div > button")
      if (ele) {
        //节点刷新成功，添加节点

        var eleCost = document.querySelector("#shutCost")
        if (!eleCost) {
          ele.insertAdjacentHTML("afterend", "<input id='shutCost' style='width:70px' placeholder='消耗'></input>")

        }
        var eleRoi = document.querySelector("#shutRoi")
        if (!eleRoi) {
          if (eleCost) { eleCost.insertAdjacentHTML("afterend", "<input id='shutRoi' style='width:70px' placeholder='Roi'></input>") }

        }
        var eleCb = document.querySelector("#shutcb")
        if (!eleCb) {
          var ckstatus = localStorage.getItem("jiankong")
          if (ckstatus == null) {
            ckstatus = "未监控"
          }
          eleRoi = document.querySelector("#shutRoi")


          if (ckstatus == "监控中") {

            if (eleCost) {
              eleCost.value = localStorage.getItem("costValue")
            }
            if (eleRoi) {
              eleRoi.value = localStorage.getItem("roiValue")
            }

          } else {
            if (document.querySelector("#shutcb")) {
              document.querySelector("#shutcb").checked = false
            }

          }



        }

        if (eleCost && eleCb && eleRoi) {
          console.log('组件渲染完成')
          resolve()
          clearInterval(id)

        }

      }
    }, 500);
  })

}


function startCountdown() {
  var count
  if (!document.querySelector("#app > div > div.app-content > div.content-body > div.right-content > div > div:nth-child(3) > div.content > div:nth-child(3) > div > div.table-header-container > div.header-slot > div > div.oc-space.oc-space-horizontal.oc-space-align-center.left > div:nth-child(2) > div > div:nth-child(3) > div > span > div > div > span")) {
    document.querySelector("#app > div > div.app-content > div.content-body > div.right-content > div > div:nth-child(3) > div.content > div:nth-child(3) > div > div.table-header-container > div.header-slot > div > div.oc-space.oc-space-horizontal.oc-space-align-center.left > div:nth-child(2) > div > div:nth-child(3) > div > span > div > div > div").insertAdjacentHTML('afterend', `<span></span>`)
  }



  var seconds = 60;
  count = document.querySelector("#app > div > div.app-content > div.content-body > div.right-content > div > div:nth-child(3) > div.content > div:nth-child(3) > div > div.table-header-container > div.header-slot > div > div.oc-space.oc-space-horizontal.oc-space-align-center.left > div:nth-child(2) > div > div:nth-child(3) > div > span > div > div > span")
  var countdown = setInterval(function () {
    if (seconds > 0) {
      count.textContent = seconds.toString()
      seconds--;
    } else {
      clearInterval(countdown);

    }
  }, 1000); // 1000 milliseconds = 1 second
}


function clickzdylie() {
  return new Promise(() => {

    var flag = false
    var id = setInterval(() => {
      var btn = document.querySelector("#app > div > div.app-content > div.content-body > div.right-content > div > div:nth-child(3) > div.content > div:nth-child(3) > div > div.table-header-container > div.header-slot > div > div.oc-space.oc-space-horizontal.oc-space-align-center.right > div:nth-child(2) > div > span > div > span > div > button")
      if (btn) {
        //在这里写判断条件和执行操作
        if (!flag) { btn.click() }




      }
    }, 500)
  })
}
function clickjhzs() {
  return new Promise(() => {
    var id = setInterval(() => {
      var btn = document.querySelectorAll('.oc-popover-body .item')
      if (btn) {
        //在这里写判断条件和执行操作
        for (let i = 0; i < btn.length; i++) {
          var ele = btn[i];
          if (ele.textContent == '计划监控助手') {
            ele.click()
            resolve()
            clearInterval(id)
          }
        }


      }
    }, 500)
  })
}
function promisedemo() {
  return new Promise(() => {
    var id = setInterval(() => {

      if (condition) {
        //在这里写判断条件和执行操作

        resolve()
        clearInterval(id)
      }
    }, 500)
  })
}

function initUI() {
  var showUiBtn = document.createElement('div')
  showUiBtn.style.backgroundColor = '#1A99EF'
  showUiBtn.style.color = 'white'
  showUiBtn.style.borderRadius = '15px'
  showUiBtn.style.position = 'fixed'
  showUiBtn.style.top = '65px'
  showUiBtn.style.right = '10px'
  showUiBtn.style.width = '120px'
  showUiBtn.style.height = '23px'
  showUiBtn.style.zIndex = 9999
  showUiBtn.innerHTML = `
  <span>打开/隐藏助手</span>
  `
  showUiBtn.style.textAlign = 'center'
  showUiBtn.style.cursor = 'pointer'
  document.body.appendChild(showUiBtn)
  showUiBtn.addEventListener('click', () => {
    if (customUI) {
      if (customUI.style.display == 'block') {
        customUI.style.display = 'none'
      } else {
        customUI.style.display = 'block'
      }
    } else {
      customUI.style.display = 'block'
    }
  })
  // 创建一个容器用于自定义界面
  var customUI = document.createElement('div')
  customUI.style.color = 'white'
  customUI.style.zIndex = 9999
  customUI.style.position = 'fixed'
  customUI.style.top = '105px'
  customUI.style.right = '10px'
  customUI.style.backgroundColor = '#1A99EF'
  customUI.style.padding = '20px'
  customUI.style.border = '1px solid white'
  customUI.style.display = 'block'
  customUI.style.borderRadius = '9px'
  //获取初始化数据
  var jk = localStorage.getItem('jiankong')
  var shutCost = localStorage.getItem('shutCost')
  var shutRoi = localStorage.getItem('shutRoi')
  var shutCost2 = localStorage.getItem('shutCost2')
  var shutRoi2 = localStorage.getItem('shutRoi2')
  // 添加一些内容到自定义界面
  customUI.innerHTML = `
       <h2>千川助手</h2>
       <span>--------计划监控区-------<span>

       <div class="input-row">
       <label for="condition1">条件1：</label>
       <input style="width:50px"   id="costInput1" placeholder="消耗">
       <input style="width:50px"   id="roiInput1" placeholder="roi">
        </div>

       <div class="input-row">
       <label for="condition2">条件2：</label>
       <input style="width:50px"   id="costInput2" placeholder="消耗">
       <input style="width:50px"   id="roiInput2" placeholder="roi">
       </div>

        <div class="button-row">
        <button id="startAuto">开始监控</button>
        <button id="endAuto">停止监控</button>
        </div>

        <div class="jkStatusRow">
         <span>监控状态：</span>
         <span>${jk}</span>
        </div>

        <span>---------------------------</span>
 `
  customUI.querySelector('h2').style.textAlign = 'center'
  customUI.querySelector('h2').style.fontWeight = 'bold'
  customUI.querySelector('.button-row').style.margin = '5px'
  customUI.querySelector('.button-row').style.display = 'flex'
  customUI.querySelector('.button-row').style.justifyContent = 'space-between'

  // 将自定义界面添加到文档中
  document.body.appendChild(customUI)

  customUI.querySelector('#costInput1').value = shutCost
  customUI.querySelector('#roiInput1').value = shutRoi
  customUI.querySelector('#costInput2').value = shutCost2
  customUI.querySelector('#roiInput2').value = shutRoi2

  // 开始监控
  var startBtn = customUI.querySelector('#startAuto')
  startBtn.addEventListener('click', () => {
    localStorage.setItem('shutCost', customUI.querySelector('#costInput1').value)
    localStorage.setItem('shutRoi', customUI.querySelector('#roiInput1').value)
    localStorage.setItem('shutCost2', customUI.querySelector('#costInput2').value)
    localStorage.setItem('shutRoi2', customUI.querySelector('#roiInput2').value)
    localStorage.setItem('jiankong', '监控中')
    customUI.querySelector('.jkStatusRow span:nth-child(2)').textContent = '监控中'
    location.reload(true)
  })

  // 停止监控
  var endBtn = customUI.querySelector('#endAuto')
  endBtn.addEventListener('click', () => {
    customUI.querySelector('.jkStatusRow span:nth-child(2)').textContent = '未监控'
    localStorage.setItem('jiankong', '未监控')
  })
}

function appendLog(ID, COST, ROI) {
  // 获取之前保存在localStorage中的日志数据（如果有的话）
  let existingLogs = JSON.parse(localStorage.getItem('logs')) || [];

  // 要添加的新日志数据
  const newLog = {
    ID,
    COST,
    ROI
  };

  // 将新日志数据追加到现有数据中
  existingLogs.push(newLog);

  // 将更新后的数据保存回localStorage
  localStorage.setItem('logs', JSON.stringify(existingLogs));
}


function showLogs() {
  // 获取日志数据
  const logs = JSON.parse(localStorage.getItem('logs')) || [];





  // 循环遍历日志数据并将其显示在日志框中
  logs.forEach((log, index) => {

        var text = `${log.ID}消耗:${log.COST}ROI:${log.ROI}\n`
        console.log(text)
  });
}