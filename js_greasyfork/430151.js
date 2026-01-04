// ==UserScript==
// @name         志愿北京验证码获取
// @namespace    https://www.bv2008.cn
// @version      1.0.0
// @description  无需关注公众号，自动获取志愿北京验证码
// @author       OrdosX
// @match        https://www.bv2008.cn/app/user/login.php
// @icon         https://www.google.com/s2/favicons?domain=bv2008.cn
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/430151/%E5%BF%97%E6%84%BF%E5%8C%97%E4%BA%AC%E9%AA%8C%E8%AF%81%E7%A0%81%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/430151/%E5%BF%97%E6%84%BF%E5%8C%97%E4%BA%AC%E9%AA%8C%E8%AF%81%E7%A0%81%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function () {
  'use strict'

  // Your code here...
  window.addEventListener('load', function () {
    // 跨浏览器兼容requestAnimationFrame
    window.requestAnimationFrame || (window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (e) { window.setTimeout(e, 1e3 / 60) })

    let remainMin = 0
    let remainSec = 0
    let lastRefresh = 0
    const refreshUI = function (time) {
      if (time - lastRefresh > 1000) {
        lastRefresh = time
        if (remainMin === 0 && remainSec === 0) {
          document.querySelector('#yzm_li a').text = '自动获取中……'
          getCode()
          return
        }
        if (remainMin !== 0 && remainSec === 0) {
          remainMin--
          remainSec = 60
        }
        remainSec--
        document.querySelector('#yzm_li a').text = `${remainMin}分${remainSec}秒后再次自动获取`
      }
      requestAnimationFrame(refreshUI)
    }
    const getCode = function () {
      document.querySelector('#yzm_li a').onclick = null
      GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://www.bv2008.cn/app/api/view.php?m=get_login_yzm',
        headers: {
          'user-agent': 'MicroMessenger'
        },
        onload: function (res) {
          document.getElementById('uyzm').value = res.responseText.match(/>([0-9]{6})</)[1]
          remainMin = Number.parseInt(res.responseText.match(/剩余([0-9]{1})分[0-9]{1,2}秒有效/)[1])
          remainSec = Number.parseInt(res.responseText.match(/剩余[0-9]{1}分([0-9]{1,2})秒有效/)[1])
          requestAnimationFrame(refreshUI)
        }
      })
    }
    document.querySelector('#yzm_li a').onclick = getCode
    document.querySelector('#yzm_li a').innerText = '👍免关注获取验证码'
    document.querySelector('#yzm_li input').style = 'width:100px'
  })
})()