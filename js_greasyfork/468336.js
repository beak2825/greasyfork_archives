// ==UserScript==
// @name         Bilibili筛选增强
// @namespace    https://github.com/sylcool
// @version      0.5
// @description  Bilibili搜索页面筛选增强脚本，增加今年、本月、当日发布筛选，可配合B站原有的综合排序、最多点击、最多弹幕、最多收藏使用。
// @author       Super10
// @match        https://search.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468336/Bilibili%E7%AD%9B%E9%80%89%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/468336/Bilibili%E7%AD%9B%E9%80%89%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const currentDate = new Date()
  const month = currentDate.getMonth() + 1

  const reg_PreviousYear = new RegExp('[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}') // 往年格式
  const reg_ThisMonth = new RegExp(`^0?${month}-(0?[1-9]|[12][0-9]|3[01])$`) // 本月格式

  const types = {
    thisYear: '今年发布',
    thisMonth: '本月发布',
    today: '一天之内',
    none: '取消筛选'
  }
  // 0:今年发布,1:本月发布,2:一天之内,3:取消筛选
  let nowTypeIndex = 0

  const btnList = []

  function createToast(text, timeout = 2000) {
    const toast = document.createElement('div')

    toast.style.position = 'fixed'
    toast.style.top = '5%'
    toast.style.left = '50%'
    toast.style.transform = 'translate(-50%, -50%)'
    toast.style.padding = '10px'
    toast.style.background = 'rgba(0, 0, 0, 0.8)'
    toast.style.color = '#fff'
    toast.style.borderRadius = '5px'
    toast.style.zIndex = '9999'
    toast.textContent = text
    document.body.appendChild(toast)

    setTimeout(() => {
      document.body.removeChild(toast)
    }, timeout)
  }

  function mFilter(judgeFunc) {
    const videoList = document.getElementsByClassName('bili-video-card')

    for (const video of videoList) {
      const item = video.parentElement
      item.style.display = 'block'
      const udates = item.getElementsByClassName('bili-video-card__info--date')
      for (let i = 0; i < udates.length; i++) {
        const date = udates[i].textContent.replace('·', '').trim()
        if (judgeFunc(date)) {
          item.style.display = 'none'
          break
        }
      }
    }


    createToast(`Bil筛选成功：${Object.values(types)[nowTypeIndex]}`)
  }

  function createFilterButton(text, fType, callback) {
    const button = document.createElement('button')
    button.style.backgroundColor = 'black'
    button.style.color = 'white'
    button.textContent = text
    button.className = 'bil-filter-btn vui-button mr_sm vui_button--tab'
    button.onclick = function () {
      nowTypeIndex = fType
      btnList.forEach((btn) => {
        btn.style.color = 'white'
      })
      button.style.color = 'red'
      mFilter(callback)
    }
    return button
  }

  btnList.push(createFilterButton(types.thisYear, 0, (date) => reg_PreviousYear.test(date)))
  btnList.push(
    createFilterButton(
      types.thisMonth,
      1,
      (date) =>
        !(reg_ThisMonth.test(date) || date.indexOf('昨天') !== -1 || date.indexOf('小时前') !== -1)
    )
  )
  btnList.push(createFilterButton(types.today, 2, (date) => date.indexOf('小时前') === -1))
  btnList.push(createFilterButton(types.none, 3, (date) => false))

  const nav = document.getElementsByClassName('search-condition-row')[0]
  for (const [idx, btn] of btnList.entries()) {
    if (idx == 3) {
      btn.click()
    }
    nav.appendChild(btn)
  }

  window.addEventListener('click', function (e) {
    if (e.target.className.indexOf('bil-filter-btn') === -1 && ['BUTTON', 'SPAN'].includes(e.target.tagName)) {
      this.setTimeout(() => {
        const navs = document.getElementsByClassName('search-condition-row')
        if (navs.length > 0) {
          if (navs[0].getElementsByClassName('bil-filter-btn').length == 0) {
            for (const [idx, btn] of btnList.entries()) {
              if (idx == nowTypeIndex) {
                btn.click()
              }
              navs[0].appendChild(btn)
            }
          } else {
            btnList[nowTypeIndex].click()
          }
        }
      }, 1000)
    }
  })
})()
