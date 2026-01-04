// ==UserScript==
// @name         风起
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  个人使用
// @author       You
// @match        https://www.temu.com/*
// @exclude      https://www.temu.com/login.htm*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509800/%E9%A3%8E%E8%B5%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/509800/%E9%A3%8E%E8%B5%B7.meta.js
// ==/UserScript==

(function () {
  'use strict'
  var sp = document.getElementsByClassName('_32WOqYbM')[0]
  // 判断是否商品页面
  if (sp) {
    setTimeout(() => {
      var element = document.getElementsByClassName('_2Tl9qLr1')
      // 点击回到主页
      console.log(element[0].click())
    }, 60000)
  } else {
    // 判断是否在主页
    if ($('._3lgWU00B')[0]) {
      console.log('是在主页')
      // 跳转热卖商品操作
      setTimeout(() => {
        $('.IGF4LXWi')[0].click()
      }, 5000)
    } else {
      console.log('不在主页')
      // 列表页面操作
      var list = document.getElementsByClassName('Ois68FAW')
      if (list.length == 0) {
        setTimeout(() => {
          var element = document.getElementsByClassName('_2Tl9qLr1')
          // 点击回到主页
          console.log(element[0].click())
        }, 3000)
      } else {
        // 随机数
        var num = Math.round(Math.random() * 100)
        var num1 = Math.round(Math.random() * 10)
        if (list.length > num) {
          setTimeout(() => {
            console.log(list[num].click(), 1)
            // 关闭页面
            setTimeout(() => {
              window.close()
            }, 2000)
          }, 5000)
        } else {
          setTimeout(() => {
            console.log(list[num1].click(), 2)
            // 关闭页面
            setTimeout(() => {
              window.close()
            }, 2000)
          }, 5000)
        }
      }
    }
  }
  // Your code here...
})()