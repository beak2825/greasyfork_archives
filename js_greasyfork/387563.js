// ==UserScript==
// @name         马蜂窝抢单助手
// @namespace    https://www.uniqueway.com/
// @version      1.7
// @description  mafengwo grabber
// @author       likai
// @match        https://b.mafengwo.cn/*
// @match        http://localhost:8000/*
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/387563/%E9%A9%AC%E8%9C%82%E7%AA%9D%E6%8A%A2%E5%8D%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/387563/%E9%A9%AC%E8%9C%82%E7%AA%9D%E6%8A%A2%E5%8D%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function() {
  'use strict'
  if (window.top !== window.self) {
    return console.log('插件不运行在iframe中')
  }

  Notification.requestPermission()
  GM_xmlhttpRequest({url: 'https://seller.mafengwo.cn'})
  GM_xmlhttpRequest({url: 'http://wxwork.uniqueway.cc'})

  const inDebugger = location.href.includes('debug')
  const inGrabberPage = location.hash.includes('#/business/customize/scramblePool')
  const inRequirementPage = location.hash.includes('#/business/customize/work') && !location.hash.includes('workDetail')
  let enable = inDebugger || inGrabberPage || inRequirementPage
  if (!enable) { return console.log('not enable page') }
  console.log(`running at ${inDebugger ? 'debugging' : 'production'} mode`)

  const UnicrmHost = inDebugger ? 'http://api-unicrm.uniqueway.cc' : 'http://api-unicrm.uniqueway.com'
  const UnicrmUrl = inDebugger ? 'https://unicrm.uniqueway.cc' : 'http://unicrm.uniqueway.com'
  GM_xmlhttpRequest({url: UnicrmHost })

  const MODE = { requirement: '需求列表', grabber: '抢单池' }

  // 已尝试抢过的单
  const watched_tickets = {}
  // 成功抢单列表
  const grabbed_tickets = []
  // 限制条件
  const constraints = {
    delay: 1,
    min_day: 0,
    max_grab: 10,
    min_budget: 5000,
    create_deal: 'yes',
    exclude_destinations: '泰国,新加坡,普吉岛,苏梅岛,马来西亚,巴厘岛,越南,斯里兰卡,印度尼西亚,台湾'
  }
  if (inGrabberPage && !inDebugger) {
      constraints['delay'] = parseInt(prompt('延迟几秒抢单：', constraints['delay']))
      constraints['create_deal'] = prompt('是否开启自动填单：', constraints['create_deal'])
      constraints['min_day'] = parseInt(prompt('出发日期必须在几日之后：', constraints['min_day']))
      constraints['min_budget'] = parseInt(prompt('最低预算是多少：', constraints['min_budget']))
      constraints['max_grab'] = parseInt(prompt('最多抢多少单：', constraints['max_grab']))
      constraints['exclude_destinations'] = prompt('不参与抢单的国家：', constraints['exclude_destinations'])
  }

  let haveCreateRequirementIds = getLocalStorage('haveCreateRequirementIds', [])

  document.addEventListener('DOMContentLoaded', function(){
    if (inGrabberPage) readyForGrabber()
    if (inRequirementPage){
      appendStyle()
      const isOpenCreateDeal = sessionStorage.getItem('isOpenCDeal') === "1" || window.confirm('是否打开需求列表自动填单')
      if (isOpenCreateDeal){
       readyForRequirement()
       sessionStorage.setItem('isOpenCDeal', "1")
      }
    }
  })

  function readyForGrabber() {
    const intervalId = setInterval(function(){
      const tbody = document.querySelector('.table table tbody')
      if (tbody !== null) {
        clearInterval(intervalId)
        tbody.addEventListener('DOMSubtreeModified', watch_ticket)
        console.log('开始监听抢单池')
      }
    }, 1000)
  }

  function watch_ticket(event) {
    console.log('发现数据变化')
    let rows = document.querySelectorAll('.table table tbody tr')
    for (let i = rows.length - 1; i >= 0; i--) {
      let cols = rows[i].children
      let ticket = extract_ticket(cols)

      if (ticket === false) continue
      // Skip watched
      if (watched_tickets[ticket['id']]) continue

      console.log('发现新行', rows[i].innerHTML)
      watched_tickets[ticket['id']] = ticket

      if (!should_grab(ticket)) continue

      console.log('开始抢单', ticket)
      grab(ticket)
    }
  }

  function create_iframe(ticket) {
    let url = `https://seller.mafengwo.cn/customize/ajax_get_work.php?sAction=work_list&iUid=&iPage=0&iMddId=&iPageSize=10&sStartDate=&sEndDate=&sVisitorName=&sVirtualPhone=&iGlobalStatus=400&iCancelReasonId=0&iIncludeSubMdd=0&iNature=0&iCommentStatus=&iCustomizistUid=&sEntryTypeFirst=&sEnterpriseName=&iDemandID=${ticket['id']}&iStatus=-1&iBusinessType=-1&iContactStatus=-1&iDistributeStatus=-1`
    if (inDebugger) {
      url = '../demand.json'
    }

    GM_xmlhttpRequest({
      url: url,
      method: 'GET',
      onload: function(response) {
        console.log(response.responseText)
        let data = JSON.parse(response.responseText)
        let list = data.data.list
        if (list == undefined) {
          console.log('无法获取工单信息', url, list)
          return
        }

        if (list.length == 0) {
          console.log('无法获取工单信息', url, list)
          return
        }

        let work_id = data.data.list[0]['work_id']
        let demand_url = `https://b.mafengwo.cn/#/business/customize/workDetail/${work_id}`
        console.log(demand_url)

        if (inDebugger) {
          demand_url = `../mock/mafengwo.detail.html?id=${work_id}/#/business/customize/workDetail/${work_id}`
        }

        let iframe = document.createElement('iframe')
        iframe.src = demand_url
        iframe.id = 'iframe' + ticket['id']
        iframe.onload = function() {
          let frameDoc = iframe.contentWindow.document
          let wait_times = 0
          const intervalId = setInterval(function(){
            let el = frameDoc.querySelector('.is-inactived')
            if (el == null) {
              return
            }

            let cells = frameDoc.querySelectorAll('.is-inactived .cell-wrap-desc')
            if (cells.length == 0) {
              console.warn('cells.length', '无法获取客户姓名和联系方式')
              return
            }

            let customer_emtpy = (cells[0].innerText == '' || cells[1].innerText == '')
            if (wait_times < 10 && customer_emtpy) {
              console.warn('cells.innerText', '无法获取客户姓名和联系方式')
              wait_times += 1
              return
            }

            clearInterval(intervalId)

            ticket['customer_name'] = cells[0].innerText
            ticket['transfer_number'] = cells[1].innerText

            create_deal(ticket, MODE.grabber)

            setTimeout(function(){
              iframe.parentNode.removeChild(iframe)
            }, 3000)
          }, 1000)
          }

        document.body.appendChild(iframe)
      },
      onerror: function(error) {
        console.log('加载工单出错', error)
      }
    })
  }

  function extract_ticket(cols) {
    if (cols.length < 10) return false

    let ticket = {}
    ticket['id'] = cols[0].innerText
    ticket['time'] = cols[1].innerText
    ticket['type'] = cols[3].innerText
    ticket['departure'] = cols[4].innerText

    ticket['destination'] = cols[5].innerText

    // dates
    let match = cols[6].innerText.match(/(.*) 至 (.*) 共 (\d+) 天/)
    ticket['go_date'] = new Date(match[1])
    ticket['return_date'] = new Date(match[2])
    ticket['days'] = parseInt(match[3])
    ticket['origin_date'] = cols[6].innerText

    ticket['budget'] = cols[7].innerText

    // people
    match = cols[8].innerText.match(/(\d+) 成人, (\d+) 儿童/)
    ticket['adults'] = match ? parseInt(match[1]) : '空'
    ticket['children'] = match ? parseInt(match[2]) : '空'

    ticket['service_item'] = cols[9].innerText
    ticket['ticket_of_traffic'] = cols[10].innerText
    ticket['user_comment'] = cols[11].innerText

    ticket['btn'] = cols[12].children[0].children[0]

    ticket['url'] = null
    ticket['customer_name'] = null
    ticket['transfer_number'] = null

    return ticket
  }

  function should_grab(ticket) {
    let today = new Date()
    let go_date = ticket['go_date']
    let diff_in_ms = Math.abs(today.getTime() - go_date.getTime())
    let diff_in_day = Math.ceil(diff_in_ms / (1000 * 3600 * 24))

    if (constraints['min_day'] > 0 && diff_in_day < constraints['min_day']) {
      console.warn('不满足最低出发天数要求', ticket['go_date'], ticket)
      return false
    }

    let budget = parseInt(ticket['budget'])
    if (constraints['min_budget'] > 0 && budget < constraints['min_budget']) {
      console.warn('不满足最低预算要求', ticket['budget'], ticket)
      return false
    }

    if (constraints['max_grab'] > 0 && grabbed_tickets.length >= constraints['max_grab']) {
      console.warn('达到抢单上限', grabbed_tickets.length)
      new Notification('达到抢单上限')
      return false
    }

    if (constraints['exclude_destinations'] != '') {
      let destinations = constraints['exclude_destinations'].split(',')
      for (let dest of destinations) {
        if (ticket['destination'].includes(dest)) {
          console.warn('不满足目的地要求', dest, ticket)
          return false;
        }
      }
    }

    return true
  }

  function grab(ticket) {
    let delay = (Math.random() * constraints['delay']) * 1000
    let btnId = 'btn' + ticket['id']
    ticket['btn'].id = btnId

    setTimeout(function() {
      let btn = document.getElementById(btnId)
      if (btn == null) {
        console.warn('抢单失败，慢了一步', delay, ticket)
        new Notification('抢单失败，慢了一步，' + delay)
      } else {
        btn.click()

        setTimeout(() => {
          const hasGrabed = checkHasGrabed()
          if (hasGrabed) {
            return console.log('此单已被抢，不再重复抢单，避免重复建单')
          }

          if (constraints['create_deal'] == 'yes') {
            setTimeout(function(){
              create_iframe(ticket)
            }, 10000)
          }

          grabbed_tickets.push(ticket)
          console.log('抢单成功', grabbed_tickets.length, ticket)
          send_notification(`抢单成功 ${ticket['id']}`)
        }, 3000)
      }
    }, delay)
  }

  function checkHasGrabed() {
    const messageContainer = document.querySelector('.message .message-content')
    if (!messageContainer) return false
    const hasGrabed = messageContainer.innerText === '已被抢走，再接再厉'
    console.log(messageContainer.innerText)
    return hasGrabed
  }

  function send_notification(message) {
    let notification = new Notification(message)

    if (inDebugger) return
    GM_xmlhttpRequest({
      url: 'http://wxwork.uniqueway.cc/incoming/048b6a64-309c-43f6-b1b2-cbcfe900536a',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({message: message})
    })

    return notification
  }

  function create_deal(ticket, mode) {
    if (ticket['transfer_number'] == null || ticket['customer_name'] == null ||
      ticket['transfer_number'] == '' || ticket['customer_name'] == '') {
      console.warn('填单失败，无法获取转接号或客户名', ticket)
      send_notification(`填单失败，无法获取转接号或客户名 ${ticket['url']}`)
      return
    }

    let comment = `
需求ID：${ticket['id']}
出发地：${ticket['departure']}
目的地：${ticket['destination']}
来源：${ticket['type']}
往返日期：${ticket['origin_date'] || ''}
成人：${ticket['adults'] || ''}
儿童：${ticket['children'] || ''}
预算：${ticket['budget'] || ''}
联系人：${ticket['customer_name'] || ''}
转接号：${ticket['transfer_number']}
客人备注：${ticket['user_comment']}
服务项目：${ticket['service_item'] || ''}
自动抢单：${ticket['type'] == '通用' ? '是' : '客户主动提交订单(产品)'}
`
    if (ticket['productionId']) {
      comment += `商品ID: ${ticket['productionId']}`
    }

    let utm_campaign = ticket['type'] == '通用' ? '抢单' : '客户主动提交订单（产品）'
    const data = {
      mafengwo_id: ticket['id'],
      customer_name: ticket['customer_name'],
      tansfer_number: ticket['transfer_number'],
      days: ticket['days'],
      departure_date: ticket['go_date'],
      destination: ticket['destination'],
      utm_source: '蚂蜂窝',
      utm_medium: '蚂蜂窝自由行定制',
      utm_campaign: utm_campaign,
      customer_remark: comment,
      creator_id: 3,
      sales_pipeline_option: "default"
    }

    if (ticket['productionId']) {
      data.source_url = `https://www.mafengwo.cn/sales/${ticket['productionId']}.html`
    }

    console.log('填单数据', data)

    const url = UnicrmHost + '/system_api/mafengwo_deals'
    const headers = { 'Content-Type': 'application/json' }

    GM_xmlhttpRequest({
      url: url,
      method: 'POST',
      data: JSON.stringify(data),
      headers: headers,
      onload: function(response) {
        if (response.status == 200) {
          if (inRequirementPage) {
            if (haveCreateRequirementIds.length > 20) {
              haveCreateRequirementIds = haveCreateRequirementIds.slice(-10)
            }
            haveCreateRequirementIds.push(ticket.id)
            setLocalStorage('haveCreateRequirementIds', haveCreateRequirementIds)
          }

          let result = JSON.parse(response.responseText)
          ticket['url'] = `${UnicrmUrl}/deals/${result['deal_id']}`

          console.log(`${mode}-填单成功`, response.responseText)
          send_notification(`${mode}-填单成功 ${ticket['url']}`)
        } else {
          console.error(`${mode}-填单失败`, response)
          send_notification(`${mode}-填单失败 ${response.responseText} ${ticket['url']}`)
        }
      },
      onerror: function(error) {
        console.error(`${mode}-填单失败`, error)
        if (inRequirementPage) {
          haveCreateRequirementIds.push(ticket.id)
          setLocalStorage('haveCreateRequirementIds', haveCreateRequirementIds)
        }
        send_notification(`${mode}-填单失败，需要人工参与处理 ${error.responseText}`)
      }
    })
  }

  function appendStyle() {
    const styleTag = document.createElement('style')
    styleTag.type = 'text/css'
    const cssText = `
     .button {
       user-select: auto !important;
     }
    `
    const cssTextNode = document.createTextNode(cssText)
    styleTag.appendChild(cssTextNode)
    document.head.appendChild(styleTag)
  }

  //需求表单自动建单
  function readyForRequirement() {
    const intervalId = setInterval(function(){
      const table = document.querySelector('.table-scroll tbody.table-tbody.table-default')
      if (table !== null) {
         clearInterval(intervalId)
         console.log('开始监听需求列表')

         const rows = table.children
         for (let row of rows) {
           const ticket = extractRequirementRow(row)
           if (!ticket) continue
           console.log('发现新的需求列表未建单列', row)
           create_deal(ticket, MODE.requirement)
         }
         setTimeout(() => location.reload(), 600000)
      }
    }, 1000)
  }

  function extractRequirementRow(row) {
    const cols = Array.prototype.map.call(row.children, col => col.innerText.split('\n\n'))

    const ticket = {}

    // col1 需求ID & 接单时间
    const col1Texts = splitColTextByColon(cols[0])
    ticket.id = col1Texts[0]
    if (haveCreateRequirementIds.includes(ticket.id)) return false
    ticket.time = col1Texts[2]


    // col8 需求状态
    if (cols[7] && cols[7][0] && cols[7][0].includes('查看通话记录')) return false

    // col2 来源&出发地&目的地&品类
    const col2Texts = splitColTextByColon(cols[1])
    if (!col2Texts[0].includes('商品ID')) return false
    ticket.productionId = col2Texts[0].replace(/[^0-9]/ig,"")

    // 出发和目的地
    const departureAndDestination = col2Texts[1].match(/(.*)-(.*)/) || []
    ticket.departure = departureAndDestination[1]
    ticket.destination = departureAndDestination[2]
    // 往返日期
    const dates = col2Texts[2].match(/(.*)至(.*)\(共(.*)天\)/) || []
    ticket.go_date = new Date(dates[1])
    ticket.return_date = new Date(dates[2])
    ticket.days = parseInt(dates[3])
    ticket.origin_date = col2Texts[2]
    // 品类
    ticket.type = col2Texts[3]




    // col3 人数&预算
    const col3Texts = splitColTextByColon(cols[2])
    ticket.adults = parseInt(col3Texts[0])
    ticket.children = parseInt(col3Texts[1])
    ticket.budget = col3Texts[2]

    // col4联系人
    const col4Texts = splitColTextByColon(cols[3])
    ticket.customer_name = col4Texts[1]
    ticket.transfer_number = col4Texts[2]

    //备注
    ticket.user_comment = cols[4][0]

    return ticket
  }

  function splitColTextByColon(col) {
    return col.map(colTextItem => colTextItem.split('：')[1])
  }

  function getLocalStorage(key, defaultValue) {
    let value = localStorage.getItem(key)
    return value ? JSON.parse(value) : defaultValue
  }

  function setLocalStorage(key, value) {
    value = JSON.stringify(value)
    return localStorage.setItem(key, value)
  }
  // Your code here...
})();
