// ==UserScript==
// @name         get-classroom
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       FKYnJYQ
// @match        http://hdsp.info.bit.edu.cn/activity/create/*
// @match        http://hdsp.info.bit.edu.cn/activity/save/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/372691/get-classroom.user.js
// @updateURL https://update.greasyfork.org/scripts/372691/get-classroom.meta.js
// ==/UserScript==

$(function () {
  'use strict'
  var a = $('body > div.navbar.navbar-inverse > div > div > a > small')
  a[0].innerText += ' 网协 增强版 '

  var bind = function (elementId, arg , elementSelector = null) {
    elementSelector = elementSelector || elementId
    console.log(elementSelector)

    $(elementSelector).keydown(function () {
      GM_setValue(elementId, this[arg])
      console.log(this[arg] + ' hi')
    }).blur(function () {
      GM_setValue(elementId, this[arg])
    }).unload(function () {
      GM_setValue(elementId, this[arg])
    })

    // console.log(GM_getValue(elementId))
    var node = $(elementSelector)[0]
    node[arg] = node[arg] || GM_getValue(elementId)
  }

  var elementList = Array('#name', '#sponsor', '#head',
    '#contactInfo', '#commercialSponsor', '#distributeItem', '#borrowedEquipment')
  elementList.forEach(element => {
    bind(element, 'value')
  })

  // 描述
  setTimeout(() => {
    window.dis_node = document.getElementsByClassName('cke_wysiwyg_frame cke_reset')[0].contentWindow.document.body
    bind('discription', 'innerHTML', dis_node)
  }, 1000)

  // category
  bind('#category', 'selectedIndex')

  // 开始日期
//   bind('body > div.main-container.container-fluid > div.main-content > div > div > div.content > div > div > form > fieldset > div:nth-child(8) > div > div.row-fluid.date > input', 'value')
//   bind('body > div.main-container.container-fluid > div.main-content > div > div > div.content > div > div > form > fieldset > div:nth-child(9) > div > div.row-fluid.date > div.input-append.bootstrap-timepicker > input', 'value')

})
