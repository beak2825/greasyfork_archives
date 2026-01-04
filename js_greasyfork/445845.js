// ==UserScript==
// @name         灵境抢购
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  灵境藏品、知音藏品 藏品和盲盒抢购
// @author       You
// @match        https://www.lingjing3.cn/*
// @match        https://www.zyszcp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lingjing3.cn
// @grant        none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/445845/%E7%81%B5%E5%A2%83%E6%8A%A2%E8%B4%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/445845/%E7%81%B5%E5%A2%83%E6%8A%A2%E8%B4%AD.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  const btn = document.createElement('button')
  btn.style.position = 'fixed'
  btn.style.right = 0
  btn.style.bottom = '100px'
  btn.style.width = '72px'
  btn.style.height = '36px'
  btn.innerText = '抢购'
  btn.addEventListener('click', rush)
  document.body.appendChild(btn)

  function rush() {
    // 下单的按钮是一个弹窗, 所以需要延时获取dom
    console.log('开始抢购!!😄')
    var button = document.getElementsByClassName('buy-btn')[0];
    // 免费领取
    if ((window.location.href.indexOf('albumDetail') !== -1) && (document.getElementsByClassName('price-num')[0].innerText == '0')) {
        button = document.getElementsByClassName('buy-button')[0];
    } else if (window.location.href.indexOf('mbox') !== -1) { // 盲盒
        var buyButtons = document.getElementsByClassName('btn-buy');
        button = buyButtons[buyButtons.length - 1];
    }
    console.log(button)
    const startTime = new Date().getTime()
    // 如果是盲盒抢购, 一般会有一个限购功能, 通过dom查看限购个数, 如果没有限购就默认为10
    // 如果是盲盒, 就可能有限购份数
    let subNum = document.getElementsByClassName('sub-num')[0]
    // 默认抢的最大份数
    let max = 10
    if (subNum) {
      max = ~~subNum.textContent.replace('份', '')
    }
    // 判断有没有数量(份数)输入框
    let numberInput = document.getElementsByClassName('at-input__input')[0]
    if (numberInput) {
      for (let i = 1; i < max; i++) {
        document.getElementsByClassName('btn-next')[0].click()
      }
    }
    let num = 1
    // 查看下单按钮是否存在
    let orderButton = setInterval(() => {
      if (button) {
        // 如果button存在, 就点击
        button.click()
        console.log('抢购了' + num + '次')
        num += 1
      }
      if (new Date().getTime() - startTime > 10 * 1000) {
        clearInterval(orderButton)
        console.log('抢购结束')
        return
      }
    })
  }
})()