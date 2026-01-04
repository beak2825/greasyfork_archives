// ==UserScript==
// @name         glados_checkin
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  owned by LGY_lab
// @author       mar
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-body
// @match      https://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452459/glados_checkin.user.js
// @updateURL https://update.greasyfork.org/scripts/452459/glados_checkin.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  var autoSign = true
function onSignIn(isAuto = false) {
  return GM_xmlhttpRequest({
    url: 'https://glados.rocks/api/user/checkin',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': navigator.userAgent,
    },
    data: '{"token": "glados.network"}',
    responseType: 'json',
    onload(response) {
      const data = response.response
      console.log('data', data)
      if (data.code !== 0) {
        if(data.code == 1) {
          GM_setValue('signDate', today())
          console.log('glados | try tomorrow')
        } else {
          console.log(data)
          throw new Error('new error!!!')
        }
      } else if(data.code == 0){
        GM_setValue('signDate', today())
        console.log('glados 签到成功')
      }
    }
  })
}


  //获取今天的日期
  function today() {
    var date = new Date()
    var seperator1 = '-'
    var seperator2 = ':'
    var month = date.getMonth() + 1
    var strDate = date.getDate()
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate
    }
    var currentdate =
      date.getFullYear() + seperator1 + month + seperator1 + strDate
    return currentdate
  }

  //自动签到
  function autoSignHandle() {
    let signDate = GM_getValue('signDate')
    console.log('signDate', signDate)
    console.log('today', today())
    if (autoSign && (!signDate || signDate < today())) {
      onSignIn(true)
    } else {
      console.log('glados checkin success, try tomorrow.')
    }
  }

  autoSignHandle()
})()