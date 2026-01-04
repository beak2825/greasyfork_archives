// ==UserScript==
// @name         tapd
// @namespace    http://tampermonkey.net/
// @version      0.4.2
// @description  TAPD BUG自动提醒
// @author       You
// @match        https://www.tapd.cn/tapd_fe/63930006/bug/list?queryToken=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1.228
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444174/tapd.user.js
// @updateURL https://update.greasyfork.org/scripts/444174/tapd.meta.js
// ==/UserScript==

;(async function () {
    let sleep = (time) =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, time)
      })
  
    let sendMsg = () => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://sctapi.ftqq.com/SCT91734THZBfRwhkRl5tdkxduyhRURxf.send?title=TAPD',
        onload: function (response) {
          //这里写处理函数
        }
      })
    }
    let changeColor = async (isMe) => {
      document.body.style.background = isMe ? 'red' : 'yellow'
      await sleep(3000)
      document.body.style.background = 'white'
      await sleep(3000)
      await changeColor(isMe)
    }
  
    let waitForSelector = async (selector) => {
      let res = document.querySelector(selector)
      if (!res) {
        await sleep(500)
        await waitForSelector(selector)
      }
    }
  
    let selector = 'td:nth-child(8)'
    await waitForSelector(selector)
    let arr = [...document.querySelectorAll(selector)].map((one) => one.innerText)
    console.log(arr)
    let hasMe = arr.some((one) => one.indexOf('雷') !== -1)
    let hasCheng = arr.some((one) => one.indexOf('成') !== -1)
    if (hasMe || hasCheng) {
      changeColor(hasMe)
      if (hasMe) {
        sendMsg()
      }
    }
    if (!hasMe) {
      await sleep(60000)
      location.reload()
    }
  })()
  