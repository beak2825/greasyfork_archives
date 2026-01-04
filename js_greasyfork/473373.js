// ==UserScript==
// @name         BIT-本硕博一体化-课表
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  去除课表中的“本”、课程及教学班编号、星期等以简化信息
// @license      GPL-3.0-or-later
// @supportURL   https://github.com/YDX-2147483647/BIT-enhanced/issues
// @author       Y.D.X.
// @match        http://jxzxehallapp.bit.edu.cn/jwapp/sys/wdkbby/*
// @match        https://jxzxehallapp.bit.edu.cn/jwapp/sys/wdkbby/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473373/BIT-%E6%9C%AC%E7%A1%95%E5%8D%9A%E4%B8%80%E4%BD%93%E5%8C%96-%E8%AF%BE%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/473373/BIT-%E6%9C%AC%E7%A1%95%E5%8D%9A%E4%B8%80%E4%BD%93%E5%8C%96-%E8%AF%BE%E8%A1%A8.meta.js
// ==/UserScript==

(function () {
  'use strict'

  // interval's unit: ms.
  function wait_until_presence (selector, interval) {
    return new Promise((resolve, reject) => {
      const check = setInterval(function () {
        if (document.querySelector(selector)) {
          clearInterval(check)
          resolve(document.querySelector(selector))
        }
      }, interval)
    })
  }

  function shrink_titles () {
    // 这里选出来的是每节课中的“本”或“研”字
    // 根据 weekUnitTableInfo.js ，存在漏选的理论可能性
    document.querySelectorAll('.mtt_item_kcmc > span.mtt_item_bybz').forEach(icon => {
      // 课程名称
      const course_name = icon.parentNode
      course_name.textContent = icon.nextSibling.textContent.replace(
        /^\d{8,9}\s(.+)\[(\d{2}|\d{9})\]$/, '$1')

      // 课程详细信息
      const course_detail = course_name.parentNode.querySelector('.mtt_item_room')
      course_detail.textContent =
        course_detail.textContent
          .replace(/(良乡|中关村)校区,?/, '')
          .replace(/星期[\d一二三四五六日],/, '')
          .replace('节-第', '-')
      // 例：第8节-第10节 -> 第8-10节
    })
  }

  function wait_and_shrink_titles () {
    wait_until_presence('#kcb_container', 200).then(shrink_titles)
  }

  wait_until_presence('#kcb_container', 1000).then(function () {
    shrink_titles()

    // 周/学期课表切换栏
    const change_buttons_selectors = [
      'i.icon-keyboardarrowleft', 'i.icon-keyboardarrowright',
      "[data-action='周课表学年学期']", "[data-action='周课表周课表']"
    ]
    for (const s of change_buttons_selectors) {
      document.querySelector(s).addEventListener('click', wait_and_shrink_titles)
    }
  })

  wait_until_presence("#dqxnxq2 + a[data-action='更改2']", 1000).then(button => {
    // 更改学期时的对话框是每次现画的……所以每次更改都要加
    button.addEventListener('click', function () {
      document.querySelector('#buttons > button.bh-btn-primary').addEventListener(
        'click', wait_and_shrink_titles)
    })
  })
})()
