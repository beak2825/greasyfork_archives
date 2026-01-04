// ==UserScript==
// @name 宝寓
// @namespace http://tampermonkey.net/
// @description baoyu orderlist request
// @match https://www.bypms.cn/console/state/
// @icon https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @author         zasoms
// @copyright      zasoms
// @version        1.0.1
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/453119/%E5%AE%9D%E5%AF%93.user.js
// @updateURL https://update.greasyfork.org/scripts/453119/%E5%AE%9D%E5%AF%93.meta.js
// ==/UserScript==

; (function () {
  "use strict"

  const BY_ROOMS = [
    { id: 466622, roomid: "105946", name: "8301轻奢投影电竞大床房", tags: [], type: 0, auth: true },
    { id: 466623, roomid: "105947", name: "8302轻奢投影电竞大床房", tags: [], type: 0, auth: true },
    { id: 466624, roomid: "105948", name: "8303臻享电竞双人榻榻米", tags: [], type: 0, auth: true },
    { id: 466625, roomid: "105949", name: "8305六人对战轰趴麻将房", tags: [], type: 0, auth: true },
    { id: 466626, roomid: "105950", name: "8306豪华青训投影五人房", tags: [], type: 0, auth: true },
    { id: 466627, roomid: "105951", name: "8307四人电竞吃鸡麻将房", tags: [], type: 0, auth: true },
    { id: 466628, roomid: "105952", name: "8308臻享电竞双人大床榻榻米", tags: [], type: 0, auth: true },
    { id: 466629, roomid: "105953", name: "8309经济畅玩三人房", tags: [], type: 0, auth: true },
    { id: 466630, roomid: "105954", name: "8412团建电竞五人麻将房", tags: [], type: 0, auth: true },
    { id: 565642, roomid: "124907", name: "1401太空舱电竞双人房", tags: [], type: 47671, auth: true },
    { id: 565643, roomid: "124908", name: "1402太空舱电竞双人房", tags: [], type: 47671, auth: true },
    { id: 565644, roomid: "124909", name: "1403尊享电竞投影大床房", tags: [], type: 47670, auth: true },
    { id: 565645, roomid: "124911", name: "1405尊享电竞投影大床房", tags: [], type: 47670, auth: true },
    { id: 565646, roomid: "124912", name: "1406星空投影电竞大床房", tags: [], type: 47670, auth: true },
    { id: 565647, roomid: "124913", name: "1407星空投影电竞大床房", tags: [], type: 47670, auth: true },
    { id: 565648, roomid: "124914", name: "1408电竞四人吃鸡麻将房", tags: [], type: 47673, auth: true },
    { id: 565649, roomid: "124915", name: "1409尊享电竞投影大床房", tags: [], type: 47670, auth: true },
    { id: 565650, roomid: "124916", name: "1410轻奢大床电竞麻将房", tags: [], type: 47670, auth: true },
    { id: 565651, roomid: "124917", name: "1411尊享电竞投影大床房", tags: [], type: 47670, auth: true },
    { id: 565652, roomid: "124918", name: "1412尊享电竞投影大床房", tags: [], type: 47670, auth: true },
    { id: 565653, roomid: "124919", name: "1413经济畅玩三人房", tags: [], type: 47672, auth: true },
    { id: 565654, roomid: "124921", name: "1415超神电竞三人间", tags: [], type: 47672, auth: true },
    { id: 565655, roomid: "124922", name: "1416团建电竞五人麻将房", tags: [], type: 47674, auth: true },
  ]

  const XZ_ROOMS = [
    { id: 28812, roomid: "105946", roomno: "8301", roomstatusid: "105855", shopId: 4047, name: "轻奢投影电竞大床房", checkInNum: 2, overBookingNum: 0, normalPrice: 249.0, deposit: 300.0, status: 0, orderIndex: 0, remark: "", createTime: 1651038875000, createUser: "袋鼠酒店", priceType: 1, weekEndPrice: 279.0, cleanerNum: 1, showPlatform: "1,2", roomNum: 2, emptyRoomNum: 0, orderSumCount: 0, checkedFlag: false },
    { id: 28812, roomid: "105947", roomno: "8302", roomstatusid: "105856", shopId: 4047, name: "轻奢投影电竞大床房", checkInNum: 2, overBookingNum: 0, normalPrice: 249.0, deposit: 300.0, status: 0, orderIndex: 0, remark: "", createTime: 1651038875000, createUser: "袋鼠酒店", priceType: 1, weekEndPrice: 279.0, cleanerNum: 1, showPlatform: "1,2", roomNum: 2, emptyRoomNum: 0, orderSumCount: 0, checkedFlag: false },
    { id: 28813, roomid: "105948", roomno: "8303", roomstatusid: "105857", shopId: 4047, name: "臻享电竞双人榻榻米", checkInNum: 2, overBookingNum: 0, normalPrice: 259.0, deposit: 300.0, status: 0, orderIndex: 0, remark: "", createTime: 1651038907000, createUser: "袋鼠酒店", priceType: 1, weekEndPrice: 289.0, cleanerNum: 1, showPlatform: "1,2", roomNum: 2, emptyRoomNum: 2, orderSumCount: 0, checkedFlag: false },
    { id: 28813, roomid: "105952", roomno: "8308", roomstatusid: "105861", shopId: 4047, name: "臻享电竞双人榻榻米", checkInNum: 2, overBookingNum: 0, normalPrice: 259.0, deposit: 300.0, status: 0, orderIndex: 0, remark: "", createTime: 1651038907000, createUser: "袋鼠酒店", priceType: 1, weekEndPrice: 289.0, cleanerNum: 1, showPlatform: "1,2", roomNum: 2, emptyRoomNum: 2, orderSumCount: 0, checkedFlag: false },
    { id: 28814, roomid: "105953", roomno: "8309", roomstatusid: "105862", shopId: 4047, name: "经济畅玩三人房", checkInNum: 3, overBookingNum: 0, normalPrice: 289.0, deposit: 300.0, status: 0, orderIndex: 0, remark: "", createTime: 1651038934000, createUser: "袋鼠酒店", priceType: 1, weekEndPrice: 329.0, cleanerNum: 1, showPlatform: "1,2", roomNum: 1, emptyRoomNum: 1, orderSumCount: 0, checkedFlag: false },
    { id: 28815, roomid: "105951", roomno: "8307", roomstatusid: "105860", shopId: 4047, name: "四人电竞吃鸡麻将房", checkInNum: 4, overBookingNum: 0, normalPrice: 459.0, deposit: 300.0, status: 0, orderIndex: 0, remark: "", createTime: 1651038979000, createUser: "袋鼠酒店", priceType: 1, weekEndPrice: 499.0, cleanerNum: 1, showPlatform: "1,2", roomNum: 1, emptyRoomNum: 1, orderSumCount: 0, checkedFlag: false },
    { id: 28816, roomid: "105950", roomno: "8306", roomstatusid: "105859", shopId: 4047, name: "豪华青训投影五人房", checkInNum: 5, overBookingNum: 0, normalPrice: 459.0, deposit: 300.0, status: 0, orderIndex: 0, remark: "", createTime: 1651039014000, createUser: "袋鼠酒店", priceType: 1, weekEndPrice: 519.0, cleanerNum: 1, showPlatform: "1,2", roomNum: 1, emptyRoomNum: 1, orderSumCount: 0, checkedFlag: false },
    { id: 28817, roomid: "105954", roomno: "8412", roomstatusid: "105863", shopId: 4047, name: "团建电竞五人麻将房", checkInNum: 5, overBookingNum: 0, normalPrice: 488.0, deposit: 300.0, status: 0, orderIndex: 0, remark: "", createTime: 1651039039000, createUser: "袋鼠酒店", priceType: 1, weekEndPrice: 558.0, cleanerNum: 1, showPlatform: "1,2", roomNum: 1, emptyRoomNum: 1, orderSumCount: 0, checkedFlag: false },
    { id: 28818, roomid: "105949", roomno: "8305", roomstatusid: "105858", shopId: 4047, name: "六人对战轰趴麻将房", checkInNum: 6, overBookingNum: 0, normalPrice: 539.0, deposit: 300.0, status: 0, orderIndex: 0, remark: "", createTime: 1651039079000, createUser: "袋鼠酒店", priceType: 1, weekEndPrice: 599.0, cleanerNum: 1, showPlatform: "1,2", roomNum: 1, emptyRoomNum: 1, orderSumCount: 0, checkedFlag: false },
    { id: 34759, roomid: "124907", roomno: "1401", roomstatusid: "124825", shopId: 4047, name: "超燃~太空舱电竞双人房", checkInNum: 2, overBookingNum: 0, normalPrice: 249, deposit: 300, status: 0, orderIndex: 0, remark: "", createTime: 1651038875000, createUser: "袋鼠酒店", priceType: 1, weekEndPrice: 279, cleanerNum: 1, showPlatform: "1,2", roomNum: 2, emptyRoomNum: 0, orderSumCount: 0, checkedFlag: false },
    { id: 34759, roomid: "124908", roomno: "1402", roomstatusid: "124826", shopId: 4047, name: "超燃~太空舱电竞双人房", checkInNum: 2, overBookingNum: 0, normalPrice: 249, deposit: 300, status: 0, orderIndex: 0, remark: "", createTime: 1651038875000, createUser: "袋鼠酒店", priceType: 1, weekEndPrice: 279, cleanerNum: 1, showPlatform: "1,2", roomNum: 2, emptyRoomNum: 0, orderSumCount: 0, checkedFlag: false },
    { id: 34763, roomid: "124909", roomno: "1403", roomstatusid: "124827", shopId: 4047, name: "尊享电竞投影大床房", checkInNum: 2, overBookingNum: 0, normalPrice: 249, deposit: 300, status: 0, orderIndex: 0, remark: "", createTime: 1651038875000, createUser: "袋鼠酒店", priceType: 1, weekEndPrice: 279, cleanerNum: 1, showPlatform: "1,2", roomNum: 2, emptyRoomNum: 0, orderSumCount: 0, checkedFlag: false },
    { id: 34763, roomid: "124911", roomno: "1405", roomstatusid: "124829", shopId: 4047, name: "尊享电竞投影大床房", checkInNum: 2, overBookingNum: 0, normalPrice: 249, deposit: 300, status: 0, orderIndex: 0, remark: "", createTime: 1651038875000, createUser: "袋鼠酒店", priceType: 1, weekEndPrice: 279, cleanerNum: 1, showPlatform: "1,2", roomNum: 2, emptyRoomNum: 0, orderSumCount: 0, checkedFlag: false },
    { id: 34758, roomid: "124912", roomno: "1406", roomstatusid: "124830", shopId: 4047, name: "梦境~星空投影电竞大床房", checkInNum: 2, overBookingNum: 0, normalPrice: 249, deposit: 300, status: 0, orderIndex: 0, remark: "", createTime: 1651038875000, createUser: "袋鼠酒店", priceType: 1, weekEndPrice: 279, cleanerNum: 1, showPlatform: "1,2", roomNum: 2, emptyRoomNum: 0, orderSumCount: 0, checkedFlag: false },
    { id: 34758, roomid: "124913", roomno: "1407", roomstatusid: "124831", shopId: 4047, name: "梦境~星空投影电竞大床房", checkInNum: 2, overBookingNum: 0, normalPrice: 249, deposit: 300, status: 0, orderIndex: 0, remark: "", createTime: 1651038875000, createUser: "袋鼠酒店", priceType: 1, weekEndPrice: 279, cleanerNum: 1, showPlatform: "1,2", roomNum: 2, emptyRoomNum: 0, orderSumCount: 0, checkedFlag: false },
    { id: 34761, roomid: "124914", roomno: "1408", roomstatusid: "124832", shopId: 4047, name: "火力全开~电竞四人吃鸡麻将房", checkInNum: 2, overBookingNum: 0, normalPrice: 249, deposit: 300, status: 0, orderIndex: 0, remark: "", createTime: 1651038875000, createUser: "袋鼠酒店", priceType: 1, weekEndPrice: 279, cleanerNum: 1, showPlatform: "1,2", roomNum: 2, emptyRoomNum: 0, orderSumCount: 0, checkedFlag: false },
    { id: 34763, roomid: "124915", roomno: "1409", roomstatusid: "124833", shopId: 4047, name: "尊享电竞投影大床房", checkInNum: 2, overBookingNum: 0, normalPrice: 249, deposit: 300, status: 0, orderIndex: 0, remark: "", createTime: 1651038875000, createUser: "袋鼠酒店", priceType: 1, weekEndPrice: 279, cleanerNum: 1, showPlatform: "1,2", roomNum: 2, emptyRoomNum: 0, orderSumCount: 0, checkedFlag: false },
    { id: 34760, roomid: "124916", roomno: "1410", roomstatusid: "124834", shopId: 4047, name: "轻奢大床电竞麻将房", checkInNum: 2, overBookingNum: 0, normalPrice: 249, deposit: 300, status: 0, orderIndex: 0, remark: "", createTime: 1651038875000, createUser: "袋鼠酒店", priceType: 1, weekEndPrice: 279, cleanerNum: 1, showPlatform: "1,2", roomNum: 2, emptyRoomNum: 0, orderSumCount: 0, checkedFlag: false },
    { id: 34763, roomid: "124917", roomno: "1411", roomstatusid: "124835", shopId: 4047, name: "尊享电竞投影大床房", checkInNum: 2, overBookingNum: 0, normalPrice: 249, deposit: 300, status: 0, orderIndex: 0, remark: "", createTime: 1651038875000, createUser: "袋鼠酒店", priceType: 1, weekEndPrice: 279, cleanerNum: 1, showPlatform: "1,2", roomNum: 2, emptyRoomNum: 0, orderSumCount: 0, checkedFlag: false },
    { id: 34763, roomid: "124918", roomno: "1412", roomstatusid: "124836", shopId: 4047, name: "尊享电竞投影大床房", checkInNum: 2, overBookingNum: 0, normalPrice: 249, deposit: 300, status: 0, orderIndex: 0, remark: "", createTime: 1651038875000, createUser: "袋鼠酒店", priceType: 1, weekEndPrice: 279, cleanerNum: 1, showPlatform: "1,2", roomNum: 2, emptyRoomNum: 0, orderSumCount: 0, checkedFlag: false },
    { id: 28814, roomid: "124919", roomno: "1413", roomstatusid: "124837", shopId: 4047, name: "经济畅玩三人房", checkInNum: 2, overBookingNum: 0, normalPrice: 249, deposit: 300, status: 0, orderIndex: 0, remark: "", createTime: 1651038875000, createUser: "袋鼠酒店", priceType: 1, weekEndPrice: 279, cleanerNum: 1, showPlatform: "1,2", roomNum: 2, emptyRoomNum: 0, orderSumCount: 0, checkedFlag: false },
    { id: 34762, roomid: "124921", roomno: "1415", roomstatusid: "124839", shopId: 4047, name: "无所不能~超神电竞三人间", checkInNum: 2, overBookingNum: 0, normalPrice: 249, deposit: 300, status: 0, orderIndex: 0, remark: "", createTime: 1651038875000, createUser: "袋鼠酒店", priceType: 1, weekEndPrice: 279, cleanerNum: 1, showPlatform: "1,2", roomNum: 2, emptyRoomNum: 0, orderSumCount: 0, checkedFlag: false },
    { id: 28817, roomid: "124922", roomno: "1416", roomstatusid: "124840", shopId: 4047, name: "团建电竞五人麻将房", checkInNum: 2, overBookingNum: 0, normalPrice: 249, deposit: 300, status: 0, orderIndex: 0, remark: "", createTime: 1651038875000, createUser: "袋鼠酒店", priceType: 1, weekEndPrice: 279, cleanerNum: 1, showPlatform: "1,2", roomNum: 2, emptyRoomNum: 0, orderSumCount: 0, checkedFlag: false },
  ]

  const otaMap = {
    美团酒店: 1,
    携程: 2,
    去哪儿: 3,
    飞猪: 4,
    美团民宿: 544,
  }
  const xuOtaMap = {
    1: "美团",
    2: "携程",
    3: "去哪儿",
    4: "飞猪",
    544: "美团民宿",
  }
  let isSyncOrder = false
  const button = document.createElement("button")
  button.innerText = "同步订单"
  button.onclick = async () => {
    if (!isSyncOrder) {
      jQuery(`.i_refresh`).trigger('click')
      await sleep(3000)
      jQuery(`#_dlg_contract_check .i_cross`).trigger('click')

      button.innerText = '同步中...,别按了'
      isSyncOrder = true
    }
  }
  button.style.cssText = "position: fixed; bottom: 100px; right: 100px; z-index: 10;"
  document.body.appendChild(button)

  const formatNumber = (number) => {
    return number > 9 ? number : '0' + number
  }

  const formatLocalDate = (date, format = 'Y年M月D日 h:m') => {
    const weeks = ['', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
    var args = {
      W: weeks[date.getDay()],
      Y: date.getFullYear(),
      M: formatNumber(date.getMonth() + 1),
      D: formatNumber(date.getDate()),

      h: formatNumber(date.getHours()),
      m: formatNumber(date.getMinutes()),
      s: formatNumber(date.getSeconds())
    }

    return format.replace(/W|Y|M|D|h|m|s/g, match => args[match])
  }

  const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time))

  const getDetail = async (data) => {
    // 打开详情
    jQuery(`[nid="${data.id}"]`).trigger('click')
    await sleep(2000)
    const $list = $(window.frames['ifrm_night_detail'].document).find('.vform li')
    const checkIn = data.checkIn
    const checkOut = data.checkOut
    const result = {}
    $list.map((index, item) => {
      const $el = jQuery(item).find('.vinput')
      const label = $el.find('label').text().replace(':', '')
      const value = $el.find('strong').text()
      const pureValue = value.replace(/\(.*?\)/g, '')
      const extendValue = (value.match(/\((.*?)\)/) || [])[1]
      if (label === '房间') {
        const byRoom = BY_ROOMS.find(item => item.name === pureValue)
        result.name = pureValue
        result.roomid = byRoom.roomid
      } else if (label === '来源') {
        result.remark = pureValue
        result.otaChannel = otaMap[pureValue] || ''
      } else if (label === '单号') {
        result.otaOrderNo = pureValue
      } else if (label === '入住日期') {
        result.startTime = checkIn
        result.endTime = checkOut
        result.arriveTime = `${checkIn} 14:00:00`
        result.keepTime = `${checkIn} 18:00:00`
        result.leaveTime = `${checkOut} 13:00:00`
        result.planDays = Number(extendValue.match(/\d+/)[0])

        if (result.planDays > 1) {
          result.rangeTime = Array(result.planDays).fill(0).map((item, index) => {
            const date = new Date(checkIn)
            date.setDate(date.getDate() + index)
            return formatLocalDate(date, 'Y-M-D')
          })
        } else {
          result.rangeTime = [checkIn]
        }

      } else if (label === '预订人') {
        const [name, phone] = value.split(', ')
        result.name = name
        result.phone = phone
      } else if (label === '房费') {
        const price = Number(value.match(/\d+\.?\d+?/g)[0])
        result.deposit = extendValue === '已付' ? price : 0
        result.newPrice = Number(result.deposit ? result.deposit / result.planDays : price).toFixed(2)
      }
    })
    result.multiDayRoomPriceJson = result.rangeTime.map((roomDate) => {
      return {
        "id": "",
        "roomDate": roomDate,
        "roomNo": "",
        "checkTransId": "",
        "roomPrice": result.newPrice,
        "oldPrice": result.newPrice,
        "remark": "",
        "activityTypeName": "自定义房价",
        "activityName": "无",
        "otaChannel": result.otaChannel,
        "guestType": 3,
        "otaDirectConnect": 3,
        "orderFrom": 1
      }
    })
    await sleep(1500)
    // 关闭详情
    jQuery(`#night_detail .i_cross`).trigger('click')
    data.detail = result
    return data
  }

  const sync = (data) => {
    jQuery.ajax({
      type: 'POST',
      url: 'https://nas-stock.any168.net/api/hotel/sync',
      data,
      dataType: 'json',
      crossDomain: true,
      success: (res) => {
        console.log(res)
      }
    })
  }

  // xhr 拦截
  // 监控订单列表
  jQuery(document).ajaxSuccess(async (event, xhr, options) => {
    if (options.url === "/console/state/get" && isSyncOrder) {
      // console.log(event, xhr, options)
      const res = jQuery.parseJSON(xhr.responseText)
      if (res.state === 0) {
        // 成功后才去获取Cookie
        const date = new Date()
        const today = `${date.getFullYear()}-${formatNumber(date.getMonth() + 1)}-${formatNumber(date.getDate())}`

        const list = res.data.data.filter(item => item.checkIn === today)
          .map((item) => {
            if (item.state === "P") {
              // 预定
              item.orderType = "order"

              const byRoom = BY_ROOMS.find((byitem) => byitem.id === item.roomId)
              const xzRoom = XZ_ROOMS.find((item) => item.roomid === byRoom.roomid)
              item.resourceId = xzRoom.roomno
            } else if (item.state === "S") {
              // 入住
              item.orderType = "living"

              const byRoom = BY_ROOMS.find((byitem) => byitem.id === item.roomId)
              const xzRoom = XZ_ROOMS.find((item) => item.roomid === byRoom.roomid)
              item.resourceId = xzRoom.roomno
            }
            item.isLock = item.state === "L"
            return item
          })
        const orderList = list.filter(item => item.state !== 'L' && item.sortState !== 'N' && item.tag !== '冲突' && item.tag !== '取消')
        console.log(orderList)
        const cacheOrder = JSON.parse(localStorage.getItem('by_orderlist')) || {}
        const newOrder = {}
        for (let i = 0; i < orderList.length; i++) {
          const order = orderList[i]
          if (cacheOrder[order.id]) {
            newOrder[order.id] = cacheOrder[order.id]
          } else {
            newOrder[order.id] = await getDetail(order)
          }
        }
        localStorage.setItem('by_orderlist', JSON.stringify(newOrder))

        const statelist = Object.keys(newOrder).reduce((result, key) => {
          result.push(newOrder[key])
          return result
        }, [])
        // post 一次性不能传太多数据，分开传
        for (let i = 0; i < statelist.length; i += 5) {
          await sync({ statelist: statelist.slice(i, i + 5) })
        }
        isSyncOrder = false
        button.innerText = "同步订单"
      } else {
        console.log("失败")
        isSyncOrder = false
        button.innerText = "同步订单"
      }
    }
    console.log(options.url)
  })
})()
