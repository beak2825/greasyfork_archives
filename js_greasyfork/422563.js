// ==UserScript==
// @name          华为抢购
// @namespace     http://tampermonkey.net/
// @version       1.8
// @description   抢华为手机
// @author        ZMeng
// @match         *://*.vmall.com/*
// @grant         none
// @icon          https://www.vmall.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/422563/%E5%8D%8E%E4%B8%BA%E6%8A%A2%E8%B4%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/422563/%E5%8D%8E%E4%B8%BA%E6%8A%A2%E8%B4%AD.meta.js
// ==/UserScript==

(function () {
  'use strict'

  const href = location.href,
    targetTimeStr = '2021-3-18 10:08:00'

  if (href.indexOf('product/') > -1) {
    // 抢购
    function getServerTime() {
      return new Promise((resolve, reject) => {
        $.ajax({
          url: 'https://sale.vmall.com/serverTime.json',
          type: 'GET',
          dataType: 'jsonp', //指定服务器返回的数据类型
          success: function (data) {
            let nowTime = Math.ceil(new Date().getTime() / 1000)
            console.log(`当前时间 ${nowTime}；华为服务器时间 ${data.serverTime}；时间差 ${nowTime - data.serverTime}`)
            resolve(nowTime - data.serverTime - 2)
          },
        })
      })
    }

    function start(timeDiff) {
      let nowTime = Math.ceil(new Date().getTime() / 1000) - timeDiff
      let targetTime = Math.ceil(new Date(targetTimeStr).getTime() / 1000)
      if (nowTime >= targetTime) {
        rush.business.clickBtn(1)
      } else {
        // console.log(`还没到点，约等 ${Math.floor((targetTime - nowTime) / 60)} 分 ${targetTime - (Math.floor((targetTime - nowTime) / 60) * 60)}秒`)
        console.log(`还没到点，约等 ${Math.floor((targetTime - nowTime) / 60)} 分 ${targetTime - nowTime - Math.floor((targetTime - nowTime) / 60) * 60} 秒`)
        setTimeout(() => {
          start(timeDiff)
        }, 50)
      }
    }

    getServerTime().then(start)
  } else if (href.indexOf('submit_order') > -1) {
    // 下单
    function ordering() {
      let $addr = $('ol#addressList li')
      if ($addr.length > 0) {
        ec.order.checkOrder.doSubmit()
        setTimeout(ordering, 1000)
      } else {
        console.log(`等待地址加载成功`)
        setTimeout(ordering, 50)
      }
    }
    ordering()
  }
})();
