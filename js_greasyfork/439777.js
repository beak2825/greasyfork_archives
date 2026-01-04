// ==UserScript==
// @name         联想知识库无需扫码关注也可继续浏览内容
// @namespace    https://greasyfork.org/zh-CN/users/306433
// @version      0.2
// @description  联想知识库无需扫码关注也可继续浏览内容, 测试于2022年2月
// @author       baster
// @supportURL   https://greasyfork.org/zh-CN/users/306433
// @homepageURL  https://greasyfork.org/zh-CN/users/306433
// @match        *://iknow.lenovo.com.cn/*
// @icon         https://www.lenovo.com.cn/favicon.ico
// @license      GNU
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439777/%E8%81%94%E6%83%B3%E7%9F%A5%E8%AF%86%E5%BA%93%E6%97%A0%E9%9C%80%E6%89%AB%E7%A0%81%E5%85%B3%E6%B3%A8%E4%B9%9F%E5%8F%AF%E7%BB%A7%E7%BB%AD%E6%B5%8F%E8%A7%88%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/439777/%E8%81%94%E6%83%B3%E7%9F%A5%E8%AF%86%E5%BA%93%E6%97%A0%E9%9C%80%E6%89%AB%E7%A0%81%E5%85%B3%E6%B3%A8%E4%B9%9F%E5%8F%AF%E7%BB%A7%E7%BB%AD%E6%B5%8F%E8%A7%88%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  localStorage.setItem('scanQRCode', '1')
  $('.coverQRCode').hide()
  $(document).off('scroll.unable')
})()
